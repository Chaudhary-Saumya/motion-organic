/**
 * registry.js — Central registry mapping declarative `data-mo` attribute names
 * to transition classes, primitives, and text effects.
 */

// ─── Transitions ────────────────────────────────────────────────────────────
import { OrganicBlobPortal } from '../transitions/organicBlobPortal.js';
import { TextPortalZoom } from '../transitions/textPortalZoom.js';
import { CardExpandPortal } from '../transitions/cardExpandPortal.js';
import { LiquidTearPeel } from '../transitions/liquidTearPeel.js';
import { HorizonCylinderRoll } from '../transitions/horizonCylinderRoll.js';
import { MetaballMergePortal } from '../transitions/metaballMergePortal.js';
import { RibbonSliceWeave } from '../transitions/ribbonSliceWeave.js';
import { ConcentricHaloPortal } from '../transitions/concentricHaloPortal.js';
import { LiquidBlobTransition } from '../transitions/liquidBlob.js';
import { ApertureIrisTransition } from '../transitions/apertureIris.js';
import { RackFocusTransition } from '../transitions/rackFocus.js';
import { CurtainPeelTransition } from '../transitions/curtainPeel.js';
import { ChromaticFluidDisplacement } from '../transitions/chromaticFluid.js';
import { DimensionalTunnelWarp } from '../transitions/dimensionalTunnel.js';
import { NeuralSynapseBloom } from '../transitions/neuralSynapse.js';
import { CrosshairZoom } from '../transitions/crosshairZoom.js';
import { ColumnarCascade } from '../transitions/columnarCascade.js';
import { PixelDissolve } from '../transitions/pixelDissolve.js';
import { DiagonalRazorWipe } from '../transitions/diagonalRazorWipe.js';
import { NoiseDisintegration } from '../transitions/noiseDisintegration.js';
import { ShutterStack } from '../transitions/shutterStack.js';
import { TypographicShatter } from '../transitions/typographicShatter.js';
import { ElementisShutterWipe } from '../transitions/elementisShutterWipe.js';
import { MewDiagonalSlash } from '../transitions/mewDiagonalSlash.js';
import { OscarLiquidBubblePortal } from '../transitions/oscarLiquidBubblePortal.js';
import { DeviceMorphPortal } from '../transitions/deviceMorphPortal.js';
import { ChromaticCurtainCascade } from '../transitions/chromaticCurtainCascade.js';
import { AuroraWavePortal } from '../transitions/auroraWavePortal.js';
import { PrismGlassRefraction } from '../transitions/prismGlassRefraction.js';
import { CyberDeckOverlap } from '../transitions/cyberDeckOverlap.js';
import { FluidMorphConvex } from '../transitions/fluidMorphConvex.js';
import { OrbitalEclipseSweep } from '../transitions/orbitalEclipseSweep.js';
import { VelocityWipeTransition, SplitFlapTransition, SoftFocusTransition, RadialFocusTransition } from '../transitions/precisionTransitions.js';

// ─── Primitives ─────────────────────────────────────────────────────────────
import { MagneticCursor } from '../primitives/magneticCursor.js';
import { CharacterWaveText } from '../primitives/characterWaveText.js';
import { ElasticScrollReveal } from '../primitives/elasticScrollReveal.js';
import { HorizonDrum } from '../primitives/horizonDrum.js';
import { DepthParallax } from '../primitives/depthParallax.js';
import { DeviceFrame } from '../primitives/deviceFrame.js';
import {
  OrbitalEclipseLoader,
  MorphingMetaballLoader,
  CyberMatrixScanLoader,
  QuantumSpinLoader,
  MinimalPulsePillLoader,
} from '../primitives/loaders.js';

