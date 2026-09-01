// src/App.jsx
import React, { useState, useEffect } from 'react';
import AmbientBackground from './components/AmbientBackground';
import RefractionFilter from './components/RefractionFilter';
import PillSelector from './components/PillSelector';
import LiquidDropletButton from './components/LiquidDropletButton';
import IridescentButton from './components/IridescentButton';
import HomePage from './pages/HomePage';
import Studio3DPage from './pages/Studio3DPage';
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
  const validPages = ['home', 'resume', '3d-designs'];
  return validPages.includes(hash) ? hash : 'home';
};

export default function App() {
  // 1. Initialize page from current URL hash
  const [activePage, setActivePage] = useState(getPageFromHash);

  // 2. Initialize theme from localStorage (defaulting to dark 'shockwave' or 'light')
  const [interactiveMode, setInteractiveMode] = useState(() => {
    const savedTheme = localStorage.getItem('site-theme');
    return savedTheme || 'light';
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const isLight = interactiveMode === 'light';

  // 3. Keep activePage synced when browser back/forward buttons or hash change
  useEffect(() => {
    const handleHashChange = () => {
      const page = getPageFromHash();
      setActivePage(page);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 4. Update data-theme and persist to localStorage
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

  // 5. Update navigateTo to set hash
  const navigateTo = (page) => {
    window.location.hash = page === 'home' ? '' : page;
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navPaddingTop = (1 - scrollProgress) * 20;
  const navPaddingX = (1 - scrollProgress) * 20;
  const currentRadius = Math.round((1 - scrollProgress) * 36);
  const navRadius = `${currentRadius}px`;

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      data-theme={interactiveMode}
      className={`min-h-screen w-full relative selection:bg-brand-accent selection:text-white flex flex-col items-center transition-colors duration-500 ${
        isLight ? 'text-[#111633]' : 'text-slate-100'
      }`}
    >
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
            <button 
              onClick={() => navigateTo('home')} 
              className="flex items-center gap-3 text-left group cursor-pointer bg-transparent border-none p-0"
            >
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-lg transition-transform group-hover:scale-105"
                style={{ backgroundColor: 'var(--accent-primary)', boxShadow: '0 0 16px var(--accent-glow)' }}
              >
                MR
              </div>
              <div>
                <span className={`font-extrabold text-sm tracking-tight block leading-none ${
                  isLight ? 'text-[#111633]' : 'text-white'
                }`}>
                  Mohd Rafey
                </span>
                <span className={`text-[10px] font-semibold tracking-wide ${
                  isLight ? 'text-[#525875]' : 'text-slate-400'
                }`}>
                  Systems &amp; 3D
                </span>
              </div>
            </button>

            {/* NAV LINKS */}
            <nav className="hidden sm:flex items-center gap-8 text-sm font-semibold">
              <button 
                onClick={() => navigateTo('home')}
                className={`transition-colors cursor-pointer bg-transparent border-none p-0 ${
                  activePage === 'home'
                    ? (isLight ? 'text-[#111633] font-bold' : 'text-white font-bold')
                    : (isLight ? 'text-[#525875] hover:text-[#111633]' : 'text-slate-400 hover:text-white')
                }`}
              >
                Home
              </button>

              <button 
                onClick={() => navigateTo('resume')}
                className={`transition-colors cursor-pointer bg-transparent border-none p-0 ${
                  activePage === 'resume'
                    ? (isLight ? 'text-[#111633] font-bold' : 'text-white font-bold')
                    : (isLight ? 'text-[#525875] hover:text-[#111633]' : 'text-slate-400 hover:text-white')
                }`}
              >
                Resume
              </button>

              <button 
                onClick={() => navigateTo('3d-designs')}
                className={`transition-colors cursor-pointer bg-transparent border-none p-0 ${
                  activePage === '3d-designs'
                    ? (isLight ? 'text-[#111633] font-bold' : 'text-white font-bold')
                    : (isLight ? 'text-[#525875] hover:text-[#111633]' : 'text-slate-400 hover:text-white')
                }`}
              >
                3D Studio
              </button>

              <a 
                href="#contact" 
                className={`transition-colors no-underline ${
                  isLight ? 'text-[#525875] hover:text-[#111633]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Contact
              </a>
            </nav>

            {/* CONNECT BUTTON */}
            {isLight ? (
              <LiquidDropletButton
                isLight={true}
                enableRandomDrops={false}
                onClick={scrollToContact}
                className="hover:scale-105"
              >
                <div className="px-6 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 text-[#111633]">
                  <span>Connect</span>
                  <span>→</span>
                </div>
              </LiquidDropletButton>
            ) : (
              <IridescentButton
                onClick={scrollToContact}
                className="hover:scale-105 transition-transform"
              >
                <div className="px-6 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 text-white">
                  <span>Connect</span>
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
            <HomePage onNavigate={navigateTo} isLight={isLight} />
          </div>
        )}
        {activePage === 'resume' && (
          <div className="w-full">
            <ResumePage onNavigate={navigateTo} isLight={isLight} />
          </div>
        )}
        {activePage === '3d-designs' && (
          <div className="w-full max-w-5xl px-4 sm:px-6 py-6">
            <Studio3DPage onNavigate={navigateTo} />
          </div>
        )}

        {/* Footer */}
        <footer id="contact" className="w-full max-w-5xl px-4 sm:px-6 mt-10">
          <div className="text-center p-8 sm:p-12 ios-glass-panel">
            <h2 className={`text-2xl sm:text-3xl font-black mb-2 ${
              isLight ? 'text-[#111633]' : 'text-white'
            }`}>
              Let's Build Something Resilient.
            </h2>
            <p className={`mb-8 text-sm max-w-md mx-auto font-normal ${
              isLight ? 'text-[#525875]' : 'text-slate-400'
            }`}>
              Open for technical collaboration, architecture discussions, and custom 3D environment visualization.
            </p>
            <a 
              href="mailto:contact@yourdomain.com" 
              className="text-white font-bold px-8 py-3.5 rounded-full inline-flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
              style={{ backgroundColor: 'var(--accent-primary)', boxShadow: '0 0 24px var(--accent-glow)' }}
            >
              <span>Send a Message</span>
              <span>→</span>
            </a>
            <div className={`mt-10 pt-6 border-t text-xs font-medium ${
              isLight ? 'border-[#1C2951]/10 text-[#525875]' : 'border-white/5 text-slate-500'
            }`}>
              © 2026 Mohd Rafey. Crafted with React, Tailwind CSS &amp; Vite.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}