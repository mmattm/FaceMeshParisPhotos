import test from 'node:test';
import assert from 'node:assert/strict';
import { LiveFaceTextureGate } from './liveFaceTextureGate.js';
const face = (x = 0.5, y = 0.5, span = 0.2) => ({ detected: true,
  landmarks: [{ x: x - span / 2, y: y - span / 2 }, { x: x + span / 2, y: y + span / 2 }] });

test('a complete off-center face keeps the live portrait without switching presentation', () => {
  const gate = new LiveFaceTextureGate();
  assert.equal(gate.update(face(0.7), 0), false);
  assert.equal(gate.update(face(), 10), false);
  assert.equal(gate.update(face(), 299), false);
  assert.equal(gate.update(face(), 300), true);
  assert.equal(gate.update(face(0.60), 320), true);
  assert.equal(gate.update(face(0.7), 330), true);
  assert.equal(gate.update(face(0.8), 340), true);
});

test('tracking loss, clipping and small faces keep the fallback texture', () => {
  const gate = new LiveFaceTextureGate({ settleMs: 0 });
  assert.equal(gate.update(face(), 0), true);
  assert.equal(gate.update(null, 1), false);
  assert.equal(gate.update(face(0.5, 0.5, 1), 2), false);
  assert.equal(gate.update(face(0.5, 0.5, 0.08), 3), false);
  assert.equal(gate.update({ ...face(), isNewFrame: false }, 1000), false);
});

test('brief clipping is tolerated but sustained clipping falls back and requires reacquisition', () => {
  const gate = new LiveFaceTextureGate();
  gate.update(face(), 0);
  assert.equal(gate.update(face(), 300), true);
  assert.equal(gate.update(face(0.95), 400), true);
  assert.equal(gate.update(face(), 600), true);
  assert.equal(gate.update(face(0.95), 700), true);
  assert.equal(gate.update(face(0.95), 1050), false);
  assert.equal(gate.update(face(0.7), 1100), false);
  assert.equal(gate.update(face(0.7), 1400), true);
});
