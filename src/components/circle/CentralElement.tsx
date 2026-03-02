'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CentralElement as CentralElementType } from '@/types';

interface Props {
  type: CentralElementType;
  tensionLevel: number; // 0-100
}

function FireAnimation({ tensionLevel }: { tensionLevel: number }) {
  const scale = 1 + (tensionLevel / 100) * 0.35;
  return (
    <motion.div
      animate={{ scale }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="relative flex items-end justify-center"
      style={{ width: 110, height: 130 }}
    >
      {/* Ember glow */}
      <div
        className="absolute bottom-4 rounded-full"
        style={{
          width: 130,
          height: 60,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(255,100,0,0.35) 0%, transparent 70%)',
          filter: 'blur(12px)',
        }}
      />
      {/* Log base */}
      <div
        className="absolute bottom-0 rounded-sm"
        style={{
          width: 90,
          height: 14,
          background: 'linear-gradient(90deg, #3d1f00, #6b3a00, #3d1f00)',
          borderRadius: '2px',
        }}
      />
      {/* Flame layers — positioned relative to the log */}
      <div className="absolute flex items-end justify-center" style={{ bottom: 10, width: '100%' }}>
        {/* Base — wide, red */}
        <div
          className="flame-shape animate-fire-base absolute"
          style={{
            width: 70,
            height: 60,
            background:
              'radial-gradient(ellipse at 50% 90%, #cc2000 0%, #ff5500 55%, transparent 100%)',
          }}
        />
        {/* Mid — orange */}
        <div
          className="flame-shape animate-fire-mid absolute"
          style={{
            width: 50,
            height: 80,
            background:
              'radial-gradient(ellipse at 50% 85%, #ff5500 0%, #ffaa00 60%, transparent 100%)',
          }}
        />
        {/* Tip — yellow */}
        <div
          className="flame-shape animate-fire-tip absolute"
          style={{
            width: 28,
            height: 60,
            background:
              'radial-gradient(ellipse at 50% 80%, #ffe566 0%, #ffcc00 50%, transparent 100%)',
          }}
        />
      </div>
    </motion.div>
  );
}

function CandleAnimation({ tensionLevel }: { tensionLevel: number }) {
  return (
    <div className="relative flex flex-col items-center" style={{ height: 130 }}>
      {/* Flame */}
      <motion.div
        className="candle-flame flame-shape animate-candle-flicker"
        style={{ width: 24, height: 44 }}
      />
      {/* Glow halo */}
      <motion.div
        animate={{
          boxShadow: `0 0 ${18 + tensionLevel * 0.25}px ${6 + tensionLevel * 0.1}px rgba(255,170,50,0.4)`,
        }}
        transition={{ duration: 1 }}
        className="absolute rounded-full pointer-events-none"
        style={{ top: 0, width: 24, height: 44 }}
      />
      {/* Wax */}
      <div
        style={{
          width: 18,
          height: 72,
          background: 'linear-gradient(180deg, #f5e6c8 0%, #dcc888 100%)',
          borderRadius: '2px 2px 0 0',
          marginTop: 2,
        }}
      />
      {/* Base */}
      <div
        style={{
          width: 36,
          height: 6,
          background: '#c4a265',
          borderRadius: '0 0 4px 4px',
        }}
      />
    </div>
  );
}

export default function CentralElement({ type, tensionLevel }: Props) {
  const glowRadius = 20 + tensionLevel * 0.6;
  const glowSpread = 8 + tensionLevel * 0.25;
  const glowOpacity = 0.12 + tensionLevel * 0.004;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Tension-driven ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: `0 0 ${glowRadius}px ${glowSpread}px rgba(255,100,20,${glowOpacity})`,
        }}
        transition={{ duration: 1.5 }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={type}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="flex items-end justify-center"
        >
          {type === 'fire' ? (
            <FireAnimation tensionLevel={tensionLevel} />
          ) : (
            <CandleAnimation tensionLevel={tensionLevel} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
