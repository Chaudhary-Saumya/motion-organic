import { ReactNode, CSSProperties, Ref, HTMLAttributes, ComponentType } from 'react';
import { PageTransition } from '../index.js';

// ─── Transition Names ───────────────────────────────────────────────────────

export type TransitionName =
  | 'organic-blob'
  | 'text-portal'
  | 'card-expand'
  | 'liquid-tear'
  | 'horizon-cylinder'
  | 'metaball-merge'
  | 'ribbon-slice'
  | 'concentric-halo'
  | 'liquid-blob'
  | 'aperture-iris'
  | 'rack-focus'
  | 'curtain-peel'
  | 'chromatic-fluid'
  | 'dimensional-tunnel'
  | 'neural-synapse'
  | 'crosshair-zoom'
  | 'column-cascade'
  | 'pixel-dissolve'
  | 'diagonal-razor'
  | 'noise-dissolve'
  | 'shutter-stack'
  | 'typo-shatter'
  | 'elementis-shutter'
  | 'mew-slash'
  | 'oscar-bubble'
  | 'device-morph'
  | 'chromatic-curtain'
  | 'multi-column-wipe'
  | 'gradient-cascade'
  | 'aurora-wave'
  | 'prism-glass'
  | 'cyber-deck'
  | 'fluid-morph-convex'
  | 'orbital-eclipse'
  | 'velocity-wipe'
  | 'split-flap'
  | 'soft-focus'
  | 'radial-focus';

// ─── Text Effect Names ─────────────────────────────────────────────────────

export type TextEffectName =
  | 'liquid-sheen'
  | 'liquid-gradient'
  | 'sheen'
  | 'offset-shadow'
  | 'shadow'
  | 'glitch'
  | 'chromatic-glitch'
  | 'stepped-depth'
  | 'stepped'
  | 'isometric-3d'
  | 'isometric'
  | 'color-fonts'
  | 'neon'
  | 'neon-flicker'
  | 'clay'
  | 'soft-clay'
  | 'deboss'
  | 'wireframe-stack'
  | 'wireframe'
  | 'pop-line'
  | 'aurora'
  | 'aurora-gradient'
  | 'avant-garde'
  | 'avant'
  | 'modular-glyph'
  | 'dot-matrix'
  | 'led-matrix'
  | 'led'
  | 'liquid-refraction'
  | 'refraction'
  | 'lens'
  | 'variable-physics'
  | 'variable'
  | 'font-wave'
  | 'shatter-morph'
  | 'shatter'
  | 'morph'
  | 'action-badge'
  | 'badge'
  | 'copy-badge'
  | 'kinetic-outline'
  | 'liquid-metal'
  | 'editorial-split'
  | 'noise-type'
  | 'variable-caps';


// ─── <Mo> Component ─────────────────────────────────────────────────────────

export interface MoProps extends HTMLAttributes<HTMLElement> {
  transition?: TransitionName;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  href?: string;
  onTransition?: () => void;
  disabled?: boolean;
  gesture?: 'horizontal' | 'vertical' | 'diagonal' | 'swipe-left' | 'swipe-right';
  sound?: boolean | string;
  preset?: 'silk' | 'liquid' | 'snappy' | 'cinematic' | 'bouncy' | 'gentle';
  navigateOn?: 'cover' | 'settle';
  viewTransition?: boolean;
  stiffness?: number;
  damping?: number;
  ref?: Ref<HTMLElement>;

  // Optional transition config overrides:
  duration?: number;
  easing?: string;
  color?: string;
  colors?: string[];
  fadeAt?: number;
  textFadeOutAt?: number;
  points?: number;
  wobble?: number;
  wobbleIntensity?: number;
  word?: string;
  scale?: number;
  maxScale?: number;
  fontSize?: string | number;
  fontFamily?: string;
  fontWeight?: string | number;
  fill?: string;
  fillColor?: string;
  rim?: string;
  rimColor?: string;
  originX?: number;
  originY?: number;
  width?: number;
  initialWidth?: number;
  height?: number | string;
  initialHeight?: number;
  radius?: number;
  initialRadius?: number;
  angle?: number;
  tearAngle?: number;
  perspective?: number;
  count?: number;
  slices?: number;
  rings?: number;
  blades?: number;
  blur?: number;
  maxBlur?: number;
  direction?: 'bottom-right' | 'top-left' | 'bottom-left' | 'top-right' | 'left' | 'right' | 'top' | 'bottom';
  fabric?: string;
  fabricColor?: string;
  accent?: string;
  accentColor?: string;
  distortion?: number;
  maxDistortion?: number;
  layers?: number;
  tunnelColor?: string;
  synapseColor?: string;
  branches?: number;
  bracketColor?: string;
  bracketSize?: number;
  bracketThickness?: number;
  overlayColor?: string;
  gridLines?: boolean;
  columns?: number;
  cols?: number;
  stagger?: number;
  gridSize?: number;
  scatter?: number;
  rotateMax?: number;
  fadeOrder?: string;
  edgeShadow?: boolean;
  edgeColor?: string;
  grainScale?: number;
  noiseColor?: string;
  displacement?: number;
  bands?: number;
  textColor?: string;
  bgColor?: string;
  scatterRadius?: number;
  stiffness?: number;
  damping?: number;
}

