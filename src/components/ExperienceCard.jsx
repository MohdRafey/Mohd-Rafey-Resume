import React from 'react';

// Solid, flat category dot colors
const TAG_DOT_COLORS = {
  Academics: '#10b981',    // Emerald Green
  Career: '#6366f1',       // Indigo
  Hobby: '#f59e0b',        // Amber
  Certification: '#06b6d4',// Cyan
  Research: '#a855f7'      // Purple
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
    <div className="ios-glass-panel p-4 w-full relative transition-all duration-300 hover:-translate-y-1 group">
      
      {/* 1. Left Vertical Spine Node */}
      <div 
        className="category-spine-dot absolute -left-[27px] top-5 w-2.5 h-2.5 rounded-full border border-white/80"
        style={{ 
          backgroundColor: dotColor,
          background: dotColor
        }}
      />

      {/* 2. Top Header: Category Pill with Increased Thickness & Flat Dot */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {tag && (
          <div className="category-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full select-none backdrop-blur-md bg-white/[0.07] border border-white/20 shadow-xs">
            {/* Plain Colored Dot */}
            <span 
              className="category-dot w-2 h-2 rounded-full shrink-0" 
              style={{ 
                backgroundColor: dotColor,
                background: dotColor
              }}
            />
            <span className="text-[11px] font-bold tracking-wider uppercase opacity-95 leading-none">
              {tag}
            </span>
          </div>
        )}

        {date && (
          <span className="text-[11px] font-bold opacity-60 uppercase tracking-wide">
            {date}
          </span>
        )}
      </div>

      {/* 3. Title */}
      {title && (
        <h3 className="text-sm sm:text-[15px] font-black leading-snug mb-1">
          {title}
        </h3>
      )}

      {/* 4. Organization / Subtitle */}
      {org && (
        <h4 className="text-[11px] font-bold text-[var(--accent-light)] mb-2 opacity-90">
          {org}
        </h4>
      )}

      {/* 5. Detail Description */}
      {detail && (
        <p className="text-[11px] opacity-80 leading-relaxed font-normal mb-3">
          {detail}
        </p>
      )}

      {/* 6. Footer: Metrics or Paper Link */}
      {(metric || link) && (
        <div className="pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px]">
          {metric ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-black">{metric}</span>
              {metricLabel && (
                <span className="text-[9px] uppercase font-bold opacity-60">
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
              className="text-[11px] font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-1"
            >
              {linkText || 'Read Paper (PDF) →'}
            </a>
          )}
        </div>
      )}
    </div>
  );
}