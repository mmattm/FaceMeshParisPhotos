// Local audio with a lightweight audio-driven mouth animation (no microphone).
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
    this.upperLipJaw = 0;
    this.lowerLipJaw = 0;
    this.peak = 0.06;
    this.rounded = 0;
    this.spread = 0;
    this.lastAnalysisTime = null;
    this.mouthVariation = { focus: 0, width: 0, asymmetry: 0 };
    this.mouthVariationTarget = { focus: 0, width: 0, asymmetry: 0 };
    this.nextMouthVariationAt = 0;
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
      this.spectrum = new Uint8Array(this.analyser.frequencyBinCount);
    }
    while (this.urls.some(url => !this.buffers.has(url))) {
      await Promise.all(this.urls.filter(url => !this.buffers.has(url)).map(async url => {
        const filename = decodeURIComponent(url.split('/').pop());
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Piste audio introuvable : ${url.split('/').pop()} (${response.status}).`);
        if (response.headers.get('content-type')?.includes('text/html')) {
          throw new Error(`Le serveur renvoie une page HTML au lieu du fichier audio : ${filename}`);
        }
        try {
          this.buffers.set(url, await context.decodeAudioData(await response.arrayBuffer()));
        } catch (error) {
          throw new Error(`Impossible de décoder la piste : ${filename}`, { cause: error });
        }
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
    this.upperLipJaw = this.lowerLipJaw = 0;
    this.mouthVariation = { focus: 0, width: 0, asymmetry: 0 };
    this.mouthVariationTarget = { focus: 0, width: 0, asymmetry: 0 };
    this.nextMouthVariationAt = 0;
    this.peak = 0.06;
    this.rounded = 0;
    this.spread = 0;
    this.lastAnalysisTime = null;
  }

  get elapsedMs() {
    return Math.max(0, (this.context.currentTime - this.startedAt) * 1000);
  }

  getBlendshapes(openingPercent = 100) {
    // Release the mouth to the preset as soon as the track is no longer playing.
    if (!this.durationMs || !this.source || this.context.state !== 'running' || this.elapsedMs >= this.durationMs) {
      this.jaw = 0;
      this.jawTarget = 0;
      this.rounded = 0;
      this.spread = 0;
      this.lastAnalysisTime = null;
      this.upperLipJaw = this.lowerLipJaw = 0;
      return null;
    }
    const time = this.context.currentTime;
    const dt = this.lastAnalysisTime === null ? 1 / 60
      : Math.max(0, Math.min(0.05, time - this.lastAnalysisTime));
    this.lastAnalysisTime = time;
    let target = 0;
    let rounded = 0;
    let spread = 0;
    if (this.source && this.elapsedMs < this.durationMs) {
      this.analyser.getFloatTimeDomainData(this.wave);
      this.analyser.getByteFrequencyData(this.spectrum);
      const rms = Math.sqrt(this.wave.reduce((sum, value) => sum + value * value, 0) / this.wave.length);
      this.peak = Math.max(0.06, this.peak * Math.exp(-dt), rms);
      // Emphasize speech while keeping the mouth closed during silence.
      const energy = Math.max(0, Math.min(1, (rms - 0.008) / this.peak));
      const activation = Math.max(0, (energy - 0.14) / 0.86);
      target = activation * activation * (3 - 2 * activation) * 0.34;
      const band = (from, to) => {
        const hzPerBin = this.context.sampleRate / this.analyser.fftSize;
        const first = Math.max(0, Math.floor(from / hzPerBin));
        const last = Math.min(this.spectrum.length - 1, Math.ceil(to / hzPerBin));
        let sum = 0;
        for (let i = first; i <= last; i++) sum += this.spectrum[i];
        return sum / Math.max(1, last - first + 1);
      };
      const low = band(150, 800), mid = band(800, 2400);
      const vowelBalance = low / Math.max(1, low + mid);
      rounded = Math.max(0, Math.min(1, (vowelBalance - 0.25) * 1.5));
      spread = 1 - rounded;
    }
    // Short attack and release preserve syllables without abrupt lip motion.
    this.jawTarget += (target - this.jawTarget) * (1 - Math.exp(-dt / 0.018));
    const jawResponse = this.jawTarget > this.jaw ? 0.030 : 0.050;
    this.jaw += (this.jawTarget - this.jaw) * (1 - Math.exp(-dt / jawResponse));
    if (target === 0 && this.jaw < 0.0005) this.jaw = this.jawTarget = 0;
    // Soft tissue leads/lags the heavier mandible instead of moving as one strip.
    this.upperLipJaw += (this.jawTarget - this.upperLipJaw) * (1 - Math.exp(-dt / 0.025));
    this.lowerLipJaw += (this.jaw - this.lowerLipJaw) * (1 - Math.exp(-dt / 0.040));
    this.rounded += (rounded - this.rounded) * (1 - Math.exp(-dt / 0.065));
    this.spread += (spread - this.spread) * (1 - Math.exp(-dt / 0.080));
    const gain = Number.isFinite(openingPercent) ? Math.max(0, Math.min(300, openingPercent)) / 100 : 1;
    const jaw = this.jaw * gain;
    const opening = Math.min(1, jaw / 0.06);
    const openingEase = opening * opening * (3 - 2 * opening);
    const upperLift = this.upperLipJaw * gain * (0.20 + this.spread * 0.10);
    const lowerDrop = this.lowerLipJaw * gain;
    // Move the deformation's emphasis between syllables, never individual
    // vertices. Slow interpolation avoids noisy lips and preserves audio timing.
    if (jaw > 0.015 && time >= this.nextMouthVariationAt) {
      this.mouthVariationTarget = {
        focus: (Math.random() * 2 - 1) * 0.10,
        width: (Math.random() * 2 - 1) * 0.35,
        asymmetry: (Math.random() * 2 - 1) * 0.12
      };
      this.nextMouthVariationAt = time + 0.25 + Math.random() * 0.40;
    }
    for (const key of ['focus', 'width', 'asymmetry']) {
      const targetVariation = jaw > 0.015 ? this.mouthVariationTarget[key] : 0;
      this.mouthVariation[key] += (targetVariation - this.mouthVariation[key])
        * (1 - Math.exp(-dt / 0.18));
    }
    return {
      _audioArticulation: 1,
      _mouthFocusX: this.mouthVariation.focus,
      _mouthFocusWidth: this.mouthVariation.width,
      _mouthAsymmetry: this.mouthVariation.asymmetry,
      jawOpen: jaw,
      mouthClose: 1 - openingEase * 0.85,
      mouthUpperUpLeft: upperLift,
      mouthUpperUpRight: upperLift,
      mouthLowerDownLeft: lowerDrop * 0.25,
      mouthLowerDownRight: lowerDrop * 0.25,
      mouthStretchLeft: jaw * this.spread * 0.55,
      mouthStretchRight: jaw * this.spread * 0.55,
      mouthFunnel: jaw * this.rounded * 0.25,
      mouthPucker: jaw * this.rounded * 0.55
    };
  }
}
