import test from 'node:test';
import assert from 'node:assert/strict';
import { PortraitBlend } from './portraitBlend.js';

test('fade reaches both endpoints gradually and eases at the start and end', () => {
  const blend = new PortraitBlend(1000);
  assert.equal(blend.update(true, 0), 0);
  assert.ok(blend.update(true, 100) < 0.01);
  assert.equal(blend.update(true, 500), 0.5);
  assert.ok(blend.update(true, 900) > 0.99);
  assert.equal(blend.update(true, 1000), 1);
  assert.equal(blend.update(false, 1000), 1);
  assert.equal(blend.update(false, 2000), 0);
});

test('reversing an unfinished fade keeps its current value without a jump', () => {
  const blend = new PortraitBlend(1000);
  blend.update(true, 0);
  const midway = blend.update(true, 400);
  assert.equal(blend.update(false, 400), midway);
  assert.ok(blend.update(false, 800) < midway);
  assert.equal(blend.update(false, 1400), 0);
});
