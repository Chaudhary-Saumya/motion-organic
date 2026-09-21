import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';
import { PageTransition } from './base.js';

/**
 * CardExpandPortal — Apple Keynote / Stripe Press style Hero Card to Fullscreen Morph.
 *
 * Seamlessly expands from a central hero card frame into full bleed viewport.
 * Uses high-performance hardware-accelerated CSS clip-path inset masking with zero DOM detaching.
 */
export class CardExpandPortal extends PageTransition {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.nextPageEl - The incoming scene/page inside the expanding card
   * @param {HTMLElement} [options.currentPageEl] - Outgoing scene
   * @param {HTMLElement} [options.container=document.body] - Container
   * @param {number} [options.initialWidth=240] - Initial card width in px
   * @param {number} [options.initialHeight=200] - Initial card height in px
   * @param {number} [options.initialRadius=20] - Initial border radius in px
   * @param {number} [options.stiffness=110]
   * @param {number} [options.damping=20]
   */
  constructor({
    nextPageEl,
    currentPageEl,
    container = document.body,
    initialWidth = 240,
    initialHeight = 200,
    initialRadius = 20,
    stiffness = 110,
    damping = 20,
  } = {}) {
    super();
    this.nextPageEl = nextPageEl;
    this.currentPageEl = currentPageEl;
    this.container = container;
    this.initialWidth = initialWidth;
    this.initialHeight = initialHeight;
    this.initialRadius = initialRadius;

    this.spring = new Spring({ stiffness, damping });

    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body || !this.container;
    const W = isBody ? window.innerWidth : (this.container.clientWidth || 400);
    const H = isBody ? window.innerHeight : (this.container.clientHeight || 340);

    // Create a subtle card border overlay during morphing
    this.cardBorder = document.createElement('div');
    this.cardBorder.className = 'card-expand-border';
    Object.assign(this.cardBorder.style, {
      position: isBody ? 'fixed' : 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: `${Math.min(this.initialWidth, W * 0.8)}px`,
      height: `${Math.min(this.initialHeight, H * 0.8)}px`,
      borderRadius: `${this.initialRadius}px`,
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(140, 168, 0, 0.3)',
      pointerEvents: 'none',
      zIndex: '9998',
      opacity: '0',
      transition: 'opacity .15s ease',
      willChange: 'width, height, border-radius, opacity',
    });
    this.container.appendChild(this.cardBorder);

    if (this.nextPageEl) {
      this.nextPageEl.style.position = isBody ? 'fixed' : 'absolute';
      this.nextPageEl.style.inset = '0';
      this.nextPageEl.style.zIndex = '2';
      this.nextPageEl.style.willChange = 'clip-path, opacity, transform';
    }

    if (this.currentPageEl) {
      this.currentPageEl.style.willChange = 'opacity, transform, filter';
      this.currentPageEl.style.zIndex = '1';
    }

    this.render(0);
  }

