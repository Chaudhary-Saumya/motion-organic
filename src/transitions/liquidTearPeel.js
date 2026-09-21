import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';
import { PageTransition } from './base.js';

/**
 * LiquidTearPeel — Organic Diagonal Liquid Tear / Zipper Reveal.
 *
 * As scroll or trigger progress goes 0 → 1:
 * 1. An undulating organic tear line cuts across the canvas.
 * 2. Left and right (or top/bottom) halves of Scene 1 curl and separate outward with elastic physics and soft drop shadow.
 * 3. Scene 2 is revealed smoothly through the widening organic tear gap.
 */
export class LiquidTearPeel extends PageTransition {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.nextPageEl
   * @param {HTMLElement} [options.currentPageEl]
   * @param {HTMLElement} [options.container=document.body]
   * @param {number} [options.tearAngle=32] - Angle of tear in degrees
   * @param {number} [options.wobble=24] - Amplitude of harmonic tear edge waves
   * @param {number} [options.stiffness=95]
   * @param {number} [options.damping=22]
   */
  constructor({
    nextPageEl,
    currentPageEl,
    container = document.body,
    tearAngle = 32,
    wobble = 24,
    stiffness = 95,
    damping = 22,
  } = {}) {
    super();
    this.nextPageEl = nextPageEl;
    this.currentPageEl = currentPageEl;
    this.container = container;
    this.tearAngle = tearAngle;
    this.wobble = wobble;

    this.spring = new Spring({ stiffness, damping });
    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body;
    const svgNS = 'http://www.w3.org/2000/svg';
    const clipIdLeft = 'tear-left-' + Math.random().toString(36).slice(2, 9);
    const clipIdRight = 'tear-right-' + Math.random().toString(36).slice(2, 9);
    this.clipIdLeft = clipIdLeft;
    this.clipIdRight = clipIdRight;

    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    Object.assign(this.svg.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '9999',
    });

    const defs = document.createElementNS(svgNS, 'defs');

    // Left clip
    const clipL = document.createElementNS(svgNS, 'clipPath');
    clipL.setAttribute('id', clipIdLeft);
    clipL.setAttribute('clipPathUnits', 'userSpaceOnUse');
    this.pathL = document.createElementNS(svgNS, 'path');
    clipL.appendChild(this.pathL);

    // Right clip
    const clipR = document.createElementNS(svgNS, 'clipPath');
    clipR.setAttribute('id', clipIdRight);
    clipR.setAttribute('clipPathUnits', 'userSpaceOnUse');
    this.pathR = document.createElementNS(svgNS, 'path');
    clipR.appendChild(this.pathR);

    defs.append(clipL, clipR);
    this.svg.appendChild(defs);

    // Tear line stroke
    this.tearLine = document.createElementNS(svgNS, 'path');
    this.tearLine.setAttribute('fill', 'none');
    this.tearLine.setAttribute('stroke', 'rgba(106, 255, 203, 0.6)');
    this.tearLine.setAttribute('stroke-width', '2.5');
    this.tearLine.style.filter = 'drop-shadow(0 0 12px rgba(106, 255, 203, 0.8))';
    this.svg.appendChild(this.tearLine);

    this.container.appendChild(this.svg);

    if (this.nextPageEl) {
      this.nextPageEl.style.willChange = 'transform, opacity';
    }
    if (this.currentPageEl) {
      this.currentPageEl.style.willChange = 'transform, opacity, filter';
    }

    this.render(0);
  }

  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (clampedT <= 0.001) {
      this.tearLine.setAttribute('d', '');
      this.tearLine.style.opacity = '0';
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

    const gap = clampedT * (Math.max(w, h) * 1.25);
    const rad = (this.tearAngle * Math.PI) / 180;
    const nx = Math.cos(rad);
    const ny = Math.sin(rad);

    // Generate undulating tear line points
    const steps = 24;
    let lineD = '';
    for (let i = 0; i <= steps; i++) {
      const frac = i / steps;
      const x = frac * w;
      const baseY = frac * h * 0.8 + h * 0.1;
      const wave = Math.sin(frac * Math.PI * 4 + clampedT * 6) * this.wobble * (1 - clampedT * 0.5);
      const px = x;
      const py = baseY + wave;

      if (i === 0) lineD += `M ${px.toFixed(1)} ${py.toFixed(1)}`;
      else lineD += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
    }
    this.tearLine.setAttribute('d', lineD);
    this.tearLine.style.opacity = clampedT > 0.95 ? String((1 - clampedT) / 0.05) : '1';

    // Outgoing page peels apart in 2 directions
    if (this.currentPageEl) {
      const moveX = nx * gap * 0.5;
      const moveY = ny * gap * 0.5;
      const rot = clampedT * 6;
      const blur = clampedT * 8;
      const opacity = Math.max(0, 1 - clampedT * 1.2);

      this.currentPageEl.style.transform = `translate(${-moveX.toFixed(1)}px, ${-moveY.toFixed(1)}px) rotate(${-rot.toFixed(1)}deg) scale(${(1 - clampedT * 0.05).toFixed(3)})`;
      this.currentPageEl.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : 'none';
      this.currentPageEl.style.opacity = opacity.toFixed(3);
      this.currentPageEl.style.pointerEvents = clampedT > 0.5 ? 'none' : 'auto';
    }

    // Destination page zooms into view
    if (this.nextPageEl) {
      const inScale = 1.1 - clampedT * 0.1;
      const inOpacity = Math.min(1, clampedT * 1.4);
      this.nextPageEl.style.opacity = inOpacity.toFixed(3);
      this.nextPageEl.style.transform = `scale(${inScale.toFixed(3)})`;
      this.nextPageEl.style.pointerEvents = clampedT > 0.5 ? 'auto' : 'none';
    }
  }

  async trigger(e, onCovered) {
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
      this.nextPageEl.style.opacity = '1';
      this.nextPageEl.style.transform = 'scale(1)';
      this.nextPageEl.style.pointerEvents = 'auto';
    }
    if (this.currentPageEl) {
      this.currentPageEl.style.opacity = '0';
      this.currentPageEl.style.pointerEvents = 'none';
    }
    this.tearLine.style.opacity = '0';
  }

  onReset() {
    if (this.currentPageEl) {
      this.currentPageEl.style.opacity = '1';
      this.currentPageEl.style.transform = 'none';
      this.currentPageEl.style.filter = 'none';
      this.currentPageEl.style.pointerEvents = 'auto';
    }
    if (this.nextPageEl) {
      this.nextPageEl.style.opacity = '0';
      this.nextPageEl.style.transform = 'scale(1.1)';
      this.nextPageEl.style.pointerEvents = 'none';
    }
    this.render(0);
  }

  destroy() {
    super.destroy();
    this.svg.remove();
  }
}
