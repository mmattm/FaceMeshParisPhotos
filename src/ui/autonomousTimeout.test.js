import test from 'node:test';
import assert from 'node:assert/strict';
import { AutonomousTimeout } from './autonomousTimeout.js';

test('manual force expires at the configured duration', () => {
  const timer = new AutonomousTimeout(10);
  assert.equal(timer.update(true, 500), false);
  assert.equal(timer.update(true, 10499), false);
  assert.equal(timer.update(true, 10500), true);
});

test('normal autonomous playback never starts the timeout', () => {
  const timer = new AutonomousTimeout(10);
  for (const now of [0, 10000, 600000]) assert.equal(timer.update(false, now), false);
});

test('leaving forced mode resets the next countdown', () => {
  const timer = new AutonomousTimeout(10);
  timer.update(true, 0);
  timer.update(false, 5000);
  assert.equal(timer.update(true, 20000), false);
  assert.equal(timer.update(true, 30000), true);
});

test('zero disables return and a setting change restarts the countdown', () => {
  const timer = new AutonomousTimeout(0);
  assert.equal(timer.update(true, 0), false);
  assert.equal(timer.update(true, 600000), false);
  timer.setSeconds(5);
  assert.equal(timer.update(true, 600000), false);
  assert.equal(timer.update(true, 605000), true);
  timer.setSeconds('invalid');
  assert.equal(timer.seconds, 60);
});