  /**
   * Continuous progress render method (t in [0, 1])
   * @param {number} t
   */
  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));
    const isBody = this.container === document.body || !this.container;
    const W = isBody ? window.innerWidth : (this.container.clientWidth || 400);
    const H = isBody ? window.innerHeight : (this.container.clientHeight || 340);

    const initW = Math.min(this.initialWidth, W * 0.8);
    const initH = Math.min(this.initialHeight, H * 0.8);

    // Organic power easing
    const easeT = Math.pow(clampedT, 1.35);

    const currentW = initW + (W - initW) * easeT;
    const currentH = initH + (H - initH) * easeT;
    const currentRadius = Math.max(0, this.initialRadius * (1 - clampedT * 1.2));

    const insetX = Math.max(0, (W - currentW) / 2);
    const insetY = Math.max(0, (H - currentH) / 2);

    if (this.nextPageEl) {
      if (clampedT <= 0.001) {
        this.nextPageEl.style.opacity = '0';
        this.nextPageEl.style.clipPath = `inset(${insetY.toFixed(1)}px ${insetX.toFixed(1)}px ${insetY.toFixed(1)}px ${insetX.toFixed(1)}px round ${currentRadius.toFixed(1)}px)`;
        this.nextPageEl.style.webkitClipPath = `inset(${insetY.toFixed(1)}px ${insetX.toFixed(1)}px ${insetY.toFixed(1)}px ${insetX.toFixed(1)}px round ${currentRadius.toFixed(1)}px)`;
        this.nextPageEl.style.pointerEvents = 'none';
      } else if (clampedT >= 0.999) {
        this.nextPageEl.style.opacity = '1';
        this.nextPageEl.style.clipPath = 'none';
        this.nextPageEl.style.webkitClipPath = 'none';
        this.nextPageEl.style.pointerEvents = 'auto';
      } else {
        this.nextPageEl.style.opacity = '1';
        this.nextPageEl.style.clipPath = `inset(${insetY.toFixed(1)}px ${insetX.toFixed(1)}px ${insetY.toFixed(1)}px ${insetX.toFixed(1)}px round ${currentRadius.toFixed(1)}px)`;
        this.nextPageEl.style.webkitClipPath = `inset(${insetY.toFixed(1)}px ${insetX.toFixed(1)}px ${insetY.toFixed(1)}px ${insetX.toFixed(1)}px round ${currentRadius.toFixed(1)}px)`;
        this.nextPageEl.style.pointerEvents = clampedT > 0.7 ? 'auto' : 'none';
      }
    }

    if (this.cardBorder) {
      this.cardBorder.style.width = `${currentW.toFixed(1)}px`;
      this.cardBorder.style.height = `${currentH.toFixed(1)}px`;
      this.cardBorder.style.borderRadius = `${currentRadius.toFixed(1)}px`;
      const borderOpacity = clampedT <= 0.001 || clampedT >= 0.98 ? 0 : Math.sin(clampedT * Math.PI);
      this.cardBorder.style.opacity = String(borderOpacity.toFixed(2));
    }

    if (this.currentPageEl) {
      const outBlur = clampedT * 12;
      const outScale = 1 - clampedT * 0.06;
      const outOpacity = Math.max(0, 1 - clampedT * 1.4);
      this.currentPageEl.style.transform = `scale(${outScale.toFixed(3)})`;
      this.currentPageEl.style.filter = outBlur > 0.1 ? `blur(${outBlur.toFixed(1)}px)` : 'none';
      this.currentPageEl.style.opacity = String(outOpacity.toFixed(2));
      this.currentPageEl.style.pointerEvents = clampedT > 0.3 ? 'none' : 'auto';
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
    if (this.cardBorder) this.cardBorder.style.opacity = '0';
    if (this.nextPageEl) {
      this.nextPageEl.style.opacity = '1';
      this.nextPageEl.style.clipPath = 'none';
      this.nextPageEl.style.webkitClipPath = 'none';
      this.nextPageEl.style.pointerEvents = 'auto';
      this.nextPageEl.style.zIndex = '2';
    }
    if (this.currentPageEl) {
      this.currentPageEl.style.opacity = '0';
      this.currentPageEl.style.pointerEvents = 'none';
    }
  }

  onReset() {
    if (this.cardBorder) this.cardBorder.style.opacity = '0';
    if (this.currentPageEl) {
      this.currentPageEl.style.opacity = '1';
      this.currentPageEl.style.transform = 'scale(1)';
      this.currentPageEl.style.filter = 'none';
      this.currentPageEl.style.pointerEvents = 'auto';
    }
    if (this.nextPageEl) {
      this.nextPageEl.style.opacity = '0';
      this.nextPageEl.style.pointerEvents = 'none';
    }
    this.render(0);
  }

  destroy() {
    super.destroy();
    if (this.cardBorder) this.cardBorder.remove();
  }
}