// ─── Text Effects Suite ─────────────────────────────────────────────────────
import { LiquidSheenText } from '../primitives/liquidSheenText.js';
import { OffsetShadowText } from '../primitives/offsetShadowText.js';
import { ChromaticGlitchText } from '../primitives/chromaticGlitchText.js';
import { SteppedDepthText } from '../primitives/steppedDepthText.js';
import { Isometric3DText } from '../primitives/isometric3dText.js';
import { NeonFlickerText } from '../primitives/neonFlickerText.js';
import { SoftClayDebossText } from '../primitives/softClayDebossText.js';
import { WireframeStackText } from '../primitives/wireframeStackText.js';
import { AuroraGradientText } from '../primitives/auroraGradientText.js';
import { AvantGardeText } from '../primitives/avantGardeText.js';
import { DotMatrixLedText } from '../primitives/dotMatrixLedText.js';
import { LiquidRefractionText } from '../primitives/liquidRefractionText.js';
import { VariablePhysicsText } from '../primitives/variablePhysicsText.js';
import { ShatterMorphText } from '../primitives/shatterMorphText.js';
import { MoActionBadge } from '../primitives/actionBadge.js';
import { KineticOutlineText, LiquidMetalText, EditorialSplitText, NoiseTypeText, VariableCapsText } from '../primitives/premiumText.js';

/**
 * Common options available across all transitions
 */
const COMMON_OPTIONS = {
  'sound':             'sound',
  'preset':            'preset',
  'stiffness':         'stiffness',
  'damping':           'damping',
};

/**
 * Transition registry.
 */
