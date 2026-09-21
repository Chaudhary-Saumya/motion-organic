<p align="center">
  <a href="https://motion-organic.kharsan.com/"><img src="https://img.shields.io/badge/Live_Demo-motion--organic.kharsan.com-7c6aff?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/motion-organic?style=flat-square&color=7c6aff" alt="npm version" />
  <img src="https://img.shields.io/badge/bundle-4.2_kB_gzip-00d632?style=flat-square" alt="bundle size" />
  <img src="https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square" alt="zero deps" />
  <img src="https://img.shields.io/badge/tree--shakeable-yes-brightgreen?style=flat-square" alt="tree shakeable" />
  <img src="https://img.shields.io/badge/TypeScript-ready-3178c6?style=flat-square" alt="TypeScript" />
  <img src="https://img.shields.io/npm/l/motion-organic?style=flat-square&color=444" alt="MIT license" />
</p>

<h1 align="center">motion-organic</h1>

<p align="center">
  <strong>Cinema-grade page transitions &amp; 2-line production text effects with zero dependencies.</strong><br/>
  Real Spring Physics · Procedural Web Audio FX · Touch Gesture Scrubbing · SVG Morphing · 60/120 FPS
</p>

<p align="center">
  👉 <strong><a href="https://motion-organic.kharsan.com/">Explore the Live Interactive Playground &amp; Transitions Preview →</a></strong>
</p>

<p align="center">
  <a href="#-2-line-cinema-grade-text-effects"><strong>Text Effects (20)</strong></a> ·
  <a href="#-all-26-cinema-grade-transitions"><strong>All 36 Transitions</strong></a> ·
  <a href="#-cinema-loading-animations--loading-screens"><strong>Loaders &amp; Screens (41)</strong></a> ·
  <a href="#-next-level-framework-features"><strong>Next-Level Features</strong></a> ·
  <a href="#-primitives"><strong>Primitives</strong></a> ·
  <a href="#-vanilla-js--html-zero-js-declarative"><strong>Vanilla JS</strong></a> ·
  <a href="https://motion-organic.kharsan.com/"><strong>Live Demo ↗</strong></a>
</p>

---

## 💎 2-Line Cinema-Grade Text Effects

Implement award-winning typography effects in **just 2 lines of code** with full responsiveness, selectable text, and zero layout shift.

```jsx
import { MoText } from 'motion-organic/react';

// 1. Iridescent Fluid Gradient with Glass Specular Sheen & Neon Outline
<MoText as="h1" effect="liquid-sheen">SOLUTIONS IN AHMEDABAD</MoText>

// 2. Dual Chromatic Pop-Art Offset Shadows with Spring Elasticity
<MoText as="h1" effect="offset-shadow" cyan="#00e5ff" magenta="#ff0055">SHADOW</MoText>

// 3. Cyberpunk Tri-Color Horizontal Glitch Slices
<MoText as="h1" effect="glitch">GLITCH</MoText>

// 4. Cascading 3D Pastel Steps with Accordion Elastic Physics
<MoText as="h1" effect="stepped-depth" color="#f87171" layers={5}>HEY</MoText>

// 5. Faceted 3D Voxel Extruded Block Typography with Top Specular Cap
<MoText as="h1" effect="isometric-3d" front="#06b6d4" top="#facc15" side="#ec4899">COLOR FONTS!</MoText>

// 6. Bioluminescent Neon Gas Tube with Electrical Voltage Flicker
<MoText as="h1" effect="neon" color="#22c55e">OPEN 24/7</MoText>

// 7. Tactile Claymorphic Inset Soft Deboss Typography with Pressure Physics
<MoText as="h1" effect="clay" textColor="#e07a7a" bgColor="#fca5a5">STRONG</MoText>

// 8. Pop-Art Wireframe Contour with Staggered Pink Shadow Layers
<MoText as="h1" effect="wireframe-stack" cyan="#00cec9" magenta="#e84393" stroke="#ffffff">LINE</MoText>

// 9. Fluid Aurora Borealis Multi-Stop Chromatic Gradient Shimmer
<MoText as="h1" effect="aurora">the beautiful aurora</MoText>

// 10. Experimental Deconstructed Avant-Garde Modular Glyphs
<MoText as="h1" effect="avant-garde" color="#ffffff">M i* X</MoText>

// 11. Digital Phosphor LED Dot Matrix Grid Display
<MoText as="h1" effect="dot-matrix" color="#00ff88">ALWAYS</MoText>

// 12. Real-Time Optical Liquid Glass Lens & Chromatic Refraction
<MoText as="h1" effect="liquid-refraction" viscosity={0.8}>REFRACTION</MoText>

// 13. Elastic Variable Font Spring Harmonic Waves
<MoText as="h1" effect="variable-physics" minWeight={200} maxWeight={900}>HARMONIC</MoText>

// 14. Physical Character Particle Shard Explosion & Word Morphing
<MoText as="h1" effect="shatter-morph" words={['CREATE', 'DISRUPT', 'EVOLVE']}>CREATE</MoText>

// 15. Viral Magnetic Micro-Interaction Copy Badge
<MoText as="button" effect="action-badge" copyText="npm i motion-organic">Copy Install</MoText>
```

