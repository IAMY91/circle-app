'use client';

import { useEffect, useMemo, useState } from 'react';
import CircleRoom from '@/components/circle/CircleRoom';
import { CentralElement, Theme } from '@/types';

type Stage = 'login' | 'landing' | 'join' | 'room';

const PALETTES: { id: Theme; colors: string[]; label: string }[] = [
  { id: 'water', label: 'Water', colors: ['#22d3ee', '#38bdf8', '#818cf8', '#a78bfa', '#c084fc'] },
  { id: 'forest', label: 'Forest', colors: ['#22c55e', '#4ade80', '#84cc16', '#65a30d', '#166534'] },
  { id: 'rose', label: 'Rose', colors: ['#fb7185', '#f472b6', '#ec4899', '#db2777', '#be185d'] },
  { id: 'midnight', label: 'Midnight', colors: ['#6366f1', '#818cf8', '#a5b4fc', '#4338ca', '#1e1b4b'] },
];

const SYMBOLS: { symbol: string; central: CentralElement; label: string }[] = [
  { symbol: '🔥', central: 'fire', label: 'Fire focus' },
  { symbol: '🕯️', central: 'candle', label: 'Candle focus' },
  { symbol: '🌿', central: 'altar', label: 'Altar focus' },
];

export default function Home() {
  const [stage, setStage] = useState<Stage>('login');
  const [name, setName] = useState('');
  const [spaceId, setSpaceId] = useState(`circle-${Math.random().toString(36).slice(2, 7)}`);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [theme, setTheme] = useState<Theme>('water');
  const [symbol, setSymbol] = useState<string>('🔥');
  const [centralElement, setCentralElement] = useState<CentralElement>('fire');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invitedSpace = params.get('space');
    if (invitedSpace) {
      setSpaceId(invitedSpace);
      setStage('join');
    }
  }, []);

  const inviteLink = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/?space=${spaceId}`;
  }, [spaceId]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const openRoom = () => {
    window.history.replaceState({}, '', `/?space=${spaceId}`);
    setStage('room');
  };

  if (stage === 'room') {
    return (
      <CircleRoom
        localName={name || 'Guest'}
        initialMicOn={micOn}
        initialCameraOn={cameraOn}
        spaceId={spaceId}
        initialTheme={theme}
        initialCentralElement={centralElement}
        symbol={symbol}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-fuchsia-950 text-stone-100 p-6 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 backdrop-blur-md bg-black/25 p-6 md:p-10 shadow-2xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-cyan-300/80 mb-3">
            <span>{symbol}</span>
            <span>Circle Live</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
            {stage === 'login' && 'Sign in to your Circle'}
            {stage === 'landing' && 'Prepare your landing room'}
            {stage === 'join' && 'Join the shared circle'}
          </h1>
          <p className="text-stone-300 mt-3">
            {stage === 'join'
              ? `You were invited to ${spaceId}. Enter your name to join instantly.`
              : 'Fast setup, smooth entry, and a real shared room experience.'}
          </p>
        </div>

        {stage === 'login' && (
          <div className="space-y-4 max-w-xl">
            <label className="block">
              <span className="text-sm text-stone-300">Display name</span>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" className="mt-2 w-full bg-stone-900/70 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60" />
            </label>
            <button onClick={() => setStage('landing')} disabled={!name.trim()} className="disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-400 hover:bg-cyan-300 text-black px-5 py-3 rounded-xl font-semibold">
              Continue to landing page
            </button>
          </div>
        )}

        {stage === 'join' && (
          <div className="space-y-4 max-w-xl">
            <label className="block">
              <span className="text-sm text-stone-300">Your name</span>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" className="mt-2 w-full bg-stone-900/70 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60" />
            </label>
            <button onClick={openRoom} disabled={!name.trim()} className="disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-400 hover:bg-cyan-300 text-black px-5 py-3 rounded-xl font-semibold">
              Join circle room
            </button>
          </div>
        )}

        {stage === 'landing' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm text-stone-300">Your name</span>
                <input value={name} onChange={e => setName(e.target.value)} className="mt-2 w-full bg-stone-900/70 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-400/60" />
              </label>
              <label className="block">
                <span className="text-sm text-stone-300">Space ID</span>
                <input value={spaceId} onChange={e => setSpaceId(e.target.value)} className="mt-2 w-full bg-stone-900/70 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-400/60" />
              </label>
              <div className="flex items-center justify-between bg-stone-900/70 border border-white/10 rounded-xl px-4 py-3">
                <span>Mic</span>
                <button onClick={() => setMicOn(v => !v)} className={`px-3 py-1 rounded-full text-sm ${micOn ? 'bg-emerald-500 text-black' : 'bg-stone-700'}`}>{micOn ? 'On' : 'Off'}</button>
              </div>
              <div className="flex items-center justify-between bg-stone-900/70 border border-white/10 rounded-xl px-4 py-3">
                <span>Camera</span>
                <button onClick={() => setCameraOn(v => !v)} className={`px-3 py-1 rounded-full text-sm ${cameraOn ? 'bg-emerald-500 text-black' : 'bg-stone-700'}`}>{cameraOn ? 'On' : 'Off'}</button>
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={copyLink} className="bg-stone-800 hover:bg-stone-700 px-4 py-3 rounded-xl text-sm">Copy share link</button>
                {copied && <span className="text-emerald-300 text-sm">Copied ✓</span>}
                <button onClick={openRoom} className="bg-fuchsia-400 hover:bg-fuchsia-300 text-black px-4 py-3 rounded-xl font-semibold">Open space</button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 p-4 bg-black/20 space-y-4">
              <div>
                <h2 className="font-semibold mb-2">Landing palette (click to apply)</h2>
                <div className="space-y-2">
                  {PALETTES.map(p => (
                    <button key={p.id} onClick={() => setTheme(p.id)} className={`w-full p-2 rounded-xl border ${theme === p.id ? 'border-cyan-300' : 'border-white/10'}`}>
                      <div className="flex items-center justify-between text-xs mb-1"><span>{p.label}</span>{theme === p.id && <span>Selected</span>}</div>
                      <div className="grid grid-cols-5 gap-1">
                        {p.colors.map(color => <div key={color} className="h-6 rounded-md" style={{ backgroundColor: color }} />)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-semibold mb-2">Symbols (click to apply)</h2>
                <div className="grid grid-cols-3 gap-2">
                  {SYMBOLS.map(s => (
                    <button
                      key={s.symbol}
                      onClick={() => {
                        setSymbol(s.symbol);
                        setCentralElement(s.central);
                      }}
                      className={`p-3 rounded-xl border ${symbol === s.symbol ? 'border-cyan-300 bg-cyan-400/10' : 'border-white/10 bg-stone-900/50'}`}
                    >
                      <div className="text-2xl">{s.symbol}</div>
                      <div className="text-xs text-stone-300 mt-1">{s.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-sm text-stone-300 break-all">Invite link: {inviteLink}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
