'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CentralElement, Theme } from '@/types';
import TimerPanel from './TimerPanel';
import Soundboard from './Soundboard';
import TensionBarometer from './TensionBarometer';
import VibeQuadrant from './VibeQuadrant';

interface Props {
  isOpen: boolean;
  centralElement: CentralElement;
  timerSeconds: number;
  timerRunning: boolean;
  avgTension: number;
  handQueue: { id: string; name: string }[];
  theme: Theme;
  isCircleSealed: boolean;
  isPassingStickMode: boolean;
  vibeX: number;
  vibeY: number;
  onSetCentralElement: (el: CentralElement) => void;
  onStartTimer: (seconds: number) => void;
  onPauseTimer: () => void;
  onResetTimer: () => void;
  onLowerHand: (id: string) => void;
  onSetTheme: (t: Theme) => void;
  onToggleSeal: () => void;
  onPassStick: () => void;
  onDrawOracleCard: () => void;
}

export default function FacilitatorSidebar({
  isOpen,
  centralElement,
  timerSeconds,
  timerRunning,
  avgTension,
  handQueue,
  theme,
  isCircleSealed,
  isPassingStickMode,
  vibeX,
  vibeY,
  onSetCentralElement,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onLowerHand,
  onSetTheme,
  onToggleSeal,
  onPassStick,
  onDrawOracleCard,
}: Props) {
  const section = 'text-xs uppercase tracking-wider text-stone-500 mb-2';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="fixed right-0 top-0 bottom-16 w-72 bg-stone-900/98 backdrop-blur-md border-l border-stone-800 overflow-y-auto z-30 flex flex-col"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-stone-800 flex-shrink-0 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-stone-300">Facilitator Controls</div>
              <div className="text-xs text-stone-600 mt-0.5">Visible only to you</div>
            </div>
            {isCircleSealed && (
              <div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-900/30 px-2 py-1 rounded-full border border-amber-700/50">
                🔒 Sealed
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">

            {/* ── Circle Flow ─────────────────────────────────── */}
            <div>
              <h3 className={section}>Circle Flow</h3>
              <div className="space-y-2">
                {/* Talking Stick */}
                <button
                  onClick={onPassStick}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    isPassingStickMode
                      ? 'bg-amber-500 text-stone-900 shadow-lg shadow-amber-900/40'
                      : 'bg-amber-800/60 hover:bg-amber-700/60 text-amber-200 border border-amber-700/50'
                  }`}
                >
                  🪵 {isPassingStickMode ? 'Click a participant…' : 'Pass Talking Stick'}
                </button>
              </div>
            </div>

            <hr className="border-stone-800" />

            {/* ── Center Element ──────────────────────────────── */}
            <div>
              <h3 className={section}>Center Element</h3>
              <div className="flex gap-1.5">
                {(['fire', 'candle', 'altar'] as CentralElement[]).map(el => {
                  const icons = { fire: '🔥', candle: '🕯️', altar: '🌸' };
                  return (
                    <button
                      key={el}
                      onClick={() => onSetCentralElement(el)}
                      className={`flex-1 py-2 rounded-lg text-sm capitalize transition-colors flex items-center justify-center gap-1 ${
                        centralElement === el
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-700 hover:bg-stone-600 text-stone-300'
                      }`}
                    >
                      <span>{icons[el]}</span>
                      <span className="text-xs">{el}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-stone-800" />

            {/* ── Timer ──────────────────────────────────────── */}
            <TimerPanel
              timerSeconds={timerSeconds}
              timerRunning={timerRunning}
              onStart={onStartTimer}
              onPause={onPauseTimer}
              onReset={onResetTimer}
            />

            <hr className="border-stone-800" />

            {/* ── Soundboard ─────────────────────────────────── */}
            <Soundboard />

            <hr className="border-stone-800" />

            {/* ── Sensory & Ritual ───────────────────────────── */}
            <div>
              <h3 className={section}>Sensory &amp; Ritual</h3>
              <div className="grid grid-cols-2 gap-2">
                {/* Oracle Card */}
                <button
                  onClick={onDrawOracleCard}
                  className="col-span-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-amber-700 rounded-lg px-3 py-2.5 text-sm text-stone-200 flex items-center gap-2 transition-all"
                >
                  <span>🎴</span>
                  <span>Pull Oracle Card</span>
                </button>

                {/* Theme toggle */}
                <button
                  onClick={() => onSetTheme(theme === 'earth' ? 'water' : 'earth')}
                  className={`bg-stone-700 hover:bg-stone-600 rounded-lg px-3 py-2 text-sm flex items-center gap-1.5 transition-colors ${
                    theme === 'water' ? 'text-cyan-300' : 'text-stone-200'
                  }`}
                >
                  <span>{theme === 'water' ? '🔥' : '💧'}</span>
                  <span>{theme === 'water' ? 'Earth' : 'Water'}</span>
                </button>

                {/* Music placeholder */}
                <button
                  disabled
                  className="bg-stone-800 rounded-lg px-3 py-2 text-xs text-stone-600 flex items-center gap-1.5 cursor-not-allowed"
                >
                  <span>🎵</span>
                  <span>Spotify</span>
                  <span className="text-stone-700 text-xs">soon</span>
                </button>
              </div>
            </div>

            <hr className="border-stone-800" />

            {/* ── Vibe Check ─────────────────────────────────── */}
            <VibeQuadrant vibeX={vibeX} vibeY={vibeY} />

            <hr className="border-stone-800" />

            {/* ── Group Energy + Hand Queue ──────────────────── */}
            <TensionBarometer
              value={avgTension}
              handQueue={handQueue}
              onLowerHand={onLowerHand}
            />

            <hr className="border-stone-800" />

            {/* ── Safety ─────────────────────────────────────── */}
            <div>
              <h3 className={section}>Safety</h3>
              <button
                onClick={onToggleSeal}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isCircleSealed
                    ? 'bg-amber-700/40 text-amber-200 border border-amber-600'
                    : 'bg-stone-800 hover:bg-stone-700 text-red-400 border border-red-900/50 hover:border-red-700'
                }`}
              >
                {isCircleSealed ? '🔓 Unseal the Circle' : '🔒 Seal the Circle'}
              </button>
              {isCircleSealed && (
                <p className="text-xs text-amber-700 mt-1.5 text-center">
                  Late-joiners are blocked
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
