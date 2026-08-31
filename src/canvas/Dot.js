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
    
    // Clock-specific attributes
    this.isClockVertex = false;
    this.clockAlpha = 0;
    this.clockRadiusBoost = 0;
  }

  // Method called by GridDigitalClock to illuminate this vertex
  setClockVertex(alpha = 0.9, radiusBoost = 0.8) {
    this.isClockVertex = true;
    this.clockAlpha = Math.max(this.clockAlpha, alpha);
    this.clockRadiusBoost = Math.max(this.clockRadiusBoost, radiusBoost);
  }

update(mouse, ripples, modeHandler, FRICTION) {
    let totalForceX = 0;
    let totalForceY = 0;
    let targetRadius = this.baseRadius;
    let highestAlpha = 0.16;
    let highestRippleIntensity = 0;

    // 1. Boost baseline alpha and radius if flagged as an active clock dot
    if (this.isClockVertex) {
      highestAlpha = Math.max(highestAlpha, this.clockAlpha || 0.85);
      targetRadius = Math.max(targetRadius, this.baseRadius + (this.clockRadiusBoost || 0.8));
    }

    // 2. Apply active mode physics
    if (modeHandler && typeof modeHandler.applyDotPhysics === 'function') {
      const result = modeHandler.applyDotPhysics(this, mouse, ripples);
      totalForceX += result.forceX || 0;
      totalForceY += result.forceY || 0;
      targetRadius = Math.max(targetRadius, result.targetRadius || this.baseRadius);
      highestAlpha = Math.max(highestAlpha, result.alpha || 0.16);
      highestRippleIntensity = Math.max(highestRippleIntensity, result.rippleIntensity || 0);
    }

    // 3. Spring Physics
    const targetX = this.originX + totalForceX;
    const targetY = this.originY + totalForceY;

    this.vx += (targetX - this.x) * 0.16;
    this.vy += (targetY - this.y) * 0.16;
    this.vx *= FRICTION;
    this.vy *= FRICTION;

    this.x += this.vx;
    this.y += this.vy;

    // 4. Smooth property interpolation
    this.alpha += (highestAlpha - this.alpha) * 0.14;
    this.currentRadius += (targetRadius - this.currentRadius) * 0.14;
    this.rippleIntensity += (highestRippleIntensity - this.rippleIntensity) * 0.16;

    // 5. Decay intensities
    this.rainIntensity *= 0.76;
    this.boltIntensity *= 0.965;
    this.emberIntensity *= 0.94;

    // NOTE: DO NOT reset this.isClockVertex here! 
    // It will be reset at the start of the next frame before drawGridLines() runs.
  }

  draw(ctx, modeHandler) {
    if (modeHandler && typeof modeHandler.drawDot === 'function') {
      modeHandler.drawDot(ctx, this);
    }
  }
}