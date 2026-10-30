const UPPER_LIP = new Set([0, 11, 12, 13, 37, 39, 40, 80, 81, 82, 267, 269, 270, 310, 311, 312]);
const LOWER_LIP = new Set([14, 15, 16, 17, 84, 85, 86, 87, 88, 91, 95, 146, 178, 179, 180, 181, 314, 315, 316, 317, 318, 321, 324, 375, 402, 403, 405]);
const CORNERS = new Set([61, 78, 291, 308]);
const unit = value => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
const smooth = value => { const t = unit(value); return t * t * (3 - 2 * t); };

// Close the captured resting gap without changing the reference used for UVs
// or the geometry used by speech and recorded expressions.
export function closeRestingMouth(points, amount = 1) {
  const strength = unit(amount);
  if (strength === 0) return points;
  const upperInner = [191, 80, 81, 82, 13, 312, 311, 310, 415];
  const lowerInner = [95, 88, 178, 87, 14, 317, 402, 318, 324];
  const upperOuter = [185, 40, 39, 37, 0, 267, 269, 270, 409];
  const lowerOuter = [146, 91, 181, 84, 17, 314, 405, 321, 375];
  for (let i = 0; i < upperInner.length; i++) {
    const upper = points[upperInner[i]], lower = points[lowerInner[i]];
    if (!upper || !lower) continue;
    const dx = (lower.x - upper.x) * 0.5 * strength;
    const dy = (lower.y - upper.y) * 0.5 * strength;
    const dz = ((lower.z || 0) - (upper.z || 0)) * 0.5 * strength;
    const midY = (upper.y + lower.y) * 0.5;
    const midX = (upper.x + lower.x) * 0.5;
    const midZ = ((upper.z || 0) + (lower.z || 0)) * 0.5;
    for (const [index, sign] of [[upperInner[i], 1], [upperOuter[i], 1],
      [lowerInner[i], -1], [lowerOuter[i], -1]]) {
      const point = points[index];
      if (!point) continue;
      point.x += sign * dx;
      point.y += sign * dy;
      point.z = (point.z || 0) + sign * dz;
    }
    if (strength === 1) {
      upper.y = lower.y = midY;
      upper.x = lower.x = midX;
      upper.z = lower.z = midZ;
    }
  }
  return points;
}

// Deform the lips and neighbouring skin together. All distances are relative to
// this face's mouth width, so small faces cannot inherit a large canvas-sized drop.
export function deformMouth(base, output, bs, aspectRatio, rigidSkull = new Set()) {
  const left = base[61], right = base[291], upper = base[13], lower = base[14];
  if (!left || !right || !upper || !lower) return output;
  const ar = Math.max(0.1, aspectRatio);
  const dx = (right.x - left.x) * ar, dy = right.y - left.y;
  const width = Math.hypot(dx, dy);
  if (width < 0.0001) return output;
  const ux = dx / width, uy = dy / width;
  const vx = -uy, vy = ux; // mouth-local downward direction
  const centerX = (left.x + right.x) * 0.5;
  const centerY = (upper.y + lower.y) * 0.5;
  const chin = base[152];
  const chinDistance = Math.max(width * 0.45, chin ? (chin.x - centerX) * ar * vx + (chin.y - centerY) * vy : width * 0.7);
  const jaw = unit(bs.jawOpen) * (1 - unit(bs.mouthClose) * 0.75);
  const articulationGain = bs._audioArticulation ? 1.55 : 1;
  const funnel = unit(bs.mouthFunnel), pucker = unit(bs.mouthPucker);
  const smileLeft = unit(bs.mouthSmileLeft), smileRight = unit(bs.mouthSmileRight);

  for (let i = 0; i < Math.min(base.length, 468); i++) {
    if (rigidSkull.has(i) || !output[i]) continue;
    const point = base[i];
    const localX = (point.x - centerX) * ar * ux + (point.y - centerY) * uy;
    const localY = (point.x - centerX) * ar * vx + (point.y - centerY) * vy;
    const across = localX / (width * 0.5);
    const side = unit(0.5 + localX / width);
    const lowerProgress = unit(localY / chinDistance);
    const isUpper = UPPER_LIP.has(i), isLower = LOWER_LIP.has(i);
    const isLip = isUpper || isLower || CORNERS.has(i);
    const isBelow = isLower || (!isUpper && localY >= 0);

    // Jaw motion fans gently into the lower face; lip opening tapers to zero
    // at the corners. No abrupt boundary between selected lip and cheek points.
    const reach = width * (0.5 + (isLip ? 0 : lowerProgress * 0.45));
    const lateral = Math.cos(Math.min(1, Math.abs(localX) / reach) * Math.PI * 0.5);
    const tissue = isLip ? 1 : isBelow
      ? 1 - lowerProgress * 0.45
      : 1 - smooth(Math.abs(localY) / (width * 0.25));
    const openingWeight = lateral * lateral * tissue;
    const upperUp = unit(bs.mouthUpperUpLeft) * (1 - side) + unit(bs.mouthUpperUpRight) * side;
    const lowerDown = unit(bs.mouthLowerDownLeft) * (1 - side) + unit(bs.mouthLowerDownRight) * side;
    let down = width * openingWeight * (isBelow
      ? jaw * 0.18 + lowerDown * 0.035 + funnel * 0.025
      : -(jaw * 0.045 + upperUp * 0.10 + funnel * 0.025));
    down *= articulationGain;

    const skinX = 1 - smooth((Math.abs(localX) / width - 0.5) / 0.4);
    const skinY = isLip ? 1 : 1 - smooth(Math.abs(localY) / (width * (isBelow ? 0.50 : 0.30)));
    const perioral = skinX * skinY;
    const smile = smileLeft * (1 - side) + smileRight * side;
    down -= width * smile * (0.015 + Math.min(1, Math.abs(across)) ** 1.5 * 0.04) * perioral;
    const stretch = unit(bs.mouthStretchLeft) * (1 - side) + unit(bs.mouthStretchRight) * side;
    const out = Math.sign(localX) * width * Math.min(1, Math.abs(across)) * (smile * 0.035 + stretch * 0.025) * perioral
      - localX * (pucker * 0.10 + funnel * 0.06) * perioral;
    output[i].x += (ux * out + vx * down) / ar;
    output[i].y += uy * out + vy * down;
    // A slight retreat of the mandible and protrusion of rounded lips add
    // volume without shearing the lower lip away from its surrounding skin.
    output[i].z += width / ar * (jaw * 0.025 * openingWeight * (isBelow ? 1 : 0)
      - (pucker * 0.05 + funnel * 0.035) * perioral);
  }
  return output;
}
