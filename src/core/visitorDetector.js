/** A new visit starts when a face returns after a continuous absence. */
export class VisitorDetector extends EventTarget {
  constructor({ absenceMs = 3000 } = {}) {
    super();
    this.setAbsenceMs(absenceMs);
    this.reset();
  }

  setAbsenceMs(value) {
    this.absenceMs = Number.isFinite(Number(value))
      ? Math.max(1000, Math.min(10000, Number(value))) : 3000;
  }

  reset() {
    this.hasVisitor = false;
    this.absentSince = null;
  }

  update(tracking, now = performance.now()) {
    const isPresent = Boolean(tracking?.detected && tracking.landmarks?.length);
    if (!isPresent) {
      if (this.hasVisitor && this.absentSince === null) this.absentSince = now;
      return { isPresent: false, isNewVisitor: false };
    }
    const absenceDuration = this.absentSince === null ? 0 : now - this.absentSince;
    const isNewVisitor = !this.hasVisitor || absenceDuration >= this.absenceMs;
    const reason = this.hasVisitor ? 'RETURN_AFTER_ABSENCE' : 'INITIAL_VISITOR';
    this.hasVisitor = true;
    this.absentSince = null;
    if (isNewVisitor) {
      this.dispatchEvent(new CustomEvent('new-visitor', {
        detail: { reason, absenceDuration }
      }));
    }
    return { isPresent: true, isNewVisitor };
  }
}
