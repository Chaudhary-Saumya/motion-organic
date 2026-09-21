import { useState, useEffect, useRef, useCallback } from 'react';
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

const TRANSITION_REGISTRY = {
  'organic-blob':           OrganicBlobPortal,
  'text-portal':            TextPortalZoom,
  'card-expand':            CardExpandPortal,
  'liquid-tear':            LiquidTearPeel,
  'horizon-cylinder':       HorizonCylinderRoll,
  'metaball-merge':         MetaballMergePortal,
  'ribbon-slice':           RibbonSliceWeave,
  'concentric-halo':        ConcentricHaloPortal,
  'liquid-blob':            LiquidBlobTransition,
  'aperture-iris':          ApertureIrisTransition,
  'rack-focus':             RackFocusTransition,
  'curtain-peel':           CurtainPeelTransition,
  'chromatic-fluid':        ChromaticFluidDisplacement,
  'dimensional-tunnel':     DimensionalTunnelWarp,
  'neural-synapse':         NeuralSynapseBloom,
  'crosshair-zoom':         CrosshairZoom,
  'column-cascade':         ColumnarCascade,
  'pixel-dissolve':         PixelDissolve,
  'diagonal-razor':         DiagonalRazorWipe,
  'noise-dissolve':         NoiseDisintegration,
  'shutter-stack':          ShutterStack,
  'typo-shatter':           TypographicShatter,
  'elementis-shutter':      ElementisShutterWipe,
  'mew-slash':              MewDiagonalSlash,
  'oscar-bubble':           OscarLiquidBubblePortal,
  'device-morph':           DeviceMorphPortal,
  'device-portal':          DeviceMorphPortal,
  'device-frame':           DeviceMorphPortal,
  'chromatic-curtain':      ChromaticCurtainCascade,
  'multi-column-wipe':      ChromaticCurtainCascade,
  'gradient-cascade':       ChromaticCurtainCascade,
  'aurora-wave':            AuroraWavePortal,
  'prism-glass':            PrismGlassRefraction,
  'cyber-deck':             CyberDeckOverlap,
  'fluid-morph-convex':     FluidMorphConvex,
  'orbital-eclipse':        OrbitalEclipseSweep,
  'velocity-wipe':          VelocityWipeTransition,
  'split-flap':             SplitFlapTransition,
  'soft-focus':             SoftFocusTransition,
  'radial-focus':           RadialFocusTransition,
};

/**
 * usePageTransition — Drop-in React Hook for smooth organic page transitions.
 *
 * @example
 * ```jsx
 * const { trigger, isAnimating, attachGesture } = usePageTransition('curtain-peel', {
 *   direction: 'bottom-right',
 *   sound: true,
 * });
 *
 * return (
 *   <button onClick={(e) => trigger(e, () => navigate('/destination'))}>
 *     Next Page
 *   </button>
 * );
 * ```
 */
export function usePageTransition(transitionType = 'text-portal', options = {}) {
  // Support overload: usePageTransition({ transition: 'curtain-peel', preset: 'silk' })
  let resolvedType = transitionType;
  let resolvedOptions = options;

  if (typeof transitionType === 'object' && transitionType !== null) {
    resolvedType = transitionType.transition || 'text-portal';
    resolvedOptions = transitionType;
  }

  const [isAnimating, setIsAnimating] = useState(false);
  const transitionRef = useRef(null);

  useEffect(() => {
    const TransitionClass = typeof resolvedType === 'string'
      ? (TRANSITION_REGISTRY[resolvedType] || TextPortalZoom)
      : resolvedType;

    transitionRef.current = new TransitionClass(resolvedOptions);

    return () => {
      transitionRef.current?.destroy();
      transitionRef.current = null;
    };
  }, [resolvedType, JSON.stringify(resolvedOptions)]);

  const trigger = useCallback(async (event, onCovered) => {
    if (isAnimating || !transitionRef.current) return;
    setIsAnimating(true);
    try {
      await transitionRef.current.trigger(event, onCovered);
    } finally {
      setIsAnimating(false);
    }
  }, [isAnimating]);

  const render = useCallback((t) => {
    transitionRef.current?.render(t);
  }, []);

  const attachScroll = useCallback((zoneEl, scrollOptions) => {
    return transitionRef.current?.attachScroll(zoneEl, scrollOptions);
  }, []);

  const attachGesture = useCallback((element, gestureOptions) => {
    return transitionRef.current?.attachGesture(element, gestureOptions);
  }, []);

  return {
    trigger,
    render,
    attachScroll,
    attachGesture,
    isAnimating,
    instance: transitionRef.current,
  };
}
