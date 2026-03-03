'use client';

import { useReducer, useEffect, useMemo } from 'react';
import { CircleState, CircleAction, OracleCard } from '@/types';
import { MOCK_PARTICIPANTS } from '@/lib/mockParticipants';

export const ORACLE_DECK: OracleCard[] = [
  { icon: '🌱', title: 'Grounding', text: '"Connect with your roots before reaching for the sky."' },
  { icon: '🌊', title: 'Flow', text: '"Do not fight the current. Trust where it leads."' },
  { icon: '🦋', title: 'Transformation', text: '"Honour the struggle of the cocoon."' },
  { icon: '🌬️', title: 'Release', text: '"Let go of what no longer serves the container."' },
  { icon: '🦉', title: 'Wisdom', text: '"Listen to the silence between words."' },
  { icon: '🌕', title: 'Wholeness', text: '"Every part of you belongs here."' },
  { icon: '🔥', title: 'Courage', text: '"The fire does not ask permission to burn."' },
  { icon: '🌿', title: 'Renewal', text: '"Growth happens in the spaces between words."' },
];

// Maps mood emoji to pleasantness score (-100 to +100)
const MOOD_SENTIMENT: Record<string, number> = {
  '😊': 70, '🤩': 60, '🔥': 50, '😌': 60,
  '😢': -60, '😔': -40, '😤': -70, '😰': -50,
};

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
  talkingStickHolderId: 'local',
  isPassingStickMode: false,
  theme: 'earth',
  oracleCard: null,
  isCircleSealed: false,
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
    case 'SET_TALKING_STICK':
      return {
        ...state,
        talkingStickHolderId: action.participantId,
        isPassingStickMode: false,
        participants: action.participantId
          ? state.participants.map(p =>
              p.id === action.participantId ? { ...p, handRaised: false } : p
            )
          : state.participants,
      };
    case 'SET_PASSING_STICK_MODE':
      return { ...state, isPassingStickMode: action.active };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'SHOW_ORACLE_CARD':
      return { ...state, oracleCard: action.card };
    case 'CLOSE_ORACLE_CARD':
      return { ...state, oracleCard: null };
    case 'TOGGLE_SEAL':
      return { ...state, isCircleSealed: !state.isCircleSealed };
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

  // Vibe X = pleasantness from moods, Y = energy from tension
  const vibeX = useMemo(
    () =>
      state.participants.reduce((sum, p) => sum + (MOOD_SENTIMENT[p.mood ?? ''] ?? 0), 0) /
      state.participants.length,
    [state.participants]
  );
  const vibeY = useMemo(
    () =>
      state.participants.reduce((sum, p) => sum + (p.tensionInput - 50) * 1.6, 0) /
      state.participants.length,
    [state.participants]
  );

  const drawOracleCard = () => {
    const card = ORACLE_DECK[Math.floor(Math.random() * ORACLE_DECK.length)];
    dispatch({ type: 'SHOW_ORACLE_CARD', card });
  };

  return { state, dispatch, avgTension, handQueue, localParticipant, vibeX, vibeY, drawOracleCard };
}
