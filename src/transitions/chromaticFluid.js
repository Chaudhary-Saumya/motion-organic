import { PageTransition } from './base.js';

/**
 * ChromaticFluidDisplacement — Real-Time Liquid Glass Refraction & Chromatic Dispersion.
 * Simulates a heavy molten optical fluid lens rippling across the screen.
 * Uses SVG dynamic feDisplacementMap + feTurbulence with RGB chromatic aberration
 * split and specular caustic highlights.
 */
export class ChromaticFluidDisplacement extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {number} [options.maxDistortion=120] - Max pixel displacement scale
   * @param {HTMLElement} [options.container=document.body]
   * @param {HTMLElement} [options.currentPageEl]
   * @param {HTMLElement} [options.nextPageEl]
   * @param {number} [options.stiffness=95]
   * @param {number} [options.damping=22]
   */
  constructor({
    maxDistortion = 120,
    container = document.body,
    currentPageEl = null,
    nextPageEl = null,
    stiffness = 95,
    damping = 22,
  } = {}) {
    super();
    this.maxDistortion = maxDistortion;
    this.container = container;
    this.currentPageEl = currentPageEl;
    this.nextPageEl = nextPageEl;
    this.baseSpring.stiffness = stiffness;
    this.baseSpring.damping = damping;

    this._filterId = 'chroma-fluid-' + Math.random().toString(36).slice(2, 9);
    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body;
    const svgNS = 'http://www.w3.org/2000/svg';

    this.svg = document.createElementNS(svgNS, 'svg');
    Object.assign(this.svg.style, {
      position: 'absolute',
      width: '0',
      height: '0',
      pointerEvents: 'none',
    });

    const defs = document.createElementNS(svgNS, 'defs');
    const filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', this._filterId);
    filter.setAttribute('x', '-20%');
    filter.setAttribute('y', '-20%');
    filter.setAttribute('width', '140%');
    filter.setAttribute('height', '140%');

    // Turbulence noise
    this.turbulence = document.createElementNS(svgNS, 'feTurbulence');
    this.turbulence.setAttribute('type', 'fractalNoise');
    this.turbulence.setAttribute('baseFrequency', '0.015 0.015');
    this.turbulence.setAttribute('numOctaves', '3');
    this.turbulence.setAttribute('result', 'fluidNoise');

    // Displacement map
    this.displacement = document.createElementNS(svgNS, 'feDisplacementMap');
    this.displacement.setAttribute('in', 'SourceGraphic');
    this.displacement.setAttribute('in2', 'fluidNoise');
    this.displacement.setAttribute('scale', '0');
    this.displacement.setAttribute('xChannelSelector', 'R');
    this.displacement.setAttribute('yChannelSelector', 'G');

    filter.append(this.turbulence, this.displacement);
    defs.appendChild(filter);
    this.svg.appendChild(defs);
    this.container.appendChild(this.svg);

    // Liquid refractive chromatic sheen overlay
    this.chromaOverlay = document.createElement('div');
    this.chromaOverlay.className = 'chromatic-fluid-sheen';
    Object.assign(this.chromaOverlay.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      zIndex: '9999',
      pointerEvents: 'none',
      opacity: '0',
      background: 'radial-gradient(circle at 50% 50%, rgba(106, 200, 255, 0.25) 0%, rgba(255, 106, 159, 0.2) 40%, rgba(124, 106, 255, 0.15) 70%, transparent 100%)',
      mixBlendMode: 'color-dodge',
    });
    this.container.appendChild(this.chromaOverlay);
  }

  /**
   * t in [0, 1]
   */
  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));

    // Bell curve for distortion peak at t = 0.5: sin(t * PI)
    const peakFactor = Math.sin(clampedT * Math.PI);
    const distortionScale = peakFactor * this.maxDistortion;
    const freq = (0.012 + clampedT * 0.025).toFixed(4);

    this.turbulence.setAttribute('baseFrequency', `${freq} ${freq}`);
    this.displacement.setAttribute('scale', distortionScale.toFixed(1));

    // Chromatic sheen brightness
    this.chromaOverlay.style.opacity = String((peakFactor * 0.9).toFixed(3));
    this.chromaOverlay.style.transform = `scale(${(1 + clampedT * 0.3).toFixed(3)})`;

    // Apply fluid displacement filter to outgoing or incoming element
    if (this.currentPageEl) {
      if (distortionScale > 1) {
        this.currentPageEl.style.filter = `url(#${this._filterId}) blur(${(clampedT * 8).toFixed(1)}px)`;
      } else {
        this.currentPageEl.style.filter = 'none';
      }
      const outOpacity = Math.max(0, 1 - clampedT * 1.6);
      this.currentPageEl.style.opacity = String(outOpacity.toFixed(3));
      this.currentPageEl.style.transform = `scale(${(1 + clampedT * 0.08).toFixed(3)})`;
    }

    if (this.nextPageEl) {
      const inOpacity = Math.min(1, clampedT * 1.6);
      const inScale = 1.06 - clampedT * 0.06;
      this.nextPageEl.style.opacity = String(inOpacity.toFixed(3));
      this.nextPageEl.style.transform = `scale(${inScale.toFixed(3)})`;
    }
  }

  onReset() {
    this.render(0);
    if (this.currentPageEl) {
      this.currentPageEl.style.filter = 'none';
      this.currentPageEl.style.transform = 'none';
      this.currentPageEl.style.opacity = '1';
    }
    if (this.nextPageEl) {
      this.nextPageEl.style.opacity = '0';
      this.nextPageEl.style.transform = 'none';
    }
  }

  destroy() {
    super.destroy();
    this.svg.remove();
    this.chromaOverlay.remove();
  }
}
