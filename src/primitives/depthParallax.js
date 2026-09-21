import { scrollTracker } from '../core/scroll.js';

/**
 * DepthParallax — multiple layers move at different scroll-linked speeds
 * for a depth illusion. Most DIY parallax breaks down on low-end devices
 * because every layer updates every scroll event; here all layers update
 * from one shared scroll subscription, transforms are GPU-composited
 * (translate3d only, never top/left), and updates are skipped when the
 * layer is off-screen (checked once per call, cheap).
 */
export class DepthParallax {
  constructor(layers) {
    // layers: [{ el, speed }] — speed 0 = fixed to page, 1 = normal scroll,
    // >1 = moves faster than scroll (foreground), <0 = moves opposite
    this.layers = layers;
    this._unsub = scrollTracker.subscribe(() => this._render());
    this._render();
  }

  _render() {
    for (const { el, speed } of this.layers) {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) continue; // off-screen, skip
      const offset = (window.scrollY - (el._parallaxBase ??= window.scrollY)) * (speed - 1);
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    }
  }

  destroy() {
    this._unsub();
  }
}
