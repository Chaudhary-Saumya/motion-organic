/**
 * controller.js — The runtime brain of the declarative API.
 *
 * Scans the DOM for data-mo-* attributes and automatically instantiates
 * the correct transition/primitive/text-effect classes, wires up event
 * listeners, and manages cleanup. Also watches for dynamically added
 * elements via MutationObserver for SPA compatibility.
 */

import { TRANSITION_REGISTRY, PRIMITIVE_REGISTRY, TEXT_EFFECT_REGISTRY } from './registry.js';
import { parseOptions } from './parser.js';

// WeakMap to track which elements have been bound (prevents double-init)
const boundElements = new WeakMap();

// All active instances for global cleanup
const activeInstances = [];

/**
 * Bind a click-triggered transition to an element.
 */
function bindClickTransition(el) {
  const transitionName = el.getAttribute('data-mo');
  if (!transitionName) return;

  const entry = TRANSITION_REGISTRY[transitionName];
  if (!entry) {
    console.warn(`[motion-organic] Unknown transition: "${transitionName}". Available: ${Object.keys(TRANSITION_REGISTRY).join(', ')}`);
    return;
  }

  const options = parseOptions(el, entry.optionMap);
  const instance = new entry.ctor(options);

  const preset = el.getAttribute('data-mo-preset');
  if (preset && typeof instance.applyPreset === 'function') {
    instance.applyPreset(preset);
  }

  const soundProfile = el.getAttribute('data-mo-sound');
  if (soundProfile && typeof instance.enableAudio === 'function') {
    instance.enableAudio(soundProfile === 'true' ? undefined : soundProfile);
  }

  let isAnimating = false;

  const handler = async (e) => {
    if (isAnimating) return;
    isAnimating = true;

    const href = el.getAttribute('data-mo-href') || (el.tagName === 'A' ? el.getAttribute('href') : null);
    const target = el.getAttribute('data-mo-target');

    if (href && el.tagName === 'A') {
      e.preventDefault();
    }

    try {
      await instance.trigger(e, () => {
        if (href) {
          window.location.href = href;
        } else if (target) {
          const targetEl = document.querySelector(target);
          if (targetEl) {
            targetEl.style.display = targetEl.style.display === 'none' ? '' : 'none';
          }
        }
      });
    } finally {
      isAnimating = false;
    }
  };

  el.addEventListener('click', handler);

  let gestureCtrl = null;
  const gestureAttr = el.getAttribute('data-mo-gesture');
  if (gestureAttr && typeof instance.attachGesture === 'function') {
    const axis = gestureAttr === 'vertical' ? 'vertical' : (gestureAttr === 'diagonal' ? 'diagonal' : 'horizontal');
    const href = el.getAttribute('data-mo-href') || (el.tagName === 'A' ? el.getAttribute('href') : null);
    gestureCtrl = instance.attachGesture(el, {
      axis,
      onCommit: () => {
        if (href) window.location.href = href;
      },
    });
  }

  const binding = { type: 'click-transition', instance, handler, gestureCtrl, el };
  boundElements.set(el, binding);
  activeInstances.push(binding);
}

/**
 * Bind a scroll-driven transition to a section element.
 */
function bindScrollTransition(el) {
  const transitionName = el.getAttribute('data-mo-scroll');
  if (!transitionName) return;

  const entry = TRANSITION_REGISTRY[transitionName];
  if (!entry) {
    console.warn(`[motion-organic] Unknown scroll transition: "${transitionName}". Available: ${Object.keys(TRANSITION_REGISTRY).join(', ')}`);
    return;
  }

  const options = parseOptions(el, entry.optionMap);

  const currentPageEl = el.querySelector('[data-mo-scroll-current]');
  const nextPageEl = el.querySelector('[data-mo-scroll-next]');

  if (currentPageEl) options.currentPageEl = currentPageEl;
  if (nextPageEl) options.nextPageEl = nextPageEl;
  options.container = el;

  const instance = new entry.ctor(options);
  const scrollCtrl = instance.attachScroll(el);

  const binding = { type: 'scroll-transition', instance, scrollCtrl, el };
  boundElements.set(el, binding);
  activeInstances.push(binding);
}

/**
 * Bind a primitive effect to an element.
 */
function bindPrimitive(el, primitiveName) {
  const entry = PRIMITIVE_REGISTRY[primitiveName];
  if (!entry) return;

  const parsed = parseOptions(el, entry.optionMap);
  const options = { ...(entry.defaultOptions || {}), ...parsed };
  let instance;

  if (entry.isParallax) {
    const speed = parseFloat(el.getAttribute('data-mo-parallax')) || 0.5;
    instance = new entry.ctor([{ el, speed }]);
  } else if (entry.elBased) {
    instance = new entry.ctor(el, options);
  }

  const binding = { type: 'primitive', instance, el, primitiveName };
  const existingBindings = boundElements.get(el);
  if (existingBindings && typeof existingBindings === 'object' && !existingBindings.type) {
    existingBindings[primitiveName] = binding;
  } else if (existingBindings) {
    const compound = { [existingBindings.primitiveName || '_main']: existingBindings };
    compound[primitiveName] = binding;
    boundElements.set(el, compound);
  } else {
    boundElements.set(el, binding);
  }
  activeInstances.push(binding);
}

