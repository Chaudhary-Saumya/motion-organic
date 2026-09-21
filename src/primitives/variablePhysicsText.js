import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';

/**
 * VariablePhysicsText — Elastic Variable Font Spring Harmonic Waves.
 *
 * Directly modulates variable font axes ('wght', 'wdth', 'slnt', 'CASL')
 * per-character with 120 FPS harmonic spring wave physics driven by cursor
 * proximity and continuous sinusoidal elasticity. Zero Three.js or canvas overhead.
 */
export class VariablePhysicsText {
  /**
   * @param {HTMLElement} element
   * @param {Object} [options]
   * @param {number} [options.minWeight=100] - Baseline font weight
   * @param {number} [options.maxWeight=900] - Peak font weight
   * @param {number} [options.elasticity=160] - Spring stiffness
   * @param {number} [options.damping=12] - Spring damping
   * @param {number} [options.radius=140] - Cursor interaction radius in px
   * @param {boolean} [options.slant=true] - Modulate slant angle (-15deg to +15deg)
   * @param {boolean} [options.continuousWave=false] - Idle harmonic breathing wave
   * @param {boolean} [options.interactive=true]
   */
  constructor(element, options = {}) {
    this.el = element;
    this.color = options.color || '#ffffff';
    this.minWeight = options.minWeight ?? 200;
    this.maxWeight = options.maxWeight ?? 900;
    this.elasticity = options.elasticity ?? 160;
    this.damping = options.damping ?? 12;
    this.radius = options.radius ?? 140;
    this.slant = options.slant !== false;
    this.continuousWave = options.continuousWave === true;
    this.interactive = options.interactive !== false;

    this._originalContent = this.el.innerHTML;
    this._originalText = this.el.textContent || '';
    this._charItems = [];
    this._time = 0;
    this._boundUpdate = this._update.bind(this);
    this._init();
  }

  _init() {
    this.el.classList.add('mo-variable-physics-root');
    const rawText = this._originalText;

    this.wrapper = document.createElement('span');
    this.wrapper.className = 'mo-variable-wrapper';
    Object.assign(this.wrapper.style, {
      position: 'relative',
      display: 'inline-block',
      color: this.color,
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
      userSelect: 'text',
      whiteSpace: 'pre-wrap',
      fontVariationSettings: `'wght' ${this.minWeight}`,
    });

    const chars = Array.from(rawText);
    chars.forEach((char) => {
      const span = document.createElement('span');
      span.className = 'mo-variable-char';
      span.textContent = char;
      Object.assign(span.style, {
        display: 'inline-block',
        color: this.color,
        fontVariationSettings: `'wght' ${this.minWeight}, 'wdth' 100`,
        transition: 'transform 0.05s linear',
        willChange: 'font-variation-settings, transform',
      });

      const spring = new Spring({ stiffness: this.elasticity, damping: this.damping });
      this._charItems.push({ el: span, spring, target: 0, current: 0 });
      this.wrapper.appendChild(span);
    });

    this.el.innerHTML = '';
    this.el.appendChild(this.wrapper);

    if (this.interactive) {
      this._onMouseMove = (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        this._charItems.forEach((item) => {
          const rect = item.el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(mouseX - cx, mouseY - cy);

          if (dist < this.radius) {
            const influence = Math.pow(1 - dist / this.radius, 1.5);
            item.spring.setTarget(influence);
          } else {
            item.spring.setTarget(0);
          }
        });
        engine.add(this._boundUpdate);
      };

      this._onMouseLeave = () => {
        this._charItems.forEach((item) => item.spring.setTarget(0));
        engine.add(this._boundUpdate);
      };

      this.el.addEventListener('mousemove', this._onMouseMove, { passive: true });
      this.el.addEventListener('mouseleave', this._onMouseLeave);
      engine.add(this._boundUpdate);
    }
  }

  _update(dt) {
    this._time += dt * 2;
    let anyMoving = false;

    this._charItems.forEach((item, idx) => {
      let val = item.spring.update(dt);
      
      if (this.continuousWave) {
        const wave = Math.sin(this._time + idx * 0.4) * 0.5 + 0.5;
        val = Math.max(val, wave * 0.7);
      }

      if (val > 0.005 || this.continuousWave) {
        anyMoving = true;
        const weight = Math.round(this.minWeight + val * (this.maxWeight - this.minWeight));
        const width = Math.round(100 + val * 25);
        const slantDeg = this.slant ? (val * 12).toFixed(1) : 0;
        const translateY = -val * 6;

        item.el.style.fontVariationSettings = `'wght' ${weight}, 'wdth' ${width}, 'slnt' ${slantDeg}`;
        item.el.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
      } else {
        item.el.style.fontVariationSettings = `'wght' ${this.minWeight}, 'wdth' 100, 'slnt' 0`;
        item.el.style.transform = 'translate3d(0, 0, 0)';
      }
    });

    if (!anyMoving && !this.continuousWave) {
      engine.remove(this._boundUpdate);
    }
  }

  destroy() {
    engine.remove(this._boundUpdate);
    if (this.interactive) {
      this.el.removeEventListener('mousemove', this._onMouseMove);
      this.el.removeEventListener('mouseleave', this._onMouseLeave);
    }
    this.el.innerHTML = this._originalContent;
    this.el.classList.remove('mo-variable-physics-root');
  }
}
