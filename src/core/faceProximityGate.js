// Face height in the full webcam image is a distance proxy, not meters.
export class FaceProximityGate {
  constructor(percent = 40, { settleMs = 350, exitMs = 350, lossHoldMs = 250, smoothingMs = 120 } = {}) {
    this.settleMs = settleMs;
    Object.assign(this, { exitMs, lossHoldMs, smoothingMs });
    this.setThresholdPercent(percent);
  }

  setThresholdPercent(value) {
    const number = Number(value);
    this.thresholdPercent = Number.isFinite(number) ? Math.max(5, Math.min(70, number)) : 40;
    this.accepted = false;
    this.nearSince = null;
    this.farSince = null;
    this.lastAccepted = null;
    this.lastAcceptedAt = null;
    this.smoothedHeight = null;
    this.lastMeasurementAt = null;
  }

  filter(tracking, now = performance.now()) {
    const points = (tracking?.rawLandmarks || tracking?.landmarks)?.slice(0, 468);
    if (!tracking?.detected || !points?.length) {
      if (this.accepted && this.lastAccepted && now - this.lastAcceptedAt < this.lossHoldMs) {
        return { ...this.lastAccepted, isNewFrame: false, trackingHeld: true };
      }
      this.accepted = false;
      this.nearSince = null;
      this.farSince = null;
      this.smoothedHeight = null;
      this.lastMeasurementAt = null;
      this.faceHeightPercent = 0;
      return tracking;
    }
    const ys = points.map(p => p?.y);
    this.faceHeightPercent = ys.every(Number.isFinite)
      ? (Math.max(...ys) - Math.min(...ys)) * 100 : 0;
    if (tracking.isNewFrame !== false) {
      const dt = this.lastMeasurementAt == null ? this.smoothingMs : Math.max(0, now - this.lastMeasurementAt);
      const blend = this.smoothingMs > 0 ? 1 - Math.exp(-dt / this.smoothingMs) : 1;
      this.smoothedHeight = this.smoothedHeight == null ? this.faceHeightPercent
        : this.smoothedHeight + (this.faceHeightPercent - this.smoothedHeight) * blend;
      this.lastMeasurementAt = now;
    }
    // Small backward movements must not alternate live/autonomous every frame.
    const required = this.thresholdPercent * (this.accepted ? 0.95 : 1);
    const closeEnough = (this.smoothedHeight ?? this.faceHeightPercent) >= required;
    if (!closeEnough) {
      this.farSince ??= now;
      if (!this.accepted || now - this.farSince >= this.exitMs
        || this.faceHeightPercent < this.thresholdPercent * 0.75) this.accepted = false;
      this.nearSince = null;
    } else if (tracking.isNewFrame !== false) {
      this.farSince = null;
      this.nearSince ??= now;
      if (now - this.nearSince >= this.settleMs) this.accepted = true;
    }
    if (this.accepted && tracking.isNewFrame !== false) {
      this.lastAccepted = tracking;
      this.lastAcceptedAt = now;
    }
    return this.accepted ? tracking : { ...tracking, detected: false,
      tooFar: !closeEnough, proximityPending: closeEnough };
  }
}
