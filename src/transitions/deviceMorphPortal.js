import { PageTransition } from './base.js';
import { Spring, lerp } from '../core/spring.js';
import { MoAudio } from '../core/sound.js';

/**
 * DeviceMorphPortal (26. 3D Device App & Curved Corner Portal Morph)
 *
 * Inspired by Raymmar's iconic Webflow showcase:
 * 1. Outgoing View / Device Frame: Ejects backward into 3D perspective space
 *    with an organic pitch, rotation, and Z-recession (perspective(1200px) rotateX(...) rotateZ(...) translateY(...)).
 * 2. Incoming View / Curved Deck: Sweeps in from the diagonal with an asymmetrical
 *    high-radius organic curved portal corner (border-radius: 48px 260px 48px 48px)
 *    and a luminous neon accent rim, spring-settling into the full viewport.
 */
export class DeviceMorphPortal extends PageTransition {
  constructor(options = {}) {
    super(options);

    this.options = {
      accentColor: options.accentColor || '#d9ed55', // Neon lime or electric blue
      borderColor: options.borderColor || '#38bdf8',
      direction: options.direction || 'bottom-right',
      curveRadius: options.curveRadius || '48px 260px 48px 48px',
      pitchAngle: options.pitchAngle || 22, // 3D X-tilt in degrees
      rollAngle: options.rollAngle || -14,  // 3D Z-tilt in degrees
      sound: options.sound || 'whoosh',
      stiffness: options.stiffness || 160,
      damping: options.damping || 18,
      mass: options.mass || 1.0,
      ...options,
    };

    this.spring = new Spring({
      stiffness: this.options.stiffness,
      damping: this.options.damping,
      mass: this.options.mass,
    });

    this.overlay = null;
    this.deckCard = null;
    this.deviceBackdrop = null;
    this._progress = 0;
  }

  mount(fromEl, toEl) {
    super.mount(fromEl, toEl);

    // Play procedural audio
    if (this.options.sound) {
      MoAudio.play(this.options.sound, { intensity: 0.85 });
    }

    // Create 3D perspective stage overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'mo-device-morph-overlay';
    Object.assign(this.overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '99999',
      pointerEvents: 'none',
      perspective: '1200px',
      transformStyle: 'preserve-3d',
      overflow: 'hidden',
    });

    // 1. Outgoing 3D ejection wrapper around fromEl if available
    if (fromEl) {
      fromEl.style.transformOrigin = 'center center';
      fromEl.style.willChange = 'transform, opacity, filter';
    }

    // 2. Incoming sweeping curved deck card
    this.deckCard = document.createElement('div');
    this.deckCard.className = 'mo-curved-deck-card';
    Object.assign(this.deckCard.style, {
      position: 'absolute',
      bottom: '-120%',
      left: '-10%',
      width: '120vw',
      height: '120vh',
      borderRadius: this.options.curveRadius,
      background: 'rgba(13, 14, 18, 0.98)',
      border: `2px solid ${this.options.borderColor}`,
      boxShadow: `0 0 60px -10px ${this.options.accentColor}66, inset 0 0 40px rgba(255, 255, 255, 0.05)`,
      overflow: 'hidden',
      willChange: 'transform, opacity, border-radius',
      transformOrigin: 'bottom left',
      zIndex: '10',
    });

    this.overlay.appendChild(this.deckCard);
    document.body.appendChild(this.overlay);

    this.spring.set(1.0);
  }

  render(progress) {
    this._progress = progress;

    const t = Math.max(0, Math.min(1, progress));

    // 1. Animate Outgoing View (3D Device Tilt & Ejection)
    if (this.fromEl) {
      const rotX = lerp(0, this.options.pitchAngle, t);
      const rotZ = lerp(0, this.options.rollAngle, t);
      const transY = lerp(0, -120, t);
      const transZ = lerp(0, -350, t);
      const scale = lerp(1, 0.88, t);
      const opacity = lerp(1, 0, Math.pow(t, 1.4));
      const blur = lerp(0, 10, t);

      this.fromEl.style.transform = `perspective(1200px) translate3d(0, ${transY}px, ${transZ}px) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scale})`;
      this.fromEl.style.opacity = opacity.toFixed(3);
      this.fromEl.style.filter = blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : '';
    }

    // 2. Animate Incoming Curved Deck Sweep
    if (this.deckCard) {
      // Sweeps up along an angled arc
      const transY = lerp(120, 0, t);
      const transX = lerp(-40, 0, t);
      const rot = lerp(-12, 0, t);
      const scale = lerp(0.85, 1.0, t);

      // Asymmetric curve relaxes as it covers viewport
      const topCornerR = lerp(260, 0, t);
      const otherCornerR = lerp(48, 0, t);

      this.deckCard.style.transform = `translate3d(${transX}%, ${transY}%, 0) rotate(${rot}deg) scale(${scale})`;
      this.deckCard.style.borderRadius = `${otherCornerR}px ${topCornerR}px ${otherCornerR}px ${otherCornerR}px`;
      this.deckCard.style.opacity = Math.min(1, t * 1.5).toFixed(3);
    }

    // 3. Reveal destination element
    if (this.toEl) {
      const toOpacity = Math.max(0, (t - 0.3) / 0.7);
      const toScale = lerp(0.96, 1.0, Math.max(0, (t - 0.2) / 0.8));
      this.toEl.style.opacity = toOpacity.toFixed(3);
      this.toEl.style.transform = `scale(${toScale})`;
    }
  }

  onComplete() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.overlay = null;
    this.deckCard = null;

    if (this.fromEl) {
      this.fromEl.style.transform = '';
      this.fromEl.style.opacity = '';
      this.fromEl.style.filter = '';
      this.fromEl.style.willChange = '';
    }

    if (this.toEl) {
      this.toEl.style.transform = '';
      this.toEl.style.opacity = '';
      this.toEl.style.willChange = '';
    }

    super.onComplete();
  }
}
