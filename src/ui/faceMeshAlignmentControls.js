export function setupFaceMeshAlignmentControls(renderer) {
  const panel = document.getElementById('facemesh-position-panel');
  const toggle = document.getElementById('btn-facemesh-position');
  const status = document.getElementById('facemesh-position-status');
  const context = document.getElementById('facemesh-position-context');
  const visible = document.getElementById('check-facemesh-visible');
  const saveButton = document.getElementById('btn-save-facemesh-position');
  const model = renderer.bustOverlay.selectedModel;
  const storageKeys = { bust: `facemesh_position_v2_${model}`, normal: 'facemesh_position_v1_normal' };
  const defaults = { bust: renderer.getFaceMeshAlignment('bust'), normal: renderer.getFaceMeshAlignment('normal') };
  const keys = Object.keys(defaults.normal);
  const savedAlignments = { bust: null, normal: null };
  const currentMode = () => renderer.showBust ? 'bust' : 'normal';

  const sync = () => {
    const alignment = renderer.getFaceMeshAlignment();
    const mode = currentMode();
    for (const key of keys) {
      panel.querySelector(`[data-face-slider="${key}"]`).value = alignment[key];
      panel.querySelector(`[data-face-number="${key}"]`).value = alignment[key];
    }
    const savedAlignment = savedAlignments[mode];
    const unchanged = savedAlignment && keys.every(key => Math.abs(alignment[key] - savedAlignment[key]) < 0.000001);
    status.textContent = unchanged ? 'Réglage enregistré' : 'Cliquez sur Save pour mémoriser';
    context.textContent = mode === 'normal' ? 'Mode normal · alignement sur la caméra' : 'Buste 3D · alignement sur le buste';
    saveButton.title = `Mémoriser la position, les inclinaisons et la taille du FaceMesh en mode ${mode === 'normal' ? 'normal' : 'Buste 3D'}`;
    visible.checked = renderer.faceMeshVisible;
  };

  for (const mode of ['bust', 'normal']) {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKeys[mode]));
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
        const values = Object.fromEntries(keys.filter(key => Number.isFinite(saved[key])).map(key => [key, saved[key]]));
        if (Object.keys(values).length) {
          renderer.setFaceMeshAlignment(values, mode);
          savedAlignments[mode] = renderer.getFaceMeshAlignment(mode);
        }
      }
    } catch { /* Use this mode's defaults if saved settings are unavailable. */ }
  }
  sync();

  const save = () => {
    try {
      const current = renderer.getFaceMeshAlignment();
      const mode = currentMode();
      localStorage.setItem(storageKeys[mode], JSON.stringify(current));
      savedAlignments[mode] = current;
      sync();
    } catch {
      status.textContent = 'Enregistrement indisponible sur ce navigateur';
    }
  };

  panel.querySelectorAll('[data-face-slider], [data-face-number]').forEach(input => {
    input.addEventListener('input', () => {
      if (input.value === '') return;
      const value = Number(input.value);
      if (!Number.isFinite(value)) return;
      renderer.setFaceMeshAlignment({ [input.dataset.faceSlider || input.dataset.faceNumber]: value });
      sync();
    });
  });

  const setOpen = open => {
    panel.classList.toggle('hidden', !open);
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open) {
      document.getElementById('btn-close-align')?.click();
      sync();
    }
  };
  toggle.addEventListener('click', () => setOpen(panel.classList.contains('hidden')));
  document.getElementById('btn-close-facemesh-position').addEventListener('click', () => setOpen(false));
  visible.addEventListener('change', () => renderer.setFaceMeshVisible(visible.checked));
  document.getElementById('btn-reset-facemesh-position').addEventListener('click', () => {
    renderer.setFaceMeshAlignment(defaults[currentMode()]);
    renderer.setFaceMeshVisible(true);
    visible.checked = true;
    sync();
  });
  saveButton.addEventListener('click', save);
  return { sync };
}
