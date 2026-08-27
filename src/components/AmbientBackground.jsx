import React, { useRef, useEffect } from 'react';

export default function AmbientBackground({ mode = 'shockwave' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const DOT_SPACING = 24;
    const MOUSE_RADIUS = 120;
    const FORCE_STRENGTH = 15;
    const FRICTION = 0.74;

    const mouse = {
      x: -1000,
      y: -1000,
      active: false
    };

    let ripples = [];
    let rainDrops = [];
    let grid = [];
    let dots = [];
    let cols = 0;
    let rows = 0;

    // --- REFINED LIGHTNING STATE ---
    let lightningState = {
      active: false,
      globalAmbient: 0,
      strobeQueue: []
    };

    class Dot {
      constructor(x, y, col, row) {
        this.originX = x;
        this.originY = y;
        this.col = col;
        this.row = row;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.baseRadius = 1.0;
        this.currentRadius = 1.0;
        this.alpha = 0.16;
        this.rippleIntensity = 0;
        this.rainIntensity = 0;
        this.boltIntensity = 0;
      }

      update(currentMode) {
        let totalForceX = 0;
        let totalForceY = 0;
        let targetRadius = this.baseRadius;
        let highestAlpha = 0.16;
        let highestRippleIntensity = 0;

        if (currentMode === 'shockwave') {
          // 1. Mouse Magnetic Repulsion
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.hypot(dx, dy);

          if (distance < MOUSE_RADIUS && mouse.active) {
            const angle = Math.atan2(dy, dx);
            const ratio = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
            const force = ratio * FORCE_STRENGTH;

            totalForceX -= Math.cos(angle) * force;
            totalForceY -= Math.sin(angle) * force;

            highestAlpha = Math.max(highestAlpha, 0.16 + ratio * 0.84);
            targetRadius = Math.max(targetRadius, this.baseRadius + ratio * 1.5);
          }

          // 2. Full Shockwave
          for (let i = 0; i < ripples.length; i++) {
            const rip = ripples[i];
            const rdx = this.originX - rip.x;
            const rdy = this.originY - rip.y;
            const rdist = Math.hypot(rdx, rdy);

            const waveDist = Math.abs(rdist - rip.currentRadius);
            if (waveDist < rip.waveWidth) {
              const waveRatio = (1 - waveDist / rip.waveWidth) * rip.strength;
              const angle = Math.atan2(rdy, rdx);

              totalForceX += Math.cos(angle) * waveRatio * 22;
              totalForceY += Math.sin(angle) * waveRatio * 22;

              highestRippleIntensity = Math.max(highestRippleIntensity, waveRatio);
              highestAlpha = Math.max(highestAlpha, 0.16 + waveRatio * 0.84);
              targetRadius = Math.max(targetRadius, this.baseRadius + waveRatio * 1.8);
            }
          }
        } else if (currentMode === 'rain') {
          // Localized Micro Puddle Splashes
          for (let i = 0; i < ripples.length; i++) {
            const rip = ripples[i];
            const rdx = this.originX - rip.x;
            const rdy = this.originY - rip.y;
            const rdist = Math.hypot(rdx, rdy);

            const waveDist = Math.abs(rdist - rip.currentRadius);
            if (waveDist < rip.waveWidth) {
              const waveRatio = (1 - waveDist / rip.waveWidth) * rip.strength;
              highestRippleIntensity = Math.max(highestRippleIntensity, waveRatio);
              highestAlpha = Math.max(highestAlpha, 0.16 + waveRatio * 0.50);
            }
          }
        }

        // Spring Integration
        const targetX = this.originX + totalForceX;
        const targetY = this.originY + totalForceY;

        this.vx += (targetX - this.x) * 0.16;
        this.vy += (targetY - this.y) * 0.16;
        this.vx *= FRICTION;
        this.vy *= FRICTION;

        this.x += this.vx;
        this.y += this.vy;

        this.alpha += (highestAlpha - this.alpha) * 0.14;
        this.currentRadius += (targetRadius - this.currentRadius) * 0.14;
        this.rippleIntensity += (highestRippleIntensity - this.rippleIntensity) * 0.16;
        this.rainIntensity *= 0.72;

        // ~1-second natural logarithmic decay for lightning branches
        this.boltIntensity *= 0.965;
      }

      draw(currentMode) {
        ctx.beginPath();
        const lightningRadiusBoost = this.boltIntensity * 1.2 + lightningState.globalAmbient * 0.25;
        const drawRadius = this.currentRadius + this.rainIntensity * 1.1 + lightningRadiusBoost;
        ctx.arc(this.x, this.y, drawRadius, 0, Math.PI * 2);

        if (currentMode === 'rain') {
          // 1. Rain Drops
          if (this.rainIntensity > 0.05) {
            if (this.rainIntensity > 0.65) {
              ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + this.rainIntensity * 0.4})`;
            } else {
              ctx.fillStyle = `rgba(56, 189, 248, ${0.3 + this.rainIntensity * 0.7})`;
            }
          }
          // 2. Core Lightning Filaments
          else if (this.boltIntensity > 0.40) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, 0.75 + this.boltIntensity * 0.25)})`;
          } 
          // 3. Ionized Glow Along Branch Edges
          else if (this.boltIntensity > 0.08) {
            ctx.fillStyle = `rgba(186, 230, 253, ${0.25 + this.boltIntensity * 0.65})`;
          } 
          // 4. Soft Ambient Atmospheric Ease-Down
          else if (lightningState.globalAmbient > 0.02) {
            const ambientAlpha = Math.min(0.70, this.alpha + lightningState.globalAmbient * 0.55);
            ctx.fillStyle = `rgba(147, 197, 253, ${ambientAlpha})`;
          }
          // 5. Floor Splashes
          else if (this.rippleIntensity > 0.08) {
            ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
          } 
          // 6. Resting Dot
          else {
            ctx.fillStyle = `rgba(226, 232, 240, ${this.alpha})`;
          }
        } else {
          // Shockwave Mode
          if (this.rippleIntensity > 0.08) {
            ctx.fillStyle = `rgba(251, 191, 36, ${this.alpha})`;
          } else if (this.alpha > 0.24) {
            ctx.fillStyle = `rgba(165, 180, 252, ${this.alpha})`;
          } else {
            ctx.fillStyle = `rgba(226, 232, 240, ${this.alpha})`;
          }
        }

        ctx.fill();
      }
    }

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

    // Spawn diagonal rain drops
    const spawnRainDrop = () => {
      if (cols <= 0) return;
      if (rainDrops.length > 55) return;

      const startCol = Math.floor(Math.random() * (cols + 15)) - 10;
      rainDrops.push({
        col: startCol,
        row: 0,
        speed: 0.95 + Math.random() * 0.65,
        driftX: 0.42 + Math.random() * 0.12,
        length: 2,
        maxRow: rows
      });
    };

    // --- PROCEDURAL MULTI-BRANCH LIGHTNING ENGINE ---
    const generateLightningStrike = () => {
      if (cols <= 0) return;

      let currentC = Math.floor(Math.random() * (cols - 14)) + 7;
      let boltPath = [];

      // 1. Primary Trunk
      for (let r = 0; r <= rows; r++) {
        const jitter = (Math.random() - 0.48) * 2.5;
        currentC = Math.max(0, Math.min(cols, currentC + jitter));
        boltPath.push({ c: currentC, r: r, weight: 1.0 });

        // 2. Primary Lateral Forks
        if (r > rows * 0.2 && r < rows * 0.85 && Math.random() < 0.38) {
          let branchC = currentC;
          const branchDir = Math.random() < 0.5 ? -1 : 1;
          const branchLength = Math.floor(Math.random() * 6) + 4;

          for (let br = r; br <= Math.min(rows, r + branchLength); br++) {
            branchC += (Math.random() * 1.3 + 0.7) * branchDir;
            boltPath.push({ c: branchC, r: br, weight: 0.75 });

            // 3. Secondary Twig Offshoots
            if (br === r + 2 && Math.random() < 0.45) {
              let twigC = branchC;
              const twigDir = branchDir * (Math.random() < 0.3 ? -1 : 1);
              for (let tr = br; tr <= Math.min(rows, br + 3); tr++) {
                twigC += (Math.random() * 1.1 + 0.4) * twigDir;
                boltPath.push({ c: twigC, r: tr, weight: 0.5 });
              }
            }
          }
        }
      }

      // Apply Energy Field to Dot Grid
      const INFLUENCE_RADIUS = 1.7;
      for (let p of boltPath) {
        const centerC = Math.round(p.c);
        const centerR = p.r;

        for (let dc = -2; dc <= 2; dc++) {
          for (let dr = -1; dr <= 1; dr++) {
            const targetC = centerC + dc;
            const targetR = centerR + dr;

            if (grid[targetC] && grid[targetC][targetR]) {
              const dist = Math.hypot(dc, dr);
              if (dist <= INFLUENCE_RADIUS) {
                const intensity = (1 - dist / INFLUENCE_RADIUS) * p.weight;
                grid[targetC][targetR].boltIntensity = Math.max(grid[targetC][targetR].boltIntensity, intensity);
              }
            }
          }
        }
      }

      // Multi-stroke strobe ignition sequence
      lightningState.strobeQueue = [1.0, 0.2, 0.85, 0.3, 0.65];
      lightningState.globalAmbient = 0.7;
      lightningState.active = true;
    };

    // Main render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Digital Rain & Realistic Thunder
      if (mode === 'rain') {
        if (Math.random() < 0.65) spawnRainDrop();
        if (Math.random() < 0.35) spawnRainDrop();

        // Natural thunder strike trigger (~every 7 to 10s)
        if (Math.random() < 0.0025 && !lightningState.active) {
          generateLightningStrike();
        }

        // Process lightning sequence with matched 1-second ease
        if (lightningState.active) {
          if (lightningState.strobeQueue.length > 0) {
            lightningState.globalAmbient = lightningState.strobeQueue.shift();
          } else {
            lightningState.globalAmbient *= 0.95;
            if (lightningState.globalAmbient < 0.01) {
              lightningState.globalAmbient = 0;
              lightningState.active = false;
            }
          }
        }

        // Advance rain drops
        for (let i = rainDrops.length - 1; i >= 0; i--) {
          const drop = rainDrops[i];
          drop.row += drop.speed;
          drop.col += drop.speed * drop.driftX;

          const activeColIdx = Math.floor(drop.col);
          const activeRowIdx = Math.floor(drop.row);

          for (let step = 0; step < drop.length; step++) {
            const r = activeRowIdx - step;
            const c = Math.floor(drop.col - step * drop.driftX);

            if (grid[c] && grid[c][r]) {
              const intensity = step === 0 ? 1.0 : 0.65;
              grid[c][r].rainIntensity = Math.max(grid[c][r].rainIntensity, intensity);
            }
          }

          // Splash on floor
          if (activeRowIdx >= drop.maxRow || activeColIdx > cols + 5) {
            const splashX = (width - cols * DOT_SPACING) / 2 + activeColIdx * DOT_SPACING;
            const splashY = (height - rows * DOT_SPACING) / 2 + drop.maxRow * DOT_SPACING;

            if (activeColIdx >= 0 && activeColIdx <= cols) {
              ripples.push({
                x: splashX,
                y: splashY,
                currentRadius: 2,
                maxRadius: 20,
                speed: 3,
                waveWidth: 8,
                strength: 0.35,
                decay: 0.88
              });
            }

            rainDrops.splice(i, 1);
          }
        }
      }

      // 2. Ripple Processing
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.currentRadius += rip.speed;
        rip.strength *= rip.decay;

        if (rip.strength < 0.01 || rip.currentRadius > rip.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // 3. Fast Render Pass
      for (let i = 0; i < dots.length; i++) {
        dots[i].update(mode);
        dots[i].draw(mode);
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
      if (mode === 'shockwave') {
        const maxScreenDist = Math.hypot(width, height);
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          currentRadius: 5,
          maxRadius: maxScreenDist,
          speed: 16,
          waveWidth: 90,
          strength: 1.0,
          decay: 0.985
        });
      } else if (mode === 'rain') {
        generateLightningStrike();
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
  }, [mode]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#07090e]">
      {/* Background Atmosphere Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[650px] h-[650px] rounded-full bg-indigo-600/20 blur-[140px] animate-float-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[750px] h-[750px] rounded-full bg-cyan-600/15 blur-[150px] animate-float-reverse" />
      <div className="absolute top-[35%] left-[30%] w-[500px] h-[500px] rounded-full bg-fuchsia-600/10 blur-[140px] animate-pulse-slow" />

      {/* Lightning & Dot Matrix Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Analog Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}