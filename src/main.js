/**
 * Photomaton FaceMesh // Pure Facial Expression Motion Capture & Head Pose Retargeter
 * 
 * High-precision recording of live facial expressions with complete 6-DoF rigid head movement
 * compensation, zero-jump seamless cyclical looping, and direct application onto the live 3D head.
 */

import { CameraManager } from './core/camera.js';
import { FaceTracker } from './core/tracker.js';
import { FaceMeshRenderer } from './core/renderer.js';
import { ExpressionLooper } from './mocap/expressionLooper.js';
import { AutoCalibrator } from './mocap/autoCalibrator.js';
import { AudioLooper } from './audio/audioLooper.js';
import { VideoPerformanceExtractor } from './video/videoPerformanceExtractor.js';
import { AutonomousGazeEngine } from './core/autonomousGazeEngine.js';
import { FaceTextureHistoryBuffer } from './core/faceTextureHistoryBuffer.js';
import { AnimationLibrary } from './core/animationLibrary.js';
import { VisitorDetector } from './core/visitorDetector.js';
import { CanvasBroadcaster } from './webrtc/canvasBroadcaster.js';

class App {
  constructor() {
    this.videoEl = document.getElementById('webcam-video');
    this.canvasEl = document.getElementById('output-canvas');
    this.loadingOverlay = document.getElementById('loading-overlay');
    this.loadingText = document.getElementById('loading-text');

    // Modules
    this.camera = new CameraManager(this.videoEl);
    this.tracker = new FaceTracker({ smoothing: true });
    this.renderer = new FaceMeshRenderer(this.canvasEl, this.videoEl);
    this.looper = new ExpressionLooper();
    this.autoCalibrator = new AutoCalibrator(this.looper);
    this.audioLooper = new AudioLooper();
    this.videoExtractor = new VideoPerformanceExtractor({ fps: 30, maxDuration: 40.0 });
    this.autonomousEngine = new AutonomousGazeEngine();
    this.historyBuffer = new FaceTextureHistoryBuffer(24, 150); // Cleanest frontal face capture tracker
    this.historyBuffer.addEventListener('pristine-capture', (e) => this.handlePristineCapture(e.detail));
    this.animLibrary = new AnimationLibrary();
    this.autonomousEngine.setAnimationLibrary(this.animLibrary);
    this.visitorDetector = new VisitorDetector({
      threshold: 0.20,
      morphThreshold: 0.16,
      minAbsenceMs: 1500,
      longAbsenceMs: 20000
    });
    this.visitorDetector.addEventListener('new-visitor', (e) => this.handleNewVisitor(e.detail));
    this.canvasBroadcaster = new CanvasBroadcaster(this.canvasEl);
    this.isProcessingVideo = false;

    // Presence & State Machine
    this.appState = 'WAITING'; // 'WAITING', 'LIVE', 'NEW_PERSON', 'AUTONOMOUS'
    this.lastFaceDetectedTime = 0;
    this.consecutiveDetectedFrames = 0;
    this.hasTakenSnapshotForVisitor = false;
    this.lastSnapshotTimestamp = 0;
    this.autoSnapshotEnabled = true;
    this.forceAutonomousMode = false;
    this.recentSnapshots = [];
    this.latestSnapshot = null;
    this.toastTimeout = null;

    // Last known tracking frames for seamless handoff
    this.lastTrackingLandmarks = null;
    this.lastTrackingHeadPose = null;
    this.lastRenderedTrackingResult = null;

    // Bidirectional Smooth State Handoff (Autonomous <-> Live)
    this.isBlendingToLive = false;
    this.blendToLiveStartTime = 0;
    this.blendToLiveDuration = 450;
    this.autoExitLandmarks = null;

    // Offscreen fallback buffer canvas
    this.lastFaceCanvas = document.createElement('canvas');
    this.lastFaceCtx = this.lastFaceCanvas.getContext('2d');

    // Stats
    this.fpsCounter = 0;
    this.lastFpsTime = performance.now();
    this.currentFps = 60;
    this.rafId = null;

    // Defaults: Mirror ON, 1€ Smoothing ON on tracker, Webcam ON, Face Texture ON
    this.isMirrored = true;
    this.showWebcam = true;

    this.autonomousEngine.setMirrored(this.isMirrored);
    this.renderer.setMirrored(true);

    this.init();
  }

  async init() {
    try {
      this.setupEventListeners();

      // 1. Initialize Face Tracker AI
      await this.tracker.init((status) => {
        if (this.loadingText) this.loadingText.textContent = status;
      });

      // 1b. Initialize Animation Library in public/animations/
      try {
        await this.animLibrary.init();
        this.updateAnimationBadge();
      } catch (animErr) {
        console.warn('Animation Library init warning:', animErr);
      }

      // Unlock Web Audio context on first user interaction for zero-latency lip sync
      const unlockAudio = async () => {
        try {
          const audioCtx = await this.audioLooper.ensureAudioContext();
          if (audioCtx) {
            this.autonomousEngine.setAudioContext(audioCtx);
            this.animLibrary.setAudioContext(audioCtx);
          }
        } catch (e) {}
      };
      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('touchstart', unlockAudio, { once: true });

      // 2. Start Camera (720p 60fps)
      if (this.loadingText) this.loadingText.textContent = 'Starting camera stream...';
      try {
        await this.camera.start(null, { width: 1280, height: 720 });
      } catch (camErr) {
        console.warn('Camera failed to start:', camErr);
        if (this.loadingText) {
          this.loadingText.innerHTML = `
            <div style="font-size: 13px; margin-bottom: 8px;">📷 Webcam unavailable (${camErr.message || 'permission denied'})</div>
            <div style="display: flex; gap: 8px; justify-content: center; margin-top: 10px;">
              <button id="btn-retry-camera" class="tool-btn" style="padding: 6px 12px; font-size: 12px;">↺ Retry Camera</button>
              <button id="btn-skip-camera" class="tool-btn active" style="padding: 6px 12px; font-size: 12px;">📁 Video Upload Mode</button>
            </div>
          `;
          document.getElementById('btn-retry-camera')?.addEventListener('click', () => window.location.reload());
          document.getElementById('btn-skip-camera')?.addEventListener('click', () => {
            if (this.loadingOverlay) this.loadingOverlay.classList.add('hidden');
          });
        }
      }

      // 3. Handle Canvas Dimensions
      this.handleResize();
      window.addEventListener('resize', () => this.handleResize());

      // 4. Hide Loading Overlay if camera started
      if (this.camera.isStreaming && this.loadingOverlay) {
        this.loadingOverlay.classList.add('hidden');
      }

      // 5. Start Render Loop
      this.startLoop();

    } catch (err) {
      console.error('Initialization failed:', err);
      if (this.loadingText) {
        this.loadingText.innerHTML = `
          <div>Error: ${err.message || 'Initialization failed'}</div>
          <button class="tool-btn" style="padding: 6px 12px; margin-top: 10px;" onclick="window.location.reload()">↺ Retry</button>
        `;
      }
    }
  }

  handleResize() {
    const stage = document.getElementById('stage-container');
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    this.renderer.resize(width, height);
  }

