// Serialize replacement and submission per ComfyUI server. Never clear jobs
// belonging to another application; only IDs submitted through this coordinator.
export class ComfyLatestRequest {
  constructor(comfyFetch, wait = ms => new Promise(resolve => setTimeout(resolve, ms))) {
    this.fetch = comfyFetch;
    this.wait = wait;
    this.servers = new Map();
  }

  async cancelOwned(baseUrl, state) {
    if (!state.ids.size) return;
    const request = async (path, body) => {
      const response = await this.fetch(`${baseUrl}${path}`, body ? {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      } : {});
      if (!response.ok) throw new Error(`Annulation ComfyUI : HTTP ${response.status}`);
      return response;
    };
    // Delete pending IDs first, then inspect running jobs to cover a pending
    // job starting while the deletion request was in flight.
    await request('/queue', { delete: [...state.ids] });
    const interrupted = new Set();
    for (let attempt = 0; attempt < 100; attempt++) {
      const queue = await (await request('/queue')).json();
      const running = (queue.queue_running || []).filter(item => state.ids.has(item[1]));
      const pending = (queue.queue_pending || []).filter(item => state.ids.has(item[1]));
      if (!running.length && !pending.length) {
        state.ids.clear();
        return;
      }
      for (const item of running) {
        if (!interrupted.has(item[1])) {
          await request('/interrupt', { prompt_id: item[1] });
          interrupted.add(item[1]);
        }
      }
      if (pending.length) await request('/queue', { delete: pending.map(item => item[1]) });
      await this.wait(100);
    }
    throw new Error('Le rendu précédent ne s’arrête pas ; nouvelle demande non envoyée.');
  }

  replace(baseUrl, submit) {
    let state = this.servers.get(baseUrl);
    if (!state) {
      state = { revision: 0, tail: Promise.resolve(), ids: new Set() };
      this.servers.set(baseUrl, state);
    }
    const revision = ++state.revision;
    const current = () => revision === state.revision;
    const operation = state.tail.catch(() => {}).then(async () => {
      if (!current()) return { superseded: true };
      await this.cancelOwned(baseUrl, state);
      if (!current()) return { superseded: true };
      const result = await submit(current);
      if (result.promptId) state.ids.add(result.promptId);
      if (!current()) {
        await this.cancelOwned(baseUrl, state);
        return { superseded: true };
      }
      return result;
    });
    state.tail = operation;
    return operation;
  }
}
