import { PageTransition } from './base.js';

/**
 * ApertureIrisTransition — A mechanical camera aperture shutter.
 * N wedge-shaped blades rotate and twist closed over the viewport, then snap open
 * onto the destination page with physical iris mechanics.
 */
export class ApertureIrisTransition extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {number} [options.blades=9] - Number of iris blades (7-16)
   * @param {string} [options.color='#0a0a10'] - Blade material fill color
   * @param {HTMLElement} [options.container=document.body] - Container
   * @param {number} [options.stiffness=130] - Spring stiffness
   * @param {number} [options.damping=20] - Spring damping
   */
  constructor({
    blades = 9,
    color = '#0a0a10',
    container = document.body,
    stiffness = 130,
    damping = 20,
  } = {}) {
    super();
    this.n = blades;
    this.color = color;
    this.container = container;
    this.baseSpring.stiffness = stiffness;
    this.baseSpring.damping = damping;

    this.cx = window.innerWidth / 2;
    this.cy = window.innerHeight / 2;
    this.R = Math.hypot(this.cx, this.cy) * 1.1;

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

    this.paths = Array.from({ length: this.n }, () => {
      const p = document.createElementNS(svgNS, 'path');
      p.setAttribute('fill', this.color);
      this.svg.appendChild(p);
      return p;
    });

    this.container.appendChild(this.svg);
  }

  setOrigin(x, y) {
    this.cx = x ?? window.innerWidth / 2;
    this.cy = y ?? window.innerHeight / 2;
    this.R = Math.hypot(
      Math.max(this.cx, window.innerWidth - this.cx),
      Math.max(this.cy, window.innerHeight - this.cy)
    ) * 1.1;
  }

  /**
   * t in [0, 1]: 0 is open, 1 is fully closed shutter
   */
  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));
    const step = (Math.PI * 2) / this.n;
    const innerR = this.R * (1 - clampedT);
    const rot = clampedT * step * 0.55;

    for (let i = 0; i < this.n; i++) {
      const a0 = i * step;
      const a1 = (i + 1) * step;
      const ox0 = this.cx + Math.cos(a0) * this.R;
      const oy0 = this.cy + Math.sin(a0) * this.R;
      const ox1 = this.cx + Math.cos(a1) * this.R;
      const oy1 = this.cy + Math.sin(a1) * this.R;
      const ix1 = this.cx + Math.cos(a1 + rot) * innerR;
      const iy1 = this.cy + Math.sin(a1 + rot) * innerR;
      const ix0 = this.cx + Math.cos(a0 + rot) * innerR;
      const iy0 = this.cy + Math.sin(a0 + rot) * innerR;

      this.paths[i].setAttribute(
        'd',
        `M ${ox0.toFixed(1)} ${oy0.toFixed(1)} L ${ox1.toFixed(1)} ${oy1.toFixed(1)} L ${ix1.toFixed(1)} ${iy1.toFixed(1)} L ${ix0.toFixed(1)} ${iy0.toFixed(1)} Z`
      );
    }
  }

  async trigger(e, onCovered) {
    const x = e?.clientX ?? (e?.touches ? e.touches[0].clientX : window.innerWidth / 2);
    const y = e?.clientY ?? (e?.touches ? e.touches[0].clientY : window.innerHeight / 2);
    this.setOrigin(x, y);

    this.svg.style.pointerEvents = 'auto';
    this.render(0);

    // Phase 1: Close blades (0 -> 1)
    await this._springTo(1);
    onCovered?.();

    // Phase 2: Re-open blades on new page (1 -> 0)
    await this._springTo(0);
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
