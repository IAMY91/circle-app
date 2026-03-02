'use client';

import { useCircleState } from '@/hooks/useCircleState';
import { useTimer } from '@/hooks/useTimer';
import { ChatMessage, Mood } from '@/types';
import CircleLayout from './CircleLayout';
import BottomBar from '@/components/controls/BottomBar';
import FacilitatorSidebar from '@/components/facilitator/FacilitatorSidebar';
import ChatDrawer from '@/components/chat/ChatDrawer';

export default function CircleRoom() {
  const { state, dispatch, avgTension, handQueue, localParticipant } = useCircleState();
  const { start, pause, reset } = useTimer(dispatch, state.timerRunning);

  return (
    <div className="relative w-screen h-screen bg-stone-950 overflow-hidden flex flex-col">
      {/* Main circle area — centers a square container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden" style={{ paddingBottom: 64 }}>
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
          />
        </div>
      </div>

      {/* Bottom bar */}
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

      {/* Facilitator sidebar */}
      <FacilitatorSidebar
        isOpen={state.isSidebarOpen && !!localParticipant.isFacilitator}
        centralElement={state.centralElement}
        timerSeconds={state.timerSeconds}
        timerRunning={state.timerRunning}
        avgTension={avgTension}
        handQueue={handQueue}
        onSetCentralElement={el => dispatch({ type: 'SET_CENTRAL_ELEMENT', element: el })}
        onStartTimer={start}
        onPauseTimer={pause}
        onResetTimer={reset}
        onLowerHand={id => dispatch({ type: 'TOGGLE_HAND', participantId: id })}
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
        onClose={() => dispatch({ type: 'TOGGLE_CHAT' })}
      />
    </div>
  );
}
