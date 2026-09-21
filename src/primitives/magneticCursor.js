import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';

/**
 * MagneticCursor — el is gently pulled toward the cursor while the cursor
 * is within `radius` px, and springs back to rest the moment the cursor
 * leaves — using two independent springs (x, y) so a fast mouse-out mid
 * pull still resolves with natural momentum instead of snapping to (0,0).
 */
export class MagneticCursor {
  constructor(el, { radius = 80, strength = 0.4, stiffness = 150, damping = 15 } = {}) {
    this.el = el;
    this.radius = radius;
    this.strength = strength;

    this.x = new Spring({ stiffness, damping });
    this.y = new Spring({ stiffness, damping });
    const render = () => {
      el.style.transform = `translate3d(${this.x.value.toFixed(2)}px, ${this.y.value.toFixed(2)}px, 0)`;
    };
    this.x.onUpdate = render;
    this.y.onUpdate = render;

    this._move = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < this.radius) {
        this.x.set(dx * this.strength);
        this.y.set(dy * this.strength);
      } else {
        this.x.set(0);
        this.y.set(0);
      }
      engine.add(this.x);
      engine.add(this.y);
    };

    window.addEventListener('mousemove', this._move);
  }

  destroy() {
    window.removeEventListener('mousemove', this._move);
    engine.remove(this.x);
    engine.remove(this.y);
  }
}
