export class AutonomousTimeout {
  constructor(seconds = 60) {
    this.setSeconds(seconds);
  }

  setSeconds(value) {
    const seconds = Number(value);
    this.seconds = Number.isFinite(seconds) ? Math.min(3600, Math.max(0, Math.round(seconds))) : 60;
    this.startedAt = null;
  }

  update(forced, now) {
    if (!forced || this.seconds === 0) {
      this.startedAt = null;
      return false;
    }
    this.startedAt ??= now;
    return now - this.startedAt >= this.seconds * 1000;
  }
}
