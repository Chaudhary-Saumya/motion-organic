import { PageTransition } from './base.js';

/**
 * NoiseDisintegration — Procedural noise & grain digital static dissolve.
 * Animated SVG turbulence and displacement filter that dissolves the screen
 * into organic digital static grain from the trigger point or center.
 */
export class NoiseDisintegration extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {number} [options.grainScale=4] - Noise texture grain scale
   * @param {string} [options.noiseColor='#0b0b13'] - Noise layer fill color
   * @param {number} [options.displacement=60] - Max pixel displacement
   * @param {HTMLElement} [options.container=document.body] - Container
   * @param {number} [options.stiffness=125] - Spring stiffness
   * @param {number} [options.damping=20] - Spring damping
   */
  constructor({
    grainScale = 4,
    noiseColor = '#0b0b13',
    displacement = 60,
    container = document.body,
    stiffness = 125,
    damping = 20,
  } = {}) {
    super();
    this.grainScale = grainScale;
    this.noiseColor = noiseColor;
    this.displacement = displacement;
    this.container = container;
    this.baseSpring.stiffness = stiffness;
    this.baseSpring.damping = damping;

    this.cx = window.innerWidth / 2;
    this.cy = window.innerHeight / 2;
    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body;
    const svgNS = 'http://www.w3.org/2000/svg';
    const filterId = 'mo-noise-disp-' + Math.random().toString(36).slice(2, 8);
    this.filterId = filterId;

    this.overlay = document.createElement('div');
    this.overlay.className = 'mo-noise-disintegrate-overlay';
    Object.assign(this.overlay.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      zIndex: '9999',
      pointerEvents: 'none',
      overflow: 'hidden',
      opacity: '0',
      willChange: 'opacity, filter',
    });

    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    Object.assign(this.svg.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' });

    const defs = document.createElementNS(svgNS, 'defs');
    const filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', filterId);
    filter.setAttribute('x', '-20%');
    filter.setAttribute('y', '-20%');
    filter.setAttribute('width', '140%');
    filter.setAttribute('height', '140%');

    this.turbulence = document.createElementNS(svgNS, 'feTurbulence');
    this.turbulence.setAttribute('type', 'fractalNoise');
    this.turbulence.setAttribute('baseFrequency', '0.04');
    this.turbulence.setAttribute('numOctaves', '3');
    this.turbulence.setAttribute('result', 'noise');

    this.dispMap = document.createElementNS(svgNS, 'feDisplacementMap');
    this.dispMap.setAttribute('in', 'SourceGraphic');
    this.dispMap.setAttribute('in2', 'noise');
    this.dispMap.setAttribute('scale', '0');
    this.dispMap.setAttribute('xChannelSelector', 'R');
    this.dispMap.setAttribute('yChannelSelector', 'G');

    filter.append(this.turbulence, this.dispMap);
    defs.appendChild(filter);

    this.noiseRect = document.createElementNS(svgNS, 'rect');
    this.noiseRect.setAttribute('width', '100%');
    this.noiseRect.setAttribute('height', '100%');
    this.noiseRect.setAttribute('fill', this.noiseColor);
    this.noiseRect.setAttribute('filter', `url(#${filterId})`);

    this.svg.append(defs, this.noiseRect);
    this.overlay.appendChild(this.svg);
    this.container.appendChild(this.overlay);
  }

  setOrigin(x, y) {
    this.cx = x ?? window.innerWidth / 2;
    this.cy = y ?? window.innerHeight / 2;
  }

  /**
   * t in [0, 1]
   */
  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));
    const scale = clampedT * this.displacement;
    const freq = 0.03 + clampedT * 0.05;

    this.dispMap.setAttribute('scale', String(scale.toFixed(1)));
    this.turbulence.setAttribute('baseFrequency', String(freq.toFixed(3)));

    this.overlay.style.opacity = String(Math.min(1, clampedT * 1.8).toFixed(3));
  }

  async trigger(e, onCovered) {
    const x = e?.clientX ?? (e?.touches ? e.touches[0].clientX : window.innerWidth / 2);
    const y = e?.clientY ?? (e?.touches ? e.touches[0].clientY : window.innerHeight / 2);
    this.setOrigin(x, y);

    this.overlay.style.pointerEvents = 'auto';
    this.render(0);

    // Phase 1: Noise dissolve covers viewport (0 -> 1)
    await this._springTo(1);
    onCovered?.();

    // Phase 2: Noise clears smoothly (1 -> 0)
    await this._springTo(0);
    this.overlay.style.pointerEvents = 'none';
  }

  _springTo(target) {
    return new Promise((resolve) => {
      this.baseSpring.onUpdate = (v) => this.render(v);
      this.baseSpring.onSettle = resolve;
      this.baseSpring.set(target);
      import('../core/engine.js').then(({ engine }) => engine.add(this.baseSpring));
    });
  }

  onReset() {
    this.render(0);
    this.overlay.style.opacity = '0';
    this.overlay.style.pointerEvents = 'none';
  }

  destroy() {
    super.destroy();
    this.overlay.remove();
  }
}
