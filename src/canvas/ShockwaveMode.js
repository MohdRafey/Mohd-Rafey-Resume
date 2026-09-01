// Inside src/canvas/ShockwaveMode.js
import { GridDigitalClock } from './GridDigitalClock';

export class ShockwaveMode {
  constructor() {
    this.MOUSE_RADIUS = 130;
    this.FORCE_STRENGTH = 18;
    this.clock = new GridDigitalClock({ digitGap: 1, rowGap: 1 });
  }

  update() {
    // Mode lifecycle loop
  }

  handleClick(e, ripples, width, height) {
    const maxScreenDist = Math.hypot(width, height);
    ripples.push({
      x: e.clientX,
      y: e.clientY,
      currentRadius: 5,
      maxRadius: maxScreenDist,
      speed: 12,
      waveWidth: 110,           // Wider wave front for a bolder ridge
      strength: 1.0,
      decay: 0.992              // Slower energy decay (less falloff over distance)
    });
  }

  applyDotPhysics(dot, mouse, ripples) {
    let forceX = 0;
    let forceY = 0;
    let targetRadius = dot.baseRadius;
    let alpha = 0.16;
    let rippleIntensity = 0;

    const dx = mouse.x - dot.x;
    const dy = mouse.y - dot.y;
    const distance = Math.hypot(dx, dy);

    if (distance < this.MOUSE_RADIUS && mouse.active) {
      const angle = Math.atan2(dy, dx);
      const ratio = (this.MOUSE_RADIUS - distance) / this.MOUSE_RADIUS;
      const force = ratio * this.FORCE_STRENGTH;

      forceX -= Math.cos(angle) * force;
      forceY -= Math.sin(angle) * force;

      alpha = Math.max(alpha, 0.16 + ratio * 0.84);
      targetRadius = Math.max(targetRadius, dot.baseRadius + ratio * 1.5);
    }

    for (let i = 0; i < ripples.length; i++) {
      const rip = ripples[i];
      const rdx = dot.originX - rip.x;
      const rdy = dot.originY - rip.y;
      const rdist = Math.hypot(rdx, rdy);

      const waveDist = Math.abs(rdist - rip.currentRadius);
      if (waveDist < rip.waveWidth) {
        // Cosine curve gives a sharper, punchier peak crest
        const linearRatio = (1 - waveDist / rip.waveWidth);
        const waveRatio = Math.sin(linearRatio * Math.PI * 0.5) * rip.strength;
        const angle = Math.atan2(rdy, rdx);

        // Stronger wave push
        forceX += Math.cos(angle) * waveRatio * 28;
        forceY += Math.sin(angle) * waveRatio * 28;

        rippleIntensity = Math.max(rippleIntensity, waveRatio);
        
        // Sustained high brightness along the wave
        alpha = Math.max(alpha, 0.16 + waveRatio * 0.84);
        targetRadius = Math.max(targetRadius, dot.baseRadius + waveRatio * 2.6);
      }
    }

    return { forceX, forceY, targetRadius, alpha, rippleIntensity };
  }

  drawGridLines(ctx, dots2D, ripples, isLight) {
    // Skip entirely below 1440px
    if (window.innerWidth < 1440) {
      this.clock.draw(ctx, dots2D, ripples, isLight);
      return;
    }

    const introEl = 
      document.querySelector('.intro-glass-panel') ||
      document.querySelector('#intro-panel') ||
      document.querySelector('.hero-card') ||
      document.querySelector('.ios-glass-panel');

    const panelRect = introEl ? introEl.getBoundingClientRect() : null;
    const maxCols = dots2D?.length || 80;
    const maxRows = dots2D?.[0]?.length || 50;

    this.clock.alignToPanel(panelRect, 24, maxCols, maxRows);
    this.clock.draw(ctx, dots2D, ripples, isLight);
  }

  drawDot(ctx, dot, isLight = false) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);

    if (isLight) {
      if (dot.isClockVertex) {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.95)';
      } else if (dot.rippleIntensity > 0.05) {
        ctx.fillStyle = `rgba(79, 70, 229, ${Math.min(1.0, dot.alpha * 1.15)})`;
      } else if (dot.alpha > 0.24) {
        ctx.fillStyle = `rgba(99, 102, 241, ${dot.alpha})`;
      } else {
        ctx.fillStyle = `rgba(148, 163, 184, ${dot.alpha})`;
      }
    } else {
      if (dot.isClockVertex) {
        ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
      } else if (dot.rippleIntensity > 0.55) {
        // High-energy wave crest: radiant white-amber glow
        ctx.fillStyle = `rgba(255, 243, 199, ${Math.min(1.0, dot.alpha + 0.15)})`;
      } else if (dot.rippleIntensity > 0.18) {
        // Mid-wave: vivid amber-gold
        ctx.fillStyle = `rgba(251, 191, 36, ${dot.alpha})`;
      } else if (dot.rippleIntensity > 0.04) {
        // Outer wave fringe: electric purple/indigo before ambient fade
        ctx.fillStyle = `rgba(167, 139, 250, ${dot.alpha * 0.9})`;
      } else if (dot.alpha > 0.24) {
        ctx.fillStyle = `rgba(165, 180, 252, ${dot.alpha})`;
      } else {
        ctx.fillStyle = `rgba(226, 232, 240, ${dot.alpha})`;
      }
    }

    ctx.fill();
  }
}