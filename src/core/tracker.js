/**
 * MediaPipe Face Landmarker & Motion Capture Tracker
 * Extracts 478 3D landmarks, 52 blendshapes, and 3D head pose matrices at 60 FPS using WebAssembly & GPU delegate.
 */
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import * as THREE from 'three';
import { MultiOneEuroFilter, OneEuroFilter } from '../mocap/oneEuroFilter.js';

// Oral & Mandibular Landmark Indices for Adaptive Micro-Jitter Suppression
const ORAL_LANDMARK_INDICES = [
  // Outer & inner lips
  0, 11, 12, 13, 14, 15, 16, 17, 37, 38, 39, 40, 41, 61, 72, 73, 74, 76, 77, 78, 80, 81, 82, 84, 85, 86, 87, 88,
  91, 95, 146, 178, 179, 180, 181, 185, 191, 267, 268, 269, 270, 271, 291, 302, 303, 304, 306, 307, 308, 310,
  311, 312, 314, 315, 316, 317, 318, 321, 324, 375, 402, 403, 404, 405, 409, 415,
  // Cupid's bow / philtrum
  164, 165, 167, 2,
  // Chin / mandible articulation
  152, 377, 148, 400, 176, 175, 171, 199, 200
];

export class FaceTracker {
  constructor(options = {}) {
    this.faceLandmarker = null;
    this.isReady = false;
    this.useSmoothing = options.smoothing !== false;
    
    // High-responsiveness 1€ filter for micro-expressions and lip sync
    // minCutoff = 1.0 (smooth when still), beta = 0.035 (zero lag on fast lip/eye motion)
    this.landmarkFilter = new MultiOneEuroFilter(478, 1.0, 0.035);
    this.pitchFilter = new OneEuroFilter(60, 1.0, 0.02);
    this.yawFilter = new OneEuroFilter(60, 1.0, 0.02);
    this.rollFilter = new OneEuroFilter(60, 1.0, 0.02);
    this.posXFilter = new OneEuroFilter(60, 1.0, 0.02);
    this.posYFilter = new OneEuroFilter(60, 1.0, 0.02);
    this.posZFilter = new OneEuroFilter(60, 1.0, 0.02);

    // Three.js matrix helper for head pose extraction
    this.matrixHelper = new THREE.Matrix4();
    this.eulerHelper = new THREE.Euler(0, 0, 0, 'YXZ');
    this.positionHelper = new THREE.Vector3();
    this.quaternionHelper = new THREE.Quaternion();
    this.scaleHelper = new THREE.Vector3();

    this.lastVideoTime = -1;
    this.inferenceLatencyMs = 0;
    this.irisSmoothed = new Array(10).fill(null);
    this.mouthSmoothed = new Map();
  }

