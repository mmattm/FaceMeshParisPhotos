/**
 * Pure Facial Expression Motion Capture & Head Pose Decoupling Engine
 * 
 * 1. Decouples 6-DoF rigid head movement (rotation, translation, scale) using rigid cranial anchors.
 * 2. Head smoothing only smooths the rigid 6-DoF transformation, keeping facial expression points 100% raw.
 * 3. 5-tap zero-phase Gaussian filtering & Catmull-Rom cubic splines eliminate all shakes and ticks.
 * 4. Dual Sliders:
 *    - Expression Blend: 0% = pure recorded facial expression | 100% = recorded + live expressions.
 *    - Eye Animation:    0% = 100% live eyes (blinks & gaze)  | 100% = 100% recorded eye animation.
 */

import {
  CranialCoordinateSystem,
  buildAnatomicalWeightMap,
  resolveLipContact,
  MANDIBULAR_JAW_INDICES,
  UPPER_INNER_LIP_INDICES,
  LOWER_INNER_LIP_INDICES
} from './cranialCoordinateSystem.js';
import { BlendshapeCalibrator } from './blendshapeCalibrator.js';

// Pre-build Eye Landmark Mask for the 478 MediaPipe topology
function buildEyeWeightsMap() {
  const weights = new Float32Array(478);

  // 1. Irises and Pupils (100% eye)
  const irisIndices = [468, 469, 470, 471, 472, 473, 474, 475, 476, 477];
  irisIndices.forEach(idx => { if (idx < 478) weights[idx] = 1.0; });

  // 2. Eyelids, Aperture & Eyelash Margins (100% eye)
  const eyelidIndices = [
    // Right Eye
    33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246,
    // Left Eye
    263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466
  ];
  eyelidIndices.forEach(idx => { if (idx < 478) weights[idx] = 1.0; });

  // 3. Immediate Peri-ocular Ring (Smooth 0.50 transition into forehead and cheek skin)
  const periOcularIndices = [
    130, 25, 110, 24, 23, 22, 26, 112, 243, 190, 56, 28, 27, 29, 30, 247,
    359, 255, 339, 254, 253, 252, 256, 341, 463, 414, 286, 258, 257, 259, 260, 467
  ];
  periOcularIndices.forEach(idx => { if (idx < 478) weights[idx] = Math.max(weights[idx], 0.50); });

  return weights;
}

export class ExpressionLooper extends EventTarget {
  constructor() {
    super();
    this.isPlaying = false;
    this.recordedFrames = [];
    this.playbackStartTime = 0;
    this.loopDurationMs = 0;
    this.playbackSpeed = 1.0;

    // Sliders:
    // Expression Blend: 0.0 (pure recorded animation) to 1.0 (recorded + live expressions)
    this.expressionBlend = 0.0;
    // Eye Animation Blend: 0.0 (100% live eyes) to 1.0 (100% recorded eyes) - Default 0.0
    this.eyeBlend = 0.0;
    // Expression Boost: 0.0 (normal 1.0x) to 1.0 (exaggerated 2.0x) - Default 0.5 (50%)
    this.expressionBoost = 0.5;

    // Contour Fix Slider: 0.0 (contour animates) to 1.0 (contour 100% fixed, ring 1 at 50%) - Default 1.0
    this.contourFix = 1.0;
    // Anti-Shake / Global Coherent Motion Smoothing Slider: 0.0 (weak/raw) to 1.0 (super powerful) - Default 1.0 (100%)
    this.antiShake = 1.0;

    // Face Oval Contour (Ring 0, 36 landmarks) and Directly Connected 1-Hop Neighbors (Ring 1, 36 landmarks)
    this.ring0 = new Set([
      10, 21, 54, 58, 67, 93, 103, 109, 127, 132, 136, 148, 149, 150, 152, 162,
      172, 176, 234, 251, 284, 288, 297, 323, 332, 338, 356, 361, 365, 377, 378,
      379, 389, 397, 400, 454
    ]);

    this.ring1 = new Set([
      34, 68, 69, 71, 104, 108, 135, 137, 138, 139, 140, 151, 169, 170, 171, 175,
      177, 215, 227, 264, 298, 299, 301, 333, 337, 364, 366, 367, 368, 369, 394,
      395, 396, 401, 435, 447
    ]);

    // Mandibular & Perioral landmarks that articulate dynamically when speaking/opening mouth
    // These are exempted from contourFix suppression so the jaw & chin open with 100% realistic fidelity
    this.mandibularJawSet = new Set(MANDIBULAR_JAW_INDICES);
    this.oralApertureSet = new Set([
      ...UPPER_INNER_LIP_INDICES,
      ...LOWER_INNER_LIP_INDICES,
      0, 11, 12, 13, 14, 15, 16, 17, 37, 38, 39, 40, 41, 61, 72, 73, 74, 76, 77, 84, 85, 86, 91, 146, 178, 179, 180, 181, 185, 267, 268, 269, 270, 271, 291, 302, 303, 304, 306, 307, 314, 315, 316, 321, 375, 403, 404, 405, 409
    ]);

    // Head 6-DoF smoothing toggle (ON by default)
    this.useHeadSmoothing = true;

    // Anatomical blend weight maps
    this.weights = buildAnatomicalWeightMap();
    this.eyeWeights = buildEyeWeightsMap();

    // Neutral baseline in skull-local coordinates
    this.referenceLocal = null;
    this.calibLandmarkSamples = [];

    // Decoupled Cranial Coordinate Engine
    this.cranial = new CranialCoordinateSystem();

    // Blendshape Calibrator
    this.calibrator = new BlendshapeCalibrator();
    this.calibrator.addEventListener('calibration:complete', () => {
      this.finishLandmarkCalibration();
    });

    // Previous playback frame for real-time temporal interpolation
    this.lastPlaybackLocal = null;

    // Neutral resting face tracking for imported performance retargeting
    this.lastStableNeutralLocal = null;
    this.lastStableNeutralHeadPose = null;
    this.referenceHeadPose = null;
    this.unloopedFrames = null;
  }

