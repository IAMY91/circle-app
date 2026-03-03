'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const AVATAR_OPTIONS = [
  '👩🏼‍💼', '👩🏾', '👩🏻', '🧔🏽', '🧕🏼', '🧑🏿',
  '🧑🏼', '👩🏻‍🦱', '🧑🏻‍🎨', '👨🏼‍🦳', '🧙🏽‍♀️', '🧘🏻',
];

// Stable fake room code for the prototype
const ROOM_CODE = 'circle-' + Math.random().toString(36).slice(2, 7);
const ROOM_LINK = typeof window !== 'undefined'
  ? `${window.location.origin}?room=${ROOM_CODE}`
  : `https://circle.app/join/${ROOM_CODE}`;

export interface LobbyResult {
  name: string;
  emoji: string;
  isMuted: boolean;
  isVideoOff: boolean;
}

interface Props {
  onJoin: (result: LobbyResult) => void;
}

// SVG sacred circle symbol
function CircleSymbol({ size = 72 }: { size?: number }) {
  const n = 8;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.43;
  const innerR = size * 0.14;

  const dots = Array.from({ length: n }, (_, i) => {
    const angle = (i * Math.PI * 2) / n - Math.PI / 2;
    return { x: cx + outerR * Math.cos(angle), y: cy + outerR * Math.sin(angle) };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="var(--accent-primary)" strokeWidth="0.8" opacity="0.35" />
      {/* Spokes */}
      {dots.map((d, i) => (
        <line key={i} x1={cx} y1={cy} x2={d.x} y2={d.y} stroke="var(--accent-primary)" strokeWidth="0.6" opacity="0.2" />
      ))}
      {/* Outer dots */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={2.2} fill="var(--accent-primary)" opacity="0.75" />
      ))}
      {/* Inner ring */}
      <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="var(--accent-primary)" strokeWidth="0.8" opacity="0.25" />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={3.5} fill="var(--accent-primary)" opacity="0.95" />
    </svg>
  );
}

