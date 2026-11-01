// Local audio with a lightweight audio-driven mouth animation (no microphone).
// Audio owns articulation while a track is playing. Clear the preset's lip
// curls/presses as well, rather than stacking them on top of a talking jaw.
// Smiles, frowns and the rest of the recorded expression remain intact.
const AUDIO_MOUTH_REST = Object.freeze(Object.fromEntries([
  'jawForward', 'jawLeft', 'jawRight', 'mouthClose', 'mouthLeft', 'mouthRight',
  'mouthUpperUpLeft', 'mouthUpperUpRight', 'mouthLowerDownLeft', 'mouthLowerDownRight',
  'mouthStretchLeft', 'mouthStretchRight', 'mouthFunnel', 'mouthPucker',
  'mouthRollUpper', 'mouthRollLower', 'mouthShrugUpper', 'mouthShrugLower',
  'mouthPressLeft', 'mouthPressRight'
].map(name => [name, 0])));

export class PresetAudioLipSync {
  constructor(urls = []) {
    this.urls = Array.isArray(urls) ? [...urls] : [urls];
    this.url = this.urls[0];
    this.buffers = new Map();
    this.nextTrackIndex = 0;
    this.enableRequestId = 0;
    this.enabled = false;
    this.previewing = false;
    this.buffer = null;
    this.context = null;
    this.source = null;
    this.durationMs = 0;
    this.audioDelayMs = 0;
    this.delayNode = null;
    this.startedAt = 0;
    this.jaw = 0;
    this.jawTarget = 0;
    this.peak = 0.06;
    this.lastAnalysisTime = null;
  }

