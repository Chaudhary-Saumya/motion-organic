import { useRef, useEffect, useCallback, useState, forwardRef, createElement } from 'react';
import { usePageTransition } from './usePageTransition.js';

/**
 * <Mo> — The main declarative React component for click-triggered & gesture transitions.
 *
 * Tailwind-level clean: just wrap your element and pass transition props.
 * Zero boilerplate, zero event listener wiring, zero async handling.
 *
 * @example
 * ```jsx
 * import { Mo } from 'motion-organic/react';
 *
 * // Silk fabric peel with sound & custom direction
 * <Mo as="button" transition="curtain-peel" direction="bottom-right" sound="fabric" href="/contact">
 *   Contact Us
 * </Mo>
 * ```
 */

/**
 * Map of transition-name → set of known option prop names.
 */
const TRANSITION_OPTIONS = {
  'organic-blob':       new Set(['points', 'wobbleIntensity', 'wobble', 'rimColor', 'rim', 'originX', 'originY', 'stiffness', 'damping', 'sound', 'preset']),
  'text-portal':        new Set(['word', 'maxScale', 'scale', 'fontSize', 'fontFamily', 'fontWeight', 'fillColor', 'fill', 'textFadeOutAt', 'fadeAt', 'stiffness', 'damping', 'sound', 'preset']),
  'card-expand':        new Set(['initialWidth', 'width', 'initialHeight', 'height', 'initialRadius', 'radius', 'stiffness', 'damping', 'sound', 'preset']),
  'liquid-tear':        new Set(['tearAngle', 'angle', 'wobble', 'stiffness', 'damping', 'sound', 'preset']),
  'horizon-cylinder':   new Set(['perspective', 'stiffness', 'damping', 'sound', 'preset']),
  'metaball-merge':     new Set(['count', 'color', 'stiffness', 'damping', 'sound', 'preset']),
  'ribbon-slice':       new Set(['slices', 'stiffness', 'damping', 'sound', 'preset']),
  'concentric-halo':    new Set(['rings', 'stiffness', 'damping', 'sound', 'preset']),
  'liquid-blob':        new Set(['color', 'points', 'wobbleIntensity', 'wobble', 'stiffness', 'damping', 'sound', 'preset']),
  'aperture-iris':      new Set(['blades', 'color', 'stiffness', 'damping', 'sound', 'preset']),
  'rack-focus':         new Set(['maxBlur', 'blur', 'stiffness', 'damping', 'sound', 'preset']),
  'curtain-peel':       new Set(['direction', 'fabricColor', 'fabric', 'accentColor', 'accent', 'stiffness', 'damping', 'sound', 'preset']),
  'chromatic-fluid':    new Set(['maxDistortion', 'distortion', 'stiffness', 'damping', 'sound', 'preset']),
  'dimensional-tunnel': new Set(['layers', 'tunnelColor', 'color', 'stiffness', 'damping', 'sound', 'preset']),
  'neural-synapse':     new Set(['synapseColor', 'color', 'branches', 'stiffness', 'damping', 'sound', 'preset']),
  'crosshair-zoom':     new Set(['bracketColor', 'bracketSize', 'bracketThickness', 'overlayColor', 'color', 'gridLines', 'stiffness', 'damping', 'sound', 'preset']),
  'column-cascade':     new Set(['columns', 'cols', 'direction', 'color', 'accentColor', 'accent', 'stagger', 'stiffness', 'damping', 'sound', 'preset']),
  'pixel-dissolve':     new Set(['gridSize', 'scatter', 'rotateMax', 'color', 'fadeOrder', 'stiffness', 'damping', 'sound', 'preset']),
  'diagonal-razor':     new Set(['angle', 'color', 'edgeShadow', 'edgeColor', 'stiffness', 'damping', 'sound', 'preset']),
  'noise-dissolve':     new Set(['grainScale', 'noiseColor', 'color', 'displacement', 'stiffness', 'damping', 'sound', 'preset']),
  'shutter-stack':      new Set(['bands', 'color', 'accentColor', 'accent', 'stagger', 'stiffness', 'damping', 'sound', 'preset']),
  'typo-shatter':       new Set(['word', 'fontSize', 'fontWeight', 'fontFamily', 'textColor', 'bgColor', 'scatterRadius', 'stiffness', 'damping', 'sound', 'preset']),
  'elementis-shutter':  new Set(['bands', 'color', 'accentColor', 'accent', 'stagger', 'stiffness', 'damping', 'sound', 'preset']),
  'mew-slash':          new Set(['slashCount', 'slashes', 'color', 'accentColor', 'accent', 'angle', 'jaggedness', 'stiffness', 'damping', 'sound', 'preset']),
  'oscar-bubble':       new Set(['points', 'wobble', 'rimColor', 'rim', 'maskColor', 'stiffness', 'damping', 'sound', 'preset']),
  'device-morph':       new Set(['accentColor', 'accent', 'borderColor', 'curveRadius', 'pitchAngle', 'rollAngle', 'stiffness', 'damping', 'sound', 'preset']),
  'device-portal':      new Set(['accentColor', 'accent', 'borderColor', 'curveRadius', 'pitchAngle', 'rollAngle', 'stiffness', 'damping', 'sound', 'preset']),
  'device-frame':       new Set(['accentColor', 'accent', 'borderColor', 'curveRadius', 'pitchAngle', 'rollAngle', 'stiffness', 'damping', 'sound', 'preset']),
  'chromatic-curtain':  new Set(['colors', 'accentColors', 'accentBars', 'direction', 'stagger', 'stiffness', 'damping', 'sound', 'preset']),
  'multi-column-wipe':  new Set(['colors', 'accentColors', 'accentBars', 'direction', 'stagger', 'stiffness', 'damping', 'sound', 'preset']),
  'gradient-cascade':   new Set(['colors', 'accentColors', 'accentBars', 'direction', 'stagger', 'stiffness', 'damping', 'sound', 'preset']),
  'aurora-wave':        new Set(['colors', 'waves', 'speed', 'amplitude', 'glow', 'stiffness', 'damping', 'sound', 'preset']),
  'prism-glass':        new Set(['backdropBlur', 'blur', 'chromaticSpread', 'dispersion', 'tiltAngle', 'tintColor', 'color', 'specular', 'stiffness', 'damping', 'sound', 'preset']),
  'cyber-deck':         new Set(['cardCount', 'cards', 'tilt', 'stagger', 'borderColor', 'glowColor', 'accentColor', 'accent', 'glassColor', 'color', 'stiffness', 'damping', 'sound', 'preset']),
  'fluid-morph-convex': new Set(['colors', 'nodes', 'swell', 'stiffness', 'damping', 'sound', 'preset']),
  'orbital-eclipse':    new Set(['coronaColor', 'color', 'diskColor', 'lensWarp', 'glowRadius', 'stiffness', 'damping', 'sound', 'preset']),
};

