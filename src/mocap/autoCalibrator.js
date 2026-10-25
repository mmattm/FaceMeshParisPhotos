/**
 * Automatic Face Presence & Neutral Baseline Calibrator
 * 
 * Automatically detects when a new person arrives or steps into frame,
 * checks motion stability to ensure they are calm and facing the camera,
 * and calibrates their neutral resting baseline once with a lockout threshold
 * to prevent infinite calibration loops.
 */

export class AutoCalibrator extends EventTarget {
  constructor(looper) {
    super();
    this.looper = looper;

    // Presence & Timing State
    this.lastFaceSeenTime = 0;
    this.faceAbsentSince = performance.now();
    this.faceWasAbsent = true;
    this.isCalibrating = false;
    this.lastCalibrationTime = 0;
    this.hasCalibratedAtLeastOnce = false;

    // Motion Stability Buffer (measures head stillness over ~300ms)
    this.stabilityHistory = [];
    this.stabilityWindow = 15;

    // Thresholds
    // 1. Minimum absence before a face is considered a "new person"
    this.ABSENCE_THRESHOLD_MS = 1800;
    // 2. Head motion stability threshold (standard deviation of head position)
    this.MOTION_STABILITY_THRESHOLD = 0.0065;
    // 3. Minimum cooldown before auto-calibrating again (unless face was absent > 1.8s)
    this.LOCKOUT_COOLDOWN_MS = 7000;
  }

  update(trackingResult, now = performance.now()) {
    // 1. If no face detected
    if (!trackingResult || !trackingResult.detected || !trackingResult.landmarks) {
      if (!this.faceWasAbsent) {
        this.faceAbsentSince = now;
        this.faceWasAbsent = true;
      }
      this.stabilityHistory = [];
      return;
    }

    const absentDuration = now - this.faceAbsentSince;
    const isNewFace = (!this.hasCalibratedAtLeastOnce) || (this.faceWasAbsent && absentDuration >= this.ABSENCE_THRESHOLD_MS);

    this.faceWasAbsent = false;
    this.lastFaceSeenTime = now;

    // 2. Prevent concurrent calibration
    if (this.isCalibrating || this.looper.calibrator.isCalibrating) {
      return;
    }

    // 3. Prevent infinite calibration loop while the same person is sitting in front of camera
    if (this.hasCalibratedAtLeastOnce && (now - this.lastCalibrationTime < this.LOCKOUT_COOLDOWN_MS) && absentDuration < this.ABSENCE_THRESHOLD_MS) {
      return;
    }

    // 4. If we have a new face, check motion stability threshold before firing
    if (isNewFace) {
      const lm = trackingResult.landmarks;
      const eyeL = lm[133];
      const eyeR = lm[362];
      const nasion = lm[168];
      if (!eyeL || !eyeR || !nasion) return;

      const midX = (eyeL.x + eyeR.x) * 0.5;
      const midY = (eyeL.y + eyeR.y) * 0.5;
      const midZ = (eyeL.z || 0 + (eyeR.z || 0)) * 0.5;

      this.stabilityHistory.push({ x: midX, y: midY, z: midZ, time: now });
      if (this.stabilityHistory.length > this.stabilityWindow) {
        this.stabilityHistory.shift();
      }

      // Check if candidate has been still for the duration of the stability window
      if (this.stabilityHistory.length >= this.stabilityWindow) {
        let avgX = 0, avgY = 0, avgZ = 0;
        for (const p of this.stabilityHistory) {
          avgX += p.x; avgY += p.y; avgZ += p.z;
        }
        avgX /= this.stabilityHistory.length;
        avgY /= this.stabilityHistory.length;
        avgZ /= this.stabilityHistory.length;

        let variance = 0;
        for (const p of this.stabilityHistory) {
          const dx = p.x - avgX;
          const dy = p.y - avgY;
          const dz = p.z - avgZ;
          variance += dx * dx + dy * dy + dz * dz;
        }
        const stdDev = Math.sqrt(variance / this.stabilityHistory.length);

        // Stillness threshold: person is holding still, looking at camera
        if (stdDev < this.MOTION_STABILITY_THRESHOLD) {
          this.startAutoCalibration(now);
        }
      }
    }
  }

  startAutoCalibration(now) {
    this.isCalibrating = true;
    this.stabilityHistory = [];
    this.dispatchEvent(new CustomEvent('autocalibration:start'));

    this.looper.calibrator.startCalibration();

    const onComplete = () => {
      this.isCalibrating = false;
      this.hasCalibratedAtLeastOnce = true;
      this.lastCalibrationTime = performance.now();
      this.faceAbsentSince = performance.now();
      this.dispatchEvent(new CustomEvent('autocalibration:complete'));
      this.looper.calibrator.removeEventListener('calibration:complete', onComplete);
    };

    this.looper.calibrator.addEventListener('calibration:complete', onComplete);
  }
}
