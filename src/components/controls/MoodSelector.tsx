'use client';

import { useState, useRef, useEffect } from 'react';
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-10 h-10 rounded-full bg-stone-700 hover:bg-stone-600 flex items-center justify-center transition-colors"
        style={{ fontSize: 18 }}
        title="Set mood"
      >
        {currentMood ?? '🙂'}
      </button>
      {open && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-stone-800 border border-stone-700 rounded-xl p-2 flex gap-1 shadow-2xl z-50 whitespace-nowrap">
          {MOODS.map(({ emoji, label }) => (
            <button
              key={emoji}
              onClick={() => {
                onSelect(currentMood === emoji ? null : emoji);
                setOpen(false);
              }}
              className={`w-10 h-10 rounded-lg hover:bg-stone-700 flex items-center justify-center transition-colors ${
                currentMood === emoji ? 'bg-stone-600 ring-1 ring-amber-500' : ''
              }`}
              style={{ fontSize: 18 }}
              title={label}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