  setupEventListeners() {
    // Always display textured mask with webcam background
    this.showWebcam = true;
    document.body.classList.add('show-webcam', 'show-texture');



    // 3. Mirror Toggle Button
    const btnMirror = document.getElementById('btn-toggle-mirror');
    btnMirror.addEventListener('click', () => {
      this.isMirrored = !this.isMirrored;
      btnMirror.classList.toggle('active', this.isMirrored);
      this.renderer.setMirrored(this.isMirrored);
      this.autonomousEngine.setMirrored(this.isMirrored);
    });

    // 3b. Autonomous Mode Toggle Button
    const btnAutonomous = document.getElementById('btn-toggle-autonomous');
    btnAutonomous?.addEventListener('click', () => {
      this.forceAutonomousMode = !this.forceAutonomousMode;
      btnAutonomous.classList.toggle('active', this.forceAutonomousMode);
      if (this.forceAutonomousMode) {
        if (this.autonomousEngine.hasSeenFace) {
          this.setState('AUTONOMOUS');
          this.applyBestTextureReference(performance.now());
          this.autonomousEngine.startAutonomous(
            performance.now(),
            this.lastTrackingLandmarks,
            this.lastTrackingHeadPose
          );
        } else {
          alert('Veuillez vous placer devant la caméra une première fois pour initialiser le masque.');
          this.forceAutonomousMode = false;
          btnAutonomous.classList.remove('active');
        }
      } else {
        if (this.appState === 'AUTONOMOUS') {
          this.isBlendingToLive = true;
          this.blendToLiveStartTime = performance.now();
          this.blendToLiveDuration = 600;
          this.autoExitLandmarks = this.autonomousEngine.lastAutonomousLandmarks
            ? this.autonomousEngine.lastAutonomousLandmarks.map(p => ({ x: p.x, y: p.y, z: p.z || 0 }))
            : null;
          this.autonomousEngine.stopAutonomous();
        }
        if (this.renderer.isTextureFrozen) {
          this.renderer.unfreezeFaceTexture();
        }
        this.setState('LIVE');
      }
    });

    // 3c. Auto-Snapshot Toggle Button (Default: ON)
    const btnAutoSnapshot = document.getElementById('btn-toggle-auto-snapshot');
    btnAutoSnapshot?.addEventListener('click', () => {
      this.autoSnapshotEnabled = !this.autoSnapshotEnabled;
      btnAutoSnapshot.classList.toggle('active', this.autoSnapshotEnabled);
    });

    // 3d. Snapshot Toast Actions (Download & Close)
    const btnDownloadToast = document.getElementById('btn-download-toast-snapshot');
    btnDownloadToast?.addEventListener('click', () => {
      if (this.latestSnapshot) {
        this.downloadSnapshot(this.latestSnapshot.dataUrl, `webcam_visiteur_${Date.now()}.jpg`);
      }
    });
    const btnCloseToast = document.getElementById('btn-close-toast-snapshot');
    btnCloseToast?.addEventListener('click', () => {
      document.getElementById('snapshot-toast')?.classList.add('hidden');
    });

    // 4. Neutral Baseline Calibration Button & Visual Toast
    const btnCalibrate = document.getElementById('btn-calibrate') || document.getElementById('btn-calibrate-neutral');
    const calibStatus = document.getElementById('calib-status');
    const calibIcon = document.getElementById('calib-icon');
    const calToast = document.getElementById('calibration-toast');
    const calText = document.getElementById('cal-text');

    if (btnCalibrate && this.looper?.calibrator) {
      btnCalibrate.addEventListener('click', () => {
        this.looper.calibrator.startCalibration();
      });

      this.looper.calibrator.addEventListener('calibration:start', () => {
        btnCalibrate.classList.add('calibrating');
        if (calibStatus) calibStatus.textContent = 'Hold Neutral...';
        if (calToast) {
          calToast.classList.remove('hidden');
          if (calText) calText.textContent = 'Calibrating neutral face... Hold still';
        }
      });

      this.looper.calibrator.addEventListener('calibration:progress', (e) => {
        const pct = Math.round(e.detail.progress * 100);
        if (calibStatus) calibStatus.textContent = `${pct}%`;
        if (calText) calText.textContent = `Calibrating neutral face... Hold still (${pct}%)`;
      });

      this.looper.calibrator.addEventListener('calibration:complete', () => {
        btnCalibrate.classList.remove('calibrating');
        btnCalibrate.classList.add('calibrated');
        if (calibIcon) calibIcon.textContent = '✓';
        if (calibStatus) calibStatus.textContent = 'Calibrated';
        if (calToast) {
          if (calText) calText.textContent = '✓ Neutral face calibrated';
          setTimeout(() => {
            calToast.classList.add('hidden');
          }, 1800);
        }
        setTimeout(() => {
          if (calibIcon) calibIcon.textContent = '🎯';
          if (calibStatus) calibStatus.textContent = 'Calibrate';
          btnCalibrate.classList.remove('calibrated');
        }, 2500);
      });
    }

    // 5. Snapshot Button
    const btnSnapshot = document.getElementById('btn-snapshot');
    if (btnSnapshot) {
      btnSnapshot.addEventListener('click', () => this.captureSnapshot());
    }

    // 5a. Fullscreen Button
    const btnFullscreen = document.getElementById('btn-fullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(console.warn);
          btnFullscreen.textContent = '✕';
        } else {
          document.exitFullscreen?.().catch(console.warn);
          btnFullscreen.textContent = '⛶';
        }
      });
      document.addEventListener('fullscreenchange', () => {
        btnFullscreen.textContent = document.fullscreenElement ? '✕' : '⛶';
      });
    }

    // 5b. Head Movement & Tracker Smoothing (Enabled by default)
    this.looper.setHeadSmoothing(true);
    this.tracker.setSmoothing(true);
    const btnSmoothing = document.getElementById('btn-toggle-smoothing');
    if (btnSmoothing) {
      btnSmoothing.addEventListener('click', () => {
        const newState = !this.looper.useHeadSmoothing;
        this.looper.setHeadSmoothing(newState);
        this.tracker.setSmoothing(newState);
        btnSmoothing.classList.toggle('active', newState);
      });
    }

    // 6. Webcam Expression Looper Controls
    const btnRecord = document.getElementById('btn-record-clip');
    const recLabel = document.getElementById('rec-label');
    const btnToggleLoop = document.getElementById('btn-toggle-loop');
    const loopBtnIcon = document.getElementById('loop-btn-icon');
    const loopLabel = document.getElementById('loop-label');
    const btnClearLoop = document.getElementById('btn-clear-loop');
    const btnSaveAnim = document.getElementById('btn-save-anim');
    const btnOpenAnimLibrary = document.getElementById('btn-open-anim-library');
    const sliderBlend = document.getElementById('slider-blend') || document.getElementById('slider-smooth');
    const blendValLabel = document.getElementById('blend-val-label') || document.getElementById('smooth-val-label');
    const sliderBoost = document.getElementById('slider-boost');
    const boostValLabel = document.getElementById('boost-val-label');
    const sliderEyeBlend = document.getElementById('slider-eye-blend');
    const eyeBlendValLabel = document.getElementById('eye-blend-val-label');
    const sliderContour = document.getElementById('slider-contour');
    const contourValLabel = document.getElementById('contour-val-label');
    const sliderAntiShake = document.getElementById('slider-anti-shake');
    const antiShakeValLabel = document.getElementById('anti-shake-val-label');
    const sliderAnimAudioDelay = document.getElementById('slider-anim-audio-delay');
    const animAudioDelayValLabel = document.getElementById('anim-audio-delay-val-label');
    const appStateLabel = document.getElementById('app-state-label');
    const timelineTrack = document.getElementById('timeline-track');

    // Initialize Expression Blend slider (Default: 0% = pure recorded animation)
    if (sliderBlend) {
      sliderBlend.value = '0';
      this.looper.setExpressionBlend(0.0);
      sliderBlend.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.looper.setExpressionBlend(val / 100.0);
        if (blendValLabel) blendValLabel.textContent = `${val}%`;
      });
    }

    // Initialize Expression Boost Slider (Default: 50% = 1.5x boost)
    if (sliderBoost) {
      sliderBoost.value = '50';
      this.looper.setExpressionBoost(0.5);
      if (boostValLabel) boostValLabel.textContent = '50%';
      sliderBoost.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.looper.setExpressionBoost(val / 100.0);
        if (boostValLabel) boostValLabel.textContent = `${val}%`;
      });
    }

    // Initialize Eye Animation Blend (Default: 0% = 100% Live Eyes, 100% = 100% Recorded Eyes)
    this.looper.setEyeBlend(0.0);
    if (sliderEyeBlend) {
      sliderEyeBlend.value = '0';
      if (eyeBlendValLabel) eyeBlendValLabel.textContent = '0%';
      sliderEyeBlend.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.looper.setEyeBlend(val / 100.0);
        if (eyeBlendValLabel) eyeBlendValLabel.textContent = `${val}%`;
      });
    }

    // Initialize Contour Lock / Attenuation (Default: 100% = contour 100% fixed, ring 1 at 50%)
    this.looper.setContourFix(1.0);
    if (sliderContour) {
      sliderContour.value = '100';
      if (contourValLabel) contourValLabel.textContent = '100%';
      sliderContour.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.looper.setContourFix(val / 100.0);
        if (contourValLabel) contourValLabel.textContent = `${val}%`;
      });
    }

    // Initialize Anti-Shake Common-Motion Smoothing (Default: 100%)
    this.looper.setAntiShake(1.0);
    if (sliderAntiShake) {
      sliderAntiShake.value = '100';
      if (antiShakeValLabel) antiShakeValLabel.textContent = '100%';
      sliderAntiShake.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.looper.setAntiShake(val / 100.0);
        if (antiShakeValLabel) antiShakeValLabel.textContent = `${val}%`;
      });
    }

    // Animation Audio Delay / Offset Slider (Range: 0.0s to 4.0s, Default: 2.2s)
    this.autonomousEngine.setAudioDelay(2.2);
    this.audioLooper.setAudioDelay(2.2);
    if (sliderAnimAudioDelay) {
      sliderAnimAudioDelay.value = '2.2';
      if (animAudioDelayValLabel) animAudioDelayValLabel.textContent = '2.2s';
      sliderAnimAudioDelay.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.autonomousEngine.setAudioDelay(val);
        this.audioLooper.setAudioDelay(val);
        if (animAudioDelayValLabel) animAudioDelayValLabel.textContent = `${val.toFixed(1)}s`;
      });
    }

    // 7. Audio Mute & Volume Controls
    const btnAudio = document.getElementById('btn-toggle-audio');
    const audioIcon = document.getElementById('audio-btn-icon');
    const audioLabel = document.getElementById('audio-btn-label');
    const sliderVolume = document.getElementById('slider-volume');
    const volumeValLabel = document.getElementById('volume-val-label');

    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        const isMuted = this.audioLooper.toggleMute();
        btnAudio.classList.toggle('active', !isMuted);
        if (audioIcon) audioIcon.textContent = isMuted ? '🔇' : '🔊';
        if (audioLabel) audioLabel.textContent = isMuted ? 'Muted' : 'Audio';
      });
    }

    if (sliderVolume) {
      sliderVolume.value = '100';
      this.audioLooper.setVolume(1.0);
      if (volumeValLabel) volumeValLabel.textContent = '100%';
      sliderVolume.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.audioLooper.setVolume(val / 100.0);
        if (volumeValLabel) volumeValLabel.textContent = `${val}%`;
      });
    }

    const toggleRecording = async () => {
      if (!this.looper.isRecording) {
        // Pre-warm Web Audio context and microphone stream for 0-latency start
        const audioCtx = await this.audioLooper.ensureAudioContext();
        if (audioCtx) {
          this.autonomousEngine.setAudioContext(audioCtx);
          this.animLibrary.setAudioContext(audioCtx);
        }
        await this.audioLooper.getMicrophoneStream();

        const tStart = performance.now();
        this.looper.startRecording(tStart);
        this.audioLooper.startRecording(tStart);
        btnRecord.classList.add('recording');
        recLabel.textContent = 'Stop Recording';
        btnToggleLoop.disabled = true;
        btnClearLoop.disabled = true;
        appStateLabel.textContent = 'RECORDING';
      } else {
        this.looper.stopRecording();
        btnRecord.classList.remove('recording');
        recLabel.textContent = 'Record Expression';
        btnToggleLoop.disabled = false;
        btnClearLoop.disabled = false;
        if (btnSaveAnim) btnSaveAnim.disabled = false;
        btnToggleLoop.classList.add('active');
        loopBtnIcon.textContent = '❚❚';
        loopLabel.textContent = 'Loop ON';
        appStateLabel.textContent = 'LOOPING';

        const audioBuf = await this.audioLooper.stopRecording(this.looper.loopDurationMs);
        if (audioBuf && this.looper.isPlaying) {
          this.audioLooper.startPlayback(0, this.looper.loopDurationMs / 1000.0);
        }
      }
    };

    btnRecord.addEventListener('click', toggleRecording);

    btnToggleLoop.addEventListener('click', () => {
      this.looper.togglePlayback();
      const isPlaying = this.looper.isPlaying;
      btnToggleLoop.classList.toggle('active', isPlaying);
      loopBtnIcon.textContent = isPlaying ? '❚❚' : '▶';
      loopLabel.textContent = isPlaying ? 'Loop ON' : 'Loop OFF';
      appStateLabel.textContent = isPlaying ? 'LOOPING' : 'LIVE';

      if (isPlaying && this.looper.loopDurationMs > 0) {
        const elapsed = (performance.now() - this.looper.playbackStartTime) * this.looper.playbackSpeed;
        const currentSec = (elapsed % this.looper.loopDurationMs) / 1000.0;
        this.audioLooper.startPlayback(currentSec, this.looper.loopDurationMs / 1000.0);
      } else {
        this.audioLooper.stopPlayback();
      }
    });

    btnClearLoop.addEventListener('click', () => {
      this.looper.clear();
      this.audioLooper.clear();
      btnToggleLoop.disabled = true;
      btnClearLoop.disabled = true;
      if (btnSaveAnim) btnSaveAnim.disabled = true;
      const btnSaveCurrentLoopModal = document.getElementById('btn-save-current-loop-modal');
      if (btnSaveCurrentLoopModal) btnSaveCurrentLoopModal.disabled = true;
      btnToggleLoop.classList.remove('active');
      loopBtnIcon.textContent = '▶';
      loopLabel.textContent = 'Play Loop';
      document.getElementById('timeline-progress').style.width = '0%';
      document.getElementById('time-current').textContent = '0.0s';
      document.getElementById('time-total').textContent = '0.0s';
      appStateLabel.textContent = 'LIVE';
    });

    // Timeline Scrubber Click to Seek
    if (timelineTrack) {
      timelineTrack.addEventListener('click', (e) => {
        if (!this.looper.isPlaying || this.looper.loopDurationMs <= 0) return;
        const rect = timelineTrack.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.looper.playbackStartTime = performance.now() - (ratio * this.looper.loopDurationMs);
        const targetSec = ratio * (this.looper.loopDurationMs / 1000.0);
        this.audioLooper.seek(targetSec, this.looper.loopDurationMs / 1000.0);
      });
    }

    // 8. Video Performance Uploader
    const btnUploadVideo = document.getElementById('btn-upload-video');
    const videoFileInput = document.getElementById('video-file-input');
    const uploadModal = document.getElementById('upload-modal');
    const uploadStatusText = document.getElementById('upload-status-text');
    const uploadProgressFill = document.getElementById('upload-progress-fill');
    const uploadProgressDetail = document.getElementById('upload-progress-detail');
    const btnCancelUpload = document.getElementById('btn-cancel-upload');

    if (btnUploadVideo && videoFileInput) {
      btnUploadVideo.addEventListener('click', () => {
        videoFileInput.click();
      });

      videoFileInput.addEventListener('change', async () => {
        const file = videoFileInput.files?.[0];
        if (!file) return;
        videoFileInput.value = '';

        this.isProcessingVideo = true;
        if (uploadModal) {
          uploadModal.classList.remove('hidden');
          if (uploadProgressFill) uploadProgressFill.style.width = '0%';
          if (uploadProgressDetail) uploadProgressDetail.textContent = '0%';
          if (uploadStatusText) uploadStatusText.textContent = 'Préparation du fichier vidéo...';
        }

        try {
          const result = await this.videoExtractor.extract(
            file,
            this.tracker,
            this.looper.cranial,
            this.audioLooper,
            ({ percent, message }) => {
              if (uploadProgressFill) uploadProgressFill.style.width = `${percent}%`;
              if (uploadProgressDetail) uploadProgressDetail.textContent = `${percent}%`;
              if (uploadStatusText) uploadStatusText.textContent = message;
            }
          );

          // 1. Load extracted facial frames into looper
          this.looper.loadRecordedFrames(result.frames, result.durationMs);

          // 2. Load extracted audio track into audio looper
          if (result.audioBuffer) {
            await this.audioLooper.loadAudioBuffer(result.audioBuffer, result.durationMs / 1000.0);
            this.audioLooper.startPlayback(0, result.durationMs / 1000.0);
          } else {
            this.audioLooper.clear();
          }

          // 3. Update UI Controls
          btnToggleLoop.disabled = false;
          btnClearLoop.disabled = false;
          if (btnSaveAnim) btnSaveAnim.disabled = false;
          btnToggleLoop.classList.add('active');
          loopBtnIcon.textContent = '❚❚';
          loopLabel.textContent = 'Loop ON';
          appStateLabel.textContent = 'LOOPING';

          // 4. Show success toast
          if (calToast && calText) {
            const durSec = (result.durationMs / 1000.0).toFixed(1);
            calText.textContent = `✓ Vidéo importée (${durSec}s, ${result.frames.length} frames${result.audioBuffer ? ' + audio' : ''})`;
            calToast.classList.remove('hidden');
            setTimeout(() => {
              calToast.classList.add('hidden');
            }, 3000);
          }
        } catch (err) {
          console.error('Video extraction failed:', err);
          if (calToast && calText) {
            calText.textContent = `Erreur: ${err.message || 'Échec de l\'extraction'}`;
            calToast.classList.remove('hidden');
            setTimeout(() => {
              calToast.classList.add('hidden');
            }, 3500);
          }
        } finally {
          if (uploadModal) uploadModal.classList.add('hidden');
          this.isProcessingVideo = false;
        }
      });
    }

    if (btnCancelUpload) {
      btnCancelUpload.addEventListener('click', () => {
        this.videoExtractor.cancel();
        if (uploadModal) uploadModal.classList.add('hidden');
        this.isProcessingVideo = false;
      });
    }

    // 9. 3D Camera Alignment & Offset Controls
    this.setupAlignControls();

    // 10. Dedicated Animation Library & 50% Random Autonomous Playback Controls
    this.setupAnimationLibraryControls();

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleRecording();
      } else if (e.key.toLowerCase() === 'm') {
        btnMirror?.click();
      } else if (e.key.toLowerCase() === 'u') {
        btnUploadVideo?.click();
      } else if (e.key.toLowerCase() === 'o') {
        document.getElementById('btn-toggle-align')?.click();
      } else if (e.key.toLowerCase() === 'a') {
        btnAutonomous?.click();
      }
    });
  }

  /**
   * 3D Camera Alignment / Offset Mode Setup
   */
  setupAlignControls() {
    const btnToggleAlign = document.getElementById('btn-toggle-align');
    const alignPanel = document.getElementById('align-panel');
    const btnCloseAlign = document.getElementById('btn-close-align');
    const alignOverlay = document.getElementById('align-overlay');
    const alignCrosshair = document.getElementById('align-crosshair');
    const checkAlignGrid = document.getElementById('check-align-grid');
    const btnResetCamAll = document.getElementById('btn-reset-cam-all');

    const sliderCamX = document.getElementById('slider-cam-x');
    const valCamX = document.getElementById('val-cam-x');
    const sliderCamY = document.getElementById('slider-cam-y');
    const valCamY = document.getElementById('val-cam-y');

    const sliderCamPitch = document.getElementById('slider-cam-pitch');
    const valCamPitch = document.getElementById('val-cam-pitch');
    const sliderCamYaw = document.getElementById('slider-cam-yaw');
    const valCamYaw = document.getElementById('val-cam-yaw');
    const sliderCamRoll = document.getElementById('slider-cam-roll');
    const valCamRoll = document.getElementById('val-cam-roll');

    const sliderCamZoom = document.getElementById('slider-cam-zoom');
    const valCamZoom = document.getElementById('val-cam-zoom');

    const resetButtons = document.querySelectorAll('.align-btn-reset');

    this.isAlignModeActive = false;

    // Default camera offset is strictly neutral (0 offset, 0 tilt, 1.0 zoom)
    // Clear any stale tilted camera offset from localStorage so the base alignment is strictly correct
    localStorage.removeItem('facemesh_camera_offset');
    const offset = { x: 0, y: 0, pitch: 0, yaw: 0, roll: 0, zoom: 1.0 };
    this.renderer.setCameraOffset(offset);

    const saveOffset = () => {
      localStorage.setItem('facemesh_camera_offset', JSON.stringify(this.renderer.getCameraOffset()));
    };

    const updateUIFromState = () => {
      const cur = this.renderer.getCameraOffset();
      if (sliderCamX) sliderCamX.value = cur.x;
      if (valCamX) valCamX.textContent = `${Math.round(cur.x)}px`;

      if (sliderCamY) sliderCamY.value = cur.y;
      if (valCamY) valCamY.textContent = `${Math.round(cur.y)}px`;

      if (sliderCamPitch) sliderCamPitch.value = cur.pitch;
      if (valCamPitch) valCamPitch.textContent = `${cur.pitch.toFixed(1)}°`;

      if (sliderCamYaw) sliderCamYaw.value = cur.yaw;
      if (valCamYaw) valCamYaw.textContent = `${cur.yaw.toFixed(1)}°`;

      if (sliderCamRoll) sliderCamRoll.value = cur.roll;
      if (valCamRoll) valCamRoll.textContent = `${cur.roll.toFixed(1)}°`;

      if (sliderCamZoom) sliderCamZoom.value = Math.round(cur.zoom * 100);
      if (valCamZoom) valCamZoom.textContent = `${Math.round(cur.zoom * 100)}%`;
    };

    updateUIFromState();

    // Toggle Align Mode
    const setAlignMode = (active) => {
      this.isAlignModeActive = active;
      if (btnToggleAlign) btnToggleAlign.classList.toggle('active', active);
      if (alignPanel) alignPanel.classList.toggle('hidden', !active);
      if (alignOverlay) alignOverlay.classList.toggle('hidden', !active);
    };

    if (btnToggleAlign) {
      btnToggleAlign.addEventListener('click', () => {
        setAlignMode(!this.isAlignModeActive);
      });
    }

    if (btnCloseAlign) {
      btnCloseAlign.addEventListener('click', () => {
        setAlignMode(false);
      });
    }

    // Sliders
    if (sliderCamX) {
      sliderCamX.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.renderer.setCameraOffset({ x: val });
        if (valCamX) valCamX.textContent = `${Math.round(val)}px`;
        saveOffset();
      });
    }

    if (sliderCamY) {
      sliderCamY.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.renderer.setCameraOffset({ y: val });
        if (valCamY) valCamY.textContent = `${Math.round(val)}px`;
        saveOffset();
      });
    }

    if (sliderCamPitch) {
      sliderCamPitch.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.renderer.setCameraOffset({ pitch: val });
        if (valCamPitch) valCamPitch.textContent = `${val.toFixed(1)}°`;
        saveOffset();
      });
    }

    if (sliderCamYaw) {
      sliderCamYaw.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.renderer.setCameraOffset({ yaw: val });
        if (valCamYaw) valCamYaw.textContent = `${val.toFixed(1)}°`;
        saveOffset();
      });
    }

    if (sliderCamRoll) {
      sliderCamRoll.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.renderer.setCameraOffset({ roll: val });
        if (valCamRoll) valCamRoll.textContent = `${val.toFixed(1)}°`;
        saveOffset();
      });
    }

    if (sliderCamZoom) {
      sliderCamZoom.addEventListener('input', (e) => {
        const pct = parseFloat(e.target.value);
        const z = pct / 100.0;
        this.renderer.setCameraOffset({ zoom: z });
        if (valCamZoom) valCamZoom.textContent = `${Math.round(pct)}%`;
        saveOffset();
      });
    }

    // Mini Reset Buttons
    resetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const axis = btn.dataset.axis;
        const cur = this.renderer.getCameraOffset();
        if (axis === 'x') cur.x = 0;
        else if (axis === 'y') cur.y = 0;
        else if (axis === 'pitch') cur.pitch = 0;
        else if (axis === 'yaw') cur.yaw = 0;
        else if (axis === 'roll') cur.roll = 0;
        else if (axis === 'zoom') cur.zoom = 1.0;
        this.renderer.setCameraOffset(cur);
        updateUIFromState();
        saveOffset();
      });
    });

    // Reset All
    if (btnResetCamAll) {
      btnResetCamAll.addEventListener('click', () => {
        localStorage.removeItem('facemesh_camera_offset');
        this.renderer.resetCameraOffset();
        updateUIFromState();
      });
    }

    // Crosshair Guide Checkbox
    if (checkAlignGrid && alignCrosshair) {
      checkAlignGrid.addEventListener('change', (e) => {
        alignCrosshair.classList.toggle('hidden', !e.target.checked);
      });
    }

    // Interactive Dragging on the Stage Overlay
    if (alignOverlay) {
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let isPanMode = false;
      let initialOffset = { x: 0, y: 0, pitch: 0, yaw: 0 };

      alignOverlay.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        // Shift key or Right click (button 2) triggers 2D displacement (Pan X / Y)
        isPanMode = e.shiftKey || (e.button === 2);
        initialOffset = this.renderer.getCameraOffset();
        alignOverlay.classList.add('dragging');
      });

      alignOverlay.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging || !this.isAlignModeActive) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const pan = isPanMode || e.shiftKey;

        if (pan) {
          // Pan: displacement X & Y
          const sens = 1.0;
          const newX = Math.round(initialOffset.x + deltaX * sens);
          const newY = Math.round(initialOffset.y - deltaY * sens);
          this.renderer.setCameraOffset({
            x: Math.max(-300, Math.min(300, newX)),
            y: Math.max(-300, Math.min(300, newY))
          });
        } else {
          // Orbit Tilt: pitch (haut/bas) & yaw (gauche/droite)
          const sens = 0.25;
          const newYaw = Number((initialOffset.yaw + deltaX * sens).toFixed(1));
          const newPitch = Number((initialOffset.pitch - deltaY * sens).toFixed(1));
          this.renderer.setCameraOffset({
            yaw: Math.max(-45, Math.min(45, newYaw)),
            pitch: Math.max(-45, Math.min(45, newPitch))
          });
        }

        updateUIFromState();
      });

      window.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          alignOverlay.classList.remove('dragging');
          saveOffset();
        }
      });

      // Mouse wheel to zoom
      alignOverlay.addEventListener('wheel', (e) => {
        e.preventDefault();
        const cur = this.renderer.getCameraOffset();
        const zoomDelta = e.deltaY > 0 ? -0.05 : 0.05;
        const newZoom = Math.max(0.5, Math.min(1.8, Number((cur.zoom + zoomDelta).toFixed(2))));
        this.renderer.setCameraOffset({ zoom: newZoom });
        updateUIFromState();
        saveOffset();
      }, { passive: false });
    }
  }

  setupAnimationLibraryControls() {
    const btnSaveAnim = document.getElementById('btn-save-anim');
    const btnOpenAnimLibrary = document.getElementById('btn-open-anim-library');
    const animLibraryModal = document.getElementById('anim-library-modal');
    const backdropAnimLibrary = document.getElementById('backdrop-anim-library');
    const btnCloseAnimModal = document.getElementById('btn-close-anim-modal');
    const btnCloseAnimModal2 = document.getElementById('btn-close-anim-modal-2');
    const btnSaveCurrentLoopModal = document.getElementById('btn-save-current-loop-modal');
    const toggleAutoPlayback = document.getElementById('toggle-autonomous-playback');

    const saveAnimModal = document.getElementById('save-anim-modal');
    const backdropSaveAnim = document.getElementById('backdrop-save-anim');
    const btnCloseSaveModal = document.getElementById('btn-close-save-modal');
    const btnCancelSaveAnim = document.getElementById('btn-cancel-save-anim');
    const btnConfirmSaveAnim = document.getElementById('btn-confirm-save-anim');
    const saveAnimNameInput = document.getElementById('save-anim-name-input');

    const openSaveModal = () => {
      if (!this.looper.recordedFrames || this.looper.recordedFrames.length === 0) {
        alert("Enregistrez d'abord une expression avec le bouton Record ou importez une vidéo.");
        return;
      }
      if (saveAnimModal) {
        saveAnimModal.classList.remove('hidden');
        if (saveAnimNameInput) {
          saveAnimNameInput.value = '';
          const defaultName = `Performance ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
          saveAnimNameInput.placeholder = defaultName;
          setTimeout(() => saveAnimNameInput.focus(), 50);
        }
      }
    };

    const closeSaveModal = () => {
      if (saveAnimModal) saveAnimModal.classList.add('hidden');
    };

    const handleConfirmSave = async () => {
      if (!this.looper.recordedFrames || this.looper.recordedFrames.length === 0) return;
      const defaultName = `Performance ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
      const name = (saveAnimNameInput && saveAnimNameInput.value.trim()) ? saveAnimNameInput.value.trim() : defaultName;

      btnConfirmSaveAnim.disabled = true;
      btnConfirmSaveAnim.textContent = 'Enregistrement...';

      try {
        const audioData = this.audioLooper ? this.audioLooper.exportWavBase64() : null;
        const exported = this.looper.exportAnimation(name, audioData);
        if (exported) {
          await this.animLibrary.saveAnimation(name, exported);
          this.updateAnimationBadge();
          this.renderAnimationList();
          closeSaveModal();

          const calToast = document.getElementById('calibration-toast');
          const calText = document.getElementById('cal-text');
          if (calToast && calText) {
            calText.textContent = `✓ Animation "${name}" sauvegardée dans public/animations/ !`;
            calToast.classList.remove('hidden');
            setTimeout(() => calToast.classList.add('hidden'), 3000);
          }
        }
      } catch (err) {
        console.error('Save animation error:', err);
        alert(`Échec de la sauvegarde: ${err.message}`);
      } finally {
        btnConfirmSaveAnim.disabled = false;
        btnConfirmSaveAnim.textContent = 'Enregistrer';
      }
    };

    if (btnSaveAnim) {
      btnSaveAnim.addEventListener('click', openSaveModal);
    }
    if (btnSaveCurrentLoopModal) {
      btnSaveCurrentLoopModal.addEventListener('click', openSaveModal);
    }

    if (btnCloseSaveModal) btnCloseSaveModal.addEventListener('click', closeSaveModal);
    if (btnCancelSaveAnim) btnCancelSaveAnim.addEventListener('click', closeSaveModal);
    if (backdropSaveAnim) backdropSaveAnim.addEventListener('click', closeSaveModal);
    if (btnConfirmSaveAnim) btnConfirmSaveAnim.addEventListener('click', handleConfirmSave);
    if (saveAnimNameInput) {
      saveAnimNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleConfirmSave();
        } else if (e.key === 'Escape') {
          closeSaveModal();
        }
      });
    }

    // Open Animation Library Modal
    const openLibraryModal = () => {
      this.renderAnimationList();
      if (animLibraryModal) {
        animLibraryModal.classList.remove('hidden');
        if (btnSaveCurrentLoopModal) {
          btnSaveCurrentLoopModal.disabled = (!this.looper.recordedFrames || this.looper.recordedFrames.length === 0);
        }
      }
    };

    const closeLibraryModal = () => {
      if (animLibraryModal) animLibraryModal.classList.add('hidden');
    };

    if (btnOpenAnimLibrary) btnOpenAnimLibrary.addEventListener('click', openLibraryModal);
    if (btnCloseAnimModal) btnCloseAnimModal.addEventListener('click', closeLibraryModal);
    if (btnCloseAnimModal2) btnCloseAnimModal2.addEventListener('click', closeLibraryModal);
    if (backdropAnimLibrary) backdropAnimLibrary.addEventListener('click', closeLibraryModal);

    // Toggle 50% random autonomous playback
    if (toggleAutoPlayback) {
      toggleAutoPlayback.checked = this.animLibrary.isAutonomousPlaybackEnabled;
      toggleAutoPlayback.addEventListener('change', (e) => {
        const enabled = !!e.target.checked;
        this.animLibrary.setAutonomousPlaybackEnabled(enabled);
        const calToast = document.getElementById('calibration-toast');
        const calText = document.getElementById('cal-text');
        if (calToast && calText) {
          calText.textContent = enabled ? "✓ Lecture aléatoire (50%) activée en mode autonome" : "Lecture aléatoire désactivée en mode autonome";
          calToast.classList.remove('hidden');
          setTimeout(() => calToast.classList.add('hidden'), 2500);
        }
      });
    }

    this.animLibrary.addEventListener('list:updated', () => {
      this.updateAnimationBadge();
    });
  }

  updateAnimationBadge() {
    const badge = document.getElementById('anim-count-badge');
    const countLabel = document.getElementById('anim-list-count-label');
    const count = this.animLibrary ? this.animLibrary.getActiveAnimationCount() : 0;
    if (badge) badge.textContent = count;
    if (countLabel) countLabel.textContent = `${count} animation${count > 1 ? 's' : ''}`;
  }

  renderAnimationList() {
    const container = document.getElementById('anim-list-container');
    if (!container) return;
    container.innerHTML = '';

    const animations = this.animLibrary.getAnimations();
    this.updateAnimationBadge();

    if (!animations || animations.length === 0) {
      container.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">
          Aucune animation enregistrée pour le moment.
        </div>
      `;
      return;
    }

    for (const anim of animations) {
      const card = document.createElement('div');
      card.className = 'anim-item-card';

      const durSec = ((anim.durationMs || 0) / 1000).toFixed(1);
      const isPreset = anim.id && anim.id.startsWith('preset_');

      card.innerHTML = `
        <div class="anim-item-info">
          <div class="anim-item-title-row">
            <span class="anim-item-name">${anim.name || 'Animation'}</span>
            ${anim.hasAudio ? '<span class="anim-item-badge audio">🔊 Audio</span>' : ''}
            ${isPreset ? '<span class="anim-item-badge">Prédéfini</span>' : '<span class="anim-item-badge">Enregistré</span>'}
          </div>
          <div class="anim-item-meta">
            ${durSec}s • ${anim.frameCount || (anim.frames ? anim.frames.length : 0)} frames • 📁 ${anim.filename || (anim.id + '.json')}
          </div>
        </div>
        <div class="anim-item-actions">
          <button class="anim-btn-test" title="Tester immédiatement l'animation sur le masque">▶ Tester</button>
          <button class="anim-btn-del" title="Supprimer cette animation">🗑️</button>
        </div>
      `;

      // Test Button
      const btnTest = card.querySelector('.anim-btn-test');
      btnTest.addEventListener('click', async () => {
        const fullAnim = await this.animLibrary.getAnimationData(anim.filename || anim.id);
        if (fullAnim) {
          // If not in autonomous mode, enter autonomous mode
          if (this.appState !== 'AUTONOMOUS') {
            this.setState('AUTONOMOUS');
            this.applyBestTextureReference(performance.now());
            this.autonomousEngine.startAutonomous(performance.now(), this.lastTrackingLandmarks, this.lastTrackingHeadPose);
          }
          this.autonomousEngine.playAnimation(fullAnim, performance.now());
          document.getElementById('anim-library-modal')?.classList.add('hidden');
        }
      });

      // Delete Button
      const btnDel = card.querySelector('.anim-btn-del');
      btnDel.addEventListener('click', async () => {
        if (confirm(`Supprimer l'animation "${anim.name}" du dossier public/animations/ ?`)) {
          await this.animLibrary.deleteAnimation(anim.filename || `${anim.id}.json`);
          this.renderAnimationList();
          this.updateAnimationBadge();
        }
      });

      container.appendChild(card);
    }
  }

  /**
   * Main Real-time Animation Loop (60 FPS)
   */
  startLoop() {
    const statFps = document.getElementById('stat-fps');
    const statLatency = document.getElementById('stat-latency');
    const timeCurrent = document.getElementById('time-current');
    const timeTotal = document.getElementById('time-total');
    const progressEl = document.getElementById('timeline-progress');

    this.setState('WAITING');

    const loop = () => {
      const now = performance.now();

      // Pause webcam inference if background video extraction is processing
      if (this.isProcessingVideo) {
        this.rafId = requestAnimationFrame(loop);
        return;
      }

      // 1. MediaPipe Frame Inference
      const rawTracking = this.tracker.processVideoFrame(this.videoEl, now);

      // Check whether a face is actively tracked on this frame
      const isFacePresent = Boolean(rawTracking && rawTracking.detected && !this.forceAutonomousMode);

      // Update aspect ratio and evaluate biometric visitor detection
      const ar = (this.videoEl.videoWidth || 1280) / Math.max(1, (this.videoEl.videoHeight || 720));
      this.visitorDetector.setAspectRatio(ar);
      this.visitorDetector.update(isFacePresent ? rawTracking : null, this.videoEl, now);

      if (isFacePresent) {
        this.consecutiveDetectedFrames++;
        this.lastFaceDetectedTime = now;

        // If not blending, unfreeze face texture to restore live webcam feed
        if (!this.isBlendingToLive && this.appState !== 'AUTONOMOUS' && this.renderer.isTextureFrozen) {
          this.renderer.unfreezeFaceTexture();
        }

        // Return from Autonomous mode: initiate smooth organic glide back to live face
        if (this.appState === 'AUTONOMOUS') {
          this.isBlendingToLive = true;
          this.blendToLiveStartTime = now;
          this.blendToLiveDuration = 700; // 700ms silky-smooth organic return glide
          this.autoExitLandmarks = this.autonomousEngine.lastAutonomousLandmarks
            ? this.autonomousEngine.lastAutonomousLandmarks.map(p => ({ x: p.x, y: p.y, z: p.z || 0 }))
            : null;
          this.autonomousEngine.stopAutonomous();
          if (this.appState !== 'NEW_PERSON') {
            this.setState('LIVE');
          }
        } else if (this.appState !== 'NEW_PERSON' && this.appState !== 'LIVE') {
          this.setState('LIVE');
        }

        // Record tracking frame into history buffer and evaluate quality (on fresh video frames)
        if (rawTracking.isNewFrame !== false) {
          this.historyBuffer.recordFrame(this.videoEl, rawTracking, now);
        }

        // If a clean, unobstructed frontal snapshot has been captured, link it to autonomous engine
        const bestCand = this.historyBuffer.bestOverallCandidate;
        if (bestCand && bestCand.landmarks) {
          this.autonomousEngine.setBaseLandmarks(bestCand.landmarks);
        }

        // Save last known live landmarks and head pose for seamless handoff
        this.lastTrackingLandmarks = rawTracking.landmarks.map(p => ({
          x: p.x,
          y: p.y,
          z: p.z || 0,
          visibility: p.visibility
        }));
        this.lastTrackingHeadPose = rawTracking.headPose ? { ...rawTracking.headPose } : null;

        // Continuously buffer current frame in fallback canvas
        const vw = this.videoEl.videoWidth || 1280;
        const vh = this.videoEl.videoHeight || 720;
        if (this.lastFaceCanvas.width !== vw || this.lastFaceCanvas.height !== vh) {
          this.lastFaceCanvas.width = vw;
          this.lastFaceCanvas.height = vh;
        }
        this.lastFaceCtx.drawImage(this.videoEl, 0, 0, vw, vh);

        // Feed live face orientation to autonomous gaze engine
        this.autonomousEngine.updateLiveFace(rawTracking);

        // Auto-calibrator updates
        this.autoCalibrator.update(rawTracking, now);

        // Process with ExpressionLooper
        const ar = (this.videoEl.videoWidth || 1280) / (this.videoEl.videoHeight || 720);
        const processedResult = this.looper.process(rawTracking, now, ar);

        if (processedResult && processedResult.detected) {
          let renderResult = processedResult;

          // Smooth quintic S-curve interpolation from Autonomous wandering position to live face
          if (this.isBlendingToLive && this.autoExitLandmarks) {
            const elapsed = now - this.blendToLiveStartTime;
            if (elapsed < this.blendToLiveDuration) {
              const rawT = Math.max(0, Math.min(1, elapsed / this.blendToLiveDuration));
              // Quintic smoothstep: zero velocity & zero acceleration at endpoints
              const t = rawT * rawT * rawT * (rawT * (rawT * 6 - 15) + 10);
              const invT = 1.0 - t;

              const blendedLandmarks = new Array(processedResult.landmarks.length);
              for (let i = 0; i < processedResult.landmarks.length; i++) {
                const livePt = processedResult.landmarks[i];
                const autoPt = this.autoExitLandmarks[i] || livePt;
                blendedLandmarks[i] = {
                  x: autoPt.x * invT + livePt.x * t,
                  y: autoPt.y * invT + livePt.y * t,
                  z: (autoPt.z || 0) * invT + (livePt.z || 0) * t,
                  visibility: livePt.visibility
                };
              }
              renderResult = {
                ...processedResult,
                landmarks: blendedLandmarks,
                blendToLiveWeight: invT // 1.0 at start, 0.0 at end
              };
            } else {
              this.isBlendingToLive = false;
              this.autoExitLandmarks = null;
              if (this.renderer.isTextureFrozen) {
                this.renderer.unfreezeFaceTexture();
              }
            }
          }

          this.lastRenderedTrackingResult = renderResult;
          this.renderer.render(renderResult);
        }

        if (rawTracking.latencyMs && statLatency) {
          statLatency.textContent = `${Math.round(rawTracking.latencyMs)}ms`;
        }

      } else {
        // Face is absent or force autonomous mode is active
        this.consecutiveDetectedFrames = 0;

        // Transition to AUTONOMOUS mode IMMEDIATELY when face tracking drops (Zero freeze!)
        if (this.autonomousEngine.hasSeenFace || this.forceAutonomousMode) {
          if (this.appState !== 'AUTONOMOUS') {
            this.setState('AUTONOMOUS');
            this.hasTakenSnapshotForVisitor = false;
            this.isBlendingToLive = false;
            this.autoExitLandmarks = null;

            // Freeze the single BEST centered, motionless, frontal, unobstructed screenshot as texture reference
            this.applyBestTextureReference(now);

            // Start autonomous mode with smooth quintic S-curve glide from last tracking pose into center
            this.autonomousEngine.startAutonomous(
              now,
              this.lastTrackingLandmarks,
              this.lastTrackingHeadPose
            );
          }

          // Generate autonomous frame
          const { renderW, renderH } = this.renderer.getVideoMetrics();
          const autoFrame = this.autonomousEngine.generateFrame(now, renderW, renderH);
          if (autoFrame) {
            this.lastRenderedTrackingResult = autoFrame;
            this.renderer.render(autoFrame);

            // Update app-state-label if random recorded animation is playing (50%)
            const stateLabelEl = document.getElementById('app-state-label');
            if (stateLabelEl && this.appState === 'AUTONOMOUS') {
              if (autoFrame.activeAnimationName && autoFrame.animBlendWeight > 0.05) {
                stateLabelEl.textContent = `AUTO // ${autoFrame.activeAnimationName.toUpperCase()} (50%)`;
              } else {
                stateLabelEl.textContent = 'AUTONOME';
              }
            }
          }

          if (statLatency) statLatency.textContent = `0ms`;

        } else {
          // Waiting for first user to arrive
          if (this.appState !== 'WAITING') {
            this.setState('WAITING');
          }
          this.renderer.clear();
          if (statLatency) statLatency.textContent = `0ms`;
        }
      }

      // 3. Update Timeline Scrubber
      if (this.looper.isRecording) {
        const elapsedSec = (now - this.looper.recordingStartTime) / 1000;
        timeCurrent.textContent = `${elapsedSec.toFixed(1)}s`;
        timeTotal.textContent = `REC...`;
        progressEl.style.width = '100%';
      } else if (this.looper.isPlaying && this.looper.loopDurationMs > 0) {
        const elapsed = (now - this.looper.playbackStartTime) * this.looper.playbackSpeed;
        const currentMs = elapsed % this.looper.loopDurationMs;
        const totalSec = this.looper.loopDurationMs / 1000;
        const currentSec = currentMs / 1000;
        timeCurrent.textContent = `${currentSec.toFixed(1)}s`;
        timeTotal.textContent = `${totalSec.toFixed(1)}s`;
        progressEl.style.width = `${(currentMs / this.looper.loopDurationMs) * 100}%`;
      }

      // 4. Calculate FPS
      this.fpsCounter++;
      if (now - this.lastFpsTime >= 500) {
        this.currentFps = Math.round((this.fpsCounter * 1000) / (now - this.lastFpsTime));
        if (statFps) statFps.textContent = this.currentFps;
        this.fpsCounter = 0;
        this.lastFpsTime = now;
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  /**
   * Freezes the cleanest, most centered, motionless, frontal screenshot as texture reference
   * for both the 3D mask and the background plane in autonomous mode.
   */
  applyBestTextureReference(now = performance.now(), minAgeMs = 1500) {
    const backupFrame = this.historyBuffer.getBestVisitorBackupFrame(now, minAgeMs);
    if (backupFrame && backupFrame.canvas && backupFrame.landmarks) {
      const ageStr = (now - backupFrame.timestamp).toFixed(0);
      console.log(`[FaceTextureHistoryBuffer] 🎭 Texture autonome de référence appliquée (Âge: ${ageStr}ms, Score: ${Math.round(backupFrame.qualityScore)})`);
      this.renderer.freezeFaceTexture(backupFrame.canvas, backupFrame.landmarks);
      this.autonomousEngine.setBaseLandmarks(backupFrame.landmarks);
      return true;
    } else if (this.autonomousEngine.baseLandmarks && this.renderer.isTextureFrozen) {
      return true;
    } else if (this.lastTrackingLandmarks && this.videoEl && this.videoEl.readyState >= 2) {
      this.renderer.freezeFaceTexture(this.videoEl, this.lastTrackingLandmarks);
      this.autonomousEngine.setBaseLandmarks(this.lastTrackingLandmarks);
      return true;
    }
    return false;
  }

  /**
   * Called whenever a pristine, centered, still, frontal screenshot is captured
   */
  handlePristineCapture(detail = {}) {
    const { canvas, landmarks, score, dataUrl } = detail;
    console.log(`[FaceTextureHistoryBuffer] 🌟 Meilleure référence faciale capturée ! (Score: ${Math.round(score)})`);
    if (landmarks) {
      this.autonomousEngine.setBaseLandmarks(landmarks);
    }
    if (this.autoSnapshotEnabled && dataUrl) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      const snapshotObj = {
        id: Date.now(),
        dataUrl,
        timeStr,
        width: canvas?.width || (this.videoEl.videoWidth || 1280),
        height: canvas?.height || (this.videoEl.videoHeight || 720),
        isPristine: true
      };
      this.latestSnapshot = snapshotObj;
      this.recentSnapshots.push(snapshotObj);
      this.showSnapshotToast(dataUrl, timeStr);
    }
  }

  handleNewVisitor(detail = {}) {
    const now = performance.now();
    const reason = detail.reason || 'BIOMETRIC_CHANGE';
    const dissimStr = detail.dissimilarity !== undefined ? detail.dissimilarity.toFixed(3) : 'N/A';
    console.log(`[VisitorDetector] 👤 Nouveau visiteur détecté ! (Raison: ${reason}, Dissimilarité: ${dissimStr})`);

    this.hasTakenSnapshotForVisitor = true;
    this.lastSnapshotTimestamp = now;
    this.setState('NEW_PERSON');

    // Start WebRTC stream transmission & broadcast alert to second computers
    if (this.canvasBroadcaster) {
      this.canvasBroadcaster.notifyNewVisitor(detail);
    }

    // Reset best visitor backup texture tracker for this new visitor session
    this.historyBuffer.resetVisitorSession();

    // Automatically take webcam snapshot of the new person
    if (this.autoSnapshotEnabled) {
      this.captureWebcamSnapshot();
    }

    // Return state to LIVE after 1.8s
    setTimeout(() => {
      if (this.appState === 'NEW_PERSON') {
        this.setState('LIVE');
      }
    }, 1800);
  }

  setState(newState) {
    this.appState = newState;
    document.body.classList.toggle('state-autonomous', newState === 'AUTONOMOUS');
    const statContainer = document.getElementById('state-stat-container');
    const stateLabel = document.getElementById('app-state-label');
    if (!statContainer || !stateLabel) return;

    statContainer.classList.remove('state-waiting', 'state-live', 'state-new-person', 'state-autonomous');

    switch (newState) {
      case 'WAITING':
        statContainer.classList.add('state-waiting');
        stateLabel.textContent = 'WAITING';
        break;
      case 'LIVE':
        statContainer.classList.add('state-live');
        stateLabel.textContent = 'LIVE';
        break;
      case 'NEW_PERSON':
        statContainer.classList.add('state-new-person');
        stateLabel.textContent = 'NOUVEAU VISITEUR';
        break;
      case 'AUTONOMOUS':
        statContainer.classList.add('state-autonomous');
        stateLabel.textContent = 'AUTONOME';
        break;
      default:
        stateLabel.textContent = newState;
    }
  }

  triggerShutterFlash() {
    const flashEl = document.getElementById('camera-flash');
    if (!flashEl) return;
    flashEl.classList.remove('flash-active');
    void flashEl.offsetWidth; // Force reflow
    flashEl.classList.add('flash-active');
    setTimeout(() => {
      flashEl.classList.remove('flash-active');
    }, 45);
  }

  playShutterSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // 1. Mechanical click (two short damped impulses)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.04);
      oscGain.gain.setValueAtTime(0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);

      // 2. High-pass shutter noise burst
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2400;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.28, now + 0.01);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now + 0.01);
      noise.stop(now + 0.06);
    } catch (e) {
      // AudioContext policy
    }
  }

  showSnapshotToast(dataUrl, timeStr) {
    const toast = document.getElementById('snapshot-toast');
    const toastImg = document.getElementById('snapshot-toast-img');
    const toastTime = document.getElementById('snapshot-toast-time');
    if (!toast || !toastImg) return;

    toastImg.src = dataUrl;
    if (toastTime) toastTime.textContent = timeStr;
    toast.classList.remove('hidden');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 6000);
  }

  downloadSnapshot(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename || `webcam_snapshot_${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  captureWebcamSnapshot() {
    if (!this.videoEl || this.videoEl.readyState < 2) return null;
    const vw = this.videoEl.videoWidth || 1280;
    const vh = this.videoEl.videoHeight || 720;

    const snapCanvas = document.createElement('canvas');
    snapCanvas.width = vw;
    snapCanvas.height = vh;
    const ctx = snapCanvas.getContext('2d');

    if (this.isMirrored) {
      ctx.translate(vw, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(this.videoEl, 0, 0, vw, vh);

    const dataUrl = snapCanvas.toDataURL('image/jpeg', 0.92);
    const now = new Date();
    const timeStr = now.toLocaleTimeString();

    const snapshotObj = {
      id: Date.now(),
      dataUrl,
      timeStr,
      width: vw,
      height: vh
    };

    this.latestSnapshot = snapshotObj;
    this.recentSnapshots.push(snapshotObj);

    // Floating UI toast notification (Silent and seamless - zero white flash)
    this.showSnapshotToast(dataUrl, timeStr);

    return snapshotObj;
  }

  /**
   * Capture Snapshot Image (Composite or Direct)
   */
  captureSnapshot() {
    const snapCanvas = document.createElement('canvas');
    snapCanvas.width = this.videoEl.videoWidth || 1280;
    snapCanvas.height = this.videoEl.videoHeight || 720;
    const ctx = snapCanvas.getContext('2d');

    ctx.fillStyle = this.showWebcam ? '#000000' : '#ffffff';
    ctx.fillRect(0, 0, snapCanvas.width, snapCanvas.height);

    if (this.showWebcam) {
      ctx.save();
      if (this.isMirrored) {
        ctx.translate(snapCanvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(this.videoEl, 0, 0, snapCanvas.width, snapCanvas.height);
      ctx.restore();
    }

    ctx.drawImage(this.canvasEl, 0, 0, snapCanvas.width, snapCanvas.height);

    snapCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facemesh_capture_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
