import { PageTransition } from './base.js';

/**
 * PixelDissolve — Digital pixel disintegration & scatter transition.
 * Fragments the viewport into an N×M grid of small pixel squares that dissolve,
 * scale, rotate, and scatter with randomized spring timing.
 */
export class PixelDissolve extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {number} [options.gridSize=16] - Number of tiles horizontally
   * @param {number} [options.scatter=35] - Max scatter distance in px
   * @param {number} [options.rotateMax=45] - Max rotation in degrees
   * @param {string} [options.color='#0a0a14'] - Pixel fill color
   * @param {string} [options.fadeOrder='random'] - 'random' | 'center-out' | 'edges-in'
   * @param {HTMLElement} [options.container=document.body] - Container
   * @param {number} [options.stiffness=130] - Spring stiffness
   * @param {number} [options.damping=21] - Spring damping
   */
  constructor({
    gridSize = 16,
    scatter = 35,
    rotateMax = 45,
    color = '#0a0a14',
    fadeOrder = 'random',
    container = document.body,
    stiffness = 130,
    damping = 21,
  } = {}) {
    super();
    this.gridCols = Math.max(4, gridSize);
    this.scatter = scatter;
    this.rotateMax = rotateMax;
    this.color = color;
    this.fadeOrder = fadeOrder;
    this.container = container;
    this.baseSpring.stiffness = stiffness;
    this.baseSpring.damping = damping;

    this.pixels = [];
    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body;
    // Calculate aspect ratio rows
    const aspect = window.innerHeight / window.innerWidth;
    this.gridRows = Math.max(4, Math.round(this.gridCols * aspect));

    this.overlay = document.createElement('div');
    this.overlay.className = 'mo-pixel-dissolve-overlay';
    Object.assign(this.overlay.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      zIndex: '9999',
      pointerEvents: 'none',
      display: 'grid',
      gridTemplateColumns: `repeat(${this.gridCols}, 1fr)`,
      gridTemplateRows: `repeat(${this.gridRows}, 1fr)`,
      overflow: 'hidden',
    });

    const total = this.gridCols * this.gridRows;
    const midX = (this.gridCols - 1) / 2;
    const midY = (this.gridRows - 1) / 2;
    const maxDist = Math.hypot(midX, midY) || 1;

    for (let r = 0; r < this.gridRows; r++) {
      for (let c = 0; c < this.gridCols; c++) {
        const px = document.createElement('div');
        px.className = 'mo-pixel-tile';
        Object.assign(px.style, {
          backgroundColor: this.color,
          transformOrigin: 'center center',
          willChange: 'transform, opacity',
          opacity: '0',
          transform: 'scale(0)',
        });

        // Pseudo-random deterministic noise based on (r, c)
        const pseudoRand = ((Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1 + 1) % 1;
        const scatterX = (pseudoRand * 2 - 1) * this.scatter;
        const scatterY = (((pseudoRand * 7.1) % 1) * 2 - 1) * this.scatter;
        const rot = (pseudoRand * 2 - 1) * this.rotateMax;

        let delay = pseudoRand * 0.5;
        if (this.fadeOrder === 'center-out') {
          const dist = Math.hypot(c - midX, r - midY) / maxDist;
          delay = dist * 0.5;
        } else if (this.fadeOrder === 'edges-in') {
          const dist = Math.hypot(c - midX, r - midY) / maxDist;
          delay = (1 - dist) * 0.5;
        }

        this.pixels.push({
          el: px,
          scatterX,
          scatterY,
          rot,
          delay,
        });

        this.overlay.appendChild(px);
      }
    }

    this.container.appendChild(this.overlay);
  }

  /**
   * t in [0, 1]: 0 is hidden, 1 is fully formed solid grid
   */
  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));

    for (const p of this.pixels) {
      const start = p.delay;
      const end = start + 0.5;
      const localT = Math.max(0, Math.min(1, (clampedT - start) / (end - start)));

      const inv = 1 - localT;
      const sx = inv * p.scatterX;
      const sy = inv * p.scatterY;
      const rot = inv * p.rot;
      const scale = localT;
      const opacity = Math.min(1, localT * 2);

      p.el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) scale(${scale.toFixed(3)}) rotate(${rot.toFixed(1)}deg)`;
      p.el.style.opacity = opacity.toFixed(3);
    }
  }

  async trigger(e, onCovered) {
    this.overlay.style.pointerEvents = 'auto';
    this.render(0);

    // Phase 1: Pixels assemble to cover (0 -> 1)
    await this._springTo(1);
    onCovered?.();

    // Phase 2: Pixels dissolve away (1 -> 0)
    await this._springTo(0);
    this.overlay.style.pointerEvents = 'none';
  }

  _springTo(target) {
    return new Promise((resolve) => {
      this.baseSpring.onUpdate = (v) => this.render(v);
      this.baseSpring.onSettle = resolve;
      this.baseSpring.set(target);
      import('../core/engine.js').then(({ engine }) => engine.add(this.baseSpring));
    });
  }

  onReset() {
    this.render(0);
    this.overlay.style.pointerEvents = 'none';
  }

  destroy() {
    super.destroy();
    this.overlay.remove();
    this.pixels = [];
  }
}