Or use dedicated named components:

```jsx
import {
  LiquidSheenText,
  OffsetShadowText,
  ChromaticGlitchText,
  SteppedDepthText,
  Isometric3DText,
  NeonFlickerText,
  SoftClayDebossText,
  WireframeStackText,
  AuroraGradientText,
  AvantGardeText,
  DotMatrixLedText,
  LiquidRefractionText,
  VariablePhysicsText,
  ShatterMorphText,
  MoActionBadge,
} from 'motion-organic/react';

<LiquidSheenText as="h1">SOLUTIONS</LiquidSheenText>
<SoftClayDebossText as="h1" textColor="#e07a7a">STRONG</SoftClayDebossText>
<WireframeStackText as="h1" cyan="#00cec9" magenta="#e84393">LINE</WireframeStackText>
<AuroraGradientText as="h1">the beautiful aurora</AuroraGradientText>
<AvantGardeText as="h1">M i* X</AvantGardeText>
<DotMatrixLedText as="h1" color="#00ff88">ALWAYS</DotMatrixLedText>
<LiquidRefractionText as="h1">OPTICAL</LiquidRefractionText>
<VariablePhysicsText as="h1">FLUID</VariablePhysicsText>
<ShatterMorphText as="h1" words={['DISRUPT', 'EVOLVE']} />
<MoActionBadge copyText="npm i motion-organic">Copy Command</MoActionBadge>
```

---

## 📦 Installation

```bash
npm install motion-organic
```

```bash
pnpm add motion-organic    # or yarn add / bun add
```

---

## ⚡ Cinema Loading Animations & Experiential Preloaders (23 Archetypes + Awwwards Screens)

Implement award-winning, zero-dependency loading animations and full-screen experiential preloader screens with spring physics counters, bezier liquid curve reveals, fluid hydrodynamics canvas, and procedural Web Audio cues.

### 1. Awwwards Gold-Standard Preloader Screens

```jsx
import { useState } from 'react';
import {
  AwwwardsCurvedCurtainScreen,
  LiquidWaveTextScreen,
  ArchitecturalVenetianScreen,
  MoLoadingScreen,
} from 'motion-organic/react';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        // 🏆 Awwwards Gold-Standard Numeric Progression Preloader (00% → 100%):
        <AwwwardsLiquidChromiumCounterScreen
          brand="CHROMIUM // HYDRODYNAMICS"
          accentColor="#00e5ff"
          secondaryColor="#7000ff"
          duration={3000}
          sound={true}
          onComplete={() => setLoading(false)}
        />
      )}
      <MainPortfolio />
    </>
  );
}
```

