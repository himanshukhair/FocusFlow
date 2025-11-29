# Design Document

## Overview

The Daily Attention Trainer is a single-page web application (SPA) built with vanilla JavaScript, HTML, and CSS. The architecture prioritizes simplicity, performance, and privacy by avoiding external dependencies where possible and storing all user data locally in the browser. The application follows a state-machine pattern to manage the user flow through landing, drill selection, instruction, practice, and completion screens.

The core technical approach uses:
- **Vanilla JavaScript** for application logic and state management
- **Web Speech API** for text-to-speech functionality
- **LocalStorage API** for persistent data storage
- **CSS Grid and Flexbox** for responsive layouts
- **CSS backdrop-filter and glassmorphism** for modern UI aesthetics
- **CSS animations and transforms** for virtual environment effects
- **Progressive enhancement** to ensure core functionality works across browsers

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Single Page Application                   │  │
│  │                                                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │   UI Layer   │  │  State Mgmt  │  │  Data Layer │ │  │
│  │  │              │  │              │  │             │ │  │
│  │  │ - Landing    │  │ - App State  │  │ - Storage   │ │  │
│  │  │ - Practice   │  │ - Timer      │  │ - Stats     │ │  │
│  │  │ - Stats      │  │ - Session    │  │ - Export    │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │  │
│  │                                                         │  │
│  │  ┌──────────────┐  ┌──────────────┐                   │  │
│  │  │  TTS Engine  │  │ Drill Scripts│                   │  │
│  │  │ (Web Speech) │  │   (JSON)     │                   │  │
│  │  └──────────────┘  └──────────────┘                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   LocalStorage                         │  │
│  │  - Session logs (JSON array)                          │  │
│  │  - User preferences (theme, audio)                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Application State Machine

The application follows a finite state machine with these states:

1. **LANDING** - Initial screen with start button and stats
2. **DURATION_SELECT** - Choose practice duration (2/5/8/10 min)
3. **INSTRUCTION** - Brief drill instructions with start button
4. **PRACTICE** - Active session with timer and cues
5. **PAUSED** - Practice temporarily paused
6. **COMPLETE** - Session ended, log prompt displayed

State transitions are managed by a central `AppState` object that handles navigation and ensures valid state changes.

## Components and Interfaces

### 1. UI Components

#### LandingScreen
- Displays hero message and primary CTA
- Shows stats panel with streak and weekly minutes
- Handles start button click to transition to duration selection

```javascript
interface LandingScreen {
  render(): void;
  updateStats(stats: Stats): void;
  onStartClick(callback: () => void): void;
}
```

#### DurationSelector
- Presents 4 duration options (2, 5, 8, 10 minutes)
- Highlights recommended default (5 minutes)
- Transitions to instruction screen on selection

```javascript
interface DurationSelector {
  render(): void;
  onDurationSelect(callback: (minutes: number) => void): void;
}
```

#### InstructionScreen
- Displays drill-specific instructions
- Shows estimated reading time
- Provides start button to begin practice

```javascript
interface InstructionScreen {
  render(drillType: string, instructions: string): void;
  onStartClick(callback: () => void): void;
}
```

#### PracticeScreen
- Displays large countdown timer
- Shows current cue text
- Provides pause/resume controls
- Handles TTS playback

```javascript
interface PracticeScreen {
  render(): void;
  updateTimer(remainingSeconds: number): void;
  updateCue(cueText: string): void;
  onPauseClick(callback: () => void): void;
  onResumeClick(callback: () => void): void;
}
```

#### CompletionScreen
- Shows completion message
- Provides log button and optional note field
- Displays updated streak information
- Shows celebratory animation for milestones

```javascript
interface CompletionScreen {
  render(sessionData: SessionData): void;
  onLogClick(callback: (note?: string) => void): void;
  onSkipClick(callback: () => void): void;
  showCelebration(streakDays: number): void;
}
```

#### StatsPanel
- Displays total sessions, current streak, last 7 days
- Provides export functionality
- Updates in real-time after session completion

