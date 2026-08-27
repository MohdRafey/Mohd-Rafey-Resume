import React from 'react';

export default function RefractionFilter() {
  return (
    <svg className="fixed pointer-events-none -z-50 opacity-0 w-0 h-0" aria-hidden="true">
      <defs>
        {/* Optical Glass Displacement Shader */}
        <filter id="liquid-refraction" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.015 0.015" 
            numOctaves="2" 
            result="noise" 
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="4" 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>
      </defs>
    </svg>
  );
}