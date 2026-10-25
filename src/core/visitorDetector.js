/**
 * Visitor Re-Identification & Biometric Presence Detector
 * 
 * Accurately and reliably detects when a NEW visitor appears in front of the camera
 * compared with the previous visitor, eliminating false triggers from blinks/head turns
 * and ensuring instantaneous detection when a new person arrives.
 * 
 * Multi-Factor Biometric Profiling:
 * 1. Skull-Local 3D Morphometrics (via CranialCoordinateSystem):
 *    - Invariant to distance, head rotation (yaw, pitch, roll) and screen position.
 *    - 12 rigid cranial proportions: face aspect ratio, zygomatic arch width,
 *      gonion jaw width, nasal length & width, inter-canthal span, and cranial vault balance.
 * 2. Photometric Skin Tone & Chromaticity:
 *    - Normalized (r, g) chromaticity and hue sampled from stable facial skin patches
 *      (forehead & malar cheekbones).
 * 3. Multi-Frame Consensus Window:
 *    - 5-frame rolling consensus filter to eliminate single-frame tracking noise or motion blur.
 */

import { CranialCoordinateSystem } from '../mocap/cranialCoordinateSystem.js';

export class VisitorDetector extends EventTarget {
  constructor(options = {}) {
    super();

    this.cranial = new CranialCoordinateSystem();
    this.cranial.setAspectRatio(16 / 9);

    // Decision Thresholds
    // Drastic difference required: morphometric difference >= 0.16 AND total dissimilarity >= 0.20
    // Must have lost tracking for at least 1500ms before a new visitor can ever be triggered
    this.DISSIMILARITY_THRESHOLD = options.threshold || 0.20;
    this.MORPH_THRESHOLD = options.morphThreshold || 0.16;
    this.MIN_ABSENCE_FOR_NEW_VISITOR_MS = options.minAbsenceMs || 1500;
    this.LONG_ABSENCE_RESET_MS = options.longAbsenceMs || 20000; // 20s empty room resets session

    // Visitor Signature State
    this.activeVisitorSignature = null;
    this.previousVisitorSignature = null;
    this.lastDetectedTimestamp = 0;
    this.lastAbsenceDuration = 0;
    this.faceAbsentStartTime = 0;

    // Rolling Candidate Window (6 frames required for rock-solid consensus)
    this.candidateWindow = [];
    this.CANDIDATE_WINDOW_SIZE = 6;

    // Small offscreen canvas for sampling stable skin chromaticity
    if (typeof document !== 'undefined') {
      this.sampleCanvas = document.createElement('canvas');
      this.sampleCanvas.width = 64;
      this.sampleCanvas.height = 64;
      this.sampleCtx = this.sampleCanvas.getContext('2d', { willReadFrequently: true });
    } else {
      this.sampleCanvas = null;
      this.sampleCtx = null;
    }
  }

  setAspectRatio(ar) {
    if (ar > 0.1 && ar < 10.0) {
      this.cranial.setAspectRatio(ar);
    }
  }

  /**
   * Resets all visitor signatures (e.g. on manual clear or app restart)
   */
  reset() {
    this.activeVisitorSignature = null;
    this.previousVisitorSignature = null;
    this.lastDetectedTimestamp = 0;
    this.lastAbsenceDuration = 0;
    this.faceAbsentStartTime = 0;
    this.candidateWindow = [];
  }

  /**
   * Samples average RGB from a small region of the video element around a landmark
   */
  sampleSkinPatch(videoEl, lm, vw, vh) {
    if (!videoEl || !lm || !this.sampleCtx || vw <= 0 || vh <= 0) {
      return { r: 180, g: 150, b: 130 };
    }

    try {
      const px = Math.max(2, Math.min(vw - 6, Math.round(lm.x * vw)));
      const py = Math.max(2, Math.min(vh - 6, Math.round(lm.y * vh)));

      // Draw a 4x4 patch onto the 4x4 canvas area
      this.sampleCtx.drawImage(videoEl, px - 2, py - 2, 4, 4, 0, 0, 4, 4);
      const imgData = this.sampleCtx.getImageData(0, 0, 4, 4).data;

      let sumR = 0, sumG = 0, sumB = 0, count = 0;
      for (let i = 0; i < imgData.length; i += 4) {
        sumR += imgData[i];
        sumG += imgData[i + 1];
        sumB += imgData[i + 2];
        count++;
      }

      if (count === 0) return { r: 180, g: 150, b: 130 };
      return {
        r: sumR / count,
        g: sumG / count,
        b: sumB / count
      };
    } catch (e) {
      return { r: 180, g: 150, b: 130 };
    }
  }

