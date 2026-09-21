/**
 * DotMatrixLedText — Digital Phosphor LED Dot Matrix Display.
 *
 * Renders typography through an authentic digital LED dot matrix grid with
 * phosphorescent halo glow, individual diode illumination, dynamic scanlines,
 * and electrical intensity flickering.
 */
export class DotMatrixLedText {
  /**
   * @param {HTMLElement} element
   * @param {Object} [options]
   * @param {string} [options.color='#00ff88'] - Active LED phosphor color
   * @param {string} [options.inactiveColor='#081e13'] - Inactive LED diode color
   * @param {number} [options.dotSize=3.5] - LED dot diameter in px
   * @param {number} [options.gap=2] - Spacing between dots in px
   * @param {boolean} [options.glow=true] - Phosphorescent ambient halo
   * @param {boolean} [options.flicker=true] - CRT diode electrical flicker
   * @param {boolean} [options.interactive=true] - Mouse illumination wave
   */
  constructor(element, options = {}) {
    this.el = element;
    this.color = options.color || '#00ff88';
    this.inactiveColor = options.inactiveColor || '#092115';
    this.dotSize = options.dotSize ?? 3.5;
    this.gap = options.gap ?? 2;
    this.glow = options.glow !== false;
    this.flicker = options.flicker !== false;
    this.interactive = options.interactive !== false;

    this._originalContent = this.el.innerHTML;
    this._originalText = (this.el.textContent || '').trim();
    this._init();
  }

  _init() {
    this.el.classList.add('mo-dot-matrix-root');
    const text = this._originalText;

    if (!document.getElementById('mo-dot-matrix-styles')) {
      const style = document.createElement('style');
      style.id = 'mo-dot-matrix-styles';
      style.textContent = `
        @keyframes moLedFlicker {
          0%, 100% { opacity: 0.96; }
          12% { opacity: 0.88; }
          25% { opacity: 0.99; }
          67% { opacity: 0.92; }
          82% { opacity: 1; }
          95% { opacity: 0.90; }
        }
        @keyframes moScanlineSweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `;
      document.head.appendChild(style);
    }

    // High performance DPI-aware HTML5 Canvas Matrix Renderer
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'mo-dot-matrix-canvas';
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

    this.wrapper = document.createElement('div');
    this.wrapper.className = 'mo-dot-matrix-wrapper';
    Object.assign(this.wrapper.style, {
      position: 'relative',
      display: 'inline-block',
      lineHeight: '1',
      verticalAlign: 'middle',
      filter: this.glow ? `drop-shadow(0 0 6px ${this.color}) drop-shadow(0 0 16px ${this.color}66)` : 'none',
      animation: this.flicker ? 'moLedFlicker 3s infinite' : 'none',
    });

    this.wrapper.appendChild(this.canvas);
    this.el.innerHTML = '';
    this.el.appendChild(this.wrapper);

    this._renderMatrix(text);

    if (this.interactive) {
      this._mousePos = { x: -100, y: -100 };
      this._onMouseMove = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this._mousePos.x = e.clientX - rect.left;
        this._mousePos.y = e.clientY - rect.top;
        this._renderMatrix(text, this._mousePos);
      };
      this._onMouseLeave = () => {
        this._mousePos = { x: -100, y: -100 };
        this._renderMatrix(text);
      };
      this.canvas.addEventListener('mousemove', this._onMouseMove, { passive: true });
      this.canvas.addEventListener('mouseleave', this._onMouseLeave);
    }

    this._onResize = () => this._renderMatrix(this._originalText);
    window.addEventListener('resize', this._onResize);
  }

  _renderMatrix(text, mousePos = null) {
    if (!this.ctx || !text) return;

    // Measure element typography or default to bold industrial sans
    const computed = window.getComputedStyle ? window.getComputedStyle(this.el) : { fontSize: '48px', fontWeight: '900' };
    const fontSize = parseFloat(computed.fontSize) || 48;
    const fontFamily = computed.fontFamily || 'monospace, sans-serif';
    const fontWeight = computed.fontWeight || '900';

    // Step 1: Offscreen render to rasterize glyphs into pixel mask
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    offCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const metrics = offCtx.measureText(text);
    const textWidth = Math.ceil(metrics.width) + 8;
    const textHeight = Math.ceil(fontSize * 1.2) + 8;

    offCanvas.width = textWidth;
    offCanvas.height = textHeight;
    offCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#ffffff';
    offCtx.fillText(text, 4, textHeight / 2);

    const imgData = offCtx.getImageData(0, 0, textWidth, textHeight).data;

    // Step 2: Calculate Grid Dimensions
    const dot = this.dotSize;
    const gap = this.gap;
    const pitch = dot + gap;

    const cols = Math.ceil(textWidth / pitch);
    const rows = Math.ceil(textHeight / pitch);

    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = cols * pitch;
    const canvasHeight = rows * pitch;

    this.canvas.width = canvasWidth * dpr;
    this.canvas.height = canvasHeight * dpr;
    this.canvas.style.width = `${canvasWidth}px`;
    this.canvas.style.height = `${canvasHeight}px`;

    const ctx = this.ctx;
    ctx.resetTransform?.();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const radius = dot / 2;

    // Step 3: Draw Diode Matrix
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const sampleX = Math.min(textWidth - 1, Math.round(c * pitch + radius));
        const sampleY = Math.min(textHeight - 1, Math.round(r * pitch + radius));
        const pixelIdx = (sampleY * textWidth + sampleX) * 4;
        const alpha = imgData[pixelIdx + 3] || 0;

        const posX = c * pitch + radius;
        const posY = r * pitch + radius;

        ctx.beginPath();
        ctx.arc(posX, posY, radius, 0, Math.PI * 2);

        if (alpha > 40) {
          // Active LED Diode
          const intensity = alpha / 255;
          let glowBoost = 0;
          if (mousePos) {
            const dist = Math.hypot(posX - mousePos.x, posY - mousePos.y);
            if (dist < 60) glowBoost = (1 - dist / 60) * 0.5;
          }

          ctx.fillStyle = this.color;
          ctx.globalAlpha = Math.min(1, intensity + glowBoost);
          ctx.fill();

          // Specular diode core highlight
          ctx.beginPath();
          ctx.arc(posX, posY, radius * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 0.55 * intensity;
          ctx.fill();
        } else {
          // Inactive Unlit Diode
          ctx.fillStyle = this.inactiveColor;
          ctx.globalAlpha = 0.35;
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  destroy() {
    window.removeEventListener('resize', this._onResize);
    if (this.interactive && this.canvas) {
      this.canvas.removeEventListener('mousemove', this._onMouseMove);
      this.canvas.removeEventListener('mouseleave', this._onMouseLeave);
    }
    this.el.innerHTML = this._originalContent;
    this.el.classList.remove('mo-dot-matrix-root');
  }
}
