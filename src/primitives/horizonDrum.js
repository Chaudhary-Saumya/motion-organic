import { spatialHorizon } from '../core/spatialHorizon.js';

/**
 * HorizonDrum — Standalone 3D Cylindrical Horizon Drum primitive.
 * Projects DOM elements onto a rotating 3D virtual cylinder during page scroll.
 */
export class HorizonDrum {
  /**
   * @param {HTMLElement} el
   * @param {Object} [options]
   * @param {number} [options.radius=1200]
   * @param {number} [options.perspective=1000]
   * @param {number} [options.pitchFactor=1.0]
   * @param {number} [options.depthFactor=1.0]
   * @param {boolean} [options.shading=true]
   * @param {number} [options.originOffset=0.5]
   * @param {(metrics: any) => void} [options.onUpdate]
   */
  constructor(el, options = {}) {
    this.el = el;
    this.options = options;
    this._unsub = spatialHorizon.add(el, options);
  }

  update(options = {}) {
    this.destroy();
    this.options = { ...this.options, ...options };
    this._unsub = spatialHorizon.add(this.el, this.options);
  }

  destroy() {
    if (this._unsub) {
      this._unsub();
      this._unsub = null;
    }
  }
}
