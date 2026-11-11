import { ExtrudeGeometry, Path, Shape, type BufferGeometry } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Number candles, drawn as 2D outlines and extruded: no font files to download.
// Each geometry is normalised to 1 unit tall, centred left-right and front-back, base at y = 0.

const STROKE = 0.2;
const EXTRUDE = {
  depth: 0.22,
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.035,
  bevelSegments: 3,
  curveSegments: 28,
};

const deg = (d: number) => (d * Math.PI) / 180;

/** A thick arc, swept clockwise from `start` to `end` (degrees). */
function arcBand(cx: number, cy: number, radius: number, start: number, end: number) {
  const outer = radius + STROKE / 2;
  const inner = radius - STROKE / 2;
  const shape = new Shape();
  shape.moveTo(cx + outer * Math.cos(deg(start)), cy + outer * Math.sin(deg(start)));
  shape.absarc(cx, cy, outer, deg(start), deg(end), true);
  shape.lineTo(cx + inner * Math.cos(deg(end)), cy + inner * Math.sin(deg(end)));
  shape.absarc(cx, cy, inner, deg(end), deg(start), false);
  shape.closePath();
  return shape;
}

const BUILDERS: Record<string, () => BufferGeometry> = {
  // Two stacked bowls opening to the left
  "3": () => {
    const top = new ExtrudeGeometry(arcBand(0, 0.25, 0.23, 150, -90), EXTRUDE);
    const bottom = new ExtrudeGeometry(arcBand(0, -0.25, 0.23, 90, -150), EXTRUDE);
    // The bowls overlap at the waist; nudge one forward a hair so their faces never flicker against each other
    bottom.translate(0, 0, 0.004);
    return mergeGeometries([top, bottom])!;
  },
  // An oval ring
  "0": () => {
    const shape = new Shape();
    shape.absellipse(0, 0, 0.33, 0.5, 0, Math.PI * 2, false, 0);
    const hole = new Path();
    hole.absellipse(0, 0, 0.33 - STROKE * 0.9, 0.5 - STROKE * 0.95, 0, Math.PI * 2, true, 0);
    shape.holes.push(hole);
    return new ExtrudeGeometry(shape, EXTRUDE);
  },
};

const cache = new Map<string, BufferGeometry>();

/** The extruded number for this character, or null if there isn't one (it gets a classic candle). */
export function getDigitGeometry(char: string): BufferGeometry | null {
  const build = BUILDERS[char];
  if (!build) return null;
  let geometry = cache.get(char);
  if (!geometry) {
    geometry = build();
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const height = box.max.y - box.min.y;
    geometry.translate(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2);
    geometry.scale(1 / height, 1 / height, 1 / height);
    cache.set(char, geometry);
  }
  return geometry;
}
