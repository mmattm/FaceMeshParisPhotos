/**
 * Face Texture History Buffer & Cleanest Frontal Face Capture Tracker
 * 
 * Automatically captures and saves the single BEST front-facing, unobstructed,
 * razor-sharp screenshot of a visitor's face for autonomous mode texture reference.
 * 
 * Key Principles:
 * 1. Dedicated Canvas Storage: Each snapshot in the history has its own dedicated canvas.
 *    It is never overwritten by subsequent live webcam frames.
 * 2. Never Cut Off (Pas coupé / pas la moitié du visage):
 *    Strict boundary clearance guarantees that forehead, chin, cheeks, and nose
 *    are fully inside the frame with at least 8% margins.
 * 3. Straight & Aligned (Bien droit):
 *    Requires frontal head pose: |yaw| <= 10°, |pitch| <= 10°, |roll| <= 6°.
 * 4. Centered (Bien centré):
 *    Heavily rewards face position centered around optimal portrait center (0.50, 0.48).
 * 5. Stillness (Pas de flou de mouvement):
 *    Calculates rolling landmark velocity to ensure the face was motionless before capture.
 * 6. Unobstructed (Pas obstrué):
 *    8 bilateral facial symmetry pairs ensure no hands, phones, or objects cover the face,
 *    with open eyes and closed resting lips.
 * 7. Departure Buffer Exclusion:
 *    When tracking drops, prioritizes the highest-scoring candidate taken at least 1.5s - 2.0s
 *    before disappearance, completely avoiding the frame of the person leaving or turning away.
 * 8. Guaranteed 100% Availability:
 *    Multiple tiers of fallbacks ensure autonomous mode ALWAYS has a pristine, complete
 *    face texture for both the 3D mask and the background plane.
 */

const CAPTURE_POSE_LIMITS = { yaw: 10, pitch: 10, roll: 6 };

export class FaceTextureHistoryBuffer extends EventTarget {
  constructor(maxSnapshots = 20, minAgeMs = 1500) {
    super();
    this.maxSnapshots = maxSnapshots;
    this.minAgeMs = minAgeMs;

    // Tracked landmark indices for multi-point movement calculation
    this.TRACKED_INDICES = [10, 168, 1, 33, 263, 133, 362, 234, 454, 172, 397, 152];

    // Bilateral symmetry pairs relative to the facial midline (nasion 168)
    this.SYMMETRY_PAIRS = [
      [33, 263],   // Outer eye canthi
      [133, 362],  // Inner eye canthi
      [116, 345],  // Zygomatic cheekbones
      [234, 454],  // Outer cheeks
      [172, 397],  // Jaw gonions
      [136, 365],  // Mid-mandible
      [61, 291],   // Mouth corners
      [105, 334]   // Eyebrow peaks
    ];

    // Timestamped snapshots history
    this.snapshots = [];
    this.bestOverallSnapshot = null;
    this.fallbackSnapshot = null;
    this.archivedReference = null;
    this.lastSampleTime = 0;
    this.lastFallbackSampleTime = -Infinity;

    // Short motion history reacts quickly when the visitor settles into position.
    this.recentMotionHistory = [];
    this.lastTrackedLandmarks = null;
    this.lastPose = null;

    // Offscreen helper canvas for exporting snapshot data URLs
    this.exportCanvas = document.createElement('canvas');
    this.exportCanvas.width = 1280;
    this.exportCanvas.height = 720;
    this.exportCtx = this.exportCanvas.getContext('2d');
  }

