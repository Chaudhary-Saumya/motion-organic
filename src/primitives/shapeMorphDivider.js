import { ShapeMorph } from '../core/morph.js';
import { scrollTracker } from '../core/scroll.js';

/**
 * ShapeMorphDivider — the boundary between two sections is an SVG path
 * that morphs shape as the user scrolls past it, so section A's background
 * bleeds into section B through a moving organic curve instead of a hard
 * straight edge.
 */
export class ShapeMorphDivider {
  constructor(sectionEl, { pathEl, fromPathEl, toPathEl, points = 48 } = {}) {
    this.sectionEl = sectionEl;
    this.pathEl = pathEl;
    this.morph = new ShapeMorph(fromPathEl, toPathEl, { points });
    this._unsub = scrollTracker.subscribe(() => this._render());
    this._render();
  }

  _render() {
    const t = scrollTracker.progressOf(this.sectionEl);
    this.pathEl.setAttribute('d', this.morph.at(t));
  }

  destroy() {
    this._unsub();
  }
}
