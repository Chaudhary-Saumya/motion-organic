import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';
import { PageTransition } from './base.js';

/**
 * MetaballMergePortal — Organic Liquid Metaballs Magnetic Fusion Portal.
 *
 * 8-10 organic liquid droplets bubble up across the viewport.
 * Using SVG `feGaussianBlur` + `feColorMatrix` thresholding, the droplets magnetically fuse
 * into a single giant fluid pool, revealing the destination scene inside.
 */
export class MetaballMergePortal extends PageTransition {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.nextPageEl
   * @param {HTMLElement} [options.currentPageEl]
   * @param {HTMLElement} [options.container=document.body]
   * @param {number} [options.count=9] - Number of fusing metaball droplets
   * @param {string} [options.color='#00d632']
   * @param {number} [options.stiffness=95]
   * @param {number} [options.damping=22]
   */
  constructor({
    nextPageEl,
    currentPageEl,
    container = document.body,
    count = 9,
    color = '#00d632',
    stiffness = 95,
    damping = 22,
  } = {}) {
    super();
    this.nextPageEl = nextPageEl;
    this.currentPageEl = currentPageEl;
    this.container = container;
    this.count = count;
    this.color = color;

    this.spring = new Spring({ stiffness, damping });
    this.balls = [];

    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body;
    const svgNS = 'http://www.w3.org/2000/svg';
    const filterId = 'metaball-filter-' + Math.random().toString(36).slice(2, 9);
    const clipId = 'metaball-clip-' + Math.random().toString(36).slice(2, 9);
    this.clipId = clipId;

    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    Object.assign(this.svg.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '9998',
    });

    const defs = document.createElementNS(svgNS, 'defs');

    // Metaball Gooey Filter
    const filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', filterId);
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    const blur = document.createElementNS(svgNS, 'feGaussianBlur');
    blur.setAttribute('in', 'SourceGraphic');
    blur.setAttribute('stdDeviation', '20');
    blur.setAttribute('result', 'blur');

    const matrix = document.createElementNS(svgNS, 'feColorMatrix');
    matrix.setAttribute('in', 'blur');
    matrix.setAttribute('mode', 'matrix');
    matrix.setAttribute('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -14');
    matrix.setAttribute('result', 'goo');

    filter.append(blur, matrix);
    defs.appendChild(filter);

    // ClipPath wrapping the metaballs group
    const clipPath = document.createElementNS(svgNS, 'clipPath');
    clipPath.setAttribute('id', clipId);
    clipPath.setAttribute('clipPathUnits', 'userSpaceOnUse');

    this.ballsGroup = document.createElementNS(svgNS, 'g');
    this.ballsGroup.setAttribute('filter', `url(#${filterId})`);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = w / 2;
    const cy = h / 2;

    // Generate random / distributed seed positions
    for (let i = 0; i < this.count; i++) {
      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('fill', 'white');

      // Center droplet is larger
      const isCenter = i === 0;
      const angle = (i / (this.count - 1)) * Math.PI * 2;
      const dist = isCenter ? 0 : Math.min(w, h) * (0.25 + (i % 3) * 0.1);
      const targetR = isCenter ? Math.hypot(w, h) * 0.75 : Math.hypot(w, h) * (0.35 + (i % 2) * 0.1);

      this.balls.push({
        el: circle,
        origX: cx + Math.cos(angle) * dist,
        origY: cy + Math.sin(angle) * dist,
        targetR,
        speed: 0.8 + (i % 4) * 0.25,
      });

      this.ballsGroup.appendChild(circle);
    }

    clipPath.appendChild(this.ballsGroup);
    defs.appendChild(clipPath);
    this.svg.appendChild(defs);

    this.container.appendChild(this.svg);

    if (this.nextPageEl) {
      this.nextPageEl.style.clipPath = `url(#${clipId})`;
      this.nextPageEl.style.webkitClipPath = `url(#${clipId})`;
      this.nextPageEl.style.willChange = 'transform, opacity, clip-path';
    }
    if (this.currentPageEl) {
      this.currentPageEl.style.willChange = 'transform, opacity, filter';
    }

