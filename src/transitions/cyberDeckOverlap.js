import { PageTransition } from './base.js';
import { Spring, clamp01 } from '../core/spring.js';

/**
 * CyberDeckOverlap — Staggered dark-glass card deck overlap.
 * 3 angled dark cards slide diagonally, continuously revealing nextPageEl underneath.
 */
export class CyberDeckOverlap extends PageTransition {
  constructor({
    nextPageEl,
    currentPageEl,
    cardColors = ['#1a1d17', '#121410', '#0a0c08'],
    accentColor = '#d7ed45',
    container = (typeof document !== 'undefined' ? document.body : null),
    stiffness = 55,
    damping = 15,
    sound = true,
  } = {}) {
    super();
    this.nextPageEl = nextPageEl;
    this.currentPageEl = currentPageEl;
    this.cardColors = cardColors;
    this.accentColor = accentColor;
    this.container = container;
    this.sound = sound;

    this.spring = new Spring({ stiffness, damping });
    this.coverThreshold = 0.5;

    if (sound) {
      this.enableAudio('whoosh', 0.45);
    }

    this.overlay = null;
    this.cards = [];
    this._initDOM();
  }

  _initDOM() {
    if (typeof document === 'undefined') return;

    const host = this.container || document.body;
    const isBody = host === document.body;

    this.overlay = document.createElement('div');
    this.overlay.className = 'mo-cyber-deck-overlay';
    Object.assign(this.overlay.style, {
      position: isBody ? 'fixed' : 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      zIndex: '99999',
      pointerEvents: 'none',
      overflow: 'hidden',
    });

    this.cardColors.forEach((color, i) => {
      const card = document.createElement('div');
      card.className = `mo-cyber-card mo-cyber-card-${i}`;
      Object.assign(card.style, {
        position: 'absolute',
        inset: '-30%',
        width: '160%',
        height: '160%',
        backgroundColor: color,
        border: `1px solid ${i === 1 ? this.accentColor : 'rgba(255,255,255,0.08)'}`,
        boxShadow: i === 1 ? `0 0 30px ${this.accentColor}30` : '0 20px 50px rgba(0,0,0,0.8)',
        transform: 'translate3d(120%, 120%, 0) rotate(-10deg)',
        willChange: 'transform',
        zIndex: String(i + 1),
      });

      this.cards.push(card);
      this.overlay.appendChild(card);
    });

    host.appendChild(this.overlay);

    if (this.nextPageEl) {
      this.nextPageEl.style.willChange = 'clip-path, transform, opacity';
    }
  }

  render(t) {
    const progress = clamp01(t);
    if (!this.overlay) return;

    if (progress <= 0.0001) {
      this.overlay.style.opacity = '0';
      if (this.nextPageEl) {
        this.nextPageEl.style.clipPath = 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)';
        this.nextPageEl.style.webkitClipPath = 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)';
        this.nextPageEl.style.opacity = '0';
        this.nextPageEl.style.pointerEvents = 'none';
      }
      if (this.currentPageEl) {
        this.currentPageEl.style.opacity = '1';
        this.currentPageEl.style.transform = 'scale(1)';
        this.currentPageEl.style.pointerEvents = 'auto';
      }
      return;
    }

    this.overlay.style.opacity = progress < 0.999 ? '1' : '0';

    if (this.nextPageEl) {
      this.nextPageEl.style.opacity = '1';
      this.nextPageEl.style.pointerEvents = 'auto';
    }

    // Lead diagonal sweep
    const ease = 1 - Math.pow(1 - progress, 2.5);
    const leadOffset = (1 - ease) * 140;

    // Diagonal polygon reveal
    const p1X = Math.max(0, 140 - ease * 160);
    const p2Y = Math.max(0, 140 - ease * 160);

    if (this.nextPageEl) {
      const poly = `polygon(${p1X.toFixed(1)}% 0%, 100% 0%, 100% 100%, 0% 100%, 0% ${p2Y.toFixed(1)}%)`;
      this.nextPageEl.style.clipPath = poly;
      this.nextPageEl.style.webkitClipPath = poly;
    }

    this.cards.forEach((card, i) => {
      const delay = i * 0.08;
      const localT = clamp01((progress - delay) / (1 - delay));
      const cardEase = 1 - Math.pow(1 - localT, 2.5);
      const pos = (1 - cardEase) * 130;
      card.style.transform = `translate3d(${pos.toFixed(1)}%, ${pos.toFixed(1)}%, 0) rotate(-10deg)`;
    });

    if (this.currentPageEl) {
      const scale = 1 - progress * 0.04;
      this.currentPageEl.style.transform = `scale(${scale.toFixed(3)})`;
      this.currentPageEl.style.opacity = (1 - progress * 0.35).toFixed(3);
    }
  }

  onComplete() {
    if (this.nextPageEl) {
      this.nextPageEl.style.clipPath = '';
      this.nextPageEl.style.webkitClipPath = '';
      this.nextPageEl.style.opacity = '1';
      this.nextPageEl.style.transform = '';
      this.nextPageEl.style.pointerEvents = 'auto';
    }
    if (this.currentPageEl) {
      this.currentPageEl.style.opacity = '0';
      this.currentPageEl.style.pointerEvents = 'none';
      this.currentPageEl.style.transform = '';
    }
  }

  destroy() {
    this.onComplete();
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.overlay = null;
    this.cards = [];
  }
}
