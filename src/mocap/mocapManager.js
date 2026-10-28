/**
 * Motion Capture Manager
 * Modular telemetry and streaming engine for 52 facial blendshapes, head pose, and 3D landmarks.
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
    this.ws = null;
    this.wsConnected = false;
    this.lastFrameData = null;
  }

  /**
   * Dispatches and streams a live frame packet
   */
  processFrame(trackingResult) {
    if (!trackingResult || !trackingResult.detected) return;

    const framePacket = {
      timestamp: trackingResult.timestamp,
      timeOffsetMs: 0,
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
