'use client';

import { Participant, Mood } from '@/types';
import MoodSelector from './MoodSelector';
import TensionSlider from './TensionSlider';

interface Props {
  localParticipant: Participant;
  isChatOpen: boolean;
  isSidebarOpen: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleHand: () => void;
  onToggleChat: () => void;
  onToggleSidebar: () => void;
  onSetMood: (mood: Mood | null) => void;
  onSetTension: (value: number) => void;
}

export default function BottomBar({
  localParticipant,
  isChatOpen,
  isSidebarOpen,
  onToggleMute,
  onToggleVideo,
  onToggleHand,
  onToggleChat,
  onToggleSidebar,
  onSetMood,
  onSetTension,
}: Props) {
  const btn = (active: boolean, danger = false) =>
    `w-10 h-10 rounded-full flex items-center justify-center transition-all text-lg
     ${
       danger
         ? 'bg-red-600 hover:bg-red-500 text-white'
         : active
         ? 'bg-amber-600 hover:bg-amber-500 text-white'
         : 'bg-stone-700 hover:bg-stone-600 text-stone-200'
     }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 flex items-center justify-center gap-3 bg-stone-900/95 backdrop-blur-sm border-t border-stone-800 px-4 z-40">
      {/* Mute */}
      <button
        onClick={onToggleMute}
        className={btn(false, localParticipant.isMuted)}
        title={localParticipant.isMuted ? 'Unmute' : 'Mute'}
      >
        {localParticipant.isMuted ? '🔇' : '🎤'}
      </button>

      {/* Video */}
      <button
        onClick={onToggleVideo}
        className={btn(false, localParticipant.isVideoOff)}
        title={localParticipant.isVideoOff ? 'Turn on camera' : 'Turn off camera'}
      >
        {localParticipant.isVideoOff ? '📵' : '📹'}
      </button>

      {/* Tension slider */}
      <div className="px-1">
        <TensionSlider value={localParticipant.tensionInput} onChange={onSetTension} />
      </div>

      {/* Mood */}
      <MoodSelector currentMood={localParticipant.mood} onSelect={onSetMood} />

      {/* Hand raise */}
      <button
        onClick={onToggleHand}
        className={btn(localParticipant.handRaised)}
        title={localParticipant.handRaised ? 'Lower hand' : 'Raise hand'}
      >
        ✋
      </button>

      {/* Chat */}
      <button onClick={onToggleChat} className={btn(isChatOpen)} title="Chat">
        💬
      </button>

      {/* Facilitator panel (only shown to facilitators) */}
      {localParticipant.isFacilitator && (
        <button onClick={onToggleSidebar} className={btn(isSidebarOpen)} title="Facilitator controls">
          ⚙️
        </button>
      )}
    </div>
  );
}
