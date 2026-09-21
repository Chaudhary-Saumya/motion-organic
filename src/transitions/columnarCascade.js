import { PageTransition } from './base.js';
import { engine } from '../core/engine.js';

/**
 * ColumnarCascade — Vertical column waterfall stagger transition.
 * Splits the viewport into N vertical columns that slide down (or up)
 * in a cascading waterfall sequence with individual spring overshoots.
 */
export class ColumnarCascade extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {number} [options.columns=8] - Number of vertical columns
   * @param {string} [options.direction='down'] - 'down' | 'up'
   * @param {string} [options.color='#0c0c14'] - Column fill color
   * @param {string} [options.accentColor='#e11d48'] - Optional accent column color
   * @param {number} [options.stagger=50] - Stagger delay in ms weight
   * @param {HTMLElement} [options.container=document.body] - Container
   * @param {number} [options.stiffness=110] - Spring stiffness
   * @param {number} [options.damping=19] - Spring damping
   */
  constructor({
    columns = 8,
    direction = 'down',
    color = '#0c0c14',
    accentColor = null,
    stagger = 50,
    container = document.body,
    stiffness = 110,
    damping = 19,
  } = {}) {
    super();
    this.numCols = Math.max(2, columns);
    this.direction = direction;
    this.color = color;
    this.accentColor = accentColor;
    this.stagger = stagger;
    this.container = container;
    this.baseSpring.stiffness = stiffness;
    this.baseSpring.damping = damping;

    this.cols = [];
    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body;
    this.overlay = document.createElement('div');
    this.overlay.className = 'mo-column-cascade-overlay';
    Object.assign(this.overlay.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      zIndex: '9999',
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden',
    });

    const isDown = this.direction === 'down';
    const initTransform = isDown ? 'translate3d(0, -100%, 0)' : 'translate3d(0, 100%, 0)';

    for (let i = 0; i < this.numCols; i++) {
      const col = document.createElement('div');
      col.className = `mo-column-strip mo-col-${i}`;
      const isAccent = this.accentColor && (i === 1 || i === this.numCols - 2);
      Object.assign(col.style, {
        flex: '1',
        height: '100%',
        backgroundColor: isAccent ? this.accentColor : this.color,
        transform: initTransform,
        willChange: 'transform',
      });

      this.cols.push(col);
      this.overlay.appendChild(col);
    }

    this.container.appendChild(this.overlay);
  }

  /**
   * t in [0, 1]: 0 is offscreen, 1 is fully covering
   */
  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));
    const isDown = this.direction === 'down';
    const sign = isDown ? -1 : 1;
    const count = this.cols.length;
    const staggerSpan = 0.45; // Fraction of timeline dedicated to stagger spread

    for (let i = 0; i < count; i++) {
      const col = this.cols[i];
      // Waterfall stagger from left to right
      const start = (i / count) * staggerSpan;
      const end = start + (1 - staggerSpan);
      const localT = Math.max(0, Math.min(1, (clampedT - start) / (end - start)));

      // Translation from 100% (offscreen) to 0% (covered)
      const offsetPercent = sign * (100 - localT * 100);
      col.style.transform = `translate3d(0, ${offsetPercent.toFixed(2)}%, 0)`;
    }
  }

  async trigger(e, onCovered) {
    this.overlay.style.pointerEvents = 'auto';
    this.render(0);

    // Phase 1: Cascade columns down to cover (0 -> 1)
    await this._springTo(1);
    onCovered?.();

    // Phase 2: Cascade columns away (continue in same direction out)
    await this._cascadeExit();
    this.overlay.style.pointerEvents = 'none';
  }

  _cascadeExit() {
    return new Promise((resolve) => {
      const count = this.cols.length;
      const isDown = this.direction === 'down';
      const exitSign = isDown ? 1 : -1;

      // Animate exit where columns slide off the opposite edge
      this.baseSpring.jumpTo(0);
      this.baseSpring.onUpdate = (v) => {
        const clampedT = Math.max(0, Math.min(1, v));
        const staggerSpan = 0.45;
        for (let i = 0; i < count; i++) {
          const col = this.cols[i];
          const start = (i / count) * staggerSpan;
          const end = start + (1 - staggerSpan);
          const localT = Math.max(0, Math.min(1, (clampedT - start) / (end - start)));
          const offsetPercent = exitSign * (localT * 100);
          col.style.transform = `translate3d(0, ${offsetPercent.toFixed(2)}%, 0)`;
        }
      };
      this.baseSpring.onSettle = () => {
        this.render(0);
        resolve();
      };
      this.baseSpring.set(1);
      engine.add(this.baseSpring);
    });
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
    this.cols = [];
  }
}
