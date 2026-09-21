import { engine } from './engine.js';

/**
 * Spring — a real physics integrator, not a duration/easing curve.
 *
 * Why this exists: every mainstream animation lib (GSAP, Framer Motion,
 * Motion One) models an animation as position-over-duration with an easing
 * curve. That works until you INTERRUPT it — re-trigger a hover mid-flight,
 * reverse scroll direction mid-transition — at which point the tween either
 * snaps to a new start value or restarts, because duration-based tweens
 * don't carry velocity. That snap/restart is the #1 reason web motion reads
 * as "cheap" next to native iOS/macOS animation.
 *
 * A Spring instead is a tiny numerical integrator (semi-implicit Euler) of:
 *   F = -stiffness * (value - target) - damping * velocity
 * Because velocity is first-class state, retargeting mid-flight is just
 * changing `target` — the object continues from wherever it physically
 * "was", at whatever speed it was already moving. No snap. No restart.
 */
export class Spring {
  constructor({ stiffness = 170, damping = 26, mass = 1, precision = 0.01 } = {}) {
    this.stiffness = stiffness;
    this.damping = damping;
    this.mass = mass;
    this.precision = precision;

    this.value = 0;
    this.velocity = 0;
    this.target = 0;

    /** @type {(value:number, velocity:number)=>void|null} */
    this.onUpdate = null;
    /** @type {()=>void|null} */
    this.onSettle = null;
  }

  /** Retarget without losing current velocity — this is the whole point. */
  set(target, { value, velocity } = {}) {
    this.target = target;
    if (value !== undefined) this.value = value;
    if (velocity !== undefined) this.velocity = velocity;
    if (this.onUpdate || this.onSettle) {
      engine.add(this);
    }
    return this;
  }

  /** Alias for set(target) */
  setTarget(target) {
    return this.set(target);
  }

  jumpTo(value) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
    return this;
  }

  /** Advance by dt seconds. Returns true once settled (value≈target, v≈0). */
  step(dt = 0.016) {
    const validDt = Math.max(0.001, Math.min(0.064, Number.isFinite(dt) ? dt : 0.016));
    const force = -this.stiffness * (this.value - this.target);
    const damping = -this.damping * this.velocity;
    const acceleration = (force + damping) / (this.mass || 1);

    this.velocity += acceleration * validDt;
    this.value += this.velocity * validDt;

    const settled = (
      Math.abs(this.target - this.value) < this.precision &&
      Math.abs(this.velocity) < this.precision
    );

    if (settled) {
      this.value = this.target;
      this.velocity = 0;
    }

    return settled;
  }

  /** Advance by dt and return current value */
  update(dt = 0.016) {
    this.step(dt);
    return this.value;
  }
}

export const clamp01 = (v) => Math.max(0, Math.min(1, v));
export const lerp = (a, b, t) => a + (b - a) * t;

