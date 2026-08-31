// Inside src/canvas/ShockwaveMode.js
import { GridDigitalClock } from './GridDigitalClock';

export class ShockwaveMode {
  constructor() {
    this.MOUSE_RADIUS = 130;
    this.FORCE_STRENGTH = 16;
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
      speed: 16,
      waveWidth: 95,
      strength: 1.0,
      decay: 0.985
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
        const waveRatio = (1 - waveDist / rip.waveWidth) * rip.strength;
        const angle = Math.atan2(rdy, rdx);

        forceX += Math.cos(angle) * waveRatio * 22;
        forceY += Math.sin(angle) * waveRatio * 22;

        rippleIntensity = Math.max(rippleIntensity, waveRatio);
        alpha = Math.max(alpha, 0.16 + waveRatio * 0.84);
        targetRadius = Math.max(targetRadius, dot.baseRadius + waveRatio * 1.8);
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
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
      } else if (dot.rippleIntensity > 0.08) {
        ctx.fillStyle = `rgba(79, 70, 229, ${dot.alpha})`;
      } else if (dot.alpha > 0.24) {
        ctx.fillStyle = `rgba(99, 102, 241, ${dot.alpha})`;
      } else {
        ctx.fillStyle = `rgba(148, 163, 184, ${dot.alpha})`;
      }
    } else {
      if (dot.isClockVertex) {
        ctx.fillStyle = 'rgba(248, 250, 252, 0.95)';
      } else if (dot.rippleIntensity > 0.08) {
        ctx.fillStyle = `rgba(245, 158, 11, ${dot.alpha})`;
      } else if (dot.alpha > 0.24) {
        ctx.fillStyle = `rgba(165, 180, 252, ${dot.alpha})`;
      } else {
        ctx.fillStyle = `rgba(226, 232, 240, ${dot.alpha})`;
      }
    }

    ctx.fill();
  }
}