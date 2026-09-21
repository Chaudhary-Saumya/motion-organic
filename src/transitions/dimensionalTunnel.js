import { PageTransition } from './base.js';

/**
 * DimensionalTunnelWarp — Hyperspace 3D Perspective Depth Corridor.
 * Slices the viewport into infinite concentric neon wireframe frames flying
 * past the camera at relativistic warp speed, pulling the user through a spatial
 * tunnel into the destination world.
 */
export class DimensionalTunnelWarp extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {number} [options.layers=7] - Number of concentric tunnel rings
   * @param {string} [options.tunnelColor='#7c6aff']
   * @param {HTMLElement} [options.container=document.body]
   * @param {HTMLElement} [options.currentPageEl]
   * @param {HTMLElement} [options.nextPageEl]
   * @param {number} [options.stiffness=90]
   * @param {number} [options.damping=20]
   */
  constructor({
    layers = 7,
    tunnelColor = '#7c6aff',
    container = document.body,
    currentPageEl = null,
    nextPageEl = null,
    stiffness = 90,
    damping = 20,
  } = {}) {
    super();
    this.numLayers = layers;
    this.tunnelColor = tunnelColor;
    this.container = container;
    this.currentPageEl = currentPageEl;
    this.nextPageEl = nextPageEl;
    this.baseSpring.stiffness = stiffness;
    this.baseSpring.damping = damping;

    this.rings = [];
    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body;
    this.overlay = document.createElement('div');
    this.overlay.className = 'dimensional-tunnel-overlay';
    Object.assign(this.overlay.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      zIndex: '9999',
      pointerEvents: 'none',
      perspective: '800px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });

    for (let i = 0; i < this.numLayers; i++) {
      const ring = document.createElement('div');
      const baseZ = -i * 300;
      Object.assign(ring.style, {
        position: 'absolute',
        width: '80vw',
        height: '80vh',
        border: `2px solid ${this.tunnelColor}`,
        borderRadius: '24px',
        boxShadow: `0 0 25px ${this.tunnelColor}, inset 0 0 25px ${this.tunnelColor}`,
        opacity: '0',
        transform: `translateZ(${baseZ}px)`,
        willChange: 'transform, opacity',
      });
      this.rings.push({ el: ring, baseZ, index: i });
      this.overlay.appendChild(ring);
    }

    this.container.appendChild(this.overlay);
  }

  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));

    // Warp acceleration curve: exponential speed plunge
    const warpOffset = Math.pow(clampedT, 2.2) * 2200;

    for (const ring of this.rings) {
      if (clampedT <= 0.001) {
        ring.el.style.opacity = '0';
        ring.el.style.transform = `translateZ(${ring.baseZ}px)`;
        continue;
      }

      // Calculate new z position as tunnel rushes past camera
      const currentZ = ring.baseZ + warpOffset;
      const progressNormalized = (currentZ + 2000) / 2800;
      const ringOpacity = currentZ > 700 
        ? Math.max(0, 1 - (currentZ - 700) / 200) 
        : Math.min(0.9, Math.max(0, progressNormalized));

      ring.el.style.opacity = String(ringOpacity.toFixed(3));
      ring.el.style.transform = `translateZ(${currentZ.toFixed(1)}px) rotateZ(${(clampedT * 25 * (ring.index % 2 === 0 ? 1 : -1)).toFixed(1)}deg)`;
    }

    if (this.currentPageEl) {
      const outScale = 1 + clampedT * 2.5;
      const outBlur = clampedT * 20;
      const outOpacity = Math.max(0, 1 - clampedT * 1.8);
      this.currentPageEl.style.transform = `scale(${outScale.toFixed(3)}) translateZ(${(clampedT * 600).toFixed(0)}px)`;
      this.currentPageEl.style.filter = outBlur > 0.1 ? `blur(${outBlur.toFixed(1)}px)` : 'none';
      this.currentPageEl.style.opacity = String(outOpacity.toFixed(3));
    }

    if (this.nextPageEl) {
      const inScale = Math.min(1, 0.2 + clampedT * 0.8);
      const inZ = -1200 + clampedT * 1200;
      const inOpacity = Math.min(1, clampedT * 1.6);
      this.nextPageEl.style.transform = `scale(${inScale.toFixed(3)}) translateZ(${inZ.toFixed(0)}px)`;
      this.nextPageEl.style.opacity = String(inOpacity.toFixed(3));
    }
  }

  onReset() {
    this.render(0);
    if (this.currentPageEl) {
      this.currentPageEl.style.transform = 'none';
      this.currentPageEl.style.filter = 'none';
      this.currentPageEl.style.opacity = '1';
    }
    if (this.nextPageEl) {
      this.nextPageEl.style.transform = 'none';
      this.nextPageEl.style.opacity = '0';
    }
  }

  destroy() {
    super.destroy();
    this.overlay.remove();
  }
}
