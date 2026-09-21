import test from 'node:test';
import assert from 'node:assert/strict';

test('Package Entry Point — motion-organic (src/index.js)', async () => {
  const pkg = await import('../src/index.js');
  
  // 1. Core Physics & Utilities
  assert.ok(pkg.Spring, 'Spring class is exported');
  assert.ok(pkg.engine, 'engine instance is exported');
  assert.ok(pkg.MoAudio, 'MoAudio instance is exported');
  assert.ok(pkg.SPRING_PRESETS, 'SPRING_PRESETS is exported');
  assert.ok(pkg.ShapeMorph, 'ShapeMorph is exported');
  assert.ok(pkg.scrollTracker, 'scrollTracker is exported');
  assert.ok(pkg.SpatialHorizon, 'SpatialHorizon class is exported');
  assert.ok(pkg.spatialHorizon, 'spatialHorizon instance is exported');
  assert.ok(typeof pkg.configureMotion === 'function', 'configureMotion is a function');
  assert.ok(typeof pkg.isReducedMotionPreferred === 'function', 'isReducedMotionPreferred is a function');

  // 2. Base & Controllers
  assert.ok(pkg.PageTransition, 'PageTransition base is exported');
  assert.ok(pkg.ScrollTransitionController, 'ScrollTransitionController is exported');
  assert.ok(pkg.InteractiveDragController, 'InteractiveDragController is exported');

  // 3. All 32 Transitions
  const transitions = [
    'OrganicBlobPortal', 'TextPortalZoom', 'CardExpandPortal', 'LiquidTearPeel',
    'HorizonCylinderRoll', 'MetaballMergePortal', 'RibbonSliceWeave', 'ConcentricHaloPortal',
    'LiquidBlobTransition', 'ApertureIrisTransition', 'RackFocusTransition', 'CurtainPeelTransition',
    'ChromaticFluidDisplacement', 'DimensionalTunnelWarp', 'NeuralSynapseBloom', 'CrosshairZoom',
    'ColumnarCascade', 'PixelDissolve', 'DiagonalRazorWipe', 'NoiseDisintegration',
    'ShutterStack', 'TypographicShatter', 'ElementisShutterWipe', 'MewDiagonalSlash',
    'OscarLiquidBubblePortal', 'DeviceMorphPortal', 'ChromaticCurtainCascade',
    'AuroraWavePortal', 'PrismGlassRefraction', 'CyberDeckOverlap',
    'FluidMorphConvex', 'OrbitalEclipseSweep'
  ];

  for (const name of transitions) {
    assert.ok(pkg[name], `Transition ${name} is exported`);
    assert.equal(typeof pkg[name], 'function', `${name} is a class constructor`);
    assert.ok(pkg[name].prototype instanceof pkg.PageTransition, `${name} inherits from PageTransition`);
  }

  // 4. All 20 Text Effects
  const textEffects = [
    'LiquidSheenText', 'OffsetShadowText', 'ChromaticGlitchText', 'SteppedDepthText',
    'Isometric3DText', 'NeonFlickerText', 'SoftClayDebossText', 'WireframeStackText',
    'AuroraGradientText', 'AvantGardeText', 'DotMatrixLedText', 'LiquidRefractionText',
    'VariablePhysicsText', 'ShatterMorphText', 'MoActionBadge',
    'KineticOutlineText', 'LiquidMetalText', 'EditorialSplitText', 'NoiseTypeText', 'VariableCapsText'
  ];

  for (const name of textEffects) {
    assert.ok(pkg[name], `Text effect ${name} is exported`);
    assert.equal(typeof pkg[name], 'function', `${name} is a class constructor`);
  }

  // 5. 3D Spatial Primitives & Device Frame
  assert.ok(pkg.HorizonDrum, 'HorizonDrum is exported');
  assert.ok(pkg.DeviceFrame, 'DeviceFrame is exported');
});

