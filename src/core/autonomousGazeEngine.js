/**
 * Autonomous Gaze & Head Wander Engine
 * 
 * Provides lifelike autonomous behavior when no user is detected:
 * - Expressive eyebrow micro-animation coupled with gaze, curiosity pulses, and breathing
 * - Rich rhythm & cadence variations: dynamic damping, inquisitive glances, contemplative holds, double saccades
 * - Expanded dynamic range of motion (more lively head yaw, pitch, inquisitive tilt, and translation drift)
 * - Vestibulo-Ocular Reflex (VOR): Eyes counter-rotate to compensate head movements and maintain screen fixation
 * - Rapid ballistic eye saccades snapping between points of interest on screen (55ms - 85ms)
 * - Continuous organic wiggle/sway in translation (position) and rotation (postural sway & micro-tremor)
 * - Buttery-smooth S-curve transition blending on state changes
 * - Spontaneous natural blinking (~150ms)
 * 
 * NEW FEATURE:
 * - Integration with Animation Library (`public/animations/`)
 * - Periodic random switching (~50% chance) to play recorded or preset facial animations
 * - Buttery-smooth 700ms quintic Hermite S-curve crossfading between procedural gaze and animations
 * - Seamless zero-pop exit when live visitor is re-detected
 */

import * as THREE from 'three';
import { CranialCoordinateSystem } from '../mocap/cranialCoordinateSystem.js';

export class AutonomousGazeEngine extends EventTarget {
  constructor() {
    super();

    // Mode & Presence State
    this.isActive = false;
    this.hasSeenFace = false;
    this.isMirrored = true;

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
    this.currentRhythmMode = 'CAMERA_CONTACT';
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

    // =========================================================================
    // Recorded Animation Playback & Frequency Switcher System
    // =========================================================================
    this.animLibrary = null;
    this.autonomousSubMode = 'PROCEDURAL'; // 'PROCEDURAL' or 'RECORDED_ANIM'
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
    this.baseLandmarks = null;
    this.lastHeadPose = null;
    this.lastAutonomousLandmarks = null;
    this.lastAutonomousHeadPose = null;
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
    this.autonomousSubMode = 'PROCEDURAL';
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
    if (trackingResult.headPose) {
      this.lastHeadPose = { ...trackingResult.headPose };
    }
  }

  /**
   * Trigger transition into autonomous mode with smooth ease-in glide to center
   */
  startAutonomous(now = performance.now(), initialLandmarks = null, initialHeadPose = null) {
    this.isActive = true;

    if (initialLandmarks && initialLandmarks.length > 0) {
      this.transFromLandmarks = initialLandmarks.map(p => ({
        x: p.x,
        y: p.y,
        z: p.z || 0,
        visibility: p.visibility
      }));
      this.isTransitioningToAutonomous = true;
      this.transToAutoStartTime = now;
      this.transToAutoDuration = 850;
    } else {
      this.isTransitioningToAutonomous = false;
      this.transFromLandmarks = null;
    }

    // Initialize head pose & translation smoothly from initialHeadPose if available
    const initPitch = Number(initialHeadPose?.pitch) || 0;
    const initYaw = Number(initialHeadPose?.yaw) || 0;
    const initRoll = Number(initialHeadPose?.roll) || 0;
    const initTransX = (Number(initialHeadPose?.x) || 0) / 1280;
    const initTransY = (Number(initialHeadPose?.y) || 0) / 720;
    const initTransZ = (Number(initialHeadPose?.z) || 0) / 1280;
    this.currentHead = { pitch: initPitch, yaw: initYaw, roll: initRoll };
    this.targetHead = { pitch: 0, yaw: 0, roll: 0 };
    this.currentTrans = { x: initTransX, y: initTransY, z: initTransZ };
    this.targetTrans = { x: 0, y: 0, z: 0 };
    this.currentGaze = { x: 0, y: 0 };
    this.targetGaze = { x: 0, y: 0 };
    this.fromGaze = { x: 0, y: 0 };
    this.isSaccading = false;
    this.currentDamping = 0.040;
    this.transDamping = 0.035;

    // Reset submode to procedural baseline
    this.autonomousSubMode = 'PROCEDURAL';
    this.activeAnimation = null;

    // Schedule natural cadence with initial gentle hold on center (1100ms)
    this.nextPOITime = now + 1100;
    this.nextBlinkTime = now + 1200 + Math.random() * 1500;

    // First animation decision scheduled calmly after smooth glide to center (3.5s - 4.5s)
    this.nextAnimationDecisionTime = now + 3500 + Math.random() * 1000;
    this.consecutiveProceduralCycles = 0;
  }

  /**
   * Stop autonomous mode
   */
  stopAutonomous() {
    this.isActive = false;
    this.isTransitioningToAutonomous = false;
    this.stopAudio();
    this.autonomousSubMode = 'PROCEDURAL';
    this.activeAnimation = null;
    this.consecutiveProceduralCycles = 0;
  }

