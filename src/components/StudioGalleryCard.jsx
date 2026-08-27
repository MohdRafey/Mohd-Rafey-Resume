import React, { useState, useEffect } from 'react';

export default function StudioGalleryCard({ 
  taglineHeader, 
  title, 
  description, 
  perspectives = [], 
  autoPlayInterval = 3800 
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  useEffect(() => {
    if (!isAutoPlay || perspectives.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % perspectives.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlay, perspectives.length, autoPlayInterval]);

  const current = perspectives[activeIdx] || perspectives[0];

  return (
    <section className="w-full mb-16">
      <div className="ios-glass-panel p-6 sm:p-10 flex flex-col gap-8">
        {/* Header & Tour Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span 
              className="text-xs font-bold uppercase tracking-wider block mb-1"
              style={{ color: 'var(--accent-primary)' }}
            >
              {taglineHeader}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl font-normal">
              {description}
            </p>
          </div>

          <button 
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 shadow-xs self-start sm:self-auto"
            style={{
              backgroundColor: isAutoPlay ? 'var(--accent-primary)' : 'rgba(15, 23, 42, 0.8)',
              borderColor: isAutoPlay ? 'var(--accent-border-fringe)' : 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff'
            }}
          >
            <span>{isAutoPlay ? '⏸ Pause Auto-Tour' : '▶ Play Auto-Tour'}</span>
          </button>
        </div>

        {/* Main Viewport */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black/60 group">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full max-h-[540px]">
            <img 
              key={activeIdx}
              src={current.src} 
              alt={current.title} 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            <div className="absolute top-4 left-4">
              <div className="px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-semibold flex items-center gap-2 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                View {activeIdx + 1} of {perspectives.length}
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {current.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {current.tagline}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button 
                  onClick={() => setActiveIdx((prev) => (prev === 0 ? perspectives.length - 1 : prev - 1))}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
                >
                  ‹
                </button>
                <button 
                  onClick={() => setActiveIdx((prev) => (prev + 1) % perspectives.length)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Grid */}
        <div className={`grid gap-3 ${
          perspectives.length === 2 
            ? 'grid-cols-2 max-w-xl' 
            : perspectives.length === 3 
            ? 'grid-cols-1 sm:grid-cols-3' 
            : 'grid-cols-2 sm:grid-cols-4'
        }`}>
          {perspectives.map((persp, idx) => (
            <button
              key={persp.id || idx}
              onClick={() => {
                setActiveIdx(idx);
                setIsAutoPlay(false);
              }}
              className={`p-2 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                activeIdx === idx 
                  ? 'bg-slate-900/90 shadow-lg scale-[0.98]' 
                  : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100 hover:bg-white/10'
              }`}
              style={{
                borderColor: activeIdx === idx ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.1)',
                boxShadow: activeIdx === idx ? '0 0 20px var(--accent-glow)' : 'none'
              }}
            >
              <div className="w-full h-16 sm:h-20 rounded-xl overflow-hidden bg-black/40">
                <img src={persp.src} alt={persp.title} className="w-full h-full object-cover" />
              </div>
              <div className="px-1">
                <span className="text-[11px] font-bold text-white block truncate">
                  {persp.title.split(':')[0]}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {persp.title.split(':')[1] || persp.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}