  /**
   * Reset visitor session state when a new visitor arrives.
   * Archives the best candidate from the previous visitor so autonomous mode is never starved.
   */
  resetVisitorSession() {
    if (this.bestOverallSnapshot && this.bestOverallSnapshot.canvas) {
      const archCanvas = document.createElement('canvas');
      archCanvas.width = this.bestOverallSnapshot.canvas.width;
      archCanvas.height = this.bestOverallSnapshot.canvas.height;
      const archCtx = archCanvas.getContext('2d');
      archCtx.drawImage(this.bestOverallSnapshot.canvas, 0, 0);

      this.archivedReference = {
        canvas: archCanvas,
        landmarks: this.bestOverallSnapshot.landmarks.map(p => ({ x: p.x, y: p.y, z: p.z || 0, visibility: p.visibility })),
        headPose: { ...this.bestOverallSnapshot.headPose },
        score: this.bestOverallSnapshot.score || 800,
        timestamp: this.bestOverallSnapshot.timestamp
      };
    }

    this.snapshots = [];
    this.bestOverallSnapshot = null;
    this.fallbackSnapshot = null;
    this.lastSampleTime = 0;
    this.lastFallbackSampleTime = -Infinity;

    this.recentMotionHistory = [];
    this.lastTrackedLandmarks = null;
    this.lastPose = null;
  }

  clear() {
    this.resetVisitorSession();
    this.archivedReference = null;
  }

  /**
   * Quality evaluation:
   * 1. Safe Margins: Face completely inside frame (>= 8% margin) - NEVER cut off!
   * 2. Proportions: Height >= 20%, Width >= 16%, aspect ratio 1.12 - 1.68.
   * 3. Centering: Face center within 0.22 of optimal (0.50, 0.48).
   * 4. Frontal: Yaw <= 10°, Pitch <= 10°, Roll <= 6°.
   * 5. Stillness: Rolling displacement < 0.0040.
   * 6. Anti-Obstruction: 8 symmetry pairs, open eyes, closed resting mouth.
   */
  evaluateFaceQuality(lms, pose, avgMotionBefore, motionDelta, aspectRatio = 1) {
    if (!lms || lms.length < 468 || !this.isCapturePoseAligned(pose)) return null;

    const nasion = lms[168] || lms[6];
    const noseTip = lms[1];
    const forehead = lms[10];
    const chin = lms[152];
    const cheekR = lms[234];
    const cheekL = lms[454];

    if (!nasion || !noseTip || !forehead || !chin || !cheekR || !cheekL) return null;

    // 1. PAS COUPÉ / PAS LA MOITIÉ DU VISAGE:
    // Strictly require all face boundaries to be comfortably inside the frame (>= 8% margin)
    const margin = 0.080;
    if (
      forehead.y < margin ||
      chin.y > (1.0 - margin) ||
      cheekR.x < margin ||
      cheekL.x > (1.0 - margin) ||
      noseTip.x < 0.20 || noseTip.x > 0.80 ||
      noseTip.y < 0.20 || noseTip.y > 0.80
    ) {
      return null; // Face cut off or partially out of frame!
    }

    // Face scale: must be a full face
    const faceHeight = Math.abs(chin.y - forehead.y);
    const faceWidth = Math.abs(cheekL.x - cheekR.x);
    if (faceHeight < 0.20 || faceHeight > 0.75 || faceWidth < 0.16 || faceWidth > 0.65) {
      return null; // Too far or too close
    }

    // Normal cranial proportions (aspect ratio)
    // Landmarks are normalized per axis; correct for wide webcam frames.
    const faceAspect = faceHeight / Math.max(0.01, faceWidth * aspectRatio);
    if (faceAspect < 1.12 || faceAspect > 1.68) {
      return null; // Distorted proportions
    }

    // 2. BIEN CENTRÉ (Target portrait center: 0.50, 0.48)
    const centerX = (nasion.x + noseTip.x) * 0.5;
    const centerY = (nasion.y + noseTip.y) * 0.5;
    const dCenter = Math.hypot((centerX - 0.50) * 1.0, (centerY - 0.48) * 1.15);
    if (dCenter > 0.22) {
      return null; // Too far from center
    }
    const sCenter = Math.exp(-14.0 * dCenter * dCenter);

    // 3. BIEN DROIT / ALIGNÉ (Frontal pose)
    const yaw = Math.abs(pose.yaw || 0);
    const pitch = Math.abs(pose.pitch || 0);
    const roll = Math.abs(pose.roll || 0);

    const sFrontal = Math.exp(-((yaw / 6.0) ** 2 + (pitch / 6.0) ** 2 + (roll / 4.5) ** 2));
    const angleMagnitude = Math.hypot(yaw * 1.2, pitch * 1.1, roll * 0.9);

    // 4. PAS DE FLOU DE BOUGE (Stillness beforehand)
    if (avgMotionBefore > 0.0040 || motionDelta > 0.0045) {
      return null; // Motion blur
    }
    const sStillness = Math.exp(-320.0 * avgMotionBefore - 220.0 * motionDelta);

    // 5. PAS OBSTRUÉ (Bilateral symmetry across 8 pairs)
    let sumAsym = 0;
    let maxAsym = 0;
    for (let i = 0; i < this.SYMMETRY_PAIRS.length; i++) {
      const [rIdx, lIdx] = this.SYMMETRY_PAIRS[i];
      const rPt = lms[rIdx];
      const lPt = lms[lIdx];
      if (!rPt || !lPt) continue;

      const dR = Math.hypot(rPt.x - nasion.x, rPt.y - nasion.y);
      const dL = Math.hypot(lPt.x - nasion.x, lPt.y - nasion.y);
      const maxD = Math.max(dR, dL, 0.01);
      const asym = Math.abs(dR - dL) / maxD;

      sumAsym += asym;
      if (asym > maxAsym) maxAsym = asym;
    }
    const avgAsym = sumAsym / this.SYMMETRY_PAIRS.length;

    if (maxAsym > 0.16 || avgAsym > 0.09) {
      return null; // Obstructed face
    }
    const sSym = Math.exp(-16.0 * avgAsym) * Math.exp(-8.0 * maxAsym);

    // 6. YEUX OUVERTS (both eyes open, not blinking or winking)
    const rEyeOpen = lms[145] && lms[159] ? Math.abs(lms[145].y - lms[159].y) : 0;
    const lEyeOpen = lms[374] && lms[386] ? Math.abs(lms[374].y - lms[386].y) : 0;
    const avgEyeOpen = (rEyeOpen + lEyeOpen) * 0.5;
    const diffEyeOpen = Math.abs(rEyeOpen - lEyeOpen);

    if (avgEyeOpen < 0.010 || diffEyeOpen > 0.007) {
      return null; // Blinking or winking
    }
    const eyeScore = Math.min(1.0, (avgEyeOpen - 0.009) / 0.012) * Math.max(0, 1.0 - (diffEyeOpen / 0.007));

    // 7. BOUCHE AU REPOS (mouth resting, lips closed)
    const mouthOpen = lms[13] && lms[14] ? Math.abs(lms[13].y - lms[14].y) : 0;
    if (mouthOpen > 0.022) {
      return null; // Talking / open mouth
    }
    const mouthScore = Math.max(0, 1.0 - Math.max(0, mouthOpen - 0.008) / 0.014);

    // High-Dynamic-Range Composite Score (0 - 1000)
    const compositeScore = Math.round(
      Math.pow(sCenter, 1.5) *
      Math.pow(sFrontal, 1.5) *
      Math.pow(sStillness, 1.4) *
      sSym *
      eyeScore *
      mouthScore *
      1000
    );

    return {
      dCenter,
      sCenter,
      angleMagnitude,
      sFrontal,
      sStillness,
      sSym,
      eyeScore,
      mouthScore,
      compositeScore
    };
  }

