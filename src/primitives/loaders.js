import { Spring } from '../core/spring.js';
import { engine } from '../core/engine.js';
import { MoAudio } from '../core/sound.js';

function safePlayPop(freq = 520, vol = 0.05) {
  try {
    if (typeof MoAudio?.playPop === 'function') {
      MoAudio.playPop(freq, vol);
    } else if (typeof MoAudio?.play === 'function') {
      MoAudio.play('subtle', { volume: vol });
    }
  } catch {}
}

function safePlayWhoosh(vol = 0.18) {
  try {
    if (typeof MoAudio?.playWhoosh === 'function') {
      MoAudio.playWhoosh(vol);
    } else if (typeof MoAudio?.play === 'function') {
      MoAudio.play('whoosh', { volume: vol });
    }
  } catch {}
}

/**
 * Injects ALL ultra-high-definition shader-grade GPU keyframe animations into the DOM (SSR safe)
 */
function ensureLoaderStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('mo-loaders-ultra-styles')) return;

  const style = document.createElement('style');
  style.id = 'mo-loaders-ultra-styles';
  style.textContent = `
    @keyframes moSpinCw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes moSpinCcw { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
    
    @keyframes moPulseGlow {
      0%, 100% { opacity: 0.35; transform: scale(0.92); filter: drop-shadow(0 0 8px currentColor); }
      50% { opacity: 1; transform: scale(1.08); filter: drop-shadow(0 0 24px currentColor); }
    }
    
    @keyframes moWormholeTurbulence {
      0% { transform: scale(1) rotate(0deg); filter: hue-rotate(0deg) drop-shadow(0 0 24px #00e5ff); }
      50% { transform: scale(1.12, 0.94) rotate(180deg); filter: hue-rotate(90deg) drop-shadow(0 0 45px #ff0077); }
      100% { transform: scale(1) rotate(360deg); filter: hue-rotate(360deg) drop-shadow(0 0 24px #00e5ff); }
    }

    @keyframes moPlasmaArcPulse {
      0%, 100% { opacity: 0.2; transform: scale(0.85) rotate(0deg); }
      50% { opacity: 0.95; transform: scale(1.15) rotate(180deg); filter: drop-shadow(0 0 16px currentColor); }
    }

    @keyframes moCausticSheen {
      0% { transform: translate(-120%, -120%) rotate(45deg); }
      100% { transform: translate(120%, 120%) rotate(45deg); }
    }

    @keyframes moPrismSpectralSweep {
      0% { transform: rotate(0deg) scale(1); filter: drop-shadow(0 0 20px #00e5ff); }
      50% { transform: rotate(180deg) scale(1.08); filter: drop-shadow(0 0 35px #ff0077); }
      100% { transform: rotate(360deg) scale(1); filter: drop-shadow(0 0 20px #00e5ff); }
    }

    @keyframes moPulseAuraFluid {
      0% { transform: scale(0.65); opacity: 0.9; }
      50% { opacity: 0.5; }
      100% { transform: scale(1.75); opacity: 0; }
    }

    @keyframes moLevitateMagnetic {
      0%, 100% { transform: translateY(0px) rotateX(25deg); }
      50% { transform: translateY(-12px) rotateX(15deg); }
    }

    @keyframes moMetaballHarmonic {
      0% { transform: scale(1) translate(0, 0); }
      33% { transform: scale(1.15, 0.88) translate(14px, -8px); }
      66% { transform: scale(0.85, 1.18) translate(-12px, 10px); }
      100% { transform: scale(1) translate(0, 0); }
    }

    @keyframes moCyberScanSweep {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes moGyroX {
      0% { transform: rotateX(0deg) rotateY(0deg); }
      100% { transform: rotateX(360deg) rotateY(180deg); }
    }

    @keyframes moGyroY {
      0% { transform: rotateY(0deg) rotateZ(0deg); }
      100% { transform: rotateY(360deg) rotateZ(180deg); }
    }

    @keyframes moPillLiquidShimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @keyframes moPrismFloat {
      0%, 100% { transform: rotateY(0deg) rotateX(15deg) translateY(0); }
      50% { transform: rotateY(180deg) rotateX(-15deg) translateY(-8px); }
    }

    @keyframes moSynapsePulse {
      0% { stroke-dashoffset: 200; opacity: 0.2; }
      50% { opacity: 1; filter: drop-shadow(0 0 8px currentColor); }
      100% { stroke-dashoffset: 0; opacity: 0.2; }
    }

    @keyframes moMercuryBreathing {
      0%, 100% { transform: scale(1, 1) rotate(0deg); border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
      33% { transform: scale(1.08, 0.94) rotate(120deg); border-radius: 70% 30% 46% 54% / 30% 29% 71% 70%; }
      66% { transform: scale(0.92, 1.06) rotate(240deg); border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
    }

    @keyframes moHelixTwist {
      0%, 100% { transform: scaleY(1) translateY(0); }
      50% { transform: scaleY(0.2) translateY(6px); }
    }

    @keyframes moCubeStep {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-16px); }
    }

    @keyframes moDotWave {
      0%, 100% { transform: scale(0.4); opacity: 0.25; }
      50% { transform: scale(1.25); opacity: 1; filter: drop-shadow(0 0 6px currentColor); }
    }

    @keyframes moRadialBarPulse {
      0%, 100% { transform: scaleY(0.25); }
      50% { transform: scaleY(1); }
    }

    @keyframes moFilmSprocketScroll {
      0% { transform: translateY(0px); }
      100% { transform: translateY(-72px); }
    }

    @keyframes moFilmLightLeak {
      0%, 100% { opacity: 0.15; transform: scale(1) rotate(0deg); }
      50% { opacity: 0.85; transform: scale(1.35) rotate(15deg); filter: blur(32px) hue-rotate(45deg); }
    }

    @keyframes moStencilTunnelZoom {
      0% { transform: perspective(800px) translateZ(0px) rotate(0deg); opacity: 0.3; }
      50% { opacity: 1; filter: drop-shadow(0 0 16px #00e5ff); }
      100% { transform: perspective(800px) translateZ(600px) rotate(180deg); opacity: 0.3; }
    }

    @keyframes moBioMetaballOrbit {
      0% { transform: rotate(0deg) translateX(90px) rotate(0deg); }
      100% { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
    }

    @keyframes moGlitchFlicker {
      0%, 100% { opacity: 0.9; transform: translate(0); }
      20% { opacity: 0.6; transform: translate(-2px, 1px); }
      40% { opacity: 1; transform: translate(2px, -1px); }
      60% { opacity: 0.7; transform: translate(-1px, -1px); }
      80% { opacity: 1; transform: translate(1px, 2px); }
    }

    @keyframes moInfinityDash {
      to { stroke-dashoffset: -320; }
    }

    @keyframes moScanlineSlat {
      0% { transform: translateY(-100%); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateY(100%); opacity: 0; }
    }

    @keyframes moCyberGridDrift {
      0% { background-position: 0 0; }
      100% { background-position: 0 40px; }
    }

    @keyframes moChromaticShiftR {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(-4px, 2px); }
      50% { transform: translate(3px, -1px); }
      75% { transform: translate(-2px, -3px); }
    }

    @keyframes moChromaticShiftB {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(4px, -2px); }
      50% { transform: translate(-3px, 1px); }
      75% { transform: translate(2px, 3px); }
    }

    @keyframes moPerspectiveWarpGrid {
      0% { background-position: 0 0; }
      100% { background-position: 0 80px; }
    }

    @keyframes moScissorMarqueeL {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }

    @keyframes moScissorMarqueeR {
      0% { transform: translateX(-50%); }
      100% { transform: translateX(0%); }
    }

    @keyframes moHoloReticleSpinCw {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes moHoloReticleSpinCcw {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }

    @keyframes moLaserScanlineSweep {
      0% { top: 0%; opacity: 0.8; }
      50% { opacity: 1; filter: drop-shadow(0 0 12px currentColor); }
      100% { top: 100%; opacity: 0.8; }
    }

    @keyframes moPrismFacetGlint {
      0%, 100% { transform: rotateY(0deg) rotateX(15deg) scale(1); filter: brightness(1); }
      50% { transform: rotateY(180deg) rotateX(-15deg) scale(1.06); filter: brightness(1.4) drop-shadow(0 0 25px rgba(0,229,255,0.6)); }
    }
  `;
  document.head.appendChild(style);
}

function uid() {
  return 'mo_' + Math.random().toString(36).substring(2, 8);
}

// ─── 1. QuantumChronosWormholeLoader (Spacetime Curvature & Turbulence) ─────
export class QuantumChronosWormholeLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 96;
    this.color = options.color || '#00e5ff';
    this.coreColor = options.coreColor || '#7000ff';
    this.interactive = options.interactive !== false;
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();

    this.container = document.createElement('div');
    this.container.className = 'mo-loader-wormhole';
    this.container.style.cssText = `
      position: relative;
      width: ${this.size}px;
      height: ${this.size}px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      perspective: 1000px;
      transition: transform 0.2s ease-out;
    `;

    const filterId = uid();
    const gradId = uid();

    this.container.innerHTML = `
      <svg width="${this.size}" height="${this.size}" viewBox="0 0 120 120" fill="none" style="overflow:visible;width:100%;height:100%;">
        <defs>
          <filter id="${filterId}" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
            <feDisplacementMap in="blur" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" result="displace" />
            <feMerge>
              <feMergeNode in="displace" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${this.color}" />
            <stop offset="50%" stop-color="#ff0077" />
            <stop offset="100%" stop-color="${this.coreColor}" />
          </linearGradient>
        </defs>

        <g style="transform-origin: 60px 60px; animation: moWormholeTurbulence 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;">
          <circle cx="60" cy="60" r="48" stroke="url(#${gradId})" stroke-width="4" stroke-linecap="round" stroke-dasharray="90 140" filter="url(#${filterId})" />
          <circle cx="60" cy="60" r="36" stroke="#ffffff" stroke-opacity="0.6" stroke-width="1.5" stroke-dasharray="40 90" />
          <circle cx="60" cy="12" r="5" fill="#ffffff" filter="drop-shadow(0 0 10px #ffffff)" />
          <circle cx="60" cy="108" r="4" fill="${this.color}" filter="drop-shadow(0 0 8px ${this.color})" />
        </g>

        <circle cx="60" cy="60" r="22" fill="#030308" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
        <circle cx="60" cy="60" r="8" fill="${this.color}" style="animation: moPlasmaArcPulse 1.8s ease-in-out infinite; color: ${this.color};" />
        <circle cx="60" cy="60" r="3" fill="#ffffff" />
      </svg>
    `;

    this.el.appendChild(this.container);

    if (this.interactive) {
      this._onMove = (e) => {
        const rect = this.container.getBoundingClientRect();
        const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        this.container.style.transform = `rotateY(${nx * 24}deg) rotateX(${-ny * 24}deg) scale(1.05)`;
      };
      this._onLeave = () => {
        this.container.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
      };
      this.container.addEventListener('mousemove', this._onMove);
      this.container.addEventListener('mouseleave', this._onLeave);
    }
  }

  destroy() {
    if (this._onMove) {
      this.container?.removeEventListener('mousemove', this._onMove);
      this.container?.removeEventListener('mouseleave', this._onLeave);
    }
    if (this.container?.parentNode) this.container.parentNode.removeChild(this.container);
  }
}

export const SingularityVortexLoader = QuantumChronosWormholeLoader;

// ─── 2. ObsidianLiquidCausticLoader (Molten Glass Caustic Refraction) ─────────
export class ObsidianLiquidCausticLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 88;
    this.color = options.color || '#00e5ff';
    this.accent = options.accent || '#9b51e0';
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();

    this.container = document.createElement('div');
    this.container.className = 'mo-loader-obsidian';
    this.container.style.cssText = `
      position: relative;
      width: ${this.size}px;
      height: ${this.size}px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.2) 0%, rgba(10,10,20,0.9) 65%, #000000 100%);
      box-shadow: inset 0 2px 8px rgba(255,255,255,0.4), inset 0 -4px 12px ${this.color}55, 0 14px 30px rgba(0,0,0,0.6), 0 0 25px ${this.color}44;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.15);
    `;

    this.container.innerHTML = `
      <div style="position:absolute;inset:-50%;background:linear-gradient(135deg,transparent 40%,rgba(255,255,255,0.6) 50%,transparent 60%);animation:moCausticSheen 2.6s cubic-bezier(0.16,1,0.3,1) infinite;"></div>
      <div style="width:55%;height:55%;border-radius:50%;background:radial-gradient(circle,${this.color} 0%,${this.accent} 60%,transparent 100%);filter:blur(8px);opacity:0.85;animation:moPlasmaArcPulse 2s ease-in-out infinite;color:${this.color};"></div>
      <div style="position:absolute;width:6px;height:6px;border-radius:50%;background:#ffffff;top:22%;left:26%;box-shadow:0 0 8px #ffffff;filter:blur(0.5px);"></div>
    `;

    this.el.appendChild(this.container);
  }

  destroy() {
    if (this.container?.parentNode) this.container.parentNode.removeChild(this.container);
  }
}

// ─── 3. MagLevSuperconductorLoader (3D Floating Quantum Levitator) ───────────
export class MagLevSuperconductorLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 84;
    this.color = options.color || '#00ff88';
    this.accent = options.accent || '#00e5ff';
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();

    this.container = document.createElement('div');
    this.container.className = 'mo-loader-maglev';
    this.container.style.cssText = `
      position: relative;
      width: ${this.size}px;
      height: ${this.size}px;
      perspective: 800px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    `;

    this.container.innerHTML = `
      <div style="position:absolute;bottom:10px;width:70%;height:22px;border-radius:50%;border:2px solid rgba(255,255,255,0.1);background:radial-gradient(ellipse,${this.color}22 0%,transparent 70%);box-shadow:0 0 15px ${this.color}44;"></div>
      <div style="width:65%;height:65%;position:relative;transform-style:preserve-3d;animation:moLevitateMagnetic 2.4s ease-in-out infinite;">
        <div style="position:absolute;inset:0;border-radius:50%;border:2.5px solid ${this.color};border-top-color:#ffffff;box-shadow:0 0 18px ${this.color};animation:moSpinCw 1.8s linear infinite;"></div>
        <div style="position:absolute;inset:15%;border-radius:50%;border:1.5px dashed ${this.accent};animation:moSpinCcw 2.8s linear infinite;"></div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:10px;height:10px;border-radius:50%;background:#ffffff;box-shadow:0 0 14px #ffffff,0 0 25px ${this.color};"></div>
      </div>
    `;

    this.el.appendChild(this.container);
  }

  destroy() {
    if (this.container?.parentNode) this.container.parentNode.removeChild(this.container);
  }
}

// ─── 4. HyperPrismDispersionLoader (3D Snell's Law Spectral Rainbow Ray) ──────
export class HyperPrismDispersionLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 80;
    this.color = options.color || '#00e5ff';
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();

    this.container = document.createElement('div');
    this.container.className = 'mo-loader-prism-dispersion';
    this.container.style.cssText = `
      position: relative;
      width: ${this.size}px;
      height: ${this.size}px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      perspective: 700px;
    `;

    const gradId = uid();
    this.container.innerHTML = `
      <div style="width:100%;height:100%;position:relative;animation:moPrismSpectralSweep 4s ease-in-out infinite;">
        <svg viewBox="0 0 100 100" fill="none" style="width:100%;height:100%;overflow:visible;">
          <defs>
            <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ff0055" />
              <stop offset="35%" stop-color="#facc15" />
              <stop offset="70%" stop-color="#00ff88" />
              <stop offset="100%" stop-color="#00e5ff" />
            </linearGradient>
          </defs>
          <polygon points="50,15 85,75 15,75" stroke="url(#${gradId})" stroke-width="2.5" fill="rgba(255,255,255,0.04)" />
          <polygon points="50,25 75,70 25,70" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
          <line x1="50" y1="15" x2="50" y2="75" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3 3" />
          <circle cx="50" cy="55" r="5" fill="#ffffff" filter="drop-shadow(0 0 12px #00e5ff)" />
        </svg>
      </div>
    `;

    this.el.appendChild(this.container);
  }

  destroy() {
    if (this.container?.parentNode) this.container.parentNode.removeChild(this.container);
  }
}

