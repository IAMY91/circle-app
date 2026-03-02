'use client';

import { motion } from 'framer-motion';

interface Props {
  value: number; // 0-100 average
  handQueue: { id: string; name: string }[];
  onLowerHand: (id: string) => void;
}

export default function TensionBarometer({ value, handQueue, onLowerHand }: Props) {
  const color = value < 33 ? '#22c55e' : value < 66 ? '#f59e0b' : '#ef4444';
  const label = value < 33 ? 'Low' : value < 66 ? 'Medium' : 'High';

  return (
    <div className="space-y-4">
      {/* Energy gauge */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="text-xs uppercase tracking-wider text-stone-500">Group Energy</h3>
          <span className="text-xs font-semibold" style={{ color }}>
            {label} · {Math.round(value)}
          </span>
        </div>
        <div className="h-3 bg-stone-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${value}%`, backgroundColor: color }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between text-xs text-stone-700 mt-0.5">
          <span>Calm</span>
          <span>Tense</span>
        </div>
      </div>

      {/* Hand raise queue */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-stone-500 mb-2">
          Hand Queue{handQueue.length > 0 ? ` (${handQueue.length})` : ''}
        </h3>
        {handQueue.length === 0 ? (
          <p className="text-xs text-stone-600 italic">No hands raised</p>
        ) : (
          <div className="space-y-1">
            {handQueue.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-stone-800 rounded-lg px-3 py-2"
              >
                <span className="text-sm text-stone-200">
                  <span className="text-stone-500 mr-1.5">#{i + 1}</span>
                  ✋ {p.name}
                </span>
                <button
                  onClick={() => onLowerHand(p.id)}
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
                >
                  Call on
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
