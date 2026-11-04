const defaults = () => ({ x: 0, y: 0, pitch: 0, yaw: 0, roll: 0, zoom: 1, maxYaw: 42, maxPitch: 8, eyeOpening: 100, audioMouthOpening: 100 });
const limits = [['x', -300, 300], ['y', -300, 300], ['pitch', -45, 45],
  ['yaw', -45, 45], ['roll', -30, 30], ['zoom', 0.5, 2.0], ['maxYaw', 0, 90], ['maxPitch', 0, 45], ['eyeOpening', 0, 120], ['audioMouthOpening', 0, 200]];

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
    const zoom = this.active ? this.renderer.getCameraOffset().zoom
      : this.profiles.autonomous_bust.values.zoom;
    for (const profile of Object.values(this.profiles)) profile.values.zoom = zoom;
    this.active = mode;
    this.renderer.setCameraOffset(this.profiles[mode].values);
    return true;
  }

  get saved() { return this.profiles[this.active]?.saved; }

  async save() {
    const values = this.renderer.getCameraOffset();
    const mode = this.active;
    for (const [profileMode, profile] of Object.entries(this.profiles)) {
      const persisted = profileMode === mode ? { ...values }
        : { ...(profile.saved || profile.values), zoom: values.zoom };
      profile.values.zoom = values.zoom;
    if (this.projectStorageAvailable) {
      const response = await fetch('/api/camera-alignment', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: profileMode, values: persisted }), signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) throw new Error('Sauvegarde projet impossible');
    }
    try { this.storage.setItem(this.key(profileMode), JSON.stringify(persisted)); }
    catch (error) { if (!this.projectStorageAvailable) throw error; }
      profile.saved = persisted;
      if (profileMode === mode) profile.values = { ...values };
    }
  }
}
