// Core Physics, Sound & Interpolation
export { Spring, clamp01, lerp } from './core/spring.js';
export { engine } from './core/engine.js';
export { samplePath, interpolatePoints, pointsToSmoothPath, ShapeMorph } from './core/morph.js';
export { scrollTracker } from './core/scroll.js';
export { SpatialHorizon, spatialHorizon } from './core/spatialHorizon.js';
export { MoAudio } from './core/sound.js';
export { SPRING_PRESETS, configureMotion, isReducedMotionPreferred, globalMotionConfig } from './core/presets.js';

// Base & Controllers
export { PageTransition } from './transitions/base.js';
export { ScrollTransitionController } from './transitions/scrollController.js';
export { InteractiveDragController } from './transitions/gestureController.js';

// Signature Page Transitions Suite (Organic / Liquid / Spatial / Cinematic)
export { OrganicBlobPortal } from './transitions/organicBlobPortal.js';           // 01. Foodnia Organic Liquid Blob Window Portal
export { TextPortalZoom } from './transitions/textPortalZoom.js';                 // 02. Typography Stencil 55x Dive
export { CardExpandPortal } from './transitions/cardExpandPortal.js';             // 03. Hero Floating Card to Fullscreen Morph
export { LiquidTearPeel } from './transitions/liquidTearPeel.js';                 // 04. Organic Diagonal Liquid Tear & Zipper
export { HorizonCylinderRoll } from './transitions/horizonCylinderRoll.js';       // 05. 3D Cylindrical Horizon Roll / Earth Drum
export { MetaballMergePortal } from './transitions/metaballMergePortal.js';       // 06. SVG Metaballs Liquid Fusion Portal
export { RibbonSliceWeave } from './transitions/ribbonSliceWeave.js';             // 07. Multi-Slice Alternating Ribbon Weave
export { ConcentricHaloPortal } from './transitions/concentricHaloPortal.js';     // 08. Concentric Organic Depth Halo Rings
export { LiquidBlobTransition } from './transitions/liquidBlob.js';               // 09. Viscous Harmonic Bubble
export { ApertureIrisTransition } from './transitions/apertureIris.js';           // 10. Mechanical 9-Blade Iris Shutter
export { RackFocusTransition } from './transitions/rackFocus.js';                 // 11. Optical Depth Rack Focus
export { CurtainPeelTransition } from './transitions/curtainPeel.js';             // 12. Multi-Directional 3D Silk Fabric Peel
export { ChromaticFluidDisplacement } from './transitions/chromaticFluid.js';     // 13. Molten Liquid Glass & Chromatic Aberration
export { DimensionalTunnelWarp } from './transitions/dimensionalTunnel.js';       // 14. Hyperspace 3D Concentric Warp Tunnel
export { NeuralSynapseBloom } from './transitions/neuralSynapse.js';               // 15. Bioluminescent Neural Synapse Network
export { CrosshairZoom } from './transitions/crosshairZoom.js';                   // 16. Cinematic Viewfinder Lock-on & Punch
export { ColumnarCascade } from './transitions/columnarCascade.js';               // 17. Vertical Column Waterfall Cascade
export { PixelDissolve } from './transitions/pixelDissolve.js';                   // 18. Digital Pixel Disintegration & Scatter
export { DiagonalRazorWipe } from './transitions/diagonalRazorWipe.js';           // 19. Razor-Sharp Diagonal Geometric Cut
export { NoiseDisintegration } from './transitions/noiseDisintegration.js';       // 20. Procedural Static Noise Disintegration
export { ShutterStack } from './transitions/shutterStack.js';                     // 21. Mechanical Horizontal Shutter Stack
export { TypographicShatter } from './transitions/typographicShatter.js';         // 22. Explosive Character Typographic Scatter
export { ElementisShutterWipe } from './transitions/elementisShutterWipe.js';       // 23. Fleava Elementis Multi-Slat Venetian Blind Wipe
export { MewDiagonalSlash } from './transitions/mewDiagonalSlash.js';               // 24. Griflan Mew Visceral Diagonal Jagged Claw Slash
export { OscarLiquidBubblePortal } from './transitions/oscarLiquidBubblePortal.js'; // 25. Oscar Pico Viscous Multi-Lobe Liquid Bubble Portal
export { DeviceMorphPortal } from './transitions/deviceMorphPortal.js';             // 26. 3D Device App & Curved Corner Portal Morph
export { ChromaticCurtainCascade } from './transitions/chromaticCurtainCascade.js'; // 27. Webflow NoCodeTribe Multi-Column Chromatic Gradient Curtain Cascade
export { AuroraWavePortal } from './transitions/auroraWavePortal.js';               // 28. Undulating Holographic Aurora Borealis Wave Portal
export { PrismGlassRefraction } from './transitions/prismGlassRefraction.js';       // 29. Frosted Glass Prism Slab & Chromatic Dispersion Rim
export { CyberDeckOverlap } from './transitions/cyberDeckOverlap.js';               // 30. Linear/Vercel Dark-Glass Card Deck Overlap
export { FluidMorphConvex } from './transitions/fluidMorphConvex.js';               // 31. Asymmetrical Organic Convex Fluid Swelling Portal
export { OrbitalEclipseSweep } from './transitions/orbitalEclipseSweep.js'; // 32. Celestial Planetary Eclipse Sweep & Corona Glow
export { VelocityWipeTransition, SplitFlapTransition, SoftFocusTransition, RadialFocusTransition } from './transitions/precisionTransitions.js';

