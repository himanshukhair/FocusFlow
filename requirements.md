# Requirements Document

## Introduction

The Daily Attention Trainer is a single-page web application that provides busy adults with short, science-based attention drills (5–10 minutes) to build a daily mindfulness practice. The application features a modern glassy morphic UI design with immersive virtual environments and sentiment tracking. It prioritizes simplicity, privacy, and low friction—requiring no account, storing data locally in the browser, and offering a mobile-first, accessible experience with beautiful visual aesthetics.

## Glossary

- **Application**: The Daily Attention Trainer web application
- **User**: A busy adult seeking short attention training exercises
- **Session**: A single completed attention drill practice
- **Drill**: A guided attention exercise with scripted text cues (e.g., focused breathing, body scan)
- **Timer**: A countdown display showing remaining practice time
- **Cue**: A short text instruction displayed during practice at scheduled intervals
- **Log**: A stored record of a completed session
- **Streak**: The number of consecutive days with at least one completed session
- **TTS**: Text-to-speech audio output using the Web Speech API
- **LocalStorage**: Browser-based data storage for session logs
- **Practice Screen**: The interface displaying the timer and cues during an active drill
- **Focus Rating**: A user's self-assessment of attention quality during a session (1-5 scale)
- **Insight**: An automatically generated observation about practice patterns or milestones
- **Breath Pacer**: An animated visual guide that synchronizes with breathing patterns
- **Ambient Sound**: Optional background audio (rain, waves, white noise) during practice
- **Service Worker**: Browser technology enabling offline functionality and asset caching
- **Virtual Environment**: An immersive visual background scene (nature, space, abstract) displayed during practice
- **Glassy Morphic UI**: Modern UI design using glassmorphism effects (frosted glass, blur, transparency)
- **Sentiment**: User's emotional state or feeling captured after a session (calm, focused, restless, peaceful, etc.)

## Requirements

### Requirement 1

**User Story:** As a user, I want to start a practice session immediately with minimal friction, so that I can quickly begin my daily attention training without barriers.

#### Acceptance Criteria

1. WHEN a user visits the Application THEN the Application SHALL display a landing screen with a single-line value statement and a prominent start button
2. WHEN a user clicks the start button THEN the Application SHALL present duration options (2, 5, 8, or 10 minutes) with 5 minutes as the recommended default
3. WHEN a user selects a duration THEN the Application SHALL proceed to the brief instruction screen within 1 second
4. THE Application SHALL require no account creation or login to access core functionality
5. THE Application SHALL load the initial page with less than 150 kilobytes of JavaScript

### Requirement 2

**User Story:** As a user, I want clear, minimal instructions before starting a drill, so that I understand what to do without feeling overwhelmed.

#### Acceptance Criteria

1. WHEN the instruction screen displays THEN the Application SHALL show a brief explanation of the selected drill (10-20 seconds reading time)
2. WHEN the instruction screen displays THEN the Application SHALL provide a prominent Start button to begin the practice
3. WHEN a user clicks the Start button THEN the Application SHALL transition to the Practice Screen within 500 milliseconds

### Requirement 3

**User Story:** As a user, I want to follow a guided practice with a timer and periodic cues, so that I can maintain focus throughout the session.

#### Acceptance Criteria

1. WHEN the Practice Screen displays THEN the Application SHALL show a large, clearly visible countdown timer
2. WHILE a session is active THEN the Application SHALL display short text cues at scheduled intervals (every 30-60 seconds)
3. WHEN a cue updates THEN the Application SHALL announce the new cue text via TTS if the user has enabled audio
4. WHEN a session is active THEN the Application SHALL provide pause and resume controls
5. WHEN the timer reaches zero THEN the Application SHALL automatically transition to the end screen

### Requirement 4

**User Story:** As a user, I want to enable optional audio guidance during practice, so that I can follow along without looking at the screen.

#### Acceptance Criteria

