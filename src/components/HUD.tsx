import React from 'react';
import { Pause, Play, Volume2, VolumeX, Zap, Snowflake } from 'lucide-react';
import { ActiveBuff, EvolutionStage } from '../types/game';

interface HUDProps {
  score: number;
  highScore: number;
  level: number;
  stage: EvolutionStage;
  foodsEatenLevel: number;
  speedTilesPerSec: number;
  activeBuff: ActiveBuff | null;
  isPaused: boolean;
  soundEnabled: boolean;
  onTogglePause: () => void;
  onToggleSound: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  highScore,
  level,
  stage,
  foodsEatenLevel,
  speedTilesPerSec,
  activeBuff,
  isPaused,
  soundEnabled,
  onTogglePause,
  onToggleSound,
}) => {
  const foodsToNext = 5;
  const progressPercent = Math.min(100, (foodsEatenLevel / foodsToNext) * 100);

  return (
    <header className="w-full max-w-xl mx-auto px-3 py-2 flex flex-col gap-2 select-none">
      {/* Top row: Score, High Score, Audio & Pause buttons */}
      <div className="flex items-center justify-between gap-2">
        {/* Score & Best */}
        <div className="flex items-center gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Score</div>
            <div className="text-2xl font-bold font-mono-numbers text-slate-900 dark:text-white leading-tight">
              {score}
            </div>
          </div>
          <div className="hidden sm:block h-6 w-px bg-slate-300 dark:bg-slate-700/60" />
          <div className="hidden sm:block">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Best</div>
            <div className="text-lg font-semibold font-mono-numbers text-amber-500 leading-tight">
              {Math.max(score, highScore)}
            </div>
          </div>
        </div>

        {/* Evolution Stage & Level Indicator */}
        <div className="flex flex-col items-center">
          <div
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 transition-colors shadow-sm"
            style={{
              backgroundColor: `${stage.primaryColor}22`,
              color: stage.primaryColor,
              border: `1px solid ${stage.primaryColor}55`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stage.primaryColor }} />
            <span>Lv.{level} · {stage.name}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono-numbers">
            {speedTilesPerSec.toFixed(1)} tiles/s
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            className="p-2 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
          </button>
          <button
            type="button"
            onClick={onTogglePause}
            aria-label={isPaused ? 'Resume Game' : 'Pause Game'}
            className="p-2 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-500" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Second row: Level progress bar + Active power-up indicator */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono-numbers">
            <span>Evolution Progress</span>
            <span>{foodsEatenLevel} / {foodsToNext}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: stage.primaryColor,
              }}
            />
          </div>
        </div>

        {/* Active Power-up Badge */}
        {activeBuff && (
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold animate-pulse"
            style={{
              backgroundColor: activeBuff.type === 'SPEED_BOOST' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(59, 130, 246, 0.2)',
              color: activeBuff.type === 'SPEED_BOOST' ? '#06b6d4' : '#3b82f6',
              border: `1px solid ${activeBuff.type === 'SPEED_BOOST' ? '#06b6d466' : '#3b82f666'}`,
            }}
          >
            {activeBuff.type === 'SPEED_BOOST' ? (
              <>
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Hyper (1.5x)</span>
              </>
            ) : (
              <>
                <Snowflake className="w-3 h-3 text-blue-400" />
                <span>Chill (-45%)</span>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
