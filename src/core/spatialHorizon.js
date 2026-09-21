/**
 * SpatialHorizon — Cinema-Grade 3D Cylindrical Horizon Roll & Spatial Perspective Depth Engine.
 *
 * Maps standard DOM elements onto a virtual 3D cylindrical drum or spherical horizon in perspective space.
 * Elements dynamically pitch (rotateX/rotateY), recede in Z-space, and receive atmospheric horizon shading
 * as they traverse through the viewport without hijacking native scroll.
 */
import { Spring, clamp01 } from './spring.js';
import { engine } from './engine.js';
import { scrollTracker } from './scroll.js';

export class SpatialHorizon {
  /**
   * @param {Object} options
   * @param {number} [options.radius=1200] - Virtual cylinder radius in pixels (smaller = tighter curvature, larger = gentle planet horizon)
   * @param {number} [options.perspective=1000] - Camera perspective distance in pixels
   * @param {'vertical'|'horizontal'|'spherical'} [options.orientation='vertical'] - Horizon curvature axis
   * @param {boolean} [options.shading=true] - Enable dynamic atmospheric horizon lighting and opacity falloff
   * @param {number} [options.stiffness=180] - Spring stiffness for momentum smoothing
   * @param {number} [options.damping=22] - Spring damping
   */
  constructor({
    radius = 1200,
    perspective = 1000,
    orientation = 'vertical',
    shading = true,
    stiffness = 180,
    damping = 22,
  } = {}) {
    this.radius = radius;
    this.perspective = perspective;
    this.orientation = orientation;
    this.shading = shading;
    this.stiffness = stiffness;
    this.damping = damping;

    /** @type {Map<HTMLElement, Object>} */
    this.items = new Map();
    this.active = false;

    this.springY = new Spring({ stiffness, damping, precision: 0.1 });
    this.springX = new Spring({ stiffness, damping, precision: 0.1 });

    this._unsubTracker = null;
    this._onTick = this._tick.bind(this);
  }

  /**
   * Register an element to project onto the 3D horizon.
   * @param {HTMLElement} el
   * @param {Object} [options]
   * @param {number} [options.radius] - Override cylinder radius for this item
   * @param {number} [options.perspective] - Override camera perspective
   * @param {number} [options.depthFactor=1.0] - Z-depth scaling factor
   * @param {number} [options.pitchFactor=1.0] - Pitch rotation scaling factor
   * @param {boolean} [options.shading] - Override atmospheric shading
   * @param {number} [options.originOffset=0.5] - Viewport center horizon line (0.5 = exact center, 0.3 = upper third)
   * @param {(metrics: { theta: number, z: number, opacity: number, inView: boolean }) => void} [options.onUpdate]
   * @returns {() => void} Unsubscribe function
   */
  add(el, options = {}) {
    if (!el) return () => {};

    const config = {
      radius: options.radius || this.radius,
      perspective: options.perspective || this.perspective,
      depthFactor: options.depthFactor !== undefined ? options.depthFactor : 1.0,
      pitchFactor: options.pitchFactor !== undefined ? options.pitchFactor : 1.0,
      shading: options.shading !== undefined ? options.shading : this.shading,
      originOffset: options.originOffset !== undefined ? options.originOffset : 0.5,
      onUpdate: options.onUpdate || null,
      inView: true,
      lastTransform: '',
    };

    el.style.willChange = 'transform, opacity';
    el.style.transformStyle = 'preserve-3d';

    this.items.set(el, config);

    if (!this.active) {
      this.start();
    }

    return () => this.remove(el);
  }

  /**
   * Remove an element from the 3D horizon.
   * @param {HTMLElement} el
   */
  remove(el) {
    if (!el) return;
    const item = this.items.get(el);
    if (item) {
      el.style.transform = '';
      el.style.opacity = '';
      el.style.filter = '';
      el.style.willChange = '';
      this.items.delete(el);
    }

    if (this.items.size === 0) {
      this.stop();
    }
  }

  /**
   * Start the 3D projection loop.
   */
  start() {
    if (this.active) return;
    this.active = true;

    this._unsubTracker = scrollTracker.subscribe(() => {
      engine.add(this._onTick);
    });

    engine.add(this._onTick);
  }

  /**
   * Stop the projection loop.
   */
  stop() {
    this.active = false;
    if (this._unsubTracker) {
      this._unsubTracker();
      this._unsubTracker = null;
    }
    engine.remove(this._onTick);
  }

  /**
   * Internal projection and batch GPU render tick.
   */
  _tick(dt) {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;

    for (const [el, config] of this.items.entries()) {
      if (!el || typeof el.getBoundingClientRect !== 'function') continue;

      const rect = el.getBoundingClientRect();
      const inView = (
        rect.bottom >= -200 &&
        rect.top <= vh + 200 &&
        rect.right >= -200 &&
        rect.left <= vw + 200
      );

      config.inView = inView;
      if (!inView) continue;

      const centerY = rect.top + rect.height * 0.5;
      const horizonY = vh * config.originOffset;
      const deltaY = centerY - horizonY; // distance from horizon center

      const R = Math.max(100, config.radius);
      const normalizedRatio = Math.max(-1, Math.min(1, deltaY / R));

      // Exact trigonometric cylinder pitch angle (in radians then degrees)
      const radTheta = Math.asin(normalizedRatio);
      const degTheta = (radTheta * (180 / Math.PI)) * config.pitchFactor;

      // Z-depth displacement into the screen: Z = -R * (1 - cos(theta))
      const cosTheta = Math.cos(radTheta);
      const zDepth = (-R * (1 - cosTheta) * config.depthFactor).toFixed(2);

      // 3D Perspective Matrix transformation
      const pitchRotation = (-degTheta).toFixed(3);
      const transform = `perspective(${config.perspective}px) translate3d(0, 0, ${zDepth}px) rotateX(${pitchRotation}deg)`;

      if (transform !== config.lastTransform) {
        el.style.transform = transform;
        config.lastTransform = transform;
      }

      // Atmospheric horizon lighting and opacity falloff
      if (config.shading) {
        const falloff = Math.max(0, 1 - Math.pow(Math.abs(deltaY) / (R * 1.25), 2));
        const lighting = Math.max(0.4, cosTheta).toFixed(3);
        el.style.opacity = falloff.toFixed(3);
        el.style.filter = `brightness(${lighting})`;
      }

      if (config.onUpdate) {
        config.onUpdate({
          theta: degTheta,
          z: parseFloat(zDepth),
          opacity: config.shading ? Math.max(0, 1 - Math.pow(Math.abs(deltaY) / (R * 1.25), 2)) : 1.0,
          inView: true,
        });
      }
    }

    if (!scrollTracker.isScrolling) {
      engine.remove(this._onTick);
    }
  }

  /**
   * Destroy the horizon engine and reset all styles.
   */
  destroy() {
    this.stop();
    for (const [el] of this.items.entries()) {
      this.remove(el);
    }
    this.items.clear();
  }
}

export const spatialHorizon = new SpatialHorizon();
