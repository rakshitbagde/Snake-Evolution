/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ActiveBuff,
  DeathReason,
  Direction,
  FoodItem,
  FoodType,
  GameSettings,
  GameStatus,
  HighScore,
  Obstacle,
  Particle,
  Point,
} from './types/game';
import {
  calculateBaseInterval,
  getEvolutionStage,
  getObstacleCountForLevel,
  GRID_CONFIG,
  isPortalActiveForLevel,
} from './constants/evolution';
import { soundManager } from './utils/audio';
import {
  getHighScores,
  getSavedSettings,
  saveHighScore,
  saveSettings,
} from './utils/storage';
import { HUD } from './components/HUD';
import { GameBoard } from './components/GameBoard';
import { DPad } from './components/DPad';
import { HomeModal } from './components/HomeModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { SettingsModal } from './components/SettingsModal';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { EvolutionInfoModal } from './components/EvolutionInfoModal';

function isOppositeDirection(d1: Direction, d2: Direction): boolean {
  return (
    (d1 === 'UP' && d2 === 'DOWN') ||
    (d1 === 'DOWN' && d2 === 'UP') ||
    (d1 === 'LEFT' && d2 === 'RIGHT') ||
    (d1 === 'RIGHT' && d2 === 'LEFT')
  );
}

