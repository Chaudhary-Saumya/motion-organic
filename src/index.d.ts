// Core Physics, Sound & Morph
export class Spring {
  constructor(config?: { stiffness?: number; damping?: number; mass?: number; precision?: number });
  setTarget(target: number): void;
  snapTo(value: number): void;
  update(dt?: number): boolean;
  value: number;
  target: number;
}

export const engine: {
  add(cb: (dt: number, time: number) => void): () => void;
  remove(cb: (dt: number, time: number) => void): void;
  start(): void;
  stop(): void;
};

export const MoAudio: {
  play(profile?: string, options?: { velocity?: number; volume?: number }): void;
  setVolume(vol: number): void;
  mute(shouldMute?: boolean): void;
};

export const SPRING_PRESETS: Record<string, { stiffness: number; damping: number; mass: number }>;
export function configureMotion(options?: Record<string, any>): void;
export function isReducedMotionPreferred(): boolean;
export const globalMotionConfig: Record<string, any>;

export function samplePath(d: string, numPoints?: number): Array<{ x: number; y: number }>;
export function interpolatePoints(pA: Array<{ x: number; y: number }>, pB: Array<{ x: number; y: number }>, progress: number): Array<{ x: number; y: number }>;
export function pointsToSmoothPath(points: Array<{ x: number; y: number }>, close?: boolean): string;
export class ShapeMorph {
  constructor(pathA: SVGPathElement | string | any, pathB: SVGPathElement | string | any, options?: { points?: number; smooth?: boolean });
  at(progress: number): string;
  to(progress: number): string;
}


export const scrollTracker: {
  y: number;
  x: number;
  velocity: number;
  velocityX: number;
  speed: number;
  direction: number;
  directionX: number;
  acceleration: number;
  isScrolling: boolean;
  subscribe(cb: (tracker: any) => void): () => void;
  progressOf(el: HTMLElement, options?: { offsetStart?: number; offsetEnd?: number }): number;
  isInViewport(el: HTMLElement, margin?: number): boolean;
};

export class SpatialHorizon {
  constructor(options?: {
    radius?: number;
    perspective?: number;
    orientation?: 'vertical' | 'horizontal' | 'spherical';
    shading?: boolean;
    stiffness?: number;
    damping?: number;
  });
  add(el: HTMLElement, options?: {
    radius?: number;
    perspective?: number;
    depthFactor?: number;
    pitchFactor?: number;
    shading?: boolean;
    originOffset?: number;
    onUpdate?: (metrics: any) => void;
  }): () => void;
  remove(el: HTMLElement): void;
  start(): void;
  stop(): void;
  destroy(): void;
}

export const spatialHorizon: SpatialHorizon;

// Base & Controllers
export class PageTransition {
  constructor(options?: Record<string, any>);
  trigger(event?: MouseEvent | { clientX: number; clientY: number }, onCovered?: () => void | Promise<void>): Promise<void>;
  render(progress: number): void;
  attachScroll(zoneElement: HTMLElement, options?: Record<string, any>): { destroy: () => void };
  attachGesture(element: HTMLElement, options?: {
    axis?: 'horizontal' | 'vertical' | 'diagonal' | 'auto';
    direction?: 'left' | 'right' | 'up' | 'down' | 'any';
    threshold?: number;
    maxDistance?: number;
    onCommit?: () => void;
    onCancel?: () => void;
  }): { destroy: () => void };
  enableAudio(profile?: string, volume?: number): this;
  applyPreset(presetName: 'silk' | 'liquid' | 'snappy' | 'cinematic' | 'bouncy' | 'gentle'): this;
  destroy(): void;
}

export class ScrollTransitionController {
  constructor(zoneElement: HTMLElement, callbacks: { render: (t: number) => void; onComplete?: () => void; onReset?: () => void }, options?: Record<string, any>);
  destroy(): void;
}

export class InteractiveDragController {
  constructor(element: HTMLElement, callbacks: { render: (t: number) => void; onCommit?: () => void; onCancel?: () => void }, options?: Record<string, any>);
  destroy(): void;
}

