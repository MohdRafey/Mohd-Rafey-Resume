import React, { useRef, useState, useEffect, useMemo } from 'react';
import ExperienceCard from '../components/ExperienceCard';
import PillSelector from '../components/PillSelector';

const yearlyMilestones = [
  {
    year: '2012',
    events: [
      {
        date: 'May 2012',
        tag: 'Academics',
        title: 'ICSE Board (10th Standard)',
        org: 'New Public College, Lucknow, UP',
        detail: 'Completed High School board examination with core sciences and mathematics.',
        metric: '72.5%',
        metricLabel: 'Aggregate'
      }
    ]
  },
  {
    year: '2015',
    events: [
      {
        date: 'May 2015',
        tag: 'Academics',
        title: 'ISC Board (12th Standard)',
        org: 'New Public College, Lucknow, UP',
        detail: 'Completed senior secondary education focusing on Physics, Chemistry, and Mathematics.',
        metric: '71.8%',
        metricLabel: 'Aggregate'
      }
    ]
  },
  {
    year: '2016',
    events: [
      {
        date: 'August 2016',
        tag: 'Academics',
        title: 'BCA Commenced',
        org: 'Integral University, Lucknow, UP',
        detail: 'Began Bachelor of Computer Applications focusing on algorithms, procedural programming, and database foundations.'
      }
    ]
  },
  {
    year: '2019',
    events: [
      {
        date: 'June 2019',
        tag: 'Academics',
        title: 'BCA Completed',
        org: 'Integral University, Lucknow, UP',
        detail: 'Graduated with Bachelor of Computer Applications focusing on software engineering and object-oriented systems.',
        metric: '8.3',
        metricLabel: 'CGPA'
      },
      {
        date: 'August 2019',
        tag: 'Academics',
        title: 'MCA Commenced',
        org: 'Jain University, Bengaluru, KA',
        detail: 'Initiated Master of Computer Applications specializing in Storage and Cloud Technology.'
      }
    ]
  },
  {
    year: '2020',
    events: [
      {
        tag: 'Certification',
        date: 'April 2020',
        title: 'Oracle Cloud Infrastructure 2020 Certified Associate',
        org: 'Oracle University',
        detail: 'Validated foundational mastery in OCI architecture, VCN networking, security, and cloud storage solutions.',
        metric: 'OCI-Foundations',
        metricLabel: 'Certified'
      },
      {
        date: 'June 2020',
        tag: 'Research',
        title: 'Geospatial Data Visualization with WebGL API',
        org: 'International Journal (IJIIRD)',
        detail: 'Published research exploring real-time high-performance 3D spatial rendering directly within browser viewports.',
        link: 'https://ijiird.com/wp-content/uploads/040235.pdf',
        linkText: 'Read Paper (PDF) →'
      },
      {
        date: 'November 2020',
        tag: 'Research',
        title: 'Age & Gender Detection using Python',
        org: 'International Journal (IJIIRD)',
        detail: 'Published computer vision research utilizing deep convolutional neural networks for real-time demographic extraction.',
        link: 'https://ijiird.com/wp-content/uploads/050134.pdf',
        linkText: 'Read Paper (PDF) →'
      }
    ]
  },
  {
    year: '2021',
    events: [
      {
        date: 'June 2021',
        tag: 'Academics',
        title: 'MCA Completed (Cloud Specialization)',
        org: 'Jain University, Bengaluru, KA',
        detail: 'Completed Master of Computer Applications with specialization in Storage and Cloud Technology.',
        metric: '8.6',
        metricLabel: 'CGPA'
      },
      {
        date: 'August 2021',
        tag: 'Career',
        title: 'Joined SMS Group as GET',
        org: 'SMS Group India Pvt. Ltd.',
        detail: 'Joined the core industrial automation division building high-reliability telemetry loggers and shift monitoring tools.'
      }
    ]
  },
  {
    year: '2022',
    events: [
      {
        date: '2022',
        tag: 'Career',
        title: 'Software Engineer',
        org: 'SMS Group India Pvt. Ltd.',
        detail: 'Promoted to core engineering for enterprise steelmaking automation systems and .NET services.'
      },
      {
        date: '2022 — 2023',
        tag: 'Career',
        title: 'Deputed to JSW Steel (Dolvi, Maharashtra)',
        org: 'SMS Group × JSW Steel',
        detail: 'On-site Level-2 PGS commissioning. Engineered telemetry pipelines and operator stations on active plant floors.'
      }
    ]
  },
  {
    year: '2023',
    events: [
      {
        date: 'March 2023',
        tag: 'Hobby',
        title: 'Source Engine Custom Map Release',
        org: 'Valve Source Engine',
        detail: 'Engineered and released custom competitive multiplayer level geometry with optimized BSP visleafs and tactical sightlines.'
      },
      {
        date: '2023 — 2025',
        tag: 'Career',
        title: 'Deputed to AM/NS India (Hazira, Gujarat)',
        org: 'SMS Group × AM/NS',
        detail: 'On-site L2 Process Automation commissioning for high-capacity steel production lines until 2025 release.'
      }
    ]
  },
  {
    year: '2025',
    events: [
      {
        date: '2025 — Present',
        tag: 'Career',
        title: 'Senior Software Engineer',
        org: 'SMS Group India Pvt. Ltd.',
        detail: 'Leading software architecture, telemetry dashboards, and modern reporting suites for industrial steelmaker giants.'
      }
    ]
  }
];