```jsx
// 1. 3D Mechanical Airport Split-Flap Numeric Chronometer (000 → 100):
<AwwwardsSplitFlapChronometerScreen
  brand="CHRONO // SPLIT-FLAP"
  accentColor="#ffb800"
  duration={3000}
  sound={true}
/>

// 1. Dual Opposing Liquid Bezier Wave Scissor Reveal (Top & Bottom waves):
<AwwwardsDoubleLiquidWaveCurtainScreen
  brand="ATELIER // LIQUID HORIZON"
  words={['RESONANCE', 'SYNERGY', 'ATMOSPHERE', 'FUTURE']}
  accentColor="#00e5ff"
  secondaryColor="#7928ca"
  duration={3000}
  sound={true}
/>

// 2. 3-Tier Prismatic Iridescent Liquid Mesh Waves Reveal:
<AwwwardsIridescentLiquidMeshCurtainScreen
  brand="PRISMATIC FLUID DYNAMICS"
  words={['SPECTRUM', 'LUMINESCENCE', 'DIFFRACTION', 'ELEGANCE']}
  tier1Color="#ff0055"
  tier2Color="#7928ca"
  tier3Color="#08080d"
  duration={3200}
  sound={true}
/>

// 3. Real-time Canvas Fluid Hydrodynamics Wave Slosh Preloader:
<LiquidWaveTextScreen
  text="ORGANIC"
  subtext="CALIBRATING HYDRODYNAMICS"
  duration={3200}
  sound={true}
/>

// 2. Architectural Multi-Column Frosted Venetian Slat Shutter Reveal:
<ArchitecturalVenetianScreen
  slatCount={8}
  duration={2500}
  sound={true}
/>

// 3. 35mm Analog Film Negative Sprocket & Shutter Burn Preloader:
<AwwwardsFilmRollNegativeScreen
  brand="35MM // ARCHIVE"
  subtitle="ANALOG OPTICAL REEL • FRAME 024"
  accentColor="#ff4500"
  duration={3000}
  sound={true}
/>

// 4. Brutalist Stencil 50x Camera Dive Portal Preloader:
<AwwwardsTypographyStencilPortalScreen
  brand="DIVE // 2026"
  subtitle="IMMERSIVE SPATIAL STENCIL PORTAL"
  accentColor="#00e5ff"
  duration={3000}
  sound={true}
/>

// 5. Organic Liquid Cellular Goo & Physics Coalescence Preloader:
<AwwwardsMetaballBioFusionScreen
  brand="BIO // FUSION"
  accentColor="#00ff88"
  duration={3000}
  sound={true}
/>

// 6. Luxury High-Precision Diagonal Mirror Slabs Sheer Reveal:
<AwwwardsDiagonalRazorShutterScreen
  brand="ATELIER // MOTION"
  subtitle="HIGH PRECISION DIAGONAL SHEER"
  accentColor="#ffffff"
  duration={2800}
  sound={true}
/>

// 7. Cyberpunk Biometric Holographic HUD Matrix Decryptor:
<CyberpunkBiometricHoloScreen
  brand="SYSTEM QUANTUM HUD"
  targetWord="DECRYPTED"
  accentColor="#00ff88"
  duration={2800}
  sound={true}
/>

// 8. Brutalist Multi-Band Kinetic Typo Cascade with Physical Inertia:
<KineticTypoStaggerCascadeScreen
  brand="MOTION ORGANIC"
  words={['AWWWARDS', 'STUDIO', 'KINETIC', 'INERTIA', 'EXCELLENCE']}
  duration={3000}
  sound={true}
/>

// 9. Cyberpunk 3D Hyperdrive Warp Tunnel & Multi-Pass RGB Glitch Aberration:
<AwwwardsChromaticGlitchWarpScreen
  brand="HYPERDRIVE // 2026"
  statusText="WARPING SPATIAL CHROMATICS"
  accentColor="#00f0ff"
  secondaryColor="#ff0077"
  duration={3000}
  sound={true}
  interactive={true}
/>

// 10. Swiss Brutalist Monolithic Horizontal Split-Bands Scissor Reveal:
<AwwwardsBrutalistEditorialScissorScreen
  brands={['PARIS // TOKYO // MILAN', 'DIGITAL ARCHITECTURE', 'VOL. 2026 // MOTION', 'AVANT-GARDE FLUIDS']}
  accentColor="#e2ff3b"
  secondaryColor="#ff2a5f"
  duration={3200}
  sound={true}
/>

// 11. Celestial Gravitational Singularity Particle Vortex & Supernova Shockwave:
<AwwwardsMagneticSingularityVortexScreen
  title="GRAVITATIONAL SINGULARITY"
  subtitle="ORBITAL ASTROPHYSICS ENGINE"
  color="#00f0ff"
  accentColor="#d65db1"
  duration={3200}
  sound={true}
/>

// 12. Harmonic Viscous Liquid SVG Mesh Gradient & Organic Iris Wipe:
<AwwwardsFluidMeshGradientBlobScreen
  brand="LUMEN // FLUID LABS"
  subtext="HARMONIC VISCOSITY MATRIX"
  duration={3000}
  sound={true}
/>

// 13. 3D Crystalline Vault Origami Geodesic Facet Unfold:
<AwwwardsPrismGeodesicUnfoldScreen
  title="PRISM // GEODESIC"
  subtitle="3D CRYSTALLINE VAULT ARCHITECTURE"
  accentColor="#00e5ff"
  gemColor="#9b51e0"
  duration={3000}
  sound={true}
/>

// 14. Tactical Holographic Cyber Deck & 360° Audio Equalizer Wave:
<AwwwardsNeoTokyoHoloDeckScreen
  brand="NEO-TOKYO // HUD.V4"
  subtitle="QUANTUM NEURAL FREQUENCY LOCK"
  accentColor="#00ffff"
  warningColor="#ff0055"
  duration={3000}
  sound={true}
/>

// 9. Viscous Molten Liquid Chrome Mercury Droplet Expansion:
<MoltenLiquidChromeBlobScreen
  brand="MOLTEN CHROME"
  accentColor="#00e5ff"
  duration={2800}
  sound={true}
/>


```