export const Mo: React.ForwardRefExoticComponent<MoProps>;

// ─── 2-Line Text Effects Components ────────────────────────────────────────

export interface MoTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  effect?: TextEffectName;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  ref?: Ref<HTMLElement>;

  // Liquid Sheen props
  colors?: string[];
  outlineColor?: string;
  outlineWidth?: number;
  sheenColor?: string;
  speed?: number;

  // Offset Shadow props
  textColor?: string;
  cyan?: string;
  cyanColor?: string;
  magenta?: string;
  magentaColor?: string;
  offset?: number;

  // Glitch props
  topColor?: string;
  midColor?: string;
  botColor?: string;
  hoverSurge?: boolean;
  intensity?: number;
  glitchInterval?: number;

  // Stepped Depth props
  color?: string;
  layers?: number;
  stepDistance?: number;
  direction?: 'bottom-right' | 'bottom-left' | 'bottom';

  // Isometric 3D props
  front?: string;
  frontColor?: string;
  top?: string;
  topColor?: string;
  side?: string;
  sideColor?: string;
  depth?: number;

  // Neon props
  coreColor?: string;
  flicker?: boolean;
  glowIntensity?: number;

  // Soft Clay props
  bgColor?: string;
  softness?: number;

  // Wireframe Stack props
  stroke?: string;
  strokeColor?: string;
  strokeWidth?: number;

  // Aurora props
  glow?: boolean;

  // Avant-Garde props
  accentColor?: string;
  letterSpacing?: number;

  // Dot Matrix props
  inactiveColor?: string;
  dotSize?: number;
  gap?: number;

  interactive?: boolean;
}

export const MoText: React.ForwardRefExoticComponent<MoTextProps>;

export interface LiquidSheenTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  colors?: string[];
  outlineColor?: string;
  outlineWidth?: number;
  offset?: number;
  sheenColor?: string;
  speed?: number;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
}
export const LiquidSheenText: React.ForwardRefExoticComponent<LiquidSheenTextProps>;

export interface OffsetShadowTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  textColor?: string;
  cyan?: string;
  cyanColor?: string;
  magenta?: string;
  magentaColor?: string;
  offset?: number;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
}
export const OffsetShadowText: React.ForwardRefExoticComponent<OffsetShadowTextProps>;

export interface ChromaticGlitchTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  textColor?: string;
  topColor?: string;
  midColor?: string;
  botColor?: string;
  hoverSurge?: boolean;
  intensity?: number;
  glitchInterval?: number;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
}
export const ChromaticGlitchText: React.ForwardRefExoticComponent<ChromaticGlitchTextProps>;

export interface SteppedDepthTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  color?: string;
  colors?: string[];
  layers?: number;
  stepDistance?: number;
  direction?: 'bottom-right' | 'bottom-left' | 'bottom';
  offset?: number;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
}
export const SteppedDepthText: React.ForwardRefExoticComponent<SteppedDepthTextProps>;

export interface Isometric3DTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  front?: string;
  frontColor?: string;
  top?: string;
  topColor?: string;
  side?: string;
  sideColor?: string;
  depth?: number;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
}
export const Isometric3DText: React.ForwardRefExoticComponent<Isometric3DTextProps>;

export interface NeonFlickerTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  color?: string;
  coreColor?: string;
  flicker?: boolean;
  glowIntensity?: number;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
}
export const NeonFlickerText: React.ForwardRefExoticComponent<NeonFlickerTextProps>;

