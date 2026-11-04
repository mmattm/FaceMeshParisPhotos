// Compare only with the last accepted visitor. Descriptors stay in memory.
export const descriptorDistance = (a, b) => Math.hypot(...a.map((v, i) => v - b[i]));

export class VisitorIdentity {
  constructor({ describe, onNewVisitor, onStatus = () => {}, intervalMs = 400,
    sameThreshold = 0.5, differentThreshold = 0.62, confirmations = 3 }) {
    Object.assign(this, { describe, onNewVisitor, onStatus, intervalMs,
      sameThreshold, differentThreshold, confirmations });
    this.enabled = true;
    this.reference = null;
    this.pending = null;
    this.version = 0;
    this.busy = false;
    this.nextSampleAt = 0;
  }

  request(detail) {
    this.version++;
    if (!this.enabled) return this.onNewVisitor(detail);
    this.pending = { detail, samples: [], votes: [] };
    this.nextSampleAt = 0;
    this.onStatus('checking');
  }

  setEnabled(enabled) {
    this.enabled = !!enabled;
    this.version++;
    const pending = this.pending;
    this.pending = null;
    this.onStatus(enabled ? 'ready' : 'disabled');
    if (!enabled && pending) this.onNewVisitor(pending.detail);
  }

  // A manual new-visitor trigger must never retain the previous identity.
  reset() {
    this.version++;
    this.pending = null;
    this.reference = null;
  }

  async observe(tracking, video, now) {
    if (!tracking?.detected) {
      // Reject inference results captured before a departure, including a brief one.
      this.version++;
      if (this.pending) {
        this.pending.samples = [];
        this.pending.votes = [];
      }
      return;
    }
    if (!this.enabled || !this.pending || this.busy
      || tracking.isNewFrame === false || now < this.nextSampleAt) return;
    this.busy = true;
    const version = this.version;
    const pending = this.pending;
    this.nextSampleAt = now + this.intervalMs;
    try {
      const descriptor = await this.describe(video, tracking);
      if (version !== this.version || pending !== this.pending || !descriptor) return;
      if (!descriptor.length || !Array.from(descriptor).every(Number.isFinite)) return;
      const sample = Array.from(descriptor);
      const previous = pending.samples.at(-1);
      if (previous && descriptorDistance(previous, sample) > this.sameThreshold) {
        pending.samples = [];
        pending.votes = [];
      }
      pending.samples.push(sample);
      pending.samples = pending.samples.slice(-this.confirmations);
      const distance = this.reference
        ? Math.min(...this.reference.map(ref => descriptorDistance(ref, sample))) : null;
      const vote = distance === null ? 'new'
        : distance <= this.sameThreshold ? 'same'
          : distance >= this.differentThreshold ? 'new' : 'uncertain';
      pending.votes.push(vote);
      pending.votes = pending.votes.slice(-this.confirmations);
      if (pending.votes.length < this.confirmations) return;
      if (pending.votes.every(v => v === 'same')) {
        this.pending = null;
        this.onStatus('same', distance);
      } else if (pending.votes.every(v => v === 'new')) {
        this.reference = pending.samples.map(s => s.slice());
        this.pending = null;
        this.onStatus('new', distance);
        this.onNewVisitor({ ...pending.detail, identityConfirmed: true, identityDistance: distance });
      } else {
        this.onStatus('uncertain', distance);
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