// ─── 5. HoloPrismCrystalLoader ──────────────────────────────────────────────
export class HoloPrismCrystalLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 72;
    this.color = options.color || '#00e5ff';
    this.accentColor = options.accentColor || '#ff0077';
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-holo-prism';
    this.container.style.cssText = `position:relative;width:${this.size}px;height:${this.size}px;perspective:600px;display:inline-flex;align-items:center;justify-content:center;`;
    this.container.innerHTML = `
      <div style="width:50%;height:80%;position:relative;transform-style:preserve-3d;animation:moPrismFloat 3s ease-in-out infinite;">
        <svg viewBox="0 0 60 90" fill="none" style="width:100%;height:100%;overflow:visible;">
          <polygon points="30,5 55,45 30,85 5,45" fill="rgba(0, 229, 255, 0.12)" stroke="${this.color}" stroke-width="1.8" />
          <line x1="30" y1="5" x2="30" y2="85" stroke="${this.accentColor}" stroke-width="1.5" stroke-dasharray="4 3" />
          <line x1="5" y1="45" x2="55" y2="45" stroke="rgba(255,255,255,0.4)" stroke-width="1" />
          <circle cx="30" cy="45" r="4" fill="#ffffff" filter="drop-shadow(0 0 10px ${this.color})" />
        </svg>
      </div>
    `;
    this.el.appendChild(this.container);
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}

// ─── 6. OrbitalEclipseLoader ────────────────────────────────────────────────
export class OrbitalEclipseLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 64;
    this.primaryColor = options.primaryColor || '#7c6aff';
    this.secondaryColor = options.secondaryColor || '#00e5ff';
    this.accentColor = options.accentColor || '#ff0077';
    this.speed = options.speed || 2.4;
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-orbital-eclipse';
    this.container.style.cssText = `position:relative;width:${this.size}px;height:${this.size}px;display:inline-flex;align-items:center;justify-content:center;`;
    this.container.innerHTML = `
      <svg width="${this.size}" height="${this.size}" viewBox="0 0 100 100" fill="none" style="width:100%;height:100%;overflow:visible;">
        <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.06)" stroke-width="2" />
        <g style="transform-origin:50px 50px;animation:moSpinCw ${this.speed}s linear infinite;">
          <circle cx="50" cy="50" r="42" stroke="${this.primaryColor}" stroke-width="3" stroke-linecap="round" stroke-dasharray="140 180" filter="drop-shadow(0 0 8px ${this.secondaryColor})" />
          <circle cx="50" cy="8" r="4" fill="#ffffff" filter="drop-shadow(0 0 6px ${this.secondaryColor})" />
        </g>
        <g style="transform-origin:50px 50px;animation:moSpinCcw ${this.speed * 0.75}s cubic-bezier(0.4,0,0.2,1) infinite;">
          <circle cx="50" cy="50" r="28" stroke="${this.accentColor}" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="80 120" />
          <circle cx="50" cy="22" r="3" fill="${this.accentColor}" filter="drop-shadow(0 0 8px ${this.accentColor})" />
        </g>
        <circle cx="50" cy="50" r="8" fill="${this.primaryColor}" style="color:${this.primaryColor};animation:moPulseGlow 1.8s ease-in-out infinite;" />
        <circle cx="50" cy="50" r="4" fill="#ffffff" />
      </svg>
    `;
    this.el.appendChild(this.container);
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}

// ─── 7. MorphingMetaballLoader ──────────────────────────────────────────────
export class MorphingMetaballLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 72;
    this.color = options.color || '#00e5ff';
    this.accentColor = options.accentColor || '#7c6aff';
    this.speed = options.speed || 2.8;
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-metaball';
    this.container.style.cssText = `position:relative;width:${this.size}px;height:${this.size}px;display:inline-flex;align-items:center;justify-content:center;`;
    const filterId = uid();
    this.container.innerHTML = `
      <svg width="${this.size}" height="${this.size}" viewBox="0 0 100 100" style="width:100%;height:100%;">
        <defs>
          <filter id="${filterId}">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
        <g filter="url(#${filterId})" fill="${this.color}" style="transform-origin:50px 50px;animation:moSpinCw ${this.speed * 2}s linear infinite;">
          <circle cx="50" cy="30" r="16" style="animation:moMetaballHarmonic ${this.speed}s ease-in-out infinite;" />
          <circle cx="34" cy="64" r="14" style="animation:moMetaballHarmonic ${this.speed}s ease-in-out infinite;animation-delay:-${this.speed/3}s;" />
          <circle cx="66" cy="64" r="14" style="animation:moMetaballHarmonic ${this.speed}s ease-in-out infinite;animation-delay:-${(this.speed*2)/3}s;" />
        </g>
      </svg>
    `;
    this.el.appendChild(this.container);
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}

// ─── 8. CyberMatrixScanLoader ───────────────────────────────────────────────
export class CyberMatrixScanLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 80;
    this.color = options.color || '#00ff88';
    this.telemetry = options.telemetry !== false;
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-cyber-scan';
    this.container.style.cssText = `position:relative;width:${this.size}px;height:${this.size}px;display:inline-flex;align-items:center;justify-content:center;font-family:ui-monospace,monospace;`;
    this.container.innerHTML = `
      <svg width="${this.size}" height="${this.size}" viewBox="0 0 100 100" fill="none" style="width:100%;height:100%;overflow:visible;">
        <circle cx="50" cy="50" r="45" stroke="${this.color}" stroke-opacity="0.25" stroke-width="1" stroke-dasharray="4 6" />
        <path d="M 50 2 L 50 12 M 50 88 L 50 98 M 2 50 L 12 50 M 88 50 L 98 50" stroke="${this.color}" stroke-width="1.5" />
        <g style="transform-origin:50px 50px;animation:moCyberScanSweep 3s linear infinite;">
          <circle cx="50" cy="50" r="36" stroke="${this.color}" stroke-width="1.5" stroke-dasharray="16 30 45 30" stroke-linecap="round" />
          <path d="M 50 50 L 50 14 A 36 36 0 0 1 86 50 Z" fill="${this.color}" opacity="0.2" />
        </g>
        <circle cx="50" cy="50" r="22" stroke="${this.color}" stroke-opacity="0.4" stroke-width="1" stroke-dasharray="2 4" />
        <circle cx="50" cy="50" r="3" fill="${this.color}" style="color:${this.color};animation:moPulseGlow 1.2s ease-in-out infinite;" />
      </svg>
      ${this.telemetry ? `<div style="position:absolute;bottom:-18px;font-size:9px;color:${this.color};letter-spacing:1px;text-transform:uppercase;opacity:0.85;">SYS.INIT</div>` : ''}
    `;
    this.el.appendChild(this.container);
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}

// ─── 9. QuantumSpinLoader ───────────────────────────────────────────────────
export class QuantumSpinLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 68;
    this.color = options.color || '#ff0055';
    this.secondaryColor = options.secondaryColor || '#00e5ff';
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-quantum-spin';
    this.container.style.cssText = `position:relative;width:${this.size}px;height:${this.size}px;perspective:800px;transform-style:preserve-3d;display:inline-flex;align-items:center;justify-content:center;`;
    this.container.innerHTML = `
      <div style="position:absolute;width:100%;height:100%;border-radius:50%;border:2px solid ${this.color};border-top-color:transparent;border-bottom-color:transparent;animation:moGyroX 2.2s linear infinite;filter:drop-shadow(0 0 6px ${this.color});"></div>
      <div style="position:absolute;width:75%;height:75%;border-radius:50%;border:2px solid ${this.secondaryColor};border-left-color:transparent;border-right-color:transparent;animation:moGyroY 1.6s linear infinite;filter:drop-shadow(0 0 6px ${this.secondaryColor});"></div>
      <div style="width:10px;height:10px;border-radius:50%;background:#ffffff;box-shadow:0 0 12px #ffffff, 0 0 20px ${this.color};"></div>
    `;
    this.el.appendChild(this.container);
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}

// ─── 10. MinimalPulsePillLoader ─────────────────────────────────────────────
export class MinimalPulsePillLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.width = options.width || 160;
    this.height = options.height || 8;
    this.gradient = options.gradient || 'linear-gradient(90deg, #ff7a00, #00e5ff, #f368e0, #7000ff)';
    this.bgColor = options.bgColor || 'rgba(255, 255, 255, 0.08)';
    this.progress = 0;
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-pulse-pill';
    this.container.style.cssText = `position:relative;width:${this.width}px;height:${this.height}px;background:${this.bgColor};border-radius:9999px;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.06);`;
    this.fill = document.createElement('div');
    this.fill.style.cssText = `position:absolute;top:0;left:0;height:100%;width:0%;background:${this.gradient};background-size:200% 100%;border-radius:9999px;box-shadow:0 0 12px rgba(0,229,255,0.5);animation:moPillLiquidShimmer 2s linear infinite;transition:width 0.1s ease-out;`;
    this.container.appendChild(this.fill);
    this.el.appendChild(this.container);
  }

  setProgress(percent) {
    this.progress = Math.max(0, Math.min(100, percent));
    if (this.fill) this.fill.style.width = `${this.progress}%`;
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}

// ─── 11. NeuralSynapseLoader ────────────────────────────────────────────────
export class NeuralSynapseLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 76;
    this.color = options.color || '#00e5ff';
    this.accent = options.accent || '#ff0077';
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-synapse';
    this.container.style.cssText = `position:relative;width:${this.size}px;height:${this.size}px;display:inline-flex;align-items:center;justify-content:center;`;
    this.container.innerHTML = `
      <svg width="${this.size}" height="${this.size}" viewBox="0 0 100 100" fill="none" style="width:100%;height:100%;">
        <path d="M 20 50 Q 50 20 80 50 Q 50 80 20 50" stroke="${this.color}" stroke-width="2" stroke-dasharray="40 10" style="color:${this.color};animation:moSynapsePulse 2s linear infinite;" />
        <path d="M 50 20 Q 80 50 50 80 Q 20 50 50 20" stroke="${this.accent}" stroke-width="1.8" stroke-dasharray="30 15" style="color:${this.accent};animation:moSynapsePulse 2.4s linear infinite reverse;" />
        <circle cx="50" cy="50" r="5" fill="#ffffff" filter="drop-shadow(0 0 8px ${this.color})" />
        <circle cx="20" cy="50" r="3" fill="${this.color}" />
        <circle cx="80" cy="50" r="3" fill="${this.color}" />
        <circle cx="50" cy="20" r="3" fill="${this.accent}" />
        <circle cx="50" cy="80" r="3" fill="${this.accent}" />
      </svg>
    `;
    this.el.appendChild(this.container);
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}

// ─── 12. LiquidMercuryDropletLoader ─────────────────────────────────────────
export class LiquidMercuryDropletLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 68;
    this.color = options.color || '#00e5ff';
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-mercury';
    this.container.style.cssText = `position:relative;width:${this.size}px;height:${this.size}px;display:inline-flex;align-items:center;justify-content:center;`;
    this.container.innerHTML = `
      <div style="width:70%;height:70%;background:linear-gradient(135deg, rgba(255,255,255,0.9) 0%, ${this.color} 50%, #7000ff 100%);box-shadow:inset 0 2px 6px rgba(255,255,255,0.8),0 0 20px ${this.color}88;animation:moMercuryBreathing 3.6s ease-in-out infinite;"></div>
    `;
    this.el.appendChild(this.container);
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}

// ─── 13. AuraRingsConcentricLoader ──────────────────────────────────────────
export class AuraRingsConcentricLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 72;
    this.color = options.color || '#7c6aff';
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-aura';
    this.container.style.cssText = `position:relative;width:${this.size}px;height:${this.size}px;display:inline-flex;align-items:center;justify-content:center;`;
    this.container.innerHTML = `
      <div style="position:absolute;width:100%;height:100%;border-radius:50%;border:2px solid ${this.color};animation:moPulseAuraFluid 2.2s cubic-bezier(0.1,0.8,0.3,1) infinite;"></div>
      <div style="position:absolute;width:100%;height:100%;border-radius:50%;border:2px solid ${this.color};animation:moPulseAuraFluid 2.2s cubic-bezier(0.1,0.8,0.3,1) infinite;animation-delay:0.7s;"></div>
      <div style="position:absolute;width:100%;height:100%;border-radius:50%;border:2px solid ${this.color};animation:moPulseAuraFluid 2.2s cubic-bezier(0.1,0.8,0.3,1) infinite;animation-delay:1.4s;"></div>
      <div style="width:12px;height:12px;border-radius:50%;background:#ffffff;box-shadow:0 0 14px ${this.color};"></div>
    `;
    this.el.appendChild(this.container);
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}

// ─── 14. HyperLoopDNAHelixLoader ────────────────────────────────────────────
export class HyperLoopDNAHelixLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 70;
    this.color = options.color || '#00ff88';
    this.accent = options.accent || '#00e5ff';
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-helix';
    this.container.style.cssText = `position:relative;width:${this.size}px;height:${this.size}px;display:inline-flex;align-items:center;justify-content:space-evenly;`;
    let bars = '';
    for (let i = 0; i < 6; i++) {
      bars += `<div style="width:4px;height:36px;border-radius:4px;background:linear-gradient(180deg,${this.color},${this.accent});animation:moHelixTwist 1.2s ease-in-out infinite;animation-delay:${i * 0.15}s;box-shadow:0 0 8px ${this.color}88;"></div>`;
    }
    this.container.innerHTML = bars;
    this.el.appendChild(this.container);
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}

// ─── 15. IsometricCubeStackLoader ───────────────────────────────────────────
export class IsometricCubeStackLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 64;
    this.color = options.color || '#facc15';
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-cube-stack';
    this.container.style.cssText = `position:relative;width:${this.size}px;height:${this.size}px;display:inline-flex;align-items:center;justify-content:center;gap:6px;`;
    let cubes = '';
    for (let i = 0; i < 3; i++) {
      cubes += `<div style="width:16px;height:16px;background:${this.color};border-radius:3px;transform:rotate(45deg);animation:moCubeStep 1.2s ease-in-out infinite;animation-delay:${i * 0.2}s;box-shadow:0 0 10px ${this.color}88;"></div>`;
    }
    this.container.innerHTML = cubes;
    this.el.appendChild(this.container);
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}

// ─── 16. DotMatrixWaveLoader ────────────────────────────────────────────────
export class DotMatrixWaveLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 60;
    this.color = options.color || '#00e5ff';
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-dot-wave';
    this.container.style.cssText = `display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:${this.size}px;height:${this.size}px;align-items:center;justify-items:center;`;
    let dots = '';
    for (let i = 0; i < 9; i++) {
      dots += `<div style="width:8px;height:8px;border-radius:50%;background:${this.color};color:${this.color};animation:moDotWave 1.4s ease-in-out infinite;animation-delay:${(i % 3) * 0.2 + Math.floor(i / 3) * 0.2}s;"></div>`;
    }
    this.container.innerHTML = dots;
    this.el.appendChild(this.container);
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}

// ─── 17. RadialEqualizerWaveLoader ──────────────────────────────────────────
export class RadialEqualizerWaveLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 68;
    this.color = options.color || '#f43f5e';
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-radial-eq';
    this.container.style.cssText = `position:relative;width:${this.size}px;height:${this.size}px;display:inline-flex;align-items:center;justify-content:center;`;
    let bars = '';
    for (let i = 0; i < 12; i++) {
      const rot = i * 30;
      bars += `<div style="position:absolute;width:3px;height:24px;border-radius:3px;background:${this.color};transform:rotate(${rot}deg) translateY(-18px);transform-origin:center 30px;animation:moRadialBarPulse 1s ease-in-out infinite;animation-delay:${(i % 6) * 0.12}s;box-shadow:0 0 6px ${this.color}88;"></div>`;
    }
    this.container.innerHTML = bars;
    this.el.appendChild(this.container);
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}

// ─── 18. InfinityMorphRibbonLoader ──────────────────────────────────────────
export class InfinityMorphRibbonLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 80;
    this.color = options.color || '#a855f7';
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-infinity';
    this.container.style.cssText = `position:relative;width:${this.size}px;height:${this.size}px;display:inline-flex;align-items:center;justify-content:center;`;
    this.container.innerHTML = `
      <svg width="${this.size}" height="${this.size}" viewBox="0 0 100 60" fill="none" style="width:100%;height:100%;">
        <path d="M 30 30 C 15 10, 5 25, 5 30 C 5 35, 15 50, 30 30 C 45 10, 55 50, 70 30 C 85 10, 95 25, 95 30 C 95 35, 85 50, 70 30 C 55 10, 45 50, 30 30 Z" stroke="rgba(255,255,255,0.08)" stroke-width="4" />
        <path d="M 30 30 C 15 10, 5 25, 5 30 C 5 35, 15 50, 30 30 C 45 10, 55 50, 70 30 C 85 10, 95 25, 95 30 C 95 35, 85 50, 70 30 C 55 10, 45 50, 30 30 Z" stroke="${this.color}" stroke-width="4" stroke-linecap="round" stroke-dasharray="60 260" style="animation:moInfinityDash 2s linear infinite;filter:drop-shadow(0 0 8px ${this.color});" />
      </svg>
    `;
    this.el.appendChild(this.container);
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}

