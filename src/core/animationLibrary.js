/**
 * Animation Library Manager
 * 
 * Manages saving, loading, listing, and streaming of facial mocap animations
 * stored in the dedicated `public/animations/` directory.
 * 
 * Automatically initializes preset performances (wink, smile, nod, surprise)
 * and provides random selection (~50% chance) for the autonomous mode.
 */

import { generatePresetAnimations } from './presetAnimations.js';

export class AnimationLibrary extends EventTarget {
  constructor() {
    super();
    this.animations = []; // Array of { id, name, filename, durationMs, frameCount, createdAt, hasAudio }
    this.cache = new Map(); // id or filename -> full animation data
    this.audioCtx = null;
    this.isAutonomousPlaybackEnabled = true;
    this.lastPlayedId = null;
    this.isInitialized = false;
  }

  setAudioContext(ctx) {
    this.audioCtx = ctx;
    // Decode audio for any already cached animations
    for (const anim of this.cache.values()) {
      if (anim && anim.audioData && !anim._audioBuffer) {
        this.decodeAudioBuffer(anim);
      }
    }
  }

  async decodeAudioBuffer(anim) {
    if (!anim || !anim.audioData || anim._audioBuffer) return anim?._audioBuffer || null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (!this.audioCtx) return null;
    try {
      const base64 = anim.audioData.replace(/^data:audio\/\w+;base64,/, '');
      const binaryStr = atob(base64);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const decoded = await this.audioCtx.decodeAudioData(bytes.buffer.slice(0));
      anim._audioBuffer = decoded;
      return decoded;
    } catch (err) {
      console.warn('[AnimationLibrary] Audio pre-decode warning:', err);
      return null;
    }
  }

  async init() {
    try {
      await this.refreshList();

      // If no animations exist yet in the dedicated directory, auto-populate the presets!
      if (this.animations.length === 0) {
        console.log('[AnimationLibrary] Directory empty, populating built-in preset animations...');
        const presets = generatePresetAnimations();
        for (const preset of presets) {
          await this.saveAnimation(preset.name, preset);
        }
        await this.refreshList();
      }

      // Preload all animation JSON bodies into memory cache for zero-latency 60 FPS playback
      for (const item of this.animations) {
        const key = item.filename || item.id;
        if (!this.cache.has(key)) {
          await this.getAnimationData(key);
        }
      }

      this.isInitialized = true;
      this.dispatchEvent(new CustomEvent('initialized', { detail: { count: this.animations.length } }));
    } catch (err) {
      console.warn('[AnimationLibrary] Init warning:', err);
      // Fallback: load in-memory presets if server is unreachable
      const presets = generatePresetAnimations();
      for (const p of presets) {
        this.cache.set(p.id, p);
        this.cache.set(`${p.id}.json`, p);
        this.animations.push({
          id: p.id,
          name: p.name,
          filename: `${p.id}.json`,
          durationMs: p.durationMs,
          frameCount: p.frameCount,
          createdAt: p.createdAt,
          hasAudio: false
        });
      }
      this.isInitialized = true;
    }
    return this.animations;
  }

  /**
   * Refreshes the list of available animations from the server
   */
  async refreshList() {
    try {
      const res = await fetch('/api/animations', { cache: 'no-cache' });
      if (res.ok) {
        this.animations = await res.json();
        this.dispatchEvent(new CustomEvent('list:updated', { detail: { animations: this.animations } }));
        return this.animations;
      }
    } catch (err) {
      console.warn('[AnimationLibrary] Failed to fetch /api/animations:', err);
    }
    return this.animations;
  }

  getAnimations() {
    return this.animations;
  }

  hasAnimations() {
    return this.animations && this.animations.length > 0;
  }

  /**
   * Loads full animation data (from cache or via fetch)
   */
  async getAnimationData(idOrFilename) {
    if (this.cache.has(idOrFilename)) {
      return this.cache.get(idOrFilename);
    }

    // Try finding by id or filename in metadata list
    const meta = this.animations.find(a => a.id === idOrFilename || a.filename === idOrFilename);
    const filename = meta ? meta.filename : (idOrFilename.endsWith('.json') ? idOrFilename : `${idOrFilename}.json`);

    try {
      // First check static path /animations/<filename>
      const staticRes = await fetch(`/animations/${filename}`, { cache: 'no-cache' });
      if (staticRes.ok) {
        const data = await staticRes.json();
        if (data && data.audioData) {
          this.decodeAudioBuffer(data);
        }
        this.cache.set(data.id || filename, data);
        this.cache.set(filename, data);
        return data;
      }
    } catch (e) {
      // ignore and try fallback
    }

    return null;
  }

