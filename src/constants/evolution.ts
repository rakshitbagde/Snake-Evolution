import { EvolutionStage, GridSizeOption } from '../types/game';

export const GRID_CONFIG: Record<GridSizeOption, { cols: number; rows: number; label: string }> = {
  SMALL: { cols: 16, rows: 16, label: 'Small (16×16)' },
  MEDIUM: { cols: 20, rows: 20, label: 'Medium (20×20)' },
  LARGE: { cols: 24, rows: 24, label: 'Large (24×24)' },
};

export const EVOLUTION_STAGES: EvolutionStage[] = [
  {
    levelThreshold: 1,
    name: 'Neon Viper',
    title: 'Stage I: Neon Viper',
    description: 'Agile emerald serpent with responsive sensory instincts.',
    primaryColor: '#10b981', // emerald-500
    secondaryColor: '#059669', // emerald-600
    glowColor: 'rgba(16, 185, 129, 0.6)',
    eyeColor: '#a7f3d0',
    pattern: 'smooth',
  },
  {
    levelThreshold: 3,
    name: 'Cyber Cobra',
    title: 'Stage II: Cyber Cobra',
    description: 'Electrified cyan predator with armored scale contours. Obstacles emerge.',
    primaryColor: '#06b6d4', // cyan-500
    secondaryColor: '#0891b2', // cyan-600
    glowColor: 'rgba(6, 182, 212, 0.7)',
    eyeColor: '#cffafe',
    pattern: 'cyber',
  },
  {
    levelThreshold: 5,
    name: 'Plasma Dragon',
    title: 'Stage III: Plasma Dragon',
    description: 'Violet plasma beast capable of quantum space tunneling. Wall portals active.',
    primaryColor: '#a855f7', // purple-500
    secondaryColor: '#7e22ce', // purple-700
    glowColor: 'rgba(168, 85, 247, 0.8)',
    eyeColor: '#f3e8ff',
    pattern: 'dragon',
  },
  {
    levelThreshold: 7,
    name: 'Cosmic Phoenix',
    title: 'Stage IV: Cosmic Phoenix',
    description: 'Transcendent golden serpent crowned with celestial solar flare.',
    primaryColor: '#f59e0b', // amber-500
    secondaryColor: '#d97706', // amber-600
    glowColor: 'rgba(245, 158, 11, 0.9)',
    eyeColor: '#fef3c7',
    pattern: 'cosmic',
  },
];

export function getEvolutionStage(level: number): EvolutionStage {
  for (let i = EVOLUTION_STAGES.length - 1; i >= 0; i--) {
    if (level >= EVOLUTION_STAGES[i].levelThreshold) {
      return EVOLUTION_STAGES[i];
    }
  }
  return EVOLUTION_STAGES[0];
}

export function getObstacleCountForLevel(level: number, gridSize: GridSizeOption): number {
  if (level < 3) return 0;
  const sizeFactor = gridSize === 'SMALL' ? 0.8 : gridSize === 'LARGE' ? 1.3 : 1;
  if (level === 3) return Math.round(3 * sizeFactor);
  if (level === 4) return Math.round(5 * sizeFactor);
  if (level === 5) return Math.round(6 * sizeFactor);
  return Math.min(12, Math.round((6 + (level - 5)) * sizeFactor));
}

export function isPortalActiveForLevel(level: number): boolean {
  return level >= 5;
}

export function calculateBaseInterval(level: number): number {
  // Speed starts at 135ms and decreases each level
  // Level 1: 135ms, Level 2: 120ms, Level 3: 108ms, Level 4: 96ms, Level 5: 85ms, Level 6: 76ms, Level 7+: 68ms -> min 55ms
  const base = 135;
  const reduction = (level - 1) * 12;
  return Math.max(55, base - reduction);
}

export const FOOD_DESCRIPTIONS = [
  {
    type: 'NORMAL',
    name: 'Energy Berry',
    color: '#ef4444',
    points: 10,
    desc: 'Grow +1 segment. Collect 5 to evolve.',
  },
  {
    type: 'GOLDEN',
    name: 'Golden Apple',
    color: '#eab308',
    points: 50,
    desc: 'High value reward! Disappears in 5 seconds.',
  },
  {
    type: 'SPEED_BOOST',
    name: 'Hyper Citrus',
    color: '#06b6d4',
    points: 20,
    desc: 'Temporary 35% speed boost & 1.5x score bonus for 6s.',
  },
  {
    type: 'SLOW_DOWN',
    name: 'Chill Frostberry',
    color: '#3b82f6',
    points: 20,
    desc: 'Slows down movement by 45% for 6s. Great for tight zones.',
  },
  {
    type: 'SHRINK',
    name: 'Quantum Star',
    color: '#d946ef',
    points: 30,
    desc: 'Instantly shrinks snake by 3 segments (min 3).',
  },
];