// ─── 19. GlitchTerminalMatrixLoader ─────────────────────────────────────────
export class GlitchTerminalMatrixLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 72;
    this.color = options.color || '#22c55e';
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-glitch';
    this.container.style.cssText = `position:relative;width:${this.size}px;height:${this.size}px;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;font-family:monospace;font-size:11px;font-weight:700;color:${this.color};letter-spacing:2px;animation:moGlitchFlicker 1.8s steps(2) infinite;`;
    this.container.innerHTML = `
      <div style="text-shadow:0 0 8px ${this.color};">> 0x7F_</div>
      <div style="font-size:8px;opacity:0.6;margin-top:2px;">SYNCING</div>
    `;
    this.el.appendChild(this.container);
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}

// ─── 20. SonarPulseEchoLoader ───────────────────────────────────────────────
export class SonarPulseEchoLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 68;
    this.color = options.color || '#06b6d4';
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-sonar';
    this.container.style.cssText = `position:relative;width:${this.size}px;height:${this.size}px;display:inline-flex;align-items:center;justify-content:center;`;
    this.container.innerHTML = `
      <div style="position:absolute;width:100%;height:100%;border-radius:50%;background:radial-gradient(circle,${this.color}44 0%,transparent 70%);animation:moPulseAuraFluid 2s ease-out infinite;"></div>
      <div style="position:absolute;width:50%;height:50%;border-radius:50%;border:1.5px solid ${this.color};animation:moPulseAuraFluid 2s ease-out infinite;animation-delay:0.5s;"></div>
      <div style="width:8px;height:8px;border-radius:50%;background:#ffffff;box-shadow:0 0 10px ${this.color};"></div>
    `;
    this.el.appendChild(this.container);
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}

// ─── 21. ShatterAssembleLoader ──────────────────────────────────────────────
export class ShatterAssembleLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 64;
    this.color = options.color || '#e11d48';
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    ensureLoaderStyles();
    this.container = document.createElement('div');
    this.container.className = 'mo-loader-shatter';
    this.container.style.cssText = `position:relative;width:${this.size}px;height:${this.size}px;display:inline-flex;align-items:center;justify-content:center;`;
    this.container.innerHTML = `
      <svg width="${this.size}" height="${this.size}" viewBox="0 0 60 60" fill="none" style="overflow:visible;">
        <polygon points="30,5 55,25 30,30" fill="${this.color}" opacity="0.9" style="animation:moCubeStep 1.5s ease-in-out infinite;" />
        <polygon points="55,25 45,55 30,30" fill="${this.color}" opacity="0.7" style="animation:moCubeStep 1.5s ease-in-out infinite;animation-delay:0.2s;" />
        <polygon points="45,55 15,55 30,30" fill="${this.color}" opacity="0.85" style="animation:moCubeStep 1.5s ease-in-out infinite;animation-delay:0.4s;" />
        <polygon points="15,55 5,25 30,30" fill="${this.color}" opacity="0.6" style="animation:moCubeStep 1.5s ease-in-out infinite;animation-delay:0.6s;" />
        <polygon points="5,25 30,5 30,30" fill="${this.color}" opacity="0.95" style="animation:moCubeStep 1.5s ease-in-out infinite;animation-delay:0.8s;" />
      </svg>
    `;
    this.el.appendChild(this.container);
  }

  destroy() { if (this.container?.parentNode) this.container.parentNode.removeChild(this.container); }
}


// ─── Next-Gen Fullscreen Experiential Loading Screen ────────────────────────
export class MoLoadingScreen {
  constructor(options = {}) {
    this.title = options.title || 'ORGANIC MOTION';
    this.subtitle = options.subtitle || 'Initializing cinema physics & spatial shaders...';
    this.type = options.type || 'wormhole';
    this.accentColor = options.accentColor || '#00e5ff';
    this.bgColor = options.bgColor || '#07070b';
    this.sound = options.sound !== false;
    this.duration = options.duration || 2600;
    this.autoExit = options.autoExit !== false;
    this.interactiveGlow = options.interactiveGlow !== false;
    this.onComplete = options.onComplete || null;

    this.progress = 0;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-loading-screen-root';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: ${this.bgColor};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), filter 0.85s ease;
      overflow: hidden;
      perspective: 1000px;
    `;

    // Interactive reactive ambient glow
    this.glow = document.createElement('div');
    this.glow.style.cssText = `
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, ${this.accentColor}28 0%, rgba(124, 106, 255, 0.12) 40%, transparent 70%);
      pointer-events: none;
      filter: blur(60px);
      transition: transform 0.15s ease-out;
    `;
    this.root.appendChild(this.glow);

    // Subtle holographic background scanlines
    this.scanline = document.createElement('div');
    this.scanline.style.cssText = `
      position: absolute;
      inset: 0;
      background: linear-gradient(rgba(18, 16, 38, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
      background-size: 100% 3px, 6px 100%;
      pointer-events: none;
      opacity: 0.6;
    `;
    this.root.appendChild(this.scanline);

    // Center content
    this.content = document.createElement('div');
    this.content.style.cssText = `
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
      text-align: center;
      max-width: 520px;
      padding: 0 24px;
      transform-style: preserve-3d;
    `;

    // Loader visual slot
    this.loaderSlot = document.createElement('div');
    this.content.appendChild(this.loaderSlot);

    const LoaderCtor = LOADER_CATALOG[this.type] || QuantumChronosWormholeLoader;
    this.visual = new LoaderCtor(this.loaderSlot, { color: this.accentColor, size: 92 });

    // Title & Phase Telemetry Subtitle
    this.textBlock = document.createElement('div');
    this.textBlock.innerHTML = `
      <div style="font-size: 13px; font-weight: 800; letter-spacing: 4.5px; text-transform: uppercase; color: #ffffff; margin-bottom: 8px; text-shadow: 0 0 15px rgba(255,255,255,0.4);">
        ${this.title}
      </div>
      <div class="mo-telemetry-text" style="font-size: 12px; color: rgba(255, 255, 255, 0.5); letter-spacing: 0.5px; font-family: ui-monospace, monospace;">
        ${this.subtitle}
      </div>
    `;
    this.content.appendChild(this.textBlock);

    // Futuristic Spring Progress readout
    this.counterEl = document.createElement('div');
    this.counterEl.style.cssText = `
      font-size: 34px;
      font-weight: 900;
      letter-spacing: -1px;
      font-feature-settings: "tnum";
      font-variant-numeric: tabular-nums;
      background: linear-gradient(135deg, #ffffff 30%, ${this.accentColor} 80%, #ff0077 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 12px ${this.accentColor}55);
    `;
    this.counterEl.textContent = '00%';
    this.content.appendChild(this.counterEl);

    this.root.appendChild(this.content);
    document.body.appendChild(this.root);

    // Interactive pointer movement
    if (this.interactiveGlow) {
      this._onPointerMove = (e) => {
        const x = e.clientX - window.innerWidth / 2;
        const y = e.clientY - window.innerHeight / 2;
        this.glow.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
        this.content.style.transform = `rotateY(${x * 0.02}deg) rotateX(${-y * 0.02}deg)`;
      };
      window.addEventListener('mousemove', this._onPointerMove);
    }

    if (this.sound) safePlayPop(520, 0.06);
    if (this.autoExit) this._startAutoSimulation();
  }

  _startAutoSimulation() {
    const startTime = performance.now();
    const phases = [
      'Calibrating fluid spatial matrices...',
      'Synthesizing spring physics vectors...',
      'Synchronizing procedural Web Audio...',
      'Finalizing viewport shaders...',
    ];

    const telemetryEl = this.textBlock.querySelector('.mo-telemetry-text');

    const tick = (now) => {
      if (this._isExited) return;
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.floor((elapsed / this.duration) * 100));
      this.setProgress(pct);

      if (telemetryEl && phases.length) {
        const phaseIndex = Math.min(phases.length - 1, Math.floor((pct / 100) * phases.length));
        telemetryEl.textContent = `[${String(phaseIndex + 1).padStart(2, '0')}/${String(phases.length).padStart(2, '0')}] ${phases[phaseIndex]}`;
      }

      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => this.exit(), 320);
      }
    };
    requestAnimationFrame(tick);
  }

  setProgress(percent) {
    this.progress = Math.max(0, Math.min(100, percent));
    if (this.counterEl) this.counterEl.textContent = `${String(this.progress).padStart(2, '0')}%`;
    if (this.visual && typeof this.visual.setProgress === 'function') {
      this.visual.setProgress(this.progress);
    }
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;

    if (this._onPointerMove) {
      window.removeEventListener('mousemove', this._onPointerMove);
    }

    if (this.sound) safePlayWhoosh(0.14);

    this.root.style.opacity = '0';
    this.root.style.transform = 'scale(1.1) translateY(-30px)';
    this.root.style.filter = 'blur(12px)';
    this.root.style.pointerEvents = 'none';

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.visual?.destroy) this.visual.destroy();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 850);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// 🏆 Awwwards Site of the Year Signature Experiential Preloaders
// ══════════════════════════════════════════════════════════════════════════════

// Helper to lock body scroll during fullscreen preloaders
function lockBodyScroll() {
  if (typeof document === 'undefined') return () => {};
  const prevOverflow = document.body.style.overflow;
  const prevHtmlOverflow = document.documentElement.style.overflow;
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = prevOverflow;
    document.documentElement.style.overflow = prevHtmlOverflow;
  };
}

// ─── 1. AwwwardsKineticOdometerVaultScreen (Physical 3D Rolling Number Reels & Ambient Plasma Aurora) ───
export class AwwwardsKineticOdometerVaultScreen {
  constructor(options = {}) {
    this.brand = options.brand || 'ORGANIC MOTION // 2026';
    this.subtitle = options.subtitle || 'HIGH-PRECISION KINETIC RUNTIME';
    this.accentColor = options.accentColor || '#00f0ff';
    this.secondaryColor = options.secondaryColor || '#ff0077';
    this.bgColor = options.bgColor || '#05060a';
    this.sound = options.sound !== false;
    this.duration = options.duration || 3200;
    this.interactive = options.interactive !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-odometer-vault-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: ${this.bgColor};
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: clamp(24px, 5vw, 60px);
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Inter", sans-serif;
      color: #ffffff;
      overflow: hidden;
      perspective: 1000px;
      transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), filter 0.65s ease;
    `;

    // Ambient Plasma Aurora Canvas Background
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      opacity: 0.65;
      pointer-events: none;
    `;
    this.root.appendChild(this.canvas);
    this._initAuroraCanvas();

    // 4 Corner Precision Brackets
    const corners = document.createElement('div');
    corners.style.cssText = `position: absolute; inset: 20px; pointer-events: none; z-index: 5;`;
    corners.innerHTML = `
      <div style="position:absolute;top:0;left:0;width:16px;height:16px;border-top:2px solid ${this.accentColor};border-left:2px solid ${this.accentColor};opacity:0.6;"></div>
      <div style="position:absolute;top:0;right:0;width:16px;height:16px;border-top:2px solid ${this.accentColor};border-right:2px solid ${this.accentColor};opacity:0.6;"></div>
      <div style="position:absolute;bottom:0;left:0;width:16px;height:16px;border-bottom:2px solid ${this.accentColor};border-left:2px solid ${this.accentColor};opacity:0.6;"></div>
      <div style="position:absolute;bottom:0;right:0;width:16px;height:16px;border-bottom:2px solid ${this.accentColor};border-right:2px solid ${this.accentColor};opacity:0.6;"></div>
    `;
    this.root.appendChild(corners);

    // Top Header
    this.header = document.createElement('div');
    this.header.style.cssText = `
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding-bottom: 18px;
    `;
    this.header.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:8px;height:8px;border-radius:50%;background:${this.accentColor};box-shadow:0 0 12px ${this.accentColor};"></div>
        <span style="letter-spacing:3px;">${this.brand}</span>
        <span style="color:rgba(255,255,255,0.3);">//</span>
        <span style="color:${this.accentColor};font-family:ui-monospace,monospace;">${this.subtitle}</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px;font-family:ui-monospace,monospace;color:rgba(255,255,255,0.6);">
        <span>LAT: 48.8566° N</span>
        <span style="padding:4px 8px;border-radius:4px;background:rgba(0,240,255,0.08);border:1px solid rgba(0,240,255,0.2);color:${this.accentColor};">SYS.LIVE</span>
      </div>
    `;
    this.root.appendChild(this.header);

    // Centerpiece: 3D Rolling Mechanical Odometer Reels
    this.stage = document.createElement('div');
    this.stage.style.cssText = `
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: auto 0;
      transform-style: preserve-3d;
      transition: transform 0.15s ease-out;
    `;

    // Status pill
    const statusPill = document.createElement('div');
    statusPill.style.cssText = `
      font-family: ui-monospace, monospace;
      font-size: 11px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: ${this.accentColor};
      background: rgba(8, 12, 20, 0.7);
      border: 1px solid rgba(0, 240, 255, 0.3);
      box-shadow: 0 0 20px rgba(0,240,255,0.15);
      padding: 6px 18px;
      border-radius: 999px;
      margin-bottom: 28px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      backdrop-filter: blur(12px);
    `;
    statusPill.innerHTML = `<span>●</span> <span>[ INITIALIZING NUMERICAL ENGINE // 120 FPS ]</span>`;
    this.stage.appendChild(statusPill);

    // 3D Odometer Container
    this.odometer = document.createElement('div');
    this.odometer.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(6px, 1.5vw, 14px);
      padding: clamp(16px, 3vw, 28px) clamp(24px, 5vw, 48px);
      background: rgba(10, 12, 18, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 50px rgba(0,240,255,0.12);
      backdrop-filter: blur(20px);
    `;

    // Digit Reel Builder helper
    const makeReel = () => {
      const reelBox = document.createElement('div');
      reelBox.style.cssText = `
        height: clamp(68px, 14vw, 140px);
        width: clamp(48px, 9vw, 90px);
        overflow: hidden;
        position: relative;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        box-shadow: inset 0 10px 20px rgba(0,0,0,0.8), inset 0 -10px 20px rgba(0,0,0,0.8);
      `;
      const reelInner = document.createElement('div');
      reelInner.style.cssText = `
        display: flex;
        flex-direction: column;
        transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
      `;
      for (let i = 0; i <= 9; i++) {
        const d = document.createElement('div');
        d.style.cssText = `
          height: clamp(68px, 14vw, 140px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(52px, 11vw, 110px);
          font-weight: 900;
          line-height: 1;
          color: #ffffff;
          font-feature-settings: "tnum";
          font-variant-numeric: tabular-nums;
          text-shadow: 0 0 25px rgba(255,255,255,0.5);
        `;
        d.textContent = String(i);
        reelInner.appendChild(d);
      }
      reelBox.appendChild(reelInner);
      return { box: reelBox, inner: reelInner };
    };

    this.reel100 = makeReel();
    this.reel10 = makeReel();
    this.reel1 = makeReel();

    this.odometer.appendChild(this.reel100.box);
    this.odometer.appendChild(this.reel10.box);
    this.odometer.appendChild(this.reel1.box);

    // Suffix % in neon
    const pctSign = document.createElement('div');
    pctSign.style.cssText = `
      font-size: clamp(32px, 7vw, 64px);
      font-weight: 900;
      color: ${this.accentColor};
      text-shadow: 0 0 25px ${this.accentColor};
      margin-left: 6px;
      font-family: ui-monospace, monospace;
    `;
    pctSign.textContent = '%';
    this.odometer.appendChild(pctSign);

    this.stage.appendChild(this.odometer);

    // Liquid Progress Track below
    this.track = document.createElement('div');
    this.track.style.cssText = `
      width: clamp(240px, 45vw, 420px);
      height: 4px;
      background: rgba(255,255,255,0.08);
      border-radius: 999px;
      margin-top: 28px;
      overflow: hidden;
      position: relative;
      border: 1px solid rgba(255,255,255,0.05);
    `;
    this.fill = document.createElement('div');
    this.fill.style.cssText = `
      width: 0%;
      height: 100%;
      background: linear-gradient(90deg, ${this.accentColor}, #ffffff, ${this.secondaryColor});
      box-shadow: 0 0 16px ${this.accentColor};
      border-radius: 999px;
      transition: width 0.05s linear;
    `;
    this.track.appendChild(this.fill);
    this.stage.appendChild(this.track);
    this.root.appendChild(this.stage);

    // Footer
    this.footer = document.createElement('div');
    this.footer.style.cssText = `
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px solid rgba(255,255,255,0.08);
      padding-top: 20px;
    `;
    this.footer.innerHTML = `
      <div style="font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:2px;font-family:ui-monospace,monospace;line-height:1.7;">
        MOTION-ORGANIC // ODOMETER VAULT<br/>
        <span style="color:${this.accentColor};font-weight:700;">PURE MECHANICAL CHRONOMETER ARCHITECTURE</span>
      </div>
      <div style="font-family:ui-monospace,monospace;font-size:13px;color:${this.secondaryColor};letter-spacing:2px;font-weight:800;">
        [ T+ <span id="mo_odo_timer">0.000</span>s ]
      </div>
    `;
    this.root.appendChild(this.footer);

    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(520, 0.08);

    if (this.interactive) {
      this._onMove = (e) => {
        const nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        this.stage.style.transform = `rotateY(${nx * 15}deg) rotateX(${-ny * 15}deg) translateZ(30px)`;
      };
      this._onLeave = () => {
        this.stage.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
      };
      window.addEventListener('mousemove', this._onMove);
      window.addEventListener('mouseleave', this._onLeave);
    }

    this._startLoop();
  }

  _initAuroraCanvas() {
    const ctx = this.canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let width = (this.canvas.width = window.innerWidth * dpr);
    let height = (this.canvas.height = window.innerHeight * dpr);

    this._onResize = () => {
      width = this.canvas.width = window.innerWidth * dpr;
      height = this.canvas.height = window.innerHeight * dpr;
    };
    window.addEventListener('resize', this._onResize);

    let t = 0;
    const render = () => {
      if (this._isExited) return;
      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Multi-layer glowing plasma clouds
      const g1 = ctx.createRadialGradient(
        width * 0.3 + Math.sin(t) * 120, height * 0.4 + Math.cos(t * 0.8) * 80, 0,
        width * 0.3, height * 0.4, width * 0.6
      );
      g1.addColorStop(0, 'rgba(0, 240, 255, 0.22)');
      g1.addColorStop(1, 'transparent');

      const g2 = ctx.createRadialGradient(
        width * 0.7 + Math.cos(t * 1.1) * 100, height * 0.6 + Math.sin(t * 0.9) * 90, 0,
        width * 0.7, height * 0.6, width * 0.55
      );
      g2.addColorStop(0, 'rgba(255, 0, 119, 0.18)');
      g2.addColorStop(1, 'transparent');

      const g3 = ctx.createRadialGradient(
        width * 0.5, height * 0.5 + Math.sin(t * 1.3) * 60, 0,
        width * 0.5, height * 0.5, width * 0.7
      );
      g3.addColorStop(0, 'rgba(121, 40, 202, 0.18)');
      g3.addColorStop(1, 'transparent');

      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, width, height);

      this._animId = requestAnimationFrame(render);
    };
    this._animId = requestAnimationFrame(render);
  }

  _startLoop() {
    let currentPct = 0;
    const startTime = performance.now();
    const timerEl = this.root.querySelector('#mo_odo_timer');
    const stepMs = Math.max(10, Math.floor(this.duration / 100));

    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      this.setProgress(currentPct);

      if (timerEl) {
        const elapsed = ((performance.now() - startTime) / 1000).toFixed(3);
        timerEl.textContent = elapsed;
      }

      if (currentPct % 20 === 0 && this.sound) {
        safePlayPop(520 + currentPct * 3, 0.04);
      }

      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 220);
      }
    }, stepMs);
  }

  setProgress(pct) {
    const val = Math.min(100, Math.max(0, pct));
    const str = String(val).padStart(3, '0');
    const d100 = parseInt(str[0], 10);
    const d10 = parseInt(str[1], 10);
    const d1 = parseInt(str[2], 10);

    const unitH = this.reel1.box.clientHeight;
    if (this.reel100?.inner) this.reel100.inner.style.transform = `translateY(-${d100 * unitH}px)`;
    if (this.reel10?.inner) this.reel10.inner.style.transform = `translateY(-${d10 * unitH}px)`;
    if (this.reel1?.inner) this.reel1.inner.style.transform = `translateY(-${d1 * unitH}px)`;

    if (this.fill) this.fill.style.width = `${val}%`;
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.25);

    if (this._animId) cancelAnimationFrame(this._animId);
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    if (this._onMove) {
      window.removeEventListener('mousemove', this._onMove);
      window.removeEventListener('mouseleave', this._onLeave);
    }

    this.root.style.filter = 'brightness(2.5)';
    this.stage.style.transform = 'scale(1.8) translateZ(100px)';
    this.stage.style.opacity = '0';
    this.canvas.style.opacity = '0';
    this.root.style.opacity = '0';

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 650);
  }
}

// ─── 2. AwwwardsLiquidChromiumCounterScreen (Liquid Wave Rising Inside Monolithic Digits) ───
export class AwwwardsLiquidChromiumCounterScreen {
  constructor(options = {}) {
    this.brand = options.brand || 'CHROMIUM // HYDRODYNAMICS';
    this.accentColor = options.accentColor || '#00e5ff';
    this.secondaryColor = options.secondaryColor || '#7000ff';
    this.duration = options.duration || 3000;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-liquid-chromium-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: #040408;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif;
      color: #ffffff;
      overflow: hidden;
      transition: opacity 0.7s ease;
    `;

    const maskId = uid();
    const gradId = uid();

    this.card = document.createElement('div');
    this.card.style.cssText = `
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
    `;

    // SVG with Text Mask & Rising Fluid Wave
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('viewBox', '0 0 600 240');
    this.svg.style.cssText = `
      width: clamp(280px, 60vw, 560px);
      height: auto;
      overflow: visible;
      filter: drop-shadow(0 20px 40px rgba(0, 229, 255, 0.25));
    `;

    this.svg.innerHTML = `
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${this.accentColor}" />
          <stop offset="60%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="${this.secondaryColor}" />
        </linearGradient>
        <mask id="${maskId}">
          <text id="${maskId}_text" x="50%" y="65%" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-size="140" font-weight="900" font-family="system-ui, -apple-system, sans-serif" letter-spacing="-6">00%</text>
        </mask>
      </defs>
      <!-- Base text ghost -->
      <text id="${maskId}_ghost" x="50%" y="65%" text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" font-size="140" font-weight="900" font-family="system-ui, -apple-system, sans-serif" letter-spacing="-6">00%</text>
      <!-- Liquid wave fill masked by digits -->
      <g mask="url(#${maskId})">
        <path id="${maskId}_wave" fill="url(#${gradId})" d="M 0 240 L 600 240 L 600 240 Q 300 240 0 240 Z" />
      </g>
    `;

    this.card.appendChild(this.svg);

    // Micro telemetry label
    this.sub = document.createElement('div');
    this.sub.style.cssText = `
      margin-top: 24px;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: ${this.accentColor};
      background: rgba(0, 229, 255, 0.08);
      border: 1px solid rgba(0, 229, 255, 0.25);
      padding: 6px 18px;
      border-radius: 999px;
    `;
    this.sub.textContent = `[ ${this.brand} ]`;
    this.card.appendChild(this.sub);

    this.root.appendChild(this.card);
    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(480, 0.06);

    this._startLiquidLoop(maskId);
  }

  _startLiquidLoop(maskId) {
    let currentPct = 0;
    const textEl = document.getElementById(`${maskId}_text`);
    const ghostEl = document.getElementById(`${maskId}_ghost`);
    const waveEl = document.getElementById(`${maskId}_wave`);

    let wavePhase = 0;
    const stepMs = Math.max(10, Math.floor(this.duration / 100));

    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      const formatted = `${String(Math.min(100, currentPct)).padStart(2, '0')}%`;
      if (textEl) textEl.textContent = formatted;
      if (ghostEl) ghostEl.textContent = formatted;

      // Animate wave height from 240 (bottom) to 0 (top)
      wavePhase += 0.15;
      const targetY = 240 * (1 - currentPct / 100);
      const waveAmp = Math.sin(wavePhase) * 16;
      if (waveEl) {
        waveEl.setAttribute('d', `M 0 240 L 600 240 L 600 ${targetY} Q 300 ${targetY + waveAmp} 0 ${targetY} Z`);
      }

      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 220);
      }
    }, stepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.25);

    this.card.style.transform = 'scale(2.2)';
    this.card.style.opacity = '0';
    this.root.style.opacity = '0';

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 700);
  }
}

