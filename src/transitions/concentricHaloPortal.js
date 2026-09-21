import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';
import { PageTransition } from './base.js';

/**
 * ConcentricHaloPortal — Multi-Layered Organic Concentric Halo Portal Rings.
 *
 * 3 concentric organic glowing halo rings expand at staggered relativistic velocities (1x, 1.8x, 3.2x).
 * Harmonic Fourier waves ripple along each ring's perimeter with chromatic glowing edges,
 * sweeping across the viewport into full bleed.
 */
export class ConcentricHaloPortal extends PageTransition {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.nextPageEl
   * @param {HTMLElement} [options.currentPageEl]
   * @param {HTMLElement} [options.container=document.body]
   * @param {number} [options.rings=3]
   * @param {number} [options.stiffness=95]
   * @param {number} [options.damping=22]
   */
  constructor({
    nextPageEl,
    currentPageEl,
    container = document.body,
    rings = 3,
    stiffness = 95,
    damping = 22,
  } = {}) {
    super();
    this.nextPageEl = nextPageEl;
    this.currentPageEl = currentPageEl;
    this.container = container;
    this.numRings = rings;

    this.spring = new Spring({ stiffness, damping });
    this.cx = window.innerWidth / 2;
    this.cy = window.innerHeight / 2;
    this.maxRadius = Math.hypot(window.innerWidth, window.innerHeight) * 1.15;

    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body;
    const svgNS = 'http://www.w3.org/2000/svg';
    const clipId = 'halo-clip-' + Math.random().toString(36).slice(2, 9);
    this.clipId = clipId;

    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    Object.assign(this.svg.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '9998',
    });

    const defs = document.createElementNS(svgNS, 'defs');
    const clipPath = document.createElementNS(svgNS, 'clipPath');
    clipPath.setAttribute('id', clipId);
    clipPath.setAttribute('clipPathUnits', 'userSpaceOnUse');

    this.mainMaskPath = document.createElementNS(svgNS, 'path');
    clipPath.appendChild(this.mainMaskPath);
    defs.appendChild(clipPath);
    this.svg.appendChild(defs);

    // Glowing concentric stroke rings
    this.haloRings = [];
    const colors = ['rgba(106, 255, 203, 0.8)', 'rgba(124, 106, 255, 0.7)', 'rgba(255, 106, 159, 0.6)'];

    for (let i = 0; i < this.numRings; i++) {
      const ringPath = document.createElementNS(svgNS, 'path');
      ringPath.setAttribute('fill', 'none');
      ringPath.setAttribute('stroke', colors[i % colors.length]);
      ringPath.setAttribute('stroke-width', `${3 - i * 0.5}`);
      ringPath.style.filter = `drop-shadow(0 0 16px ${colors[i % colors.length]})`;
      this.svg.appendChild(ringPath);
      this.haloRings.push(ringPath);
    }

    this.container.appendChild(this.svg);

    if (this.nextPageEl) {
      this.nextPageEl.style.clipPath = `url(#${clipId})`;
      this.nextPageEl.style.webkitClipPath = `url(#${clipId})`;
      this.nextPageEl.style.willChange = 'transform, opacity, clip-path';
    }
    if (this.currentPageEl) {
      this.currentPageEl.style.willChange = 'transform, opacity, filter';
    }