### 2. Standalone Next-Gen Cinema Loaders (`<MoLoader>`)

```jsx
import {
  ParticleSupernovaLoader,
  HypercubeTesseractLoader,
  QuantumChronosWormholeLoader,
  ObsidianLiquidCausticLoader,
  MagLevSuperconductorLoader,
  HyperPrismDispersionLoader,
  OrbitalEclipseLoader,
  MorphingMetaballLoader,
  CyberMatrixScanLoader,
} from 'motion-organic/react';

// 1. Real-time 3D Canvas Particle Supernova Vortex
<ParticleSupernovaLoader size={120} color="#00e5ff" accent="#ff0077" />

// 2. 4D-to-3D Rotating Hypercube Tesseract Geometry
<HypercubeTesseractLoader size={120} color="#00e5ff" />

// 3. Spacetime curvature with SVG turbulence displacement
<QuantumChronosWormholeLoader size={88} color="#00e5ff" coreColor="#7000ff" />

// 4. Molten dark obsidian glass with internal caustic refraction
<ObsidianLiquidCausticLoader size={80} color="#00e5ff" />

// 5. 3D quantum levitator floating above magnetic base
<MagLevSuperconductorLoader size={80} color="#00ff88" />

// 6. 3D pyramid splitting white light into rainbow beams
<HyperPrismDispersionLoader size={80} color="#00e5ff" />

// 7. Molten chrome liquid mercury droplet
<LiquidMercuryDropletLoader size={68} color="#00e5ff" />

// 8. Luxury glass pill with fluid gradient spring progress
<MinimalPulsePillLoader width={180} progress={85} />
```

| Type | Name | Visual Style |
| :--- | :--- | :--- |
| `vortex` | **Singularity Vortex** | Cosmic black hole with photon sphere & accretion particles |
| `prism` | **Holo Prism Crystal** | 3D faceted crystal with chromatic dispersion beams |
| `eclipse` | **Orbital Eclipse** | Dual counter-rotating refractive rings with focal flare |
| `metaball` | **Morphing Metaball** | Harmonic SVG liquid coalescence with fluid goo filter |
| `cyber` | **Cyber Matrix Scan** | Tactical sci-fi radar scan with real-time HUD telemetry |
| `quantum` | **Quantum Spin Gyro** | 3D gyroscopic gimbal rings with perspective depth |
| `pill` | **Minimal Pulse Pill** | Luxury glass pill capsule with elastic spring progress fill |
| `synapse` | **Neural Synapse** | Bioluminescent pulsing neural axon cluster sending sparks |
| `mercury` | **Liquid Mercury** | Molten liquid chrome droplet breathing with surface tension |
| `aura` | **Aura Rings** | Minimalist luxury organic breathing aura ripple rings |
| `helix` | **HyperLoop DNA Helix** | Double-helix 3D strand twisting with chemical base pairs |
| `cube` | **Isometric Cube Stack** | 3D stepped neon cube cascade rising and morphing in space |
| `dot-wave` | **Dot Matrix Wave** | Kinetic 3x3 dot matrix grid rippling in sinusoidal wave |
| `radial-eq`| **Radial Equalizer** | Circular audio frequency spectrum visualizer bars pulsing |
| `infinity` | **Infinity Ribbon** | Continuous 3D Möbius infinity strip with traveling neon energy |
| `glitch` | **Glitch Terminal** | High-tech cyberpunk matrix stream with CRT phosphor flicker |
| `sonar` | **Sonar Pulse Echo** | Acoustic sonar wave rings propagating with depth gradient |
| `shatter` | **Shatter Assemble** | Geometric polygon shards disintegrating and snapping back |


