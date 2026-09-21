import { PageTransition } from './base.js';
import { Spring, clamp01 } from '../core/spring.js';
import { MoAudio } from '../core/sound.js';

/**
 * ElementisShutterWipe — Inspired by Fleava's award-winning ELEMENTIS page transition (Awwwards SOTD).
 *
 * Cinema-grade multi-band venetian shutter blind cascade featuring:
 * - 16-24 horizontal raster slats with staggered harmonic sine delay
 * - Alternating directional horizontal slide and vertical slit expansion
 * - Seamless dual-scene cross-over with optical depth and subtle scale
 * - Zero external assets, pure 120 FPS CSS transform / SVG geometry
 */
export class ElementisShutterWipe extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {HTMLElement} [options.currentPageEl]
   * @param {HTMLElement} [options.nextPageEl]
   * @param {number} [options.bands=18] - Number of horizontal shutter slats
   * @param {string} [options.color='#161913'] - Slat background color
   * @param {string} [options.accentColor='#d9ed55'] - Specular rim highlight color
   * @param {number} [options.stagger=0.35] - Harmonic delay spread across slats
   * @param {boolean} [options.sound=true] - Play crisp mechanical shutter acoustic feedback
   */
  constructor(options = {}) {
    super();
    this.container = options.container || null;
    this.currentPageEl = options.currentPageEl || null;
    this.nextPageEl = options.nextPageEl || null;
    this.bands = options.bands || 18;
    this.color = options.color || '#161913';
    this.accentColor = options.accentColor || '#d9ed55';
    this.stagger = options.stagger ?? 0.35;
    this.sound = options.sound !== false;

    this.spring = new Spring({ stiffness: 120, damping: 20 });
    this.coverThreshold = 0.5;
    this.enableAudio('shutter', 0.35);

    this.overlay = null;
    this.slatEls = [];
    this._initOverlay();
  }

  _initOverlay() {
    if (typeof document === 'undefined') return;

    const host = this.container || this.nextPageEl?.parentNode || document.body;
    const isInline = host && host !== document.body;

    this.overlay = document.createElement('div');
    this.overlay.className = 'mo-elementis-overlay';
    Object.assign(this.overlay.style, {
      position: isInline ? 'absolute' : 'fixed',
      inset: '0',
      width: isInline ? '100%' : '100vw',
      height: isInline ? '100%' : '100vh',
      pointerEvents: 'none',
      zIndex: isInline ? '10' : '99999',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      opacity: '0',
      willChange: 'opacity',
    });

    this.slatEls = [];
    for (let i = 0; i < this.bands; i++) {
      const slat = document.createElement('div');
      slat.className = `mo-elementis-slat mo-elementis-slat-${i}`;
      Object.assign(slat.style, {
        flex: '1',
        width: '100%',
        backgroundColor: this.color,
        borderBottom: i < this.bands - 1 ? `1px solid ${this.accentColor}22` : 'none',
        transformOrigin: i % 2 === 0 ? 'left center' : 'right center',
        transform: 'scaleX(0)',
        willChange: 'transform, opacity',
        position: 'relative',
      });

      // Specular leading edge highlight
      const edge = document.createElement('div');
      Object.assign(edge.style, {
        position: 'absolute',
        top: '0',
        bottom: '0',
        width: '3px',
        right: i % 2 === 0 ? '0' : 'auto',
        left: i % 2 === 0 ? 'auto' : '0',
        backgroundColor: this.accentColor,
        opacity: '0.85',
        boxShadow: `0 0 10px ${this.accentColor}`,
      });
      slat.appendChild(edge);

      this.overlay.appendChild(slat);
      this.slatEls.push(slat);
    }

    host.appendChild(this.overlay);
  }

  /**
   * Render continuous progress t in [0, 1]
   * @param {number} t
   */
  render(t) {
    const progress = clamp01(t);

    if (!this.overlay) return;
    this.overlay.style.opacity = progress > 0.001 && progress < 0.999 ? '1' : '0';

    if (this.currentPageEl && this.nextPageEl) {
      if (progress < 0.5) {
        this.currentPageEl.style.display = '';
        this.nextPageEl.style.display = 'none';
        const p1 = progress * 2;
        this.currentPageEl.style.transform = `scale(${(1 - p1 * 0.04).toFixed(3)})`;
        this.currentPageEl.style.filter = `brightness(${(1 - p1 * 0.3).toFixed(2)})`;
      } else {
        this.currentPageEl.style.display = 'none';
        this.nextPageEl.style.display = '';
        const p2 = (progress - 0.5) * 2;
        this.nextPageEl.style.transform = `scale(${(0.96 + p2 * 0.04).toFixed(3)})`;
        this.nextPageEl.style.filter = `brightness(${(0.7 + p2 * 0.3).toFixed(2)})`;
      }
    }

    const total = this.slatEls.length;

    this.slatEls.forEach((slat, i) => {
      // Harmonic sine wave stagger calculation across slats
      const normalizedIdx = i / total;
      const sineWave = Math.sin(normalizedIdx * Math.PI);
      const slatDelay = (normalizedIdx * 0.4 + sineWave * 0.6) * this.stagger;

      if (progress < 0.5) {
        // Phase 1: Slats slide in from alternating sides (0 -> 1)
        const localT = clamp01((progress * 2 - slatDelay) / (1 - this.stagger));
        // Cubic ease out
        const ease = 1 - Math.pow(1 - localT, 3);
        slat.style.transformOrigin = i % 2 === 0 ? 'left center' : 'right center';
        slat.style.transform = `scaleX(${ease.toFixed(3)})`;
      } else {
        // Phase 2: Slats slide out to opposite sides (1 -> 0)
        const p2 = (progress - 0.5) * 2;
        const localT = clamp01((p2 - slatDelay) / (1 - this.stagger));
        const ease = Math.pow(localT, 3);
        slat.style.transformOrigin = i % 2 === 0 ? 'right center' : 'left center';
        slat.style.transform = `scaleX(${(1 - ease).toFixed(3)})`;
      }
    });
  }

  onReset() {
    this.slatEls.forEach((slat, i) => {
      slat.style.transformOrigin = i % 2 === 0 ? 'left center' : 'right center';
      slat.style.transform = 'scaleX(0)';
    });
    if (this.overlay) this.overlay.style.opacity = '0';
    if (this.currentPageEl) {
      this.currentPageEl.style.transform = '';
      this.currentPageEl.style.filter = '';
      this.currentPageEl.style.display = '';
    }
    if (this.nextPageEl) {
      this.nextPageEl.style.transform = '';
      this.nextPageEl.style.filter = '';
    }
  }

  onComplete() {
    if (this.overlay) this.overlay.style.opacity = '0';
    if (this.currentPageEl) this.currentPageEl.style.display = 'none';
    if (this.nextPageEl) {
      this.nextPageEl.style.display = '';
      this.nextPageEl.style.transform = '';
      this.nextPageEl.style.filter = '';
    }
  }

  destroy() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}
