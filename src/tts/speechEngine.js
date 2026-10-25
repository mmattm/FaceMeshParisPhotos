/**
 * Realistic Text-to-Speech (TTS) Engine
 * Manages SpeechSynthesis voices, word boundaries, and speech loop scheduling.
 */

export class SpeechEngine extends EventTarget {
  constructor() {
    super();
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.selectedVoice = null;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.volume = 1.0;
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;

    const load = () => {
      this.voices = this.synth.getVoices();
      if (this.voices.length > 0) {
        // Prefer natural voices (Apple Natural, Siri, Google, Samantha, Thomas, Daniel)
        this.selectedVoice = this.voices.find(v => 
          v.name.includes('Siri') || 
          v.name.includes('Natural') || 
          v.name.includes('Samantha') || 
          v.name.includes('Daniel') || 
          v.name.includes('Thomas') || 
          v.lang.startsWith('en') || 
          v.lang.startsWith('fr')
        ) || this.voices[0];
        this.dispatchEvent(new CustomEvent('voices:loaded', { detail: { voices: this.voices } }));
      }
    };

    load();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = load;
    }
  }

  setVoice(voiceUri) {
    const v = this.voices.find(item => item.voiceURI === voiceUri || item.name === voiceUri);
    if (v) this.selectedVoice = v;
  }

  setRate(rate) {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
  }

  setPitch(pitch) {
    this.pitch = Math.max(0.5, Math.min(2.0, pitch));
  }

  speak(text) {
    if (!this.synth || !text) return Promise.resolve(0);
    this.stop();

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) utterance.voice = this.selectedVoice;
      utterance.rate = this.rate;
      utterance.pitch = this.pitch;
      utterance.volume = this.volume;

      const startTime = performance.now();
      this.isSpeaking = true;
      this.currentUtterance = utterance;

      utterance.onboundary = (event) => {
        this.dispatchEvent(new CustomEvent('speech:boundary', {
          detail: {
            charIndex: event.charIndex,
            charLength: event.charLength || 1,
            elapsedMs: performance.now() - startTime
          }
        }));
      };

      utterance.onend = () => {
        const durationMs = performance.now() - startTime;
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.dispatchEvent(new CustomEvent('speech:end', { detail: { durationMs } }));
        resolve(durationMs);
      };

      utterance.onerror = (err) => {
        console.warn('Speech synthesis error:', err);
        this.isSpeaking = false;
        this.currentUtterance = null;
        resolve(1000);
      };

      this.synth.speak(utterance);
      this.dispatchEvent(new CustomEvent('speech:start', { detail: { text } }));
    });
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }
}
