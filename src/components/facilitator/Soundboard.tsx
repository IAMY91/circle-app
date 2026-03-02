'use client';

import { useAudio, SoundId } from '@/hooks/useAudio';

const SOUNDS: { id: SoundId; label: string; emoji: string }[] = [
  { id: 'gong', label: 'Gong', emoji: '🪗' },
  { id: 'bell', label: 'Bell', emoji: '🔔' },
  { id: 'bowl', label: 'Singing Bowl', emoji: '🎵' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
];

export default function Soundboard() {
  const { play } = useAudio();

  return (
    <div>
      <h3 className="text-xs uppercase tracking-wider text-stone-500 mb-2">Soundboard</h3>
      <div className="grid grid-cols-2 gap-2">
        {SOUNDS.map(sound => (
          <button
            key={sound.id}
            onClick={() => play(sound.id)}
            className="bg-stone-700 hover:bg-stone-600 active:bg-stone-500 rounded-lg px-3 py-2.5 text-sm text-stone-200 flex items-center gap-2 transition-colors"
          >
            <span>{sound.emoji}</span>
            <span className="truncate">{sound.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