1. WHEN a user initiates TTS THEN the Application SHALL use the Web Speech API to speak cue text
2. WHEN TTS is active THEN the Application SHALL provide a control to mute or unmute audio
3. WHEN a user toggles audio settings THEN the Application SHALL persist the preference in LocalStorage
4. IF the Web Speech API is unavailable THEN the Application SHALL continue functioning with text-only cues

### Requirement 5

**User Story:** As a user, I want to log completed sessions with one tap, so that I can track my practice without extra effort.

#### Acceptance Criteria

1. WHEN a session completes THEN the Application SHALL display an end screen with a "Log session" button
2. WHEN a user clicks "Log session" THEN the Application SHALL store a session record in LocalStorage containing date, duration, drill type, and optional note
3. WHEN a session is logged THEN the Application SHALL display immediate feedback showing updated streak information
4. WHEN a user chooses not to log THEN the Application SHALL return to the landing screen without storing data
5. WHEN storing a log entry THEN the Application SHALL generate a unique identifier combining date and sequence number

### Requirement 6

**User Story:** As a user, I want to add an optional note after a session, so that I can capture how I felt during practice.

#### Acceptance Criteria

1. WHEN the end screen displays THEN the Application SHALL provide an optional "Add note" field
2. WHEN a user enters a note THEN the Application SHALL store the note text with the session log
3. WHEN a user logs a session without a note THEN the Application SHALL store the session with an empty note field

### Requirement 7

**User Story:** As a user, I want to see my practice statistics including streaks and total sessions, so that I can track my progress and stay motivated.

#### Acceptance Criteria

1. WHEN the landing screen displays THEN the Application SHALL show a stats panel with total sessions, current streak, and last 7 days activity
2. WHEN computing streak THEN the Application SHALL count consecutive days with at least one completed session
3. WHEN displaying weekly statistics THEN the Application SHALL calculate total minutes practiced in the current week
4. WHEN a user completes a session THEN the Application SHALL update all statistics immediately
5. WHEN a user reaches a 7-day streak THEN the Application SHALL display a celebratory animation

### Requirement 8

**User Story:** As a user, I want to export my practice logs, so that I can use the data with other tracking tools or keep a backup.

#### Acceptance Criteria

1. WHEN a user requests export THEN the Application SHALL generate a CSV file containing all session logs
2. WHEN a user requests export THEN the Application SHALL generate a JSON file containing all session logs
3. WHEN exporting data THEN the Application SHALL include all fields: date, duration, drill type, and notes
4. WHEN a user downloads an export THEN the Application SHALL name the file with the current date

### Requirement 9

**User Story:** As a user, I want the application to work well on mobile devices, so that I can practice anywhere.

#### Acceptance Criteria

1. THE Application SHALL use a mobile-first responsive design
2. WHEN displayed on mobile devices THEN the Application SHALL render all interactive elements with minimum touch target size of 44 pixels
3. WHEN the viewport width is less than 768 pixels THEN the Application SHALL optimize layout for single-column display
4. WHEN a user rotates their device THEN the Application SHALL adapt the layout within 500 milliseconds

### Requirement 10

**User Story:** As a user with accessibility needs, I want the application to support keyboard navigation and screen readers, so that I can use it independently.

#### Acceptance Criteria

1. WHEN a user navigates with keyboard THEN the Application SHALL provide visible focus indicators on all interactive elements
2. WHEN screen reader technology is active THEN the Application SHALL announce cue updates using ARIA live regions
3. WHEN a user enables reduced motion preferences THEN the Application SHALL disable or minimize animations
4. THE Application SHALL maintain color contrast ratios of at least 4.5:1 for normal text
5. WHEN a user navigates with keyboard THEN the Application SHALL support standard keyboard shortcuts (Tab, Enter, Space, Escape)

### Requirement 11

