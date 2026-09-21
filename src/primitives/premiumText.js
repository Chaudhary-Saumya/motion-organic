import { engine } from '../core/engine.js';
import { isReducedMotionPreferred } from '../core/presets.js';

function pointerMotion(element, render) {
  if (isReducedMotionPreferred()) return () => {};
  const onMove = (event) => {
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    render(x, y);
  };
  const onLeave = () => render(0, 0);
  element.addEventListener('pointermove', onMove, { passive: true });
  element.addEventListener('pointerleave', onLeave, { passive: true });
  return () => {
    element.removeEventListener('pointermove', onMove);
    element.removeEventListener('pointerleave', onLeave);
  };
}

function baseStyle(element) {
  element.style.display ||= 'inline-block';
  element.style.willChange = 'transform, filter';
}

export class KineticOutlineText {
  constructor(element, { color = '#f7f7f2', accent = '#9cff00', thickness = 1.5, depth = 10, interactive = true } = {}) {
    this.element = element;
    baseStyle(element);
    element.style.setProperty('--mo-outline-color', color);
    element.style.setProperty('--mo-outline-accent', accent);
    element.style.setProperty('--mo-outline-width', `${thickness}px`);
    element.style.setProperty('--mo-outline-depth', `${depth}px`);
    element.style.color = 'var(--mo-outline-color)';
    element.style.textShadow = `calc(var(--mo-outline-depth) * -0.25) calc(var(--mo-outline-depth) * 0.25) 0 var(--mo-outline-accent), 0 0 0 var(--mo-outline-color)`;
    this.cleanup = interactive ? pointerMotion(element, (x, y) => { element.style.transform = `perspective(700px) rotateX(${y * -4}deg) rotateY(${x * 5}deg)`; }) : () => {};
  }
  destroy() { this.cleanup(); this.element.style.removeProperty('will-change'); this.element.style.transform = ''; this.element.style.textShadow = ''; }
}

export class LiquidMetalText {
  constructor(element, { colors = ['#fff', '#8d9aa6', '#fff', '#26323b'], speed = 6, interactive = true } = {}) {
    this.element = element; baseStyle(element); this.running = !isReducedMotionPreferred();
    element.style.background = `linear-gradient(110deg, ${colors.join(', ')})`; element.style.backgroundSize = '240% 100%'; element.style.webkitBackgroundClip = 'text'; element.style.backgroundClip = 'text'; element.style.color = 'transparent';
    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.tick = (dt, time) => { const phase = ((time || Date.now()) - start) / 1000; element.style.backgroundPosition = `${50 + Math.sin(phase / Math.max(0.5, speed)) * 50}% 50%`; };
    if (this.running) engine.add(this.tick);
    this.cleanup = interactive ? pointerMotion(element, (x, y) => { element.style.filter = `brightness(${1 + Math.abs(x) * .2}) contrast(${1 + Math.abs(y) * .12})`; }) : () => {};
  }
  destroy() { engine.remove(this.tick); this.cleanup(); this.element.style.background = ''; this.element.style.backgroundClip = ''; this.element.style.webkitBackgroundClip = ''; this.element.style.color = ''; this.element.style.filter = ''; }
}

export class EditorialSplitText {
  constructor(element, { accent = '#d8ff3e', gap = '0.18em', interactive = true } = {}) {
    this.element = element; baseStyle(element); const text = element.textContent || ''; element.setAttribute('aria-label', text); element.textContent = '';
    const first = document.createElement('span'); const second = document.createElement('span'); first.textContent = text; second.textContent = text; first.setAttribute('aria-hidden', 'true'); second.setAttribute('aria-hidden', 'true');
    Object.assign(first.style, { display: 'block', clipPath: 'inset(0 0 52% 0)', transform: `translateX(calc(${gap} * -1))` }); Object.assign(second.style, { display: 'block', clipPath: 'inset(48% 0 0 0)', transform: `translateX(${gap})`, color: accent }); element.append(first, second);
    this.cleanup = interactive ? pointerMotion(element, (x) => { first.style.transform = `translateX(calc(${gap} * ${-1 - x * .8}))`; second.style.transform = `translateX(calc(${gap} * ${1 - x * .8}))`; }) : () => {};
  }
  destroy() { this.cleanup(); this.element.textContent = this.element.getAttribute('aria-label') || ''; this.element.removeAttribute('aria-label'); }
}

export class NoiseTypeText {
  constructor(element, { color = '#f5f5f0', accent = '#ff5c35', intensity = 0.35, interactive = true } = {}) {
    this.element = element; baseStyle(element); element.style.color = color; element.style.textShadow = `0 0 1px ${accent}, 0 0 ${Math.max(1, intensity * 8)}px color-mix(in srgb, ${accent} ${Math.round(intensity * 100)}%, transparent)`;
    this.cleanup = interactive ? pointerMotion(element, (x, y) => { element.style.transform = `translate(${x * 2}px, ${y * 2}px)`; element.style.textShadow = `${x * 4}px ${y * 2}px 0 ${accent}, ${-x * 3}px ${-y * 2}px 0 ${color}`; }) : () => {};
  }
  destroy() { this.cleanup(); this.element.style.transform = ''; this.element.style.textShadow = ''; }
}

export class VariableCapsText {
  constructor(element, { minWeight = 300, maxWeight = 900, interactive = true } = {}) {
    this.element = element; baseStyle(element); element.style.fontVariationSettings = `'wght' ${minWeight}`; this.cleanup = interactive ? pointerMotion(element, (x, y) => { const weight = minWeight + (x + 1) / 2 * (maxWeight - minWeight); element.style.fontVariationSettings = `'wght' ${weight}`; element.style.letterSpacing = `${y * .025}em`; }) : () => {};
  }
  destroy() { this.cleanup(); this.element.style.fontVariationSettings = ''; this.element.style.letterSpacing = ''; }
}
