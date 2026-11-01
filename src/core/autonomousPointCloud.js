import * as THREE from 'three';
import { faceHandoffWeight } from './faceCapRig.js';

const FEATURE_CONTOURS = [
  [33,246,161,160,159,158,157,173,133,155,154,153,145,144,163,7],
  [362,398,384,385,386,387,388,466,263,249,390,373,374,380,381,382],
  [61,185,40,39,37,0,267,269,270,409,291,375,321,405,314,17,84,181,91,146],
  [78,191,80,81,82,13,312,311,310,415,308,324,318,402,317,14,87,178,88,95],
];

function eyeBoundarySamples(source, toCanonical, landmarks) {
  if (!source.index) return [];
  // Weld texture seams before finding the actual openings in the skin mesh.
  const vertices = [], ids = [], welded = new Map(), edges = new Map();
  for (let i = 0; i < source.attributes.position.count; i++) {
    const position = new THREE.Vector3().fromBufferAttribute(source.attributes.position, i).applyMatrix4(toCanonical);
    const key = position.toArray().map(value => value.toFixed(4)).join(',');
    if (!welded.has(key)) { welded.set(key, vertices.length); vertices.push({ index: i, position }); }
    ids.push(welded.get(key));
  }
  for (let i = 0; i < source.index.count; i += 3) {
    const triangle = [0,1,2].map(offset => ids[source.index.getX(i + offset)]);
    for (let j = 0; j < 3; j++) {
      const key = [triangle[j], triangle[(j + 1) % 3]].sort((a,b) => a-b).join(',');
      edges.set(key, (edges.get(key) || 0) + 1);
    }
  }
  const boundary = new Set();
  for (const [key, count] of edges) if (count === 1) key.split(',').forEach(index => boundary.add(Number(index)));
  return [...boundary].map(index => vertices[index]).filter(({ index, position: p }) => {
    if (p.z < .3 || (source.attributes.photoWeight && source.attributes.photoWeight.getX(index) < .08)) return false;
    return [[33,133],[362,263]].some(([a,b]) => {
      const left = Math.min(landmarks[a].x, landmarks[b].x), right = Math.max(landmarks[a].x, landmarks[b].x);
      const y = (landmarks[a].y + landmarks[b].y) / 2;
      return p.x > left - .4 && p.x < right + .4 && Math.abs(p.y - y) < .85;
    });
  });
}

