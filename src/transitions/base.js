import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';
import { ScrollTransitionController } from './scrollController.js';
import { InteractiveDragController } from './gestureController.js';
import { MoAudio } from '../core/sound.js';
import { SPRING_PRESETS, isReducedMotionPreferred } from '../core/presets.js';

/**
 * PageTransition — The unified abstract base class for all motion-organic transitions.
 *
 * Every transition in the framework provides:
 * 1. `await transition.trigger(event, onCovered)` — Physics-driven programmatic navigation
 * 2. `transition.render(t)` — Direct progress mapping for t in [0, 1]
 * 3. `transition.attachScroll(zoneEl, options)` — 1-line scroll-driven scrub attachment
 * 4. `transition.attachGesture(element, options)` — Real-time touch swipe & drag scrubbing
 * 5. `transition.enableAudio(profile, options)` — Procedural acoustic feedback
 * 6. `onComplete()`, `onReset()`, `destroy()` — Lifecycle hooks
 */
export class PageTransition {
  constructor() {
    if (new.target === PageTransition) {
      throw new Error('PageTransition is an abstract class and cannot be instantiated directly.');
    }
    this.scrollController = null;
    this.gestureController = null;
    this.baseSpring = new Spring({ stiffness: 100, damping: 22 });
    this.audioProfile = null;
    this.soundEnabled = false;
  }

  /**
   * Continuous progress render method (t in [0, 1])
   * @param {number} t
   */
  render(t) {
    throw new Error('Subclasses must implement render(t)');
  }

  /**
   * Apply a named spring physics preset
   * @param {'silk'|'liquid'|'snappy'|'cinematic'|'bouncy'|'gentle'} presetName
   */
  applyPreset(presetName) {
    const p = SPRING_PRESETS[presetName];
    if (p) {
      this.baseSpring.stiffness = p.stiffness;
      this.baseSpring.damping = p.damping;
      this.baseSpring.mass = p.mass || 1;
      if (this.spring) {
        this.spring.stiffness = p.stiffness;
        this.spring.damping = p.damping;
        this.spring.mass = p.mass || 1;
      }
    }
    return this;
  }

  /**
   * Enable procedural audio synthesis on trigger/scrub
   * @param {string} [profile='whoosh'] - 'fabric' | 'silk' | 'whoosh' | 'liquid' | 'portal' | 'shutter' | 'subtle'
   * @param {number} [volume=0.5]
   */
  enableAudio(profile = 'whoosh', volume = 0.5) {
    this.soundEnabled = true;
    this.audioProfile = profile;
    MoAudio.setVolume(volume);
    return this;
  }

  /**
   * Programmatic spring-driven trigger method
   * @param {MouseEvent|TouchEvent|null} [e] - Origin event for radial/spatial calculations
   * @param {() => void} [onCovered] - Callback fired at maximum occlusion (swap content/routes here)
   * @returns {Promise<void>}
   */
  async trigger(e, onCovered) {
    if (isReducedMotionPreferred()) {
      // Instant graceful cross-fade for accessibility
      this.onReset?.();
      this.render(0.5);
      onCovered?.();
      this.render(1);
      this.onComplete?.();
      return;
    }

    if (this.soundEnabled && this.audioProfile) {
      MoAudio.play(this.audioProfile, { velocity: (this.baseSpring.stiffness / 100) });
    }

    this.onReset?.();
    this.isTransitionActive = true;
    const activeSpring = this.spring || this.baseSpring;
    const threshold = typeof this.coverThreshold === 'number' ? this.coverThreshold : 0.5;

    return new Promise((resolve) => {
      let coveredFired = false;
      activeSpring.jumpTo(0);
      activeSpring.onUpdate = (v) => {
        const t = Math.max(0, Math.min(1, v));
        this.render(t);
        if (!coveredFired && t >= threshold) {
          coveredFired = true;
          onCovered?.();
        }
      };
      activeSpring.onSettle = () => {
        this.render(1);
        this.onComplete?.();
        if (!coveredFired) {
          coveredFired = true;
          onCovered?.();
        }
        this.isTransitionActive = false;
        resolve();
      };
      activeSpring.set(1);
      engine.add(activeSpring);
    });
  }

  /**
   * Attach this transition to a scroll container for continuous bi-directional scrubbing
   * @param {HTMLElement} zoneEl - Tall container (e.g. 250vh) to scroll through
   * @param {Object} [options] - Options passed to ScrollTransitionController
   * @returns {ScrollTransitionController}
   */
  attachScroll(zoneEl, options = {}) {
    if (this.scrollController) {
      this.scrollController.destroy();
    }
    this.scrollController = new ScrollTransitionController(zoneEl, {
      render: (t) => this.render(t),
      onComplete: () => this.onComplete?.(),
      onReset: () => this.onReset?.(),
    }, options);
    return this.scrollController;
  }

  /**
   * Attach real-time touch swipe / mouse drag gesture scrubbing
   * @param {HTMLElement} element - Target element to swipe or drag
   * @param {Object} [options] - Gesture options
   * @returns {InteractiveDragController}
   */
  attachGesture(element, options = {}) {
    if (this.gestureController) {
      this.gestureController.destroy();
    }
    this.gestureController = new InteractiveDragController(element, {
      render: (t) => this.render(t),
      onCommit: () => {
        this.onComplete?.();
        options.onCommit?.();
      },
      onCancel: () => {
        this.onReset?.();
        options.onCancel?.();
      },
    }, options);
    return this.gestureController;
  }

  onComplete() {}
  onReset() {}

  destroy() {
    if (this.scrollController) {
      this.scrollController.destroy();
      this.scrollController = null;
    }
    if (this.gestureController) {
      this.gestureController.destroy();
      this.gestureController = null;
    }
  }
}
