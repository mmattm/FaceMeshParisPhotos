/**
 * Apple Animoji-Grade Blendshape Calibrator & Non-Linear Phoneme Booster
 * 
 * 1. Zero-Baseline Calibration: Captures resting face baseline over ~1s to eliminate resting noise.
 * 2. Non-Linear Transfer Curves (Gamma + Dynamic Gain Expansion):
 *    Transforms subtle RGB webcam movements into crisp, energetic, distinct speech phonemes
 *    (jaw drops, lip funnels, puckers, smiles, blink snaps, brow raises).
 */

// Custom gain & gamma curves for standard ARKit 52 blendshapes
const BLENDSHAPE_PROFILES = {
  // Speech & Lip-Sync Phonemes (High Priority)
  jawOpen: { gain: 1.6, gamma: 0.82, deadzone: 0.02 },
  mouthFunnel: { gain: 1.8, gamma: 0.78, deadzone: 0.03 },
  mouthPucker: { gain: 1.7, gamma: 0.78, deadzone: 0.03 },
  mouthSmileLeft: { gain: 1.45, gamma: 0.88, deadzone: 0.02 },
  mouthSmileRight: { gain: 1.45, gamma: 0.88, deadzone: 0.02 },
  mouthRollLower: { gain: 1.8, gamma: 0.8, deadzone: 0.03 },
  mouthRollUpper: { gain: 1.8, gamma: 0.8, deadzone: 0.03 },
  mouthUpperUpLeft: { gain: 1.6, gamma: 0.82, deadzone: 0.02 },
  mouthUpperUpRight: { gain: 1.6, gamma: 0.82, deadzone: 0.02 },
  mouthLowerDownLeft: { gain: 1.6, gamma: 0.82, deadzone: 0.02 },
  mouthLowerDownRight: { gain: 1.6, gamma: 0.82, deadzone: 0.02 },
  mouthStretchLeft: { gain: 1.5, gamma: 0.85, deadzone: 0.02 },
  mouthStretchRight: { gain: 1.5, gamma: 0.85, deadzone: 0.02 },
  mouthClose: { gain: 1.5, gamma: 0.85, deadzone: 0.02 },
  mouthPressLeft: { gain: 1.6, gamma: 0.8, deadzone: 0.03 },
  mouthPressRight: { gain: 1.6, gamma: 0.8, deadzone: 0.03 },

  // Eyelids & Blinks
  eyeBlinkLeft: { gain: 1.35, gamma: 0.9, deadzone: 0.03 },
  eyeBlinkRight: { gain: 1.35, gamma: 0.9, deadzone: 0.03 },
  eyeSquintLeft: { gain: 1.5, gamma: 0.85, deadzone: 0.03 },
  eyeSquintRight: { gain: 1.5, gamma: 0.85, deadzone: 0.03 },
  eyeWideLeft: { gain: 1.6, gamma: 0.8, deadzone: 0.02 },
  eyeWideRight: { gain: 1.6, gamma: 0.8, deadzone: 0.02 },

  // Brows
  browInnerUp: { gain: 1.55, gamma: 0.82, deadzone: 0.02 },
  browDownLeft: { gain: 1.5, gamma: 0.85, deadzone: 0.02 },
  browDownRight: { gain: 1.5, gamma: 0.85, deadzone: 0.02 },
  browOuterUpLeft: { gain: 1.5, gamma: 0.85, deadzone: 0.02 },
  browOuterUpRight: { gain: 1.5, gamma: 0.85, deadzone: 0.02 },

  // Cheeks & Nose
  cheekPuff: { gain: 1.7, gamma: 0.78, deadzone: 0.04 },
  noseSneerLeft: { gain: 1.7, gamma: 0.8, deadzone: 0.03 },
  noseSneerRight: { gain: 1.7, gamma: 0.8, deadzone: 0.03 }
};

export class BlendshapeCalibrator extends EventTarget {
  constructor() {
    super();
    this.isCalibrating = false;
    this.calibrationSamples = [];
    this.calibrationDurationMs = 1000; // 1 second sample
    this.calibrationStartTime = 0;
    this.baselineScores = {};
    this.globalBoost = 1.35; // Global speech sensitivity multiplier
  }

  startCalibration() {
    this.isCalibrating = true;
    this.calibrationSamples = [];
    this.calibrationStartTime = performance.now();
    this.dispatchEvent(new CustomEvent('calibration:start'));
  }

  setBoost(boost) {
    this.globalBoost = Math.max(0.5, Math.min(3.0, boost));
  }

  process(rawBlendshapesMap, now = performance.now()) {
    if (!rawBlendshapesMap) return rawBlendshapesMap;

    // 1. Sampling during Calibration
    if (this.isCalibrating) {
      this.calibrationSamples.push({ ...rawBlendshapesMap });
      const elapsed = now - this.calibrationStartTime;

      this.dispatchEvent(new CustomEvent('calibration:progress', {
        detail: { progress: Math.min(1.0, elapsed / this.calibrationDurationMs) }
      }));

      if (elapsed >= this.calibrationDurationMs) {
        this.finishCalibration();
      }
    }

    // 2. Apply Zero-Baseline & Non-linear Transfer Curves
    const calibrated = {};
    for (const [name, rawScore] of Object.entries(rawBlendshapesMap)) {
      const baseline = this.baselineScores[name] || 0.0;
      const profile = BLENDSHAPE_PROFILES[name] || { gain: 1.3, gamma: 0.9, deadzone: 0.02 };

      // Zero-out resting baseline
      let score = Math.max(0, rawScore - baseline);
      const span = Math.max(0.1, 1.0 - baseline);
      score = score / span;

      // Apply deadzone
      if (score < profile.deadzone) {
        calibrated[name] = 0.0;
        continue;
      }

      // Non-linear Gamma response curve: y = x^gamma
      const remapped = Math.pow(score, profile.gamma);

      // Dynamic Gain Expansion scaled by global user boost
      const boosted = remapped * profile.gain * this.globalBoost;

      calibrated[name] = Math.max(0.0, Math.min(1.0, boosted));
    }

    return calibrated;
  }

  finishCalibration() {
    this.isCalibrating = false;
    if (this.calibrationSamples.length === 0) return;

    // Compute average baseline for each blendshape
    const sumMap = {};
    const count = this.calibrationSamples.length;

    for (let i = 0; i < count; i++) {
      const sample = this.calibrationSamples[i];
      for (const [k, v] of Object.entries(sample)) {
        sumMap[k] = (sumMap[k] || 0) + v;
      }
    }

    this.baselineScores = {};
    for (const [k, sum] of Object.entries(sumMap)) {
      this.baselineScores[k] = sum / count;
    }

    this.dispatchEvent(new CustomEvent('calibration:complete', {
      detail: { baselineScores: this.baselineScores }
    }));
  }

  reset() {
    this.baselineScores = {};
    this.isCalibrating = false;
    this.calibrationSamples = [];
  }
}