---

## ⚡ Quick Start: Page Transitions

`motion-organic` supports every React routing setup out of the box — whether you use **React Router**, **Next.js**, **Pure React `useState`**, or **Multi-Page HTML links**.

### 1. With React Router (`react-router-dom` in Vite / CRA)
```jsx
import { useNavigate } from 'react-router-dom';
import { Mo } from 'motion-organic/react';

export default function Navigation() {
  const navigate = useNavigate();

  return (
    <Mo
      transition="organic-blob"
      sound="liquid"
      gesture="horizontal"
      onTransition={() => navigate('/gallery')}
    >
      <button className="cta">Peel to Gallery</button>
    </Mo>
  );
}
```

### 2. With Next.js (App Router & Pages Router)
```jsx
'use client';
import { useRouter } from 'next/navigation';
import { Mo } from 'motion-organic/react';

export default function Navigation() {
  const router = useRouter();

  return (
    <Mo
      transition="curtain-peel"
      preset="silk"
      sound="fabric"
      onTransition={() => router.push('/gallery')}
    >
      <button className="cta">Peel to Gallery</button>
    </Mo>
  );
}
```

### 3. Pure React (Zero Router / State-Based View Switcher)
```jsx
import { useState } from 'react';
import { Mo } from 'motion-organic/react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div>
      {currentView === 'home' && (
        <Mo transition="liquid-tear" sound="liquid" onTransition={() => setCurrentView('gallery')}>
          <button>Go to Gallery</button>
        </Mo>
      )}
      {currentView === 'gallery' && (
        <Mo transition="liquid-tear" sound="liquid" onTransition={() => setCurrentView('home')}>
          <button>Back to Home</button>
        </Mo>
      )}
    </div>
  );
}
```

### 4. Standard HTML / Multi-Page / Astro (Direct `href`)
```jsx
<Mo transition="organic-blob" sound="liquid" href="/gallery.html">
  <button className="cta">Go to Gallery</button>
</Mo>
```

---

## 🚀 Next-Level Framework Features

### 1. 👆 Universal Interactive Gesture & Drag Scrubbing
Scrub **any** transition in real time with finger swipe gestures or mouse dragging. Features live velocity calculation, rubber-band resistance, and organic spring release.

```jsx
<Mo transition="curtain-peel" gesture="horizontal" href="/contact">
  <div className="swipe-card">Swipe left to reveal contact page</div>
</Mo>
```

### 2. 🔊 Zero-Asset Procedural Web Audio FX (`MoAudio`)
Synthesizes real-time acoustic feedback directly with the Web Audio API — **zero external .mp3/.wav files or network requests**. Modulates pitch, filter cutoff, and resonance dynamically with spring velocity.

Profiles: `fabric` / `silk`, `liquid` / `bubble`, `whoosh`, `portal`, `shutter`, `chime` / `bell`, `subtle`.

```jsx
<Mo transition="liquid-blob" sound="liquid" href="/about">
  <button>Liquid Pop</button>
</Mo>
```

### 3. 🎯 Universal Spring Physics Presets
Choose from calibrated physics profiles: `silk`, `liquid`, `snappy`, `cinematic`, `bouncy`, `gentle`.

```jsx
<Mo transition="text-portal" word="NEXUS" preset="cinematic" href="/portal">
  <button>Cinematic Dive</button>
</Mo>
```

### 4. ♿ Automatic Accessibility & Reduced Motion
Seamlessly honors `prefers-reduced-motion: reduce` with instant zero-flicker cross-fades.

### 5. 🔄 Bidirectional History & Router Adapter
Automatic browser back/forward history integration:

```js
import { enableHistoryAdapter } from 'motion-organic/auto';

enableHistoryAdapter('curtain-peel');
```

---

## 🎬 All 25 Cinema-Grade Transitions

