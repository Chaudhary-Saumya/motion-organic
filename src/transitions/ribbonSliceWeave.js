import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';
import { PageTransition } from './base.js';

/**
 * RibbonSliceWeave — Multi-Slice Parallax Ribbon Weave.
 *
 * Viewport splits into N horizontal interleaved ribbons.
 * As scroll or trigger progress goes 0 → 1:
 * - Odd slices translate left (-100vw) and even slices translate right (+100vw).
 * - Slices have staggered spring velocity and depth drop shadows.
 * - Destination scene expands into full-bleed view beneath.
 */
export class RibbonSliceWeave extends PageTransition {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.nextPageEl
   * @param {HTMLElement} [options.currentPageEl]
   * @param {HTMLElement} [options.container=document.body]
   * @param {number} [options.slices=7]
   * @param {number} [options.stiffness=100]
   * @param {number} [options.damping=22]
   */
  constructor({
    nextPageEl,
    currentPageEl,
    container = document.body,
    slices = 7,
    stiffness = 100,
    damping = 22,
  } = {}) {
    super();
    this.nextPageEl = nextPageEl;
    this.currentPageEl = currentPageEl;
    this.container = container;
    this.numSlices = slices;

    this.spring = new Spring({ stiffness, damping });
    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body;

    this.wrapper = document.createElement('div');
    this.wrapper.className = 'ribbon-slice-weave-wrapper';
    Object.assign(this.wrapper.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: '9998',
    });

    this.ribbonElements = [];
    const sliceH = 100 / this.numSlices;

    for (let i = 0; i < this.numSlices; i++) {
      const ribbon = document.createElement('div');
      ribbon.className = `ribbon-slice ribbon-slice-${i}`;
      Object.assign(ribbon.style, {
        position: 'absolute',
        top: `${(i * sliceH).toFixed(2)}%`,
        left: '0',
        width: '100%',
        height: `${(sliceH + 0.5).toFixed(2)}%`,
        background: i % 2 === 0 ? '#0e0e18' : '#141424',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        willChange: 'transform, opacity',
      });

      this.wrapper.appendChild(ribbon);
      this.ribbonElements.push({
        el: ribbon,
        direction: i % 2 === 0 ? -1 : 1,
        stagger: (i / this.numSlices) * 0.25,
      });
    }

    this.container.appendChild(this.wrapper);

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
    const vw = window.innerWidth;

    this.ribbonElements.forEach(({ el, direction, stagger }) => {
      const sliceT = Math.max(0, Math.min(1, (clampedT - stagger) / (1 - stagger)));
      const easeT = Math.pow(sliceT, 1.4);
      const shiftX = direction * easeT * (vw * 1.1);
      const opacity = Math.max(0, 1 - sliceT * 1.1);

      el.style.transform = `translateX(${shiftX.toFixed(1)}px)`;
      el.style.opacity = opacity.toFixed(3);
    });

    // Outgoing scene fades
    if (this.currentPageEl) {
      const outScale = 1 - clampedT * 0.05;
      const outOpacity = Math.max(0, 1 - clampedT * 1.3);
      this.currentPageEl.style.transform = `scale(${outScale.toFixed(3)})`;
      this.currentPageEl.style.opacity = outOpacity.toFixed(3);
      this.currentPageEl.style.pointerEvents = clampedT > 0.5 ? 'none' : 'auto';
    }

    // Destination scene expands into place
    if (this.nextPageEl) {
      const inScale = 1.08 - clampedT * 0.08;
      const inOpacity = Math.min(1, clampedT * 1.5);
      this.nextPageEl.style.transform = `scale(${inScale.toFixed(3)})`;
      this.nextPageEl.style.opacity = inOpacity.toFixed(3);
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
    this.ribbonElements.forEach(({ el }) => {
      el.style.opacity = '0';
    });
    if (this.nextPageEl) {
      this.nextPageEl.style.opacity = '1';
      this.nextPageEl.style.transform = 'scale(1)';
      this.nextPageEl.style.pointerEvents = 'auto';
    }
    if (this.currentPageEl) {
      this.currentPageEl.style.opacity = '0';
      this.currentPageEl.style.pointerEvents = 'none';
    }
  }

  onReset() {
    this.ribbonElements.forEach(({ el }) => {
      el.style.transform = 'translateX(0px)';
      el.style.opacity = '1';
    });
    if (this.currentPageEl) {
      this.currentPageEl.style.opacity = '1';
      this.currentPageEl.style.transform = 'scale(1)';
      this.currentPageEl.style.pointerEvents = 'auto';
    }
    if (this.nextPageEl) {
      this.nextPageEl.style.opacity = '0';
      this.nextPageEl.style.transform = 'scale(1.08)';
      this.nextPageEl.style.pointerEvents = 'none';
    }
    this.render(0);
  }

  destroy() {
    super.destroy();
    this.wrapper.remove();
  }
}
