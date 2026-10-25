/**
 * Motion Capture Manager
 * Modular telemetry, recording, and streaming engine for 52 facial blendshapes, head pose, and 3D landmarks.
 */

export const BLENDSHAPE_CATEGORIES = {
  Eyes: [
    'eyeBlinkLeft', 'eyeBlinkRight', 'eyeWideLeft', 'eyeWideRight',
    'eyeSquintLeft', 'eyeSquintRight', 'eyeLookDownLeft', 'eyeLookDownRight',
    'eyeLookInLeft', 'eyeLookInRight', 'eyeLookOutLeft', 'eyeLookOutRight',
    'eyeLookUpLeft', 'eyeLookUpRight'
  ],
  Brows: [
    'browInnerUp', 'browDownLeft', 'browDownRight', 'browOuterUpLeft', 'browOuterUpRight'
  ],
  Jaw: [
    'jawOpen', 'jawForward', 'jawLeft', 'jawRight'
  ],
  Mouth: [
    'mouthSmileLeft', 'mouthSmileRight', 'mouthFrownLeft', 'mouthFrownRight',
    'mouthPucker', 'mouthFunnel', 'mouthLeft', 'mouthRight',
    'mouthClose', 'mouthDimpleLeft', 'mouthDimpleRight', 'mouthStretchLeft',
    'mouthStretchRight', 'mouthRollLower', 'mouthRollUpper', 'mouthShrugLower',
    'mouthShrugUpper', 'mouthPressLeft', 'mouthPressRight', 'mouthLowerDownLeft',
    'mouthLowerDownRight', 'mouthUpperUpLeft', 'mouthUpperUpRight'
  ],
  Cheeks_Nose: [
    'cheekPuff', 'cheekSquintLeft', 'cheekSquintRight', 'noseSneerLeft', 'noseSneerRight', 'tongueOut'
  ]
};

export class MocapManager extends EventTarget {
  constructor() {
    super();
    this.isRecording = false;
    this.recordedFrames = [];
    this.recordingStartTime = 0;
    this.ws = null;
    this.wsConnected = false;
    this.lastFrameData = null;
  }

  /**
   * Dispatches a live frame packet and records if recording is active
   */
  processFrame(trackingResult) {
    if (!trackingResult || !trackingResult.detected) return;

    const framePacket = {
      timestamp: trackingResult.timestamp,
      timeOffsetMs: this.isRecording ? (trackingResult.timestamp - this.recordingStartTime) : 0,
      headPose: {
        pitch: Number(trackingResult.headPose?.pitch?.toFixed(3) || 0),
        yaw: Number(trackingResult.headPose?.yaw?.toFixed(3) || 0),
        roll: Number(trackingResult.headPose?.roll?.toFixed(3) || 0),
        x: Number(trackingResult.headPose?.x?.toFixed(4) || 0),
        y: Number(trackingResult.headPose?.y?.toFixed(4) || 0),
        z: Number(trackingResult.headPose?.z?.toFixed(4) || 0)
      },
      blendshapes: trackingResult.blendshapes || {},
      landmarksCount: trackingResult.landmarks?.length || 0
    };

    this.lastFrameData = framePacket;

    // Dispatch event to listeners (e.g. 3D avatar, custom script, UI)
    this.dispatchEvent(new CustomEvent('frame', { detail: framePacket }));

    // Send to WebSocket if live streaming is active
    if (this.ws && this.wsConnected) {
      try {
        this.ws.send(JSON.stringify(framePacket));
      } catch (err) {
        console.warn('WebSocket send error:', err);
      }
    }

    // Buffer frame if recording
    if (this.isRecording) {
      this.recordedFrames.push(framePacket);
    }
  }

  startRecording() {
    this.recordedFrames = [];
    this.recordingStartTime = performance.now();
    this.isRecording = true;
    this.dispatchEvent(new CustomEvent('recording:start'));
  }

  stopRecording() {
    if (!this.isRecording) return null;
    this.isRecording = false;
    const durationSec = (performance.now() - this.recordingStartTime) / 1000;
    const summary = {
      frameCount: this.recordedFrames.length,
      durationSec: Number(durationSec.toFixed(2)),
      avgFps: Number((this.recordedFrames.length / Math.max(0.01, durationSec)).toFixed(1))
    };
    this.dispatchEvent(new CustomEvent('recording:stop', { detail: summary }));
    return summary;
  }

  /**
   * Export recorded motion capture animation sequence as JSON
   */
  exportJSON(filename = 'mocap_face_track.json') {
    if (this.recordedFrames.length === 0) {
      alert('No recorded motion capture data to export.');
      return;
    }

    const mocapData = {
      metadata: {
        version: '1.0',
        creator: 'Photomaton FaceMesh MoCap',
        date: new Date().toISOString(),
        totalFrames: this.recordedFrames.length,
        durationSeconds: this.recordedFrames.length > 0 
          ? (this.recordedFrames[this.recordedFrames.length - 1].timeOffsetMs / 1000) 
          : 0
      },
      frames: this.recordedFrames
    };

    const blob = new Blob([JSON.stringify(mocapData, null, 2)], { type: 'application/json' });
    this.downloadBlob(blob, filename);
  }

  /**
   * Export recorded motion capture as CSV (Blendshapes + Head Pose columns)
   */
  exportCSV(filename = 'mocap_face_track.csv') {
    if (this.recordedFrames.length === 0) {
      alert('No recorded motion capture data to export.');
      return;
    }

    const firstFrame = this.recordedFrames[0];
    const blendshapeKeys = Object.keys(firstFrame.blendshapes);

    const headers = [
      'TimeOffsetMs',
      'Pitch', 'Yaw', 'Roll',
      'PosX', 'PosY', 'PosZ',
      ...blendshapeKeys
    ];

    const rows = this.recordedFrames.map(f => {
      const bsValues = blendshapeKeys.map(k => (f.blendshapes[k] !== undefined ? f.blendshapes[k].toFixed(4) : '0'));
      return [
        f.timeOffsetMs.toFixed(1),
        f.headPose.pitch,
        f.headPose.yaw,
        f.headPose.roll,
        f.headPose.x,
        f.headPose.y,
        f.headPose.z,
        ...bsValues
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    this.downloadBlob(blob, filename);
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Optional Live WebSocket Stream Connector
   */
  connectWebSocket(url = 'ws://localhost:9000') {
    try {
      this.ws = new WebSocket(url);
      this.ws.onopen = () => {
        this.wsConnected = true;
        console.log(`[MoCap] Connected to live streaming socket at ${url}`);
        this.dispatchEvent(new CustomEvent('ws:connected', { detail: { url } }));
      };
      this.ws.onclose = () => {
        this.wsConnected = false;
        console.log('[MoCap] WebSocket disconnected');
        this.dispatchEvent(new CustomEvent('ws:disconnected'));
      };
      this.ws.onerror = (err) => {
        console.warn('[MoCap] WebSocket error:', err);
      };
    } catch (err) {
      console.error('[MoCap] Failed to initialize WebSocket:', err);
    }
  }

  disconnectWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.wsConnected = false;
    }
  }
}
