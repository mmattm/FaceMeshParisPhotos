const RELOAD_KEY = 'photomaton_camera_page_reload_at';

// Reconnect the camera first; reload only when no video frames recover for 30 s.
export class CameraPageRecovery {
  constructor({ camera, storage, reload, canReload = () => true, now = Date.now,
    outageMs = 30000, cooldownMs = 120000 }) {
    Object.assign(this, { camera, storage, reload, canReload, now, outageMs, cooldownMs });
    this.outageSince = null;
    this.lastStream = null;
    this.lastVideoTime = null;
    this.timer = null;
    this.reloading = false;
    this.message = '';
  }

  start() {
    this.stop();
    this.check();
    this.timer = setInterval(() => this.check(), 5000);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
  }

  check(now = this.now()) {
    if (this.reloading) return;
    const { camera } = this;
    if (camera.state === 'permission' || camera.state === 'stopped') {
      this.outageSince = null;
      this.lastStream = null;
      this.lastVideoTime = null;
      this.message = '';
      return;
    }

    const video = camera.video;
    const liveTrack = camera.stream?.getVideoTracks().some(track => track.readyState === 'live' && !track.muted);
    const ready = liveTrack && video.readyState >= 2 && !video.paused;
    // A new stream's timestamp alone is not proof it delivers frames.
    const progressing = ready && camera.stream === this.lastStream
      && Number.isFinite(this.lastVideoTime) && video.currentTime > this.lastVideoTime;
    this.lastStream = camera.stream;
    this.lastVideoTime = ready ? video.currentTime : null;
    if (progressing) {
      this.outageSince = null;
      this.message = '';
      return;
    }

    this.outageSince ??= now;
    const remaining = this.outageMs - (now - this.outageSince);
    if (remaining > 0) {
      this.message = `Contrôle du flux · rechargement de secours dans ${Math.ceil(remaining / 1000)} s`;
      return;
    }
    if (!this.canReload()) {
      this.message = 'Flux webcam perdu · rechargement après le rendu en cours';
      return;
    }

    // Persist the rate limit before navigation, so a disconnected camera cannot
    // cause a reload loop. If storage is unavailable, keep reconnecting instead.
    try {
      if (!this.storage) throw new Error('Session storage unavailable');
      const saved = this.storage.getItem(RELOAD_KEY);
      const lastReload = saved === null ? null : Number(saved);
      if (Number.isFinite(lastReload) && now - lastReload < this.cooldownMs) {
        this.message = `Reconnexion en cours · rechargement limité (${Math.ceil((this.cooldownMs - (now - lastReload)) / 1000)} s)`;
        return;
      }
      this.storage.setItem(RELOAD_KEY, String(now));
    } catch {
      this.message = 'Reconnexion en cours · rechargement automatique indisponible';
      return;
    }
    this.message = 'Flux webcam perdu · rechargement de la page…';
    this.reloading = true;
    try { this.reload(); }
    catch (error) {
      this.reloading = false;
      console.warn('Webcam page reload:', error);
    }
  }
}
