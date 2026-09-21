import { PageTransition } from './base.js';
import { Spring, clamp01 } from '../core/spring.js';
import { engine } from '../core/engine.js';
import { MoAudio } from '../core/sound.js';

/**
 * ChromaticCurtainCascade — Multi-column chromatic gradient curtain transition.
 *
 * Inspired by Webflow's iconic NoCodeTribe staggered gradient curtain:
 * - 5 to 7 full-height vertical columns rendered in a harmonic gradient progression
 * - Asymmetrical spring wave delay across columns for a fluid cascading ripple
 * - Top specular accent strips on each column
 * - Zero-delay midpoint occlusion hook (calls onCovered at t = 0.5)
 * - Two-phase continuous sweep (Phase 1: Columns cascade in -> Midpoint swap -> Phase 2: Columns sweep away)
 */
export class ChromaticCurtainCascade extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {string[]} [options.colors] - Array of column gradient colors (default: 5-step oceanic gradient)
   * @param {string[]} [options.accentColors] - Optional top strip accent colors
   * @param {boolean} [options.accentBars=true] - Display top accent stripe headers
   * @param {'up'|'down'|'left'|'right'} [options.direction='up'] - Sweep direction
   * @param {number} [options.stagger=0.4] - Harmonic stagger spread across columns (0.1 to 0.7)
   * @param {HTMLElement} [options.container=document.body] - Target container
   * @param {number} [options.stiffness=130] - Spring stiffness
   * @param {number} [options.damping=19] - Spring damping
   * @param {boolean} [options.sound=true] - Procedural acoustic sweep
   */
  constructor({
    colors = ['#e0f7fa', '#80deea', '#26c6da', '#0097a7', '#006064'],
    accentColors = ['#e76f51', '#f4a261', '#e9c46a', '#2a9d8f', '#264653'],
    accentBars = true,
    direction = 'up',
    stagger = 0.4,
    container = (typeof document !== 'undefined' ? document.body : null),
    stiffness = 130,
    damping = 19,
    sound = true,
  } = {}) {
    super();
    this.colors = colors && colors.length > 0 ? colors : ['#e0f7fa', '#80deea', '#26c6da', '#0097a7', '#006064'];
    this.accentColors = accentColors && accentColors.length > 0 ? accentColors : ['#e76f51', '#f4a261', '#e9c46a', '#2a9d8f', '#264653'];
    this.accentBars = accentBars;
    this.direction = direction;
    this.stagger = Math.max(0.1, Math.min(0.8, stagger));
    this.container = container;
    this.sound = sound;

    this.spring = new Spring({ stiffness, damping });
    this.coverThreshold = 0.5;

    if (sound) {
      this.enableAudio('whoosh', 0.45);
    }

    this.overlay = null;
    this.columns = [];
    this._initDOM();
  }

  _initDOM() {
    if (typeof document === 'undefined') return;

    const host = this.container || document.body;
    const isBody = host === document.body;

    this.overlay = document.createElement('div');
    this.overlay.className = 'mo-chromatic-curtain-overlay';
    Object.assign(this.overlay.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      zIndex: '99999',
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden',
    });

    const total = this.colors.length;

    for (let i = 0; i < total; i++) {
      const col = document.createElement('div');
      col.className = `mo-chromatic-col mo-col-${i}`;
      const color = this.colors[i];
      const accentColor = this.accentColors[i % this.accentColors.length];

      Object.assign(col.style, {
        flex: '1',
        height: '100%',
        backgroundColor: color,
        transformOrigin: this.direction === 'down' ? 'top center' : 'bottom center',
        transform: 'scaleY(0)',
        willChange: 'transform',
        position: 'relative',
        boxShadow: '0 0 20px rgba(0,0,0,0.15)',
      });

      // Optional top accent header bar
      if (this.accentBars) {
        const bar = document.createElement('div');
        bar.className = 'mo-chromatic-accent-bar';
        Object.assign(bar.style, {
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '5px',
          backgroundColor: accentColor,
          zIndex: '2',
        });
        col.appendChild(bar);
      }

      this.columns.push(col);
      this.overlay.appendChild(col);
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

    const total = this.columns.length;

    this.columns.forEach((col, i) => {
      // Staggered calculation across column array
      const normalizedIdx = i / total;
      const colDelay = normalizedIdx * this.stagger;

      if (progress < 0.5) {
        // Phase 1: Columns cascade in to cover (0 -> 1)
        const localT = clamp01((progress * 2 - colDelay) / (1 - this.stagger));
        // Power3 ease-out
        const ease = 1 - Math.pow(1 - localT, 3);
        col.style.transformOrigin = this.direction === 'down' ? 'top center' : 'bottom center';
        col.style.transform = `scaleY(${ease.toFixed(3)})`;
      } else {
        // Phase 2: Columns sweep away in same direction to reveal (1 -> 0)
        const p2 = (progress - 0.5) * 2;
        const localT = clamp01((p2 - colDelay) / (1 - this.stagger));
        // Power3 ease-in
        const ease = Math.pow(localT, 3);
        col.style.transformOrigin = this.direction === 'down' ? 'bottom center' : 'top center';
        col.style.transform = `scaleY(${(1 - ease).toFixed(3)})`;
      }
    });
  }

  onReset() {
    this.columns.forEach((col) => {
      col.style.transformOrigin = this.direction === 'down' ? 'top center' : 'bottom center';
      col.style.transform = 'scaleY(0)';
    });
    if (this.overlay) this.overlay.style.opacity = '0';
  }

  onComplete() {
    if (this.overlay) this.overlay.style.opacity = '0';
  }

  destroy(force = false) {
    if (this.isTransitionActive && !force) return;
    super.destroy?.(force);
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.overlay = null;
    this.columns = [];
  }
}
