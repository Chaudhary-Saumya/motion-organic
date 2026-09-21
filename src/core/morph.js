/**
 * Path morphing via point-correspondence resampling.
 *
 * The naive approach (interpolating two `d` strings directly, or doing a
 * CSS `path()` cross-fade) only works if both paths have the SAME NUMBER
 * and ORDER of control points — which two arbitrary blob shapes never do.
 * That mismatch is exactly why most DIY "blob morph" attempts either error
 * out or warp unrecognizably mid-transition.
 *
 * The fix: walk each path by ARC LENGTH (not by control point index) and
 * resample N points evenly spaced along it. Two shapes resampled to the
 * same N always correspond point-for-point, so linear interpolation between
 * them is stable and smooth regardless of how the original paths were
 * authored (Illustrator, Figma, hand-written — doesn't matter).
 */
export function samplePath(pathEl, numPoints = 64) {
  const length = pathEl.getTotalLength();
  const pts = new Array(numPoints);
  for (let i = 0; i < numPoints; i++) {
    const p = pathEl.getPointAtLength((i / (numPoints - 1)) * length);
    pts[i] = [p.x, p.y];
  }
  return pts;
}

export function interpolatePoints(a, b, t) {
  const out = new Array(a.length);
  for (let i = 0; i < a.length; i++) {
    out[i] = [a[i][0] + (b[i][0] - a[i][0]) * t, a[i][1] + (b[i][1] - a[i][1]) * t];
  }
  return out;
}

export function pointsToSmoothPath(pts) {
  // Catmull-Rom -> cubic Bezier conversion for a closed, smooth outline
  // (straight line-to segments between 64 sampled points would look
  // faceted; this keeps the organic curve intact through the morph).
  const n = pts.length;
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)} `;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} `;
  }
  return d + 'Z';
}

/** Convenience: build a ready-to-animate morph between two <path> elements. */
export class ShapeMorph {
  constructor(fromPathEl, toPathEl, { points = 64 } = {}) {
    this.a = samplePath(fromPathEl, points);
    this.b = samplePath(toPathEl, points);
  }
  at(t) {
    return pointsToSmoothPath(interpolatePoints(this.a, this.b, t));
  }
  to(t) {
    return this.at(t);
  }
}

