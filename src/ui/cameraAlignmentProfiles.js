const defaults = () => ({ x: 0, y: 0, pitch: 0, yaw: 0, roll: 0, zoom: 1 });
const limits = [['x', -300, 300], ['y', -300, 300], ['pitch', -45, 45],
  ['yaw', -45, 45], ['roll', -30, 30], ['zoom', 0.5, 1.8]];

export const ALIGNMENT_PROFILE_LABELS = {
  live: 'Live', autonomous_bust: 'Autonome Buste', minimalist: 'Minimaliste'
};

export class CameraAlignmentProfiles {
  constructor(renderer, storage) {
    this.renderer = renderer;
    this.storage = storage;
    this.active = null;
    this.profiles = {};
    for (const mode of Object.keys(ALIGNMENT_PROFILE_LABELS)) {
      const values = defaults();
      let saved = null;
      try {
        const raw = storage.getItem(this.key(mode)) ?? storage.getItem('facemesh_camera_offset');
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

  save() {
    const values = this.renderer.getCameraOffset();
    this.storage.setItem(this.key(), JSON.stringify(values));
    this.profiles[this.active] = { values: { ...values }, saved: { ...values } };
  }
}
