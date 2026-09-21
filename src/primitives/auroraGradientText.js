/**
 * AuroraGradientText — Fluid Aurora Borealis Multi-Stop Chromatic Typography.
 *
 * Implements an ultra-smooth, multi-stop horizontal iridescent flow
 * inspired by natural polar auroras with animated light waves and subtle radiant bloom.
 */
export class AuroraGradientText {
  /**
   * @param {HTMLElement} element
   * @param {Object} [options]
   * @param {string[]} [options.colors] - Gradient color stops
   * @param {number} [options.speed=6] - Shimmer animation duration in seconds
   * @param {boolean} [options.glow=true] - Radiant background atmospheric bloom
   * @param {boolean} [options.interactive=true] - Mouse glow tracking
   */
  constructor(element, options = {}) {
    this.el = element;
    this.colors = options.colors || [
      '#a8edea', // Icy Mint Cyan
      '#fed6e3', // Pastel Blush
      '#d299c2', // Lavender
      '#ea73c0', // Aurora Magenta
      '#ff9a9e', // Soft Coral
      '#fecfef', // Cotton Pink
      '#f6d365', // Golden Sunrise
      '#a8edea', // Seamless Loop wrap
    ];
    this.speed = options.speed || 6;
    this.glow = options.glow !== false;
    this.interactive = options.interactive !== false;

    this._originalContent = this.el.innerHTML;
    this._originalText = this.el.textContent || '';
    this._init();
  }

  _init() {
    this.el.classList.add('mo-aurora-root');
    const text = this._originalText;

    if (!document.getElementById('mo-aurora-keyframes')) {
      const style = document.createElement('style');
      style.id = 'mo-aurora-keyframes';
      style.textContent = `
        @keyframes moAuroraFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes moAuroraBreath {
          0%, 100% { opacity: 0.55; transform: scale(0.99); }
          50% { opacity: 0.95; transform: scale(1.01); }
        }
      `;
      document.head.appendChild(style);
    }

    const gradientCss = `linear-gradient(135deg, ${this.colors.join(', ')})`;

    this.wrapper = document.createElement('span');
    this.wrapper.className = 'mo-aurora-wrapper';
    Object.assign(this.wrapper.style, {
      position: 'relative',
      display: 'inline-block',
      fontWeight: 'inherit',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
    });

    // 1. Radiant Atmospheric Glow duplicate layer
    if (this.glow) {
      this.glowLayer = document.createElement('span');
      this.glowLayer.className = 'mo-aurora-glow';
      this.glowLayer.setAttribute('aria-hidden', 'true');
      this.glowLayer.textContent = text;
      Object.assign(this.glowLayer.style, {
        position: 'absolute',
        inset: '0',
        zIndex: '1',
        backgroundImage: gradientCss,
        backgroundSize: '300% 300%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'blur(16px)',
        opacity: '0.65',
        pointerEvents: 'none',
        userSelect: 'none',
        animation: `moAuroraFlow ${this.speed}s ease infinite, moAuroraBreath 4s ease-in-out infinite`,
      });
      this.wrapper.appendChild(this.glowLayer);
    }

    // 2. High-Definition Foreground Aurora Text
    this.textLayer = document.createElement('span');
    this.textLayer.className = 'mo-aurora-text';
    this.textLayer.textContent = text;
    Object.assign(this.textLayer.style, {
      position: 'relative',
      zIndex: '2',
      display: 'inline-block',
      backgroundImage: gradientCss,
      backgroundSize: '300% 300%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      animation: `moAuroraFlow ${this.speed}s ease infinite`,
    });
    this.wrapper.appendChild(this.textLayer);

    this.el.innerHTML = '';
    this.el.appendChild(this.wrapper);

    if (this.interactive) {
      this._onMouseMove = (e) => {
        const rect = this.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const offset = ((e.clientX - cx) / (rect.width || 1)) * 25;
        this.textLayer.style.filter = `drop-shadow(${offset * 0.2}px 0 12px rgba(234, 115, 192, 0.45))`;
      };
      this._onMouseLeave = () => {
        this.textLayer.style.filter = 'none';
      };
      this.el.addEventListener('mousemove', this._onMouseMove, { passive: true });
      this.el.addEventListener('mouseleave', this._onMouseLeave);
    }
  }

  destroy() {
    if (this.interactive) {
      this.el.removeEventListener('mousemove', this._onMouseMove);
      this.el.removeEventListener('mouseleave', this._onMouseLeave);
    }
    this.el.innerHTML = this._originalContent;
    this.el.classList.remove('mo-aurora-root');
  }
}
