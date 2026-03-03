'use client';

import { motion } from 'framer-motion';

interface Props {
  vibeX: number; // pleasantness, roughly -80 to +80
  vibeY: number; // energy, roughly -80 to +80 (positive = high energy)
}

export default function VibeQuadrant({ vibeX, vibeY }: Props) {
  // Map to CSS percentage: center = 50%, clamp to 8–92%
  const leftPct = Math.max(8, Math.min(92, (vibeX + 100) / 200 * 100));
  const topPct  = Math.max(8, Math.min(92, (100 - vibeY) / 200 * 100));

  const dotColor = vibeY > 20
    ? '#f59e0b'   // high energy → amber
    : vibeY < -20
    ? '#60a5fa'   // low energy → blue
    : '#a3e635';  // balanced → lime

  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <h3 className="text-xs uppercase tracking-wider text-stone-500">Vibe Check</h3>
        <span className="text-xs text-stone-600">auto-derived from moods + energy</span>
      </div>

      <div
        className="relative w-full rounded-lg overflow-hidden"
        style={{ height: 150, background: '#080a10', border: '1px solid #2a3a52' }}
      >
        {/* Axis lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-px bg-stone-800" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-full w-px bg-stone-800" />
        </div>

        {/* Axis labels */}
        <span className="absolute text-stone-600 select-none" style={{ fontSize: 9, top: 3, left: '50%', transform: 'translateX(-50%)' }}>
          HIGH ENERGY
        </span>
        <span className="absolute text-stone-600 select-none" style={{ fontSize: 9, bottom: 3, left: '50%', transform: 'translateX(-50%)' }}>
          LOW ENERGY
        </span>
        <span className="absolute text-stone-600 select-none" style={{ fontSize: 9, left: 3, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'center' }}>
          UNPLEASANT
        </span>
        <span className="absolute text-stone-600 select-none" style={{ fontSize: 9, right: 3, top: '50%', transform: 'translateY(-50%) rotate(90deg)', transformOrigin: 'center' }}>
          PLEASANT
        </span>

        {/* Collective dot */}
        <motion.div
          animate={{ left: `${leftPct}%`, top: `${topPct}%`, backgroundColor: dotColor }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute rounded-full"
          style={{
            width: 16,
            height: 16,
            marginLeft: -8,
            marginTop: -8,
            boxShadow: `0 0 10px 3px ${dotColor}66`,
          }}
        />
      </div>

      <p className="text-xs text-stone-600 mt-1.5 text-center">
        Change your mood or energy slider to shift the dot
      </p>
    </div>
  );
}
