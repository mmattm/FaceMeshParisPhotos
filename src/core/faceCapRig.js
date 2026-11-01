import * as THREE from 'three';

// Face Cap's 52 morph targets, using the mapping from the three.js webcam example.
export const blendshapesMap = Object.fromEntries([
  'browDown', 'browOuterUp', 'cheekSquint', 'eyeBlink', 'eyeLookDown',
  'eyeLookIn', 'eyeLookOut', 'eyeLookUp', 'eyeSquint', 'eyeWide',
  'mouthDimple', 'mouthFrown', 'mouthLowerDown', 'mouthPress', 'mouthSmile',
  'mouthStretch', 'mouthUpperUp', 'noseSneer'
].flatMap(name => [[`${name}Left`, `${name}_L`], [`${name}Right`, `${name}_R`]])
  .concat(['browInnerUp', 'cheekPuff', 'jawForward', 'jawLeft', 'jawOpen', 'jawRight',
    'mouthClose', 'mouthFunnel', 'mouthLeft', 'mouthPucker', 'mouthRight',
    'mouthRollLower', 'mouthRollUpper', 'mouthShrugLower', 'mouthShrugUpper']
    .map(name => [name, name])));

export const MP_FOV = 63;
export const FACE_HANDOFF_DURATION_MS = 500;
export const FACE_PIVOT = new THREE.Vector3(0, -0.5, 4.5);

export function faceHandoffWeight(elapsedMs, durationMs = FACE_HANDOFF_DURATION_MS) {
  const t = durationMs > 0 ? THREE.MathUtils.clamp(elapsedMs / durationMs, 0, 1) : 1;
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function correctFacePitch(matrix, degrees) {
  const corrected = matrix.clone();
  if (!Number.isFinite(degrees) || degrees === 0) return corrected;
  // Tilt around the camera's horizontal axis at the current face center.
  // Preserve position/depth, including on oblique or scaled tracking poses.
  const center = FACE_PIVOT.clone().applyMatrix4(matrix);
  const rotation = new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(degrees));
  rotation.setPosition(center.clone().sub(center.clone().applyMatrix4(rotation)));
  return corrected.premultiply(rotation);
}

export function centerFacePose(matrix, distance = 28) {
  const centered = matrix.clone();
  const pivot = FACE_PIVOT.clone().applyMatrix4(centered);
  centered.elements[12] -= pivot.x;
  centered.elements[13] -= pivot.y;
  centered.elements[14] += -distance - pivot.z;
  return centered;
}

export function zoomFacePose(matrix, zoom) {
  const scaled = matrix.clone();
  if (!Number.isFinite(zoom) || zoom === 1) return scaled;
  const center = FACE_PIVOT.clone().applyMatrix4(matrix);
  scaled.scale(new THREE.Vector3(zoom, zoom, zoom));
  const shiftedCenter = FACE_PIVOT.clone().applyMatrix4(scaled);
  scaled.elements[12] += center.x - shiftedCenter.x;
  scaled.elements[13] += center.y - shiftedCenter.y;
  scaled.elements[14] += center.z - shiftedCenter.z;
  return scaled;
}

export function limitFaceRotation(matrix, maxDegrees = 180) {
  const limited = matrix.clone();
  const maxAngle = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(maxDegrees, 0, 180));
  if (!Number.isFinite(maxAngle) || maxAngle >= Math.PI) return limited;
  const rotation = new THREE.Quaternion();
  matrix.decompose(new THREE.Vector3(), rotation, new THREE.Vector3());
  rotation.normalize();
  const frontal = new THREE.Quaternion();
  const angle = frontal.angleTo(rotation);
  if (angle <= maxAngle) return limited;
  const bounded = frontal.slerp(rotation, maxAngle / angle);
  const correction = bounded.multiply(rotation.invert());
  // Preserve the face center, scale and the tiny affine residuals in
  // MediaPipe's matrix. Expressions stay independent.
  const center = FACE_PIVOT.clone().applyMatrix4(matrix);
  const delta = new THREE.Matrix4().makeRotationFromQuaternion(correction);
  delta.setPosition(center.clone().sub(center.clone().applyMatrix4(delta)));
  return limited.premultiply(delta);
}

export const createRegistration = () => {
  const registration = new THREE.Group();
  registration.scale.setScalar(0.958);
  registration.rotation.x = Math.PI / 2;
  registration.position.set(0, 0.12, 1.18);
  return registration;
};