// ─── 3. AwwwardsSplitFlapChronometerScreen (3D Mechanical Split-Flap Counter) ─
export class AwwwardsSplitFlapChronometerScreen {
  constructor(options = {}) {
    this.brand = options.brand || 'CHRONO // SPLIT-FLAP';
    this.accentColor = options.accentColor || '#ffb800';
    this.duration = options.duration || 3000;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-split-flap-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: #08090c;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: ui-monospace, SFMono-Regular, monospace;
      color: #ffffff;
      overflow: hidden;
      perspective: 900px;
      transition: opacity 0.65s ease;
    `;

    this.card = document.createElement('div');
    this.card.style.cssText = `
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: rgba(14, 16, 22, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.9), 0 0 35px ${this.accentColor}33;
      transform-style: preserve-3d;
      transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
    `;

    this.counterEl = document.createElement('div');
    this.counterEl.style.cssText = `
      font-size: clamp(64px, 14vw, 130px);
      font-weight: 900;
      color: ${this.accentColor};
      letter-spacing: 4px;
      background: #000000;
      padding: 12px 32px;
      border-radius: 8px;
      border: 2px solid rgba(255, 255, 255, 0.15);
      box-shadow: inset 0 4px 12px rgba(0,0,0,0.9), 0 0 25px ${this.accentColor}44;
      line-height: 1;
    `;
    this.counterEl.textContent = '000';
    this.card.appendChild(this.counterEl);

    const lbl = document.createElement('div');
    lbl.style.cssText = `
      margin-top: 20px;
      font-size: 11px;
      letter-spacing: 4px;
      color: rgba(255,255,255,0.7);
      text-transform: uppercase;
    `;
    lbl.textContent = `[ ${this.brand} ]`;
    this.card.appendChild(lbl);

    this.root.appendChild(this.card);
    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(440, 0.08);

    this._startLoop();
  }

  _startLoop() {
    let currentPct = 0;
    const stepMs = Math.max(10, Math.floor(this.duration / 100));

    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      if (this.counterEl) this.counterEl.textContent = String(Math.min(100, currentPct)).padStart(3, '0');

      if (this.sound && currentPct % 15 === 0) {
        safePlayPop(600 + currentPct * 2, 0.04);
      }

      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 200);
      }
    }, stepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.24);

    this.card.style.transform = 'scale(1.8) rotateX(25deg)';
    this.card.style.opacity = '0';
    this.root.style.opacity = '0';

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 650);
  }
}

// Aliases for compatibility
export const AwwwardsCurvedCurtainScreen = AwwwardsKineticOdometerVaultScreen;
export const AwwwardsPrismGeodesicUnfoldScreen = AwwwardsLiquidChromiumCounterScreen;


// 1.1 AwwwardsDoubleLiquidWaveCurtainScreen (Dual Opposing Top & Bottom Liquid Bezier Waves)
export class AwwwardsDoubleLiquidWaveCurtainScreen {
  constructor(options = {}) {
    this.brand = options.brand || 'ATELIER // LIQUID HORIZON';
    this.words = options.words || ['RESONANCE', 'SYNERGY', 'ATMOSPHERE', 'FUTURE'];
    this.accentColor = options.accentColor || '#00e5ff';
    this.secondaryColor = options.secondaryColor || '#7928ca';
    this.bgColor = options.bgColor || '#06060a';
    this.duration = options.duration || 3000;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-double-curtain-root';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      pointer-events: all;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif;
    `;

    // Dual SVG: Top curtain + Bottom curtain
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('viewBox', '0 0 1000 1000');
    this.svg.setAttribute('preserveAspectRatio', 'none');
    this.svg.style.cssText = `position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;`;

    this.topPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.topPath.setAttribute('fill', this.bgColor);
    this.topPath.setAttribute('d', 'M 0 0 L 1000 0 L 1000 500 Q 500 500 0 500 Z');

    this.bottomPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.bottomPath.setAttribute('fill', this.bgColor);
    this.bottomPath.setAttribute('d', 'M 0 1000 L 1000 1000 L 1000 500 Q 500 500 0 500 Z');

    this.svg.appendChild(this.topPath);
    this.svg.appendChild(this.bottomPath);
    this.root.appendChild(this.svg);

    // Center Content
    this.content = document.createElement('div');
    this.content.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      transition: opacity 0.4s ease, transform 0.4s ease;
      text-align: center;
    `;

    this.wordEl = document.createElement('div');
    this.wordEl.style.cssText = `
      font-size: clamp(40px, 9vw, 98px);
      font-weight: 900;
      letter-spacing: -2px;
      text-transform: uppercase;
      background: linear-gradient(135deg, #ffffff 40%, ${this.accentColor} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      transition: transform 0.3s ease, opacity 0.3s ease;
    `;
    this.wordEl.textContent = this.words[0];

    this.counterEl = document.createElement('div');
    this.counterEl.style.cssText = `
      font-family: ui-monospace, monospace;
      font-size: clamp(24px, 5vw, 42px);
      font-weight: 800;
      color: ${this.accentColor};
      margin-top: 18px;
      letter-spacing: -1px;
    `;
    this.counterEl.textContent = '00%';

    this.content.appendChild(this.wordEl);
    this.content.appendChild(this.counterEl);
    this.root.appendChild(this.content);

    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(500, 0.06);

    this._startLoop();
  }

  _startLoop() {
    let currentPct = 0;
    const words = this.words;
    let wordIdx = 0;

    const stepMs = Math.max(10, Math.floor(this.duration / 100));
    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      if (this.counterEl) this.counterEl.textContent = `${String(Math.min(100, currentPct)).padStart(2, '0')}%`;

      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 200);
      }
    }, stepMs);

    const wordStepMs = Math.floor(this.duration / words.length);
    const wordTimer = setInterval(() => {
      if (this._isExited || currentPct >= 95) {
        clearInterval(wordTimer);
        return;
      }
      wordIdx = (wordIdx + 1) % words.length;
      if (this.wordEl) {
        this.wordEl.style.opacity = '0';
        this.wordEl.style.transform = 'scale(0.9)';
        setTimeout(() => {
          if (this.wordEl && !this._isExited) {
            this.wordEl.textContent = words[wordIdx];
            this.wordEl.style.opacity = '1';
            this.wordEl.style.transform = 'scale(1)';
          }
        }, 120);
      }
    }, wordStepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.25);

    this.content.style.opacity = '0';
    this.content.style.transform = 'scale(1.15)';

    let startTime = null;
    const duration = 850;

    const animate = (now) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - p, 4);

      // Top wave pulls up from 500 to 0 with concave curve
      const topY = 500 * (1 - ease);
      const topApex = topY - Math.sin(p * Math.PI) * 220;

      // Bottom wave pulls down from 500 to 1000 with convex curve
      const bottomY = 500 + 500 * ease;
      const bottomApex = bottomY + Math.sin(p * Math.PI) * 220;

      this.topPath.setAttribute('d', `M 0 0 L 1000 0 L 1000 ${topY} Q 500 ${topApex} 0 ${topY} Z`);
      this.bottomPath.setAttribute('d', `M 0 1000 L 1000 1000 L 1000 ${bottomY} Q 500 ${bottomApex} 0 ${bottomY} Z`);

      if (p < 1) {
        requestAnimationFrame(animate);
      } else {
        if (this._unlockScroll) this._unlockScroll();
        if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
        if (this.onComplete) this.onComplete();
      }
    };
    requestAnimationFrame(animate);
  }
}

// 1.2 AwwwardsIridescentLiquidMeshCurtainScreen (3-Tier Cascading Prismatic Liquid Waves)
export class AwwwardsIridescentLiquidMeshCurtainScreen {
  constructor(options = {}) {
    this.brand = options.brand || 'PRISMATIC FLUID DYNAMICS';
    this.words = options.words || ['SPECTRUM', 'LUMINESCENCE', 'DIFFRACTION', 'ELEGANCE'];
    this.tier1Color = options.tier1Color || '#ff0055';
    this.tier2Color = options.tier2Color || '#7928ca';
    this.tier3Color = options.tier3Color || '#08080d';
    this.duration = options.duration || 3200;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-iridescent-curtain-root';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      pointer-events: all;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif;
    `;

    // 3 Layered SVG Paths
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('viewBox', '0 0 1000 1000');
    this.svg.setAttribute('preserveAspectRatio', 'none');
    this.svg.style.cssText = `position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;`;

    this.p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.p1.setAttribute('fill', this.tier1Color);
    this.p1.setAttribute('d', 'M 0 0 L 1000 0 L 1000 1000 Q 500 1000 0 1000 Z');

    this.p2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.p2.setAttribute('fill', this.tier2Color);
    this.p2.setAttribute('d', 'M 0 0 L 1000 0 L 1000 1000 Q 500 1000 0 1000 Z');

    this.p3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.p3.setAttribute('fill', this.tier3Color);
    this.p3.setAttribute('d', 'M 0 0 L 1000 0 L 1000 1000 Q 500 1000 0 1000 Z');

    this.svg.appendChild(this.p1);
    this.svg.appendChild(this.p2);
    this.svg.appendChild(this.p3);
    this.root.appendChild(this.svg);

    // Center Stage
    this.content = document.createElement('div');
    this.content.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: clamp(28px, 6vw, 64px);
      color: #ffffff;
      transition: opacity 0.4s ease, transform 0.4s ease;
    `;

    this.content.innerHTML = `
      <div style="font-size:12px;letter-spacing:3px;font-weight:800;color:#00e5ff;text-transform:uppercase;">${this.brand}</div>
      <div style="text-align:center;">
        <div id="mo_iri_word" style="font-size:clamp(44px, 10vw, 110px);font-weight:900;letter-spacing:-3px;text-transform:uppercase;line-height:1;background:linear-gradient(135deg,#ffffff,#00e5ff,#ff0055);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${this.words[0]}</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;">
        <div style="font-size:11px;font-family:ui-monospace,monospace;color:rgba(255,255,255,0.5);letter-spacing:2px;">3-TIER PRISMATIC MESH CURTAIN</div>
        <div id="mo_iri_counter" style="font-size:clamp(54px, 12vw, 130px);font-weight:900;letter-spacing:-4px;line-height:0.8;">00</div>
      </div>
    `;

    this.root.appendChild(this.content);
    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(520, 0.06);

    this._startLoop();
  }

  _startLoop() {
    let currentPct = 0;
    const words = this.words;
    let wordIdx = 0;
    const counterEl = this.root.querySelector('#mo_iri_counter');
    const wordEl = this.root.querySelector('#mo_iri_word');

    const stepMs = Math.max(10, Math.floor(this.duration / 100));
    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      if (counterEl) counterEl.textContent = String(Math.min(100, currentPct)).padStart(2, '0');

      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 220);
      }
    }, stepMs);

    const wordStepMs = Math.floor(this.duration / words.length);
    const wordTimer = setInterval(() => {
      if (this._isExited || currentPct >= 95) {
        clearInterval(wordTimer);
        return;
      }
      wordIdx = (wordIdx + 1) % words.length;
      if (wordEl) {
        wordEl.style.opacity = '0';
        wordEl.style.transform = 'translateY(16px)';
        setTimeout(() => {
          if (wordEl && !this._isExited) {
            wordEl.textContent = words[wordIdx];
            wordEl.style.opacity = '1';
            wordEl.style.transform = 'translateY(0)';
          }
        }, 120);
      }
    }, wordStepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.28);

    this.content.style.opacity = '0';
    this.content.style.transform = 'translateY(-30px)';

    let startTime = null;
    const totalDuration = 1000;

    const animate = (now) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;

      // 3 waves staggered by 100ms
      const p3 = Math.min(1, Math.max(0, elapsed / 750));
      const p2 = Math.min(1, Math.max(0, (elapsed - 80) / 750));
      const p1 = Math.min(1, Math.max(0, (elapsed - 160) / 750));

      const ease3 = 1 - Math.pow(1 - p3, 4);
      const ease2 = 1 - Math.pow(1 - p2, 4);
      const ease1 = 1 - Math.pow(1 - p1, 4);

      const y3 = 1000 * (1 - ease3);
      const y2 = 1000 * (1 - ease2);
      const y1 = 1000 * (1 - ease1);

      this.p3.setAttribute('d', `M 0 0 L 1000 0 L 1000 ${y3} Q 500 ${y3 - Math.sin(p3 * Math.PI) * 320} 0 ${y3} Z`);
      this.p2.setAttribute('d', `M 0 0 L 1000 0 L 1000 ${y2} Q 500 ${y2 - Math.sin(p2 * Math.PI) * 320} 0 ${y2} Z`);
      this.p1.setAttribute('d', `M 0 0 L 1000 0 L 1000 ${y1} Q 500 ${y1 - Math.sin(p1 * Math.PI) * 320} 0 ${y1} Z`);

      if (p1 < 1) {
        requestAnimationFrame(animate);
      } else {
        if (this._unlockScroll) this._unlockScroll();
        if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
        if (this.onComplete) this.onComplete();
      }
    };
    requestAnimationFrame(animate);
  }
}


// 2. LiquidWaveTextScreen (Real-Time Fluid Dynamic Wave Canvas Preloader)
export class LiquidWaveTextScreen {
  constructor(options = {}) {
    this.text = options.text || 'ORGANIC';
    this.subtext = options.subtext || 'CALIBRATING HYDRODYNAMICS';
    this.color = options.waveColor || options.color || '#00e5ff';
    this.accentColor = options.accentColor || '#ff0077';
    this.bgColor = options.bgColor || '#050508';
    this.duration = options.duration || 3000;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this.progress = 0;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-liquid-wave-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: ${this.bgColor};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", Roboto, sans-serif;
      transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
      overflow: hidden;
      padding: 32px;
      box-sizing: border-box;
    `;

    // Title badge
    this.badge = document.createElement('div');
    this.badge.style.cssText = `
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: ${this.color};
      margin-bottom: 28px;
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    this.badge.innerHTML = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${this.color};box-shadow:0 0 10px ${this.color};"></span> ${this.subtext}`;
    this.root.appendChild(this.badge);

    // Canvas container (retina-ready)
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1200;
    this.canvas.height = 420;
    this.canvas.style.cssText = 'width:min(1000px, 92vw);height:auto;display:block;';
    this.ctx = this.canvas.getContext('2d');
    this.root.appendChild(this.canvas);

    // Percent counter
    this.percentEl = document.createElement('div');
    this.percentEl.style.cssText = `
      font-family: ui-monospace, monospace;
      font-size: 28px;
      font-weight: 900;
      color: #ffffff;
      margin-top: 24px;
      letter-spacing: 2px;
    `;
    this.percentEl.textContent = '00%';
    this.root.appendChild(this.percentEl);

    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(480, 0.06);

    this._startLoop();
  }

  _startLoop() {
    let waveStep = 0;
    let currentPct = 0;
    const bubbles = [];
    for (let i = 0; i < 28; i++) {
      bubbles.push({
        x: Math.random() * 1200,
        y: Math.random() * 420,
        size: 1.5 + Math.random() * 3.5,
        speed: 1.2 + Math.random() * 2.2,
        alpha: 0.3 + Math.random() * 0.5,
      });
    }

    const stepMs = Math.max(10, Math.floor(this.duration / 100));
    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      this.progress = currentPct;
      if (this.percentEl) this.percentEl.textContent = `${String(currentPct).padStart(2, '0')}%`;
      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 220);
      }
    }, stepMs);

    const render = () => {
      if (this._isExited) return;
      waveStep += 0.065;

      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      ctx.clearRect(0, 0, w, h);

      // 1. Draw base ghost text outline
      ctx.font = '900 150px -apple-system, "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillText(this.text, w / 2, h / 2);

      // 2. Compute dynamic wave height
      const waveY = h - (currentPct / 100) * (h * 0.95);

      // 3. Draw liquid wave clip region
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, waveY);

      for (let x = 0; x <= w; x += 10) {
        const y = waveY + Math.sin(x * 0.015 + waveStep) * 14 + Math.cos(x * 0.008 - waveStep * 0.8) * 8;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.clip();

      // Liquid Gradient Fill
      const grad = ctx.createLinearGradient(0, waveY, 0, h);
      grad.addColorStop(0, this.color);
      grad.addColorStop(0.5, '#7c6aff');
      grad.addColorStop(1, this.accentColor);
      ctx.fillStyle = grad;
      ctx.fillText(this.text, w / 2, h / 2);

      // Draw floating bubbles
      bubbles.forEach(b => {
        b.y -= b.speed;
        if (b.y < waveY) b.y = h;
        ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      // Wave Surface Foam Crest Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 10) {
        const y = waveY + Math.sin(x * 0.015 + waveStep) * 14 + Math.cos(x * 0.008 - waveStep * 0.8) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (currentPct < 100) {
        requestAnimationFrame(render);
      }
    };
    requestAnimationFrame(render);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.18);

    this.root.style.opacity = '0';
    this.root.style.transform = 'scale(1.08) translateY(-25px)';
    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 650);
  }
}

