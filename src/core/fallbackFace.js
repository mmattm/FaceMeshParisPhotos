// Standard MediaPipe face geometry, Apache-2.0:
// https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model.obj
import canonicalFaceObj from './canonicalFaceModel.obj?raw';

export function createFallbackFaceLandmarks(aspectRatio = 16 / 9) {
  const vertices = canonicalFaceObj.split(/\r?\n/).filter(line => line.startsWith('v '))
    .map(line => line.trim().split(/\s+/).slice(1).map(Number));
  const minY = Math.min(...vertices.map(point => point[1]));
  const maxY = Math.max(...vertices.map(point => point[1]));
  const scale = 0.48 / (maxY - minY);
  const centerY = (minY + maxY) / 2;
  const landmarks = vertices.map(([x, y, z]) => ({
    x: 0.5 + x * scale / aspectRatio,
    y: 0.48 - (y - centerY) * scale,
    z: -z * scale / aspectRatio,
    visibility: 1
  }));
  // FaceLandmarker adds five iris points per eye to the 468-vertex model.
  for (const [left, right] of [[33, 133], [362, 263]]) {
    const a = landmarks[left], b = landmarks[right];
    const center = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2, visibility: 1 };
    const radius = Math.abs(a.x - b.x) * 0.2;
    landmarks.push(center);
    for (let i = 0; i < 4; i++) {
      const angle = i * Math.PI / 2;
      landmarks.push({ ...center, x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius * aspectRatio });
    }
  }
  return landmarks;
}
