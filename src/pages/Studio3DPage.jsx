import React, { useState, useEffect } from 'react';

const clinicPerspectives = [
  { 
    id: 1, 
    title: 'Perspective 01: View from the Main Entrance', 
    tagline: 'Client provided its home photos and asked to create a 3D visualization of the space with complete clinic.', 
    src: '/clinic_1.jpg' 
  },
  { 
    id: 2, 
    title: 'Perspective 02: Doctor’s Consultation Room', 
    tagline: 'Spatial visualization of the consultation room with medical equipment and patient seating arrangement.', 
    src: '/clinic_2.jpg' 
  },
  { 
    id: 3, 
    title: 'Perspective 03: Complete interior View ', 
    tagline: 'A comprehensive view of the clinic’s interior, showcasing the layout and design elements.', 
    src: '/clinic_3.jpg' 
  },
  { 
    id: 4, 
    title: 'Perspective 04: Waiting Area & Reception', 
    tagline: 'A detailed look at the waiting area and reception, highlighting the design and comfort for patients.', 
    src: '/clinic_4.jpg' 
  },
];

export default function Studio3DPage({ onNavigate }) {
  const [activeAngleIdx, setActiveAngleIdx] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setActiveAngleIdx((prev) => (prev + 1) % clinicPerspectives.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  return (
    <div className="w-full flex flex-col items-center animate-fadeIn">
      <div className="w-full flex justify-between items-center mb-6">
        <button 
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900/70 border border-white/10 cursor-pointer shadow-xs transition-all hover:bg-slate-800"
        >
          ← Return to Overview
        </button>
        <span 
          className="text-xs font-bold px-3.5 py-1.5 rounded-full border shadow-xs"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'var(--accent-border-fringe)',
            color: 'var(--accent-light)'
          }}
        >
          Spatial Visuals &amp; Multi-Angle Studies
        </span>
      </div>

      <section className="w-full mb-16">
        <div className="ios-glass-panel p-6 sm:p-10 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span 
                className="text-xs font-bold uppercase tracking-wider block mb-1"
                style={{ color: 'var(--accent-primary)' }}
              >
                Sketchup  • Isometric Shading
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                3D Isometric Medical Center Scene
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-xl font-normal">
                A Dental clinic project that I worked on for a client using Sketchup.
              </p>
            </div>

            <button 
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 shadow-xs"
              style={{
                backgroundColor: isAutoPlay ? 'var(--accent-primary)' : 'rgba(15, 23, 42, 0.8)',
                borderColor: isAutoPlay ? 'var(--accent-border-fringe)' : 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff'
              }}
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
                    ? 'bg-slate-900/90 shadow-lg scale-[0.98]' 
                    : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100 hover:bg-white/10'
                }`}
                style={{
                  borderColor: activeAngleIdx === idx ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: activeAngleIdx === idx ? '0 0 20px var(--accent-glow)' : 'none'
                }}
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
  );
}