import { PageTransition } from './base.js';
import { Spring, clamp01 } from '../core/spring.js';

/**
 * OrbitalEclipseSweep — Celestial planetary eclipse sweep transition.
 * Continuously reveals nextPageEl through a massive rising orbital disc with glowing solar corona edge.
 */
export class OrbitalEclipseSweep extends PageTransition {
  constructor({
    nextPageEl,
    currentPageEl,
    coronaColor = '#d7ed45',
    container = (typeof document !== 'undefined' ? document.body : null),
    stiffness = 50,
    damping = 14,
    sound = true,
  } = {}) {
    super();
    this.nextPageEl = nextPageEl;
    this.currentPageEl = currentPageEl;
    this.coronaColor = coronaColor;
    this.container = container;
    this.sound = sound;

    this.spring = new Spring({ stiffness, damping });
    this.coverThreshold = 0.5;

    if (sound) {
      this.enableAudio('whoosh', 0.45);
    }

    this.svg = null;
    this.clipPathEl = null;
    this.coronaCircle = null;
    this.clipId = 'mo-eclipse-clip-' + Math.random().toString(36).slice(2, 9);
    this._initDOM();
  }

  _initDOM() {
    if (typeof document === 'undefined') return;

    const host = this.container || document.body;
    const isBody = host === document.body;
    const svgNS = 'http://www.w3.org/2000/svg';

    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttribute('class', 'mo-orbital-eclipse-overlay');
    Object.assign(this.svg.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      zIndex: '99999',
      pointerEvents: 'none',
      overflow: 'hidden',
    });

    const defs = document.createElementNS(svgNS, 'defs');
    const clip = document.createElementNS(svgNS, 'clipPath');
    clip.setAttribute('id', this.clipId);
    clip.setAttribute('clipPathUnits', 'userSpaceOnUse');

    this.clipCircle = document.createElementNS(svgNS, 'circle');
    clip.appendChild(this.clipCircle);
    defs.appendChild(clip);
    this.svg.appendChild(defs);

    // Glowing solar corona rim
    this.coronaCircle = document.createElementNS(svgNS, 'circle');
    this.coronaCircle.setAttribute('fill', 'none');
    this.coronaCircle.setAttribute('stroke', this.coronaColor);
    this.coronaCircle.setAttribute('stroke-width', '3.5');
    this.coronaCircle.style.filter = 'drop-shadow(0 0 20px rgba(215, 237, 69, 0.9))';
    this.svg.appendChild(this.coronaCircle);

    host.appendChild(this.svg);

    if (this.nextPageEl) {
      this.nextPageEl.style.clipPath = `url(#${this.clipId})`;
      this.nextPageEl.style.webkitClipPath = `url(#${this.clipId})`;
      this.nextPageEl.style.willChange = 'clip-path, transform, opacity';
    }
  }

  render(t) {
    const progress = clamp01(t);
    if (!this.clipCircle) return;

    const host = this.container || document.body;
    const w = host.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1200);
    const h = host.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 800);

    if (this.svg) {
      this.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      this.svg.style.opacity = progress > 0.001 && progress < 0.999 ? '1' : '0';
    }

    if (progress <= 0.0001) {
      this.clipCircle.setAttribute('r', '0');
      this.coronaCircle?.setAttribute('r', '0');
      if (this.nextPageEl) {
        this.nextPageEl.style.opacity = '0';
        this.nextPageEl.style.pointerEvents = 'none';
      }
      if (this.currentPageEl) {
        this.currentPageEl.style.opacity = '1';
        this.currentPageEl.style.transform = 'scale(1)';
        this.currentPageEl.style.pointerEvents = 'auto';
      }
      return;
    }

    if (this.nextPageEl) {
      this.nextPageEl.style.opacity = '1';
      this.nextPageEl.style.pointerEvents = 'auto';
    }

    if (this.currentPageEl) {
      const scale = 1 - progress * 0.05;
      this.currentPageEl.style.transform = `scale(${scale.toFixed(3)})`;
      this.currentPageEl.style.opacity = (1 - progress * 0.4).toFixed(3);
    }

    const maxR = Math.hypot(w, h) * 1.1;
    const ease = 1 - Math.pow(1 - progress, 2.5);

    const cx = w / 2;
    const cy = h / 2;
    const r = Math.max(1, ease * maxR);

    this.clipCircle.setAttribute('cx', String(cx));
    this.clipCircle.setAttribute('cy', String(cy));
    this.clipCircle.setAttribute('r', r.toFixed(1));

    if (this.coronaCircle) {
      this.coronaCircle.setAttribute('cx', String(cx));
      this.coronaCircle.setAttribute('cy', String(cy));
      this.coronaCircle.setAttribute('r', r.toFixed(1));
    }
  }

  onComplete() {
    if (this.nextPageEl) {
      this.nextPageEl.style.clipPath = '';
      this.nextPageEl.style.webkitClipPath = '';
      this.nextPageEl.style.opacity = '1';
      this.nextPageEl.style.transform = '';
      this.nextPageEl.style.pointerEvents = 'auto';
    }
    if (this.currentPageEl) {
      this.currentPageEl.style.opacity = '0';
      this.currentPageEl.style.pointerEvents = 'none';
      this.currentPageEl.style.transform = '';
    }
  }

  destroy() {
    this.onComplete();
    if (this.svg && this.svg.parentNode) {
      this.svg.parentNode.removeChild(this.svg);
    }
    this.svg = null;
    this.clipCircle = null;
    this.coronaCircle = null;
  }
}
