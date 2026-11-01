import * as THREE from 'three';
import { centerFacePose, limitFaceRotation, faceHandoffWeight, FACE_PIVOT, FACE_HANDOFF_DURATION_MS } from './faceCapRig.js';

/** Ease mode changes, consecutive presets and loops; steady live stays direct. */
export class FaceTransition {
  constructor(durationMs = FACE_HANDOFF_DURATION_MS) {
    this.durationMs = durationMs;
    this.last = null;
    this.lastKey = null;
    this.active = null;
  }

  update(target, scores = {}, autonomousKey = null, now = performance.now(), locked = false, maxRotationDegrees = 180) {
    target = limitFaceRotation(target, maxRotationDegrees);
    if (this.last && autonomousKey !== this.lastKey) {
      this.active = { matrix: this.last.matrix.clone(), scores: { ...this.last.scores }, locked: this.last.locked, startedAt: now };
    }
    let matrix = target.clone();
    let blendshapes = { ...scores };
    let preserveLockedPose = false;
    if (this.active) {
      const weight = faceHandoffWeight(now - this.active.startedAt, this.durationMs);
      const from = this.active;
      if (weight === 0) {
        // Keep the exact displayed matrix on the switching frame. Rebuilding a
        // MediaPipe matrix through TRS can discard its tiny affine residuals.
        matrix.copy(from.matrix);
        blendshapes = { ...from.scores };
        preserveLockedPose = locked && from.locked;
      } else if (weight < 1) {
        const startPosition = new THREE.Vector3(), startRotation = new THREE.Quaternion(), startScale = new THREE.Vector3();
        const endPosition = new THREE.Vector3(), endRotation = new THREE.Quaternion(), endScale = new THREE.Vector3();
        from.matrix.decompose(startPosition, startRotation, startScale);
        target.decompose(endPosition, endRotation, endScale);
        // Interpolate the face center, not the model's offset origin. Otherwise
        // changing head rotation can introduce a small sideways arc in tracking.
        startPosition.copy(FACE_PIVOT).applyMatrix4(from.matrix);
        endPosition.copy(FACE_PIVOT).applyMatrix4(target);
        startRotation.slerp(endRotation, weight);
        startScale.lerp(endScale, weight);
        const rotatedPivot = FACE_PIVOT.clone().multiply(startScale).applyQuaternion(startRotation);
        matrix.compose(startPosition.lerp(endPosition, weight).sub(rotatedPivot), startRotation, startScale);
        for (const key of new Set([...Object.keys(from.scores), ...Object.keys(scores)])) {
          blendshapes[key] = (from.scores[key] || 0) * (1 - weight) + (scores[key] || 0) * weight;
        }
      } else this.active = null;
    }
    if (locked && !preserveLockedPose) matrix = centerFacePose(matrix);
    // Also cover a limit reduced mid-handoff, and keep the snapshot equal to
    // the displayed bounded pose for the next transition.
    matrix = limitFaceRotation(matrix, maxRotationDegrees);
    this.last = { matrix: matrix.clone(), scores: { ...blendshapes }, locked };
    this.lastKey = autonomousKey;
    return { matrix, blendshapes };
  }
}
