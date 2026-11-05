import test from 'node:test';
import assert from 'node:assert/strict';
import { StableRecognitionStatus } from './stableRecognitionStatus.js';

test('rapidly alternating waiting states do not flicker on screen', () => {
  const status = new StableRecognitionStatus();
  assert.equal(status.update('same', 0), 'same');
  for (let now = 100; now < 2000; now += 100) {
    assert.equal(status.update(now % 200 ? 'position' : 'tooFar', now), 'same');
  }
  status.update('waiting', 2000);
  assert.equal(status.update('waiting', 2600), 'waiting');
});

test('confirmed decisions, errors and manual disable remain immediate', () => {
  const status = new StableRecognitionStatus();
  status.update('checking', 0);
  assert.equal(status.update('new', 100), 'new');
  assert.equal(status.update('same', 200), 'same');
  assert.equal(status.update('error', 300), 'error');
  assert.equal(status.update('disabled', 400), 'disabled');
});
