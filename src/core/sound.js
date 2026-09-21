/**
 * sound.js — Zero-Asset Procedural Web Audio FX Synthesizer for motion-organic.
 *
 * Generates organic, high-fidelity acoustic feedback in real time using the
 * Web Audio API. Requires zero external .mp3/.wav files or network requests.
 *
 * Sound Profiles:
 * - 'fabric' / 'silk'   — Textured, soft cloth peel & rustle
 * - 'whoosh'            — Cinematic spatial air rush with resonant bandpass sweep
 * - 'liquid' / 'bubble' — Viscous fluid droplets & harmonic ripples
 * - 'portal'            — Deep sub-bass swell with harmonic overtone glide
 * - 'shutter' / 'click' — Crisp mechanical aperture transient
 * - 'chime' / 'bell'    — Crystalline harmonic bell chime
 * - 'subtle'            — Minimal acoustic air puff
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.volume = 0.45;
    this.muted = false;
    this._unlocked = false;
  }

  _init() {
    if (this.ctx) return;
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch {
      // AudioContext unavailable or blocked
    }
  }

  _unlock() {
    if (typeof window === 'undefined') return;
    this._init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this._unlocked = true;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  mute(shouldMute = true) {
    this.muted = Boolean(shouldMute);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  /**
   * Synthesize white / pink noise buffer
   */
  _createNoiseBuffer(duration = 0.5) {
    if (!this.ctx) return null;
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pinkish noise filter
      lastOut = (lastOut * 0.94) + (white * 0.06);
      data[i] = lastOut * 3.5;
    }
    return buffer;
  }

  /**
   * Play a procedural sound effect profile
   * @param {string} profile - 'fabric' | 'silk' | 'whoosh' | 'liquid' | 'portal' | 'shutter' | 'chime' | 'subtle'
   * @param {Object} [options]
   * @param {number} [options.velocity=1] - Dynamic speed / spring velocity factor
   * @param {number} [options.volume=1] - Per-trigger volume multiplier
   */
  play(profile = 'whoosh', { velocity = 1, volume = 1 } = {}) {
    if (this.muted) return;
    if (typeof window === 'undefined') return;
    this._unlock();
    if (!this.ctx || this.ctx.state !== 'running') return;

    const vFactor = Math.max(0.4, Math.min(2.5, velocity));
    const now = this.ctx.currentTime;
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.connect(this.masterGain);

    switch (profile.toLowerCase()) {
      case 'fabric':
      case 'silk': {
        // High-pass textured cloth rustle with soft envelope
        const duration = 0.48 / Math.sqrt(vFactor);
        const noiseBuf = this._createNoiseBuffer(duration);
        if (!noiseBuf) return;

        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noiseBuf;

        const bqFilter = this.ctx.createBiquadFilter();
        bqFilter.type = 'bandpass';
        bqFilter.frequency.setValueAtTime(1400, now);
        bqFilter.frequency.exponentialRampToValueAtTime(3200 * vFactor, now + duration * 0.5);
        bqFilter.frequency.exponentialRampToValueAtTime(800, now + duration);
        bqFilter.Q.setValueAtTime(2.2, now);

        gainNode.gain.exponentialRampToValueAtTime(0.35 * volume, now + 0.06);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        noiseSrc.connect(bqFilter);
        bqFilter.connect(gainNode);
        noiseSrc.start(now);
        noiseSrc.stop(now + duration + 0.05);
        break;
      }

      case 'liquid':
      case 'bubble':
      case 'pop': {
        // Organic water droplet / viscous pop
        const duration = 0.38 / Math.sqrt(vFactor);
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650 * vFactor, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + duration);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);

        gainNode.gain.exponentialRampToValueAtTime(0.4 * volume, now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(gainNode);
        osc.start(now);
        osc.stop(now + duration + 0.02);
        break;
      }

      case 'chime':
      case 'bell': {
        // Crystalline harmonic bell chime
        const duration = 0.55 / Math.sqrt(vFactor);
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(1046.5 * vFactor, now); // C6
        osc2.frequency.setValueAtTime(2093 * vFactor, now);   // C7 harmonic

        const chimeGain = this.ctx.createGain();
        chimeGain.gain.setValueAtTime(0.35 * volume, now);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc1.connect(chimeGain);
        osc2.connect(chimeGain);
        chimeGain.connect(this.masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);
        break;
      }

      case 'portal':
      case 'cinematic': {
        // Sub-bass dimensional swell with harmonic shimmer
        const duration = 0.85 / Math.sqrt(vFactor);
        const subOsc = this.ctx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(95, now);
        subOsc.frequency.exponentialRampToValueAtTime(45, now + duration);

        const airNoise = this.ctx.createBufferSource();
        const noiseBuf = this._createNoiseBuffer(duration);
        if (noiseBuf) {
          airNoise.buffer = noiseBuf;
          const airFilter = this.ctx.createBiquadFilter();
          airFilter.type = 'bandpass';
          airFilter.frequency.setValueAtTime(400, now);
          airFilter.frequency.exponentialRampToValueAtTime(1800, now + duration * 0.4);
          airFilter.frequency.exponentialRampToValueAtTime(300, now + duration);
          airFilter.Q.setValueAtTime(3.5, now);

          const airGain = this.ctx.createGain();
          airGain.gain.setValueAtTime(0.001, now);
          airGain.gain.exponentialRampToValueAtTime(0.2 * volume, now + 0.1);
          airGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

          airNoise.connect(airFilter);
          airFilter.connect(airGain);
          airGain.connect(this.masterGain);
          airNoise.start(now);
          airNoise.stop(now + duration);
        }

        gainNode.gain.exponentialRampToValueAtTime(0.55 * volume, now + 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        subOsc.connect(gainNode);
        subOsc.start(now);
        subOsc.stop(now + duration + 0.05);
        break;
      }

      case 'shutter':
      case 'click': {
        // Mechanical shutter transient
        const duration = 0.12;
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

        gainNode.gain.exponentialRampToValueAtTime(0.4 * volume, now + 0.005);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + duration);
        break;
      }

      case 'subtle': {
        // Minimal acoustic puff
        const duration = 0.22;
        const noiseBuf = this._createNoiseBuffer(duration);
        if (!noiseBuf) return;
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noiseBuf;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + duration);

        gainNode.gain.exponentialRampToValueAtTime(0.18 * volume, now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        noiseSrc.connect(filter);
        filter.connect(gainNode);
        noiseSrc.start(now);
        noiseSrc.stop(now + duration);
        break;
      }

      case 'whoosh':
      default: {
        // Resonant spatial whoosh sweep
        const duration = 0.42 / Math.sqrt(vFactor);
        const noiseBuf = this._createNoiseBuffer(duration);
        if (!noiseBuf) return;

        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noiseBuf;

        const bqFilter = this.ctx.createBiquadFilter();
        bqFilter.type = 'bandpass';
        bqFilter.frequency.setValueAtTime(280, now);
        bqFilter.frequency.exponentialRampToValueAtTime(1400 * vFactor, now + duration * 0.45);
        bqFilter.frequency.exponentialRampToValueAtTime(180, now + duration);
        bqFilter.Q.setValueAtTime(3.0, now);

        gainNode.gain.exponentialRampToValueAtTime(0.45 * volume, now + duration * 0.25);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        noiseSrc.connect(bqFilter);
        bqFilter.connect(gainNode);
        noiseSrc.start(now);
        noiseSrc.stop(now + duration + 0.05);
        break;
      }
    }
  }
}

export const MoAudio = new SoundEngine();

