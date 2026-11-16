import React from 'react';
import { Settings, X, Moon, Sun, Smartphone, Compass, Grid, Volume2, Vibrate } from 'lucide-react';
import { ControlType, GameSettings, GridSizeOption, ThemeMode } from '../types/game';
import { soundManager } from '../utils/audio';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const update = (partial: Partial<GameSettings>) => {
    soundManager.playClick();
    onUpdateSettings({ ...settings, ...partial });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Game Settings</h2>
              <div className="text-xs text-slate-500 dark:text-slate-400">Customize display, grid & controls</div>
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

        {/* Options List */}
        <div className="flex flex-col gap-5">
          {/* Theme Mode */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" />
              <span>Theme Appearance</span>
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              <button
                type="button"
                onClick={() => update({ theme: 'DARK' })}
                className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  settings.theme === 'DARK'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Cyber Dark</span>
              </button>
              <button
                type="button"
                onClick={() => update({ theme: 'LIGHT' })}
                className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  settings.theme === 'LIGHT'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Modern Light</span>
              </button>
            </div>
          </div>

          {/* Controls Mode */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Controls</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              {(
                [
                  { value: 'SWIPE_AND_DPAD', label: 'Swipe + D-pad' },
                  { value: 'SWIPE_ONLY', label: 'Swipe Only' },
                  { value: 'DPAD_ONLY', label: 'D-pad Only' },
                ] as { value: ControlType; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update({ controlType: opt.value })}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg text-center transition-all ${
                    settings.controlType === opt.value
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Desktop arrow keys and WASD are always enabled.
            </div>
          </div>

          {/* Grid Size */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5" />
              <span>Grid Board Size</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              {(
                [
                  { value: 'SMALL', label: '16×16', sub: 'Faster' },
                  { value: 'MEDIUM', label: '20×20', sub: 'Classic' },
                  { value: 'LARGE', label: '24×24', sub: 'Spacious' },
                ] as { value: GridSizeOption; label: string; sub: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update({ gridSize: opt.value })}
                  className={`py-2 px-1 text-xs font-semibold rounded-lg flex flex-col items-center justify-center transition-all ${
                    settings.gridSize === opt.value
                      ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className="text-[10px] opacity-75 font-normal">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Audio & Haptic Toggles */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold">Sound FX</span>
              </div>
              <button
                type="button"
                onClick={() => update({ soundEnabled: !settings.soundEnabled })}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.soundEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Vibrate className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-semibold">Haptics</span>
              </div>
              <button
                type="button"
                onClick={() => update({ vibrationEnabled: !settings.vibrationEnabled })}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.vibrationEnabled ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.vibrationEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
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
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
};