```javascript
interface StatsPanel {
  render(stats: Stats): void;
  onExportClick(callback: (format: 'csv' | 'json') => void): void;
}
```

### 2. State Management

#### AppState
Central state manager that coordinates application flow.

```javascript
interface AppState {
  currentState: State;
  currentDrill: DrillType;
  sessionDuration: number;
  
  transition(newState: State): void;
  getCurrentState(): State;
}
```

#### TimerController
Manages countdown timer with pause/resume capability.

```javascript
interface TimerController {
  start(durationSeconds: number): void;
  pause(): void;
  resume(): void;
  stop(): void;
  getRemainingTime(): number;
  onTick(callback: (remaining: number) => void): void;
  onComplete(callback: () => void): void;
}
```

#### CueScheduler
Schedules and triggers cue updates based on drill script.

```javascript
interface CueScheduler {
  load(cues: Cue[]): void;
  start(): void;
  pause(): void;
  resume(): void;
  stop(): void;
  onCueUpdate(callback: (cueText: string) => void): void;
}

interface Cue {
  t: number;        // Time in seconds
  text: string;     // Cue text to display
}
```

### 3. Data Layer

#### StorageManager
Handles all LocalStorage operations for session logs and preferences.

```javascript
interface StorageManager {
  saveSess ion(session: SessionLog): void;
  getAllSessions(): SessionLog[];
  getPreferences(): UserPreferences;
  savePreferences(prefs: UserPreferences): void;
  exportAsJSON(): string;
  exportAsCSV(): string;
  clearAllData(): void;
}
```

#### StatsCalculator
Computes derived statistics from session logs.

```javascript
interface StatsCalculator {
  calculateStreak(sessions: SessionLog[]): number;
  calculateLongestStreak(sessions: SessionLog[]): number;
  calculateWeeklyMinutes(sessions: SessionLog[]): number;
  calculateMonthlyMinutes(sessions: SessionLog[]): number;
  getLast7Days(sessions: SessionLog[]): DayActivity[];
  getTotalSessions(sessions: SessionLog[]): number;
  getAverageFocusRating(sessions: SessionLog[]): number | undefined;
  getMilestones(sessionCount: number): Milestone[];
}
```

### 4. Audio System

#### TTSEngine
Wrapper around Web Speech API for text-to-speech.

```javascript
interface TTSEngine {
  speak(text: string): void;
  stop(): void;
  setEnabled(enabled: boolean): void;
  isSupported(): boolean;
  onError(callback: (error: Error) => void): void;
}
```

### 5. Drill System

#### DrillLibrary
Manages drill scripts and metadata.

```javascript
interface DrillLibrary {
  getDrill(type: DrillType): Drill;
  getAllDrills(): Drill[];
}

interface Drill {
  id: string;
  name: string;
  description: string;
  instructions: string;
  cues: Cue[];
  defaultDuration: number;
}
```

### 6. Enhanced Features Components

#### QuickStartManager
Manages quick start functionality for returning users.

```javascript
interface QuickStartManager {
  hasHistory(): boolean;
  getLastSession(): { drillType: DrillType; duration: number } | null;
  saveLastSession(drillType: DrillType, duration: number): void;
}
```

#### BreathPacer
Visual breathing guide for breathing drills.

```javascript
interface BreathPacer {
  start(pattern: BreathPattern): void;
  stop(): void;
  setReducedMotion(enabled: boolean): void;
}

interface BreathPattern {
  inhale: number;    // seconds
  hold1: number;     // seconds
  exhale: number;    // seconds
  hold2: number;     // seconds
}
```

#### InsightEngine
Generates practice insights and patterns.

```javascript
interface InsightEngine {
  generateInsights(sessions: SessionLog[]): Insight[];
  getMostCommonTimeOfDay(sessions: SessionLog[]): string;
  getAverageSessionDuration(sessions: SessionLog[]): number;
}

interface Insight {
  type: 'pattern' | 'milestone' | 'encouragement';
  message: string;
  data?: any;
}
```

