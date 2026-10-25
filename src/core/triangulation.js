/**
 * Canonical MediaPipe FaceMesh Triangulation Table
 * Converts 468 landmarks into ~854 continuous 3D polygon triangles for 3D Mask shading
 * with consistent outward topological winding.
 */

// Build oriented triangle triplets [a, b, c] from tessellation connections
export function buildTrianglesFromTesselation(connections) {
  if (!connections || connections.length === 0) return [];

  // MediaPipe FaceLandmarker.FACE_LANDMARKS_TESSELATION is ordered in consecutive
  // triplets of 3 edges forming closed 3-cycles with canonical outward winding:
  // e0: a -> b, e1: b -> c, e2: c -> a
  if (connections.length % 3 === 0) {
    let isCanonicalTriplets = true;
    const testCount = Math.min(connections.length, 30);
    for (let i = 0; i < testCount; i += 3) {
      const e0 = connections[i];
      const e1 = connections[i + 1];
      const e2 = connections[i + 2];
      if (!e0 || !e1 || !e2 || e0.end !== e1.start || e1.end !== e2.start || e2.end !== e0.start) {
        isCanonicalTriplets = false;
        break;
      }
    }

    if (isCanonicalTriplets) {
      const triangles = [];
      for (let i = 0; i < connections.length; i += 3) {
        const a = connections[i].start;
        const b = connections[i + 1].start;
        const c = connections[i + 2].start;
        // Only include face mesh vertices (exclude iris points 468-477)
        if (a < 468 && b < 468 && c < 468) {
          triangles.push([a, b, c]);
        }
      }
      return triangles;
    }
  }

  // Fallback: cycle detection with oriented edges
  const adj = new Map();
  for (let i = 0; i < connections.length; i++) {
    const { start, end } = connections[i];
    if (!adj.has(start)) adj.set(start, new Set());
    adj.get(start).add(end);
  }

  const triangles = [];
  const visited = new Set();

  for (let i = 0; i < connections.length; i++) {
    const u = connections[i].start;
    const v = connections[i].end;
    const neighborsV = adj.get(v);
    if (!neighborsV) continue;

    neighborsV.forEach(w => {
      const neighborsW = adj.get(w);
      if (neighborsW && neighborsW.has(u)) {
        const sortedKey = [u, v, w].sort((a, b) => a - b).join('_');
        if (!visited.has(sortedKey)) {
          visited.add(sortedKey);
          if (u < 468 && v < 468 && w < 468) {
            triangles.push([u, v, w]);
          }
        }
      }
    });
  }

  return triangles;
}

