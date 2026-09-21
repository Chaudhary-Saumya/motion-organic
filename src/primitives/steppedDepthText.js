import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';

/**
 * SteppedDepthText — Cascading Stepped 3D Depth Typography.
 *
 * Renders multiple stacked, tonal shadow steps that create a tactile, pillowy
 * 3D extrusion with accordion spring physics on hover and movement.
 */
export class SteppedDepthText {
  /**
   * @param {HTMLElement} element
   * @param {Object} [options]
   * @param {string} [options.color='#f87171'] - Base front tone
   * @param {number} [options.layers=5] - Number of stepped shadow layers (3-8)
   * @param {number} [options.stepDistance=4] - Distance per step in px
   * @param {string} [options.direction='bottom-right'] - 'bottom-right' | 'bottom-left' | 'bottom'
   * @param {boolean} [options.interactive=true]
   */
  constructor(element, options = {}) {
    this.el = element;
    this.baseColor = options.color || '#f87171';
    this.numLayers = Math.max(2, Math.min(10, options.layers || 5));
    this.stepDistance = options.stepDistance ?? 4;
    this.direction = options.direction || 'bottom-right';
    this.interactive = options.interactive !== false;

    this.spring = new Spring({ stiffness: 140, damping: 14 });

    this._originalContent = this.el.innerHTML;
    this._originalText = this.el.textContent || '';
    this._init();
  }

  _init() {
    this.el.classList.add('mo-stepped-depth-root');
    const text = this._originalText;

    this.wrapper = document.createElement('span');
    this.wrapper.className = 'mo-stepped-wrapper';
    Object.assign(this.wrapper.style, {
      position: 'relative',
      display: 'inline-block',
      fontWeight: 'inherit',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
    });

    this.layerElements = [];
    const dirMap = {
      'bottom-right': { x: 1, y: 1 },
      'bottom-left': { x: -1, y: 1 },
      'bottom': { x: 0, y: 1 },
    };
    const dir = dirMap[this.direction] || dirMap['bottom-right'];

    // Generate rear steps from deepest to foreground
    for (let i = this.numLayers; i >= 1; i--) {
      const step = document.createElement('span');
      step.setAttribute('aria-hidden', 'true');
      step.textContent = text;
      const shade = this._darkenColor(this.baseColor, i * 7);
      const isFront = i === 1;

      Object.assign(step.style, {
        position: isFront ? 'relative' : 'absolute',
        inset: '0',
        zIndex: String(this.numLayers - i + 1),
        display: isFront ? 'inline-block' : 'block',
        color: isFront ? this.baseColor : shade,
        transform: `translate(${(i - 1) * this.stepDistance * dir.x}px, ${(i - 1) * this.stepDistance * dir.y}px)`,
        willChange: 'transform',
        pointerEvents: isFront ? 'auto' : 'none',
      });

      this.layerElements.push({ el: step, index: i, dir });
      this.wrapper.appendChild(step);
    }

    this.el.innerHTML = '';
    this.el.appendChild(this.wrapper);

    if (this.interactive) {
      this._bindEvents();
    }
  }

  _darkenColor(col, percent) {
    if (col.startsWith('#') && col.length === 7) {
      const num = parseInt(col.slice(1), 16);
      const r = Math.max(0, (num >> 16) - percent);
      const g = Math.max(0, ((num >> 8) & 0x00FF) - percent);
      const b = Math.max(0, (num & 0x0000FF) - percent);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return col;
  }

  _bindEvents() {
    this.spring.onUpdate = (scale) => {
      for (const item of this.layerElements) {
        if (item.index === 1) continue;
        const base = (item.index - 1) * this.stepDistance;
        const dynamicDist = base * (1 + scale * 0.45);
        item.el.style.transform = `translate(${(dynamicDist * item.dir.x).toFixed(1)}px, ${(dynamicDist * item.dir.y).toFixed(1)}px)`;
      }
    };

    engine.add(this.spring);

    this._onMouseEnter = () => {
      this.spring.set(1.5);
    };
    this._onMouseLeave = () => {
      this.spring.set(0);
    };

    this.el.addEventListener('mouseenter', this._onMouseEnter);
    this.el.addEventListener('mouseleave', this._onMouseLeave);
  }

  destroy() {
    if (this._onMouseEnter) {
      this.el.removeEventListener('mouseenter', this._onMouseEnter);
      this.el.removeEventListener('mouseleave', this._onMouseLeave);
    }
    engine.remove(this.spring);
    this.el.innerHTML = this._originalContent;
    this.el.classList.remove('mo-stepped-depth-root');
  }
}
