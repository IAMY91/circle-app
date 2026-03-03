'use client';

import { useRef, useEffect } from 'react';
import { useCircleState } from '@/hooks/useCircleState';
import { useTimer } from '@/hooks/useTimer';
import { useAudio } from '@/hooks/useAudio';
import { ChatMessage, Mood } from '@/types';
import CircleLayout from './CircleLayout';
import BottomBar from '@/components/controls/BottomBar';
import FacilitatorSidebar from '@/components/facilitator/FacilitatorSidebar';
import ChatDrawer from '@/components/chat/ChatDrawer';
import OracleCardModal from '@/components/oracle/OracleCardModal';

export default function CircleRoom() {
  const {
    state,
    dispatch,
    avgTension,
    handQueue,
    localParticipant,
    vibeX,
    vibeY,
    drawOracleCard,
  } = useCircleState();
  const { start, pause, reset } = useTimer(dispatch, state.timerRunning);
  const { play } = useAudio();

  // Play bell when timer reaches zero
  const prevTimerRef = useRef(state.timerSeconds);
  const playRef = useRef(play);
  playRef.current = play;
  useEffect(() => {
    if (prevTimerRef.current > 0 && state.timerSeconds === 0) {
      playRef.current('bell');
    }
    prevTimerRef.current = state.timerSeconds;
  }, [state.timerSeconds]);

  const handleTileClick = (participantId: string) => {
    if (state.isPassingStickMode) {
      dispatch({ type: 'SET_TALKING_STICK', participantId });
    }
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col"
      style={{ background: '#080a10' }}
      data-theme={state.theme}
    >
      {/* Breathing background pulse — color follows CSS var(--accent-glow) via theme */}
      <div
        className="breath-bg absolute pointer-events-none"
        style={{ width: '200%', height: '200%', top: '-50%', left: '-50%', zIndex: 0 }}
      />

      {/* Sealed-circle border indicator */}
      {state.isCircleSealed && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ boxShadow: 'inset 0 0 0 3px rgba(212,168,83,0.4)' }}
        />
      )}

      {/* Passing-stick mode hint banner */}
      {state.isPassingStickMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-amber-600/90 text-white text-sm px-4 py-2 rounded-full shadow-lg backdrop-blur-sm pointer-events-none select-none">
          🪵 Click a participant to pass the talking stick
        </div>
      )}

      {/* Main circle area */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden relative z-10"
        style={{ paddingBottom: 64 }}
      >
        <div
          className="relative"
          style={{
            width: 'min(75vw, calc(100vh - 10rem))',
            height: 'min(75vw, calc(100vh - 10rem))',
          }}
        >
          <CircleLayout
            participants={state.participants}
            activeSpeakerId={state.activeSpeakerId}
            localParticipantId={state.localParticipantId}
            centralElement={state.centralElement}
            avgTension={avgTension}
            talkingStickHolderId={state.talkingStickHolderId}
            isPassingStickMode={state.isPassingStickMode}
            onTileClick={handleTileClick}
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-20">
        <BottomBar
          localParticipant={localParticipant}
          isChatOpen={state.isChatOpen}
          isSidebarOpen={state.isSidebarOpen}
          onToggleMute={() =>
            dispatch({ type: 'TOGGLE_MUTE', participantId: state.localParticipantId })
          }
          onToggleVideo={() =>
            dispatch({ type: 'TOGGLE_VIDEO', participantId: state.localParticipantId })
          }
          onToggleHand={() =>
            dispatch({ type: 'TOGGLE_HAND', participantId: state.localParticipantId })
          }
          onToggleChat={() => dispatch({ type: 'TOGGLE_CHAT' })}
          onToggleSidebar={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          onSetMood={(mood: Mood | null) =>
            dispatch({ type: 'SET_MOOD', participantId: state.localParticipantId, mood })
          }
          onSetTension={(value: number) =>
            dispatch({ type: 'SET_TENSION', participantId: state.localParticipantId, value })
          }
        />
      </div>

      {/* Facilitator sidebar */}
      <FacilitatorSidebar
        isOpen={state.isSidebarOpen && !!localParticipant.isFacilitator}
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
        onSetTheme={t => dispatch({ type: 'SET_THEME', theme: t })}
        onToggleSeal={() => dispatch({ type: 'TOGGLE_SEAL' })}
        onPassStick={() =>
          dispatch({ type: 'SET_PASSING_STICK_MODE', active: !state.isPassingStickMode })
        }
        onDrawOracleCard={drawOracleCard}
      />

      {/* Chat drawer */}
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

      {/* Oracle Card Modal */}
      <OracleCardModal
        card={state.oracleCard}
        onClose={() => dispatch({ type: 'CLOSE_ORACLE_CARD' })}
      />
    </div>
  );
}