export interface SoftClayDebossTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  bgColor?: string;
  textColor?: string;
  depth?: number;
  softness?: number;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
}
export const SoftClayDebossText: React.ForwardRefExoticComponent<SoftClayDebossTextProps>;

export interface WireframeStackTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  cyan?: string;
  cyanColor?: string;
  magenta?: string;
  magentaColor?: string;
  stroke?: string;
  strokeColor?: string;
  strokeWidth?: number;
  layers?: number;
  offset?: number;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
}
export const WireframeStackText: React.ForwardRefExoticComponent<WireframeStackTextProps>;

export interface AuroraGradientTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  colors?: string[];
  speed?: number;
  glow?: boolean;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
}
export const AuroraGradientText: React.ForwardRefExoticComponent<AuroraGradientTextProps>;

export interface AvantGardeTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  color?: string;
  accentColor?: string;
  letterSpacing?: number;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
}
export const AvantGardeText: React.ForwardRefExoticComponent<AvantGardeTextProps>;

export interface DotMatrixLedTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  color?: string;
  inactiveColor?: string;
  dotSize?: number;
  gap?: number;
  glow?: boolean;
  flicker?: boolean;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
}
export const DotMatrixLedText: React.ForwardRefExoticComponent<DotMatrixLedTextProps>;

export interface LiquidRefractionTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  lensRadius?: number;
  viscosity?: number;
  chromaticAberration?: number;
  color?: string;
  highlightColor?: string;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
}
export const LiquidRefractionText: React.ForwardRefExoticComponent<LiquidRefractionTextProps>;

export interface VariablePhysicsTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  minWeight?: number;
  maxWeight?: number;
  elasticity?: number;
  damping?: number;
  radius?: number;
  slant?: boolean;
  continuousWave?: boolean;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
}
export const VariablePhysicsText: React.ForwardRefExoticComponent<VariablePhysicsTextProps>;

export interface ShatterMorphTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  words?: string[];
  trigger?: 'click' | 'hover' | 'auto';
  interval?: number;
  shardCount?: number;
  explosionForce?: number;
  sound?: boolean;
  ref?: Ref<HTMLElement>;
}
export const ShatterMorphText: React.ForwardRefExoticComponent<ShatterMorphTextProps>;

export interface MoActionBadgeProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  copyText?: string;
  successText?: string;
  confetti?: boolean;
  sound?: boolean;
  magnetic?: boolean;
  ref?: Ref<HTMLElement>;
}
export const MoActionBadge: React.ForwardRefExoticComponent<MoActionBadgeProps>;

export interface KineticOutlineTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  color?: string;
  accent?: string;
  thickness?: number;
  depth?: number;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
  [key: string]: any;
}
export const KineticOutlineText: React.ForwardRefExoticComponent<KineticOutlineTextProps>;

export interface LiquidMetalTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  colors?: string[];
  speed?: number;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
  [key: string]: any;
}
export const LiquidMetalText: React.ForwardRefExoticComponent<LiquidMetalTextProps>;

export interface EditorialSplitTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  accent?: string;
  gap?: string;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
  [key: string]: any;
}
export const EditorialSplitText: React.ForwardRefExoticComponent<EditorialSplitTextProps>;

export interface NoiseTypeTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  color?: string;
  accent?: string;
  intensity?: number;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
  [key: string]: any;
}
export const NoiseTypeText: React.ForwardRefExoticComponent<NoiseTypeTextProps>;

export interface VariableCapsTextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  minWeight?: number;
  maxWeight?: number;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
  [key: string]: any;
}
export const VariableCapsText: React.ForwardRefExoticComponent<VariableCapsTextProps>;


// ─── Primitive Components ───────────────────────────────────────────────────

export interface MagneticProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  radius?: number;
  strength?: number;
  stiffness?: number;
  damping?: number;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  ref?: Ref<HTMLElement>;
}
export const Magnetic: React.ForwardRefExoticComponent<MagneticProps>;

export interface WaveProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  waveWidth?: number;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  ref?: Ref<HTMLElement>;
}
export const Wave: React.ForwardRefExoticComponent<WaveProps>;

export interface RevealProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  stiffness?: number;
  damping?: number;
  once?: boolean;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  ref?: Ref<HTMLElement>;
}
export const Reveal: React.ForwardRefExoticComponent<RevealProps>;

export interface ParallaxProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  speed?: number;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  ref?: Ref<HTMLElement>;
}
export const Parallax: React.ForwardRefExoticComponent<ParallaxProps>;

