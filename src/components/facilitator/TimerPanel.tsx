'use client';

import { useState } from 'react';

interface Props {
  timerSeconds: number;
  timerRunning: boolean;
  onStart: (seconds: number) => void;
  onPause: () => void;
  onReset: () => void;
}

export default function TimerPanel({
  timerSeconds,
  timerRunning,
  onStart,
  onPause,
  onReset,
}: Props) {
  const [customMin, setCustomMin] = useState('');

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isEmpty = timerSeconds === 0;

  const presets = [
    { label: '1m', s: 60 },
    { label: '3m', s: 180 },
    { label: '5m', s: 300 },
  ];

  const handleCustom = () => {
    const s = parseInt(customMin, 10) * 60;
    if (s > 0) {
      onStart(s);
      setCustomMin('');
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-wider text-stone-500">Timer</h3>

      {/* Display */}
      <div
        className={`text-4xl font-mono font-bold text-center tabular-nums ${
          isEmpty
            ? 'text-stone-600'
            : timerRunning
            ? 'text-amber-400'
            : 'text-stone-200'
        }`}
      >
        {formatted}
      </div>

      {/* Presets */}
      <div className="flex gap-1.5 flex-wrap">
        {presets.map(p => (
          <button
            key={p.label}
            onClick={() => onStart(p.s)}
            className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 rounded-lg text-sm text-stone-200 transition-colors"
          >
            {p.label}
          </button>
        ))}
        <div className="flex gap-1 flex-1">
          <input
            type="number"
            placeholder="min"
            value={customMin}
            onChange={e => setCustomMin(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCustom()}
            className="w-14 bg-stone-700 rounded-lg text-sm text-stone-200 px-2 py-1.5 outline-none text-center focus:ring-1 focus:ring-amber-500/50 min-w-0"
          />
          <button
            onClick={handleCustom}
            className="px-2 py-1.5 bg-stone-700 hover:bg-stone-600 rounded-lg text-sm text-stone-200 transition-colors"
          >
            Set
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {timerRunning ? (
          <button
            onClick={onPause}
            className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={() => (timerSeconds > 0 ? onStart(timerSeconds) : onStart(180))}
            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {timerSeconds > 0 ? 'Resume' : 'Start'}
          </button>
        )}
        <button
          onClick={onReset}
          className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg text-sm transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
