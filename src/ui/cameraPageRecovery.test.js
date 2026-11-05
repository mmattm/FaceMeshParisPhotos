import test from 'node:test';
import assert from 'node:assert/strict';
import { CameraPageRecovery } from './cameraPageRecovery.js';

function fixture({ storage, canReload, getTrackingProgress } = {}) {
  const values = new Map();
  storage ??= { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const track = { readyState: 'live', muted: false };
  const camera = { state: 'active', video: { readyState: 2, paused: false, currentTime: 0 },
    stream: { getVideoTracks: () => [track] } };
  let reloads = 0;
  const recovery = new CameraPageRecovery({ camera, storage, canReload, getTrackingProgress, reload: () => { reloads++; } });
  return { camera, track, recovery, storage, reloads: () => reloads };
}

test('a healthy webcam never reloads, including when no visitor is present', () => {
  const { camera, recovery, reloads } = fixture();
  for (let now = 0; now <= 300000; now += 5000) {
    camera.video.currentTime = now / 1000;
    recovery.check(now);
  }
  assert.equal(reloads(), 0);
  assert.equal(recovery.message, '');
});

test('successful tracking analyses without a detected visitor never reload', () => {
  let analyses = 0;
  const { camera, recovery, reloads } = fixture({ getTrackingProgress: () => analyses });
  for (let now = 0; now <= 300000; now += 5000) {
    camera.video.currentTime = now / 1000;
    analyses++;
    recovery.check(now);
  }
  assert.equal(reloads(), 0);
  assert.equal(recovery.message, '');
});

test('tracking stalled despite advancing camera frames reloads after 30 seconds', () => {
  const { camera, recovery, reloads } = fixture({ getTrackingProgress: () => 10 });
  for (let now = 0; now < 30000; now += 5000) {
    camera.video.currentTime = now / 1000;
    recovery.check(now);
  }
  assert.equal(reloads(), 0);
  camera.video.currentTime = 30;
  recovery.check(30000);
  assert.equal(reloads(), 1);
});

test('tracking recovery before the deadline cancels reload', () => {
  let analyses = 10;
  const { camera, recovery, reloads } = fixture({ getTrackingProgress: () => analyses });
  recovery.check(0);
  camera.video.currentTime = 25;
  recovery.check(25000);
  for (let now = 30000; now <= 90000; now += 5000) {
    analyses++;
    camera.video.currentTime = now / 1000;
    recovery.check(now);
  }
  assert.equal(reloads(), 0);
});

test('an ended stream reloads after 30 seconds, once per page', () => {
  const { track, recovery, reloads } = fixture();
  track.readyState = 'ended';
  recovery.check(0);
  recovery.check(29999);
  assert.equal(reloads(), 0);
  recovery.check(30000);
  recovery.check(60000);
  assert.equal(reloads(), 1);
});

test('reopening frozen streams does not reset the outage clock', () => {
  const { camera, recovery, reloads } = fixture();
  for (let now = 0; now <= 30000; now += 5000) {
    camera.stream = { getVideoTracks: () => [{ readyState: 'live', muted: false }] };
    camera.video.currentTime = 0;
    recovery.check(now);
  }
  assert.equal(reloads(), 1);
});

test('returning video frames cancel the reload and reset the outage duration', () => {
  const { camera, recovery, reloads } = fixture();
  recovery.check(0);
  recovery.check(25000);
  camera.video.currentTime = 1;
  recovery.check(29000);
  recovery.check(30000);
  recovery.check(59999);
  assert.equal(reloads(), 0);
  recovery.check(60000);
  assert.equal(reloads(), 1);
});

test('the cooldown survives navigation and prevents reload loops', () => {
  const first = fixture();
  first.track.readyState = 'ended';
  first.recovery.check(100000);
  first.recovery.check(130000);
  assert.equal(first.reloads(), 1);
  const second = fixture({ storage: first.storage });
  second.track.readyState = 'ended';
  second.recovery.check(131000);
  second.recovery.check(161000);
  assert.equal(second.reloads(), 0);
  second.recovery.check(250000);
  assert.equal(second.reloads(), 1);
});

test('permission denial and an intentional stop never trigger a reload', () => {
  for (const state of ['permission', 'stopped']) {
    const { camera, recovery, reloads } = fixture();
    camera.state = state;
    recovery.check(0);
    recovery.check(300000);
    assert.equal(reloads(), 0);
  }
});

test('reloading waits for the active generation to finish', () => {
  let rendering = true;
  const { track, recovery, reloads } = fixture({ canReload: () => !rendering });
  track.readyState = 'ended';
  recovery.check(0);
  recovery.check(30000);
  assert.equal(reloads(), 0);
  rendering = false;
  recovery.check(35000);
  assert.equal(reloads(), 1);
});

test('failed storage keeps camera reconnection running without a reload loop', () => {
  const { track, recovery, reloads } = fixture({ storage: {
    getItem: () => null, setItem: () => { throw Error('storage blocked'); }
  } });
  track.readyState = 'ended';
  recovery.check(0);
  recovery.check(30000);
  recovery.check(60000);
  assert.equal(reloads(), 0);
});
