import { useRef, useEffect, createElement, forwardRef } from 'react';
import { LiquidSheenText as LiquidSheenCore } from '../primitives/liquidSheenText.js';
import { OffsetShadowText as OffsetShadowCore } from '../primitives/offsetShadowText.js';
import { ChromaticGlitchText as ChromaticGlitchCore } from '../primitives/chromaticGlitchText.js';
import { SteppedDepthText as SteppedDepthCore } from '../primitives/steppedDepthText.js';
import { Isometric3DText as Isometric3DCore } from '../primitives/isometric3dText.js';
import { NeonFlickerText as NeonFlickerCore } from '../primitives/neonFlickerText.js';
import { SoftClayDebossText as SoftClayCore } from '../primitives/softClayDebossText.js';
import { WireframeStackText as WireframeStackCore } from '../primitives/wireframeStackText.js';
import { AuroraGradientText as AuroraGradientCore } from '../primitives/auroraGradientText.js';
import { AvantGardeText as AvantGardeCore } from '../primitives/avantGardeText.js';
import { DotMatrixLedText as DotMatrixLedCore } from '../primitives/dotMatrixLedText.js';
import { LiquidRefractionText as LiquidRefractionCore } from '../primitives/liquidRefractionText.js';
import { VariablePhysicsText as VariablePhysicsCore } from '../primitives/variablePhysicsText.js';
import { ShatterMorphText as ShatterMorphCore } from '../primitives/shatterMorphText.js';
import { MoActionBadge as MoActionBadgeCore } from '../primitives/actionBadge.js';
import {
  KineticOutlineText as KineticOutlineCore,
  LiquidMetalText as LiquidMetalCore,
  EditorialSplitText as EditorialSplitCore,
  NoiseTypeText as NoiseTypeCore,
  VariableCapsText as VariableCapsCore,
} from '../primitives/premiumText.js';

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

/**
 * <LiquidSheenText> — Iridescent Fluid Gradient with Glass Sheen & Neon Outline.
 */
export const LiquidSheenText = forwardRef(function LiquidSheenText({
  children,
  as = 'span',
  colors,
  outlineColor = '#22c55e',
  outlineWidth = 2,
  offset = 4,
  sheenColor = 'rgba(255, 255, 255, 0.85)',
  speed = 4,
  glassReflection = true,
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new LiquidSheenCore(el, { colors, outlineColor, outlineWidth, offset, sheenColor, speed, glassReflection, interactive });
    return () => inst.destroy();
  }, [JSON.stringify(colors), outlineColor, outlineWidth, offset, sheenColor, speed, glassReflection, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-liquid-sheen ${className}`.trim(), style, ...domProps }, children);
});
LiquidSheenText.displayName = 'LiquidSheenText';

/**
 * <OffsetShadowText> — Dual Chromatic Pop-Art Offset Shadow Typography.
 */
export const OffsetShadowText = forwardRef(function OffsetShadowText({
  children,
  as = 'span',
  textColor = '#ffffff',
  magenta = '#ff0055',
  magentaColor,
  cyan = '#00e5ff',
  cyanColor,
  offset = 6,
  interactive = true,
  stiffness,
  damping,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new OffsetShadowCore(el, {
      textColor,
      magentaColor: magentaColor || magenta,
      cyanColor: cyanColor || cyan,
      offset,
      interactive,
      stiffness,
      damping,
    });
    return () => inst.destroy();
  }, [textColor, magenta, magentaColor, cyan, cyanColor, offset, interactive, stiffness, damping]);

  return createElement(as, { ref: mergedRef, className: `mo-offset-shadow ${className}`.trim(), style, ...domProps }, children);
});
OffsetShadowText.displayName = 'OffsetShadowText';

/**
 * <ChromaticGlitchText> — Tri-Color RGB Matrix Slice & Glitch Typography.
 */
export const ChromaticGlitchText = forwardRef(function ChromaticGlitchText({
  children,
  as = 'span',
  textColor = '#ffffff',
  topColor = '#00ffea',
  midColor = '#ffffff',
  botColor = '#ff0055',
  hoverSurge = true,
  intensity = 1,
  glitchInterval = 3200,
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new ChromaticGlitchCore(el, {
      textColor,
      topColor,
      midColor,
      botColor,
      hoverSurge,
      intensity,
      glitchInterval,
      interactive,
    });
    return () => inst.destroy();
  }, [textColor, topColor, midColor, botColor, hoverSurge, intensity, glitchInterval, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-chromatic-glitch ${className}`.trim(), style, ...domProps }, children);
});
ChromaticGlitchText.displayName = 'ChromaticGlitchText';

