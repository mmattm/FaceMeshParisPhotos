const defaults = () => ({ x: 0, y: 0, pitch: 0, yaw: 0, roll: 0, zoom: 1, maxYaw: 42, maxPitch: 8, eyeOpening: 100 });
const limits = [['x', -300, 300], ['y', -300, 300], ['pitch', -45, 45],
  ['yaw', -45, 45], ['roll', -30, 30], ['zoom', 0.5, 1.8], ['maxYaw', 0, 90], ['maxPitch', 0, 45], ['eyeOpening', 0, 120]];

export const ALIGNMENT_PROFILE_LABELS = {
  live: 'Live', autonomous_bust: 'Buste · Live / Fallback', minimalist: 'Minimaliste'
};

export class CameraAlignmentProfiles {
  constructor(renderer, storage, projectSettings = null) {
    this.renderer = renderer;
    this.storage = storage;
    this.projectStorageAvailable = projectSettings !== null;
    this.active = null;
    this.profiles = {};
    for (const mode of Object.keys(ALIGNMENT_PROFILE_LABELS)) {
      const values = defaults();
      let saved = null;
      try {
        const raw = projectSettings?.[mode] ? JSON.stringify(projectSettings[mode])
          : storage.getItem(this.key(mode)) ?? storage.getItem('facemesh_camera_offset');
        const stored = JSON.parse(raw);
        if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
          let valid = false;
          for (const [key, min, max] of limits) {
            if (Number.isFinite(stored[key])) {
              values[key] = Math.max(min, Math.min(max, stored[key]));
              valid = true;
            }
          }
          if (valid) saved = { ...values };
        }
      } catch { /* Keep neutral values if browser storage is unavailable. */ }
      this.profiles[mode] = { values, saved };
    }
  }

  key(mode = this.active) { return `facemesh_camera_offset_v2_${mode}`; }

  activate(mode) {
    if (mode === this.active) return false;
    if (!this.profiles[mode]) throw new Error('Profil Align 3D inconnu');
    if (this.active) this.profiles[this.active].values = this.renderer.getCameraOffset();
    this.active = mode;
    this.renderer.setCameraOffset(this.profiles[mode].values);
    return true;
  }

  get saved() { return this.profiles[this.active]?.saved; }

  async save() {
    const values = this.renderer.getCameraOffset();
    const mode = this.active;
    if (this.projectStorageAvailable) {
      const response = await fetch('/api/camera-alignment', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, values }), signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) throw new Error('Sauvegarde projet impossible');
    }
    try { this.storage.setItem(this.key(mode), JSON.stringify(values)); }
    catch (error) { if (!this.projectStorageAvailable) throw error; }
    this.profiles[mode] = { values: { ...values }, saved: { ...values } };
  }
}
