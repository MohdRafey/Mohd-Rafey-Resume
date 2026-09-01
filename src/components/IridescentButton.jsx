// src/components/IridescentButton.jsx
import React, { useState, useEffect } from 'react';
import styles from '../styles/IridescentButton.module.css';

export default function IridescentButton({
  children,
  onClick,
  autoShine = true,
  className = '',
  style = {},
  ...props
}) {
  const [isShining, setIsShining] = useState(false);

  // Synchronized with PillSelector's tab/mount trigger
  useEffect(() => {
    if (!autoShine) return;
    setIsShining(true);
    const timer = setTimeout(() => setIsShining(false), 900);
    return () => clearTimeout(timer);
  }, [autoShine]);

  const handleClick = (e) => {
    setIsShining(true);
    setTimeout(() => setIsShining(false), 900);
    if (onClick) onClick(e);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
      className={`${styles.iridescentBtn} ${isShining ? styles.shine : ''} ${className}`}
      style={style}
      {...props}
    >
      <div className="relative z-10 flex items-center justify-center text-white pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
        {children}
      </div>
    </div>
  );
}