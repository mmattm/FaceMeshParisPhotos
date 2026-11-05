let modelPromise;

function loadModel() {
  modelPromise ??= (async () => {
    if (!window.faceapi) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/vendor/face-api.min.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Chargement face-api impossible'));
        document.head.appendChild(script);
      });
    }
    const api = window.faceapi;
    // Keep this occasional inference off the WebGL backend used by MediaPipe.
    await api.tf.setBackend('cpu');
    await api.nets.faceRecognitionNet.loadFromUri('/models/face-recognition');
    return api;
  })().catch(error => {
    modelPromise = null;
    throw error;
  });
  return modelPromise;
}

export class FaceRecognition {
  constructor({ onCrop = () => {} } = {}) {
    this.onCrop = onCrop;
  }

  capturePortrait(video, tracking, { forComparison = false } = {}) {
    const pose = tracking.headPose || {};
    if (video.readyState < 2 || (forComparison
      && (Math.abs(pose.yaw || 0) > 20 || Math.abs(pose.pitch || 0) > 18))) return null;
    const landmarks = tracking.rawLandmarks || tracking.landmarks;
    if (!landmarks?.[454]) return null;
    const width = video.videoWidth, height = video.videoHeight;
    const minX = Math.min(...landmarks.slice(0, 468).map(p => p.x));
    const maxX = Math.max(...landmarks.slice(0, 468).map(p => p.x));
    const minY = Math.min(...landmarks.slice(0, 468).map(p => p.y));
    const maxY = Math.max(...landmarks.slice(0, 468).map(p => p.y));
    if ((maxX - minX) * width < 100 || minX < 0.02 || maxX > 0.98
      || minY < 0.02 || maxY > 0.98) return null;
    const eye = (a, b) => ({ x: (landmarks[a].x + landmarks[b].x) * width / 2,
      y: (landmarks[a].y + landmarks[b].y) * height / 2 });
    const eyes = [eye(33, 133), eye(362, 263)].sort((a, b) => a.x - b.x);
    const dx = eyes[1].x - eyes[0].x, dy = eyes[1].y - eyes[0].y;
    const eyeDistance = Math.hypot(dx, dy);
    if (eyeDistance < 30) return null;
    // Capture synchronously: landmarks and pixels must belong to the same frame,
    // even if loading weights takes several seconds on the first request.
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 150;
    const ctx = canvas.getContext('2d');
    const scale = 60 / eyeDistance;
    ctx.translate(75, 57);
    ctx.rotate(-Math.atan2(dy, dx));
    ctx.scale(scale, scale);
    ctx.translate(-(eyes[0].x + eyes[1].x) / 2, -(eyes[0].y + eyes[1].y) / 2);
    ctx.drawImage(video, 0, 0);
    this.onCrop(canvas);
    return canvas;
  }

  async describePortrait(portrait) {
    const api = await loadModel();
    return api.computeFaceDescriptor(portrait);
  }
}