/**
 * <SteppedDepthText> — 3D Cascading Pastel Step-Layer Typography.
 */
export const SteppedDepthText = forwardRef(function SteppedDepthText({
  children,
  as = 'span',
  color = '#f87171',
  colors,
  layers = 4,
  stepDistance = 6,
  offset,
  direction = 'bottom-right',
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  const effectiveOffset = offset !== undefined ? offset : stepDistance;

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new SteppedDepthCore(el, {
      color,
      colors,
      layers,
      stepDistance: effectiveOffset,
      direction,
      interactive,
    });
    return () => inst.destroy();
  }, [color, JSON.stringify(colors), layers, effectiveOffset, direction, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-stepped-depth ${className}`.trim(), style, ...domProps }, children);
});
SteppedDepthText.displayName = 'SteppedDepthText';

/**
 * <Isometric3DText> — Isometric 3D Extruded Block Typography with Specular Top Cap.
 */
export const Isometric3DText = forwardRef(function Isometric3DText({
  children,
  as = 'span',
  front = '#06b6d4',
  frontColor,
  top = '#facc15',
  topColor,
  side = '#ec4899',
  sideColor,
  shadowColor,
  depth = 18,
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new Isometric3DCore(el, {
      frontColor: frontColor || front,
      topColor: topColor || top,
      sideColor: sideColor || side,
      shadowColor,
      depth,
      interactive,
    });
    return () => inst.destroy();
  }, [front, frontColor, top, topColor, side, sideColor, shadowColor, depth, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-isometric-3d ${className}`.trim(), style, ...domProps }, children);
});
Isometric3DText.displayName = 'Isometric3DText';

/**
 * <NeonFlickerText> — Bioluminescent Gas Tube Glow with Electrical Flicker.
 */
export const NeonFlickerText = forwardRef(function NeonFlickerText({
  children,
  as = 'span',
  color = '#22c55e',
  coreColor = '#ffffff',
  flicker = true,
  glowIntensity = 1,
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new NeonFlickerCore(el, { color, coreColor, flicker, glowIntensity, interactive });
    return () => inst.destroy();
  }, [color, coreColor, flicker, glowIntensity, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-neon-flicker ${className}`.trim(), style, ...domProps }, children);
});
NeonFlickerText.displayName = 'NeonFlickerText';

/**
 * <SoftClayDebossText> — Tactile Claymorphic Inset Soft Deboss Typography.
 */
export const SoftClayDebossText = forwardRef(function SoftClayDebossText({
  children,
  as = 'span',
  bgColor = '#fca5a5',
  textColor = '#e07a7a',
  depth = 5,
  softness = 6,
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new SoftClayCore(el, { bgColor, textColor, depth, softness, interactive });
    return () => inst.destroy();
  }, [bgColor, textColor, depth, softness, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-soft-clay ${className}`.trim(), style, ...domProps }, children);
});
SoftClayDebossText.displayName = 'SoftClayDebossText';

/**
 * <WireframeStackText> — Pop-Art Wireframe Offset Stack Typography.
 */