// 22 Active Transitions
export class OrganicBlobPortal extends PageTransition {}
export class TextPortalZoom extends PageTransition {}
export class CardExpandPortal extends PageTransition {}
export class LiquidTearPeel extends PageTransition {}
export class HorizonCylinderRoll extends PageTransition {}
export class MetaballMergePortal extends PageTransition {}
export class RibbonSliceWeave extends PageTransition {}
export class ConcentricHaloPortal extends PageTransition {}
export class LiquidBlobTransition extends PageTransition {}
export class ApertureIrisTransition extends PageTransition {}
export class RackFocusTransition extends PageTransition {}
export class CurtainPeelTransition extends PageTransition {}
export class ChromaticFluidDisplacement extends PageTransition {}
export class DimensionalTunnelWarp extends PageTransition {}
export class NeuralSynapseBloom extends PageTransition {}
export class CrosshairZoom extends PageTransition {}
export class ColumnarCascade extends PageTransition {}
export class PixelDissolve extends PageTransition {}
export class DiagonalRazorWipe extends PageTransition {}
export class NoiseDisintegration extends PageTransition {}
export class ShutterStack extends PageTransition {}
export class TypographicShatter extends PageTransition {}
export class ElementisShutterWipe extends PageTransition {}
export class MewDiagonalSlash extends PageTransition {}
export class OscarLiquidBubblePortal extends PageTransition {}
export class DeviceMorphPortal extends PageTransition {}
export class ChromaticCurtainCascade extends PageTransition {}
export class AuroraWavePortal extends PageTransition {}
export class PrismGlassRefraction extends PageTransition {}
export class CyberDeckOverlap extends PageTransition {}
export class FluidMorphConvex extends PageTransition {}
export class OrbitalEclipseSweep extends PageTransition {}
export class VelocityWipeTransition extends PageTransition {}
export class SplitFlapTransition extends PageTransition {}
export class SoftFocusTransition extends PageTransition {}
export class RadialFocusTransition extends PageTransition {}

export class KineticOutlineText { constructor(element: HTMLElement, options?: { color?: string; accent?: string; thickness?: number; depth?: number; interactive?: boolean }); destroy(): void; }
export class LiquidMetalText { constructor(element: HTMLElement, options?: { colors?: string[]; speed?: number; interactive?: boolean }); destroy(): void; }
export class EditorialSplitText { constructor(element: HTMLElement, options?: { accent?: string; gap?: string; interactive?: boolean }); destroy(): void; }
export class NoiseTypeText { constructor(element: HTMLElement, options?: { color?: string; accent?: string; intensity?: number; interactive?: boolean }); destroy(): void; }
export class VariableCapsText { constructor(element: HTMLElement, options?: { minWeight?: number; maxWeight?: number; interactive?: boolean }); destroy(): void; }

// 2-Line Cinema-Grade Text Effects Suite
export class LiquidSheenText {
  constructor(element: HTMLElement, options?: {
    colors?: string[];
    outlineColor?: string;
    outlineWidth?: number;
    sheenColor?: string;
    speed?: number;
    interactive?: boolean;
  });
  destroy(): void;
}

export class OffsetShadowText {
  constructor(element: HTMLElement, options?: {
    textColor?: string;
    magentaColor?: string;
    cyanColor?: string;
    offset?: number;
    interactive?: boolean;
    stiffness?: number;
    damping?: number;
  });
  destroy(): void;
}

export class ChromaticGlitchText {
  constructor(element: HTMLElement, options?: {
    topColor?: string;
    midColor?: string;
    botColor?: string;
    hoverSurge?: boolean;
    intensity?: number;
  });
  destroy(): void;
}

export class SteppedDepthText {
  constructor(element: HTMLElement, options?: {
    color?: string;
    layers?: number;
    stepDistance?: number;
    direction?: 'bottom-right' | 'bottom-left' | 'bottom';
    interactive?: boolean;
  });
  destroy(): void;
}

