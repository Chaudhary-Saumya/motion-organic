/**
 * Engine — one requestAnimationFrame loop shared by every Spring in the
 * page, instead of each primitive running its own rAF (which is how most
 * hand-rolled scroll effects end up janky once you stack 5+ of them).
 *
 * Also applies frame-time clamping (max 32ms step) so a dropped frame or a
 * tab-switch doesn't cause a spring to "explode" from a huge dt.
 */
class Engine {
  constructor() {
    /** @type {Set<import('./spring.js').Spring | Function>} */
    this.springs = new Set();
    this._running = false;
    this._last = 0;
    this._tick = this._tick.bind(this);
  }

  add(item) {
    if (!item) return;
    this.springs.add(item);
    this._start();
  }

  remove(item) {
    if (!item) return;
    this.springs.delete(item);
  }

  _start() {
    if (this._running) return;
    if (typeof requestAnimationFrame === 'undefined') return;
    this._running = true;
    this._last = typeof performance !== 'undefined' ? performance.now() : Date.now();
    requestAnimationFrame(this._tick);
  }

  _tick(now) {
    if (typeof requestAnimationFrame === 'undefined') {
      this._running = false;
      return;
    }

    const currentTime = now || (typeof performance !== 'undefined' ? performance.now() : Date.now());
    const dt = Math.min((currentTime - this._last) / 1000, 0.032);
    this._last = currentTime;

    for (const item of [...this.springs]) {
      if (typeof item === 'function') {
        try {
          item(dt);
        } catch (e) {
          console.warn('[motion-organic] ticker error:', e);
        }
      } else if (item && typeof item.step === 'function') {
        const settled = item.step(dt);
        item.onUpdate?.(item.value, item.velocity);
        if (settled) {
          this.springs.delete(item);
          item.onSettle?.();
        }
      }
    }

    if (this.springs.size > 0) {
      requestAnimationFrame(this._tick);
    } else {
      this._running = false;
    }
  }
}

export const engine = new Engine();

