import { PageTransition } from './base.js';

/**
 * LiquidBlobTransition — An organic viscous droplet that bubbles outwards from the
 * click/origin coordinates, covers the viewport with surface tension wobble, and recedes.
 *
 * Math: Modulates circle radius with harmonic sinusoidal pertubations `sin(k * theta + phase)`
 * whose amplitude is driven by the spring velocity.
 */
export class LiquidBlobTransition extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {string} [options.color='#7c6aff'] - Fill color of the liquid droplet
   * @param {number} [options.points=12] - Number of harmonic control points
   * @param {number} [options.wobbleIntensity=0.18] - Liquid surface wave amplitude
   * @param {HTMLElement} [options.container=document.body] - Parent container
   * @param {() => void} [options.onCovered] - Optional callback
   */
  constructor({
    color = '#7c6aff',
    points = 12,
    wobbleIntensity = 0.18,
    container = document.body,
    onCovered,
  } = {}) {
    super();
    this.color = color;
    this.numPoints = points;
    this.wobbleIntensity = wobbleIntensity;
    this.container = container;
    this.onCoveredCallback = onCovered;

    this.cx = window.innerWidth / 2;
    this.cy = window.innerHeight / 2;
    this.maxRadius = Math.hypot(window.innerWidth, window.innerHeight) * 1.1;

    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body;
    const svgNS = 'http://www.w3.org/2000/svg';

    this.svg = document.createElementNS(svgNS, 'svg');
    Object.assign(this.svg.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      zIndex: '9999',
      pointerEvents: 'none',
    });

    this.path = document.createElementNS(svgNS, 'path');
    this.path.setAttribute('fill', this.color);
    this.svg.appendChild(this.path);
    this.container.appendChild(this.svg);
  }

  setOrigin(x, y) {
    this.cx = x ?? window.innerWidth / 2;
    this.cy = y ?? window.innerHeight / 2;
    this.maxRadius = Math.hypot(
      Math.max(this.cx, window.innerWidth - this.cx),
      Math.max(this.cy, window.innerHeight - this.cy)
    ) * 1.15;
  }

  render(t) {
    if (t <= 0) {
      this.path.setAttribute('d', '');
      return;
    }

    // In trigger mode: t goes 0 -> 0.5 (expand) -> 1.0 (retract/reveal)
    // In scroll mode: t in [0, 1] maps cleanly
    const isExpanding = t <= 0.5;
    const normT = isExpanding ? t * 2 : (1 - t) * 2;
    const currentRadius = this.maxRadius * normT;

    const angleStep = (Math.PI * 2) / this.numPoints;
    const pts = [];

    for (let i = 0; i < this.numPoints; i++) {
      const angle = i * angleStep;
      // Harmonic wave fluctuation
      const wobble = Math.sin(angle * 3 + t * 10) * this.wobbleIntensity * (1 - normT * 0.5);
      const r = Math.max(0, currentRadius * (1 + wobble));
      pts.push({
        x: this.cx + Math.cos(angle) * r,
        y: this.cy + Math.sin(angle) * r,
      });
    }

    if (pts.length < 3) return;

    // Build smooth Catmull-Rom spline path
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length; i++) {
      const p0 = pts[(i - 1 + pts.length) % pts.length];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % pts.length];
      const p3 = pts[(i + 2) % pts.length];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    d += ' Z';
    this.path.setAttribute('d', d);
  }

  async trigger(e, onCovered) {
    const x = e?.clientX ?? (e?.touches ? e.touches[0].clientX : window.innerWidth / 2);
    const y = e?.clientY ?? (e?.touches ? e.touches[0].clientY : window.innerHeight / 2);
    this.setOrigin(x, y);

    this.svg.style.pointerEvents = 'auto';

    // Phase 1: Expand to cover screen (0 -> 0.5)
    await this._springTo(0.5);
    (onCovered ?? this.onCoveredCallback)?.();

    // Phase 2: Retract/open (0.5 -> 1.0)
    await this._springTo(1.0);
    this.render(0);
    this.svg.style.pointerEvents = 'none';
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
    this.svg.style.pointerEvents = 'none';
  }

  destroy() {
    super.destroy();
    this.svg.remove();
  }
}
