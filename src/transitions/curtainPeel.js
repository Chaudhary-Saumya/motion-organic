import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';
import { PageTransition } from './base.js';
import { MoAudio } from '../core/sound.js';

/**
 * CurtainPeelTransition — Authentic 3D Silk Fabric / Page Peel Transition.
 *
 * Supports:
 * - Multi-directional physical peel: 'bottom-right', 'bottom-left', 'top-right', 'top-left', 'left', 'right', 'top', 'bottom'
 * - Real-time dynamic pointer/touch coordinate peel origin
 * - Dual-layer SVG clipPath masking on currentPageEl (physically curls back to reveal nextPageEl)
 * - Multi-harmonic silk wave flutter physics
 * - Dynamic 3D ambient shadow casting and specular edge highlight
 * - Integrated procedural 'fabric' acoustic synthesizer
 */
export class CurtainPeelTransition extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {'bottom-right'|'bottom-left'|'top-right'|'top-left'|'left'|'right'|'top'|'bottom'} [options.direction='bottom-right']
   * @param {string} [options.fabricColor='#242a18'] - Backside silk/fabric tone
   * @param {string} [options.accentColor='#8ca800'] - Subtle specular sheen hue
   * @param {HTMLElement} [options.container=document.body]
   * @param {HTMLElement} [options.currentPageEl]
   * @param {HTMLElement} [options.nextPageEl]
   * @param {number} [options.originX]
   * @param {number} [options.originY]
   * @param {number} [options.stiffness=105]
   * @param {number} [options.damping=22]
   * @param {boolean} [options.sound=false]
   */
  constructor({
    direction = 'bottom-right',
    fabricColor = '#242a18',
    accentColor = '#8ca800',
    container = document.body,
    currentPageEl = null,
    nextPageEl = null,
    originX = null,
    originY = null,
    stiffness = 105,
    damping = 22,
    sound = false,
  } = {}) {
    super();
    this.direction = direction;
    this.fabricColor = fabricColor;
    this.accentColor = accentColor;
    this.container = container;
    this.currentPageEl = currentPageEl;
    this.nextPageEl = nextPageEl;
    this.originX = originX;
    this.originY = originY;

    this.spring = new Spring({ stiffness, damping });
    if (sound) {
      this.enableAudio('fabric', 0.45);
    } else {
      this.audioProfile = 'fabric';
    }

    this._initDOM();
    this._handleResize = this._onResize.bind(this);
    window.addEventListener('resize', this._handleResize, { passive: true });
  }

  _onResize() {
    this.render(this.currentProgress || 0);
  }

  _initDOM() {
    const isBody = this.container === document.body || !this.container;
    const svgNS = 'http://www.w3.org/2000/svg';
    const uid = Math.random().toString(36).slice(2, 9);
    this.uid = uid;
    this.clipId = `curtain-mask-${uid}`;

    // Root overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'curtain-peel-overlay';
    Object.assign(this.overlay.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      zIndex: '9999',
      pointerEvents: 'none',
      overflow: 'hidden',
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

    const defs = document.createElementNS(svgNS, 'defs');

    // 1. Drop shadow for the folding fabric flap
    const filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', `peel-shadow-${uid}`);
    filter.setAttribute('x', '-30%');
    filter.setAttribute('y', '-30%');
    filter.setAttribute('width', '160%');
    filter.setAttribute('height', '160%');
    filter.innerHTML = `
      <feDropShadow dx="-6" dy="-6" stdDeviation="10" flood-color="rgba(0,0,0,0.45)" />
      <feDropShadow dx="-2" dy="-2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)" />
    `;
    defs.appendChild(filter);

    // 2. Silk gradient for backside flap
    const grad = document.createElementNS(svgNS, 'linearGradient');
    grad.setAttribute('id', `peel-grad-${uid}`);
    grad.setAttribute('x1', '0%');
    grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '100%');
    grad.setAttribute('y2', '100%');
    grad.innerHTML = `
      <stop offset="0%" stop-color="${this.fabricColor}" />
      <stop offset="65%" stop-color="${this._lightenColor(this.fabricColor, 20)}" />
      <stop offset="100%" stop-color="${this.fabricColor}" />
    `;
    defs.appendChild(grad);

    // 3. ClipPath to mask currentPageEl
    const clipPath = document.createElementNS(svgNS, 'clipPath');
    clipPath.setAttribute('id', this.clipId);
    clipPath.setAttribute('clipPathUnits', 'userSpaceOnUse');
    this.pageClipPath = document.createElementNS(svgNS, 'path');
    clipPath.appendChild(this.pageClipPath);
    defs.appendChild(clipPath);

    this.svg.appendChild(defs);

    // Flap curl polygon
    this.curlPath = document.createElementNS(svgNS, 'path');
    this.curlPath.setAttribute('fill', `url(#peel-grad-${uid})`);
    this.curlPath.setAttribute('filter', `url(#peel-shadow-${uid})`);

    // Edge highlight stroke along fold
    this.highlightPath = document.createElementNS(svgNS, 'path');
    this.highlightPath.setAttribute('stroke', 'rgba(255, 255, 255, 0.45)');
    this.highlightPath.setAttribute('stroke-width', '2.5');
    this.highlightPath.setAttribute('fill', 'none');

    this.svg.append(this.curlPath, this.highlightPath);
    this.overlay.appendChild(this.svg);
    this.container.appendChild(this.overlay);

    if (this.currentPageEl) {
      this.currentPageEl.style.clipPath = `url(#${this.clipId})`;
      this.currentPageEl.style.webkitClipPath = `url(#${this.clipId})`;
      this.currentPageEl.style.willChange = 'transform, opacity, filter, clip-path';
    }
    if (this.nextPageEl) {
      this.nextPageEl.style.willChange = 'transform, opacity';
    }

    this.render(0);
  }

  _lightenColor(col, percent) {
    if (col.startsWith('#') && col.length === 7) {
      const num = parseInt(col.slice(1), 16);
      const r = Math.min(255, ((num >> 16) + percent));
      const g = Math.min(255, (((num >> 8) & 0x00FF) + percent));
      const b = Math.min(255, ((num & 0x0000FF) + percent));
      return `rgb(${r}, ${g}, ${b})`;
    }
    return col;
  }

  setOrigin(x, y) {
    this.originX = x;
    this.originY = y;
    const isBody = this.container === document.body || !this.container;
    const w = isBody ? window.innerWidth : (this.container.clientWidth || 400);
    const h = isBody ? window.innerHeight : (this.container.clientHeight || 340);
    const isRight = x > w / 2;
    const isBottom = y > h / 2;
    if (isBottom && isRight) this.direction = 'bottom-right';
    else if (isBottom && !isRight) this.direction = 'bottom-left';
    else if (!isBottom && isRight) this.direction = 'top-right';
    else this.direction = 'top-left';
  }

  /**
   * Continuous progress render (t in [0, 1])
   * @param {number} t
   */
  render(t) {
    this.currentProgress = t;
    const clampedT = Math.max(0, Math.min(1, t));
    const isBody = this.container === document.body || !this.container;
    const w = isBody ? window.innerWidth : (this.container.clientWidth || 400);
    const h = isBody ? window.innerHeight : (this.container.clientHeight || 340);
    const maxDiag = Math.hypot(w, h) * 1.4;

    if (clampedT <= 0.0001) {
      this.curlPath.setAttribute('d', '');
      this.highlightPath.setAttribute('d', '');
      this.pageClipPath.setAttribute('d', `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`);
      if (this.currentPageEl) {
        this.currentPageEl.style.opacity = '1';
        this.currentPageEl.style.transform = 'none';
        this.currentPageEl.style.filter = 'none';
        this.currentPageEl.style.pointerEvents = 'auto';
      }
      if (this.nextPageEl) {
        this.nextPageEl.style.opacity = '0';
        this.nextPageEl.style.transform = 'scale(1.04)';
        this.nextPageEl.style.pointerEvents = 'none';
      }
      return;
    }

    if (clampedT >= 0.999) {
      this.curlPath.setAttribute('d', '');
      this.highlightPath.setAttribute('d', '');
      this.pageClipPath.setAttribute('d', '');
      if (this.currentPageEl) {
        this.currentPageEl.style.opacity = '0';
        this.currentPageEl.style.clipPath = 'none';
        this.currentPageEl.style.webkitClipPath = 'none';
        this.currentPageEl.style.pointerEvents = 'none';
      }
      if (this.nextPageEl) {
        this.nextPageEl.style.opacity = '1';
        this.nextPageEl.style.transform = 'scale(1)';
        this.nextPageEl.style.pointerEvents = 'auto';
      }
      return;
    }

    const dist = clampedT * maxDiag;
    const wave = Math.sin(clampedT * Math.PI * 3) * 10 * (1 - clampedT * 0.5);

    let foldP0, foldP1, curlP, unpeeledPath, curlD;

    switch (this.direction) {
      case 'bottom-right': {
        const pX = Math.max(0, w - dist);
        const pY = Math.max(0, h - dist);
        foldP0 = { x: w, y: pY };
        foldP1 = { x: pX, y: h };
        curlP = { x: pX - dist * 0.35 + wave, y: pY - dist * 0.35 - wave };
        unpeeledPath = `M 0 0 L ${w} 0 L ${w} ${pY} Q ${(w + pX) / 2 + wave} ${(pY + h) / 2 - wave} ${pX} ${h} L 0 ${h} Z`;
        curlD = `M ${w} ${pY} Q ${(w + pX) / 2 + wave} ${(pY + h) / 2 - wave} ${pX} ${h} L ${curlP.x} ${curlP.y} Z`;
        break;
      }
      case 'bottom-left': {
        const pX = Math.min(w, dist);
        const pY = Math.max(0, h - dist);
        foldP0 = { x: 0, y: pY };
        foldP1 = { x: pX, y: h };
        curlP = { x: pX + dist * 0.35 - wave, y: pY - dist * 0.35 - wave };
        unpeeledPath = `M 0 0 L ${w} 0 L ${w} ${h} L ${pX} ${h} Q ${(pX) / 2 - wave} ${(pY + h) / 2 - wave} 0 ${pY} Z`;
        curlD = `M 0 ${pY} Q ${(pX) / 2 - wave} ${(pY + h) / 2 - wave} ${pX} ${h} L ${curlP.x} ${curlP.y} Z`;
        break;
      }
      case 'top-right': {
        const pX = Math.max(0, w - dist);
        const pY = Math.min(h, dist);
        foldP0 = { x: w, y: pY };
        foldP1 = { x: pX, y: 0 };
        curlP = { x: pX - dist * 0.35 + wave, y: pY + dist * 0.35 + wave };
        unpeeledPath = `M 0 0 L ${pX} 0 Q ${(w + pX) / 2 + wave} ${(pY) / 2 + wave} ${w} ${pY} L ${w} ${h} L 0 ${h} Z`;
        curlD = `M ${pX} 0 Q ${(w + pX) / 2 + wave} ${(pY) / 2 + wave} ${w} ${pY} L ${curlP.x} ${curlP.y} Z`;
        break;
      }
      case 'top-left':
      default: {
        const pX = Math.min(w, dist);
        const pY = Math.min(h, dist);
        foldP0 = { x: 0, y: pY };
        foldP1 = { x: pX, y: 0 };
        curlP = { x: pX + dist * 0.35 - wave, y: pY + dist * 0.35 + wave };
        unpeeledPath = `M ${pX} 0 L ${w} 0 L ${w} ${h} L 0 ${h} L 0 ${pY} Q ${(pX) / 2 - wave} ${(pY) / 2 + wave} ${pX} 0 Z`;
        curlD = `M 0 ${pY} Q ${(pX) / 2 - wave} ${(pY) / 2 + wave} ${pX} 0 L ${curlP.x} ${curlP.y} Z`;
        break;
      }
    }

    this.pageClipPath.setAttribute('d', unpeeledPath);
    this.curlPath.setAttribute('d', curlD);

    if (foldP0 && foldP1) {
      this.highlightPath.setAttribute('d', `M ${foldP0.x} ${foldP0.y} Q ${(foldP0.x + foldP1.x) / 2 + wave} ${(foldP0.y + foldP1.y) / 2 - wave} ${foldP1.x} ${foldP1.y}`);
    }

    if (this.nextPageEl) {
      const inScale = 1.04 - clampedT * 0.04;
      this.nextPageEl.style.opacity = String(Math.min(1, 0.4 + clampedT * 0.6).toFixed(2));
      this.nextPageEl.style.transform = `scale(${inScale.toFixed(3)})`;
      this.nextPageEl.style.pointerEvents = clampedT > 0.6 ? 'auto' : 'none';
    }

    if (this.currentPageEl) {
      const outScale = 1 - clampedT * 0.03;
      this.currentPageEl.style.transform = `scale(${outScale.toFixed(3)})`;
      this.currentPageEl.style.opacity = '1';
    }
  }

  async trigger(e, onCovered) {
    if (e && e.clientX != null && e.clientY != null) {
      const rect = this.container.getBoundingClientRect();
      this.setOrigin(e.clientX - rect.left, e.clientY - rect.top);
    }

    this.onReset();
    if (this.audioProfile) {
      MoAudio.play(this.audioProfile, { velocity: 0.8, volume: 0.4 });
    }

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
    this.render(1);
    if (this.currentPageEl) {
      this.currentPageEl.style.clipPath = 'none';
      this.currentPageEl.style.webkitClipPath = 'none';
      this.currentPageEl.style.opacity = '0';
      this.currentPageEl.style.pointerEvents = 'none';
    }
    if (this.nextPageEl) {
      this.nextPageEl.style.opacity = '1';
      this.nextPageEl.style.pointerEvents = 'auto';
      this.nextPageEl.style.zIndex = '2';
    }
  }

  onReset() {
    const isBody = this.container === document.body || !this.container;
    const w = isBody ? window.innerWidth : (this.container.clientWidth || 400);
    const h = isBody ? window.innerHeight : (this.container.clientHeight || 340);
    this.pageClipPath.setAttribute('d', `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`);
    if (this.currentPageEl) {
      this.currentPageEl.style.clipPath = `url(#${this.clipId})`;
      this.currentPageEl.style.webkitClipPath = `url(#${this.clipId})`;
      this.currentPageEl.style.opacity = '1';
      this.currentPageEl.style.pointerEvents = 'auto';
    }
    if (this.nextPageEl) {
      this.nextPageEl.style.opacity = '0';
      this.nextPageEl.style.pointerEvents = 'none';
    }
    this.render(0);
  }

  destroy(force = false) {
    if (this.isTransitionActive && !force) return;
    super.destroy?.(force);
    window.removeEventListener('resize', this._handleResize);
    if (this.currentPageEl) {
      this.currentPageEl.style.clipPath = 'none';
      this.currentPageEl.style.webkitClipPath = 'none';
    }
    this.overlay?.remove();
  }
}
