import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import fs from 'node:fs';
import { MotionPresetRecorder } from './motionPresetRecorder.js';
import { createFaceCapPresetFrame, interpolateMetricPose, isFaceCapClip, usesRecordedPosition } from '../core/faceCapPreset.js';

const pose = (x, y, z, yaw) => ({ x, y, z, pitch: 0, yaw, roll: 0,
  matrix: new THREE.Matrix4().makeRotationY(yaw * Math.PI / 180).setPosition(x, y, z).toArray() });
const vertices = fs.readFileSync(new URL('../core/canonicalFaceModel.obj', import.meta.url), 'utf8')
  .split(/\r?\n/).filter(line => line.startsWith('v '))
  .map(line => new THREE.Vector3(...line.split(/\s+/).slice(1).map(Number)));

test('recording and native playback preserve absolute XYZ, the complete pose and raw expressions', () => {
  const recorder = new MotionPresetRecorder();
  recorder.start(1000);
  const poses = [pose(3, -2, -40, 20), pose(-5, 4, -55, -12), pose(7, 1, -32, 30)];
  const expectedMatrices = poses.map(p => [...p.matrix]);
  poses.forEach((headPose, i) => recorder.capture({ detected: true, headPose,
    blendshapes: { jawOpen: .23, eyeBlinkLeft: .12, _neutral: .5 } }, 1000 + i * 400));
  poses[0].matrix[12] = 999; // Stored frames must not alias a reusable tracking matrix.
  const clip = recorder.stop('Position 3D', 1800);
  assert.equal(clip.poseSpace, 'mediapipe');
  assert.equal(isFaceCapClip(clip), true);
  assert.equal(usesRecordedPosition(clip), true);
  clip.frames.forEach((frame, i) => {
    assert.deepEqual(frame.headPose.matrix, expectedMatrices[i]);
    assert.equal(frame.blendshapes.jawOpen, .23, 'recording must not subtract a neutral-face baseline');
    const played = createFaceCapPresetFrame(frame, vertices, 16 / 9, usesRecordedPosition(clip));
    assert.deepEqual(played.headPose.matrix, expectedMatrices[i]);
  });
});

test('existing recorded presets retain their saved translations even without a matrix or rig tag', () => {
  const old = { id: 'recorded_123' };
  assert.equal(isFaceCapClip(old), true);
  assert.equal(usesRecordedPosition(old), true);
  const frame = createFaceCapPresetFrame({ headPose: { x: 8, y: -3, z: -42, pitch: 2, yaw: 15, roll: 1 } }, vertices, 1, true);
  assert.deepEqual(frame.headPose.matrix.slice(12, 15), [8, -3, -42]);
});

test('pose interpolation preserves linear translation and follows the shortest rotation', () => {
  const matrix = new THREE.Matrix4().fromArray(interpolateMetricPose(pose(-4, 2, -40, 179), pose(6, -2, -60, -179), .5));
  assert.deepEqual(matrix.elements.slice(12, 15), [1, 0, -50]);
  const forward = new THREE.Vector3(0, 0, 1).transformDirection(matrix);
  assert.ok(forward.z < -.9999, 'interpolation must not spin through a frontal orientation');
  assert.ok(Math.abs(matrix.determinant() - 1) < 1e-10);
});
