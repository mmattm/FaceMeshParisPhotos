import test from 'node:test';
import assert from 'node:assert/strict';
import { VisitorIdentity } from './visitorIdentity.js';
import { VisitorDetector } from './visitorDetector.js';

const frame = { detected: true, isNewFrame: true };
function setup() {
  let sample = [0, 0];
  const events = [], statuses = [];
  let now = 0;
  const gate = new VisitorIdentity({ describe: async () => sample,
    onNewVisitor: detail => events.push(detail), onStatus: s => statuses.push(s), intervalMs: 0 });
  const collect = async (value, count = 3) => {
    sample = value;
    for (let i = 0; i < count; i++) await gate.observe(frame, {}, now++);
  };
  return { gate, events, statuses, collect };
}

test('initial visitor needs three samples; a returning visitor preserves the session', async () => {
  const { gate, events, statuses, collect } = setup();
  gate.request({ reason: 'INITIAL_VISITOR' });
  await collect([0, 0], 2);
  assert.equal(events.length, 0);
  await collect([0, 0], 1);
  assert.equal(events.length, 1);
  gate.request({ reason: 'RETURN_AFTER_ABSENCE' });
  await collect([0.1, 0.1]);
  assert.equal(events.length, 1);
  assert.equal(statuses.at(-1), 'same');
});

test('a confirmed different visitor replaces only the previous reference', async () => {
  const { gate, events, collect } = setup();
  gate.request({}); await collect([0, 0]);
  gate.request({}); await collect([1, 0]);
  assert.equal(events.length, 2);
  gate.request({}); await collect([1.1, 0]);
  assert.equal(events.length, 2);
  gate.request({}); await collect([0, 0]);
  assert.equal(events.length, 3);
});

test('ambiguous similarity never triggers a new visit', async () => {
  const { gate, events, statuses, collect } = setup();
  gate.request({}); await collect([0, 0]);
  gate.request({}); await collect([0.56, 0], 8);
  assert.equal(events.length, 1);
  assert.equal(statuses.at(-1), 'uncertain');
});

test('inconsistent faces cannot confirm an arrival', async () => {
  const { gate, events, collect } = setup();
  gate.request({});
  for (const value of [[0, 0], [1, 0], [0, 0], [1, 0]]) await collect(value, 1);
  assert.equal(events.length, 0);
});

test('departure invalidates an asynchronous inference', async () => {
  let resolve;
  const events = [];
  const gate = new VisitorIdentity({ describe: () => new Promise(r => { resolve = r; }),
    onNewVisitor: d => events.push(d), confirmations: 1, intervalMs: 0 });
  gate.request({});
  const inference = gate.observe(frame, {}, 0);
  await gate.observe(null, {}, 1);
  resolve([0, 0]); await inference;
  assert.equal(events.length, 0);
  assert.equal(gate.reference, null);
});

test('replaced request and disabled mode ignore late inference results', async () => {
  let resolve;
  const events = [];
  const gate = new VisitorIdentity({ describe: () => new Promise(r => { resolve = r; }),
    onNewVisitor: d => events.push(d), confirmations: 1 });
  gate.request({ reason: 'old' });
  const inference = gate.observe(frame, {}, 0);
  gate.request({ reason: 'new' });
  gate.setEnabled(false);
  resolve([0, 0]); await inference;
  assert.deepEqual(events, [{ reason: 'new' }]);
  gate.request({ reason: 'temporal' });
  assert.equal(events.at(-1).reason, 'temporal');
});

test('failed recognition does not emit a visitor or change its reference', async () => {
  const { gate, events, statuses, collect } = setup();
  gate.request({}); await collect([0, 0]);
  const reference = gate.reference;
  gate.describe = async () => { throw new Error('model unavailable'); };
  gate.request({}); await gate.observe(frame, {}, 0);
  assert.equal(events.length, 1);
  assert.equal(gate.reference, reference);
  assert.equal(statuses.at(-1), 'error');
});

test('absence detector plus identity gate emits only for first and different arrivals', async () => {
  const { gate, events, collect } = setup();
  const detector = new VisitorDetector({ absenceMs: 1000 });
  detector.addEventListener('new-visitor', e => gate.request(e.detail));
  const tracking = { ...frame, landmarks: [{ x: 0.5, y: 0.5 }] };
  detector.update(tracking, 0);
  await collect([0, 0]);
  detector.update(null, 100);
  detector.update(tracking, 1200);
  await collect([0.1, 0]);
  assert.equal(events.length, 1);
  detector.update(null, 1300);
  detector.update(tracking, 2400);
  await collect([1, 0]);
  assert.equal(events.length, 2);
  assert.equal(events[1].reason, 'RETURN_AFTER_ABSENCE');
});
