import test from 'node:test';
import assert from 'node:assert/strict';
import { VisitorIdentity } from './visitorIdentity.js';
const frame = { detected: true, isNewFrame: true };
function setup() {
  let value = 0;
  const events = [], same = [], references = [], statuses = [];
  const portrait = { value: 0 };
  let first = true;
  const gate = new VisitorIdentity({ capture: () => {
    if (first) { first = false; portrait.value = value; return portrait; }
    return { value };
  }, describe: async image => [image.value, 0],
    onNewVisitor: d => events.push(d), onSameVisitor: d => same.push(d),
    onReference: p => references.push(p), onStatus: s => statuses.push(s) });
  const observe = (v, now) => { value = v; return gate.observe(frame, {}, now); };
  return { gate, events, same, references, statuses, portrait, observe };
}
test('first usable portrait triggers immediately and is retained', async () => {
  const { gate, events, portrait, observe } = setup();
  await observe(0, 0);
  assert.equal(events.length, 1);
  assert.equal(gate.reference.portrait, portrait);
  assert.equal(gate.reference.descriptor, null);
});
test('same face keeps the original reference; different face triggers in one comparison', async () => {
  const { gate, events, observe } = setup();
  await observe(0, 0);
  const reference = gate.reference;
  gate.request({ reason: 'RETURN_AFTER_ABSENCE' });
  await observe(0.1, 400);
  assert.equal(gate.reference, reference);
  assert.equal(events.length, 1);
  gate.request({ reason: 'RETURN_AFTER_ABSENCE' });
  await observe(0.6, 800);
  assert.equal(events.length, 2);
  assert.equal(events[1].identityDistance, 0.6);
  assert.deepEqual(gate.reference.descriptor, [0.6, 0]);
});
test('one threshold decides without an uncertainty delay', async () => {
  const { gate, events, observe } = setup();
  await observe(0, 0);
  gate.setSameThreshold(0.35);
  await observe(0.36, 1);
  assert.equal(events.length, 2);
});
test('returning same visitor preserves session before timeout and resets after one minute', async () => {
  const { gate, events, observe } = setup();
  await observe(0, 0);
  await gate.observe(null, {}, 100);
  await observe(0, 1000);
  assert.equal(events.length, 1);
  await gate.observe(null, {}, 1100);
  await gate.observe(null, {}, 61100);
  assert.equal(gate.reference, null);
  assert.equal(events.length, 1);
  await observe(0, 61200);
  assert.equal(events.length, 2);
});
test('zero disables absence reset', async () => {
  const { gate, events, observe } = setup();
  gate.setAbsenceResetMs(0);
  await observe(0, 0);
  await gate.observe(null, {}, 100);
  await observe(0, 100000);
  assert.equal(events.length, 1);
});

test('absence clock expires during rendering and return triggers after rendering ends', async () => {
  const { gate, events, observe } = setup();
  await observe(0, 0);
  await gate.observe(null, {}, 1000, { paused: true });
  await gate.observe(null, {}, 61000, { paused: true });
  assert.equal(gate.reference, null);
  assert.equal(events.length, 1);
  await gate.observe(frame, {}, 62000, { paused: true });
  assert.equal(events.length, 1);
  await observe(0, 63000);
  assert.equal(events.length, 2);
  assert.equal(events[1].reason, 'RETURN_AFTER_RESET');
});

test('return at timeout resets even without an observation at the expiry instant', async () => {
  const { gate, events, observe } = setup();
  await observe(0, 0);
  await gate.observe(null, {}, 1000, { paused: true });
  await observe(0, 61000);
  assert.equal(events.length, 2);
  assert.equal(events[1].reason, 'RETURN_AFTER_RESET');
});
test('held and repeated frames cannot start a visit; continuous presence stays locked', async () => {
  const { gate, events, observe } = setup();
  await gate.observe({ ...frame, trackingHeld: true }, {}, 0);
  await gate.observe({ ...frame, isNewFrame: false }, {}, 0);
  assert.equal(events.length, 0);
  await observe(0, 0);
  await observe(1, 100);
  assert.equal(events.length, 1);
  await observe(1, 400);
  assert.equal(events.length, 1);
});
test('unusable image or failed inference cannot replace the saved portrait', async () => {
  const { gate, events, observe, statuses } = setup();
  await observe(0, 0);
  const reference = gate.reference;
  gate.capture = () => null;
  gate.request({ reason: 'RETURN_AFTER_ABSENCE' });
  await observe(1, 400);
  assert.equal(statuses.at(-1), 'position');
  gate.capture = () => ({});
  gate.describe = async () => { throw Error('unavailable'); };
  await observe(1, 800);
  assert.equal(statuses.at(-1), 'error');
  assert.equal(gate.reference, reference);
  assert.equal(events.length, 1);
});
test('departure, reset and disabling invalidate in-flight comparisons', async () => {
  for (const action of ['departure', 'reset', 'disable']) {
    let resolve;
    const events = [];
    const gate = new VisitorIdentity({ capture: () => ({}), describe: () => new Promise(r => { resolve = r; }),
      onNewVisitor: d => events.push(d) });
    await gate.observe(frame, {}, 0);
    gate.request({ reason: 'RETURN_AFTER_ABSENCE' });
    const pending = gate.observe(frame, {}, 400);
    await Promise.resolve();
    if (action === 'departure') await gate.observe(null, {}, 1);
    else if (action === 'reset') gate.reset();
    else gate.setEnabled(false);
    resolve([0, 0]);
    await pending;
    assert.equal(events.length, 1);
    if (action === 'reset') assert.equal(gate.reference, null);
  }
});
test('manual reference capture stores portrait without changing its request reason', async () => {
  const { gate, events, observe } = setup();
  gate.request({ reason: 'MANUAL_REFERENCE' });
  await observe(0, 0);
  assert.equal(events[0].reason, 'MANUAL_REFERENCE');
});

