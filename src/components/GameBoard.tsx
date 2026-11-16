import React, { useRef, useEffect, useCallback } from 'react';
import { Direction, EvolutionStage, FoodItem, GridSizeOption, Obstacle, Particle, Point, ThemeMode } from '../types/game';
import { GRID_CONFIG } from '../constants/evolution';

interface GameBoardProps {
  snake: Point[];
  direction: Direction;
  foodItems: FoodItem[];
  obstacles: Obstacle[];
  level: number;
  stage: EvolutionStage;
  isPortalActive: boolean;
  gridSize: GridSizeOption;
  theme: ThemeMode;
  particles: Particle[];
  levelUpNotice: string | null;
  onDirectionChange: (dir: Direction) => void;
  allowSwipe: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  snake,
  direction,
  foodItems,
  obstacles,
  level,
  stage,
  isPortalActive,
  gridSize,
  theme,
  particles,
  levelUpNotice,
  onDirectionChange,
  allowSwipe,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Touch gesture tracking
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const { cols, rows } = GRID_CONFIG[gridSize];

  // Prevent scrolling when touching canvas
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!allowSwipe) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent mobile page pull/scroll while swiping on the game board
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!allowSwipe || !touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const minSwipeDistance = 24;
    if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) {
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        onDirectionChange('RIGHT');
      } else {
        onDirectionChange('LEFT');
      }
    } else {
      if (dy > 0) {
        onDirectionChange('DOWN');
      } else {
        onDirectionChange('UP');
      }
    }
  };

  // Render loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cellW = width / cols;
    const cellH = height / rows;
    const now = Date.now();

    // Clear background
    const isDark = theme === 'DARK';
    ctx.fillStyle = isDark ? '#0b0f19' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Subtle grid pattern
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(0, 0, 0, 0.04)';
    ctx.lineWidth = 1;
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cellW, 0);
      ctx.lineTo(c * cellW, height);
      ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cellH);
      ctx.lineTo(width, r * cellH);
      ctx.stroke();
    }

    // Portal border effects if level >= 5
    if (isPortalActive) {
      const pulse = (Math.sin(now / 200) + 1) / 2; // 0 to 1
      const portalAlpha = 0.4 + pulse * 0.4;
      ctx.save();
      ctx.lineWidth = 4;
      ctx.strokeStyle = isDark
        ? `rgba(168, 85, 247, ${portalAlpha})`
        : `rgba(147, 51, 234, ${portalAlpha})`;
      ctx.strokeRect(2, 2, width - 4, height - 4);

      // Glowing corner portal accents
      const cornerLen = Math.min(cellW * 1.5, 30);
      ctx.lineWidth = 6;
      ctx.strokeStyle = `rgba(236, 72, 153, ${0.7 + pulse * 0.3})`;
      // Top-left
      ctx.beginPath();
      ctx.moveTo(2, cornerLen);
      ctx.lineTo(2, 2);
      ctx.lineTo(cornerLen, 2);
      ctx.stroke();
      // Top-right
      ctx.beginPath();
      ctx.moveTo(width - 2 - cornerLen, 2);
      ctx.lineTo(width - 2, 2);
      ctx.lineTo(width - 2, cornerLen);
      ctx.stroke();
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(2, height - 2 - cornerLen);
      ctx.lineTo(2, height - 2);
      ctx.lineTo(cornerLen, height - 2);
      ctx.stroke();
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(width - 2 - cornerLen, height - 2);
      ctx.lineTo(width - 2, height - 2);
      ctx.lineTo(width - 2, height - 2 - cornerLen);
      ctx.stroke();

      ctx.restore();
    } else {
      // Standard arena border
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, width - 2, height - 2);
    }

    // Draw Obstacles (Rocks)
    obstacles.forEach((obs) => {
      const ox = obs.x * cellW;
      const oy = obs.y * cellH;
      const pad = 2;
      const rw = cellW - pad * 2;
      const rh = cellH - pad * 2;

      ctx.save();
      // Shadow
      ctx.shadowColor = isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;

      // Rock body with faceted angles
      ctx.fillStyle = isDark ? '#334155' : '#64748b';
      ctx.beginPath();
      ctx.moveTo(ox + pad + rw * 0.2, oy + pad);
      ctx.lineTo(ox + pad + rw * 0.8, oy + pad);
      ctx.lineTo(ox + pad + rw, oy + pad + rh * 0.4);
      ctx.lineTo(ox + pad + rw * 0.85, oy + pad + rh);
      ctx.lineTo(ox + pad + rw * 0.15, oy + pad + rh);
      ctx.lineTo(ox + pad, oy + pad + rh * 0.5);
      ctx.closePath();
      ctx.fill();

      // Rock facet highlights
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = isDark ? '#475569' : '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(ox + pad + rw * 0.2, oy + pad);
      ctx.lineTo(ox + pad + rw * 0.5, oy + pad + rh * 0.4);
      ctx.lineTo(ox + pad + rw * 0.15, oy + pad + rh * 0.8);
      ctx.lineTo(ox + pad, oy + pad + rh * 0.5);
      ctx.closePath();
      ctx.fill();

      // Rock crack / crest
      ctx.strokeStyle = isDark ? '#1e293b' : '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ox + pad + rw * 0.5, oy + pad + rh * 0.4);
      ctx.lineTo(ox + pad + rw * 0.8, oy + pad + rh * 0.6);
      ctx.stroke();

      ctx.restore();
    });

    // Draw Food Items
    foodItems.forEach((food) => {
      const fx = food.x * cellW + cellW / 2;
      const fy = food.y * cellH + cellH / 2;
      const baseRadius = Math.min(cellW, cellH) * 0.38;

      ctx.save();
      const pulse = Math.sin(now / 150) * 1.5;
      const radius = Math.max(4, baseRadius + pulse);

      switch (food.type) {
        case 'NORMAL': {
          // Classic Glowing Energy Apple
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = isDark ? 14 : 8;
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(fx, fy, radius, 0, Math.PI * 2);
          ctx.fill();

          // Gloss specular
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(fx - radius * 0.3, fy - radius * 0.3, radius * 0.28, 0, Math.PI * 2);
          ctx.fill();

          // Little leaf
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.ellipse(fx + 2, fy - radius - 1, 3, 2, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'GOLDEN': {
          // Golden Apple with countdown timer ring
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = isDark ? 20 : 12;

          // Outer pulsing ring
          const ringRadius = radius + 4;
          if (food.expiresAt && food.durationTotal) {
            const timeLeft = Math.max(0, food.expiresAt - now);
            const progress = timeLeft / food.durationTotal; // 1 to 0

            ctx.lineWidth = 2.5;
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
            ctx.beginPath();
            ctx.arc(fx, fy, ringRadius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
            ctx.stroke();
          }

          // Golden gradient body
          const goldGrad = ctx.createRadialGradient(fx - 2, fy - 2, 1, fx, fy, radius);
          goldGrad.addColorStop(0, '#fef08a');
          goldGrad.addColorStop(0.5, '#f59e0b');
          goldGrad.addColorStop(1, '#b45309');
          ctx.fillStyle = goldGrad;
          ctx.beginPath();
          ctx.arc(fx, fy, radius, 0, Math.PI * 2);
          ctx.fill();

          // Star sparkle
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(fx - radius * 0.3, fy - radius * 0.3, radius * 0.35, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'SPEED_BOOST': {
          // Cyan Lightning Citrus
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = isDark ? 16 : 10;
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(fx, fy, radius, 0, Math.PI * 2);
          ctx.fill();

          // Lightning bolt symbol inside
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(fx - 1, fy - radius * 0.6);
          ctx.lineTo(fx + radius * 0.5, fy - radius * 0.1);
          ctx.lineTo(fx + 1, fy - radius * 0.1);
          ctx.lineTo(fx + 2, fy + radius * 0.6);
          ctx.lineTo(fx - radius * 0.5, fy + radius * 0.1);
          ctx.lineTo(fx - 1, fy + radius * 0.1);
          ctx.closePath();
          ctx.fill();
          break;
        }

        case 'SLOW_DOWN': {
          // Chill Frostberry
          ctx.shadowColor = '#3b82f6';
          ctx.shadowBlur = isDark ? 16 : 10;
          ctx.fillStyle = '#3b82f6';
          ctx.beginPath();
          ctx.arc(fx, fy, radius, 0, Math.PI * 2);
          ctx.fill();

          // Snowflake / diamond emblem
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(fx, fy - radius * 0.6);
          ctx.lineTo(fx + radius * 0.5, fy);
          ctx.lineTo(fx, fy + radius * 0.6);
          ctx.lineTo(fx - radius * 0.5, fy);
          ctx.closePath();
          ctx.fill();
          break;
        }

        case 'SHRINK': {
          // Quantum Purple Star
          ctx.shadowColor = '#d946ef';
          ctx.shadowBlur = isDark ? 18 : 10;
          ctx.fillStyle = '#d946ef';

          // 5-point star
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const rot = (Math.PI / 5) * 2 * i - Math.PI / 2;
            ctx.lineTo(fx + Math.cos(rot) * radius, fy + Math.sin(rot) * radius);
            const innerRot = rot + Math.PI / 5;
            ctx.lineTo(fx + Math.cos(innerRot) * (radius * 0.48), fy + Math.sin(innerRot) * (radius * 0.48));
          }
          ctx.closePath();
          ctx.fill();
          break;
        }
      }
      ctx.restore();
    });

    // Draw Particles
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Snake
    if (snake.length > 0) {
      const head = snake[0];

      // Draw Snake Body (from tail to head)
      for (let i = snake.length - 1; i >= 1; i--) {
        const seg = snake[i];
        const prev = snake[i - 1];

        const cx = seg.x * cellW + cellW / 2;
        const cy = seg.y * cellH + cellH / 2;
        const segRatio = (snake.length - i) / snake.length; // 1 at neck, 0 at tail
        const segRadius = Math.max(cellW * 0.28, cellW * (0.35 + segRatio * 0.1));

        ctx.save();
        ctx.shadowColor = stage.glowColor;
        ctx.shadowBlur = isDark ? 8 : 4;

        // Gradient or pattern variation based on evolution stage
        if (stage.pattern === 'cosmic') {
          // Rainbow aurora pulse
          const hue = (now / 15 + i * 20) % 360;
          ctx.fillStyle = `hsl(${hue}, 95%, 55%)`;
        } else if (stage.pattern === 'dragon') {
          ctx.fillStyle = i % 2 === 0 ? stage.primaryColor : stage.secondaryColor;
        } else if (stage.pattern === 'cyber') {
          ctx.fillStyle = stage.primaryColor;
        } else {
          ctx.fillStyle = stage.primaryColor;
        }

        // Draw body circle
        ctx.beginPath();
        ctx.arc(cx, cy, segRadius, 0, Math.PI * 2);
        ctx.fill();

        // Connect adjacent segments for seamless smooth snake body
        // Only if they are neighbors (not wrapped across screen)
        const isNeighbor = Math.abs(seg.x - prev.x) <= 1 && Math.abs(seg.y - prev.y) <= 1;
        if (isNeighbor) {
          const pcx = prev.x * cellW + cellW / 2;
          const pcy = prev.y * cellH + cellH / 2;
          ctx.lineWidth = segRadius * 1.9;
          ctx.strokeStyle = ctx.fillStyle;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(pcx, pcy);
          ctx.stroke();
        }

        // Cyber / Dragon spine accents
        if ((stage.pattern === 'cyber' || stage.pattern === 'dragon') && i % 2 === 1) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx, cy, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Draw Snake Head
      const hx = head.x * cellW + cellW / 2;
      const hy = head.y * cellH + cellH / 2;
      const headRadius = cellW * 0.44;

      ctx.save();
      ctx.shadowColor = stage.glowColor;
      ctx.shadowBlur = isDark ? 16 : 8;

      ctx.fillStyle = stage.primaryColor;
      ctx.beginPath();
      ctx.arc(hx, hy, headRadius, 0, Math.PI * 2);
      ctx.fill();

      // Flickering tongue
      const tongueCycle = (now % 600) < 250;
      if (tongueCycle) {
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        let tx = hx;
        let ty = hy;
        let tForkX1 = 0;
        let tForkY1 = 0;
        let tForkX2 = 0;
        let tForkY2 = 0;
        const tLen = headRadius + 6;

        if (direction === 'UP') {
          ty -= tLen;
          tForkX1 = tx - 3;
          tForkY1 = ty - 3;
          tForkX2 = tx + 3;
          tForkY2 = ty - 3;
        } else if (direction === 'DOWN') {
          ty += tLen;
          tForkX1 = tx - 3;
          tForkY1 = ty + 3;
          tForkX2 = tx + 3;
          tForkY2 = ty + 3;
        } else if (direction === 'LEFT') {
          tx -= tLen;
          tForkX1 = tx - 3;
          tForkY1 = ty - 3;
          tForkX2 = tx - 3;
          tForkY2 = ty + 3;
        } else {
          // RIGHT
          tx += tLen;
          tForkX1 = tx + 3;
          tForkY1 = ty - 3;
          tForkX2 = tx + 3;
          tForkY2 = ty + 3;
        }

        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(tx, ty);
        ctx.moveTo(tx, ty);
        ctx.lineTo(tForkX1, tForkY1);
        ctx.moveTo(tx, ty);
        ctx.lineTo(tForkX2, tForkY2);
        ctx.stroke();
      }

      // Snake Eyes looking in movement direction
      const eyeOffset = headRadius * 0.45;
      const eyeForward = headRadius * 0.28;
      let leftEyeX = hx;
      let leftEyeY = hy;
      let rightEyeX = hx;
      let rightEyeY = hy;
      let pupilDx = 0;
      let pupilDy = 0;

      if (direction === 'UP') {
        leftEyeX = hx - eyeOffset;
        leftEyeY = hy - eyeForward;
        rightEyeX = hx + eyeOffset;
        rightEyeY = hy - eyeForward;
        pupilDy = -1.5;
      } else if (direction === 'DOWN') {
        leftEyeX = hx - eyeOffset;
        leftEyeY = hy + eyeForward;
        rightEyeX = hx + eyeOffset;
        rightEyeY = hy + eyeForward;
        pupilDy = 1.5;
      } else if (direction === 'LEFT') {
        leftEyeX = hx - eyeForward;
        leftEyeY = hy - eyeOffset;
        rightEyeX = hx - eyeForward;
        rightEyeY = hy + eyeOffset;
        pupilDx = -1.5;
      } else {
        // RIGHT
        leftEyeX = hx + eyeForward;
        leftEyeY = hy - eyeOffset;
        rightEyeX = hx + eyeForward;
        rightEyeY = hy + eyeOffset;
        pupilDx = 1.5;
      }

      // Draw eyes
      const eyeR = Math.max(3, headRadius * 0.25);
      [
        { x: leftEyeX, y: leftEyeY },
        { x: rightEyeX, y: rightEyeY },
      ].forEach((eye) => {
        // Eye whites/glow
        ctx.fillStyle = stage.eyeColor;
        ctx.beginPath();
        ctx.arc(eye.x, eye.y, eyeR, 0, Math.PI * 2);
        ctx.fill();

        // Pupil
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        if (stage.pattern === 'dragon') {
          // Dragon slit pupil
          ctx.ellipse(eye.x + pupilDx, eye.y + pupilDy, eyeR * 0.35, eyeR * 0.8, 0, 0, Math.PI * 2);
        } else {
          ctx.arc(eye.x + pupilDx, eye.y + pupilDy, eyeR * 0.55, 0, Math.PI * 2);
        }
        ctx.fill();
      });

      ctx.restore();
    }

    // Level Up Celebration overlay notice
    if (levelUpNotice) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(0, height / 2 - 28, width, 56);

      ctx.font = 'bold 20px Outfit, sans-serif';
      ctx.fillStyle = stage.primaryColor;
      ctx.shadowColor = stage.glowColor;
      ctx.shadowBlur = 12;
      ctx.fillText(levelUpNotice, width / 2, height / 2);
      ctx.restore();
    }
  }, [
    snake,
    direction,
    foodItems,
    obstacles,
    level,
    stage,
    isPortalActive,
    gridSize,
    theme,
    particles,
    levelUpNotice,
    cols,
    rows,
  ]);

  // Handle Resize and render updates
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const minDimension = Math.min(containerWidth, containerHeight);

      const dpr = window.devicePixelRatio || 1;
      const targetSize = Math.floor(minDimension);

      if (targetSize > 0) {
        canvas.width = targetSize * dpr;
        canvas.height = targetSize * dpr;
        canvas.style.width = `${targetSize}px`;
        canvas.style.height = `${targetSize}px`;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.resetTransform?.();
          ctx.scale(dpr, dpr);
        }
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Continuous animation frame for smooth pulsing, particles, eye movements, and countdown rings
  useEffect(() => {
    let animId: number;
    const loop = () => {
      render();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [render]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center p-2 select-none touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        className="rounded-xl shadow-2xl border border-slate-700/50 dark:border-slate-800 transition-colors"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};
