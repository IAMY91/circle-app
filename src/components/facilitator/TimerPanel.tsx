'use client';

import { useState } from 'react';

interface Props {
  timerSeconds: number;
  timerRunning: boolean;
  onStart: (seconds: number) => void;
  onPause: () => void;
  onReset: () => void;
}

const PRESETS = [
  { label: '1m', s: 60 },
  { label: '3m', s: 180 },
  { label: '5m', s: 300 },
  { label: '10m', s: 600 },
];

const R = 52;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function TimerPanel({ timerSeconds, timerRunning, onStart, onPause, onReset }: Props) {
  const [customMin, setCustomMin] = useState('');
  const [totalSeconds, setTotalSeconds] = useState(0);

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const neverStarted = totalSeconds === 0;
  const hasEnded = totalSeconds > 0 && timerSeconds === 0 && !timerRunning;
  const progress = totalSeconds > 0 ? timerSeconds / totalSeconds : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const ringColor = hasEnded ? '#ef4444' : timerRunning ? '#f59e0b' : '#78716c';
  const textColor = hasEnded
    ? 'text-red-400'
    : neverStarted
    ? 'text-stone-600'
    : timerRunning
    ? 'text-amber-400'
    : 'text-stone-200';

  const startFresh = (s: number) => {
    setTotalSeconds(s);
    onStart(s);
  };

  const handleCustom = () => {
    const s = parseInt(customMin, 10) * 60;
    if (s > 0) { startFresh(s); setCustomMin(''); }
  };

  const handleReset = () => {
    setTotalSeconds(0);
    onReset();
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-wider text-stone-500">Timer</h3>

      {/* Circular progress ring */}
      <div className="flex justify-center">
        <div className="relative" style={{ width: 120, height: 120 }}>
          <svg
            className="absolute inset-0 -rotate-90"
            width="120"
            height="120"
            viewBox="0 0 120 120"
          >
            {/* Track ring */}
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="rgba(68,64,60,0.45)"
              strokeWidth="7"
            />
            {/* Progress arc */}
            {!neverStarted && (
              <circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke={ringColor}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{ transition: timerRunning ? 'stroke-dashoffset 1s linear, stroke 0.4s' : 'stroke 0.4s' }}
              />
            )}
          </svg>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <div className={`text-2xl font-mono font-bold tabular-nums leading-none ${textColor}`}>
              {formatted}
            </div>
            {hasEnded && (
              <div className="text-xs text-red-500 mt-1 font-medium">Time&apos;s up</div>
            )}
            {!neverStarted && !hasEnded && (
              <div className="text-xs text-stone-600 mt-1">
                {Math.round(progress * 100)}%
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-4 gap-1.5">
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => startFresh(p.s)}
            className="py-1.5 bg-stone-700 hover:bg-stone-600 rounded-lg text-xs text-stone-200 transition-colors font-medium"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="flex gap-1.5">
        <input
          type="number"
          placeholder="min"
          value={customMin}
          min="1"
          max="999"
          onChange={e => setCustomMin(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCustom()}
          className="flex-1 bg-stone-700 rounded-lg text-sm text-stone-200 px-2 py-1.5 outline-none text-center focus:ring-1 focus:ring-amber-500/50 min-w-0"
        />
        <button
          onClick={handleCustom}
          className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 rounded-lg text-sm text-stone-200 transition-colors"
        >
          Set
        </button>
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
            onClick={() => timerSeconds > 0 ? onStart(timerSeconds) : startFresh(180)}
            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {timerSeconds > 0 ? 'Resume' : 'Start'}
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg text-sm transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