test('first arrival does not wait for the recognition model and does not fire twice', async () => {
  const events = [];
  let descriptions = 0;
  const gate = new VisitorIdentity({ capture: () => ({}), describe: async () => {
    descriptions++;
    return [0, 0];
  }, onNewVisitor: event => events.push(event) });
  await gate.observe(frame, {}, 0);
  assert.equal(events.length, 1);
  assert.equal(descriptions, 0);
  await gate.observe(frame, {}, 400);
  assert.equal(events.length, 1);
  assert.equal(descriptions, 0);
});

test('stalled recognition is released and a later comparison can recover', async () => {
  const events = [], statuses = [];
  const gate = new VisitorIdentity({ capture: () => ({}), describe: () => new Promise(() => {}),
    inferenceTimeoutMs: 10, onNewVisitor: event => events.push(event), onStatus: status => statuses.push(status) });
  await gate.observe(frame, {}, 0);
  gate.request({ reason: 'RETURN_AFTER_ABSENCE' });
  await gate.observe(frame, {}, 400);
  assert.equal(statuses.at(-1), 'error');
  assert.equal(gate.busy, false);
  assert.equal(events.length, 1);
  gate.describe = async () => [0, 0];
  await gate.observe(frame, {}, 6000);
  assert.equal(statuses.at(-1), 'same');
});

test('reset allows the next first arrival even while an old comparison is finishing', async () => {
  const events = [];
  let resolve;
  const gate = new VisitorIdentity({ capture: () => ({}),
    describe: () => new Promise(done => { resolve = done; }), onNewVisitor: event => events.push(event) });
  await gate.observe(frame, {}, 0);
  gate.request({ reason: 'RETURN_AFTER_ABSENCE' });
  const comparison = gate.observe(frame, {}, 400);
  await Promise.resolve();
  gate.reset();
  await gate.observe(frame, {}, 401);
  assert.equal(events.length, 2);
  resolve([0, 0]);
  await comparison;
  assert.equal(events.length, 2);
});

test('gestures and portrait changes cannot repeatedly trigger while the visitor stays present', async () => {
  const { gate, events, observe } = setup();
  await observe(0, 0);
  const reference = gate.reference;
  gate.describe = async () => { throw Error('Continuous presence must not be compared'); };
  for (let now = 400; now <= 10000; now += 400) await observe(now % 800 ? 1 : 0, now);
  assert.equal(events.length, 1);
  assert.equal(gate.reference, reference);
  assert.equal(gate.status, 'active');
});

test('brief tracking loss keeps the visit; a genuine departure rearms one comparison', async () => {
  const { gate, events, observe } = setup();
  await observe(0, 0);
  await gate.observe(null, {}, 100);
  await observe(1, 500);
  assert.equal(events.length, 1);
  await gate.observe(null, {}, 1000);
  await observe(1, 2000);
  assert.equal(events.length, 2);
  assert.equal(events[1].reason, 'RETURN_AFTER_ABSENCE');
  await observe(0, 2400);
  assert.equal(events.length, 2);
});

test('a matching visitor returning after a genuine absence keeps the original session', async () => {
  const { gate, events, observe, same } = setup();
  await observe(0, 0);
  await gate.observe(null, {}, 100);
  await observe(0.1, 1100);
  assert.equal(events.length, 1);
  assert.equal(same.length, 1);
  assert.equal(gate.arrivalPending, false);
});

test('finishing a generation does not immediately classify the current visitor again', async () => {
  const { gate, events, observe } = setup();
  await observe(0, 0);
  await gate.observe(frame, {}, 400, { paused: true });
  assert.equal(gate.status, 'paused');
  await observe(1, 5000);
  assert.equal(events.length, 1);
  assert.equal(gate.status, 'active');
});