/** Front skin samples, with extra definition along the eyelids and lips. */
export class AutonomousPointRig {
  constructor(source, toCanonical, landmarks) {
    const positions = source.attributes.position, normals = source.attributes.normal;
    const photoWeight = source.attributes.photoWeight;
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(toCanonical);
    const point = new THREE.Vector3(), normal = new THREE.Vector3();
    const frontCells = new Map();
    for (let index = 0; index < positions.count; index++) {
      point.fromBufferAttribute(positions, index).applyMatrix4(toCanonical);
      if (photoWeight && (photoWeight.getX(index) < .08 || point.z < .3)) continue;
      if (normals) {
        normal.fromBufferAttribute(normals, index).applyNormalMatrix(normalMatrix);
        if (normal.z < .2) continue;
      }
      // Keep the visible layer of skin when the lips or contour overlap.
      const key = `${Math.round(point.x / .12)},${Math.round(point.y / .12)}`;
      if (!frontCells.has(key) || frontCells.get(key).position.z < point.z) {
        // Stable tie breaking avoids filling one side first on regular grids.
        const priority = ((Math.imul(index + 1, 2654435761) >>> 0) % 1000003) / 1000003;
        frontCells.set(key, { index, position: point.clone(), distance: Infinity, priority });
      }
    }
    const candidates = [...frontCells.values()], selected = [], featureSamples = new Set();
    // Eyelid rims can face into the eye socket. Keep their front opening even
    // when the skin-normal filter rejects those tightly folded edge vertices.
    for (const sample of eyeBoundarySamples(source, toCanonical, landmarks)) {
      let item = candidates.find(candidate => candidate.position.distanceToSquared(sample.position) < 1e-8);
      if (!item) {
        item = { ...sample, distance: Infinity, priority: 0 };
        candidates.push(item);
      }
      featureSamples.add(item);
    }
    // Reserve contour samples before spreading the remaining points across the
    // skin. Every point still follows an actual model vertex and its morphs.
    for (const contour of FEATURE_CONTOURS) {
      for (let i = 0; i < contour.length; i++) {
        const a = landmarks[contour[i]], b = landmarks[contour[(i + 1) % contour.length]];
        for (const t of [0, .5]) {
          const target = a.clone().lerp(b, t);
          let closest = null, distance = .7 ** 2;
          for (const item of candidates) {
            // Face Cap's depth differs from the canonical face; register the
            // contours mainly in the image plane, retaining a front-depth bias.
            const d = (item.position.x - target.x) ** 2 + (item.position.y - target.y) ** 2
              + .04 * (item.position.z - target.z) ** 2;
            if (d < distance) { closest = item; distance = d; }
          }
          if (closest) featureSamples.add(closest);
        }
      }
    }
    this.featureCount = featureSamples.size;
    const reserved = [...featureSamples];
    let next = reserved.shift() || candidates.reduce((best, item) => !best || item.position.z > best.position.z ? item : best, null);
    while (next && selected.length < 478) {
      selected.push(next);
      const previous = next;
      next = null;
      for (const item of candidates) {
        const dx = item.position.x - previous.position.x, dy = item.position.y - previous.position.y;
        item.distance = Math.min(item.distance, dx * dx + dy * dy);
        if (item.distance > 1e-8 && (!next || item.distance > next.distance + 1e-8
          || (Math.abs(item.distance - next.distance) < 1e-8 && item.priority > next.priority))) next = item;
      }
      if (reserved.length) next = reserved.shift();
    }
    // Preserve nearby correspondences during Live/Autonomous shape handoffs.
    // The remaining skin keeps an even distribution around the feature contours.
    const reference = landmarks.slice(0, 468).map(vertex => vertex.clone());
    for (const [a,b] of [[33,133],[362,263]]) {
      const center = landmarks[a].clone().add(landmarks[b]).multiplyScalar(.5);
      for (let i=0;i<5;i++) reference.push(center.clone());
    }
    const remaining = new Set(selected.map((_, index) => index)), ordered = [];
    selected.sort((a,b) => (b.position.x ** 2 + .7 * b.position.y ** 2) - (a.position.x ** 2 + .7 * a.position.y ** 2));
    for (const item of selected) {
      let slot = remaining.values().next().value, distance = Infinity;
      for (const index of remaining) {
        const target = reference[index] || reference[0];
        const d = (item.position.x - target.x) ** 2 + (item.position.y - target.y) ** 2;
        if (d < distance) { distance = d; slot = index; }
      }
      ordered[slot] = item;
      remaining.delete(slot);
    }
    this.count = ordered.length;
    this.base = new Float32Array(478 * 3);
    this.deltas = (source.morphAttributes.position || []).map(() => new Float32Array(this.count * 3));
    const linear = new THREE.Matrix3().setFromMatrix4(toCanonical), delta = new THREE.Vector3();
    ordered.forEach((item, i) => {
      item.position.toArray(this.base, i * 3);
      (source.morphAttributes.position || []).forEach((attribute, morphIndex) => {
        delta.fromBufferAttribute(attribute, item.index);
        if (!source.morphTargetsRelative) delta.sub(new THREE.Vector3().fromBufferAttribute(positions, item.index));
        delta.applyMatrix3(linear).toArray(this.deltas[morphIndex], i * 3);
      });
    });
  }

  update(geometry, influences) {
    const values = geometry.attributes.position.array;
    values.set(this.base);
    this.deltas.forEach((delta, index) => {
      const influence = influences[index] || 0;
      if (!influence) return;
      for (let i = 0; i < delta.length; i++) values[i] += delta[i] * influence;
    });
    geometry.attributes.position.needsUpdate = true;
    geometry.setDrawRange(0, this.count);
    return this.count > 0;
  }
}

/** Match the pose handoff clock while changing between real and animated skin. */
export class PointCloudTransition {
  constructor() { this.reset(); }

  reset() { this.last = null; this.kind = null; this.active = null; this.count = 0; }

  update(geometry, kind, now, durationMs) {
    const values = geometry.attributes.position.array;
    if (this.last && kind !== this.kind) this.active = { from: this.last.slice(), startedAt: now };
    if (this.active) {
      const weight = faceHandoffWeight(now - this.active.startedAt, durationMs);
      if (weight < 1) {
        for (let i = 0; i < values.length; i++) values[i] = this.active.from[i] * (1 - weight) + values[i] * weight;
      } else this.active = null;
    }
    this.last ||= new Float32Array(values.length);
    this.last.set(values);
    this.kind = kind;
    this.count = geometry.drawRange.count;
    geometry.attributes.position.needsUpdate = true;
  }
}
