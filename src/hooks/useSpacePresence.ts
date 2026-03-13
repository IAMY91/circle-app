'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Participant } from '@/types';

const EMOJIS = ['🦊', '🦉', '🐬', '🦋', '🐢', '🦄', '🐝', '🐼', '🦁', '🐙'];
const COLORS = [
  'from-violet-500 to-purple-700',
  'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-700',
  'from-amber-500 to-orange-700',
  'from-sky-500 to-blue-700',
  'from-lime-500 to-green-700',
  'from-fuchsia-500 to-purple-700',
  'from-cyan-500 to-teal-700',
];

type PresenceMessage = {
  type: 'join' | 'update' | 'leave' | 'snapshot-request';
  participant?: Participant;
  id?: string;
};

function hash(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) h = (h << 5) - h + input.charCodeAt(i);
  return Math.abs(h);
}

function buildParticipant(
  id: string,
  name: string,
  isMuted: boolean,
  isVideoOff: boolean,
  isFacilitator = false
): Participant {
  const seed = hash(name || id);
  return {
    id,
    name,
    emoji: EMOJIS[seed % EMOJIS.length],
    avatarColor: COLORS[seed % COLORS.length],
    isMuted,
    isVideoOff,
    handRaised: false,
    mood: null,
    tensionInput: 30,
    isFacilitator,
  };
}

export function useSpacePresence(spaceId: string, name: string, initialMuted: boolean, initialVideoOff: boolean) {
  const localId = useRef(`u-${crypto.randomUUID()}`);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const [localParticipant, setLocalParticipant] = useState<Participant>(() =>
    buildParticipant(localId.current, name, initialMuted, initialVideoOff, true)
  );
  const [remoteParticipants, setRemoteParticipants] = useState<Record<string, Participant>>({});
  const lastSeenRef = useRef<Record<string, number>>({});
  const localRef = useRef(localParticipant);

  useEffect(() => {
    setLocalParticipant(prev => ({ ...prev, name, isFacilitator: true }));
    setLocalParticipant(prev => ({ ...prev, name }));
  }, [name]);

  useEffect(() => {
    localRef.current = localParticipant;
  }, [localParticipant]);

  const post = useCallback((message: PresenceMessage) => {
    channelRef.current?.postMessage(message);
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel(`circle-space-${spaceId}`);
    channelRef.current = channel;

    const markSeen = (id: string) => {
      lastSeenRef.current[id] = Date.now();
    };

    const onMessage = (event: MessageEvent<PresenceMessage>) => {
      const msg = event.data;
      if (!msg) return;

      if ((msg.type === 'join' || msg.type === 'update') && msg.participant) {
        if (msg.participant.id === localId.current) return;
        markSeen(msg.participant.id);
        setRemoteParticipants(prev => ({ ...prev, [msg.participant!.id]: msg.participant! }));

        if (msg.type === 'join') {
          post({ type: 'update', participant: localRef.current });
        }
      }

      if (msg.type === 'leave' && msg.id) {
        setRemoteParticipants(prev => {
          const next = { ...prev };
          delete next[msg.id!];
          return next;
        });
      }

      if (msg.type === 'snapshot-request') {
        post({ type: 'update', participant: localRef.current });
      }
    };

    channel.addEventListener('message', onMessage);
    post({ type: 'join', participant: localRef.current });
    post({ type: 'snapshot-request' });

    const pruneInterval = setInterval(() => {
      const now = Date.now();
      setRemoteParticipants(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(id => {
          if (now - (lastSeenRef.current[id] ?? 0) > 15000) {
            delete next[id];
          }
        });
        return next;
      });
    }, 4000);

    const heartbeat = setInterval(() => {
      post({ type: 'update', participant: localRef.current });
    }, 3000);

    const beforeUnload = () => {
      post({ type: 'leave', id: localId.current });
    };
    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      post({ type: 'leave', id: localId.current });
      clearInterval(pruneInterval);
      clearInterval(heartbeat);
      channel.removeEventListener('message', onMessage);
      channel.close();
      channelRef.current = null;
    };
  }, [post, spaceId]);

  useEffect(() => {
    post({ type: 'update', participant: localParticipant });
  }, [localParticipant, post]);

  const patchLocalParticipant = useCallback((patch: Partial<Participant>) => {
    setLocalParticipant(prev => ({ ...prev, ...patch, isFacilitator: true }));
    setLocalParticipant(prev => ({ ...prev, ...patch }));
  }, []);

  const participants = useMemo(
    () => [localParticipant, ...Object.values(remoteParticipants)],
    [localParticipant, remoteParticipants]
  );

  return {
    participants,
    localParticipant,
    localParticipantId: localParticipant.id,
    patchLocalParticipant,
  };
}