  async init(onProgress = null) {
    const isBrowser = typeof window !== 'undefined';
    const origin = isBrowser ? window.location.origin : '';
    const localWasmUrl = origin ? `${origin}/wasm` : '/wasm';
    const cdnWasmUrl = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm';
    const localModelUrl = origin ? `${origin}/models/face_landmarker.task` : '/models/face_landmarker.task';
    const cdnModelUrl = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

    const createWithTimeout = (promise, ms, desc) => {
      return Promise.race([
        promise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`${desc} timed out after ${ms}ms`)), ms)
        )
      ]);
    };

    try {
      if (onProgress) onProgress('Loading MediaPipe Vision WASM binaries...');
      
      let filesetResolver = null;
      try {
        filesetResolver = await createWithTimeout(
          FilesetResolver.forVisionTasks(localWasmUrl),
          6000,
          'Local WASM load'
        );
      } catch (localWasmErr) {
        console.warn('Local WASM failed, falling back to CDN:', localWasmErr);
        if (onProgress) onProgress('Loading MediaPipe Vision WASM binaries (CDN fallback)...');
        filesetResolver = await createWithTimeout(
          FilesetResolver.forVisionTasks(cdnWasmUrl),
          20000,
          'CDN WASM binary load'
        );
      }

      if (onProgress) onProgress('Loading Face Landmarker neural model...');

      const tryCreateModel = async (modelPath) => {
        try {
          return await createWithTimeout(
            FaceLandmarker.createFromOptions(filesetResolver, {
              baseOptions: {
                modelAssetPath: modelPath,
                delegate: 'GPU'
              },
              outputFaceBlendshapes: true,
              outputFacialTransformationMatrixes: true,
              runningMode: 'VIDEO',
              numFaces: 1
            }),
            10000,
            'GPU model initialization'
          );
        } catch (gpuErr) {
          console.warn('GPU delegate failed or timed out, trying CPU delegate:', gpuErr);
          if (onProgress) onProgress('Loading neural model (CPU fallback)...');
          return await createWithTimeout(
            FaceLandmarker.createFromOptions(filesetResolver, {
              baseOptions: {
                modelAssetPath: modelPath,
                delegate: 'CPU'
              },
              outputFaceBlendshapes: true,
              outputFacialTransformationMatrixes: true,
              runningMode: 'VIDEO',
              numFaces: 1
            }),
            20000,
            'CPU model initialization'
          );
        }
      };

      try {
        this.faceLandmarker = await tryCreateModel(localModelUrl);
      } catch (localModelErr) {
        console.warn('Local model initialization failed, falling back to CDN model:', localModelErr);
        if (onProgress) onProgress('Loading neural model (CDN fallback)...');
        this.faceLandmarker = await tryCreateModel(cdnModelUrl);
      }

      this.isReady = true;
      if (onProgress) onProgress('Ready');
      return true;
    } catch (err) {
      console.error('Fatal error loading FaceLandmarker:', err);
      throw err;
    }
  }

  setSmoothing(enabled) {
    this.useSmoothing = enabled;
    if (!enabled) {
      this.landmarkFilter.reset();
      this.pitchFilter.reset();
      this.yawFilter.reset();
      this.rollFilter.reset();
      this.posXFilter.reset();
      this.posYFilter.reset();
      this.posZFilter.reset();
      this.irisSmoothed.fill(null);
      this.mouthSmoothed.clear();
    }
  }

  processVideoFrame(videoElement, timestampMs) {
    if (!this.isReady || !this.faceLandmarker || !videoElement || videoElement.readyState < 2) {
      return null;
    }

    if (videoElement.currentTime === this.lastVideoTime) {
      if (this.lastTrackingResult) {
        return {
          ...this.lastTrackingResult,
          isNewFrame: false,
          timestamp: timestampMs
        };
      }
      return null;
    }
    this.lastVideoTime = videoElement.currentTime;

    const start = performance.now();
    // Enforce strictly monotonic timestamp for MediaPipe detectForVideo
    this.lastInferenceTime = Math.max(timestampMs, (this.lastInferenceTime || 0) + 1);
    let results;
    try {
      results = this.faceLandmarker.detectForVideo(videoElement, this.lastInferenceTime);
    } catch (e) {
      console.warn('FaceLandmarker detectForVideo error:', e);
      return null;
    }
    this.inferenceLatencyMs = performance.now() - start;

    const formatted = this._formatTrackingResult(results, timestampMs);
    formatted.isNewFrame = true;
    this.lastTrackingResult = formatted;
    return formatted;
  }

  /**
   * Process a single video or canvas frame from an external source (e.g. uploaded video)
   * with strict monotonically increasing timestamp enforcement for MediaPipe.
   */
  processExternalFrame(element, timestampMs = 0) {
    if (!this.isReady || !this.faceLandmarker || !element) {
      return null;
    }

    const start = performance.now();
    this.lastInferenceTime = Math.max(timestampMs, (this.lastInferenceTime || 0) + 1);
    let results;
    try {
      results = this.faceLandmarker.detectForVideo(element, this.lastInferenceTime);
    } catch (e) {
      console.warn('External frame FaceLandmarker error:', e);
      return null;
    }
    this.inferenceLatencyMs = performance.now() - start;

    return this._formatTrackingResult(results, timestampMs);
  }

  _formatTrackingResult(results, timestampMs) {
    if (!results || !results.faceLandmarks || results.faceLandmarks.length === 0) {
      return {
        detected: false,
        latencyMs: this.inferenceLatencyMs
      };
    }

    const rawLandmarks = results.faceLandmarks[0];
    let landmarks = rawLandmarks;

    // Adaptive ocular saccade stabilizer for iris landmarks (468 to 477)
    // Eliminates micro-jitter when fixating, while preserving instantaneous saccades
    if (landmarks.length >= 478) {
      const stableLandmarks = landmarks.slice();
      for (let i = 468; i < 478; i++) {
        const rawPt = landmarks[i];
        const slot = i - 468;
        const prev = this.irisSmoothed[slot];

        if (!prev) {
          this.irisSmoothed[slot] = { x: rawPt.x, y: rawPt.y, z: rawPt.z || 0 };
        } else {
          const dist = Math.hypot(rawPt.x - prev.x, rawPt.y - prev.y);
          // Small jitter: high damping (alpha 0.35); intentional saccade: snap immediately (alpha 0.92)
          const alpha = dist < 0.003 ? 0.35 : 0.92;
          prev.x += (rawPt.x - prev.x) * alpha;
          prev.y += (rawPt.y - prev.y) * alpha;
          prev.z += ((rawPt.z || 0) - prev.z) * alpha;
        }

        stableLandmarks[i] = {
          x: this.irisSmoothed[slot].x,
          y: this.irisSmoothed[slot].y,
          z: this.irisSmoothed[slot].z,
          visibility: rawPt.visibility
        };
      }
      landmarks = stableLandmarks;
    }

    // Adaptive oral landmark stabilizer for lips, mouth aperture & jaw articulation
    // Suppresses sensor trembling when resting/still (alpha ~0.35) while preserving 100% velocity on speech
    if (this.useSmoothing && landmarks.length >= 468) {
      const oralStable = landmarks === rawLandmarks ? landmarks.slice() : landmarks;
      for (let k = 0; k < ORAL_LANDMARK_INDICES.length; k++) {
        const idx = ORAL_LANDMARK_INDICES[k];
        const rawPt = oralStable[idx];
        if (!rawPt) continue;

        const prev = this.mouthSmoothed.get(idx);
        if (!prev) {
          this.mouthSmoothed.set(idx, { x: rawPt.x, y: rawPt.y, z: rawPt.z || 0 });
        } else {
          const dist = Math.hypot(rawPt.x - prev.x, rawPt.y - prev.y);
          // Micro-jitter threshold: if movement is tiny (< 0.003), smooth with 0.35.
          // If active articulation (speech, smile, jaw open), ramp up to 0.96 for zero lag.
          const alpha = dist < 0.003 ? 0.35 : 0.96;
          prev.x += (rawPt.x - prev.x) * alpha;
          prev.y += (rawPt.y - prev.y) * alpha;
          prev.z += ((rawPt.z || 0) - prev.z) * alpha;

          oralStable[idx] = {
            x: prev.x,
            y: prev.y,
            z: prev.z,
            visibility: rawPt.visibility
          };
        }
      }
      landmarks = oralStable;
    }

    // Process Blendshapes
    const blendshapesMap = {};
    const rawBlendshapes = results.faceBlendshapes?.[0]?.categories || [];
    for (let i = 0; i < rawBlendshapes.length; i++) {
      const item = rawBlendshapes[i];
      blendshapesMap[item.categoryName] = item.score;
    }

    // Process 3D Head Pose
    let headPose = {
      pitch: 0,
      yaw: 0,
      roll: 0,
      x: 0,
      y: 0,
      z: 0,
      matrix: null
    };

    if (results.facialTransformationMatrixes && results.facialTransformationMatrixes.length > 0) {
      const rawMatrix = results.facialTransformationMatrixes[0].data || results.facialTransformationMatrixes[0];
      this.matrixHelper.fromArray(rawMatrix);
      this.matrixHelper.decompose(this.positionHelper, this.quaternionHelper, this.scaleHelper);
      this.eulerHelper.setFromQuaternion(this.quaternionHelper, 'YXZ');

      let pitchDeg = THREE.MathUtils.radToDeg(this.eulerHelper.x);
      let yawDeg = THREE.MathUtils.radToDeg(this.eulerHelper.y);
      let rollDeg = THREE.MathUtils.radToDeg(this.eulerHelper.z);

      let posX = this.positionHelper.x;
      let posY = this.positionHelper.y;
      let posZ = this.positionHelper.z;

      if (this.useSmoothing) {
        pitchDeg = this.pitchFilter.filter(pitchDeg, timestampMs);
        yawDeg = this.yawFilter.filter(yawDeg, timestampMs);
        rollDeg = this.rollFilter.filter(rollDeg, timestampMs);
        posX = this.posXFilter.filter(posX, timestampMs);
        posY = this.posYFilter.filter(posY, timestampMs);
        posZ = this.posZFilter.filter(posZ, timestampMs);
      }

      headPose = {
        pitch: pitchDeg,
        yaw: yawDeg,
        roll: rollDeg,
        x: posX,
        y: posY,
        z: posZ,
        matrix: rawMatrix
      };
    }

    return {
      detected: true,
      timestamp: timestampMs,
      latencyMs: this.inferenceLatencyMs,
      landmarks,
      rawLandmarks,
      blendshapes: blendshapesMap,
      headPose
    };
  }
}
