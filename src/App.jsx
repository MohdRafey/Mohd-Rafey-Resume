// src/App.jsx
import React, { useState, useEffect } from 'react';
import AmbientBackground from './components/AmbientBackground';
import RefractionFilter from './components/RefractionFilter';
import PillSelector from './components/PillSelector';
import LiquidDropletButton from './components/LiquidDropletButton';
import IridescentButton from './components/IridescentButton';
import HomePage from './pages/HomePage';
import ResumePage from './pages/ResumePage';

const themeOptions = [
  {
    id: 'shockwave',
    label: 'Dark',
    icon: '🌙',
    activeClass: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-100'
  },
  {
    id: 'light',
    label: 'Light',
    icon: '✨',
    activeClass: 'bg-[#1C2951] text-white shadow-lg shadow-indigo-950/30 scale-100'
  }
];

// Helper to determine active page from URL hash
const getPageFromHash = () => {
  const hash = window.location.hash.replace('#', '').trim();
  return hash === 'resume' ? 'resume' : 'home';
};

export default function App() {
  // 1. Initialize view from URL hash
  const [activePage, setActivePage] = useState(getPageFromHash);

  // 2. Initialize theme from DOM (preventing pop-in) or localStorage fallback
  const [interactiveMode, setInteractiveMode] = useState(() => {
    if (typeof document !== 'undefined') {
      const domTheme = document.documentElement.getAttribute('data-theme');
      if (domTheme) return domTheme;
    }
    const savedTheme = localStorage.getItem('site-theme');
    return savedTheme || 'light';
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const isLight = interactiveMode === 'light';

  // 3. Keep view in sync with URL hash changes (back/forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const page = getPageFromHash();
      setActivePage(page);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 4. Update data-theme on root and persist to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', interactiveMode);
    localStorage.setItem('site-theme', interactiveMode);
  }, [interactiveMode]);

  // Lock mobile devices to Light Mode
  useEffect(() => {
    const handleViewportChange = () => {
      if (window.innerWidth < 768 && interactiveMode !== 'light') {
        setInteractiveMode('light');
      }
    };

    handleViewportChange();
    window.addEventListener('resize', handleViewportChange);
    return () => window.removeEventListener('resize', handleViewportChange);
  }, [interactiveMode]);

  const handleModeChange = (newMode) => {
    if (newMode === interactiveMode || isTransitioning) return;

    const isCurrentLight = interactiveMode === 'light';
    const isNextLight = newMode === 'light';
    const isCrossingThemeBoundary = isCurrentLight !== isNextLight;

    if (isCrossingThemeBoundary) {
      setIsTransitioning(true);
      setTimeout(() => setInteractiveMode(newMode), 250);
      setTimeout(() => setIsTransitioning(false), 550);
    } else {
      setInteractiveMode(newMode);
    }
  };

  useEffect(() => {
    let ticking = false;
    const MAX_SCROLL_DISTANCE = 140;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const progress = Math.min(1, Math.max(0, currentY / MAX_SCROLL_DISTANCE));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (page) => {
    window.location.hash = page === 'home' ? '' : page;
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handles smooth scrolling to single-page sections or top
  const scrollToSection = (sectionId) => {
    if (activePage !== 'home') {
      window.location.hash = '';
      setActivePage('home');
      setTimeout(() => {
        if (sectionId === 'top' || sectionId === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      if (sectionId === 'top' || sectionId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navPaddingTop = (1 - scrollProgress) * 20;
  const navPaddingX = (1 - scrollProgress) * 20;
  const currentRadius = Math.round((1 - scrollProgress) * 36);
  const navRadius = `${currentRadius}px`;

  return (
    <div 
      data-theme={interactiveMode}
      className={`min-h-screen w-full relative selection:bg-brand-accent selection:text-white flex flex-col items-center transition-colors duration-500 ${
        isLight ? 'text-[#111633]' : 'text-slate-100'
      }`}
    >
      {/* Black Fade Veil */}
      <div 
        className={`fixed inset-0 z-[100] bg-[#07090e] pointer-events-none transition-opacity duration-300 ease-in-out ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`} 
      />

      <RefractionFilter />
      <AmbientBackground mode={interactiveMode} />

      {/* Floating Theme Switcher */}
      <div className="fixed bottom-6 right-6 z-50 hidden md:block">
        <PillSelector
          items={themeOptions}
          activeId={interactiveMode}
          onChange={handleModeChange}
          isLight={isLight}
          className="shadow-2xl"
        />
      </div>

      {/* Fluid Expanding Navbar */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 w-full flex justify-center pointer-events-none"
        style={{
          paddingTop: `${navPaddingTop}px`,
          paddingLeft: `${navPaddingX}px`,
          paddingRight: `${navPaddingX}px`
        }}
      >
        <header 
          className={`ios-glass-nav-fluid pointer-events-auto flex items-center justify-between transition-all duration-300 ${
            scrollProgress >= 0.98 ? 'is-docked' : ''
          }`}
          style={{
            width: '100%',
            maxWidth: scrollProgress >= 0.98 ? '100%' : `${1024 + scrollProgress * (typeof window !== 'undefined' && window.innerWidth > 1024 ? window.innerWidth - 1024 : 0)}px`,
            borderRadius: scrollProgress >= 0.98 ? '0px' : navRadius,
            paddingTop: `${14 - scrollProgress * 2}px`,
            paddingBottom: `${14 - scrollProgress * 2}px`,
            paddingLeft: `${24 + scrollProgress * 16}px`,
            paddingRight: `${24 + scrollProgress * 16}px`
          }}
        >
          <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
            {/* BRAND / LOGO */}
            <button 
              onClick={() => scrollToSection('top')} 
              className="flex items-center gap-3 text-left group cursor-pointer bg-transparent border-none p-0"
            >
              <div>
                <span className={`font-black text-lg sm:text-xl tracking-tight block leading-none transition-transform group-hover:scale-[1.02] ${
                  isLight ? 'text-[#111633]' : 'text-white'
                }`}>
                  Mohd Rafey
                </span>
              </div>
            </button>

            {/* NAV LINKS (SINGLE-PAGE ANCHORS) */}
            <nav className="hidden sm:flex items-center gap-7 text-sm font-semibold">
              <button 
                onClick={() => scrollToSection('top')}
                className={`transition-colors cursor-pointer bg-transparent border-none p-0 ${
                  isLight ? 'text-[#525875] hover:text-[#111633]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Home
              </button>

              <button 
                onClick={() => scrollToSection('about')}
                className={`transition-colors cursor-pointer bg-transparent border-none p-0 ${
                  isLight ? 'text-[#525875] hover:text-[#111633]' : 'text-slate-400 hover:text-white'
                }`}
              >
                About
              </button>

              <button 
                onClick={() => scrollToSection('projects')}
                className={`transition-colors cursor-pointer bg-transparent border-none p-0 ${
                  isLight ? 'text-[#525875] hover:text-[#111633]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Projects
              </button>

              <button 
                onClick={() => scrollToSection('exploration')}
                className={`transition-colors cursor-pointer bg-transparent border-none p-0 ${
                  isLight ? 'text-[#525875] hover:text-[#111633]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Exploration
              </button>

              <button 
                onClick={() => scrollToSection('contact')}
                className={`transition-colors cursor-pointer bg-transparent border-none p-0 ${
                  isLight ? 'text-[#525875] hover:text-[#111633]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Contact
              </button>
            </nav>

            {/* RESUME LAUNCH BUTTON */}
            {isLight ? (
              <LiquidDropletButton
                isLight={true}
                enableRandomDrops={false}
                onClick={() => navigateTo('resume')}
                className="hover:scale-105"
              >
                <div className="px-5 py-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 text-[#111633]">
                  <span>Resume</span>
                  <span>→</span>
                </div>
              </LiquidDropletButton>
            ) : (
              <IridescentButton
                onClick={() => navigateTo('resume')}
                className="hover:scale-105 transition-transform"
              >
                <div className="px-5 py-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 text-white">
                  <span>Resume</span>
                  <span>→</span>
                </div>
              </IridescentButton>
            )}
          </div>
        </header>
      </div>

      <div className="h-24 w-full" />

      {/* Main Content Router */}
      <main className="relative z-10 w-full flex flex-col items-center pb-24">
        {activePage === 'home' && (
          <div className="w-full max-w-5xl px-4 sm:px-6 py-6">
            <HomePage onNavigate={navigateTo} scrollToSection={scrollToSection} isLight={isLight} />
          </div>
        )}
        {activePage === 'resume' && (
          <div className="w-full">
            <ResumePage onNavigate={navigateTo} isLight={isLight} />
          </div>
        )}

        {/* Global Single-Page Contact & Footer */}
<footer id="contact" className="w-full max-w-5xl px-4 sm:px-6 mt-10 scroll-mt-28">
  <div className="text-center p-8 sm:p-12 ios-glass-panel relative overflow-hidden">
    <div 
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-xs backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--accent-border-fringe)',
        color: 'var(--accent-light)'
      }}
    >
      <span 
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: 'var(--accent-primary)' }}
      />
      Get In Touch
    </div>

    <h2 className={`text-2xl sm:text-4xl font-black mb-3 tracking-tight ${
      isLight ? 'text-[#111633]' : 'text-white'
    }`}>
      Let's Build Something.
    </h2>

    <p className={`mb-8 text-sm sm:text-base max-w-lg mx-auto font-normal leading-relaxed ${
      isLight ? 'text-[#525875]' : 'text-slate-400'
    }`}>
      Open for technical collaboration, software architecture discussions, and industrial telemetry consulting.
    </p>

    {/* 3 CONTACT ACTION LINKS */}
    <div className="flex items-center justify-center gap-4 flex-wrap mb-10">
      {/* 1. Direct Email */}
      <a 
        href="mailto:mohdrafey2207@gmail.com"
        className="font-bold text-sm text-white px-6 py-3.5 rounded-full inline-flex items-center gap-2.5 shadow-lg transition-transform hover:scale-105 no-underline"
        style={{ backgroundColor: 'var(--accent-primary)', boxShadow: '0 0 20px var(--accent-glow)' }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span>mohdrafey2207@gmail.com</span>
      </a>

      {/* 2. GitHub Profile */}
      <a 
        href="https://github.com/mohdrafey" 
        target="_blank" 
        rel="noopener noreferrer"
        className={`font-bold text-sm px-6 py-3.5 rounded-full inline-flex items-center gap-2.5 transition-all no-underline ${
          isLight 
            ? 'bg-white/90 hover:bg-white text-[#111633] border border-[#1C2951]/15 shadow-xs' 
            : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/10 shadow-sm'
        } hover:scale-105`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
        <span>GitHub</span>
      </a>

      {/* 3. LinkedIn Profile */}
      <a 
        href="https://www.linkedin.com/in/mohd-rafey-a1727b190/" 
        target="_blank" 
        rel="noopener noreferrer"
        className={`font-bold text-sm px-6 py-3.5 rounded-full inline-flex items-center gap-2.5 transition-all no-underline ${
          isLight 
            ? 'bg-white/90 hover:bg-white text-[#111633] border border-[#1C2951]/15 shadow-xs' 
            : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/10 shadow-sm'
        } hover:scale-105`}
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
        <span>LinkedIn</span>
      </a>
    </div>

    <div className={`pt-6 border-t text-xs font-medium ${
      isLight ? 'border-[#1C2951]/10 text-[#525875]' : 'border-white/5 text-slate-500'
    }`}>
      © 2026 Mohd Rafey. Crafted with React, Tailwind CSS &amp; Vite.[cite: 1]
    </div>
  </div>
</footer>
      </main>
    </div>
  );
}