  setAspectRatio(ar) {
    this.cranial.setAspectRatio(ar);
  }

  setExpressionBlend(blend) {
    this.expressionBlend = Math.max(0.0, Math.min(1.0, blend));
  }

  setEyeBlend(blend) {
    this.eyeBlend = Math.max(0.0, Math.min(1.0, blend));
  }

  setExpressionBoost(boost) {
    this.expressionBoost = Math.max(0.0, Math.min(1.0, boost));
  }

  setContourFix(val) {
    this.contourFix = Math.max(0.0, Math.min(1.0, val));
  }

  setAntiShake(val) {
    this.antiShake = Math.max(0.0, Math.min(1.0, val));
  }

  setHeadSmoothing(enabled) {
    this.useHeadSmoothing = !!enabled;
  }

  // Backward compatibility alias
  setSmoothing(val) {
    this.setExpressionBlend(val);
  }

  /**
   * Exports the currently imported performance as an animation data package
   * with pristine linear fidelity, preserving the full acted expression.
   */
  exportAnimation(name = 'Expression', audioData = null) {
    const framesToExport = this.unloopedFrames || this.recordedFrames;
    if (!framesToExport || framesToExport.length === 0) return null;
    return {
      id: `anim_${Date.now()}`,
      name: name.trim() || 'Expression',
      durationMs: Math.round(this.loopDurationMs),
      frameCount: framesToExport.length,
      createdAt: new Date().toISOString(),
      referenceLocal: this.referenceLocal ? this.referenceLocal.map(p => ({ x: p.x, y: p.y, z: p.z })) : null,
      referenceHeadPose: this.referenceHeadPose ? {
        pitch: Number((this.referenceHeadPose.pitch || 0).toFixed(2)),
        yaw: Number((this.referenceHeadPose.yaw || 0).toFixed(2)),
        roll: Number((this.referenceHeadPose.roll || 0).toFixed(2)),
        x: Number((this.referenceHeadPose.x || 0).toFixed(4)),
        y: Number((this.referenceHeadPose.y || 0).toFixed(4)),
        z: Number((this.referenceHeadPose.z || 0).toFixed(4))
      } : null,
      hasAudio: !!audioData,
      audioData: audioData || null,
      frames: framesToExport.map(f => ({
        timeOffsetMs: Math.round(f.timeOffsetMs),
        localCoords: f.localCoords ? f.localCoords.map(p => ({ x: Number(p.x.toFixed(4)), y: Number(p.y.toFixed(4)), z: Number(p.z.toFixed(4)) })) : null,
        blendshapes: f.blendshapes || {},
        headPose: f.headPose ? {
          pitch: Number((f.headPose.pitch || 0).toFixed(2)),
          yaw: Number((f.headPose.yaw || 0).toFixed(2)),
          roll: Number((f.headPose.roll || 0).toFixed(2)),
          x: Number((f.headPose.x || 0).toFixed(4)),
          y: Number((f.headPose.y || 0).toFixed(4)),
          z: Number((f.headPose.z || 0).toFixed(4))
        } : null
      }))
    };
  }