  /**
   * Extracts an invariant morphological & photometric signature from 3D landmarks & video frame
   */
  extractSignature(landmarks, headPose, videoEl) {
    if (!landmarks || landmarks.length < 468) return null;

    const frame = this.cranial.extractRigidFrame(landmarks);
    if (!frame || frame.scale < 0.001) return null;

    const local = this.cranial.toLocalCoordinates(landmarks, frame);
    if (!local || local.length < 468) return null;

    // Helper: 3D Euclidean distance in skull-local coordinates (normalized by scale)
    const dist = (i, j) => {
      const a = local[i];
      const b = local[j];
      if (!a || !b) return 0;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dz = a.z - b.z;
      return Math.hypot(dx, dy, dz);
    };

    const faceHeight = dist(10, 152);     // Forehead vault (10) to chin (152)
    const faceWidth = dist(234, 454);     // Right cheek (234) to left cheek (454)
    const noseLength = dist(168, 2);      // Nasion (168) to subnasale (2)
    const noseWidth = dist(49, 279);      // Alar creases (49 to 279)
    const jawWidth = dist(172, 397);      // Gonion jaw angles (172 to 397)
    const eyeSpan = dist(33, 263);        // Outer eye canthi span
    const foreheadH = dist(10, 168);      // Forehead midline height
    const lowerFaceH = dist(2, 152);      // Lower face height (subnasale to chin)

    if (faceWidth < 0.1 || faceHeight < 0.1) return null;

    // 12 invariant morphological geometric features (completely scale and rotation invariant)
    const morphFeatures = [
      faceHeight / faceWidth,                           // Face aspect ratio (elongated vs wide)
      jawWidth / faceWidth,                             // Jaw to cheekbone width ratio
      noseLength / Math.max(0.01, noseWidth),           // Nose aspect ratio
      noseLength / faceHeight,                          // Relative nose length
      noseWidth / faceWidth,                            // Relative nose width
      eyeSpan,                                          // Outer eye span relative to inner canthi
      foreheadH / Math.max(0.01, lowerFaceH),           // Upper vs lower face balance
      Math.abs((local[1]?.z || 0) - (local[168]?.z || 0)), // Nose bridge protrusion depth
      dist(168, 152) / faceWidth,                       // Nasion-to-chin ratio
      foreheadH / faceHeight,                           // Forehead vault height ratio
      dist(172, 152) / faceWidth,                       // Right mandible length
      dist(397, 152) / faceWidth                        // Left mandible length
    ];

    // Photometric Skin Tone Profile (sampled from stable forehead and cheek patches)
    let normR = 0.38, normG = 0.33, hue = 0.5;
    if (videoEl && videoEl.videoWidth > 0) {
      const vw = videoEl.videoWidth;
      const vh = videoEl.videoHeight;
      const patch1 = this.sampleSkinPatch(videoEl, landmarks[151], vw, vh); // Forehead
      const patch2 = this.sampleSkinPatch(videoEl, landmarks[117], vw, vh); // Right cheek
      const patch3 = this.sampleSkinPatch(videoEl, landmarks[346], vw, vh); // Left cheek

      const avgR = (patch1.r + patch2.r + patch3.r) / 3;
      const avgG = (patch1.g + patch2.g + patch3.g) / 3;
      const avgB = (patch1.b + patch2.b + patch3.b) / 3;

      const sum = avgR + avgG + avgB || 1.0;
      normR = avgR / sum;
      normG = avgG / sum;
      hue = Math.atan2(Math.sqrt(3) * (avgG - avgB), 2 * avgR - avgG - avgB);
    }

    return {
      morphFeatures,
      skinProfile: { normR, normG, hue }
    };
  }

