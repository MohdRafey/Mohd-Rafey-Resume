import React, { useState, useEffect } from 'react';
import AmbientBackground from './components/AmbientBackground';
import RefractionFilter from './components/RefractionFilter';

const areasOfExploration = [
  {
    id: 'designing',
    title: '3D & Spatial Design',
    desc: 'Interactive 3D environments, multi-angle isometric architecture, and stylized low-poly worlds.',
    action: 'view-3d',
    badge: 'Blender & Shaders',
    stats: '4 Angles • Real-time View',
    linkText: 'Explore 3D Studio →',
    icon: (
      <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    )
  },
  {
    id: 'cloud',
    title: 'Cloud & Infrastructure',
    desc: 'Scalable backend deployments, containerized architectures, telemetry pipelines, and cloud security.',
    action: 'contact-section',
    badge: 'Cloud Computing Major',
    stats: 'Enterprise Scale',
    linkText: 'View Architecture →',
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    )
  },
  {
    id: 'automation',
    title: 'Industrial Automation',
    desc: 'Mission-critical telemetry tools, shift management systems, and real-time plant dashboards for JSW & AM/NS.',
    action: 'contact-section',
    badge: 'Senior Engineer',
    stats: 'High Availability',
    linkText: 'Industrial Solutions →',
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    )
  },
  {
    id: 'ai-prototypes',
    title: 'AI & Generative Workflows',
    desc: 'Autonomous agent pipelines, procedural asset tools, algorithmic visualizers, and stateful experiments.',
    action: 'contact-section',
    badge: 'Applied AI Labs',
    stats: 'Agentic Workflows',
    linkText: 'See Experiments →',
    icon: (
      <svg className="w-6 h-6 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
];

const clinicPerspectives = [
  { 
    id: 1, 
    title: 'Perspective 01: Isometric Master Overview', 
    tagline: 'Full orthographic layout showing spatial flow, partition hierarchy, and structural zoning.', 
    src: '/clinic_1.jpg' 
  },
  { 
    id: 2, 
    title: 'Perspective 02: Reception & Client Lounge', 
    tagline: 'Focused low-angle depth emphasizing material textures, glass refraction, and ambient lighting.', 
    src: '/clinic_2.jpg' 
  },
  { 
    id: 3, 
    title: 'Perspective 03: Primary Clinical Suite', 
    tagline: 'Interior medical equipment staging with localized rim-lighting and shadow falloff.', 
    src: '/clinic_3.jpg' 
  },
  { 
    id: 4, 
    title: 'Perspective 04: Top-Down Plan Cutaway', 
    tagline: 'Orthogonal ceiling cutaway inspecting interior foot-traffic clearance and layout zoning.', 
    src: '/clinic_4.jpg' 
  },
];
export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [activeAngleIdx, setActiveAngleIdx] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [interactiveMode, setInteractiveMode] = useState('shockwave'); // 'shockwave' | 'rain'

  useEffect(() => {
    if (!isAutoPlay || activePage !== '3d-designs') return;
    const interval = setInterval(() => {
      setActiveAngleIdx((prev) => (prev + 1) % clinicPerspectives.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isAutoPlay, activePage]);

  const navigateTo = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full relative text-slate-100 overflow-x-hidden selection:bg-indigo-500 selection:text-white flex flex-col items-center">
      
      {/* 1. Global Refraction Displacement Shader */}
      <RefractionFilter />

      {/* 2. Interactive Background Engine */}
      <AmbientBackground mode={interactiveMode} />

      {/* 3. Floating Interactive Mode Switcher Pill */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-1 p-1 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/15 shadow-2xl">
        <button
          onClick={() => setInteractiveMode('shockwave')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-none ${
            interactiveMode === 'shockwave'
              ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-100'
              : 'bg-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span>⚡</span>
          <span>Shockwave</span>
        </button>
        <button
          onClick={() => setInteractiveMode('rain')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-none ${
            interactiveMode === 'rain'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-100'
              : 'bg-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span>🌧️</span>
          <span>Digital Rain</span>
        </button>
      </div>

      {/* 4. Foreground Scaffolding */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-28 flex flex-col items-center">
        {/* FLOATING GLASS NAVBAR */}
        <header className="sticky top-4 z-50 w-full flex items-center justify-between px-6 py-3.5 ios-glass-nav mb-12">
          <button 
            onClick={() => navigateTo('home')} 
            className="flex items-center gap-3 text-left group cursor-pointer bg-transparent border-none p-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-black text-xs text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
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
              className={`transition-all cursor-pointer bg-transparent border-none p-0 ${
                activePage === 'home' ? 'text-indigo-400 font-bold drop-shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => navigateTo('3d-designs')}
              className={`transition-all cursor-pointer bg-transparent border-none p-0 ${
                activePage === '3d-designs' ? 'text-indigo-400 font-bold drop-shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Studio
            </button>
            <a href="#contact" className="text-slate-400 hover:text-white transition-colors">
              Contact
            </a>
          </nav>

          <a 
            href="#contact" 
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all"
          >
            Connect
          </a>
        </header>

        {/* VIEW 1: HOME PAGE */}
        {activePage === 'home' && (
          <div className="w-full flex flex-col items-center animate-fadeIn">
            
            {/* HERO CARD */}
            <section className="w-full mb-14">
              <div className="p-8 sm:p-14 ios-glass-panel text-center relative overflow-hidden">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  Software Engineer &amp; Systems
                </div>

                <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6">
                  Hello, I am <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">Mohd Rafey</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-10 font-normal leading-relaxed">
                  Senior Engineer at <span className="text-white font-semibold">SMS Group India Pvt. Ltd.</span> architecting high-reliability industrial automation software for steelmaker giants including JSW and AM/NS. With a Major in Cloud Computing, I build mission-critical shift systems, real-time telemetry dashboards, and spatial 3D architectural environments.
                </p>

                <div className="flex justify-center gap-4 flex-wrap">
                  <button 
                    onClick={() => navigateTo('3d-designs')}
                    className="px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all cursor-pointer border-none flex items-center gap-2"
                  >
                    <span>Launch 3D Studio</span>
                    <span>→</span>
                  </button>
                  <a 
                    href="#contact" 
                    className="px-8 py-3.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-white/10 shadow-sm hover:shadow-md transition-all"
                  >
                    Get In Touch
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/10 max-w-2xl mx-auto">
                  <div className="p-3">
                    <span className="text-2xl sm:text-3xl font-black text-white block">5+ Yrs</span>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Engineering</span>
                  </div>
                  <div className="p-3">
                    <span className="text-2xl sm:text-3xl font-black text-white block">C# / .NET</span>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Ecosystem</span>
                  </div>
                  <div className="p-3 col-span-2 sm:col-span-1">
                    <span className="text-2xl sm:text-3xl font-black text-white block">Cloud</span>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Computing Major</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 4-PILLAR EXPLORATION CARDS */}
            <section id="explore" className="w-full mb-16 scroll-mt-20">
              <div className="text-center mb-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-bold text-indigo-300 tracking-wider uppercase mb-2">
                  Specialized Domains
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Areas of Exploration
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {areasOfExploration.map((item) => (
                  <div 
                    key={item.id}
                    className="ios-glass-panel p-7 flex flex-col justify-between min-h-[260px]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-xs">
                          {item.icon}
                        </div>
                        <span className="text-xs font-bold text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white mb-2.5">{item.title}</h3>
                      <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">{item.desc}</p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">{item.stats}</span>
                      {item.action === 'view-3d' ? (
                        <button 
                          onClick={() => navigateTo('3d-designs')}
                          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
                        >
                          {item.linkText}
                        </button>
                      ) : (
                        <a 
                          href="#contact"
                          className="text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1"
                        >
                          {item.linkText}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: 3D DESIGN STUDIO */}
        {activePage === '3d-designs' && (
          <div className="w-full flex flex-col items-center animate-fadeIn">
            <div className="w-full flex justify-between items-center mb-6">
              <button 
                onClick={() => navigateTo('home')}
                className="text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900/70 border border-white/10 cursor-pointer shadow-xs transition-all hover:bg-slate-800"
              >
                ← Return to Overview
              </button>
              <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20 shadow-xs">
                Spatial Visuals &amp; Multi-Angle Studies
              </span>
            </div>

            <section className="w-full mb-16">
              <div className="ios-glass-panel p-6 sm:p-10 flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                      Blender • Cycles • Isometric Shading
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      3D Isometric Medical Center Scene
                    </h2>
                    <p className="text-sm text-slate-400 mt-1 max-w-xl font-normal">
                      Multi-perspective architectural study examining zoned workflows, partition light falloff, and low-poly ambient occlusion.
                    </p>
                  </div>

                  <button 
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
                      isAutoPlay 
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/30' 
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-white/10'
                    }`}
                  >
                    <span>{isAutoPlay ? '⏸ Pause Auto-Tour' : '▶ Play Auto-Tour'}</span>
                  </button>
                </div>

                <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black/60 group">
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full max-h-[540px]">
                    <img 
                      key={activeAngleIdx}
                      src={clinicPerspectives[activeAngleIdx].src} 
                      alt={clinicPerspectives[activeAngleIdx].title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    <div className="absolute top-4 left-4">
                      <div className="px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-semibold flex items-center gap-2 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Angle {activeAngleIdx + 1} of {clinicPerspectives.length}
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {clinicPerspectives[activeAngleIdx].title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {clinicPerspectives[activeAngleIdx].tagline}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button 
                          onClick={() => setActiveAngleIdx((prev) => (prev === 0 ? clinicPerspectives.length - 1 : prev - 1))}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
                        >
                          ‹
                        </button>
                        <button 
                          onClick={() => setActiveAngleIdx((prev) => (prev + 1) % clinicPerspectives.length)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
                        >
                          ›
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {clinicPerspectives.map((persp, idx) => (
                    <button
                      key={persp.id}
                      onClick={() => {
                        setActiveAngleIdx(idx);
                        setIsAutoPlay(false);
                      }}
                      className={`p-2 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                        activeAngleIdx === idx 
                          ? 'bg-indigo-950/50 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)] ring-1 ring-indigo-400/50 scale-[0.98]' 
                          : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100 hover:bg-white/10'
                      }`}
                    >
                      <div className="w-full h-16 sm:h-20 rounded-xl overflow-hidden bg-black/40">
                        <img src={persp.src} alt={persp.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="px-1">
                        <span className="text-[11px] font-bold text-white block truncate">
                          Perspective 0{persp.id}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {persp.title.split(':')[1]}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

          </div>
        )}

        {/* FOOTER */}
        <footer id="contact" className="w-full">
          <div className="text-center p-8 sm:p-12 ios-glass-panel">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Let's Build Something Resilient.</h2>
            <p className="text-slate-400 mb-8 text-sm max-w-md mx-auto font-normal">
              Open for technical collaboration, architecture discussions, and custom 3D environment visualization.
            </p>
            <a 
              href="mailto:contact@yourdomain.com" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-full inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all"
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