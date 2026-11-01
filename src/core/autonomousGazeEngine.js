/** Manual Face Cap preset playback, with a held pose when no clip is available. */

import * as THREE from 'three';
import { CranialCoordinateSystem } from '../mocap/cranialCoordinateSystem.js';
import { PresetAudioLipSync } from '../audio/presetAudioLipSync.js';
import { deformMouth, closeRestingMouth } from '../mocap/mouthDeformer.js';
import { canonicalVertices } from './canonicalFaceGeometry.js';
import { createFaceCapPresetFrame, interpolateMetricPose, usesRecordedPosition, isFaceCapClip, getPresetPlaybackPhase } from './faceCapPreset.js';
import { FACE_HANDOFF_DURATION_MS } from './faceCapRig.js';

// Keep the face centered while allowing a little movement in depth.
const AUTONOMOUS_LATERAL_TRANSLATION_SCALE = 0;
const AUTONOMOUS_DEPTH_TRANSLATION_SCALE = 0.35;
const MAX_AUTONOMOUS_YAW = 42;
const HEAD_POSE_INDICES = [10, 33, 133, 152, 234, 263, 362, 454];

export class AutonomousGazeEngine extends EventTarget {
  constructor() {
    super();

    // Mode & Presence State
    this.isActive = false;
    this.hasSeenFace = false;
    this.isMirrored = true;
    this.presetExpressionIntensity = 1;

    // Base face geometry for UV mapping & deformation
    this.baseLandmarks = null;
    this.lastHeadPose = null;

    // Last generated autonomous landmarks & pose for seamless return-to-live handoff
    this.lastAutonomousLandmarks = null;
    this.lastAutonomousHeadPose = null;

    // Gaze targets (Points of Interest in normalized screen space [-1, 1])
    this.currentGaze = { x: 0, y: 0 };
    this.targetGaze = { x: 0, y: 0 };
    this.fromGaze = { x: 0, y: 0 };
    this.saccadeStartTime = 0;
    this.saccadeDuration = 65;
    this.isSaccading = false;

    // Head orientation targets (degrees)
    this.currentHead = { pitch: 0, yaw: 0, roll: 0 };
    this.targetHead = { pitch: 0, yaw: 0, roll: 0 };
    this.currentDamping = 0.038;
    this.targetDamping = 0.038;
    this.nextPOITime = 0;

    // Head translation targets (normalized screen space X, Y, and depth Z)
    this.currentTrans = { x: 0, y: 0, z: 0 };
    this.targetTrans = { x: 0, y: 0, z: 0 };
    this.transDamping = 0.032;

    // Smooth organic ease-in transition from user's last position to center
    this.isTransitioningToAutonomous = false;
    this.transToAutoStartTime = 0;
    this.transToAutoDuration = 850;
    this.transFromLandmarks = null;

    // Rhythm state
    this.currentRhythmMode = 'SOFT_SIDE_GLANCE';
    this.consecutiveOffCenterLooks = 0;
    this.doubleSaccadePending = false;
    this.doubleSaccadeTarget = null;
    this.doubleSaccadeTime = 0;

    // Procedural Facial Expressions State (exaggerated inquisitive, searching, and communicative expressions)
    this.currentProceduralExpressions = {
      jawOpen: 0,
      smileL: 0,
      smileR: 0,
      browL: 0,
      browR: 0,
      pucker: 0
    };
    this.targetProceduralExpressions = {
      jawOpen: 0,
      smileL: 0,
      smileR: 0,
      browL: 0,
      browR: 0,
      pucker: 0
    };

    // Eyebrows animation state
    this.browPulseTime = 0;
    this.browPulseIntensity = 0;

    // Blinking
    this.isBlinking = false;
    this.blinkStartTime = 0;
    this.blinkDuration = 150;
    this.nextBlinkTime = performance.now() + 2500;

    // Helpers
    this.matrixHelper = new THREE.Matrix4();
    this.eulerHelper = new THREE.Euler(0, 0, 0, 'YXZ');
    this.rotVec = new THREE.Vector3();
    this.cranial = new CranialCoordinateSystem();

    // Complete anatomical eye contour & socket loops for natural full eyelid closure (creux de l'œil)
    // Ordered from outer canthus to inner canthus (9 matched corresponding vertex pairs per eye):
    this.EYE_R_UPPER = [33, 246, 161, 160, 159, 158, 157, 173, 133];
    this.EYE_R_LOWER = [33, 7, 163, 144, 145, 153, 154, 155, 133];
    this.EYE_R_CREASE = [22, 23, 24, 110, 25]; // Supratarsal fold / orbital socket upper margin

    this.EYE_L_UPPER = [263, 466, 388, 387, 386, 385, 384, 398, 362];
    this.EYE_L_LOWER = [263, 249, 390, 373, 374, 380, 381, 382, 362];
    this.EYE_L_CREASE = [252, 253, 254, 339, 255]; // Supratarsal fold / orbital socket upper margin

    // Backward-compat aliases
    this.EYELID_R_TOP = this.EYE_R_UPPER;
    this.EYELID_R_BOT = this.EYE_R_LOWER;
    this.EYELID_L_TOP = this.EYE_L_UPPER;
    this.EYELID_L_BOT = this.EYE_L_LOWER;

    // Eyebrow landmark sets (MediaPipe FaceMesh topology)
    this.EYEBROW_R = new Set([70, 63, 105, 66, 107, 55, 65, 52, 53, 46]);
    this.EYEBROW_L = new Set([300, 293, 334, 296, 336, 285, 295, 282, 283, 276]);
    this.presetEyeIndices = new Set([...this.EYE_R_UPPER, ...this.EYE_R_LOWER,
      ...this.EYE_L_UPPER, ...this.EYE_L_LOWER, ...this.EYE_R_CREASE, ...this.EYE_L_CREASE]);
    this.presetLipIndices = new Set([0, 11, 12, 13, 14, 15, 16, 17, 37, 39, 40,
      61, 76, 77, 78, 80, 81, 82, 84, 85, 86, 87, 88, 91, 95, 146, 178, 179, 180, 181,
      267, 269, 270, 291, 306, 307, 308, 310, 311, 312, 314, 315, 316, 317, 318, 321, 324, 375, 402, 403, 405]);
    this.presetJawIndices = new Set([18, 148, 149, 150, 152, 175, 176, 199, 200, 377, 378, 379, 400]);

    // =========================================================================
    // Recorded Animation Playback & Frequency Switcher System
    // =========================================================================
    this.animLibrary = null;
    this.autonomousSubMode = 'HOLD'; // 'HOLD' or 'RECORDED_ANIM'
    this.activeAnimation = null;
    this.animStartTime = 0;
    this.animFadeDuration = 600;
    this.nextAnimationDecisionTime = 0;
    this.lastPlayedAnimName = '';
    this.consecutiveProceduralCycles = 0;

    // Web Audio hardware-accurate playback for 0-latency lip-sync
    this.audioCtx = null;
    this.audioGainNode = null;
    this.activeAudioSource = null;
    this.audioPlaybackStartTime = 0;
    this.audioPlaybackPerfNow = 0;
    this.currentAudio = null; // Legacy HTMLAudioElement fallback
    this.audioDelaySec = 2.2; // Default audio delay / offset in seconds (range: 0s to 4s)
    this.presetAudio = new PresetAudioLipSync();

    // Exact rendered state on the last generated frame (used for mathematically seamless handoffs)
    this.lastRenderedPitch = 0;
    this.lastRenderedYaw = 0;
    this.lastRenderedRoll = 0;
    this.lastRenderedTransX = 0;
    this.lastRenderedTransY = 0;
    this.lastRenderedTransZ = 0;
    this.lastRenderedGazeX = 0;
    this.lastRenderedGazeY = 0;
    this.lastRenderedLandmarks = null;
    this.lastPoseLandmarks = null;
    this.nextAudioStartTime = 0;

    // Anchor state captured at the exact moment an animation playback is initiated
    this.animTransitionFrom = null;

    // Procedural ease-in system (smoothly fades in breathing, wiggle, and sway when exiting animations)
    this.isFadingInProcedural = false;
    this.proceduralFadeStartTime = 0;
    this.proceduralFadeDuration = 800;

    // Legacy pose & translation cache
    this.lastEffHeadPose = { pitch: 0, yaw: 0, roll: 0 };
    this.lastEffTrans = { x: 0, y: 0, z: 0 };
    this.animEntryHead = { pitch: 0, yaw: 0, roll: 0 };
    this.animEntryTrans = { x: 0, y: 0, z: 0 };

    // Rigid skull vault, temples & ear landmarks (0% deformation: preserves visitor skull shape)
    this.rigidSkull = new Set([
      10, 21, 54, 58, 67, 93, 103, 109, 127, 234, 251, 284, 288, 297, 323, 332, 338, 356, 454,
      168, 6, 133, 362
    ]);

    // Mandible & lower jawline (articulates vertically & depth with jaw opening and speech)
    this.mandible = new Set([
      132, 136, 148, 149, 150, 152, 172, 175, 176, 199, 200, 361, 365, 377, 378, 379, 400
    ]);

    this.ring1 = new Set([
      34, 68, 69, 71, 104, 108, 135, 137, 138, 139, 140, 151, 169, 170, 171, 177,
      215, 227, 264, 298, 299, 301, 333, 337, 364, 366, 367, 368, 369, 394,
      395, 396, 401, 435, 447
    ]);
  }

