/**
 * Lightweight motion-only preset recorder.
 *
 * Captures MediaPipe head pose and facial blendshapes at a stable rate. It
 * deliberately stores no microphone stream, audio buffer, or base64 payload.
 */
export class MotionPresetRecorder {
  constructor({ fps = 30, maxDurationMs = 30000 } = {}) {
    this.fps = Math.max(1, fps);
    this.frameIntervalMs = 1000 / this.fps;
    this.maxDurationMs = Math.max(1000, maxDurationMs);
    this.reset();
  }

  reset() {
    this.isRecording = false;
    this.startedAt = 0;
    this.lastCaptureAt = -Infinity;
    this.frames = [];
  }

  start(now = performance.now()) {
    this.frames = [];
    this.startedAt = now;
    this.lastCaptureAt = -Infinity;
    this.isRecording = true;
  }

  getElapsedMs(now = performance.now()) {
    if (!this.isRecording) return 0;
    return Math.max(0, Math.min(this.maxDurationMs, now - this.startedAt));
  }

  capture(tracking, now = performance.now()) {
    if (!this.isRecording || !tracking?.detected || tracking.isNewFrame === false) return false;
    if (now - this.lastCaptureAt < this.frameIntervalMs) return false;

    const blendshapes = {};
    for (const [key, value] of Object.entries(tracking.blendshapes || {})) {
      if (Number.isFinite(value)) blendshapes[key] = Number(Math.max(0, Math.min(1, value)).toFixed(4));
    }

    const pose = tracking.headPose || {};
    const number = (value, digits) => Number((Number.isFinite(value) ? value : 0).toFixed(digits));
    const headPose = {
      pitch: number(pose.pitch, 2),
      yaw: number(pose.yaw, 2),
      roll: number(pose.roll, 2),
      x: number(pose.x, 4),
      y: number(pose.y, 4),
      z: number(pose.z, 4)
    };

    this.frames.push({
      timeOffsetMs: Math.round(Math.min(this.maxDurationMs, now - this.startedAt)),
      headPose,
      blendshapes
    });
    this.lastCaptureAt = now;
    return true;
  }

  stop(name = 'Preset mouvement', now = performance.now()) {
    const frames = this.frames;
    this.isRecording = false;

    if (frames.length < 2) {
      this.frames = [];
      throw new Error('Pas assez de mouvement capturé. Gardez le visage visible au moins une seconde.');
    }

    const lastOffset = frames[frames.length - 1].timeOffsetMs;
    if (lastOffset < 300) {
      this.frames = [];
      throw new Error('Enregistrement trop court. Enregistrez au moins une seconde.');
    }

    const durationMs = Math.max(lastOffset, Math.round(1000 / this.fps));
    const baselineFrames = frames.filter(frame => frame.timeOffsetMs <= 350);
    const referenceFrames = baselineFrames.length > 0 ? baselineFrames : [frames[0]];
    const allBlendshapeKeys = new Set(referenceFrames.flatMap(frame => Object.keys(frame.blendshapes)));
    const blendshapeBaseline = {};
    for (const key of allBlendshapeKeys) {
      blendshapeBaseline[key] = referenceFrames.reduce((sum, frame) => sum + (frame.blendshapes[key] || 0), 0) / referenceFrames.length;
    }

    const poseKeys = ['pitch', 'yaw', 'roll', 'x', 'y', 'z'];
    const referenceHeadPose = {};
    for (const key of poseKeys) {
      referenceHeadPose[key] = Number((referenceFrames.reduce((sum, frame) => sum + (frame.headPose[key] || 0), 0) / referenceFrames.length).toFixed(key === 'pitch' || key === 'yaw' || key === 'roll' ? 2 : 4));
    }
    const cleanName = name.trim() || `Preset ${new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })}`;

    const animation = {
      id: `recorded_${Date.now()}`,
      name: cleanName,
      durationMs,
      frameCount: frames.length,
      fps: Number((((frames.length - 1) * 1000) / durationMs).toFixed(2)),
      createdAt: new Date().toISOString(),
      hasAudio: false,
      referenceHeadPose,
      frames: frames.map(frame => ({
        timeOffsetMs: frame.timeOffsetMs,
        headPose: { ...frame.headPose },
        blendshapes: Object.fromEntries(Object.entries(frame.blendshapes)
          .filter(([key]) => key !== '_neutral')
          .map(([key, value]) => {
            const baseline = blendshapeBaseline[key] || 0;
            const delta = Math.max(0, value - baseline);
            const normalized = delta < 0.012 ? 0 : delta / Math.max(0.25, 1 - baseline);
            return [key, Number(Math.min(1, normalized).toFixed(4))];
          }))
      }))
    };

    this.frames = [];
    return animation;
  }
}
