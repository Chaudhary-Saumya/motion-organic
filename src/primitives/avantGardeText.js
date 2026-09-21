import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';

/**
 * AvantGardeText — Experimental Modular Deconstructed Glyph Typography.
 *
 * Renders high-concept avant-garde editorial typography inspired by modern
 * foundry ligatures (e.g. arched letter stems, asterisk superscript dots,
 * petal/bowtie diagonal cuts, and modular geometric morphing).
 */
export class AvantGardeText {
  /**
   * @param {HTMLElement} element
   * @param {Object} [options]
   * @param {string} [options.color='#ffffff'] - Base glyph color
   * @param {string} [options.accentColor='#ffffff'] - Accent symbol color
   * @param {number} [options.letterSpacing=0.08] - Spacing in em
   * @param {boolean} [options.interactive=true] - Hover character spring expansion
   */
  constructor(element, options = {}) {
    this.el = element;
    this.color = options.color || '#ffffff';
    this.accentColor = options.accentColor || options.color || '#ffffff';
    this.letterSpacing = options.letterSpacing ?? 0.08;
    this.interactive = options.interactive !== false;

    this._originalContent = this.el.innerHTML;
    this._originalText = this.el.textContent || '';
    this._charItems = [];
    this._boundUpdate = this._update.bind(this);
    this._init();
  }

  _init() {
    this.el.classList.add('mo-avant-root');
    const rawText = this._originalText;

    if (!document.getElementById('mo-avant-styles')) {
      const style = document.createElement('style');
      style.id = 'mo-avant-styles';
      style.textContent = `
        .mo-avant-char {
          display: inline-block;
          position: relative;
          will-change: transform, letter-spacing;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mo-avant-m-arch {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 72% 100%, 65% 35%, 50% 15%, 35% 35%, 28% 100%, 0 100%);
        }
        .mo-avant-x-petal {
          clip-path: polygon(25% 0%, 50% 30%, 75% 0%, 100% 15%, 70% 50%, 100% 85%, 75% 100%, 50% 70%, 25% 100%, 0% 85%, 30% 50%, 0% 15%);
        }
        .mo-avant-asterisk {
          display: inline-block;
          transform: translateY(-0.35em) scale(0.85);
          font-weight: 900;
        }
      `;
      document.head.appendChild(style);
    }

    this.wrapper = document.createElement('span');
    this.wrapper.className = 'mo-avant-wrapper';
    Object.assign(this.wrapper.style, {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'baseline',
      color: this.color,
      fontWeight: '900',
      letterSpacing: `${this.letterSpacing}em`,
      userSelect: 'none',
      cursor: this.interactive ? 'crosshair' : 'inherit',
    });

    const chars = Array.from(rawText);
    chars.forEach((char, idx) => {
      const span = document.createElement('span');
      span.className = 'mo-avant-char';
      
      const upper = char.toUpperCase();
      if (char === '*' || char === '✦') {
        span.classList.add('mo-avant-asterisk');
        span.textContent = '★';
        span.style.color = this.accentColor;
      } else if (upper === 'M' && char.length === 1) {
        span.classList.add('mo-avant-m-arch');
        span.textContent = char;
      } else if (upper === 'X' && char.length === 1) {
        span.classList.add('mo-avant-x-petal');
        span.textContent = char;
      } else {
        span.textContent = char;
      }

      const spring = new Spring({ stiffness: 180, damping: 16 });
      this._charItems.push({ el: span, spring, baseScale: 1 });
      this.wrapper.appendChild(span);
    });

    this.el.innerHTML = '';
    this.el.appendChild(this.wrapper);

    if (this.interactive) {
      this._onMouseMove = (e) => {
        const rect = this.el.getBoundingClientRect();
        const mouseX = e.clientX;
        this._charItems.forEach((item) => {
          const charRect = item.el.getBoundingClientRect();
          const charCenter = charRect.left + charRect.width / 2;
          const dist = Math.abs(mouseX - charCenter);
          const influence = Math.max(0, 1 - dist / 120);
          item.spring.setTarget(influence);
        });
      };

      this._onMouseLeave = () => {
        this._charItems.forEach((item) => item.spring.setTarget(0));
      };

      this.el.addEventListener('mousemove', this._onMouseMove, { passive: true });
      this.el.addEventListener('mouseleave', this._onMouseLeave);
      engine.add(this._boundUpdate);
    }
  }

  _update(dt) {
    this._charItems.forEach((item) => {
      const val = item.spring.update(dt);
      if (val > 0.001) {
        const scale = 1 + val * 0.18;
        const translateY = -val * 8;
        item.el.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
      } else {
        item.el.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
    });
  }

  destroy() {
    engine.remove(this._boundUpdate);
    if (this.interactive) {
      this.el.removeEventListener('mousemove', this._onMouseMove);
      this.el.removeEventListener('mouseleave', this._onMouseLeave);
    }
    this.el.innerHTML = this._originalContent;
    this.el.classList.remove('mo-avant-root');
  }
}
