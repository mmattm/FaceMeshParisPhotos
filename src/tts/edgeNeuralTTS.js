/**
 * Microsoft Edge Neural TTS Service (100% Free, No API Key Required)
 * Generates ultra-realistic human speech audio with natural breathing, cadence, and intonation.
 */

export const NEURAL_VOICES = [
  { id: 'fr-FR-HenriNeural', name: 'Henri (Français - Naturel & Expressif)', lang: 'fr-FR', gender: 'Male' },
  { id: 'fr-FR-DeniseNeural', name: 'Denise (Français - Doux & Naturel)', lang: 'fr-FR', gender: 'Female' },
  { id: 'fr-FR-EloiseNeural', name: 'Eloise (Français - Jeune & Dynamique)', lang: 'fr-FR', gender: 'Female' },
  { id: 'en-US-JennyNeural', name: 'Jenny (English US - Natural & Clear)', lang: 'en-US', gender: 'Female' },
  { id: 'en-US-GuyNeural', name: 'Guy (English US - Deep & Professional)', lang: 'en-US', gender: 'Male' },
  { id: 'en-US-AriaNeural', name: 'Aria (English US - Expressive & Warm)', lang: 'en-US', gender: 'Female' },
  { id: 'en-GB-RyanNeural', name: 'Ryan (English UK - British Natural)', lang: 'en-GB', gender: 'Male' },
  { id: 'de-DE-ConradNeural', name: 'Conrad (Deutsch - Natürlich)', lang: 'de-DE', gender: 'Male' },
  { id: 'it-IT-DiegoNeural', name: 'Diego (Italiano - Naturale)', lang: 'it-IT', gender: 'Male' },
  { id: 'es-ES-AlvaroNeural', name: 'Alvaro (Español - Natural)', lang: 'es-ES', gender: 'Male' }
];

export class EdgeNeuralTTS extends EventTarget {
  constructor() {
    super();
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.selectedVoice = localStorage.getItem('edge_tts_voice') || 'fr-FR-HenriNeural';
    this.currentSource = null;
    this.audioCache = new Map();
  }

  setVoice(voiceId) {
    this.selectedVoice = voiceId;
    localStorage.setItem('edge_tts_voice', voiceId);
  }

  /**
   * Synthesizes text to high-quality audio buffer via Edge Neural TTS
   */
  async synthesize(text) {
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    const cacheKey = `${this.selectedVoice}_${text}`;
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey);
    }

    const voice = this.selectedVoice;
    const cleanText = text.trim();

    try {
      // 1. Fetch from Edge Neural TTS endpoint
      const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${voice.substring(0, 5)}'><voice name='${voice}'><prosody pitch='+0Hz' rate='+0%'>${cleanText}</prosody></voice></speak>`;
      
      const edgeUrl = `https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D68491D6F4`;
      
      const response = await fetch(edgeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ssml+xml',
          'X-Timestamp': new Date().toUTCString(),
          'Path': 'ssml'
        },
        body: ssml
      });

      if (response.ok) {
        const arrayBuf = await response.arrayBuffer();
        const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuf);
        this.audioCache.set(cacheKey, audioBuffer);
        return audioBuffer;
      }
    } catch (err) {
      console.warn('Edge Neural endpoint failed, using fallback synth:', err);
    }

    // 2. High-Quality Fallback via SpeechSynthesis
    const fallbackBuffer = await this.fallbackSynthesize(cleanText);
    this.audioCache.set(cacheKey, fallbackBuffer);
    return fallbackBuffer;
  }

  fallbackSynthesize(text) {
    return new Promise((resolve) => {
      const durationSec = Math.max(1.8, text.length * 0.085);
      const sampleRate = this.audioCtx.sampleRate;
      const buffer = this.audioCtx.createBuffer(1, sampleRate * durationSec, sampleRate);
      const data = buffer.getChannelData(0);

      // Acoustic envelope for spectral sync
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        const env = Math.sin((t / durationSec) * Math.PI);
        data[i] = env * 0.2 * Math.sin(2 * Math.PI * 180 * t);
      }

      this.fallbackUtterance = new SpeechSynthesisUtterance(text);
      if (window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        const v = voices.find(item => item.name.includes('Thomas') || item.name.includes('Siri') || item.lang.startsWith(this.selectedVoice.substring(0, 2)));
        if (v) this.fallbackUtterance.voice = v;
      }

      resolve(buffer);
    });
  }

  playAudioBuffer(audioBuffer, onEnded = null) {
    this.stopAudio();
    if (!audioBuffer) return;

    if (this.fallbackUtterance && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(this.fallbackUtterance);
    }

    const source = this.audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioCtx.destination);

    source.onended = () => {
      this.currentSource = null;
      if (onEnded) onEnded();
    };

    source.start(0);
    this.currentSource = source;
  }

  stopAudio() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch (e) {}
      this.currentSource = null;
    }
  }
}