// 3. ParticleSupernovaLoader (Real-Time 3D Interactive Canvas Vortex)
export class ParticleSupernovaLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 140;
    this.color = options.color || '#00e5ff';
    this.accent = options.accent || '#ff0077';
    this.particleCount = options.particleCount || 140;
    this._running = true;
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.size * 2;
    this.canvas.height = this.size * 2;
    this.canvas.style.cssText = `width:${this.size}px;height:${this.size}px;border-radius:50%;`;
    this.ctx = this.canvas.getContext('2d');
    this.el.appendChild(this.canvas);

    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 20 + Math.random() * 50,
        speed: 0.02 + Math.random() * 0.04,
        size: 1 + Math.random() * 2.2,
        hue: Math.random() > 0.5 ? this.color : this.accent,
      });
    }

    this._render = this._render.bind(this);
    requestAnimationFrame(this._render);
  }

  _render() {
    if (!this._running || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = 'rgba(7, 7, 11, 0.22)';
    ctx.fillRect(0, 0, w, h);

    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32);
    coreGrad.addColorStop(0, this.color);
    coreGrad.addColorStop(0.5, 'rgba(124, 106, 255, 0.3)');
    coreGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fill();

    this.particles.forEach((p) => {
      p.angle += p.speed;
      const x = cx + Math.cos(p.angle) * p.radius;
      const y = cy + Math.sin(p.angle) * (p.radius * 0.55);

      ctx.fillStyle = p.hue;
      ctx.shadowColor = p.hue;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(this._render);
  }

  destroy() {
    this._running = false;
    if (this.canvas?.parentNode) this.canvas.parentNode.removeChild(this.canvas);
  }
}

// 4. HypercubeTesseractLoader (4D Wireframe Canvas Geometry)
export class HypercubeTesseractLoader {
  constructor(element, options = {}) {
    this.el = element;
    this.size = options.size || 90;
    this.color = options.color || '#00e5ff';
    this._running = true;
    this._init();
  }

  _init() {
    if (typeof document === 'undefined' || !this.el) return;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.size * 2;
    this.canvas.height = this.size * 2;
    this.canvas.style.cssText = `width:${this.size}px;height:${this.size}px;`;
    this.ctx = this.canvas.getContext('2d');
    this.el.appendChild(this.canvas);

    this.angle = 0;
    this._render = this._render.bind(this);
    requestAnimationFrame(this._render);
  }

  _render() {
    if (!this._running || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);
    this.angle += 0.025;

    const r1 = 50;
    const r2 = 25;
    const cos = Math.cos(this.angle);
    const sin = Math.sin(this.angle);

    const pts1 = [
      { x: cx + cos * r1 - sin * r1, y: cy + (sin * r1 + cos * r1) * 0.5 },
      { x: cx - cos * r1 - sin * r1, y: cy + (-sin * r1 + cos * r1) * 0.5 },
      { x: cx - cos * r1 + sin * r1, y: cy + (-sin * r1 - cos * r1) * 0.5 },
      { x: cx + cos * r1 + sin * r1, y: cy + (sin * r1 - cos * r1) * 0.5 },
    ];

    const pts2 = [
      { x: cx + cos * r2 - sin * r2, y: cy + (sin * r2 + cos * r2) * 0.5 - 18 },
      { x: cx - cos * r2 - sin * r2, y: cy + (-sin * r2 + cos * r2) * 0.5 - 18 },
      { x: cx - cos * r2 + sin * r2, y: cy + (-sin * r2 - cos * r2) * 0.5 - 18 },
      { x: cx + cos * r2 + sin * r2, y: cy + (sin * r2 - cos * r2) * 0.5 - 18 },
    ];

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;

    ctx.beginPath();
    pts1.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = '#ff0077';
    ctx.beginPath();
    pts2.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(pts1[i].x, pts1[i].y);
      ctx.lineTo(pts2[i].x, pts2[i].y);
      ctx.stroke();
    }

    requestAnimationFrame(this._render);
  }

  destroy() {
    this._running = false;
    if (this.canvas?.parentNode) this.canvas.parentNode.removeChild(this.canvas);
  }
}

// 5. ArchitecturalVenetianScreen (Staggered Glass Slat Blinds Shutter with HUD Matrix)
export class ArchitecturalVenetianScreen {
  constructor(options = {}) {
    this.slatCount = options.slatCount || 8;
    this.accentColor = options.accentColor || '#00e5ff';
    this.bgColor = options.bgColor || '#09090e';
    this.duration = options.duration || 2600;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-venetian-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      display: flex;
      pointer-events: all;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", Roboto, sans-serif;
    `;

    this.slats = [];
    for (let i = 0; i < this.slatCount; i++) {
      const slat = document.createElement('div');
      slat.style.cssText = `
        flex: 1;
        height: 100%;
        background: ${this.bgColor};
        border-right: 1px solid rgba(255, 255, 255, 0.06);
        transform: translateY(0%);
        transition: transform 0.85s cubic-bezier(0.77, 0, 0.175, 1);
        will-change: transform;
        position: relative;
        overflow: hidden;
      `;
      
      // Add subtle scanline highlight per slat
      const shimmer = document.createElement('div');
      shimmer.style.cssText = `
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, transparent, rgba(0, 229, 255, 0.05), transparent);
        transform: translateY(-100%);
        animation: moScanlineSlat 2s infinite ease-in-out;
        animation-delay: ${i * 0.15}s;
      `;
      slat.appendChild(shimmer);

      this.root.appendChild(slat);
      this.slats.push(slat);
    }

    // Center Tactical HUD Matrix
    this.hud = document.createElement('div');
    this.hud.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.3s ease;
    `;

    this.hud.innerHTML = `
      <div style="width:72px;height:72px;position:relative;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;inset:0;border:2px dashed ${this.accentColor};border-radius:50%;animation:moSpinCw 6s linear infinite;opacity:0.6;"></div>
        <div style="position:absolute;inset:8px;border:2px solid rgba(255,255,255,0.2);border-top-color:${this.accentColor};border-radius:50%;animation:moSpinCcw 2s linear infinite;"></div>
        <div style="width:10px;height:10px;background:${this.accentColor};border-radius:50%;box-shadow:0 0 16px ${this.accentColor};"></div>
      </div>
      <div style="font-size:13px;font-weight:800;letter-spacing:4px;color:#ffffff;text-transform:uppercase;">
        INITIALIZING ARCHITECTURE
      </div>
      <div id="moVenetianPct" style="font-family:ui-monospace,monospace;font-size:14px;color:${this.accentColor};font-weight:700;">
        [ 00% ]
      </div>
    `;
    this.root.appendChild(this.hud);

    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(500, 0.06);

    const pctEl = this.hud.querySelector('#moVenetianPct');
    let currentPct = 0;
    const stepMs = Math.max(10, Math.floor(this.duration / 100));

    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      if (pctEl) {
        pctEl.textContent = `[ ${String(Math.min(100, currentPct)).padStart(2, '0')}% ]`;
      }
      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 200);
      }
    }, stepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.18);

    if (this.hud) {
      this.hud.style.opacity = '0';
      this.hud.style.transform = 'translate(-50%, -50%) scale(0.9)';
    }

    this.slats.forEach((slat, i) => {
      setTimeout(() => {
        slat.style.transform = i % 2 === 0 ? 'translateY(-101%)' : 'translateY(101%)';
      }, i * 65);
    });

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, this.slatCount * 65 + 900);
  }
}