  /**
   * Load recorded frames from an external source (e.g. uploaded video extraction)
   * and apply cyclical crossfading, Gaussian filtering, and baseline calibration.
   */
  loadRecordedFrames(frames, customDurationMs = null) {
    if (!frames || frames.length === 0) return;
    this.recordedFrames = frames;
    this.finalizeRecordedFrames(customDurationMs);
    this.dispatchEvent(new CustomEvent('performance:loaded', {
      detail: {
        frameCount: this.recordedFrames.length,
        durationMs: this.loopDurationMs
      }
    }));
  }

  finalizeRecordedFrames(customDurationMs = null) {
    const frameCount = this.recordedFrames.length;
    if (frameCount > 2) {
      const landmarkCount = this.recordedFrames[0].localCoords.length;
      const lastFrame = this.recordedFrames[frameCount - 1];
      const avgDt = lastFrame.timeOffsetMs / (frameCount - 1 || 1);
      this.loopDurationMs = customDurationMs || (lastFrame.timeOffsetMs + avgDt);

      // 1. Establish TRUE physiological resting reference face of the performer:
      // Priority 1: Explicitly calibrated reference face
      // Priority 2: True lowest oral energy frame across performance (closed lips, relaxed jaw)
      if (!this.referenceLocal) {
        let bestIdx = 0;
        let minEnergy = Infinity;
        for (let f = 0; f < frameCount; f++) {
          const frm = this.recordedFrames[f];
          const fBs = frm.blendshapes || {};
          const lc = frm.localCoords;
          const lipSep = lc && lc[14] && lc[13] ? Math.abs(lc[14].y - lc[13].y) : 0;
          const energy = (fBs.jawOpen || 0) * 4.0 +
                         (fBs.mouthFunnel || 0) * 3.0 +
                         (fBs.mouthPucker || 0) * 2.0 +
                         (fBs.mouthSmileLeft || 0) * 1.5 +
                         (fBs.mouthSmileRight || 0) * 1.5 +
                         (fBs.browInnerUp || 0) +
                         lipSep * 8.0;
          if (energy < minEnergy) {
            minEnergy = energy;
            bestIdx = f;
          }
        }

        // Compare against lastStableNeutralLocal if available
        if (this.lastStableNeutralLocal) {
          const lc = this.lastStableNeutralLocal;
          const lipSep = lc && lc[14] && lc[13] ? Math.abs(lc[14].y - lc[13].y) : 0;
          const stableEnergy = lipSep * 8.0;
          if (stableEnergy <= minEnergy) {
            this.referenceLocal = this.lastStableNeutralLocal.map(p => ({ x: p.x, y: p.y, z: p.z }));
            this.referenceHeadPose = this.lastStableNeutralHeadPose ? { ...this.lastStableNeutralHeadPose } : null;
          }
        }

        if (!this.referenceLocal) {
          this.referenceLocal = this.recordedFrames[bestIdx].localCoords.map(p => ({ x: p.x, y: p.y, z: p.z }));
          this.referenceHeadPose = this.recordedFrames[bestIdx].headPose ? { ...this.recordedFrames[bestIdx].headPose } : null;
        }
      } else if (!this.referenceHeadPose && this.recordedFrames[0]?.headPose) {
        this.referenceHeadPose = { ...this.recordedFrames[0].headPose };
      }

      if (this.referenceLocal) {
        resolveLipContact(this.referenceLocal);
      }

      // 2. Clone pristine, linear performance frames specifically for animation export!
      this.unloopedFrames = this.recordedFrames.map(f => ({
        timeOffsetMs: f.timeOffsetMs,
        localCoords: f.localCoords.map(p => ({ x: p.x, y: p.y, z: p.z })),
        blendshapes: { ...f.blendshapes },
        headPose: f.headPose ? { ...f.headPose } : null
      }));

      // High-Precision Zero-Phase 5-Tap Gaussian + Bilateral Filter on localCoords
      // Applied to BOTH this.unloopedFrames and this.recordedFrames with EDGE CLAMPING
      if (frameCount >= 5) {
        const kernel = [0.06, 0.24, 0.40, 0.24, 0.06];
        const origCoords = this.recordedFrames.map(f => f.localCoords.map(p => ({ x: p.x, y: p.y, z: p.z })));

        for (let f = 0; f < frameCount; f++) {
          const targetUnlooped = this.unloopedFrames[f].localCoords;
          const targetRecorded = this.recordedFrames[f].localCoords;

          for (let i = 0; i < landmarkCount; i++) {
            let sx = 0, sy = 0, sz = 0;
            let totalW = 0;
            const centerPt = origCoords[f][i];

            for (let offset = -2; offset <= 2; offset++) {
              const idx = Math.max(0, Math.min(frameCount - 1, f + offset));
              const samplePt = origCoords[idx][i];
              let kw = kernel[offset + 2];

              // In the mouth aperture region, apply bilateral edge-weighting to preserve rapid plosives
              if (this.oralApertureSet.has(i)) {
                const dist = Math.hypot(samplePt.x - centerPt.x, samplePt.y - centerPt.y, samplePt.z - centerPt.z);
                const bilateralFactor = Math.exp(- (dist * dist) / (2 * 0.012 * 0.012));
                kw *= (0.4 + 0.6 * bilateralFactor);
              }

              sx += samplePt.x * kw;
              sy += samplePt.y * kw;
              sz += samplePt.z * kw;
              totalW += kw;
            }

            const invW = totalW > 0 ? 1.0 / totalW : 1.0;
            const fx = sx * invW;
            const fy = sy * invW;
            const fz = sz * invW;

            targetUnlooped[i].x = fx;
            targetUnlooped[i].y = fy;
            targetUnlooped[i].z = fz;

            targetRecorded[i].x = fx;
            targetRecorded[i].y = fy;
            targetRecorded[i].z = fz;
          }

          // Enforce non-penetrating lip contact on smoothed frames
          resolveLipContact(targetUnlooped);
          resolveLipContact(targetRecorded);
        }

        // Smooth blendshapes temporally across frames to eliminate blendshape twitch
        const allBsKeys = Object.keys(this.recordedFrames[0]?.blendshapes || {});
        if (allBsKeys.length > 0) {
          const origBs = this.recordedFrames.map(f => ({ ...f.blendshapes }));
          for (let f = 0; f < frameCount; f++) {
            for (let k = 0; k < allBsKeys.length; k++) {
              const key = allBsKeys[k];
              let sum = 0;
              for (let offset = -2; offset <= 2; offset++) {
                const idx = Math.max(0, Math.min(frameCount - 1, f + offset));
                sum += (origBs[idx][key] || 0) * kernel[offset + 2];
              }
              this.unloopedFrames[f].blendshapes[key] = sum;
              this.recordedFrames[f].blendshapes[key] = sum;
            }
          }
        }
      }

      // 3. For live loop preview only: cyclical boundary crossfade (quintic hermite smoothstep)
      const k = Math.min(14, Math.floor(frameCount / 4));
      if (k > 1) {
        for (let j = 0; j < k; j++) {
          const tailIdx = frameCount - k + j;
          const headIdx = j;
          const tailCoords = this.recordedFrames[tailIdx].localCoords;
          const headCoords = this.recordedFrames[headIdx].localCoords;
          const tailBs = this.recordedFrames[tailIdx].blendshapes;
          const headBs = this.recordedFrames[headIdx].blendshapes;

          const s = (j + 1) / (k + 1);
          // Quintic smoothstep: zero velocity & zero acceleration at endpoints
          const w = s * s * s * (s * (s * 6 - 15) + 10);

          for (let i = 0; i < landmarkCount; i++) {
            tailCoords[i].x = tailCoords[i].x * (1 - w) + headCoords[i].x * w;
            tailCoords[i].y = tailCoords[i].y * (1 - w) + headCoords[i].y * w;
            tailCoords[i].z = tailCoords[i].z * (1 - w) + headCoords[i].z * w;
          }
          resolveLipContact(tailCoords);

          if (tailBs && headBs) {
            const keys = new Set([...Object.keys(tailBs), ...Object.keys(headBs)]);
            for (const key of keys) {
              const vTail = tailBs[key] || 0;
              const vHead = headBs[key] || 0;
              tailBs[key] = vTail * (1 - w) + vHead * w;
            }
          }
        }
      }

      // Virtual Wrap Frame for the loop preview only
      const wrapCoords = new Array(landmarkCount);
      const headCoords = this.recordedFrames[0].localCoords;
      for (let i = 0; i < landmarkCount; i++) {
        wrapCoords[i] = { x: headCoords[i].x, y: headCoords[i].y, z: headCoords[i].z };
      }
      resolveLipContact(wrapCoords);
      this.recordedFrames.push({
        timeOffsetMs: this.loopDurationMs,
        localCoords: wrapCoords,
        blendshapes: { ...this.recordedFrames[0].blendshapes }
      });

      // Start looping immediately
      this.isPlaying = true;
      this.playbackStartTime = performance.now();
      this.lastPlaybackLocal = null;
    }

    this.dispatchEvent(new CustomEvent('performance:ready', {
      detail: {
        frameCount: this.recordedFrames.length,
        durationMs: this.loopDurationMs
      }
    }));
  }