#### RecommendationEngine
Provides personalized drill recommendations.

```javascript
interface RecommendationEngine {
  getRecommendation(sessions: SessionLog[]): DrillRecommendation;
  shouldSuggestVariety(sessions: SessionLog[]): boolean;
}

interface DrillRecommendation {
  suggestedDrill: DrillType;
  reason: string;
  confidence: number;
}
```

#### AmbientAudio
Manages ambient background sounds during practice.

```javascript
interface AmbientAudio {
  play(soundType: 'rain' | 'waves' | 'whitenoise' | 'forest'): void;
  stop(): void;
  setVolume(level: number): void;
  isPlaying(): boolean;
}
```

#### ProgressionManager
Tracks user experience level and suggests appropriate difficulty.

```javascript
interface ProgressionManager {
  getRecommendedDuration(sessionCount: number): number;
  shouldSuggestIncrease(sessions: SessionLog[]): boolean;
  getUserLevel(sessionCount: number): 'beginner' | 'intermediate' | 'advanced';
}
```

#### ServiceWorkerManager
Handles offline functionality and asset caching.

```javascript
interface ServiceWorkerManager {
  register(): Promise<void>;
  isOffline(): boolean;
  onStatusChange(callback: (isOffline: boolean) => void): void;
  cacheAssets(assets: string[]): Promise<void>;
}
```

#### VirtualEnvironmentManager
Manages immersive background environments during practice.

```javascript
interface VirtualEnvironmentManager {
  setEnvironment(env: VirtualEnvironment): void;
  getEnvironment(): VirtualEnvironment;
  applyEnvironment(element: HTMLElement): void;
}

type VirtualEnvironment = 'forest' | 'ocean' | 'space' | 'zen' | 'minimal';
```

#### GlassmorphismStyler
Applies glassmorphism effects to UI elements.

```javascript
interface GlassmorphismStyler {
  applyGlassEffect(element: HTMLElement, intensity?: number): void;
  removeGlassEffect(element: HTMLElement): void;
  ensureContrast(element: HTMLElement): boolean;
}
```

#### SentimentTracker
Tracks and analyzes user sentiment data.

```javascript
interface SentimentTracker {
  getMostCommonSentiment(sessions: SessionLog[]): Sentiment | null;
  getSentimentTrend(sessions: SessionLog[]): 'improving' | 'stable' | 'declining' | null;
  getSentimentDistribution(sessions: SessionLog[]): Map<Sentiment, number>;
}
```

## Data Models

### SessionLog
Represents a completed practice session.

```javascript
interface SessionLog {
  id: string;                    // Format: "YYYYMMDD-N"
  date: string;                  // ISO 8601 timestamp
  duration_min: number;          // Duration in minutes
  type: DrillType;               // Drill type identifier
  note?: string;                 // Optional user note
  focusRating?: number;          // Optional 1-5 focus quality rating
  sentiment?: Sentiment;         // Optional emotional state
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';  // Time classification
}

type Sentiment = 
  | 'calm' 
  | 'focused' 
  | 'restless' 
  | 'peaceful' 
  | 'energized' 
  | 'distracted' 
  | 'content' 
  | 'anxious';

type DrillType = 
  | 'focused_breathing'
  | 'body_scan_micro'
  | 'attention_to_sound'
  | 'box_breathing';
```

### Stats
Computed statistics for display.

```javascript
interface Stats {
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  weeklyMinutes: number;
  monthlyMinutes: number;
  last7Days: DayActivity[];
  averageFocusRating?: number;
  milestones: Milestone[];
}

interface DayActivity {
  date: string;              // YYYY-MM-DD
  sessionCount: number;
  totalMinutes: number;
}

interface Milestone {
  type: 'sessions_10' | 'sessions_25' | 'sessions_50' | 'sessions_100';
  achieved: boolean;
  date?: string;
}
```

### UserPreferences
User settings stored in LocalStorage.