// 6. CyberpunkBiometricHoloScreen (Tactical Neural HUD & Decrypting Typo Matrix)
export class CyberpunkBiometricHoloScreen {
  constructor(options = {}) {
    this.title = options.brand || options.title || 'CYBER ARCHITECTURE';
    this.targetWord = options.word || 'NEXUS';
    this.accentColor = options.accentColor || '#00ff88';
    this.secondaryColor = options.secondaryColor || '#00e5ff';
    this.bgColor = options.bgColor || '#040608';
    this.duration = options.duration || 2800;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-cyberpunk-holo-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: ${this.bgColor};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      color: #ffffff;
      overflow: hidden;
      transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    // Cyber grid backdrop
    this.grid = document.createElement('div');
    this.grid.style.cssText = `
      position: absolute;
      inset: -50%;
      background-image: 
        linear-gradient(rgba(0, 255, 136, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 136, 0.05) 1px, transparent 1px);
      background-size: 40px 40px;
      transform: perspective(600px) rotateX(60deg) translateY(200px);
      animation: moCyberGridDrift 10s linear infinite;
      pointer-events: none;
      opacity: 0.7;
    `;
    this.root.appendChild(this.grid);

    // Center Tactical Biometric Scanner
    this.scanner = document.createElement('div');
    this.scanner.style.cssText = `
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      z-index: 2;
    `;

    this.scanner.innerHTML = `
      <div style="width:140px;height:140px;position:relative;display:flex;align-items:center;justify-content:center;">
        <svg viewBox="0 0 100 100" style="position:absolute;inset:0;width:100%;height:100%;animation:moSpinCw 12s linear infinite;">
          <circle cx="50" cy="50" r="46" fill="none" stroke="${this.accentColor}" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.6"/>
          <circle cx="50" cy="50" r="40" fill="none" stroke="${this.secondaryColor}" stroke-width="1" stroke-dasharray="14 10" opacity="0.8"/>
        </svg>
        <div style="position:absolute;inset:16px;border:1.5px solid rgba(255,255,255,0.2);border-radius:50%;border-top-color:${this.accentColor};border-bottom-color:${this.secondaryColor};animation:moSpinCcw 3s linear infinite;"></div>
        <div style="width:40px;height:40px;border-radius:50%;background:radial-gradient(circle, ${this.accentColor} 0%, transparent 80%);box-shadow:0 0 24px ${this.accentColor};animation:moPulseGlow 1.5s infinite;"></div>
        <div style="position:absolute;width:100%;height:2px;background:linear-gradient(90deg, transparent, ${this.accentColor}, transparent);box-shadow:0 0 10px ${this.accentColor};animation:moScanlineSlat 1.8s infinite ease-in-out;"></div>
      </div>

      <div style="text-align:center;">
        <div style="font-size:11px;letter-spacing:3px;color:${this.accentColor};text-transform:uppercase;margin-bottom:6px;">
          BIOMETRIC SYSTEM LINK
        </div>
        <div id="moHoloDecryptedWord" style="font-size:clamp(32px, 6vw, 64px);font-weight:900;letter-spacing:4px;color:#ffffff;text-shadow:0 0 20px ${this.accentColor};">
          0x_INIT
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(0,255,136,0.25);padding:8px 18px;border-radius:999px;">
        <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${this.accentColor};box-shadow:0 0 8px ${this.accentColor};"></span>
        <span id="moHoloPct" style="font-size:13px;font-weight:700;color:${this.accentColor};letter-spacing:2px;">DECRYPTING 00%</span>
      </div>
    `;
    this.root.appendChild(this.scanner);

    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(600, 0.06);

    this._startLoop();
  }

  _startLoop() {
    let currentPct = 0;
    const glyphs = 'ABCDEF0123456789!<>-_\\/[]{}—=+*^?#________';
    const wordEl = this.scanner.querySelector('#moHoloDecryptedWord');
    const pctEl = this.scanner.querySelector('#moHoloPct');
    const target = this.targetWord;

    const stepMs = Math.max(10, Math.floor(this.duration / 100));
    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;

      if (pctEl) {
        pctEl.textContent = `DECRYPTING ${String(Math.min(100, currentPct)).padStart(2, '0')}%`;
      }

      // Matrix character scramble
      if (wordEl) {
        const solvedCount = Math.floor((currentPct / 100) * target.length);
        let scrambled = '';
        for (let i = 0; i < target.length; i++) {
          if (i < solvedCount) {
            scrambled += target[i];
          } else {
            scrambled += glyphs[Math.floor(Math.random() * glyphs.length)];
          }
        }
        wordEl.textContent = scrambled;
      }

      if (currentPct >= 100) {
        clearInterval(countTimer);
        if (wordEl) wordEl.textContent = target;
        if (pctEl) pctEl.textContent = 'ACCESS GRANTED [ 100% ]';
        setTimeout(() => this.exit(), 240);
      }
    }, stepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.22);

    this.root.style.opacity = '0';
    this.root.style.transform = 'scale(1.1) translateY(-20px)';
    this.root.style.filter = 'blur(10px)';

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 600);
  }
}

// 7. AwwwardsFilmRollNegativeScreen (35mm Analog Film Negative Sprocket & Shutter Burn)
export class AwwwardsFilmRollNegativeScreen {
  constructor(options = {}) {
    this.brand = options.brand || '35MM // ARCHIVE';
    this.subtitle = options.subtitle || 'ANALOG OPTICAL REEL • FRAME 024';
    this.accentColor = options.accentColor || '#ff4500';
    this.duration = options.duration || 3000;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-film-negative-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: #08080a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Cinzel", Georgia, serif;
      color: #ffffff;
      overflow: hidden;
      transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.8s ease, filter 0.8s ease;
    `;

    // Left Sprocket Strip
    this.leftStrip = document.createElement('div');
    this.leftStrip.style.cssText = `
      position: absolute;
      top: -100px;
      bottom: -100px;
      left: 18px;
      width: 32px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      animation: moFilmSprocketScroll 0.8s linear infinite;
      pointer-events: none;
      opacity: 0.6;
    `;
    for (let i = 0; i < 30; i++) {
      const hole = document.createElement('div');
      hole.style.cssText = 'width:28px;height:18px;border-radius:4px;border:1.5px solid rgba(255,255,255,0.25);background:#000000;';
      this.leftStrip.appendChild(hole);
    }
    this.root.appendChild(this.leftStrip);

    // Right Sprocket Strip
    this.rightStrip = this.leftStrip.cloneNode(true);
    this.rightStrip.style.left = 'auto';
    this.rightStrip.style.right = '18px';
    this.root.appendChild(this.rightStrip);

    // Real-time Optical Lens Light Leak Flare
    this.lightLeak = document.createElement('div');
    this.lightLeak.style.cssText = `
      position: absolute;
      top: -20%;
      right: -20%;
      width: 70vw;
      height: 70vw;
      background: radial-gradient(circle, rgba(255, 69, 0, 0.45) 0%, rgba(255, 0, 128, 0.25) 40%, transparent 70%);
      pointer-events: none;
      animation: moFilmLightLeak 4s infinite ease-in-out;
      mix-blend-mode: screen;
    `;
    this.root.appendChild(this.lightLeak);

    // Center Film Frame Container
    this.frame = document.createElement('div');
    this.frame.style.cssText = `
      width: min(720px, 80vw);
      padding: 48px 36px;
      border: 1px dashed rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.02);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 20px;
      backdrop-filter: blur(8px);
      position: relative;
      z-index: 2;
    `;

    this.frame.innerHTML = `
      <div style="font-family:ui-monospace, monospace;font-size:11px;font-weight:700;letter-spacing:4px;color:${this.accentColor};text-transform:uppercase;">
        ${this.subtitle}
      </div>
      <div style="font-size:clamp(36px, 7vw, 68px);font-weight:900;letter-spacing:-1px;text-transform:uppercase;color:#ffffff;line-height:1;">
        ${this.brand}
      </div>
      <div style="display:flex;align-items:center;gap:18px;margin-top:10px;">
        <div id="moFilmTc" style="font-family:ui-monospace, monospace;font-size:16px;color:#94a3b8;letter-spacing:2px;">
          TC 00:00:00:00
        </div>
        <div style="width:6px;height:6px;border-radius:50%;background:${this.accentColor};box-shadow:0 0 8px ${this.accentColor};"></div>
        <div id="moFilmPct" style="font-family:ui-monospace, monospace;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-1px;">
          00%
        </div>
      </div>
    `;
    this.root.appendChild(this.frame);

    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(440, 0.06);

    this._startLoop();
  }

  _startLoop() {
    let currentPct = 0;
    const pctEl = this.frame.querySelector('#moFilmPct');
    const tcEl = this.frame.querySelector('#moFilmTc');
    const stepMs = Math.max(10, Math.floor(this.duration / 100));

    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      if (pctEl) pctEl.textContent = `${String(Math.min(100, currentPct)).padStart(2, '0')}%`;
      if (tcEl) {
        const frames = String(Math.floor((currentPct / 100) * 24)).padStart(2, '0');
        tcEl.textContent = `TC 00:00:01:${frames}`;
      }

      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 180);
      }
    }, stepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.25);

    // Overexposure Whiteout Flash + Vertical Negative Slide
    this.root.style.filter = 'brightness(2.5) contrast(1.4)';
    this.root.style.transform = 'translateY(-100%)';

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 800);
  }
}

// 8. AwwwardsTypographyStencilPortalScreen (Brutalist Stencil 50x Camera Dive Portal)
export class AwwwardsTypographyStencilPortalScreen {
  constructor(options = {}) {
    this.brand = options.brand || 'DIVE // 2026';
    this.subtitle = options.subtitle || 'IMMERSIVE SPATIAL STENCIL PORTAL';
    this.accentColor = options.accentColor || '#00e5ff';
    this.duration = options.duration || 3000;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-stencil-portal-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: #050507;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", Roboto, sans-serif;
      color: #ffffff;
      overflow: hidden;
      transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease;
    `;

    // Concentric 3D Tunnel in Center
    this.tunnel = document.createElement('div');
    this.tunnel.style.cssText = `
      position: absolute;
      width: clamp(260px, 45vw, 420px);
      height: clamp(260px, 45vw, 420px);
      border-radius: 50%;
      border: 1px solid rgba(0, 229, 255, 0.2);
      box-shadow: 0 0 60px rgba(0, 229, 255, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: moStencilTunnelZoom 4s infinite linear;
      z-index: 1;
    `;
    this.tunnel.innerHTML = `
      <div style="position:absolute;inset:20px;border-radius:50%;border:1px dashed rgba(255,0,119,0.3);"></div>
      <div style="position:absolute;inset:45px;border-radius:50%;border:2px solid rgba(0,229,255,0.4);"></div>
      <div style="position:absolute;inset:75px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);"></div>
    `;
    this.root.appendChild(this.tunnel);

    // Stencil Foreground Container
    this.foreground = document.createElement('div');
    this.foreground.style.cssText = `
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 16px;
      pointer-events: none;
    `;

    this.foreground.innerHTML = `
      <div style="font-family:ui-monospace, monospace;font-size:12px;font-weight:700;letter-spacing:4px;color:${this.accentColor};text-transform:uppercase;">
        ${this.subtitle}
      </div>
      <div style="font-size:clamp(48px, 10vw, 110px);font-weight:900;letter-spacing:-3px;text-transform:uppercase;color:#ffffff;line-height:0.9;">
        ${this.brand}
      </div>
      <div id="moStencilPct" style="font-family:ui-monospace, monospace;font-size:36px;font-weight:900;color:${this.accentColor};text-shadow:0 0 20px ${this.accentColor};margin-top:12px;">
        00%
      </div>
    `;
    this.root.appendChild(this.foreground);

    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(560, 0.06);

    this._startLoop();
  }

  _startLoop() {
    let currentPct = 0;
    const pctEl = this.foreground.querySelector('#moStencilPct');
    const stepMs = Math.max(10, Math.floor(this.duration / 100));

    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      if (pctEl) pctEl.textContent = `${String(Math.min(100, currentPct)).padStart(2, '0')}%`;

      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 200);
      }
    }, stepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.28);

    // 50x Scale Camera Punch Dive Through Typography Stencil
    this.root.style.transform = 'scale(45)';
    this.root.style.opacity = '0';

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 850);
  }
}

// 9. AwwwardsMetaballBioFusionScreen (Organic Liquid Cellular Goo & Physics Coalescence)
export class AwwwardsMetaballBioFusionScreen {
  constructor(options = {}) {
    this.brand = options.brand || 'BIO // FUSION';
    this.accentColor = options.accentColor || '#00ff88';
    this.duration = options.duration || 3000;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-bio-fusion-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: #040906;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", Roboto, sans-serif;
      color: #ffffff;
      overflow: hidden;
      transition: opacity 0.75s ease;
    `;

    // SVG Gooey Filter
    const svgGoo = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgGoo.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none;';
    svgGoo.innerHTML = `
      <defs>
        <filter id="moBioFusionFilter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 32 -12" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    `;
    this.root.appendChild(svgGoo);

    // Metaball Goo Container
    this.gooContainer = document.createElement('div');
    this.gooContainer.style.cssText = `
      position: relative;
      width: 320px;
      height: 320px;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: url(#moBioFusionFilter);
      transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    // Central core blob
    this.coreBlob = document.createElement('div');
    this.coreBlob.style.cssText = `
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${this.accentColor}, #00e5ff);
      box-shadow: 0 0 40px ${this.accentColor};
      animation: moMetaballHarmonic 3s infinite ease-in-out;
    `;
    this.gooContainer.appendChild(this.coreBlob);

    // 6 Orbiting Satellite Metaballs
    this.satellites = [];
    for (let i = 0; i < 6; i++) {
      const sat = document.createElement('div');
      sat.style.cssText = `
        position: absolute;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: ${this.accentColor};
        animation: moBioMetaballOrbit ${2.5 + i * 0.4}s infinite ease-in-out;
        animation-delay: -${i * 0.6}s;
      `;
      this.gooContainer.appendChild(sat);
      this.satellites.push(sat);
    }
    this.root.appendChild(this.gooContainer);

    // Crisp Percentage Overlay
    this.label = document.createElement('div');
    this.label.style.cssText = `
      position: absolute;
      text-align: center;
      z-index: 10;
      pointer-events: none;
    `;
    this.label.innerHTML = `
      <div id="moBioPct" style="font-family:ui-monospace, monospace;font-size:36px;font-weight:900;color:#000000;letter-spacing:-1px;">
        00%
      </div>
      <div style="font-family:ui-monospace, monospace;font-size:12px;font-weight:800;letter-spacing:3px;color:#ffffff;text-transform:uppercase;margin-top:60px;">
        ${this.brand}
      </div>
    `;
    this.root.appendChild(this.label);

    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(500, 0.06);

    this._startLoop();
  }

  _startLoop() {
    let currentPct = 0;
    const pctEl = this.label.querySelector('#moBioPct');
    const stepMs = Math.max(10, Math.floor(this.duration / 100));

    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      if (pctEl) pctEl.textContent = `${String(Math.min(100, currentPct)).padStart(2, '0')}%`;

      // Gravity coalescence: pull satellites into core as % approaches 100
      const pullFactor = 1 - (currentPct / 100);
      this.satellites.forEach((sat, i) => {
        sat.style.transform = `scale(${Math.max(0.2, pullFactor)})`;
      });

      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 200);
      }
    }, stepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.26);

    // Fused Bio-Blob Swells & Bursts Outward to Screen Corners
    this.gooContainer.style.transform = 'scale(26)';
    this.gooContainer.style.opacity = '0';
    this.label.style.opacity = '0';
    this.root.style.opacity = '0';

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 850);
  }
}

// 10. AwwwardsDiagonalRazorShutterScreen (Luxury Diagonal Mirror Slabs Sheer Reveal)
export class AwwwardsDiagonalRazorShutterScreen {
  constructor(options = {}) {
    this.brand = options.brand || 'ATELIER // MOTION';
    this.subtitle = options.subtitle || 'HIGH PRECISION DIAGONAL SHEER';
    this.accentColor = options.accentColor || '#ffffff';
    this.duration = options.duration || 2800;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-diagonal-shutter-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Cinzel", Georgia, serif;
      color: #ffffff;
      overflow: hidden;
    `;

    // 7 Diagonal Shutter Slices (Rotated 45 degrees)
    this.slatContainer = document.createElement('div');
    this.slatContainer.style.cssText = `
      position: absolute;
      inset: -50vw;
      display: flex;
      transform: rotate(-35deg);
      pointer-events: none;
    `;
    this.slats = [];
    for (let i = 0; i < 7; i++) {
      const slat = document.createElement('div');
      slat.style.cssText = `
        flex: 1;
        height: 250vh;
        background: #09090c;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
        transform: translate3d(0, 0, 0);
      `;
      this.slatContainer.appendChild(slat);
      this.slats.push(slat);
    }
    this.root.appendChild(this.slatContainer);

    // Center Luxury Monolith Badge
    this.badge = document.createElement('div');
    this.badge.style.cssText = `
      position: relative;
      z-index: 10;
      padding: 40px 54px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 24px;
      background: rgba(15, 15, 20, 0.7);
      backdrop-filter: blur(24px);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 14px;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.7);
      transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
    `;

    this.badge.innerHTML = `
      <div style="font-family:ui-monospace, monospace;font-size:11px;font-weight:700;letter-spacing:4px;color:#94a3b8;text-transform:uppercase;">
        ${this.subtitle}
      </div>
      <div style="font-size:clamp(32px, 6vw, 56px);font-weight:900;letter-spacing:1px;text-transform:uppercase;color:#ffffff;">
        ${this.brand}
      </div>
      <div id="moDiagPct" style="font-family:ui-monospace, monospace;font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-1px;">
        00%
      </div>
    `;
    this.root.appendChild(this.badge);

    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(520, 0.06);

    this._startLoop();
  }

  _startLoop() {
    let currentPct = 0;
    const pctEl = this.badge.querySelector('#moDiagPct');
    const stepMs = Math.max(10, Math.floor(this.duration / 100));

    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      if (pctEl) pctEl.textContent = `${String(Math.min(100, currentPct)).padStart(2, '0')}%`;

      // Micro parallax sway
      this.slats.forEach((s, idx) => {
        const offset = idx % 2 === 0 ? (currentPct * 0.2) : -(currentPct * 0.2);
        s.style.transform = `translateY(${offset}px)`;
      });

      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 180);
      }
    }, stepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.24);

    this.badge.style.transform = 'scale(0.8)';
    this.badge.style.opacity = '0';

    // Supersonic Alternating Diagonal Sheer Slice
    this.slats.forEach((slat, idx) => {
      const dir = idx % 2 === 0 ? -120 : 120;
      slat.style.transform = `translateY(${dir}%)`;
    });

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 850);
  }
}

// 11. KineticTypoStaggerCascadeScreen (Brutalist Kinetic Typography Marquee & Chronometer)
export class KineticTypoStaggerCascadeScreen {
  constructor(options = {}) {
    this.words = options.words || ['ORGANIC', 'MOTION', 'PHYSICS', 'FUTURE', 'CINEMA'];
    this.accentColor = options.accentColor || '#ff0055';
    this.bgColor = options.bgColor || '#09090c';
    this.duration = options.duration || 2800;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-kinetic-typo-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: ${this.bgColor};
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", Roboto, sans-serif;
      color: #ffffff;
      padding: 20px 0;
      box-sizing: border-box;
      transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
    `;

