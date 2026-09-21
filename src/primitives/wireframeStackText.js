import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';

/**
 * WireframeStackText — Pop-Art Wireframe Offset Stack Typography.
 *
 * Renders bold saturated typography with a crisp wireframe contour outline,
 * multiple stepped hot-pink/magenta offset layers, deep ambient drop shadow,
 * and dynamic interactive parallax on cursor movement.
 */
export class WireframeStackText {
  /**
   * @param {HTMLElement} element
   * @param {Object} [options]
   * @param {string} [options.cyanColor='#00cec9'] - Main face color
   * @param {string} [options.magentaColor='#e84393'] - Primary offset stack color
   * @param {string} [options.strokeColor='#ffffff'] - Wireframe contour stroke
   * @param {number} [options.strokeWidth=2.5] - Wireframe stroke width in px
   * @param {number} [options.layers=3] - Number of stepped offset layers
   * @param {number} [options.offset=8] - Base offset distance per layer in px
   * @param {boolean} [options.interactive=true]
   */
  constructor(element, options = {}) {
    this.el = element;
    this.cyanColor = options.cyanColor || '#00cec9';
    this.magentaColor = options.magentaColor || '#e84393';
    this.strokeColor = options.strokeColor || '#ffffff';
    this.strokeWidth = options.strokeWidth ?? 2.5;
    this.layerCount = Math.max(1, Math.min(8, options.layers ?? 3));
    this.baseOffset = options.offset ?? 8;
    this.interactive = options.interactive !== false;

    this.springX = new Spring({ stiffness: 140, damping: 15 });
    this.springY = new Spring({ stiffness: 140, damping: 15 });

    this._originalContent = this.el.innerHTML;
    this._originalText = this.el.textContent || '';
    this._stackLayers = [];
    this._boundUpdate = this._update.bind(this);
    this._init();
  }

  _init() {
    this.el.classList.add('mo-wireframe-stack-root');
    const text = this._originalText;

    this.wrapper = document.createElement('span');
    this.wrapper.className = 'mo-wireframe-stack-wrapper';
    Object.assign(this.wrapper.style, {
      position: 'relative',
      display: 'inline-block',
      fontWeight: 'inherit',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
      userSelect: 'none',
    });

    // 1. Staggered Magenta Stack Layers (bottom to top)
    for (let i = this.layerCount; i >= 1; i--) {
      const layer = document.createElement('span');
      layer.className = `mo-stack-layer mo-stack-${i}`;
      layer.setAttribute('aria-hidden', 'true');
      layer.textContent = text;
      
      const depthRatio = i / this.layerCount;
      const isDeepest = i === this.layerCount;

      Object.assign(layer.style, {
        position: 'absolute',
        inset: '0',
        zIndex: `${i}`,
        color: this.magentaColor,
        opacity: `${0.75 + (1 - depthRatio) * 0.25}`,
        pointerEvents: 'none',
        userSelect: 'none',
        filter: isDeepest ? 'drop-shadow(0 15px 12px rgba(0, 0, 0, 0.45))' : 'none',
        willChange: 'transform',
      });

      this._stackLayers.push({ el: layer, index: i });
      this.wrapper.appendChild(layer);
    }

    // 2. Cyan Solid Face Layer
    this.faceLayer = document.createElement('span');
    this.faceLayer.className = 'mo-stack-face';
    this.faceLayer.textContent = text;
    Object.assign(this.faceLayer.style, {
      position: 'relative',
      zIndex: `${this.layerCount + 1}`,
      color: this.cyanColor,
      display: 'inline-block',
      willChange: 'transform',
    });
    this.wrapper.appendChild(this.faceLayer);

    // 3. Floating Wireframe Outline Layer
    this.wireframeLayer = document.createElement('span');
    this.wireframeLayer.className = 'mo-stack-wireframe';
    this.wireframeLayer.setAttribute('aria-hidden', 'true');
    this.wireframeLayer.textContent = text;
    Object.assign(this.wireframeLayer.style, {
      position: 'absolute',
      inset: '0',
      zIndex: `${this.layerCount + 2}`,
      color: 'transparent',
      WebkitTextStroke: `${this.strokeWidth}px ${this.strokeColor}`,
      pointerEvents: 'none',
      userSelect: 'none',
      willChange: 'transform',
    });
    this.wrapper.appendChild(this.wireframeLayer);

    this.el.innerHTML = '';
    this.el.appendChild(this.wrapper);

    this._applyTransforms(0, 0);

    if (this.interactive) {
      this._onMouseMove = (e) => {
        const rect = this.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const nx = (e.clientX - cx) / (rect.width / 2 || 1);
        const ny = (e.clientY - cy) / (rect.height / 2 || 1);
        this.springX.setTarget(nx * 12);
        this.springY.setTarget(ny * 12);
      };

      this._onMouseLeave = () => {
        this.springX.setTarget(0);
        this.springY.setTarget(0);
      };

      this.el.addEventListener('mousemove', this._onMouseMove, { passive: true });
      this.el.addEventListener('mouseleave', this._onMouseLeave);
      engine.add(this._boundUpdate);
    }
  }

  _applyTransforms(x, y) {
    const step = this.baseOffset;
    
    // Stack layers fan out diagonally down-right
    for (const { el, index } of this._stackLayers) {
      const offsetX = index * step + x * (index * 0.35);
      const offsetY = index * step + y * (index * 0.35);
      el.style.transform = `translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0)`;
    }

    // Cyan face layer has subtle micro-tilt
    this.faceLayer.style.transform = `translate3d(${(x * 0.15).toFixed(2)}px, ${(y * 0.15).toFixed(2)}px, 0)`;

    // Wireframe outline slightly leads or offsets in opposite direction for maximum 3D pop
    const wireX = -4 + x * 0.45;
    const wireY = -4 + y * 0.45;
    this.wireframeLayer.style.transform = `translate3d(${wireX.toFixed(2)}px, ${wireY.toFixed(2)}px, 0)`;
  }

  _update(dt) {
    const x = this.springX.update(dt);
    const y = this.springY.update(dt);
    this._applyTransforms(x, y);
  }

  destroy() {
    engine.remove(this._boundUpdate);
    if (this.interactive) {
      this.el.removeEventListener('mousemove', this._onMouseMove);
      this.el.removeEventListener('mouseleave', this._onMouseLeave);
    }
    this.el.innerHTML = this._originalContent;
    this.el.classList.remove('mo-wireframe-stack-root');
  }
}
