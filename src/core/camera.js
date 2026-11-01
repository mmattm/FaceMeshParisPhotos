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
    this.stop();
    this.targetResolution = resolution;
    if (deviceId) this.currentDeviceId = deviceId;

    const constraints = {
      audio: false,
      video: {
        facingMode: this.currentDeviceId ? undefined : 'user',
        deviceId: this.currentDeviceId ? { exact: this.currentDeviceId } : undefined,
        width: { ideal: resolution.width },
        height: { ideal: resolution.height },
        frameRate: { ideal: 60, min: 30 }
      }
    };

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.video.srcObject = this.stream;
      this.video.playsInline = true;
      this.video.muted = true;

      await new Promise((resolve) => {
        const onReady = async () => {
          try {
            await this.video.play();
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
      if (deviceId || resolution.width > 640) {
        console.warn('Retrying with basic fallback camera constraints...');
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
          });
          this.stream = fallbackStream;
          this.video.srcObject = fallbackStream;
          try {
            await this.video.play();
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

  stop() {
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
