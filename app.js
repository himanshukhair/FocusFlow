// FocusFlow - Professional Attention Trainer

// ===== CONSTANTS =====
const ENVIRONMENTS = ['forest', 'ocean', 'space', 'zen', 'minimal'];

const DRILL_LIBRARY = {
    focused_breathing: {
        id: 'focused_breathing',
        name: 'Focused Breathing',
        cues: [
            { t: 0, text: 'Notice your breath. No need to change it.' },
            { t: 30, text: 'Take a slow inhale for 3 counts, exhale for 4.' },
            { t: 60, text: 'Return to natural breathing.' },
            { t: 120, text: 'Continue breathing naturally.' },
            { t: 180, text: 'Gently guide attention back to breath.' }
        ]
    },
    body_scan: {
        id: 'body_scan',
        name: 'Body Scan',
        cues: [
            { t: 0, text: 'Notice your head and face.' },
            { t: 30, text: 'Relax your jaw.' },
            { t: 60, text: 'Notice your neck and shoulders.' },
            { t: 120, text: 'Feel your chest and belly.' },
            { t: 180, text: 'Notice your arms and hands.' }
        ]
    },
    attention_to_sound: {
        id: 'attention_to_sound',
        name: 'Attention to Sound',
        cues: [
            { t: 0, text: 'Listen to the sounds around you.' },
            { t: 45, text: 'Name each sound silently.' },
            { t: 90, text: 'Notice sounds near and far.' },
            { t: 135, text: 'Return to listening.' }
        ]
    }
};

const ACHIEVEMENTS = [
    { id: 'baby', name: 'Baby Steps', icon: '👶', minXP: 0, maxXP: 100 },
    { id: 'warrior', name: 'Week Warrior', icon: '⚔️', minXP: 100, maxXP: 200 },
    { id: 'zen', name: 'Zen Master', icon: '🧘', minXP: 200, maxXP: 400 },
    { id: 'guru', name: 'Mindful Guru', icon: '🕉️', minXP: 400, maxXP: 700 },
    { id: 'sage', name: 'Focus Sage', icon: '🌟', minXP: 700, maxXP: 1000 },
    { id: 'legend', name: 'Legend', icon: '👑', minXP: 1000, maxXP: 1500 },
    { id: 'enlightened', name: 'Enlightened', icon: '✨', minXP: 1500, maxXP: Infinity }
];

const BRAIN_MESSAGES = [
    { time: 30, message: '⚡ Prefrontal cortex activating...' },
    { time: 60, message: '🧠 Default mode network quieting...' },
    { time: 120, message: '💪 Attention circuits strengthening!' },
    { time: 180, message: '🔗 Neural pathways forming...' },
    { time: 300, message: '✨ Focus muscle trained!' }
];

// ===== STORAGE =====
class StorageManager {
    constructor() {
        this.SESSIONS_KEY = 'focusflow_sessions';
        this.PREFS_KEY = 'focusflow_prefs';
    }

    getSessions() {
        const data = localStorage.getItem(this.SESSIONS_KEY);
        return data ? JSON.parse(data) : [];
    }

    saveSession(session) {
        const sessions = this.getSessions();
        const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const todaySessions = sessions.filter(s => s.id.startsWith(today));
        session.id = `${today}-${todaySessions.length + 1}`;
        session.date = new Date().toISOString();
        sessions.push(session);
        localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
        return session;
    }

    getPreferences() {
        const data = localStorage.getItem(this.PREFS_KEY);
        return data ? JSON.parse(data) : {
            theme: 'light',
            environment: 'forest',
            musicEnabled: true,
            brainVizEnabled: true,
            totalXP: 0
        };
    }

    savePreferences(prefs) {
        localStorage.setItem(this.PREFS_KEY, JSON.stringify(prefs));
    }
}

// ===== TIMER =====
class TimerController {
    constructor(onTick, onComplete) {
        this.onTick = onTick;
        this.onComplete = onComplete;
        this.remainingSeconds = 0;
        this.interval = null;
        this.isPaused = false;
    }