```javascript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  audioEnabled: boolean;
  reducedMotion: boolean;
  lastDrillType?: DrillType;
  lastDuration?: number;
  ambientSound?: 'rain' | 'waves' | 'whitenoise' | 'forest' | 'none';
  ambientVolume?: number;
  weeklyGoalMinutes?: number;
  virtualEnvironment?: 'forest' | 'ocean' | 'space' | 'zen' | 'minimal';
}
```

### Drill Script Format
Drill scripts are stored as JSON objects.

```json
{
  "focused_breathing": {
    "id": "focused_breathing",
    "name": "Focused Breathing",
    "description": "Use the breath to anchor attention",
    "instructions": "Sit comfortably. Soft gaze or eyes closed. We'll use the breath to anchor attention.",
    "defaultDuration": 5,
    "cues": [
      {"t": 0, "text": "Notice your breath. No need to change it."},
      {"t": 30, "text": "Take a slow inhale for 3 counts, exhale for 4."},
      {"t": 60, "text": "Return to natural breathing. If your mind wanders, gently return to the breath."},
      {"t": 120, "text": "Continue breathing naturally. Notice the sensation of each breath."},
      {"t": 180, "text": "If your mind has wandered, gently guide it back to the breath."},
      {"t": 240, "text": "Take a few more conscious breaths."},
      {"t": 285, "text": "Gently open your eyes. Take a moment to notice how you feel."}
    ]
  }
}
```

## Error Handling

### Error Categories

1. **Storage Errors**
   - LocalStorage quota exceeded
   - LocalStorage unavailable (private browsing)
   - Data corruption or invalid JSON

2. **TTS Errors**
   - Web Speech API not supported
   - Speech synthesis fails mid-session
   - No voices available

3. **Timer Errors**
   - Timer drift or inaccuracy
   - Background tab throttling

4. **User Input Errors**
   - Invalid duration selection
   - Invalid note text (too long)

### Error Handling Strategy

#### Storage Errors
```javascript
try {
  storageManager.saveSession(session);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    // Prompt user to export and clear old data
    showError('Storage full. Please export your logs and clear old sessions.');
  } else {
    // Offer session data as download
    showError('Unable to save session. Download your session data?');
    offerSessionDownload(session);
  }
}
```

#### TTS Errors
```javascript
if (!ttsEngine.isSupported()) {
  // Gracefully degrade to text-only
  showNotification('Audio not available. Text cues will be displayed.');
  disableAudioControls();
}

ttsEngine.onError((error) => {
  // Continue session without audio
  console.warn('TTS error:', error);
  ttsEngine.setEnabled(false);
});
```

#### Timer Errors
```javascript
// Use multiple timing mechanisms for accuracy
class TimerController {
  private startTime: number;
  private duration: number;
  
  getRemainingTime(): number {
    // Calculate based on actual elapsed time, not tick count
    const elapsed = Date.now() - this.startTime;
    return Math.max(0, this.duration - elapsed);
  }
}
```

### User-Friendly Error Messages

All errors shown to users follow these principles:
- Clear, non-technical language
- Actionable next steps
- No blame or negative framing

Examples:
- ❌ "LocalStorage quota exceeded"
- ✅ "Storage full. Export your logs to free up space."

- ❌ "SpeechSynthesis API unavailable"
- ✅ "Audio not available. Text cues will guide you instead."

## Testing Strategy

### Unit Testing

Unit tests will verify individual components and functions work correctly in isolation. We'll use a lightweight testing framework (e.g., Vitest or Jest) to test:

**Storage Layer:**
- Session saving and retrieval
- Preference persistence
- Export to CSV/JSON formats
- Handling of corrupted data

**Statistics Calculation:**
- Streak computation with various session patterns
- Weekly minutes aggregation
- Last 7 days activity generation

**Timer Controller:**
- Countdown accuracy
- Pause/resume functionality
- Completion callback triggering

**Cue Scheduler:**
- Cue timing accuracy
- Pause/resume behavior
- Handling of overlapping cues

**Drill Library:**
- Drill retrieval by type
- Validation of drill script format

### Property-Based Testing