    this.rows = [];
    for (let r = 0; r < 5; r++) {
      const row = document.createElement('div');
      row.style.cssText = `
        display: flex;
        gap: 24px;
        white-space: nowrap;
        font-size: clamp(36px, 8vw, 76px);
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: -1.5px;
        opacity: ${r === 2 ? '1' : '0.15'};
        color: ${r === 2 ? this.accentColor : '#ffffff'};
        transform: translateX(${r % 2 === 0 ? '-10%' : '10%'});
        transition: transform 0.85s cubic-bezier(0.77, 0, 0.175, 1);
      `;
      row.innerHTML = Array(6).fill(this.words[r % this.words.length]).join(' • ');
      this.root.appendChild(row);
      this.rows.push(row);
    }

    // Floating central numeric badge
    this.badge = document.createElement('div');
    this.badge.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #000000;
      border: 2px solid ${this.accentColor};
      padding: 12px 32px;
      border-radius: 999px;
      font-family: ui-monospace, monospace;
      font-size: 24px;
      font-weight: 900;
      color: #ffffff;
      box-shadow: 0 0 30px rgba(255, 0, 85, 0.4);
      z-index: 10;
    `;
    this.badge.textContent = '00%';
    this.root.appendChild(this.badge);

    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(520, 0.06);

    this._startLoop();
  }

  _startLoop() {
    let currentPct = 0;
    const stepMs = Math.max(10, Math.floor(this.duration / 100));

    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      if (this.badge) this.badge.textContent = `${String(Math.min(100, currentPct)).padStart(2, '0')}%`;

      // Kinetic row drift
      this.rows.forEach((row, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        row.style.transform = `translateX(${dir * (currentPct * 0.4)}px)`;
      });

      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 180);
      }
    }, stepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.2);

    this.rows.forEach((row, i) => {
      row.style.transform = i % 2 === 0 ? 'translateX(-120%)' : 'translateX(120%)';
      row.style.opacity = '0';
    });
    if (this.badge) this.badge.style.transform = 'translate(-50%, -50%) scale(0.6)';

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 850);
  }
}

// 12. MoltenLiquidChromeBlobScreen (Molten Viscous Mercury Surface Tension Coalescence)
export class MoltenLiquidChromeBlobScreen {
  constructor(options = {}) {
    this.title = options.brand || options.title || 'MOLTEN CHROME';
    this.accentColor = options.accentColor || '#00e5ff';
    this.duration = options.duration || 2800;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-molten-chrome-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: #08080c;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", Roboto, sans-serif;
      color: #ffffff;
      overflow: hidden;
      transition: opacity 0.75s ease, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    // Center harmonic molten mercury orb
    this.orb = document.createElement('div');
    this.orb.style.cssText = `
      width: clamp(140px, 25vw, 220px);
      height: clamp(140px, 25vw, 220px);
      border-radius: 50%;
      background: linear-gradient(135deg, #ffffff 0%, #94a3b8 40%, #00e5ff 75%, #0f172a 100%);
      box-shadow: 
        0 25px 50px rgba(0, 0, 0, 0.6),
        inset -10px -10px 30px rgba(0, 0, 0, 0.7),
        inset 10px 10px 30px rgba(255, 255, 255, 0.8),
        0 0 45px rgba(0, 229, 255, 0.35);
      animation: moMercuryBreathing 4s infinite ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: ui-monospace, monospace;
      font-size: 32px;
      font-weight: 900;
      color: #000000;
      letter-spacing: -1px;
    `;
    this.orb.textContent = '00%';
    this.root.appendChild(this.orb);

    this.titleEl = document.createElement('div');
    this.titleEl.style.cssText = `
      margin-top: 36px;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #ffffff;
    `;
    this.titleEl.textContent = this.title;
    this.root.appendChild(this.titleEl);

    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(500, 0.06);

    this._startLoop();
  }

  _startLoop() {
    let currentPct = 0;
    const stepMs = Math.max(10, Math.floor(this.duration / 100));

    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      if (this.orb) this.orb.textContent = `${String(Math.min(100, currentPct)).padStart(2, '0')}%`;

      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 200);
      }
    }, stepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.2);

    this.orb.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease';
    this.orb.style.transform = 'scale(18)';
    this.orb.style.opacity = '0';
    this.titleEl.style.opacity = '0';
    this.root.style.opacity = '0';

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 750);
  }
}


// ─── 13. AwwwardsChromaticGlitchWarpScreen (Spatial RGB Displacement & Warp Tunnel) ───
export class AwwwardsChromaticGlitchWarpScreen {
  constructor(options = {}) {
    this.brand = options.brand || 'HYPERDRIVE // 2026';
    this.statusText = options.statusText || 'WARPING SPATIAL CHROMATICS';
    this.accentColor = options.accentColor || '#00f0ff';
    this.secondaryColor = options.secondaryColor || '#ff0077';
    this.duration = options.duration || 3000;
    this.sound = options.sound !== false;
    this.interactive = options.interactive !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-chromatic-warp-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: #040508;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: ui-monospace, SFMono-Regular, "Roboto Mono", Menlo, monospace;
      color: #ffffff;
      overflow: hidden;
      perspective: 800px;
      transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), filter 0.65s ease;
    `;

    // 3D Perspective Warp Grid floor & ceiling
    this.grid = document.createElement('div');
    this.grid.style.cssText = `
      position: absolute;
      inset: -50%;
      background-image: 
        linear-gradient(to right, rgba(0, 240, 255, 0.18) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 0, 119, 0.18) 1px, transparent 1px);
      background-size: 50px 50px;
      transform: perspective(300px) rotateX(72deg) translateY(20%);
      transform-origin: center center;
      animation: moPerspectiveWarpGrid 1.2s linear infinite;
      pointer-events: none;
      opacity: 0.6;
    `;
    this.root.appendChild(this.grid);

    // Laser scanline
    this.laser = document.createElement('div');
    this.laser.style.cssText = `
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, ${this.accentColor}, #ffffff, ${this.secondaryColor}, transparent);
      box-shadow: 0 0 16px ${this.accentColor}, 0 0 32px ${this.secondaryColor};
      animation: moLaserScanlineSweep 2.2s ease-in-out infinite;
      pointer-events: none;
      color: ${this.accentColor};
    `;
    this.root.appendChild(this.laser);

    // Center Chromatic Card Container
    this.card = document.createElement('div');
    this.card.style.cssText = `
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: clamp(24px, 5vw, 48px);
      background: rgba(8, 10, 16, 0.75);
      border: 1px solid rgba(0, 240, 255, 0.3);
      box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0, 240, 255, 0.15), inset 0 0 20px rgba(255, 0, 119, 0.1);
      backdrop-filter: blur(16px);
      border-radius: 12px;
      transform-style: preserve-3d;
      transition: transform 0.15s ease-out;
      z-index: 10;
      max-width: 90vw;
    `;

    // RGB Split Channels for Master Brand Title
    const titleWrapper = document.createElement('div');
    titleWrapper.style.cssText = `position: relative; margin-bottom: 24px;`;

    this.rLayer = document.createElement('div');
    this.rLayer.style.cssText = `
      position: absolute; inset: 0;
      color: ${this.secondaryColor};
      font-size: clamp(28px, 6vw, 56px);
      font-weight: 900;
      letter-spacing: 6px;
      text-transform: uppercase;
      mix-blend-mode: screen;
      animation: moChromaticShiftR 1.8s infinite ease-in-out;
      opacity: 0.9;
    `;
    this.rLayer.textContent = this.brand;

    this.bLayer = document.createElement('div');
    this.bLayer.style.cssText = `
      position: absolute; inset: 0;
      color: ${this.accentColor};
      font-size: clamp(28px, 6vw, 56px);
      font-weight: 900;
      letter-spacing: 6px;
      text-transform: uppercase;
      mix-blend-mode: screen;
      animation: moChromaticShiftB 1.8s infinite ease-in-out;
      opacity: 0.9;
    `;
    this.bLayer.textContent = this.brand;

    this.mainTitle = document.createElement('div');
    this.mainTitle.style.cssText = `
      position: relative;
      color: #ffffff;
      font-size: clamp(28px, 6vw, 56px);
      font-weight: 900;
      letter-spacing: 6px;
      text-transform: uppercase;
      text-shadow: 0 0 20px rgba(255,255,255,0.6);
    `;
    this.mainTitle.textContent = this.brand;

    titleWrapper.appendChild(this.rLayer);
    titleWrapper.appendChild(this.bLayer);
    titleWrapper.appendChild(this.mainTitle);
    this.card.appendChild(titleWrapper);

    // Percentage progress readout with glitch bar
    this.counter = document.createElement('div');
    this.counter.style.cssText = `
      font-size: clamp(36px, 8vw, 72px);
      font-weight: 900;
      color: ${this.accentColor};
      letter-spacing: -2px;
      text-shadow: 0 0 25px ${this.accentColor};
      margin-bottom: 12px;
    `;
    this.counter.textContent = '000%';
    this.card.appendChild(this.counter);

    // Progress Bar Track
    const track = document.createElement('div');
    track.style.cssText = `
      width: clamp(200px, 40vw, 360px);
      height: 4px;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 18px;
    `;
    this.fill = document.createElement('div');
    this.fill.style.cssText = `
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, ${this.secondaryColor}, ${this.accentColor});
      box-shadow: 0 0 14px ${this.accentColor};
      transition: width 0.08s ease-out;
    `;
    track.appendChild(this.fill);
    this.card.appendChild(track);

    // Telemetry HUD readouts
    this.telemetry = document.createElement('div');
    this.telemetry.style.cssText = `
      font-size: 11px;
      color: rgba(255, 255, 255, 0.7);
      letter-spacing: 2px;
      text-transform: uppercase;
      text-align: center;
    `;
    this.telemetry.textContent = `[ STATUS: ${this.statusText} ]`;
    this.card.appendChild(this.telemetry);

    this.root.appendChild(this.card);
    document.body.appendChild(this.root);

    if (this.sound) safePlayPop(440, 0.08);

    if (this.interactive) {
      this._onMove = (e) => {
        const nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        this.card.style.transform = `rotateY(${nx * 18}deg) rotateX(${-ny * 18}deg) translateZ(30px)`;
        this.rLayer.style.transform = `translate(${nx * -10}px, ${ny * -6}px)`;
        this.bLayer.style.transform = `translate(${nx * 10}px, ${ny * 6}px)`;
      };
      this._onLeave = () => {
        this.card.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
        this.rLayer.style.transform = 'translate(0, 0)';
        this.bLayer.style.transform = 'translate(0, 0)';
      };
      window.addEventListener('mousemove', this._onMove);
      window.addEventListener('mouseleave', this._onLeave);
    }

    this._startLoop();
  }

  _startLoop() {
    let currentPct = 0;
    const stepMs = Math.max(10, Math.floor(this.duration / 100));

    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      const padded = String(Math.min(100, currentPct)).padStart(3, '0');
      if (this.counter) this.counter.textContent = `${padded}%`;
      if (this.fill) this.fill.style.width = `${currentPct}%`;

      if (currentPct % 25 === 0 && this.sound) {
        safePlayPop(520 + currentPct * 3, 0.04);
      }

      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 180);
      }
    }, stepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.24);

    if (this._onMove) {
      window.removeEventListener('mousemove', this._onMove);
      window.removeEventListener('mouseleave', this._onLeave);
    }

    this.root.style.filter = 'brightness(3) contrast(1.8)';
    this.card.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
    this.card.style.transform = 'scale(2.4) translateZ(200px)';
    this.card.style.opacity = '0';
    this.grid.style.transform = 'perspective(300px) rotateX(85deg) translateY(120%) scale(2)';
    this.grid.style.opacity = '0';
    this.root.style.opacity = '0';

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 650);
  }
}

// ─── 14. AwwwardsBrutalistEditorialScissorScreen (Monolithic Split-Bands) ─────
export class AwwwardsBrutalistEditorialScissorScreen {
  constructor(options = {}) {
    this.brands = options.brands || [
      'PARIS // TOKYO // MILAN',
      'DIGITAL ARCHITECTURE',
      'VOL. 2026 // MOTION',
      'AVANT-GARDE FLUIDS'
    ];
    this.accentColor = options.accentColor || '#e2ff3b';
    this.secondaryColor = options.secondaryColor || '#ff2a5f';
    this.bgColor = options.bgColor || '#08080a';
    this.duration = options.duration || 3200;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-brutalist-scissor-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: ${this.bgColor};
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: space-between;
      overflow: hidden;
      font-family: "Cinzel", "Bodoni MT", "Didot", "Playfair Display", Georgia, serif;
      color: #ffffff;
      transition: opacity 0.75s ease;
    `;

    this.bands = [];
    for (let i = 0; i < 4; i++) {
      const band = document.createElement('div');
      band.style.cssText = `
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;
        overflow: hidden;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        background: ${i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.4)'};
        transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
      `;

      const textInner = document.createElement('div');
      const marqueeClass = i % 2 === 0 ? 'moScissorMarqueeL' : 'moScissorMarqueeR';
      textInner.style.cssText = `
        display: flex;
        white-space: nowrap;
        animation: ${marqueeClass} ${16 + i * 4}s linear infinite;
        font-size: clamp(32px, 8vw, 84px);
        font-weight: 900;
        letter-spacing: 4px;
        text-transform: uppercase;
        color: ${i === 1 ? this.accentColor : (i === 2 ? this.secondaryColor : '#ffffff')};
        opacity: 0.85;
      `;

      const brandText = this.brands[i % this.brands.length];
      textInner.textContent = `${brandText} — ${brandText} — ${brandText} — ${brandText} — `;
      band.appendChild(textInner);
      this.root.appendChild(band);
      this.bands.push(band);
    }

    // Center Monolithic Counter Card
    this.badge = document.createElement('div');
    this.badge.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #000000;
      border: 2px solid ${this.accentColor};
      padding: clamp(20px, 4vw, 36px) clamp(30px, 6vw, 60px);
      box-shadow: 0 25px 60px rgba(0,0,0,0.9), 0 0 35px ${this.accentColor}55;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 20;
      border-radius: 4px;
      transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
    `;

    this.counter = document.createElement('div');
    this.counter.style.cssText = `
      font-size: clamp(48px, 10vw, 96px);
      font-weight: 900;
      color: ${this.accentColor};
      letter-spacing: -3px;
      line-height: 1;
    `;
    this.counter.textContent = '000';

    const sub = document.createElement('div');
    sub.style.cssText = `
      font-family: ui-monospace, monospace;
      font-size: 11px;
      letter-spacing: 4px;
      color: #ffffff;
      margin-top: 8px;
      text-transform: uppercase;
      opacity: 0.8;
    `;
    sub.textContent = 'ATELIER // ISSUE 2026';

    this.badge.appendChild(this.counter);
    this.badge.appendChild(sub);
    this.root.appendChild(this.badge);

    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(480, 0.08);

    this._startLoop();
  }

