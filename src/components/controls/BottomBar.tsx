'use client';

import { useState } from 'react';
import { Participant, Mood, Theme } from '@/types';
import MoodSelector from './MoodSelector';
import TensionSlider from './TensionSlider';
import ThemePicker from './ThemePicker';

interface Props {
  localParticipant: Participant;
  isChatOpen: boolean;
  isSidebarOpen: boolean;
  theme: Theme;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleHand: () => void;
  onToggleChat: () => void;
  onToggleSidebar: () => void;
  onSetMood: (mood: Mood | null) => void;
  onSetTension: (value: number) => void;
  onSetTheme: (theme: Theme) => void;
}

export default function BottomBar({
  localParticipant,
  isChatOpen,
  isSidebarOpen,
  theme,
  onToggleMute,
  onToggleVideo,
  onToggleHand,
  onToggleChat,
  onToggleSidebar,
  onSetMood,
  onSetTension,
  onSetTheme,
}: Props) {
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  // Base class for icon buttons
  const btnClass = (active: boolean, danger = false) =>
    `w-10 h-10 rounded-full flex items-center justify-center transition-all text-lg
     ${danger
       ? 'bg-red-600 hover:bg-red-500 text-white'
       : active
       ? 'text-white'
       : 'bg-stone-700 hover:bg-stone-600 text-stone-200'
     }`;

  const activeStyle = { backgroundColor: 'var(--accent-primary)' };

  return (
    <>
      <ThemePicker
        isOpen={isThemePickerOpen}
        current={theme}
        onSelect={onSetTheme}
        onClose={() => setIsThemePickerOpen(false)}
      />

      <div className="fixed bottom-0 left-0 right-0 h-16 flex items-center justify-center gap-3 bg-stone-900/95 backdrop-blur-sm border-t border-stone-800 px-4 z-40">
        {/* Mute */}
        <button
          onClick={onToggleMute}
          className={btnClass(false, localParticipant.isMuted)}
          title={localParticipant.isMuted ? 'Unmute' : 'Mute'}
        >
          {localParticipant.isMuted ? '🔇' : '🎤'}
        </button>

        {/* Video */}
        <button
          onClick={onToggleVideo}
          className={btnClass(false, localParticipant.isVideoOff)}
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
          className={btnClass(localParticipant.handRaised)}
          style={localParticipant.handRaised ? activeStyle : {}}
          title={localParticipant.handRaised ? 'Lower hand' : 'Raise hand'}
        >
          ✋
        </button>

        {/* Chat */}
        <button
          onClick={onToggleChat}
          className={btnClass(isChatOpen)}
          style={isChatOpen ? activeStyle : {}}
          title="Chat"
        >
          💬
        </button>

        {/* Theme picker */}
        <button
          onClick={() => setIsThemePickerOpen(v => !v)}
          className={btnClass(isThemePickerOpen)}
          style={isThemePickerOpen ? activeStyle : {}}
          title="Change skin & mood"
        >
          🎨
        </button>

        {/* Facilitator panel (only shown to facilitators) */}
        {localParticipant.isFacilitator && (
          <button
            onClick={onToggleSidebar}
            className={btnClass(isSidebarOpen)}
            style={isSidebarOpen ? activeStyle : {}}
            title="Facilitator controls"
          >
            ⚙️
          </button>
        )}
      </div>
    </>
  );
}