export const WireframeStackText = forwardRef(function WireframeStackText({
  children,
  as = 'span',
  cyan = '#00cec9',
  cyanColor,
  magenta = '#e84393',
  magentaColor,
  stroke = '#ffffff',
  strokeColor,
  strokeWidth = 2.5,
  layers = 3,
  offset = 8,
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new WireframeStackCore(el, {
      cyanColor: cyanColor || cyan,
      magentaColor: magentaColor || magenta,
      strokeColor: strokeColor || stroke,
      strokeWidth,
      layers,
      offset,
      interactive,
    });
    return () => inst.destroy();
  }, [cyan, cyanColor, magenta, magentaColor, stroke, strokeColor, strokeWidth, layers, offset, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-wireframe-stack ${className}`.trim(), style, ...domProps }, children);
});
WireframeStackText.displayName = 'WireframeStackText';

/**
 * <AuroraGradientText> — Fluid Aurora Borealis Multi-Stop Chromatic Typography.
 */
export const AuroraGradientText = forwardRef(function AuroraGradientText({
  children,
  as = 'span',
  colors,
  speed = 6,
  glow = true,
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new AuroraGradientCore(el, { colors, speed, glow, interactive });
    return () => inst.destroy();
  }, [JSON.stringify(colors), speed, glow, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-aurora-gradient ${className}`.trim(), style, ...domProps }, children);
});
AuroraGradientText.displayName = 'AuroraGradientText';

/**
 * <AvantGardeText> — Experimental Modular Deconstructed Glyph Typography.
 */
export const AvantGardeText = forwardRef(function AvantGardeText({
  children,
  as = 'span',
  color = '#ffffff',
  accentColor = '#ffffff',
  letterSpacing = 0.08,
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new AvantGardeCore(el, { color, accentColor, letterSpacing, interactive });
    return () => inst.destroy();
  }, [color, accentColor, letterSpacing, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-avant-garde ${className}`.trim(), style, ...domProps }, children);
});
AvantGardeText.displayName = 'AvantGardeText';

/**
 * <DotMatrixLedText> — Digital Phosphor LED Dot Matrix Display.
 */
export const DotMatrixLedText = forwardRef(function DotMatrixLedText({
  children,
  as = 'div',
  color = '#00ff88',
  inactiveColor = '#092115',
  dotSize = 3.5,
  gap = 2,
  glow = true,
  flicker = true,
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new DotMatrixLedCore(el, { color, inactiveColor, dotSize, gap, glow, flicker, interactive });
    return () => inst.destroy();
  }, [color, inactiveColor, dotSize, gap, glow, flicker, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-dot-matrix-led ${className}`.trim(), style, ...domProps }, children);
});
DotMatrixLedText.displayName = 'DotMatrixLedText';

/**
 * <LiquidRefractionText> — Real-Time Optical Liquid Glass Lens & Chromatic Refraction.
 */
export const LiquidRefractionText = forwardRef(function LiquidRefractionText({
  children,
  as = 'span',
  lensRadius = 75,
  viscosity = 0.7,
  chromaticAberration = 1.5,
  color = '#ffffff',
  highlightColor = 'rgba(255, 255, 255, 0.95)',
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new LiquidRefractionCore(el, { lensRadius, viscosity, chromaticAberration, color, highlightColor, interactive });
    return () => inst.destroy();
  }, [lensRadius, viscosity, chromaticAberration, color, highlightColor, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-liquid-refraction ${className}`.trim(), style, ...domProps }, children);
});
LiquidRefractionText.displayName = 'LiquidRefractionText';

/**
 * <VariablePhysicsText> — Elastic Variable Font Spring Harmonic Waves.
 */
export const VariablePhysicsText = forwardRef(function VariablePhysicsText({
  children,
  as = 'span',
  color = '#ffffff',
  minWeight = 200,
  maxWeight = 900,
  elasticity = 160,
  damping = 12,
  radius = 140,
  slant = true,
  continuousWave = false,
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new VariablePhysicsCore(el, { color, minWeight, maxWeight, elasticity, damping, radius, slant, continuousWave, interactive });
    return () => inst.destroy();
  }, [color, minWeight, maxWeight, elasticity, damping, radius, slant, continuousWave, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-variable-physics ${className}`.trim(), style, ...domProps }, children);
});
VariablePhysicsText.displayName = 'VariablePhysicsText';

