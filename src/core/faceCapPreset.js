import * as THREE from 'three';
import { MP_FOV, FACE_PIVOT, FACE_HANDOFF_DURATION_MS } from './faceCapRig.js';

export function getPresetPlaybackPhase(animation, elapsedMs, { continuous = false } = {}) {
  const duration = Math.max(1, animation.durationMs || 1);
  // Only entry from Live waits on frame zero. Consecutive presets and loop
  // restarts keep playing underneath the renderer's shared ease-in-out blend.
  const entryDelay = continuous ? 0 : FACE_HANDOFF_DURATION_MS;
  const blockDuration = Math.max(FACE_HANDOFF_DURATION_MS, duration);
  const elapsed = Math.max(0, elapsedMs);
  const playbackElapsed = Math.max(0, elapsed - entryDelay);
  const cycle = animation.loop ? Math.floor(playbackElapsed / blockDuration) : 0;
  const withinCycle = animation.loop ? playbackElapsed % blockDuration : playbackElapsed;
  return { cycle, preparing: elapsed < entryDelay,
    finished: !animation.loop && playbackElapsed >= blockDuration,
    time: THREE.MathUtils.clamp(withinCycle, 0, duration) };
}

export function usesRecordedPosition(animation) {
  return animation.poseSpace === 'mediapipe' || animation.id?.startsWith('recorded_');
}

export function isFaceCapClip(animation) {
  return animation?.rig === 'facecap' || (animation && usesRecordedPosition(animation));
}

export function metricPoseMatrix(pose) {
  if (pose.matrix?.length === 16 && Array.from(pose.matrix).every(Number.isFinite)) {
    return new THREE.Matrix4().fromArray(pose.matrix);
  }
  const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(
    THREE.MathUtils.degToRad(pose.pitch || 0), THREE.MathUtils.degToRad(pose.yaw || 0),
    THREE.MathUtils.degToRad(pose.roll || 0), 'YXZ'));
  return new THREE.Matrix4().compose(new THREE.Vector3(pose.x || 0, pose.y || 0, pose.z || 0),
    rotation, new THREE.Vector3(1, 1, 1));
}

export function interpolateMetricPose(from, to, weight) {
  const position = new THREE.Vector3(), rotation = new THREE.Quaternion(), scale = new THREE.Vector3();
  const endPosition = new THREE.Vector3(), endRotation = new THREE.Quaternion(), endScale = new THREE.Vector3();
  metricPoseMatrix(from).decompose(position, rotation, scale);
  metricPoseMatrix(to).decompose(endPosition, endRotation, endScale);
  return new THREE.Matrix4().compose(position.lerp(endPosition, weight), rotation.slerp(endRotation, weight),
    scale.lerp(endScale, weight)).toArray();
}

// Native Face Cap clips supply absolute rotations and morph values. They do not
// use the landmark deformer, pose baseline subtraction or procedural head drift.
export function createFaceCapPresetFrame(sample, canonicalVertices, aspect = 16 / 9, recordedPosition = false) {
  const pose = sample.headPose || {};
  const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(
    THREE.MathUtils.degToRad(pose.pitch || 0), THREE.MathUtils.degToRad(pose.yaw || 0),
    THREE.MathUtils.degToRad(pose.roll || 0), 'YXZ'));
  // Rotate about the center of the face, at a constant distance from the camera.
  const pivot = FACE_PIVOT.clone();
  const target = new THREE.Vector3(0, 0, -48);
  const position = target.clone().sub(pivot.clone().applyQuaternion(rotation));
  const matrix = recordedPosition ? metricPoseMatrix(pose)
    : new THREE.Matrix4().compose(position, rotation, new THREE.Vector3(1, 1, 1));
  position.setFromMatrixPosition(matrix);
  target.copy(pivot).applyMatrix4(matrix);
  const camera = new THREE.PerspectiveCamera(MP_FOV, aspect, 1, 10000);
  const viewWidth = 2 * -target.z * Math.tan(THREE.MathUtils.degToRad(MP_FOV / 2)) * aspect;
  const point = new THREE.Vector3();
  const landmarks = canonicalVertices.map(vertex => {
    point.copy(vertex).applyMatrix4(matrix);
    const z = -(point.z - target.z) / viewWidth;
    point.project(camera);
    return { x: (point.x + 1) / 2, y: (1 - point.y) / 2, z, visibility: 1 };
  });
  // Keep the normal 478-landmark handoff contract, including both iris centers.
  for (const [a, b] of [[33, 133], [362, 263]]) {
    const center = { x: (landmarks[a].x + landmarks[b].x) / 2,
      y: (landmarks[a].y + landmarks[b].y) / 2,
      z: (landmarks[a].z + landmarks[b].z) / 2, visibility: 1 };
    for (let i = 0; i < 5; i++) landmarks.push({ ...center });
  }
  return { landmarks, poseLandmarks: landmarks,
    headPose: { ...pose, x: position.x, y: position.y, z: position.z, matrix: matrix.toArray() },
    blendshapes: { ...sample.blendshapes } };
}
