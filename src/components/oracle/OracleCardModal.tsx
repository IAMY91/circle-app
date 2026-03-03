'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { OracleCard } from '@/types';

interface Props {
  card: OracleCard | null;
  onClose: () => void;
}

export default function OracleCardModal({ card, onClose }: Props) {
  return (
    <AnimatePresence>
      {card && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div
              className="pointer-events-auto flex flex-col items-center text-center p-8 rounded-2xl"
              style={{
                width: 280,
                background: 'linear-gradient(160deg, #1a1209 0%, #100b04 100%)',
                border: '2px solid #d4a853',
                boxShadow: '0 0 80px 20px rgba(0,0,0,0.9), 0 0 40px 4px rgba(212,168,83,0.25)',
              }}
            >
              {/* Top ornament */}
              <div className="w-full flex items-center gap-2 mb-6">
                <div className="flex-1 h-px bg-amber-800/60" />
                <span style={{ color: '#d4a853', fontSize: 12, letterSpacing: '0.1em' }}>SACRED CIRCLE</span>
                <div className="flex-1 h-px bg-amber-800/60" />
              </div>

              {/* Icon */}
              <div style={{ fontSize: 64, lineHeight: 1 }} className="mb-5">
                {card.icon}
              </div>

              {/* Title */}
              <div
                className="mb-3 font-bold tracking-wide"
                style={{ color: '#d4a853', fontSize: 22, fontFamily: 'Georgia, serif' }}
              >
                {card.title}
              </div>

              {/* Divider */}
              <div className="w-12 h-px bg-amber-800/60 mb-4" />

              {/* Message */}
              <p
                className="leading-relaxed"
                style={{
                  color: '#e6d8b8',
                  fontSize: 15,
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                }}
              >
                {card.text}
              </p>

              {/* Close */}
              <button
                onClick={onClose}
                className="mt-7 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: 'rgba(212,168,83,0.15)',
                  border: '1px solid rgba(212,168,83,0.4)',
                  color: '#d4a853',
                }}
                onMouseEnter={e =>
                  ((e.target as HTMLElement).style.background = 'rgba(212,168,83,0.3)')
                }
                onMouseLeave={e =>
                  ((e.target as HTMLElement).style.background = 'rgba(212,168,83,0.15)')
                }
              >
                Return to Circle
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