Property-based tests will verify universal properties that should hold across all inputs using a PBT library (fast-check for JavaScript). We'll configure each property test to run a minimum of 100 iterations.

Each property-based test will be tagged with a comment explicitly referencing the correctness property from the design document using this format: `**Feature: daily-attention-trainer, Property {number}: {property_text}**`

The property-based tests will validate:

- Data integrity properties (serialization/deserialization)
- Statistical computation properties (streak calculations)
- State machine properties (valid transitions)
- UI behavior properties (accessibility requirements)

### Integration Testing

Integration tests will verify that components work together correctly:

- Complete session flow (start → practice → log)
- State transitions between screens
- Timer and cue scheduler coordination
- Storage and stats panel synchronization

### Accessibility Testing

- Keyboard navigation through all interactive elements
- Screen reader announcements for dynamic content
- Color contrast validation
- Reduced motion preference handling

### Performance Testing

- Initial load time under 2 seconds
- JavaScript bundle size under 150 KB
- Smooth animations at 60 FPS
- Timer accuracy within 100ms over 10 minutes

### Browser Compatibility Testing

Test on:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 15+)
- Chrome Mobile (Android 10+)

### Manual Testing Checklist

- [ ] Complete a 5-minute session end-to-end
- [ ] Verify streak calculation after multiple sessions
- [ ] Test pause/resume during practice
- [ ] Export data as CSV and JSON
- [ ] Toggle theme and verify persistence
- [ ] Enable/disable audio and verify TTS
- [ ] Test on mobile device (portrait and landscape)
- [ ] Verify keyboard navigation
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Clear LocalStorage and verify graceful handling

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: LocalStorage persistence round-trip
*For any* user preference (theme, audio setting) or session data, storing the value in LocalStorage and then retrieving it should return an equivalent value.
**Validates: Requirements 4.3, 6.2, 11.3**

### Property 2: Session log completeness
*For any* completed session with duration, drill type, and optional note, logging the session should store a record containing all provided fields (date, duration, drill type, note) that can be retrieved.
**Validates: Requirements 5.2, 13.4**

### Property 3: Unique session identifiers
*For any* set of sessions logged on the same date, each session should have a unique identifier following the format "YYYYMMDD-N" where N increments for each session that day.
**Validates: Requirements 5.5**

### Property 4: Streak calculation correctness
*For any* sequence of session logs, the computed streak should equal the number of consecutive days (ending with today or the most recent session date) where at least one session was completed.
**Validates: Requirements 7.2**

### Property 5: Weekly minutes aggregation
*For any* set of session logs, the weekly minutes total should equal the sum of all session durations that occurred within the current week (Sunday through Saturday).
**Validates: Requirements 7.3**

### Property 6: Statistics update after session
*For any* initial statistics state and newly logged session, the updated statistics should reflect the new session in total count, streak calculation, and weekly minutes.
**Validates: Requirements 7.4, 5.3**

### Property 7: Export data completeness
*For any* set of session logs, exporting to JSON and then parsing should produce an equivalent set of session records with all fields intact (date, duration, drill type, notes).
**Validates: Requirements 8.2, 8.3**

### Property 8: Cue scheduling accuracy
*For any* drill script with scheduled cues, when the drill executes, each cue should be displayed at its specified time (within 100ms tolerance).
**Validates: Requirements 3.2, 13.3**

### Property 9: TTS triggering on cue updates
*For any* cue update during an active session, if audio is enabled, the TTS engine should be invoked with the cue text.
**Validates: Requirements 3.3**

### Property 10: Timer completion triggers state transition
*For any* active practice session, when the timer reaches zero, the application state should automatically transition to the completion screen.
**Validates: Requirements 3.5**

### Property 11: Skip logging preserves storage
*For any* storage state before session completion, if the user chooses not to log the session, the storage state should remain unchanged.
**Validates: Requirements 5.4**

### Property 12: Drill script loading
*For any* valid drill type selection, the application should load the corresponding drill script with matching cues and metadata.
**Validates: Requirements 13.2**

