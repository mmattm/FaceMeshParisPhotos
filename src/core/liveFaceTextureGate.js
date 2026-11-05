// This controls texture selection only; off-center faces still drive tracking,
// visitor recognition and presence across the full webcam image.
export class LiveFaceTextureGate {
  constructor({ settleMs = 300, exitMs = 350 } = {}) {
    this.settleMs = settleMs;
    this.exitMs = exitMs;
    this.allowed = false;
    this.centeredSince = null;
    this.invalidSince = null;
  }

  update(tracking, now) {
    const points = (tracking?.rawLandmarks || tracking?.landmarks)?.slice(0, 468);
    if (!tracking?.detected || !points?.length
      || points.some(p => !Number.isFinite(p?.x) || !Number.isFinite(p?.y))) {
      this.allowed = false;
      this.centeredSince = null;
      this.invalidSince = null;
      return false;
    }
    const xs = points.map(p => p.x), ys = points.map(p => p.y);
    const left = Math.min(...xs), right = Math.max(...xs);
    const top = Math.min(...ys), bottom = Math.max(...ys);
    // Position alone must not change the portrait, mouth or bust presentation.
    // Use a smaller exit margin and tolerate brief edge jitter once acquired.
    const margin = this.allowed ? 0.01 : 0.03;
    const centered = left >= margin && right <= 1 - margin
      && top >= margin && bottom <= 1 - margin
      && bottom - top >= 0.12;
    if (!centered) {
      this.centeredSince = null;
      this.invalidSince ??= now;
      if (now - this.invalidSince >= this.exitMs) this.allowed = false;
    } else if (tracking.isNewFrame !== false) {
      this.invalidSince = null;
      this.centeredSince ??= now;
      if (now - this.centeredSince >= this.settleMs) this.allowed = true;
    }
    return this.allowed;
  }
}
