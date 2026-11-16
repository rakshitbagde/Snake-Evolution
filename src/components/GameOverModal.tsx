import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Trophy, Skull, Flame } from 'lucide-react';
import { DeathReason, EvolutionStage } from '../types/game';
import { soundManager } from '../utils/audio';

interface GameOverModalProps {
  score: number;
  highScore: number;
  level: number;
  stage: EvolutionStage;
  foodsEatenTotal: number;
  deathReason: DeathReason;
  isNewHighScore: boolean;
  isTopScore: boolean;
  onPlayAgain: () => void;
  onHome: () => void;
  onOpenLeaderboard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  level,
  stage,
  foodsEatenTotal,
  deathReason,
  isNewHighScore,
  isTopScore,
  onPlayAgain,
  onHome,
  onOpenLeaderboard,
}) => {
  useEffect(() => {
    if (isNewHighScore) {
      // Fire festive confetti bursts
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#a855f7'],
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isNewHighScore]);

  const getDeathMessage = () => {
    switch (deathReason) {
      case 'WALL_COLLISION':
        return 'Crashed into the perimeter barrier';
      case 'OBSTACLE_COLLISION':
        return 'Collided with an impassable boulder';
      case 'SELF_COLLISION':
        return 'Tangled and bit own serpent body';
      default:
        return 'Evolutionary sequence terminated';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-slate-900 dark:text-slate-100 text-center">
        {/* New High Score Celebratory Banner */}
        {isNewHighScore ? (
          <div className="py-2 px-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-500 flex items-center justify-center gap-2 animate-bounce">
            <Trophy className="w-5 h-5" />
            <span className="font-extrabold text-sm uppercase tracking-wide">
              {isTopScore ? '★ New All-Time Record! ★' : '★ Top 5 High Score! ★'}
            </span>
          </div>
        ) : (
          <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
            <Skull className="w-6 h-6" />
          </div>
        )}

        {/* Title & Death Cause */}
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Run Over</h2>
          <p className="text-xs text-rose-500 dark:text-rose-400 font-medium mt-1">{getDeathMessage()}</p>
        </div>

        {/* Score & Stage Details */}
        <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Final Score</div>
            <div className="text-4xl font-black font-mono-numbers text-slate-900 dark:text-white mt-0.5">
              {score}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-center">
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Level</div>
              <div className="text-sm font-bold font-mono-numbers">{level}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Stage</div>
              <div className="text-sm font-bold truncate text-emerald-500">{stage.name}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Foods</div>
              <div className="text-sm font-bold font-mono-numbers">{foodsEatenTotal}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenLeaderboard();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Leaderboard</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onHome();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Main Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
