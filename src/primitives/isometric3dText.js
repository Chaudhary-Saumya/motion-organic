import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';

/**
 * Isometric3DText — 3D Faceted Voxel Extruded Typography with Dynamic Specular Top Cap.
 *
 * Implements isometric block text with:
 * - Luminous cyan/ice-blue top cap highlight
 * - Vibrant royal blue front face
 * - Dense beveled 3D extrusion side walls
 * - Interactive 3D tilt tracking with spring physics
 */
export class Isometric3DText {
  /**
   * @param {HTMLElement} element
   * @param {Object} [options]
   * @param {string} [options.frontColor='#38bdf8'] - Front facet color
   * @param {string} [options.topColor='#bae6fd'] - Top specular bevel tint
   * @param {string} [options.sideColor='#1d4ed8'] - Extruded side wall tone
   * @param {string} [options.shadowColor='#0f172a'] - Deep ambient shadow
   * @param {number} [options.depth=12] - Extrusion depth in px
   * @param {boolean} [options.interactive=true]
   */
  constructor(element, options = {}) {
    this.el = element;
    this.frontColor = options.frontColor || '#38bdf8';
    this.topColor = options.topColor || '#bae6fd';
    this.sideColor = options.sideColor || '#1d4ed8';
    this.shadowColor = options.shadowColor || '#0b132b';
    this.depth = options.depth || 12;
    this.interactive = options.interactive !== false;

    this.springTiltX = new Spring({ stiffness: 120, damping: 14 });
    this.springTiltY = new Spring({ stiffness: 120, damping: 14 });

    this._originalContent = this.el.innerHTML;
    this._originalText = this.el.textContent || '';
    this._init();
  }

  _init() {
    this.el.classList.add('mo-isometric-3d-root');
    const text = this._originalText;

    // Generate layered multi-stop crisp extrusion shadow
    const shadows = [];
    for (let i = 1; i <= this.depth; i++) {
      const col = i < this.depth * 0.7 ? this.sideColor : this.shadowColor;
      shadows.push(`${i}px ${i}px 0 ${col}`);
    }
    // Ambient drop shadow at base
    shadows.push(`${this.depth + 4}px ${this.depth + 8}px 14px rgba(0,0,0,0.6)`);

    this.wrapper = document.createElement('span');
    this.wrapper.className = 'mo-isometric-wrapper';
    Object.assign(this.wrapper.style, {
      position: 'relative',
      display: 'inline-block',
      fontWeight: 'inherit',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
      transformStyle: 'preserve-3d',
      perspective: '1000px',
    });

    // 1. Extruded Main Block
    this.mainText = document.createElement('span');
    this.mainText.className = 'mo-iso-main';
    this.mainText.textContent = text;
    Object.assign(this.mainText.style, {
      position: 'relative',
      zIndex: '2',
      display: 'inline-block',
      color: this.frontColor,
      textShadow: shadows.join(', '),
      willChange: 'transform',
    });

    // 2. Specular Top Cap Highlight
    this.topCap = document.createElement('span');
    this.topCap.className = 'mo-iso-cap';
    this.topCap.setAttribute('aria-hidden', 'true');
    this.topCap.textContent = text;
    Object.assign(this.topCap.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '3',
      color: 'transparent',
      webkitTextStroke: '1px ' + this.topColor,
      transform: 'translate(-1px, -1px)',
      opacity: '0.85',
      pointerEvents: 'none',
    });

    this.wrapper.append(this.mainText, this.topCap);
    this.el.innerHTML = '';
    this.el.appendChild(this.wrapper);

    if (this.interactive) {
      this._bindEvents();
    }
  }

  _bindEvents() {
    this.springTiltX.onUpdate = (rx) => {
      this._applyTilt(rx, this.springTiltY.value);
    };
    this.springTiltY.onUpdate = (ry) => {
      this._applyTilt(this.springTiltX.value, ry);
    };

    engine.add(this.springTiltX);
    engine.add(this.springTiltY);

    this._onMouseMove = (e) => {
      const rect = this.el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      this.springTiltX.set(ny * -18);
      this.springTiltY.set(nx * 18);
    };

    this._onMouseLeave = () => {
      this.springTiltX.set(0);
      this.springTiltY.set(0);
    };

    this.el.addEventListener('mousemove', this._onMouseMove);
    this.el.addEventListener('mouseleave', this._onMouseLeave);
  }

  _applyTilt(rx, ry) {
    this.mainText.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    this.topCap.style.transform = `translate(-1px, -1px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  }

  destroy() {
    if (this._onMouseMove) {
      this.el.removeEventListener('mousemove', this._onMouseMove);
      this.el.removeEventListener('mouseleave', this._onMouseLeave);
    }
    engine.remove(this.springTiltX);
    engine.remove(this.springTiltY);
    this.el.innerHTML = this._originalContent;
    this.el.classList.remove('mo-isometric-3d-root');
  }
}
