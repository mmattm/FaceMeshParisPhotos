import * as THREE from 'three';
import { MP_FOV, FACE_PIVOT } from './faceCapRig.js';

export function createMediaPipeGeometry() {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(478 * 3), 3)
    .setUsage(THREE.DynamicDrawUsage));
  geometry.setDrawRange(0, 0);
  return geometry;
}

/** Project the actual detected landmarks, without sampling or morph targets. */
export function updateMediaPipeGeometry(geometry, landmarks, pose, aspect) {
  const count = Math.min(478, landmarks?.length || 0);
  if (count < 468 || !landmarks.slice(0, count).every(p => p && Number.isFinite(p.x + p.y + p.z))) {
    geometry.setDrawRange(0, 0);
    return false;
  }
  const depth = THREE.MathUtils.clamp(-FACE_PIVOT.clone().applyMatrix4(pose).z, 10, 200);
  const heightPerDepth = 2 * Math.tan(THREE.MathUtils.degToRad(MP_FOV / 2));
  const width = depth * heightPerDepth * aspect;
  const anchorZ = landmarks[168].z;
  const inversePose = pose.clone().invert();
  const position = geometry.attributes.position;
  const point = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const landmark = landmarks[i];
    const pointDepth = Math.max(1, depth + (landmark.z - anchorZ) * width);
    // Perspective reconstruction preserves x/y exactly in Tracking. Removing
    // the supplied pose here lets the shared container apply it once, along
    // with the operator's optional Locked framing and vertical correction.
    point.set((landmark.x - .5) * pointDepth * heightPerDepth * aspect,
      (.5 - landmark.y) * pointDepth * heightPerDepth, -pointDepth).applyMatrix4(inversePose);
    position.setXYZ(i, point.x, point.y, point.z);
  }
  position.needsUpdate = true;
  geometry.setDrawRange(0, count);
  return true;
}
