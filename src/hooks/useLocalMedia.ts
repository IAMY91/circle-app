'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

export interface LocalMedia {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  isMuted: boolean;
  isVideoOff: boolean;
  hasPermission: boolean | null; // null = not yet requested
  permissionError: string | null;
  toggleMute: () => void;
  toggleVideo: () => void;
}

export function useLocalMedia(initialMuted = false, initialVideoOff = false): LocalMedia {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isVideoOff, setIsVideoOff] = useState(initialVideoOff);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(s => {
        if (cancelled) { s.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = s;
        setStream(s);
        setHasPermission(true);
        // Apply initial preferences
        s.getAudioTracks().forEach(t => { t.enabled = !initialMuted; });
        s.getVideoTracks().forEach(t => { t.enabled = !initialVideoOff; });
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(err => {
        if (cancelled) return;
        setHasPermission(false);
        setPermissionError(
          err.name === 'NotAllowedError'
            ? 'Camera/mic access was denied. Check browser permissions.'
            : err.message || 'Could not access camera or microphone.'
        );
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  // intentionally run once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Attach stream whenever videoRef becomes available
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      streamRef.current?.getAudioTracks().forEach(t => { t.enabled = !next; });
      return next;
    });
  }, []);

  const toggleVideo = useCallback(() => {
    setIsVideoOff(prev => {
      const next = !prev;
      streamRef.current?.getVideoTracks().forEach(t => { t.enabled = !next; });
      return next;
    });
  }, []);

  return { videoRef, stream, isMuted, isVideoOff, hasPermission, permissionError, toggleMute, toggleVideo };
}
