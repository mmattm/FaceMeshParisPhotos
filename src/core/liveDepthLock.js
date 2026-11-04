// MediaPipe encodes approach/recession mostly as landmark scale, even with an
// orthographic camera. Normalize around the nose root and preserve camera UVs.
import { createFallbackFaceLandmarks } from './fallbackFace.js';

export function lockLiveDepth(frame, reference, aspectRatio = 16 / 9) {
  const pose = frame.poseLandmarks || frame.landmarks;
  const anchor = pose?.[168];
  const distance = (a, b) => a && b ? Math.hypot(
    (a.x - b.x) * aspectRatio, a.y - b.y,
    ((a.z || 0) - (b.z || 0)) * aspectRatio * 1.10) : 0;
  const size = distance(pose?.[10], pose?.[152]) * 0.68
    + distance(pose?.[234], pose?.[454]) * 0.32;
  if (!anchor || !Number.isFinite(size) || size < 0.001) return frame;
  if (!reference.size) {
    const canonical = createFallbackFaceLandmarks(aspectRatio);
    reference.size = distance(canonical[10], canonical[152]) * 0.68
      + distance(canonical[234], canonical[454]) * 0.32;
  }
  reference.z ??= anchor.z || 0;
  const scale = reference.size / size;
  const normalize = points => points?.map(point => point && ({
    ...point,
    x: anchor.x + (point.x - anchor.x) * scale,
    y: anchor.y + (point.y - anchor.y) * scale,
    z: reference.z + ((point.z || 0) - (anchor.z || 0)) * scale
  }));
  return {
    ...frame,
    landmarks: normalize(frame.landmarks),
    poseLandmarks: normalize(pose),
    liveLandmarks: frame.liveLandmarks || frame.landmarks
  };
}
