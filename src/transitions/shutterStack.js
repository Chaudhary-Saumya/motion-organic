import { PageTransition } from './base.js';
import { engine } from '../core/engine.js';

/**
 * ShutterStack — Mechanical horizontal shutter stack transition.
 * N horizontal bands slide in from alternating sides (odd from left, even from right),
 * stacking tightly to seal the viewport, then retracting to reveal the destination page.
 */
export class ShutterStack extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {number} [options.bands=6] - Number of horizontal shutter bands (4-12)
   * @param {string} [options.color='#0a0a0f'] - Shutter band fill color
   * @param {string} [options.accentColor=null] - Optional accent band color
   * @param {number} [options.stagger=40] - Stagger timing weight
   * @param {HTMLElement} [options.container=document.body] - Container
   * @param {number} [options.stiffness=125] - Spring stiffness
   * @param {number} [options.damping=20] - Spring damping
   */
  constructor({
    bands = 6,
    color = '#0a0a0f',
    accentColor = null,
    stagger = 40,
    container = document.body,
    stiffness = 125,
    damping = 20,
  } = {}) {
    super();
    this.numBands = Math.max(3, bands);
    this.color = color;
    this.accentColor = accentColor;
    this.stagger = stagger;
    this.container = container;
    this.baseSpring.stiffness = stiffness;
    this.baseSpring.damping = damping;

    this.bandEls = [];
    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body;
    this.overlay = document.createElement('div');
    this.overlay.className = 'mo-shutter-stack-overlay';
    Object.assign(this.overlay.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      zIndex: '9999',
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    });

    for (let i = 0; i < this.numBands; i++) {
      const band = document.createElement('div');
      band.className = `mo-shutter-band mo-band-${i}`;
      const isFromLeft = i % 2 === 0;
      const isAccent = this.accentColor && i === Math.floor(this.numBands / 2);

      Object.assign(band.style, {
        flex: '1',
        width: '100%',
        backgroundColor: isAccent ? this.accentColor : this.color,
        transform: isFromLeft ? 'translate3d(-105%, 0, 0)' : 'translate3d(105%, 0, 0)',
        willChange: 'transform',
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      });

      this.bandEls.push({ el: band, isFromLeft, index: i });
      this.overlay.appendChild(band);
    }

    this.container.appendChild(this.overlay);
  }

  /**
   * t in [0, 1]: 0 is offscreen, 1 is fully stacked
   */
  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));
    const count = this.bandEls.length;
    const staggerSpan = 0.4;

    for (let i = 0; i < count; i++) {
      const b = this.bandEls[i];
      const start = (i / count) * staggerSpan;
      const end = start + (1 - staggerSpan);
      const localT = Math.max(0, Math.min(1, (clampedT - start) / (end - start)));

      const sign = b.isFromLeft ? -1 : 1;
      const offset = sign * (105 - localT * 105);
      b.el.style.transform = `translate3d(${offset.toFixed(2)}%, 0, 0)`;
    }
  }

  async trigger(e, onCovered) {
    this.overlay.style.pointerEvents = 'auto';
    this.render(0);

    // Phase 1: Bands slide in from alternating sides to lock shut (0 -> 1)
    await this._springTo(1);
    onCovered?.();

    // Phase 2: Reverse slide out to reveal new page (1 -> 0)
    await this._springTo(0);
    this.overlay.style.pointerEvents = 'none';
  }

  _springTo(target) {
    return new Promise((resolve) => {
      let resolved = false;
      this.baseSpring.onUpdate = (v) => {
        this.render(v);
        if (!resolved && target === 1 && v >= 0.96) {
          resolved = true;
          resolve();
        }
      };
      this.baseSpring.onSettle = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };
      this.baseSpring.set(target);
      engine.add(this.baseSpring);
    });
  }

  onReset() {
    this.render(0);
    this.overlay.style.pointerEvents = 'none';
  }

  destroy() {
    super.destroy();
    this.overlay.remove();
    this.bandEls = [];
  }
}
