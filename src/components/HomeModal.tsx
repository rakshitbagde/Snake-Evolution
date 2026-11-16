import React from 'react';
import { Play, Trophy, Settings, HelpCircle, ShieldAlert, Sparkles, Orbit } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HomeModalProps {
  highScore: number;
  onStartGame: () => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
}

export const HomeModal: React.FC<HomeModalProps> = ({
  highScore,
  onStartGame,
  onOpenLeaderboard,
  onOpenSettings,
  onOpenGuide,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-slate-900 dark:text-white text-center relative overflow-hidden">
        {/* Ambient neon backdrop glow */}
        <div className="absolute -top-24 -left-24 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Branding */}
        <div className="flex flex-col items-center gap-2 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-xl shadow-emerald-500/20 mb-1 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
            Snake Evolution
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
            Evolve your serpent through dynamic levels with mutating obstacles, warp portals, and special powers.
          </p>
        </div>

        {/* High Score Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 relative z-10">
          <div className="flex items-center gap-2.5 text-left">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Record High</div>
              <div className="text-lg font-bold font-mono-numbers text-amber-500 dark:text-amber-400">{highScore} pts</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onOpenLeaderboard();
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-700/60 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            Leaderboard
          </button>
        </div>

        {/* Evolution Milestones Preview strip */}
        <div className="grid grid-cols-4 gap-1.5 text-[10px] text-center relative z-10">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Lv.1 Viper</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Lv.3 Cobra</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Lv.5 Dragon</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Lv.7 Phoenix</span>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="flex flex-col gap-2.5 relative z-10">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onStartGame();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>START EVOLUTION</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenGuide();
              }}
              className="py-3 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 font-semibold text-xs flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <span>Field Guide</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenSettings();
              }}
              className="py-3 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 font-semibold text-xs flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Settings className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Quick controls footnote */}
        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <span>Desktop: Arrow Keys / WASD</span>
          <span>·</span>
          <span>Mobile: Swipe / D-Pad</span>
        </div>
      </div>
    </div>
  );
};
