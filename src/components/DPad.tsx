import React from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { Direction } from '../types/game';
import { soundManager } from '../utils/audio';

interface DPadProps {
  onDirection: (dir: Direction) => void;
  accentColor?: string;
}

export const DPad: React.FC<DPadProps> = ({ onDirection, accentColor = '#10b981' }) => {
  const handlePress = (e: React.PointerEvent | React.MouseEvent, dir: Direction) => {
    e.preventDefault();
    e.stopPropagation();
    soundManager.triggerHaptic(15);
    onDirection(dir);
  };

  return (
    <div
      className="relative w-44 h-44 select-none touch-none mx-auto flex items-center justify-center"
      style={{ touchAction: 'none' }}
    >
      {/* Center base disc */}
      <div className="absolute inset-2 rounded-full bg-slate-200/70 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700/50 backdrop-blur-sm pointer-events-none shadow-sm" />

      {/* Up Button */}
      <button
        type="button"
        onPointerDown={(e) => handlePress(e, 'UP')}
        aria-label="Move Up"
        className="absolute top-1 left-1/2 -translate-x-1/2 w-14 h-13 rounded-t-xl rounded-b-md bg-white/95 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/90 active:scale-95 text-slate-800 dark:text-slate-200 active:text-slate-950 dark:active:text-white border border-slate-300/80 dark:border-slate-700 flex items-center justify-center shadow-md transition-transform"
      >
        <ArrowUp className="w-6 h-6" style={{ color: accentColor }} />
      </button>

      {/* Down Button */}
      <button
        type="button"
        onPointerDown={(e) => handlePress(e, 'DOWN')}
        aria-label="Move Down"
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-13 rounded-b-xl rounded-t-md bg-white/95 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/90 active:scale-95 text-slate-800 dark:text-slate-200 active:text-slate-950 dark:active:text-white border border-slate-300/80 dark:border-slate-700 flex items-center justify-center shadow-md transition-transform"
      >
        <ArrowDown className="w-6 h-6" style={{ color: accentColor }} />
      </button>

      {/* Left Button */}
      <button
        type="button"
        onPointerDown={(e) => handlePress(e, 'LEFT')}
        aria-label="Move Left"
        className="absolute left-1 top-1/2 -translate-y-1/2 w-13 h-14 rounded-l-xl rounded-r-md bg-white/95 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/90 active:scale-95 text-slate-800 dark:text-slate-200 active:text-slate-950 dark:active:text-white border border-slate-300/80 dark:border-slate-700 flex items-center justify-center shadow-md transition-transform"
      >
        <ArrowLeft className="w-6 h-6" style={{ color: accentColor }} />
      </button>

      {/* Right Button */}
      <button
        type="button"
        onPointerDown={(e) => handlePress(e, 'RIGHT')}
        aria-label="Move Right"
        className="absolute right-1 top-1/2 -translate-y-1/2 w-13 h-14 rounded-r-xl rounded-l-md bg-white/95 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/90 active:scale-95 text-slate-800 dark:text-slate-200 active:text-slate-950 dark:active:text-white border border-slate-300/80 dark:border-slate-700 flex items-center justify-center shadow-md transition-transform"
      >
        <ArrowRight className="w-6 h-6" style={{ color: accentColor }} />
      </button>

      {/* Center accent dot */}
      <div
        className="w-4 h-4 rounded-full pointer-events-none transition-colors shadow-sm"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
};
