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
  constructor({ startCol = 10, startRow = 3, digitSpacing = 2 } = {}) {
    this.startCol = startCol;
    this.startRow = startRow;
    this.digitSpacing = digitSpacing;
  }

  // Anchor the clock dots next to the navbar (with a safe fallback)
  alignToNav(navRect, gridSpacing = 20, maxCols = 80) {
    if (navRect && navRect.left > 0) {
      // Total column span: (4 digits * 2 cols) + (3 gaps * 2 cols) + 1 colon gap = ~15 cols
      const totalSpanCols = 15;
      const targetLeft = Math.max(0, navRect.left - (totalSpanCols * gridSpacing) - 24);
      
      this.startCol = Math.max(2, Math.floor(targetLeft / gridSpacing));
      this.startRow = Math.max(2, Math.floor((navRect.top + (navRect.height / 2)) / gridSpacing) - 1);
    } else {
      // Safe fallback default position (top right area)
      this.startCol = Math.max(2, maxCols - 20);
      this.startRow = 3;
    }
  }

  getTimeString() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    return `${h}${m}`;
  }

  draw(ctx, dots2D, isLight = false) {
    if (!dots2D || !dots2D.length || !dots2D[0]) return;

    const timeStr = this.getTimeString();
    let currentCol = this.startCol;
    const maxCols = dots2D.length;
    const maxRows = dots2D[0].length;

    ctx.save();
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const lineColor = isLight
      ? 'rgba(17, 24, 39, 0.9)'
      : 'rgba(251, 191, 36, 0.95)';

    for (let i = 0; i < timeStr.length; i++) {
      const char = timeStr[i];
      const activeSegments = DIGIT_SEGMENTS[char] || [];

      // 1. Draw glowing connecting lines between dots
      ctx.strokeStyle = lineColor;
      if (!isLight) {
        ctx.shadowColor = 'rgba(251, 191, 36, 0.7)';
        ctx.shadowBlur = 10;
      }

      for (const segKey of activeSegments) {
        const [[c1, r1], [c2, r2]] = SEGMENTS[segKey];
        const colA = currentCol + c1;
        const rowA = this.startRow + r1;
        const colB = currentCol + c2;
        const rowB = this.startRow + r2;

        if (colA < maxCols && rowA < maxRows && colB < maxCols && rowB < maxRows) {
          const dotA = dots2D[colA]?.[rowA];
          const dotB = dots2D[colB]?.[rowB];

          if (dotA && dotB) {
            ctx.beginPath();
            ctx.moveTo(dotA.x, dotA.y);
            ctx.lineTo(dotB.x, dotB.y);
            ctx.stroke();
          }
        }
      }

      // 2. Brighten and expand the 2x3 vertex dots for this digit
      ctx.shadowBlur = 0;
      for (let c = 0; c <= 1; c++) {
        for (let r = 0; r <= 2; r++) {
          const targetCol = currentCol + c;
          const targetRow = this.startRow + r;

          if (targetCol < maxCols && targetRow < maxRows) {
            const dot = dots2D[targetCol]?.[targetRow];
            if (dot) {
              dot.alpha = Math.max(dot.alpha, isLight ? 0.95 : 0.9);
              dot.currentRadius = Math.max(dot.currentRadius, dot.baseRadius + 0.8);
            }
          }
        }
      }

      // 3. Spacing to next digit (+1 extra column between HH and MM for the colon gap)
      currentCol += 2 + (i === 1 ? this.digitSpacing + 1 : this.digitSpacing);
    }

    ctx.restore();
  }
}