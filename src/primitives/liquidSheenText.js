import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';

/**
 * LiquidSheenText — Multi-tone Iridescent Liquid Gradient with Glass Specular Sheen & Neon Outline.
 *
 * Implements the exact high-end pop-art typography aesthetic:
 * 1. Rich fluid gradient: Tangerine Orange -> Vivid Azure Blue -> Orchid Pink -> Electric Purple
 * 2. Translucent curved glass specular reflection cutting across the upper half of glyphs
 * 3. Offset neon electric green hollow contour outline with spring parallax tracking
 * 4. Crisp front separation outline for high contrast on light & dark backgrounds
 */
export class LiquidSheenText {
  /**
   * @param {HTMLElement} element - Target text container element
   * @param {Object} [options]
   * @param {string[]} [options.colors] - Fluid gradient color stops
   * @param {string} [options.outlineColor='#22c55e'] - Neon outline contour color
   * @param {number} [options.outlineWidth=2] - Outline width in px
   * @param {number} [options.offset=4] - Base contour offset in px
   * @param {string} [options.sheenColor='rgba(255, 255, 255, 0.85)'] - Specular glare color
   * @param {number} [options.speed=4] - Sheen sweep duration in seconds
   * @param {boolean} [options.glassReflection=true] - Apple-style curved glass specular cap
   * @param {boolean} [options.interactive=true] - React to mouse hover/movement
   */
  constructor(element, options = {}) {
    this.el = element;
    // Default palette exactly matching reference: Orange -> Cyan/SkyBlue -> Magenta/Pink -> Electric Purple
    this.colors = options.colors || [
      '#ff7a00', // Tangerine Orange
      '#00a8ff', // Sky Azure Blue
      '#00e5ff', // Cyan
      '#f368e0', // Orchid Pink
      '#9b51e0', // Royal Violet
      '#7000ff', // Electric Neon Purple
      '#ff7a00', // Seamless Loop
    ];
    this.outlineColor = options.outlineColor || '#22c55e';
    this.outlineWidth = options.outlineWidth ?? 2;
    this.baseOffset = options.offset ?? 4;
    this.sheenColor = options.sheenColor || 'rgba(255, 255, 255, 0.85)';
    this.speed = options.speed || 4;
    this.glassReflection = options.glassReflection !== false;
    this.interactive = options.interactive !== false;

    this.springX = new Spring({ stiffness: 140, damping: 15 });
    this.springY = new Spring({ stiffness: 140, damping: 15 });

    this._originalContent = this.el.innerHTML;
    this._originalText = this.el.textContent || '';
    this._boundUpdate = this._update.bind(this);
    this._init();
  }

  _init() {
    this.el.classList.add('mo-liquid-sheen-root');
    const text = this._originalText;

    // Inject global keyframe animations
    if (!document.getElementById('mo-liquid-sheen-styles')) {
      const style = document.createElement('style');
      style.id = 'mo-liquid-sheen-styles';
      style.textContent = `
        @keyframes moLiquidGradFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes moLiquidSheenSweep {
          0% { background-position: -250% 0; }
          100% { background-position: 300% 0; }
        }
      `;
      document.head.appendChild(style);
    }

    const gradStr = `linear-gradient(125deg, ${this.colors.join(', ')})`;
    const sheenGrad = `linear-gradient(110deg, transparent 15%, rgba(255,255,255,0.1) 35%, ${this.sheenColor} 50%, rgba(255,255,255,0.1) 65%, transparent 85%)`;

    this.wrapper = document.createElement('span');
    this.wrapper.className = 'mo-liquid-sheen-wrapper';
    Object.assign(this.wrapper.style, {
      position: 'relative',
      display: 'inline-block',
      fontWeight: '900',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
      userSelect: 'text',
      whiteSpace: 'pre-line',
    });

    // 1. Neon Green Pop Contour Layer (Sitting offset behind)
    this.outlineLayer = document.createElement('span');
    this.outlineLayer.className = 'mo-sheen-outline';
    this.outlineLayer.setAttribute('aria-hidden', 'true');
    this.outlineLayer.textContent = text;
    Object.assign(this.outlineLayer.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '1',
      color: 'transparent',
      WebkitTextStroke: `${this.outlineWidth}px ${this.outlineColor}`,
      pointerEvents: 'none',
      userSelect: 'none',
      transform: `translate3d(${this.baseOffset}px, ${this.baseOffset}px, 0)`,
      willChange: 'transform',
    });

