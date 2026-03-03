'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '@/types';

export const THEMES: {
  id: Theme;
  label: string;
  emoji: string;
  color: string;
  glow: string;
  description: string;
}[] = [
  { id: 'earth',    label: 'Earth',    emoji: '🌿', color: '#f59e0b', glow: 'rgba(255,157,0,0.4)',    description: 'Warm & grounded' },
  { id: 'water',    label: 'Water',    emoji: '🌊', color: '#06b6d4', glow: 'rgba(0,212,255,0.4)',    description: 'Cool & flowing' },
  { id: 'forest',   label: 'Forest',   emoji: '🌲', color: '#22c55e', glow: 'rgba(34,197,94,0.4)',    description: 'Deep & alive' },
  { id: 'dusk',     label: 'Dusk',     emoji: '🌆', color: '#a855f7', glow: 'rgba(168,85,247,0.4)',   description: 'Mystical & still' },
  { id: 'rose',     label: 'Rose',     emoji: '🌸', color: '#ec4899', glow: 'rgba(236,72,153,0.4)',   description: 'Soft & tender' },
  { id: 'midnight', label: 'Midnight', emoji: '🌙', color: '#818cf8', glow: 'rgba(99,102,241,0.4)',   description: 'Serene & vast' },
];

interface Props {
  isOpen: boolean;
  current: Theme;
  onSelect: (theme: Theme) => void;
  onClose: () => void;
}

export default function ThemePicker({ isOpen, current, onSelect, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible backdrop to close on outside click */}
          <div className="fixed inset-0 z-40" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className="fixed bottom-[4.5rem] left-1/2 -translate-x-1/2 z-50 bg-stone-900/98 backdrop-blur-md border border-stone-700/80 rounded-2xl p-3 shadow-2xl"
            style={{ minWidth: 296 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-xs uppercase tracking-wider text-stone-500 px-1 mb-3">
              Skin &amp; Mood
            </div>

            <div className="grid grid-cols-3 gap-2">
              {THEMES.map(t => {
                const isActive = current === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => { onSelect(t.id); onClose(); }}
                    className="relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-stone-800 hover:bg-stone-750 transition-all"
                    style={isActive ? {
                      outline: `2px solid ${t.color}`,
                      outlineOffset: '2px',
                      background: 'rgba(255,255,255,0.04)',
                    } : {}}
                  >
                    {/* Swatch circle */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xl transition-all"
                      style={{
                        background: t.color,
                        boxShadow: isActive ? `0 0 16px ${t.glow}` : `0 0 4px ${t.glow}`,
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {t.emoji}
                    </div>

                    <span className="text-xs text-stone-300 font-medium leading-none">{t.label}</span>
                    <span className="text-[10px] text-stone-600 leading-none text-center">{t.description}</span>

                    {/* Active dot */}
                    {isActive && (
                      <span
                        className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                        style={{ background: t.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
