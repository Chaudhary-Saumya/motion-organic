import {
  useState,
  useEffect,
  useRef,
  Children,
  isValidElement,
  createElement,
} from 'react';
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
 * <MoScene> — Individual scene container for <MoPortal>
 */
export function MoScene({ id, children, className = '', style = {} }) {
  return createElement(
    'div',
    {
      'data-mo-scene-id': id,
      className: `mo-scene ${className}`.trim(),
      style: {
        width: '100%',
        height: '100%',
        ...style,
      },
    },
    children
  );
}

MoScene.displayName = 'MoScene';

/**
 * <MoPortal> — Seamless declarative dual-scene transition container.
 * Orchestrates incoming and outgoing views in real-time perspective/aperture space
 * without manual DOM refs.
 *
 * @example
 * ```jsx
 * <MoPortal activeScene={currentTab} transition="device-morph" sound="whoosh">
 *   <MoScene id="home"><HomePage /></MoScene>
 *   <MoScene id="about"><AboutPage /></MoScene>
 * </MoPortal>
 * ```
 */
export function MoPortal({
  activeScene,
  transition = 'organic-blob',
  preset = 'silk',
  sound = null,
  stiffness = 140,
  damping = 18,
  className = '',
  style = {},
  children,
  onTransitionStart,
  onTransitionEnd,
  ...restOptions
}) {
  const containerRef = useRef(null);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const activeInstanceRef = useRef(null);

  // Parse scenes from children
  const sceneMap = new Map();
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.props && child.props.id) {
      sceneMap.set(child.props.id, child);
    }
  });

  const [currentSceneId, setCurrentSceneId] = useState(activeScene);
  const [prevSceneId, setPrevSceneId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (activeScene !== currentSceneId && !isTransitioning) {
      setPrevSceneId(currentSceneId);
      setCurrentSceneId(activeScene);
      setIsTransitioning(true);
      onTransitionStart?.(currentSceneId, activeScene);
    }
  }, [activeScene, currentSceneId, isTransitioning, onTransitionStart]);

  useEffect(() => {
    if (!isTransitioning || !prevSceneId || !containerRef.current) return;

    const TransitionClass = TRANSITION_REGISTRY[transition] || OrganicBlobPortal;
    const instance = new TransitionClass({
      container: containerRef.current,
      currentPageEl: fromRef.current,
      nextPageEl: toRef.current,
      fromEl: fromRef.current,
      toEl: toRef.current,
      stiffness,
      damping,
      preset,
      sound: sound || undefined,
      ...restOptions,
    });

    activeInstanceRef.current = instance;

    let isMounted = true;

    // Trigger the dual-scene transition
    instance.trigger(null, () => {
      // Called at midpoint / full coverage
    }).then(() => {
      if (isMounted) {
        setIsTransitioning(false);
        setPrevSceneId(null);
        onTransitionEnd?.(currentSceneId);
        instance.destroy?.();
        activeInstanceRef.current = null;
      }
    });

    return () => {
      isMounted = false;
      instance.destroy?.();
      activeInstanceRef.current = null;
    };
  }, [isTransitioning, prevSceneId, currentSceneId, transition, preset, sound, stiffness, damping]);

  const activeChild = sceneMap.get(currentSceneId) || null;
  const prevChild = prevSceneId ? sceneMap.get(prevSceneId) : null;

  return createElement(
    'div',
    {
      ref: containerRef,
      className: `mo-portal-container ${className}`.trim(),
      style: {
        position: 'relative',
        width: '100%',
        minHeight: '100%',
        overflow: 'hidden',
        ...style,
      },
    },
    // If transitioning, render both scenes stacked
    isTransitioning && prevChild
      ? [
          createElement(
            'div',
            {
              key: `from-${prevSceneId}`,
              ref: fromRef,
              style: {
                position: 'absolute',
                inset: '0',
                width: '100%',
                height: '100%',
                zIndex: '1',
              },
            },
            prevChild
          ),
          createElement(
            'div',
            {
              key: `to-${currentSceneId}`,
              ref: toRef,
              style: {
                position: 'relative',
                width: '100%',
                height: '100%',
                zIndex: '2',
              },
            },
            activeChild
          ),
        ]
      : createElement(
          'div',
          {
            key: `active-${currentSceneId}`,
            style: {
              width: '100%',
              height: '100%',
            },
          },
          activeChild
        )
  );
}

MoPortal.displayName = 'MoPortal';