export default function LobbyPage({ onJoin }: Props) {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(AVATAR_OPTIONS[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera preview
  const startPreview = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      stream.getAudioTracks().forEach(t => { t.enabled = !isMuted; });
      stream.getVideoTracks().forEach(t => { t.enabled = !isVideoOff; });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraError(null);
    } catch {
      setCameraError('Camera not available — you can still join without video.');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    startPreview();
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync track states when toggles change
  useEffect(() => {
    streamRef.current?.getAudioTracks().forEach(t => { t.enabled = !isMuted; });
  }, [isMuted]);

  useEffect(() => {
    streamRef.current?.getVideoTracks().forEach(t => { t.enabled = !isVideoOff; });
  }, [isVideoOff]);

  const handleCopy = () => {
    navigator.clipboard.writeText(ROOM_LINK).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleJoin = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    // Stop lobby preview — CircleRoom will start its own stream
    streamRef.current?.getTracks().forEach(t => t.stop());
    onJoin({ name: trimmedName, emoji: selectedEmoji, isMuted, isVideoOff });
  };

  const canJoin = name.trim().length > 0;

  return (
    <div
      className="min-h-screen w-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ background: '#080a10' }}
      data-theme="earth"
    >
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '140%',
          height: '140%',
          top: '-20%',
          left: '-20%',
          background: 'radial-gradient(circle at 50% 40%, rgba(var(--accent-glow), 0.09) 0%, transparent 55%)',
        }}
      />

      {/* Brand header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center mb-8 z-10"
      >
        <div className="mb-4" style={{ filter: 'drop-shadow(0 0 18px rgba(var(--accent-glow), 0.5))' }}>
          <CircleSymbol size={76} />
        </div>
        <h1
          className="text-stone-200 font-light mb-1"
          style={{ letterSpacing: '0.25em', fontSize: '1.1rem' }}
        >
          SACRED CIRCLE
        </h1>
        <p className="text-stone-600 text-xs" style={{ letterSpacing: '0.1em' }}>
          a space for presence and connection
        </p>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        className="w-full max-w-sm bg-stone-900/80 backdrop-blur-md border border-stone-800 rounded-2xl p-6 space-y-5 z-10 shadow-2xl"
      >
        {/* Name */}
        <div>
          <label className="text-xs uppercase tracking-wider text-stone-500 block mb-1.5">
            Your name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && canJoin && handleJoin()}
            placeholder="How shall we call you?"
            maxLength={32}
            autoFocus
            className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-200 placeholder-stone-600 outline-none accent-ring-focus transition-colors"
          />
        </div>

        {/* Avatar selection */}
        <div>
          <label className="text-xs uppercase tracking-wider text-stone-500 block mb-1.5">
            Choose your avatar
          </label>
          <div className="grid grid-cols-6 gap-1.5">
            {AVATAR_OPTIONS.map(emoji => (
              <button
                key={emoji}
                onClick={() => setSelectedEmoji(emoji)}
                className="w-full aspect-square rounded-xl flex items-center justify-center text-xl transition-all bg-stone-800 hover:bg-stone-700"
                style={selectedEmoji === emoji ? {
                  outline: '2px solid var(--accent-primary)',
                  outlineOffset: '2px',
                  background: 'rgba(255,255,255,0.06)',
                } : {}}
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Camera preview */}
        <div>
          <label className="text-xs uppercase tracking-wider text-stone-500 block mb-1.5">
            Preview
          </label>
          <div
            className="relative w-full rounded-xl overflow-hidden bg-stone-800 border border-stone-700/50"
            style={{ aspectRatio: '4/3' }}
          >
            {/* Video element (always in DOM so ref is ready) */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ display: isVideoOff || cameraError ? 'none' : 'block' }}
            />

            {/* Avatar overlay when video is off or unavailable */}
            {(isVideoOff || cameraError) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span style={{ fontSize: 52 }}>{selectedEmoji}</span>
                {cameraError && (
                  <span className="text-xs text-stone-600 text-center px-4">{cameraError}</span>
                )}
              </div>
            )}

            {/* Muted badge overlay */}
            {isMuted && (
              <div className="absolute bottom-2 left-2 bg-red-600/90 rounded-full px-2 py-0.5 text-xs text-white flex items-center gap-1">
                🔇 Muted
              </div>
            )}
          </div>

          {/* Toggle controls */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setIsMuted(v => !v)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${
                isMuted
                  ? 'bg-red-600/80 text-white'
                  : 'bg-stone-700 hover:bg-stone-600 text-stone-200'
              }`}
            >
              {isMuted ? '🔇' : '🎤'}
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>
            <button
              onClick={() => setIsVideoOff(v => !v)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${
                isVideoOff
                  ? 'bg-red-600/80 text-white'
                  : 'bg-stone-700 hover:bg-stone-600 text-stone-200'
              }`}
            >
              {isVideoOff ? '📵' : '📹'}
              <span>{isVideoOff ? 'Camera off' : 'Camera on'}</span>
            </button>
          </div>
        </div>

        {/* Room link */}
        <div>
          <label className="text-xs uppercase tracking-wider text-stone-500 block mb-1.5">
            Invite link
          </label>
          <div className="flex items-center gap-2 bg-stone-800 border border-stone-700/50 rounded-xl px-3 py-2">
            <span className="flex-1 text-xs text-stone-500 truncate font-mono">{ROOM_LINK}</span>
            <button
              onClick={handleCopy}
              className="text-xs px-2 py-1 rounded-lg transition-all flex-shrink-0"
              style={copied
                ? { backgroundColor: 'var(--accent-primary)', color: '#0c0a09' }
                : { background: 'rgb(68 64 60)', color: 'rgb(214 211 209)' }
              }
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Join button */}
        <button
          onClick={handleJoin}
          disabled={!canJoin}
          className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--accent-primary)', color: '#0c0a09' }}
        >
          Enter the Circle →
        </button>
      </motion.div>

      {/* Subtle footer */}
      <p className="text-stone-700 text-xs mt-6 z-10">
        Your presence is the gift.
      </p>
    </div>
  );
}
