# Daily Attention Trainer 🧘‍♀️

A beautiful, privacy-first web app for daily attention training with immersive virtual environments and modern glassmorphism UI.

## ✨ Core Features

### 🌲 Virtual Environments
- **5 Immersive Backgrounds**: Forest, Ocean, Space, Zen Garden, Minimal
- Switch environments with one tap
- Calming visuals enhance focus

### 💎 Glassy Morphic UI
- Modern frosted glass design
- Backdrop blur effects
- Smooth transitions and depth
- Light & dark themes

### 😌 Sentiment Tracking
- **8 Emotion Options**: Calm, Focused, Peaceful, Energized, Restless, Distracted, Content, Anxious
- Track emotional patterns over time
- See your most common mood

## 🎯 Features

### Core Practice
- **5 Duration Options**: 2, 5, 8, 10, or 30 minutes
- **4 Science-Based Drills**: Focused Breathing, Body Scan, Attention to Sound, Box Breathing
- **🎵 Soothing Background Music**: Calming ambient music during practice
- **Animated Breath Pacer**: Visual guide for breathing exercises
- **Real-Time Brain Training**: See what's happening in your brain during practice

### Gamification & Motivation 🎮
- **XP & Leveling System**: Earn XP, level up from Beginner to Zen Master
- **Achievement Badges**: Unlock 4 badges (First Step, Week Warrior, Zen Master, Century Club)
- **Daily Quotes**: Inspirational mindfulness quotes that change daily
- **Attention Span Tracker**: Watch your focus capacity grow from 2 to 15+ minutes
- **Dopamine Detox Counter**: Track recovery from social media damage
- **Celebration Animations**: Confetti and rewards after each session

### Progress & Insights 📊
- **Focus Rating**: Rate your attention quality (1-5 scale)
- **Sentiment Tracking**: Log how you feel after each session
- **Streak Tracking**: Build and maintain daily practice streaks
- **Weekly Reports**: See your improvement over time
- **Before/After Stats**: Concrete proof of your progress

### User Experience ✨
- **Quick Start**: One-tap resume of last session
- **Beautiful Glassmorphism UI**: Modern frosted glass design
- **5 Virtual Environments**: Forest, Ocean, Space, Zen Garden, Minimal
- **Light/Dark Themes**: Comfortable in any lighting
- **Privacy-First**: All data stored locally in your browser
- **Export Data**: Download your logs as JSON or CSV
- **Mobile-First**: Responsive design, works great on phones
- **Accessible**: Keyboard navigation, screen reader support

## 🚀 Quick Start

1. Open `index.html` in your browser
2. Click "Start 5-minute drill"
3. Choose your duration
4. Follow the guided practice
5. Log your session with optional rating and sentiment

## 📱 Usage

### First Time
1. **Landing Screen**: See your stats and start button
2. **Duration**: Choose 2, 5, 8, 10, or 30 minutes (with optional music)
3. **Instructions**: Brief overview of the drill
4. **Practice**: Follow timer and text cues with soothing background music
5. **Complete**: Rate focus, select sentiment, log session

### Returning Users
- Use **Quick Start** button to repeat your last session
- Switch **themes** (☀️/🌙) for light/dark mode
- Change **environments** (🌲) to cycle through backgrounds
- Toggle **music** (🎵/🔇) on or off
- **Export** (📥) your data anytime

## 🎨 Customization

### Themes
- **Dark Mode**: Default, great for evening practice
- **Light Mode**: Bright, ideal for daytime

### Environments
- **Forest** 🌲: Green, grounding
- **Ocean** 🌊: Blue, calming
- **Space** 🌌: Deep, expansive
- **Zen** 🪷: Minimal, peaceful
- **Minimal** 🎨: Gradient, modern

## 💾 Data & Privacy

- **100% Local**: No servers, no tracking, no accounts
- **Your Browser**: All data stored in localStorage
- **Export Anytime**: Download JSON or CSV
- **Clear Anytime**: Browser data clearing removes all logs

## 🛠️ Technical Stack

- **Vanilla JavaScript**: No frameworks, fast and simple
- **HTML5 Audio**: Background music playback
- **CSS Glassmorphism**: Modern backdrop-filter effects
- **LocalStorage API**: Client-side data persistence
- **Responsive CSS**: Mobile-first design
- **Accessibility**: ARIA labels, keyboard support

## 📊 Statistics Tracked

- Current streak (consecutive days)
- Longest streak achieved
- Total sessions completed
- Weekly minutes practiced
- Monthly minutes practiced
- Most common sentiment
- Average focus rating

## 🎯 Drill Types

### Focused Breathing (5 min)
Anchor attention to the breath with gentle reminders.

### Body Scan (5 min)
Quick scan from head to toes, noticing sensations.

### Attention to Sound (5 min)
Listen to ambient sounds, practicing awareness.

### Box Breathing (2-5 min)
4-4-4-4 pattern: inhale, hold, exhale, hold.

## 🌟 Tips for Best Experience

1. **Daily Practice**: Even 2 minutes builds the habit
2. **Same Time**: Practice at consistent times
3. **Quiet Space**: Find a calm environment
4. **Headphones**: Optional, but enhances focus
5. **Track Mood**: Use sentiment tracking to notice patterns

## 🔧 Development

### File Structure
```
├── index.html          # Main HTML structure
├── styles.css          # Glassmorphism styling
├── app.js              # Application logic
├── ambient-music.mp3   # Background music file
└── README.md           # Documentation
```

### Key Classes
- `AppState`: Manages screen transitions
- `StorageManager`: Handles localStorage operations
- `StatsCalculator`: Computes streaks and statistics
- `TimerController`: Countdown timer with pause/resume
- `CueScheduler`: Schedules text cue updates

## 📄 License

MIT License - Feel free to use and modify!

## 🙏 Acknowledgments

Built with attention to simplicity, privacy, and user experience.

---

**Start your practice today. One short session. Every day.** 🧘‍♀️✨
