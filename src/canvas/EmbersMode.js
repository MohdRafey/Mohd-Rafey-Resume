export class EmbersMode {
  constructor() {
    this.sparks = [];
  }

  spawnSpark(cols, rows, customX = null, customY = null) {
    if (cols <= 0 || this.sparks.length > 75) return;

    const startCol = customX !== null ? customX : Math.random() * cols;
    const startRow = customY !== null ? customY : rows + 1 + Math.random() * 2;

    this.sparks.push({
      col: startCol,
      row: startRow,
      // Buoyant vertical ascent
      vy: -(0.40 + Math.random() * 0.35),
      // Gentle horizontal drift
      vx: (Math.random() - 0.5) * 0.25,
      // Micro-turbulence
      turbulenceFreq: 0.08 + Math.random() * 0.06,
      turbulencePhase: Math.random() * Math.PI * 2,
      // Heat & Lifespan
      initialLife: 1.0,
      life: 1.0,
      coolingRate: 0.006 + Math.random() * 0.005,
      trailLength: 2 // Compact 2-dot max trail
    });
  }

  update(grid, cols, rows) {
    // Ambient bottom spawning
    if (Math.random() < 0.55) this.spawnSpark(cols, rows);
    if (Math.random() < 0.25) this.spawnSpark(cols, rows);

    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];

      // 1. Subtle lateral turbulence
      s.vx += Math.sin(s.row * s.turbulenceFreq + s.turbulencePhase) * 0.03;
      s.vx *= 0.94; // Air resistance

      s.col += s.vx;
      s.row += s.vy;

      // 2. Altitude cooling
      const heightFactor = Math.max(0.2, s.row / rows);
      s.life -= s.coolingRate * (1.6 - heightFactor * 0.6);

      const activeCol = Math.round(s.col);
      const activeRow = Math.round(s.row);

      // 3. Compact heat trail (steeper falloff)
      for (let trail = 0; trail < s.trailLength; trail++) {
        const trRow = activeRow + trail;
        const trCol = Math.round(s.col - s.vx * trail * 0.6);

        if (grid[trCol] && grid[trCol][trRow]) {
          // Tight quadratic decay so trailing dots stay small
          const trailFalloff = Math.pow(1 - trail / s.trailLength, 2.2);
          const heat = s.life * trailFalloff;
          
          grid[trCol][trRow].emberIntensity = Math.max(
            grid[trCol][trRow].emberIntensity || 0,
            heat
          );
        }
      }

      // 4. Clean up
      if (s.row < -3 || s.life <= 0 || s.col < -4 || s.col > cols + 4) {
        this.sparks.splice(i, 1);
      }
    }
  }

  handleClick(e, ripples, width, height, cols, rows) {
    const clickCol = (e.clientX / width) * cols;
    const clickRow = (e.clientY / height) * rows;

    // Focused spark burst on click
    const burstCount = 8;
    for (let i = 0; i < burstCount; i++) {
      this.sparks.push({
        col: clickCol + (Math.random() - 0.5) * 2,
        row: clickRow + (Math.random() - 0.5) * 1.5,
        vy: -(0.55 + Math.random() * 0.5),
        vx: (Math.random() - 0.5) * 0.6,
        turbulenceFreq: 0.12,
        turbulencePhase: Math.random() * Math.PI * 2,
        initialLife: 1.0,
        life: 0.85 + Math.random() * 0.15,
        coolingRate: 0.014 + Math.random() * 0.008,
        trailLength: 2
      });
    }
  }

  applyDotPhysics(dot) {
    return {
      forceX: 0,
      forceY: 0,
      targetRadius: dot.baseRadius,
      alpha: 0.16,
      rippleIntensity: 0
    };
  }

  drawDot(ctx, dot) {
    ctx.beginPath();
    const heat = dot.emberIntensity || 0;
    
    // Tightly clamped dot footprint (max ~1.75px at absolute peak heat)
    const drawRadius = dot.currentRadius + heat * 0.75;
    ctx.arc(dot.x, dot.y, drawRadius, 0, Math.PI * 2);

    if (heat > 0.05) {
      // 1. Incandescent Center Core
      if (heat > 0.80) {
        ctx.fillStyle = `rgba(255, 253, 231, ${Math.min(1.0, 0.7 + heat * 0.3)})`;
      } 
      // 2. Molten Amber Body
      else if (heat > 0.45) {
        ctx.fillStyle = `rgba(245, 158, 11, ${0.4 + heat * 0.6})`;
      } 
      // 3. Cooling Ruby Ember
      else if (heat > 0.18) {
        ctx.fillStyle = `rgba(239, 68, 68, ${0.25 + heat * 0.65})`;
      } 
      // 4. Faint Residual Glow
      else {
        ctx.fillStyle = `rgba(185, 28, 28, ${heat * 0.9})`;
      }
    } else {
      // Resting Background Dot
      ctx.fillStyle = `rgba(226, 232, 240, ${dot.alpha})`;
    }

    ctx.fill();
  }
}