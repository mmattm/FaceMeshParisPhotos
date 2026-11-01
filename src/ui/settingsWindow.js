/** Fine adjustment sliders; the main controls stay directly on the stage. */
export function bindSettingsWindow() {
  const dialog = document.getElementById('settings-window');
  const opener = document.getElementById('btn-open-settings');
  const closeButton = document.getElementById('btn-close-settings');
  const close = () => dialog.close();
  opener.addEventListener('click', () => {
    if (!dialog.open) dialog.showModal();
    closeButton.focus();
  });
  closeButton.addEventListener('click', close);
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right
      || event.clientY < rect.top || event.clientY > rect.bottom)) close();
  });
  return { close };
}