/**
 * <ShatterMorphText> — Physical Character Particle Shard Explosion & Word Morphing.
 */
export const ShatterMorphText = forwardRef(function ShatterMorphText({
  children,
  as = 'span',
  color = '#ffffff',
  words,
  trigger = 'click',
  interval = 3500,
  shardCount = 6,
  explosionForce = 80,
  sound = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new ShatterMorphCore(el, { color, words, trigger, interval, shardCount, explosionForce, sound });
    return () => inst.destroy();
  }, [color, JSON.stringify(words), trigger, interval, shardCount, explosionForce, sound]);

  return createElement(as, { ref: mergedRef, className: `mo-shatter-morph ${className}`.trim(), style, ...domProps }, children || (words && words[0]));
});
ShatterMorphText.displayName = 'ShatterMorphText';

/**
 * <MoActionBadge> — Viral Magnetic Micro-Interaction Copy Badge with Confetti & Haptic Chime.
 */
export const MoActionBadge = forwardRef(function MoActionBadge({
  children,
  as = 'button',
  copyText,
  successText = 'Copied!',
  confetti = true,
  sound = true,
  magnetic = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new MoActionBadgeCore(el, { copyText, successText, confetti, sound, magnetic });
    return () => inst.destroy();
  }, [copyText, successText, confetti, sound, magnetic]);

  return createElement(as, { ref: mergedRef, className: `mo-action-badge ${className}`.trim(), style, ...domProps }, children);
});
MoActionBadge.displayName = 'MoActionBadge';

/**
 * <MoText> — The Unified 2-Line Text Effects Component.
 */

/**
 * <KineticOutlineText> — 3D Parallax Outline with Pop Accent Drop Shadow.
 */
export const KineticOutlineText = forwardRef(function KineticOutlineText({
  children,
  as = 'span',
  color = '#f7f7f2',
  accent = '#9cff00',
  thickness = 1.5,
  depth = 10,
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new KineticOutlineCore(el, { color, accent, thickness, depth, interactive });
    return () => inst.destroy();
  }, [color, accent, thickness, depth, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-kinetic-outline ${className}`.trim(), style, ...domProps }, children);
});
KineticOutlineText.displayName = 'KineticOutlineText';

/**
 * <LiquidMetalText> — Shimmering Liquid Chrome & Molten Metal Sheen.
 */
export const LiquidMetalText = forwardRef(function LiquidMetalText({
  children,
  as = 'span',
  colors = ['#ffffff', '#8d9aa6', '#ffffff', '#26323b'],
  speed = 6,
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new LiquidMetalCore(el, { colors, speed, interactive });
    return () => inst.destroy();
  }, [JSON.stringify(colors), speed, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-liquid-metal ${className}`.trim(), style, ...domProps }, children);
});
LiquidMetalText.displayName = 'LiquidMetalText';

/**
 * <EditorialSplitText> — Split-Plane Dual Typography with Interactive Sliding Offset.
 */
export const EditorialSplitText = forwardRef(function EditorialSplitText({
  children,
  as = 'span',
  accent = '#d8ff3e',
  gap = '0.18em',
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new EditorialSplitCore(el, { accent, gap, interactive });
    return () => inst.destroy();
  }, [accent, gap, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-editorial-split ${className}`.trim(), style, ...domProps }, children);
});
EditorialSplitText.displayName = 'EditorialSplitText';

/**
 * <NoiseTypeText> — Atmospheric Procedural Noise Glow with Analog Dispersion.
 */
export const NoiseTypeText = forwardRef(function NoiseTypeText({
  children,
  as = 'span',
  color = '#f5f5f0',
  accent = '#ff5c35',
  intensity = 0.35,
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new NoiseTypeCore(el, { color, accent, intensity, interactive });
    return () => inst.destroy();
  }, [color, accent, intensity, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-noise-type ${className}`.trim(), style, ...domProps }, children);
});
NoiseTypeText.displayName = 'NoiseTypeText';

