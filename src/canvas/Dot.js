export class Dot {
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
    this.emberIntensity = 0;
  }

  update(mouse, ripples, modeHandler, FRICTION) {
    let totalForceX = 0;
    let totalForceY = 0;
    let targetRadius = this.baseRadius;
    let highestAlpha = 0.16;
    let highestRippleIntensity = 0;

    // Apply active mode-specific forces and alpha adjustments
    if (modeHandler && typeof modeHandler.applyDotPhysics === 'function') {
      const result = modeHandler.applyDotPhysics(this, mouse, ripples);
      totalForceX += result.forceX || 0;
      totalForceY += result.forceY || 0;
      targetRadius = Math.max(targetRadius, result.targetRadius || this.baseRadius);
      highestAlpha = Math.max(highestAlpha, result.alpha || 0.16);
      highestRippleIntensity = Math.max(highestRippleIntensity, result.rippleIntensity || 0);
    }

    // Spring Physics Integration
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

    // Decay intensities
    this.rainIntensity *= 0.76;
    this.boltIntensity *= 0.965;
    this.emberIntensity *= 0.94;
  }

  draw(ctx, modeHandler) {
    if (modeHandler && typeof modeHandler.drawDot === 'function') {
      modeHandler.drawDot(ctx, this);
    }
  }
}