import * as THREE from 'three';

// Bind Face Cap vertices to the canonical MediaPipe triangles once. The photo
// landmarks then supply UVs; the UVs stay attached while morph targets animate.
export function buildPhotoBinding(geometry, toCanonical, vertices, triangles, outline = []) {
  const position = geometry.attributes.position;
  const bindings = [];
  const weights = new Float32Array(position.count);
  const point = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    point.fromBufferAttribute(position, i).applyMatrix4(toCanonical);
    let best = null, bestDistance = Infinity;
    for (const [a, b, c] of triangles) {
      const va = vertices[a], vb = vertices[b], vc = vertices[c];
      const denom = (vb.y - vc.y) * (va.x - vc.x) + (vc.x - vb.x) * (va.y - vc.y);
      if (Math.abs(denom) < 1e-8) continue;
      const u = ((vb.y - vc.y) * (point.x - vc.x) + (vc.x - vb.x) * (point.y - vc.y)) / denom;
      const v = ((vc.y - va.y) * (point.x - vc.x) + (va.x - vc.x) * (point.y - vc.y)) / denom;
      const w = 1 - u - v;
      if (Math.min(u, v, w) < -0.001) continue;
      const z = va.z * u + vb.z * v + vc.z * w;
      const distance = Math.abs(point.z - z);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = { indices: [a, b, c], weights: [u, v, w] };
      }
    }
    bindings.push(best);
    // Keep the rear of the head its original skin color; blend at the silhouette.
    weights[i] = best ? 1 - THREE.MathUtils.smoothstep(bestDistance, 1.5, 3.5) : 0;
    if (best && outline.length) {
      let borderDistance = Infinity;
      for (const { start, end } of outline) {
        const a = vertices[start], b = vertices[end];
        const dx = b.x - a.x, dy = b.y - a.y;
        const t = THREE.MathUtils.clamp(((point.x - a.x) * dx + (point.y - a.y) * dy)
          / Math.max(1e-8, dx * dx + dy * dy), 0, 1);
        borderDistance = Math.min(borderDistance, Math.hypot(point.x - a.x - t * dx, point.y - a.y - t * dy));
      }
      weights[i] *= THREE.MathUtils.smoothstep(borderDistance, 0, 0.7);
    }
  }
  geometry.setAttribute('photoWeight', new THREE.BufferAttribute(weights, 1));
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(position.count * 2), 2));
  return bindings;
}

export function updatePhotoUvs(geometry, bindings, landmarks) {
  if (!landmarks) return;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (!binding) { uv.setXY(i, 0.5, 0.5); continue; }
    let x = 0, y = 0;
    for (let j = 0; j < 3; j++) {
      const point = landmarks[binding.indices[j]];
      if (!point) continue;
      x += point.x * binding.weights[j];
      y += point.y * binding.weights[j];
    }
    uv.setXY(i, x, 1 - y);
  }
  uv.needsUpdate = true;
}
