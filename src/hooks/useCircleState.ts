'use client';

import { useReducer, useMemo } from 'react';
import { CircleState, CircleAction, ChatMessage, OracleCard, Participant, Theme, CentralElement } from '@/types';

const now = Date.now();
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-0',
    participantId: 'system',
    name: 'Circle Guide',
    text: 'Welcome. Take a breath and arrive fully. 🌿',
    timestamp: now - 2 * 60 * 1000,
    reactions: { '🙏': 1 },
  },
];

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

const MOOD_SENTIMENT: Record<string, number> = {
  '😊': 70,
  '🤩': 60,
  '🔥': 50,
  '😌': 60,
  '😢': -60,
  '😔': -40,
  '😤': -70,
  '😰': -50,
};

function buildInitialState(
  participants: Participant[],
  localParticipantId: string,
  initialTheme: Theme,
  initialCentralElement: CentralElement
): CircleState {
  return {
    participants,
    localParticipantId,
    activeSpeakerId: localParticipantId,
    centralElement: initialCentralElement,
    chatMessages: INITIAL_MESSAGES,
    isChatOpen: false,
    isSidebarOpen: false,
    timerSeconds: 0,
    timerRunning: false,
    talkingStickHolderId: localParticipantId,
    isPassingStickMode: false,
    theme: initialTheme,
    oracleCard: null,
    isCircleSealed: false,
  };
}

function reducer(state: CircleState, action: CircleAction): CircleState {
  switch (action.type) {
    case 'SET_PARTICIPANTS': {
      const previousById = new Map(state.participants.map(p => [p.id, p]));
      const mergedParticipants = action.participants.map(participant => {
        const existing = previousById.get(participant.id);
        if (!existing) return participant;
        return {
          ...participant,
          handRaised: existing.handRaised,
          mood: existing.mood,
          tensionInput: existing.tensionInput,
          isFacilitator: existing.isFacilitator ?? participant.isFacilitator,
        };
      });
      return {
        ...state,
        participants: mergedParticipants,
        activeSpeakerId:
          state.activeSpeakerId && mergedParticipants.some(p => p.id === state.activeSpeakerId)
            ? state.activeSpeakerId
            : mergedParticipants[0]?.id ?? null,
      };
    }
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
    case 'ADD_REACTION':
      return {
        ...state,
        chatMessages: state.chatMessages.map(msg =>
          msg.id === action.messageId
            ? {
                ...msg,
                reactions: {
                  ...msg.reactions,
                  [action.emoji]: ((msg.reactions ?? {})[action.emoji] ?? 0) + 1,
                },
              }
            : msg
        ),
      };
    default:
      return state;
  }
}

export function useCircleState(
  participants: Participant[],
  localParticipantId: string,
  initialTheme: Theme,
  initialCentralElement: CentralElement
) {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    () => buildInitialState(participants, localParticipantId, initialTheme, initialCentralElement)
  );

  const avgTension = useMemo(
    () =>
      state.participants.length
        ? Math.round(
            state.participants.reduce((sum, p) => sum + p.tensionInput, 0) / state.participants.length
          )
        : 0,
    [state.participants]
  );

  const handQueue = useMemo(
    () => state.participants.filter(p => p.handRaised).map(p => ({ id: p.id, name: p.name })),
    [state.participants]
  );

  const localParticipant = state.participants.find(p => p.id === state.localParticipantId);

  const vibeX = useMemo(
    () =>
      state.participants.length
        ? state.participants.reduce((sum, p) => sum + (MOOD_SENTIMENT[p.mood ?? ''] ?? 0), 0) /
          state.participants.length
        : 0,
    [state.participants]
  );
  const vibeY = useMemo(
    () =>
      state.participants.length
        ? state.participants.reduce((sum, p) => sum + (p.tensionInput - 50) * 1.6, 0) /
          state.participants.length
        : 0,
    [state.participants]
  );

  const drawOracleCard = () => {
    const card = ORACLE_DECK[Math.floor(Math.random() * ORACLE_DECK.length)];
    dispatch({ type: 'SHOW_ORACLE_CARD', card });
  };

  return { state, dispatch, avgTension, handQueue, localParticipant, vibeX, vibeY, drawOracleCard };
}
