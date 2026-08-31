// src/pages/HomePage.jsx
import React from 'react';
import LiquidDropletButton from '../components/LiquidDropletButton';

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

export default function HomePage({ onNavigate }) {
  return (
    <div className="w-full flex flex-col items-center animate-fadeIn">
      {/* MOBILE-ONLY EXPERIENCE NOTICE */}
      <div className="w-full block md:hidden -mt-4 mb-4">
        <div className="ios-glass-panel py-3 px-4 flex items-center gap-3.5 !rounded-2xl border border-white/40 shadow-sm">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-base">
            🖥️
          </div>
          <div className="text-left">
            <p className="text-xs font-bold leading-tight mb-0.5 text-[#111633] dark:text-white">
              Interactive Desktop Experience
            </p>
            <p className="text-[11px] leading-snug text-[#525875] dark:text-slate-300">
              This site features interactive canvas shaders and 3D scenes best experienced on a desktop screen.
            </p>
          </div>
        </div>
      </div>

      {/* HERO CARD */}
      <section className="w-full mb-14">
        <div className="p-8 sm:p-14 ios-glass-panel text-center relative overflow-hidden">
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-xs backdrop-blur-md"
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
            Software Engineer &amp; Systems
          </div>

          <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6">
            Hello, I am <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[var(--accent-light)]">Mohd Rafey</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-10 font-normal leading-relaxed">
            Senior Engineer at <span className="text-white font-semibold">SMS Group India Pvt. Ltd.</span> architecting high-reliability industrial automation software for steelmaker giants including JSW and AM/NS. With a Major in Cloud Computing, I build mission-critical shift systems, real-time telemetry dashboards, and spatial 3D architectural environments.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex justify-center items-center gap-4 flex-wrap">
            {/* LAUNCH RESUME (WITH LIQUID RIPPLES) */}
<LiquidDropletButton
    enableRandomDrops={true}
    onClick={() => onNavigate('resume')}
    className="hover:scale-105"
  >
    <div className="px-8 py-3.5 text-sm font-bold flex items-center gap-2">
      <span>Launch Resume</span>
      <span>→</span>
    </div>
  </LiquidDropletButton>

            {/* GET IN TOUCH */}
            <a 
              href="#contact" 
              className="px-8 py-3.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-white/10 shadow-sm hover:shadow-md transition-all no-underline"
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
          <span 
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-2"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--accent-border-fringe)',
              color: 'var(--accent-light)'
            }}
          >
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
                    onClick={() => onNavigate('3d-designs')}
                    className="text-xs font-bold flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    {item.linkText}
                  </button>
                ) : (
                  <a 
                    href="#contact" 
                    className="text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1 no-underline"
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
  );
}