  /**
   * Saves a recorded animation to the dedicated directory `public/animations/`
   */
  async saveAnimation(name, animationData) {
    const payload = {
      name: name.trim() || 'Animation',
      ...animationData
    };

    try {
      const res = await fetch('/api/animations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const result = await res.json();
      const savedAnim = result.animation;
      if (savedAnim && savedAnim.audioData) {
        await this.decodeAudioBuffer(savedAnim);
      }
      this.cache.set(savedAnim.id, savedAnim);
      if (result.filename) {
        this.cache.set(result.filename, savedAnim);
      }

      await this.refreshList();
      this.dispatchEvent(new CustomEvent('animation:saved', { detail: savedAnim }));
      return savedAnim;
    } catch (err) {
      console.error('[AnimationLibrary] Failed to save animation:', err);
      // Fallback: save to memory/local cache
      const id = payload.id || `anim_${Date.now()}`;
      payload.id = id;
      this.cache.set(id, payload);
      this.animations.unshift({
        id,
        name: payload.name,
        filename: `${id}.json`,
        durationMs: payload.durationMs || 0,
        frameCount: payload.frameCount || (payload.frames ? payload.frames.length : 0),
        createdAt: new Date().toISOString(),
        hasAudio: !!payload.audioData
      });
      this.dispatchEvent(new CustomEvent('animation:saved', { detail: payload }));
      return payload;
    }
  }

  /**
   * Deletes an animation from the dedicated directory
   */
  async deleteAnimation(filename) {
    try {
      const res = await fetch(`/api/animations?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      this.cache.delete(filename);
      await this.refreshList();
      this.dispatchEvent(new CustomEvent('animation:deleted', { detail: { filename } }));
      return true;
    } catch (err) {
      console.error('[AnimationLibrary] Failed to delete animation:', err);
      this.animations = this.animations.filter(a => a.filename !== filename);
      this.dispatchEvent(new CustomEvent('animation:deleted', { detail: { filename } }));
      return false;
    }
  }

  /**
   * Picks a random animation from the library, avoiding immediate repetition
   */
  async getRandomAnimation() {
    if (!this.animations || this.animations.length === 0) {
      return null;
    }

    // Filter out the last played one if more than 1 option exists
    let candidates = this.animations;
    if (this.animations.length > 1 && this.lastPlayedId) {
      candidates = this.animations.filter(a => a.id !== this.lastPlayedId && a.filename !== this.lastPlayedId);
    }
    if (candidates.length === 0) candidates = this.animations;

    const chosenMeta = candidates[Math.floor(Math.random() * candidates.length)];
    if (!chosenMeta) return null;

    this.lastPlayedId = chosenMeta.id;
    return await this.getAnimationData(chosenMeta.filename || chosenMeta.id);
  }

  /**
   * Synchronously returns a random cached animation for zero-latency 60 FPS loop
   */
  getRandomAnimationSync() {
    if (!this.animations || this.animations.length === 0) {
      // Fallback: check cache directly
      if (this.cache.size > 0) {
        const values = Array.from(this.cache.values());
        return values[Math.floor(Math.random() * values.length)];
      }
      return null;
    }

    let candidates = this.animations;
    if (this.animations.length > 1 && this.lastPlayedId) {
      candidates = this.animations.filter(a => a.id !== this.lastPlayedId && a.filename !== this.lastPlayedId);
    }
    if (candidates.length === 0) candidates = this.animations;

    const chosenMeta = candidates[Math.floor(Math.random() * candidates.length)];
    if (!chosenMeta) return null;

    this.lastPlayedId = chosenMeta.id;
    const cached = this.cache.get(chosenMeta.filename) || this.cache.get(chosenMeta.id);
    if (cached) {
      return cached;
    }

    // If not yet cached, trigger background load and return any cached one
    this.getAnimationData(chosenMeta.filename || chosenMeta.id);
    if (this.cache.size > 0) {
      return Array.from(this.cache.values())[0];
    }
    return null;
  }

  getActiveAnimationCount() {
    return this.animations.length;
  }

  setAutonomousPlaybackEnabled(enabled) {
    this.isAutonomousPlaybackEnabled = !!enabled;
    this.dispatchEvent(new CustomEvent('playback:toggled', { detail: { enabled: this.isAutonomousPlaybackEnabled } }));
  }
}

