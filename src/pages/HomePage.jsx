// src/pages/HomePage.jsx
import React from 'react';
import LiquidDropletButton from '../components/LiquidDropletButton';
import IridescentButton from '../components/IridescentButton';

import profilePhoto from '/profile.jpg';

const areasOfExploration = [
  {
    id: 'designing',
    title: '3D & Spatial Design',
    desc: 'Interactive 3D environments, multi-angle isometric architecture, and stylized low-poly worlds.',
    badge: 'Blender & Shaders',
    stats: 'Creative Hobby',
    linkText: 'Discuss Creative 3D →',
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

export default function HomePage({ onNavigate, scrollToSection, isLight = false }) {
  return (
    <div className="w-full flex flex-col items-center animate-fadeIn">
      {/* MOBILE EXPERIENCE NOTICE */}
      <div className="w-full block md:hidden -mt-4 mb-6">
        <div className="ios-glass-panel py-3 px-4 flex items-center gap-3.5 !rounded-2xl border border-white/40 shadow-sm">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-base">
            🖥️
          </div>
          <div className="text-left">
            <p className={`text-xs font-bold leading-tight mb-0.5 ${isLight ? 'text-[#111633]' : 'text-white'}`}>
              Interactive Desktop Experience
            </p>
            <p className={`text-[11px] leading-snug ${isLight ? 'text-[#525875]' : 'text-slate-300'}`}>
              This site features interactive canvas shaders and fluid mechanics best experienced on desktop displays.
            </p>
          </div>
        </div>
      </div>

{/* 1. OPEN HERO FOLD: Photo + Identity (Directly over Ambient Background) */}
<section id="hero" className="w-full pt-4 pb-14 flex flex-col md:flex-row items-center justify-between gap-10 scroll-mt-28">
  {/* Left Column: Headlines & Call to Actions (order-2 on mobile, order-1 on desktop) */}
  <div className="flex-1 text-center md:text-left order-2 md:order-1">

    <h1 className={`text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-6 ${
      isLight ? 'text-[#111633]' : 'text-white'
    }`}>
      Hello, I am <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[var(--accent-light)]">
        Mohd Rafey
      </span>
    </h1>

    <p className={`text-base sm:text-lg max-w-xl mx-auto md:mx-0 mb-8 font-normal leading-relaxed ${
      isLight ? 'text-[#525875]' : 'text-slate-300'
    }`}>
      Senior Engineer at <span className={`font-semibold ${isLight ? 'text-[#111633]' : 'text-white'}`}>SMS Group India Pvt. Ltd.</span>
    </p>

    <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
      {isLight ? (
        <div className="rounded-full bg-white/55 shadow-md shadow-indigo-950/5 border border-indigo-900/10  inline-flex">
          <LiquidDropletButton
            key="btn-resume-light"
            enableRandomDrops={true}
            onClick={() => onNavigate('resume')}
            className="hover:scale-105"
          >
            <div className="px-5 py-3 text-sm font-bold flex items-center gap-2 text-[#111633] !drop-shadow-none">
              <span>Launch Resume</span>
              <span>→</span>
            </div>
          </LiquidDropletButton>
        </div>
      ) : (
        <div className="rounded-full bg-slate-900/90 shadow-lg shadow-black/40 border border-white/20  inline-flex">
          <IridescentButton
            key="btn-resume-dark"
            onClick={() => onNavigate('resume')}
            className="hover:scale-105"
          >
            <div className="px-7 py-3 text-sm font-bold flex items-center gap-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <span>Launch Resume</span>
              <span>→</span>
            </div>
          </IridescentButton>
        </div>
      )}

      <button 
        onClick={() => scrollToSection ? scrollToSection('contact') : null}
        className={`px-7 py-3 rounded-full font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer ${
          isLight 
            ? 'bg-white/80 hover:bg-white text-[#111633] border border-[#1C2951]/15' 
            : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/10'
        }`}
      >
        Get In Touch
      </button>
    </div>
  </div>

  {/* Right Column: Circular Framed Portrait (order-1 on mobile, order-2 on desktop) */}
  <div className="relative shrink-0 flex items-center justify-center order-1 md:order-2">
    <div 
      className="w-52 h-52 sm:w-72 sm:h-72 rounded-full overflow-hidden p-1.5 shadow-2xl relative"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.03) 100%)',
        border: '1px solid var(--accent-border-fringe)'
      }}
    >
      <img 
        src={profilePhoto} 
        alt="Mohd Rafey" 
        className="w-full h-full object-cover rounded-full"
      />
    </div>

    {/* Ambient circular glow ring behind photo */}
    <div 
      className="absolute inset-0 rounded-full blur-2xl -z-10 opacity-35 pointer-events-none scale-105"
      style={{ backgroundColor: 'var(--accent-primary)' }}
    />
  </div>