const OPTION_ALIASES = {
  scale:       'maxScale',
  wobble:      'wobbleIntensity',
  rim:         'rimColor',
  fill:        'fillColor',
  fadeAt:      'textFadeOutAt',
  width:       'initialWidth',
  height:      'initialHeight',
  radius:      'initialRadius',
  angle:       'tearAngle',
  blur:        'maxBlur',
  fabric:      'fabricColor',
  distortion:  'maxDistortion',
  accent:      'accentColor',
  cols:        'columns',
  color:       'color',
};

const COLOR_KEY_MAP = {
  'dimensional-tunnel': 'tunnelColor',
  'neural-synapse':     'synapseColor',
  'crosshair-zoom':     'overlayColor',
  'noise-dissolve':     'noiseColor',
};

const RESERVED_PROPS = new Set([
  'transition', 'as', 'href', 'onTransition', 'disabled',
  'children', 'className', 'style', 'onClick', 'gesture',
]);

function splitProps(transition, allProps) {
  const optionNames = TRANSITION_OPTIONS[transition] || new Set();
  const transitionOpts = {};
  const elementProps = {};

  for (const [key, value] of Object.entries(allProps)) {
    if (RESERVED_PROPS.has(key)) continue;

    if (optionNames.has(key)) {
      const resolvedKey = OPTION_ALIASES[key] || key;
      if (key === 'color' && COLOR_KEY_MAP[transition]) {
        transitionOpts[COLOR_KEY_MAP[transition]] = value;
      } else {
        transitionOpts[resolvedKey] = value;
      }
    } else {
      elementProps[key] = value;
    }
  }

  return [transitionOpts, elementProps];
}

export const Mo = forwardRef(function Mo(props, ref) {
  const {
    transition = 'liquid-blob',
    as = 'div',
    href,
    onTransition,
    disabled = false,
    gesture = null,
    navigateOn = 'cover',
    viewTransition = false,
    children,
    className = '',
    style,
    onClick,
    ...rest
  } = props;

  const innerRef = useRef(null);
  const combinedRef = (node) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const [transitionOpts, elementProps] = splitProps(transition, rest);
  const { trigger, attachGesture, isAnimating } = usePageTransition(transition, transitionOpts);

  // Bind gesture if specified
  useEffect(() => {
    if (!gesture || !innerRef.current) return;
    const axis = gesture === 'vertical' ? 'vertical' : (gesture === 'diagonal' ? 'diagonal' : 'horizontal');
    const gestureCtrl = attachGesture(innerRef.current, {
      axis,
      onCommit: () => {
        if (onTransition) onTransition();
        else if (href) window.location.href = href;
      },
    });

    return () => {
      gestureCtrl?.destroy();
    };
  }, [gesture, attachGesture, onTransition, href]);

  const handleClick = useCallback(async (e) => {
    onClick?.(e);
    if (e.defaultPrevented || disabled || isAnimating) return;

    const executeNavigation = () => {
      if (typeof document !== 'undefined' && viewTransition && document.startViewTransition) {
        document.startViewTransition(() => {
          if (onTransition) onTransition();
          else if (href) window.location.href = href;
        });
      } else {
        if (onTransition) onTransition();
        else if (href) window.location.href = href;
      }
    };

    await trigger(e, executeNavigation);
  }, [trigger, isAnimating, onClick, disabled, href, onTransition, viewTransition]);

  return createElement(
    as,
    {
      ref: combinedRef,
      className: `mo-transition ${className}`.trim(),
      style: { cursor: disabled ? 'default' : 'pointer', ...style },
      onClick: handleClick,
      'data-mo-animating': isAnimating || undefined,
      ...elementProps,
    },
    children
  );
});

Mo.displayName = 'Mo';