**User Story:** As a user, I want to choose between light and dark themes, so that I can use the application comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHEN a user visits the Application THEN the Application SHALL detect system theme preference and apply matching theme
2. WHEN a user toggles theme THEN the Application SHALL switch between light and dark color schemes
3. WHEN a user changes theme THEN the Application SHALL persist the preference in LocalStorage
4. WHEN applying themes THEN the Application SHALL maintain accessibility contrast requirements

### Requirement 12

**User Story:** As a privacy-conscious user, I want my data to stay in my browser by default, so that I can practice without concerns about data collection.

#### Acceptance Criteria

1. THE Application SHALL store all session logs exclusively in LocalStorage by default
2. THE Application SHALL display a clear privacy statement explaining local-only data storage
3. THE Application SHALL not transmit user data to external servers without explicit opt-in
4. WHEN a user clears browser data THEN the Application SHALL lose access to stored logs and inform the user about export options

### Requirement 13

**User Story:** As a user, I want access to multiple types of attention drills, so that I can vary my practice and target different skills.

#### Acceptance Criteria

1. THE Application SHALL provide at least four drill types: focused breathing, body scan micro, attention to sound, and box breathing
2. WHEN a user selects a drill type THEN the Application SHALL load the corresponding cue script and timing
3. WHEN a drill executes THEN the Application SHALL display cues at intervals specified in the drill script
4. WHEN storing a session log THEN the Application SHALL record which drill type was used

### Requirement 14

**User Story:** As a user, I want drill scripts to be based on established attention training techniques, so that I can trust the effectiveness of the practice.

#### Acceptance Criteria

1. WHEN a focused breathing drill runs THEN the Application SHALL guide attention to breath with cues every 30-45 seconds
2. WHEN a body scan drill runs THEN the Application SHALL guide attention through body regions (head, jaw, neck, shoulders, chest, belly, arms, hands, hips, legs, feet) with cues every 25-30 seconds
3. WHEN an attention to sound drill runs THEN the Application SHALL guide listening to ambient sounds with periodic reminders to notice and return
4. WHEN a box breathing drill runs THEN the Application SHALL guide a 4-4-4-4 breathing pattern (inhale 4s, hold 4s, exhale 4s, hold 4s)

### Requirement 15

**User Story:** As a user, I want the application to load quickly and work reliably, so that I can start practicing without delays or technical issues.

#### Acceptance Criteria

1. WHEN a user loads the Application THEN the Application SHALL display interactive content within 2 seconds on a standard mobile connection
2. THE Application SHALL function with JavaScript enabled as the primary experience
3. WHEN JavaScript fails to load THEN the Application SHALL display a fallback message with basic instructions
4. WHEN the Application encounters errors THEN the Application SHALL display user-friendly error messages without technical jargon

### Requirement 16

**User Story:** As a returning user, I want to quickly resume my usual practice, so that I can start without selecting options each time.

#### Acceptance Criteria

1. WHEN a user has completed at least one session THEN the Application SHALL display a "Quick Start" button on the landing screen
2. WHEN a user clicks the Quick Start button THEN the Application SHALL start a session using the last selected duration and drill type
3. WHEN a user has no session history THEN the Application SHALL not display the Quick Start button
4. WHEN the Application stores last session preferences THEN the Application SHALL persist the duration and drill type in LocalStorage

### Requirement 17

**User Story:** As a user, I want to see detailed progress indicators beyond basic stats, so that I can visualize my commitment and stay motivated.

#### Acceptance Criteria

1. WHEN the stats panel displays THEN the Application SHALL show total minutes practiced this month
2. WHEN the stats panel displays THEN the Application SHALL show the longest streak achieved
3. WHEN displaying weekly progress THEN the Application SHALL show a visual progress indicator (percentage or progress bar) toward a weekly goal
4. WHEN a user reaches milestone session counts (10, 25, 50, 100 sessions) THEN the Application SHALL display a badge or achievement indicator
5. WHEN computing monthly minutes THEN the Application SHALL sum all session durations from the current calendar month