  stopAudio() {
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
    this.stopAudio();
    this.ensureAudioContext();

    const delaySec = Math.max(0, Math.min(4.0, this.audioDelaySec ?? 2.2));

    // Start sub-millisecond audio playback via Web Audio API AudioBufferSourceNode with delay offset
    if (anim._audioBuffer && this.audioCtx) {
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
    } else if (anim.hasAudio && anim.audioData) {
      if (this.animLibrary) {
        this.animLibrary.decodeAudioBuffer(anim).then(buf => {
          if (buf && this.activeAnimation === anim && this.audioCtx) {
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
        yaw: this.lastRenderedYaw || 0,
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
      landmarks: this.lastRenderedLandmarks ? this.lastRenderedLandmarks.map(p => ({ ...p })) : null
    };

    this.animEntryHead = { ...this.animTransitionFrom.head };
    this.animEntryTrans = { ...this.animTransitionFrom.trans };
    this.animEntryGaze = { ...this.animTransitionFrom.gaze };

    this.activeAnimation = anim;
    this.animStartTime = now;
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
    this.stopAudio();
    const finishedAnimName = this.lastPlayedAnimName;
    this.autonomousSubMode = 'PROCEDURAL';
    this.activeAnimation = null;

    // Continuous handoff: procedural target stays right at the final rendered pose
    this.currentHead = {
      pitch: this.lastRenderedPitch || 0,
      yaw: this.lastRenderedYaw || 0,
      roll: this.lastRenderedRoll || 0
    };
    this.targetHead = { ...this.currentHead };

    this.currentTrans = {
      x: this.lastRenderedTransX || 0,
      y: this.lastRenderedTransY || 0,
      z: this.lastRenderedTransZ || 0
    };
    this.targetTrans = { ...this.currentTrans };

    // Continuous handoff for ocular gaze: prevent irises jumping on clip completion
    this.currentGaze = {
      x: this.lastRenderedGazeX || 0,
      y: this.lastRenderedGazeY || 0
    };
    this.targetGaze = { ...this.currentGaze };
    this.fromGaze = { ...this.currentGaze };
    this.isSaccading = false;

    // Smoothly ease in procedural breathing and spatial sway over 800ms
    this.isFadingInProcedural = true;
    this.proceduralFadeStartTime = now;
    this.proceduralFadeDuration = 800;

    // Gentle contemplative hold before glancing to next POI
    this.nextPOITime = now + 1400 + Math.random() * 800;
    // Calm observation pause before deciding on next animation (3.5s - 5.0s)
    this.nextAnimationDecisionTime = now + 3500 + Math.random() * 1500;
    this.dispatchEvent(new CustomEvent('animation:end', { detail: { name: finishedAnimName } }));
  }

  /**
   * Schedule the next gaze point of interest, head pose, and rhythm pattern
   */
  scheduleNextPOI(now, immediate = false, initialDelay = null) {
    // Select a varied rhythm pattern prioritizing active environment exploration ("cherche quelque chose")
    this.consecutiveOffCenterLooks = this.consecutiveOffCenterLooks || 0;
    const forceCenter = this.consecutiveOffCenterLooks >= 5;
    const rand = Math.random();

    let holdDurationMs;
    let angleX, angleY, coupledRoll;
    let transX = 0, transY = 0, transZ = 0;

    if (forceCenter || rand < 0.14) {
      // 1. CAMERA_CONTACT: Brief direct eye-contact with camera & viewer at center
      this.currentRhythmMode = 'CAMERA_CONTACT';
      this.consecutiveOffCenterLooks = 0;
      this.targetDamping = 0.038;
      this.transDamping = 0.032;
      holdDurationMs = 1200 + Math.random() * 900; // Shorter hold: alive and attentive!
      this.browPulseIntensity = 0.0035;

      // Soft, front-facing head pose centered with viewer
      angleX = (Math.random() - 0.5) * 6.0;
      angleY = (Math.random() - 0.4) * 5.0;
      coupledRoll = (Math.random() - 0.5) * 2.5;

      // Moves gently near center, leans slightly in toward camera in depth
      transX = (Math.random() - 0.5) * 0.05;
      transY = (Math.random() - 0.5) * 0.05;
      transZ = 0.04 + Math.random() * 0.05;

      this.targetGaze = {
        x: (Math.random() - 0.5) * 0.08,
        y: (Math.random() - 0.5) * 0.06
      };

      // Friendly subtle micro-smile and receptive expression
      this.targetProceduralExpressions = {
        jawOpen: 0.02,
        smileL: 0.16 + Math.random() * 0.10,
        smileR: 0.16 + Math.random() * 0.10,
        browL: 0.08,
        browR: 0.08,
        pucker: 0.0
      };
    } else if (rand < 0.42) {
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

      // Searching expression: lips softly parted, alert inquisitive brows
      this.targetProceduralExpressions = {
        jawOpen: 0.09 + Math.random() * 0.06,
        smileL: 0.04,
        smileR: 0.04,
        browL: 0.26 + Math.random() * 0.15,
        browR: 0.26 + Math.random() * 0.15,
        pucker: 0.0
      };
    } else if (rand < 0.68) {
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

      // Exaggerated asymmetric curiosity: one brow high, curious corner smirk, parted jaw
      this.targetProceduralExpressions = {
        jawOpen: 0.10 + Math.random() * 0.07,
        smileL: side > 0 ? 0.03 : (0.22 + Math.random() * 0.12),
        smileR: side > 0 ? (0.22 + Math.random() * 0.12) : 0.03,
        browL: side > 0 ? 0.15 : (0.45 + Math.random() * 0.18),
        browR: side > 0 ? (0.45 + Math.random() * 0.18) : 0.15,
        pucker: 0.0
      };
    } else if (rand < 0.82) {
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
        jawOpen: 0.10 + Math.random() * 0.05,
        smileL: 0.05,
        smileR: 0.05,
        browL: 0.35 + Math.random() * 0.15,
        browR: 0.35 + Math.random() * 0.15,
        pucker: 0.0
      };
    } else if (rand < 0.92) {
      // 5. UPWARD_THINKING: Searching above, ceiling or memory contemplation
      this.currentRhythmMode = 'UPWARD_THINKING';
      this.consecutiveOffCenterLooks++;
      this.targetDamping = 0.032;
      this.transDamping = 0.026;
      holdDurationMs = 1300 + Math.random() * 800;
      this.browPulseIntensity = 0.0065;

      angleX = (Math.random() - 0.5) * 30.0;
      angleY = 16.0 + Math.random() * 16.0; // Look up (+16° to +32°!)
      coupledRoll = (Math.random() - 0.5) * 8.0;

      transX = (Math.random() - 0.5) * 0.18;
      transY = -0.10 - Math.random() * 0.08;
      transZ = -0.06 - Math.random() * 0.08;

      this.targetGaze = {
        x: Math.max(-0.28, Math.min(0.28, (angleX / 20.0) * 0.32)),
        y: 0.22 + Math.random() * 0.14
      };

      // Thinking expression: inner eyebrows raised high, lips slightly pursed / open
      this.targetProceduralExpressions = {
        jawOpen: 0.08 + Math.random() * 0.06,
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
      angleY = -14.0 - Math.random() * 12.0; // -14° to -26°
      coupledRoll = -angleX * 0.14 + (Math.random() - 0.5) * 5.0;

      transX = (Math.random() - 0.5) * 0.16;
      transY = 0.08 + Math.random() * 0.08;
      transZ = 0.02 + Math.random() * 0.06;

      this.targetGaze = {
        x: Math.max(-0.28, Math.min(0.28, (angleX / 20.0) * 0.32)),
        y: -0.20 - Math.random() * 0.12
      };

      this.targetProceduralExpressions = {
        jawOpen: 0.08 + Math.random() * 0.05,
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

    this.fromGaze = { ...this.currentGaze };

    // Fast ballistic saccade: 45ms - 75ms
    this.saccadeStartTime = now;
    this.saccadeDuration = immediate ? 15 : (45 + Math.random() * 30);
    this.isSaccading = true;

    // Trigger subtle curiosity brow pulse
    this.browPulseTime = now;

    // Head target follows with dynamic scaling
    this.targetHead = {
      pitch: angleY * 0.85,
      yaw: angleX * 0.90,
      roll: coupledRoll
    };

    // Head translation targets (normalized X, Y, and depth Z)
    this.targetTrans = {
      x: transX,
      y: transY,
      z: transZ
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

    this.saccadeStartTime = now;
    this.saccadeDuration = 40 + Math.random() * 25;
    this.isSaccading = true;
    this.browPulseTime = now;
    this.browPulseIntensity = 0.0070;

    // Settle for the remaining active searching period
    this.targetDamping = 0.038;
    this.nextPOITime = now + (1100 + Math.random() * 900);
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

    // Right Eye Full Contour Closure
    if (blinkR > 0.005) {
      const bR = Math.min(1.0, blinkR);
      const pairCount = Math.min(this.EYE_R_UPPER.length, this.EYE_R_LOWER.length);
      for (let k = 0; k < pairCount; k++) {
        const uIdx = this.EYE_R_UPPER[k];
        const lIdx = this.EYE_R_LOWER[k];
        const u = landmarks[uIdx];
        const l = landmarks[lIdx];
        if (!u || !l) continue;

        // Outer (0) and inner (8) canthi are anatomical hinges that pinch slightly,
        // while the central eyelid margin (indices 2..6) moves fully.
        const canthusWeight = (k === 0 || k === pairCount - 1) ? 0.22 : (k === 1 || k === pairCount - 2 ? 0.68 : 1.0);
        const effB = bR * canthusWeight;

        // Upper lid descends ~82% of fissure height, lower lid ascends ~18%
        const fissureY = l.y * 0.82 + u.y * 0.18;
        const fissureZ = Math.max(u.z || 0, l.z || 0);

        u.y += (fissureY - u.y) * effB;
        l.y += (fissureY - l.y) * (effB * 0.85);

        if (u.z !== undefined && l.z !== undefined) {
          u.z += (fissureZ - u.z) * (effB * 0.50);
          l.z += (fissureZ - l.z) * (effB * 0.50);
        }
      }

      // Supratarsal crease / orbital socket skin fold descends naturally with the upper lid
      const creaseDescent = bR * 0.012;
      for (let c = 0; c < this.EYE_R_CREASE.length; c++) {
        const pt = landmarks[this.EYE_R_CREASE[c]];
        if (pt) pt.y += creaseDescent;
      }
    }

    // Left Eye Full Contour Closure
    if (blinkL > 0.005) {
      const bL = Math.min(1.0, blinkL);
      const pairCount = Math.min(this.EYE_L_UPPER.length, this.EYE_L_LOWER.length);
      for (let k = 0; k < pairCount; k++) {
        const uIdx = this.EYE_L_UPPER[k];
        const lIdx = this.EYE_L_LOWER[k];
        const u = landmarks[uIdx];
        const l = landmarks[lIdx];
        if (!u || !l) continue;

        const canthusWeight = (k === 0 || k === pairCount - 1) ? 0.22 : (k === 1 || k === pairCount - 2 ? 0.68 : 1.0);
        const effB = bL * canthusWeight;

        const fissureY = l.y * 0.82 + u.y * 0.18;
        const fissureZ = Math.max(u.z || 0, l.z || 0);

        u.y += (fissureY - u.y) * effB;
        l.y += (fissureY - l.y) * (effB * 0.85);

        if (u.z !== undefined && l.z !== undefined) {
          u.z += (fissureZ - u.z) * (effB * 0.50);
          l.z += (fissureZ - l.z) * (effB * 0.50);
        }
      }

      // Supratarsal crease
      const creaseDescent = bL * 0.012;
      for (let c = 0; c < this.EYE_L_CREASE.length; c++) {
        const pt = landmarks[this.EYE_L_CREASE[c]];
        if (pt) pt.y += creaseDescent;
      }
    }
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

    // 1. Mouth Smile & Corners
    const smileL = bs.mouthSmileLeft || 0;
    const smileR = bs.mouthSmileRight || 0;
    const avgSmile = (smileL + smileR) * 0.5;
    const jawOpen = bs.jawOpen || 0;
    const pucker = bs.mouthPucker || 0;
    const funnel = bs.mouthFunnel || 0;

    const leftCorner = [61, 76, 77, 78, 95];
    for (let k = 0; k < leftCorner.length; k++) {
      const idx = leftCorner[k];
      if (deformed[idx]) {
        deformed[idx].x -= (smileL * 0.038 * ar);
        deformed[idx].y -= (smileL * 0.028);
      }
    }
    const rightCorner = [291, 306, 307, 308, 324];
    for (let k = 0; k < rightCorner.length; k++) {
      const idx = rightCorner[k];
      if (deformed[idx]) {
        deformed[idx].x += (smileR * 0.038 * ar);
        deformed[idx].y -= (smileR * 0.028);
      }
    }

    // Lips & Cheeks smile lift
    const lips = [0, 11, 12, 13, 14, 15, 16, 17, 37, 39, 40, 84, 85, 86, 87, 88, 267, 269, 270, 314, 315, 316, 317, 318];
    for (let k = 0; k < lips.length; k++) {
      const idx = lips[k];
      if (deformed[idx]) {
        deformed[idx].y -= avgSmile * 0.012;
      }
    }

    // 2. Jaw Drop & Open
    if (jawOpen > 0.005) {
      // Lower lip drops down with mouth aperture
      const lowerLipIndices = [14, 15, 16, 17, 84, 85, 86, 87, 88, 91, 95, 146, 178, 179, 180, 181, 314, 315, 316, 317, 318, 321, 324, 375, 402, 403, 405];
      for (let k = 0; k < lowerLipIndices.length; k++) {
        const idx = lowerLipIndices[k];
        if (deformed[idx]) {
          deformed[idx].y += jawOpen * 0.065;
        }
      }
      // Chin and mandibular jawline drop smoothly with physiological mandible rotation
      const jawContour = [
        { idx: 152, w: 1.0 }, // Chin center
        { idx: 175, w: 0.95 }, { idx: 199, w: 0.95 }, { idx: 200, w: 0.95 }, { idx: 18, w: 0.9 },
        { idx: 377, w: 0.85 }, { idx: 148, w: 0.85 },
        { idx: 400, w: 0.70 }, { idx: 176, w: 0.70 },
        { idx: 378, w: 0.50 }, { idx: 149, w: 0.50 }
      ];
      for (let k = 0; k < jawContour.length; k++) {
        const { idx, w } = jawContour[k];
        if (deformed[idx]) {
          deformed[idx].y += jawOpen * 0.060 * w;
        }
      }
    }

    // 2b. Lip Funnel & Pucker
    if (funnel > 0.01) {
      const funnelOuter = [61, 291];
      for (const idx of funnelOuter) {
        if (deformed[idx]) deformed[idx].x *= 0.98;
      }
      for (const idx of [13, 14]) {
        if (deformed[idx]) deformed[idx].y += (idx === 14 ? 0.02 : -0.02) * funnel;
      }
    }
    if (pucker > 0.01) {
      for (const idx of [61, 291]) {
        if (deformed[idx]) deformed[idx].x += (idx === 61 ? 1 : -1) * pucker * 0.02 * ar;
      }
    }

    // 3. Eyebrows
    const browUpR = Math.max(bs.browOuterUpRight || 0, bs.browInnerUp || 0);
    const browUpL = Math.max(bs.browOuterUpLeft || 0, bs.browInnerUp || 0);
    if (browUpR > 0.005) {
      this.EYEBROW_R.forEach(idx => {
        if (deformed[idx]) deformed[idx].y -= browUpR * 0.016;
      });
    }
    if (browUpL > 0.005) {
      this.EYEBROW_L.forEach(idx => {
        if (deformed[idx]) deformed[idx].y -= browUpL * 0.016;
      });
    }

    // 4. Eyelids (Blink & Wink)
    const blinkL = bs.eyeBlinkLeft || 0;
    const blinkR = bs.eyeBlinkRight || 0;
    if (blinkL > 0.005 || blinkR > 0.005) {
      this.applyEyelidClosure(deformed, blinkR, blinkL);
    }

    return deformed;
  }

  /**
   * Generates a complete autonomous tracking frame
   */
  generateFrame(now = performance.now(), renderW = 1280, renderH = 720) {
    if (!this.baseLandmarks || this.baseLandmarks.length === 0) {
      return null;
    }

    const ar = renderW / Math.max(1, renderH);
    this.cranial.setAspectRatio(ar);

    // =========================================================================
    // 1. Point of Interest Scheduling & Procedural Rhythm State
    // =========================================================================
    if (this.autonomousSubMode === 'PROCEDURAL') {
      if (this.doubleSaccadePending && now >= this.doubleSaccadeTime) {
        this.triggerSecondarySaccade(now);
      } else if (now >= this.nextPOITime) {
        this.scheduleNextPOI(now);
      }

      // Dynamic damping interpolation
      this.currentDamping += (this.targetDamping - this.currentDamping) * 0.08;

      // Ballistic Ocular Saccade Update
      if (this.isSaccading) {
        const saccadeElapsed = now - this.saccadeStartTime;
        if (saccadeElapsed >= this.saccadeDuration) {
          this.currentGaze = { ...this.targetGaze };
          this.isSaccading = false;
        } else {
          const p = saccadeElapsed / this.saccadeDuration;
          const snap = p * p * (3 - 2 * p);
          this.currentGaze.x = this.fromGaze.x + (this.targetGaze.x - this.fromGaze.x) * snap;
          this.currentGaze.y = this.fromGaze.y + (this.targetGaze.y - this.fromGaze.y) * snap;
        }
      } else {
        // Fixation micro-drift during pause
        const microX = Math.sin(now * 0.009) * 0.007;
        const microY = Math.cos(now * 0.012) * 0.005;
        this.currentGaze.x = this.targetGaze.x + microX;
        this.currentGaze.y = this.targetGaze.y + microY;
      }

      // Smooth head movement with dynamic damping
      this.currentHead.pitch += (this.targetHead.pitch - this.currentHead.pitch) * this.currentDamping;
      this.currentHead.yaw += (this.targetHead.yaw - this.currentHead.yaw) * this.currentDamping;
      this.currentHead.roll += (this.targetHead.roll - this.currentHead.roll) * this.currentDamping;

      // Head Translation (X, Y, Depth Z) with smooth damping
      this.currentTrans.x += (this.targetTrans.x - this.currentTrans.x) * this.transDamping;
      this.currentTrans.y += (this.targetTrans.y - this.currentTrans.y) * this.transDamping;
      this.currentTrans.z += (this.targetTrans.z - this.currentTrans.z) * this.transDamping;
    }

    // Organic breathing cycle (~3.8s period)
    const breathCycle = now * 0.00165;
    const breathPitch = Math.sin(breathCycle) * 1.2;
    const breathRoll = Math.cos(breathCycle * 0.65) * 0.55;

    // Continuous organic wiggle & spatial sway (translation & rotation)
    const wTime = now * 0.001;
    const rotWigglePitch = Math.sin(wTime * 1.3) * 2.2 + Math.cos(wTime * 2.9) * 1.1;
    const rotWiggleYaw = Math.cos(wTime * 1.0) * 3.0 + Math.sin(wTime * 2.4) * 1.5;
    const rotWiggleRoll = Math.sin(wTime * 0.8) * 1.8 + Math.cos(wTime * 2.1) * 0.8;

    const swayX = Math.sin(wTime * 0.72) * 0.038 + Math.cos(wTime * 1.55) * 0.020;
    const swayY = Math.cos(wTime * 0.62) * 0.032 + Math.sin(wTime * 1.80) * 0.016;
    const swayZ = Math.sin(wTime * 0.80) * 0.035 + Math.cos(wTime * 1.40) * 0.022;

    // Initial entrance into autonomous mode transition
    let transT = 1.0;
    if (this.isTransitioningToAutonomous && this.transFromLandmarks) {
      const elapsed = now - this.transToAutoStartTime;
      if (elapsed < this.transToAutoDuration) {
        const rawT = Math.max(0, Math.min(1, elapsed / this.transToAutoDuration));
        transT = rawT * rawT * rawT * (rawT * (rawT * 6 - 15) + 10);
      } else {
        this.isTransitioningToAutonomous = false;
        this.transFromLandmarks = null;
        transT = 1.0;
      }
    }

    let procEase = 1.0;
    if (this.isFadingInProcedural) {
      const pElapsed = now - this.proceduralFadeStartTime;
      if (pElapsed < this.proceduralFadeDuration) {
        const rawP = pElapsed / this.proceduralFadeDuration;
        procEase = rawP * rawP * (3 - 2 * rawP);
      } else {
        this.isFadingInProcedural = false;
        procEase = 1.0;
      }
    }

    const swayFade = (this.isTransitioningToAutonomous ? transT : 1.0) * procEase;

    const effPitch = this.currentHead.pitch + (breathPitch + rotWigglePitch) * swayFade;
    const effYaw = this.currentHead.yaw + rotWiggleYaw * swayFade;
    const effRoll = this.currentHead.roll + (breathRoll + rotWiggleRoll) * swayFade;

    const effTransX = this.currentTrans.x + swayX * swayFade;
    const effTransY = this.currentTrans.y + swayY * swayFade;
    const effTransZ = this.currentTrans.z + swayZ * swayFade;

    // Vestibulo-Ocular Reflex (VOR): Eyes compensate head movements
    const vorCompX = -(effYaw * 0.00075) - (effTransX * 0.70);
    const vorCompY = (effPitch * 0.00075) - (effTransY * 0.70);
    const compensatedGazeX = this.currentGaze.x + vorCompX;
    const compensatedGazeY = this.currentGaze.y + vorCompY;

    // Spontaneous Blinking System
    let blinkWeight = 0;
    if (now >= this.nextBlinkTime && !this.isBlinking) {
      this.isBlinking = true;
      this.blinkStartTime = now;
      this.blinkDuration = 140 + Math.random() * 40;
    }
    if (this.isBlinking) {
      const bElapsed = now - this.blinkStartTime;
      if (bElapsed >= this.blinkDuration) {
        this.isBlinking = false;
        const isDoubleBlink = Math.random() < 0.15;
        this.nextBlinkTime = now + (isDoubleBlink ? 200 : (2600 + Math.random() * 3600));
      } else {
        const bProgress = bElapsed / this.blinkDuration;
        blinkWeight = Math.sin(bProgress * Math.PI);
        blinkWeight = Math.pow(blinkWeight, 1.3);
      }
    }

    // Eyebrow Micro-Animation
    const mirrorSign = this.isMirrored ? -1.0 : 1.0;
    const gazeBrowLift = Math.max(0, compensatedGazeY) * 0.0050;
    const rollBrowDiff = (effRoll * mirrorSign) * 0.00030;
    const browBreathe = Math.sin(now * 0.0018) * 0.0016 + Math.cos(now * 0.0009) * 0.0010;

    let browPulse = 0;
    const pulseElapsed = now - this.browPulseTime;
    if (pulseElapsed < 750) {
      const p = pulseElapsed / 750;
      browPulse = Math.sin(p * Math.PI) * this.browPulseIntensity;
    }

    const browLiftR = Math.max(-0.003, Math.min(0.012, gazeBrowLift + rollBrowDiff + browBreathe + browPulse));
    const browLiftL = Math.max(-0.003, Math.min(0.012, gazeBrowLift - rollBrowDiff + browBreathe + browPulse));

    // =========================================================================
    // 2. Recorded Animation Scheduler (High Cadence, Fast Alternation)
    // =========================================================================
    if (this.autonomousSubMode === 'PROCEDURAL') {
      if (now >= this.nextAnimationDecisionTime) {
        if (this.animLibrary && this.animLibrary.isAutonomousPlaybackEnabled && this.animLibrary.getActiveAnimationCount() > 0) {
          // Balanced 50% random chance, alternating naturally with procedural wander
          const shouldPlay = (Math.random() < 0.50);
          if (shouldPlay) {
            const anim = this.animLibrary.getRandomAnimationSync();
            if (anim && anim.durationMs > 300 && anim.frames && anim.frames.length > 0) {
              this.startAnimationPlayback(anim, now);
            } else {
              this.nextAnimationDecisionTime = now + 3000;
            }
          } else {
            // Calm contemplative procedural wander before next decision
            this.nextAnimationDecisionTime = now + 3500 + Math.random() * 1500;
          }
        } else {
          this.nextAnimationDecisionTime = now + 3500;
        }
      }
    }

    // Animation Blend Weight & Sampling
    let animBlendWeight = 0.0;
    let animSample = null;

    if (this.autonomousSubMode === 'RECORDED_ANIM' && this.activeAnimation) {
      const anim = this.activeAnimation;
      let elapsed = now - this.animStartTime;

      const delayMs = (this.audioDelaySec ?? 2.2) * 1000.0;
      const audioDurationMs = anim._audioBuffer ? (anim._audioBuffer.duration * 1000.0) : 0;
      const effectiveDuration = Math.max(anim.durationMs, delayMs + audioDurationMs);
      const fadeDuration = this.animFadeDuration;
      const totalBlockDuration = effectiveDuration + fadeDuration;

      if (elapsed >= totalBlockDuration) {
        // Animation finished: cleanly return to procedural wander
        this.stopAnimationPlayback(now);
      } else {
        // Compute quintic Hermite S-curve blend weight (0 to 1 on entry, 1 to 0 on exit)
        if (elapsed < fadeDuration) {
          // Fading in
          const rawT = Math.max(0, Math.min(1, elapsed / fadeDuration));
          animBlendWeight = rawT * rawT * rawT * (rawT * (rawT * 6 - 15) + 10);
        } else if (elapsed < effectiveDuration) {
          // Full animation playback
          animBlendWeight = 1.0;
        } else {
          // Fading out
          const fadeOutElapsed = elapsed - effectiveDuration;
          const rawT = Math.max(0, Math.min(1, 1.0 - (fadeOutElapsed / fadeDuration)));
          animBlendWeight = rawT * rawT * rawT * (rawT * (rawT * 6 - 15) + 10);
        }

        const clipTime = Math.min(anim.durationMs, elapsed);
        animSample = this.sampleAnimationAtTime(anim, clipTime);
      }
    }

    // =========================================================================
    // 3. Pose & Deformations Synthesis (Centered Mask, Faithful Acting, Contour Protection)
    // =========================================================================
    let targetPitch = 0;
    let targetYaw = 0;
    let targetRoll = 0;
    let targetTransX = 0;
    let targetTransY = 0;
    let targetTransZ = 0;

    let animBaseLandmarks = null;

    if (animSample && animBlendWeight > 0.0001) {
      const anim = this.activeAnimation;
      const baseline = anim?._baselineHeadPose || { pitch: 0, yaw: 0, roll: 0, x: 0, y: 0, z: 0 };
      const curPose = animSample.headPose;

      if (curPose) {
        // Faithful head rotation centered around performer's baseline
        targetPitch = (curPose.pitch || 0) - (baseline.pitch || 0);
        targetYaw = (curPose.yaw || 0) - (baseline.yaw || 0);
        targetRoll = (curPose.roll || 0) - (baseline.roll || 0);

        // Scale real head translation to normalized canvas coordinates
        targetTransX = ((curPose.x || 0) - (baseline.x || 0)) * 0.022;
        targetTransY = ((curPose.y || 0) - (baseline.y || 0)) * 0.022;
        targetTransZ = ((curPose.z || 0) - (baseline.z || 0)) * 0.022;
      } else if (animSample.blendshapes) {
        // Natural speech gesture fallback
        const bs = animSample.blendshapes;
        const jaw = bs.jawOpen || 0;
        const brow = bs.browInnerUp || 0;
        const smileDiff = (bs.mouthSmileRight || 0) - (bs.mouthSmileLeft || 0);
        targetPitch = -jaw * 5.0 + brow * 2.5;
        targetYaw = smileDiff * 6.0;
        targetRoll = smileDiff * 3.0;
        targetTransX = smileDiff * 0.015;
        targetTransY = -jaw * 0.012;
      }

      // Safe anatomical bounds
      targetPitch = Math.max(-35, Math.min(35, targetPitch));
      targetYaw = Math.max(-42, Math.min(42, targetYaw));
      targetRoll = Math.max(-28, Math.min(28, targetRoll));
      targetTransX = Math.max(-0.12, Math.min(0.12, targetTransX));
      targetTransY = Math.max(-0.12, Math.min(0.12, targetTransY));
      targetTransZ = Math.max(-0.12, Math.min(0.12, targetTransZ));

      // Deform facial vertices:
      // Anatomical Expression Retargeting with 1:1 Real Performance Fidelity
      if (animSample.localCoords && animSample.localCoords.length >= 468) {
        const rigidFrame = this.cranial.extractRigidFrame(this.baseLandmarks);
        if (rigidFrame) {
          // 1. Visitor's true neutral resting face in cranial coordinates
          const visitorLocal = this.cranial.toLocalCoordinates(this.baseLandmarks, rigidFrame);

          // 2. Performer's true neutral resting baseline
          let refLocal = anim.referenceLocal;
          if (!refLocal) {
            refLocal = anim.frames[0]?.localCoords || visitorLocal;
          }

          const count = Math.min(this.baseLandmarks.length, animSample.localCoords.length);
          const targetLocal = new Array(count);

          // Visitor neutral eye socket metrics in cranial space
          const vPt33 = visitorLocal[33];
          const vPt133 = visitorLocal[133];
          const socketWidthR = (vPt33 && vPt133) ? Math.hypot(vPt33.x - vPt133.x, vPt33.y - vPt133.y) : 0.8;

          const vPt263 = visitorLocal[263];
          const vPt362 = visitorLocal[362];
          const socketWidthL = (vPt263 && vPt362) ? Math.hypot(vPt263.x - vPt362.x, vPt263.y - vPt362.y) : 0.8;

          // Eye gaze direction from performance blendshapes fallback
          const bs = animSample.blendshapes || {};
          const gazeXR = (bs.eyeLookOutRight || 0) - (bs.eyeLookInRight || 0);
          const gazeYR = (bs.eyeLookUpRight || 0) - (bs.eyeLookDownRight || 0);
          const gazeXL = (bs.eyeLookInLeft || 0) - (bs.eyeLookOutLeft || 0);
          const gazeYL = (bs.eyeLookUpLeft || 0) - (bs.eyeLookDownLeft || 0);

          for (let i = 0; i < count; i++) {
            const vPt = visitorLocal[i];
            const recPt = animSample.localCoords[i];
            const rPt = refLocal ? refLocal[i] : null;

            if (!vPt || !recPt) {
              targetLocal[i] = vPt || recPt;
              continue;
            }

            // Real tracked iris landmarks (468-477): 1:1 motion
            if (i >= 468 && i <= 477) {
              if (rPt) {
                targetLocal[i] = {
                  x: vPt.x + (recPt.x - rPt.x),
                  y: vPt.y + (recPt.y - rPt.y),
                  z: vPt.z + (recPt.z - rPt.z)
                };
              } else if (i <= 472) {
                targetLocal[i] = {
                  x: vPt.x + gazeXR * socketWidthR * 0.35,
                  y: vPt.y + gazeYR * socketWidthR * 0.30,
                  z: vPt.z
                };
              } else {
                targetLocal[i] = {
                  x: vPt.x + gazeXL * socketWidthL * 0.35,
                  y: vPt.y + gazeYL * socketWidthL * 0.30,
                  z: vPt.z
                };
              }
              continue;
            }

            // Weight mapping: preserve visitor skull outline while allowing full speech/expression articulation
            let weight = 1.0;
            if (this.rigidSkull.has(i)) {
              weight = 0.0;
            } else if (this.mandible.has(i)) {
              weight = 0.90; // Natural speech jaw drop & articulation
            } else if (this.ring1.has(i)) {
              weight = 0.65;
            }

            let deltaX = 0, deltaY = 0, deltaZ = 0;
            if (rPt) {
              deltaX = (recPt.x - rPt.x) * weight;
              deltaY = (recPt.y - rPt.y) * weight;
              deltaZ = (recPt.z - rPt.z) * weight;
            } else {
              deltaX = (recPt.x - vPt.x) * (weight * 0.7);
              deltaY = (recPt.y - vPt.y) * (weight * 0.7);
              deltaZ = (recPt.z - vPt.z) * (weight * 0.7);
            }

            // Anatomical soft saturation clamping
            const dist = Math.hypot(deltaX, deltaY, deltaZ);
            const D_MAX = 2.0;
            if (dist > D_MAX) {
              const ratio = D_MAX / dist;
              deltaX *= ratio;
              deltaY *= ratio;
              deltaZ *= ratio;
            }

            targetLocal[i] = {
              x: vPt.x + deltaX,
              y: vPt.y + deltaY,
              z: vPt.z + deltaZ
            };
          }

          // Reconstruct into isotropic conformal space with visitor's skull frame
          const iso = this.cranial.fromLocalCoordinates(targetLocal, rigidFrame);
          animBaseLandmarks = iso.map((p, i) => this.cranial.fromIsotropic(p, this.baseLandmarks[i]?.visibility ?? 1.0));
        }
      }

      // Fallback for preset animations or clips without localCoords: apply blendshapes directly to baseLandmarks
      if (!animBaseLandmarks && animSample.blendshapes) {
        animBaseLandmarks = this.applyBlendshapesToLandmarks(this.baseLandmarks, animSample.blendshapes, renderW, renderH);
      }
    }

    // Smooth interpolation of procedural expressions
    const expDamp = 0.065;
    this.currentProceduralExpressions.jawOpen += (this.targetProceduralExpressions.jawOpen - this.currentProceduralExpressions.jawOpen) * expDamp;
    this.currentProceduralExpressions.smileL += (this.targetProceduralExpressions.smileL - this.currentProceduralExpressions.smileL) * expDamp;
    this.currentProceduralExpressions.smileR += (this.targetProceduralExpressions.smileR - this.currentProceduralExpressions.smileR) * expDamp;
    this.currentProceduralExpressions.browL += (this.targetProceduralExpressions.browL - this.currentProceduralExpressions.browL) * expDamp;
    this.currentProceduralExpressions.browR += (this.targetProceduralExpressions.browR - this.currentProceduralExpressions.browR) * expDamp;
    this.currentProceduralExpressions.pucker += (this.targetProceduralExpressions.pucker - this.currentProceduralExpressions.pucker) * expDamp;

    // Organic breathing modulation in jaw
    const breathingJaw = Math.max(0, Math.sin(breathCycle) * 0.020);
    const finalJawOpen = Math.max(0, this.currentProceduralExpressions.jawOpen + breathingJaw);

    // Procedural Blendshapes synthesis
    const proceduralBlendshapes = {
      eyeBlinkLeft: Math.min(1.0, blinkWeight * 0.95),
      eyeBlinkRight: Math.min(1.0, blinkWeight * 0.95),
      eyeLookInLeft: Math.max(0, -compensatedGazeX * 1.15),
      eyeLookOutLeft: Math.max(0, compensatedGazeX * 1.15),
      eyeLookInRight: Math.max(0, compensatedGazeX * 1.15),
      eyeLookOutRight: Math.max(0, -compensatedGazeX * 1.15),
      eyeLookUpLeft: Math.max(0, compensatedGazeY * 1.15),
      eyeLookDownLeft: Math.max(0, -compensatedGazeY * 1.15),
      eyeLookUpRight: Math.max(0, compensatedGazeY * 1.15),
      eyeLookDownRight: Math.max(0, -compensatedGazeY * 1.15),
      browInnerUp: Math.max(0, 0.08 + Math.max(this.currentProceduralExpressions.browL, this.currentProceduralExpressions.browR) * 0.75 + browLiftR * 25),
      browOuterUpRight: Math.max(0, this.currentProceduralExpressions.browR + browLiftR * 25),
      browOuterUpLeft: Math.max(0, this.currentProceduralExpressions.browL + browLiftL * 25),
      jawOpen: finalJawOpen,
      mouthSmileLeft: this.currentProceduralExpressions.smileL,
      mouthSmileRight: this.currentProceduralExpressions.smileR,
      mouthPucker: this.currentProceduralExpressions.pucker
    };

    const procWeight = 1.0 - animBlendWeight;

    // Apply procedural blendshapes directly to base geometry for expressive facial deformations
    let procBaseLandmarks = null;
    if (procWeight > 0.001) {
      // Create non-blink version for landmark deformation (blinking is handled smoothly by eyelid points below)
      const bsForDeform = { ...proceduralBlendshapes, eyeBlinkLeft: 0, eyeBlinkRight: 0 };
      procBaseLandmarks = this.applyBlendshapesToLandmarks(this.baseLandmarks, bsForDeform, renderW, renderH);
    }

    const finalBlendshapes = { ...proceduralBlendshapes };
    if (animSample && animSample.blendshapes && animBlendWeight > 0.001) {
      const animBs = animSample.blendshapes;
      const allKeys = new Set([...Object.keys(proceduralBlendshapes), ...Object.keys(animBs)]);
      for (const k of allKeys) {
        const v0 = proceduralBlendshapes[k] || 0;
        const v1 = animBs[k] || 0;
        finalBlendshapes[k] = v0 * (1.0 - animBlendWeight) + v1 * animBlendWeight;
      }
    }

    // Continuous seamless handoff between Procedural and Performance Head Pose
    let finalPitch, finalYaw, finalRoll;
    let finalTransX, finalTransY, finalTransZ;

    if (this.autonomousSubMode === 'RECORDED_ANIM' && this.activeAnimation) {
      const anim = this.activeAnimation;
      const elapsed = now - this.animStartTime;
      const delayMs = (this.audioDelaySec ?? 2.2) * 1000.0;
      const audioDurationMs = anim._audioBuffer ? (anim._audioBuffer.duration * 1000.0) : 0;
      const effectiveDuration = Math.max(anim.durationMs, delayMs + audioDurationMs);
      const fadeDuration = this.animFadeDuration;

      if (elapsed < fadeDuration) {
        // Fading in from animTransitionFrom pose to recorded performance pose
        const w = animBlendWeight;
        const invW = 1.0 - w;
        const fromHead = this.animTransitionFrom?.head || { pitch: effPitch, yaw: effYaw, roll: effRoll };
        const fromTrans = this.animTransitionFrom?.trans || { x: effTransX, y: effTransY, z: effTransZ };

        finalPitch = fromHead.pitch * invW + targetPitch * w;
        finalYaw = fromHead.yaw * invW + targetYaw * w;
        finalRoll = fromHead.roll * invW + targetRoll * w;
        finalTransX = fromTrans.x * invW + targetTransX * w;
        finalTransY = fromTrans.y * invW + targetTransY * w;
        finalTransZ = fromTrans.z * invW + targetTransZ * w;
      } else if (elapsed < effectiveDuration) {
        // Full performance playback
        finalPitch = targetPitch;
        finalYaw = targetYaw;
        finalRoll = targetRoll;
        finalTransX = targetTransX;
        finalTransY = targetTransY;
        finalTransZ = targetTransZ;
      } else {
        // Fading out: gently return from ending performance pose towards center (0, 0, 0)
        const fadeOutElapsed = elapsed - effectiveDuration;
        const rawExit = Math.max(0, Math.min(1, fadeOutElapsed / fadeDuration));
        const exitW = rawExit * rawExit * rawExit * (rawExit * (rawExit * 6 - 15) + 10);
        const animHoldW = 1.0 - exitW;

        finalPitch = targetPitch * animHoldW;
        finalYaw = targetYaw * animHoldW;
        finalRoll = targetRoll * animHoldW;
        finalTransX = targetTransX * animHoldW;
        finalTransY = targetTransY * animHoldW;
        finalTransZ = targetTransZ * animHoldW;
      }

      this.currentHead = { pitch: finalPitch, yaw: finalYaw, roll: finalRoll };
      this.targetHead = { ...this.currentHead };
      this.currentTrans = { x: finalTransX, y: finalTransY, z: finalTransZ };
      this.targetTrans = { ...this.currentTrans };
    } else {
      finalPitch = effPitch;
      finalYaw = effYaw;
      finalRoll = effRoll;
      finalTransX = effTransX;
      finalTransY = effTransY;
      finalTransZ = effTransZ;
    }

    // 4. Deform 3D Landmarks around Head Anchor (Sellion / Nose Root landmark 168)
    const len = this.baseLandmarks.length;
    const morphedLandmarks = new Array(len);
    const anchor = this.baseLandmarks[168] || this.baseLandmarks[1] || { x: 0.5, y: 0.5, z: 0 };

    const center = {
      x: 0.5 + finalTransX * mirrorSign,
      y: 0.5 + finalTransY,
      z: 0.0 - finalTransZ
    };

    // Rotation matrix for head pose (screen space aligned)
    this.eulerHelper.set(
      THREE.MathUtils.degToRad(finalPitch),
      THREE.MathUtils.degToRad(-finalYaw * mirrorSign),
      THREE.MathUtils.degToRad(finalRoll * mirrorSign),
      'YXZ'
    );
    this.matrixHelper.makeRotationFromEuler(this.eulerHelper);

    // Allow gaze to extend further only if head is heavily tilted/turned ("à moins que le visage s'incline vraiment énormément")
    const heavyTiltBonus = Math.max(0, (Math.abs(effYaw) - 22.0) / 20.0);
    const gazeScaleX = 1.0 + heavyTiltBonus * 0.45;

    // Tuned ocular shift: natural subtle gaze that keeps pupils visible in the eye sockets
    const baseGazeAmpX = 0.020 * gazeScaleX;
    const baseGazeAmpY = 0.015;
    const eyeShiftX = compensatedGazeX * baseGazeAmpX * mirrorSign * procWeight;
    const eyeShiftY = compensatedGazeY * baseGazeAmpY * procWeight;

    // Eyelid articulation weights from finalBlendshapes
    const curBlinkR = finalBlendshapes.eyeBlinkRight || 0;
    const curBlinkL = finalBlendshapes.eyeBlinkLeft || 0;

    // Perspective depth scaling: face expands realistically when moving closer, contracts when moving back
    const zDepthScale = Math.max(0.65, Math.min(1.45, 1.0 + finalTransZ * 1.8));

    for (let i = 0; i < len; i++) {
      const src = this.baseLandmarks[i];
      const procPt = (procBaseLandmarks && procBaseLandmarks[i]) || src;
      let basePtX = procPt.x;
      let basePtY = procPt.y;
      let basePtZ = procPt.z || 0;

      if (animBaseLandmarks && animBlendWeight > 0.001) {
        const animPt = animBaseLandmarks[i] || src;
        basePtX = procPt.x * (1.0 - animBlendWeight) + animPt.x * animBlendWeight;
        basePtY = procPt.y * (1.0 - animBlendWeight) + animPt.y * animBlendWeight;
        basePtZ = (procPt.z || 0) * (1.0 - animBlendWeight) + (animPt.z || 0) * animBlendWeight;
      }

      // Relative vector from head rotation pivot in isotropic space
      const dx = (basePtX - anchor.x) * ar;
      const dy = basePtY - anchor.y;
      const dz = (basePtZ - anchor.z) * ar;

      this.rotVec.set(dx, dy, dz);
      this.rotVec.applyMatrix4(this.matrixHelper);

      let outX = center.x + (this.rotVec.x * zDepthScale) / ar;
      let outY = center.y + (this.rotVec.y * zDepthScale);
      let outZ = center.z + (this.rotVec.z / ar);

      // Apply ocular gaze shift to iris landmarks (468 to 477) during procedural wander
      if (i >= 468 && i <= 477 && procWeight > 0.001) {
        outX += eyeShiftX;
        outY -= eyeShiftY;
      }

      // Apply subtle procedural eyebrow animation if not already deformed in procBaseLandmarks
      if (!procBaseLandmarks && animBlendWeight < 0.99) {
        const browFade = 1.0 - animBlendWeight;
        if (this.EYEBROW_R.has(i)) {
          outY -= browLiftR * browFade;
        } else if (this.EYEBROW_L.has(i)) {
          outY -= browLiftL * browFade;
        }
      }

      morphedLandmarks[i] = {
        x: outX,
        y: outY,
        z: outZ,
        visibility: src.visibility
      };
    }

    // Apply full anatomical eyelid and orbital cavity closure (creux des yeux) across all modes
    if (curBlinkR > 0.005 || curBlinkL > 0.005) {
      this.applyEyelidClosure(morphedLandmarks, curBlinkR, curBlinkL);
    }

    // Apply vertex-level quintic interpolation during entrance into recorded animation
    let outputLandmarks = morphedLandmarks;
    if (this.autonomousSubMode === 'RECORDED_ANIM' && this.animTransitionFrom?.landmarks) {
      const elapsed = now - this.animStartTime;
      if (elapsed < this.animFadeDuration) {
        const rawT = Math.max(0, Math.min(1, elapsed / this.animFadeDuration));
        const wAnim = rawT * rawT * rawT * (rawT * (rawT * 6 - 15) + 10);
        const invW = 1.0 - wAnim;
        const fromLms = this.animTransitionFrom.landmarks;
        const blended = new Array(len);
        for (let i = 0; i < len; i++) {
          const fromPt = fromLms[i] || morphedLandmarks[i];
          const toPt = morphedLandmarks[i];
          blended[i] = {
            x: fromPt.x * invW + toPt.x * wAnim,
            y: fromPt.y * invW + toPt.y * wAnim,
            z: (fromPt.z || 0) * invW + (toPt.z || 0) * wAnim,
            visibility: toPt.visibility
          };
        }
        outputLandmarks = blended;
      }
    } else if (this.isTransitioningToAutonomous && this.transFromLandmarks && transT < 1.0) {
      const invT = 1.0 - transT;
      const blended = new Array(len);
      for (let i = 0; i < len; i++) {
        const fromPt = this.transFromLandmarks[i] || morphedLandmarks[i];
        const toPt = morphedLandmarks[i];
        blended[i] = {
          x: fromPt.x * invT + toPt.x * transT,
          y: fromPt.y * invT + toPt.y * transT,
          z: (fromPt.z || 0) * invT + (toPt.z || 0) * transT,
          visibility: toPt.visibility
        };
      }
      outputLandmarks = blended;
    }

    // Cache exact rendered state for continuous next-frame transitions
    this.lastRenderedPitch = finalPitch;
    this.lastRenderedYaw = finalYaw;
    this.lastRenderedRoll = finalRoll;
    this.lastRenderedTransX = finalTransX;
    this.lastRenderedTransY = finalTransY;
    this.lastRenderedTransZ = finalTransZ;
    this.lastRenderedGazeX = compensatedGazeX;
    this.lastRenderedGazeY = compensatedGazeY;
    this.lastRenderedLandmarks = outputLandmarks;

    const effHeadPose = {
      pitch: finalPitch,
      yaw: finalYaw,
      roll: finalRoll,
      x: finalTransX * renderW,
      y: finalTransY * renderH,
      z: finalTransZ * renderW,
      zDepthScale
    };

    // Cache latest generated landmarks & pose for seamless return-to-live handoff
    this.lastAutonomousLandmarks = outputLandmarks;
    this.lastAutonomousHeadPose = effHeadPose;

    return {
      detected: true,
      isAutonomous: true,
      subMode: this.autonomousSubMode,
      activeAnimationName: this.activeAnimation ? this.activeAnimation.name : null,
      animBlendWeight,
      timestamp: now,
      latencyMs: 0,
      landmarks: outputLandmarks,
      liveLandmarks: this.baseLandmarks, // Points to base memory for UV mapping
      headPose: effHeadPose,
      blendshapes: finalBlendshapes
    };
  }
}
