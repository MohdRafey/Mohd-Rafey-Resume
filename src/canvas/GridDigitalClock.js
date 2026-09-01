// src/canvas/GridDigitalClock.js

const SEGMENTS = {
  A: [[0, 0], [1, 0]], // Top horizontal
  B: [[1, 0], [1, 1]], // Top-right vertical
  C: [[1, 1], [1, 2]], // Bottom-right vertical
  D: [[0, 2], [1, 2]], // Bottom horizontal
  E: [[0, 1], [0, 2]], // Bottom-left vertical
  F: [[0, 0], [0, 1]], // Top-left vertical
  G: [[0, 1], [1, 1]], // Middle horizontal
};

const DIGIT_SEGMENTS = {
  '0': ['A', 'B', 'C', 'D', 'E', 'F'],
  '1': ['B', 'C'],
  '2': ['A', 'B', 'G', 'E', 'D'],
  '3': ['A', 'B', 'G', 'C', 'D'],
  '4': ['F', 'G', 'B', 'C'],
  '5': ['A', 'F', 'G', 'C', 'D'],
  '6': ['A', 'F', 'E', 'D', 'C', 'G'],
  '7': ['A', 'B', 'C'],
  '8': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  '9': ['A', 'B', 'C', 'D', 'F', 'G'],
};

