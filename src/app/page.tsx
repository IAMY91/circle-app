'use client';

import { useMemo, useState } from 'react';
import CircleRoom from '@/components/circle/CircleRoom';

type Stage = 'login' | 'landing' | 'room';

export default function Home() {
  const [stage, setStage] = useState<Stage>('login');
  const [name, setName] = useState('');
  const [spaceId, setSpaceId] = useState(`circle-${Math.random().toString(36).slice(2, 7)}`);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const inviteLink = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/?space=${spaceId}`;
  }, [spaceId]);

  if (stage === 'room') {
    return (
      <CircleRoom
        localName={name || 'Guest'}
        initialMicOn={micOn}
        initialCameraOn={cameraOn}
        spaceId={spaceId}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-fuchsia-950 text-stone-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl border border-white/10 backdrop-blur-md bg-black/25 p-6 md:p-10 shadow-2xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-cyan-300/80 mb-3">
              <span>◉</span>
              <span>Circle Live</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              {stage === 'login' ? 'Sign in to your Circle' : 'Prepare your landing room'}
            </h1>
            <p className="text-stone-300 mt-3">
              {stage === 'login'
                ? 'A smooth, production-style welcome flow with guided setup.'
                : 'Set your name, media preferences, and shareable space link before you enter.'}
            </p>
          </div>

          {stage === 'login' ? (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm text-stone-300">Display name</span>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-2 w-full bg-stone-900/70 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
                />
              </label>
              <button
                onClick={() => setStage('landing')}
                disabled={!name.trim()}
                className="disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-400 hover:bg-cyan-300 text-black px-5 py-3 rounded-xl font-semibold"
              >
                Continue to landing page
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm text-stone-300">Your name</span>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="mt-2 w-full bg-stone-900/70 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-400/60"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-stone-300">Space ID</span>
                  <input
                    value={spaceId}
                    onChange={e => setSpaceId(e.target.value)}
                    className="mt-2 w-full bg-stone-900/70 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-400/60"
                  />
                </label>
                <div className="flex items-center justify-between bg-stone-900/70 border border-white/10 rounded-xl px-4 py-3">
                  <span>Mic</span>
                  <button
                    onClick={() => setMicOn(v => !v)}
                    className={`px-3 py-1 rounded-full text-sm ${micOn ? 'bg-emerald-500 text-black' : 'bg-stone-700'}`}
                  >
                    {micOn ? 'On' : 'Off'}
                  </button>
                </div>
                <div className="flex items-center justify-between bg-stone-900/70 border border-white/10 rounded-xl px-4 py-3">
                  <span>Camera</span>
                  <button
                    onClick={() => setCameraOn(v => !v)}
                    className={`px-3 py-1 rounded-full text-sm ${cameraOn ? 'bg-emerald-500 text-black' : 'bg-stone-700'}`}
                  >
                    {cameraOn ? 'On' : 'Off'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(inviteLink)}
                    className="bg-stone-800 hover:bg-stone-700 px-4 py-3 rounded-xl text-sm"
                  >
                    Copy share link
                  </button>
                  <button
                    onClick={() => setStage('room')}
                    className="bg-fuchsia-400 hover:bg-fuchsia-300 text-black px-4 py-3 rounded-xl font-semibold"
                  >
                    Open space
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 p-4 bg-black/20">
                <h2 className="font-semibold mb-3">Landing palette & symbols</h2>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {['#22d3ee', '#818cf8', '#c084fc', '#f472b6', '#fb7185'].map(color => (
                    <div key={color} className="h-10 rounded-lg" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div className="flex gap-3 text-2xl mb-4">
                  {['◉', '✦', '☾', '∞', '⟡'].map(sym => (
                    <span key={sym} className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center">
                      {sym}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-stone-300 break-all">Invite link: {inviteLink}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
