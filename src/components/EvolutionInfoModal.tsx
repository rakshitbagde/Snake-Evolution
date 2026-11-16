import React from 'react';
import { Sparkles, X, Apple, Zap, Snowflake, Star, ShieldAlert, Orbit } from 'lucide-react';
import { EVOLUTION_STAGES, FOOD_DESCRIPTIONS } from '../constants/evolution';
import { soundManager } from '../utils/audio';

interface EvolutionInfoModalProps {
  onClose: () => void;
}

export const EvolutionInfoModal: React.FC<EvolutionInfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Evolution & Field Guide</h2>
              <div className="text-xs text-slate-500 dark:text-slate-400">Stages, powers, and hazards</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex flex-col gap-5 overflow-y-auto pr-1 text-xs">
          {/* Section 1: Evolution Stages */}
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <span>Serpent Evolutions (Every 5 Foods = +1 Level)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EVOLUTION_STAGES.map((stg) => (
                <div
                  key={stg.name}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm" style={{ color: stg.primaryColor }}>
                      {stg.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 font-semibold font-mono-numbers">
                      Lv.{stg.levelThreshold}+
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {stg.description}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stg.primaryColor }} />
                    <span className="capitalize">{stg.pattern} scales</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Special Foods */}
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white mb-2">
              Fruit & Power-Up Types
            </div>
            <div className="flex flex-col gap-2">
              {FOOD_DESCRIPTIONS.map((food) => (
                <div
                  key={food.type}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: `${food.color}25`, border: `1px solid ${food.color}50` }}
                    >
                      {food.type === 'NORMAL' && <Apple className="w-4 h-4 text-rose-500" />}
                      {food.type === 'GOLDEN' && <Sparkles className="w-4 h-4 text-amber-400" />}
                      {food.type === 'SPEED_BOOST' && <Zap className="w-4 h-4 text-cyan-400" />}
                      {food.type === 'SLOW_DOWN' && <Snowflake className="w-4 h-4 text-blue-400" />}
                      {food.type === 'SHRINK' && <Star className="w-4 h-4 text-fuchsia-400" />}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{food.name}</span>
                        <span className="text-[10px] font-mono-numbers text-emerald-500">+{food.points} pts</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{food.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Level Hazards & Portal Rules */}
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white mb-2">
              Environmental Mechanics
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-500">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Level 3+: Boulder Obstacles</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Solid rocks manifest across the arena. Crashing into rocks ends the run immediately.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 font-bold text-purple-400">
                  <Orbit className="w-4 h-4" />
                  <span>Level 5+: Quantum Portals</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Outer walls dissolve into warp portals! Slithering off one edge teleports to the opposite side.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
