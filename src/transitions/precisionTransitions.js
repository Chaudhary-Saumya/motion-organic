import { PageTransition } from './base.js';
import { clamp01 } from '../core/spring.js';

class OverlayTransition extends PageTransition {
  constructor(options = {}) {
    super(options); this.options = options; this.overlay = null;
  }
  _ensureOverlay() {
    if (this.overlay || typeof document === 'undefined') return;
    this.overlay = document.createElement('div');
    Object.assign(this.overlay.style, { position: 'fixed', inset: '0', zIndex: String(this.options.zIndex || 2147483000), pointerEvents: 'none', opacity: '0', transform: 'translateZ(0)', willChange: 'clip-path, transform, opacity' });
    document.body.appendChild(this.overlay);
  }
  destroy() { super.destroy(); this.overlay?.remove(); this.overlay = null; }
}

export class VelocityWipeTransition extends OverlayTransition {
  render(progress) { this._ensureOverlay(); if (!this.overlay) return; const t = clamp01(progress); const direction = this.options.direction || 'left'; const edge = direction === 'right' ? `${100 - t * 100}%` : `${t * 100}%`; this.overlay.style.background = this.options.color || '#111'; this.overlay.style.clipPath = direction === 'right' ? `inset(0 0 0 ${edge})` : `inset(0 ${edge} 0 0)`; this.overlay.style.opacity = t > 0 ? '1' : '0'; }
}

export class SplitFlapTransition extends OverlayTransition {
  render(progress) { this._ensureOverlay(); if (!this.overlay) return; const t = clamp01(progress); const angle = (1 - t) * -90; this.overlay.style.background = this.options.color || '#151515'; this.overlay.style.transformOrigin = '50% 50%'; this.overlay.style.transform = `perspective(1200px) rotateX(${angle}deg)`; this.overlay.style.opacity = t > 0.01 ? '1' : '0'; }
}

export class SoftFocusTransition extends OverlayTransition {
  render(progress) { this._ensureOverlay(); if (!this.overlay) return; const t = clamp01(progress); this.overlay.style.background = this.options.color || 'rgba(245,245,240,.94)'; this.overlay.style.backdropFilter = `blur(${(1 - t) * (this.options.blur || 26)}px)`; this.overlay.style.opacity = String(Math.sin(t * Math.PI)); this.overlay.style.transform = `scale(${1 + (1 - t) * .035})`; }
}

export class RadialFocusTransition extends OverlayTransition {
  render(progress) { this._ensureOverlay(); if (!this.overlay) return; const t = clamp01(progress); const x = this.options.originX ?? 50; const y = this.options.originY ?? 50; const radius = t * 160; this.overlay.style.background = this.options.color || '#101010'; this.overlay.style.clipPath = `circle(${radius}% at ${x}% ${y}%)`; this.overlay.style.opacity = t > 0 ? '1' : '0'; }
}
