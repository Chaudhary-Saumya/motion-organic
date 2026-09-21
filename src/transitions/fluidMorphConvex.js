import { PageTransition } from './base.js';
import { Spring, clamp01 } from '../core/spring.js';

/**
 * FluidMorphConvex — Asymmetrical organic convex fluid swelling portal.
 * Continuously reveals nextPageEl inside a rising convex fluid aperture with harmonic tension.
 */
export class FluidMorphConvex extends PageTransition {
  constructor({
    nextPageEl,
    currentPageEl,
    accentColor = '#d7ed45',
    container = (typeof document !== 'undefined' ? document.body : null),
    stiffness = 55,
    damping = 15,
    sound = true,
  } = {}) {
    super();
    this.nextPageEl = nextPageEl;
    this.currentPageEl = currentPageEl;
    this.accentColor = accentColor;
    this.container = container;
    this.sound = sound;

    this.spring = new Spring({ stiffness, damping });
    this.coverThreshold = 0.5;

    if (sound) {
      this.enableAudio('liquid', 0.5);
    }

    this.svg = null;
    this.clipPathEl = null;
    this.rimPath = null;
    this.clipId = 'mo-convex-clip-' + Math.random().toString(36).slice(2, 9);
    this._initDOM();
  }

  _initDOM() {
    if (typeof document === 'undefined') return;

    const host = this.container || document.body;
    const isBody = host === document.body;
    const svgNS = 'http://www.w3.org/2000/svg';

    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttribute('class', 'mo-fluid-convex-overlay');
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

    this.clipPathEl = document.createElementNS(svgNS, 'path');
    clip.appendChild(this.clipPathEl);
    defs.appendChild(clip);
    this.svg.appendChild(defs);

    // Glowing convex rim contour
    this.rimPath = document.createElementNS(svgNS, 'path');
    this.rimPath.setAttribute('fill', 'none');
    this.rimPath.setAttribute('stroke', this.accentColor);
    this.rimPath.setAttribute('stroke-width', '3');
    this.rimPath.style.filter = 'drop-shadow(0 0 14px rgba(215, 237, 69, 0.8))';
    this.svg.appendChild(this.rimPath);

    host.appendChild(this.svg);

    if (this.nextPageEl) {
      this.nextPageEl.style.clipPath = `url(#${this.clipId})`;
      this.nextPageEl.style.webkitClipPath = `url(#${this.clipId})`;
      this.nextPageEl.style.willChange = 'clip-path, transform, opacity';
    }
  }

  render(t) {
    const progress = clamp01(t);
    if (!this.clipPathEl) return;

    const host = this.container || document.body;
    const w = host.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1200);
    const h = host.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 800);

    if (this.svg) {
      this.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      this.svg.style.opacity = progress > 0.001 && progress < 0.999 ? '1' : '0';
    }

    if (progress <= 0.0001) {
      this.clipPathEl.setAttribute('d', '');
      this.rimPath?.setAttribute('d', '');
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
      this.currentPageEl.style.opacity = (1 - progress * 0.35).toFixed(3);
    }

    // Convex spline swell
    const ease = 1 - Math.pow(1 - progress, 2.5);
    const topY = h * (1 - ease);
    const bulge = Math.sin(progress * Math.PI) * (h * 0.28);
    const ctrlY = topY - bulge;

    const clipD = `M 0,${h} L 0,${topY.toFixed(1)} Q ${(w / 2).toFixed(1)},${ctrlY.toFixed(1)} ${w},${topY.toFixed(1)} L ${w},${h} Z`;
    this.clipPathEl.setAttribute('d', clipD);

    if (this.rimPath) {
      this.rimPath.setAttribute('d', `M 0,${topY.toFixed(1)} Q ${(w / 2).toFixed(1)},${ctrlY.toFixed(1)} ${w},${topY.toFixed(1)}`);
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
    this.clipPathEl = null;
    this.rimPath = null;
  }
}