export const TRANSITION_REGISTRY = {
  'organic-blob': {
    ctor: OrganicBlobPortal,
    optionMap: {
      ...COMMON_OPTIONS,
      'points':            'points',
      'wobble':            'wobbleIntensity',
      'wobble-intensity':  'wobbleIntensity',
      'rim':               'rimColor',
      'rim-color':         'rimColor',
    },
  },
  'text-portal': {
    ctor: TextPortalZoom,
    optionMap: {
      ...COMMON_OPTIONS,
      'word':              'word',
      'scale':             'maxScale',
      'max-scale':         'maxScale',
      'font-size':         'fontSize',
      'font-family':       'fontFamily',
      'font-weight':       'fontWeight',
      'fill':              'fillColor',
      'fill-color':        'fillColor',
      'fade-at':           'textFadeOutAt',
    },
  },
  'card-expand': {
    ctor: CardExpandPortal,
    optionMap: {
      ...COMMON_OPTIONS,
      'width':             'initialWidth',
      'initial-width':     'initialWidth',
      'height':            'initialHeight',
      'initial-height':    'initialHeight',
      'radius':            'initialRadius',
      'initial-radius':    'initialRadius',
    },
  },
  'liquid-tear': {
    ctor: LiquidTearPeel,
    optionMap: {
      ...COMMON_OPTIONS,
      'angle':             'tearAngle',
      'tear-angle':        'tearAngle',
      'wobble':            'wobble',
    },
  },
  'horizon-cylinder': {
    ctor: HorizonCylinderRoll,
    optionMap: {
      ...COMMON_OPTIONS,
      'perspective':       'perspective',
    },
  },
  'metaball-merge': {
    ctor: MetaballMergePortal,
    optionMap: {
      ...COMMON_OPTIONS,
      'count':             'count',
      'color':             'color',
    },
  },
  'ribbon-slice': {
    ctor: RibbonSliceWeave,
    optionMap: {
      ...COMMON_OPTIONS,
      'slices':            'slices',
    },
  },
  'concentric-halo': {
    ctor: ConcentricHaloPortal,
    optionMap: {
      ...COMMON_OPTIONS,
      'rings':             'rings',
    },
  },
  'liquid-blob': {
    ctor: LiquidBlobTransition,
    optionMap: {
      ...COMMON_OPTIONS,
      'color':             'color',
      'points':            'points',
      'wobble':            'wobbleIntensity',
      'wobble-intensity':  'wobbleIntensity',
    },
  },
  'aperture-iris': {
    ctor: ApertureIrisTransition,
    optionMap: {
      ...COMMON_OPTIONS,
      'blades':            'blades',
      'color':             'color',
    },
  },
  'rack-focus': {
    ctor: RackFocusTransition,
    optionMap: {
      ...COMMON_OPTIONS,
      'blur':              'maxBlur',
      'max-blur':          'maxBlur',
    },
  },
  'curtain-peel': {
    ctor: CurtainPeelTransition,
    optionMap: {
      ...COMMON_OPTIONS,
      'direction':         'direction',
      'fabric':            'fabricColor',
      'fabric-color':      'fabricColor',
      'accent':            'accentColor',
      'accent-color':      'accentColor',
    },
  },
  'chromatic-fluid': {
    ctor: ChromaticFluidDisplacement,
    optionMap: {
      ...COMMON_OPTIONS,
      'distortion':        'maxDistortion',
      'max-distortion':    'maxDistortion',
    },
  },
  'dimensional-tunnel': {
    ctor: DimensionalTunnelWarp,
    optionMap: {
      ...COMMON_OPTIONS,
      'layers':            'layers',
      'color':             'tunnelColor',
      'tunnel-color':      'tunnelColor',
    },
  },
  'neural-synapse': {
    ctor: NeuralSynapseBloom,
    optionMap: {
      ...COMMON_OPTIONS,
      'color':             'synapseColor',
      'synapse-color':     'synapseColor',
      'branches':          'branches',
    },
  },
  'crosshair-zoom': {
    ctor: CrosshairZoom,
    optionMap: {
      ...COMMON_OPTIONS,
      'bracket-color':     'bracketColor',
      'bracket-size':      'bracketSize',
      'bracket-thickness': 'bracketThickness',
      'color':             'overlayColor',
      'overlay-color':     'overlayColor',
      'grid-lines':        'gridLines',
    },
  },
  'column-cascade': {
    ctor: ColumnarCascade,
    optionMap: {
      ...COMMON_OPTIONS,
      'columns':           'columns',
      'cols':              'columns',
      'direction':         'direction',
      'color':             'color',
      'accent':            'accentColor',
      'accent-color':      'accentColor',
      'stagger':           'stagger',
    },
  },
  'pixel-dissolve': {
    ctor: PixelDissolve,
    optionMap: {
      ...COMMON_OPTIONS,
      'grid-size':         'gridSize',
      'scatter':           'scatter',
      'rotate-max':        'rotateMax',
      'color':             'color',
      'fade-order':        'fadeOrder',
    },
  },
  'diagonal-razor': {
    ctor: DiagonalRazorWipe,
    optionMap: {
      ...COMMON_OPTIONS,
      'angle':             'angle',
      'color':             'color',
      'edge-shadow':       'edgeShadow',
      'edge-color':        'edgeColor',
    },
  },
  'noise-dissolve': {
    ctor: NoiseDisintegration,
    optionMap: {
      ...COMMON_OPTIONS,
      'grain-scale':       'grainScale',
      'color':             'noiseColor',
      'noise-color':       'noiseColor',
      'displacement':      'displacement',
    },
  },
  'shutter-stack': {
    ctor: ShutterStack,
    optionMap: {
      ...COMMON_OPTIONS,
      'bands':             'bands',
      'color':             'color',
      'accent':            'accentColor',
      'accent-color':      'accentColor',
      'stagger':           'stagger',
    },
  },
  'typo-shatter': {
    ctor: TypographicShatter,
    optionMap: {
      ...COMMON_OPTIONS,
      'word':              'word',
      'font-size':         'fontSize',
      'font-weight':       'fontWeight',
      'font-family':       'fontFamily',
      'text-color':        'textColor',
      'bg-color':          'bgColor',
      'scatter-radius':    'scatterRadius',
    },
  },
  'elementis-shutter': {
    ctor: ElementisShutterWipe,
    optionMap: {
      ...COMMON_OPTIONS,
      'bands':             'bands',
      'color':             'color',
      'accent':            'accentColor',
      'accent-color':      'accentColor',
      'stagger':           'stagger',
    },
  },
  'mew-slash': {
    ctor: MewDiagonalSlash,
    optionMap: {
      ...COMMON_OPTIONS,
      'slashes':           'slashCount',
      'color':             'color',
      'accent':            'accentColor',
      'accent-color':      'accentColor',
      'angle':             'angle',
      'jaggedness':        'jaggedness',
    },
  },
  'oscar-bubble': {
    ctor: OscarLiquidBubblePortal,
    optionMap: {
      ...COMMON_OPTIONS,
      'points':            'points',
      'wobble':            'wobble',
      'rim':               'rimColor',
      'rim-color':         'rimColor',
      'mask-color':        'maskColor',
    },
  },
  'device-morph': {
    ctor: DeviceMorphPortal,
    optionMap: {
      ...COMMON_OPTIONS,
      'accent':            'accentColor',
      'accent-color':      'accentColor',
      'border-color':      'borderColor',
      'pitch-angle':       'pitchAngle',
      'roll-angle':        'rollAngle',
      'curve-radius':      'curveRadius',
    },
  },
  'device-portal': {
    ctor: DeviceMorphPortal,
    optionMap: {
      ...COMMON_OPTIONS,
      'accent':            'accentColor',
      'accent-color':      'accentColor',
      'border-color':      'borderColor',
      'pitch-angle':       'pitchAngle',
      'roll-angle':        'rollAngle',
    },
  },
  'chromatic-curtain': {
    ctor: ChromaticCurtainCascade,
    optionMap: {
      ...COMMON_OPTIONS,
      'colors':            'colors',
      'accent-colors':     'accentColors',
      'accent-bars':       'accentBars',
      'direction':         'direction',
      'stagger':           'stagger',
    },
  },
  'multi-column-wipe': {
    ctor: ChromaticCurtainCascade,
    optionMap: {
      ...COMMON_OPTIONS,
      'colors':            'colors',
      'accent-colors':     'accentColors',
      'accent-bars':       'accentBars',
      'direction':         'direction',
      'stagger':           'stagger',
    },
  },
  'gradient-cascade': {
    ctor: ChromaticCurtainCascade,
    optionMap: {
      ...COMMON_OPTIONS,
      'colors':            'colors',
      'accent-colors':     'accentColors',
      'accent-bars':       'accentBars',
      'direction':         'direction',
      'stagger':           'stagger',
    },
  },
  'aurora-wave': {
    ctor: AuroraWavePortal,
    optionMap: {
      ...COMMON_OPTIONS,
      'colors':            'colors',
      'waves':             'waveCount',
      'wave-count':        'waveCount',
      'amplitude':         'amplitude',
    },
  },
  'prism-glass': {
    ctor: PrismGlassRefraction,
    optionMap: {
      ...COMMON_OPTIONS,
      'blur':              'blur',
      'tint':              'tint',
      'edge-glow':         'edgeGlow',
    },
  },
  'cyber-deck': {
    ctor: CyberDeckOverlap,
    optionMap: {
      ...COMMON_OPTIONS,
      'card-colors':       'cardColors',
      'accent':            'accentColor',
      'accent-color':      'accentColor',
    },
  },
  'fluid-morph-convex': {
    ctor: FluidMorphConvex,
    optionMap: {
      ...COMMON_OPTIONS,
      'colors':            'colors',
    },
  },
  'orbital-eclipse': {
    ctor: OrbitalEclipseSweep,
    optionMap: {
      ...COMMON_OPTIONS,
      'color':             'color',
      'corona':            'coronaColor',
      'corona-color':      'coronaColor',
    },
  },
  'velocity-wipe': { ctor: VelocityWipeTransition, optionMap: { ...COMMON_OPTIONS, 'color': 'color', 'direction': 'direction' } },
  'split-flap': { ctor: SplitFlapTransition, optionMap: { ...COMMON_OPTIONS, 'color': 'color' } },
  'soft-focus': { ctor: SoftFocusTransition, optionMap: { ...COMMON_OPTIONS, 'color': 'color', 'blur': 'blur' } },
  'radial-focus': { ctor: RadialFocusTransition, optionMap: { ...COMMON_OPTIONS, 'color': 'color', 'origin-x': 'originX', 'origin-y': 'originY' } },
};