    this.render(0);
  }

  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));

    if (clampedT <= 0.001) {
      this.balls.forEach(b => {
        b.el.setAttribute('r', '0');
      });
      if (this.nextPageEl) {
        this.nextPageEl.style.opacity = '0';
        this.nextPageEl.style.pointerEvents = 'none';
      }
      if (this.currentPageEl) {
        this.currentPageEl.style.opacity = '1';
        this.currentPageEl.style.transform = 'none';
        this.currentPageEl.style.filter = 'none';
        this.currentPageEl.style.pointerEvents = 'auto';
      }
      return;
    }

    // Expand metaballs
    this.balls.forEach(b => {
      const growth = Math.min(1, clampedT * b.speed);
      const r = Math.pow(growth, 1.3) * b.targetR;
      b.el.setAttribute('cx', b.origX.toFixed(1));
      b.el.setAttribute('cy', b.origY.toFixed(1));
      b.el.setAttribute('r', r.toFixed(1));
    });

    // Outgoing scene pushes back
    if (this.currentPageEl) {
      const outScale = 1 - clampedT * 0.06;
      const outBlur = clampedT * 10;
      const outOpacity = Math.max(0, 1 - clampedT * 1.2);
      this.currentPageEl.style.transform = `scale(${outScale.toFixed(3)})`;
      this.currentPageEl.style.filter = outBlur > 0.1 ? `blur(${outBlur.toFixed(1)}px)` : 'none';
      this.currentPageEl.style.opacity = outOpacity.toFixed(3);
      this.currentPageEl.style.pointerEvents = clampedT > 0.5 ? 'none' : 'auto';
    }

    // Next page scales smoothly
    if (this.nextPageEl) {
      const inScale = 1.1 - clampedT * 0.1;
      this.nextPageEl.style.opacity = '1';
      this.nextPageEl.style.transform = `scale(${inScale.toFixed(3)})`;
      this.nextPageEl.style.pointerEvents = clampedT > 0.5 ? 'auto' : 'none';

      if (clampedT >= 0.98) {
        this.nextPageEl.style.clipPath = 'none';
        this.nextPageEl.style.webkitClipPath = 'none';
      } else {
        this.nextPageEl.style.clipPath = `url(#${this.clipId})`;
        this.nextPageEl.style.webkitClipPath = `url(#${this.clipId})`;
      }
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
      this.nextPageEl.style.clipPath = 'none';
      this.nextPageEl.style.webkitClipPath = 'none';
      this.nextPageEl.style.opacity = '1';
      this.nextPageEl.style.transform = 'scale(1)';
      this.nextPageEl.style.pointerEvents = 'auto';
    }
    if (this.currentPageEl) {
      this.currentPageEl.style.opacity = '0';
      this.currentPageEl.style.pointerEvents = 'none';
    }
  }

  onReset() {
    if (this.nextPageEl) {
      this.nextPageEl.style.clipPath = `url(#${this.clipId})`;
      this.nextPageEl.style.webkitClipPath = `url(#${this.clipId})`;
      this.nextPageEl.style.opacity = '0';
      this.nextPageEl.style.transform = 'scale(1.1)';
      this.nextPageEl.style.pointerEvents = 'none';
    }
    if (this.currentPageEl) {
      this.currentPageEl.style.opacity = '1';
      this.currentPageEl.style.transform = 'scale(1)';
      this.currentPageEl.style.filter = 'none';
      this.currentPageEl.style.pointerEvents = 'auto';
    }
    this.render(0);
  }

  destroy() {
    super.destroy();
    if (this.nextPageEl) {
      this.nextPageEl.style.clipPath = '';
      this.nextPageEl.style.webkitClipPath = '';
    }
    this.svg.remove();
  }
}