export class Isometric3DText {
  constructor(element: HTMLElement, options?: {
    frontColor?: string;
    topColor?: string;
    sideColor?: string;
    shadowColor?: string;
    depth?: number;
    interactive?: boolean;
  });
  destroy(): void;
}

export class NeonFlickerText {
  constructor(element: HTMLElement, options?: {
    color?: string;
    coreColor?: string;
    flicker?: boolean;
    glowIntensity?: number;
  });
  destroy(): void;
}

export class SoftClayDebossText {
  constructor(element: HTMLElement, options?: {
    bgColor?: string;
    textColor?: string;
    depth?: number;
    softness?: number;
    interactive?: boolean;
  });
  destroy(): void;
}

export class WireframeStackText {
  constructor(element: HTMLElement, options?: {
    cyanColor?: string;
    magentaColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    layers?: number;
    offset?: number;
    interactive?: boolean;
  });
  destroy(): void;
}

export class AuroraGradientText {
  constructor(element: HTMLElement, options?: {
    colors?: string[];
    speed?: number;
    glow?: boolean;
    interactive?: boolean;
  });
  destroy(): void;
}

export class AvantGardeText {
  constructor(element: HTMLElement, options?: {
    color?: string;
    accentColor?: string;
    letterSpacing?: number;
    interactive?: boolean;
  });
  destroy(): void;
}

export class DotMatrixLedText {
  constructor(element: HTMLElement, options?: {
    color?: string;
    inactiveColor?: string;
    dotSize?: number;
    gap?: number;
    glow?: boolean;
    flicker?: boolean;
    interactive?: boolean;
  });
  destroy(): void;
}

export class LiquidRefractionText {
  constructor(element: HTMLElement, options?: {
    lensRadius?: number;
    viscosity?: number;
    chromaticAberration?: number;
    color?: string;
    highlightColor?: string;
    interactive?: boolean;
  });
  destroy(): void;
}

export class VariablePhysicsText {
  constructor(element: HTMLElement, options?: {
    minWeight?: number;
    maxWeight?: number;
    elasticity?: number;
    damping?: number;
    radius?: number;
    slant?: boolean;
    continuousWave?: boolean;
    interactive?: boolean;
  });
  destroy(): void;
}

export class ShatterMorphText {
  constructor(element: HTMLElement, options?: {
    words?: string[];
    trigger?: 'click' | 'hover' | 'auto';
    interval?: number;
    shardCount?: number;
    explosionForce?: number;
    sound?: boolean;
  });
  destroy(): void;
  morphNext(): void;
}

export class MoActionBadge {
  constructor(element: HTMLElement, options?: {
    copyText?: string;
    successText?: string;
    confetti?: boolean;
    sound?: boolean;
    magnetic?: boolean;
  });
  destroy(): void;
}

// Primitives
export class LiquidPageTransition extends PageTransition {}
export class OrganicMaskReveal { constructor(el: HTMLElement, options?: any); destroy(): void; }
export class TextBehindBleed { constructor(el: HTMLElement, options?: any); destroy(): void; }
export class MagneticCursor { constructor(elOrOptions?: HTMLElement | any, options?: any); destroy(): void; }
export class HorizonDrum { constructor(el: HTMLElement, options?: any); update(options?: any): void; destroy(): void; }
export class DeviceFrame { constructor(container: HTMLElement | string, options?: any); destroy(): void; }
export class DepthParallax { constructor(container: HTMLElement, options?: any); destroy(): void; }
export class CharacterWaveText { constructor(el: HTMLElement, options?: any); trigger(): void; destroy(): void; }
export class CursorProgressRing { constructor(options?: any); destroy(): void; }
export class ShapeMorphDivider { constructor(svgEl: SVGElement, options?: any); destroy(): void; }
export class ElasticScrollReveal { constructor(elements: HTMLElement[] | NodeListOf<HTMLElement>, options?: any); destroy(): void; }
