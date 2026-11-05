// Compare only with the last accepted visitor. Descriptors stay in memory.
export const descriptorDistance = (a, b) => Math.hypot(...a.map((v, i) => v - b[i]));

export class VisitorIdentity {
  constructor({ describe, onNewVisitor, onStatus = () => {}, onSameVisitor = () => {}, intervalMs = 400,
    monitorMs = 2000, newVisitorMs = 2000, uncertainVisitorMs = 4000, comparisonTimeoutMs = 8000,
    sameThreshold = 0.5, differentThreshold = 0.62, confirmations = 3, absenceResetMs = 60000 }) {
    Object.assign(this, { describe, onNewVisitor, onStatus, onSameVisitor, intervalMs, monitorMs,
      newVisitorMs, uncertainVisitorMs, comparisonTimeoutMs,
      sameThreshold, differentThreshold, confirmations });
    this.enabled = true;
    this.reference = null;
    this.pending = null;
    this.version = 0;
    this.busy = false;
    this.nextSampleAt = 0;
    this.sameReported = false;
    this.absentSince = null;
    this.setAbsenceResetMs(absenceResetMs);
  }

  setAbsenceResetMs(value) {
    const duration = Number(value);
    this.absenceResetMs = Number.isFinite(duration)
      ? Math.max(0, Math.min(600000, duration)) : 60000;
  }

  request(detail) {
    this.version++;
    if (!this.enabled) return this.onNewVisitor(detail);
    this.pending = { detail, samples: [], votes: [] };
    this.nextSampleAt = 0;
    if (!this.reference || !this.sameReported) this.onStatus('checking');
  }

  setEnabled(enabled) {
    this.enabled = !!enabled;
    this.version++;
    this.pending = null;
    this.nextSampleAt = 0;
    this.onStatus(enabled ? 'ready' : 'disabled');
  }

  // A manual new-visitor trigger must never retain the previous identity.
  reset() {
    this.version++;
    this.pending = null;
    this.reference = null;
    this.sameReported = false;
    this.nextSampleAt = 0;
  }

  async observe(tracking, video, now) {
    if (tracking?.trackingHeld) return;
    // Also check on return in case no observations ran during the absence.
    if (this.absenceResetMs > 0 && this.absentSince !== null
      && now - this.absentSince >= this.absenceResetMs
      && (this.reference || this.pending)) {
      this.reset();
    }
    if (!tracking?.detected) {
      if (this.enabled) this.onStatus(tracking?.tooFar ? 'tooFar'
        : tracking?.proximityPending ? 'stabilizing' : 'waiting');
      this.absentSince ??= now;
      if (now - this.absentSince >= 500) this.sameReported = false;
      // Reject inference results captured before a departure, including a brief one.
      this.version++;
      if (this.pending) {
        this.pending.samples = [];
        this.pending.votes = [];
        this.pending.candidateSince = null;
        this.pending.lastSampleAt = null;
        this.pending.evidenceSince = null;
      }
      return;
    }
    this.absentSince = null;
    // Inspect a continuous presence periodically too: a face can change without
    // any absence. Wait between confirmed checks to limit CPU use.
    if (this.enabled && !this.pending && !this.busy && now >= this.nextSampleAt) {
      this.request({ reason: this.reference ? 'IDENTITY_CHECK' : 'INITIAL_VISITOR' });
    }
    if (!this.enabled || !this.pending || this.busy
      || tracking.isNewFrame === false || now < this.nextSampleAt) return;
    this.busy = true;
    const version = this.version;
    const pending = this.pending;
    this.nextSampleAt = now + this.intervalMs;
    try {
      const descriptor = await this.describe(video, tracking);
      if (version !== this.version || pending !== this.pending) return;
      if (!descriptor) {
        this.onStatus('position');
        return;
      }
      if (!descriptor.length || !Array.from(descriptor).every(Number.isFinite)) return;
      const sample = Array.from(descriptor);
      if (pending.lastSampleAt != null && now - pending.lastSampleAt > 1200) {
        pending.samples = [];
        pending.votes = [];
        pending.candidateSince = null;
        pending.evidenceSince = null;
      }
      pending.lastSampleAt = now;
      const previous = pending.samples.at(-1);
      if (previous && descriptorDistance(previous, sample) > this.sameThreshold) {
        pending.samples = [];
        pending.votes = [];
        pending.candidateSince = null;
        pending.evidenceSince = null;
      }
      pending.evidenceSince ??= now;
      pending.samples.push(sample);
      pending.samples = pending.samples.slice(-this.confirmations);
      const distance = this.reference
        ? Math.min(...this.reference.map(ref => descriptorDistance(ref, sample))) : null;
      const vote = distance === null ? 'new'
        : distance <= this.sameThreshold ? 'same'
          : distance >= this.differentThreshold ? 'new' : 'uncertain';
      if (vote === 'same') pending.candidateSince = null;
      else pending.candidateSince ??= now;
      pending.votes.push(vote);
      pending.votes = pending.votes.slice(-this.confirmations);
      if (pending.votes.length < this.confirmations) return;
      if (pending.votes.every(v => v === 'same')) {
        this.pending = null;
        this.nextSampleAt = now + this.monitorMs;
        this.onStatus('same', distance);
        if (!this.sameReported) this.onSameVisitor(distance);
        this.sameReported = true;
      } else {
        const uncertain = !pending.votes.every(v => v === 'new');
        const waitMs = uncertain ? this.uncertainVisitorMs : this.newVisitorMs;
        const timedOut = now - pending.evidenceSince >= this.comparisonTimeoutMs;
        if (!timedOut && (pending.votes.includes('same') || pending.candidateSince == null
          || now - pending.candidateSince < waitMs)) {
          this.onStatus(uncertain ? 'uncertain' : 'checking', distance);
          return;
        }
        this.reference = pending.samples.map(s => s.slice());
        this.pending = null;
        this.nextSampleAt = now + this.monitorMs;
        // Report the first subsequent match too, even without a departure.
        this.sameReported = false;
        this.onStatus('new', distance);
        this.onNewVisitor({ ...pending.detail, identityConfirmed: true, identityDistance: distance,
          identityUncertain: !pending.votes.every(v => v === 'new') });
      }
    } catch (error) {
      if (version === this.version && pending === this.pending) {
        // Fail closed: do not emit OSC/ComfyUI on a failed identity comparison.
        this.onStatus('error', null, error);
        this.nextSampleAt = now + 5000;
      }
    } finally {
      this.busy = false;
    }
  }
}