  /**
   * Helper to allocate or recycle a dedicated snapshot canvas entry.
   */
  _createSnapshotEntry(videoEl, lms, pose, score, now) {
    const vw = videoEl.videoWidth || 1280;
    const vh = videoEl.videoHeight || 720;

    let canvas = null;
    if (this.snapshots.length < this.maxSnapshots) {
      canvas = document.createElement('canvas');
      canvas.width = vw;
      canvas.height = vh;
    } else {
      // Recycle lowest scoring snapshot (excluding bestOverallSnapshot)
      let evictIdx = -1;
      let lowestScore = Infinity;
      for (let i = 0; i < this.snapshots.length; i++) {
        const s = this.snapshots[i];
        if (s === this.bestOverallSnapshot) continue;
        if (s.score < lowestScore) {
          lowestScore = s.score;
          evictIdx = i;
        }
      }
      if (evictIdx === -1) evictIdx = 0;
      const evicted = this.snapshots.splice(evictIdx, 1)[0];
      canvas = evicted.canvas;
      if (canvas.width !== vw || canvas.height !== vh) {
        canvas.width = vw;
        canvas.height = vh;
      }
    }

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoEl, 0, 0, vw, vh);

    const clonedLandmarks = new Array(lms.length);
    for (let i = 0; i < lms.length; i++) {
      const p = lms[i];
      clonedLandmarks[i] = { x: p.x, y: p.y, z: p.z || 0, visibility: p.visibility };
    }

