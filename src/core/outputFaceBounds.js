// MediaPipe face oval: exclude iris/depth points and include the entire silhouette.
const FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
  397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58,
  132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

// Begin fading halfway to the exit boundary; finish before the face is clipped.
export function getDepartureBlend(landmarks, renderW, renderH, canvasW, canvasH,
  outputW = 1080, outputH = 1080) {
  if (!landmarks || ![renderW, renderH, canvasW, canvasH, outputW, outputH]
    .every(value => Number.isFinite(value) && value > 0)) return 1;
  const scale = Math.max(outputW / canvasW, outputH / canvasH);
  const halfW = outputW / scale * 0.48 / renderW;
  const halfH = outputH / scale * 0.48 / renderH;
  const points = FACE_OVAL.map(index => landmarks[index]);
  if (points.some(p => !p || !Number.isFinite(p.x) || !Number.isFinite(p.y))) return 1;
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const distance = Math.max(
    Math.abs((minX + maxX) / 2 - 0.5) / Math.max(0.01, halfW - (maxX - minX) / 2),
    Math.abs((minY + maxY) / 2 - 0.5) / Math.max(0.01, halfH - (maxY - minY) / 2));
  const t = Math.max(0, Math.min(1, (distance - 0.40) / 0.50));
  return t * t * (3 - 2 * t);
}

export function isFaceInsideOutput(landmarks, renderW, renderH, canvasW, canvasH,
  outputW = 1080, outputH = 1080, margin = 0.02) {
  if (!landmarks || ![renderW, renderH, canvasW, canvasH, outputW, outputH]
    .every(value => Number.isFinite(value) && value > 0)) return false;
  const scale = Math.max(outputW / canvasW, outputH / canvasH);
  const visibleW = outputW / scale;
  const visibleH = outputH / scale;
  const halfW = visibleW * (0.5 - margin) / renderW;
  const halfH = visibleH * (0.5 - margin) / renderH;
  return FACE_OVAL.every(index => {
    const point = landmarks[index];
    return point && Number.isFinite(point.x) && Number.isFinite(point.y)
      && Math.abs(point.x - 0.5) <= halfW && Math.abs(point.y - 0.5) <= halfH;
  });
}