  finishLandmarkCalibration() {
    if (this.calibLandmarkSamples.length > 0) {
      const sampleCount = this.calibLandmarkSamples.length;
      const landmarkCount = this.calibLandmarkSamples[0].length;
      const ref = new Array(landmarkCount);

      for (let i = 0; i < landmarkCount; i++) {
        let sumX = 0, sumY = 0, sumZ = 0;
        for (let s = 0; s < sampleCount; s++) {
          sumX += this.calibLandmarkSamples[s][i].x;
          sumY += this.calibLandmarkSamples[s][i].y;
          sumZ += this.calibLandmarkSamples[s][i].z;
        }
        ref[i] = { x: sumX / sampleCount, y: sumY / sampleCount, z: sumZ / sampleCount };
      }
      this.referenceLocal = ref;
      this.calibLandmarkSamples = [];
    }
  }

  togglePlayback(force = null) {
    if (this.recordedFrames.length === 0) return;
    this.isPlaying = force !== null ? force : !this.isPlaying;
    if (this.isPlaying) {
      this.playbackStartTime = performance.now();
      this.lastPlaybackLocal = null;
    }
    this.dispatchEvent(new CustomEvent('playback:toggle', { detail: { isPlaying: this.isPlaying } }));
  }

  clear() {
    this.isPlaying = false;
    this.recordedFrames = [];
    this.loopDurationMs = 0;
    this.lastPlaybackLocal = null;
    this.dispatchEvent(new CustomEvent('cleared'));
  }