// ─── Advanced / Programmatic API ────────────────────────────────────────────

export interface UsePageTransitionReturn {
  trigger: (event?: any, onCovered?: () => void | Promise<void>) => Promise<void>;
  render: (progress: number) => void;
  attachScroll: (zoneEl: HTMLElement, scrollOptions?: any) => { destroy: () => void };
  attachGesture: (element: HTMLElement, gestureOptions?: any) => { destroy: () => void };
  isAnimating: boolean;
  instance: PageTransition | null;
}

export function usePageTransition(
  transitionType?: TransitionName | string | (new (options?: any) => PageTransition),
  options?: Record<string, any>
): UsePageTransitionReturn;

export interface ScrollTransitionZoneProps {
  children?: ReactNode;
  transition?: TransitionName | string | (new (options?: any) => PageTransition);
  options?: Record<string, any>;
  scrollOptions?: Record<string, any>;
  height?: string;
  className?: string;
  style?: CSSProperties;
}

export function ScrollTransitionZone(props: ScrollTransitionZoneProps): JSX.Element;

// ─── 3D Cylindrical Horizon & Spatial Perspective Suite ─────────────────────

export interface MoHorizonProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  radius?: number;
  perspective?: number;
  orientation?: 'vertical' | 'horizontal' | 'spherical';
  shading?: boolean;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  ref?: Ref<HTMLElement>;
}
export const MoHorizon: React.ForwardRefExoticComponent<MoHorizonProps>;
export const MoSpatial: React.ForwardRefExoticComponent<MoHorizonProps>;

export interface MoHorizonItemProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  radius?: number;
  perspective?: number;
  depthFactor?: number;
  pitchFactor?: number;
  shading?: boolean;
  originOffset?: number;
  onUpdate?: (metrics: { theta: number; z: number; opacity: number; inView: boolean }) => void;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  ref?: Ref<HTMLElement>;
}
export const MoHorizonItem: React.ForwardRefExoticComponent<MoHorizonItemProps>;
export const MoHorizonSection: React.ForwardRefExoticComponent<MoHorizonItemProps>;
export const MoSpatialLayer: React.ForwardRefExoticComponent<MoHorizonItemProps>;

export function useSpatialPerspective(
  targetRef: Ref<HTMLElement> | { current: HTMLElement | null },
  options?: Partial<MoHorizonItemProps>
): void;

export function useMoHorizonContext(): { horizon: any; active: boolean };

// ─── 3D Device App & Curved Corner Portal Suite ──────────────────────────

export interface MoDeviceFrameProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  width?: number | string;
  height?: number | string;
  bezelRadius?: number;
  borderColor?: string;
  accentColor?: string;
  maxTilt?: number;
  interactive?: boolean;
}
export function MoDeviceFrame(props: MoDeviceFrameProps): JSX.Element;

export interface MoChatFeedProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}
export function MoChatFeed(props: MoChatFeedProps): JSX.Element;

export interface MoChatBubbleProps extends HTMLAttributes<HTMLElement> {
  text: string;
  sender?: 'user' | 'agent';
  avatar?: ReactNode | string;
  timestamp?: string;
  accentColor?: string;
  onClick?: () => void;
}
export function MoChatBubble(props: MoChatBubbleProps): JSX.Element;

export interface MoCurvedPortalProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  curveRadius?: string;
  borderColor?: string;
  glowColor?: string;
}
export function MoCurvedPortal(props: MoCurvedPortalProps): JSX.Element;

// ─── Dual-Scene Declarative Portal Container ─────────────────────────────────

export interface MoSceneProps extends HTMLAttributes<HTMLElement> {
  id: string | number;
  children: ReactNode;
}
export function MoScene(props: MoSceneProps): JSX.Element;

export interface MoPortalProps extends HTMLAttributes<HTMLElement> {
  activeScene: string | number;
  transition?: TransitionName;
  preset?: 'silk' | 'liquid' | 'snappy' | 'cinematic' | 'bouncy' | 'gentle';
  sound?: boolean | string;
  stiffness?: number;
  damping?: number;
  children: ReactNode;
  onTransitionStart?: (fromId: string | number, toId: string | number) => void;
  onTransitionEnd?: (activeId: string | number) => void;
}
export function MoPortal(props: MoPortalProps): JSX.Element;

