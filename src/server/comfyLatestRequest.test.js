import test from 'node:test';
import assert from 'node:assert/strict';
import { ComfyLatestRequest } from './comfyLatestRequest.js';

function harness() {
  const jobs = { running: [], pending: [] };
  const calls = [];
  const fetch = async (url, options = {}) => {
    const path = new URL(url).pathname;
    const body = options.body ? JSON.parse(options.body) : null;
    calls.push({ path, body });
    if (path === '/queue' && body) jobs.pending = jobs.pending.filter(id => !body.delete.includes(id));
    if (path === '/interrupt') jobs.running = jobs.running.filter(id => id !== body.prompt_id);
    return { ok: true, json: async () => ({
      queue_running: jobs.running.map(id => [0, id]),
      queue_pending: jobs.pending.map(id => [0, id])
    }) };
  };
  return { jobs, calls, coordinator: new ComfyLatestRequest(fetch, async () => {}) };
}

test('replacement interrupts owned rendering and leaves unrelated jobs alone', async () => {
  const { jobs, calls, coordinator } = harness();
  await coordinator.replace('http://comfy', async () => ({ promptId: 'old' }));
  jobs.running = ['old']; jobs.pending = ['unrelated'];
  await coordinator.replace('http://comfy', async () => {
    assert.deepEqual(jobs.running, []);
    assert.deepEqual(jobs.pending, ['unrelated']);
    return { promptId: 'new' };
  });
  assert.deepEqual(calls.find(call => call.path === '/interrupt').body, { prompt_id: 'old' });
});

test('pending owned job is removed without interrupting another application', async () => {
  const { jobs, calls, coordinator } = harness();
  await coordinator.replace('http://comfy', async () => ({ promptId: 'old' }));
  jobs.pending = ['old', 'other']; jobs.running = ['unrelated'];
  await coordinator.replace('http://comfy', async () => ({ promptId: 'new' }));
  assert.deepEqual(jobs.pending, ['other']);
  assert.deepEqual(jobs.running, ['unrelated']);
  assert.equal(calls.some(call => call.path === '/interrupt'), false);
});

test('rapid requests skip middle visitor and cancel a prompt accepted during replacement', async () => {
  const { jobs, coordinator } = harness();
  let release, started;
  const ready = new Promise(resolve => { started = resolve; });
  const wait = new Promise(resolve => { release = resolve; });
  const first = coordinator.replace('http://comfy', async () => {
    started(); await wait; jobs.running = ['first']; return { promptId: 'first' };
  });
  await ready;
  const middle = coordinator.replace('http://comfy', async () => { assert.fail('middle submitted'); });
  const last = coordinator.replace('http://comfy', async () => {
    assert.deepEqual(jobs.running, []); return { promptId: 'last' };
  });
  release();
  assert.deepEqual(await first, { superseded: true });
  assert.deepEqual(await middle, { superseded: true });
  assert.equal((await last).promptId, 'last');
});

test('failed cancellation blocks new submission and a later request can recover', async () => {
  const { coordinator } = harness();
  await coordinator.replace('http://comfy', async () => ({ promptId: 'old' }));
  const workingFetch = coordinator.fetch;
  coordinator.fetch = async () => ({ ok: false, status: 503 });
  await assert.rejects(coordinator.replace('http://comfy', async () => assert.fail('submitted')), /503/);
  coordinator.fetch = workingFetch;
  assert.equal((await coordinator.replace('http://comfy', async () => ({ promptId: 'new' }))).promptId, 'new');
});
