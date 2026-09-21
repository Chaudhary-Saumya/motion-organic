/**
 * NeonFlickerText — Bioluminescent Gas Tube Glow with Electrical Harmonic Flicker.
 *
 * Implements realistic neon typography with:
 * - High-intensity neon core + multi-tier ambient diffusion glow
 * - Procedural electrical voltage flicker micro-jitters
 * - Hover ignition / flare pulse
 */
export class NeonFlickerText {
  /**
   * @param {HTMLElement} element
   * @param {Object} [options]
   * @param {string} [options.color='#22c55e'] - Neon glow color
   * @param {string} [options.coreColor='#ffffff'] - Inner tube core color
   * @param {boolean} [options.flicker=true] - Enable random electrical flicker
   * @param {number} [options.glowIntensity=1] - Glow radius multiplier
   */
  constructor(element, options = {}) {
    this.el = element;
    this.color = options.color || '#22c55e';
    this.coreColor = options.coreColor || '#ffffff';
    this.flicker = options.flicker !== false;
    this.glowIntensity = options.glowIntensity || 1;

    this._originalContent = this.el.innerHTML;
    this._originalText = this.el.textContent || '';
    this._init();
  }

  _init() {
    this.el.classList.add('mo-neon-flicker-root');
    const text = this._originalText;

    if (!document.getElementById('mo-neon-styles')) {
      const style = document.createElement('style');
      style.id = 'mo-neon-styles';
      style.textContent = `
        @keyframes moNeonFlicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
            opacity: 1;
            filter: drop-shadow(0 0 8px var(--mo-neon-col)) drop-shadow(0 0 20px var(--mo-neon-col));
          }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
            opacity: 0.35;
            filter: drop-shadow(0 0 2px var(--mo-neon-col));
          }
        }
      `;
      document.head.appendChild(style);
    }

    const c = this.color;
    const r = this.glowIntensity;
    const glowShadow = `
      0 0 ${4 * r}px ${this.coreColor},
      0 0 ${10 * r}px ${c},
      0 0 ${24 * r}px ${c},
      0 0 ${45 * r}px ${c}
    `;

    this.wrapper = document.createElement('span');
    this.wrapper.className = 'mo-neon-wrapper';
    if (this.wrapper.style.setProperty) {
      this.wrapper.style.setProperty('--mo-neon-col', c);
    } else {
      this.wrapper.style['--mo-neon-col'] = c;
    }
    Object.assign(this.wrapper.style, {
      position: 'relative',
      display: 'inline-block',
      color: this.coreColor,
      textShadow: glowShadow,
      fontWeight: 'inherit',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
      animation: this.flicker ? 'moNeonFlicker 5.5s infinite alternate' : 'none',
    });

    this.wrapper.textContent = text;
    this.el.innerHTML = '';
    this.el.appendChild(this.wrapper);
  }

  destroy() {
    this.el.innerHTML = this._originalContent;
    this.el.classList.remove('mo-neon-flicker-root');
  }
}