/**
 * Primitive registry.
 */
export const PRIMITIVE_REGISTRY = {
  'magnetic': {
    ctor: MagneticCursor,
    elBased: true,
    optionMap: {
      'radius':            'radius',
      'strength':          'strength',
      'stiffness':         'stiffness',
      'damping':           'damping',
    },
  },
  'wave': {
    ctor: CharacterWaveText,
    elBased: true,
    optionMap: {
      'wave-width':        'waveWidth',
    },
  },
  'reveal': {
    ctor: ElasticScrollReveal,
    elBased: true,
    optionMap: {
      'stiffness':         'stiffness',
      'damping':           'damping',
      'once':              'once',
    },
  },
  'horizon': {
    ctor: HorizonDrum,
    elBased: true,
    optionMap: {
      'radius':            'radius',
      'perspective':       'perspective',
      'pitch-factor':      'pitchFactor',
      'depth-factor':      'depthFactor',
      'shading':           'shading',
      'origin-offset':     'originOffset',
    },
  },
  'spatial': {
    ctor: HorizonDrum,
    elBased: true,
    optionMap: {
      'radius':            'radius',
      'perspective':       'perspective',
      'pitch-factor':      'pitchFactor',
      'depth-factor':      'depthFactor',
      'shading':           'shading',
      'origin-offset':     'originOffset',
    },
  },
  'parallax': {
    ctor: DepthParallax,
    elBased: true,
    isParallax: true,
    optionMap: {},
  },
  'device-frame': {
    ctor: DeviceFrame,
    elBased: true,
    optionMap: {
      'width':             'width',
      'height':            'height',
      'bezel-radius':      'bezelRadius',
      'border-color':      'borderColor',
      'accent-color':      'accentColor',
      'max-tilt':          'maxTilt',
      'interactive':       'interactive',
    },
  },
  'loader-eclipse': {
    ctor: OrbitalEclipseLoader,
    elBased: true,
    optionMap: {
      'size':              'size',
      'primary-color':     'primaryColor',
      'secondary-color':   'secondaryColor',
      'accent-color':      'accentColor',
      'speed':             'speed',
    },
  },
  'loader-metaball': {
    ctor: MorphingMetaballLoader,
    elBased: true,
    optionMap: {
      'size':              'size',
      'color':             'color',
      'accent-color':      'accentColor',
      'speed':             'speed',
    },
  },
  'loader-cyber': {
    ctor: CyberMatrixScanLoader,
    elBased: true,
    optionMap: {
      'size':              'size',
      'color':             'color',
      'glow-color':        'glowColor',
      'telemetry':         'telemetry',
    },
  },
  'loader-quantum': {
    ctor: QuantumSpinLoader,
    elBased: true,
    optionMap: {
      'size':              'size',
      'color':             'color',
      'secondary-color':   'secondaryColor',
    },
  },
  'loader-pill': {
    ctor: MinimalPulsePillLoader,
    elBased: true,
    optionMap: {
      'width':             'width',
      'height':            'height',
      'gradient':          'gradient',
      'bg-color':          'bgColor',
    },
  },
};

