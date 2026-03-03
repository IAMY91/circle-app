'use client';

import { useState } from 'react';
import LobbyPage, { LobbyResult } from '@/components/lobby/LobbyPage';
import CircleRoom from '@/components/circle/CircleRoom';

export default function Home() {
  const [identity, setIdentity] = useState<LobbyResult | null>(null);

  if (!identity) {
    return <LobbyPage onJoin={setIdentity} />;
  }

  return (
    <CircleRoom
      localName={identity.name}
      localEmoji={identity.emoji}
      initialMuted={identity.isMuted}
      initialVideoOff={identity.isVideoOff}
    />
  );
}
