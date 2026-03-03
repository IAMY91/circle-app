'use client';

import { useRef, useState, useEffect } from 'react';
import { Participant, CentralElement } from '@/types';
import { getCirclePositions, getTileSize } from '@/lib/circleLayout';
import ParticipantTile from './ParticipantTile';
import CentralElementComponent from './CentralElement';

interface Props {
  participants: Participant[];
  activeSpeakerId: string | null;
  localParticipantId: string;
  centralElement: CentralElement;
  avgTension: number;
  talkingStickHolderId: string | null;
  isPassingStickMode: boolean;
  onTileClick: (participantId: string) => void;
  localVideoRef?: React.RefObject<HTMLVideoElement>;
}

export default function CircleLayout({
  participants,
  activeSpeakerId,
  localParticipantId,
  centralElement,
  avgTension,
  talkingStickHolderId,
  isPassingStickMode,
  onTileClick,
  localVideoRef,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      setContainerSize(width);
    });
    obs.observe(el);
    // Set initial size
    setContainerSize(el.getBoundingClientRect().width);
    return () => obs.disconnect();
  }, []);

  const tileSize = getTileSize(participants.length);
  const radius = containerSize / 2 - tileSize / 2 - 16;
  const positions = getCirclePositions(participants.length, radius);
  const center = containerSize / 2;
  const centralSize = Math.min(160, containerSize * 0.26);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: containerSize }}
    >
      {/* Central fire/candle */}
      <div
        className="absolute"
        style={{
          left: center - centralSize / 2,
          top: center - centralSize / 2,
          width: centralSize,
          height: centralSize,
        }}
      >
        <CentralElementComponent type={centralElement} tensionLevel={avgTension} />
      </div>

      {/* Participant tiles */}
      {participants.map((participant, i) => {
        const pos = positions[i];
        if (!pos) return null;
        return (
          <div
            key={participant.id}
            className="absolute"
            style={{
              left: center + pos.x - tileSize / 2,
              top: center + pos.y - tileSize / 2,
            }}
          >
            <ParticipantTile
              participant={participant}
              isSpeaking={activeSpeakerId === participant.id}
              isLocal={participant.id === localParticipantId}
              hasTalkingStick={talkingStickHolderId === participant.id}
              isPassingStickMode={isPassingStickMode}
              size={tileSize}
              onClick={() => onTileClick(participant.id)}
              videoRef={participant.id === localParticipantId ? localVideoRef : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
