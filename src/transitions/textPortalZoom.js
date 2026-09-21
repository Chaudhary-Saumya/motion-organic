import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';
import { PageTransition } from './base.js';

/**
 * TextPortalZoom — Headline Typography Stencil Zoom Portal.
 *
 * 1. The headline typography forms an SVG stencil mask. The incoming page is
 *    rendered behind the mask, visible exclusively through the letter glyph contours.
 * 2. Spring zooms scale exponentially (1x -> 45x) into the letter counter openings (e.g. inside the 'O' or 'A').
 * 3. The camera dives straight through the letterform into full bleed scene.
 * 4. When t = 1, next page is seamlessly revealed full-bleed.
 */
export class TextPortalZoom extends PageTransition {
  /**
   * @param {Object} [options]
   * @param {string} [options.word='ORGANIC']
   * @param {HTMLElement} options.nextPageEl
   * @param {HTMLElement} [options.currentPageEl]
   * @param {HTMLElement} [options.container=document.body]
   * @param {number} [options.maxScale=40]
   * @param {string} [options.fontSize='13vw']
   * @param {string} [options.fontFamily='system-ui, -apple-system, sans-serif']
   * @param {string|number} [options.fontWeight='900']
   * @param {string} [options.fillColor='#171817']
   * @param {number} [options.stiffness=90]
   * @param {number} [options.damping=22]
   * @param {number} [options.textFadeOutAt=0.75]
   */
  constructor({
    word = 'ORGANIC',
    nextPageEl,
    currentPageEl,
    container = document.body,
    maxScale = 40,
    fontSize = '13vw',
    fontFamily = 'system-ui, -apple-system, sans-serif',
    fontWeight = '900',
    fillColor = '#171817',
    stiffness = 90,
    damping = 22,
    textFadeOutAt = 0.75,
  } = {}) {
    super();
    this.word = word;
    this.nextPageEl = nextPageEl;
    this.currentPageEl = currentPageEl;
    this.container = container;
    this.maxScale = maxScale;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.fontWeight = fontWeight;
    this.fillColor = fillColor;
    this.textFadeOutAt = textFadeOutAt;

    this.spring = new Spring({ stiffness, damping });

    this._initDOM();
  }

  _initDOM() {
    const isBody = this.container === document.body || !this.container;
    const svgNS = 'http://www.w3.org/2000/svg';
    const maskId = 'portal-mask-' + Math.random().toString(36).slice(2, 9);
    this.maskId = maskId;

    // Overlay wrapper
    this.overlay = document.createElement('div');
    this.overlay.className = 'text-portal-overlay';
    Object.assign(this.overlay.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      zIndex: '9998',
      pointerEvents: 'none',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });

