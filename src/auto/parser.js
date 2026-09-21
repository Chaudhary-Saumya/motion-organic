/**
 * parser.js — Reads data-mo-* attributes from a DOM element and converts
 * them into a typed options object using the registry's optionMap.
 *
 * Handles:
 * - Type coercion:  "55" → 55,  "true" → true,  "0.22" → 0.22
 * - Kebab-to-key mapping via the optionMap
 * - Passthrough of unmapped attributes as camelCase keys
 */

/**
 * Parse a string value into its most appropriate JS type.
 *
 * @param {string} raw - The raw attribute string value
 * @returns {string|number|boolean} The coerced value
 */
export function coerceValue(raw) {
  if (raw === '' || raw === 'true') return true;
  if (raw === 'false') return false;
  if (raw === 'null') return null;

  // Attempt number coercion (including floats like "0.22")
  const num = Number(raw);
  if (!Number.isNaN(num) && raw.trim() !== '') return num;

  return raw;
}

/**
 * Convert a kebab-case string to camelCase.
 * @param {string} str - e.g. "wobble-intensity"
 * @returns {string} - e.g. "wobbleIntensity"
 */
export function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
}

/**
 * Extract all `data-mo-*` options from an element, mapped through the
 * given optionMap.
 *
 * @param {HTMLElement} el - The DOM element to read attributes from
 * @param {Record<string, string>} optionMap - Short attribute suffix → constructor key
 * @returns {Record<string, any>} Typed options object ready for the constructor
 *
 * @example
 * // <button data-mo="text-portal" data-mo-word="HORIZON" data-mo-scale="55">
 * parseOptions(button, { word: 'word', scale: 'maxScale' })
 * // → { word: 'HORIZON', maxScale: 55 }
 */
export function parseOptions(el, optionMap = {}) {
  const opts = {};

  // Reserved attribute suffixes that are NOT constructor options
  const RESERVED = new Set([
    'href', 'target', 'scroll', 'scroll-current', 'scroll-next',
    'magnetic', 'wave', 'reveal', 'distort', 'parallax',
  ]);

  for (const attr of el.attributes) {
    if (!attr.name.startsWith('data-mo-')) continue;

    // e.g. "data-mo-wobble-intensity" → "wobble-intensity"
    const suffix = attr.name.slice(8); // 'data-mo-'.length === 8

    // Skip the main data-mo attribute and reserved control attributes
    if (suffix === '' || RESERVED.has(suffix)) continue;

    // Look up in the optionMap first (supports aliases)
    const optionKey = optionMap[suffix];
    if (optionKey) {
      opts[optionKey] = coerceValue(attr.value);
    } else {
      // Fallback: convert kebab-case suffix to camelCase and pass through
      opts[kebabToCamel(suffix)] = coerceValue(attr.value);
    }
  }

  return opts;
}