### Property 13: Touch target minimum size
*For all* interactive elements (buttons, controls) in the application, the rendered touch target size should be at least 44x44 pixels.
**Validates: Requirements 9.2**

### Property 14: Keyboard focus indicators
*For all* interactive elements, when focused via keyboard navigation, a visible focus indicator should be present with sufficient contrast.
**Validates: Requirements 10.1**

### Property 15: ARIA live region updates
*For any* cue update during practice, the cue text should be placed in an ARIA live region to trigger screen reader announcements.
**Validates: Requirements 10.2**

### Property 16: Color contrast compliance
*For all* text elements in both light and dark themes, the color contrast ratio between text and background should be at least 4.5:1.
**Validates: Requirements 10.4, 11.4**

### Property 17: Keyboard shortcut support
*For all* application states, standard keyboard shortcuts (Tab for navigation, Enter/Space for activation, Escape for cancel) should perform their expected actions.
**Validates: Requirements 10.5**

### Property 18: State transition performance
*For any* user-initiated state transition (duration selection to instruction, instruction to practice), the transition should complete within 1 second.
**Validates: Requirements 1.3, 2.3**

### Property 19: Error message user-friendliness
*For any* error condition (storage failure, TTS unavailable, timer error), the displayed error message should contain no technical jargon and should provide actionable next steps.
**Validates: Requirements 15.4**

### Property 20: Virtual environment persistence
*For any* virtual environment selection, storing the preference and then retrieving it should return the same environment value.
**Validates: Requirements 26.3**

### Property 21: Sentiment storage completeness
*For any* session logged with a sentiment value, the stored session record should contain the sentiment field that can be retrieved.
**Validates: Requirements 28.2**

### Property 22: Glassmorphism contrast compliance
*For all* UI elements with glassmorphism effects applied, the text contrast ratio should remain at least 4.5:1 to ensure readability.
**Validates: Requirements 27.3**

### Property 23: Most common sentiment calculation
*For any* set of sessions with sentiment data, the most common sentiment should be the sentiment value that appears most frequently in the set.
**Validates: Requirements 28.4**

## Enhanced Features for Goal Efficiency

### 1. Adaptive Drill Recommendations

**Goal:** Help users practice the right drill at the right time based on their patterns and needs.

**Implementation:**
- Track which drills users complete most often
- Analyze time-of-day patterns (morning vs evening practice)
- Suggest drills based on recent completion patterns
- Offer variety when users repeat the same drill too often

**Data Model Addition:**
```javascript
interface DrillRecommendation {
  suggestedDrill: DrillType;
  reason: string;  // "You haven't tried this one yet" | "Good for morning practice"
  confidence: number;
}
```

### 2. Micro-Progress Indicators

**Goal:** Provide immediate, tangible feedback that reinforces the habit loop.

**Implementation:**
- Show "minutes practiced this month" prominently
- Display a simple progress ring that fills as weekly goal is met
- Add milestone badges (10 sessions, 50 sessions, 100 sessions)
- Show "longest streak" alongside current streak

**Visual Design:**
```
┌─────────────────────────────┐
│  Current Streak: 5 days 🔥  │
│  Longest Streak: 12 days    │
│  ────────────────────────    │
│  This Week: 25 min / 35 min │
│  [████████░░] 71%            │
└─────────────────────────────┘
```

### 3. Session Quality Self-Rating

**Goal:** Build metacognitive awareness and provide richer data for insights.

**Implementation:**
- After each session, ask: "How focused were you?" (1-5 scale or emoji)
- Track focus ratings over time
- Show trends: "Your focus improves on morning sessions"
- Optional: Correlate focus with drill type, duration, time of day

**Data Model Addition:**
```javascript
interface SessionLog {
  // ... existing fields
  focusRating?: number;  // 1-5 scale
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
}
```

### 4. Gentle Reminders Without Notifications

**Goal:** Encourage daily practice without being intrusive.

