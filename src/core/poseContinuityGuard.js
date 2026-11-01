import * as THREE from 'three';

// Hand occlusion can produce a wildly different head pose for one or two frames
// before MediaPipe reports no face. Do not display or record those guesses.
export class PoseContinuityGuard {
  constructor() { this.reset(); }

  reset() {
    this.accepted = null;
    this.pending = null;
  }

  readPose(frame) {
    const data = frame.headPose?.matrix;
    if (data?.length !== 16 || !Array.from(data).every(Number.isFinite)) return null;
    const matrix = new THREE.Matrix4().fromArray(data);
    const position = new THREE.Vector3(), rotation = new THREE.Quaternion(), scale = new THREE.Vector3();
    matrix.decompose(position, rotation, scale);
    if (position.z >= -1 || Math.min(scale.x, scale.y, scale.z) < 1e-6
      || ![rotation.x, rotation.y, rotation.z, rotation.w].every(Number.isFinite)) return null;
    return { position, rotation: rotation.normalize(), scale };
  }

  update(frame) {
    if (!frame?.detected) { this.pending = null; return frame; }
    const pose = this.readPose(frame);
    if (!pose) { this.pending = null; return { detected: false, timestamp: frame.timestamp, isNewFrame: true }; }
    const accepted = this.accepted;
    if (!accepted || this.isContinuous(accepted, pose, 20, .12)) return this.accept(frame, pose);

    const pending = this.pending;
    if (!pending || !this.isContinuous(pending.pose, pose, 10, .08)) {
      this.pending = { pose, since: frame.timestamp, count: 1 };
    } else {
      pending.pose = pose;
      pending.count++;
      // A genuine rapid turn is accepted once its new pose is confirmed; an
      // isolated occlusion guess never becomes the live or autonomous reference.
      if (pending.count >= 3 && frame.timestamp - pending.since >= 100) return this.accept(frame, pose);
    }
    return { detected: false, timestamp: frame.timestamp, isNewFrame: true, latencyMs: frame.latencyMs };
  }

  isContinuous(from, to, angleDegrees, translationFraction) {
    const translationLimit = Math.max(3, Math.abs(from.position.z) * translationFraction);
    const scaleRatio = to.scale.length() / Math.max(1e-8, from.scale.length());
    return from.rotation.angleTo(to.rotation) <= THREE.MathUtils.degToRad(angleDegrees)
      && from.position.distanceTo(to.position) <= translationLimit
      && scaleRatio >= .75 && scaleRatio <= 1.33;
  }

  accept(frame, pose) {
    this.accepted = pose;
    this.pending = null;
    return frame;
  }
}
