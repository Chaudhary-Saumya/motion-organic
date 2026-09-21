/**
 * ChromaticGlitchText — Cyberpunk Tri-Color Horizontal Matrix Glitch Slice.
 *
 * Slices typography into discrete horizontal strata with RGB color separation
 * (e.g. Red/Magenta Top, Pure White Center, Cyan Bottom) and randomized
 * anamorphic displacement jitter.
 */
export class ChromaticGlitchText {
  /**
   * @param {HTMLElement} element
   * @param {Object} [options]
   * @param {string} [options.topColor='#ff0055'] - Top slice tint
   * @param {string} [options.midColor='#ffffff'] - Center face color
   * @param {string} [options.botColor='#00e5ff'] - Bottom slice tint
   * @param {boolean} [options.hoverSurge=true] - Trigger intense glitch on hover
   * @param {number} [options.intensity=1] - Glitch displacement scale
   */
  constructor(element, options = {}) {
    this.el = element;
    this.topColor = options.topColor || '#ff0055';
    this.midColor = options.midColor || '#ffffff';
    this.botColor = options.botColor || '#00e5ff';
    this.hoverSurge = options.hoverSurge !== false;
    this.intensity = options.intensity || 1;

    this._originalContent = this.el.innerHTML;
    this._originalText = this.el.textContent || '';
    this._init();
  }

  _init() {
    this.el.classList.add('mo-glitch-root');
    const text = this._originalText;

    if (!document.getElementById('mo-glitch-styles')) {
      const style = document.createElement('style');
      style.id = 'mo-glitch-styles';
      style.textContent = `
        @keyframes moGlitchTop {
          0%, 100% { transform: translate(0, 0); }
          15% { transform: translate(-3px, -1px); }
          30% { transform: translate(4px, 1px); }
          45% { transform: translate(-2px, 0); }
          60% { transform: translate(3px, 0); }
          75% { transform: translate(-1px, 1px); }
        }
        @keyframes moGlitchBot {
          0%, 100% { transform: translate(0, 0); }
          15% { transform: translate(3px, 1px); }
          30% { transform: translate(-4px, -1px); }
          45% { transform: translate(2px, 0); }
          60% { transform: translate(-3px, 0); }
          75% { transform: translate(1px, -1px); }
        }
      `;
      document.head.appendChild(style);
    }

    this.wrapper = document.createElement('span');
    this.wrapper.className = 'mo-glitch-wrapper';
    Object.assign(this.wrapper.style, {
      position: 'relative',
      display: 'inline-block',
      fontWeight: 'inherit',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
    });

    // 1. Top Red/Magenta slice (0% -> 34%)
    this.topLayer = document.createElement('span');
    this.topLayer.className = 'mo-glitch-top';
    this.topLayer.setAttribute('aria-hidden', 'true');
    this.topLayer.textContent = text;
    Object.assign(this.topLayer.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '2',
      color: this.topColor,
      clipPath: 'polygon(0 0, 100% 0, 100% 34%, 0 34%)',
      webkitClipPath: 'polygon(0 0, 100% 0, 100% 34%, 0 34%)',
      animation: 'moGlitchTop 2.8s infinite ease-in-out',
      pointerEvents: 'none',
    });

    // 2. Middle White slice (33% -> 67%)
    this.midLayer = document.createElement('span');
    this.midLayer.className = 'mo-glitch-mid';
    this.midLayer.textContent = text;
    Object.assign(this.midLayer.style, {
      position: 'relative',
      zIndex: '3',
      display: 'inline-block',
      color: this.midColor,
      clipPath: 'polygon(0 33%, 100% 33%, 100% 67%, 0 67%)',
      webkitClipPath: 'polygon(0 33%, 100% 33%, 100% 67%, 0 67%)',
    });

    // 3. Bottom Cyan slice (66% -> 100%)
    this.botLayer = document.createElement('span');
    this.botLayer.className = 'mo-glitch-bot';
    this.botLayer.setAttribute('aria-hidden', 'true');
    this.botLayer.textContent = text;
    Object.assign(this.botLayer.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '2',
      color: this.botColor,
      clipPath: 'polygon(0 66%, 100% 66%, 100% 100%, 0 100%)',
      webkitClipPath: 'polygon(0 66%, 100% 66%, 100% 100%, 0 100%)',
      animation: 'moGlitchBot 2.4s infinite ease-in-out',
      pointerEvents: 'none',
    });

    // 4. Background base layer for seamless glyph continuity
    this.baseLayer = document.createElement('span');
    this.baseLayer.className = 'mo-glitch-base';
    this.baseLayer.setAttribute('aria-hidden', 'true');
    this.baseLayer.textContent = text;
    Object.assign(this.baseLayer.style, {
      position: 'absolute',
      inset: '0',
      zIndex: '1',
      color: this.midColor,
      opacity: '0.15',
    });

    this.wrapper.append(this.baseLayer, this.topLayer, this.midLayer, this.botLayer);
    this.el.innerHTML = '';
    this.el.appendChild(this.wrapper);

    if (this.hoverSurge) {
      this._onMouseEnter = () => {
        this.topLayer.style.animationDuration = '0.35s';
        this.botLayer.style.animationDuration = '0.35s';
      };
      this._onMouseLeave = () => {
        this.topLayer.style.animationDuration = '2.8s';
        this.botLayer.style.animationDuration = '2.4s';
      };
      this.el.addEventListener('mouseenter', this._onMouseEnter);
      this.el.addEventListener('mouseleave', this._onMouseLeave);
    }
  }

  destroy() {
    if (this._onMouseEnter) {
      this.el.removeEventListener('mouseenter', this._onMouseEnter);
      this.el.removeEventListener('mouseleave', this._onMouseLeave);
    }
    this.el.innerHTML = this._originalContent;
    this.el.classList.remove('mo-glitch-root');
  }
}
