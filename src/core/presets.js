/**
 * presets.js — Universal Spring Physics Presets & Global Motion Configuration.
 */

export const SPRING_PRESETS = {
  silk: { stiffness: 110, damping: 24, mass: 1 },
  liquid: { stiffness: 85, damping: 16, mass: 1 },
  snappy: { stiffness: 180, damping: 20, mass: 1 },
  cinematic: { stiffness: 60, damping: 18, mass: 1.2 },
  bouncy: { stiffness: 140, damping: 12, mass: 0.9 },
  gentle: { stiffness: 90, damping: 28, mass: 1 },
};

export const globalMotionConfig = {
  defaultPreset: 'silk',
  sound: false,
  reducedMotionFallback: 'fade', // 'fade' | 'instant'
  autoPrefersReducedMotion: true,
};

/**
 * Configure global framework motion behavior
 * @param {Partial<typeof globalMotionConfig>} options
 */
export function configureMotion(options = {}) {
  Object.assign(globalMotionConfig, options);
}

/**
 * Check if the user has requested reduced motion
 * @returns {boolean}
 */
export function isReducedMotionPreferred() {
  if (!globalMotionConfig.autoPrefersReducedMotion) return false;
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
