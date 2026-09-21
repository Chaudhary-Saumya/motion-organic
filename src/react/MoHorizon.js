import {
  useRef,
  useEffect,
  useState,
  useCallback,
  createElement,
  forwardRef,
  createContext,
  useContext,
} from 'react';
import { spatialHorizon } from '../core/spatialHorizon.js';

const MoHorizonContext = createContext({
  horizon: spatialHorizon,
  active: true,
});

export function useMoHorizonContext() {
  return useContext(MoHorizonContext);
}

/**
 * <MoHorizon> — Cinema-Grade 3D Cylindrical Horizon Roll & Perspective Depth Container.
 *
 * Projects child elements onto a virtual 3D cylindrical drum or planetary horizon.
 * Elements dynamically pitch, recede in Z-space, and receive atmospheric lighting
 * as they scroll into view.
 *
 * @example
 * ```jsx
 * import { MoHorizon, MoHorizonItem } from 'motion-organic/react';
 *
 * export function PlanetShowcase() {
 *   return (
 *     <MoHorizon radius={1400} perspective={1000} shading>
 *       <MoHorizonItem>
 *         <div className="card">Section 1 (Curves into 3D Horizon)</div>
 *       </MoHorizonItem>
 *       <MoHorizonItem>
 *         <div className="card">Section 2</div>
 *       </MoHorizonItem>
 *     </MoHorizon>
 *   );
 * }
 * ```
 */
export const MoHorizon = forwardRef(function MoHorizon({
  children,
  radius = 1200,
  perspective = 1000,
  orientation = 'vertical',
  shading = true,
  as = 'div',
  className = '',
  style,
  ...rest
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    spatialHorizon.radius = radius;
    spatialHorizon.perspective = perspective;
    spatialHorizon.orientation = orientation;
    spatialHorizon.shading = shading;
    spatialHorizon.start();
  }, [radius, perspective, orientation, shading]);

  return createElement(
    MoHorizonContext.Provider,
    { value: { horizon: spatialHorizon, active: true } },
    createElement(
      as,
      {
        ref: mergedRef,
        className: `mo-horizon-container ${className}`.trim(),
        style: {
          perspective: `${perspective}px`,
          transformStyle: 'preserve-3d',
          ...style,
        },
        ...rest,
      },
      children
    )
  );
});
MoHorizon.displayName = 'MoHorizon';

/**
 * <MoHorizonItem> — Individual 3D element projected onto the cylindrical horizon.
 *
 * @example
 * ```jsx
 * <MoHorizonItem radius={1200} pitchFactor={1.2} depthFactor={1.0}>
 *   <div className="banner">3D Pitch Banner</div>
 * </MoHorizonItem>
 * ```
 */
export const MoHorizonItem = forwardRef(function MoHorizonItem({
  children,
  radius,
  perspective,
  depthFactor = 1.0,
  pitchFactor = 1.0,
  shading,
  originOffset = 0.5,
  onUpdate,
  as = 'div',
  className = '',
  style,
  ...rest
}, ref) {
  const innerRef = useRef(null);
  const mergedRef = useMergedRef(ref, innerRef);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const unsub = spatialHorizon.add(el, {
      radius,
      perspective,
      depthFactor,
      pitchFactor,
      shading,
      originOffset,
      onUpdate,
    });

    return () => unsub();
  }, [radius, perspective, depthFactor, pitchFactor, shading, originOffset, onUpdate]);

  return createElement(
    as,
    {
      ref: mergedRef,
      className: `mo-horizon-item ${className}`.trim(),
      style: {
        transformStyle: 'preserve-3d',
        ...style,
      },
      ...rest,
    },
    children
  );
});
MoHorizonItem.displayName = 'MoHorizonItem';

/**
 * <MoHorizonSection> — Semantic section alias for MoHorizonItem.
 */
export const MoHorizonSection = forwardRef(function MoHorizonSection(props, ref) {
  return createElement(MoHorizonItem, { as: 'section', ref, ...props });
});
MoHorizonSection.displayName = 'MoHorizonSection';

/**
 * <MoSpatial> — 3D Spatial Stacking & Depth Matrix Container.
 */
export const MoSpatial = MoHorizon;

/**
 * <MoSpatialLayer> — 3D Spatial Depth Layer.
 */
export const MoSpatialLayer = MoHorizonItem;

// ─── React Hooks ────────────────────────────────────────────────────────────

/**
 * useSpatialPerspective — Imperatively attach 3D perspective horizon projection to any ref.
 *
 * @param {import('react').RefObject<HTMLElement>} targetRef
 * @param {Object} options
 */
export function useSpatialPerspective(targetRef, options = {}) {
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const unsub = spatialHorizon.add(el, options);
    return () => unsub();
  }, [targetRef, JSON.stringify(options)]);
}

// ─── Ref Merging Utility ────────────────────────────────────────────────────

function useMergedRef(forwardedRef, internalRef) {
  return useCallback((node) => {
    internalRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  }, [forwardedRef, internalRef]);
}
