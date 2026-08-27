import React, { useState, useEffect } from 'react';
import AmbientBackground from './components/AmbientBackground';
import RefractionFilter from './components/RefractionFilter';
import HomePage from './pages/HomePage';
import Studio3DPage from './pages/Studio3DPage';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [interactiveMode, setInteractiveMode] = useState('shockwave');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sync data-theme attribute on root HTML for dynamic CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', interactiveMode);
  }, [interactiveMode]);

  // Smooth scroll interpolation for top navbar
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
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Interpolated Navbar geometry
  const navPaddingTop = (1 - scrollProgress) * 16;
  const navPaddingX = (1 - scrollProgress) * 20;
  const currentRadius = Math.round((1 - scrollProgress) * 32);
  const navRadius = `${currentRadius}px`; 

  return (
    <div className="min-h-screen w-full relative text-slate-100 overflow-x-hidden selection:bg-brand-accent selection:text-white flex flex-col items-center">
      
      {/* 1. Global Refraction Displacement Shader */}
      <RefractionFilter />

      {/* 2. Interactive Background Engine */}
      <AmbientBackground mode={interactiveMode} />

      {/* 3. Floating Interactive Mode Switcher Pill */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-1 p-1 rounded-full bg-slate-950/85 backdrop-blur-xl border border-white/15 shadow-2xl">
        <button
          onClick={() => setInteractiveMode('shockwave')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-none ${
            interactiveMode === 'shockwave'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-100'
              : 'bg-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span>⚡</span>
          <span>Shockwave</span>
        </button>

        <button
          onClick={() => setInteractiveMode('rain')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-none ${
            interactiveMode === 'rain'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-100'
              : 'bg-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span>🌧️</span>
          <span>Rain</span>
        </button>

        <button
          onClick={() => setInteractiveMode('embers')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-none ${
            interactiveMode === 'embers'
              ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-lg shadow-amber-500/30 scale-100'
              : 'bg-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span>🔥</span>
          <span>Embers</span>
        </button>
      </div>

      {/* 4. FLUID CONTINUOUS EXPANDING NAVBAR */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 w-full flex justify-center pointer-events-none"
        style={{
          paddingTop: `${navPaddingTop}px`,
          paddingLeft: `${navPaddingX}px`,
          paddingRight: `${navPaddingX}px`
        }}
      >
<header 
          className="ios-glass-nav-fluid pointer-events-auto flex items-center justify-between"
          style={{
            width: '100%',
            maxWidth: scrollProgress >= 0.98 ? '100%' : `${1024 + scrollProgress * (typeof window !== 'undefined' && window.innerWidth > 1024 ? window.innerWidth - 1024 : 0)}px`,
            borderRadius: navRadius,
            paddingTop: `${14 - scrollProgress * 2}px`,
            paddingBottom: `${14 - scrollProgress * 2}px`,
            paddingLeft: `${24 + scrollProgress * 16}px`,
            paddingRight: `${24 + scrollProgress * 16}px`,
            borderTopWidth: scrollProgress >= 0.98 ? '0px' : '1px',
            borderLeftWidth: scrollProgress >= 0.98 ? '0px' : '1px',
            borderRightWidth: scrollProgress >= 0.98 ? '0px' : '1px',
            borderBottomWidth: '1px'
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
                <span className="font-extrabold text-sm tracking-tight text-white block leading-none">Mohd Rafey</span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wide">Systems &amp; 3D</span>
              </div>
            </button>

            <nav className="hidden sm:flex items-center gap-8 text-sm font-semibold">
              <button 
                onClick={() => navigateTo('home')}
                className="transition-all cursor-pointer bg-transparent border-none p-0"
                style={{ color: activePage === 'home' ? 'var(--accent-primary)' : '#94a3b8' }}
              >
                Home
              </button>
              <button 
                onClick={() => navigateTo('3d-designs')}
                className="transition-all cursor-pointer bg-transparent border-none p-0"
                style={{ color: activePage === '3d-designs' ? 'var(--accent-primary)' : '#94a3b8' }}
              >
                3D Studio
              </button>
              <a href="#contact" className="text-slate-400 hover:text-white transition-colors">
                Contact
              </a>
            </nav>

            <a 
              href="#contact" 
              className="text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg hover:scale-105 transition-all"
              style={{ backgroundColor: 'var(--accent-primary)', boxShadow: '0 0 20px var(--accent-glow)' }}
            >
              Connect
            </a>
          </div>
        </header>
      </div>

      {/* Top Spacer */}
      <div className="h-28 w-full" />

      {/* 5. Main Content Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-28 flex flex-col items-center animate-page-enter">
        {activePage === 'home' ? (
          <HomePage onNavigate={navigateTo} />
        ) : (
          <Studio3DPage onNavigate={navigateTo} />
        )}

        {/* PERSISTENT FOOTER */}
        <footer id="contact" className="w-full mt-10">
          <div className="text-center p-8 sm:p-12 ios-glass-panel">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Let's Build Something Resilient.</h2>
            <p className="text-slate-400 mb-8 text-sm max-w-md mx-auto font-normal">
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
            <div className="mt-10 pt-6 border-t border-white/5 text-xs text-slate-500 font-medium">
              © 2026 Mohd Rafey. Crafted with React, Tailwind CSS &amp; Vite.
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}