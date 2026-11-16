import { GameSettings, HighScore } from '../types/game';

const HIGH_SCORES_KEY = 'snake_evolution_highscores';
const SETTINGS_KEY = 'snake_evolution_settings';

export const DEFAULT_SETTINGS: GameSettings = {
  theme: 'DARK',
  controlType: 'SWIPE_AND_DPAD',
  gridSize: 'MEDIUM',
  soundEnabled: true,
  vibrationEnabled: true,
};

export const INITIAL_HIGH_SCORES: HighScore[] = [
  {
    id: 'hs-1',
    score: 450,
    level: 6,
    stageName: 'Plasma Dragon',
    foodsEaten: 28,
    date: 'Nov 12, 2026',
  },
  {
    id: 'hs-2',
    score: 320,
    level: 4,
    stageName: 'Cyber Cobra',
    foodsEaten: 19,
    date: 'Nov 10, 2026',
  },
  {
    id: 'hs-3',
    score: 210,
    level: 3,
    stageName: 'Cyber Cobra',
    foodsEaten: 14,
    date: 'Nov 08, 2026',
  },
  {
    id: 'hs-4',
    score: 140,
    level: 2,
    stageName: 'Neon Viper',
    foodsEaten: 9,
    date: 'Nov 05, 2026',
  },
  {
    id: 'hs-5',
    score: 80,
    level: 1,
    stageName: 'Neon Viper',
    foodsEaten: 5,
    date: 'Nov 01, 2026',
  },
];

export function getHighScores(): HighScore[] {
  try {
    const data = localStorage.getItem(HIGH_SCORES_KEY);
    if (!data) {
      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(INITIAL_HIGH_SCORES));
      return INITIAL_HIGH_SCORES;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, 5);
    }
    return INITIAL_HIGH_SCORES;
  } catch {
    return INITIAL_HIGH_SCORES;
  }
}

export function saveHighScore(
  score: number,
  level: number,
  stageName: string,
  foodsEaten: number
): { isNewHighScore: boolean; isTopScore: boolean; scores: HighScore[] } {
  if (score <= 0) {
    return { isNewHighScore: false, isTopScore: false, scores: getHighScores() };
  }

  const currentScores = getHighScores();
  const highestScoreBefore = currentScores.length > 0 ? currentScores[0].score : 0;
  const lowestTopScore = currentScores.length >= 5 ? currentScores[currentScores.length - 1].score : 0;

  const qualifies = currentScores.length < 5 || score > lowestTopScore;
  const isTopScore = score > highestScoreBefore;

  if (!qualifies) {
    return { isNewHighScore: false, isTopScore: false, scores: currentScores };
  }

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const newEntry: HighScore = {
    id: 'hs-' + Date.now(),
    score,
    level,
    stageName,
    foodsEaten,
    date: today,
  };

  const updated = [...currentScores, newEntry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  try {
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(updated));
  } catch {
    // localstorage error
  }

  return {
    isNewHighScore: true,
    isTopScore,
    scores: updated,
  };
}

export function clearHighScores(): HighScore[] {
  try {
    localStorage.removeItem(HIGH_SCORES_KEY);
  } catch {
    // ignore
  }
  return INITIAL_HIGH_SCORES;
}

export function getSavedSettings(): GameSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(data);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
