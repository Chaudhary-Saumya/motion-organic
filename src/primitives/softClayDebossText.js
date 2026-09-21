import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';

/**
 * SoftClayDebossText — Tactile Claymorphic Inset Soft Deboss Typography.
 *
 * Recreates the pillowy, pressed-in clay aesthetic with dynamic multi-angle
 * directional specular highlights, soft ambient deboss shadows, and interactive
 * spring-driven pressure response on hover/press.
 */
export class SoftClayDebossText {
  /**
   * @param {HTMLElement} element
   * @param {Object} [options]
   * @param {string} [options.bgColor='#fca5a5'] - Base surface color
   * @param {string} [options.textColor='#e07a7a'] - Inset text color tone
   * @param {number} [options.depth=5] - Base deboss depth in px
   * @param {number} [options.softness=6] - Shadow blur radius
   * @param {boolean} [options.interactive=true] - Dynamic light angle tracking
   */
  constructor(element, options = {}) {
    this.el = element;
    this.bgColor = options.bgColor || '#fca5a5';
    this.textColor = options.textColor || '#e07a7a';
    this.depth = options.depth ?? 5;
    this.softness = options.softness ?? 6;
    this.interactive = options.interactive !== false;

    this.springX = new Spring({ stiffness: 120, damping: 14 });
    this.springY = new Spring({ stiffness: 120, damping: 14 });
    this.pressSpring = new Spring({ stiffness: 200, damping: 16 });

    this._originalContent = this.el.innerHTML;
    this._originalText = this.el.textContent || '';
    this._boundUpdate = this._update.bind(this);
    this._init();
  }

  _init() {
    this.el.classList.add('mo-clay-root');
    const text = this._originalText;

    this.wrapper = document.createElement('span');
    this.wrapper.className = 'mo-clay-wrapper';
    Object.assign(this.wrapper.style, {
      position: 'relative',
      display: 'inline-block',
      color: this.textColor,
      fontWeight: '900',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
      userSelect: 'none',
      cursor: this.interactive ? 'pointer' : 'inherit',
      transition: 'color 0.25s ease',
    });

    this.wrapper.textContent = text;
    this._applyShadow(1, 1, 0);

    this.el.innerHTML = '';
    this.el.appendChild(this.wrapper);

    if (this.interactive) {
      this._onMouseMove = (e) => {
        const rect = this.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2 || 1)));
        const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2 || 1)));
        this.springX.setTarget(nx * 1.5);
        this.springY.setTarget(ny * 1.5);
        engine.add(this._boundUpdate);
      };

      this._onMouseLeave = () => {
        this.springX.setTarget(1);
        this.springY.setTarget(1);
        this.pressSpring.setTarget(0);
        engine.add(this._boundUpdate);
      };

      this._onMouseDown = () => {
        this.pressSpring.setTarget(1);
        engine.add(this._boundUpdate);
      };

      this._onMouseUp = () => {
        this.pressSpring.setTarget(0);
        engine.add(this._boundUpdate);
      };

      this.el.addEventListener('mousemove', this._onMouseMove, { passive: true });
      this.el.addEventListener('mouseleave', this._onMouseLeave);
      this.el.addEventListener('mousedown', this._onMouseDown);
      window.addEventListener('mouseup', this._onMouseUp);

      engine.add(this._boundUpdate);
    }
  }

  _applyShadow(dx, dy, press) {
    const d = this.depth * (1 + press * 0.4);
    const s = this.softness;
    
    // Dynamic deboss lighting model
    const lx = -dx * d;
    const ly = -dy * d;
    const rx = dx * d;
    const ry = dy * d;

    const shadowString = `
      ${lx.toFixed(1)}px ${ly.toFixed(1)}px ${s}px rgba(255, 255, 255, 0.45),
      ${rx.toFixed(1)}px ${ry.toFixed(1)}px ${s}px rgba(160, 60, 60, 0.4),
      ${(rx * 1.5).toFixed(1)}px ${(ry * 1.5).toFixed(1)}px ${(s * 1.8).toFixed(1)}px rgba(100, 30, 30, 0.2)
    `;

    this.wrapper.style.textShadow = shadowString;
    this.wrapper.style.transform = `scale(${1 - press * 0.02}) translate3d(${(dx * press).toFixed(1)}px, ${(dy * press).toFixed(1)}px, 0)`;
  }

  _update(dt) {
    const x = this.springX.update(dt);
    const y = this.springY.update(dt);
    const p = this.pressSpring.update(dt);
    this._applyShadow(x, y, p);
  }

  destroy() {
    engine.remove(this._boundUpdate);
    if (this.interactive) {
      this.el.removeEventListener('mousemove', this._onMouseMove);
      this.el.removeEventListener('mouseleave', this._onMouseLeave);
      this.el.removeEventListener('mousedown', this._onMouseDown);
      window.removeEventListener('mouseup', this._onMouseUp);
    }
    this.el.innerHTML = this._originalContent;
    this.el.classList.remove('mo-clay-root');
  }
}
