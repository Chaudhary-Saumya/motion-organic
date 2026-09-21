import { PageTransition } from './base.js';
import { Spring, clamp01 } from '../core/spring.js';

/**
 * PrismGlassRefraction — Frosted glass prism slab with real-time continuous reveal.
 * Sweeps a physical frosted glass blade across viewport, revealing nextPageEl immediately underneath.
 */
export class PrismGlassRefraction extends PageTransition {
  constructor({
    nextPageEl,
    currentPageEl,
    blur = 28,
    edgeGlow = 'linear-gradient(90deg, #d7ed45, #38bdf8, #d7ed45)',
    container = (typeof document !== 'undefined' ? document.body : null),
    stiffness = 55,
    damping = 15,
    sound = true,
  } = {}) {
    super();
    this.nextPageEl = nextPageEl;
    this.currentPageEl = currentPageEl;
    this.blur = blur;
    this.edgeGlow = edgeGlow;
    this.container = container;
    this.sound = sound;

    this.spring = new Spring({ stiffness, damping });
    this.coverThreshold = 0.5;

    if (sound) {
      this.enableAudio('whoosh', 0.45);
    }

    this.overlay = null;
    this.glassSlab = null;
    this.clipId = 'mo-prism-clip-' + Math.random().toString(36).slice(2, 9);
    this._initDOM();
  }

  _initDOM() {
    if (typeof document === 'undefined') return;

    const host = this.container || document.body;
    const isBody = host === document.body;

    this.overlay = document.createElement('div');
    this.overlay.className = 'mo-prism-glass-overlay';
    Object.assign(this.overlay.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      zIndex: '99999',
      pointerEvents: 'none',
      overflow: 'hidden',
    });

    this.glassSlab = document.createElement('div');
    this.glassSlab.className = 'mo-prism-glass-slab';
    Object.assign(this.glassSlab.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      backdropFilter: `blur(${this.blur}px) saturate(180%)`,
      WebkitBackdropFilter: `blur(${this.blur}px) saturate(180%)`,
      boxShadow: '0 -20px 60px rgba(0,0,0,0.6)',
      transform: 'translate3d(0, 100%, 0)',
      willChange: 'transform',
      borderTop: '2px solid rgba(255,255,255,0.4)',
    });

    const edgeBar = document.createElement('div');
    Object.assign(edgeBar.style, {
      position: 'absolute',
      top: '-2px',
      left: '0',
      right: '0',
      height: '3px',
      background: this.edgeGlow,
      boxShadow: '0 0 20px rgba(215,237,69,0.8), 0 0 35px rgba(56,189,248,0.6)',
    });
    this.glassSlab.appendChild(edgeBar);

    this.overlay.appendChild(this.glassSlab);
    host.appendChild(this.overlay);

    if (this.nextPageEl) {
      this.nextPageEl.style.willChange = 'clip-path, transform, opacity';
    }
  }

  render(t) {
    const progress = clamp01(t);
    if (!this.glassSlab) return;

    if (progress <= 0.0001) {
      this.glassSlab.style.transform = 'translate3d(0, 100%, 0)';
      this.overlay.style.opacity = '0';
      if (this.nextPageEl) {
        this.nextPageEl.style.clipPath = 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)';
        this.nextPageEl.style.webkitClipPath = 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)';
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

    this.overlay.style.opacity = progress < 0.999 ? '1' : '0';

    if (this.nextPageEl) {
      this.nextPageEl.style.opacity = '1';
      this.nextPageEl.style.pointerEvents = 'auto';
    }

    // Ease from bottom (100%) to top (0%)
    const ease = 1 - Math.pow(1 - progress, 2.5);
    const yPercent = (1 - ease) * 100;

    this.glassSlab.style.transform = `translate3d(0, ${yPercent.toFixed(2)}%, 0)`;

    if (this.nextPageEl) {
      const clipPoly = `polygon(0 ${yPercent.toFixed(2)}%, 100% ${yPercent.toFixed(2)}%, 100% 100%, 0 100%)`;
      this.nextPageEl.style.clipPath = clipPoly;
      this.nextPageEl.style.webkitClipPath = clipPoly;
    }

    if (this.currentPageEl) {
      const scale = 1 - progress * 0.04;
      this.currentPageEl.style.transform = `scale(${scale.toFixed(3)})`;
      this.currentPageEl.style.opacity = (1 - progress * 0.3).toFixed(3);
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
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.overlay = null;
    this.glassSlab = null;
  }
}