/**
 * <VariableCapsText> — Dynamic Interactive Font Weight & Variable Caps Modulation.
 */
export const VariableCapsText = forwardRef(function VariableCapsText({
  children,
  as = 'span',
  minWeight = 300,
  maxWeight = 900,
  interactive = true,
  className = '',
  style,
  ...domProps
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const inst = new VariableCapsCore(el, { minWeight, maxWeight, interactive });
    return () => inst.destroy();
  }, [minWeight, maxWeight, interactive]);

  return createElement(as, { ref: mergedRef, className: `mo-variable-caps ${className}`.trim(), style, ...domProps }, children);
});
VariableCapsText.displayName = 'VariableCapsText';

export const MoText = forwardRef(function MoText({
  effect = 'liquid-sheen',
  children,
  ...props
}, ref) {
  switch (effect.toLowerCase()) {
    case 'liquid-sheen':
    case 'liquid-gradient':
    case 'sheen':
      return createElement(LiquidSheenText, { ref, ...props }, children);

    case 'offset-shadow':
    case 'shadow':
    case 'pop-shadow':
      return createElement(OffsetShadowText, { ref, ...props }, children);

    case 'glitch':
    case 'chromatic-glitch':
    case 'matrix-glitch':
      return createElement(ChromaticGlitchText, { ref, ...props }, children);

    case 'stepped-depth':
    case 'stepped':
    case 'pill-stack':
      return createElement(SteppedDepthText, { ref, ...props }, children);

    case 'isometric-3d':
    case 'isometric':
    case 'color-fonts':
    case '3d':
      return createElement(Isometric3DText, { ref, ...props }, children);

    case 'neon':
    case 'neon-flicker':
    case 'glow':
      return createElement(NeonFlickerText, { ref, ...props }, children);

    case 'clay':
    case 'soft-clay':
    case 'deboss':
    case 'claymorphic':
      return createElement(SoftClayDebossText, { ref, ...props }, children);

    case 'wireframe-stack':
    case 'wireframe':
    case 'pop-line':
    case 'line-stack':
      return createElement(WireframeStackText, { ref, ...props }, children);

    case 'aurora':
    case 'aurora-gradient':
    case 'borealis':
      return createElement(AuroraGradientText, { ref, ...props }, children);

    case 'avant-garde':
    case 'avant':
    case 'modular-glyph':
    case 'mix':
      return createElement(AvantGardeText, { ref, ...props }, children);

    case 'dot-matrix':
    case 'led-matrix':
    case 'led':
    case 'digital-matrix':
      return createElement(DotMatrixLedText, { ref, ...props }, children);

    case 'liquid-refraction':
    case 'refraction':
    case 'lens':
    case 'glass-lens':
      return createElement(LiquidRefractionText, { ref, ...props }, children);

    case 'variable-physics':
    case 'variable':
    case 'font-wave':
    case 'elastic-font':
      return createElement(VariablePhysicsText, { ref, ...props }, children);

    case 'shatter-morph':
    case 'shatter':
    case 'morph':
    case 'explode':
      return createElement(ShatterMorphText, { ref, ...props }, children);

    
    case 'kinetic-outline':
    case 'outline':
      return createElement(KineticOutlineText, { ref, ...props }, children);

    case 'liquid-metal':
    case 'chrome':
    case 'metal':
      return createElement(LiquidMetalText, { ref, ...props }, children);

    case 'editorial-split':
    case 'split':
      return createElement(EditorialSplitText, { ref, ...props }, children);

    case 'noise-type':
    case 'noise':
      return createElement(NoiseTypeText, { ref, ...props }, children);

    case 'variable-caps':
    case 'caps':
      return createElement(VariableCapsText, { ref, ...props }, children);

    case 'action-badge':
    case 'badge':
    case 'copy-badge':
      return createElement(MoActionBadge, { ref, ...props }, children);

    default:
      return createElement(LiquidSheenText, { ref, ...props }, children);
  }
});
MoText.displayName = 'MoText';



