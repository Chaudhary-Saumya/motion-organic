import { scrollTracker } from '../core/scroll.js';

/**
 * CharacterWaveText — splits text into per-character spans and reveals them
 * in a wave tied to scroll progress (not a fixed-timing stagger). Reversing
 * scroll direction mid-reveal reverses the wave from wherever it currently
 * is, instead of restarting — same interruption-safety principle as Spring,
 * applied to a discrete per-character reveal instead of a continuous value.
 */
export class CharacterWaveText {
  constructor(el, { waveWidth = 0.15 } = {}) {
    this.el = el;
    this.waveWidth = waveWidth;
    const text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-label', text);
    this.chars = [...text].map((ch) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.display = 'inline-block';
      span.style.willChange = 'transform, opacity';
      el.appendChild(span);
      return span;
    });
    this._unsub = scrollTracker.subscribe(() => this._render());
    this._render();
  }

  _render() {
    const t = scrollTracker.progressOf(this.el);
    const n = this.chars.length;
    this.chars.forEach((span, i) => {
      const charPos = i / n;
      // distance from the leading edge of the wave, clamped into [0,1]
      const local = Math.max(0, Math.min(1, (t - charPos) / this.waveWidth));
      span.style.opacity = String(local);
      span.style.transform = `translate3d(0, ${(1 - local) * 24}px, 0)`;
    });
  }

  destroy() {
    this._unsub();
  }
}
