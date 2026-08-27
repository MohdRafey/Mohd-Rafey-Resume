export class RainMode {
  constructor() {
    this.rainDrops = [];
    this.lightningState = {
      active: false,
      globalAmbient: 0,
      strobeQueue: []
    };
  }

  spawnRainDrop(cols, rows) {
    if (cols <= 0 || this.rainDrops.length > 40) return;
    const startCol = Math.floor(Math.random() * (cols + 15)) - 10;
    this.rainDrops.push({
      col: startCol,
      row: 0,
      // Slower, gentler fall speed (reduced from 0.60–0.95 to 0.24–0.38)
      speed: 0.24 + Math.random() * 0.14,
      driftX: 0.38 + Math.random() * 0.10,
      length: 2,
      maxRow: rows
    });
  }

  generateLightningStrike(grid, cols, rows) {
    if (cols <= 0) return;

    let currentC = Math.floor(Math.random() * (cols - 14)) + 7;
    let boltPath = [];

    // Primary Trunk
    for (let r = 0; r <= rows; r++) {
      const jitter = (Math.random() - 0.48) * 2.5;
      currentC = Math.max(0, Math.min(cols, currentC + jitter));
      boltPath.push({ c: currentC, r: r, weight: 1.0 });

      // Lateral Forks
      if (r > rows * 0.2 && r < rows * 0.85 && Math.random() < 0.38) {
        let branchC = currentC;
        const branchDir = Math.random() < 0.5 ? -1 : 1;
        const branchLength = Math.floor(Math.random() * 6) + 4;

        for (let br = r; br <= Math.min(rows, r + branchLength); br++) {
          branchC += (Math.random() * 1.3 + 0.7) * branchDir;
          boltPath.push({ c: branchC, r: br, weight: 0.75 });

          // Secondary Twigs
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
              grid[targetC][targetR].boltIntensity = Math.max(
                grid[targetC][targetR].boltIntensity || 0,
                intensity
              );
            }
          }
        }
      }
    }

    this.lightningState.strobeQueue = [1.0, 0.2, 0.85, 0.3, 0.65];
    this.lightningState.globalAmbient = 0.7;
    this.lightningState.active = true;
  }

  update(grid, cols, rows, ripples, width, height, DOT_SPACING) {
    // Calmed spawn probability to match the slower drift
    if (Math.random() < 0.25) this.spawnRainDrop(cols, rows);
    if (Math.random() < 0.12) this.spawnRainDrop(cols, rows);

    // Natural thunder strike trigger
    if (Math.random() < 0.0022 && !this.lightningState.active) {
      this.generateLightningStrike(grid, cols, rows);
    }

    // Process lightning dissipation
    if (this.lightningState.active) {
      if (this.lightningState.strobeQueue.length > 0) {
        this.lightningState.globalAmbient = this.lightningState.strobeQueue.shift();
      } else {
        this.lightningState.globalAmbient *= 0.95;
        if (this.lightningState.globalAmbient < 0.01) {
          this.lightningState.globalAmbient = 0;
          this.lightningState.active = false;
        }
      }
    }

    // Advance rain drops
    for (let i = this.rainDrops.length - 1; i >= 0; i--) {
      const drop = this.rainDrops[i];
      drop.row += drop.speed;
      drop.col += drop.speed * drop.driftX;

      const activeColIdx = Math.floor(drop.col);
      const activeRowIdx = Math.floor(drop.row);

      for (let step = 0; step < drop.length; step++) {
        const r = activeRowIdx - step;
        const c = Math.floor(drop.col - step * drop.driftX);

        if (grid[c] && grid[c][r]) {
          const intensity = step === 0 ? 1.0 : 0.65;
          grid[c][r].rainIntensity = Math.max(grid[c][r].rainIntensity || 0, intensity);
        }
      }

      // Splash on hitting the floor
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

        this.rainDrops.splice(i, 1);
      }
    }
  }

  handleClick() {
    // Non-reactive (no user click triggers)
  }

  applyDotPhysics(dot, mouse, ripples) {
    let alpha = 0.16;
    let rippleIntensity = 0;

    for (let i = 0; i < ripples.length; i++) {
      const rip = ripples[i];
      const rdx = dot.originX - rip.x;
      const rdy = dot.originY - rip.y;
      const rdist = Math.hypot(rdx, rdy);

      const waveDist = Math.abs(rdist - rip.currentRadius);
      const waveWidth = rip.waveWidth || 8;
      if (waveDist < waveWidth && rdist > 0) {
        const waveRatio = (1 - waveDist / waveWidth) * rip.strength;
        rippleIntensity = Math.max(rippleIntensity, waveRatio);
        alpha = Math.max(alpha, 0.16 + waveRatio * 0.50);
      }
    }

    return { forceX: 0, forceY: 0, targetRadius: dot.baseRadius, alpha, rippleIntensity };
  }

  drawDot(ctx, dot) {
    ctx.beginPath();
    const lightningRadiusBoost = (dot.boltIntensity || 0) * 1.2 + (this.lightningState.globalAmbient || 0) * 0.25;
    const drawRadius = (dot.currentRadius || dot.baseRadius) + (dot.rainIntensity || 0) * 1.1 + lightningRadiusBoost;
    ctx.arc(dot.x, dot.y, Math.max(0.1, drawRadius), 0, Math.PI * 2);

    if (dot.rainIntensity > 0.05) {
      if (dot.rainIntensity > 0.65) {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + dot.rainIntensity * 0.4})`;
      } else {
        ctx.fillStyle = `rgba(56, 189, 248, ${0.3 + dot.rainIntensity * 0.7})`;
      }
    } else if (dot.boltIntensity > 0.40) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, 0.75 + dot.boltIntensity * 0.25)})`;
    } else if (dot.boltIntensity > 0.08) {
      ctx.fillStyle = `rgba(186, 230, 253, ${0.25 + dot.boltIntensity * 0.65})`;
    } else if (this.lightningState.globalAmbient > 0.02) {
      const ambientAlpha = Math.min(0.70, (dot.alpha || 0.16) + this.lightningState.globalAmbient * 0.55);
      ctx.fillStyle = `rgba(147, 197, 253, ${ambientAlpha})`;
    } else if (dot.rippleIntensity > 0.08) {
      ctx.fillStyle = `rgba(56, 189, 248, ${dot.alpha || 0.16})`;
    } else {
      ctx.fillStyle = `rgba(226, 232, 240, ${dot.alpha || 0.16})`;
    }

    ctx.fill();
  }
}