  process(trackingResult, now = performance.now(), aspectRatio = null) {
    if (!trackingResult || !trackingResult.detected || !trackingResult.landmarks) {
      return { ...trackingResult, isLoopActive: false, loopProgress: 0 };
    }

    if (aspectRatio) {
      this.cranial.setAspectRatio(aspectRatio);
    }

    const liveLandmarks = trackingResult.landmarks;
    const rawRigidFrame = this.cranial.extractRigidFrame(liveLandmarks);

    if (!rawRigidFrame) {
      return { ...trackingResult, isLoopActive: false, loopProgress: 0 };
    }

    // Adaptive temporal smoothing on 6-DoF head pose (smooths head movement, NOT face points)
    const rigidFrame = this.cranial.smoothRigidFrame(rawRigidFrame, this.useHeadSmoothing);

    // Blendshape calibration
    const calibratedBlendshapes = this.calibrator.process(trackingResult.blendshapes, now);
    trackingResult.blendshapes = calibratedBlendshapes;

    // Head-local coordinates (6-DoF invariant)
    const liveLocal = this.cranial.toLocalCoordinates(liveLandmarks, rigidFrame);

    // Track user's stable neutral resting face during quiet moments (lips closed, brows relaxed)
    const bs = trackingResult.blendshapes || {};
    const jawVal = bs.jawOpen || 0;
    const smileVal = Math.max(bs.mouthSmileLeft || 0, bs.mouthSmileRight || 0);
    const browVal = bs.browInnerUp || 0;
    if (jawVal < 0.05 && smileVal < 0.06 && browVal < 0.06) {
      this.lastStableNeutralLocal = liveLocal;
      this.lastStableNeutralHeadPose = trackingResult.headPose ? { ...trackingResult.headPose } : null;
    }

    // Collect calibration samples during calibration
    if (this.calibrator.isCalibrating) {
      this.calibLandmarkSamples.push(liveLocal);
    }

    // 2. Return live tracking if playback inactive (1:1 with webcam, no synthetic warping)
    if (!this.isPlaying || this.recordedFrames.length === 0) {
      return {
        ...trackingResult,
        liveLandmarks,
        isLoopActive: false,
        loopProgress: 0
      };
    }

    // 3. Playback: Retarget complete recorded expression onto the active live head pose
    return this.applyPlayback(trackingResult, rigidFrame, liveLandmarks, liveLocal, now);
  }

  /**
   * Naturally exaggerates facial deformations relative to the resting reference face
   * Multiplier M = 1.0 (normal at 0%) up to 2.0 (2x more expressive at 100%)
   */
  boostDeformation(pt, refPt, boost, weight) {
    if (!pt || !refPt || boost <= 0.001 || weight < 0.01) return pt;
    const mult = 1.0 + boost * weight;
    const D_MAX = 0.38;

    let dx = (pt.x - refPt.x) * mult;
    let dy = (pt.y - refPt.y) * mult;
    let dz = (pt.z - refPt.z) * mult;

    const dist = Math.hypot(dx, dy, dz);
    if (dist > D_MAX) {
      const s = (D_MAX + (dist - D_MAX) * 0.25) / dist;
      dx *= s;
      dy *= s;
      dz *= s;
    }

    return { x: refPt.x + dx, y: refPt.y + dy, z: refPt.z + dz };
  }

