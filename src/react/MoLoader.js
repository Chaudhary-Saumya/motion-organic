import { useRef, useEffect, createElement, forwardRef } from 'react';
import {
  LOADER_CATALOG,
  QuantumChronosWormholeLoader as VanillaWormhole,
  ObsidianLiquidCausticLoader as VanillaObsidian,
  MagLevSuperconductorLoader as VanillaMagLev,
  HyperPrismDispersionLoader as VanillaDispersion,
  HoloPrismCrystalLoader as VanillaPrism,
  OrbitalEclipseLoader as VanillaEclipse,
  MorphingMetaballLoader as VanillaMetaball,
  CyberMatrixScanLoader as VanillaCyber,
  QuantumSpinLoader as VanillaQuantum,
  MinimalPulsePillLoader as VanillaPill,
  NeuralSynapseLoader as VanillaSynapse,
  LiquidMercuryDropletLoader as VanillaMercury,
  AuraRingsConcentricLoader as VanillaAura,
  HyperLoopDNAHelixLoader as VanillaHelix,
  IsometricCubeStackLoader as VanillaCube,
  DotMatrixWaveLoader as VanillaDotWave,
  RadialEqualizerWaveLoader as VanillaRadialEq,
  InfinityMorphRibbonLoader as VanillaInfinity,
  GlitchTerminalMatrixLoader as VanillaGlitch,
  SonarPulseEchoLoader as VanillaSonar,
  ShatterAssembleLoader as VanillaShatter,
  ParticleSupernovaLoader as VanillaSupernova,
  HypercubeTesseractLoader as VanillaTesseract,
  MoLoadingScreen as VanillaLoadingScreen,
  AwwwardsKineticOdometerVaultScreen as VanillaKineticOdometer,
  AwwwardsLiquidChromiumCounterScreen as VanillaLiquidChromium,
  AwwwardsSplitFlapChronometerScreen as VanillaSplitFlap,
  AwwwardsCurvedCurtainScreen as VanillaCurvedCurtainScreen,
  AwwwardsDoubleLiquidWaveCurtainScreen as VanillaDoubleCurtainScreen,
  AwwwardsIridescentLiquidMeshCurtainScreen as VanillaIridescentCurtainScreen,
  LiquidWaveTextScreen as VanillaLiquidWaveTextScreen,
  ArchitecturalVenetianScreen as VanillaVenetianScreen,
  CyberpunkBiometricHoloScreen as VanillaHoloScreen,
  AwwwardsFilmRollNegativeScreen as VanillaFilmScreen,
  AwwwardsTypographyStencilPortalScreen as VanillaStencilScreen,
  AwwwardsMetaballBioFusionScreen as VanillaBioFusionScreen,
  AwwwardsDiagonalRazorShutterScreen as VanillaDiagonalShutterScreen,
  KineticTypoStaggerCascadeScreen as VanillaKineticScreen,
  MoltenLiquidChromeBlobScreen as VanillaChromeBlobScreen,
  AwwwardsChromaticGlitchWarpScreen as VanillaChromaticWarpScreen,
  AwwwardsBrutalistEditorialScissorScreen as VanillaScissorScreen,
  AwwwardsMagneticSingularityVortexScreen as VanillaSingularityScreen,
  AwwwardsFluidMeshGradientBlobScreen as VanillaFluidMeshScreen,
  AwwwardsPrismGeodesicUnfoldScreen as VanillaGeodesicScreen,
  AwwwardsNeoTokyoHoloDeckScreen as VanillaHoloDeckScreen,
} from '../primitives/loaders.js';

function useMergedRef(refA, refB) {
  return (instance) => {
    [refA, refB].forEach((r) => {
      if (!r) return;
      if (typeof r === 'function') r(instance);
      else r.current = instance;
    });
  };
}

/**
 * <MoLoader> — Universal Next-Gen Cinema Loading Animation Component (23 Archetypes).
 */