### Requirement 18

**User Story:** As a user, I want to rate how focused I felt after each session, so that I can build awareness of my attention quality over time.

#### Acceptance Criteria

1. WHEN the end screen displays THEN the Application SHALL provide an optional focus rating input (1-5 scale or emoji selector)
2. WHEN a user provides a focus rating THEN the Application SHALL store the rating with the session log
3. WHEN a user logs a session without a focus rating THEN the Application SHALL store the session with no rating value
4. WHEN the stats panel displays THEN the Application SHALL show average focus rating for recent sessions
5. WHEN a user has at least 7 rated sessions THEN the Application SHALL display a simple trend indicator (improving, stable, declining)

### Requirement 19

**User Story:** As a user, I want gentle reminders about my practice without intrusive notifications, so that I can maintain consistency without feeling pressured.

#### Acceptance Criteria

1. WHEN the landing screen displays AND the user has not practiced today THEN the Application SHALL show a subtle "Practice today?" prompt
2. WHEN the landing screen displays THEN the Application SHALL show time since last practice (e.g., "Last practiced: 2 days ago")
3. WHEN the Application is loaded in a browser tab THEN the Application SHALL update the tab title to include current streak (e.g., "(5🔥) Attention Trainer")
4. WHEN a user requests a calendar reminder THEN the Application SHALL generate a downloadable ICS calendar file for daily practice reminders
5. THE Application SHALL not use browser push notifications by default

### Requirement 20

**User Story:** As a user practicing breathing drills, I want a visual guide for breath pacing, so that I can maintain the correct rhythm without counting.

#### Acceptance Criteria

1. WHEN a breathing drill (focused breathing or box breathing) is active THEN the Application SHALL display an animated breath pacer
2. WHEN the breath pacer animates THEN the Application SHALL expand during inhale phases and contract during exhale phases
3. WHEN the breath pacer displays THEN the Application SHALL synchronize animation timing with the drill's breathing pattern
4. WHEN a user has reduced motion preferences enabled THEN the Application SHALL use opacity changes instead of scale animations for the breath pacer
5. WHEN a non-breathing drill is active THEN the Application SHALL not display the breath pacer

### Requirement 21

**User Story:** As a user, I want the application to provide insights about my practice patterns, so that I can understand my habits and stay encouraged.

#### Acceptance Criteria

1. WHEN a user has completed at least 7 sessions THEN the Application SHALL generate and display practice pattern insights
2. WHEN generating insights THEN the Application SHALL identify the most common practice time (morning, afternoon, evening, night)
3. WHEN generating insights THEN the Application SHALL calculate and display average session duration
4. WHEN a user reaches monthly milestones THEN the Application SHALL display encouraging messages with total time practiced
5. WHEN displaying insights THEN the Application SHALL show a maximum of 2-3 insights at a time to avoid overwhelming the user

### Requirement 22

**User Story:** As a user, I want personalized drill recommendations, so that I can discover new practices and maintain variety in my training.

#### Acceptance Criteria

1. WHEN the drill selection screen displays THEN the Application SHALL highlight a recommended drill with a brief reason
2. WHEN computing recommendations THEN the Application SHALL suggest drills the user has not tried or has used infrequently
3. WHEN a user has completed the same drill type 3 consecutive times THEN the Application SHALL recommend trying a different drill type
4. WHEN a user practices at consistent times of day THEN the Application SHALL consider time-appropriate recommendations (e.g., energizing drills for morning)
5. WHEN a user has no session history THEN the Application SHALL recommend focused breathing as the default starting drill

### Requirement 23

**User Story:** As a user, I want optional ambient sounds during practice, so that I can create a more immersive focus environment.

#### Acceptance Criteria

