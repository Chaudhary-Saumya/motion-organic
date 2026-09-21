import { PageTransition } from './base.js';
import { engine } from '../core/engine.js';

/**
 * DiagonalRazorWipe — Razor-sharp diagonal geometric cut transition.
 * Sweeps a crisp angular blade polygon across the viewport with
 * trailing shadow and light gleam edge.
 */
export class DiagonalRazorWipe extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {number} [options.angle=25] - Cut angle in degrees
   * @param {string} [options.color='#0a0a10'] - Blade curtain fill color
   * @param {boolean} [options.edgeShadow=true] - Display 3D trailing edge shadow
   * @param {string} [options.edgeColor='rgba(255,255,255,0.3)'] - Blade highlight line color
   * @param {HTMLElement} [options.container=document.body] - Container
   * @param {number} [options.stiffness=135] - Spring stiffness
   * @param {number} [options.damping=20] - Spring damping
   */
  constructor({
    angle = 25,
    color = '#0a0a10',
    edgeShadow = true,
    edgeColor = 'rgba(255,255,255,0.3)',
    container = document.body,
    stiffness = 135,
    damping = 20,
  } = {}) {
    super();
    this.angle = angle;
    this.color = color;
    this.edgeShadow = edgeShadow;
    this.edgeColor = edgeColor;
    this.container = container;
    this.baseSpring.stiffness = stiffness;
    this.baseSpring.damping = damping;

    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body;
    const svgNS = 'http://www.w3.org/2000/svg';
    const filterId = 'razor-shadow-' + Math.random().toString(36).slice(2, 8);

    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    Object.assign(this.svg.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      zIndex: '9999',
      pointerEvents: 'none',
      overflow: 'hidden',
    });

    if (this.edgeShadow) {
      const defs = document.createElementNS(svgNS, 'defs');
      const filter = document.createElementNS(svgNS, 'filter');
      filter.setAttribute('id', filterId);
      filter.innerHTML = `<feDropShadow dx="-8" dy="8" stdDeviation="12" flood-color="rgba(0,0,0,0.7)" />`;
      defs.appendChild(filter);
      this.svg.appendChild(defs);
    }

    this.polygon = document.createElementNS(svgNS, 'polygon');
    this.polygon.setAttribute('fill', this.color);
    if (this.edgeShadow) {
      this.polygon.setAttribute('filter', `url(#${filterId})`);
    }

    this.bladeLine = document.createElementNS(svgNS, 'line');
    this.bladeLine.setAttribute('stroke', this.edgeColor);
    this.bladeLine.setAttribute('stroke-width', '2');

    this.svg.append(this.polygon, this.bladeLine);
    this.container.appendChild(this.svg);
  }

  /**
   * t in [0, 1]: 0 is offscreen right, 1 is fully covering viewport
   */
  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Angle offset
    const rad = (this.angle * Math.PI) / 180;
    const tanAngle = Math.tan(rad);
    const xOffset = h * tanAngle;
    const totalSpan = w + xOffset;

    // Sweep from right to left (covering viewport)
    // At t = 0: leading edge is at w + xOffset
    // At t = 1: leading edge is at 0
    const currentX = (1 - clampedT) * totalSpan;

    const topX = currentX;
    const botX = currentX - xOffset;

    // Polygon coordinates covering from currentX to right side
    const points = `${topX.toFixed(1)},0 ${w + 100},0 ${w + 100},${h} ${botX.toFixed(1)},${h}`;
    this.polygon.setAttribute('points', points);

    // Leading edge blade line
    this.bladeLine.setAttribute('x1', topX.toFixed(1));
    this.bladeLine.setAttribute('y1', '0');
    this.bladeLine.setAttribute('x2', botX.toFixed(1));
    this.bladeLine.setAttribute('y2', String(h));
  }

  async trigger(e, onCovered) {
    this.svg.style.pointerEvents = 'auto';
    this.render(0);

    // Phase 1: Blade cuts across to cover (0 -> 1)
    await this._springTo(1);
    onCovered?.();

    // Phase 2: Sweep out across the left edge
    await this._sweepExit();
    this.svg.style.pointerEvents = 'none';
  }

  _sweepExit() {
    return new Promise((resolve) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const rad = (this.angle * Math.PI) / 180;
      const tanAngle = Math.tan(rad);
      const xOffset = h * tanAngle;
      const totalSpan = w + xOffset;

      this.baseSpring.jumpTo(0);
      this.baseSpring.onUpdate = (v) => {
        const clampedT = Math.max(0, Math.min(1, v));
        // Trailing edge sweeps from w to -xOffset
        const currentX = (1 - clampedT) * totalSpan;
        const topX = currentX;
        const botX = currentX - xOffset;

        // Polygon covers left side of current edge
        const points = `-100,0 ${topX.toFixed(1)},0 ${botX.toFixed(1)},${h} -100,${h}`;
        this.polygon.setAttribute('points', points);

        this.bladeLine.setAttribute('x1', topX.toFixed(1));
        this.bladeLine.setAttribute('y1', '0');
        this.bladeLine.setAttribute('x2', botX.toFixed(1));
        this.bladeLine.setAttribute('y2', String(h));
      };
      this.baseSpring.onSettle = () => {
        this.render(0);
        resolve();
      };
      this.baseSpring.set(1);
      engine.add(this.baseSpring);
    });
  }

  _springTo(target) {
    return new Promise((resolve) => {
      let resolved = false;
      this.baseSpring.onUpdate = (v) => {
        this.render(v);
        if (!resolved && target === 1 && v >= 0.96) {
          resolved = true;
          resolve();
        }
      };
      this.baseSpring.onSettle = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };
      this.baseSpring.set(target);
      engine.add(this.baseSpring);
    });
  }

  onReset() {
    this.render(0);
    this.svg.style.pointerEvents = 'none';
  }

  destroy() {
    super.destroy();
    this.svg.remove();
  }
}
