/**
 * ScrollTracker — High-precision, zero-overhead passive scroll and velocity physics tracker.
 *
 * Provides normalized, FPS-independent velocity, acceleration, and viewport metrics.
 * Uses a single shared passive listener to eliminate scroll jank across multiple components.
 */
import { clamp01 } from './spring.js';

class ScrollTracker {
  constructor() {
    this.y = typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset || 0) : 0;
    this.x = typeof window !== 'undefined' ? (window.scrollX || window.pageXOffset || 0) : 0;
    this.velocity = 0;        // px/sec (positive = scrolling down, negative = scrolling up)
    this.velocityX = 0;       // px/sec (positive = scrolling right, negative = scrolling left)
    this.speed = 0;           // absolute scalar |velocity|
    this.direction = 0;       // -1 up, 1 down, 0 idle
    this.directionX = 0;      // -1 left, 1 right, 0 idle
    this.acceleration = 0;    // px/sec^2
    this.isScrolling = false; // true while scroll events are firing

    this._lastY = this.y;
    this._lastX = this.x;
    this._lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this._listeners = new Set();
    this._idleTimeout = null;
    this._decayInterval = null;

    if (typeof window !== 'undefined') {
      this._bindEvents();
    }
  }

  _bindEvents() {
    const onScroll = () => {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const dt = Math.max(0.001, Math.min(0.1, (now - this._lastTime) / 1000));
      this._lastTime = now;

      const currentY = window.scrollY || window.pageYOffset || 0;
      const currentX = window.scrollX || window.pageXOffset || 0;
      const rawDeltaY = currentY - this._lastY;
      const rawDeltaX = currentX - this._lastX;

      this._lastY = currentY;
      this._lastX = currentX;
      this.y = currentY;
      this.x = currentX;

      // Calculate instantaneous velocity in px/second
      const instantVelocityY = rawDeltaY / dt;
      const instantVelocityX = rawDeltaX / dt;

      // Exponential Low-Pass Filter (EMA) to filter discrete wheel tick jitter
      const smoothing = 0.35; // balance responsiveness vs stability
      const prevVelocity = this.velocity;
      this.velocity = this.velocity * (1 - smoothing) + instantVelocityY * smoothing;
      this.velocityX = this.velocityX * (1 - smoothing) + instantVelocityX * smoothing;
      this.speed = Math.abs(this.velocity);
      this.acceleration = (this.velocity - prevVelocity) / dt;

      if (rawDeltaY !== 0) {
        this.direction = Math.sign(rawDeltaY);
      }
      if (rawDeltaX !== 0) {
        this.directionX = Math.sign(rawDeltaX);
      }

      this.isScrolling = true;

      // Notify all subscribers
      this._emit();

      // Reset idle detector
      if (this._idleTimeout) clearTimeout(this._idleTimeout);
      this._idleTimeout = setTimeout(() => {
        this._startDecay();
      }, 50);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      this.y = window.scrollY || window.pageYOffset || 0;
      this.x = window.scrollX || window.pageXOffset || 0;
      this._lastY = this.y;
      this._lastX = this.x;
      this._emit();
    }, { passive: true });
  }

  _startDecay() {
    this.isScrolling = false;
    if (this._decayInterval) clearInterval(this._decayInterval);

    // Smoothly relax velocity back to 0 when user stops scrolling
    this._decayInterval = setInterval(() => {
      this.velocity *= 0.7;
      this.velocityX *= 0.7;
      this.speed = Math.abs(this.velocity);

      if (this.speed < 1.0) {
        this.velocity = 0;
        this.velocityX = 0;
        this.speed = 0;
        this.acceleration = 0;
        this.direction = 0;
        this.directionX = 0;
        clearInterval(this._decayInterval);
        this._decayInterval = null;
      }
      this._emit();
    }, 16);
  }

  _emit() {
    this._listeners.forEach((fn) => {
      try {
        fn(this);
      } catch (err) {
        console.warn('[motion-organic] scroll listener error:', err);
      }
    });
  }

  /**
   * Subscribe a callback to scroll updates.
   * @param {(tracker: ScrollTracker) => void} fn
   * @returns {() => void} Unsubscribe function
   */
  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  /**
   * Calculates normalized 0 → 1 progress of an element traversing the viewport.
   * 0 = element top enters viewport bottom.
   * 1 = element bottom leaves viewport top.
   */
  progressOf(el, { offsetStart = 0, offsetEnd = 0 } = {}) {
    if (!el || typeof el.getBoundingClientRect !== 'function') return 0;
    const r = el.getBoundingClientRect();
    const vh = (typeof window !== 'undefined' ? window.innerHeight : 800);
    const start = vh - offsetStart;
    const total = vh + r.height - offsetStart - offsetEnd;
    if (total <= 0) return 0;
    return clamp01((start - r.top) / total);
  }

  /**
   * Check if element is currently inside the viewport (with optional margin).
   */
  isInViewport(el, margin = 100) {
    if (!el || typeof el.getBoundingClientRect !== 'function') return false;
    const r = el.getBoundingClientRect();
    const vh = (typeof window !== 'undefined' ? window.innerHeight : 800);
    const vw = (typeof window !== 'undefined' ? window.innerWidth : 1200);
    return (
      r.bottom >= -margin &&
      r.top <= vh + margin &&
      r.right >= -margin &&
      r.left <= vw + margin
    );
  }
}

export const scrollTracker = new ScrollTracker();