| `transition` | Category | Effect | Key Props |
| :--- | :--- | :--- | :--- |
| `organic-blob` | Liquid | Foodnia living organic liquid blob window portal | `points` `wobble` `rim` |
| `text-portal` | Typographic | Typography stencil 55× zoom dive | `word` `scale` `fill` `fontFamily` |
| `card-expand` | 3D Spatial | Hero floating card → fullscreen morph | `width` `height` `radius` |
| `liquid-tear` | Liquid | Organic diagonal tear & zipper | `angle` `wobble` |
| `horizon-cylinder` | 3D Spatial | 3D cylindrical horizon roll / Earth drum | `perspective` |
| `metaball-merge` | Liquid | SVG metaballs magnetic fusion portal | `count` `color` |
| `ribbon-slice` | 3D Spatial | Multi-slice alternating ribbon weave | `slices` |
| `concentric-halo` | 3D Spatial | Concentric organic depth halos | `rings` |
| `liquid-blob` | Liquid | Viscous harmonic bubble | `color` `points` `wobble` |
| `aperture-iris` | Cinematic | Mechanical 9-blade iris shutter | `blades` `color` |
| `rack-focus` | Cinematic | Optical depth rack focus & blur | `blur` |
| `curtain-peel` | 3D Spatial | Multi-directional 3D silk fabric peel | `direction` `fabric` `accent` `sound` |
| `chromatic-fluid` | Cinematic | Molten liquid glass & chromatic aberration | `distortion` |
| `dimensional-tunnel` | 3D Spatial | Hyperspace 3D concentric warp tunnel | `layers` `color` |
| `neural-synapse` | 3D Spatial | Bioluminescent neural synapse network | `color` `branches` |
| `crosshair-zoom` | Cinematic | Viewfinder lock-on & radial dive | `bracketColor` `bracketSize` `color` |
| `column-cascade` | Geometric | Vertical column waterfall cascade | `columns` `direction` `color` `accent` `stagger` |
| `pixel-dissolve` | Geometric | Digital pixel disintegration & scatter | `gridSize` `scatter` `rotateMax` `color` `fadeOrder` |
| `diagonal-razor` | Geometric | Razor-sharp diagonal geometric cut | `angle` `color` `edgeShadow` `edgeColor` |
| `noise-dissolve` | Cinematic | Procedural static noise dissolve | `grainScale` `color` `displacement` |
| `shutter-stack` | Geometric | Mechanical horizontal shutter stack | `bands` `color` `accent` `stagger` |
| `typo-shatter` | Typographic | Explosive character typographic scatter | `word` `fontSize` `fontWeight` `textColor` `bgColor` |
| `elementis-shutter` | Geometric | Fleava Elementis multi-slat Venetian blind wipe | `bands` `color` `accent` `stagger` |
| `mew-slash` | Geometric | Griflan Mew visceral jagged claw slash | `slashes` `color` `accent` `angle` `jaggedness` |
| `oscar-bubble` | Liquid | Oscar Pico viscous multi-lobe liquid bubble portal | `points` `wobble` `rim` `maskColor` |
| `device-morph` | 3D Spatial | 3D device ejection & asymmetrical curved deck sweep | `accentColor` `borderColor` `pitchAngle` `curveRadius` |

---

## 📱 MoDevice & CurvedDeckPortal: 3D Device App & Curved Corner Portal Suite

Inspired by modern interactive portfolio showcases, this suite brings **3D interactive mobile phone mockups**, **conversational chat UI feeds**, and **asymmetrical sweeping curved deck page transitions** into your web applications with zero external dependencies.

### 💎 Key Features
- **3D Device Spatial Ejection**: During route navigation, the current active phone/view tilts back in 3D perspective (`perspective(1200px) rotateX(22deg) rotateZ(-14deg) translateY(-120px) scale(0.88)`), receding smoothly into Z-space with spring physics.
- **Asymmetric Curved Sheet Sweep**: The incoming page sweeps in along a diagonal curved arc with an asymmetrical high-radius organic corner (`border-radius: 48px 260px 48px 48px` and a luminous neon accent rim), expanding and settling into full view.
- **Interactive 3D Phone Mockup (`<MoDeviceFrame>`)**: An out-of-the-box floating smartphone with aluminum chassis, camera island/speaker notch, and real-time spring hover tilt.
- **Conversational UI Feed (`<MoChatFeed>`, `<MoChatBubble>`)**: Native animated chat bubbles with avatars, timestamps, and interactive click-to-transition actions.

