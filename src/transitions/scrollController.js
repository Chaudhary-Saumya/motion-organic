import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';

/**
 * ScrollTransitionController — Decouples HOW a transition is triggered from
 * WHAT it looks like. Any transition or renderer exposing `render(t)` for
 * t in [0, 1] can be plugged directly into this controller to become an
 * organic scroll-driven experience.
 *
 * Senior Engineering Architecture:
 * - Continuous bi-directional scrubbing (scrub down to advance, scrub up to reverse)
 * - Velocity-aware momentum snapping (when the user stops mid-way, it checks
 *   scroll speed & trajectory to smoothly snap to 0 or 1 with Spring physics)
 * - Zero desync between DOM scroll events and WebGL/SVG/Canvas renderers
 * - Progress event subscription for telemetry, progress bars, and HUDs
 */
export class ScrollTransitionController {
  /**
   * @param {HTMLElement} zoneEl - The tall scroll container (e.g. 250vh-350vh)
   * @param {{render:(t:number)=>void, onComplete?:()=>void, onReset?:()=>void}} renderer
   * @param {Object} [options]
   * @param {number} [options.snapStiffness=140] - Spring stiffness for snap
   * @param {number} [options.snapDamping=22] - Spring damping for snap
   * @param {number} [options.settleDelay=140] - Milliseconds of scroll silence before snapping
   * @param {boolean} [options.lockOnComplete=false] - Whether to lock permanently at t=1 or allow bi-directional scrubbing
   * @param {(progress: number, velocity: number) => void} [options.onProgress] - Progress listener
   */
  constructor(zoneEl, renderer, {
    snapStiffness = 140,
    snapDamping = 22,
    settleDelay = 140,
    lockOnComplete = false,
    onProgress = null,
  } = {}) {
    this.zoneEl = zoneEl;
    this.renderer = renderer;
    this.snapStiffness = snapStiffness;
    this.snapDamping = snapDamping;
    this.settleDelay = settleDelay;
    this.lockOnComplete = lockOnComplete;
    this.onProgress = onProgress;

    this.progress = 0;
    this.committed = false;
    this._isSnapping = false;
    this._settleTimer = null;
    this._lastScrollY = window.scrollY;
    this._velocity = 0;

    this._onScroll = () => this._handleScroll();
    window.addEventListener('scroll', this._onScroll, { passive: true });

    this.snapSpring = new Spring({ stiffness: snapStiffness, damping: snapDamping });
    this.snapSpring.onUpdate = (v) => {
      const clamped = Math.max(0, Math.min(1, v));
      this.progress = clamped;
      this.renderer.render(clamped);
      this.onProgress?.(clamped, this._velocity);
    };
  }

  _handleScroll() {
    if (this.committed && this.lockOnComplete) return;

    const y = window.scrollY;
    const dy = y - this._lastScrollY;
    this._velocity = this._velocity * 0.6 + dy * 0.4;
    this._lastScrollY = y;

    const rect = this.zoneEl.getBoundingClientRect();
    const zoneHeight = this.zoneEl.offsetHeight - window.innerHeight;
    
    // Only calculate progress when in or adjacent to the scroll zone
    if (rect.top <= window.innerHeight && rect.bottom >= 0 && zoneHeight > 0) {
      const t = Math.max(0, Math.min(1, -rect.top / zoneHeight));
      
      this.progress = t;
      this.renderer.render(t);
      this.onProgress?.(t, this._velocity);

      // Debounce snapping when resting between 2% and 98%
      clearTimeout(this._settleTimer);
      if (t > 0.02 && t < 0.98) {
        this._settleTimer = setTimeout(() => this._snap(), this.settleDelay);
      } else if (t >= 0.99) {
        if (!this.committed) {
          this.committed = true;
          this.renderer.onComplete?.();
        }
      } else if (t <= 0.01) {
        if (this.committed) {
          this.committed = false;
          this.renderer.onReset?.();
        }
      }
    }
  }

  _snap() {
    if (this.committed && this.lockOnComplete) return;
    
    // Determine trajectory: forward if moving down (velocity > 0) or past halfway
    const headingForward = this._velocity > 2 ? true : (this._velocity < -2 ? false : this.progress > 0.5);
    const target = headingForward ? 1 : 0;

    this.snapSpring.jumpTo(this.progress);
    this.snapSpring.set(target);
    this.snapSpring.onSettle = () => {
      this._isSnapping = false;
      if (target === 1) {
        this.committed = true;
        this.renderer.onComplete?.();
      } else {
        this.committed = false;
        this.renderer.onReset?.();
      }
    };
    this._isSnapping = true;
    engine.add(this.snapSpring);
  }

  reset() {
    this.committed = false;
    this.progress = 0;
    this.snapSpring.jumpTo(0);
    this.renderer.render(0);
    this.renderer.onReset?.();
    this.onProgress?.(0, 0);
  }

  destroy() {
    window.removeEventListener('scroll', this._onScroll);
    clearTimeout(this._settleTimer);
  }
}