1. WHEN the practice settings display THEN the Application SHALL provide options for ambient sounds (rain, waves, white noise, forest, or none)
2. WHEN a user selects an ambient sound THEN the Application SHALL play the sound at low volume during the practice session
3. WHEN a user adjusts ambient sound volume THEN the Application SHALL persist the volume preference in LocalStorage
4. WHEN a practice session ends THEN the Application SHALL stop playing ambient sounds
5. WHEN ambient sounds are enabled THEN the Application SHALL not interfere with TTS voice cues

### Requirement 24

**User Story:** As a user, I want the application to work offline, so that I can practice anywhere without requiring an internet connection.

#### Acceptance Criteria

1. WHEN a user visits the Application for the first time THEN the Application SHALL register a Service Worker to cache assets
2. WHEN the Service Worker is active THEN the Application SHALL cache all static assets (HTML, CSS, JavaScript, drill scripts)
3. WHEN a user loads the Application without internet connection THEN the Application SHALL serve cached assets and function normally
4. WHEN offline THEN the Application SHALL display an indicator showing offline status
5. WHEN the Application stores session data offline THEN the Application SHALL use IndexedDB as a backup to LocalStorage

### Requirement 25

**User Story:** As a new user, I want the application to guide me through progressive difficulty, so that I can build attention capacity gradually without feeling overwhelmed.

#### Acceptance Criteria

1. WHEN a new user starts their first session THEN the Application SHALL recommend a 2-minute duration
2. WHEN a user has completed 5 sessions successfully THEN the Application SHALL suggest increasing to 5-minute sessions
3. WHEN a user has completed 20 sessions THEN the Application SHALL unlock advanced drill types (if implemented)
4. WHEN displaying duration options THEN the Application SHALL indicate which durations are recommended based on user experience level
5. WHEN a user manually selects any duration THEN the Application SHALL allow the selection regardless of experience level

### Requirement 26

**User Story:** As a user, I want to practice in beautiful virtual environments, so that I can feel more immersed and relaxed during my attention training.

#### Acceptance Criteria

1. WHEN the Practice Screen displays THEN the Application SHALL show a virtual environment background (nature scene, space, abstract patterns, or minimal)
2. THE Application SHALL provide at least 4 virtual environment options (forest, ocean, space, zen garden)
3. WHEN a user selects a virtual environment THEN the Application SHALL persist the preference in LocalStorage
4. WHEN a virtual environment displays THEN the Application SHALL ensure text and UI elements remain clearly readable with sufficient contrast
5. WHEN a user has reduced motion preferences enabled THEN the Application SHALL display static or minimal-motion environment backgrounds

### Requirement 27

**User Story:** As a user, I want a modern glassy morphic interface, so that the application feels premium and calming.

#### Acceptance Criteria

1. THE Application SHALL use glassmorphism design principles (frosted glass effect, backdrop blur, semi-transparency)
2. WHEN UI cards and panels display THEN the Application SHALL apply glass-like visual effects with blur and subtle transparency
3. WHEN applying glassmorphism effects THEN the Application SHALL maintain accessibility standards for text contrast and readability
4. THE Application SHALL use smooth transitions and subtle shadows to create depth
5. WHEN the theme changes THEN the Application SHALL adapt glassmorphism effects to maintain visual consistency

### Requirement 28

**User Story:** As a user, I want to capture my emotional sentiment after each session, so that I can track how different practices affect my mood and mental state.

#### Acceptance Criteria

1. WHEN the end screen displays THEN the Application SHALL provide sentiment options (calm, focused, restless, peaceful, energized, distracted, content, anxious)
2. WHEN a user selects a sentiment THEN the Application SHALL store the sentiment with the session log
3. WHEN a user logs a session without selecting a sentiment THEN the Application SHALL store the session with no sentiment value
4. WHEN the stats panel displays AND the user has logged sentiments THEN the Application SHALL show the most common sentiment from recent sessions
5. WHEN displaying sentiment history THEN the Application SHALL use visual indicators (emoji or color-coded tags) for quick recognition