</section>

      {/* 2. DEDICATED ABOUT CARD: Detailed Bio & Metrics */}
      <section id="about" className="w-full mb-16 scroll-mt-28">
        <div className="p-8 sm:p-12 ios-glass-panel relative overflow-hidden">
          <div className="flex items-center gap-2 mb-5">
            <span 
              className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--accent-border-fringe)',
                color: 'var(--accent-light)'
              }}
            >
              About Me
            </span>
          </div>

          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight mb-4 ${
            isLight ? 'text-[#111633]' : 'text-white'
          }`}>
            Engineering Resilient Industrial &amp; Enterprise Platforms
          </h2>

          <p className={`text-base leading-relaxed font-normal mb-8 max-w-3xl ${
            isLight ? 'text-[#525875]' : 'text-slate-300'
          }`}>
            Senior Engineer at <span className={`font-semibold ${isLight ? 'text-[#111633]' : 'text-white'}`}>SMS Group India Pvt. Ltd.</span> specializing in mission-critical software solutions. My on-site commissioning work spans Level-2 process automation systems for steel manufacturing giants including JSW Steel (Dolvi) and AM/NS India (Hazira). Combining deep experience across the C# and .NET desktop ecosystem with an academic Major in Storage and Cloud Technology, I build fault-tolerant telemetry pipelines, dynamic shift tools, and live operator consoles.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10">
            <div className="p-2">
              <span className={`text-2xl sm:text-3xl font-black block ${isLight ? 'text-[#111633]' : 'text-white'}`}>5+ Yrs</span>
              <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-[#525875]' : 'text-slate-400'}`}>Professional</span>
            </div>
            <div className="p-2">
              <span className={`text-2xl sm:text-3xl font-black block ${isLight ? 'text-[#111633]' : 'text-white'}`}>C# / .NET</span>
              <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-[#525875]' : 'text-slate-400'}`}>Core Stack</span>
            </div>
            <div className="p-2">
              <span className={`text-2xl sm:text-3xl font-black block ${isLight ? 'text-[#111633]' : 'text-white'}`}>L2 Plant</span>
              <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-[#525875]' : 'text-slate-400'}`}>Commissioning</span>
            </div>
            <div className="p-2">
              <span className={`text-2xl sm:text-3xl font-black block ${isLight ? 'text-[#111633]' : 'text-white'}`}>MCA</span>
              <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-[#525875]' : 'text-slate-400'}`}>Cloud Major</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PLACEHOLDER: PROJECTS SECTION */}
      <section id="projects" className="w-full mb-16 scroll-mt-28">
        <div className="text-center mb-8">
          <span 
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-2"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--accent-border-fringe)',
              color: 'var(--accent-light)'
            }}
          >
            Engineering Portfolio
          </span>
          <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${isLight ? 'text-[#111633]' : 'text-white'}`}>
            Featured Projects
          </h2>
        </div>
        
        {/* Placeholder container where your project cards will be added */}
        <div className="ios-glass-panel p-8 text-center text-sm text-slate-400 border border-dashed border-white/20">
          Ready for your project data and showcase cards.
        </div>
      </section>

      {/* 4. EXPLORATION PILLARS */}
      <section id="exploration" className="w-full mb-16 scroll-mt-28">
        <div className="text-center mb-10">
          <span 
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-2"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--accent-border-fringe)',
              color: 'var(--accent-light)'
            }}
          >
            Specialized Domains &amp; Creative Tech
          </span>
          <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${isLight ? 'text-[#111633]' : 'text-white'}`}>
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
                  <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full border ${
                    isLight 
                      ? 'text-[#111633] bg-[#1C2951]/5 border-[#1C2951]/10' 
                      : 'text-slate-200 bg-white/10 border-white/15'
                  }`}>
                    {item.badge}
                  </span>
                </div>
                <h3 className={`text-xl font-black mb-2.5 ${isLight ? 'text-[#111633]' : 'text-white'}`}>{item.title}</h3>
                <p className={`text-sm leading-relaxed mb-6 font-normal ${isLight ? 'text-[#525875]' : 'text-slate-300'}`}>{item.desc}</p>
              </div>

              <div className={`pt-4 border-t flex items-center justify-between ${isLight ? 'border-[#1C2951]/10' : 'border-white/10'}`}>
                <span className={`text-xs font-bold ${isLight ? 'text-[#525875]' : 'text-slate-400'}`}>{item.stats}</span>
                <button 
                  onClick={() => scrollToSection ? scrollToSection('contact') : null}
                  className={`text-xs font-bold flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 ${
                    isLight ? 'text-[#111633] hover:opacity-80' : 'text-slate-200 hover:text-white'
                  }`}
                >
                  {item.linkText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}