/**
 * motion-organic/auto — Declarative data-attribute API.
 *
 * Side-effect import that auto-scans the DOM for `data-mo-*` attributes
 * and binds transitions/primitives/text-effects automatically.
 *
 * @example
 * ```ts
 * import 'motion-organic/auto';
 * ```
 *
 * ## 2-Line Text Effects (data-mo-text="...")
 * - `liquid-sheen` — Iridescent fluid gradient with specular sheen & neon outline
 * - `offset-shadow` — Dual chromatic Cyan & Magenta pop-art offset shadows
 * - `glitch` — Tri-color horizontal glitch slices with anamorphic jitter
 * - `stepped-depth` — Cascading 3D pastel steps with accordion spring physics
 * - `isometric-3d` — Faceted isometric 3D voxel block text
 * - `neon` — Bioluminescent gas tube glow with electrical flicker
 * - `clay` / `soft-clay` — Tactile claymorphic debossed text with pressure response
 * - `wireframe-stack` — Pop-art cyan body with white wireframe outline & stepped pink shadows
 * - `aurora` — Silky horizontal aurora borealis chromatic gradient shimmer
 * - `avant-garde` — Modernist deconstructed modular glyph typography
 * - `dot-matrix` — Digital phosphorescent LED dot matrix raster display
 *
 * ## Transitions (data-mo="...")
 * - `organic-blob`, `curtain-peel`, `text-portal`, `card-expand`, etc.
 *
 * ## Primitives (data-mo-*)
 * - `data-mo-magnetic`, `data-mo-wave`, `data-mo-reveal`, `data-mo-horizon`, `data-mo-spatial`, `data-mo-parallax`
 *
 * @module motion-organic/auto
 */

/** Scan and bind all data-mo-* elements within a root */
export function scanAndBind(root?: HTMLElement | Document): void;

/** Start MutationObserver for SPA dynamic element support */
export function observe(): MutationObserver;

/** Destroy all active transition and primitive instances */
export function destroyAll(): void;

/** Re-scan the entire document for new data-mo elements */
export function rescan(): void;

/** Enable browser popstate (Back/Forward) history transition adapter */
export function enableHistoryAdapter(defaultTransition?: string, options?: Record<string, any>): void;

/** Coerce a string attribute value to its appropriate JS type */
export function coerceValue(raw: string): string | number | boolean | null;

/** Parse all data-mo-* attributes from an element into an options object */
export function parseOptions(
  el: HTMLElement,
  optionMap?: Record<string, string>
): Record<string, any>;

/** Transition registry mapping names to constructor classes */
export const TRANSITION_REGISTRY: Record<string, {
  ctor: new (options?: any) => any;
  optionMap: Record<string, string>;
}>;

/** Primitive registry mapping attribute names to primitive classes */
export const PRIMITIVE_REGISTRY: Record<string, {
  ctor: new (...args: any[]) => any;
  elBased: boolean;
  optionMap: Record<string, string>;
  isParallax?: boolean;
}>;

/** Text Effect registry mapping attribute names to text effect classes */
export const TEXT_EFFECT_REGISTRY: Record<string, {
  ctor: new (el: HTMLElement, options?: any) => any;
  optionMap: Record<string, string>;
}>;

/** Global API exposed on window.motionOrganic */
declare global {
  interface Window {
    motionOrganic: {
      /** Re-scan the document for new data-mo elements */
      rescan: () => void;
      /** Destroy all active instances */
      destroy: () => void;
      /** List of available transition names */
      transitions: string[];
      /** List of available primitive names */
      primitives: string[];
      /** List of available text effect names */
      textEffects: string[];
      /** Library version */
      version: string;
    };
  }
}
