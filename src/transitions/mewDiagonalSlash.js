import { PageTransition } from './base.js';
import { Spring, clamp01 } from '../core/spring.js';
import { MoAudio } from '../core/sound.js';

/**
 * MewDiagonalSlash — Inspired by Griflan's award-winning Mew transition (Awwwards SOTD).
 *
 * Visceral comic/anime diagonal organic claw slash transition featuring:
 * - 4-6 bold diagonal slashes tearing across the viewport at -40° angle
 * - Procedural organic jagged/sawtooth wave edges rendered via dynamic SVG paths
 * - Asymmetrical spring acceleration with visceral impact
 * - Full-bleed multi-blade expansion and scissor wipe-out
 */
export class MewDiagonalSlash extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {HTMLElement} [options.currentPageEl]
   * @param {HTMLElement} [options.nextPageEl]
   * @param {number} [options.slashCount=4] - Number of diagonal organic claw slashes
   * @param {string} [options.color='#11130e'] - Slash blade fill color
   * @param {string} [options.accentColor='#d9ed55'] - Slash border / rim glow color
   * @param {number} [options.angle=-38] - Slash inclination angle in degrees
   * @param {number} [options.jaggedness=24] - Amplitude of organic wave tooth edge
   * @param {boolean} [options.sound=true] - Procedural acoustic rush
   */
  constructor(options = {}) {
    super();
    this.container = options.container || null;
    this.currentPageEl = options.currentPageEl || null;
    this.nextPageEl = options.nextPageEl || null;
    this.slashCount = Math.max(3, Math.min(8, options.slashCount || 4));
    this.color = options.color || '#11130e';
    this.accentColor = options.accentColor || '#d9ed55';
    this.angle = options.angle ?? -38;
    this.jaggedness = options.jaggedness ?? 24;
    this.sound = options.sound !== false;

    this.spring = new Spring({ stiffness: 140, damping: 18 });
    this.coverThreshold = 0.5;
    this.enableAudio('whoosh', 0.45);

    this.svg = null;
    this.pathEls = [];
    this._initSvg();
  }

  _initSvg() {
    if (typeof document === 'undefined') return;

    const host = this.container || this.nextPageEl?.parentNode || document.body;
    const isInline = host && host !== document.body;

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('class', 'mo-mew-slash-overlay');
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

    this.pathEls = [];
    for (let i = 0; i < this.slashCount; i++) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('fill', this.color);
      path.setAttribute('stroke', this.accentColor);
      path.setAttribute('stroke-width', '1.5');
      this.svg.appendChild(path);
      this.pathEls.push(path);
    }

    host.appendChild(this.svg);
  }

  /**
   * Generates dynamic jagged diagonal polygon path
   * @param {number} progress - [0, 1]
   * @param {number} idx - slash index
   * @param {number} total - total slashes
   * @param {number} w - viewport width
   * @param {number} h - viewport height
   */
  _buildSlashPath(progress, idx, total, w, h) {
    if (progress <= 0.001) return '';

    // Each slash spans across the diagonal with offset
    const span = w + h * 1.5;
    const bandWidth = (span / total) * 1.25;
    const centerOffset = (idx - total / 2 + 0.5) * (bandWidth * 0.9);

    // Current thickness of the slash blade based on progress
    const currentThickness = bandWidth * progress;
    const rad = (this.angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const steps = 24;
    const ptsLeft = [];
    const ptsRight = [];

    const centerX = w / 2 + centerOffset * cos;
    const centerY = h / 2 + centerOffset * sin;

    // Normal vector perpendicular to the slash direction
    const normX = -sin;
    const normY = cos;

    for (let i = 0; i <= steps; i++) {
      const u = (i / steps - 0.5) * span * 1.4;
      const baseX = centerX + u * cos;
      const baseY = centerY + u * sin;

      // Organic jagged ripple perturbations
      const wave = Math.sin(i * 1.8 + idx * 2.2) * this.jaggedness * (1 - Math.abs(u) / (span * 0.7));
      const wave2 = Math.cos(i * 2.2 + idx * 1.4) * (this.jaggedness * 0.6);

      const xL = baseX - normX * (currentThickness * 0.5 + wave);
      const yL = baseY - normY * (currentThickness * 0.5 + wave);

      const xR = baseX + normX * (currentThickness * 0.5 + wave2);
      const yR = baseY + normY * (currentThickness * 0.5 + wave2);

      ptsLeft.push(`${xL.toFixed(1)},${yL.toFixed(1)}`);
      ptsRight.unshift(`${xR.toFixed(1)},${yR.toFixed(1)}`);
    }

    return `M ${ptsLeft.join(' L ')} L ${ptsRight.join(' L ')} Z`;
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

    if (this.currentPageEl && this.nextPageEl) {
      if (progress < 0.5) {
        this.currentPageEl.style.display = '';
        this.nextPageEl.style.display = 'none';
        const p1 = progress * 2;
        this.currentPageEl.style.transform = `scale(${(1 - p1 * 0.05).toFixed(3)}) rotate(${(p1 * -1.5).toFixed(2)}deg)`;
      } else {
        this.currentPageEl.style.display = 'none';
        this.nextPageEl.style.display = '';
        const p2 = (progress - 0.5) * 2;
        this.nextPageEl.style.transform = `scale(${(0.95 + p2 * 0.05).toFixed(3)}) rotate(${((1 - p2) * 1.5).toFixed(2)}deg)`;
      }
    }

    const total = this.pathEls.length;

    this.pathEls.forEach((path, i) => {
      // Staggered slashing delay
      const delay = (i / total) * 0.28;

      let bladeProg = 0;
      if (progress < 0.5) {
        // Phase 1: Slashes tear in and expand
        bladeProg = clamp01((progress * 2 - delay) / (1 - 0.28));
        // Visceral comic curve
        bladeProg = Math.pow(bladeProg, 1.8);
      } else {
        // Phase 2: Slashes expand outward to clear the screen
        const p2 = (progress - 0.5) * 2;
        bladeProg = 1 - clamp01((p2 - delay) / (1 - 0.28));
        bladeProg = Math.pow(bladeProg, 0.7);
      }

      const d = this._buildSlashPath(bladeProg, i, total, w, h);
      path.setAttribute('d', d);
    });
  }

  onReset() {
    this.pathEls.forEach((path) => path.setAttribute('d', ''));
    if (this.svg) this.svg.style.opacity = '0';
    if (this.currentPageEl) {
      this.currentPageEl.style.transform = '';
      this.currentPageEl.style.display = '';
    }
    if (this.nextPageEl) {
      this.nextPageEl.style.transform = '';
    }
  }

  onComplete() {
    if (this.svg) this.svg.style.opacity = '0';
    if (this.currentPageEl) this.currentPageEl.style.display = 'none';
    if (this.nextPageEl) {
      this.nextPageEl.style.display = '';
      this.nextPageEl.style.transform = '';
    }
  }

  destroy() {
    if (this.svg && this.svg.parentNode) {
      this.svg.parentNode.removeChild(this.svg);
    }
  }
}