/**
 * Text Effect registry (for `data-mo-text="..."`).
 */
export const TEXT_EFFECT_REGISTRY = {
  'liquid-sheen': {
    ctor: LiquidSheenText,
    optionMap: {
      'outline-color':     'outlineColor',
      'outline-width':     'outlineWidth',
      'sheen-color':       'sheenColor',
      'speed':             'speed',
      'interactive':       'interactive',
    },
  },
  'liquid-gradient': {
    ctor: LiquidSheenText,
    optionMap: {
      'outline-color':     'outlineColor',
      'outline-width':     'outlineWidth',
      'sheen-color':       'sheenColor',
      'speed':             'speed',
      'interactive':       'interactive',
    },
  },
  'offset-shadow': {
    ctor: OffsetShadowText,
    optionMap: {
      'text-color':        'textColor',
      'magenta':           'magentaColor',
      'magenta-color':     'magentaColor',
      'cyan':              'cyanColor',
      'cyan-color':        'cyanColor',
      'offset':            'offset',
      'interactive':       'interactive',
    },
  },
  'shadow': {
    ctor: OffsetShadowText,
    optionMap: {
      'text-color':        'textColor',
      'magenta':           'magentaColor',
      'cyan':              'cyanColor',
      'offset':            'offset',
    },
  },
  'glitch': {
    ctor: ChromaticGlitchText,
    optionMap: {
      'top-color':         'topColor',
      'mid-color':         'midColor',
      'bot-color':         'botColor',
      'hover-surge':       'hoverSurge',
      'intensity':         'intensity',
    },
  },
  'chromatic-glitch': {
    ctor: ChromaticGlitchText,
    optionMap: {
      'top-color':         'topColor',
      'mid-color':         'midColor',
      'bot-color':         'botColor',
      'hover-surge':       'hoverSurge',
      'intensity':         'intensity',
    },
  },
  'stepped-depth': {
    ctor: SteppedDepthText,
    optionMap: {
      'color':             'color',
      'layers':            'layers',
      'step-distance':     'stepDistance',
      'direction':         'direction',
      'interactive':       'interactive',
    },
  },
  'stepped': {
    ctor: SteppedDepthText,
    optionMap: {
      'color':             'color',
      'layers':            'layers',
      'step-distance':     'stepDistance',
      'direction':         'direction',
    },
  },
  'isometric-3d': {
    ctor: Isometric3DText,
    optionMap: {
      'front-color':       'frontColor',
      'front':             'frontColor',
      'top-color':         'topColor',
      'top':               'topColor',
      'side-color':        'sideColor',
      'side':              'sideColor',
      'depth':             'depth',
      'interactive':       'interactive',
    },
  },
  'isometric': {
    ctor: Isometric3DText,
    optionMap: {
      'front-color':       'frontColor',
      'front':             'frontColor',
      'top-color':         'topColor',
      'top':               'topColor',
      'side-color':        'sideColor',
      'side':              'sideColor',
      'depth':             'depth',
    },
  },
  'neon': {
    ctor: NeonFlickerText,
    optionMap: {
      'color':             'color',
      'core-color':        'coreColor',
      'flicker':           'flicker',
      'glow-intensity':    'glowIntensity',
    },
  },
  'neon-flicker': {
    ctor: NeonFlickerText,
    optionMap: {
      'color':             'color',
      'core-color':        'coreColor',
      'flicker':           'flicker',
      'glow-intensity':    'glowIntensity',
    },
  },
  'clay': {
    ctor: SoftClayDebossText,
    optionMap: {
      'bg-color':          'bgColor',
      'bg':                'bgColor',
      'text-color':        'textColor',
      'color':             'textColor',
      'depth':             'depth',
      'softness':          'softness',
      'interactive':       'interactive',
    },
  },
  'soft-clay': {
    ctor: SoftClayDebossText,
    optionMap: {
      'bg-color':          'bgColor',
      'text-color':        'textColor',
      'depth':             'depth',
      'softness':          'softness',
    },
  },
  'deboss': {
    ctor: SoftClayDebossText,
    optionMap: {
      'bg-color':          'bgColor',
      'text-color':        'textColor',
      'depth':             'depth',
      'softness':          'softness',
    },
  },
  'wireframe-stack': {
    ctor: WireframeStackText,
    optionMap: {
      'cyan':              'cyanColor',
      'cyan-color':        'cyanColor',
      'magenta':           'magentaColor',
      'magenta-color':     'magentaColor',
      'stroke':            'strokeColor',
      'stroke-color':      'strokeColor',
      'stroke-width':      'strokeWidth',
      'layers':            'layers',
      'offset':            'offset',
      'interactive':       'interactive',
    },
  },
  'wireframe': {
    ctor: WireframeStackText,
    optionMap: {
      'cyan':              'cyanColor',
      'magenta':           'magentaColor',
      'stroke':            'strokeColor',
      'stroke-width':      'strokeWidth',
      'layers':            'layers',
      'offset':            'offset',
    },
  },
  'pop-line': {
    ctor: WireframeStackText,
    optionMap: {
      'cyan':              'cyanColor',
      'magenta':           'magentaColor',
      'stroke':            'strokeColor',
      'stroke-width':      'strokeWidth',
    },
  },
  'aurora': {
    ctor: AuroraGradientText,
    optionMap: {
      'colors':            'colors',
      'speed':             'speed',
      'glow':              'glow',
      'interactive':       'interactive',
    },
  },
  'aurora-gradient': {
    ctor: AuroraGradientText,
    optionMap: {
      'colors':            'colors',
      'speed':             'speed',
      'glow':              'glow',
      'interactive':       'interactive',
    },
  },
  'avant-garde': {
    ctor: AvantGardeText,
    optionMap: {
      'color':             'color',
      'accent':            'accentColor',
      'accent-color':      'accentColor',
      'letter-spacing':    'letterSpacing',
      'interactive':       'interactive',
    },
  },
  'avant': {
    ctor: AvantGardeText,
    optionMap: {
      'color':             'color',
      'accent':            'accentColor',
      'letter-spacing':    'letterSpacing',
    },
  },
  'modular-glyph': {
    ctor: AvantGardeText,
    optionMap: {
      'color':             'color',
      'accent':            'accentColor',
      'letter-spacing':    'letterSpacing',
    },
  },
  'dot-matrix': {
    ctor: DotMatrixLedText,
    optionMap: {
      'color':             'color',
      'inactive-color':    'inactiveColor',
      'dot-size':          'dotSize',
      'gap':               'gap',
      'glow':              'glow',
      'flicker':           'flicker',
      'interactive':       'interactive',
    },
  },
  'led-matrix': {
    ctor: DotMatrixLedText,
    optionMap: {
      'color':             'color',
      'inactive-color':    'inactiveColor',
      'dot-size':          'dotSize',
      'gap':               'gap',
      'glow':              'glow',
      'flicker':           'flicker',
    },
  },
  'led': {
    ctor: DotMatrixLedText,
    optionMap: {
      'color':             'color',
      'inactive-color':    'inactiveColor',
      'dot-size':          'dotSize',
      'gap':               'gap',
    },
  },
  'liquid-refraction': {
    ctor: LiquidRefractionText,
    optionMap: {
      'lens-radius':       'lensRadius',
      'viscosity':         'viscosity',
      'chromatic':         'chromaticAberration',
      'color':             'color',
      'highlight-color':   'highlightColor',
      'interactive':       'interactive',
    },
  },
  'refraction': {
    ctor: LiquidRefractionText,
    optionMap: {
      'lens-radius':       'lensRadius',
      'viscosity':         'viscosity',
      'chromatic':         'chromaticAberration',
      'color':             'color',
    },
  },
  'variable-physics': {
    ctor: VariablePhysicsText,
    optionMap: {
      'min-weight':        'minWeight',
      'max-weight':        'maxWeight',
      'elasticity':        'elasticity',
      'damping':           'damping',
      'radius':            'radius',
      'slant':             'slant',
      'wave':              'continuousWave',
      'interactive':       'interactive',
    },
  },
  'variable': {
    ctor: VariablePhysicsText,
    optionMap: {
      'min-weight':        'minWeight',
      'max-weight':        'maxWeight',
      'elasticity':        'elasticity',
      'damping':           'damping',
    },
  },
  'shatter-morph': {
    ctor: ShatterMorphText,
    optionMap: {
      'words':             'words',
      'trigger':           'trigger',
      'interval':          'interval',
      'force':             'explosionForce',
      'sound':             'sound',
    },
  },
  'shatter': {
    ctor: ShatterMorphText,
    optionMap: {
      'words':             'words',
      'trigger':           'trigger',
      'force':             'explosionForce',
      'sound':             'sound',
    },
  },
  'action-badge': {
    ctor: MoActionBadge,
    optionMap: {
      'copy':              'copyText',
      'success':           'successText',
      'confetti':          'confetti',
      'sound':             'sound',
      'magnetic':          'magnetic',
    },
  },
  'kinetic-outline': { ctor: KineticOutlineText, optionMap: { 'color': 'color', 'accent': 'accent', 'thickness': 'thickness', 'depth': 'depth', 'interactive': 'interactive' } },
  'liquid-metal': { ctor: LiquidMetalText, optionMap: { 'colors': 'colors', 'speed': 'speed', 'interactive': 'interactive' } },
  'editorial-split': { ctor: EditorialSplitText, optionMap: { 'accent': 'accent', 'gap': 'gap', 'interactive': 'interactive' } },
  'noise-type': { ctor: NoiseTypeText, optionMap: { 'color': 'color', 'accent': 'accent', 'intensity': 'intensity', 'interactive': 'interactive' } },
  'variable-caps': { ctor: VariableCapsText, optionMap: { 'min-weight': 'minWeight', 'max-weight': 'maxWeight', 'interactive': 'interactive' } },
};
