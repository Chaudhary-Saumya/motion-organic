import { PageTransition } from './base.js';

/**
 * NeuralSynapseBloom — Bioluminescent Electric Neural Synapse Network.
 * Procedural glowing synaptic dendrites and electric branches erupt organically
 * from the interaction origin, spreading across the screen like living bio-circuits
 * and dissolving the outgoing route in a flash of neural light.
 */
export class NeuralSynapseBloom extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {string} [options.synapseColor='#6affcb']
   * @param {number} [options.branches=16]
   * @param {HTMLElement} [options.container=document.body]
   * @param {HTMLElement} [options.currentPageEl]
   * @param {HTMLElement} [options.nextPageEl]
   * @param {number} [options.stiffness=100]
   * @param {number} [options.damping=22]
   */
  constructor({
    synapseColor = '#6affcb',
    branches = 16,
    container = document.body,
    currentPageEl = null,
    nextPageEl = null,
    stiffness = 100,
    damping = 22,
  } = {}) {
    super();
    this.synapseColor = synapseColor;
    this.numBranches = branches;
    this.container = container;
    this.currentPageEl = currentPageEl;
    this.nextPageEl = nextPageEl;
    this.baseSpring.stiffness = stiffness;
    this.baseSpring.damping = damping;

    this.cx = window.innerWidth / 2;
    this.cy = window.innerHeight / 2;
    this._treeData = [];

    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body;
    const svgNS = 'http://www.w3.org/2000/svg';

    this.overlay = document.createElement('div');
    this.overlay.className = 'neural-synapse-overlay';
    Object.assign(this.overlay.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      zIndex: '9999',
      pointerEvents: 'none',
      overflow: 'hidden',
    });

    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    Object.assign(this.svg.style, { position: 'absolute', inset: '0' });

    // Glow filter
    const defs = document.createElementNS(svgNS, 'defs');
    const filter = document.createElementNS(svgNS, 'filter');
    const filterId = 'synapse-glow-' + Math.random().toString(36).slice(2, 9);
    filter.setAttribute('id', filterId);
    filter.innerHTML = `<feGaussianBlur stdDeviation="6" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>`;
    defs.appendChild(filter);

    this.pathGroup = document.createElementNS(svgNS, 'g');
    this.pathGroup.setAttribute('filter', `url(#${filterId})`);

    this.paths = [];
    for (let i = 0; i < this.numBranches; i++) {
      const p = document.createElementNS(svgNS, 'path');
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', this.synapseColor);
      p.setAttribute('stroke-width', '3');
      p.setAttribute('stroke-linecap', 'round');
      this.pathGroup.appendChild(p);
      this.paths.push(p);
    }

    this.svg.append(defs, this.pathGroup);
    this.overlay.appendChild(this.svg);
    this.container.appendChild(this.overlay);

    this._generateBranches();
  }

  setOrigin(x, y) {
    this.cx = x ?? window.innerWidth / 2;
    this.cy = y ?? window.innerHeight / 2;
    this._generateBranches();
  }

  _generateBranches() {
    this._treeData = [];
    const maxLen = Math.hypot(window.innerWidth, window.innerHeight) * 0.9;

    for (let i = 0; i < this.numBranches; i++) {
      const baseAngle = (i * (Math.PI * 2)) / this.numBranches + (Math.random() - 0.5) * 0.4;
      const points = [{ x: this.cx, y: this.cy }];
      let currX = this.cx;
      let currY = this.cy;
      let currAngle = baseAngle;
      const segments = 12;

      for (let s = 1; s <= segments; s++) {
        const segLen = (maxLen / segments) * (0.8 + Math.random() * 0.4);
        currAngle += (Math.random() - 0.5) * 0.6;
        currX += Math.cos(currAngle) * segLen;
        currY += Math.sin(currAngle) * segLen;
        points.push({ x: currX, y: currY });
      }

      this._treeData.push(points);
    }
  }

  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));

    if (clampedT <= 0.001) {
      this.paths.forEach(p => p.setAttribute('d', ''));
      this.overlay.style.opacity = '0';
    } else {
      const totalPoints = 12;
      const visibleIndex = Math.floor(clampedT * totalPoints);
      const frac = (clampedT * totalPoints) % 1;

      for (let b = 0; b < this.paths.length; b++) {
        const pts = this._treeData[b] || [];
        if (pts.length < 2) continue;

        let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
        const limit = Math.min(pts.length - 1, visibleIndex);

        for (let i = 1; i <= limit; i++) {
          d += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
        }

        if (visibleIndex < pts.length - 1) {
          const pPrev = pts[visibleIndex];
          const pNext = pts[visibleIndex + 1];
          const curX = pPrev.x + (pNext.x - pPrev.x) * frac;
          const curY = pPrev.y + (pNext.y - pPrev.y) * frac;
          d += ` L ${curX.toFixed(1)} ${curY.toFixed(1)}`;
        }

        this.paths[b].setAttribute('d', d);
        this.paths[b].setAttribute('stroke-width', String(Math.max(1, (1 - clampedT * 0.5) * 4)));
      }

      const glowOpacity = clampedT < 0.7 ? 1 : Math.max(0, 1 - (clampedT - 0.7) / 0.3);
      this.overlay.style.opacity = String(glowOpacity.toFixed(3));
    }

    if (this.currentPageEl) {
      const flash = clampedT > 0.4 && clampedT < 0.7 ? 1.5 : 1;
      const outScale = 1 - clampedT * 0.08;
      const outBlur = clampedT * 16;
      this.currentPageEl.style.transform = `scale(${outScale.toFixed(3)})`;
      this.currentPageEl.style.filter = `blur(${outBlur.toFixed(1)}px) brightness(${flash})`;
      this.currentPageEl.style.opacity = String(Math.max(0, 1 - clampedT * 1.6).toFixed(3));
    }

    if (this.nextPageEl) {
      const inScale = 1.05 - clampedT * 0.05;
      const inOpacity = Math.min(1, clampedT * 1.5);
      this.nextPageEl.style.transform = `scale(${inScale.toFixed(3)})`;
      this.nextPageEl.style.opacity = String(inOpacity.toFixed(3));
    }
  }

  async trigger(e, onCovered) {
    const x = e?.clientX ?? (e?.touches ? e.touches[0].clientX : window.innerWidth / 2);
    const y = e?.clientY ?? (e?.touches ? e.touches[0].clientY : window.innerHeight / 2);
    this.setOrigin(x, y);

    this.overlay.style.pointerEvents = 'auto';
    this.render(0);

    await this._springTo(1);
    onCovered?.();

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
    if (this.currentPageEl) {
      this.currentPageEl.style.filter = 'none';
      this.currentPageEl.style.transform = 'none';
      this.currentPageEl.style.opacity = '1';
    }
    if (this.nextPageEl) {
      this.nextPageEl.style.opacity = '0';
      this.nextPageEl.style.transform = 'none';
    }
  }

  destroy() {
    super.destroy();
    this.overlay.remove();
  }
}