**Implementation:**
- Show "Last practiced: 2 days ago" on landing page
- Display a subtle "Practice today?" prompt if user hasn't practiced yet
- Use browser tab title to show streak: "(5🔥) Attention Trainer"
- Generate a shareable calendar link (ICS file) for daily reminders

### 5. Breath Pacer Visual

**Goal:** Enhance breathing drills with a visual guide for pacing.

**Implementation:**
- Animated circle that expands (inhale) and contracts (exhale)
- Synced with cue timing for breathing drills
- Respects reduced-motion preferences (use opacity instead of scale)
- Optional: Add subtle haptic feedback on mobile devices

**Component:**
```javascript
interface BreathPacer {
  start(pattern: BreathPattern): void;
  stop(): void;
  setReducedMotion(enabled: boolean): void;
}

interface BreathPattern {
  inhale: number;    // seconds
  hold1: number;     // seconds
  exhale: number;    // seconds
  hold2: number;     // seconds
}
```

### 6. Insight Generation

**Goal:** Help users understand their practice patterns and stay motivated.

**Implementation:**
- After 7 sessions: "You practice most often in the evening"
- After 14 sessions: "Your average session is 6 minutes"
- After 30 sessions: "You've practiced 150 minutes this month—that's 2.5 hours of attention training!"
- Show simple charts: sessions per day of week, focus ratings over time

**Data Analysis:**
```javascript
interface InsightEngine {
  generateInsights(sessions: SessionLog[]): Insight[];
}

interface Insight {
  type: 'pattern' | 'milestone' | 'encouragement';
  message: string;
  data?: any;
}
```

### 7. Quick Start from Last Session

**Goal:** Reduce friction for repeat users.

**Implementation:**
- Show "Resume: 5-min Focused Breathing" button on landing
- Remember last used duration and drill type
- One-click to start the same session again
- Still allow choosing different options

### 8. Offline-First with Service Worker

**Goal:** Make the app work reliably anywhere, anytime.

**Implementation:**
- Cache all static assets (HTML, CSS, JS, drill scripts)
- Store sessions in IndexedDB as backup to LocalStorage
- Show "Offline mode" indicator when no connection
- Sync data when connection returns (if user opts into cloud sync later)

### 9. Ambient Sound Options

**Goal:** Help users focus better with optional background audio.

**Implementation:**
- Offer 3-4 ambient sounds: rain, waves, white noise, forest
- Low-volume background audio during practice
- Stored as small audio files or generated with Web Audio API
- Preference saved in LocalStorage

**Component:**
```javascript
interface AmbientAudio {
  play(soundType: 'rain' | 'waves' | 'whitenoise' | 'forest'): void;
  stop(): void;
  setVolume(level: number): void;
}
```

### 10. Progressive Drill Difficulty

**Goal:** Help users build attention capacity gradually.

**Implementation:**
- Start new users with 2-minute sessions
- Suggest increasing duration after 5 successful sessions
- Introduce more challenging drills (open awareness, noting practice) after 20 sessions
- Track "attention capacity" as a simple metric

### Priority Ranking for MVP+1

Based on impact vs. effort:

**High Priority (implement next):**
1. Quick Start from Last Session - Very low effort, high friction reduction
2. Micro-Progress Indicators - Medium effort, high motivation impact
3. Session Quality Self-Rating - Low effort, builds awareness
4. Gentle Reminders - Low effort, improves retention

**Medium Priority:**
5. Breath Pacer Visual - Medium effort, enhances breathing drills
6. Adaptive Drill Recommendations - Medium effort, personalizes experience
7. Insight Generation - Medium effort, provides value from data

**Lower Priority (nice to have):**
8. Ambient Sound Options - Higher effort, optional enhancement
9. Offline-First Service Worker - Higher effort, reliability improvement
10. Progressive Drill Difficulty - Higher effort, requires careful design

### Implementation Notes

- Each feature should be optional/progressive enhancement
- Maintain core simplicity: one-page, one-tap logging
- Features should add value without adding complexity to the primary flow
- All features must respect privacy-first principles (local storage, no tracking)
