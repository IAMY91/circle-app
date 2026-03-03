'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mood } from '@/types';

const MOODS: { emoji: Mood; label: string }[] = [
  { emoji: '😌', label: 'Calm' },
  { emoji: '😊', label: 'Happy' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '🤩', label: 'Excited' },
  { emoji: '😔', label: 'Down' },
  { emoji: '🔥', label: 'Energized' },
];

interface Props {
  currentMood: Mood | null;
  onSelect: (mood: Mood | null) => void;
}

export default function MoodSelector({ currentMood, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Backdrop — closes tray on outside click */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-10 h-10 rounded-full bg-stone-700 hover:bg-stone-600 flex items-center justify-center transition-colors relative z-40"
        style={{ fontSize: 18 }}
        title="Set mood"
      >
        {currentMood ?? '🙂'}
      </button>

      {/* All 8 moods side-by-side in a fixed tray above the bottom bar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.13, ease: 'easeOut' }}
            className="fixed bottom-[4.5rem] left-1/2 -translate-x-1/2 z-50 bg-stone-900/98 backdrop-blur-md border border-stone-700/80 rounded-2xl px-3 py-3 shadow-2xl flex gap-1.5"
            onClick={e => e.stopPropagation()}
          >
            {MOODS.map(({ emoji, label }) => {
              const isActive = currentMood === emoji;
              return (
                <button
                  key={emoji}
                  onClick={() => {
                    onSelect(isActive ? null : emoji);
                    setOpen(false);
                  }}
                  className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all hover:bg-stone-800"
                  style={isActive ? {
                    outline: '2px solid var(--accent-primary)',
                    outlineOffset: '2px',
                    background: 'rgba(255,255,255,0.04)',
                  } : {}}
                  title={label}
                >
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{emoji}</span>
                  <span className="text-[10px] text-stone-500 leading-none whitespace-nowrap">{label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
