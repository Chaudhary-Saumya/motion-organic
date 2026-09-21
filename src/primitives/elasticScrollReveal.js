import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';

/**
 * ElasticScrollReveal — el scales in from inside its mask with a slight
 * overshoot past 100% before settling (underdamped spring), instead of a
 * linear/eased fade-in — the difference between motion that feels
 * mechanical vs. motion that feels alive.
 */
export class ElasticScrollReveal {
  constructor(el, { stiffness = 180, damping = 14, once = true } = {}) {
    this.el = el;
    el.style.opacity = '0';
    el.style.willChange = 'transform, opacity';

    this.spring = new Spring({ stiffness, damping });
    this.spring.onUpdate = (v) => {
      el.style.opacity = String(Math.min(1, v));
      el.style.transform = `scale(${(0.85 + v * 0.15).toFixed(3)})`;
    };

    this._io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.spring.set(1);
          engine.add(this.spring);
          if (once) this._io.disconnect();
        } else if (!once) {
          this.spring.set(0);
          engine.add(this.spring);
        }
      },
      { threshold: 0.2 }
    );
    this._io.observe(el);
  }

  destroy() {
    this._io.disconnect();
    engine.remove(this.spring);
  }
}
