import test from 'node:test';
import assert from 'node:assert/strict';
import { VisitorIdentity } from './visitorIdentity.js';
import { VisitorDetector } from './visitorDetector.js';

const frame = { detected: true, isNewFrame: true };

test('one minute of absence forgets identity without emitting until a face returns', async () => {
  const events = [];
  const gate = new VisitorIdentity({ describe: async () => [0, 0],
    onNewVisitor: detail => events.push(detail) });
  gate.reference = [[0, 0]];
  await gate.observe(null, {}, 1000);
  await gate.observe(null, {}, 60999);
  assert.deepEqual(gate.reference, [[0, 0]]);
  await gate.observe(null, {}, 61000);
  assert.equal(gate.reference, null);
  assert.equal(events.length, 0);
  for (let now = 62000; now <= 64000; now += 400) await gate.observe(frame, {}, now);
  assert.equal(events.length, 1);
});

test('reset is checked on return, can be disabled and never expires continuous presence', async () => {
  const gate = new VisitorIdentity({ describe: async () => [0, 0], onNewVisitor: () => {} });
  gate.reference = [[0, 0]];
  await gate.observe(frame, {}, 0);
  await gate.observe(frame, {}, 70000);
  assert.deepEqual(gate.reference, [[0, 0]]);
  gate.setAbsenceResetMs(0);
  await gate.observe(null, {}, 71000);
  await gate.observe(frame, {}, 150000);
  assert.deepEqual(gate.reference, [[0, 0]]);
  gate.setAbsenceResetMs(60000);
  await gate.observe(null, {}, 151000);
  await gate.observe(frame, {}, 211000);
  assert.equal(gate.reference, null);
  assert.equal(gate.pending.samples.length, 1);
});

test('briefly held tracking does not compare stale webcam landmarks', async () => {
  let calls = 0;
  const gate = new VisitorIdentity({ describe: async () => { calls++; return [0, 0]; },
    onNewVisitor: () => {} });
  await gate.observe(frame, {}, 0);
  const pending = gate.pending;
  await gate.observe({ ...frame, trackingHeld: true }, {}, 400);
  assert.equal(calls, 1);
  assert.equal(gate.pending, pending);
  assert.equal(pending.samples.length, 1);
});

test('ambiguous mixed votes resolve as new visitor after eight seconds of usable images', async () => {
  const events = [];
  let descriptor;
  const gate = new VisitorIdentity({ describe: async () => descriptor,
    onNewVisitor: detail => events.push(detail) });
  gate.reference = [[0, 0]];
  for (let now = 0; now <= 8000; now += 400) {
    descriptor = [(now / 400) % 2 ? 0.49 : 0.56, 0];
    await gate.observe(frame, {}, now);
    if (now < 8000) assert.equal(events.length, 0);
  }
  assert.equal(events.length, 1);
  assert.equal(events[0].identityUncertain, true);
});

test('unusable images and rejected distance show their cause without declaring a visitor', async () => {
  const statuses = [], events = [];
  const gate = new VisitorIdentity({ describe: async () => null,
    onNewVisitor: detail => events.push(detail), onStatus: status => statuses.push(status) });
  await gate.observe({ detected: false, tooFar: true }, {}, 0);
  assert.equal(statuses.at(-1), 'tooFar');
  await gate.observe({ detected: false, proximityPending: true }, {}, 100);
  assert.equal(statuses.at(-1), 'stabilizing');
  for (let now = 400; now < 10000; now += 400) await gate.observe(frame, {}, now);
  assert.equal(statuses.at(-1), 'position');
  assert.equal(events.length, 0);
  await gate.observe(null, {}, 11000);
  assert.equal(statuses.at(-1), 'waiting');
});