test('Auto Declarative Entry Point — motion-organic/auto (src/auto/index.js)', async () => {
  const auto = await import('../src/auto/index.js');

  assert.ok(typeof auto.scanAndBind === 'function', 'scanAndBind is exported');
  assert.ok(typeof auto.destroyAll === 'function', 'destroyAll is exported');
  assert.ok(typeof auto.rescan === 'function', 'rescan is exported');
  assert.ok(typeof auto.enableHistoryAdapter === 'function', 'enableHistoryAdapter is exported');
  assert.ok(typeof auto.parseOptions === 'function', 'parseOptions is exported');
  assert.ok(typeof auto.coerceValue === 'function', 'coerceValue is exported');

  // Verify registries
  assert.ok(auto.TRANSITION_REGISTRY, 'TRANSITION_REGISTRY is exported');
  assert.ok(auto.PRIMITIVE_REGISTRY, 'PRIMITIVE_REGISTRY is exported');
  assert.ok(auto.TEXT_EFFECT_REGISTRY, 'TEXT_EFFECT_REGISTRY is exported');

  // Verify 3D horizon & device primitives in PRIMITIVE_REGISTRY
  assert.ok(auto.PRIMITIVE_REGISTRY['horizon'], 'horizon primitive exists');
  assert.ok(auto.PRIMITIVE_REGISTRY['spatial'], 'spatial primitive exists');
  assert.ok(auto.PRIMITIVE_REGISTRY['parallax'], 'parallax primitive exists');
  assert.ok(auto.PRIMITIVE_REGISTRY['device-frame'], 'device-frame primitive exists');
  assert.ok(auto.TRANSITION_REGISTRY['device-morph'], 'device-morph transition exists');
  assert.ok(auto.TRANSITION_REGISTRY['aurora-wave'], 'aurora-wave transition exists');
  assert.ok(auto.TRANSITION_REGISTRY['prism-glass'], 'prism-glass transition exists');
  assert.ok(auto.TRANSITION_REGISTRY['cyber-deck'], 'cyber-deck transition exists');
  assert.ok(auto.TRANSITION_REGISTRY['fluid-morph-convex'], 'fluid-morph-convex transition exists');
  assert.ok(auto.TRANSITION_REGISTRY['orbital-eclipse'], 'orbital-eclipse transition exists');
});

test('React Entry Point — motion-organic/react (src/react/index.js)', async () => {
  const react = await import('../src/react/index.js');

  // Components
  assert.ok(react.Mo, '<Mo> component is exported');
  assert.ok(react.MoPortal, '<MoPortal> component is exported');
  assert.ok(react.MoScene, '<MoScene> component is exported');
  assert.ok(react.MoText, '<MoText> component is exported');
  assert.ok(react.MoHorizon, '<MoHorizon> component is exported');
  assert.ok(react.MoHorizonItem, '<MoHorizonItem> component is exported');
  assert.ok(react.MoHorizonSection, '<MoHorizonSection> component is exported');
  assert.ok(react.MoSpatial, '<MoSpatial> component is exported');
  assert.ok(react.MoSpatialLayer, '<MoSpatialLayer> component is exported');
  assert.ok(react.MoDeviceFrame, '<MoDeviceFrame> component is exported');
  assert.ok(react.MoChatFeed, '<MoChatFeed> component is exported');
  assert.ok(react.MoChatBubble, '<MoChatBubble> component is exported');
  assert.ok(react.MoCurvedPortal, '<MoCurvedPortal> component is exported');

  // 3D Horizon Hooks
  assert.ok(typeof react.useSpatialPerspective === 'function', 'useSpatialPerspective hook is exported');
  assert.ok(typeof react.useMoHorizonContext === 'function', 'useMoHorizonContext hook is exported');

  // Text Effects
  assert.ok(react.LiquidSheenText, '<LiquidSheenText> component is exported');
  assert.ok(react.OffsetShadowText, '<OffsetShadowText> component is exported');
  assert.ok(react.ChromaticGlitchText, '<ChromaticGlitchText> component is exported');
  assert.ok(react.SteppedDepthText, '<SteppedDepthText> component is exported');
  assert.ok(react.Isometric3DText, '<Isometric3DText> component is exported');
  assert.ok(react.NeonFlickerText, '<NeonFlickerText> component is exported');
  assert.ok(react.SoftClayDebossText, '<SoftClayDebossText> component is exported');
  assert.ok(react.WireframeStackText, '<WireframeStackText> component is exported');
  assert.ok(react.AuroraGradientText, '<AuroraGradientText> component is exported');
  assert.ok(react.AvantGardeText, '<AvantGardeText> component is exported');
  assert.ok(react.DotMatrixLedText, '<DotMatrixLedText> component is exported');
  assert.ok(react.LiquidRefractionText, '<LiquidRefractionText> component is exported');
  assert.ok(react.VariablePhysicsText, '<VariablePhysicsText> component is exported');
  assert.ok(react.ShatterMorphText, '<ShatterMorphText> component is exported');
  assert.ok(react.MoActionBadge, '<MoActionBadge> component is exported');
  assert.ok(react.KineticOutlineText, '<KineticOutlineText> component is exported');
  assert.ok(react.LiquidMetalText, '<LiquidMetalText> component is exported');
  assert.ok(react.EditorialSplitText, '<EditorialSplitText> component is exported');
  assert.ok(react.NoiseTypeText, '<NoiseTypeText> component is exported');
  assert.ok(react.VariableCapsText, '<VariableCapsText> component is exported');

  // Primitives
  assert.ok(react.Magnetic, '<Magnetic> primitive is exported');
  assert.ok(react.Wave, '<Wave> primitive is exported');
  assert.ok(react.Reveal, '<Reveal> primitive is exported');
  assert.ok(react.Parallax, '<Parallax> primitive is exported');
});

