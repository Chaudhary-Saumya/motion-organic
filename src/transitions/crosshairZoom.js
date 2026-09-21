import { PageTransition } from './base.js';

/**
 * CrosshairZoom — Cinematic Viewfinder Lock-on & Punch Dive.
 * Inspired by tactical sports/gaming UI and camera viewfinders.
 * Viewfinder brackets animate in, crosshairs lock on, and the scene
 * dives forward with radial velocity zoom.
 */
export class CrosshairZoom extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {string} [options.bracketColor='#ffffff'] - Color of the corner brackets and crosshair
   * @param {number} [options.bracketSize=50] - Size in px of corner brackets
   * @param {number} [options.bracketThickness=3] - Line thickness in px
   * @param {string} [options.overlayColor='#000000'] - Flash overlay background color
   * @param {boolean} [options.gridLines=true] - Display subtle tactical grid lines
   * @param {HTMLElement} [options.container=document.body] - Container
   * @param {number} [options.stiffness=140] - Spring stiffness
   * @param {number} [options.damping=18] - Spring damping
   */
  constructor({
    bracketColor = '#ffffff',
    bracketSize = 50,
    bracketThickness = 3,
    overlayColor = '#000000',
    gridLines = true,
    container = document.body,
    stiffness = 140,
    damping = 18,
  } = {}) {
    super();
    this.bracketColor = bracketColor;
    this.bracketSize = bracketSize;
    this.bracketThickness = bracketThickness;
    this.overlayColor = overlayColor;
    this.gridLines = gridLines;
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

    this.overlay = document.createElement('div');
    this.overlay.className = 'mo-crosshair-zoom-overlay';
    Object.assign(this.overlay.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      zIndex: '9999',
      pointerEvents: 'none',
      overflow: 'hidden',
      backgroundColor: this.overlayColor,
      opacity: '0',
      willChange: 'opacity, transform',
    });

    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    Object.assign(this.svg.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    });

    // 4 Corner brackets group
    this.bracketsGroup = document.createElementNS(svgNS, 'g');
    this.bracketsGroup.setAttribute('stroke', this.bracketColor);
    this.bracketsGroup.setAttribute('stroke-width', String(this.bracketThickness));
    this.bracketsGroup.setAttribute('fill', 'none');
    this.bracketsGroup.setAttribute('stroke-linecap', 'square');

    this.topLeft = document.createElementNS(svgNS, 'path');
    this.topRight = document.createElementNS(svgNS, 'path');
    this.bottomLeft = document.createElementNS(svgNS, 'path');
    this.bottomRight = document.createElementNS(svgNS, 'path');
    this.bracketsGroup.append(this.topLeft, this.topRight, this.bottomLeft, this.bottomRight);

    // Center crosshair
    this.crosshairGroup = document.createElementNS(svgNS, 'g');
    this.crosshairGroup.setAttribute('stroke', this.bracketColor);
    this.crosshairGroup.setAttribute('stroke-width', '1.5');
    this.crosshairGroup.setAttribute('opacity', '0.7');

    this.chH = document.createElementNS(svgNS, 'line');
    this.chV = document.createElementNS(svgNS, 'line');
    this.chRing = document.createElementNS(svgNS, 'circle');
    this.chRing.setAttribute('fill', 'none');
    this.chRing.setAttribute('r', '24');
    this.crosshairGroup.append(this.chH, this.chV, this.chRing);

    this.svg.append(this.bracketsGroup, this.crosshairGroup);
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
    const w = window.innerWidth;
    const h = window.innerHeight;
    const s = this.bracketSize;

    // Viewfinder bracket inset animates from outer edges toward center framing
    const insetMargin = 40 + (1 - clampedT) * 120;
    const padX = Math.min(w * 0.35, insetMargin);
    const padY = Math.min(h * 0.35, insetMargin);

    const x0 = padX;
    const y0 = padY;
    const x1 = w - padX;
    const y1 = h - padY;

    // Top-Left
    this.topLeft.setAttribute('d', `M ${x0} ${y0 + s} L ${x0} ${y0} L ${x0 + s} ${y0}`);
    // Top-Right
    this.topRight.setAttribute('d', `M ${x1 - s} ${y0} L ${x1} ${y0} L ${x1} ${y0 + s}`);
    // Bottom-Left
    this.bottomLeft.setAttribute('d', `M ${x0} ${y1 - s} L ${x0} ${y1} L ${x0 + s} ${y1}`);
    // Bottom-Right
    this.bottomRight.setAttribute('d', `M ${x1 - s} ${y1} L ${x1} ${y1} L ${x1} ${y1 - s}`);

    // Center crosshair
    const cx = this.cx;
    const cy = this.cy;
    this.chH.setAttribute('x1', String(cx - 30));
    this.chH.setAttribute('y1', String(cy));
    this.chH.setAttribute('x2', String(cx + 30));
    this.chH.setAttribute('y2', String(cy));

    this.chV.setAttribute('x1', String(cx));
    this.chV.setAttribute('y1', String(cy - 30));
    this.chV.setAttribute('x2', String(cx));
    this.chV.setAttribute('y2', String(cy + 30));

    this.chRing.setAttribute('cx', String(cx));
    this.chRing.setAttribute('cy', String(cy));

    // Dynamic zoom scale & opacity
    const zoomScale = 1 + clampedT * 2.8;
    this.svg.style.transformOrigin = `${cx}px ${cy}px`;
    this.svg.style.transform = `scale(${zoomScale.toFixed(3)})`;

    // Background fade & flash
    this.overlay.style.opacity = String(Math.min(1, clampedT * 1.6).toFixed(3));
  }

  async trigger(e, onCovered) {
    const x = e?.clientX ?? (e?.touches ? e.touches[0].clientX : window.innerWidth / 2);
    const y = e?.clientY ?? (e?.touches ? e.touches[0].clientY : window.innerHeight / 2);
    this.setOrigin(x, y);

    this.overlay.style.pointerEvents = 'auto';
    this.render(0);

    // Phase 1: Lock-on zoom in (0 -> 1)
    await this._springTo(1);
    onCovered?.();

    // Phase 2: Fade & expand out (1 -> 0)
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