  applyPlayback(trackingResult, rigidFrame, liveLandmarks, liveLocal, now) {
    const elapsed = (now - this.playbackStartTime) * this.playbackSpeed;
    const clipTime = elapsed % this.loopDurationMs;
    const loopProgress = clipTime / this.loopDurationMs;

    const interpLocal = this.getInterpolatedLocalCoords(clipTime);
    if (!interpLocal) {
      return trackingResult;
    }

    const len = interpLocal.length;
    const targetLocal = new Array(len);
    const exprBlend = this.expressionBlend; // 0.0 (pure recorded animation) to 1.0 (recorded + live)
    const eyeBlend = this.eyeBlend;         // 0.0 (100% live eyes) to 1.0 (100% recorded eyes)
    const ref = this.referenceLocal;
    const D_MAX = 0.35; // Maximum allowable anatomical displacement in cranial scale

    for (let i = 0; i < len; i++) {
      let recPt = interpLocal[i];
      let livePt = liveLocal[i];
      const refPt = ref ? ref[i] : null;

      if (!recPt || !livePt) {
        targetLocal[i] = recPt || livePt;
        continue;
      }

      const wEye = this.eyeWeights[i] || 0.0;
      const wExpr = this.weights[i] !== undefined ? this.weights[i] : 0.8;

      // Apply expression exaggeration boost relative to resting baseline
      if (this.expressionBoost > 0.001 && refPt) {
        recPt = this.boostDeformation(recPt, refPt, this.expressionBoost, wExpr);
        livePt = this.boostDeformation(livePt, refPt, this.expressionBoost, wExpr);
      }

      // Handle Eye Region: governed by Eye Animation Slider (eyeBlend)
      // 0% = 100% Live Eyes | 100% = 100% Recorded Eyes
      if (wEye > 0.01) {
        const eyeFactor = eyeBlend * wEye;
        targetLocal[i] = {
          x: (1.0 - eyeFactor) * livePt.x + eyeFactor * recPt.x,
          y: (1.0 - eyeFactor) * livePt.y + eyeFactor * recPt.y,
          z: (1.0 - eyeFactor) * livePt.z + eyeFactor * recPt.z
        };
        continue;
      }

      // Contour attenuation: Ring 0 (contour) = 0%, Ring 1 (1-hop) = 50%, Ring 2+ = 100%
      // EXEMPT mandibular jaw & chin (152, 148, 377, etc.) and mouth points so jaw drop & speech are 100% free & natural!
      let recFactor = 1.0;
      if (!this.mandibularJawSet.has(i) && !this.oralApertureSet.has(i)) {
        if (this.ring0.has(i)) {
          recFactor = 1.0 - this.contourFix; // at 1.0, factor is 0.0 (cranial contour doesn't move with record)
        } else if (this.ring1.has(i)) {
          recFactor = 1.0 - this.contourFix * 0.5; // at 1.0, factor is 0.5 (50% record)
        }
      }

      // Base recorded point with contour attenuation
      let baseRecPt = recPt;
      if (recFactor < 0.999) {
        baseRecPt = {
          x: (1.0 - recFactor) * livePt.x + recFactor * recPt.x,
          y: (1.0 - recFactor) * livePt.y + recFactor * recPt.y,
          z: (1.0 - recFactor) * livePt.z + recFactor * recPt.z
        };
      }

      // Handle Facial Expressions: governed by Expression Blend Slider (exprBlend)
      // 0% = Pure Recorded Facial Expression
      // 100% = Recorded Facial Expression + Live Facial Expression deformations
      if (exprBlend > 0.001 && refPt) {
        const dLiveX = (livePt.x - refPt.x) * wExpr * exprBlend;
        const dLiveY = (livePt.y - refPt.y) * wExpr * exprBlend;
        const dLiveZ = (livePt.z - refPt.z) * wExpr * exprBlend;

        let totalX = baseRecPt.x + dLiveX;
        let totalY = baseRecPt.y + dLiveY;
        let totalZ = baseRecPt.z + dLiveZ;

        // Anatomical soft saturation clamping
        const distFromRef = Math.hypot(totalX - refPt.x, totalY - refPt.y, totalZ - refPt.z);
        if (distFromRef > D_MAX) {
          const ratio = (D_MAX + (distFromRef - D_MAX) * 0.25) / distFromRef;
          totalX = refPt.x + (totalX - refPt.x) * ratio;
          totalY = refPt.y + (totalY - refPt.y) * ratio;
          totalZ = refPt.z + (totalZ - refPt.z) * ratio;
        }

        targetLocal[i] = { x: totalX, y: totalY, z: totalZ };
      } else {
        // Pure recorded performance (with contour attenuation)
        targetLocal[i] = baseRecPt;
      }
    }

    // Global Coherent Motion (Common-Direction Parasitic Shake) Suppression
    // When the majority of vertices move in unison in the same direction, subtract the common parasite drift
    if (this.antiShake > 0.001 && this.lastPlaybackLocal) {
      let sumDx = 0, sumDy = 0, sumDz = 0;
      let sumDist = 0;
      let validCount = 0;

      for (let i = 0; i < len; i++) {
        const cur = targetLocal[i];
        const prev = this.lastPlaybackLocal[i];
        if (cur && prev) {
          const dx = cur.x - prev.x;
          const dy = cur.y - prev.y;
          const dz = cur.z - prev.z;
          sumDx += dx;
          sumDy += dy;
          sumDz += dz;
          sumDist += Math.hypot(dx, dy, dz);
          validCount++;
        }
      }

      if (validCount > 0 && sumDist > 0.0001) {
        const meanDx = sumDx / validCount;
        const meanDy = sumDy / validCount;
        const meanDz = sumDz / validCount;
        const meanLen = Math.hypot(meanDx, meanDy, meanDz);
        const avgDist = sumDist / validCount;

        // Directional coherence: 1.0 if all vertices move in the exact same direction (camera/head shake)
        const coherence = Math.min(1.0, meanLen / (avgDist + 0.00001));

        // When coherence is notable, subtract the common-direction parasitic displacement
        const parasiteFactor = coherence * this.antiShake * 0.95;
        if (parasiteFactor > 0.02) {
          const shiftX = meanDx * parasiteFactor;
          const shiftY = meanDy * parasiteFactor;
          const shiftZ = meanDz * parasiteFactor;

          for (let i = 0; i < len; i++) {
            targetLocal[i].x -= shiftX;
            targetLocal[i].y -= shiftY;
            targetLocal[i].z -= shiftZ;
          }
        }
      }
    }

    // Adaptive temporal smoothing on playback target
    // At antiShake = 0%: alpha = 0.92 (responsive, minimal smoothing)
    // At antiShake = 100%: alpha = 0.20 (super powerful smoothing filter)
    if (this.lastPlaybackLocal) {
      const alpha = 0.92 - this.antiShake * 0.72;
      for (let i = 0; i < len; i++) {
        const cur = targetLocal[i];
        const prev = this.lastPlaybackLocal[i];
        if (cur && prev) {
          cur.x = prev.x + (cur.x - prev.x) * alpha;
          cur.y = prev.y + (cur.y - prev.y) * alpha;
          cur.z = prev.z + (cur.z - prev.z) * alpha;
        }
      }
    }
    // Enforce physiological lip contact & non-penetration on final target frame
    resolveLipContact(targetLocal);
    this.lastPlaybackLocal = targetLocal;

    // Project complete synthesized facial geometry onto active live rigid head pose
    const synthIsotropic = this.cranial.fromLocalCoordinates(targetLocal, rigidFrame);
    const synthesizedLandmarks = new Array(liveLandmarks.length);

    for (let i = 0; i < liveLandmarks.length; i++) {
      synthesizedLandmarks[i] = this.cranial.fromIsotropic(
        synthIsotropic[i],
        liveLandmarks[i].visibility
      );
    }

    // Blend blendshapes according to both sliders:
    // - Eye blendshapes (blinks, gaze) follow eyeBlend (0% = live, 100% = recorded)
    // - Expression blendshapes (mouth, smile, brow) follow exprBlend + expressionBoost
    const interpBs = this.getInterpolatedBlendshapes(clipTime);
    const finalBlendshapes = {};
    const liveBs = trackingResult.blendshapes || {};
    const recBs = interpBs || liveBs;

    const allKeys = new Set([...Object.keys(liveBs), ...Object.keys(recBs)]);
    for (const k of allKeys) {
      const bLive = liveBs[k] || 0;
      const bRec = recBs[k] || 0;

      if (/^eye/i.test(k)) {
        // Eye Blend: 0% = live eyes, 100% = recorded eyes
        finalBlendshapes[k] = (1.0 - eyeBlend) * bLive + eyeBlend * bRec;
      } else {
        // Expression Blend: 0% = pure recorded, 100% = recorded + live
        let val = exprBlend > 0.001 ? Math.min(1.0, bRec + bLive * exprBlend) : bRec;
        if (this.expressionBoost > 0.001) {
          val = Math.min(1.0, val * (1.0 + this.expressionBoost));
        }
        finalBlendshapes[k] = val;
      }
    }

    return {
      ...trackingResult,
      blendshapes: finalBlendshapes,
      landmarks: synthesizedLandmarks,
      liveLandmarks,
      isLoopActive: true,
      loopProgress
    };
  }

