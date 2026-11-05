// Continuous, reversible fade with zero speed and acceleration at each endpoint.
export class PortraitBlend {
  constructor(durationMs = 1100) {
    this.durationMs = durationMs;
    this.value = this.from = this.target = 0;
    this.startedAt = 0;
  }

  update(live, now) {
    const t = Math.max(0, Math.min(1, (now - this.startedAt) / this.durationMs));
    const eased = t * t * t * (t * (t * 6 - 15) + 10);
    this.value = this.from + (this.target - this.from) * eased;
    const target = live ? 1 : 0;
    if (target !== this.target) {
      this.from = this.value;
      this.target = target;
      this.startedAt = now;
    }
    return this.value;
  }

  reset(live = false) {
    this.value = this.from = this.target = live ? 1 : 0;
    return this.value;
  }
}