  /**
   * Compares two visitor signatures and returns a normalized dissimilarity metric in [0, 1]
   */
  compareSignatures(sigA, sigB) {
    if (!sigA || !sigB) return 1.0;

    // 1. Morphometric dissimilarity
    let morphDiff = 0;
    const len = sigA.morphFeatures.length;
    for (let i = 0; i < len; i++) {
      const a = sigA.morphFeatures[i];
      const b = sigB.morphFeatures[i];
      const avg = (Math.abs(a) + Math.abs(b)) * 0.5 || 1.0;
      morphDiff += Math.abs(a - b) / avg;
    }
    const dMorph = morphDiff / len;

    // 2. Skin tone chromaticity dissimilarity
    const skinA = sigA.skinProfile;
    const skinB = sigB.skinProfile;
    const chromaticDiff = Math.abs(skinA.normR - skinB.normR) + Math.abs(skinA.normG - skinB.normG);
    let hueDiff = Math.abs(skinA.hue - skinB.hue);
    if (hueDiff > Math.PI) hueDiff = 2 * Math.PI - hueDiff;
    const dSkin = Math.min(1.0, chromaticDiff * 4.0 + (hueDiff / Math.PI) * 0.8);

    // Combined multi-factor distance (70% bone structure + 30% skin chromaticity)
    const total = dMorph * 0.70 + dSkin * 0.30;
    return {
      total,
      dMorph,
      dSkin,
      valueOf() { return total; }
    };
  }

  /**
   * Averages an array of signatures to produce a smooth, noise-free consensus profile
   */
  averageSignatures(signatures) {
    if (!signatures || signatures.length === 0) return null;
    if (signatures.length === 1) return signatures[0];

    const len = signatures[0].morphFeatures.length;
    const avgMorph = new Array(len).fill(0);
    let avgNormR = 0, avgNormG = 0, avgHueX = 0, avgHueY = 0;

    const count = signatures.length;
    for (const sig of signatures) {
      for (let i = 0; i < len; i++) {
        avgMorph[i] += sig.morphFeatures[i];
      }
      avgNormR += sig.skinProfile.normR;
      avgNormG += sig.skinProfile.normG;
      avgHueX += Math.cos(sig.skinProfile.hue);
      avgHueY += Math.sin(sig.skinProfile.hue);
    }

    for (let i = 0; i < len; i++) {
      avgMorph[i] /= count;
    }

    return {
      morphFeatures: avgMorph,
      skinProfile: {
        normR: avgNormR / count,
        normG: avgNormG / count,
        hue: Math.atan2(avgHueY / count, avgHueX / count)
      }
    };
  }

