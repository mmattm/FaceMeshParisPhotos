const measureFace = tracking => {
  const points = (tracking?.rawLandmarks || tracking?.landmarks)?.slice(0, 468);
  if (!points?.length || points.some(p => !Number.isFinite(p?.x) || !Number.isFinite(p?.y))) return null;
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  const left = Math.min(...xs), right = Math.max(...xs), top = Math.min(...ys), bottom = Math.max(...ys);
  return { left, right, top, bottom, cx: (left + right) / 2, cy: (top + bottom) / 2, height: bottom - top };
};

// This controls texture selection only; off-center faces still drive tracking,
// visitor recognition and presence across the full webcam image.
export class LiveFaceTextureGate {
  constructor({ settleMs = 450, exitMs = 120, minFaceHeight = 0.4 } = {}) {
    this.settleMs = settleMs;
    this.exitMs = exitMs;
    this.minFaceHeight = minFaceHeight;
    this.allowed = false;
    this.centeredSince = null;
    this.invalidSince = null;
    this.calibration = { cx: 0.5, cy: 0.5, yaw: 0, pitch: 0, roll: 0 };
    this.measurement = null;
    this.reason = 'waiting';
  }

  setCalibration(calibration) {
    for (const key of ['cx', 'cy', 'yaw', 'pitch', 'roll']) {
      const value = calibration?.[key];
      if (!Number.isFinite(value) || (key === 'cx' || key === 'cy'
        ? value < 0.1 || value > 0.9 : Math.abs(value) > 45)) throw new Error('Calibration du visage invalide');
    }
    this.calibration = { ...calibration };
    this.allowed = false;
    this.centeredSince = this.invalidSince = null;
  }

  calibrate(tracking) {
    const face = measureFace(tracking);
    if (!tracking?.detected || !face || face.height < 0.08) throw new Error('Placez votre visage devant la webcam');
    if (face.left < 0.015 || face.right > 0.985 || face.top < 0.015 || face.bottom > 0.985) {
      throw new Error('Reculez légèrement pour garder le visage entier dans l’image');
    }
    const pose = tracking.headPose || {};
    this.setCalibration({ cx: face.cx, cy: face.cy, yaw: pose.yaw || 0, pitch: pose.pitch || 0, roll: pose.roll || 0 });
    return Math.max(5, Math.min(70, Math.floor(face.height * 90)));
  }

  update(tracking, now, minFaceHeight = this.minFaceHeight) {
    const face = this.measurement = measureFace(tracking);
    if (!tracking?.detected || !face) {
      this.allowed = false;
      this.centeredSince = null;
      this.invalidSince = null;
      this.reason = tracking?.tooFar ? 'distance' : tracking?.proximityPending ? 'stabilizing' : 'waiting';
      return false;
    }
    const { left, right, top, bottom, cx, cy } = face;
    const pose = tracking.headPose || {};
    const margin = this.allowed ? 0.015 : 0.03;
    // Slightly wider exit limits avoid oscillation at the edge of the live zone.
    const centered = Math.abs(cx - this.calibration.cx) <= (this.allowed ? 0.16 : 0.12)
      && Math.abs(cy - this.calibration.cy) <= (this.allowed ? 0.20 : 0.16);
    const complete = left >= margin && right <= 1 - margin && top >= margin && bottom <= 1 - margin;
    const close = bottom - top >= minFaceHeight * (this.allowed ? 0.9 : 1);
    const frontal = Math.abs((pose.yaw || 0) - this.calibration.yaw) <= (this.allowed ? 32 : 25)
      && Math.abs((pose.pitch || 0) - this.calibration.pitch) <= (this.allowed ? 32 : 25)
      && Math.abs((pose.roll || 0) - this.calibration.roll) <= (this.allowed ? 25 : 20);
    this.reason = !complete ? 'clipped' : !close ? 'distance' : !centered ? 'centering' : !frontal ? 'pose' : 'stabilizing';
    if (!centered || !complete || !close || !frontal) {
      this.centeredSince = null;
      this.invalidSince ??= now;
      if (now - this.invalidSince >= this.exitMs) this.allowed = false;
    } else if (tracking.isNewFrame !== false) {
      this.invalidSince = null;
      this.centeredSince ??= now;
      if (now - this.centeredSince >= this.settleMs) this.allowed = true;
    }
    if (this.allowed) this.reason = 'live';
    return this.allowed;
  }
}