const filterOptions = [
  { id: 'All', label: 'All', icon: '✨', activeClass: 'bg-[var(--accent-primary)] text-white shadow-lg shadow-indigo-500/30 scale-100' },
  { id: 'Career', label: 'Career', icon: '💼', activeClass: 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-100' },
  { id: 'Academics', label: 'Academics', icon: '🎓', activeClass: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-100' },
  { id: 'Hobby', label: 'Hobby', icon: '🎮', activeClass: 'bg-amber-600 text-white shadow-lg shadow-amber-500/30 scale-100' }
];

export default function ResumePage({ onNavigate, isLight = false }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDistance, setScrollDistance] = useState(3200);

  const filteredMilestones = useMemo(() => {
    if (activeFilter === 'All') return yearlyMilestones;

    return yearlyMilestones
      .map((col) => ({
        ...col,
        events: col.events.filter((item) => item.tag === activeFilter)
      }))
      .filter((col) => col.events.length > 0);
  }, [activeFilter]);

  useEffect(() => {
    const updateDimensions = () => {
      if (!trackRef.current) return;
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const totalShift = Math.max(0, trackWidth - viewportWidth);
      setScrollDistance(totalShift);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [filteredMilestones]);

  useEffect(() => {
    let ticking = false;

    const handleWindowScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current || !trackRef.current) {
            ticking = false;
            return;
          }

          const container = containerRef.current;
          const rect = container.getBoundingClientRect();
          const totalScrollableHeight = container.offsetHeight - window.innerHeight;

          if (totalScrollableHeight <= 0) {
            ticking = false;
            return;
          }

          const currentProgress = Math.min(Math.max(-rect.top / totalScrollableHeight, 0), 1);
          setScrollProgress(currentProgress);

          const maxTranslateX = Math.max(0, trackRef.current.scrollWidth - window.innerWidth);
          const translateX = currentProgress * maxTranslateX;

          trackRef.current.style.transform = `translate3d(-${translateX}px, 0, 0)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    handleWindowScroll();
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [scrollDistance]);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 1. TOP INTRO HEADER */}
      <section className="w-full max-w-5xl px-4 sm:px-6 mb-6">
        <div className="p-6 sm:p-8 ios-glass-panel text-center relative overflow-hidden">
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-xs backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--accent-border-fringe)',
              color: 'var(--accent-light)'
            }}
          >
            Summary
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
            Resume of Mohd Rafey
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Senior Software Engineer currently working in SMS Group India. My Work
involves building robust and modular Interfaces and resilient code logic that are
used in Critical Operations. I have experience in Software Development using
multiple technological tools, Client Handling, Site Commissioning. I have keen
interest in learning new technologies and programming languages.
          </p>
        </div>
      </section>

      {/* 2. PINNED VIEWPORT REGION */}
      <div 
        ref={containerRef}
        style={{ height: `calc(${scrollDistance}px + 100vh)` }}
        className="w-full relative"
      >
        {/* Added extra top padding (pt-24 sm:pt-28) to comfortably clear the fixed navbar */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-start pt-20 sm:pt-20">
          
          {/* A. STICKY TIMELINE BADGE */}
          <div className="w-full flex justify-center mb-3 z-30">
            <span 
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-xs"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--accent-border-fringe)',
                color: 'var(--accent-light)'
              }}
            >
              Timeline
            </span>
          </div>

          {/* B. EDGE-TO-EDGE PROGRESS LINE */}
          <div className="w-full h-[2px] bg-white/10 relative z-10 mb-4">
            <div 
              className="h-full bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-light)] to-[var(--accent-primary)] transition-all duration-75"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>

          {/* C. THEMED PILL SELECTOR */}
          <div className="w-full flex justify-center mb-6 z-30">
            <PillSelector
              items={filterOptions}
              activeId={activeFilter}
              onChange={(newId) => setActiveFilter(newId)}
              isLight={isLight}
            />
          </div>

          {/* D. HORIZONTAL TIMELINE COLUMNS */}
          <div 
            ref={trackRef}
            className="flex items-start gap-20 sm:gap-28 px-[50vw] w-max relative z-10 will-change-transform"
          >
            {filteredMilestones.map((col, yIdx) => (
              <div 
                key={yIdx}
                className="shrink-0 w-[340px] sm:w-[420px] flex flex-col relative"
              >
                {/* Year Header */}
                <div className="flex items-center gap-3 mb-3 relative">
                  <div 
                    className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-md z-10 shrink-0"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  />
                  
                  <span className="text-2xl sm:text-3xl font-black text-[var(--accent-primary)] tracking-tight">
                    {col.year}
                  </span>

                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/15 uppercase text-slate-400">
                    {col.events.length} {col.events.length > 1 ? 'Events' : 'Event'}
                  </span>
                </div>

                {/* Vertical Column Spine */}
                <div className="relative pl-5 border-l-2 border-white/15 space-y-3 pb-2 ml-1.5">
                  {col.events.map((item, eIdx) => (
                    <ExperienceCard
                      key={eIdx}
                      tag={item.tag}
                      date={item.date}
                      title={item.title}
                      org={item.org}
                      detail={item.detail}
                      metric={item.metric}
                      metricLabel={item.metricLabel}
                      link={item.link}
                      linkText={item.linkText}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. RESUMED VERTICAL FOOTER ACTIONS */}
      <div className="w-full max-w-5xl px-4 sm:px-6 my-12 flex items-center justify-center gap-4 relative z-20">
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs border border-white/15 cursor-pointer transition-all"
        >
          ← Back to Home
        </button>
        <button
          onClick={() => onNavigate('3d-designs')}
          className="px-6 py-3 rounded-full text-white font-bold text-xs shadow-lg cursor-pointer transition-all"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          Explore 3D Studio →
        </button>
      </div>

    </div>
  );
}