  /**
   * Catmull-Rom Cubic Spline Interpolation across keyframes
   * Guarantees C1 continuous velocity without angular ticks or frame jerks.
   */
  getInterpolatedLocalCoords(clipTimeMs) {
    const len = this.recordedFrames.length;
    if (len === 0) return null;
    if (len === 1) return this.recordedFrames[0].localCoords;

    const lastFrame = this.recordedFrames[len - 1];
    if (clipTimeMs >= lastFrame.timeOffsetMs) {
      return lastFrame.localCoords;
    }

    let low = 0;
    let high = len - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (this.recordedFrames[mid].timeOffsetMs <= clipTimeMs) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const idx1 = Math.min(len - 1, Math.max(0, high));
    const idx2 = Math.min(len - 1, low);

    const f1 = this.recordedFrames[idx1];
    const f2 = this.recordedFrames[idx2];

    if (idx1 === idx2 || !f1 || !f2 || !f1.localCoords || !f2.localCoords) {
      return (f1 || f2).localCoords;
    }

    const dt = f2.timeOffsetMs - f1.timeOffsetMs;
    const t = dt > 0.001 ? Math.max(0, Math.min(1, (clipTimeMs - f1.timeOffsetMs) / dt)) : 0;

    // Catmull-Rom 4-point neighborhood
    const idx0 = (idx1 - 1 + len) % len;
    const idx3 = (idx2 + 1) % len;
    const p0 = this.recordedFrames[idx0].localCoords;
    const p1 = f1.localCoords;
    const p2 = f2.localCoords;
    const p3 = this.recordedFrames[idx3].localCoords;

    const count = p1.length;
    const result = new Array(count);

    const t2 = t * t;
    const t3 = t2 * t;

    // Catmull-Rom coefficients
    const a0 = -0.5 * t3 + t2 - 0.5 * t;
    const a1 =  1.5 * t3 - 2.5 * t2 + 1.0;
    const a2 = -1.5 * t3 + 2.0 * t2 + 0.5 * t;
    const a3 =  0.5 * t3 - 0.5 * t2;

    for (let i = 0; i < count; i++) {
      const pt0 = p0[i] || p1[i];
      const pt1 = p1[i];
      const pt2 = p2[i];
      const pt3 = p3[i] || p2[i];

      result[i] = {
        x: a0 * pt0.x + a1 * pt1.x + a2 * pt2.x + a3 * pt3.x,
        y: a0 * pt0.y + a1 * pt1.y + a2 * pt2.y + a3 * pt3.y,
        z: a0 * pt0.z + a1 * pt1.z + a2 * pt2.z + a3 * pt3.z
      };
    }

    return result;
  }

