'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/types';

interface Props {
  isOpen: boolean;
  messages: ChatMessage[];
  localName: string;
  onSend: (text: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  onClose: () => void;
}

const REACTION_EMOJIS = ['💛', '🙏', '🔥', '💙', '😢', '🤗', '✨', '💪', '🌿', '🌊'];
const INPUT_EMOJIS = ['🌿', '🔥', '💛', '🙏', '✨', '🌊', '💙', '🌸', '🦋', '🌕', '😊', '🥲'];

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function parseMarkdown(text: string): React.ReactNode[] {
  const segments = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|https?:\/\/\S+)/);
  return segments
    .map((seg, i) => {
      if (seg.startsWith('**') && seg.endsWith('**') && seg.length > 4)
        return <strong key={i} className="font-semibold text-stone-100">{seg.slice(2, -2)}</strong>;
      if (seg.startsWith('*') && seg.endsWith('*') && seg.length > 2 && !seg.startsWith('**'))
        return <em key={i} className="italic text-stone-200">{seg.slice(1, -1)}</em>;
      if (seg.startsWith('`') && seg.endsWith('`') && seg.length > 2)
        return <code key={i} className="bg-stone-700 px-1 rounded text-amber-200 font-mono text-xs">{seg.slice(1, -1)}</code>;
      if (seg.match(/^https?:\/\//))
        return <a key={i} href={seg} target="_blank" rel="noopener noreferrer" className="text-sky-400 underline break-all">{seg}</a>;
      return seg || null;
    })
    .filter(n => n !== null && n !== '') as React.ReactNode[];
}

export default function ChatDrawer({ isOpen, messages, localName, onSend, onReact, onClose }: Props) {
  const [input, setInput] = useState('');
  const [pickerOpenId, setPickerOpenId] = useState<string | null>(null);
  const [showEmojiInput, setShowEmojiInput] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput('');
    setShowEmojiInput(false);
  };

  const appendEmoji = (emoji: string) => {
    setInput(prev => prev + emoji);
    inputRef.current?.focus();
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
              <div className="text-xs text-stone-600">
                {messages.length > 0 ? `${messages.length} messages · group only` : 'Group only · No direct messages'}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-stone-300 transition-colors w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-800 text-xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-3 space-y-3"
            onClick={() => { setPickerOpenId(null); setShowEmojiInput(false); }}
          >
            {messages.length === 0 && (
              <div className="text-center text-stone-600 text-sm mt-10 space-y-1">
                <div style={{ fontSize: 32 }}>💬</div>
                <div>No messages yet</div>
                <div className="text-stone-700">Say something to the circle…</div>
              </div>
            )}

            {messages.map(msg => {
              const isOwn = msg.name === localName;
              const isSystem = msg.participantId === 'system';
              const hasReactions = msg.reactions && Object.keys(msg.reactions).length > 0;

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center py-1 space-y-1">
                    <div className="inline-block text-xs text-stone-500 italic bg-stone-900/60 border border-stone-800 px-3 py-1.5 rounded-full">
                      {parseMarkdown(msg.text)}
                    </div>
                    {hasReactions && (
                      <div className="flex justify-center gap-1 flex-wrap">
                        {Object.entries(msg.reactions!).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            onClick={e => { e.stopPropagation(); onReact(msg.id, emoji); }}
                            className="text-xs bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-full px-2 py-0.5 flex items-center gap-0.5 transition-colors"
                          >
                            <span>{emoji}</span><span className="text-stone-500">{count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`group ${isOwn ? 'text-right' : ''}`}>
                  {/* Name + time */}
                  <div className={`flex items-baseline gap-2 mb-0.5 ${isOwn ? 'justify-end' : ''}`}>
                    <span className="text-xs font-semibold accent-text">{msg.name}</span>
                    <span className="text-xs text-stone-600">{formatTime(msg.timestamp)}</span>
                  </div>

                  {/* Bubble row */}
                  <div className={`relative inline-flex flex-col items-${isOwn ? 'end' : 'start'} max-w-[90%]`}>
                    <div className="relative">
                      <div
                        className="text-sm text-stone-100 rounded-xl px-3 py-2 inline-block text-left leading-relaxed"
                        style={isOwn ? { backgroundColor: 'var(--accent-dark)' } : { backgroundColor: 'rgb(41 37 36)' /* stone-800 */ }}
                      >
                        {parseMarkdown(msg.text)}
                      </div>

                      {/* "+" reaction trigger */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setPickerOpenId(pickerOpenId === msg.id ? null : msg.id);
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-stone-700 border border-stone-600 text-stone-400 hover:text-stone-200 hover:bg-stone-600 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Add reaction"
                      >
                        +
                      </button>

                      {/* Reaction picker */}
                      <AnimatePresence>
                        {pickerOpenId === msg.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 4 }}
                            transition={{ duration: 0.12 }}
                            className={`absolute ${isOwn ? 'right-0' : 'left-0'} -top-10 z-10 bg-stone-800 border border-stone-700 rounded-xl p-1.5 shadow-xl flex gap-0.5`}
                            onClick={e => e.stopPropagation()}
                          >
                            {REACTION_EMOJIS.map(emoji => (
                              <button
                                key={emoji}
                                onClick={() => { onReact(msg.id, emoji); setPickerOpenId(null); }}
                                className="w-7 h-7 hover:bg-stone-700 rounded-lg flex items-center justify-center text-base transition-all hover:scale-125"
                                title={emoji}
                              >
                                {emoji}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Reaction pills */}
                    {hasReactions && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {Object.entries(msg.reactions!).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            onClick={e => { e.stopPropagation(); onReact(msg.id, emoji); }}
                            className="text-xs bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-full px-2 py-0.5 flex items-center gap-0.5 transition-colors"
                          >
                            <span>{emoji}</span><span className="text-stone-500">{count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Emoji input panel */}
          <AnimatePresence>
            {showEmojiInput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden border-t border-stone-800 flex-shrink-0"
              >
                <div className="px-3 py-2 flex flex-wrap gap-1">
                  {INPUT_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => appendEmoji(emoji)}
                      className="w-8 h-8 hover:bg-stone-700 rounded-lg flex items-center justify-center text-lg transition-all hover:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input row */}
          <div className="px-3 py-3 border-t border-stone-800 flex gap-2 flex-shrink-0">
            <button
              onClick={e => { e.stopPropagation(); setShowEmojiInput(v => !v); }}
              className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-lg transition-colors ${
                showEmojiInput ? 'text-white' : 'bg-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-700'
              }`}
              style={showEmojiInput ? { backgroundColor: 'var(--accent-primary)' } : {}}
              title="Emoji"
            >
              😊
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
                if (e.key === 'Escape') { setShowEmojiInput(false); setPickerOpenId(null); }
              }}
              placeholder="Message the circle… (*bold*, `code`)"
              className="flex-1 bg-stone-800 rounded-xl px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none accent-ring-focus min-w-0"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-3 py-2 text-sm font-medium transition-colors flex-shrink-0"
            style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              Send
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
