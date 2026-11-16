export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}

export type FoodType = 'NORMAL' | 'GOLDEN' | 'SPEED_BOOST' | 'SLOW_DOWN' | 'SHRINK';

export interface FoodItem {
  id: string;
  type: FoodType;
  x: number;
  y: number;
  points: number;
  expiresAt?: number; // timestamp for golden apple or temporary foods
  durationTotal?: number; // total duration in ms
}

export interface Obstacle {
  x: number;
  y: number;
}

export type ActiveBuffType = 'SPEED_BOOST' | 'SLOW_DOWN';

export interface ActiveBuff {
  type: ActiveBuffType;
  expiresAt: number;
  durationMs: number;
}

export type GameStatus = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type DeathReason = 'WALL_COLLISION' | 'SELF_COLLISION' | 'OBSTACLE_COLLISION' | 'UNKNOWN';

export interface HighScore {
  id: string;
  score: number;
  level: number;
  stageName: string;
  foodsEaten: number;
  date: string;
}

export type GridSizeOption = 'SMALL' | 'MEDIUM' | 'LARGE';

export type ControlType = 'SWIPE_AND_DPAD' | 'SWIPE_ONLY' | 'DPAD_ONLY';

export type ThemeMode = 'DARK' | 'LIGHT';

export interface GameSettings {
  theme: ThemeMode;
  controlType: ControlType;
  gridSize: GridSizeOption;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface EvolutionStage {
  levelThreshold: number;
  name: string;
  title: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  eyeColor: string;
  pattern: 'smooth' | 'cyber' | 'dragon' | 'cosmic';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
}
