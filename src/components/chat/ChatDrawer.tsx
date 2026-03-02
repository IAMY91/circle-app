'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/types';

interface Props {
  isOpen: boolean;
  messages: ChatMessage[];
  localName: string;
  onSend: (text: string) => void;
  onClose: () => void;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatDrawer({ isOpen, messages, localName, onSend, onClose }: Props) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="fixed left-0 top-0 bottom-16 w-80 bg-stone-900/98 backdrop-blur-md border-r border-stone-800 flex flex-col z-30"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800 flex-shrink-0">
            <div>
              <div className="text-sm font-semibold text-stone-300">Circle Chat</div>
              <div className="text-xs text-stone-600">Group only · No direct messages</div>
            </div>
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-stone-300 transition-colors text-xl leading-none w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-800"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-stone-600 text-sm mt-10 space-y-1">
                <div style={{ fontSize: 32 }}>💬</div>
                <div>No messages yet</div>
                <div className="text-stone-700">Say something to the circle...</div>
              </div>
            )}
            {messages.map(msg => {
              const isOwn = msg.name === localName;
              return (
                <div key={msg.id} className={isOwn ? 'text-right' : ''}>
                  <div
                    className={`flex items-baseline gap-2 mb-0.5 ${isOwn ? 'justify-end' : ''}`}
                  >
                    <span className="text-xs font-semibold text-amber-400">{msg.name}</span>
                    <span className="text-xs text-stone-600">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div
                    className={`text-sm text-stone-100 rounded-xl px-3 py-2 inline-block max-w-[90%] text-left ${
                      isOwn ? 'bg-amber-600/80' : 'bg-stone-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-stone-800 flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Message the circle..."
              className="flex-1 bg-stone-800 rounded-xl px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:ring-1 focus:ring-amber-500/50 min-w-0"
            />
            <button
              onClick={send}
              className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl px-3 py-2 text-sm font-medium transition-colors flex-shrink-0"
            >
              Send
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
