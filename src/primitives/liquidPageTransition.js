import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';

/**
 * LiquidPageTransition — an organic blob grows from the point the user
 * clicked, fully covers the viewport (at which point you swap the DOM/route
 * content underneath), then the blob recedes to reveal the new page.
 *
 * This is NOT the View Transitions API's rectangular cross-fade/slide —
 * it's a genuinely irregular, wobbling growth curve (radius overshoots
 * slightly past 100%, like a liquid drop, before settling), built as a
 * single fixed-position SVG overlay so it works in any framework/router.
 */
export class LiquidPageTransition {
  constructor({ color = '#111', onCovered } = {}) {
    this.onCovered = onCovered;
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    Object.assign(this.svg.style, {
      position: 'fixed', inset: '0', width: '100vw', height: '100vh',
      pointerEvents: 'none', zIndex: 9999,
    });
    this.circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.circle.setAttribute('fill', color);
    this.circle.setAttribute('r', '0');
    this.svg.appendChild(this.circle);
    document.body.appendChild(this.svg);

    this.radius = new Spring({ stiffness: 110, damping: 14 }); // slight
    // underdamping -> the "overshoot and settle" liquid wobble
    this.radius.onUpdate = (r) => this.circle.setAttribute('r', String(Math.max(0, r)));
  }

  /** Call this from a click handler, passing the MouseEvent. */
  async trigger(e) {
    const cx = e?.clientX ?? window.innerWidth / 2;
    const cy = e?.clientY ?? window.innerHeight / 2;
    this.circle.setAttribute('cx', String(cx));
    this.circle.setAttribute('cy', String(cy));

    const maxR = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy)) * 1.15;

    await this._springTo(maxR);
    this.onCovered?.(); // swap page content while fully covered
    await this._springTo(0);
  }

  _springTo(target) {
    return new Promise((resolve) => {
      this.radius.onSettle = resolve;
      this.radius.set(target);
      engine.add(this.radius);
    });
  }

  destroy() {
    this.svg.remove();
  }
}