    // SVG element covering the viewport
    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    Object.assign(this.svg.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      opacity: '0',
    });

    // SVG Mask defs
    const defs = document.createElementNS(svgNS, 'defs');
    const mask = document.createElementNS(svgNS, 'mask');
    mask.setAttribute('id', maskId);
    mask.setAttribute('maskUnits', 'userSpaceOnUse');

    const maskBg = document.createElementNS(svgNS, 'rect');
    maskBg.setAttribute('width', '100%');
    maskBg.setAttribute('height', '100%');
    maskBg.setAttribute('fill', 'white');

    this.textEl = document.createElementNS(svgNS, 'text');
    this.textEl.textContent = this.word;
    this.textEl.setAttribute('x', '50%');
    this.textEl.setAttribute('y', '50%');
    this.textEl.setAttribute('text-anchor', 'middle');
    this.textEl.setAttribute('dominant-baseline', 'central');
    this.textEl.setAttribute('fill', 'black');
    this.textEl.style.fontFamily = this.fontFamily;
    this.textEl.style.fontWeight = String(this.fontWeight);
    this.textEl.style.fontSize = typeof this.fontSize === 'number' ? `${this.fontSize}px` : this.fontSize;
    this.textEl.style.letterSpacing = '0.04em';
    this.textEl.style.transformOrigin = '50% 50%';

    mask.append(maskBg, this.textEl);
    defs.appendChild(mask);
    this.svg.appendChild(defs);

    this.curtainRect = document.createElementNS(svgNS, 'rect');
    this.curtainRect.setAttribute('width', '100%');
    this.curtainRect.setAttribute('height', '100%');
    this.curtainRect.setAttribute('fill', this.fillColor);
    this.curtainRect.setAttribute('mask', `url(#${maskId})`);
    this.svg.appendChild(this.curtainRect);

    this.overlay.appendChild(this.svg);
    this.container.appendChild(this.overlay);

    if (this.nextPageEl) {
      this.nextPageEl.style.position = isBody ? 'fixed' : 'absolute';
      this.nextPageEl.style.inset = '0';
      this.nextPageEl.style.zIndex = '1';
      this.nextPageEl.style.willChange = 'transform, opacity, filter';
    }
    if (this.currentPageEl) {
      this.currentPageEl.style.willChange = 'transform, opacity, filter';
      this.currentPageEl.style.zIndex = '0';
    }

    this.render(0);
  }

  setWord(newWord) {
    this.word = newWord;
    if (this.textEl) this.textEl.textContent = newWord;
  }

  setFillColor(color) {
    this.fillColor = color;
    if (this.curtainRect) this.curtainRect.setAttribute('fill', color);
  }

  render(t) {
    const clampedT = Math.max(0, Math.min(1, t));

    if (clampedT <= 0.0001) {
      this.svg.style.opacity = '0';
      if (this.currentPageEl) {
        this.currentPageEl.style.opacity = '1';
        this.currentPageEl.style.transform = 'scale(1)';
        this.currentPageEl.style.filter = 'none';
        this.currentPageEl.style.pointerEvents = 'auto';
      }
      if (this.nextPageEl) {
        this.nextPageEl.style.opacity = '0';
        this.nextPageEl.style.transform = 'scale(1.06)';
        this.nextPageEl.style.filter = 'none';
        this.nextPageEl.style.pointerEvents = 'none';
      }
      return;
    }

    if (clampedT >= 0.999) {
      this.svg.style.opacity = '0';
      if (this.currentPageEl) {
        this.currentPageEl.style.opacity = '0';
        this.currentPageEl.style.pointerEvents = 'none';
      }
      if (this.nextPageEl) {
        this.nextPageEl.style.opacity = '1';
        this.nextPageEl.style.transform = 'scale(1)';
        this.nextPageEl.style.filter = 'none';
        this.nextPageEl.style.pointerEvents = 'auto';
      }
      return;
    }

    const scale = 1 + Math.pow(clampedT, 2.2) * (this.maxScale - 1);
    const tracking = (clampedT * 0.25).toFixed(3);

    if (this.textEl) {
      this.textEl.style.transform = `scale(${scale.toFixed(3)})`;
      this.textEl.style.letterSpacing = `${tracking}em`;
    }

    // Curtain opacity ramps up instantly at start, then fades out near end
    const curtainOpacity = clampedT < 0.1
      ? clampedT * 10
      : (clampedT > this.textFadeOutAt
          ? Math.max(0, 1 - (clampedT - this.textFadeOutAt) / (1 - this.textFadeOutAt))
          : 1);
    this.svg.style.opacity = String(curtainOpacity.toFixed(3));

    if (this.currentPageEl) {
      const outBlur = clampedT * 14;
      const outScale = 1 - clampedT * 0.08;
      const outOpacity = Math.max(0, 1 - clampedT * 1.5);
      this.currentPageEl.style.filter = outBlur > 0.1 ? `blur(${outBlur.toFixed(1)}px)` : 'none';
      this.currentPageEl.style.transform = `scale(${outScale.toFixed(3)})`;
      this.currentPageEl.style.opacity = String(outOpacity.toFixed(3));
    }

    if (this.nextPageEl) {
      const inScale = 1.06 - clampedT * 0.06;
      const inBlur = Math.max(0, (1 - clampedT * 1.2) * 8);
      const inOpacity = Math.min(1, 0.4 + clampedT * 0.6);
      this.nextPageEl.style.transform = `scale(${inScale.toFixed(3)})`;
      this.nextPageEl.style.filter = inBlur > 0.1 ? `blur(${inBlur.toFixed(1)}px)` : 'none';
      this.nextPageEl.style.opacity = String(inOpacity.toFixed(3));
      this.nextPageEl.style.pointerEvents = clampedT > 0.6 ? 'auto' : 'none';
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
    this.overlay.style.pointerEvents = 'none';
    if (this.svg) this.svg.style.opacity = '0';
    if (this.nextPageEl) {
      this.nextPageEl.style.opacity = '1';
      this.nextPageEl.style.transform = 'scale(1)';
      this.nextPageEl.style.filter = 'none';
      this.nextPageEl.style.pointerEvents = 'auto';
      this.nextPageEl.style.zIndex = '2';
    }
    if (this.currentPageEl) {
      this.currentPageEl.style.opacity = '0';
      this.currentPageEl.style.pointerEvents = 'none';
    }
  }

  onReset() {
    this.overlay.style.pointerEvents = 'none';
    if (this.svg) this.svg.style.opacity = '0';
    if (this.currentPageEl) {
      this.currentPageEl.style.opacity = '1';
      this.currentPageEl.style.transform = 'scale(1)';
      this.currentPageEl.style.filter = 'none';
      this.currentPageEl.style.pointerEvents = 'auto';
    }
    if (this.nextPageEl) {
      this.nextPageEl.style.transform = 'scale(1.06)';
      this.nextPageEl.style.opacity = '0';
      this.nextPageEl.style.filter = 'none';
      this.nextPageEl.style.pointerEvents = 'none';
    }
    this.render(0);
  }

  destroy() {
    this.overlay.remove();
  }
}
