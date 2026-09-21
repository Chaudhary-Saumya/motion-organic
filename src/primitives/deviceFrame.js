import { Spring } from '../core/spring.js';

/**
 * DeviceFrame Primitive (Vanilla JS)
 * Renders an interactive 3D Smartphone mockup with speaker notch,
 * conversational chat feed, and cursor/touch spring perspective tracking.
 */
export class DeviceFrame {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      width: options.width || 340,
      height: options.height || 680,
      bezelRadius: options.bezelRadius || 46,
      borderColor: options.borderColor || '#2b2d35',
      accentColor: options.accentColor || '#38bdf8',
      interactive: options.interactive !== false,
      maxTilt: options.maxTilt || 18, // max degrees tilt
      ...options,
    };

    this.springX = new Spring({ stiffness: 140, damping: 15 });
    this.springY = new Spring({ stiffness: 140, damping: 15 });
    this.frameEl = null;
    this._raf = null;

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.container.style.perspective = '1200px';
    this.container.style.transformStyle = 'preserve-3d';

    this.frameEl = document.createElement('div');
    this.frameEl.className = 'mo-device-frame';
    Object.assign(this.frameEl.style, {
      width: `${this.options.width}px`,
      height: `${this.options.height}px`,
      borderRadius: `${this.options.bezelRadius}px`,
      background: '#0d0f14',
      border: `4px solid ${this.options.borderColor}`,
      boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.8), inset 0 0 0 2px rgba(255, 255, 255, 0.08)',
      position: 'relative',
      overflow: 'hidden',
      transformStyle: 'preserve-3d',
      willChange: 'transform',
      margin: '0 auto',
    });

    // Top Notch / Island
    const notch = document.createElement('div');
    Object.assign(notch.style, {
      position: 'absolute',
      top: '12px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90px',
      height: '18px',
      borderRadius: '999px',
      background: '#000000',
      zIndex: '20',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    });

    const lens = document.createElement('div');
    Object.assign(lens.style, {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#161922',
    });
    notch.appendChild(lens);
    this.frameEl.appendChild(notch);

    this.container.appendChild(this.frameEl);

    if (this.options.interactive) {
      this._bindEvents();
    }

    this._tick();
  }

  _bindEvents() {
    this._onMouseMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;
      const dx = (e.clientX - cx) / (rect.width * 0.5);
      const dy = (e.clientY - cy) / (rect.height * 0.5);

      this.springX.set(-dy * this.options.maxTilt);
      this.springY.set(dx * this.options.maxTilt);
    };

    this._onMouseLeave = () => {
      this.springX.set(0);
      this.springY.set(0);
    };

    this.container.addEventListener('mousemove', this._onMouseMove);
    this.container.addEventListener('mouseleave', this._onMouseLeave);
  }

  _tick() {
    this.springX.step(0.016);
    this.springY.step(0.016);

    if (this.frameEl) {
      this.frameEl.style.transform = `rotateX(${this.springX.value.toFixed(2)}deg) rotateY(${this.springY.value.toFixed(2)}deg)`;
    }

    this._raf = requestAnimationFrame(() => this._tick());
  }

  destroy() {
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this.container && this._onMouseMove) {
      this.container.removeEventListener('mousemove', this._onMouseMove);
      this.container.removeEventListener('mouseleave', this._onMouseLeave);
    }
    if (this.frameEl && this.frameEl.parentNode) {
      this.frameEl.parentNode.removeChild(this.frameEl);
    }
  }
}
