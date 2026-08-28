import React, { useRef, useState, useEffect } from 'react';

export default function PillSelector({ items = [], activeId, onChange, isLight = false }) {
  const containerRef = useRef(null);
  const buttonRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const activeButton = buttonRefs.current[activeId];
    const container = containerRef.current;

    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      // Horizontal overhang to completely wrap and cover the tray edges on the flanks
      const horizontalBleed = 10;

      setIndicatorStyle({
        left: buttonRect.left - containerRect.left - horizontalBleed,
        width: buttonRect.width + horizontalBleed * 2,
        opacity: 1
      });
    }
  }, [activeId, items]);

  return (
    <div
      ref={containerRef}
      className="ios-glass-panel relative inline-flex items-center p-1 rounded-full select-none transition-all duration-300 !overflow-visible z-20"
    >
      {/* 1. OUTWARD PROTRUDING LIQUID DROPLET (Extended footprint covers tray edges) */}
      <div
        className="absolute -top-1.5 -bottom-1.5 rounded-full pointer-events-none transition-all duration-400 ease-[cubic-bezier(0.34,1.45,0.64,1)] z-10"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity,
          background: isLight
            ? 'rgba(255, 255, 255, 0.92)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
          border: isLight
            ? '1.5px solid rgba(255, 255, 255, 1)'
            : '1px solid rgba(255, 255, 255, 0.16)',
          boxShadow: isLight
            ? '0 6px 20px -2px rgba(28, 41, 81, 0.16), 0 2px 6px rgba(0, 0, 0, 0.04), inset 0 1px 1.5px rgba(255, 255, 255, 1)'
            : '0 10px 28px -4px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.22), inset 0 0 12px rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(16px) saturate(140%)',
          WebkitBackdropFilter: 'blur(16px) saturate(140%)'
        }}
      />

      {/* 2. PILL ITEM BUTTONS */}
      {items.map((item) => {
        const isActive = activeId === item.id;

        return (
          <button
            key={item.id}
            ref={(el) => (buttonRefs.current[item.id] = el)}
            onClick={() => onChange(item.id)}
            type="button"
            className="relative z-20 flex items-center justify-center px-4 py-1.5 rounded-full cursor-pointer transition-all duration-300 outline-none select-none"
          >
            {/* Unified Magnified Content Container */}
            <div
              className={`flex items-center gap-2 transform transition-transform duration-300 ease-out origin-center ${
                isActive ? 'scale-115' : 'scale-100'
              }`}
            >
              {item.icon && (
                <span
                  className={`text-xs inline-block transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-60 hover:opacity-90'
                  }`}
                >
                  {item.icon}
                </span>
              )}

              <span
                className={`text-xs font-bold tracking-wider uppercase leading-none transition-colors duration-300 ${
                  isActive
                    ? isLight
                      ? 'font-black text-[#111633]'
                      : 'font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
                    : isLight
                      ? 'font-semibold text-[#525875] hover:text-[#111633]'
                      : 'font-semibold text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}