'use client';

import { motion } from 'framer-motion';
import { Participant } from '@/types';

interface Props {
  participant: Participant;
  isSpeaking: boolean;
  isLocal: boolean;
  size: number;
}

export default function ParticipantTile({ participant, isSpeaking, isLocal, size }: Props) {
  const initials = participant.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const nameFontSize = size < 100 ? 'text-xs' : 'text-sm';
  const initialsSize = size < 100 ? 'text-sm' : size < 130 ? 'text-lg' : 'text-xl';
  const borderRadius = size * 0.18;

  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      <motion.div
        animate={{
          boxShadow: isSpeaking
            ? '0 0 0 3px #f59e0b, 0 0 18px 6px rgba(245,158,11,0.35)'
            : isLocal
            ? '0 0 0 2px rgba(139,92,246,0.7)'
            : '0 0 0 1px rgba(255,255,255,0.08)',
        }}
        transition={{ duration: 0.3 }}
        className={`relative bg-gradient-to-br ${participant.avatarColor} flex items-center justify-center overflow-hidden`}
        style={{ width: size, height: size, borderRadius }}
      >
        {/* Avatar (mock video) */}
        {participant.isVideoOff ? (
          <div className="absolute inset-0 bg-stone-800 flex items-center justify-center">
            <span className={`${initialsSize} font-bold text-stone-400`}>{initials}</span>
          </div>
        ) : (
          <span className={`${initialsSize} font-bold text-white/80 select-none`}>{initials}</span>
        )}

        {/* Muted badge */}
        {participant.isMuted && (
          <div className="absolute bottom-1 left-1 bg-red-600/90 rounded-full p-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.707 5.293a1 1 0 00-1.414 1.414L6.586 9H4a1 1 0 000 2h2.586l-2.293 2.293a1 1 0 101.414 1.414L10 10.414l4.293 4.293a1 1 0 001.414-1.414L13.414 11H16a1 1 0 000-2h-2.586l2.293-2.293a1 1 0 00-1.414-1.414L10 9.586 5.707 5.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* Mood badge */}
        {participant.mood && (
          <div
            className="absolute -top-1 -right-1 bg-stone-900/90 rounded-full flex items-center justify-center border border-stone-700"
            style={{ width: 22, height: 22, fontSize: 13 }}
          >
            {participant.mood}
          </div>
        )}

        {/* Hand raised */}
        {participant.handRaised && (
          <div
            className="absolute -top-1 -left-1 animate-hand-pulse"
            style={{ fontSize: 16, lineHeight: 1 }}
          >
            ✋
          </div>
        )}
      </motion.div>

      {/* Name */}
      <div
        className={`mt-1 ${nameFontSize} text-stone-300 font-medium truncate text-center`}
        style={{ maxWidth: size, paddingLeft: 4, paddingRight: 4 }}
      >
        {isLocal ? 'You' : participant.name}
      </div>
    </div>
  );
}