---

### ⚛️ React Example: Interactive Device Landing & Transition

```jsx
import {
  Mo,
  MoDeviceFrame,
  MoChatFeed,
  MoChatBubble,
  MoCurvedPortal,
} from 'motion-organic/react';

export default function MobileAppHero() {
  return (
    <div className="hero-container">
      {/* 1. Interactive 3D Phone Mockup with Chat Thread */}
      <MoDeviceFrame width={340} height={660} maxTilt={18} interactive>
        <MoChatFeed>
          <MoChatBubble
            sender="agent"
            text="Welcome to motion-organic. How can we elevate your design today?"
            timestamp="10:42 AM"
          />
          <MoChatBubble
            sender="user"
            text="Let's talk about our next creative project!"
            timestamp="10:43 AM"
          />

          {/* Interactive Trigger Button */}
          <Mo transition="device-morph" accentColor="#d9ed55" href="/project">
            <button className="cta-button">View Project Case Study →</button>
          </Mo>
        </MoChatFeed>
      </MoDeviceFrame>
    </div>
  );
}
```

---

### 🌐 Zero-JS HTML Declarative API

```html
<!-- Trigger 3D Device Morph Page Transition -->
<button
  data-mo="device-morph"
  data-mo-accent="#d9ed55"
  data-mo-border-color="#38bdf8"
  data-mo-pitch-angle="24"
  data-mo-href="/services"
>
  Open Service Deck
</button>

<!-- 3D Interactive Device Frame Mockup -->
<div
  data-mo-primitive="device-frame"
  data-mo-width="340"
  data-mo-height="680"
  data-mo-max-tilt="16"
>
  <div class="chat-content">Interactive Phone Content</div>
</div>
```

---

## 🪐 MoHorizon: 3D Cylindrical Horizon Roll & Spatial Perspective Depth Suite

Elevate scrolling into a **true 3D spatial experience**. `MoHorizon` projects standard HTML elements onto a virtual **3D cylindrical drum or planetary horizon** in perspective space using pure trigonometric matrix projections without Three.js.

### 💎 Key Capabilities
1. **Trigonometric Cylindrical Projection**:
   $$\theta = \arcsin\left(\frac{y - y_{\text{center}}}{R}\right), \quad Z = -R \cdot (1 - \cos\theta)$$
2. **Zero Scroll-Hijacking**: Operates seamlessly on top of native 60/120 FPS browser scrolling with layout-safe GPU `matrix3d` / `transform` layers.
3. **Atmospheric Horizon Lighting & Falloff**: Elements naturally catch light at the center focus and softly recede with atmospheric distance occlusion.
4. **Zero-Dependency 3D**: No Three.js/WebGL canvas required — pure CSS GPU 3D rendering.

---

### ⚛️ React API (`MoHorizon`, `MoHorizonItem`, `MoSpatial`)

```jsx
import {
  MoHorizon,
  MoHorizonItem,
  MoHorizonSection,
  useSpatialPerspective,
} from 'motion-organic/react';

function PlanetaryShowcase() {
  return (
    <MoHorizon radius={1400} perspective={1000} shading>
      {/* 1. Curved 3D Hero Section */}
      <MoHorizonItem pitchFactor={1.2} depthFactor={1.0}>
        <div className="hero-card">
          <h1>Curved 3D Horizon</h1>
        </div>
      </MoHorizonItem>

      {/* 2. Deep Perspective Showcase */}
      <MoHorizonItem radius={1000} depthFactor={1.5}>
        <div className="showcase-card">
          <img src="/artwork.jpg" alt="Art" />
        </div>
      </MoHorizonItem>
    </MoHorizon>
  );
}
```

#### React Hooks

```jsx
import { useRef } from 'react';
import { useSpatialPerspective } from 'motion-organic/react';

function CustomCard() {
  const cardRef = useRef(null);

  // Imperatively bind any ref to the 3D horizon
  useSpatialPerspective(cardRef, { radius: 1200, depthFactor: 1.2 });

  return <div ref={cardRef} className="card">3D Spatial Ref</div>;
}
```

---

### 🌐 Zero-JS HTML Declarative API

Import `motion-organic/auto` and add attributes directly to any HTML element:

