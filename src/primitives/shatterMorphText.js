import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';
import { MoAudio } from '../core/sound.js';

/**
 * ShatterMorphText — Physical Character Particle Shard Explosion & Morphing.
 *
 * Slices each letterform into physical geometric shards with randomized
 * rotational momentum and velocity springs when clicked, hovered, or switched,
 * smoothly morphing through a sequence of words with procedural audio FX.
 */
export class ShatterMorphText {
  /**
   * @param {HTMLElement} element
   * @param {Object} [options]
   * @param {string[]} [options.words=['CREATE', 'DISRUPT', 'EVOLVE']] - Word cycle list
   * @param {string} [options.trigger='click'] - 'click' | 'hover' | 'auto'
   * @param {number} [options.interval=3500] - Auto morph interval in ms
   * @param {number} [options.shardCount=6] - Fragments per character
   * @param {number} [options.explosionForce=80] - Distance in px
   * @param {boolean} [options.sound=true] - Procedural Web Audio sound FX
   */
  constructor(element, options = {}) {
    this.el = element;
    this.color = options.color || '#ffffff';
    this.words = options.words || [
      this.el.textContent?.trim() || 'CREATE',
      'DISRUPT',
      'EVOLVE',
      'INVENT'
    ];
    this.currentWordIdx = 0;
    this.trigger = options.trigger || 'click';
    this.interval = options.interval || 3500;
    this.shardCount = options.shardCount ?? 6;
    this.explosionForce = options.explosionForce ?? 80;
    this.sound = options.sound !== false;

    this._originalContent = this.el.innerHTML;
    this._shards = [];
    this._isExploding = false;
    this._boundUpdate = this._update.bind(this);
    this._init();
  }

  _init() {
    this.el.classList.add('mo-shatter-morph-root');
    this.wrapper = document.createElement('span');
    this.wrapper.className = 'mo-shatter-wrapper';
    Object.assign(this.wrapper.style, {
      position: 'relative',
      display: 'inline-block',
      color: this.color,
      fontWeight: 'inherit',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
      userSelect: 'none',
      cursor: 'pointer',
    });

    this.el.innerHTML = '';
    this.el.appendChild(this.wrapper);

    this._renderCurrentWord();

    if (this.trigger === 'click') {
      this._onClick = () => this.morphNext();
      this.el.addEventListener('click', this._onClick);
    } else if (this.trigger === 'hover') {
      this._onMouseEnter = () => this.morphNext();
      this.el.addEventListener('mouseenter', this._onMouseEnter);
    } else if (this.trigger === 'auto') {
      this._autoTimer = setInterval(() => this.morphNext(), this.interval);
    }
  }

  _renderCurrentWord() {
    this.wrapper.innerHTML = '';
    this._shards = [];
    const word = this.words[this.currentWordIdx];

    Array.from(word).forEach((char) => {
      const charSpan = document.createElement('span');
      charSpan.className = 'mo-shatter-char';
      charSpan.style.display = 'inline-block';
      charSpan.style.position = 'relative';
      charSpan.style.color = this.color;

      // 4 quadrant polygon shards per character
      const clipPolygons = [
        'polygon(0% 0%, 55% 0%, 45% 55%, 0% 45%)',
        'polygon(55% 0%, 100% 0%, 100% 55%, 45% 55%)',
        'polygon(0% 45%, 45% 55%, 55% 100%, 0% 100%)',
        'polygon(45% 55%, 100% 55%, 100% 100%, 55% 100%)',
      ];

      clipPolygons.forEach((poly, sIdx) => {
        const shard = document.createElement('span');
        shard.className = 'mo-shard';
        shard.textContent = char;
        Object.assign(shard.style, {
          position: sIdx === 0 ? 'relative' : 'absolute',
          inset: '0',
          color: this.color,
          clipPath: poly,
          WebkitClipPath: poly,
          display: 'inline-block',
          willChange: 'transform, opacity',
        });

        const angle = (Math.random() - 0.5) * Math.PI * 2;
        const dist = (0.5 + Math.random() * 0.8) * this.explosionForce;
        const targetX = Math.cos(angle) * dist;
        const targetY = Math.sin(angle) * dist;
        const targetRot = (Math.random() - 0.5) * 180;

        const spring = new Spring({ stiffness: 180, damping: 14 });
        this._shards.push({
          el: shard,
          spring,
          targetX,
          targetY,
          targetRot,
        });

        charSpan.appendChild(shard);
      });

      this.wrapper.appendChild(charSpan);
    });
  }

  morphNext() {
    if (this._isExploding) return;
    this._isExploding = true;

    if (this.sound) {
      MoAudio.play('shatter', { volume: 0.25 });
    }

    // Step 1: Explode shards outward
    this._shards.forEach((s) => s.spring.setTarget(1));
    engine.add(this._boundUpdate);

    // Step 2: Swap word and reassemble inward
    setTimeout(() => {
      this.currentWordIdx = (this.currentWordIdx + 1) % this.words.length;
      this._renderCurrentWord();

      // Start exploded and snap back to 0
      this._shards.forEach((s) => {
        s.spring.value = 1;
        s.spring.setTarget(0);
      });

      if (this.sound) {
        MoAudio.play('pop', { volume: 0.2 });
      }

      setTimeout(() => {
        this._isExploding = false;
      }, 400);
    }, 280);
  }

  _update(dt) {
    let anyActive = false;
    this._shards.forEach((s) => {
      const p = s.spring.update(dt);
      if (p > 0.005) {
        anyActive = true;
        const x = s.targetX * p;
        const y = s.targetY * p;
        const r = s.targetRot * p;
        const opacity = Math.max(0, 1 - p * 0.6);
        s.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${r.toFixed(1)}deg)`;
        s.el.style.opacity = `${opacity.toFixed(2)}`;
      } else {
        s.el.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
        s.el.style.opacity = '1';
      }
    });

    if (!anyActive && !this._isExploding) {
      engine.remove(this._boundUpdate);
    }
  }

  destroy() {
    engine.remove(this._boundUpdate);
    if (this._autoTimer) clearInterval(this._autoTimer);
    if (this._onClick) this.el.removeEventListener('click', this._onClick);
    if (this._onMouseEnter) this.el.removeEventListener('mouseenter', this._onMouseEnter);
    this.el.innerHTML = this._originalContent;
    this.el.classList.remove('mo-shatter-morph-root');
  }
}
