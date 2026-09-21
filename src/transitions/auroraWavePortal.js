import { PageTransition } from './base.js';
import { Spring, clamp01 } from '../core/spring.js';

/**
 * AuroraWavePortal — Undulating holographic aurora borealis curtain portal.
 * Continuously reveals nextPageEl through a multi-harmonic sine wave clip-path with glowing neon aurora rim.
 */
export class AuroraWavePortal extends PageTransition {
  constructor({
    nextPageEl,
    currentPageEl,
    colors = ['#10b981', '#06b6d4', '#8b5cf6'],
    amplitude = 36,
    container = (typeof document !== 'undefined' ? document.body : null),
    stiffness = 55,
    damping = 15,
    sound = true,
  } = {}) {
    super();
    this.nextPageEl = nextPageEl;
    this.currentPageEl = currentPageEl;
    this.colors = colors;
    this.amplitude = amplitude;
    this.container = container;
    this.sound = sound;

    this.spring = new Spring({ stiffness, damping });
    this.coverThreshold = 0.5;

    if (sound) {
      this.enableAudio('whoosh', 0.4);
    }

    this.svg = null;
    this.clipPathEl = null;
    this.rimPath = null;
    this.clipId = 'mo-aurora-clip-' + Math.random().toString(36).slice(2, 9);
    this._initDOM();
  }

  _initDOM() {
    if (typeof document === 'undefined') return;

    const host = this.container || document.body;
    const isBody = host === document.body;
    const svgNS = 'http://www.w3.org/2000/svg';

    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttribute('class', 'mo-aurora-wave-overlay');
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

    // Glowing rim gradient
    const grad = document.createElementNS(svgNS, 'linearGradient');
    grad.setAttribute('id', `${this.clipId}-grad`);
    grad.setAttribute('x1', '0%');
    grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '100%');
    grad.setAttribute('y2', '0%');
    grad.innerHTML = `
      <stop offset="0%" stop-color="${this.colors[0]}" />
      <stop offset="50%" stop-color="${this.colors[1]}" />
      <stop offset="100%" stop-color="${this.colors[2]}" />
    `;
    defs.appendChild(grad);
    this.svg.appendChild(defs);

    // Glowing aurora rim line
    this.rimPath = document.createElementNS(svgNS, 'path');
    this.rimPath.setAttribute('fill', 'none');
    this.rimPath.setAttribute('stroke', `url(#${this.clipId}-grad)`);
    this.rimPath.setAttribute('stroke-width', '3.5');
    this.rimPath.style.filter = 'drop-shadow(0 0 16px rgba(16, 185, 129, 0.8))';
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
      this.currentPageEl.style.opacity = (1 - progress * 0.4).toFixed(3);
    }

    // Smooth cubic ease from bottom to top
    const ease = 1 - Math.pow(1 - progress, 2.5);
    const currentBaseY = h * (1 - ease);

    const steps = 32;
    const pts = [];

    for (let s = 0; s <= steps; s++) {
      const x = (s / steps) * w;
      const normX = s / steps;
      const wave = Math.sin(normX * Math.PI * 3 + progress * 7) * this.amplitude * (1 - progress * 0.6);
      const y = Math.max(-20, Math.min(h + 20, currentBaseY + wave));
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    const clipD = `M 0,${h} L ${pts.join(' L ')} L ${w},${h} Z`;
    this.clipPathEl.setAttribute('d', clipD);

    if (this.rimPath) {
      this.rimPath.setAttribute('d', `M ${pts.join(' L ')}`);
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