  setAudioContext(ctx) {
    this.audioCtx = ctx;
    if (this.audioCtx && !this.audioGainNode) {
      try {
        this.audioGainNode = this.audioCtx.createGain();
        this.audioGainNode.gain.setValueAtTime(0.95, this.audioCtx.currentTime);
        this.audioGainNode.connect(this.audioCtx.destination);
      } catch (e) {
        console.warn('[AutonomousGaze] GainNode setup error:', e);
      }
    }
  }

  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = typeof window !== 'undefined' ? (window.AudioContext || window.webkitAudioContext) : null;
      if (AudioCtxClass) {
        this.setAudioContext(new AudioCtxClass());
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  setAnimationLibrary(animLibrary) {
    this.animLibrary = animLibrary;
  }

  setPresetExpressionIntensity(value) {
    if (Number.isFinite(value)) this.presetExpressionIntensity = Math.max(0.5, Math.min(2.2, value));
  }

  amplifyPresetExpressions(neutral, expressive, preserveSpeech = false) {
    if (!expressive || this.presetExpressionIntensity === 1) return expressive;
    const extra = this.presetExpressionIntensity - 1;
    for (let i = 0; i < expressive.length; i++) {
      const base = neutral[i], point = expressive[i];
      if (!base || !point) continue;
      let horizontal = 1, vertical = 1, depth = 1;
      if (this.EYEBROW_R.has(i) || this.EYEBROW_L.has(i)) {
        horizontal += extra * 0.6;
        vertical += extra;
      } else if (this.presetEyeIndices.has(i)) {
        vertical += extra * 0.6;
      } else if (!preserveSpeech && this.presetLipIndices.has(i)) {
        // Emphasize the smile's lift more than its width.
        horizontal += extra * 0.15;
        // Stronger expressions lift a smile without pulling the lower lip down.
        vertical += extra * (point.y > base.y ? 0 : 0.85);
        depth += extra * 0.4;
      } else if (!preserveSpeech && this.presetJawIndices.has(i)) {
        vertical += extra * (point.y > base.y ? 0 : 0.10);
        depth += extra * 0.25;
      } else continue;
      point.x = base.x + (point.x - base.x) * horizontal;
      point.y = base.y + (point.y - base.y) * vertical;
      point.z = (base.z || 0) + ((point.z || 0) - (base.z || 0)) * depth;
    }
    return expressive;
  }

  async setPresetAudioEnabled(enabled) {
    const context = enabled ? this.ensureAudioContext() : this.audioCtx;
    await this.presetAudio.setEnabled(enabled, context, this.audioGainNode);
    if (enabled && this.presetAudio.enabled && this.isActive) {
      this.scheduleNextPresetAudio(performance.now());
    }
  }

  async setPresetAudioTracks(urls) {
    await this.presetAudio.setTracks(urls);
    if (this.isActive && this.presetAudio.enabled && !this.presetAudio.durationMs) {
      this.scheduleNextPresetAudio(performance.now());
    }
  }

  getAnimationElapsed(now) {
    return now - this.animStartTime;
  }

  scheduleNextPresetAudio(now) {
    this.nextAudioStartTime = now + 10000 + Math.random() * 5000;
  }

  updatePresetAudioPlayback(now) {
    const audio = this.presetAudio;
    if (!this.isActive || !this.baseLandmarks?.length || !audio.enabled || audio.previewing) return;
    if (this.activeAnimation?.hasAudio || this.activeAnimation?.audioData || this.activeAnimation?._audioBuffer) return;
    if (audio.durationMs) {
      if (audio.elapsedMs < audio.playbackDurationMs) return;
      audio.stop();
      this.scheduleNextPresetAudio(now);
    } else if (now >= this.nextAudioStartTime) {
      const choices = audio.urls.map((url, index) => ({ url, index }))
        .filter(track => audio.urls.length === 1 || track.url !== audio.url);
      if (choices.length) audio.nextTrackIndex = choices[Math.floor(Math.random() * choices.length)].index;
      if (!audio.play()) this.nextAudioStartTime = now + 500;
    }
  }

  getAudioPlaybackStatus() {
    const audio = this.presetAudio;
    if (audio.durationMs && audio.context?.state === 'running' && audio.elapsedMs < audio.playbackDurationMs) {
      return { label: decodeURIComponent(audio.url.split('/').pop()), playing: true };
    }
    const source = this.activeAudioSource;
    if (source?.buffer && this.audioCtx?.state === 'running'
      && this.audioCtx.currentTime >= this.audioPlaybackStartTime
      && this.audioCtx.currentTime < this.audioPlaybackStartTime + source.buffer.duration) {
      return { label: this.activeAnimation?.audioFilename || this.activeAnimation?.name || 'Audio enregistré', playing: true };
    }
    return { label: audio.enabled || this.activeAnimation?.hasAudio ? 'En attente' : 'Désactivé', playing: false };
  }

  getAnimationDuration(anim) {
    const recordedAudioMs = anim._audioBuffer
      ? (this.audioDelaySec ?? 2.2) * 1000 + anim._audioBuffer.duration * 1000 : 0;
    return Math.max(anim.durationMs, recordedAudioMs);
  }

  setMirrored(isMirrored) {
    this.isMirrored = !!isMirrored;
  }

  setAspectRatio(ar) {
    this.cranial.setAspectRatio(ar);
  }

  setAudioDelay(delaySec) {
    this.audioDelaySec = Math.max(0.0, Math.min(4.0, Number(delaySec) || 0));
  }

  getCurrentSubMode() {
    return this.autonomousSubMode;
  }

  getActiveAnimationName() {
    return this.activeAnimation ? this.activeAnimation.name : null;
  }

  /**
   * Reset autonomous memory completely upon new face detection
   */
  resetAutonomousMemory() {
    this.stopAudio();
    this.baseLandmarks = null;
    this.lastHeadPose = null;
    this.lastAutonomousLandmarks = null;
    this.lastAutonomousHeadPose = null;
    this.lastPoseLandmarks = null;
    this.hasSeenFace = false;
    this.currentHead = { pitch: 0, yaw: 0, roll: 0 };
    this.targetHead = { pitch: 0, yaw: 0, roll: 0 };
    this.currentTrans = { x: 0, y: 0, z: 0 };
    this.targetTrans = { x: 0, y: 0, z: 0 };
    this.currentGaze = { x: 0, y: 0 };
    this.targetGaze = { x: 0, y: 0 };
    this.fromGaze = { x: 0, y: 0 };
    this.isSaccading = false;
    this.isTransitioningToAutonomous = false;
    this.transFromLandmarks = null;

    // Reset animation playback state
    if (this.currentAudio) {
      try { this.currentAudio.pause(); } catch (e) {}
      this.currentAudio = null;
    }
    this.autonomousSubMode = 'HOLD';
    this.activeAnimation = null;
    this.lastPlayedAnimName = '';
    this.consecutiveProceduralCycles = 0;
  }

  /**
   * Explicitly set pristine frontal base landmarks from the cleanest captured frame
   */
  setBaseLandmarks(lms) {
    if (!lms) {
      this.baseLandmarks = null;
      return;
    }
    this.baseLandmarks = lms.map(pt => ({
      x: pt.x,
      y: pt.y,
      z: pt.z || 0,
      visibility: pt.visibility
    }));
    this.hasSeenFace = true;
  }

  /**
   * Update live face state while user is present
   */
  updateLiveFace(trackingResult) {
    if (!trackingResult || !trackingResult.detected || !trackingResult.landmarks) return;

    this.hasSeenFace = true;
    this.lastLiveBlendshapes = { ...trackingResult.blendshapes };
    if (trackingResult.headPose) {
      this.lastHeadPose = { ...trackingResult.headPose };
    }
  }

  /**
   * Trigger transition into autonomous mode with smooth ease-in glide to center
   */
  startAutonomous(now = performance.now(), initialLandmarks = null, initialHeadPose = null) {
    this.stopAudio();
    this.isActive = true;
    this.lastAutonomousFrame = null;
    this.entryHeadPose = initialHeadPose || this.lastHeadPose;
    this.entryBlendshapes = { ...this.lastLiveBlendshapes };
    this.activeAnimation = null;
    this.autonomousSubMode = 'HOLD';
    this.isTransitioningToAutonomous = false;
    this.lastRenderedLandmarks = initialLandmarks || this.baseLandmarks;
    this.lastPoseLandmarks = this.lastRenderedLandmarks;
    this.scheduleNextPresetAudio(now);
  }

  /**
   * Stop autonomous mode
   */
  stopAutonomous() {
    this.isActive = false;
    this.isTransitioningToAutonomous = false;
    this.stopAudio();
    this.autonomousSubMode = 'HOLD';
    this.activeAnimation = null;
    this.consecutiveProceduralCycles = 0;
  }

  stopAudio() {
    this.presetAudio.stop();
    this.stopRecordedAudio();
  }

  stopRecordedAudio() {
    if (this.activeAudioSource) {
      try {
        this.activeAudioSource.stop();
        this.activeAudioSource.disconnect();
      } catch (e) {}
      this.activeAudioSource = null;
    }
    if (this.currentAudio) {
      try { this.currentAudio.pause(); } catch (e) {}
      this.currentAudio = null;
    }
  }

  /**
   * Manually trigger an animation playback (e.g. from UI preview or test)
   */
  playAnimation(anim, now = performance.now()) {
    if (!anim || !anim.frames || anim.frames.length === 0) return false;
    this.startAnimationPlayback(anim, now);
    return true;
  }

  startAnimationPlayback(anim, now) {
    this.continuousPresetHandoff = Boolean(this.lastAutonomousFrame);
    this.stopRecordedAudio();
    if (anim.hasAudio || anim.audioData || anim._audioBuffer) this.presetAudio.stop();
    if (anim.hasAudio || anim.audioData || anim._audioBuffer || this.presetAudio.enabled) this.ensureAudioContext();

    const delaySec = Math.max(0, Math.min(4.0, this.audioDelaySec ?? 2.2))
      + (this.continuousPresetHandoff ? 0 : FACE_HANDOFF_DURATION_MS / 1000);

    // Start sub-millisecond audio playback via Web Audio API AudioBufferSourceNode with delay offset
    if (anim._audioBuffer && this.audioCtx && !this.presetAudio.previewing) {
      try {
        const source = this.audioCtx.createBufferSource();
        source.buffer = anim._audioBuffer;
        source.connect(this.audioGainNode);
        const startTime = this.audioCtx.currentTime + delaySec;
        source.start(startTime);
        this.activeAudioSource = source;
        this.audioPlaybackStartTime = startTime;
        this.audioPlaybackPerfNow = now + (delaySec * 1000.0);
      } catch (e) {
        console.warn('[AutonomousGaze] Web Audio buffer playback error:', e);
      }
    } else if (anim.hasAudio && anim.audioData && !this.presetAudio.previewing) {
      if (this.animLibrary) {
        this.animLibrary.decodeAudioBuffer(anim).then(buf => {
          if (buf && this.activeAnimation === anim && this.audioCtx && !this.presetAudio.previewing) {
            try {
              const source = this.audioCtx.createBufferSource();
              source.buffer = buf;
              source.connect(this.audioGainNode);
              const curElapsedSec = Math.max(0, (performance.now() - this.animStartTime) / 1000.0);
              if (curElapsedSec < delaySec) {
                const remainingDelay = delaySec - curElapsedSec;
                const startTime = this.audioCtx.currentTime + remainingDelay;
                source.start(startTime, 0);
                this.activeAudioSource = source;
                this.audioPlaybackStartTime = startTime;
              } else {
                const audioOffset = curElapsedSec - delaySec;
                if (audioOffset < buf.duration) {
                  const startTime = this.audioCtx.currentTime;
                  source.start(startTime, audioOffset);
                  this.activeAudioSource = source;
                  this.audioPlaybackStartTime = startTime - audioOffset;
                }
              }
            } catch (err) {
              console.warn('[AutonomousGaze] Late audio start error:', err);
            }
          }
        });
      }
    }

    // Compute or cache the clip's neutral reference head pose
    if (!anim._baselineHeadPose) {
      let refHead = null;
      if (anim.referenceHeadPose) {
        refHead = { ...anim.referenceHeadPose };
      } else if (anim.referenceLocal && anim.frames && anim.frames.length > 0) {
        let minDiff = Infinity;
        for (let f = 0; f < anim.frames.length; f++) {
          const frm = anim.frames[f];
          if (!frm.localCoords || !frm.headPose) continue;
          let diff = 0;
          const testIndices = [13, 14, 1, 33, 263, 61, 291];
          for (let k = 0; k < testIndices.length; k++) {
            const idx = testIndices[k];
            const p1 = frm.localCoords[idx];
            const p0 = anim.referenceLocal[idx];
            if (p1 && p0) diff += Math.hypot(p1.x - p0.x, p1.y - p0.y);
          }
          if (diff < minDiff) {
            minDiff = diff;
            refHead = frm.headPose;
          }
        }
      }
      if (!refHead && anim.frames) {
        let sumP = 0, sumY = 0, sumR = 0, sumX = 0, sumY_t = 0, sumZ = 0, cnt = 0;
        for (let f = 0; f < anim.frames.length; f++) {
          const hp = anim.frames[f].headPose;
          if (hp) {
            sumP += hp.pitch || 0;
            sumY += hp.yaw || 0;
            sumR += hp.roll || 0;
            sumX += hp.x || 0;
            sumY_t += hp.y || 0;
            sumZ += hp.z || 0;
            cnt++;
          }
        }
        if (cnt > 0) {
          refHead = {
            pitch: sumP / cnt,
            yaw: sumY / cnt,
            roll: sumR / cnt,
            x: sumX / cnt,
            y: sumY_t / cnt,
            z: sumZ / cnt
          };
        }
      }
      anim._baselineHeadPose = refHead || { pitch: 0, yaw: 0, roll: 0, x: 0, y: 0, z: 0 };
    }

    // Capture EXACT on-screen state from the frame immediately preceding playback
    this.animTransitionFrom = {
      head: {
        pitch: this.lastRenderedPitch || 0,
        yaw: this.lastRenderedLandmarks ? this.lastRenderedYaw : this.currentHead.yaw,
        roll: this.lastRenderedRoll || 0
      },
      trans: {
        x: this.lastRenderedTransX || 0,
        y: this.lastRenderedTransY || 0,
        z: this.lastRenderedTransZ || 0
      },
      gaze: {
        x: this.lastRenderedGazeX || 0,
        y: this.lastRenderedGazeY || 0
      },
      landmarks: this.lastRenderedLandmarks ? this.lastRenderedLandmarks.map(p => ({ ...p })) : null,
      poseLandmarks: this.lastPoseLandmarks ? this.lastPoseLandmarks.map(p => ({ ...p })) : null
    };

    this.animEntryHead = { ...this.animTransitionFrom.head };
    this.animEntryTrans = { ...this.animTransitionFrom.trans };
    this.animEntryGaze = { ...this.animTransitionFrom.gaze };

    this.activeAnimation = anim;
    this.animStartTime = now;
    this.animationSampled = false;
    this.animationRunSequence = (this.animationRunSequence || 0) + 1;
    // Cross-fade duration: silky-smooth 500ms to 700ms Hermite blend
    this.animFadeDuration = Math.min(700, Math.max(500, Math.round(anim.durationMs * 0.18)));
    this.autonomousSubMode = 'RECORDED_ANIM';
    this.lastPlayedAnimName = anim.name;
    this.isFadingInProcedural = false;

    this.dispatchEvent(new CustomEvent('animation:start', {
      detail: {
        name: anim.name,
        durationMs: anim.durationMs,
        frameCount: anim.frameCount
      }
    }));
  }

  stopAnimationPlayback(now) {
    this.stopRecordedAudio();
    const name = this.lastPlayedAnimName;
    this.activeAnimation = null;
    this.autonomousSubMode = 'HOLD';
    this.dispatchEvent(new CustomEvent('animation:end', { detail: { name } }));
  }

  /**
   * Schedule the next gaze point of interest, head pose, and rhythm pattern
   */
  scheduleNextPOI(now, immediate = false, initialDelay = null) {
    // Select a varied rhythm pattern prioritizing active environment exploration ("cherche quelque chose")
    this.consecutiveOffCenterLooks = this.consecutiveOffCenterLooks || 0;
    const forceNearCenter = this.consecutiveOffCenterLooks >= 5;
    const rand = Math.random();

    let holdDurationMs;
    let angleX, angleY, coupledRoll;
    let transX = 0, transY = 0, transZ = 0;

    if (forceNearCenter || rand < 0.14) {
      // 1. SOFT_SIDE_GLANCE: Rest near center without ever making eye contact.
      this.currentRhythmMode = 'SOFT_SIDE_GLANCE';
      this.consecutiveOffCenterLooks = 0;
      this.targetDamping = 0.038;
      this.transDamping = 0.032;
      holdDurationMs = 1200 + Math.random() * 900; // Shorter hold: alive and attentive!
      this.browPulseIntensity = 0.0035;

      const side = Math.random() > 0.5 ? 1 : -1;
      // The face remains centered spatially, with a readable off-axis pose.
      angleX = side * (7.0 + Math.random() * 5.0);
      angleY = (Math.random() > 0.5 ? 1 : -1) * (3.0 + Math.random() * 4.0);
      coupledRoll = -side * (1.5 + Math.random() * 2.0);

      // Moves gently near center, leans slightly in toward camera in depth
      transX = (Math.random() - 0.5) * 0.05;
      transY = (Math.random() - 0.5) * 0.05;
      transZ = 0.04 + Math.random() * 0.05;

      this.targetGaze = {
        x: side * (0.15 + Math.random() * 0.08),
        y: (Math.random() - 0.5) * 0.12
      };

      // Friendly subtle micro-smile and receptive expression
      this.targetProceduralExpressions = {
        jawOpen: 0,
        smileL: 0.16 + Math.random() * 0.10,
        smileR: 0.16 + Math.random() * 0.10,
        browL: 0.08,
        browR: 0.08,
        pucker: 0.0
      };
    } else if (rand < 0.40) {
      // 2. SEARCHING_WIDE: Actively scanning the room/environment ("cherche quelque chose")
      this.currentRhythmMode = 'SEARCHING_WIDE';
      this.consecutiveOffCenterLooks++;
      this.targetDamping = 0.052;
      this.transDamping = 0.040;
      holdDurationMs = 950 + Math.random() * 850;
      this.browPulseIntensity = 0.0065;

      const side = Math.random() > 0.5 ? 1 : -1;
      // Wide head turn (yaw ±22° to ±38°) scanning across the room
      angleX = side * (22.0 + Math.random() * 16.0);
      angleY = (Math.random() - 0.40) * 24.0; // -10° to +14°
      coupledRoll = -side * (4.0 + Math.random() * 6.0);

      // Wide spatial shift across canvas
      transX = side * (0.12 + Math.random() * 0.08);
      transY = (Math.random() - 0.5) * 0.16;
      transZ = (Math.random() - 0.5) * 0.12;

      // Darting gaze searching the field of view with natural subtle amplitude
      this.targetGaze = {
        x: side * (0.28 + Math.random() * 0.12),
        y: Math.max(-0.35, Math.min(0.35, (angleY / 20.0) * 0.38 + (Math.random() - 0.5) * 0.10))
      };

      // Searching expression: closed lips, alert inquisitive brows
      this.targetProceduralExpressions = {
        jawOpen: 0,
        smileL: 0.04,
        smileR: 0.04,
        browL: 0.26 + Math.random() * 0.15,
        browR: 0.26 + Math.random() * 0.15,
        pucker: 0.0
      };
    } else if (rand < 0.62) {
      // 3. INQUISITIVE_SCAN: Curious investigation, pronounced head tilt & asymmetric smirk
      this.currentRhythmMode = 'INQUISITIVE_SCAN';
      this.consecutiveOffCenterLooks++;
      this.targetDamping = 0.048;
      this.transDamping = 0.038;
      holdDurationMs = 1100 + Math.random() * 850;
      this.browPulseIntensity = 0.0075;

      const side = Math.random() > 0.5 ? 1 : -1;
      // Head turn and pronounced inquisitive roll (head cocked)
      angleX = side * (18.0 + Math.random() * 18.0);
      angleY = (Math.random() - 0.35) * 20.0;
      coupledRoll = -angleX * 0.24 + (Math.random() - 0.5) * 8.0; // up to ±12° roll!

      transX = side * (0.10 + Math.random() * 0.06);
      transY = (Math.random() - 0.5) * 0.14;
      transZ = (Math.random() - 0.3) * 0.10;

      this.targetGaze = {
        x: side * (0.24 + Math.random() * 0.12),
        y: Math.max(-0.28, Math.min(0.32, (angleY / 18.0) * 0.35))
      };

      // Exaggerated asymmetric curiosity: one brow high, curious corner smirk, closed jaw
      this.targetProceduralExpressions = {
        jawOpen: 0,
        smileL: side > 0 ? 0.03 : (0.22 + Math.random() * 0.12),
        smileR: side > 0 ? (0.22 + Math.random() * 0.12) : 0.03,
        browL: side > 0 ? 0.15 : (0.45 + Math.random() * 0.18),
        browR: side > 0 ? (0.45 + Math.random() * 0.18) : 0.15,
        pucker: 0.0
      };
    } else if (rand < 0.72) {
      // 4. DOUBLE_SACCADE: Quick micro-inspection / double-take
      this.currentRhythmMode = 'DOUBLE_SACCADE';
      this.consecutiveOffCenterLooks++;
      this.targetDamping = 0.050;
      this.transDamping = 0.036;
      holdDurationMs = 380 + Math.random() * 220;
      this.doubleSaccadePending = true;
      this.doubleSaccadeTime = now + holdDurationMs;
      this.browPulseIntensity = 0.0060;

      angleX = (Math.random() - 0.5) * 36.0;
      angleY = (Math.random() - 0.45) * 24.0;
      coupledRoll = -angleX * 0.18;

      transX = (Math.random() - 0.5) * 0.18;
      transY = (Math.random() - 0.5) * 0.16;
      transZ = (Math.random() - 0.5) * 0.08;

      this.targetGaze = {
        x: Math.max(-0.35, Math.min(0.35, (angleX / 22.0) * 0.35)),
        y: Math.max(-0.30, Math.min(0.30, (angleY / 16.0) * 0.35))
      };

      this.targetProceduralExpressions = {
        jawOpen: 0,
        smileL: 0.05,
        smileR: 0.05,
        browL: 0.35 + Math.random() * 0.15,
        browR: 0.35 + Math.random() * 0.15,
        pucker: 0.0
      };
    } else if (rand < 0.92) {
      // 5. UPWARD_THINKING: 20% of choices look above (twice the previous frequency).
      this.currentRhythmMode = 'UPWARD_THINKING';
      this.consecutiveOffCenterLooks++;
      this.targetDamping = 0.032;
      this.transDamping = 0.026;
      holdDurationMs = 1300 + Math.random() * 800;
      this.browPulseIntensity = 0.0065;

      angleX = (Math.random() - 0.5) * 30.0;
      angleY = 16.0 + Math.random() * 16.0; // Upward intent: 16° to 32°.
      coupledRoll = (Math.random() - 0.5) * 8.0;

      transX = (Math.random() - 0.5) * 0.18;
      transY = -0.10 - Math.random() * 0.08;
      transZ = -0.06 - Math.random() * 0.08;

      this.targetGaze = {
        x: Math.max(-0.28, Math.min(0.28, (angleX / 20.0) * 0.32)),
        y: 0.22 + Math.random() * 0.14
      };

      // Thinking expression: inner eyebrows raised high, lips slightly pursed and closed
      this.targetProceduralExpressions = {
        jawOpen: 0,
        smileL: 0.02,
        smileR: 0.02,
        browL: 0.42 + Math.random() * 0.15,
        browR: 0.42 + Math.random() * 0.15,
        pucker: 0.14 + Math.random() * 0.10
      };
    } else {
      // 6. DOWNWARD_SEARCH: Scanning desk / floor / lower objects
      this.currentRhythmMode = 'DOWNWARD_SEARCH';
      this.consecutiveOffCenterLooks++;
      this.targetDamping = 0.034;
      this.transDamping = 0.028;
      holdDurationMs = 1000 + Math.random() * 800;
      this.browPulseIntensity = 0.0050;

      angleX = (Math.random() - 0.5) * 32.0;
      angleY = -14.0 - Math.random() * 12.0; // Downward intent: 14° to 26°.
      coupledRoll = -angleX * 0.14 + (Math.random() - 0.5) * 5.0;

      transX = (Math.random() - 0.5) * 0.16;
      transY = 0.08 + Math.random() * 0.08;
      transZ = 0.02 + Math.random() * 0.06;

      this.targetGaze = {
        x: Math.max(-0.28, Math.min(0.28, (angleX / 20.0) * 0.32)),
        y: -0.20 - Math.random() * 0.12
      };

      this.targetProceduralExpressions = {
        jawOpen: 0,
        smileL: 0.04,
        smileR: 0.04,
        browL: 0.18,
        browR: 0.18,
        pucker: 0.0
      };
    }

    if (initialDelay) {
      holdDurationMs = initialDelay;
    }

    this.targetGaze = this.keepGazeOffCamera(this.targetGaze);

    this.fromGaze = { ...this.currentGaze };

    // Fast ballistic saccade: 45ms - 75ms
    this.saccadeStartTime = now;
    this.saccadeDuration = immediate ? 15 : (45 + Math.random() * 30);
    this.isSaccading = true;

    // Trigger subtle curiosity brow pulse
    this.browPulseTime = now;

    // Head target follows with dynamic scaling
    this.targetHead = {
      // Landmarks use downward-positive Y; looking up requires a negative X rotation.
      pitch: -angleY * 0.85,
      yaw: angleX * 0.90,
      roll: coupledRoll
    };

    // Head translation targets (normalized X, Y, and depth Z)
    this.targetTrans = {
      x: transX * AUTONOMOUS_LATERAL_TRANSLATION_SCALE,
      y: transY * AUTONOMOUS_LATERAL_TRANSLATION_SCALE,
      z: transZ * AUTONOMOUS_DEPTH_TRANSLATION_SCALE
    };

    this.nextPOITime = now + holdDurationMs;
  }

  /**
   * Triggers the secondary micro-saccade for double-saccade cadence
   */
  triggerSecondarySaccade(now) {
    this.doubleSaccadePending = false;
    this.fromGaze = { ...this.currentGaze };
    const microDeltaX = (Math.random() - 0.5) * 0.20;
    const microDeltaY = (Math.random() - 0.4) * 0.16;
    this.targetGaze.x = Math.max(-0.35, Math.min(0.35, this.currentGaze.x + microDeltaX));
    this.targetGaze.y = Math.max(-0.32, Math.min(0.32, this.currentGaze.y + microDeltaY));
    this.targetGaze = this.keepGazeOffCamera(this.targetGaze, Math.sign(this.currentGaze.x));

    this.saccadeStartTime = now;
    this.saccadeDuration = 40 + Math.random() * 25;
    this.isSaccading = true;
    this.browPulseTime = now;
    this.browPulseIntensity = 0.0070;

    // Settle for the remaining active searching period
    this.targetDamping = 0.038;
    this.nextPOITime = now + (1100 + Math.random() * 900);
  }

  keepGazeOffCamera(gaze, preferredSide = 0) {
    const safe = { x: gaze?.x || 0, y: gaze?.y || 0 };
    if (Math.hypot(safe.x, safe.y) < 0.14) {
      const side = preferredSide || Math.sign(safe.x) || (Math.random() > 0.5 ? 1 : -1);
      safe.x = side * Math.max(0.15, Math.abs(safe.x));
    }
    return safe;
  }

  /**
   * Samples an animation track at `clipTimeMs` with linear interpolation between keyframes
   */
  sampleAnimationAtTime(anim, clipTimeMs) {
    if (!anim || !anim.frames || anim.frames.length === 0) return null;
    const frames = anim.frames;
    const count = frames.length;

    if (count === 1 || clipTimeMs <= frames[0].timeOffsetMs) {
      return frames[0];
    }
    if (clipTimeMs >= frames[count - 1].timeOffsetMs) {
      return frames[count - 1];
    }

    // Binary search for surrounding keyframes
    let low = 0;
    let high = count - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (frames[mid].timeOffsetMs <= clipTimeMs) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const idx0 = Math.max(0, high);
    const idx1 = Math.min(count - 1, idx0 + 1);
    const f0 = frames[idx0];
    const f1 = frames[idx1];

    if (idx0 === idx1 || !f0 || !f1) return f0 || f1;

    const dt = f1.timeOffsetMs - f0.timeOffsetMs;
    const t = dt > 0 ? (clipTimeMs - f0.timeOffsetMs) / dt : 0;

    // Interpolate Head Pose
    let headPose = null;
    if (f0.headPose && f1.headPose) {
      headPose = {
        pitch: f0.headPose.pitch + (f1.headPose.pitch - f0.headPose.pitch) * t,
        yaw: f0.headPose.yaw + (f1.headPose.yaw - f0.headPose.yaw) * t,
        roll: f0.headPose.roll + (f1.headPose.roll - f0.headPose.roll) * t,
        x: (f0.headPose.x || 0) + ((f1.headPose.x || 0) - (f0.headPose.x || 0)) * t,
        y: (f0.headPose.y || 0) + ((f1.headPose.y || 0) - (f0.headPose.y || 0)) * t,
        z: (f0.headPose.z || 0) + ((f1.headPose.z || 0) - (f0.headPose.z || 0)) * t
      };
      if (usesRecordedPosition(anim)) headPose.matrix = interpolateMetricPose(f0.headPose, f1.headPose, t);
    } else {
      headPose = f0.headPose || f1.headPose;
    }

    // Interpolate Blendshapes
    const bs0 = f0.blendshapes || {};
    const bs1 = f1.blendshapes || {};
    const allBsKeys = new Set([...Object.keys(bs0), ...Object.keys(bs1)]);
    const blendshapes = {};
    for (const k of allBsKeys) {
      const v0 = bs0[k] || 0;
      const v1 = bs1[k] || 0;
      blendshapes[k] = v0 + (v1 - v0) * t;
    }

    // Interpolate Local Coords (if performance mocap data is present)
    let localCoords = null;
    if (f0.localCoords && f1.localCoords && f0.localCoords.length === f1.localCoords.length) {
      const len = f0.localCoords.length;
      localCoords = new Array(len);
      for (let i = 0; i < len; i++) {
        const p0 = f0.localCoords[i];
        const p1 = f1.localCoords[i];
        localCoords[i] = {
          x: p0.x + (p1.x - p0.x) * t,
          y: p0.y + (p1.y - p0.y) * t,
          z: p0.z + (p1.z - p0.z) * t
        };
      }
    } else {
      localCoords = f0.localCoords || f1.localCoords;
    }

    return { headPose, blendshapes, localCoords };
  }

  /**
   * Anatomically closes the entire eye contour and orbital cavity (creux des yeux).
   * Spans all corresponding pairs from outer canthus to inner canthus smoothly
   * so the whole eyelid descends to meet the lower lid without any pinching or isolated spikes.
   */
  applyEyelidClosure(landmarks, blinkR = 0, blinkL = 0) {
    if (!landmarks || landmarks.length < 468) return;

    const closeEye = (upper, lower, crease, rawBlink) => {
      if (rawBlink <= 0.005) return;
      const raw = Math.max(0, Math.min(1, rawBlink));
      const blink = raw * raw * (3 - 2 * raw);
      const pairCount = Math.min(upper.length, lower.length);
      let maxFissureHeight = 0;

      for (let k = 0; k < pairCount; k++) {
        const u = landmarks[upper[k]];
        const l = landmarks[lower[k]];
        if (!u || !l) continue;

        const gap = l.y - u.y;
        maxFissureHeight = Math.max(maxFissureHeight, Math.abs(gap));
        const hingeWeight = (k === 0 || k === pairCount - 1)
          ? 0
          : (k === 1 || k === pairCount - 2 ? 0.72 : 1);
        const amount = blink * hingeWeight;

        // The upper lid performs most of the motion; the lower lid rises only
        // slightly. Both meet on one continuous curved closure line.
        const closureY = u.y + gap * 0.78;
        u.y += (closureY - u.y) * amount;
        l.y += (closureY - l.y) * amount;

        if (u.z !== undefined && l.z !== undefined) {
          const closureZ = ((u.z || 0) + (l.z || 0)) * 0.5;
          u.z += (closureZ - u.z) * amount * 0.22;
          l.z += (closureZ - l.z) * amount * 0.22;
        }
      }

      // Scale the fold movement to the person's actual eye opening instead of
      // using a large fixed offset that can distort small faces.
      const creaseDescent = maxFissureHeight * 0.32 * blink;
      for (const index of crease) {
        const point = landmarks[index];
        if (point) point.y += creaseDescent;
      }
    };

    closeEye(this.EYE_R_UPPER, this.EYE_R_LOWER, this.EYE_R_CREASE, blinkR);
    closeEye(this.EYE_L_UPPER, this.EYE_L_LOWER, this.EYE_L_CREASE, blinkL);
  }

  /**
   * Anatomical Blendshape Deformer: Displaces base 3D landmarks
   * according to 52 MediaPipe / ARKit blendshapes (smile, jaw, brows, eyelids, irises).
   */
  applyBlendshapesToLandmarks(baseLandmarks, bs, renderW, renderH) {
    if (!baseLandmarks) return null;
    const len = baseLandmarks.length;
    const deformed = new Array(len);
    for (let i = 0; i < len; i++) {
      const p = baseLandmarks[i];
      deformed[i] = { x: p.x, y: p.y, z: p.z || 0, visibility: p.visibility };
    }
    if (!bs) return deformed;

    const ar = renderW / Math.max(1, renderH);

    deformMouth(baseLandmarks, deformed, bs, ar, this.rigidSkull);

    // 3. Eyebrows: lift, lower and draw together, scaled to each eye's width.
    const unit = value => Math.max(0, Math.min(1, value || 0));
    const applyBrow = (indices, innerIdx, outerIdx, eyeInIdx, eyeOutIdx, outerUp, down) => {
      const inner = baseLandmarks[innerIdx], outer = baseLandmarks[outerIdx];
      const eyeIn = baseLandmarks[eyeInIdx], eyeOut = baseLandmarks[eyeOutIdx];
      const nose = baseLandmarks[168];
      if (!inner || !outer || !eyeIn || !eyeOut || !nose) return;
      const eyeWidth = Math.hypot((eyeIn.x - eyeOut.x) * ar, eyeIn.y - eyeOut.y);
      const dx = (inner.x - outer.x) * ar, dy = inner.y - outer.y;
      const spanSq = dx * dx + dy * dy;
      for (const idx of indices) {
        const source = baseLandmarks[idx], point = deformed[idx];
        if (!source || !point) continue;
        const innerWeight = spanSq > 1e-10
          ? unit(((source.x - outer.x) * ar * dx + (source.y - outer.y) * dy) / spanSq)
          : 0.5;
        const lift = Math.max(unit(bs.browInnerUp) * (0.35 + 0.65 * innerWeight), unit(outerUp) * (1.0 - 0.65 * innerWeight));
        const frown = unit(down);
        point.y += eyeWidth * (frown * (0.15 + 0.11 * innerWeight) - lift * 0.35);
        point.x += (nose.x - source.x) * frown * (0.050 + 0.085 * innerWeight);
      }
    };
    applyBrow(this.EYEBROW_R, 55, 70, 133, 33, bs.browOuterUpRight, bs.browDownRight);
    applyBrow(this.EYEBROW_L, 285, 300, 362, 263, bs.browOuterUpLeft, bs.browDownLeft);

    // 4. Eyelids: surprise opens the eyes, concentration narrows them gently.
    const widenEye = (upper, lower, wide) => {
      for (let k = 1; k < upper.length - 1; k++) {
        const u = deformed[upper[k]], l = deformed[lower[k]];
        if (!u || !l) continue;
        const gap = Math.max(0, l.y - u.y);
        u.y -= gap * 0.32 * wide;
        l.y += gap * 0.12 * wide;
      }
    };
    widenEye(this.EYE_R_UPPER, this.EYE_R_LOWER, unit(bs.eyeWideRight) * (1 - unit(bs.eyeSquintRight)));
    widenEye(this.EYE_L_UPPER, this.EYE_L_LOWER, unit(bs.eyeWideLeft) * (1 - unit(bs.eyeSquintLeft)));
    return deformed;
  }

  /**
   * Generates a complete autonomous tracking frame
   */
  generateFrame(now = performance.now(), renderW = 1280, renderH = 720) {
    if (!this.baseLandmarks?.length) return null;
    this.updatePresetAudioPlayback(now);
    const aspect = renderW / Math.max(1, renderH);
    let frame = this.generateFaceCapPresetFrame(now, aspect);
    if (!frame && this.animLibrary?.isAutonomousPlaybackEnabled) {
      const animation = this.animLibrary.getRandomAnimationSync();
      if (animation) {
        this.startAnimationPlayback(animation, now);
        frame = this.generateFaceCapPresetFrame(now, aspect);
      }
    }
    if (frame) {
      this.lastAutonomousFrame = frame;
      return frame;
    }
    // Without a manual performance, hold the last face rather than invent motion.
    if (!this.lastAutonomousFrame) {
      const pose = this.entryHeadPose || {};
      const metric = pose.matrix?.length === 16 || Number(pose.z) < 0;
      const held = createFaceCapPresetFrame({ headPose: pose, blendshapes: this.entryBlendshapes || {} },
        canonicalVertices, aspect, metric);
      this.lastAutonomousFrame = { ...held, detected: true, isAutonomous: true,
        latencyMs: 0, liveLandmarks: this.baseLandmarks };
    }
    const held = { ...this.lastAutonomousFrame, timestamp: now, activeAnimationName: null,
      animationRunId: 'hold', subMode: 'HOLD', animBlendWeight: 0 };
    this.lastAutonomousLandmarks = held.landmarks;
    this.lastAutonomousHeadPose = held.headPose;
    return held;
  }

  generateFaceCapPresetFrame(now, aspect) {
    const anim = this.activeAnimation;
    if (this.autonomousSubMode !== 'RECORDED_ANIM' || !isFaceCapClip(anim)) return null;
    if (!this.animationSampled) {
      // The first displayed frame, rather than the button click or loading time,
      // starts the shared half-second pose/expression handoff.
      this.animStartTime = now;
      this.animationSampled = true;
    }
    const phase = getPresetPlaybackPhase(anim, this.getAnimationElapsed(now), {
      continuous: this.continuousPresetHandoff
    });
    if (phase.finished) {
      this.stopAnimationPlayback(now);
      return null;
    }
    const sample = this.sampleAnimationAtTime(anim, phase.time);
    const frame = createFaceCapPresetFrame(sample, canonicalVertices, aspect, usesRecordedPosition(anim));
    const audioMouth = phase.preparing ? null : this.presetAudio.getBlendshapes();
    if (audioMouth) Object.assign(frame.blendshapes, audioMouth);
    this.isTransitioningToAutonomous = false;
    this.lastRenderedLandmarks = frame.landmarks;
    this.lastPoseLandmarks = frame.poseLandmarks;
    this.lastAutonomousLandmarks = frame.landmarks;
    this.lastAutonomousHeadPose = frame.headPose;
    this.lastRenderedPitch = frame.headPose.pitch;
    this.lastRenderedYaw = frame.headPose.yaw;
    this.lastRenderedRoll = frame.headPose.roll;
    this.lastRenderedTransX = this.lastRenderedTransY = this.lastRenderedTransZ = 0;
    this.lastRenderedGazeX = (frame.blendshapes.eyeLookOutLeft || 0) - (frame.blendshapes.eyeLookInLeft || 0);
    this.lastRenderedGazeY = (frame.blendshapes.eyeLookUpLeft || 0) - (frame.blendshapes.eyeLookDownLeft || 0);
    return { ...frame, detected: true, isAutonomous: true, autonomousBlendWeight: 1,
      subMode: 'RECORDED_ANIM', activeAnimationName: anim.name, animBlendWeight: 1,
      animationRunId: `${this.animationRunSequence}:${phase.cycle}`,
      presetTimeMs: phase.time, preparingPreset: phase.preparing,
      timestamp: now, latencyMs: 0, liveLandmarks: this.baseLandmarks };
  }
}
