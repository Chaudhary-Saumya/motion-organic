import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';
import { MoAudio } from '../core/sound.js';

/**
 * MoActionBadge — Viral Magnetic Micro-Interaction Badge.
 *
 * 1-Line viral UI primitive combining:
 * - Magnetic 3D spring cursor pull & rubber-band elasticity
 * - Dynamic 1-click clipboard copy
 * - Procedural vector confetti particle celebration
 * - Web Audio acoustic haptic chime
 * - Dynamic tooltip status transition
 */
export class MoActionBadge {
  /**
   * @param {HTMLElement} element
   * @param {Object} [options]
   * @param {string} [options.copyText] - Text copied to clipboard
   * @param {string} [options.successText='Copied!'] - Tooltip text on success
   * @param {boolean} [options.confetti=true] - Trigger particle burst
   * @param {boolean} [options.sound=true] - Play procedural Web Audio chime
   * @param {boolean} [options.magnetic=true] - Spring magnetic hover pull
   */
  constructor(element, options = {}) {
    this.el = element;
    this.copyText = options.copyText || this.el.textContent?.trim() || '';
    this.successText = options.successText || 'Copied!';
    this.confetti = options.confetti !== false;
    this.sound = options.sound !== false;
    this.magnetic = options.magnetic !== false;

    this.springX = new Spring({ stiffness: 220, damping: 14 });
    this.springY = new Spring({ stiffness: 220, damping: 14 });

    this._originalContent = this.el.innerHTML;
    this._boundUpdate = this._update.bind(this);
    this._init();
  }

  _init() {
    this.el.classList.add('mo-badge-root');
    Object.assign(this.el.style, {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      userSelect: 'none',
      willChange: 'transform',
    });

    this._onClick = async () => {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(this.copyText);
        }
      } catch (_) {}

      if (this.sound) {
        MoAudio.play('chime', { volume: 0.3 });
      }

      if (this.confetti) {
        this._burstConfetti();
      }

      this._showSuccessPulse();
    };

    this.el.addEventListener('click', this._onClick);

    if (this.magnetic) {
      this._onMouseMove = (e) => {
        const rect = this.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.35;
        const dy = (e.clientY - cy) * 0.35;
        this.springX.setTarget(dx);
        this.springY.setTarget(dy);
        engine.add(this._boundUpdate);
      };

      this._onMouseLeave = () => {
        this.springX.setTarget(0);
        this.springY.setTarget(0);
        engine.add(this._boundUpdate);
      };

      this.el.addEventListener('mousemove', this._onMouseMove, { passive: true });
      this.el.addEventListener('mouseleave', this._onMouseLeave);
    }
  }

  _burstConfetti() {
    const rect = this.el.getBoundingClientRect();
    const count = 16;
    const colors = ['#00ff88', '#00e5ff', '#ff007f', '#facc15', '#a855f7'];

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 5 + 3;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const velocity = Math.random() * 60 + 40;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      Object.assign(p.style, {
        position: 'fixed',
        left: `${rect.left + rect.width / 2}px`,
        top: `${rect.top + rect.height / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        pointerEvents: 'none',
        zIndex: '999999',
        transform: 'translate(-50%, -50%)',
        transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s ease',
      });

      document.body.appendChild(p);

      requestAnimationFrame(() => {
        p.style.transform = `translate(${vx}px, ${vy}px) rotate(${Math.random() * 360}deg) scale(0)`;
        p.style.opacity = '0';
      });

      setTimeout(() => p.remove(), 700);
    }
  }

  _showSuccessPulse() {
    this.el.style.transform = 'scale(0.94)';
    setTimeout(() => {
      this.el.style.transform = 'scale(1.04)';
      setTimeout(() => {
        this.el.style.transform = 'scale(1)';
      }, 150);
    }, 100);
  }

  _update(dt) {
    const x = this.springX.update(dt);
    const y = this.springY.update(dt);

    if (Math.abs(x) > 0.05 || Math.abs(y) > 0.05) {
      this.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    } else {
      this.el.style.transform = 'translate3d(0, 0, 0)';
      engine.remove(this._boundUpdate);
    }
  }

  destroy() {
    engine.remove(this._boundUpdate);
    this.el.removeEventListener('click', this._onClick);
    if (this._onMouseMove) {
      this.el.removeEventListener('mousemove', this._onMouseMove);
      this.el.removeEventListener('mouseleave', this._onMouseLeave);
    }
    this.el.innerHTML = this._originalContent;
    this.el.classList.remove('mo-badge-root');
  }
}
