import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';
import { scrollTracker } from '../core/scroll.js';

/**
 * CursorProgressRing — a small ring that follows the cursor (spring-lagged,
 * not 1:1, for a "weighted" feel) and fills its stroke based on how far the
 * user has scrolled through the current section. The foodnia site's little
 * circle-with-arrow is one fixed instance of this pattern; here it's a
 * reusable primitive you can attach to any section.
 */
export class CursorProgressRing {
  constructor(container, { size = 56, sectionEl } = {}) {
    this.container = container;
    this.sectionEl = sectionEl ?? container;
    this.size = size;

    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ring.setAttribute('width', size);
    ring.setAttribute('height', size);
    ring.style.position = 'fixed';
    ring.style.pointerEvents = 'none';
    ring.style.zIndex = '9998';
    const r = size / 2 - 4;
    this._circumference = 2 * Math.PI * r;
    ring.innerHTML = `
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="currentColor" stroke-opacity="0.25" stroke-width="2"/>
      <circle class="fg" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="currentColor" stroke-width="2"
        stroke-dasharray="${this._circumference}" stroke-dashoffset="${this._circumference}"
        transform="rotate(-90 ${size / 2} ${size / 2})"/>`;
    document.body.appendChild(ring);
    this.ring = ring;
    this.fg = ring.querySelector('.fg');

    this.x = new Spring({ stiffness: 200, damping: 22 });
    this.y = new Spring({ stiffness: 200, damping: 22 });
    const pos = () => (ring.style.transform = `translate3d(${this.x.value - size / 2}px, ${this.y.value - size / 2}px, 0)`);
    this.x.onUpdate = pos;
    this.y.onUpdate = pos;

    this._move = (e) => {
      this.x.set(e.clientX);
      this.y.set(e.clientY);
      engine.add(this.x);
      engine.add(this.y);
    };
    window.addEventListener('mousemove', this._move);

    this._unsub = scrollTracker.subscribe(() => this._renderProgress());
    this._renderProgress();
  }

  _renderProgress() {
    const t = scrollTracker.progressOf(this.sectionEl);
    this.fg.setAttribute('stroke-dashoffset', String(this._circumference * (1 - t)));
  }

  destroy() {
    window.removeEventListener('mousemove', this._move);
    this._unsub();
    this.ring.remove();
  }
}
