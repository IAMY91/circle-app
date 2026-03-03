'use client';

import { useState } from 'react';

function parseSpotifyUrl(raw: string): string | null {
  // Accepts full URLs or URIs like spotify:playlist:ID
  const match = raw.match(
    /open\.spotify\.com\/(playlist|album|track|artist|episode|show)\/([A-Za-z0-9]+)/
  );
  if (match) {
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
  }
  // Also accept spotify:type:id URIs
  const uri = raw.match(/spotify:(playlist|album|track|artist|episode|show):([A-Za-z0-9]+)/);
  if (uri) {
    return `https://open.spotify.com/embed/${uri[1]}/${uri[2]}?utm_source=generator&theme=0`;
  }
  return null;
}

export default function SpotifyEmbed() {
  const [inputUrl, setInputUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = () => {
    const url = parseSpotifyUrl(inputUrl.trim());
    if (url) {
      setEmbedUrl(url);
      setError(null);
    } else {
      setError('Paste a Spotify playlist, album, or track link.');
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-xs uppercase tracking-wider text-stone-500">Spotify</h3>

      {!embedUrl ? (
        <>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={inputUrl}
              onChange={e => { setInputUrl(e.target.value); setError(null); }}
              onKeyDown={e => e.key === 'Enter' && handleLoad()}
              placeholder="Paste Spotify link…"
              className="flex-1 bg-stone-700 rounded-lg px-2 py-1.5 text-xs text-stone-200 placeholder-stone-600 outline-none accent-ring-focus min-w-0"
            />
            <button
              onClick={handleLoad}
              className="px-3 py-1.5 rounded-lg text-xs text-white font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              Load
            </button>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <p className="text-[11px] text-stone-700">
            Paste any Spotify playlist, album, or track URL. Listeners need Spotify open in their browser.
          </p>
        </>
      ) : (
        <div className="space-y-1.5">
          <iframe
            src={embedUrl}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
            style={{ border: 'none', display: 'block' }}
            title="Spotify player"
          />
          <button
            onClick={() => { setEmbedUrl(null); setInputUrl(''); }}
            className="text-xs text-stone-600 hover:text-stone-400 transition-colors"
          >
            ← Change track
          </button>
        </div>
      )}
    </div>
  );
}
