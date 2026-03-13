'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useLocalMedia(initialAudioEnabled = true, initialVideoEnabled = true) {
  const streamRef = useRef<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(initialAudioEnabled);
  const [isVideoEnabled, setIsVideoEnabled] = useState(initialVideoEnabled);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const isAudioEnabledRef = useRef(initialAudioEnabled);
  const isVideoEnabledRef = useRef(initialVideoEnabled);

  useEffect(() => {
    isAudioEnabledRef.current = isAudioEnabled;
  }, [isAudioEnabled]);

  useEffect(() => {
    isVideoEnabledRef.current = isVideoEnabled;
  }, [isVideoEnabled]);

  const requestPermissions = useCallback(async () => {
    if (streamRef.current) {
      return streamRef.current;
    }

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
      });
      streamRef.current = localStream;
      setStream(localStream);
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isAudioEnabledRef.current;
      });
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoEnabledRef.current;
      });
      setError(null);
      return localStream;
    } catch (err) {
      console.error(err);
      setError('Could not access camera or microphone. Please allow permissions and retry.');
      return null;
    }
  }, []);

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
