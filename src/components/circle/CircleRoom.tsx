'use client';

import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { useCircleState } from '@/hooks/useCircleState';
import { useTimer } from '@/hooks/useTimer';
import { useAudio } from '@/hooks/useAudio';
import { useLocalMedia } from '@/hooks/useLocalMedia';
import { useSpacePresence } from '@/hooks/useSpacePresence';
import { ChatMessage, Mood, Theme, CentralElement } from '@/types';
import CircleLayout from './CircleLayout';
import BottomBar from '@/components/controls/BottomBar';
import FacilitatorSidebar from '@/components/facilitator/FacilitatorSidebar';
import ChatDrawer from '@/components/chat/ChatDrawer';
import OracleCardModal from '@/components/oracle/OracleCardModal';

interface CircleRoomProps {
  localName: string;
  initialMicOn: boolean;
  initialCameraOn: boolean;
  spaceId: string;
  initialTheme: Theme;
  initialCentralElement: CentralElement;
  symbol: string;
}

type SharedSpotifyPayload = {
  input: string;
  embedUrl: string;
  sharedBy: string;
  updatedAt: number;
};

function getSpotifyEmbedUrl(rawInput: string): string | null {
  const input = rawInput.trim();
  if (!input) return null;

  const uriMatch = input.match(/^spotify:(track|album|playlist|episode|show):([a-zA-Z0-9]+)$/i);
  if (uriMatch) {
    return `https://open.spotify.com/embed/${uriMatch[1].toLowerCase()}/${uriMatch[2]}?utm_source=generator`;
  }

  const urlMatch = input.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/i);
  if (urlMatch) {
    return `https://open.spotify.com/embed/${urlMatch[1].toLowerCase()}/${urlMatch[2]}?utm_source=generator`;
  }

  return null;
}

