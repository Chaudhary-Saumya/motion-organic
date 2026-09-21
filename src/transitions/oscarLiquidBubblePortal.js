import { PageTransition } from './base.js';
import { Spring, clamp01 } from '../core/spring.js';
import { MoAudio } from '../core/sound.js';

/**
 * OscarLiquidBubblePortal — Inspired by Oscar Pico's award-winning Portfolio@24 (Awwwards SOTD).
 *
 * Viscous liquid bubble circular portal transition featuring:
 * - Organic circular liquid aperture expanding from click origin or center
 * - Multi-harmonic perimeter wobble computed via 12-point cubic bezier spline curves
 * - Viscous surface tension oscillation with harmonic spring relaxation
 * - Smooth optical depth zooming and specular rim highlight
 */
export class OscarLiquidBubblePortal extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {HTMLElement} [options.currentPageEl]
   * @param {HTMLElement} [options.nextPageEl]
   * @param {number} [options.points=12] - Spline control points for organic perimeter
   * @param {number} [options.wobble=0.18] - Viscous perimeter perturbation amplitude
   * @param {string} [options.rimColor='#d9ed55'] - Specular liquid rim border color
   * @param {string} [options.maskColor='#141711'] - Liquid portal curtain fill color
   * @param {boolean} [options.sound=true] - Procedural liquid audio
   */
  constructor(options = {}) {
    super();
    this.container = options.container || null;
    this.currentPageEl = options.currentPageEl || null;
    this.nextPageEl = options.nextPageEl || null;
    this.points = Math.max(8, Math.min(24, options.points || 12));
    this.wobble = options.wobble ?? 0.18;
    this.rimColor = options.rimColor || '#d9ed55';
    this.maskColor = options.maskColor || '#141711';
    this.sound = options.sound !== false;

    this.origin = { x: 0.5, y: 0.5 };
    this.spring = new Spring({ stiffness: 100, damping: 20 });
    this.enableAudio('liquid', 0.4);

    this.svg = null;
    this._clipPathId = `mo-oscar-bubble-${Math.random().toString(36).slice(2, 8)}`;
    this._initSvg();
  }

  _initSvg() {
    if (typeof document === 'undefined') return;

    const host = this.container || this.nextPageEl?.parentNode || document.body;
    const isInline = host && host !== document.body;

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('class', 'mo-oscar-bubble-overlay');
    Object.assign(this.svg.style, {
      position: isInline ? 'absolute' : 'fixed',
      inset: '0',
      width: isInline ? '100%' : '100vw',
      height: isInline ? '100%' : '100vh',
      pointerEvents: 'none',
      zIndex: isInline ? '10' : '99999',
      opacity: '0',
      willChange: 'opacity',
    });

    this.svg.innerHTML = `
      <defs>
        <clipPath id="${this._clipPathId}">
          <path id="${this._clipPathId}-path" d="" />
        </clipPath>
      </defs>
      <path id="${this._clipPathId}-rim" fill="none" stroke="${this.rimColor}" stroke-width="3" opacity="0.85" />
    `;

    this.clipPathEl = this.svg.querySelector(`#${this._clipPathId}-path`);
    this.rimPathEl = this.svg.querySelector(`#${this._clipPathId}-rim`);

    host.appendChild(this.svg);
  }

  /**
   * Generates organic multi-lobe liquid bubble perimeter path
   * @param {number} radius - current pixel radius
   * @param {number} cx - center x in px
   * @param {number} cy - center y in px
   * @param {number} t - progress [0, 1]
   */
  _buildBubblePath(radius, cx, cy, t) {
    if (radius <= 1) return '';

    const pts = [];
    const n = this.points;
    const wobbleAmount = this.wobble * Math.sin(t * Math.PI) * radius;

    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2;
      // Multi-frequency harmonic perturbation
      const wave =
        Math.sin(angle * 3 + t * 8) * 0.5 +
        Math.cos(angle * 5 - t * 6) * 0.3 +
        Math.sin(angle * 2 + t * 4) * 0.2;

      const r = radius + wave * wobbleAmount;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      pts.push({ x, y });
    }

    // Connect points with smooth cubic bezier curve
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % n];
      const p3 = pts[(i + 2) % n];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    d += ' Z';
    return d;
  }

  /**
   * Set trigger event origin (e.g. cursor click coordinate)
   */
  setOrigin(x, y) {
    const host = this.container || document.body;
    const isInline = host && host !== document.body;
    const w = isInline ? (host.clientWidth || 800) : (typeof window !== 'undefined' ? window.innerWidth : 1200);
    const h = isInline ? (host.clientHeight || 500) : (typeof window !== 'undefined' ? window.innerHeight : 800);
    this.origin = {
      x: typeof x === 'number' ? x / w : 0.5,
      y: typeof y === 'number' ? y / h : 0.5,
    };
  }

  async trigger(e, onCovered) {
    if (e && typeof e.clientX === 'number') {
      this.setOrigin(e.clientX, e.clientY);
    }
    return super.trigger(e, onCovered);
  }

  /**
   * Render continuous progress t in [0, 1]
   * @param {number} t
   */
  render(t) {
    const progress = clamp01(t);

    if (!this.svg) return;
    this.svg.style.opacity = progress > 0.001 && progress < 0.999 ? '1' : '0';

    const host = this.container || document.body;
    const isInline = host && host !== document.body;
    const w = isInline ? (host.clientWidth || 800) : (typeof window !== 'undefined' ? window.innerWidth : 1200);
    const h = isInline ? (host.clientHeight || 500) : (typeof window !== 'undefined' ? window.innerHeight : 800);
    this.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    const cx = this.origin.x * w;
    const cy = this.origin.y * h;

    // Maximum corner distance from center
    const maxRadius = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * 1.35;
    const currentRadius = maxRadius * Math.pow(progress, 1.4);

    const d = this._buildBubblePath(currentRadius, cx, cy, progress);
    if (this.clipPathEl) this.clipPathEl.setAttribute('d', d);
    if (this.rimPathEl) this.rimPathEl.setAttribute('d', d);

    if (this.nextPageEl) {
      this.nextPageEl.style.display = '';
      this.nextPageEl.style.clipPath = `url(#${this._clipPathId})`;
      this.nextPageEl.style.webkitClipPath = `url(#${this._clipPathId})`;
      // Zoom out from 1.08 to 1.0 for cinematic immersion
      const zoom = 1.08 - progress * 0.08;
      this.nextPageEl.style.transform = `scale(${zoom.toFixed(3)})`;
    }

    if (this.currentPageEl) {
      // Zoom in slightly and fade out
      const p1 = Math.min(1, progress * 1.5);
      this.currentPageEl.style.transform = `scale(${(1 + p1 * 0.04).toFixed(3)})`;
      this.currentPageEl.style.opacity = `${(1 - p1 * 0.8).toFixed(2)}`;
    }
  }

  onReset() {
    if (this.clipPathEl) this.clipPathEl.setAttribute('d', '');
    if (this.rimPathEl) this.rimPathEl.setAttribute('d', '');
    if (this.svg) this.svg.style.opacity = '0';
    if (this.nextPageEl) {
      this.nextPageEl.style.clipPath = '';
      this.nextPageEl.style.webkitClipPath = '';
      this.nextPageEl.style.transform = '';
    }
    if (this.currentPageEl) {
      this.currentPageEl.style.transform = '';
      this.currentPageEl.style.opacity = '';
      this.currentPageEl.style.display = '';
    }
  }

  onComplete() {
    if (this.svg) this.svg.style.opacity = '0';
    if (this.currentPageEl) {
      this.currentPageEl.style.display = 'none';
      this.currentPageEl.style.transform = '';
      this.currentPageEl.style.opacity = '';
    }
    if (this.nextPageEl) {
      this.nextPageEl.style.display = '';
      this.nextPageEl.style.clipPath = '';
      this.nextPageEl.style.webkitClipPath = '';
      this.nextPageEl.style.transform = '';
    }
  }

  destroy() {
    if (this.svg && this.svg.parentNode) {
      this.svg.parentNode.removeChild(this.svg);
    }
    if (this.nextPageEl) {
      this.nextPageEl.style.clipPath = '';
      this.nextPageEl.style.webkitClipPath = '';
    }
  }
}
