const defaults = () => ({ x: 0, y: 0, pitch: 0, yaw: 0, roll: 0, zoom: 1, maxYaw: 42, maxPitch: 8, eyeOpening: 100, audioMouthOpening: 100, livePitchTrim: 0, autoPitchTrim: 0 });
const limits = [['x', -300, 300], ['y', -300, 300], ['pitch', -45, 45],
  ['yaw', -45, 45], ['roll', -30, 30], ['zoom', 0.5, 2.0], ['maxYaw', 0, 90], ['maxPitch', 0, 45], ['eyeOpening', 0, 120], ['audioMouthOpening', 0, 300], ['livePitchTrim', -10, 10], ['autoPitchTrim', -10, 10]];

export const ALIGNMENT_PROFILE_LABELS = {
  live_bust: 'Buste live', autonomous_bust: 'Buste autonome', minimalist: 'Minimaliste'
};

export class CameraAlignmentProfiles {
  constructor(renderer, storage, projectSettings = null) {
    this.renderer = renderer;
    this.storage = storage;
    this.projectStorageAvailable = projectSettings !== null;
    this.active = null;
    this.editing = null;
    this.profiles = {};
    for (const mode of Object.keys(ALIGNMENT_PROFILE_LABELS)) {
      const values = defaults();
      let saved = null;
      try {
        // Split the previous shared bust profile without resetting its composition.
        const projectValues = projectSettings?.[mode]
          ?? (mode === 'live_bust' ? projectSettings?.autonomous_bust : null);
        const raw = projectValues ? JSON.stringify(projectValues)
          : storage.getItem(this.key(mode))
            ?? (mode === 'live_bust' ? storage.getItem(this.key('autonomous_bust')) : null)
            ?? storage.getItem('facemesh_camera_offset');
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

  get editingMode() { return this.editing || this.active; }

  edit(mode = null) {
    if (mode && !this.profiles[mode]) throw new Error('Profil Align 3D inconnu');
    this.editing = mode;
  }

  getEditingOffset() {
    return this.editingMode === this.active ? this.renderer.getCameraOffset()
      : { ...this.profiles[this.editingMode].values };
  }

  setEditingOffset(offset) {
    const values = this.getEditingOffset();
    for (const [key, min, max] of limits) {
      if (Number.isFinite(offset[key])) values[key] = Math.max(min, Math.min(max, offset[key]));
    }
    this.profiles[this.editingMode].values = values;
    if (this.editingMode === this.active) this.renderer.setCameraOffset(values);
    if (Number.isFinite(offset.zoom)) {
      for (const profile of Object.values(this.profiles)) profile.values.zoom = values.zoom;
      this.renderer.setCameraOffset({ zoom: values.zoom });
    }
  }

  get saved() { return this.profiles[this.editingMode]?.saved; }

  async save() {
    const values = this.getEditingOffset();
    const mode = this.editingMode;
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