export function applyFaceExpressions(face, eyeL, eyeR, scores = {}, intensity = 1) {
  const gain = Number.isFinite(intensity) ? THREE.MathUtils.clamp(intensity, 0, 3) : 1;
  const blinkClosure = score => {
    const raw = THREE.MathUtils.clamp(score || 0, 0, 1);
    // Tracking often tops out below 1 even with closed eyes. Leave the resting
    // lid position alone, then ease into complete closure by a score of 0.6.
    return raw + (1 - raw) * THREE.MathUtils.smoothstep(raw, .25, .6);
  };
  const closureLeft = blinkClosure(scores.eyeBlinkLeft);
  const closureRight = blinkClosure(scores.eyeBlinkRight);
  // Reset every target, including targets absent from a recorded/procedural frame.
  face.morphTargetInfluences.fill(0);
  for (const [category, target] of Object.entries(blendshapesMap)) {
    const index = face.morphTargetDictionary[target];
    // Preserve gaze and eyelid closure even at 0%: dropping blink
    // and squint scores would make the neutral setting look more wide-eyed.
    // Only the eye-opening expression follows the global exaggeration.
    const followsTracking = /^(eyeLook|eyeBlink|eyeSquint|cheekSquint)/.test(category);
    // Give eye opening a subtle boost, including at its maximum deformation.
    const openingLimit = category.startsWith('eyeWide') ? 1.1 : 1;
    const weight = followsTracking ? 1 : gain * openingLimit;
    let value = THREE.MathUtils.clamp((scores[category] || 0) * weight, 0, openingLimit);
    if (category === 'eyeBlinkLeft') value = closureLeft;
    if (category === 'eyeBlinkRight') value = closureRight;
    // Opening must never pull against a closing eyelid, even at 300% intensity.
    if (category === 'eyeWideLeft') value *= 1 - closureLeft;
    if (category === 'eyeWideRight') value *= 1 - closureRight;
    // The model's vertical-gaze morphs also move the eyelids. Fade those out
    // during closure, while the eyeballs below still follow the tracked gaze.
    if (/^eyeLook(Up|Down)Left$/.test(category)) value *= 1 - closureLeft;
    if (/^eyeLook(Up|Down)Right$/.test(category)) value *= 1 - closureRight;
    if (index !== undefined) face.morphTargetInfluences[index] = value;
  }
  const limit = Math.PI / 6;
  eyeL.rotation.z = ((scores.eyeLookInLeft || 0) - (scores.eyeLookOutLeft || 0)) * limit;
  eyeR.rotation.z = ((scores.eyeLookOutRight || 0) - (scores.eyeLookInRight || 0)) * limit;
  eyeL.rotation.x = ((scores.eyeLookDownLeft || 0) - (scores.eyeLookUpLeft || 0)) * limit;
  eyeR.rotation.x = ((scores.eyeLookDownRight || 0) - (scores.eyeLookUpRight || 0)) * limit;
}

// Recorded/autonomous frames use normalized image coordinates rather than MP's
// metric matrix. Recover their screen position and size with the same fixed camera.
export function poseFromLandmarks(landmarks, pose, aspect, canonicalVertices) {
  const left = landmarks[33], right = landmarks[263], anchor = landmarks[168];
  if (!left || !right || !anchor) return new THREE.Matrix4().makeTranslation(0, 0, -50);
  const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(
    THREE.MathUtils.degToRad(pose?.pitch || 0),
    THREE.MathUtils.degToRad(pose?.yaw || 0),
    THREE.MathUtils.degToRad(pose?.roll || 0), 'YXZ'));
  const canonicalSpan = canonicalVertices[33].clone().sub(canonicalVertices[263]).applyQuaternion(rotation);
  const span = Math.max(0.025, Math.hypot((right.x - left.x) * aspect, right.y - left.y));
  const depth = THREE.MathUtils.clamp(Math.hypot(canonicalSpan.x, canonicalSpan.y)
    / (span * 2 * Math.tan(THREE.MathUtils.degToRad(MP_FOV / 2))), 15, 150);
  const localAnchor = canonicalVertices[168].clone().applyQuaternion(rotation);
  const anchorDepth = Math.max(5, depth - localAnchor.z);
  const height = 2 * anchorDepth * Math.tan(THREE.MathUtils.degToRad(MP_FOV / 2));
  const position = new THREE.Vector3((anchor.x - 0.5) * height * aspect - localAnchor.x,
    (0.5 - anchor.y) * height - localAnchor.y, -depth);
  return new THREE.Matrix4().compose(position, rotation, new THREE.Vector3(1, 1, 1));
}
