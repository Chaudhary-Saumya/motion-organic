import { useRef, useEffect, createElement } from 'react';
import { usePageTransition } from './usePageTransition.js';

/**
 * ScrollTransitionZone — React wrapper for scroll-driven page transitions.
 *
 * @example
 * ```jsx
 * <ScrollTransitionZone
 *   transition="text-portal"
 *   options={{ word: 'NEXUS' }}
 *   height="280vh"
 * >
 *   <div className="my-sticky-content">...</div>
 * </ScrollTransitionZone>
 * ```
 */
export function ScrollTransitionZone({
  children,
  transition = 'text-portal',
  options = {},
  scrollOptions = {},
  height = '280vh',
  className = '',
  style = {},
}) {
  const zoneRef = useRef(null);
  const { attachScroll } = usePageTransition(transition, options);

  useEffect(() => {
    if (!zoneRef.current) return;
    const controller = attachScroll(zoneRef.current, scrollOptions);
    return () => {
      controller?.destroy();
    };
  }, [attachScroll, JSON.stringify(scrollOptions)]);

  return createElement(
    'div',
    {
      ref: zoneRef,
      className: `motion-organic-scroll-zone ${className}`.trim(),
      style: {
        position: 'relative',
        height,
        ...style,
      },
    },
    children
  );
}

