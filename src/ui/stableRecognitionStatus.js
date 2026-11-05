const IMMEDIATE = new Set(['new', 'same', 'error', 'disabled', 'paused']);

// Stabilize only the displayed label; recognition decisions remain unchanged.
export class StableRecognitionStatus {
  constructor({ settleMs = 600, holdMs = 1200 } = {}) {
    Object.assign(this, { settleMs, holdMs });
    this.current = null;
    this.candidate = null;
    this.changedAt = -Infinity;
  }

  update(status, now) {
    if (status !== this.candidate) {
      this.candidate = status;
      this.candidateSince = now;
    }
    if (!this.current || IMMEDIATE.has(status)
      || (now - this.candidateSince >= this.settleMs && now - this.changedAt >= this.holdMs)) {
      if (status !== this.current) {
        this.current = status;
        this.changedAt = now;
      }
    }
    return this.current;
  }
}