export default function App() {
  // Settings & Theme
  const [settings, setSettings] = useState<GameSettings>(() => getSavedSettings());
  const [highScores, setHighScores] = useState<HighScore[]>(() => getHighScores());

  // Game Lifecycle
  const [status, setStatus] = useState<GameStatus>('MENU');
  const [activeModal, setActiveModal] = useState<'NONE' | 'LEADERBOARD' | 'SETTINGS' | 'GUIDE'>('NONE');

  // Game state
  const [snake, setSnake] = useState<Point[]>([
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 },
  ]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState<number>(0);
  const [foodsEatenTotal, setFoodsEatenTotal] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [activeBuff, setActiveBuff] = useState<ActiveBuff | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [levelUpNotice, setLevelUpNotice] = useState<string | null>(null);

  // End run results
  const [deathReason, setDeathReason] = useState<DeathReason>('UNKNOWN');
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [isTopScore, setIsTopScore] = useState<boolean>(false);

  // Refs for the high-frequency game loop
  const snakeRef = useRef<Point[]>(snake);
  snakeRef.current = snake;
  const directionRef = useRef<Direction>(direction);
  directionRef.current = direction;
  const inputQueueRef = useRef<Direction[]>([]);
  const foodItemsRef = useRef<FoodItem[]>(foodItems);
  foodItemsRef.current = foodItems;
  const obstaclesRef = useRef<Obstacle[]>(obstacles);
  obstaclesRef.current = obstacles;
  const scoreRef = useRef<number>(score);
  scoreRef.current = score;
  const foodsEatenTotalRef = useRef<number>(foodsEatenTotal);
  foodsEatenTotalRef.current = foodsEatenTotal;
  const levelRef = useRef<number>(level);
  levelRef.current = level;
  const activeBuffRef = useRef<ActiveBuff | null>(activeBuff);
  activeBuffRef.current = activeBuff;
  const particlesRef = useRef<Particle[]>(particles);
  particlesRef.current = particles;
  const statusRef = useRef<GameStatus>(status);
  statusRef.current = status;
  const settingsRef = useRef<GameSettings>(settings);
  settingsRef.current = settings;

  // Grid dimensions
  const gridConfig = GRID_CONFIG[settings.gridSize];
  const stage = getEvolutionStage(level);
  const isPortalActive = isPortalActiveForLevel(level);

  // Sync sound & vibration with soundManager
  useEffect(() => {
    soundManager.setSoundEnabled(settings.soundEnabled);
    soundManager.setHapticsEnabled(settings.vibrationEnabled);
  }, [settings.soundEnabled, settings.vibrationEnabled]);

  // Sync dark class on document element
  useEffect(() => {
    if (settings.theme === 'DARK') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Helper to spawn unique empty position on grid
  const getRandomFreeCell = useCallback(
    (
      occupiedSnake: Point[],
      occupiedObstacles: Obstacle[],
      occupiedFoods: FoodItem[]
    ): Point => {
      const { cols, rows } = GRID_CONFIG[settingsRef.current.gridSize];
      const occupiedMap = new Set<string>();

      occupiedSnake.forEach((p) => occupiedMap.add(`${p.x},${p.y}`));
      occupiedObstacles.forEach((o) => occupiedMap.add(`${o.x},${o.y}`));
      occupiedFoods.forEach((f) => occupiedMap.add(`${f.x},${f.y}`));

      // Try random sampling first
      for (let attempts = 0; attempts < 100; attempts++) {
        const rx = Math.floor(Math.random() * cols);
        const ry = Math.floor(Math.random() * rows);
        if (!occupiedMap.has(`${rx},${ry}`)) {
          return { x: rx, y: ry };
        }
      }

      // Fallback: systematic scan
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          if (!occupiedMap.has(`${x},${y}`)) {
            return { x, y };
          }
        }
      }
      return { x: 0, y: 0 };
    },
    []
  );

  // Generate obstacles for a given level
  const generateObstacles = useCallback(
    (currentLevel: number, currentSnake: Point[], currentFoods: FoodItem[]): Obstacle[] => {
      const count = getObstacleCountForLevel(currentLevel, settingsRef.current.gridSize);
      if (count <= 0) return [];

      const { cols, rows } = GRID_CONFIG[settingsRef.current.gridSize];
      const head = currentSnake[0] || { x: 5, y: 10 };
      const safeDistance = 3;

      const newObstacles: Obstacle[] = [];
      const occupied = new Set<string>();

      currentSnake.forEach((p) => occupied.add(`${p.x},${p.y}`));
      currentFoods.forEach((f) => occupied.add(`${f.x},${f.y}`));

      let tries = 0;
      while (newObstacles.length < count && tries < 300) {
        tries++;
        const ox = Math.floor(Math.random() * cols);
        const oy = Math.floor(Math.random() * rows);
        const key = `${ox},${oy}`;

        // Don't place on occupied or close to snake head
        const distToHead = Math.abs(ox - head.x) + Math.abs(oy - head.y);
        if (!occupied.has(key) && distToHead >= safeDistance) {
          occupied.add(key);
          newObstacles.push({ x: ox, y: oy });
        }
      }
      return newObstacles;
    },
    []
  );

  // Spawn particle explosion
  const createParticles = useCallback((x: number, y: number, color: string, count: number = 14) => {
    const { cols, rows } = GRID_CONFIG[settingsRef.current.gridSize];
    // Cell size estimation for canvas coordinates
    const newParticles: Particle[] = [];
    // We store normalized grid coordinates or will project them in canvas
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      newParticles.push({
        x: (x + 0.5) * (400 / cols),
        y: (y + 0.5) * (400 / rows),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 2.5 + Math.random() * 2.5,
        alpha: 1,
        maxLife: 25 + Math.random() * 15,
        life: 0,
      });
    }

    setParticles((prev) => [...prev.slice(-30), ...newParticles]);
  }, []);

  // Initialize or Restart Game
  const startNewGame = useCallback(() => {
    const { cols, rows } = GRID_CONFIG[settingsRef.current.gridSize];
    const startX = Math.floor(cols / 3);
    const startY = Math.floor(rows / 2);

    const initialSnake: Point[] = [
      { x: startX + 2, y: startY },
      { x: startX + 1, y: startY },
      { x: startX, y: startY },
    ];

    const initialFoodPos = getRandomFreeCell(initialSnake, [], []);
    const initialFoods: FoodItem[] = [
      {
        id: 'food-initial',
        type: 'NORMAL',
        x: initialFoodPos.x,
        y: initialFoodPos.y,
        points: 10,
      },
    ];

    setSnake(initialSnake);
    setDirection('RIGHT');
    inputQueueRef.current = [];
    setFoodItems(initialFoods);
    setObstacles([]);
    setScore(0);
    setFoodsEatenTotal(0);
    setLevel(1);
    setActiveBuff(null);
    setParticles([]);
    setLevelUpNotice(null);
    setStatus('PLAYING');
    setActiveModal('NONE');
  }, [getRandomFreeCell]);

  // Direction input handler with 180-degree protection & queueing
  const handleDirectionInput = useCallback((newDir: Direction) => {
    if (statusRef.current !== 'PLAYING') return;

    const queue = inputQueueRef.current;
    const referenceDir = queue.length > 0 ? queue[queue.length - 1] : directionRef.current;

    if (isOppositeDirection(newDir, referenceDir) || newDir === referenceDir) {
      return;
    }

    if (queue.length < 2) {
      queue.push(newDir);
    }
  }, []);

  // End game logic
  const handleGameOver = useCallback(
    (reason: DeathReason) => {
      setStatus('GAME_OVER');
      statusRef.current = 'GAME_OVER';
      setDeathReason(reason);

      soundManager.playGameOver();

      const finalScore = scoreRef.current;
      const finalLevel = levelRef.current;
      const finalFoods = foodsEatenTotalRef.current;
      const currentStage = getEvolutionStage(finalLevel);

      const result = saveHighScore(finalScore, finalLevel, currentStage.name, finalFoods);
      setHighScores(result.scores);
      setIsNewHighScore(result.isNewHighScore);
      setIsTopScore(result.isTopScore);
    },
    []
  );

  // Core Game Loop Tick
  const gameTick = useCallback(() => {
    if (statusRef.current !== 'PLAYING') return;

    const currentSnake = snakeRef.current;
    const currentDirection = directionRef.current;
    const currentLevel = levelRef.current;
    const currentObstacles = obstaclesRef.current;
    const currentFoods = foodItemsRef.current;
    const currentScore = scoreRef.current;
    const currentFoodsEaten = foodsEatenTotalRef.current;
    const currentBuff = activeBuffRef.current;
    const currentGrid = GRID_CONFIG[settingsRef.current.gridSize];

    // Determine movement direction from queue
    let nextDir = currentDirection;
    if (inputQueueRef.current.length > 0) {
      nextDir = inputQueueRef.current.shift()!;
      setDirection(nextDir);
      directionRef.current = nextDir;
    }

    const head = currentSnake[0];
    let nextHead: Point = { ...head };

    switch (nextDir) {
      case 'UP':
        nextHead.y -= 1;
        break;
      case 'DOWN':
        nextHead.y += 1;
        break;
      case 'LEFT':
        nextHead.x -= 1;
        break;
      case 'RIGHT':
        nextHead.x += 1;
        break;
    }

    // Portal wrap logic vs Wall collision
    const portalActive = isPortalActiveForLevel(currentLevel);
    let wrappedPortal = false;

    if (
      nextHead.x < 0 ||
      nextHead.x >= currentGrid.cols ||
      nextHead.y < 0 ||
      nextHead.y >= currentGrid.rows
    ) {
      if (portalActive) {
        // Wrap around!
        wrappedPortal = true;
        if (nextHead.x < 0) nextHead.x = currentGrid.cols - 1;
        else if (nextHead.x >= currentGrid.cols) nextHead.x = 0;
        if (nextHead.y < 0) nextHead.y = currentGrid.rows - 1;
        else if (nextHead.y >= currentGrid.rows) nextHead.y = 0;

        soundManager.playPortalWrap();
        createParticles(nextHead.x, nextHead.y, '#c084fc', 8);
      } else {
        // Wall collision death
        handleGameOver('WALL_COLLISION');
        return;
      }
    }

    // Self collision check (ignoring the very tip of the tail since it moves away unless growing)
    for (let i = 0; i < currentSnake.length - 1; i++) {
      if (currentSnake[i].x === nextHead.x && currentSnake[i].y === nextHead.y) {
        handleGameOver('SELF_COLLISION');
        return;
      }
    }

    // Obstacle collision check
    for (let i = 0; i < currentObstacles.length; i++) {
      if (currentObstacles[i].x === nextHead.x && currentObstacles[i].y === nextHead.y) {
        handleGameOver('OBSTACLE_COLLISION');
        return;
      }
    }

    // Check if eating any food
    const eatenFoodIndex = currentFoods.findIndex(
      (f) => f.x === nextHead.x && f.y === nextHead.y
    );

    let newSnake: Point[];
    let newScore = currentScore;
    let newFoodsEaten = currentFoodsEaten;
    let newLevel = currentLevel;
    let newFoodsList = [...currentFoods];
    let newBuff = currentBuff;

    if (eatenFoodIndex !== -1) {
      const eatenFood = currentFoods[eatenFoodIndex];
      newFoodsList.splice(eatenFoodIndex, 1);

      // Score bonus multiplier if speed boosted
      const scoreMultiplier = currentBuff?.type === 'SPEED_BOOST' ? 1.5 : 1;
      const pointsEarned = Math.round(eatenFood.points * scoreMultiplier);
      newScore += pointsEarned;

      createParticles(
        eatenFood.x,
        eatenFood.y,
        eatenFood.type === 'NORMAL'
          ? '#ef4444'
          : eatenFood.type === 'GOLDEN'
          ? '#eab308'
          : eatenFood.type === 'SPEED_BOOST'
          ? '#06b6d4'
          : eatenFood.type === 'SLOW_DOWN'
          ? '#3b82f6'
          : '#d946ef',
        16
      );

      // Handle specific food types
      switch (eatenFood.type) {
        case 'NORMAL': {
          soundManager.playEatNormal();
          newFoodsEaten += 1;
          // Grow snake: keep tail
          newSnake = [nextHead, ...currentSnake];

          // Check level up (every 5 normal foods)
          const calculatedLevel = Math.floor(newFoodsEaten / 5) + 1;
          if (calculatedLevel > currentLevel) {
            newLevel = calculatedLevel;
            setLevel(newLevel);
            levelRef.current = newLevel;

            const nextStage = getEvolutionStage(newLevel);
            setLevelUpNotice(`${nextStage.title.toUpperCase()}!`);
            soundManager.playLevelUp();

            // Refresh obstacles for new level
            const updatedObstacles = generateObstacles(newLevel, newSnake, newFoodsList);
            setObstacles(updatedObstacles);
            obstaclesRef.current = updatedObstacles;
          }

          // Spawn new normal food
          const nextNormalPos = getRandomFreeCell(newSnake, currentObstacles, newFoodsList);
          newFoodsList.push({
            id: 'food-' + Date.now(),
            type: 'NORMAL',
            x: nextNormalPos.x,
            y: nextNormalPos.y,
            points: 10,
          });

          // Chance to spawn Golden Apple (25% if none exists)
          const hasGolden = newFoodsList.some((f) => f.type === 'GOLDEN');
          if (!hasGolden && Math.random() < 0.28) {
            const goldenPos = getRandomFreeCell(newSnake, currentObstacles, newFoodsList);
            newFoodsList.push({
              id: 'gold-' + Date.now(),
              type: 'GOLDEN',
              x: goldenPos.x,
              y: goldenPos.y,
              points: 50,
              expiresAt: Date.now() + 5000,
              durationTotal: 5000,
            });
          }

          // Chance to spawn special power-up fruit (Level 2+, 22% chance if none exists)
          const hasPowerUp = newFoodsList.some(
            (f) =>
              f.type === 'SPEED_BOOST' || f.type === 'SLOW_DOWN' || f.type === 'SHRINK'
          );
          if (newLevel >= 2 && !hasPowerUp && Math.random() < 0.24) {
            const powerUpPos = getRandomFreeCell(newSnake, currentObstacles, newFoodsList);
            const roll = Math.random();
            const powerType: FoodType =
              roll < 0.35 ? 'SPEED_BOOST' : roll < 0.7 ? 'SLOW_DOWN' : 'SHRINK';
            newFoodsList.push({
              id: 'power-' + Date.now(),
              type: powerType,
              x: powerUpPos.x,
              y: powerUpPos.y,
              points: powerType === 'SHRINK' ? 30 : 20,
            });
          }
          break;
        }

        case 'GOLDEN': {
          soundManager.playEatGolden();
          // Grow snake as well
          newSnake = [nextHead, ...currentSnake];
          break;
        }

        case 'SPEED_BOOST': {
          soundManager.playEatPowerUp();
          newBuff = {
            type: 'SPEED_BOOST',
            expiresAt: Date.now() + 6000,
            durationMs: 6000,
          };
          // Grow snake normally
          newSnake = [nextHead, ...currentSnake];
          break;
        }

        case 'SLOW_DOWN': {
          soundManager.playEatPowerUp();
          newBuff = {
            type: 'SLOW_DOWN',
            expiresAt: Date.now() + 6000,
            durationMs: 6000,
          };
          // Grow snake normally
          newSnake = [nextHead, ...currentSnake];
          break;
        }

        case 'SHRINK': {
          soundManager.playEatPowerUp();
          // Instantly shrink snake by 3 segments (min 3 segments)
          const targetLength = Math.max(3, currentSnake.length - 2);
          newSnake = [nextHead, ...currentSnake.slice(0, targetLength - 1)];
          break;
        }

        default:
          newSnake = [nextHead, ...currentSnake.slice(0, -1)];
      }

      setScore(newScore);
      scoreRef.current = newScore;
      setFoodsEatenTotal(newFoodsEaten);
      foodsEatenTotalRef.current = newFoodsEaten;
      setActiveBuff(newBuff);
      activeBuffRef.current = newBuff;
    } else {
      // Normal move: advance head, drop tail
      newSnake = [nextHead, ...currentSnake.slice(0, -1)];
    }

    setSnake(newSnake);
    snakeRef.current = newSnake;
    setFoodItems(newFoodsList);
    foodItemsRef.current = newFoodsList;
  }, [
    createParticles,
    generateObstacles,
    getRandomFreeCell,
    handleGameOver,
  ]);

  // Main high-resolution fixed timestep Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let accumulator = 0;

    const loop = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      if (statusRef.current === 'PLAYING') {
        // Calculate dynamic interval based on current level and active buff
        const baseInterval = calculateBaseInterval(levelRef.current);
        let interval = baseInterval;
        if (activeBuffRef.current?.type === 'SPEED_BOOST') {
          interval = Math.round(baseInterval * 0.65); // 35% faster
        } else if (activeBuffRef.current?.type === 'SLOW_DOWN') {
          interval = Math.round(baseInterval * 1.45); // 45% slower
        }

        accumulator += delta;
        // Limit max catchup to prevent spiral of death
        if (accumulator > interval * 4) {
          accumulator = interval;
        }

        while (accumulator >= interval) {
          gameTick();
          accumulator -= interval;
        }

        // Check expiration of temporary foods (Golden Apple)
        const now = Date.now();
        const existingFoods = foodItemsRef.current;
        const validFoods = existingFoods.filter((f) => {
          if (f.type === 'GOLDEN' && f.expiresAt && now > f.expiresAt) {
            createParticles(f.x, f.y, '#eab308', 6);
            return false;
          }
          return true;
        });
        if (validFoods.length !== existingFoods.length) {
          setFoodItems(validFoods);
          foodItemsRef.current = validFoods;
        }

        // Check active buff expiration
        if (activeBuffRef.current && now > activeBuffRef.current.expiresAt) {
          setActiveBuff(null);
          activeBuffRef.current = null;
        }

        // Update particle physics
        setParticles((prev) => {
          if (prev.length === 0) return prev;
          return prev
            .map((p) => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              alpha: 1 - p.life / p.maxLife,
              life: p.life + 1,
            }))
            .filter((p) => p.life < p.maxLife);
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameTick, createParticles]);

  // Clear level-up canvas notification after 1.8s
  useEffect(() => {
    if (!levelUpNotice) return;
    const t = setTimeout(() => {
      setLevelUpNotice(null);
    }, 1800);
    return () => clearTimeout(t);
  }, [levelUpNotice]);

  // Global Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Pause / Resume toggle
      if (e.code === 'Space' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (statusRef.current === 'PLAYING') {
          soundManager.playClick();
          setStatus('PAUSED');
        } else if (statusRef.current === 'PAUSED') {
          soundManager.playClick();
          setStatus('PLAYING');
        }
        return;
      }

      // Direction keys
      let newDir: Direction | null = null;
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          newDir = 'UP';
          break;
        case 'ArrowDown':
        case 'KeyS':
          newDir = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'KeyA':
          newDir = 'LEFT';
          break;
        case 'ArrowRight':
        case 'KeyD':
          newDir = 'RIGHT';
          break;
      }

      if (newDir) {
        e.preventDefault();
        handleDirectionInput(newDir);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirectionInput]);

  // Pause / Resume handler
  const togglePause = useCallback(() => {
    soundManager.playClick();
    if (status === 'PLAYING') {
      setStatus('PAUSED');
    } else if (status === 'PAUSED') {
      setStatus('PLAYING');
    }
  }, [status]);

  // Audio mute handler
  const toggleSound = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, soundEnabled: !prev.soundEnabled };
      saveSettings(next);
      return next;
    });
  }, []);

  // Update settings handler
  const handleUpdateSettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  // Current tiles per second metric for HUD
  const baseInterval = calculateBaseInterval(level);
  let effectiveInterval = baseInterval;
  if (activeBuff?.type === 'SPEED_BOOST') {
    effectiveInterval = Math.round(baseInterval * 0.65);
  } else if (activeBuff?.type === 'SLOW_DOWN') {
    effectiveInterval = Math.round(baseInterval * 1.45);
  }
  const speedTilesPerSec = 1000 / effectiveInterval;

  // Best all-time score
  const allTimeBest = highScores.length > 0 ? highScores[0].score : 0;

  // Control visibility flags
  const showDPad =
    settings.controlType === 'SWIPE_AND_DPAD' || settings.controlType === 'DPAD_ONLY';
  const allowSwipe =
    settings.controlType === 'SWIPE_AND_DPAD' || settings.controlType === 'SWIPE_ONLY';

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between overflow-hidden select-none transition-colors duration-300">
      {/* Top HUD Bar */}
      <HUD
        score={score}
        highScore={allTimeBest}
        level={level}
        stage={stage}
        foodsEatenLevel={foodsEatenTotal % 5}
        speedTilesPerSec={speedTilesPerSec}
        activeBuff={activeBuff}
        isPaused={status === 'PAUSED'}
        soundEnabled={settings.soundEnabled}
        onTogglePause={togglePause}
        onToggleSound={toggleSound}
      />

      {/* Main Responsive Canvas Area */}
      <main className="flex-1 w-full flex items-center justify-center p-2 min-h-0">
        <GameBoard
          snake={snake}
          direction={direction}
          foodItems={foodItems}
          obstacles={obstacles}
          level={level}
          stage={stage}
          isPortalActive={isPortalActive}
          gridSize={settings.gridSize}
          theme={settings.theme}
          particles={particles}
          levelUpNotice={levelUpNotice}
          onDirectionChange={handleDirectionInput}
          allowSwipe={allowSwipe}
        />
      </main>

      {/* Optional Mobile On-Screen D-Pad (only when enabled in settings) */}
      {showDPad && (
        <footer className="w-full pb-3 pt-1 flex items-center justify-center shrink-0">
          <DPad onDirection={handleDirectionInput} accentColor={stage.primaryColor} />
        </footer>
      )}

      {/* Title / Home Menu Modal */}
      {status === 'MENU' && (
        <HomeModal
          highScore={allTimeBest}
          onStartGame={startNewGame}
          onOpenLeaderboard={() => setActiveModal('LEADERBOARD')}
          onOpenSettings={() => setActiveModal('SETTINGS')}
          onOpenGuide={() => setActiveModal('GUIDE')}
        />
      )}

      {/* Pause Modal */}
      {status === 'PAUSED' && (
        <PauseModal
          score={score}
          level={level}
          stage={stage}
          foodsEatenTotal={foodsEatenTotal}
          onResume={() => setStatus('PLAYING')}
          onRestart={startNewGame}
          onHome={() => setStatus('MENU')}
          onOpenSettings={() => setActiveModal('SETTINGS')}
        />
      )}

      {/* Game Over Modal */}
      {status === 'GAME_OVER' && (
        <GameOverModal
          score={score}
          highScore={allTimeBest}
          level={level}
          stage={stage}
          foodsEatenTotal={foodsEatenTotal}
          deathReason={deathReason}
          isNewHighScore={isNewHighScore}
          isTopScore={isTopScore}
          onPlayAgain={startNewGame}
          onHome={() => setStatus('MENU')}
          onOpenLeaderboard={() => setActiveModal('LEADERBOARD')}
        />
      )}

      {/* Leaderboard Modal */}
      {activeModal === 'LEADERBOARD' && (
        <LeaderboardModal
          scores={highScores}
          onClose={() => setActiveModal('NONE')}
          onScoresUpdated={(updated) => setHighScores(updated)}
        />
      )}

      {/* Settings Modal */}
      {activeModal === 'SETTINGS' && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setActiveModal('NONE')}
        />
      )}

      {/* Evolution Info & Field Guide Modal */}
      {activeModal === 'GUIDE' && (
        <EvolutionInfoModal onClose={() => setActiveModal('NONE')} />
      )}
    </div>
  );
}
