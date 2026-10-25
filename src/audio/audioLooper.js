/**
 * Studio-Grade Audio Recorder & Seamless Cyclical Looper (Web Audio API)
 * 
 * Captures microphone audio in exact synchronization with facial expression capture,
 * decodes raw PCM audio data, applies equal-power crossfading at loop boundaries to
 * eliminate pops/clicks, and provides sample-accurate looping locked to video mocap.
 */

export class AudioLooper extends EventTarget {
  constructor() {
    super();
    this.audioCtx = null;
    this.stream = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioBuffer = null;
    this.activeSource = null;
    this.gainNode = null;

    this.isRecording = false;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 1.0;

    this.recordingStartTime = 0;
    this.loopDurationMs = 0;
    this.audioDelaySec = 2.2;
  }

  setAudioDelay(delaySec) {
    this.audioDelaySec = Math.max(0.0, Math.min(4.0, Number(delaySec) || 0));
  }

  /**
   * Initializes or resumes the Web Audio context upon user gesture
   */
  async ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
      this.gainNode.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Requests or retrieves active microphone stream
   */
  async getMicrophoneStream() {
    if (this.stream && this.stream.active) {
      const audioTracks = this.stream.getAudioTracks();
      if (audioTracks.length > 0 && audioTracks[0].readyState === 'live') {
        return this.stream;
      }
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true
        }
      });
      return this.stream;
    } catch (err) {
      console.warn('Microphone access with advanced constraints failed, retrying basic audio:', err);
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return this.stream;
      } catch (basicErr) {
        console.warn('Microphone access denied or unavailable:', basicErr);
        return null;
      }
    }
  }

  hasAudio() {
    return !!this.audioBuffer;
  }

  /**
   * Starts microphone recording simultaneously with facial expression recording
   */
  async startRecording(startTime = null) {
    try {
      await this.ensureAudioContext();
      const stream = await this.getMicrophoneStream();
      if (!stream) {
        console.warn('Cannot record audio: No microphone stream available');
        return false;
      }

      this.stopPlayback();
      this.audioChunks = [];
      this.audioBuffer = null;
      this.isRecording = true;
      this.recordingStartTime = startTime || performance.now();

      // Determine best supported Opus / WebM mimeType
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4'
      ];
      let selectedMime = '';
      for (const mime of mimeTypes) {
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) {
          selectedMime = mime;
          break;
        }
      }

      const options = selectedMime ? { mimeType: selectedMime } : {};
      this.mediaRecorder = new MediaRecorder(stream, options);

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.audioChunks.push(e.data);
        }
      };

      // Collect audio chunks every 25ms to guarantee immediate data flushing on stop
      this.mediaRecorder.start(25);
      this.dispatchEvent(new CustomEvent('recording:start'));
      return true;
    } catch (err) {
      console.error('Failed to start audio recording:', err);
      this.isRecording = false;
      return false;
    }
  }

  /**
   * Stops audio recording and decodes raw PCM audio matching exact loop duration
   */
  async stopRecording(loopDurationMs = null) {
    if (!this.isRecording || !this.mediaRecorder) return null;
    this.isRecording = false;
    this.loopDurationMs = loopDurationMs || (performance.now() - this.recordingStartTime);

    return new Promise((resolve) => {
      this.mediaRecorder.onstop = async () => {
        try {
          if (this.audioChunks.length === 0) {
            resolve(null);
            return;
          }

          const blob = new Blob(this.audioChunks, {
            type: this.mediaRecorder.mimeType || 'audio/webm'
          });
          const arrayBuffer = await blob.arrayBuffer();
          const decoded = await this.audioCtx.decodeAudioData(arrayBuffer);

          // Apply seamless cyclical crossfade on loop boundaries
          this.audioBuffer = this.processSeamlessLoop(decoded, this.loopDurationMs / 1000.0);
          this.dispatchEvent(new CustomEvent('recording:ready', {
            detail: { durationSec: this.loopDurationMs / 1000.0 }
          }));
          resolve(this.audioBuffer);
        } catch (decodeErr) {
          console.error('Audio decode failed:', decodeErr);
          resolve(null);
        }
      };

      try {
        if (this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop();
        } else {
          this.mediaRecorder.onstop();
        }
      } catch (e) {
        console.warn('Error stopping mediaRecorder:', e);
        resolve(null);
      }
    });
  }

  /**
   * Trims audio to exact loop length and applies equal-power cosine crossfade
   * across loop start and end to guarantee zero clicks or pops on repeating loops.
   */
  processSeamlessLoop(buffer, targetDurationSec) {
    if (!buffer) return null;
    const sampleRate = buffer.sampleRate;
    const channels = buffer.numberOfChannels;
    const targetSamples = Math.min(
      buffer.length,
      Math.max(1, Math.round(targetDurationSec * sampleRate))
    );

    const outBuffer = this.audioCtx.createBuffer(channels, targetSamples, sampleRate);
    // 25ms crossfade window (approx 1100 samples at 44.1kHz or 1200 at 48kHz)
    const fadeSamples = Math.min(Math.floor(targetSamples * 0.15), Math.round(sampleRate * 0.025));

    for (let c = 0; c < channels; c++) {
      const src = buffer.getChannelData(c);
      const dst = outBuffer.getChannelData(c);

      // Copy audio data up to targetSamples
      for (let i = 0; i < targetSamples; i++) {
        dst[i] = src[i] || 0;
      }

      // Equal-power crossfade between loop tail and loop head
      if (fadeSamples > 10 && targetSamples > fadeSamples * 2) {
        for (let i = 0; i < fadeSamples; i++) {
          const t = i / fadeSamples;
          const fadeIn = Math.sin(t * (Math.PI / 2));
          const fadeOut = Math.cos(t * (Math.PI / 2));

          const tailIdx = targetSamples - fadeSamples + i;
          const headSample = dst[i];
          const tailSample = dst[tailIdx];

          dst[i] = headSample * fadeIn + tailSample * (1.0 - fadeIn);
          dst[tailIdx] = tailSample * fadeOut + headSample * (1.0 - fadeOut);
        }
      }
    }

    return outBuffer;
  }

  /**
   * Loads an external AudioBuffer (e.g. from an uploaded video)
   * and prepares seamless cyclical crossfade playback matching loop duration
   */
  async loadAudioBuffer(decodedBuffer, loopDurationSec) {
    if (!decodedBuffer) return;
    await this.ensureAudioContext();
    this.stopPlayback();
    this.audioChunks = [];
    this.loopDurationMs = Math.round(loopDurationSec * 1000);
    this.audioBuffer = this.processSeamlessLoop(decodedBuffer, loopDurationSec);
    this.dispatchEvent(new CustomEvent('recording:ready', {
      detail: { durationSec: loopDurationSec }
    }));
  }

  /**
   * Starts cyclical audio playback synchronized with facial expression loop
   */
  startPlayback(offsetSec = 0, loopDurationSec = null) {
    if (!this.audioBuffer || !this.audioCtx) return;
    this.stopPlayback();

    const duration = loopDurationSec || (this.loopDurationMs ? this.loopDurationMs / 1000.0 : this.audioBuffer.duration);
    if (duration <= 0.01) return;

    try {
      this.ensureAudioContext();

      const source = this.audioCtx.createBufferSource();
      source.buffer = this.audioBuffer;
      source.loop = true;
      source.loopStart = 0;
      source.loopEnd = duration;

      source.connect(this.gainNode);

      const effectiveOffset = offsetSec - (this.audioDelaySec || 0);
      const safeOffset = ((effectiveOffset % duration) + duration) % duration;
      source.start(0, safeOffset);

      this.activeSource = source;
      this.isPlaying = true;
      this.dispatchEvent(new CustomEvent('playback:start', { detail: { offsetSec: safeOffset } }));
    } catch (err) {
      console.warn('Failed to start audio playback:', err);
    }
  }

  /**
   * Pauses audio playback
   */
  stopPlayback() {
    if (this.activeSource) {
      try {
        this.activeSource.stop();
        this.activeSource.disconnect();
      } catch (e) {
        // Source already terminated
      }
      this.activeSource = null;
    }
    this.isPlaying = false;
    this.dispatchEvent(new CustomEvent('playback:stop'));
  }

  pause() {
    this.stopPlayback();
  }

  /**
   * Seeks audio playback to matching timeline scrubber position
   */
  seek(offsetSec, loopDurationSec = null) {
    if (this.isPlaying) {
      this.startPlayback(offsetSec, loopDurationSec);
    }
  }

  /**
   * Adjusts volume (0.0 to 1.0)
   */
  setVolume(vol) {
    this.volume = Math.max(0.0, Math.min(1.0, vol));
    if (this.gainNode && this.audioCtx) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.gainNode.gain.setValueAtTime(targetGain, this.audioCtx.currentTime);
    }
  }

  /**
   * Toggles audio mute state
   */
  setMuted(muted) {
    this.isMuted = !!muted;
    if (this.gainNode && this.audioCtx) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.gainNode.gain.setValueAtTime(targetGain, this.audioCtx.currentTime);
    }
    this.dispatchEvent(new CustomEvent('mute:change', { detail: { isMuted: this.isMuted } }));
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Clears recorded audio data
   */
  clear() {
    this.stopPlayback();
    this.audioChunks = [];
    this.audioBuffer = null;
    this.loopDurationMs = 0;
    this.dispatchEvent(new CustomEvent('cleared'));
  }

  /**
   * Encodes active AudioBuffer to base64 WAV data URL
   */
  exportWavBase64() {
    if (!this.audioBuffer) return null;
    try {
      const buffer = this.audioBuffer;
      const numChannels = Math.min(2, buffer.numberOfChannels);
      const sampleRate = buffer.sampleRate;
      const format = 1; // PCM
      const bitDepth = 16;
      const bytesPerSample = bitDepth / 8;
      const blockAlign = numChannels * bytesPerSample;
      const numSamples = buffer.length;
      const dataSize = numSamples * blockAlign;
      const headerSize = 44;
      const totalSize = headerSize + dataSize;

      const arrayBuffer = new ArrayBuffer(totalSize);
      const view = new DataView(arrayBuffer);

      // Write RIFF header
      const writeString = (offset, str) => {
        for (let i = 0; i < str.length; i++) {
          view.setUint8(offset + i, str.charCodeAt(i));
        }
      };

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + dataSize, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, format, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * blockAlign, true);
      view.setUint16(32, blockAlign, true);
      view.setUint16(34, bitDepth, true);
      writeString(36, 'data');
      view.setUint32(40, dataSize, true);

      // Interleave samples
      let offset = 44;
      const channels = [];
      for (let ch = 0; ch < numChannels; ch++) {
        channels.push(buffer.getChannelData(ch));
      }

      for (let i = 0; i < numSamples; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
          let s = Math.max(-1, Math.min(1, channels[ch][i]));
          s = s < 0 ? s * 0x8000 : s * 0x7FFF;
          view.setInt16(offset, s, true);
          offset += 2;
        }
      }

      // Convert to base64
      let binary = '';
      const bytes = new Uint8Array(arrayBuffer);
      const chunkSz = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSz) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSz));
      }
      return 'data:audio/wav;base64,' + btoa(binary);
    } catch (e) {
      console.warn('Failed to export audio to WAV base64:', e);
      return null;
    }
  }
}

