'use client';

import { useReducer, useEffect, useMemo } from 'react';
import { CircleState, CircleAction } from '@/types';
import { MOCK_PARTICIPANTS } from '@/lib/mockParticipants';

const initialState: CircleState = {
  participants: MOCK_PARTICIPANTS,
  localParticipantId: 'local',
  activeSpeakerId: null,
  centralElement: 'fire',
  chatMessages: [],
  isChatOpen: false,
  isSidebarOpen: false,
  timerSeconds: 0,
  timerRunning: false,
};

function reducer(state: CircleState, action: CircleAction): CircleState {
  switch (action.type) {
    case 'SET_MOOD':
      return {
        ...state,
        participants: state.participants.map(p =>
          p.id === action.participantId ? { ...p, mood: action.mood } : p
        ),
      };
    case 'SET_TENSION':
      return {
        ...state,
        participants: state.participants.map(p =>
          p.id === action.participantId ? { ...p, tensionInput: action.value } : p
        ),
      };
    case 'TOGGLE_HAND':
      return {
        ...state,
        participants: state.participants.map(p =>
          p.id === action.participantId ? { ...p, handRaised: !p.handRaised } : p
        ),
      };
    case 'TOGGLE_MUTE':
      return {
        ...state,
        participants: state.participants.map(p =>
          p.id === action.participantId ? { ...p, isMuted: !p.isMuted } : p
        ),
      };
    case 'TOGGLE_VIDEO':
      return {
        ...state,
        participants: state.participants.map(p =>
          p.id === action.participantId ? { ...p, isVideoOff: !p.isVideoOff } : p
        ),
      };
    case 'SET_CENTRAL_ELEMENT':
      return { ...state, centralElement: action.element };
    case 'TOGGLE_CHAT':
      return { ...state, isChatOpen: !state.isChatOpen };
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    case 'SEND_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.message] };
    case 'SET_TIMER':
      return { ...state, timerSeconds: action.seconds };
    case 'TICK_TIMER':
      if (state.timerSeconds <= 1) {
        return { ...state, timerSeconds: 0, timerRunning: false };
      }
      return { ...state, timerSeconds: state.timerSeconds - 1 };
    case 'SET_TIMER_RUNNING':
      return { ...state, timerRunning: action.running };
    case 'SET_ACTIVE_SPEAKER':
      return { ...state, activeSpeakerId: action.id };
    default:
      return state;
  }
}

export function useCircleState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Rotate the active speaker every 4s to simulate a live call
  useEffect(() => {
    const ids = MOCK_PARTICIPANTS.map(p => p.id);
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % ids.length;
      dispatch({ type: 'SET_ACTIVE_SPEAKER', id: ids[i] });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const avgTension = useMemo(
    () =>
      Math.round(
        state.participants.reduce((sum, p) => sum + p.tensionInput, 0) /
          state.participants.length
      ),
    [state.participants]
  );

  const handQueue = useMemo(
    () => state.participants.filter(p => p.handRaised).map(p => ({ id: p.id, name: p.name })),
    [state.participants]
  );

  const localParticipant = state.participants.find(p => p.id === state.localParticipantId)!;

  return { state, dispatch, avgTension, handQueue, localParticipant };
}