export class GridDigitalClock {
  constructor({ digitGap = 1, rowGap = 1 } = {}) {
    this.digitGap = digitGap;
    this.rowGap = rowGap;
    this.startCol = 4;
    this.startRow = 5;
    
    this.activeDots = new Set();
    this.segmentStateMap = new Map();
    this.scatteredShards = [];
    
    // States: 'INITIAL_FLICKER' | 'IDLE' | 'SHATTERED' | 'RE_FLICKER' | 'RESIZING_COOLDOWN'
    this.state = 'INITIAL_FLICKER';
    this.stateStartTime = performance.now();
    this.lastResizeTime = 0;

    // Window resize listener
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleWindowResize.bind(this));
    }
  }

  handleWindowResize() {
    this.lastResizeTime = performance.now();
    this.state = 'RESIZING_COOLDOWN';
    // Instantly wipe references to prevent visual tearing
    this.segmentStateMap.clear();
    this.scatteredShards = [];
    for (const dot of this.activeDots) {
      dot.isClockVertex = false;
      dot.clockAlpha = 0;
      dot.clockRadiusBoost = 0;
    }
    this.activeDots.clear();
  }

  alignToPanel(panelRect, gridSpacing = 24, maxCols = 80, maxRows = 50) {
    if (window.innerWidth < 1440) return;

    if (panelRect && panelRect.width > 0) {
      const panelRightCol = Math.floor(panelRect.right / gridSpacing);
      const targetCol = panelRightCol + 2;
      this.startCol = Math.max(1, Math.min(maxCols - 19, targetCol));
      this.startRow = 5;
    } else {
      this.startCol = Math.max(2, maxCols - 10);
      this.startRow = 5;
    }
  }

  getTimePairs() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    return [h, m, s];
  }

  computeNeonFlicker(elapsed) {
    if (elapsed < 200) return 0;
    if (elapsed < 350) return Math.random() > 0.4 ? 0.7 : 0.05;
    if (elapsed < 500) return 0.05;
    if (elapsed < 750) return Math.random() > 0.3 ? 0.85 : 0.1;
    if (elapsed < 900) return 0.2;
    if (elapsed < 1400) return 0.5 + Math.sin(elapsed * 0.03) * 0.3;
    if (elapsed < 2000) return Math.min(1, 0.7 + (elapsed - 1400) / 600 * 0.3);
    return 1;
  }

  getActiveSegments(dots2D, maxCols, maxRows, GAP_PADDING) {
    const pairs = this.getTimePairs();
    const segments = [];
    let currentRow = this.startRow;

    for (let p = 0; p < pairs.length; p++) {
      const pairStr = pairs[p];
      let currentCol = this.startCol;

      for (let d = 0; d < pairStr.length; d++) {
        const char = pairStr[d];
        const activeSegments = DIGIT_SEGMENTS[char] || [];

        for (const segKey of activeSegments) {
          const [[c1, r1], [c2, r2]] = SEGMENTS[segKey];
          const colA = currentCol + c1;
          const rowA = currentRow + r1;
          const colB = currentCol + c2;
          const rowB = currentRow + r2;

          if (colA < maxCols && rowA < maxRows && colB < maxCols && rowB < maxRows) {
            const dotA = dots2D[colA]?.[rowA];
            const dotB = dots2D[colB]?.[rowB];

            if (dotA && dotB) {
              const segId = `${colA}_${rowA}_${colB}_${rowB}`;
              const midX = (dotA.x + dotB.x) / 2;
              const midY = (dotA.y + dotB.y) / 2;
              const angle = Math.atan2(dotB.y - dotA.y, dotB.x - dotA.x);
              const dist = Math.hypot(dotB.x - dotA.x, dotB.y - dotA.y);
              const halfLen = Math.max(0, (dist - GAP_PADDING * 2) / 2);

              segments.push({
                segId,
                dotA,
                dotB,
                colA,
                rowA,
                colB,
                rowB,
                midX,
                midY,
                angle,
                halfLen
              });
            }
          }
        }
        currentCol += 1 + this.digitGap;
      }
      currentRow += 2 + this.rowGap;
    }

    return segments;
  }

  draw(ctx, dots2D, ripples = [], isLight = false) {
    // 1. Reset vertex dots on every frame
    for (const dot of this.activeDots) {
      dot.isClockVertex = false;
      dot.clockAlpha = 0;
      dot.clockRadiusBoost = 0;
    }
    this.activeDots.clear();

    // 2. Hide below 1440px
    if (window.innerWidth < 1440) {
      this.segmentStateMap.clear();
      this.scatteredShards = [];
      return;
    }

    if (!dots2D || !dots2D.length || !dots2D[0]) return;

    const now = performance.now();

    // 3. Handle resize debounce: wait 5000ms after last resize before glitching back
    if (this.state === 'RESIZING_COOLDOWN') {
      if (now - this.lastResizeTime > 3000) {
        this.state = 'RE_FLICKER';
        this.stateStartTime = now;
      } else {
        return; // Stay completely invisible during resizing & calm duration
      }
    }

    const elapsedInState = now - this.stateStartTime;
    const maxCols = dots2D.length;
    const maxRows = dots2D[0].length;
    const GAP_PADDING = 6.5;

    ctx.save();
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 0;

    // 4. Update and render floating shards
    if (this.scatteredShards.length > 0) {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      for (let i = this.scatteredShards.length - 1; i >= 0; i--) {
        const s = this.scatteredShards[i];
        const shardAge = now - s.spawnTime;

        const drag = shardAge > 450 ? 0.92 : 0.975;
        s.vx *= drag;
        s.vy *= drag;
        s.vAngle *= 0.96;

        s.x += s.vx;
        s.y += s.vy;
        s.angle += s.vAngle;

        if (s.x < 10 || s.x > screenW - 10) s.vx *= -0.6;
        if (s.y < 10 || s.y > screenH - 10) s.vy *= -0.6;

        s.alpha = Math.max(0, 0.55 * (1 - shardAge / 2600));

        if (s.alpha <= 0.01 || shardAge > 2800) {
          this.scatteredShards.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        ctx.strokeStyle = isLight
          ? `rgba(100, 116, 139, ${s.alpha * 0.8})`
          : `rgba(203, 213, 225, ${s.alpha})`;

        ctx.beginPath();
        ctx.moveTo(-s.halfLen, 0);
        ctx.lineTo(s.halfLen, 0);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 5. State transitions
    if (this.state === 'INITIAL_FLICKER') {
      if (elapsedInState > 2000) {
        this.state = 'IDLE';
        this.stateStartTime = now;
      }
    } else if (this.state === 'SHATTERED') {
      if (elapsedInState > 2500) {
        this.state = 'RE_FLICKER';
        this.stateStartTime = now;
      }
      ctx.restore();
      return;
    } else if (this.state === 'RE_FLICKER') {
      if (elapsedInState > 1400) {
        this.state = 'IDLE';
        this.stateStartTime = now;
      }
    }

    let globalFlickerAlpha = 1.0;
    if (this.state === 'INITIAL_FLICKER' || this.state === 'RE_FLICKER') {
      globalFlickerAlpha = this.computeNeonFlicker(elapsedInState);
      if (globalFlickerAlpha <= 0.02) {
        ctx.restore();
        return;
      }
    }

    const ambientPulse = 0.50 + Math.sin(now * 0.002) * 0.05;

    // 6. Segments & wave collision
    const activeSegmentsList = this.getActiveSegments(dots2D, maxCols, maxRows, GAP_PADDING);
    const currentActiveSegKeys = new Set();
    let waveHitTrigger = null;

    if (this.state === 'IDLE' && ripples && ripples.length > 0) {
      for (let i = 0; i < activeSegmentsList.length; i++) {
        const seg = activeSegmentsList[i];
        for (let r = 0; r < ripples.length; r++) {
          const rip = ripples[r];
          const distToOrigin = Math.hypot(seg.midX - rip.x, seg.midY - rip.y);
          const waveDist = Math.abs(distToOrigin - rip.currentRadius);

          if (waveDist < (rip.waveWidth || 95) * 0.75 && rip.strength > 0.08) {
            waveHitTrigger = rip;
            break;
          }
        }
        if (waveHitTrigger) break;
      }
    }

    if (waveHitTrigger) {
      for (let i = 0; i < activeSegmentsList.length; i++) {
        const seg = activeSegmentsList[i];
        const rdx = seg.midX - waveHitTrigger.x;
        const rdy = seg.midY - waveHitTrigger.y;
        const angle = Math.atan2(rdy, rdx) + (Math.random() - 0.5) * 0.35;
        const blastSpeed = 2.5 + Math.random() * 2.0;

        this.scatteredShards.push({
          x: seg.midX,
          y: seg.midY,
          vx: Math.cos(angle) * blastSpeed,
          vy: Math.sin(angle) * blastSpeed,
          angle: seg.angle,
          vAngle: (Math.random() - 0.5) * 0.08,
          halfLen: seg.halfLen,
          alpha: 0.55,
          spawnTime: now
        });
      }

      this.state = 'SHATTERED';
      this.stateStartTime = now;
      this.segmentStateMap.clear();
      ctx.restore();
      return;
    }

    // 7. Render segments
    for (let i = 0; i < activeSegmentsList.length; i++) {
      const seg = activeSegmentsList[i];
      currentActiveSegKeys.add(seg.segId);

      if (!this.segmentStateMap.has(seg.segId)) {
        this.segmentStateMap.set(seg.segId, {
          fadeStartTime: now,
          state: 'FADING_IN',
          colA: seg.colA,
          rowA: seg.rowA,
          colB: seg.colB,
          rowB: seg.rowB,
          dotA: seg.dotA,
          dotB: seg.dotB,
          midX: seg.midX,
          midY: seg.midY,
          halfLen: seg.halfLen
        });
      } else {
        const cached = this.segmentStateMap.get(seg.segId);
        if (cached.state === 'FADING_OUT') {
          cached.state = 'FADING_IN';
          cached.fadeStartTime = now;
        }
      }
    }

    for (const [segId, cached] of this.segmentStateMap.entries()) {
      if (!currentActiveSegKeys.has(segId) && cached.state === 'FADING_IN') {
        cached.state = 'FADING_OUT';
        cached.fadeStartTime = now;
      }
    }

    for (const [segId, cached] of this.segmentStateMap.entries()) {
      const dotA = cached.dotA || dots2D[cached.colA]?.[cached.rowA];
      const dotB = cached.dotB || dots2D[cached.colB]?.[cached.rowB];
      if (!dotA || !dotB) continue;

      const elapsed = now - cached.fadeStartTime;
      let alphaRatio = 1.0;

      if (cached.state === 'FADING_IN') {
        alphaRatio = Math.min(1, elapsed / 300);
      } else if (cached.state === 'FADING_OUT') {
        alphaRatio = Math.max(0, 1 - elapsed / 300);
        if (alphaRatio <= 0.01) {
          this.segmentStateMap.delete(segId);
          continue;
        }
      }

      const finalAlpha = (isLight ? 0.45 : 0.55) * alphaRatio * globalFlickerAlpha * (cached.state === 'FADING_IN' ? ambientPulse : 1);

      const dx = dotB.x - dotA.x;
      const dy = dotB.y - dotA.y;
      const dist = Math.hypot(dx, dy);

      if (dist > GAP_PADDING * 2) {
        const unitX = dx / dist;
        const unitY = dy / dist;

        const startX = dotA.x + unitX * GAP_PADDING;
        const startY = dotA.y + unitY * GAP_PADDING;
        const endX = dotB.x - unitX * GAP_PADDING;
        const endY = dotB.y - unitY * GAP_PADDING;

        ctx.strokeStyle = isLight
          ? `rgba(100, 116, 139, ${finalAlpha})`
          : `rgba(203, 213, 225, ${finalAlpha})`;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      if (cached.state === 'FADING_IN' && globalFlickerAlpha > 0.4) {
        this.activeDots.add(dotA);
        this.activeDots.add(dotB);
      }
    }

    for (const dot of this.activeDots) {
      dot.setClockVertex(0.85 * globalFlickerAlpha, 0.3);
    }

    ctx.restore();
  }
}