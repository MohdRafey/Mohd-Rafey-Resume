// src/components/AmbientBackground.jsx (or wherever AmbientBackground lives)
import React, { useRef, useEffect } from 'react';
import { Dot } from '../canvas/Dot';
import { ShockwaveMode } from '../canvas/ShockwaveMode';
import { RainMode } from '../canvas/RainMode';
import { EmbersMode } from '../canvas/EmbersMode';

export default function AmbientBackground({ mode = 'shockwave' }) {
  const canvasRef = useRef(null);
  // Default to ShockwaveMode immediately on instantiation
  const activeModeRef = useRef(new ShockwaveMode());
  const isLightRef = useRef(mode === 'light');
  const isLight = mode === 'light';

  // Keep ref synchronized whenever prop changes
  useEffect(() => {
    isLightRef.current = mode === 'light';

    if (mode === 'rain') {
      activeModeRef.current = new RainMode();
    } else if (mode === 'embers') {
      activeModeRef.current = new EmbersMode();
    } else {
      activeModeRef.current = new ShockwaveMode();
    }
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let animationFrameId;
let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

    const DOT_SPACING = 24;
    const FRICTION = 0.74;

    const mouse = { x: -1000, y: -1000, active: false };
    let ripples = [];
    let grid = [];
    let dots = [];
    let cols = 0;
    let rows = 0;

    const initGrid = () => {
      dots = [];
      grid = [];
      cols = Math.floor(width / DOT_SPACING);
      rows = Math.floor(height / DOT_SPACING);
      const offsetX = (width - cols * DOT_SPACING) / 2;
      const offsetY = (height - rows * DOT_SPACING) / 2;

      for (let i = 0; i <= cols; i++) {
        grid[i] = [];
        for (let j = 0; j <= rows; j++) {
          const dot = new Dot(offsetX + i * DOT_SPACING, offsetY + j * DOT_SPACING, i, j);
          dots.push(dot);
          grid[i][j] = dot;
        }
      }
    };

    initGrid();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Guaranteed fallback handler
      const activeHandler = activeModeRef.current || new ShockwaveMode();
      const currentIsLight = isLightRef.current;

      if (!currentIsLight) {
        // 1. Mode Update
        if (typeof activeHandler.update === 'function') {
          activeHandler.update(grid, cols, rows, ripples, width, height, DOT_SPACING);
        }

        // 2. Ripple physics
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rip = ripples[i];
          rip.currentRadius += rip.speed || 3;
          rip.strength *= rip.decay || 0.9;

          if (rip.strength < 0.01 || rip.currentRadius > (rip.maxRadius || 100)) {
            ripples.splice(i, 1);
          }
        }

        // 3. Clock & Grid Lines Drawing
        if (typeof activeHandler.drawGridLines === 'function') {
          activeHandler.drawGridLines(ctx, grid, currentIsLight);
        }

        // 4. Dot updates & draw
        for (let i = 0; i < dots.length; i++) {
          dots[i].update(mouse, ripples, activeHandler, FRICTION);
          dots[i].draw(ctx, activeHandler);
        }
      }

      if (typeof activeHandler.drawGridLines === 'function') {
  activeHandler.drawGridLines(ctx, grid, ripples, currentIsLight);
}

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
    };

    const handleClick = (e) => {
      if (activeModeRef.current && typeof activeModeRef.current.handleClick === 'function') {
        activeModeRef.current.handleClick(e, ripples, width, height, cols, rows);
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initGrid();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div 
        className={`absolute inset-0 bg-[#F3F2F8] transition-opacity duration-500 ease-in-out ${
          isLight ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
        style={{
          backgroundImage: `url('/blob.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div 
        className={`absolute inset-0 bg-[#07090e] transition-opacity duration-500 ease-in-out ${
          !isLight ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-10" />
      </div>
    </div>
  );
}