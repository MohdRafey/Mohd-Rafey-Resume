export class ShockwaveMode {
  constructor() {
    this.MOUSE_RADIUS = 120;
    this.FORCE_STRENGTH = 15;
  }

  update() {
    // Shockwave mode relies on mouse and ripple events
  }

  handleClick(e, ripples, width, height) {
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
  }

  applyDotPhysics(dot, mouse, ripples) {
    let forceX = 0;
    let forceY = 0;
    let targetRadius = dot.baseRadius;
    let alpha = 0.16;
    let rippleIntensity = 0;

    // 1. Mouse Magnetic Repulsion
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

    // 2. Amber Shockwaves
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

  drawDot(ctx, dot) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);

    if (dot.rippleIntensity > 0.08) {
      ctx.fillStyle = `rgba(251, 191, 36, ${dot.alpha})`;
    } else if (dot.alpha > 0.24) {
      ctx.fillStyle = `rgba(165, 180, 252, ${dot.alpha})`;
    } else {
      ctx.fillStyle = `rgba(226, 232, 240, ${dot.alpha})`;
    }

    ctx.fill();
  }
}