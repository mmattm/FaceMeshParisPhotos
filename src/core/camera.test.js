import test from 'node:test';
import assert from 'node:assert/strict';
import { CameraManager } from './camera.js';

function fixtures(t, getUserMedia) {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { mediaDevices: { getUserMedia } } });
  t.after(() => {
    if (original) Object.defineProperty(globalThis, 'navigator', original);
    else delete globalThis.navigator;
  });
  const video = { readyState: 2, currentTime: 0, srcObject: null, paused: false, play: async () => {} };
  return { video, camera: new CameraManager(video) };
}

function stream() {
  const track = { readyState: 'live', muted: false, stop() { this.readyState = 'ended'; } };
  return { getTracks: () => [track], getVideoTracks: () => [track], track };
}

test('frozen video is reopened and the old camera track is stopped', async t => {
  const streams = [stream(), stream()];
  let calls = 0;
  const { camera, video } = fixtures(t, async () => streams[calls++]);
  await camera.start();
  camera.checkHealth(10000);
  camera.checkHealth(17999);
  assert.equal(calls, 1);
  camera.checkHealth(18000);
  await camera.opening;
  assert.equal(calls, 2);
  assert.equal(streams[0].track.readyState, 'ended');
  assert.equal(video.srcObject, streams[1]);
  assert.equal(camera.state, 'active');
});

test('permission denial is reported without repeated permission prompts', async t => {
  t.mock.method(console, 'error', () => {});
  let calls = 0;
  const { camera } = fixtures(t, async () => {
    calls++;
    throw Object.assign(new Error('denied'), { name: 'NotAllowedError' });
  });
  await assert.rejects(camera.start(), { name: 'NotAllowedError' });
  camera.checkHealth(10000);
  assert.equal(calls, 1);
  assert.equal(camera.state, 'permission');
});

test('an ended camera reconnects once even if health checks repeat while opening', async t => {
  const first = stream(), second = stream();
  let calls = 0, resolve;
  const { camera } = fixtures(t, () => {
    calls++;
    return calls === 1 ? Promise.resolve(first) : new Promise(done => { resolve = done; });
  });
  await camera.start();
  first.track.readyState = 'ended';
  camera.checkHealth(10000);
  camera.checkHealth(10001);
  await Promise.resolve();
  assert.equal(calls, 2);
  resolve(second);
  await camera.opening;
  assert.equal(camera.state, 'active');
});

test('explicit stop disables automatic recovery and releases the video source', async t => {
  const source = stream();
  let calls = 0;
  const { camera, video } = fixtures(t, async () => { calls++; return source; });
  await camera.start();
  camera.startWatchdog();
  camera.stop();
  camera.checkHealth(20000);
  assert.equal(camera.watchdog, null);
  assert.equal(camera.isStreaming, false);
  assert.equal(video.srcObject, null);
  assert.equal(source.track.readyState, 'ended');
  assert.equal(calls, 1);
});

test('a late camera stream after timeout is stopped instead of leaking the device', async t => {
  let resolve;
  const { camera } = fixtures(t, () => new Promise(done => { resolve = done; }));
  await assert.rejects(camera.requestStream({ audio: false, video: true }, 5), /ne répond pas/);
  const late = stream();
  resolve(late);
  await new Promise(setImmediate);
  assert.equal(late.track.readyState, 'ended');
});
