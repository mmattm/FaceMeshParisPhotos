const EYES = [
  { upper: [33, 246, 161, 160, 159, 158, 157, 173, 133],
    lower: [33, 7, 163, 144, 145, 153, 154, 155, 133],
    crease: [22, 23, 24, 110, 25] },
  { upper: [263, 466, 388, 387, 386, 385, 384, 398, 362],
    lower: [263, 249, 390, 373, 374, 380, 381, 382, 362],
    crease: [252, 253, 254, 339, 255] }
];

// Adjust the existing opening (negative amounts open it), preserving blinks, eye expressions,
// and the original landmarks used for texture coordinates and tracking.
export function relaxEyelids(landmarks, amount = 0.22) {
  const result = landmarks.slice();
  const strength = Math.max(-0.5, Math.min(1, amount));
  for (const { upper, lower, crease } of EYES) {
    for (let i = 1; i < upper.length - 1; i++) {
      const u = landmarks[upper[i]], l = landmarks[lower[i]];
      if (!u || !l) continue;
      const top = { ...u }, bottom = { ...l };
      for (const axis of ['x', 'y', 'z']) {
        const gap = (l[axis] || 0) - (u[axis] || 0);
        top[axis] = (u[axis] || 0) + gap * strength * 0.8;
        bottom[axis] = (l[axis] || 0) - gap * strength * 0.2;
      }
      result[upper[i]] = top;
      result[lower[i]] = bottom;
    }
    const top = landmarks[upper[4]], bottom = landmarks[lower[4]];
    if (!top || !bottom) continue;
    for (const index of crease) {
      const point = landmarks[index];
      if (!point) continue;
      const moved = { ...point };
      for (const axis of ['x', 'y', 'z']) {
        moved[axis] = (point[axis] || 0) + ((bottom[axis] || 0) - (top[axis] || 0)) * strength * 0.25;
      }
      result[index] = moved;
    }
  }
  return result;
}
