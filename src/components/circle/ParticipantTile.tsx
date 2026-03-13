'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Participant } from '@/types';

interface Props {
  participant: Participant;
  isSpeaking: boolean;
  isLocal: boolean;
  hasTalkingStick: boolean;
  isPassingStickMode: boolean;
  size: number;
  localStream?: MediaStream | null;
  onClick?: () => void;
}

export default function ParticipantTile({
  participant,
  isSpeaking,
  isLocal,
  hasTalkingStick,
  isPassingStickMode,
  size,
  localStream,
  onClick,
}: Props) {
  const nameFontSize = size < 100 ? 'text-xs' : 'text-sm';
  const emojiSize = size < 100 ? 28 : size < 130 ? 36 : 44;
  const borderRadius = size * 0.18;
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isLocal && localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [isLocal, localStream]);

  const shadow = hasTalkingStick
    ? '0 0 0 3px #d4a853, 0 0 22px 8px rgba(212,168,83,0.5)'
    : isSpeaking
      ? '0 0 0 3px #58a6ff, 0 0 18px 6px rgba(88,166,255,0.35)'
      : isLocal
        ? '0 0 0 2px rgba(139,92,246,0.7)'
        : '0 0 0 1px rgba(255,255,255,0.08)';

  const canReceiveStick = isPassingStickMode && !isLocal;
  const hasLocalVideo = isLocal && !participant.isVideoOff && !!localStream;

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ width: size, cursor: canReceiveStick ? 'cell' : 'default' }}
      onClick={canReceiveStick ? onClick : undefined}
    >
      {hasTalkingStick && (
        <div
          className="absolute -top-5 text-center select-none"
          style={{ fontSize: 16, lineHeight: 1, color: '#d4a853' }}
          title="Holding the talking stick"
        >
          🪵
        </div>
      )}

      <motion.div
        animate={{ boxShadow: shadow }}
        transition={{ duration: 0.3 }}
        whileHover={canReceiveStick ? { scale: 1.06 } : {}}
        className={`relative bg-gradient-to-br ${participant.avatarColor} flex items-center justify-center overflow-hidden`}
        style={{ width: size, height: size, borderRadius }}
      >
        {hasLocalVideo ? (
          <video
            ref={localVideoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
        ) : participant.isVideoOff ? (
          <div className="absolute inset-0 bg-stone-800 flex items-center justify-center">
            <span style={{ fontSize: emojiSize * 0.7, lineHeight: 1 }} className="select-none">
              {participant.emoji}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: emojiSize, lineHeight: 1 }} className="select-none">
            {participant.emoji}
          </span>
        )}

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

        {participant.mood && (
          <div
            className="absolute -top-1 -right-1 bg-stone-900/90 rounded-full flex items-center justify-center border border-stone-700"
            style={{ width: 22, height: 22, fontSize: 13 }}
          >
            {participant.mood}
          </div>
        )}

        {participant.handRaised && (
          <div className="absolute -top-1 -left-1 animate-hand-pulse" style={{ fontSize: 16, lineHeight: 1 }}>
            ✋
          </div>
        )}

        {canReceiveStick && (
          <div className="absolute inset-0 rounded-[inherit] border-2 border-amber-400/60 pointer-events-none" />
        )}
      </motion.div>

      <div
        className={`mt-1 ${nameFontSize} font-medium truncate text-center ${
          hasTalkingStick ? 'text-amber-300' : 'text-stone-300'
        }`}
        style={{ maxWidth: size, paddingLeft: 4, paddingRight: 4 }}
      >
        {isLocal ? 'You' : participant.name}
      </div>
    </div>
  );
}
