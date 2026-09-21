import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';
import { PageTransition } from './base.js';

/**
 * HorizonCylinderRoll — 3D Cylindrical Horizon Roll / Earth Drum Flip.
 *
 * Outgoing page curves backward along a 3D cylindrical horizon (perspective 1400px, rotateX: -70deg, translateZ: -500px)
 * while the incoming page rolls in from the bottom curvature (rotateX: 70deg -> 0deg) with realistic specular lighting.
 */
export class HorizonCylinderRoll extends PageTransition {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.nextPageEl
   * @param {HTMLElement} [options.currentPageEl]
   * @param {HTMLElement} [options.container=document.body]
   * @param {number} [options.perspective=1400]
   * @param {number} [options.stiffness=95]
   * @param {number} [options.damping=22]
   */
  constructor({
    nextPageEl,
    currentPageEl,
    container = document.body,
    perspective = 1400,
    stiffness = 95,
    damping = 22,
  } = {}) {
    super();
    this.nextPageEl = nextPageEl;
    this.currentPageEl = currentPageEl;
    this.container = container;
    this.perspective = perspective;

    this.spring = new Spring({ stiffness, damping });
    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body;

    this.stage = document.createElement('div');
    this.stage.className = 'horizon-roll-3d-stage';
    Object.assign(this.stage.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      perspective: `${this.perspective}px`,
      perspectiveOrigin: '50% 50%',
      transformStyle: 'preserve-3d',
      overflow: 'hidden',
      zIndex: '9997',
      pointerEvents: 'none',
    });

    if (this.currentPageEl) {
      this.currentPageEl.style.transformStyle = 'preserve-3d';
      this.currentPageEl.style.transformOrigin = '50% 100%';
      this.currentPageEl.style.willChange = 'transform, opacity, filter';
    }

    if (this.nextPageEl) {
      this.nextPageEl.style.transformStyle = 'preserve-3d';
      this.nextPageEl.style.transformOrigin = '50% 0%';
      this.nextPageEl.style.willChange = 'transform, opacity, filter';
    }

    this.container.appendChild(this.stage);
    this.render(0);
  }

  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));

    // Power curve for heavy drum inertia feel
    const easeT = Math.pow(clampedT, 1.2);

    // Outgoing scene rotates up & backwards
    if (this.currentPageEl) {
      const rotX = -easeT * 75;
      const transZ = -easeT * 600;
      const transY = -easeT * 350;
      const opacity = Math.max(0, 1 - clampedT * 1.25);
      const blur = clampedT * 10;

      this.currentPageEl.style.transform = `translateY(${transY.toFixed(1)}px) translateZ(${transZ.toFixed(1)}px) rotateX(${rotX.toFixed(1)}deg)`;
      this.currentPageEl.style.opacity = opacity.toFixed(3);
      this.currentPageEl.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : 'none';
      this.currentPageEl.style.pointerEvents = clampedT > 0.5 ? 'none' : 'auto';
    }

    // Incoming scene rolls in from bottom
    if (this.nextPageEl) {
      const inRotX = (1 - easeT) * 75;
      const inTransZ = (1 - easeT) * -600;
      const inTransY = (1 - easeT) * 350;
      const inOpacity = Math.min(1, clampedT * 1.5);
      const inBlur = Math.max(0, (1 - clampedT) * 10);

      this.nextPageEl.style.transform = `translateY(${inTransY.toFixed(1)}px) translateZ(${inTransZ.toFixed(1)}px) rotateX(${inRotX.toFixed(1)}deg)`;
      this.nextPageEl.style.opacity = inOpacity.toFixed(3);
      this.nextPageEl.style.filter = inBlur > 0.1 ? `blur(${inBlur.toFixed(1)}px)` : 'none';
      this.nextPageEl.style.pointerEvents = clampedT > 0.5 ? 'auto' : 'none';
    }
  }

  async trigger(e, onCovered) {
    this.onReset();
    return new Promise((resolve) => {
      this.spring.jumpTo(0);
      this.spring.onUpdate = (v) => this.render(Math.max(0, Math.min(1, v)));
      this.spring.onSettle = () => {
        this.render(1);
        this.onComplete();
        onCovered?.();
        resolve();
      };
      this.spring.set(1);
      engine.add(this.spring);
    });
  }

  onComplete() {
    if (this.nextPageEl) {
      this.nextPageEl.style.transform = 'none';
      this.nextPageEl.style.opacity = '1';
      this.nextPageEl.style.filter = 'none';
      this.nextPageEl.style.pointerEvents = 'auto';
    }
    if (this.currentPageEl) {
      this.currentPageEl.style.opacity = '0';
      this.currentPageEl.style.pointerEvents = 'none';
    }
  }

  onReset() {
    if (this.currentPageEl) {
      this.currentPageEl.style.transform = 'none';
      this.currentPageEl.style.opacity = '1';
      this.currentPageEl.style.filter = 'none';
      this.currentPageEl.style.pointerEvents = 'auto';
    }
    if (this.nextPageEl) {
      this.nextPageEl.style.transform = 'translateY(350px) translateZ(-600px) rotateX(75deg)';
      this.nextPageEl.style.opacity = '0';
      this.nextPageEl.style.filter = 'blur(10px)';
      this.nextPageEl.style.pointerEvents = 'none';
    }
    this.render(0);
  }

  destroy() {
    super.destroy();
    this.stage.remove();
  }
}
