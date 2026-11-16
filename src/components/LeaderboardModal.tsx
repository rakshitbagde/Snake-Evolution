import React, { useState } from 'react';
import { Trophy, X, Calendar, RotateCcw, Award } from 'lucide-react';
import { HighScore } from '../types/game';
import { clearHighScores } from '../utils/storage';
import { soundManager } from '../utils/audio';

interface LeaderboardModalProps {
  scores: HighScore[];
  onClose: () => void;
  onScoresUpdated: (scores: HighScore[]) => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  scores,
  onClose,
  onScoresUpdated,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClear = () => {
    soundManager.playClick();
    const updated = clearHighScores();
    onScoresUpdated(updated);
    setShowClearConfirm(false);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 0) return { bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40', label: '1st' };
    if (rank === 1) return { bg: 'bg-slate-300/20 text-slate-300 border-slate-300/40', label: '2nd' };
    if (rank === 2) return { bg: 'bg-amber-700/20 text-amber-600 border-amber-700/40', label: '3rd' };
    return { bg: 'bg-slate-700/20 text-slate-400 border-slate-700/40', label: `${rank + 1}th` };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Hall of Fame</h2>
              <div className="text-xs text-slate-500 dark:text-slate-400">Top 5 all-time evolutionary runs</div>
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

        {/* Scores List */}
        <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto pr-1">
          {scores.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No high scores recorded yet. Complete a run to place your mark!
            </div>
          ) : (
            scores.map((item, index) => {
              const badge = getRankBadge(index);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center border font-mono-numbers ${badge.bg}`}
                    >
                      {badge.label}
                    </span>
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-2">
                        <span>{item.stageName}</span>
                        <span className="text-xs text-slate-400">· Lv.{item.level}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                        <span>·</span>
                        <span>{item.foodsEaten} foods</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono-numbers text-amber-500 dark:text-amber-400">
                      {item.score}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">points</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          {!showClearConfirm ? (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Records</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-500">Reset all?</span>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-semibold px-2 py-1 rounded bg-rose-500 text-white hover:bg-rose-600 transition-colors"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium text-xs hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