    this.render(0);
  }

  setOrigin(x, y) {
    this.cx = x ?? window.innerWidth / 2;
    this.cy = y ?? window.innerHeight / 2;
    this.maxRadius = Math.hypot(
      Math.max(this.cx, window.innerWidth - this.cx),
      Math.max(this.cy, window.innerHeight - this.cy)
    ) * 1.2;
  }

  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));

    if (clampedT <= 0.001) {
      this.mainMaskPath.setAttribute('d', '');
      this.haloRings.forEach(r => r.setAttribute('d', ''));
      if (this.nextPageEl) {
        this.nextPageEl.style.opacity = '0';
        this.nextPageEl.style.pointerEvents = 'none';
      }
      if (this.currentPageEl) {
        this.currentPageEl.style.opacity = '1';
        this.currentPageEl.style.transform = 'none';
        this.currentPageEl.style.filter = 'none';
        this.currentPageEl.style.pointerEvents = 'auto';
      }
      return;
    }

    const numPoints = 16;
    const angleStep = (Math.PI * 2) / numPoints;

    // Render mask & halo rings
    this.haloRings.forEach((ringPath, idx) => {
      const ringSpeed = 1 + idx * 0.45;
      const ringT = Math.min(1, clampedT * ringSpeed);
      const easeR = Math.pow(ringT, 1.4) * this.maxRadius;

      const pts = [];
      const phase = clampedT * 8 + idx * 2;

      for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep;
        const wave = Math.sin(angle * 4 + phase) * 0.12 * (1 - ringT * 0.5);
        const r = Math.max(0, easeR * (1 + wave));
        pts.push({
          x: this.cx + Math.cos(angle) * r,
          y: this.cy + Math.sin(angle) * r,
        });
      }

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

      ringPath.setAttribute('d', d);
      ringPath.style.opacity = ringT > 0.95 ? String((1 - ringT) / 0.05) : String(Math.min(1, ringT * 3));

      if (idx === 0) {
        this.mainMaskPath.setAttribute('d', d);
      }
    });

    // Outgoing scene pushes back
    if (this.currentPageEl) {
      const outScale = 1 - clampedT * 0.06;
      const outBlur = clampedT * 12;
      const outOpacity = Math.max(0, 1 - clampedT * 1.25);
      this.currentPageEl.style.transform = `scale(${outScale.toFixed(3)})`;
      this.currentPageEl.style.filter = outBlur > 0.1 ? `blur(${outBlur.toFixed(1)}px)` : 'none';
      this.currentPageEl.style.opacity = outOpacity.toFixed(3);
      this.currentPageEl.style.pointerEvents = clampedT > 0.5 ? 'none' : 'auto';
    }

    // Next page scales into focus
    if (this.nextPageEl) {
      const inScale = 1.1 - clampedT * 0.1;
      this.nextPageEl.style.opacity = '1';
      this.nextPageEl.style.transform = `scale(${inScale.toFixed(3)})`;
      this.nextPageEl.style.pointerEvents = clampedT > 0.5 ? 'auto' : 'none';

      if (clampedT >= 0.98) {
        this.nextPageEl.style.clipPath = 'none';
        this.nextPageEl.style.webkitClipPath = 'none';
      } else {
        this.nextPageEl.style.clipPath = `url(#${this.clipId})`;
        this.nextPageEl.style.webkitClipPath = `url(#${this.clipId})`;
      }
    }
  }

  async trigger(e, onCovered) {
    const x = e?.clientX ?? (e?.touches ? e.touches[0].clientX : window.innerWidth / 2);
    const y = e?.clientY ?? (e?.touches ? e.touches[0].clientY : window.innerHeight / 2);
    this.setOrigin(x, y);

    this.onReset();
    return new Promise((resolve) => {
      this.spring.jumpTo(0);
      this.spring.onUpdate = (v) => this.render(Math.max(0, Math.min(1, v)));
      this.spring.onSettle = () => {
        this.render(1);
        this.onComplete();
        onCovered?.();
        resolve();
      };
      this.spring.set(1);
      engine.add(this.spring);
    });
  }

  onComplete() {
    if (this.nextPageEl) {
      this.nextPageEl.style.clipPath = 'none';
      this.nextPageEl.style.webkitClipPath = 'none';
      this.nextPageEl.style.opacity = '1';
      this.nextPageEl.style.transform = 'scale(1)';
      this.nextPageEl.style.pointerEvents = 'auto';
    }
    if (this.currentPageEl) {
      this.currentPageEl.style.opacity = '0';
      this.currentPageEl.style.pointerEvents = 'none';
    }
    this.haloRings.forEach(r => (r.style.opacity = '0'));
  }

  onReset() {
    if (this.nextPageEl) {
      this.nextPageEl.style.clipPath = `url(#${this.clipId})`;
      this.nextPageEl.style.webkitClipPath = `url(#${this.clipId})`;
      this.nextPageEl.style.opacity = '0';
      this.nextPageEl.style.transform = 'scale(1.1)';
      this.nextPageEl.style.pointerEvents = 'none';
    }
    if (this.currentPageEl) {
      this.currentPageEl.style.opacity = '1';
      this.currentPageEl.style.transform = 'scale(1)';
      this.currentPageEl.style.filter = 'none';
      this.currentPageEl.style.pointerEvents = 'auto';
    }
    this.render(0);
  }

  destroy() {
    super.destroy();
    if (this.nextPageEl) {
      this.nextPageEl.style.clipPath = '';
      this.nextPageEl.style.webkitClipPath = '';
    }
    this.svg.remove();
  }
}
