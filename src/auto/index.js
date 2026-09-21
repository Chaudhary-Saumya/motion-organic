/**
 * motion-organic/auto — Zero-JS declarative entry point.
 *
 * Import this module once, then use data-mo-* attributes in your HTML.
 * Everything is scanned and bound automatically.
 *
 * @example
 * ```html
 * <script type="module">
 *   import 'motion-organic/auto';
 * </script>
 *
 * <!-- 2-Line Text Effects -->
 * <h1 data-mo-text="liquid-sheen">SOLUTIONS IN AHMEDABAD</h1>
 * <h1 data-mo-text="offset-shadow">SHADOW</h1>
 * <h1 data-mo-text="glitch">GLITCH</h1>
 *
 * <!-- Transitions -->
 * <button data-mo="curtain-peel" data-mo-href="/next">Enter</button>
 * ```
 *
 * @module motion-organic/auto
 */

import { scanAndBind, observe, destroyAll, rescan, enableHistoryAdapter } from './controller.js';
import { TRANSITION_REGISTRY, PRIMITIVE_REGISTRY, TEXT_EFFECT_REGISTRY } from './registry.js';

/**
 * Initialize motion-organic declarative bindings.
 * Called automatically on DOMContentLoaded (or immediately if already loaded).
 */
function init() {
  scanAndBind(document);
  observe();

  if (typeof window !== 'undefined') {
    // Expose global API for imperative escape hatch & debugging
    window.motionOrganic = {
      /** Re-scan the entire document for new data-mo elements */
      rescan,
      /** Destroy all active transitions and primitives */
      destroy: destroyAll,
      /** Enable history router adapter */
      enableHistoryAdapter,
      /** List of available transition names */
      transitions: Object.keys(TRANSITION_REGISTRY),
      /** List of available primitive names */
      primitives: Object.keys(PRIMITIVE_REGISTRY),
      /** List of available text effect names */
      textEffects: Object.keys(TEXT_EFFECT_REGISTRY),
      /** Version info */
      version: '2.0.0',
    };

  }
}

// Auto-init: wait for DOMContentLoaded or run immediately if DOM is already ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}

// Named exports for programmatic usage
export { scanAndBind, observe, destroyAll, rescan, enableHistoryAdapter };
export { TRANSITION_REGISTRY, PRIMITIVE_REGISTRY, TEXT_EFFECT_REGISTRY } from './registry.js';
export { parseOptions, coerceValue } from './parser.js';
