export type Mood = '😌' | '😢' | '😤' | '🤩' | '😰' | '😊' | '😔' | '🔥';
export type CentralElement = 'candle' | 'fire';

export interface Participant {
  id: string;
  name: string;
  avatarColor: string; // Tailwind gradient classes e.g. 'from-violet-500 to-purple-700'
  isMuted: boolean;
  isVideoOff: boolean;
  handRaised: boolean;
  mood: Mood | null;
  tensionInput: number; // 0-100
  isFacilitator?: boolean;
}

export interface ChatMessage {
  id: string;
  participantId: string;
  name: string;
  text: string;
  timestamp: number;
}

export interface CircleState {
  participants: Participant[];
  localParticipantId: string;
  activeSpeakerId: string | null;
  centralElement: CentralElement;
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  isSidebarOpen: boolean;
  timerSeconds: number;
  timerRunning: boolean;
}

export type CircleAction =
  | { type: 'SET_MOOD'; participantId: string; mood: Mood | null }
  | { type: 'SET_TENSION'; participantId: string; value: number }
  | { type: 'TOGGLE_HAND'; participantId: string }
  | { type: 'TOGGLE_MUTE'; participantId: string }
  | { type: 'TOGGLE_VIDEO'; participantId: string }
  | { type: 'SET_CENTRAL_ELEMENT'; element: CentralElement }
  | { type: 'TOGGLE_CHAT' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SEND_MESSAGE'; message: ChatMessage }
  | { type: 'SET_TIMER'; seconds: number }
  | { type: 'TICK_TIMER' }
  | { type: 'SET_TIMER_RUNNING'; running: boolean }
  | { type: 'SET_ACTIVE_SPEAKER'; id: string | null };