test('Physics Engine & Spring Numerical Integration', async () => {
  const { Spring } = await import('../src/core/spring.js');
  
  const spring = new Spring({ stiffness: 180, damping: 20 });
  assert.equal(spring.value, 0);
  assert.equal(spring.target, 0);

  spring.set(100);
  assert.equal(spring.target, 100);

  // Advance simulation
  let settled = false;
  for (let i = 0; i < 200; i++) {
    settled = spring.step(0.016);
    if (settled) break;
  }

  assert.ok(settled, 'Spring settles to target within reasonable iterations');
  assert.equal(spring.value, 100, 'Spring final value is exactly target');
  assert.equal(spring.velocity, 0, 'Spring final velocity is 0');
});

test('SpatialHorizon 3D Cylindrical Geometry & Perspective Matrix', async () => {
  const { SpatialHorizon } = await import('../src/core/spatialHorizon.js');

  const horizon = new SpatialHorizon({ radius: 1200, perspective: 1000 });
  assert.equal(horizon.items.size, 0);

  // Mock HTML element positioned in lower third of viewport
  const mockEl = {
    style: {},
    getBoundingClientRect: () => ({ top: 600, bottom: 800, left: 100, right: 900, height: 200, width: 800 }),
  };

  let lastMetrics = null;
  const unsub = horizon.add(mockEl, {
    pitchFactor: 1.0,
    depthFactor: 1.0,
    shading: true,
    onUpdate: (m) => { lastMetrics = m; },
  });

  assert.equal(horizon.items.size, 1);
  assert.equal(mockEl.style.willChange, 'transform, opacity');

  // Simulate tick
  horizon._tick(0.016);

  assert.ok(mockEl.style.transform.includes('perspective(1000px)'), 'Applies camera perspective');
  assert.ok(mockEl.style.transform.includes('translate3d'), 'Applies 3D depth translation');
  assert.ok(mockEl.style.transform.includes('rotateX'), 'Applies cylindrical Euler pitch angle');
  assert.ok(mockEl.style.opacity !== '', 'Applies atmospheric horizon opacity falloff');
  assert.ok(mockEl.style.filter.includes('brightness'), 'Applies atmospheric horizon lighting');

  // Verify mathematical trig calculation
  const deltaY = (600 + 100) - (800 * 0.5); // 700 - 400 = 300px offset from center
  const expectedSin = 300 / 1200; // 0.25
  const expectedThetaRad = Math.asin(expectedSin);
  const expectedThetaDeg = expectedThetaRad * (180 / Math.PI);
  const expectedZ = -1200 * (1 - Math.cos(expectedThetaRad));

  assert.ok(Math.abs(lastMetrics.theta - expectedThetaDeg) < 0.01, 'Theta angle matches cylindrical arcsin projection');
  assert.ok(Math.abs(lastMetrics.z - expectedZ) < 0.1, 'Z-depth matches cylindrical cosine recession');

  unsub();
  assert.equal(horizon.items.size, 0);
  assert.equal(mockEl.style.transform, '');
});

test('Coercion and Option Parser', async () => {
  const { coerceValue } = await import('../src/auto/parser.js');

  assert.equal(coerceValue('true'), true);
  assert.equal(coerceValue('false'), false);
  assert.equal(coerceValue('null'), null);
  assert.equal(coerceValue('42'), 42);
  assert.equal(coerceValue('0.75'), 0.75);
  assert.equal(coerceValue('#ff0055'), '#ff0055');
  assert.equal(coerceValue('curtain-peel'), 'curtain-peel');
});
