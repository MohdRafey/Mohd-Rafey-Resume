import React from 'react';

const TAG_DOT_COLORS = {
  Academics: '#10b981',
  Career: '#6366f1',
  Hobby: '#f59e0b',
  Certification: '#06b6d4',
  Research: '#a855f7'
};

const DEFAULT_DOT_COLOR = 'var(--accent-primary)';

export default function ExperienceCard({
  tag,
  date,
  title,
  org,
  detail,
  metric,
  metricLabel,
  link,
  linkText
}) {
  const dotColor = TAG_DOT_COLORS[tag] || DEFAULT_DOT_COLOR;

  return (
    <div className="ios-glass-panel px-4 py-3 w-full relative">
      
      {/* 1. Left Vertical Spine Node */}
      <div 
        className="category-spine-dot absolute -left-[27px] top-3.5 w-2.5 h-2.5 rounded-full border border-white/80 z-20 shrink-0"
        style={{ 
          backgroundColor: dotColor,
          background: dotColor
        }}
      />

      {/* 2. Top Bar: Tag Pill & Date */}
      <div className="flex items-center justify-between gap-2 mb-1.5 relative z-10">
        {tag && (
          <div className="category-pill inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full select-none bg-white/[0.06] border border-white/15">
            <span 
              className="category-dot w-1.5 h-1.5 rounded-full shrink-0" 
              style={{ 
                backgroundColor: dotColor,
                background: dotColor
              }}
            />
            <span className="text-[9px] font-bold tracking-wider uppercase opacity-95 leading-none">
              {tag}
            </span>
          </div>
        )}

        {date && (
          <span className="text-[9px] font-bold opacity-60 uppercase tracking-wide">
            {date}
          </span>
        )}
      </div>

      {/* 3. Title & Organization in Compact Header Block */}
      <div className="mb-1.5 relative z-10">
        {title && (
          <h3 className="text-xs sm:text-[13px] font-black leading-snug tracking-tight">
            {title}
          </h3>
        )}

        {org && (
          <h4 className="text-[10px] font-bold text-[var(--accent-light)] opacity-90 leading-tight mt-0.5">
            {org}
          </h4>
        )}
      </div>

      {/* 4. Compact Body Detail */}
      {detail && (
        <p className="text-[10.5px] opacity-80 leading-relaxed font-normal mb-2 relative z-10">
          {detail}
        </p>
      )}

      {/* 5. Footer: Metric / Link */}
      {(metric || link) && (
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] relative z-10">
          {metric ? (
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] font-black">{metric}</span>
              {metricLabel && (
                <span className="text-[8px] uppercase font-bold opacity-60">
                  {metricLabel}
                </span>
              )}
            </div>
          ) : (
            <div />
          )}

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-1"
            >
              {linkText || 'Read Paper (PDF) →'}
            </a>
          )}
        </div>
      )}
    </div>
  );
}