```html
<!-- 3D Cylindrical Horizon Roll -->
<section data-mo-horizon data-mo-radius="1400" data-mo-perspective="1000">
  <div class="card">Curves over the 3D horizon</div>
</section>

<!-- 3D Spatial Depth Layer -->
<div data-mo-spatial data-mo-depth-factor="1.5" data-mo-shading="true">
  Deep 3D Layer
</div>
```

---

## ✨ Primitives

```jsx
import { Magnetic, Wave, Reveal, Parallax } from 'motion-organic/react';

<Magnetic radius={120} strength={0.5}><button>Hover me</button></Magnetic>
<Wave as="h1" waveWidth={0.2}>The Future of Motion</Wave>
<Reveal stiffness={200} damping={10}><div className="card">I spring into view</div></Reveal>
<Parallax speed={0.3}><div className="bg-layer">Background layer</div></Parallax>
```

---

## 🌐 Vanilla JS / HTML (Zero-JS Declarative)

Don't use React? Import `motion-organic/auto` for a zero-JS data-attribute API:

```html
<script type="module">
  import 'motion-organic/auto';
</script>

<!-- 2-Line Text Effects -->
<h1 data-mo-text="liquid-sheen">SOLUTIONS IN AHMEDABAD</h1>
<h1 data-mo-text="offset-shadow" data-mo-cyan="#00e5ff" data-mo-magenta="#ff0055">SHADOW</h1>
<h1 data-mo-text="glitch">GLITCH</h1>
<h1 data-mo-text="stepped-depth" data-mo-layers="5">HEY</h1>
<h1 data-mo-text="isometric-3d">COLOR FONTS!</h1>
<h1 data-mo-text="neon" data-mo-color="#22c55e">OPEN 24/7</h1>
<h1 data-mo-text="liquid-refraction">REFRACTION</h1>

<!-- Click / Touch Gesture transitions -->
<button data-mo="curtain-peel" data-mo-direction="bottom-right" data-mo-sound="fabric" data-mo-href="/next">
  Peel to Next Page
</button>

<!-- Scroll-driven continuous transition zone -->
<section data-mo-scroll="organic-blob" data-mo-points="14" style="height: 300vh">
  <div data-mo-scroll-current>Scene 1</div>
  <div data-mo-scroll-next>Scene 2</div>
</section>
```

---

## 🧩 Exports

```js
// Declarative React components & text effects
import {
  Mo,
  MoText,
  LiquidSheenText,
  OffsetShadowText,
  ChromaticGlitchText,
  SteppedDepthText,
  Isometric3DText,
  NeonFlickerText,
  SoftClayDebossText,
  WireframeStackText,
  AuroraGradientText,
  AvantGardeText,
  DotMatrixLedText,
  LiquidRefractionText,
  VariablePhysicsText,
  ShatterMorphText,
  MoActionBadge,
  Magnetic,
  Wave,
  Reveal,
  Distort,
  Parallax,
} from 'motion-organic/react';

// Zero-JS HTML data-attribute API
import 'motion-organic/auto';

// Core physics, audio synthesis & text effect classes
import {
  Spring,
  ShapeMorph,
  engine,
  scrollTracker,
  MoAudio,
  SPRING_PRESETS,
  configureMotion,
  isReducedMotionPreferred,
  LiquidSheenText,
  OffsetShadowText,
  ChromaticGlitchText,
  SteppedDepthText,
  Isometric3DText,
  NeonFlickerText,
  OrganicBlobPortal,
  TextPortalZoom,
  CardExpandPortal,
  CurtainPeelTransition,
  ElementisShutterWipe,
  MewDiagonalSlash,
  OscarLiquidBubblePortal,
} from 'motion-organic';
```

---

## 🔧 Compatibility

| Environment | Support |
|---|---|
| React 16.8+ / 18 / 19 | ✅ Hooks & Components |
| Next.js (App & Pages Router) | ✅ Client components |
| Vite / Webpack / esbuild | ✅ ESM tree-shakeable |
| Vanilla JS (no framework) | ✅ `import 'motion-organic/auto'` |
| TypeScript | ✅ Full type definitions |
| Web Audio API | ✅ Zero external audio files |
| Touch & Mouse | ✅ Real-time gesture scrubbing |
| SSR | ✅ No `window` access until hydration |

---

## 📄 License

MIT © 2026