test('new visitor requires two seconds; uncertainty requires four seconds', async () => {
  const events = [];
  let descriptor = [0, 0];
  const gate = new VisitorIdentity({ describe: async () => descriptor,
    onNewVisitor: detail => events.push(detail) });
  for (const now of [0, 400, 800, 1200, 1600]) await gate.observe(frame, {}, now);
  assert.equal(events.length, 0);
  await gate.observe(frame, {}, 2000);
  assert.equal(events.length, 1);
  descriptor = [0.56, 0];
  for (let now = 4000; now < 8000; now += 400) await gate.observe(frame, {}, now);
  assert.equal(events.length, 1);
  await gate.observe(frame, {}, 8000);
  assert.equal(events.length, 2);
});

test('same face result cancels a pending new-visitor confirmation', async () => {
  const events = [];
  let descriptor = [1, 0];
  const gate = new VisitorIdentity({ describe: async () => descriptor,
    onNewVisitor: detail => events.push(detail) });
  gate.reference = [[0, 0]];
  for (const now of [0, 400, 800, 1200]) await gate.observe(frame, {}, now);
  descriptor = [0, 0];
  await gate.observe(frame, {}, 1600);
  descriptor = [1, 0];
  for (const now of [2000, 2400, 2800, 3200, 3600]) await gate.observe(frame, {}, now);
  assert.equal(events.length, 0);
  await gate.observe(frame, {}, 4000);
  assert.equal(events.length, 1);
});

function setup() {
  let sample = [0, 0];
  const events = [], statuses = [], sameVisitors = [];
  let now = 0;
  const gate = new VisitorIdentity({ describe: async () => sample,
    onNewVisitor: detail => events.push(detail), onStatus: s => statuses.push(s),
    onSameVisitor: distance => sameVisitors.push(distance), intervalMs: 0,
    newVisitorMs: 0, uncertainVisitorMs: 0 });
  const collect = async (value, count = 3) => {
    sample = value;
    for (let i = 0; i < count; i++) await gate.observe(frame, {}, now++);
  };
  return { gate, events, statuses, sameVisitors, collect };
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

test('ambiguous similarity triggers a new visit after three consistent samples', async () => {
  const { gate, events, statuses, collect } = setup();
  gate.request({}); await collect([0, 0]);
  gate.request({}); await collect([0.56, 0], 2);
  assert.equal(events.length, 1);
  await collect([0.56, 0], 1);
  assert.equal(events.length, 2);
  assert.equal(events[1].identityUncertain, true);
  assert.equal(statuses.at(-1), 'new');
  gate.nextSampleAt = 0;
  await collect([0.56, 0], 3);
  assert.equal(events.length, 2);
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
  assert.deepEqual(events, []);
  gate.request({ reason: 'temporal' });
  assert.equal(events.at(-1).reason, 'temporal');
});

test('different face triggers without any absence event', async () => {
  const { gate, events, collect } = setup();
  // No call to request() and no absence detector: observation starts recognition.
  await collect([0, 0]);
  assert.equal(events.length, 1);
  gate.nextSampleAt = 0;
  await collect([1, 0]);
  assert.equal(events.length, 2);
  assert.equal(events[1].reason, 'IDENTITY_CHECK');
});

test('same visitor returning gets one notification, continuous presence does not spam', async () => {
  const { gate, events, sameVisitors, collect } = setup();
  await collect([0, 0]);
  gate.nextSampleAt = 0;
  await collect([0.1, 0]);
  assert.equal(sameVisitors.length, 1);
  gate.nextSampleAt = 0;
  await collect([0.1, 0]);
  assert.equal(sameVisitors.length, 1);
  await gate.observe(null, {}, 10);
  await gate.observe(null, {}, 600);
  gate.nextSampleAt = 0;
  await collect([0.1, 0]);
  assert.equal(sameVisitors.length, 2);
  gate.nextSampleAt = 0;
  await collect([0.1, 0]);
  assert.equal(sameVisitors.length, 2);
  assert.equal(events.length, 1);
});

test('continuous identity checks wait between confirmed comparisons', async () => {
  const { gate, collect } = setup();
  await collect([0, 0]);
  let inferences = 0;
  gate.describe = async () => { inferences++; return [0, 0]; };
  await gate.observe(frame, {}, 1000);
  assert.equal(inferences, 0);
  await gate.observe(frame, {}, 3000);
  assert.equal(inferences, 1);
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
