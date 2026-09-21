import { PageTransition } from './base.js';

/**
 * RackFocusTransition — Cinematic dual focal planes.
 * Simulates a camera lens shifting focus between foreground and background.
 * The outgoing page blurs out and pushes back while the incoming page starts
 * defocused and pulls into sharp focus with chromatic depth.
 */
export class RackFocusTransition extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {number} [options.maxBlur=18] - Maximum Gaussian blur in pixels
   * @param {HTMLElement} [options.container=document.body] - Container
   * @param {HTMLElement} [options.currentPageEl] - Outgoing page element
   * @param {HTMLElement} [options.nextPageEl] - Incoming page element
   * @param {number} [options.stiffness=100] - Spring stiffness
   * @param {number} [options.damping=24] - Spring damping
   */
  constructor({
    maxBlur = 18,
    container = document.body,
    currentPageEl = null,
    nextPageEl = null,
    stiffness = 100,
    damping = 24,
  } = {}) {
    super();
    this.maxBlur = maxBlur;
    this.container = container;
    this.currentPageEl = currentPageEl;
    this.nextPageEl = nextPageEl;
    this.baseSpring.stiffness = stiffness;
    this.baseSpring.damping = damping;

    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body;
    this.overlay = document.createElement('div');
    this.overlay.className = 'rack-focus-overlay';
    Object.assign(this.overlay.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      zIndex: '9999',
      pointerEvents: 'none',
      display: 'none',
    });

    this.outLayer = document.createElement('div');
    this.inLayer = document.createElement('div');
    for (const l of [this.outLayer, this.inLayer]) {
      Object.assign(l.style, {
        position: 'absolute',
        inset: '0',
        willChange: 'filter, opacity, transform',
      });
    }

    this.overlay.append(this.outLayer, this.inLayer);
    this.container.appendChild(this.overlay);
  }

  /**
   * t in [0, 1]
   */
  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));

    if (this.currentPageEl) {
      const outBlur = Math.min(this.maxBlur, clampedT * this.maxBlur * 1.3);
      this.currentPageEl.style.filter = outBlur > 0.1 ? `blur(${outBlur.toFixed(1)}px)` : 'none';
      this.currentPageEl.style.transform = `scale(${(1 + clampedT * 0.06).toFixed(3)})`;
      this.currentPageEl.style.opacity = String(Math.max(0, 1 - clampedT * 1.3).toFixed(3));
    } else {
      const outBlur = Math.min(this.maxBlur, clampedT * this.maxBlur * 1.3);
      this.outLayer.style.filter = `blur(${outBlur.toFixed(1)}px)`;
      this.outLayer.style.transform = `scale(${(1 + clampedT * 0.06).toFixed(3)})`;
      this.outLayer.style.opacity = String(Math.max(0, 1 - clampedT * 1.3).toFixed(3));
    }

    const inT = Math.max(0, (clampedT - 0.35) / 0.65);
    const inBlur = this.maxBlur * (1 - inT);

    if (this.nextPageEl) {
      this.nextPageEl.style.filter = inBlur > 0.1 ? `blur(${inBlur.toFixed(1)}px)` : 'none';
      this.nextPageEl.style.transform = `scale(${(1.04 - inT * 0.04).toFixed(3)})`;
      this.nextPageEl.style.opacity = String(inT.toFixed(3));
    } else {
      this.inLayer.style.filter = `blur(${Math.max(0, inBlur).toFixed(1)}px)`;
      this.inLayer.style.transform = `scale(${(1.04 - inT * 0.04).toFixed(3)})`;
      this.inLayer.style.opacity = String(inT.toFixed(3));
    }
  }

  async trigger(e, onCovered, renderNext) {
    this.overlay.style.display = 'block';
    this.overlay.style.pointerEvents = 'auto';

    const liveEl = document.querySelector('.page-live');
    this.outLayer.innerHTML = '';
    if (liveEl) {
      this.outLayer.appendChild(liveEl.cloneNode(true));
    }

    this.inLayer.innerHTML = '';
    if (renderNext) {
      const next = renderNext();
      typeof next === 'string' ? (this.inLayer.innerHTML = next) : this.inLayer.appendChild(next);
    }

    this.render(0);
    await this._springTo(1);
    onCovered?.();

    this.overlay.style.display = 'none';
    this.overlay.style.pointerEvents = 'none';
    this.baseSpring.jumpTo(0);
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
    if (this.currentPageEl) {
      this.currentPageEl.style.filter = 'none';
      this.currentPageEl.style.transform = 'none';
      this.currentPageEl.style.opacity = '1';
    }
    if (this.nextPageEl) {
      this.nextPageEl.style.filter = `blur(${this.maxBlur}px)`;
      this.nextPageEl.style.opacity = '0';
    }
  }

  destroy() {
    super.destroy();
    this.overlay.remove();
  }
}