  async setEnabled(enabled, context, output) {
    const requestId = ++this.enableRequestId;
    if (!enabled) {
      this.enabled = false;
      this.stop();
      return;
    }
    if (!this.urls.length) throw new Error('Ajoutez une piste à la bibliothèque audio.');
    if (!context || !output) throw new Error('Audio non disponible dans ce navigateur.');
    await context.resume();
    if (requestId !== this.enableRequestId) return;
    if (context.state !== 'running') throw new Error('Cliquez pour autoriser la lecture audio.');
    if (!this.analyser) {
      this.context = context;
      this.output = output;
      this.analyser = context.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.15;
      this.destination = context.createMediaStreamDestination();
      this.playbackGain = context.createGain();
      this.playbackGain.gain.setValueAtTime(0, context.currentTime);
      this.playbackGain.connect(output);
      this.playbackGain.connect(this.destination);
      this.wave = new Float32Array(this.analyser.fftSize);
    }
    while (this.urls.some(url => !this.buffers.has(url))) {
      await Promise.all(this.urls.filter(url => !this.buffers.has(url)).map(async url => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Piste audio introuvable : ${url.split('/').pop()} (${response.status}).`);
        this.buffers.set(url, await context.decodeAudioData(await response.arrayBuffer()));
      }));
      if (requestId !== this.enableRequestId) return;
    }
    this.enabled = this.urls.length > 0;
  }

  async setTracks(urls) {
    const tracks = [...new Set(urls)];
    if (tracks.length === this.urls.length && tracks.every((url, index) => url === this.urls[index])) return;
    if (!tracks.includes(this.url)) {
      this.stop();
      this.url = tracks[0] || '';
      this.buffer = null;
    }
    this.urls = tracks;
    this.nextTrackIndex = this.source ? (tracks.indexOf(this.url) + 1) % tracks.length : 0;
    if (!tracks.length) {
      await this.setEnabled(false, this.context, this.output);
    } else if (this.enabled) {
      await this.setEnabled(true, this.context, this.output);
    }
  }

  setAudioDelayMs(value) {
    if (!Number.isFinite(value)) return;
    this.audioDelayMs = Math.max(0, Math.min(3000, value));
    if (this.delayNode) {
      const parameter = this.delayNode.delayTime;
      parameter.cancelScheduledValues(this.context.currentTime);
      parameter.setTargetAtTime(this.audioDelayMs / 1000, this.context.currentTime, 0.03);
    }
  }

  get playbackDurationMs() {
    return this.durationMs ? this.durationMs + this.audioDelayMs : 0;
  }

  play() {
    this.stop();
    if (!this.enabled || this.previewing || this.context?.state !== 'running') return false;
    const url = this.urls[this.nextTrackIndex];
    const buffer = this.buffers.get(url);
    if (!buffer) return false;
    this.url = url;
    this.buffer = buffer;
    const source = this.context.createBufferSource();
    source.buffer = this.buffer;
    // Analyse the original signal for lipsync, and delay only the audible output.
    this.delayNode = this.context.createDelay(3.1);
    this.delayNode.delayTime.setValueAtTime(this.audioDelayMs / 1000, this.context.currentTime);
    this.analyser.connect(this.delayNode);
    this.delayNode.connect(this.playbackGain);
    this.playbackGain.gain.setValueAtTime(1, this.context.currentTime);
    source.connect(this.analyser);
    source.onended = () => {
      source.disconnect();
      if (this.source === source) this.source = null;
    };
    this.source = source;
    this.startedAt = this.context.currentTime;
    this.durationMs = this.buffer.duration * 1000;
    source.start();
    this.nextTrackIndex = (this.nextTrackIndex + 1) % this.urls.length;
    return true;
  }

  stop() {
    if (this.playbackGain) this.playbackGain.gain.setValueAtTime(0, this.context.currentTime);
    if (this.source) {
      this.source.onended = null;
      try { this.source.stop(); } catch { /* Already ended. */ }
      this.source.disconnect();
      this.source = null;
    }
    if (this.delayNode) {
      this.analyser.disconnect(this.delayNode);
      this.delayNode.disconnect();
      this.delayNode = null;
    }
    this.durationMs = 0;
    this.jaw = 0;
    this.jawTarget = 0;
    this.peak = 0.06;
    this.lastAnalysisTime = null;
  }

  get elapsedMs() {
    return Math.max(0, (this.context.currentTime - this.startedAt) * 1000);
  }

  getBlendshapes() {
    // Release the mouth to the preset as soon as the track is no longer playing.
    if (!this.durationMs || !this.source || this.context.state !== 'running' || this.elapsedMs >= this.durationMs) {
      this.jaw = 0;
      this.jawTarget = 0;
      this.lastAnalysisTime = null;
      return null;
    }
    const time = this.context.currentTime;
    const dt = this.lastAnalysisTime === null ? 1 / 60
      : Math.max(0, Math.min(0.05, time - this.lastAnalysisTime));
    this.lastAnalysisTime = time;
    let target = 0;
    if (this.source && this.elapsedMs < this.durationMs) {
      this.analyser.getFloatTimeDomainData(this.wave);
      const rms = Math.sqrt(this.wave.reduce((sum, value) => sum + value * value, 0) / this.wave.length);
      this.peak = Math.max(0.06, this.peak * Math.exp(-dt), rms);
      // Emphasize speech while keeping the mouth closed during silence.
      const energy = Math.max(0, Math.min(1, (rms - 0.008) / this.peak));
      const activation = Math.max(0, (energy - 0.14) / 0.86);
      target = activation * activation * (3 - 2 * activation) * 0.32;
    }
    // Short attack and release preserve syllables without abrupt lip motion.
    this.jawTarget += (target - this.jawTarget) * (1 - Math.exp(-dt / 0.015));
    const jawResponse = this.jawTarget > this.jaw ? 0.035 : 0.060;
    this.jaw += (this.jawTarget - this.jaw) * (1 - Math.exp(-dt / jawResponse));
    if (target === 0 && this.jaw < 0.0005) this.jaw = this.jawTarget = 0;
    // A volume envelope cannot identify phonemes reliably. Use the model's jaw
    // deformation alone instead of guessing lip lifts, smiles or vowel shapes.
    return {
      ...AUDIO_MOUTH_REST,
      _audioArticulation: 1,
      jawOpen: this.jaw
    };
  }
}