  /**
   * Update detector with current frame tracking data.
   * 
   * Returns:
   *   isPresent: boolean
   *   isNewVisitor: boolean (true on the frame a new visitor is confirmed)
   *   dissimilarity: number (0 to 1)
   *   signature: visitor profile
   */
  update(rawTracking, videoEl, now = performance.now()) {
    const isFacePresent = Boolean(rawTracking && rawTracking.detected && rawTracking.landmarks);

    if (!isFacePresent) {
      if (this.lastDetectedTimestamp > 0) {
        if (!this.faceAbsentStartTime) {
          this.faceAbsentStartTime = now;
        }
        this.lastAbsenceDuration = now - this.faceAbsentStartTime;
        this.currentArrivalAbsenceDuration = this.lastAbsenceDuration;
      }
      this.candidateWindow = [];
      return {
        isPresent: false,
        isNewVisitor: false,
        dissimilarity: 0,
        signature: this.activeVisitorSignature
      };
    }

    // Face is present
    if (this.faceAbsentStartTime > 0) {
      this.currentArrivalAbsenceDuration = now - this.faceAbsentStartTime;
      this.faceAbsentStartTime = 0;
    }
    this.lastDetectedTimestamp = now;

    // Filter out extreme side angles (yaw > 28°, pitch > 24°) to ensure high-quality biometric signature
    const headPose = rawTracking.headPose || { pitch: 0, yaw: 0, roll: 0 };
    const isFrontalEnough = Math.abs(headPose.yaw || 0) < 28.0 && Math.abs(headPose.pitch || 0) < 24.0;

    if (!isFrontalEnough && this.activeVisitorSignature) {
      // User is looking sharply sideways; maintain current visitor classification
      return {
        isPresent: true,
        isNewVisitor: false,
        dissimilarity: 0,
        signature: this.activeVisitorSignature
      };
    }

    // Extract signature for current frame
    const currentSig = this.extractSignature(rawTracking.landmarks, headPose, videoEl);
    if (!currentSig) {
      return {
        isPresent: true,
        isNewVisitor: false,
        dissimilarity: 0,
        signature: this.activeVisitorSignature
      };
    }

    // Add to consensus window
    this.candidateWindow.push(currentSig);
    if (this.candidateWindow.length > this.CANDIDATE_WINDOW_SIZE) {
      this.candidateWindow.shift();
    }

    // Require at least 5 stable frames to form a consensus before deciding
    if (this.candidateWindow.length < 5) {
      return {
        isPresent: true,
        isNewVisitor: false,
        dissimilarity: 0,
        signature: this.activeVisitorSignature
      };
    }

    // Compute averaged candidate profile over the consensus window
    const candidateProfile = this.averageSignatures(this.candidateWindow);

    // CASE 1: First visitor ever since app launched
    if (!this.activeVisitorSignature) {
      this.activeVisitorSignature = candidateProfile;
      this.candidateWindow = [];
      this.currentArrivalAbsenceDuration = 0;

      this.dispatchEvent(new CustomEvent('new-visitor', {
        detail: {
          signature: candidateProfile,
          dissimilarity: 1.0,
          reason: 'INITIAL_VISITOR'
        }
      }));

      return {
        isPresent: true,
        isNewVisitor: true,
        dissimilarity: 1.0,
        signature: candidateProfile
      };
    }

    // CASE 2: Compare candidate with active visitor signature
    // STRICT RULE: Can NEVER trigger new visitor if tracking was continuous (absence < 1500ms).
    // The user must have left and tracking must have dropped before a new visitor can ever be evaluated.
    const absenceDuration = this.currentArrivalAbsenceDuration || 0;
    const hadRealAbsence = absenceDuration >= this.MIN_ABSENCE_FOR_NEW_VISITOR_MS;

    if (!hadRealAbsence) {
      // Continuous tracking: user is actively in front of camera, keep active visitor
      return {
        isPresent: true,
        isNewVisitor: false,
        dissimilarity: 0,
        signature: this.activeVisitorSignature
      };
    }

    // Tracking was lost for at least 1.5s, now a face is detected: compare signatures
    const diff = this.compareSignatures(candidateProfile, this.activeVisitorSignature);
    const dissimilarity = diff.total !== undefined ? diff.total : Number(diff);
    const dMorph = diff.dMorph !== undefined ? diff.dMorph : dissimilarity;
    const isLongAbsence = absenceDuration >= this.LONG_ABSENCE_RESET_MS;

    // Drastic difference: both cranial points arrangement (dMorph >= 0.16) and total (>= 0.20),
    // OR extreme morphometric difference (dMorph >= 0.22), OR empty room for > 20s
    const isDrasticDifference = (dMorph >= this.MORPH_THRESHOLD && dissimilarity >= this.DISSIMILARITY_THRESHOLD) || (dMorph >= 0.22);

    if (isDrasticDifference || isLongAbsence) {
      const reason = isLongAbsence ? 'LONG_ABSENCE' : 'DRASTIC_BIOMETRIC_CHANGE';
      console.log(`[VisitorDetector] 👤 Nouveau visiteur confirmé ! (Absence: ${Math.round(absenceDuration)}ms, Diff totale: ${dissimilarity.toFixed(3)}, Diff morpho points: ${dMorph.toFixed(3)})`);

      this.previousVisitorSignature = this.activeVisitorSignature;
      this.activeVisitorSignature = candidateProfile;
      this.candidateWindow = [];
      this.currentArrivalAbsenceDuration = 0;

      this.dispatchEvent(new CustomEvent('new-visitor', {
        detail: {
          signature: candidateProfile,
          dissimilarity,
          dMorph,
          reason
        }
      }));

      return {
        isPresent: true,
        isNewVisitor: true,
        dissimilarity,
        signature: candidateProfile
      };
    }

    // Returning visitor (same person returning after a brief departure)
    this.currentArrivalAbsenceDuration = 0;
    this.candidateWindow = [];
    return {
      isPresent: true,
      isNewVisitor: false,
      dissimilarity,
      signature: this.activeVisitorSignature
    };
  }
}