export const MoLoader = forwardRef(function MoLoader({
  type = 'wormhole',
  size,
  color,
  secondaryColor,
  accentColor,
  coreColor,
  speed,
  progress,
  telemetry = true,
  interactive = true,
  particleCount,
  className = '',
  style,
  as = 'div',
  ...rest
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);
  const instanceRef = useRef(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const LoaderClass = LOADER_CATALOG[type] || LOADER_CATALOG['wormhole'];
    const instance = new LoaderClass(el, {
      size,
      color,
      secondaryColor,
      accentColor,
      coreColor,
      speed,
      telemetry,
      interactive,
      particleCount,
    });
    instanceRef.current = instance;

    if (type === 'pill' && progress !== undefined && typeof instance.setProgress === 'function') {
      instance.setProgress(progress);
    }

    return () => {
      if (instance?.destroy) instance.destroy();
    };
  }, [type, size, color, secondaryColor, accentColor, coreColor, speed, telemetry, interactive, particleCount]);

  useEffect(() => {
    if (type === 'pill' && instanceRef.current && progress !== undefined) {
      instanceRef.current.setProgress(progress);
    }
  }, [progress, type]);

  return createElement(as, { ref: mergedRef, className: `mo-loader mo-loader-${type} ${className}`.trim(), style, ...rest });
});
MoLoader.displayName = 'MoLoader';

// ─── Individual Named React Loader Components ────────────────────────────────
export const QuantumChronosWormholeLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'wormhole', ref }));
export const ObsidianLiquidCausticLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'obsidian', ref }));
export const MagLevSuperconductorLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'maglev', ref }));
export const HyperPrismDispersionLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'dispersion', ref }));
export const SingularityVortexLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'wormhole', ref }));
export const HoloPrismCrystalLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'prism', ref }));
export const OrbitalEclipseLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'eclipse', ref }));
export const MorphingMetaballLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'metaball', ref }));
export const CyberMatrixScanLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'cyber', ref }));
export const QuantumSpinLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'quantum', ref }));
export const MinimalPulsePillLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'pill', ref }));
export const NeuralSynapseLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'synapse', ref }));
export const LiquidMercuryDropletLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'mercury', ref }));
export const AuraRingsConcentricLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'aura', ref }));
export const HyperLoopDNAHelixLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'helix', ref }));
export const IsometricCubeStackLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'cube', ref }));
export const DotMatrixWaveLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'dot-wave', ref }));
export const RadialEqualizerWaveLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'radial-eq', ref }));
export const InfinityMorphRibbonLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'infinity', ref }));
export const GlitchTerminalMatrixLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'glitch', ref }));
export const SonarPulseEchoLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'sonar', ref }));
export const ShatterAssembleLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'shatter', ref }));
export const ParticleSupernovaLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'supernova', ref }));
export const HypercubeTesseractLoader = forwardRef((props, ref) => createElement(MoLoader, { ...props, type: 'tesseract', ref }));

// ─── Awwwards-Winning Fullscreen Experiential Preloader Screens ───────────────

/**
 * <MoLoadingScreen> — Next-Gen Experiential Fullscreen Loading Transition Screen.
 */
