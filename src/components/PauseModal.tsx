import React from 'react';
import { Play, RotateCcw, Home, Settings } from 'lucide-react';
import { EvolutionStage } from '../types/game';
import { soundManager } from '../utils/audio';

interface PauseModalProps {
  score: number;
  level: number;
  stage: EvolutionStage;
  foodsEatenTotal: number;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  onOpenSettings: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  score,
  level,
  stage,
  foodsEatenTotal,
  onResume,
  onRestart,
  onHome,
  onOpenSettings,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-slate-900 dark:text-slate-100 text-center">
        {/* Title */}
        <div>
          <span
            className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2 inline-block"
            style={{
              backgroundColor: `${stage.primaryColor}22`,
              color: stage.primaryColor,
              border: `1px solid ${stage.primaryColor}55`,
            }}
          >
            {stage.name} · Level {level}
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">Game Paused</h2>
        </div>

        {/* Current Run Metrics */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Current Score</div>
            <div className="text-xl font-bold font-mono-numbers text-emerald-500">{score}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Foods Eaten</div>
            <div className="text-xl font-bold font-mono-numbers text-cyan-500">{foodsEatenTotal}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onResume();
            }}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Resume Game</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Run</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenSettings();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
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