    start(durationMinutes) {
        this.remainingSeconds = durationMinutes * 60;
        this.isPaused = false;
        this.onTick(this.remainingSeconds);
        
        this.interval = setInterval(() => {
            if (!this.isPaused) {
                this.remainingSeconds--;
                
                if (this.remainingSeconds <= 0) {
                    this.stop();
                    this.onComplete();
                } else {
                    this.onTick(this.remainingSeconds);
                }
            }
        }, 1000);
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// ===== MAIN APP =====
class FocusFlowApp {
    constructor() {
        this.storage = new StorageManager();
        this.timer = null;
        this.currentDuration = 5;
        this.currentDrill = 'focused_breathing';
        this.selectedRating = null;
        this.selectedSentiment = null;
        
        // Practice music (during drill)
        this.ambientMusic = new Audio('ambient-music.mp3');
        this.ambientMusic.loop = true;
        this.ambientMusic.volume = 0.3;
        
        // Background music (home/selection pages)
        this.backgroundMusic = new Audio('The-Open-Sky-chosic.com_.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.2;
        
        this.init();
    }

    init() {
        this.loadPreferences();
        this.updateStats();
        this.updateAchievements();
        this.setupEventListeners();
        this.setupMusicAutoplay();
    }

    setupMusicAutoplay() {
        // Try to start music immediately
        this.startBackgroundMusic();
        
        // If autoplay is blocked, start on first user interaction
        const startOnInteraction = () => {
            this.startBackgroundMusic();
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('keydown', startOnInteraction);
        };
        
        document.addEventListener('click', startOnInteraction, { once: true });
        document.addEventListener('keydown', startOnInteraction, { once: true });
    }

    startBackgroundMusic() {
        const prefs = this.storage.getPreferences();
        console.log('Attempting to start background music. Enabled:', prefs.musicEnabled, 'Paused:', this.backgroundMusic.paused);
        if (prefs.musicEnabled && this.backgroundMusic.paused) {
            this.backgroundMusic.play()
                .then(() => console.log('✅ Background music playing'))
                .catch(e => {
                    console.log('⚠️ Background music autoplay prevented, waiting for user interaction');
                });
        }
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic && !this.backgroundMusic.paused) {
            console.log('Stopping background music');
            this.backgroundMusic.pause();
        }
    }

    resumeBackgroundMusic() {
        const prefs = this.storage.getPreferences();
        console.log('Attempting to resume background music. Enabled:', prefs.musicEnabled);
        if (prefs.musicEnabled && this.backgroundMusic) {
            this.backgroundMusic.play()
                .then(() => console.log('✅ Background music resumed'))
                .catch(e => console.log('⚠️ Background music play prevented'));
        }
    }

    loadPreferences() {
        const prefs = this.storage.getPreferences();
        this.setTheme(prefs.theme);
        this.setEnvironment(prefs.environment);
        document.getElementById('brain-viz-enabled').checked = prefs.brainVizEnabled;
        
        // Update music button icon
        document.getElementById('music-btn').textContent = prefs.musicEnabled ? '🎵' : '🔇';
    }

    setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        const prefs = this.storage.getPreferences();
        prefs.theme = theme;
        this.storage.savePreferences(prefs);
        document.getElementById('theme-toggle').textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    setEnvironment(env) {
        const envEl = document.getElementById('environment');
        ENVIRONMENTS.forEach(e => envEl.classList.remove(e));
        envEl.classList.add(env);
        
        const prefs = this.storage.getPreferences();
        prefs.environment = env;
        this.storage.savePreferences(prefs);
    }

    updateStats() {
        const sessions = this.storage.getSessions();
        const prefs = this.storage.getPreferences();
        
        // Calculate streak
        const dates = [...new Set(sessions.map(s => s.date.split('T')[0]))].sort().reverse();
        let streak = 0;
        for (let i = 0; i < dates.length; i++) {
            const expectedDate = new Date();
            expectedDate.setDate(expectedDate.getDate() - i);
            const expected = expectedDate.toISOString().split('T')[0];
            if (dates[i] === expected) streak++;
            else break;
        }
        
        // Calculate weekly minutes
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weeklyMins = sessions
            .filter(s => new Date(s.date) >= weekStart)
            .reduce((sum, s) => sum + s.duration_min, 0);
        
        document.getElementById('streak').textContent = `${streak} 🔥`;
        document.getElementById('weekly-mins').textContent = `${weeklyMins} min`;
        document.getElementById('total-sessions').textContent = sessions.length;
        
        // Update XP
        this.updateXP(prefs.totalXP || 0);
    }

    updateXP(totalXP) {
        const prefs = this.storage.getPreferences();
        prefs.totalXP = totalXP;
        this.storage.savePreferences(prefs);
        
        // Find current level
        let currentLevel = ACHIEVEMENTS[0];
        let nextLevel = ACHIEVEMENTS[1];
        
        for (let i = 0; i < ACHIEVEMENTS.length; i++) {
            if (totalXP >= ACHIEVEMENTS[i].minXP && totalXP < ACHIEVEMENTS[i].maxXP) {
                currentLevel = ACHIEVEMENTS[i];
                nextLevel = ACHIEVEMENTS[i + 1] || ACHIEVEMENTS[i];
                break;
            }
        }
        
        document.getElementById('user-level-icon').textContent = currentLevel.icon;
        document.getElementById('user-level-name').textContent = currentLevel.name;
        document.getElementById('current-xp').textContent = totalXP;
        document.getElementById('next-level-xp').textContent = nextLevel.minXP;
        
        const progress = ((totalXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100;
        document.getElementById('xp-fill').style.width = `${Math.min(progress, 100)}%`;
    }

    updateAchievements() {
        const prefs = this.storage.getPreferences();
        const totalXP = prefs.totalXP || 0;
        
        document.querySelectorAll('.achievement').forEach(el => {
            const achievementId = el.dataset.achievement;
            const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
            
            if (achievement && totalXP >= achievement.minXP) {
                el.classList.remove('locked');
                el.classList.add('unlocked');
            }
        });
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const section = btn.dataset.section;
                this.showSection(section);
            });
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            const current = document.body.getAttribute('data-theme');
            this.setTheme(current === 'dark' ? 'light' : 'dark');
        });

        // Environment toggle
        document.getElementById('env-toggle').addEventListener('click', () => {
            const prefs = this.storage.getPreferences();
            const currentIndex = ENVIRONMENTS.indexOf(prefs.environment);
            const nextEnv = ENVIRONMENTS[(currentIndex + 1) % ENVIRONMENTS.length];
            this.setEnvironment(nextEnv);
        });

        // Music toggle
        document.getElementById('music-btn').addEventListener('click', () => {
            const prefs = this.storage.getPreferences();
            prefs.musicEnabled = !prefs.musicEnabled;
            this.storage.savePreferences(prefs);
            document.getElementById('music-btn').textContent = prefs.musicEnabled ? '🎵' : '🔇';
            
            // Toggle background music based on preference
            if (prefs.musicEnabled) {
                this.resumeBackgroundMusic();
            } else {
                this.stopBackgroundMusic();
                if (this.ambientMusic) this.ambientMusic.pause();
            }
        });

        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.showSection(category);
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                document.querySelector(`[data-section="${category}"]`).classList.add('active');
            });
        });

        // Timer cards
        document.querySelectorAll('.timer-card').forEach(card => {
            card.addEventListener('click', () => {
                this.currentDuration = parseInt(card.dataset.duration);
                this.currentDrill = 'focused_breathing';
                this.startPractice();
            });
        });

        // Meditation chips
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                e.stopPropagation();
                this.currentDuration = parseInt(chip.dataset.duration);
                const card = chip.closest('.meditation-card');
                this.currentDrill = card.dataset.type;
                this.startPractice();
            });
        });

        // Mindfulness cards
        document.querySelectorAll('.mindfulness-card .card-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.mindfulness-card');
                this.currentDrill = card.dataset.type;
                this.currentDuration = 5;
                this.startPractice();
            });
        });

        // Practice controls
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.timer.pause();
            document.getElementById('pause-btn').style.display = 'none';
            document.getElementById('resume-btn').style.display = 'block';
            if (this.ambientMusic) this.ambientMusic.pause();
        });

        document.getElementById('resume-btn').addEventListener('click', () => {
            this.timer.resume();
            document.getElementById('resume-btn').style.display = 'none';
            document.getElementById('pause-btn').style.display = 'block';
            const prefs = this.storage.getPreferences();
            if (prefs.musicEnabled && this.ambientMusic) this.ambientMusic.play();
        });

        document.getElementById('end-btn').addEventListener('click', () => {
            this.timer.stop();
            if (this.ambientMusic) {
                this.ambientMusic.pause();
                this.ambientMusic.currentTime = 0;
            }
            // Hide brain viz when ending practice
            document.getElementById('brain-viz-popup').classList.remove('active');
            
            // Resume background music when returning to home
            this.resumeBackgroundMusic();
            this.showSection('home');
        });

        // Brain viz close
        document.getElementById('close-brain-viz').addEventListener('click', () => {
            document.getElementById('brain-viz-popup').classList.remove('active');
        });

        // Completion
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedRating = parseInt(btn.dataset.rating);
            });
        });

        document.querySelectorAll('.sentiment-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.sentiment-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedSentiment = btn.dataset.sentiment;
            });
        });

        document.getElementById('log-btn').addEventListener('click', () => {
            this.logSession();
        });

        document.getElementById('skip-btn').addEventListener('click', () => {
            this.showSection('home');
        });
    }

    showSection(section) {
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`${section}-section`).classList.add('active');
    }

    startPractice() {
        this.showSection('practice');
        
        // Stop background music and start ambient music for practice
        this.stopBackgroundMusic();
        
        const prefs = this.storage.getPreferences();
        if (prefs.musicEnabled && this.ambientMusic) {
            this.ambientMusic.play().catch(e => console.log('Music autoplay prevented'));
        }

        // Show brain viz ONLY during practice if enabled
        const brainVizPopup = document.getElementById('brain-viz-popup');
        if (prefs.brainVizEnabled) {
            brainVizPopup.classList.add('active');
            this.scheduleBrainMessages();
        } else {
            brainVizPopup.classList.remove('active');
        }

        // Start timer
        this.timer = new TimerController(
            (remaining) => this.updateTimerDisplay(remaining),
            () => this.completePractice()
        );
        this.timer.start(this.currentDuration);

        // Schedule cues
        const drill = DRILL_LIBRARY[this.currentDrill];
        if (drill) {
            drill.cues.forEach(cue => {
                if (cue.t <= this.currentDuration * 60) {
                    setTimeout(() => {
                        document.getElementById('cue-text').textContent = cue.text;
                    }, cue.t * 1000);
                }
            });
        }
    }

    updateTimerDisplay(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        document.getElementById('timer-display').textContent = 
            `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    scheduleBrainMessages() {
        BRAIN_MESSAGES.forEach(msg => {
            if (msg.time <= this.currentDuration * 60) {
                setTimeout(() => {
                    document.getElementById('brain-viz-message').textContent = msg.message;
                }, msg.time * 1000);
            }
        });
    }

    completePractice() {
        if (this.ambientMusic) {
            this.ambientMusic.pause();
            this.ambientMusic.currentTime = 0;
        }

        // Hide brain viz when practice ends
        document.getElementById('brain-viz-popup').classList.remove('active');

        // Resume background music on completion screen
        this.resumeBackgroundMusic();

        const xpEarned = this.currentDuration * 10;
        document.getElementById('xp-earned-text').textContent = `+${xpEarned} XP`;
        document.getElementById('completion-message').textContent = `${this.currentDuration} minutes completed!`;
        
        this.showCelebration();
        this.showSection('completion');
    }

    showCelebration() {
        const celebration = document.getElementById('celebration');
        celebration.innerHTML = '';
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = ['#4a90e2', '#7cb342', '#9c27b0', '#ff9800'][Math.floor(Math.random() * 4)];
            confetti.style.animation = `fall ${2 + Math.random() * 2}s linear`;
            celebration.appendChild(confetti);
        }
        
        setTimeout(() => celebration.innerHTML = '', 4000);
    }

    logSession() {
        const xpEarned = this.currentDuration * 10;
        const prefs = this.storage.getPreferences();
        
        const session = {
            duration_min: this.currentDuration,
            type: this.currentDrill,
            focusRating: this.selectedRating,
            sentiment: this.selectedSentiment,
            note: document.getElementById('session-note').value || undefined
        };

        this.storage.saveSession(session);
        this.updateXP((prefs.totalXP || 0) + xpEarned);
        this.updateStats();
        this.updateAchievements();
        
        this.selectedRating = null;
        this.selectedSentiment = null;
        document.getElementById('session-note').value = '';
        
        this.showSection('home');
    }
}

// Confetti animation
const style = document.createElement('style');
style.textContent = `
@keyframes fall {
    to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new FocusFlowApp();
});
