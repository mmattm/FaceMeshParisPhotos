const MAX_FILE_SIZE = 50 * 1024 * 1024;

export class AudioLibraryControls {
  constructor(app) {
    this.app = app;
    this.tracks = [];
    this.selection = '';
    try { this.selection = localStorage.getItem('photomaton_audio_selection') || ''; } catch { /* Default: all tracks. */ }
    try {
      this.app.autonomousEngine.presetAudio.setAudioDelayMs(Number(localStorage.getItem('photomaton_audio_delay_ms') || 0));
    } catch { /* Default: no audio delay. */ }
    this.modal = document.getElementById('audio-library-modal');
    this.list = document.getElementById('audio-library-list');
    this.status = document.getElementById('audio-library-status');
    this.preview = document.getElementById('audio-library-preview');
    this.previewUrl = '';
    this.previewRequestId = 0;
  }

  bind() {
    const delay = document.getElementById('audio-delay-ms');
    const delayValue = document.getElementById('audio-delay-value');
    const setDelay = value => {
      const player = this.app.autonomousEngine.presetAudio;
      player.setAudioDelayMs(value);
      delay.value = player.audioDelayMs;
      delayValue.textContent = `${player.audioDelayMs} ms`;
      delay.setAttribute('aria-valuetext', `${player.audioDelayMs} millisecondes après les lèvres`);
      try { localStorage.setItem('photomaton_audio_delay_ms', String(player.audioDelayMs)); } catch { /* Session setting. */ }
    };
    setDelay(this.app.autonomousEngine.presetAudio.audioDelayMs);
    delay.addEventListener('input', () => setDelay(Number(delay.value)));
    document.getElementById('btn-reset-audio-delay').addEventListener('click', () => setDelay(0));
    const close = () => {
      this.stopPreview();
      this.modal.classList.add('hidden');
      document.getElementById('audio-playback-status').focus();
    };
    document.getElementById('audio-playback-status').addEventListener('click', async () => {
      this.modal.classList.remove('hidden');
      document.getElementById('btn-close-audio-library').focus();
      try { await this.refresh(); } catch (error) { this.report(error); }
    });
    for (const id of ['btn-close-audio-library', 'btn-close-audio-library-bottom', 'backdrop-audio-library']) {
      document.getElementById(id).addEventListener('click', close);
    }
    this.modal.addEventListener('keydown', event => {
      if (event.key === 'Escape') close();
    });
    document.getElementById('btn-audio-library-all').addEventListener('click', () => this.choose(''));
    document.getElementById('btn-audio-library-toggle').addEventListener('click', () => {
      document.getElementById('btn-preset-audio').click();
    });
    const input = document.getElementById('input-import-audio');
    document.getElementById('btn-import-audio').addEventListener('click', () => input.click());
    input.addEventListener('change', async () => {
      const files = [...input.files];
      if (!files.length) return;
      const button = document.getElementById('btn-import-audio');
      button.disabled = true;
      try {
        for (const file of files) {
          if (file.size > MAX_FILE_SIZE) throw new Error(`${file.name} dépasse 50 Mo.`);
          const response = await fetch(`/api/audio?filename=${encodeURIComponent(file.name)}`, {
            method: 'POST', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'Import audio impossible.');
        }
        await this.refresh();
        this.app.showNotification(`${files.length} piste${files.length > 1 ? 's' : ''} importée${files.length > 1 ? 's' : ''}`, 'success', 3000, 'audio-library');
      } catch (error) {
        this.report(error);
        await this.refresh().catch(() => {});
      } finally {
        input.value = '';
        button.disabled = false;
      }
    });
    for (const event of ['play', 'pause', 'ended']) {
      this.preview.addEventListener(event, () => {
        if (event === 'play' && !this.preview.paused) this.app.autonomousEngine.stopAudio();
        this.app.autonomousEngine.presetAudio.previewing = !this.preview.paused && !this.preview.ended;
        this.app.updateAnimationPlaybackUI(true);
      });
    }
    this.preview.addEventListener('error', () => {
      if (this.previewUrl) this.report(new Error('Cette piste ne peut pas être lue dans ce navigateur.'));
      this.app.autonomousEngine.presetAudio.previewing = false;
    });
  }

  async refresh() {
    let data;
    try {
      const response = await fetch('/api/audio', { cache: 'no-cache' });
      if (!response.ok) throw new Error('Bibliothèque indisponible.');
      data = await response.json();
    } catch {
      try {
        const response = await fetch('/audio/manifest.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error();
        data = await response.json();
      } catch {
        throw new Error('Bibliothèque audio indisponible. Relancez le serveur Photomaton.');
      }
    }
    this.tracks = (Array.isArray(data.tracks) ? data.tracks : [])
      .filter(track => typeof track.filename === 'string' && typeof track.url === 'string' && track.url.startsWith('/audio/'));
    if (!this.tracks.some(track => track.filename === this.selection)) this.selection = '';
    if (this.previewUrl && !this.tracks.some(track => track.url === this.previewUrl)) this.stopPreview();
    await this.applySelection();
    this.status.textContent = '';
    this.status.classList.remove('error');
    this.render();
  }

  async applySelection() {
    const tracks = this.selection ? this.tracks.filter(track => track.filename === this.selection) : this.tracks;
    await this.app.autonomousEngine.setPresetAudioTracks(tracks.map(track => track.url));
    this.app.refreshPresetAudioButton();
    this.app.updateAnimationPlaybackUI(true);
  }

  async choose(filename) {
    const previous = this.selection;
    this.selection = filename;
    try {
      this.stopPreview();
      await this.applySelection();
      try { localStorage.setItem('photomaton_audio_selection', filename); } catch { /* Session selection. */ }
      this.render();
      this.app.showNotification(filename ? `Piste sélectionnée : ${filename}` : 'Alternance de toute la bibliothèque activée', 'success', 3000, 'audio-library');
    } catch (error) {
      this.selection = previous;
      await this.applySelection().catch(() => {});
      this.report(error);
    }
  }

  stopPreview() {
    this.previewRequestId++;
    this.previewUrl = '';
    this.preview.pause();
    this.preview.removeAttribute('src');
    this.preview.load();
    this.preview.classList.add('hidden');
    this.app.autonomousEngine.presetAudio.previewing = false;
  }

  async listen(track) {
    if (this.previewUrl === track.url && !this.preview.paused) {
      this.stopPreview();
      this.app.updateAnimationPlaybackUI(true);
      return;
    }
    this.stopPreview();
    this.previewUrl = track.url;
    const requestId = this.previewRequestId;
    this.app.autonomousEngine.presetAudio.previewing = true;
    this.app.autonomousEngine.stopAudio();
    this.preview.src = track.url;
    this.preview.classList.remove('hidden');
    try { await this.preview.play(); } catch (error) {
      if (requestId !== this.previewRequestId) return;
      this.stopPreview();
      this.report(error);
    }
    this.app.updateAnimationPlaybackUI(true);
  }

  getPreviewStatus() {
    if (!this.previewUrl || this.preview.paused || this.preview.ended) return null;
    const track = this.tracks.find(track => track.url === this.previewUrl);
    return track ? { label: `${track.filename} (préécoute)`, playing: true } : null;
  }

  render() {
    this.list.replaceChildren();
    document.getElementById('audio-library-count').textContent = `${this.tracks.length} piste${this.tracks.length > 1 ? 's' : ''}`;
    if (!this.tracks.length) {
      const empty = document.createElement('p');
      empty.className = 'audio-library-status';
      empty.textContent = 'Aucune piste. Importez un fichier audio pour commencer.';
      this.list.append(empty);
    }
    for (const track of this.tracks) {
      const card = document.createElement('div');
      card.className = 'anim-item-card';
      card.dataset.audioFilename = track.filename;
      card.innerHTML = `<div class="anim-item-info"><div class="anim-item-title-row"><span class="anim-item-name"></span><span class="anim-item-badge audio-selection"></span><span class="anim-item-badge audio-playing hidden">▶ En cours</span></div><div class="anim-item-meta"></div></div><div class="anim-item-actions"><button class="tool-btn audio-listen" type="button">▶ Écouter</button><button class="tool-btn audio-use" type="button">Utiliser</button><a class="tool-btn audio-download">⬇</a><button class="tool-btn audio-remove" type="button">🗑</button></div>`;
      card.querySelector('.anim-item-name').textContent = track.filename;
      card.querySelector('.anim-item-meta').textContent = `${(track.size / 1024 / (track.size >= 1048576 ? 1024 : 1)).toFixed(1)} ${track.size >= 1048576 ? 'Mo' : 'Ko'}`;
      card.querySelector('.audio-listen').addEventListener('click', () => this.listen(track));
      card.querySelector('.audio-use').addEventListener('click', () => this.choose(track.filename));
      const download = card.querySelector('.audio-download');
      download.href = track.url;
      download.download = track.filename;
      download.title = `Télécharger ${track.filename}`;
      const remove = card.querySelector('.audio-remove');
      remove.title = `Retirer ${track.filename}`;
      remove.addEventListener('click', async () => {
        if (!confirm(`Retirer « ${track.filename} » de la bibliothèque ?`)) return;
        remove.disabled = true;
        try {
          const response = await fetch(`/api/audio?filename=${encodeURIComponent(track.filename)}`, { method: 'DELETE' });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'Suppression impossible.');
          await this.refresh();
          this.app.showNotification('Piste retirée de la bibliothèque', 'success', 3000, 'audio-library');
        } catch (error) { this.report(error); remove.disabled = false; }
      });
      this.list.append(card);
    }
    this.updateState();
  }

  updateState() {
    const player = this.app.autonomousEngine.presetAudio;
    const toggle = document.getElementById('btn-audio-library-toggle');
    toggle.disabled = !this.tracks.length || document.getElementById('btn-preset-audio').disabled;
    toggle.textContent = player.enabled ? 'Désactiver l’audio' : 'Activer l’audio';
    toggle.classList.toggle('active', player.enabled);
    const all = document.getElementById('btn-audio-library-all');
    all.disabled = !this.tracks.length;
    all.classList.toggle('active', !this.selection);
    for (const card of this.list.querySelectorAll('[data-audio-filename]')) {
      const filename = card.dataset.audioFilename;
      const track = this.tracks.find(track => track.filename === filename);
      const previewing = track && this.previewUrl === track.url && !this.preview.paused && !this.preview.ended;
      const playing = previewing || (track && player.durationMs && player.context?.state === 'running'
        && player.elapsedMs < player.playbackDurationMs && player.url === track.url);
      const selected = !this.selection || filename === this.selection;
      card.querySelector('.audio-selection').textContent = selected ? (this.selection ? 'Sélectionnée' : 'Alternance') : '';
      card.querySelector('.audio-selection').classList.toggle('hidden', !selected);
      card.querySelector('.audio-playing').classList.toggle('hidden', !playing);
      card.querySelector('.audio-listen').textContent = previewing ? '■ Arrêter' : '▶ Écouter';
      card.querySelector('.audio-use').classList.toggle('active', filename === this.selection);
      card.classList.toggle('is-playing', !!playing);
    }
  }

  report(error) {
    this.status.textContent = error.message;
    this.status.classList.add('error');
    this.app.showNotification(error.message, 'error', 5000, 'audio-library');
  }
}