export default function CircleRoom({
  localName,
  initialMicOn,
  initialCameraOn,
  spaceId,
  initialTheme,
  initialCentralElement,
  symbol,
}: CircleRoomProps) {
  const media = useLocalMedia(initialMicOn, initialCameraOn);
  const presence = useSpacePresence(spaceId, localName, !initialMicOn, !initialCameraOn);
  const { state, dispatch, avgTension, handQueue, localParticipant, vibeX, vibeY, drawOracleCard } =
    useCircleState(presence.participants, presence.localParticipantId, initialTheme, initialCentralElement);
  const { start, pause, reset } = useTimer(dispatch, state.timerRunning);
  const { play } = useAudio();
  const [spotifyInput, setSpotifyInput] = useState('');
  const [spotifyState, setSpotifyState] = useState<SharedSpotifyPayload | null>(null);
  const [spotifyError, setSpotifyError] = useState<string | null>(null);

  const prevTimerRef = useRef(state.timerSeconds);
  const playRef = useRef(play);
  const spotifyChannelRef = useRef<BroadcastChannel | null>(null);
  playRef.current = play;

  useEffect(() => {
    dispatch({ type: 'SET_PARTICIPANTS', participants: presence.participants });
  }, [dispatch, presence.participants]);

  useEffect(() => {
    media.requestPermissions();
    // Request once on room mount to avoid restarting stream (camera flicker).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (prevTimerRef.current > 0 && state.timerSeconds === 0) {
      playRef.current('bell');
    }
    prevTimerRef.current = state.timerSeconds;
  }, [state.timerSeconds]);

  useEffect(() => {
    const channel = new BroadcastChannel(`circle-spotify-${spaceId}`);
    spotifyChannelRef.current = channel;

    const onMessage = (event: MessageEvent<SharedSpotifyPayload | null>) => {
      setSpotifyState(event.data);
    };

    channel.addEventListener('message', onMessage);
    return () => {
      channel.removeEventListener('message', onMessage);
      channel.close();
      spotifyChannelRef.current = null;
    };
  }, [spaceId]);

  const handleTileClick = (participantId: string) => {
    if (state.isPassingStickMode) {
      dispatch({ type: 'SET_TALKING_STICK', participantId });
    }
  };

  const handleSpotifyConnect = useCallback(() => {
    const embedUrl = getSpotifyEmbedUrl(spotifyInput);
    if (!embedUrl) {
      setSpotifyError('Please paste a valid Spotify track/album/playlist/episode/show link or spotify: URI.');
      return;
    }

    const next: SharedSpotifyPayload = {
      input: spotifyInput.trim(),
      embedUrl,
      sharedBy: localParticipant?.name || 'Someone',
      updatedAt: Date.now(),
    };

    setSpotifyState(next);
    setSpotifyError(null);
    spotifyChannelRef.current?.postMessage(next);
  }, [localParticipant?.name, spotifyInput]);

  const clearSpotify = () => {
    setSpotifyState(null);
    setSpotifyError(null);
    spotifyChannelRef.current?.postMessage(null);
  };

  const inviteLink = useMemo(
    () => (typeof window === 'undefined' ? '' : `${window.location.origin}/?space=${spaceId}`),
    [spaceId]
  );

  if (!localParticipant) return null;

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#080a10' }} data-theme={state.theme}>
      <div className="breath-bg absolute pointer-events-none" style={{ width: '200%', height: '200%', top: '-50%', left: '-50%', zIndex: 0 }} />

      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-stone-900/80 border border-stone-700 rounded-full px-3 py-1.5 text-xs text-stone-200">
        <span>{symbol} Space: {spaceId}</span>
        <span className="bg-stone-700 px-2 py-0.5 rounded-full">{state.participants.length} live</span>
        <button onClick={() => navigator.clipboard.writeText(inviteLink)} className="bg-stone-700 hover:bg-stone-600 px-2 py-1 rounded-md">
          Copy invite link
        </button>
      </div>

      {media.error && (
        <div className="absolute top-16 left-4 right-4 z-30 text-sm bg-red-500/20 border border-red-400/40 text-red-200 rounded-xl p-3">
          {media.error}
        </div>
      )}

      <div className="flex-1 flex items-center justify-center overflow-hidden relative z-10" style={{ paddingBottom: 64 }}>
        <div className="relative" style={{ width: 'min(75vw, calc(100vh - 10rem))', height: 'min(75vw, calc(100vh - 10rem))' }}>
          <CircleLayout
            participants={state.participants}
            activeSpeakerId={state.activeSpeakerId}
            localParticipantId={state.localParticipantId}
            centralElement={state.centralElement}
            avgTension={avgTension}
            talkingStickHolderId={state.talkingStickHolderId}
            isPassingStickMode={state.isPassingStickMode}
            onTileClick={handleTileClick}
            localStream={media.stream}
          />
        </div>
      </div>

      <div className="absolute right-4 bottom-20 z-30 w-[360px] bg-stone-900/95 border border-stone-700 rounded-2xl p-3 shadow-2xl">
        <div className="text-sm font-semibold mb-2">Spotify in your space</div>
        <div className="flex gap-2">
          <input
            value={spotifyInput}
            onChange={e => setSpotifyInput(e.target.value)}
            placeholder="Paste Spotify link or spotify:track:..."
            className="flex-1 bg-stone-800 rounded-lg px-3 py-2 text-xs outline-none"
          />
          <button onClick={handleSpotifyConnect} className="bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-3 rounded-lg text-xs">
            Share
          </button>
        </div>
        {spotifyError && <div className="mt-2 text-[11px] text-red-300">{spotifyError}</div>}

        {spotifyState && (
          <>
            <div className="mt-2 text-[11px] text-stone-400 flex items-center justify-between">
              <span>Shared by {spotifyState.sharedBy}</span>
              <button onClick={clearSpotify} className="text-stone-300 hover:text-white underline underline-offset-2">Clear</button>
            </div>
            <iframe
              src={spotifyState.embedUrl}
              width="100%"
              height="152"
              className="rounded-xl mt-2"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </>
        )}
      </div>

      <div className="relative z-20">
        <BottomBar
          localParticipant={localParticipant}
          isChatOpen={state.isChatOpen}
          isSidebarOpen={state.isSidebarOpen}
          theme={state.theme}
          onToggleMute={() => {
            dispatch({ type: 'TOGGLE_MUTE', participantId: state.localParticipantId });
            presence.patchLocalParticipant({ isMuted: !localParticipant.isMuted });
            media.toggleAudio();
          }}
          onToggleVideo={() => {
            dispatch({ type: 'TOGGLE_VIDEO', participantId: state.localParticipantId });
            presence.patchLocalParticipant({ isVideoOff: !localParticipant.isVideoOff });
            media.toggleVideo();
          }}
          onToggleHand={() => {
            dispatch({ type: 'TOGGLE_HAND', participantId: state.localParticipantId });
            presence.patchLocalParticipant({ handRaised: !localParticipant.handRaised });
          }}
          onToggleChat={() => dispatch({ type: 'TOGGLE_CHAT' })}
          onToggleSidebar={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          onSetMood={(mood: Mood | null) => {
            dispatch({ type: 'SET_MOOD', participantId: state.localParticipantId, mood });
            presence.patchLocalParticipant({ mood });
          }}
          onSetTension={(value: number) => {
            dispatch({ type: 'SET_TENSION', participantId: state.localParticipantId, value });
            presence.patchLocalParticipant({ tensionInput: value });
          }}
          onSetTheme={t => dispatch({ type: 'SET_THEME', theme: t })}
        />
      </div>

      <FacilitatorSidebar
        isOpen={state.isSidebarOpen}
        centralElement={state.centralElement}
        timerSeconds={state.timerSeconds}
        timerRunning={state.timerRunning}
        avgTension={avgTension}
        handQueue={handQueue}
        theme={state.theme}
        isCircleSealed={state.isCircleSealed}
        isPassingStickMode={state.isPassingStickMode}
        vibeX={vibeX}
        vibeY={vibeY}
        onSetCentralElement={el => dispatch({ type: 'SET_CENTRAL_ELEMENT', element: el })}
        onStartTimer={start}
        onPauseTimer={pause}
        onResetTimer={reset}
        onLowerHand={id => dispatch({ type: 'TOGGLE_HAND', participantId: id })}
        onToggleSeal={() => dispatch({ type: 'TOGGLE_SEAL' })}
        onPassStick={() => dispatch({ type: 'SET_PASSING_STICK_MODE', active: !state.isPassingStickMode })}
        onDrawOracleCard={drawOracleCard}
      />

      <ChatDrawer
        isOpen={state.isChatOpen}
        messages={state.chatMessages}
        localName={localParticipant.name}
        onSend={text => {
          const message: ChatMessage = {
            id: `msg-${Date.now()}`,
            participantId: state.localParticipantId,
            name: localParticipant.name,
            text,
            timestamp: Date.now(),
          };
          dispatch({ type: 'SEND_MESSAGE', message });
        }}
        onReact={(messageId, emoji) => dispatch({ type: 'ADD_REACTION', messageId, emoji })}
        onClose={() => dispatch({ type: 'TOGGLE_CHAT' })}
      />

      <OracleCardModal card={state.oracleCard} onClose={() => dispatch({ type: 'CLOSE_ORACLE_CARD' })} />
    </div>
  );
}