  _startLoop() {
    let currentPct = 0;
    const stepMs = Math.max(10, Math.floor(this.duration / 100));

    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      if (this.counter) this.counter.textContent = String(Math.min(100, currentPct)).padStart(3, '0');

      if (currentPct % 20 === 0 && this.sound) {
        safePlayPop(580 + currentPct * 2, 0.05);
      }

      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 220);
      }
    }, stepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.25);

    // Scissor slide bands left & right
    this.bands.forEach((band, idx) => {
      const dir = idx % 2 === 0 ? -115 : 115;
      band.style.transform = `translateX(${dir}%)`;
      band.style.opacity = '0';
    });

    this.badge.style.transform = 'translate(-50%, -50%) scale(1.6)';
    this.badge.style.opacity = '0';
    this.root.style.opacity = '0';

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 850);
  }
}

// ─── 15. AwwwardsMagneticSingularityVortexScreen (Particle Gravitational Collapse) ───
export class AwwwardsMagneticSingularityVortexScreen {
  constructor(options = {}) {
    this.title = options.title || 'GRAVITATIONAL SINGULARITY';
    this.subtitle = options.subtitle || 'ORBITAL ASTROPHYSICS ENGINE';
    this.particleCount = options.particleCount || 220;
    this.color = options.color || '#00f0ff';
    this.accentColor = options.accentColor || '#d65db1';
    this.duration = options.duration || 3200;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-singularity-vortex-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: #020206;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", Roboto, sans-serif;
      color: #ffffff;
      overflow: hidden;
      transition: opacity 0.8s ease;
    `;

    // High performance Retina Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1;`;
    this.root.appendChild(this.canvas);

    // Center Singularity Ring & Counter
    this.hud = document.createElement('div');
    this.hud.style.cssText = `
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease;
    `;

    this.counter = document.createElement('div');
    this.counter.style.cssText = `
      font-family: ui-monospace, monospace;
      font-size: clamp(38px, 8vw, 76px);
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 0 20px ${this.color}, 0 0 40px ${this.accentColor};
      letter-spacing: -2px;
    `;
    this.counter.textContent = '00%';

    this.titleEl = document.createElement('div');
    this.titleEl.style.cssText = `
      margin-top: 14px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 5px;
      text-transform: uppercase;
      color: ${this.color};
      text-shadow: 0 0 10px ${this.color};
    `;
    this.titleEl.textContent = this.title;

    this.subEl = document.createElement('div');
    this.subEl.style.cssText = `
      margin-top: 6px;
      font-size: 10px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.6);
    `;
    this.subEl.textContent = this.subtitle;

    this.hud.appendChild(this.counter);
    this.hud.appendChild(this.titleEl);
    this.hud.appendChild(this.subEl);
    this.root.appendChild(this.hud);

    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(460, 0.06);

    this._initCanvasPhysics();
    this._startLoop();
  }

  _initCanvasPhysics() {
    const ctx = this.canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let width = (this.canvas.width = window.innerWidth * dpr);
    let height = (this.canvas.height = window.innerHeight * dpr);

    this._onResize = () => {
      width = this.canvas.width = window.innerWidth * dpr;
      height = this.canvas.height = window.innerHeight * dpr;
    };
    window.addEventListener('resize', this._onResize);

    // Particles with orbital physics
    const particles = [];
    const colors = [this.color, this.accentColor, '#ffffff', '#ffb800'];
    for (let i = 0; i < this.particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 60 + Math.random() * Math.min(window.innerWidth, window.innerHeight) * 0.45;
      particles.push({
        angle,
        radius,
        speed: (0.005 + Math.random() * 0.015) * (Math.random() > 0.5 ? 1 : -1),
        size: 1.5 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.2 + Math.random() * 0.8,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    this._onMove = (e) => {
      mouseX = e.clientX * dpr;
      mouseY = e.clientY * dpr;
    };
    window.addEventListener('mousemove', this._onMove);

    let progressRatio = 0;
    this._updateProgressRatio = (r) => { progressRatio = r; };

    const render = () => {
      if (this._isExited) return;
      ctx.fillStyle = 'rgba(2, 2, 6, 0.25)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw central singularity core
      const coreR = Math.max(12, 35 * (1 - progressRatio * 0.8));
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, this.color);
      grad.addColorStop(0.7, this.accentColor);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 3, 0, Math.PI * 2);
      ctx.fill();

      // Update and draw particles
      particles.forEach((p) => {
        p.angle += p.speed * (1 + progressRatio * 2);
        // Magnetic inward collapse as progress increases
        const currentR = p.radius * (1 - progressRatio * 0.75);
        const x = cx + Math.cos(p.angle) * currentR;
        const y = cy + Math.sin(p.angle) * currentR;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      this._animId = requestAnimationFrame(render);
    };
    this._animId = requestAnimationFrame(render);
  }

  _startLoop() {
    let currentPct = 0;
    const stepMs = Math.max(10, Math.floor(this.duration / 100));

    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      if (this.counter) this.counter.textContent = `${String(Math.min(100, currentPct)).padStart(2, '0')}%`;
      if (this._updateProgressRatio) this._updateProgressRatio(currentPct / 100);

      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 220);
      }
    }, stepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.28);

    if (this._animId) cancelAnimationFrame(this._animId);
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    if (this._onMove) window.removeEventListener('mousemove', this._onMove);

    this.hud.style.transform = 'scale(2.2)';
    this.hud.style.opacity = '0';
    this.canvas.style.transition = 'transform 0.75s ease-out, opacity 0.75s ease-out';
    this.canvas.style.transform = 'scale(1.8)';
    this.canvas.style.opacity = '0';
    this.root.style.opacity = '0';

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 750);
  }
}

// ─── 16. AwwwardsFluidMeshGradientBlobScreen (Viscous Liquid Mesh Iris) ───────
export class AwwwardsFluidMeshGradientBlobScreen {
  constructor(options = {}) {
    this.brand = options.brand || 'LUMEN // FLUID LABS';
    this.subtext = options.subtext || 'HARMONIC VISCOSITY MATRIX';
    this.duration = options.duration || 3000;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-fluid-mesh-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: #06060c;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", Roboto, sans-serif;
      color: #ffffff;
      overflow: hidden;
      transition: opacity 0.75s ease;
    `;

    // Ambient floating mesh backdrop blobs
    const meshId = uid();
    this.svgContainer = document.createElement('div');
    this.svgContainer.style.cssText = `
      position: relative;
      width: clamp(260px, 45vw, 420px);
      height: clamp(260px, 45vw, 420px);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s ease;
    `;

    this.svgContainer.innerHTML = `
      <svg viewBox="0 0 200 200" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 20px 50px rgba(118,75,162,0.5));">
        <defs>
          <linearGradient id="${meshId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff9a9e" />
            <stop offset="35%" stop-color="#fecfef" />
            <stop offset="70%" stop-color="#a1c4fd" />
            <stop offset="100%" stop-color="#764ba2" />
          </linearGradient>
        </defs>
        <path id="${meshId}_path" fill="url(#${meshId})" d="M 100,20 C 145,20 180,55 180,100 C 180,145 145,180 100,180 C 55,180 20,145 20,100 C 20,55 55,20 100,20 Z" />
      </svg>
    `;
    this.root.appendChild(this.svgContainer);

    // Center content card over the blob
    this.hud = document.createElement('div');
    this.hud.style.cssText = `
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      pointer-events: none;
    `;

    this.counter = document.createElement('div');
    this.counter.style.cssText = `
      font-size: clamp(48px, 9vw, 92px);
      font-weight: 900;
      color: #000000;
      letter-spacing: -2px;
      line-height: 1;
    `;
    this.counter.textContent = '00%';

    this.brandEl = document.createElement('div');
    this.brandEl.style.cssText = `
      margin-top: 14px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #000000;
      opacity: 0.85;
    `;
    this.brandEl.textContent = this.brand;

    this.hud.appendChild(this.counter);
    this.hud.appendChild(this.brandEl);
    this.svgContainer.appendChild(this.hud);

    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(520, 0.06);

    this._initBlobDeformation(meshId);
    this._startLoop();
  }

  _initBlobDeformation(meshId) {
    const pathEl = document.getElementById(`${meshId}_path`);
    if (!pathEl) return;

    let time = 0;
    const animateBlob = () => {
      if (this._isExited) return;
      time += 0.04;
      const r1 = 80 + Math.sin(time) * 12;
      const r2 = 80 + Math.cos(time * 0.8) * 14;
      const r3 = 80 + Math.sin(time * 1.2) * 10;
      const r4 = 80 + Math.cos(time * 1.1) * 12;

      const d = `M 100,${100 - r1} C ${100 + r2 * 0.6},${100 - r1} ${100 + r2},${100 - r2 * 0.6} ${100 + r2},100 C ${100 + r2},${100 + r3 * 0.6} ${100 + r3 * 0.6},${100 + r3} 100,${100 + r3} C ${100 - r4 * 0.6},${100 + r3} ${100 - r4},${100 + r4 * 0.6} ${100 - r4},100 C ${100 - r4},${100 - r1 * 0.6} ${100 - r1 * 0.6},${100 - r1} 100,${100 - r1} Z`;
      pathEl.setAttribute('d', d);
      this._blobAnim = requestAnimationFrame(animateBlob);
    };
    this._blobAnim = requestAnimationFrame(animateBlob);
  }

  _startLoop() {
    let currentPct = 0;
    const stepMs = Math.max(10, Math.floor(this.duration / 100));

    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      if (this.counter) this.counter.textContent = `${String(Math.min(100, currentPct)).padStart(2, '0')}%`;

      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 180);
      }
    }, stepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.24);

    if (this._blobAnim) cancelAnimationFrame(this._blobAnim);

    this.svgContainer.style.transform = 'scale(22)';
    this.hud.style.opacity = '0';
    this.root.style.opacity = '0';

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 750);
  }
}



// ─── 18. AwwwardsNeoTokyoHoloDeckScreen (Tactical Holographic Cyber HUD) ──────
export class AwwwardsNeoTokyoHoloDeckScreen {
  constructor(options = {}) {
    this.brand = options.brand || 'NEO-TOKYO // HUD.V4';
    this.subtitle = options.subtitle || 'QUANTUM NEURAL FREQUENCY LOCK';
    this.accentColor = options.accentColor || '#00ffff';
    this.warningColor = options.warningColor || '#ff0055';
    this.duration = options.duration || 3000;
    this.sound = options.sound !== false;
    this.onComplete = options.onComplete || null;
    this._isExited = false;
    this._mount();
  }

  _mount() {
    if (typeof document === 'undefined') return;
    ensureLoaderStyles();
    this._unlockScroll = lockBodyScroll();

    this.root = document.createElement('div');
    this.root.className = 'mo-neotokyo-holodeck-screen';
    this.root.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 999999;
      background: #020617;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      color: #ffffff;
      overflow: hidden;
      transition: opacity 0.65s ease;
    `;

    // High performance Equalizer Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none;`;
    this.root.appendChild(this.canvas);

    // Concentric Rotating HUD Rings
    this.hudRings = document.createElement('div');
    this.hudRings.style.cssText = `
      position: absolute;
      width: clamp(280px, 50vw, 480px);
      height: clamp(280px, 50vw, 480px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3;
      pointer-events: none;
    `;

    this.hudRings.innerHTML = `
      <div style="position:absolute;inset:0;border-radius:50%;border:1.5px dashed ${this.accentColor};opacity:0.4;animation:moHoloReticleSpinCw 12s linear infinite;"></div>
      <div style="position:absolute;inset:15%;border-radius:50%;border:1px solid rgba(255,255,255,0.2);animation:moHoloReticleSpinCcw 8s linear infinite;"></div>
      <div style="position:absolute;inset:30%;border-radius:50%;border:2px solid ${this.warningColor};border-top-color:transparent;border-bottom-color:transparent;animation:moHoloReticleSpinCw 4s linear infinite;"></div>
    `;
    this.root.appendChild(this.hudRings);

    // Center Terminal Readout
    this.card = document.createElement('div');
    this.card.style.cssText = `
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
    `;

    this.counter = document.createElement('div');
    this.counter.style.cssText = `
      font-size: clamp(48px, 9vw, 92px);
      font-weight: 900;
      color: ${this.accentColor};
      text-shadow: 0 0 20px ${this.accentColor};
      letter-spacing: -2px;
      line-height: 1;
    `;
    this.counter.textContent = '00%';

    this.titleEl = document.createElement('div');
    this.titleEl.style.cssText = `
      margin-top: 14px;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #ffffff;
    `;
    this.titleEl.textContent = this.brand;

    this.statusEl = document.createElement('div');
    this.statusEl.style.cssText = `
      margin-top: 6px;
      font-size: 10px;
      letter-spacing: 2px;
      color: ${this.warningColor};
      text-transform: uppercase;
    `;
    this.statusEl.textContent = `[ LOCK: ACQUIRED // 98.4 GHz ]`;

    this.card.appendChild(this.counter);
    this.card.appendChild(this.titleEl);
    this.card.appendChild(this.statusEl);
    this.root.appendChild(this.card);

    document.body.appendChild(this.root);
    if (this.sound) safePlayPop(600, 0.08);

    this._initAudioEqualizer();
    this._startLoop();
  }

  _initAudioEqualizer() {
    const ctx = this.canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let width = (this.canvas.width = window.innerWidth * dpr);
    let height = (this.canvas.height = window.innerHeight * dpr);

    this._onResize = () => {
      width = this.canvas.width = window.innerWidth * dpr;
      height = this.canvas.height = window.innerHeight * dpr;
    };
    window.addEventListener('resize', this._onResize);

    let time = 0;
    const barCount = 48;

    const render = () => {
      if (this._isExited) return;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseR = Math.min(width, height) * 0.22;
      time += 0.05;

      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2;
        const wave = Math.sin(time * 3 + i * 0.4) * 0.5 + 0.5;
        const barH = 8 + wave * 28 * dpr;

        const x1 = cx + Math.cos(angle) * baseR;
        const y1 = cy + Math.sin(angle) * baseR;
        const x2 = cx + Math.cos(angle) * (baseR + barH);
        const y2 = cy + Math.sin(angle) * (baseR + barH);

        ctx.strokeStyle = i % 2 === 0 ? this.accentColor : this.warningColor;
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      this._animId = requestAnimationFrame(render);
    };
    this._animId = requestAnimationFrame(render);
  }

  _startLoop() {
    let currentPct = 0;
    const stepMs = Math.max(10, Math.floor(this.duration / 100));

    const countTimer = setInterval(() => {
      if (this._isExited) {
        clearInterval(countTimer);
        return;
      }
      currentPct++;
      if (this.counter) this.counter.textContent = `${String(Math.min(100, currentPct)).padStart(2, '0')}%`;

      if (currentPct >= 100) {
        clearInterval(countTimer);
        setTimeout(() => this.exit(), 180);
      }
    }, stepMs);
  }

  exit() {
    if (this._isExited || !this.root) return;
    this._isExited = true;
    if (this.sound) safePlayWhoosh(0.26);

    if (this._animId) cancelAnimationFrame(this._animId);
    if (this._onResize) window.removeEventListener('resize', this._onResize);

    this.card.style.transform = 'scale(0.2)';
    this.card.style.opacity = '0';
    this.hudRings.style.transform = 'scale(2)';
    this.hudRings.style.opacity = '0';
    this.root.style.opacity = '0';

    setTimeout(() => {
      if (this._unlockScroll) this._unlockScroll();
      if (this.root?.parentNode) this.root.parentNode.removeChild(this.root);
      if (this.onComplete) this.onComplete();
    }, 650);
  }
}


// ─── Complete Loader Catalog Map (23 High-End Archetypes) ───────────────────
export const LOADER_CATALOG = {
  'wormhole': QuantumChronosWormholeLoader,
  'obsidian': ObsidianLiquidCausticLoader,
  'maglev': MagLevSuperconductorLoader,
  'dispersion': HyperPrismDispersionLoader,
  'vortex': QuantumChronosWormholeLoader,
  'prism': HoloPrismCrystalLoader,
  'eclipse': OrbitalEclipseLoader,
  'metaball': MorphingMetaballLoader,
  'cyber': CyberMatrixScanLoader,
  'quantum': QuantumSpinLoader,
  'pill': MinimalPulsePillLoader,
  'synapse': NeuralSynapseLoader,
  'mercury': LiquidMercuryDropletLoader,
  'aura': AuraRingsConcentricLoader,
  'helix': HyperLoopDNAHelixLoader,
  'cube': IsometricCubeStackLoader,
  'dot-wave': DotMatrixWaveLoader,
  'radial-eq': RadialEqualizerWaveLoader,
  'infinity': InfinityMorphRibbonLoader,
  'glitch': GlitchTerminalMatrixLoader,
  'sonar': SonarPulseEchoLoader,
  'shatter': ShatterAssembleLoader,
  'supernova': ParticleSupernovaLoader,
  'tesseract': HypercubeTesseractLoader,
};