  getInterpolatedBlendshapes(clipTimeMs) {
    const len = this.recordedFrames.length;
    if (len === 0) return null;
    if (len === 1) return this.recordedFrames[0].blendshapes;

    const lastFrame = this.recordedFrames[len - 1];
    if (clipTimeMs >= lastFrame.timeOffsetMs) {
      return lastFrame.blendshapes;
    }

    let low = 0;
    let high = len - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (this.recordedFrames[mid].timeOffsetMs <= clipTimeMs) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const idx0 = Math.max(0, high);
    const idx1 = Math.min(len - 1, low);

    const f0 = this.recordedFrames[idx0];
    const f1 = this.recordedFrames[idx1];

    if (idx0 === idx1 || !f0 || !f1 || !f0.blendshapes || !f1.blendshapes) {
      return (f0 || f1).blendshapes;
    }

    const dt = f1.timeOffsetMs - f0.timeOffsetMs;
    const alpha = dt > 0.001 ? Math.max(0, Math.min(1, (clipTimeMs - f0.timeOffsetMs) / dt)) : 0;

    const result = {};
    const allKeys = new Set([...Object.keys(f0.blendshapes), ...Object.keys(f1.blendshapes)]);
    for (const k of allKeys) {
      const v0 = f0.blendshapes[k] || 0;
      const v1 = f1.blendshapes[k] || 0;
      result[k] = v0 + (v1 - v0) * alpha;
    }

    return result;
  }
}
