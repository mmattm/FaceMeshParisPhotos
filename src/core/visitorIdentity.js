// Keep one portrait and its face descriptor for the last accepted visitor.
export const descriptorDistance = (a, b) => Math.hypot(...a.map((v, i) => v - b[i]));

export class VisitorIdentity {
  constructor({ capture, describe, onNewVisitor, onStatus = () => {}, onSameVisitor = () => {},
    onReference = () => {}, intervalMs = 400, sameThreshold = 0.42, absenceResetMs = 60000,
    inferenceTimeoutMs = 12000 }) {
    Object.assign(this, { capture, describe, onNewVisitor, onStatus, onSameVisitor, onReference, intervalMs, inferenceTimeoutMs });
    this.enabled = true;
    this.reference = null;
    this.pending = null;
    this.version = 0;
    this.busy = false;
    this.sameReported = false;
    this.absentSince = null;
    this.nextSampleAt = 0;
    this.arrivalPending = true;
    this.lastDistance = null;
    this.status = 'waiting';
    const reportStatus = this.onStatus;
    this.onStatus = (status, ...args) => { this.status = status; reportStatus(status, ...args); };
    this.setSameThreshold(sameThreshold);
    this.setAbsenceResetMs(absenceResetMs);
  }

  setAbsenceResetMs(value) {
    const duration = Number(value);
    this.absenceResetMs = Number.isFinite(duration)
      ? Math.max(0, Math.min(600000, duration)) : 60000;
  }

  setSameThreshold(value) {
    const threshold = Number(value);
    this.sameThreshold = Number.isFinite(threshold)
      ? Math.max(0.25, Math.min(0.5, threshold)) : 0.42;
    this.version++;
    this.pending = null;
    this.nextSampleAt = 0;
    this.arrivalPending = true;
  }

  request(detail) {
    this.version++;
    if (!this.enabled) return this.onNewVisitor(detail);
    this.pending = detail;
    this.nextSampleAt = 0;
    this.arrivalPending = true;
  }

  setEnabled(enabled) {
    this.enabled = !!enabled;
    this.version++;
    this.pending = null;
    this.nextSampleAt = 0;
    this.arrivalPending = true;
    this.onStatus(enabled ? 'ready' : 'disabled');
  }

  reset() {
    this.version++;
    this.busy = false;
    this.reference = null;
    this.pending = null;
    this.sameReported = false;
    this.nextSampleAt = 0;
    this.arrivalPending = true;
    this.lastDistance = null;
    this.onReference(null);
  }

  async describeWithTimeout(portrait) {
    let timer;
    try {
      const descriptor = await Promise.race([
        Promise.resolve().then(() => this.describe(portrait)),
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error('Analyse du visage trop longue : nouvelle tentative dans 5 s.')), this.inferenceTimeoutMs);
        })
      ]);
      if (!descriptor?.length || !Array.from(descriptor).every(Number.isFinite)) {
        throw new Error('Empreinte du visage invalide');
      }
      return Array.from(descriptor);
    } finally {
      clearTimeout(timer);
    }
  }

  async observe(tracking, video, now, { paused = false } = {}) {
    if (tracking?.trackingHeld) return;
    if (this.absenceResetMs > 0 && this.absentSince !== null
      && now - this.absentSince >= this.absenceResetMs && this.reference) {
      this.reset();
      this.pending = { reason: 'RETURN_AFTER_RESET' };
    }
    if (!tracking?.detected) {
      this.absentSince ??= now;
      this.sameReported = false;
      this.version++; // Reject an image captured before departure.
      this.nextSampleAt = 0;
      if (this.enabled) this.onStatus(tracking?.tooFar ? 'tooFar'
        : tracking?.proximityPending ? 'stabilizing' : 'waiting');
      return;
    }
    const absenceDuration = this.absentSince === null ? 0 : now - this.absentSince;
    if (absenceDuration >= 1000) {
      this.arrivalPending = true;
      this.pending ??= { reason: 'RETURN_AFTER_ABSENCE', absenceDuration };
    }
    this.absentSince = null;
    // Rendering pauses comparisons, never the camera's presence/absence clock.
    if (paused) {
      this.version++;
      if (this.enabled) this.onStatus('paused');
      return;
    }
    if (!this.enabled) return;
    // A continuous visit stays locked. Expressions cannot create repeated visits.
    if (!this.arrivalPending) {
      if (this.status !== 'active') this.onStatus('active', this.lastDistance);
      return;
    }
    if (this.busy || tracking.isNewFrame === false || now < this.nextSampleAt) return;
    const operation = {};
    this.busy = operation;
    const version = this.version;
    const detail = this.pending || { reason: this.reference ? 'IDENTITY_CHECK' : 'INITIAL_VISITOR' };
    this.nextSampleAt = now + this.intervalMs;
    try {
      const portrait = this.capture(video, tracking, { forComparison: !!this.reference });
      if (!portrait) {
        this.onStatus('position');
        return;
      }
      // With no previous visitor, there is nothing to compare. Start immediately.
      if (!this.reference) {
        this.reference = { descriptor: null, portrait };
        this.arrivalPending = false;
        this.lastDistance = null;
        this.pending = null;
        this.sameReported = true;
        this.onReference(portrait);
        this.onStatus('new', null);
        this.onNewVisitor({ ...detail, identityConfirmed: false, identityDistance: null });
        return;
      }
      this.onStatus('checking');
      const reference = this.reference;
      if (!reference.descriptor) reference.descriptor = await this.describeWithTimeout(reference.portrait);
      if (version !== this.version) return;
      const descriptor = await this.describeWithTimeout(portrait);
      if (version !== this.version) return;
      if (descriptor.length !== reference.descriptor.length) {
        throw new Error('Incompatible face descriptors');
      }
      const distance = descriptorDistance(reference.descriptor, descriptor);
      this.lastDistance = distance;
      this.arrivalPending = false;
      this.pending = null;
      if (distance !== null && distance <= this.sameThreshold) {
        this.onStatus('same', distance);
        if (!this.sameReported) this.onSameVisitor(distance);
        this.sameReported = true;
        return;
      }
      // One usable different portrait immediately becomes the new reference.
      this.reference = { descriptor, portrait };
      this.sameReported = true;
      this.onReference(portrait);
      this.onStatus('new', distance);
      this.onNewVisitor({ ...detail, identityConfirmed: true, identityDistance: distance });
    } catch (error) {
      if (version === this.version) {
        this.onStatus('error', null, error);
        this.nextSampleAt = now + 5000;
      }
    } finally {
      if (this.busy === operation) this.busy = false;
    }
  }
}
