/**
 * Camera Stream Manager
 * Manages webcam access, resolution switching, device enumeration, and frame timing.
 */

export class CameraManager {
  constructor(videoElement) {
    this.video = videoElement;
    this.stream = null;
    this.currentDeviceId = null;
    this.targetResolution = { width: 1280, height: 720 };
    this.onFrameCallback = null;
    this.isStreaming = false;
    this.state = 'stopped';
    this.lastError = null;
    this.opening = null;
    this.watchdog = null;
    this.nextRetryAt = 0;
    this.lastFrameTime = null;
    this.lastFrameAt = 0;
  }

  async getDevices() {
    if (!navigator.mediaDevices?.enumerateDevices) {
      return [];
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(d => d.kind === 'videoinput');
    } catch (err) {
      console.warn('Failed to enumerate media devices:', err);
      return [];
    }
  }

  async start(deviceId = null, resolution = { width: 1280, height: 720 }) {
    if (this.opening) return this.opening;
    this.state = 'connecting';
    this.lastError = null;
    this.opening = this.openStream(deviceId, resolution);
    try {
      const result = await this.opening;
      this.state = 'active';
      return result;
    } catch (error) {
      this.lastError = error;
      this.state = ['NotAllowedError', 'SecurityError'].includes(error.name) ? 'permission' : 'unavailable';
      throw error;
    } finally {
      this.opening = null;
      this.nextRetryAt = performance.now() + 5000;
    }
  }

  async requestStream(constraints, timeoutMs = 12000) {
    let timer, expired = false;
    try {
      return await Promise.race([
        Promise.resolve().then(() => navigator.mediaDevices.getUserMedia(constraints)).then(stream => {
          if (expired) {
            stream.getTracks().forEach(track => track.stop());
            throw new Error('Demande webcam expirée');
          }
          return stream;
        }),
        new Promise((_, reject) => {
          timer = setTimeout(() => {
            expired = true;
            reject(new Error('La webcam ne répond pas'));
          }, timeoutMs);
        })
      ]);
    } finally { clearTimeout(timer); }
  }

  async playVideo() {
    let timer;
    try {
      await Promise.race([
        this.video.play(),
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error('Lecture webcam bloquée')), 3000);
        })
      ]);
    } finally { clearTimeout(timer); }
  }

  async openStream(deviceId, resolution) {
    this.stop({ keepWatchdog: true });
    this.state = 'connecting';
    this.targetResolution = resolution;
    if (deviceId) this.currentDeviceId = deviceId;

    const constraints = {
      audio: false,
      video: {
        deviceId: this.currentDeviceId ? { exact: this.currentDeviceId } : undefined,
        width: { ideal: resolution.width },
        height: { ideal: resolution.height },
        frameRate: { ideal: 60, min: 30 }
      }
    };

    try {
      this.stream = await this.requestStream(constraints);
      this.video.srcObject = this.stream;
      this.video.playsInline = true;
      this.video.muted = true;

      await new Promise((resolve) => {
        const onReady = async () => {
          try {
            await this.playVideo();
          } catch (playErr) {
            console.warn('Video play deferred or blocked by browser autoplay policy:', playErr);
          }
          resolve();
        };

        if (this.video.readyState >= 1) {
          onReady();
        } else {
          this.video.onloadedmetadata = () => onReady();
          // Timeout fallback in case loadedmetadata doesn't fire
          setTimeout(onReady, 1000);
        }
      });

      this.isStreaming = true;
      return {
        width: this.video.videoWidth || resolution.width,
        height: this.video.videoHeight || resolution.height,
        deviceId: this.currentDeviceId
      };
    } catch (err) {
      console.error('Camera initialization error:', err);
      // Fallback to basic constraints if 60fps or exact device failed
      if (!['NotAllowedError', 'SecurityError'].includes(err.name)
        && (deviceId || resolution.width > 640)) {
        console.warn('Retrying with basic fallback camera constraints...');
        try {
          const fallbackStream = await this.requestStream({
            audio: false,
            video: { width: { ideal: 640 }, height: { ideal: 480 } }
          });
          this.stream = fallbackStream;
          this.currentDeviceId = null;
          this.video.srcObject = fallbackStream;
          try {
            await this.playVideo();
          } catch (e) {
            console.warn('Fallback video play deferred:', e);
          }
          this.isStreaming = true;
          return {
            width: this.video.videoWidth || 640,
            height: this.video.videoHeight || 480,
            deviceId: null
          };
        } catch (fallbackErr) {
          console.error('Camera fallback failed:', fallbackErr);
          throw fallbackErr;
        }
      }
      throw err;
    }
  }

  startWatchdog() {
    clearInterval(this.watchdog);
    this.lastFrameAt = performance.now();
    this.watchdog = setInterval(() => this.checkHealth(), 1000);
  }

  checkHealth(now = performance.now()) {
    if (this.opening || this.state === 'permission' || this.state === 'stopped') return;
    const track = this.stream?.getVideoTracks().find(item => item.readyState === 'live');
    if (track && !track.muted && this.video.readyState >= 2) {
      if (this.video.paused) void this.playVideo().catch(() => {});
      if (this.video.currentTime !== this.lastFrameTime) {
        this.lastFrameTime = this.video.currentTime;
        this.lastFrameAt = now;
        this.state = 'active';
        return;
      }
    }
    // Brief USB interruptions are tolerated; a frozen stream is reopened after 8 s.
    if (track && now - this.lastFrameAt < 8000) return;
    this.isStreaming = false;
    this.state = 'unavailable';
    if (now < this.nextRetryAt) return;
    this.lastFrameTime = null;
    this.lastFrameAt = now;
    void this.start(this.currentDeviceId, this.targetResolution).catch(error => {
      console.warn('Webcam reconnect:', error);
    });
  }

  stop({ keepWatchdog = false } = {}) {
    if (!keepWatchdog) {
      clearInterval(this.watchdog);
      this.watchdog = null;
      this.state = 'stopped';
    }
    this.lastFrameTime = null;
    this.lastFrameAt = performance.now();
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.video.srcObject = null;
    this.isStreaming = false;
  }

  getVideoDimensions() {
    return {
      width: this.video.videoWidth || 1280,
      height: this.video.videoHeight || 720
    };
  }
}