    // 2. White Separation Stroke (Gives crisp separation between letters & green outline)
    this.sepLayer = document.createElement('span');
    this.sepLayer.className = 'mo-sheen-sep';
    this.sepLayer.setAttribute('aria-hidden', 'true');
    this.sepLayer.textContent = text;
    Object.assign(this.sepLayer.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '2',
      color: 'transparent',
      WebkitTextStroke: '1px rgba(255, 255, 255, 0.45)',
      pointerEvents: 'none',
      userSelect: 'none',
    });

    // 3. Main Multi-Tone Liquid Gradient Face
    this.frontLayer = document.createElement('span');
    this.frontLayer.className = 'mo-sheen-front';
    this.frontLayer.textContent = text;
    Object.assign(this.frontLayer.style, {
      position: 'relative',
      zIndex: '3',
      display: 'inline-block',
      background: gradStr,
      backgroundSize: '250% 250%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      animation: 'moLiquidGradFlow 7s ease infinite',
      willChange: 'transform',
    });

    // 4. Glass Specular Glare / Horizon Sheen Reflection
    this.glassLayer = document.createElement('span');
    this.glassLayer.className = 'mo-sheen-glass';
    this.glassLayer.setAttribute('aria-hidden', 'true');
    this.glassLayer.textContent = text;
    Object.assign(this.glassLayer.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '4',
      display: 'inline-block',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.3) 46%, transparent 48%, rgba(255,255,255,0.15) 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      pointerEvents: 'none',
      userSelect: 'none',
      mixBlendMode: 'screen',
    });

    // 5. Dynamic Moving Sheen Flare Sweep
    this.sheenSweepLayer = document.createElement('span');
    this.sheenSweepLayer.className = 'mo-sheen-sweep';
    this.sheenSweepLayer.setAttribute('aria-hidden', 'true');
    this.sheenSweepLayer.textContent = text;
    Object.assign(this.sheenSweepLayer.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '5',
      display: 'inline-block',
      background: sheenGrad,
      backgroundSize: '250% 100%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      animation: `moLiquidSheenSweep ${this.speed}s cubic-bezier(0.2, 0.8, 0.2, 1) infinite`,
      pointerEvents: 'none',
      userSelect: 'none',
      mixBlendMode: 'overlay',
    });

    this.wrapper.append(
      this.outlineLayer,
      this.sepLayer,
      this.frontLayer,
      this.glassLayer,
      this.sheenSweepLayer
    );
    this.el.innerHTML = '';
    this.el.appendChild(this.wrapper);

    if (this.interactive) {
      this._onMouseMove = (e) => {
        const rect = this.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const nx = (e.clientX - cx) / (rect.width / 2 || 1);
        const ny = (e.clientY - cy) / (rect.height / 2 || 1);
        this.springX.setTarget(nx * 8);
        this.springY.setTarget(ny * 8);
        engine.add(this._boundUpdate);
      };

      this._onMouseLeave = () => {
        this.springX.setTarget(0);
        this.springY.setTarget(0);
        engine.add(this._boundUpdate);
      };

      this.el.addEventListener('mousemove', this._onMouseMove, { passive: true });
      this.el.addEventListener('mouseleave', this._onMouseLeave);
      engine.add(this._boundUpdate);
    }
  }

  _update(dt) {
    const x = this.springX.update(dt);
    const y = this.springY.update(dt);
    
    const ox = this.baseOffset + x * 0.8;
    const oy = this.baseOffset + y * 0.8;
    this.outlineLayer.style.transform = `translate3d(${ox.toFixed(2)}px, ${oy.toFixed(2)}px, 0)`;
    this.frontLayer.style.transform = `translate3d(${(x * 0.15).toFixed(2)}px, ${(y * 0.15).toFixed(2)}px, 0)`;
    this.glassLayer.style.transform = `translate3d(${(x * 0.25).toFixed(2)}px, ${(y * 0.25).toFixed(2)}px, 0)`;
    this.sheenSweepLayer.style.transform = `translate3d(${(x * 0.35).toFixed(2)}px, ${(y * 0.35).toFixed(2)}px, 0)`;
  }

  destroy() {
    engine.remove(this._boundUpdate);
    if (this.interactive) {
      this.el.removeEventListener('mousemove', this._onMouseMove);
      this.el.removeEventListener('mouseleave', this._onMouseLeave);
    }
    this.el.innerHTML = this._originalContent;
    this.el.classList.remove('mo-liquid-sheen-root');
  }
}