// Premium typography systems
export { KineticOutlineText, LiquidMetalText, EditorialSplitText, NoiseTypeText, VariableCapsText } from './primitives/premiumText.js';


// 2-Line Cinema-Grade Text Effects Suite
export { LiquidSheenText } from './primitives/liquidSheenText.js';                 // Multi-tone fluid gradient + glass sheen
export { OffsetShadowText } from './primitives/offsetShadowText.js';               // Dual chromatic Cyan & Magenta pop-art offset shadows
export { ChromaticGlitchText } from './primitives/chromaticGlitchText.js';         // Tri-color horizontal glitch matrix slices
export { SteppedDepthText } from './primitives/steppedDepthText.js';               // Cascading 3D pastel steps + accordion spring physics
export { Isometric3DText } from './primitives/isometric3dText.js';                 // Faceted 3D voxel block text with top specular cap
export { NeonFlickerText } from './primitives/neonFlickerText.js';                 // Bioluminescent gas tube glow with electrical flicker
export { SoftClayDebossText } from './primitives/softClayDebossText.js';           // Tactile claymorphic inset soft deboss typography
export { WireframeStackText } from './primitives/wireframeStackText.js';           // Pop-art wireframe outline + staggered pink shadow layers
export { AuroraGradientText } from './primitives/auroraGradientText.js';           // Silky horizontal aurora borealis chromatic gradient flow
export { AvantGardeText } from './primitives/avantGardeText.js';                   // Experimental modernist modular glyph typography
export { DotMatrixLedText } from './primitives/dotMatrixLedText.js';               // Phosphorescent digital LED dot matrix raster display
export { LiquidRefractionText } from './primitives/liquidRefractionText.js';       // Optical liquid glass lens with chromatic refraction
export { VariablePhysicsText } from './primitives/variablePhysicsText.js';         // Elastic variable font harmonic spring waves
export { ShatterMorphText } from './primitives/shatterMorphText.js';               // Physical character shard explosion & word morph
export { MoActionBadge } from './primitives/actionBadge.js';                       // Magnetic viral copy badge with haptics & confetti

// Primitives & Organic Effects
export { LiquidPageTransition } from './primitives/liquidPageTransition.js';
export { OrganicMaskReveal } from './primitives/organicMaskReveal.js';
export { TextBehindBleed } from './primitives/textBehindBleed.js';
export { MagneticCursor } from './primitives/magneticCursor.js';
export { HorizonDrum } from './primitives/horizonDrum.js';
export { DeviceFrame } from './primitives/deviceFrame.js';
export { DepthParallax } from './primitives/depthParallax.js';
export { CharacterWaveText } from './primitives/characterWaveText.js';
export { CursorProgressRing } from './primitives/cursorProgressRing.js';
export { ShapeMorphDivider } from './primitives/shapeMorphDivider.js';
export { ElasticScrollReveal } from './primitives/elasticScrollReveal.js';
