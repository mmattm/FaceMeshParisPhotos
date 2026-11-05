import test from 'node:test';
import assert from 'node:assert/strict';
import { LiveFaceTextureGate } from './liveFaceTextureGate.js';
const face = (x = 0.5, y = 0.5, height = 0.5) => ({ detected: true, isNewFrame: true,
  landmarks: [{ x: x - height / 3, y: y - height / 2 }, { x: x + height / 3, y: y + height / 2 }] });
test('live requires a close centered face held for 450 ms', () => {
  const gate = new LiveFaceTextureGate();
  assert.equal(gate.update(face(0.7), 0), false);
  assert.equal(gate.update(face(0.5, 0.5, 0.4), 500), false);
  assert.equal(gate.update(face(), 1000), false);
  assert.equal(gate.update(face(), 1449), false);
  assert.equal(gate.update(face(), 1450), true);
});
test('small centering changes do not toggle the portrait; departure does', () => {
  const gate = new LiveFaceTextureGate();
  gate.update(face(), 0); gate.update(face(), 450);
  assert.equal(gate.update(face(0.60), 500), true);
  assert.equal(gate.update(face(0.7), 600), true);
  assert.equal(gate.update(face(0.7), 720), false);
  assert.equal(gate.update(face(), 800), false);
  assert.equal(gate.update(face(), 1250), true);
});
test('clipping, turned heads, invalid points and tracking loss reject live', () => {
  const gate = new LiveFaceTextureGate({ settleMs: 0 });
  assert.equal(gate.update({ ...face(), headPose: { yaw: 30 } }, 0), false);
  assert.equal(gate.update(face(0.5, 0.5, 1), 1), false);
  assert.equal(gate.update({ detected: true, landmarks: [{ x: NaN, y: 0 }] }, 2), false);
  assert.equal(gate.update(face(), 3), true);
  assert.equal(gate.update(null, 4), false);
});
test('repeated frames cannot acquire live and a larger configured size is respected', () => {
  const gate = new LiveFaceTextureGate({ settleMs: 0 });
  assert.equal(gate.update({ ...face(), isNewFrame: false }, 0), false);
  assert.equal(gate.update(face(), 1, 0.6), false);
  assert.equal(gate.update(face(0.5, 0.5, 0.65), 2, 0.6), true);
});

test('calibration accepts the real viewing distance and a tilted camera', () => {
  const tracking = { ...face(0.58, 0.62, 0.36), headPose: { pitch: 35, yaw: 0, roll: 0 } };
  const gate = new LiveFaceTextureGate();
  assert.equal(gate.update(tracking, 0), false);
  const percent = gate.calibrate(tracking);
  assert.ok(percent < 36);
  assert.equal(gate.update(tracking, 100, percent / 100), false);
  assert.equal(gate.update(tracking, 550, percent / 100), true);
  assert.equal(gate.reason, 'live');
});

test('calibration survives JSON storage and reports the actual blocking condition', () => {
  const original = new LiveFaceTextureGate();
  const percent = original.calibrate(face(0.63, 0.6, 0.38));
  const restored = new LiveFaceTextureGate({ settleMs: 0 });
  restored.setCalibration(JSON.parse(JSON.stringify(original.calibration)));
  assert.equal(restored.update(face(0.63, 0.6, 0.38), 0, percent / 100), true);
  restored.update(face(0.63, 0.6, 0.2), 1000, percent / 100);
  assert.equal(restored.reason, 'live'); // The exit grace period is still active.
  restored.update(face(0.63, 0.6, 0.2), 1120, percent / 100);
  assert.equal(restored.reason, 'distance');
});

test('invalid or clipped calibration cannot overwrite the saved position', () => {
  const gate = new LiveFaceTextureGate();
  const previous = { ...gate.calibration };
  assert.throws(() => gate.calibrate(null));
  assert.throws(() => gate.calibrate(face(0.5, 0.5, 1)), /visage entier/);
  assert.throws(() => gate.setCalibration({ ...previous, cx: NaN }));
  assert.deepEqual(gate.calibration, previous);
});
