# Implementation Plan

## Core Features: Virtual Environment, Glassy Morphic UI, Sentiments

- [x] 1. Create base HTML structure with glassmorphism styling


  - Single-page HTML with semantic structure
  - CSS variables for glass effects (blur, transparency, shadows)
  - Responsive mobile-first layout
  - _Requirements: 1.1, 9.1, 27.1, 27.2_



- [ ] 2. Implement virtual environment backgrounds
  - CSS background system for 4 environments (forest, ocean, space, zen)
  - Environment selector UI

  - LocalStorage persistence for environment preference
  - _Requirements: 26.1, 26.2, 26.3, 26.4_

- [ ] 3. Build glassmorphism UI components
  - Glass card components with backdrop-filter
  - Frosted glass panels for stats and controls

  - Smooth transitions and depth effects
  - Ensure text contrast meets accessibility
  - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5_

- [x] 4. Implement core state machine and navigation

  - AppState manager for screen transitions
  - Landing → Duration → Instruction → Practice → Complete flow
  - State persistence in memory
  - _Requirements: 1.2, 1.3, 2.3_


- [ ] 5. Create timer and cue system
  - TimerController with countdown logic
  - CueScheduler for timed text updates
  - Pause/resume functionality
  - _Requirements: 3.1, 3.2, 3.4, 3.5_


- [ ] 6. Build drill library with 4 drill types
  - JSON drill scripts (focused breathing, body scan, sound, box breathing)
  - Drill selector UI
  - Cue timing for each drill type
  - _Requirements: 13.1, 13.2, 13.3, 14.1, 14.2, 14.3, 14.4_


- [ ] 7. Implement session logging with sentiment tracking
  - SessionLog data model with sentiment field
  - LocalStorage save/retrieve functions
  - Sentiment selector UI (8 emotion options with emoji)
  - Optional note field

  - _Requirements: 5.1, 5.2, 5.5, 6.1, 6.2, 28.1, 28.2, 28.3_

- [ ] 8. Build statistics and progress tracking
  - StatsCalculator for streak, weekly/monthly minutes
  - Longest streak tracking

  - Most common sentiment display
  - Stats panel UI with glass effects
  - _Requirements: 7.1, 7.2, 7.3, 17.1, 17.2, 28.4, 28.5_

- [x] 9. Add quick start functionality

  - Quick start button for returning users
  - Last session preference storage
  - One-click resume
  - _Requirements: 16.1, 16.2, 16.3, 16.4_

- [ ] 10. Implement focus rating system
  - 1-5 rating selector on completion screen
  - Rating storage with sessions
  - Average rating display in stats
  - _Requirements: 18.1, 18.2, 18.3, 18.4_

- [ ] 11. Add breath pacer visual for breathing drills
  - Animated circle with expand/contract
  - Sync with breathing pattern timing
  - Reduced motion support (opacity instead of scale)
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_


- [ ] 12. Create insight generation system
  - Pattern detection (time of day, average duration)
  - Milestone messages
  - Display 2-3 insights on stats panel
  - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5_

- [ ] 13. Build drill recommendation engine
  - Recommend untried drills
  - Suggest variety after 3 consecutive same drills
  - Display recommendation with reason
  - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_

- [ ] 14. Add theme system (light/dark)
  - System preference detection
  - Theme toggle UI
  - LocalStorage persistence
  - Glass effects adapt to theme
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 15. Implement TTS audio system


  - Web Speech API integration
  - Mute/unmute controls
  - Graceful fallback if unavailable
  - Preference persistence
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 16. Add ambient sound system
  - 4 ambient sound options (rain, waves, white noise, forest)
  - Volume control
  - Play during practice session
  - Preference persistence
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_

- [ ] 17. Create export functionality
  - Export to JSON
  - Export to CSV
  - Include all fields (date, duration, drill, note, rating, sentiment)
  - Filename with current date
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 18. Add gentle reminder features
  - "Last practiced: X days ago" display
  - "Practice today?" prompt if not practiced
  - Tab title with streak emoji
  - ICS calendar file generator
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [ ] 19. Implement progressive difficulty system
  - Recommend 2 min for new users
  - Suggest 5 min after 5 sessions
  - Duration recommendations based on experience
  - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5_

- [ ] 20. Add milestone badges and celebrations
  - Badge system (10, 25, 50, 100 sessions)
  - Celebratory animation for 7-day streak
  - Visual milestone indicators
  - _Requirements: 7.5, 17.4_

- [ ] 21. Implement offline support with Service Worker
  - Service Worker registration
  - Cache static assets
  - Offline indicator
  - IndexedDB backup storage
  - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5_

- [ ] 22. Add accessibility features
  - Keyboard navigation with focus indicators
  - ARIA live regions for cue updates
  - Reduced motion support
  - Color contrast validation
  - Keyboard shortcuts (Tab, Enter, Space, Escape)
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 23. Optimize performance and mobile experience
  - Touch target minimum 44px
  - Single-column layout under 768px
  - Device rotation handling
  - Load time under 2 seconds
  - Bundle size under 150KB
  - _Requirements: 9.2, 9.3, 9.4, 15.1, 1.5_

- [ ] 24. Add error handling and privacy features
  - User-friendly error messages
  - Privacy statement display
  - No external data transmission
  - Graceful handling of cleared storage
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 15.4_

- [ ] 25. Final polish and deployment
  - Cross-browser testing
  - Mobile device testing
  - Deploy to GitHub Pages/Netlify
  - Create README with setup instructions