/**
 * Bind a 2-line declarative text effect to an element (`data-mo-text="..."`).
 */
function bindTextEffect(el) {
  const effectName = el.getAttribute('data-mo-text');
  if (!effectName) return;

  const entry = TEXT_EFFECT_REGISTRY[effectName];
  if (!entry) {
    console.warn(`[motion-organic] Unknown text effect: "${effectName}". Available: ${Object.keys(TEXT_EFFECT_REGISTRY).join(', ')}`);
    return;
  }

  const options = parseOptions(el, entry.optionMap);
  const instance = new entry.ctor(el, options);

  const binding = { type: 'text-effect', instance, el, effectName };
  boundElements.set(el, binding);
  activeInstances.push(binding);
}

/**
 * Unbind and destroy a single element's bindings.
 * @param {HTMLElement} el
 */
function unbind(el) {
  const binding = boundElements.get(el);
  if (!binding) return;

  const destroyBinding = (b) => {
    if (b.handler) {
      b.el.removeEventListener('click', b.handler);
    }
    if (b.scrollCtrl) {
      b.scrollCtrl.destroy();
    }
    if (b.gestureCtrl) {
      b.gestureCtrl.destroy();
    }
    if (b.instance && typeof b.instance.destroy === 'function') {
      b.instance.destroy();
    }
    const idx = activeInstances.indexOf(b);
    if (idx !== -1) activeInstances.splice(idx, 1);
  };

  if (binding.type) {
    destroyBinding(binding);
  } else {
    for (const key of Object.keys(binding)) {
      destroyBinding(binding[key]);
    }
  }

  boundElements.delete(el);
}

// ─── Primitive attribute names ──────────────────────────────────────────────
const PRIMITIVE_ATTRS = [
  'data-mo-magnetic',
  'data-mo-wave',
  'data-mo-reveal',
  'data-mo-horizon',
  'data-mo-spatial',
  'data-mo-parallax',
];

/**
 * Scan a root element for all data-mo-* elements and bind them.
 * @param {HTMLElement|Document} root
 */
export function scanAndBind(root = document) {
  // 1. Click transitions: [data-mo]
  root.querySelectorAll('[data-mo]').forEach((el) => {
    if (boundElements.has(el)) return;
    bindClickTransition(el);
  });

  // 2. Scroll transitions: [data-mo-scroll]
  root.querySelectorAll('[data-mo-scroll]').forEach((el) => {
    if (boundElements.has(el)) return;
    bindScrollTransition(el);
  });

  // 3. Text effects: [data-mo-text]
  root.querySelectorAll('[data-mo-text]').forEach((el) => {
    if (boundElements.has(el)) return;
    bindTextEffect(el);
  });

  // 4. Primitives
  for (const attr of PRIMITIVE_ATTRS) {
    const primitiveName = attr.replace('data-mo-', '');
    root.querySelectorAll(`[${attr}]`).forEach((el) => {
      const existing = boundElements.get(el);
      if (existing) {
        if (existing.type && existing.primitiveName === primitiveName) return;
        if (!existing.type && existing[primitiveName]) return;
      }
      bindPrimitive(el, primitiveName);
    });
  }
}

/**
 * Start watching for dynamically added/removed elements.
 * @returns {{ disconnect: () => void }} Observer handle
 */
export function observe() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        if (node.hasAttribute?.('data-mo')) bindClickTransition(node);
        if (node.hasAttribute?.('data-mo-scroll')) bindScrollTransition(node);
        if (node.hasAttribute?.('data-mo-text')) bindTextEffect(node);
        for (const attr of PRIMITIVE_ATTRS) {
          const primitiveName = attr.replace('data-mo-', '');
          if (node.hasAttribute?.(attr)) bindPrimitive(node, primitiveName);
        }

        if (node.querySelectorAll) {
          scanAndBind(node);
        }
      }

      for (const node of mutation.removedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        if (boundElements.has(node)) unbind(node);

        if (node.querySelectorAll) {
          node.querySelectorAll('[data-mo], [data-mo-scroll], [data-mo-text], [data-mo-magnetic], [data-mo-wave], [data-mo-reveal], [data-mo-distort], [data-mo-parallax]')
            .forEach((child) => unbind(child));
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return observer;
}

/**
 * Enable automatic browser popstate (Back/Forward) history transition adapter
 */
export function enableHistoryAdapter(defaultTransition = 'curtain-peel', options = {}) {
  const entry = TRANSITION_REGISTRY[defaultTransition];
  if (!entry) return;

  const transitionInstance = new entry.ctor(options);

  window.addEventListener('popstate', async () => {
    await transitionInstance.trigger(null, () => {
      // Content updated by router
    });
  });
}

/**
 * Destroy all active instances and unbind everything.
 */
export function destroyAll() {
  const allBindings = [...activeInstances];
  for (const binding of allBindings) {
    if (binding.el) unbind(binding.el);
  }
  activeInstances.length = 0;
}

/**
 * Re-scan the entire document.
 */
export function rescan() {
  scanAndBind(document);
}