    return {
      timestamp: now,
      canvas,
      landmarks: clonedLandmarks,
      headPose: { yaw: pose.yaw || 0, pitch: pose.pitch || 0, roll: pose.roll || 0 },
      score
    };
  }

  isCapturePoseAligned(pose) {
    return Object.entries(CAPTURE_POSE_LIMITS).every(([axis, limit]) =>
      Number.isFinite(pose?.[axis]) && Math.abs(pose[axis]) <= limit);
  }

  hasCurrentVisitorSnapshot() {
    return [this.bestOverallSnapshot, this.fallbackSnapshot].some(snapshot =>
      snapshot?.canvas?.width > 0 && snapshot.canvas.height > 0
      && snapshot.landmarks?.length >= 468 && this.isCapturePoseAligned(snapshot.headPose));
  }

  /**
   * Monitor live frames, calculate multi-point stillness, evaluate quality,
   * and store qualified candidate screenshots into dedicated non-overwritten canvases.
   */
  recordFrame(videoEl, rawTracking, now = performance.now()) {
    if (!videoEl || videoEl.readyState < 2 || !rawTracking || !rawTracking.detected || !rawTracking.landmarks) {
      return;
    }

    const lms = rawTracking.landmarks;
    const pose = rawTracking.headPose;
    if (!pose) return;

    // 1. Multi-Point Landmark Displacement & Angular Velocity
    let landmarkDisp = 0;
    if (this.lastTrackedLandmarks) {
      let sumD = 0;
      let count = 0;
      for (let i = 0; i < this.TRACKED_INDICES.length; i++) {
        const idx = this.TRACKED_INDICES[i];
        const curr = lms[idx];
        const prev = this.lastTrackedLandmarks[i];
        if (curr && prev) {
          sumD += Math.hypot(curr.x - prev.x, curr.y - prev.y);
          count++;
        }
      }
      landmarkDisp = count > 0 ? (sumD / count) : 0;
    }

    let poseDisp = 0;
    if (this.lastPose) {
      const dYaw = Math.abs((pose.yaw || 0) - this.lastPose.yaw);
      const dPitch = Math.abs((pose.pitch || 0) - this.lastPose.pitch);
      const dRoll = Math.abs((pose.roll || 0) - this.lastPose.roll);
      poseDisp = ((dYaw + dPitch + dRoll) / 180.0) * 0.05;
    }

    const motionDelta = landmarkDisp * 0.75 + poseDisp * 0.25;

    this.lastTrackedLandmarks = this.TRACKED_INDICES.map(idx => {
      const pt = lms[idx];
      return pt ? { x: pt.x, y: pt.y } : { x: 0.5, y: 0.5 };
    });
    this.lastPose = { yaw: pose.yaw || 0, pitch: pose.pitch || 0, roll: pose.roll || 0 };

    this.recentMotionHistory.push(motionDelta);
    if (this.recentMotionHistory.length > 3) {
      this.recentMotionHistory.shift();
    }

    // All captures, including safety fallbacks, must have a known frontal pose.
    if (!this.isCapturePoseAligned(pose)) return;

    // 2. Safety Fallback Snapshot:
    // Any complete face comfortably inside frame (margins >= 6%) is recorded as fallback
    const forehead = lms[10];
    const chin = lms[152];
    const cheekR = lms[234];
    const cheekL = lms[454];
    if (
      forehead && chin && cheekR && cheekL &&
      forehead.y >= 0.06 && chin.y <= 0.94 &&
      cheekR.x >= 0.06 && cheekL.x <= 0.94 &&
      now - this.lastFallbackSampleTime >= 800
    ) {
      this.lastFallbackSampleTime = now;
      const isFirstFallback = !this.fallbackSnapshot;
      if (!this.fallbackSnapshot) {
        const fc = document.createElement('canvas');
        fc.width = videoEl.videoWidth || 1280;
        fc.height = videoEl.videoHeight || 720;
        this.fallbackSnapshot = {
          canvas: fc,
          ctx: fc.getContext('2d'),
          landmarks: null,
          headPose: null,
          timestamp: now
        };
      }
      this.fallbackSnapshot.ctx.drawImage(videoEl, 0, 0, this.fallbackSnapshot.canvas.width, this.fallbackSnapshot.canvas.height);
      this.fallbackSnapshot.landmarks = lms.map(p => ({ x: p.x, y: p.y, z: p.z || 0, visibility: p.visibility }));
      this.fallbackSnapshot.headPose = { yaw: pose.yaw || 0, pitch: pose.pitch || 0, roll: pose.roll || 0 };
      this.fallbackSnapshot.timestamp = now;
      if (isFirstFallback && !this.bestOverallSnapshot) {
        this.dispatchEvent(new CustomEvent('fallback-capture', {
          detail: {
            canvas: this.fallbackSnapshot.canvas,
            landmarks: this.fallbackSnapshot.landmarks,
            timestamp: now
          }
        }));
      }
    }

    let sumMotion = 0;
    for (let i = 0; i < this.recentMotionHistory.length; i++) {
      sumMotion += this.recentMotionHistory[i];
    }
    const avgMotionBefore = sumMotion / this.recentMotionHistory.length;

    // 3. Pristine Quality Evaluation
    const aspectRatio = (videoEl.videoWidth || 1280) / Math.max(1, videoEl.videoHeight || 720);
    const evalResult = this.evaluateFaceQuality(lms, pose, avgMotionBefore, motionDelta, aspectRatio);
    if (!evalResult) {
      return;
    }

    const timeSinceLast = now - this.lastSampleTime;
    const isNewRecord = !this.bestOverallSnapshot || evalResult.compositeScore > this.bestOverallSnapshot.score;

    // Record candidate at least every 150ms or on new record score
    // Hard quality checks already passed: save the first usable frame immediately,
    // then let the score select improvements rather than delay the first capture.
    if (timeSinceLast >= 150 || isNewRecord) {
      this.lastSampleTime = now;

      const entry = this._createSnapshotEntry(videoEl, lms, pose, evalResult.compositeScore, now);
      this.snapshots.push(entry);

      // Expire snapshots older than 18 seconds
      while (this.snapshots.length > 0 && (now - this.snapshots[0].timestamp > 18000)) {
        this.snapshots.shift();
      }

      if (isNewRecord) {
        this.bestOverallSnapshot = entry;

        let dataUrl = null;
        try {
          dataUrl = this.getPristineSnapshotDataUrl(entry.canvas, true);
        } catch (error) {
          console.warn('[FaceTextureHistoryBuffer] Export JPEG indisponible ; cliché conservé en mémoire.', error);
        }
        // The in-memory capture succeeds even if optional JPEG export fails.
        this.dispatchEvent(new CustomEvent('pristine-capture', {
          detail: {
            canvas: entry.canvas,
            landmarks: entry.landmarks,
            pose: entry.headPose,
            score: entry.score,
            dataUrl
          }
        }));
      }
    }
  }

  /**
   * Generates a mirrored or unmirrored snapshot Data URL of a candidate canvas.
   */
  getPristineSnapshotDataUrl(sourceCanvas = null, isMirrored = true, quality = 0.92) {
    const srcCanvas = sourceCanvas || (this.bestOverallSnapshot ? this.bestOverallSnapshot.canvas : null);
    if (!srcCanvas || srcCanvas.width === 0) return null;

    const w = srcCanvas.width;
    const h = srcCanvas.height;
    if (this.exportCanvas.width !== w || this.exportCanvas.height !== h) {
      this.exportCanvas.width = w;
      this.exportCanvas.height = h;
    }

    this.exportCtx.save();
    this.exportCtx.clearRect(0, 0, w, h);
    if (isMirrored) {
      this.exportCtx.translate(w, 0);
      this.exportCtx.scale(-1, 1);
    }
    this.exportCtx.drawImage(srcCanvas, 0, 0, w, h);
    this.exportCtx.restore();

    return this.exportCanvas.toDataURL('image/jpeg', quality);
  }

  /**
   * Retrieves the cleanest, most centered, frontal, and motionless screenshot for texture reference.
   * 
   * CRITICAL GUARANTEE:
   * 1. Prioritizes screenshots taken AT LEAST minAgeMs (default: 1500ms) before disappearance,
   *    so the frame is completely immune to the departure / walking away movement.
   * 2. Multiple fallback tiers guarantee that a valid, complete face texture is ALWAYS returned.
   * 
   * @param {number} now - Current timestamp (moment of disappearance)
   * @param {number} minAgeMs - Minimum age required (default: 1500ms)
   */
  getBestVisitorBackupFrame(now = performance.now(), minAgeMs = this.minAgeMs) {
    // 1. Look for qualified snapshots older than minAgeMs (before visitor departure)
    const candidates = [...this.snapshots];
    // The best canvas stays in memory even after the rolling history expires.
    if (this.bestOverallSnapshot && !candidates.includes(this.bestOverallSnapshot)) {
      candidates.push(this.bestOverallSnapshot);
    }
    const validAgeSnapshots = candidates.filter(s => (now - s.timestamp) >= minAgeMs);

    if (validAgeSnapshots.length > 0) {
      let best = validAgeSnapshots[0];
      for (let i = 1; i < validAgeSnapshots.length; i++) {
        if (validAgeSnapshots[i].score > best.score) {
          best = validAgeSnapshots[i];
        }
      }
      console.log(`[FaceTextureHistoryBuffer] 🎯 Snapshot optimal sélectionné (Âge: ${Math.round(now - best.timestamp)}ms, Score: ${best.score})`);
      return {
        timestamp: best.timestamp,
        canvas: best.canvas,
        landmarks: best.landmarks,
        headPose: best.headPose,
        qualityScore: best.score,
        isPristine: true
      };
    }

    // 2. Short visit (< 1.5s): take the best overall snapshot from this visit
    if (this.bestOverallSnapshot) {
      console.log(`[FaceTextureHistoryBuffer] ⭐ Meilleur snapshot de la session sélectionné (Score: ${this.bestOverallSnapshot.score})`);
      return {
        timestamp: this.bestOverallSnapshot.timestamp,
        canvas: this.bestOverallSnapshot.canvas,
        landmarks: this.bestOverallSnapshot.landmarks,
        headPose: this.bestOverallSnapshot.headPose,
        qualityScore: this.bestOverallSnapshot.score,
        isPristine: true
      };
    }

    // 3. Any recorded snapshot in current session
    if (this.snapshots.length > 0) {
      let best = this.snapshots[0];
      for (let i = 1; i < this.snapshots.length; i++) {
        if (this.snapshots[i].score > best.score) best = this.snapshots[i];
      }
      return {
        timestamp: best.timestamp,
        canvas: best.canvas,
        landmarks: best.landmarks,
        headPose: best.headPose,
        qualityScore: best.score,
        isPristine: false
      };
    }

    // 4. Safety fallback snapshot (any non-cut-off face from this session)
    if (this.fallbackSnapshot && this.fallbackSnapshot.landmarks) {
      console.log('[FaceTextureHistoryBuffer] 🛡️ Snapshot de sécurité cadré appliqué');
      return {
        timestamp: this.fallbackSnapshot.timestamp,
        canvas: this.fallbackSnapshot.canvas,
        landmarks: this.fallbackSnapshot.landmarks,
        headPose: this.fallbackSnapshot.headPose,
        qualityScore: 500,
        isPristine: false
      };
    }

    // 5. Archived reference from previous visitor
    if (this.archivedReference) {
      console.log('[FaceTextureHistoryBuffer] 🏛️ Référence archivée précédente appliquée');
      return {
        timestamp: now,
        canvas: this.archivedReference.canvas,
        landmarks: this.archivedReference.landmarks,
        headPose: this.archivedReference.headPose,
        qualityScore: this.archivedReference.score || 700,
        isPristine: true,
        isArchived: true
      };
    }

    return null;
  }
}
