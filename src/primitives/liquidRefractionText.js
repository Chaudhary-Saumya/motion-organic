import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';

/**
 * LiquidRefractionText — Real-Time Optical Liquid Glass Lens & Chromatic Refraction.
 *
 * Simulates a physical liquid mercury / viscous water droplet gliding over typography.
 * Uses real-time SVG optical displacement mapping, dynamic chromatic aberration
 * (RGB split), specular glass highlight reflections, and harmonic spring physics.
 */
export class LiquidRefractionText {
  /**
   * @param {HTMLElement} element
   * @param {Object} [options]
   * @param {number} [options.lensRadius=75] - Lens diameter radius in px
   * @param {number} [options.viscosity=0.7] - Liquid refraction intensity (10-80)
   * @param {number} [options.chromaticAberration=1.5] - RGB split offset in px
   * @param {string} [options.color='#ffffff'] - Base text color
   * @param {string} [options.highlightColor='rgba(255, 255, 255, 0.95)'] - Specular glare color
   * @param {boolean} [options.interactive=true]
   * @param {number} [options.stiffness=160]
   * @param {number} [options.damping=14]
   */
  constructor(element, options = {}) {
    this.el = element;
    this.lensRadius = options.lensRadius ?? 75;
    this.viscosity = options.viscosity ?? 0.7;
    this.chromaticAberration = options.chromaticAberration ?? 1.5;
    this.color = options.color || '#ffffff';
    this.highlightColor = options.highlightColor || 'rgba(255, 255, 255, 0.95)';
    this.interactive = options.interactive !== false;

    this.springX = new Spring({ stiffness: options.stiffness || 160, damping: options.damping || 14 });
    this.springY = new Spring({ stiffness: options.stiffness || 160, damping: options.damping || 14 });
    this.scaleSpring = new Spring({ stiffness: 200, damping: 16 });

    this._filterId = `mo-liquid-lens-${Math.random().toString(36).substr(2, 9)}`;
    this._originalContent = this.el.innerHTML;
    this._originalText = this.el.textContent || '';
    this._boundUpdate = this._update.bind(this);
    this._init();
  }

  _init() {
    this.el.classList.add('mo-refraction-root');
    const text = this._originalText;

    // 1. Inject Dynamic SVG Refraction Filter
    if (!document.getElementById(this._filterId)) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = this._filterId;
      svg.setAttribute('style', 'position: absolute; width: 0; height: 0; pointer-events: none;');
      svg.innerHTML = `
        <defs>
          <filter id="${this._filterId}-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.04" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="${this.viscosity * 24}" xChannelSelector="R" yChannelSelector="G" result="distort" />
            <feBlend mode="normal" in="SourceGraphic" in2="distort" />
          </filter>
        </defs>
      `;
      document.body.appendChild(svg);
      this._svgFilterEl = svg;
    }

    this.wrapper = document.createElement('span');
    this.wrapper.className = 'mo-refraction-wrapper';
    Object.assign(this.wrapper.style, {
      position: 'relative',
      display: 'inline-block',
      fontWeight: 'inherit',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
      userSelect: 'text',
      cursor: this.interactive ? 'none' : 'inherit',
    });

    // Red Channel / Cyan Chromatic Split Under-layer
    this.cyanLayer = document.createElement('span');
    this.cyanLayer.className = 'mo-refraction-cyan';
    this.cyanLayer.setAttribute('aria-hidden', 'true');
    this.cyanLayer.textContent = text;
    Object.assign(this.cyanLayer.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '1',
      color: '#00f0ff',
      opacity: '0.7',
      pointerEvents: 'none',
      userSelect: 'none',
      filter: `url(#${this._filterId}-filter)`,
      mixBlendMode: 'screen',
      willChange: 'transform',
    });

    // Magenta Chromatic Split Layer
    this.magentaLayer = document.createElement('span');
    this.magentaLayer.className = 'mo-refraction-magenta';
    this.magentaLayer.setAttribute('aria-hidden', 'true');
    this.magentaLayer.textContent = text;
    Object.assign(this.magentaLayer.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '2',
      color: '#ff0055',
      opacity: '0.7',
      pointerEvents: 'none',
      userSelect: 'none',
      mixBlendMode: 'screen',
      willChange: 'transform',
    });

    // Main Foreground Typography
    this.mainLayer = document.createElement('span');
    this.mainLayer.className = 'mo-refraction-main';
    this.mainLayer.textContent = text;
    Object.assign(this.mainLayer.style, {
      position: 'relative',
      zIndex: '3',
      display: 'inline-block',
      color: this.color,
      willChange: 'transform',
    });

    // Floating Specular Droplet Lens
    this.lensDroplet = document.createElement('div');
    this.lensDroplet.className = 'mo-refraction-droplet';
    Object.assign(this.lensDroplet.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: `${this.lensRadius * 2}px`,
      height: `${this.lensRadius * 2}px`,
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '4',
      background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.08) 50%, transparent 70%)',
      boxShadow: 'inset 0 0 20px rgba(255,255,255,0.35), 0 8px 32px rgba(0,0,0,0.25)',
      backdropFilter: 'blur(0.5px) brightness(1.2)',
      WebkitBackdropFilter: 'blur(0.5px) brightness(1.2)',
      transform: 'translate(-50%, -50%) scale(0)',
      transition: 'opacity 0.2s ease',
      opacity: '0',
      willChange: 'transform, opacity',
    });

    this.wrapper.append(this.cyanLayer, this.magentaLayer, this.mainLayer, this.lensDroplet);
    this.el.innerHTML = '';
    this.el.appendChild(this.wrapper);

    if (this.interactive) {
      this._onMouseMove = (e) => {
        const rect = this.el.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.springX.setTarget(mouseX);
        this.springY.setTarget(mouseY);
        this.scaleSpring.setTarget(1);
        this.lensDroplet.style.opacity = '1';
        engine.add(this._boundUpdate);
      };

      this._onMouseLeave = () => {
        this.scaleSpring.setTarget(0);
        this.lensDroplet.style.opacity = '0';
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
    const s = this.scaleSpring.update(dt);

    if (this.lensDroplet) {
      this.lensDroplet.style.transform = `translate3d(${(x - this.lensRadius).toFixed(1)}px, ${(y - this.lensRadius).toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
    }

    const ca = this.chromaticAberration * s;
    if (this.cyanLayer && this.magentaLayer) {
      this.cyanLayer.style.transform = `translate3d(${(-ca * 1.5).toFixed(2)}px, 0, 0)`;
      this.magentaLayer.style.transform = `translate3d(${(ca * 1.5).toFixed(2)}px, 0, 0)`;
    }
  }

  destroy() {
    engine.remove(this._boundUpdate);
    if (this.interactive) {
      this.el.removeEventListener('mousemove', this._onMouseMove);
      this.el.removeEventListener('mouseleave', this._onMouseLeave);
    }
    if (this._svgFilterEl && this._svgFilterEl.parentNode) {
      this._svgFilterEl.parentNode.removeChild(this._svgFilterEl);
    }
    this.el.innerHTML = this._originalContent;
    this.el.classList.remove('mo-refraction-root');
  }
}
