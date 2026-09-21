import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';

/**
 * InteractiveDragController — Touch Swipe & Mouse Drag Scrubbing Controller.
 *
 * Allows any motion-organic transition to be scrubbed in real-time with finger
 * swipe gestures (e.g. iOS-style edge drag or card pull) or mouse drag, with
 * velocity calculation and spring-settling.
 */
export class InteractiveDragController {
  /**
   * @param {HTMLElement} element - Touch/gesture target element
   * @param {Object} callbacks
   * @param {(t: number) => void} callbacks.render - Live render callback
   * @param {() => void} [callbacks.onCommit] - Fired when gesture passes commit threshold
   * @param {() => void} [callbacks.onCancel] - Fired when gesture snaps back to 0
   * @param {Object} [options]
   * @param {'horizontal'|'vertical'|'diagonal'|'auto'} [options.axis='horizontal']
   * @param {'left'|'right'|'up'|'down'|'any'} [options.direction='left'] - Required drag direction
   * @param {number} [options.threshold=0.35] - Commit threshold in [0, 1]
   * @param {number} [options.maxDistance] - Max drag distance in pixels (defaults to viewport dimension)
   * @param {number} [options.stiffness=140]
   * @param {number} [options.damping=18]
   */
  constructor(element, { render, onCommit, onCancel }, options = {}) {
    this.element = element;
    this.renderCallback = render;
    this.onCommit = onCommit;
    this.onCancel = onCancel;

    this.axis = options.axis || 'horizontal';
    this.direction = options.direction || 'left';
    this.threshold = options.threshold ?? 0.35;
    this.maxDistance = options.maxDistance || 0;
    this.stiffness = options.stiffness ?? 140;
    this.damping = options.damping ?? 18;

    this.spring = new Spring({ stiffness: this.stiffness, damping: this.damping });
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.currentT = 0;
    this.lastTime = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.velocity = 0;

    this._onPointerDown = this._handlePointerDown.bind(this);
    this._onPointerMove = this._handlePointerMove.bind(this);
    this._onPointerUp = this._handlePointerUp.bind(this);

    this._bind();
  }

  _bind() {
    this.element.addEventListener('pointerdown', this._onPointerDown, { passive: false });
    this.element.style.touchAction = this.axis === 'horizontal' ? 'pan-y' : 'pan-x';
  }

  _unbind() {
    this.element.removeEventListener('pointerdown', this._onPointerDown);
    window.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('pointerup', this._onPointerUp);
    window.removeEventListener('pointercancel', this._onPointerUp);
  }

  _handlePointerDown(e) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.lastTime = performance.now();
    this.velocity = 0;

    engine.remove(this.spring);
    this.spring.jumpTo(this.currentT);

    window.addEventListener('pointermove', this._onPointerMove, { passive: false });
    window.addEventListener('pointerup', this._onPointerUp);
    window.addEventListener('pointercancel', this._onPointerUp);

    try {
      this.element.setPointerCapture?.(e.pointerId);
    } catch {}
  }

  _handlePointerMove(e) {
    if (!this.isDragging) return;

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    const now = performance.now();
    const dt = Math.max(1, now - this.lastTime);

    // Live velocity calculation
    const moveDist = Math.hypot(e.clientX - this.lastX, e.clientY - this.lastY);
    this.velocity = (moveDist / dt) * 16.66; // px per frame
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.lastTime = now;

    const w = this.maxDistance || window.innerWidth;
    const h = this.maxDistance || window.innerHeight;

    let progress = 0;
    if (this.axis === 'horizontal') {
      progress = this.direction === 'right' ? dx / w : -dx / w;
    } else if (this.axis === 'vertical') {
      progress = this.direction === 'down' ? dy / h : -dy / h;
    } else if (this.axis === 'diagonal') {
      const diag = Math.hypot(w, h);
      progress = Math.hypot(dx, dy) / (diag * 0.75);
    } else {
      // Auto: dominant axis
      const dist = Math.max(Math.abs(dx) / w, Math.abs(dy) / h);
      progress = dist;
    }

    // Rubber-band resistance past bounds
    if (progress < 0) {
      progress = -Math.pow(-progress, 0.7) * 0.2;
    } else if (progress > 1) {
      progress = 1 + Math.pow(progress - 1, 0.7) * 0.2;
    }

    this.currentT = Math.max(0, Math.min(1.2, progress));
    this.renderCallback(Math.max(0, Math.min(1, this.currentT)));
  }

  _handlePointerUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;

    window.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('pointerup', this._onPointerUp);
    window.removeEventListener('pointercancel', this._onPointerUp);

    try {
      this.element.releasePointerCapture?.(e.pointerId);
    } catch {}

    const shouldCommit = this.currentT >= this.threshold || (this.velocity > 12 && this.currentT > 0.15);

    this.spring.jumpTo(this.currentT);
    this.spring.onUpdate = (v) => {
      this.currentT = v;
      this.renderCallback(Math.max(0, Math.min(1, v)));
    };

    if (shouldCommit) {
      this.spring.onSettle = () => {
        this.renderCallback(1);
        this.onCommit?.();
      };
      this.spring.set(1);
    } else {
      this.spring.onSettle = () => {
        this.renderCallback(0);
        this.onCancel?.();
      };
      this.spring.set(0);
    }

    engine.add(this.spring);
  }

  destroy() {
    this._unbind();
    engine.remove(this.spring);
  }
}
