'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useLocalMedia(initialAudioEnabled = true, initialVideoEnabled = true) {
  const streamRef = useRef<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(initialAudioEnabled);
  const [isVideoEnabled, setIsVideoEnabled] = useState(initialVideoEnabled);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const requestPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
      });
      streamRef.current = stream;
      setStream(stream);
      stream.getAudioTracks().forEach(track => {
        track.enabled = isAudioEnabled;
      });
      stream.getVideoTracks().forEach(track => {
        track.enabled = isVideoEnabled;
      });
      setError(null);
      return stream;
    } catch (err) {
      console.error(err);
      setError('Could not access camera or microphone. Please allow permissions and retry.');
      return null;
    }
  }, [isAudioEnabled, isVideoEnabled]);

  const stopAll = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => {
      const next = !prev;
      streamRef.current?.getAudioTracks().forEach(track => {
        track.enabled = next;
      });
      return next;
    });
  }, []);

  const toggleVideo = useCallback(() => {
    setIsVideoEnabled(prev => {
      const next = !prev;
      streamRef.current?.getVideoTracks().forEach(track => {
        track.enabled = next;
      });
      return next;
    });
  }, []);

  useEffect(() => stopAll, [stopAll]);

  return useMemo(
    () => ({
      stream,
      isAudioEnabled,
      isVideoEnabled,
      error,
      requestPermissions,
      toggleAudio,
      toggleVideo,
      stopAll,
    }),
    [error, isAudioEnabled, isVideoEnabled, requestPermissions, stopAll, stream, toggleAudio, toggleVideo]
  );
}
