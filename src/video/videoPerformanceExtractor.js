/**
 * Video Facial Performance & Audio Extractor
 * 
 * Ingests an uploaded video file, decodes the embedded audio track via Web Audio API,
 * and extracts 3D facial expressions and 6-DoF rigid head movement compensation frame-by-frame
 * using MediaPipe Vision WASM in head-local coordinate space.
 */

import { resolveLipContact } from '../mocap/cranialCoordinateSystem.js';

export class VideoPerformanceExtractor {
  constructor(options = {}) {
    this.targetFps = options.fps || 30;
    this.maxDurationSec = options.maxDuration || 35.0; // Up to 35 seconds of performance
    this.isCancelled = false;
  }

  cancel() {
    this.isCancelled = true;
  }

  /**
   * Extracts facial performance frames and audio from a video file.
   * 
   * @param {File} file - Uploaded video File object
   * @param {import('../core/tracker.js').FaceTracker} tracker - Active FaceTracker
   * @param {import('../mocap/cranialCoordinateSystem.js').CranialCoordinateSystem} cranial - Cranial system
   * @param {import('../audio/audioLooper.js').AudioLooper} audioLooper - Audio looper instance
   * @param {Function} onProgress - Callback ({ percent, message, frame, totalFrames })
   * @returns {Promise<{ frames: Array, durationMs: number, audioBuffer: AudioBuffer|null, aspectRatio: number }>}
   */
  async extract(file, tracker, cranial, audioLooper, onProgress = null) {
    this.isCancelled = false;

    if (!file) {
      throw new Error('No video file provided');
    }

    if (onProgress) {
      onProgress({ percent: 2, message: 'Lecture du fichier et décodage audio...', frame: 0, totalFrames: 0 });
    }

    // 1. Extract and decode audio track
    let audioBuffer = null;
    try {
      const audioCtx = await audioLooper.ensureAudioContext();
      const arrayBuffer = await file.arrayBuffer();
      // Pass a copy so it doesn't detach if reused
      audioBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
      console.log(`Audio extracted from video: ${audioBuffer.duration.toFixed(2)}s, ${audioBuffer.numberOfChannels} ch, ${audioBuffer.sampleRate}Hz`);
    } catch (audioErr) {
      console.warn('Video has no decodable audio track or format not supported:', audioErr);
      audioBuffer = null;
    }

    if (this.isCancelled) throw new Error('Extraction cancelled');

    if (onProgress) {
      onProgress({ percent: 8, message: 'Chargement de la vidéo...', frame: 0, totalFrames: 0 });
    }

    // 2. Initialize offscreen video element
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.crossOrigin = 'anonymous';

    const videoUrl = URL.createObjectURL(file);
    video.src = videoUrl;

    try {
      await new Promise((resolve, reject) => {
        const onLoaded = () => {
          video.removeEventListener('loadedmetadata', onLoaded);
          video.removeEventListener('error', onError);
          resolve();
        };
        const onError = (e) => {
          video.removeEventListener('loadedmetadata', onLoaded);
          video.removeEventListener('error', onError);
          reject(new Error('Failed to load video file: Unsupported codec or format'));
        };
        video.addEventListener('loadedmetadata', onLoaded);
        video.addEventListener('error', onError);
      });

      const videoDuration = Math.min(video.duration || 10, this.maxDurationSec);
      if (videoDuration <= 0.1 || !isFinite(videoDuration)) {
        throw new Error('Invalid video duration');
      }

      const aspectRatio = (video.videoWidth || 1280) / (video.videoHeight || 720);
      cranial.setAspectRatio(aspectRatio);

      const step = 1.0 / this.targetFps;
      const totalFrames = Math.max(2, Math.floor(videoDuration * this.targetFps));
      const frames = [];

      let lastValidLocal = null;
      let lastValidBlendshapes = null;
      let lastValidHeadPose = null;

      // Function to seek video to time t and wait for render
      const seekTo = (t) => {
        return new Promise((resolve) => {
          let done = false;
          const onSeeked = () => {
            if (!done) {
              done = true;
              video.removeEventListener('seeked', onSeeked);
              resolve();
            }
          };
          video.addEventListener('seeked', onSeeked, { once: true });
          video.currentTime = Math.max(0, Math.min(t, video.duration - 0.001));

          // 350ms safety timeout to prevent hanging on keyframe stalls
          setTimeout(() => {
            if (!done) {
              done = true;
              video.removeEventListener('seeked', onSeeked);
              resolve();
            }
          }, 350);
        });
      };

      if (onProgress) {
        onProgress({
          percent: 10,
          message: `Extraction des expressions (0 / ${totalFrames})...`,
          frame: 0,
          totalFrames
        });
      }

      // 3. Process video frame-by-frame
      for (let i = 0; i < totalFrames; i++) {
        if (this.isCancelled) {
          throw new Error('Extraction cancelled');
        }

        const t = i * step;
        await seekTo(t);

        const timestampMs = Math.round(t * 1000);
        const tracking = tracker.processExternalFrame(video, timestampMs);

        if (tracking && tracking.detected && tracking.landmarks) {
          const rawRigid = cranial.extractRigidFrame(tracking.landmarks);
          if (rawRigid) {
            const rigid = cranial.smoothRigidFrame(rawRigid, true);
            const local = cranial.toLocalCoordinates(tracking.landmarks, rigid);
            resolveLipContact(local);

            lastValidLocal = local;
            lastValidBlendshapes = tracking.blendshapes;
            lastValidHeadPose = tracking.headPose ? { ...tracking.headPose } : null;

            frames.push({
              timeOffsetMs: timestampMs,
              localCoords: local,
              blendshapes: tracking.blendshapes,
              headPose: tracking.headPose ? { ...tracking.headPose } : null
            });
          }
        } else if (lastValidLocal) {
          // Continuity imputation if face is temporarily obscured
          frames.push({
            timeOffsetMs: timestampMs,
            localCoords: lastValidLocal.map(p => ({ x: p.x, y: p.y, z: p.z })),
            blendshapes: { ...lastValidBlendshapes },
            headPose: lastValidHeadPose ? { ...lastValidHeadPose } : null
          });
        }

        const pct = Math.min(95, Math.round(10 + (i / totalFrames) * 85));
        if (onProgress && (i % 2 === 0 || i === totalFrames - 1)) {
          onProgress({
            percent: pct,
            message: `Extraction des expressions (${i + 1} / ${totalFrames})...`,
            frame: i + 1,
            totalFrames
          });
        }
      }

      if (frames.length < 2) {
        throw new Error('No face detected in video. Ensure the face is clearly visible.');
      }

      if (onProgress) {
        onProgress({
          percent: 100,
          message: 'Optimisation du bouclage et lissage 5-tap...',
          frame: totalFrames,
          totalFrames
        });
      }

      const finalDurationMs = videoDuration * 1000;

      return {
        frames,
        durationMs: finalDurationMs,
        audioBuffer,
        aspectRatio
      };

    } finally {
      // 4. Clean up resources
      URL.revokeObjectURL(videoUrl);
      video.src = '';
      video.load();
    }
  }
}
