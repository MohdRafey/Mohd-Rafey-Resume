import React from 'react';

/**
 * Reusable Theme-Reactive Pill Switcher Component
 * @param {Array} items - Array of up to 5 items: [{ id, label, icon, activeClass }]
 * @param {string|number} activeId - Currently selected item ID
 * @param {Function} onChange - Callback returning the selected item ID
 * @param {boolean} isLight - Whether Light Mode is active (for color and border adaptation)
 * @param {string} className - Optional positioning or layout class overrides
 */
export default function PillSelector({
  items = [],
  activeId,
  onChange,
  isLight = false,
  className = ''
}) {
  // Enforce a maximum of 5 inputs
  const clampedItems = items.slice(0, 5);

  return (
    <div 
      className={`inline-flex items-center gap-1 p-1 rounded-full backdrop-blur-xl border transition-all ${
        isLight 
          ? 'bg-white/80 border-black/10 shadow-indigo-950/10' 
          : 'bg-slate-950/85 border-white/15 shadow-black/80'
      } ${className}`}
      role="tablist"
    >
      {clampedItems.map((item) => {
        const isActive = activeId === item.id;

        const defaultActiveClass = 'bg-[var(--accent-primary)] text-white shadow-lg scale-100';
        const activeStyle = item.activeClass || defaultActiveClass;

        const inactiveStyle = isLight 
          ? 'bg-transparent text-[#525875] hover:text-[#111633]' 
          : 'bg-transparent text-slate-400 hover:text-white';

        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange && onChange(item.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-none select-none ${
              isActive ? activeStyle : inactiveStyle
            }`}
          >
            {item.icon && <span className="text-sm leading-none">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}