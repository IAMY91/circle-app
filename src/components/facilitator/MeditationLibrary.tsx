'use client';

import { useState, useRef, useEffect } from 'react';

interface Track {
  name: string;
  url: string;
}

export default function MeditationLibrary() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tracksRef = useRef(tracks);

  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  // Create single audio element on mount
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load + play when currentIndex changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || currentIndex === null) return;

    audio.src = tracksRef.current[currentIndex].url;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));

    const onTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentIndex(prev =>
        prev !== null && prev < tracksRef.current.length - 1 ? prev + 1 : null
      );
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [currentIndex]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newTracks = files.map(file => ({
      name: file.name.replace(/\.[^.]+$/, ''),
      url: URL.createObjectURL(file),
    }));
    setTracks(prev => [...prev, ...newTracks]);
    e.target.value = '';
  };

  const playTrack = (index: number) => {
    if (currentIndex === index) {
      // Toggle play/pause on same track
      if (isPlaying) audioRef.current?.pause();
      else audioRef.current?.play();
    } else {
      setCurrentIndex(index);
      setProgress(0);
      setDuration(0);
    }
  };

  const stop = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
    setCurrentIndex(null);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const fmt = (s: number) => {
    if (!isFinite(s) || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const currentTrack = currentIndex !== null ? tracks[currentIndex] : null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-wider text-stone-500">Meditation Library</h3>

      {/* Upload */}
      <label className="flex items-center gap-2 cursor-pointer bg-stone-800 hover:bg-stone-700 border border-dashed border-stone-600 hover:border-amber-700/60 rounded-lg px-3 py-2.5 transition-colors text-sm text-stone-400 hover:text-stone-300">
        <span>🎵</span>
        <span>Add audio files…</span>
        <span className="text-stone-600 text-xs ml-auto">.mp3 .wav .ogg</span>
        <input
          type="file"
          accept=".mp3,.wav,.ogg,.m4a"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {/* Now-playing panel */}
      {currentTrack && (
        <div className="bg-amber-900/20 border border-amber-800/40 rounded-xl p-3 space-y-2.5">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={() => playTrack(currentIndex!)}
              className="w-8 h-8 bg-amber-600 hover:bg-amber-500 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <rect x="5" y="4" width="3" height="12" rx="1" />
                  <rect x="12" y="4" width="3" height="12" rx="1" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" />
                </svg>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="text-xs text-amber-200 truncate font-medium">{currentTrack.name}</div>
              <div className="text-xs text-amber-800 mt-0.5">Playing for all ✦</div>
            </div>

            {/* Stop */}
            <button
              onClick={stop}
              className="w-6 h-6 rounded-full bg-stone-700 hover:bg-stone-600 flex items-center justify-center text-stone-400 hover:text-stone-200 transition-colors flex-shrink-0"
              title="Stop"
            >
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <rect x="4" y="4" width="12" height="12" rx="2" />
              </svg>
            </button>
          </div>

          {/* Seek bar */}
          <div
            className="h-1.5 bg-stone-700 rounded-full overflow-hidden cursor-pointer"
            onClick={seek}
            title="Seek"
          >
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${progress * 100}%`, transition: 'width 0.25s linear' }}
            />
          </div>
          <div className="flex justify-between text-xs text-stone-600">
            <span>{fmt(progress * duration)}</span>
            <span>{fmt(duration)}</span>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <span className="text-stone-600 text-sm">🔈</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1.5 accent-amber-500 cursor-pointer"
              title={`Volume: ${Math.round(volume * 100)}%`}
            />
            <span className="text-stone-600 text-sm">🔊</span>
          </div>
        </div>
      )}

      {/* Track list */}
      {tracks.length > 0 ? (
        <div className="space-y-1 max-h-44 overflow-y-auto pr-0.5">
          {tracks.map((track, i) => (
            <button
              key={i}
              onClick={() => playTrack(i)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                currentIndex === i
                  ? 'bg-amber-800/40 text-amber-200'
                  : 'bg-stone-800/60 hover:bg-stone-700 text-stone-400 hover:text-stone-200'
              }`}
            >
              <span className="text-base flex-shrink-0">
                {currentIndex === i && isPlaying ? '▶' : '♪'}
              </span>
              <span className="truncate flex-1">{track.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center text-stone-600 text-xs py-3 space-y-0.5">
          <div>No tracks yet</div>
          <div className="text-stone-700">Upload .mp3 or .wav files to play for all</div>
        </div>
      )}
    </div>
  );
}
