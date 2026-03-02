'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CentralElement } from '@/types';
import TimerPanel from './TimerPanel';
import Soundboard from './Soundboard';
import TensionBarometer from './TensionBarometer';

interface Props {
  isOpen: boolean;
  centralElement: CentralElement;
  timerSeconds: number;
  timerRunning: boolean;
  avgTension: number;
  handQueue: { id: string; name: string }[];
  onSetCentralElement: (el: CentralElement) => void;
  onStartTimer: (seconds: number) => void;
  onPauseTimer: () => void;
  onResetTimer: () => void;
  onLowerHand: (id: string) => void;
}

export default function FacilitatorSidebar({
  isOpen,
  centralElement,
  timerSeconds,
  timerRunning,
  avgTension,
  handQueue,
  onSetCentralElement,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onLowerHand,
}: Props) {
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
          <div className="px-4 py-3 border-b border-stone-800 flex-shrink-0">
            <div className="text-sm font-semibold text-stone-300">Facilitator Controls</div>
            <div className="text-xs text-stone-600 mt-0.5">Visible only to you</div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Central element toggle */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-stone-500 mb-2">
                Center Element
              </h3>
              <div className="flex gap-2">
                {(['fire', 'candle'] as CentralElement[]).map(el => (
                  <button
                    key={el}
                    onClick={() => onSetCentralElement(el)}
                    className={`flex-1 py-2 rounded-lg text-sm capitalize transition-colors flex items-center justify-center gap-1.5 ${
                      centralElement === el
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-700 hover:bg-stone-600 text-stone-300'
                    }`}
                  >
                    <span>{el === 'fire' ? '🔥' : '🕯️'}</span>
                    {el}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-stone-800" />

            {/* Timer */}
            <TimerPanel
              timerSeconds={timerSeconds}
              timerRunning={timerRunning}
              onStart={onStartTimer}
              onPause={onPauseTimer}
              onReset={onResetTimer}
            />

            <hr className="border-stone-800" />

            {/* Soundboard */}
            <Soundboard />

            <hr className="border-stone-800" />

            {/* Tension + Hand Queue */}
            <TensionBarometer
              value={avgTension}
              handQueue={handQueue}
              onLowerHand={onLowerHand}
            />

            <hr className="border-stone-800" />

            {/* Spotify placeholder */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-stone-500 mb-2">Music</h3>
              <div className="bg-stone-800 rounded-xl p-4 text-center space-y-1">
                <div style={{ fontSize: 28 }}>🎵</div>
                <div className="text-sm text-stone-400 font-medium">Spotify Integration</div>
                <div className="text-xs text-stone-600">Coming in Phase 3</div>
                <button
                  disabled
                  className="mt-2 w-full py-1.5 bg-stone-700 text-stone-500 rounded-lg text-xs cursor-not-allowed"
                >
                  Connect Spotify
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
