import React, { useRef, useEffect } from 'react';
import { Dot } from '../canvas/Dot';
import { ShockwaveMode } from '../canvas/ShockwaveMode';
import { RainMode } from '../canvas/RainMode';
import { EmbersMode } from '../canvas/EmbersMode';

export default function AmbientBackground({ mode = 'shockwave' }) {
  const canvasRef = useRef(null);
  const activeModeRef = useRef(null);

  useEffect(() => {
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

    const mouse = {
      x: -1000,
      y: -1000,
      active: false
    };

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
      const activeHandler = activeModeRef.current;

      // 1. Delegate active mode state updates
      if (activeHandler && typeof activeHandler.update === 'function') {
        activeHandler.update(grid, cols, rows, ripples, width, height, DOT_SPACING);
      }

      // 2. Ripple Processing
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.currentRadius += rip.speed || 3;
        rip.strength *= rip.decay || 0.9;

        if (rip.strength < 0.01 || rip.currentRadius > (rip.maxRadius || 100)) {
          ripples.splice(i, 1);
        }
      }

      // 3. Update & Draw Grid Dots
      for (let i = 0; i < dots.length; i++) {
        dots[i].update(mouse, ripples, activeHandler, FRICTION);
        dots[i].draw(ctx, activeHandler);
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
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
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
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#07090e]">
      {/* Dynamic Ambient Backlight Orbs */}
      <div 
        className={`absolute -top-16 -left-16 w-[340px] h-[340px] sm:w-[650px] sm:h-[650px] rounded-full blur-[90px] sm:blur-[140px] animate-float-slow transition-all duration-700 ${
          mode === 'embers' 
            ? 'bg-amber-600/15 sm:bg-amber-600/20' 
            : mode === 'rain' 
            ? 'bg-cyan-600/15 sm:bg-cyan-600/20' 
            : 'bg-indigo-600/15 sm:bg-indigo-600/20'
        }`} 
      />

      <div 
        className={`absolute -bottom-16 -right-16 w-[320px] h-[320px] sm:w-[750px] sm:h-[750px] rounded-full blur-[100px] sm:blur-[150px] animate-float-reverse transition-all duration-700 ${
          mode === 'embers' 
            ? 'bg-red-600/10 sm:bg-red-600/15' 
            : mode === 'rain' 
            ? 'bg-blue-600/10 sm:bg-blue-600/15' 
            : 'bg-cyan-600/10 sm:bg-cyan-600/15'
        }`} 
      />

      <div 
        className={`hidden sm:block absolute top-[35%] left-[30%] w-[500px] h-[500px] rounded-full blur-[140px] animate-pulse-slow transition-all duration-700 ${
          mode === 'embers' ? 'bg-orange-600/15' : mode === 'rain' ? 'bg-sky-600/10' : 'bg-fuchsia-600/10'
        }`} 
      />

      {/* Interactive Dot Matrix Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-10" />

      {/* Analog Film Grain Texture */}
      <div 
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none z-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}