export function MoLoadingScreen({
  title = 'ORGANIC MOTION',
  subtitle = 'Initializing cinema physics & spatial shaders...',
  type = 'wormhole',
  accentColor = '#00e5ff',
  bgColor = '#07070b',
  sound = true,
  duration = 2600,
  autoExit = true,
  interactiveGlow = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaLoadingScreen({
      title,
      subtitle,
      type,
      accentColor,
      bgColor,
      sound,
      duration,
      autoExit,
      interactiveGlow,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [title, subtitle, type, accentColor, bgColor, sound, duration, autoExit, interactiveGlow, onComplete]);

  return null;
}

/**
 * <AwwwardsKineticOdometerVaultScreen> — 3D Rolling Mechanical Digit Reels & Live Aurora Plasma Background.
 */
export function AwwwardsKineticOdometerVaultScreen({
  brand = 'ORGANIC MOTION // 2026',
  subtitle = 'HIGH-PRECISION KINETIC RUNTIME',
  accentColor = '#00f0ff',
  secondaryColor = '#ff0077',
  bgColor = '#05060a',
  sound = true,
  duration = 3200,
  interactive = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaKineticOdometer({
      brand,
      subtitle,
      accentColor,
      secondaryColor,
      bgColor,
      sound,
      duration,
      interactive,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [brand, subtitle, accentColor, secondaryColor, bgColor, sound, duration, interactive, onComplete]);

  return null;
}

/**
 * <AwwwardsLiquidChromiumCounterScreen> — Real-Time Liquid Harmonic Wave Masked Inside Monolithic Digits.
 */
export function AwwwardsLiquidChromiumCounterScreen({
  brand = 'CHROMIUM // HYDRODYNAMICS',
  accentColor = '#00e5ff',
  secondaryColor = '#7000ff',
  duration = 3000,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaLiquidChromium({
      brand,
      accentColor,
      secondaryColor,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [brand, accentColor, secondaryColor, duration, sound, onComplete]);

  return null;
}

/**
 * <AwwwardsSplitFlapChronometerScreen> — 3D Airport Mechanical Split-Flap Numeric Chronometer.
 */
export function AwwwardsSplitFlapChronometerScreen({
  brand = 'CHRONO // SPLIT-FLAP',
  accentColor = '#ffb800',
  duration = 3000,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaSplitFlap({
      brand,
      accentColor,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [brand, accentColor, duration, sound, onComplete]);

  return null;
}

/**
 * <AwwwardsCurvedCurtainScreen> — Award-Winning Curved Bezier SVG Liquid Curtain Preloader.
 */
export function AwwwardsCurvedCurtainScreen({
  brand = 'ORGANIC MOTION',
  words = ['CREATIVITY', 'INNOVATION', 'PRECISION', 'EXCELLENCE', 'CINEMA'],
  subtitle = 'HAUTE COUTURE DIGITAL ATELIER',
  accentColor = '#00e5ff',
  secondaryColor = '#ff0077',
  bgColor = '#07070b',
  sound = true,
  interactive = true,
  duration = 3000,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaCurvedCurtainScreen({
      brand,
      words,
      subtitle,
      accentColor,
      secondaryColor,
      bgColor,
      sound,
      interactive,
      duration,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [brand, words, subtitle, accentColor, secondaryColor, bgColor, sound, interactive, duration, onComplete]);

  return null;
}

/**
 * <AwwwardsDoubleLiquidWaveCurtainScreen> — Dual Opposing Liquid Bezier Waves Preloader.
 */
export function AwwwardsDoubleLiquidWaveCurtainScreen({
  brand = 'ATELIER // LIQUID HORIZON',
  words = ['RESONANCE', 'SYNERGY', 'ATMOSPHERE', 'FUTURE'],
  accentColor = '#00e5ff',
  secondaryColor = '#7928ca',
  bgColor = '#06060a',
  duration = 3000,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaDoubleCurtainScreen({
      brand,
      words,
      accentColor,
      secondaryColor,
      bgColor,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [brand, words, accentColor, secondaryColor, bgColor, duration, sound, onComplete]);

  return null;
}

/**
 * <AwwwardsIridescentLiquidMeshCurtainScreen> — 3-Tier Cascading Prismatic Liquid Waves Preloader.
 */
export function AwwwardsIridescentLiquidMeshCurtainScreen({
  brand = 'PRISMATIC FLUID DYNAMICS',
  words = ['SPECTRUM', 'LUMINESCENCE', 'DIFFRACTION', 'ELEGANCE'],
  tier1Color = '#ff0055',
  tier2Color = '#7928ca',
  tier3Color = '#08080d',
  duration = 3200,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaIridescentCurtainScreen({
      brand,
      words,
      tier1Color,
      tier2Color,
      tier3Color,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [brand, words, tier1Color, tier2Color, tier3Color, duration, sound, onComplete]);

  return null;
}

/**
 * <LiquidWaveTextScreen> — Real-time Fluid Dynamics Canvas Slosh Preloader.
 */
export function LiquidWaveTextScreen({
  text = 'ORGANIC',
  subtext = 'CALIBRATING HYDRODYNAMICS',
  waveColor = '#00e5ff',
  bgColor = '#050508',
  duration = 3000,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaLiquidWaveTextScreen({
      text,
      subtext,
      waveColor,
      bgColor,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [text, subtext, waveColor, bgColor, duration, sound, onComplete]);

  return null;
}

/**
 * <ArchitecturalVenetianScreen> — Staggered Multi-Column Glass Shutter Slat Preloader.
 */
export function ArchitecturalVenetianScreen({
  slatCount = 8,
  bgColor = '#09090d',
  sound = true,
  duration = 2600,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaVenetianScreen({
      slatCount,
      bgColor,
      sound,
      duration,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [slatCount, bgColor, sound, duration, onComplete]);

  return null;
}

/**
 * <CyberpunkBiometricHoloScreen> — Tactical Neural HUD & Decrypting Typo Matrix Preloader.
 */
export function CyberpunkBiometricHoloScreen({
  brand = 'CYBER ARCHITECTURE',
  word = 'NEXUS',
  accentColor = '#00ff88',
  secondaryColor = '#00e5ff',
  bgColor = '#040608',
  duration = 2800,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaHoloScreen({
      brand,
      word,
      accentColor,
      secondaryColor,
      bgColor,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [brand, word, accentColor, secondaryColor, bgColor, duration, sound, onComplete]);

  return null;
}

/**
 * <AwwwardsFilmRollNegativeScreen> — 35mm Analog Film Negative Sprocket & Shutter Burn Preloader.
 */
export function AwwwardsFilmRollNegativeScreen({
  brand = '35MM // ARCHIVE',
  subtitle = 'ANALOG OPTICAL REEL • FRAME 024',
  accentColor = '#ff4500',
  duration = 3000,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaFilmScreen({
      brand,
      subtitle,
      accentColor,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [brand, subtitle, accentColor, duration, sound, onComplete]);

  return null;
}

/**
 * <AwwwardsTypographyStencilPortalScreen> — Brutalist Stencil 50x Camera Dive Portal Preloader.
 */
export function AwwwardsTypographyStencilPortalScreen({
  brand = 'DIVE // 2026',
  subtitle = 'IMMERSIVE SPATIAL STENCIL PORTAL',
  accentColor = '#00e5ff',
  duration = 3000,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaStencilScreen({
      brand,
      subtitle,
      accentColor,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [brand, subtitle, accentColor, duration, sound, onComplete]);

  return null;
}

/**
 * <AwwwardsMetaballBioFusionScreen> — Organic Liquid Cellular Goo & Physics Coalescence Preloader.
 */
export function AwwwardsMetaballBioFusionScreen({
  brand = 'BIO // FUSION',
  accentColor = '#00ff88',
  duration = 3000,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaBioFusionScreen({
      brand,
      accentColor,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [brand, accentColor, duration, sound, onComplete]);

  return null;
}

/**
 * <AwwwardsDiagonalRazorShutterScreen> — Luxury Diagonal Mirror Slabs Sheer Reveal Preloader.
 */
export function AwwwardsDiagonalRazorShutterScreen({
  brand = 'ATELIER // MOTION',
  subtitle = 'HIGH PRECISION DIAGONAL SHEER',
  accentColor = '#ffffff',
  duration = 2800,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaDiagonalShutterScreen({
      brand,
      subtitle,
      accentColor,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [brand, subtitle, accentColor, duration, sound, onComplete]);

  return null;
}

/**
 * <KineticTypoStaggerCascadeScreen> — Brutalist Kinetic Typography Marquee & Chronometer Preloader.
 */
export function KineticTypoStaggerCascadeScreen({
  words = ['ORGANIC', 'MOTION', 'PHYSICS', 'FUTURE', 'CINEMA'],
  accentColor = '#ff0055',
  bgColor = '#09090c',
  duration = 2800,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaKineticScreen({
      words,
      accentColor,
      bgColor,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [words, accentColor, bgColor, duration, sound, onComplete]);

  return null;
}


/**
 * <MoltenLiquidChromeBlobScreen> — Molten Viscous Mercury Surface Tension Coalescence Preloader.
 */
export function MoltenLiquidChromeBlobScreen({
  brand = 'MOLTEN CHROME',
  accentColor = '#00e5ff',
  duration = 2800,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaChromeBlobScreen({
      brand,
      accentColor,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [brand, accentColor, duration, sound, onComplete]);

  return null;
}

/**
 * <AwwwardsChromaticGlitchWarpScreen> — Cyberpunk 3D Hyperdrive Warp Tunnel & RGB Aberration Preloader.
 */
export function AwwwardsChromaticGlitchWarpScreen({
  brand = 'HYPERDRIVE // 2026',
  statusText = 'WARPING SPATIAL CHROMATICS',
  accentColor = '#00f0ff',
  secondaryColor = '#ff0077',
  duration = 3000,
  sound = true,
  interactive = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaChromaticWarpScreen({
      brand,
      statusText,
      accentColor,
      secondaryColor,
      duration,
      sound,
      interactive,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [brand, statusText, accentColor, secondaryColor, duration, sound, interactive, onComplete]);

  return null;
}

/**
 * <AwwwardsBrutalistEditorialScissorScreen> — Swiss Brutalist Monolithic Split-Bands Preloader.
 */
export function AwwwardsBrutalistEditorialScissorScreen({
  brands = ['PARIS // TOKYO // MILAN', 'DIGITAL ARCHITECTURE', 'VOL. 2026 // MOTION', 'AVANT-GARDE FLUIDS'],
  accentColor = '#e2ff3b',
  secondaryColor = '#ff2a5f',
  bgColor = '#08080a',
  duration = 3200,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaScissorScreen({
      brands,
      accentColor,
      secondaryColor,
      bgColor,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [brands, accentColor, secondaryColor, bgColor, duration, sound, onComplete]);

  return null;
}

/**
 * <AwwwardsMagneticSingularityVortexScreen> — Gravitational Singularity Canvas Particle Vortex Preloader.
 */
export function AwwwardsMagneticSingularityVortexScreen({
  title = 'GRAVITATIONAL SINGULARITY',
  subtitle = 'ORBITAL ASTROPHYSICS ENGINE',
  particleCount = 220,
  color = '#00f0ff',
  accentColor = '#d65db1',
  duration = 3200,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaSingularityScreen({
      title,
      subtitle,
      particleCount,
      color,
      accentColor,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [title, subtitle, particleCount, color, accentColor, duration, sound, onComplete]);

  return null;
}

/**
 * <AwwwardsFluidMeshGradientBlobScreen> — Viscous Harmonic SVG Fluid Mesh Gradient Iris Preloader.
 */
export function AwwwardsFluidMeshGradientBlobScreen({
  brand = 'LUMEN // FLUID LABS',
  subtext = 'HARMONIC VISCOSITY MATRIX',
  duration = 3000,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaFluidMeshScreen({
      brand,
      subtext,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [brand, subtext, duration, sound, onComplete]);

  return null;
}

/**
 * <AwwwardsPrismGeodesicUnfoldScreen> — 3D Crystalline Vault Origami Facet Preloader.
 */
export function AwwwardsPrismGeodesicUnfoldScreen({
  title = 'PRISM // GEODESIC',
  subtitle = '3D CRYSTALLINE VAULT ARCHITECTURE',
  accentColor = '#00e5ff',
  gemColor = '#9b51e0',
  duration = 3000,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaGeodesicScreen({
      title,
      subtitle,
      accentColor,
      gemColor,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [title, subtitle, accentColor, gemColor, duration, sound, onComplete]);

  return null;
}

/**
 * <AwwwardsNeoTokyoHoloDeckScreen> — Tactical Cyber HUD & Circular Audio Equalizer Preloader.
 */
export function AwwwardsNeoTokyoHoloDeckScreen({
  brand = 'NEO-TOKYO // HUD.V4',
  subtitle = 'QUANTUM NEURAL FREQUENCY LOCK',
  accentColor = '#00ffff',
  warningColor = '#ff0055',
  duration = 3000,
  sound = true,
  onComplete,
}) {
  useEffect(() => {
    const screen = new VanillaHoloDeckScreen({
      brand,
      subtitle,
      accentColor,
      warningColor,
      duration,
      sound,
      onComplete,
    });

    return () => {
      screen.exit();
    };
  }, [brand, subtitle, accentColor, warningColor, duration, sound, onComplete]);

  return null;
}

