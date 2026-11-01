import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { PoseContinuityGuard } from './poseContinuityGuard.js';
const frame = (time, yaw = 0, x = 0) => ({ detected: true, timestamp: time, isNewFrame: true,
  headPose: { matrix: new THREE.Matrix4().makeRotationY(THREE.MathUtils.degToRad(yaw)).setPosition(x, 0, -35).toArray() },
  blendshapes: { jawOpen: .7 } });

test('normal camera movement and expression scores pass through without smoothing or remapping', () => {
  const guard = new PoseContinuityGuard();
  for (const [time, yaw] of [[0, 0], [55, 8], [110, 20], [165, 29]]) {
    const input = frame(time, yaw);
    assert.strictEqual(guard.update(input), input);
  }
});

test('one or two occlusion guesses cannot replace the reliable camera angle before tracking disappears', () => {
  const guard = new PoseContinuityGuard();
  guard.update(frame(0, 8));
  assert.equal(guard.update(frame(55, 90)).detected, false);
  assert.equal(guard.update(frame(110, 92)).detected, false);
  assert.equal(guard.update({ detected: false, timestamp: 165 }).detected, false);
  assert.equal(guard.update(frame(220, -70)).detected, false, 'a guessed face after a short dropout must also be rejected');
  const returned = frame(275, 10);
  assert.strictEqual(guard.update(returned), returned);
});

test('a genuine rapid turn is accepted once the new pose is confirmed consistently', () => {
  const guard = new PoseContinuityGuard();
  guard.update(frame(0));
  assert.equal(guard.update(frame(55, 50)).detected, false);
  assert.equal(guard.update(frame(110, 52)).detected, false);
  const confirmed = frame(165, 53);
  assert.strictEqual(guard.update(confirmed), confirmed);
  const next = frame(220, 58);
  assert.strictEqual(guard.update(next), next);
});

test('changing occlusion guesses and sudden translation never establish a new reference', () => {
  const guard = new PoseContinuityGuard();
  guard.update(frame(0));
  for (const [time, yaw] of [[55, 80], [110, -70], [165, 60], [220, -90]]) {
    assert.equal(guard.update(frame(time, yaw)).detected, false);
  }
  assert.equal(guard.update(frame(275, 0, 20)).detected, false);
  assert.equal(guard.update(frame(330, 0, -20)).detected, false);
  const returned = frame(385, 2, .5);
  assert.strictEqual(guard.update(returned), returned);
});
