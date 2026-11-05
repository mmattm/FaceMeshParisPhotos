import test from 'node:test';
import assert from 'node:assert/strict';
import { FaceProximityGate } from './faceProximityGate.js';
const face = height => ({ detected: true, landmarks: [{ y: 0.3 }, { y: 0.3 + height }] });
test('distant faces cannot drive presence, recognition or live rendering', () => {
  const gate = new FaceProximityGate(20, { settleMs: 0, exitMs: 0, lossHoldMs: 0, smoothingMs: 0 });
  assert.equal(gate.filter(face(0.12)).detected, false);
  const near = face(0.25);
  assert.equal(gate.filter(near), near);
  assert.equal(gate.filter(face(0.195)).detected, true);
  assert.equal(gate.filter(face(0.17)).tooFar, true);
  assert.equal(gate.filter(face(0.19)).detected, false);
});
test('threshold changes and loss reset hysteresis; raw points take precedence', () => {
  const gate = new FaceProximityGate(20, { settleMs: 0, exitMs: 0, lossHoldMs: 0, smoothingMs: 0 });
  gate.filter(face(0.3));
  gate.filter(null);
  assert.equal(gate.filter(face(0.19)).detected, false);
  gate.setThresholdPercent(10);
  assert.equal(gate.filter(face(0.12)).detected, true);
  assert.equal(gate.filter({ ...face(0.5), rawLandmarks: face(0.05).landmarks }).tooFar, true);
});

test('default requires a large face held near the camera and releases on recession', () => {
  const gate = new FaceProximityGate();
  assert.equal(gate.filter(face(0.25), 0).tooFar, true);
  assert.equal(gate.filter(face(0.45), 100).detected, false);
  assert.equal(gate.filter(face(0.45), 449).detected, false);
  assert.equal(gate.filter(face(0.45), 450).detected, false);
  assert.equal(gate.filter(face(0.45), 800).detected, true);
  assert.equal(gate.filter(face(0.39), 850).detected, true);
  assert.equal(gate.filter(face(0.37), 900).detected, true);
  gate.filter(face(0.37), 1100);
  assert.equal(gate.filter(face(0.37), 1500).tooFar, true);
});

test('brief detection dropouts retain the pose without reusing it for recognition', () => {
  const gate = new FaceProximityGate();
  gate.filter(face(0.45), 0);
  gate.filter(face(0.45), 350);
  const held = gate.filter(null, 450);
  assert.equal(held.detected, true);
  assert.equal(held.isNewFrame, false);
  assert.equal(held.trackingHeld, true);
  assert.equal(gate.filter(face(0.45), 500).detected, true);
  assert.equal(gate.filter(null, 800), null);
  assert.equal(gate.filter(face(0.45), 900).detected, false);
});

test('small transient changes do not switch modes but a far face is rejected promptly', () => {
  const gate = new FaceProximityGate(40, { settleMs: 0 });
  gate.filter(face(0.45), 0);
  assert.equal(gate.filter(face(0.37), 100).detected, true);
  assert.equal(gate.filter(face(0.43), 200).detected, true);
  assert.equal(gate.filter(face(0.20), 300).detected, false);
});
