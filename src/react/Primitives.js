import { useRef, useEffect, createElement, forwardRef } from 'react';
import { MagneticCursor } from '../primitives/magneticCursor.js';
import { CharacterWaveText } from '../primitives/characterWaveText.js';
import { ElasticScrollReveal } from '../primitives/elasticScrollReveal.js';
import { DepthParallax } from '../primitives/depthParallax.js';

/**
 * <Magnetic> — Wraps any element with a spring-physics magnetic cursor pull.
 *
 * @example
 * ```jsx
 * import { Magnetic } from 'motion-organic/react';
 *
 * <Magnetic radius={120} strength={0.5}>
 *   <button>I follow your cursor</button>
 * </Magnetic>
 * ```
 */
export const Magnetic = forwardRef(function Magnetic({
  children,
  radius = 80,
  strength = 0.4,
  stiffness = 150,
  damping = 15,
  as = 'div',
  className = '',
  style,
  ...rest
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const instance = new MagneticCursor(el, { radius, strength, stiffness, damping });
    return () => instance.destroy();
  }, [radius, strength, stiffness, damping]);

  return createElement(as, { ref: mergedRef, className: `mo-magnetic ${className}`.trim(), style, ...rest }, children);
});
Magnetic.displayName = 'Magnetic';


/**
 * <Wave> — Splits text into per-character spans and reveals them in a scroll-driven wave.
 *
 * @example
 * ```jsx
 * import { Wave } from 'motion-organic/react';
 *
 * <Wave>
 *   <h1>Characters reveal in a wave on scroll</h1>
 * </Wave>
 *
 * // Or directly on a text element:
 * <Wave as="h1" waveWidth={0.2}>
 *   Hello World
 * </Wave>
 * ```
 */
export const Wave = forwardRef(function Wave({
  children,
  waveWidth = 0.15,
  as = 'div',
  className = '',
  style,
  ...rest
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const instance = new CharacterWaveText(el, { waveWidth });
    return () => instance.destroy();
  }, [waveWidth]);

  return createElement(as, { ref: mergedRef, className: `mo-wave ${className}`.trim(), style, ...rest }, children);
});
Wave.displayName = 'Wave';


/**
 * <Reveal> — Spring-physics scroll-triggered reveal with elastic overshoot.
 *
 * @example
 * ```jsx
 * import { Reveal } from 'motion-organic/react';
 *
 * <Reveal>
 *   <div className="card">I spring into view when scrolled to</div>
 * </Reveal>
 *
 * <Reveal stiffness={200} damping={10} once={false}>
 *   <img src="/hero.jpg" alt="Hero" />
 * </Reveal>
 * ```
 */
export const Reveal = forwardRef(function Reveal({
  children,
  stiffness = 180,
  damping = 14,
  once = true,
  as = 'div',
  className = '',
  style,
  ...rest
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const instance = new ElasticScrollReveal(el, { stiffness, damping, once });
    return () => instance.destroy();
  }, [stiffness, damping, once]);

  return createElement(as, { ref: mergedRef, className: `mo-reveal ${className}`.trim(), style, ...rest }, children);
});
Reveal.displayName = 'Reveal';


/**
 * <Parallax> — Depth parallax layer that moves at a different speed than scroll.
 *
 * @example
 * ```jsx
 * import { Parallax } from 'motion-organic/react';
 *
 * <Parallax speed={0.3}>
 *   <div className="bg-layer">I move slower (background)</div>
 * </Parallax>
 *
 * <Parallax speed={1.5}>
 *   <div className="fg-layer">I move faster (foreground)</div>
 * </Parallax>
 * ```
 */
export const Parallax = forwardRef(function Parallax({
  children,
  speed = 0.5,
  as = 'div',
  className = '',
  style,
  ...rest
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const instance = new DepthParallax([{ el, speed }]);
    return () => instance.destroy();
  }, [speed]);

  return createElement(as, { ref: mergedRef, className: `mo-parallax ${className}`.trim(), style, ...rest }, children);
});
Parallax.displayName = 'Parallax';


// ─── Ref Merging Utility ────────────────────────────────────────────────────

/**
 * Merge a forwarded ref and an internal ref into one callback ref.
 * Handles both callback refs and RefObjects.
 */
function useMergedRef(forwardedRef, internalRef) {
  return (node) => {
    internalRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };
}
