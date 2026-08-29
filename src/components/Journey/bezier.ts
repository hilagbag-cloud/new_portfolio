export type Point = { x: number; y: number };
export type CubicSegment = { p0: Point; p1: Point; p2: Point; p3: Point };

function cubicPoint(seg: CubicSegment, t: number): Point {
  const mt = 1 - t;
  const x =
    mt ** 3 * seg.p0.x +
    3 * mt ** 2 * t * seg.p1.x +
    3 * mt * t ** 2 * seg.p2.x +
    t ** 3 * seg.p3.x;
  const y =
    mt ** 3 * seg.p0.y +
    3 * mt ** 2 * t * seg.p1.y +
    3 * mt * t ** 2 * seg.p2.y +
    t ** 3 * seg.p3.y;
  return { x, y };
}

/** Builds a single continuous SVG path `d` string from connected cubic segments. */
export function pathFromSegments(segments: CubicSegment[]): string {
  if (segments.length === 0) return "";
  const [first, ...rest] = segments;
  let d = `M ${first.p0.x} ${first.p0.y} C ${first.p1.x} ${first.p1.y}, ${first.p2.x} ${first.p2.y}, ${first.p3.x} ${first.p3.y}`;
  for (const seg of rest) {
    d += ` C ${seg.p1.x} ${seg.p1.y}, ${seg.p2.x} ${seg.p2.y}, ${seg.p3.x} ${seg.p3.y}`;
  }
  return d;
}

/** Evaluates a point at a global progress value (0-1) across the whole connected curve. */
export function pointAtProgress(segments: CubicSegment[], progress: number): Point {
  const n = segments.length;
  const clamped = Math.min(Math.max(progress, 0), 1);
  const scaled = clamped * n;
  const index = Math.min(Math.floor(scaled), n - 1);
  const localT = scaled - index;
  return cubicPoint(segments[index], localT);
}

/** Approximates the total on-screen length of the curve by sampling. Used to drive the stroke reveal. */
export function approximateLength(segments: CubicSegment[], samples = 200): number {
  let length = 0;
  let prev = pointAtProgress(segments, 0);
  for (let i = 1; i <= samples; i++) {
    const point = pointAtProgress(segments, i / samples);
    length += Math.hypot(point.x - prev.x, point.y - prev.y);
    prev = point;
  }
  return length;
}
