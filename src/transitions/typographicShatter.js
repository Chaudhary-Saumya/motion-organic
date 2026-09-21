import { PageTransition } from './base.js';

/**
 * TypographicShatter — Bold typography explosive character scatter transition.
 * Renders a massive typographic word across the viewport. On trigger, individual
 * letterforms explode outward with 3D translation, rotation, and scale momentum.
 */
export class TypographicShatter extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {string} [options.word='GOALS'] - Displayed word
   * @param {string} [options.fontSize='18vw'] - CSS font size
   * @param {number|string} [options.fontWeight=900] - CSS font weight
   * @param {string} [options.fontFamily='system-ui, -apple-system, sans-serif'] - Font family
   * @param {string} [options.textColor='#ffffff'] - Letterform fill color
   * @param {string} [options.bgColor='#0a0a0f'] - Background cover color
   * @param {number} [options.scatterRadius=200] - Max explosion radius in px
   * @param {HTMLElement} [options.container=document.body] - Container
   * @param {number} [options.stiffness=135] - Spring stiffness
   * @param {number} [options.damping=19] - Spring damping
   */
  constructor({
    word = 'GOALS',
    fontSize = '18vw',
    fontWeight = 900,
    fontFamily = 'system-ui, -apple-system, sans-serif',
    textColor = '#ffffff',
    bgColor = '#0a0a0f',
    scatterRadius = 200,
    container = document.body,
    stiffness = 135,
    damping = 19,
  } = {}) {
    super();
    this.word = word || 'GOALS';
    this.fontSize = fontSize;
    this.fontWeight = fontWeight;
    this.fontFamily = fontFamily;
    this.textColor = textColor;
    this.bgColor = bgColor;
    this.scatterRadius = scatterRadius;
    this.container = container;
    this.baseSpring.stiffness = stiffness;
    this.baseSpring.damping = damping;

    this.letters = [];
    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body;
    this.overlay = document.createElement('div');
    this.overlay.className = 'mo-typo-shatter-overlay';
    Object.assign(this.overlay.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      zIndex: '9999',
      pointerEvents: 'none',
      backgroundColor: this.bgColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      perspective: '1000px',
      overflow: 'hidden',
      opacity: '0',
      willChange: 'opacity',
    });

    this.wordWrapper = document.createElement('div');
    this.wordWrapper.className = 'mo-word-shatter-wrapper';
    Object.assign(this.wordWrapper.style, {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      letterSpacing: '0.04em',
    });

    const chars = Array.from(this.word);
    const midIdx = (chars.length - 1) / 2;

    chars.forEach((char, idx) => {
      const span = document.createElement('span');
      span.textContent = char;
      Object.assign(span.style, {
        display: 'inline-block',
        fontSize: this.fontSize,
        fontWeight: String(this.fontWeight),
        fontFamily: this.fontFamily,
        color: this.textColor,
        willChange: 'transform, opacity',
        transformOrigin: 'center center',
      });

      // Compute directional explosion angle radiating from center
      const offsetIndex = idx - midIdx;
      const angle = (offsetIndex / Math.max(1, midIdx)) * 0.8 + ((idx % 2 === 0 ? 1 : -1) * 0.3);
      const vx = Math.sin(angle) * this.scatterRadius * (1 + Math.abs(offsetIndex) * 0.5);
      const vy = (idx % 2 === 0 ? -1 : 1) * this.scatterRadius * 0.6;
      const rotZ = (offsetIndex * 35) + (idx % 2 === 0 ? -20 : 20);
      const rotX = (idx % 2 === 0 ? 45 : -45);

      this.letters.push({
        el: span,
        vx,
        vy,
        rotZ,
        rotX,
        delay: Math.abs(offsetIndex) * 0.08,
      });

      this.wordWrapper.appendChild(span);
    });

    this.overlay.appendChild(this.wordWrapper);
    this.container.appendChild(this.overlay);
  }

  /**
   * t in [0, 1]: 0 is solid text centered, 1 is fully shattered outward
   */
  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));
    
    // Background visibility & fade
    this.overlay.style.opacity = clampedT > 0.001 ? String(Math.min(1, (1 - clampedT * 0.8) * 1.5)) : '0';

    for (const l of this.letters) {
      const localT = Math.max(0, Math.min(1, (clampedT - l.delay) / (1 - l.delay || 0.001)));
      const tx = localT * l.vx;
      const ty = localT * l.vy;
      const rz = localT * l.rotZ;
      const rx = localT * l.rotX;
      const scale = 1 + localT * 0.5;
      const opacity = Math.max(0, 1 - localT * 1.4);

      l.el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${scale.toFixed(3)}) rotateZ(${rz.toFixed(1)}deg) rotateX(${rx.toFixed(1)}deg)`;
      l.el.style.opacity = opacity.toFixed(3);
    }
  }

  async trigger(e, onCovered) {
    this.overlay.style.pointerEvents = 'auto';
    this.overlay.style.opacity = '1';
    this.render(0);

    // Initial word flash (0 -> 0.1)
    await new Promise((r) => setTimeout(r, 60));
    onCovered?.();

    // Explode characters outward (0 -> 1)
    await this._springTo(1);
    this.overlay.style.opacity = '0';
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
    this.letters = [];
  }
}
