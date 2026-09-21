import { scrollTracker } from '../core/scroll.js';

/**
 * TextBehindBleed — large text sits behind a translucent object; as the
 * section scrolls, the text's vertical offset and opacity are driven by
 * scroll progress so it reads as "passing through" the object rather than
 * simply being layered under it (foodnia's "We are WELL-EATING COMPANY").
 *
 * Markup expectation: a positioned container with two absolutely-placed
 * children — .behind (the text) and .front (the object, e.g. an image with
 * mix-blend-mode / partial opacity).
 */
export class TextBehindBleed {
  constructor(container, { textEl, driftPx = 40 } = {}) {
    this.container = container;
    this.textEl = textEl ?? container.querySelector('.behind');
    this.driftPx = driftPx;
    this._unsub = scrollTracker.subscribe(() => this._render());
    this._render();
  }

  _render() {
    const t = scrollTracker.progressOf(this.container); // 0..1
    const drift = (t - 0.5) * 2 * this.driftPx;
    // opacity peaks near the middle of the scroll pass, fades at the edges
    const opacity = 1 - Math.abs(t - 0.5) * 1.4;
    this.textEl.style.transform = `translate3d(0, ${drift.toFixed(1)}px, 0)`;
    this.textEl.style.opacity = String(Math.max(0, Math.min(1, opacity)));
  }

  destroy() {
    this._unsub();
  }
}
