import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';

/**
 * OffsetShadowText — Pop-Art Chromatic Dual Offset Shadow Typography.
 *
 * Renders high-contrast foreground typography backed by dual offset chromatic
 * color extrusions (e.g. Cyan + Magenta) that react dynamically with spring physics.
 */
export class OffsetShadowText {
  /**
   * @param {HTMLElement} element
   * @param {Object} [options]
   * @param {string} [options.textColor='#ffffff'] - Front face color
   * @param {string} [options.magentaColor='#ff0055'] - Mid chromatic shadow
   * @param {string} [options.cyanColor='#00e5ff'] - Deep chromatic shadow
   * @param {number} [options.offset=6] - Base shadow distance in px
   * @param {boolean} [options.interactive=true]
   * @param {number} [options.stiffness=150]
   * @param {number} [options.damping=16]
   */
  constructor(element, options = {}) {
    this.el = element;
    this.textColor = options.textColor || '#ffffff';
    this.magentaColor = options.magentaColor || '#ff0055';
    this.cyanColor = options.cyanColor || '#00e5ff';
    this.baseOffset = options.offset ?? 6;
    this.interactive = options.interactive !== false;

    this.springX = new Spring({ stiffness: options.stiffness || 150, damping: options.damping || 16 });
    this.springY = new Spring({ stiffness: options.stiffness || 150, damping: options.damping || 16 });

    this._originalContent = this.el.innerHTML;
    this._originalText = this.el.textContent || '';
    this._init();
  }

  _init() {
    this.el.classList.add('mo-offset-shadow-root');
    const text = this._originalText;

    this.wrapper = document.createElement('span');
    this.wrapper.className = 'mo-offset-shadow-wrapper';
    Object.assign(this.wrapper.style, {
      position: 'relative',
      display: 'inline-block',
      fontWeight: 'inherit',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
    });

    // 1. Cyan (deepest layer)
    this.cyanLayer = document.createElement('span');
    this.cyanLayer.className = 'mo-shadow-cyan';
    this.cyanLayer.setAttribute('aria-hidden', 'true');
    this.cyanLayer.textContent = text;
    Object.assign(this.cyanLayer.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '1',
      color: this.cyanColor,
      transform: `translate(${this.baseOffset * 2}px, ${this.baseOffset * 2}px)`,
      pointerEvents: 'none',
      willChange: 'transform',
    });

    // 2. Magenta (middle layer)
    this.magentaLayer = document.createElement('span');
    this.magentaLayer.className = 'mo-shadow-magenta';
    this.magentaLayer.setAttribute('aria-hidden', 'true');
    this.magentaLayer.textContent = text;
    Object.assign(this.magentaLayer.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '2',
      color: this.magentaColor,
      transform: `translate(${this.baseOffset}px, ${this.baseOffset}px)`,
      pointerEvents: 'none',
      willChange: 'transform',
    });

    // 3. Front text
    this.frontLayer = document.createElement('span');
    this.frontLayer.className = 'mo-shadow-front';
    this.frontLayer.textContent = text;
    Object.assign(this.frontLayer.style, {
      position: 'relative',
      zIndex: '3',
      display: 'inline-block',
      color: this.textColor,
    });

    this.wrapper.append(this.cyanLayer, this.magentaLayer, this.frontLayer);
    this.el.innerHTML = '';
    this.el.appendChild(this.wrapper);

    if (this.interactive) {
      this._bindEvents();
    }
  }

  _bindEvents() {
    this.springX.onUpdate = (vx) => {
      this._updateLayers(vx, this.springY.value);
    };
    this.springY.onUpdate = (vy) => {
      this._updateLayers(this.springX.value, vy);
    };

    engine.add(this.springX);
    engine.add(this.springY);

    this._onMouseMove = (e) => {
      const rect = this.el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      this.springX.set(nx * 14);
      this.springY.set(ny * 14);
    };

    this._onMouseLeave = () => {
      this.springX.set(0);
      this.springY.set(0);
    };

    this.el.addEventListener('mousemove', this._onMouseMove);
    this.el.addEventListener('mouseleave', this._onMouseLeave);
  }

  _updateLayers(offsetX, offsetY) {
    const ox1 = this.baseOffset + offsetX * 0.6;
    const oy1 = this.baseOffset + offsetY * 0.6;
    const ox2 = this.baseOffset * 2 + offsetX * 1.3;
    const oy2 = this.baseOffset * 2 + offsetY * 1.3;

    this.magentaLayer.style.transform = `translate(${ox1.toFixed(1)}px, ${oy1.toFixed(1)}px)`;
    this.cyanLayer.style.transform = `translate(${ox2.toFixed(1)}px, ${oy2.toFixed(1)}px)`;
  }

  destroy() {
    if (this._onMouseMove) {
      this.el.removeEventListener('mousemove', this._onMouseMove);
      this.el.removeEventListener('mouseleave', this._onMouseLeave);
    }
    engine.remove(this.springX);
    engine.remove(this.springY);
    this.el.innerHTML = this._originalContent;
    this.el.classList.remove('mo-offset-shadow-root');
  }
}
