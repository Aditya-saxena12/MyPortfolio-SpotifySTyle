import React, { useEffect, useState, useRef } from 'react';
import './index.css';

const App = () => {
  // --- STATE FOR CORE UI ---
  const [activeSection, setActiveSection] = useState('home');
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // --- STATE FOR MUSIC PLAYER ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reference to the audio object
  const audioRef = useRef(null);

  // Playlist data
  const playlist = [
    {
      title: "Insecurities - Premalu",
      artist: "Aditya's Choice",
      url: "/audio/Insecurities Premalu.mp3",
      cover: "🎹"
    },
    {
      title: "Premalu Love Bgm",
      artist: "Aditya's Choice",
      url: "/audio/Premalu Love Bgm.mp3",
      cover: "🎸"
    }
  ];

  // Helper to format time (e.g., 87s -> 1:27)
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- EFFECT: INITIALIZE PLAYER ---
  useEffect(() => {
    // Create new audio instance if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio(playlist[currentSongIndex].url);
    }

    const audio = audioRef.current;

    // Update duration when metadata loads
    const setAudioData = () => setDuration(audio.duration);
    // Update current time as song plays
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    // Auto-play next song when finished
    const handleEnd = () => handleNext();

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnd);

    // Attempt autoplay (Browser might block this without user interaction)
    // We try to play as soon as the component mounts
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          console.log("Autoplay blocked. User needs to interact first.");
        });
    }

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnd);
    };
  }, []);

  // --- EFFECT: HANDLE SONG CHANGES ---
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = playlist[currentSongIndex].url;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback failed: ", e));
      }
    }
  }, [currentSongIndex]);

  // --- PLAYER ACTIONS ---
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Playback failed: ", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About', icon: '👤' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'skills', label: 'Skills', icon: '🛠' },
    { id: 'resume', label: 'Resume', icon: '📄', link: 'https://drive.google.com/file/d/16PPmnolWto7bF_d67AmDy7nXu9pi2mfa/view?usp=sharing' },
    { id: 'contact', label: 'Contact', icon: '📬' },
  ];

  return (
    <div className="app-container">
      <div
        className="custom-cursor"
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      ></div>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1DB954', marginBottom: '20px' }}>
          Portfolio
        </div>
        <nav className="nav-links">
          {navLinks.map((link) => (
            link.link ? (
              <a
                key={link.id}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ) : (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                onClick={() => setActiveSection(link.id)}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </a>
            )
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* HERO SECTION */}
        <section id="home" className="animate-up">
          <div className="glass-card hero-card">
            <div className="hero-name">ADITYA SAXENA</div>
            <div className="hero-subtitle">AI Software Engineer · Building Intelligent Systems</div>

            <div className="track-info-row">
              <div className="track-meta">Track: <span>Full Stack + AI Engineer</span></div>
              <div className="track-meta">Album: <span>2+ Years of Experience</span></div>
              <div className="track-meta">Genre: <span>Java · Spring Boot · LLMs · RAG · React</span></div>
            </div>

            <div className="progress-container">
              <span className="progress-time">{formatTime(currentTime)}</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
              </div>
              <span className="progress-time">{formatTime(duration)}</span>
            </div>

            <div className="cta-group">
              <a
                href="https://drive.google.com/file/d/16PPmnolWto7bF_d67AmDy7nXu9pi2mfa/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn"
                data-tooltip="https://drive.google.com/file/16PPmnolWto7bF_d67AmDy7nXu9pi2mfa"
              >
                📄 View Resume
              </a>
              <a
                href="https://www.linkedin.com/in/aditya-saxena-92575122b/"
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn"
                data-tooltip="https://www.linkedin.com/in/aditya-saxena"
              >
                💼 LinkedIn
              </a>
              <a
                href="https://github.com/aditya-saxena12"
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn"
                data-tooltip="https://github.com/aditya-saxena12"
              >
                🐙 GitHub
              </a>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" style={{ marginTop: '48px' }} className="animate-up">
          <h2 className="section-title">About the Artist</h2>
          <div className="glass-card">
            <p style={{ lineHeight: '1.6', fontSize: '16px', color: '#B3B3B3' }}>
              AI Software Engineer with 2+ years of experience in high-performance engineering and distributed microservices architecture in Java and Spring Boot.
              Proven impact modernizing applications using Local LLMs (Phidata), RAG pipelines, and vector databases to deliver context-aware intelligence.
              Experienced in building agentic applications using chat models, MCP, and tool/skill orchestration.
            </p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
              <div className="track-meta">Email: <span style={{ color: '#1DB954' }}>adi12saxena@gmail.com</span></div>
              <div className="track-meta">Phone: <span style={{ color: '#1DB954' }}>+91 8766251560</span></div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" style={{ marginTop: '48px' }} className="animate-up">
          <h2 className="section-title">Your Top Genres</h2>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#B3B3B3', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>AI Systems & Architecture</h3>
            <div className="skills-grid">
              {['LLM Systems', 'RAG', 'Vector Databases', 'Prompt Engineering', 'MCP', 'Agentic Workflows', 'Hugging Face', 'LangChain', 'LangGraph', 'Phidata', 'OpenAI API', 'Gemini API', 'Claude API'].map(s => <div key={s} className="skill-pill">{s}</div>)}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#B3B3B3', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>Languages</h3>
            <div className="skills-grid">
              {['Java', 'JavaScript', 'TypeScript', 'Python', 'SQL'].map(s => <div key={s} className="skill-pill">{s}</div>)}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#B3B3B3', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>Backend</h3>
            <div className="skills-grid">
              {['Spring Boot', 'FastAPI', 'REST APIs', 'Microservices', 'WebSocket'].map(s => <div key={s} className="skill-pill">{s}</div>)}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#B3B3B3', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>Frontend</h3>
            <div className="skills-grid">
              {['React.js', 'React Native'].map(s => <div key={s} className="skill-pill">{s}</div>)}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#B3B3B3', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>Databases</h3>
            <div className="skills-grid">
              {['PostgreSQL', 'Pinecone', 'MySQL', 'MongoDB', 'SQL Server'].map(s => <div key={s} className="skill-pill">{s}</div>)}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#B3B3B3', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>Cloud/DevOps</h3>
            <div className="skills-grid">
              {['Docker', 'GitHub Actions', 'CI/CD'].map(s => <div key={s} className="skill-pill">{s}</div>)}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#B3B3B3', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>Developer Tools</h3>
            <div className="skills-grid">
              {['VS Code Copilot', 'Cursor', 'Claude Code', 'Antigravity'].map(s => <div key={s} className="skill-pill">{s}</div>)}
            </div>
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" style={{ marginTop: '48px' }} className="animate-up">
          <h2 className="section-title">Discography</h2>
          <div className="exp-list">
            <div className="glass-card exp-card">
              <div className="exp-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" /></svg>
              </div>
              <div className="exp-content">
                <h3>Software Engineer</h3>
                <div className="company">Tech Mahindra</div>
                <div className="duration">Mar 2024 – Mar 2026 | Noida, India</div>
                <ul className="track-list">
                  <li className="track-item">AI-powered system that flagged suspicious request patterns in real-time with 98% precision and sub-100ms response latency across 15+ microservices for PepsiCo's enterprise infrastructure.</li>
                  <li className="track-item">Component-driven frontend with 100% design-to-code fidelity across 50+ reusable React components, reducing development time by 40%.</li>
                  <li className="track-item">Engineered autonomous AI workflows with MCP, enabling stateful multi-step reasoning.</li>
                  <li className="track-item">Eliminated critical database bottlenecks using Copilot — 80% faster data access.</li>
                </ul>
              </div>
            </div>

            <div className="glass-card exp-card">
              <div className="exp-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" /></svg>
              </div>
              <div className="exp-content">
                <h3>Software Developer</h3>
                <div className="company">Pure Software</div>
                <div className="duration">Feb 2023 – Oct 2023 | Noida, India</div>
                <ul className="track-list">
                  <li className="track-item">Gained hands-on experience in Java, Spring Boot, and SQL through 6+ demo and personal projects.</li>
                  <li className="track-item">Built a music dashboard system tracking songs across genres. Optimized 10+ database queries and refined API response time by 15–25%.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" style={{ marginTop: '48px' }} className="animate-up">
          <h2 className="section-title">Featured Playlists</h2>
          <div className="projects-grid">
            <div className="glass-card project-card">
              <div className="project-img">🍴</div>
              <h3>LuxEat Intelligence</h3>
              <div className="tag-list">
                {['FastAPI', 'Gemini API', 'LangChain', 'JavaScript'].map(t => <span key={t} className="tag">{t}</span>)}
              </div>
              <p style={{ color: '#B3B3B3', fontSize: '13px', marginTop: '12px' }}>AI-driven restaurant management ecosystem using Gemini 1.5 + LangChain that processed 50+ concurrent reservation inquiries with 95%+ accuracy.</p>
            </div>

            <div className="glass-card project-card">
              <div className="project-img">🤖</div>
              <h3>Agentic AI Bot</h3>
              <div className="tag-list">
                {['React', 'Python', 'FastAPI', 'LLAMA', 'Vector DB'].map(t => <span key={t} className="tag">{t}</span>)}
              </div>
              <p style={{ color: '#B3B3B3', fontSize: '13px', marginTop: '12px' }}>Modular agentic AI chatbot framework with RAG-backed responses. Custom bot creation for non-technical users.</p>
            </div>

            <div className="glass-card project-card">
              <div className="project-img">🗣️</div>
              <h3>AI Speech Bot</h3>
              <div className="tag-list">
                {['React', 'JavaScript', 'Web Speech API'].map(t => <span key={t} className="tag">{t}</span>)}
              </div>
              <p style={{ color: '#B3B3B3', fontSize: '13px', marginTop: '12px' }}>Intelligent conversational AI with integrated speech recognition — 500+ voice commands at 96% accuracy.</p>
            </div>

            <div className="glass-card project-card">
              <div className="project-img">🔒</div>
              <h3>Spring Secure</h3>
              <div className="tag-list">
                {['Java', 'Spring Boot', 'MySQL', 'React'].map(t => <span key={t} className="tag">{t}</span>)}
              </div>
              <p style={{ color: '#B3B3B3', fontSize: '13px', marginTop: '12px' }}>Security-focused backend using Java and Spring Boot ensuring data integrity and secure request handling.</p>
            </div>
          </div>
        </section>

        {/* PUBLICATIONS SECTION */}
        <section id="contact" style={{ marginTop: '48px', marginBottom: '100px' }} className="animate-up">
          <h2 className="section-title">Credits</h2>
          <div className="glass-card">
            <h3 style={{ fontSize: '18px', color: '#FFF' }}>ADAMAX-based EfficientNet-V2 (NSFW Content Detection)</h3>
            <div className="duration">Published: May 2023 | IEEE Xplore</div>
            <p style={{ color: '#B3B3B3', fontSize: '14px', marginTop: '12px' }}>
              Peer-reviewed paper on optimizing EfficientNet-V2 architecture for automated NSFW content classification.
              Used ADAMAX optimizer to improve classification accuracy and computational efficiency.
            </p>
          </div>
        </section>

      </main>

      {/* BOTTOM PLAYER BAR */}
      <footer className="bottom-player">
        <div className="player-left">
          <div style={{ width: '56px', height: '56px', borderRadius: '4px', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            {playlist[currentSongIndex].cover}
          </div>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '14px' }}>{playlist[currentSongIndex].title}</div>
            <div style={{ color: '#B3B3B3', fontSize: '12px' }}>{playlist[currentSongIndex].artist}</div>
          </div>
        </div>

        <div className="player-center">
          <div className="player-controls">
            <button className="player-btn">🔀</button>
            <button className="player-btn" style={{ fontSize: '20px' }} onClick={handlePrev}>⏮</button>
            <button
              className="player-btn"
              style={{ fontSize: '32px', background: '#FFF', color: '#000', borderRadius: '50%', width: '40px', height: '40px' }}
              onClick={togglePlayPause}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="player-btn" style={{ fontSize: '20px' }} onClick={handleNext}>⏭</button>
            <button className="player-btn">🔁</button>
          </div>
          <div className="player-progress-area" style={{ width: '100%', maxWidth: '400px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="progress-time">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="player-slider"
              style={{ flexGrow: 1 }}
            />
            <span className="progress-time">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-right">
          <a href="https://drive.google.com/file/d/16PPmnolWto7bF_d67AmDy7nXu9pi2mfa/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="player-btn" data-tooltip="Resume">📄</a>
          <a href="https://www.linkedin.com/in/aditya-saxena-92575122b/" target="_blank" rel="noopener noreferrer" className="player-btn" data-tooltip="LinkedIn">💼</a>
          <a href="https://github.com/aditya-saxena12" target="_blank" rel="noopener noreferrer" className="player-btn" data-tooltip="GitHub">🐙</a>
          <div style={{ backgroundColor: '#1DB954', color: '#000', fontWeight: '700', fontSize: '10px', padding: '4px 8px', borderRadius: '4px', marginLeft: '12px', textTransform: 'uppercase' }}>
            Open to Work 🟢
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
