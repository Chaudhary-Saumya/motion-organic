import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';
import { ShapeMorph } from '../core/morph.js';

/**
 * OrganicMaskReveal — clips `el` to a blob shape that itself morphs as the
 * element scrolls through the viewport (the foodnia.co.jp cabbage effect).
 *
 * Usage:
 *   <svg width="0" height="0"><clipPath id="blob"><path id="blobPath" d="..."/></clipPath></svg>
 *   new OrganicMaskReveal(imgEl, {
 *     pathEl: document.getElementById('blobPath'),
 *     fromPathEl: closedBlobPathEl, // near-zero-area shape
 *     toPathEl: openBlobPathEl,     // final revealed shape
 *   });
 *   el.style.clipPath = 'url(#blob)';
 */
export class OrganicMaskReveal {
  constructor(el, { pathEl, fromPathEl, toPathEl, points = 64, stiffness = 90, damping = 18 } = {}) {
    this.el = el;
    this.pathEl = pathEl;
    this.morph = new ShapeMorph(fromPathEl, toPathEl, { points });

    this.spring = new Spring({ stiffness, damping });
    this.spring.onUpdate = (t) => {
      this.pathEl.setAttribute('d', this.morph.at(Math.max(0, Math.min(1, t))));
    };

    this._io = new IntersectionObserver(
      ([entry]) => {
        this.spring.set(entry.isIntersecting ? 1 : 0);
        engine.add(this.spring);
      },
      { threshold: buildThresholds(20) }
    );
    this._io.observe(el);
  }

  destroy() {
    this._io.disconnect();
    engine.remove(this.spring);
  }
}

function buildThresholds(steps) {
  return Array.from({ length: steps + 1 }, (_, i) => i / steps);
}
