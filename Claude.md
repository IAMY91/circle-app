# Project Specification: Sacred Circle Facilitation App

## 1. Project Overview
Build a real-time, web-based web application designed specifically for hosting facilitated virtual circles (women's circles, men's circles, support groups). The core differentiator of this app is its UI/UX: instead of a standard grid, participant video feeds are arranged in a circular layout around a central, animated element (a fire or candle). The app includes advanced facilitation tools, real-time emotional tracking, and integrated audio experiences.

## 2. Recommended Tech Stack
*(Agent: Please confirm or adjust this stack based on ease of implementation before beginning)*
* **Frontend**: Next.js (React), Tailwind CSS, Framer Motion (for smooth UI/element transitions).
* **Backend / Database**: Supabase (PostgreSQL + Realtime WebSockets for shared state like mood/tension).
* **Video / Audio Infrastructure**: Daily.co API or Agora (best for custom UI layouts and reliable real-time WebRTC).
* **Music Integration**: Spotify Web API (OAuth & playback control).
* **File Storage**: Supabase Storage or AWS S3 (for the meditation library).

## 3. Core Features & Architecture Details

### 3.1. The Circular Video Interface (Core UI)
* **Layout Engine**: The video tiles must not be a grid. Use CSS transforms (`transform: rotate() translate()`) or trigonometric positioning (`Math.sin`/`Math.cos`) to map participant video components dynamically in a circle based on the number of active participants.
* **Central Element**: A central `div` containing a looping video or high-quality animated GIF/CSS animation. 
    * *State*: Facilitator can toggle between "Candle" and "Campfire".
* **Speaker Highlight**: The active speaker's video tile should glow softly or expand slightly without breaking the circular geometry.

### 3.2. Real-Time Facilitation Tools
* **Timer**: A synchronized countdown timer visible to all, controllable only by the facilitator. Include presets (1 min, 3 min, 5 min) and a custom input.
* **Soundboard**: Real-time audio injection.
    * *Assets*: Gong, Bell, Singing Bowl, Nature Sounds.
    * *Implementation*: When triggered by the facilitator, play an audio file locally for all clients using WebSocket event triggers to ensure synchronization, or inject the audio stream directly into the WebRTC call.
* **Hand Raising**: Participants can click a "Raise Hand" button. This triggers a visual indicator (e.g., a glowing hand icon) next to their video tile and places them in a queue visible to the facilitator.

### 3.3. Emotional & Group Tracking
* **Mood Meter**: 
    * *Input*: Participants select an emoji/color representing their current mood when joining, or update it during the call.
    * *UI*: Displayed as a tiny badge on their video frame.
* **Tension Barometer**:
    * *Input*: A slider (0-100) available to all participants to anonymously indicate the current "tension" or "energy" of the room.
    * *Output*: An aggregate visualization (e.g., a subtle glow around the central fire, or a dedicated bar graph) that averages the group's real-time input. Requires WebSocket real-time syncing.

### 3.4. Media & Audio Libraries
* **Meditation Library**:
    * Facilitators can upload `.mp3` or `.wav` files to a cloud bucket.
    * A drawer/modal allows the facilitator to select a meditation and hit "Play for all". Audio must be synchronized.
* **Music Integration (Spotify/Tidal)**:
    * *Implementation*: Use the Spotify Web API. The facilitator authenticates their Spotify Premium account. They can search and play songs/playlists. 
    * *Note to Agent*: Handle the Spotify Web Playback SDK so the music streams into the call, or sync playback across clients if all users have Spotify. If the latter is too complex, route the facilitator's local browser audio through the WebRTC stream as a secondary audio track.

### 3.5. Chat Functionality
* Standard real-time text chat drawer.
* Include basic Markdown support and emoji reactions.
* Direct messaging disabled to keep focus on the group (unless specified otherwise by the facilitator).

## 4. Database & State Schema (Draft)

**Table: `circles`**
* `id` (uuid, primary key)
* `facilitator_id` (uuid)
* `central_element` (enum: 'candle', 'fire')
* `current_tension_average` (integer)
* `active_meditation_url` (string, nullable)

**Table: `participants`**
* `id` (uuid)
* `circle_id` (uuid, foreign key)
* `user_name` (string)
* `mood_state` (string)
* `hand_raised` (boolean)
* `tension_input` (integer)

## 5. UI/UX Guidelines
* **Color Palette**: Dark mode by default (deep earthy tones, charcoal, midnight blues) to make the central fire/candle glow stand out and reduce eye strain.
* **Layout**: 
    * Center: The Circular Video interface (takes up 75% of viewport).
    * Bottom Bar: Participant controls (Mute, Video, Chat toggle, Hand raise, Mood selector).
    * Right Sidebar (Hidden by default): Facilitator Dashboard (Timer, Soundboard, Media Library, Spotify controls, Tension stats).

## 6. Implementation Steps for AI Agent
**Phase 1: Foundation & Video**
1. Initialize Next.js project and Supabase backend.
2. Integrate WebRTC provider (e.g., Daily.co).
3. Build the core mathematical logic for the circular video layout. Test with 2-15 dummy video feeds.

**Phase 2: Facilitator Controls & Real-time State**
1. Implement Supabase Realtime for the Tension Barometer and Hand Raising queue.
2. Build the synchronized Timer.
3. Add the Soundboard (audio playback triggered via WebSockets).

**Phase 3: Media Integrations**
1. Implement audio upload for the Meditation Library.
2. Integrate Spotify API for playlist browsing and synchronized playback.

**Phase 4: Polish & UI**
1. Implement Dark Mode UI/UX.
2. Add central element toggling (Candle vs. Fire).
3. Add Chat function.

Please acknowledge these instructions and let me know if you foresee any technical bottlenecks (particularly with the audio routing or Spotify API constraints) before we begin coding.
