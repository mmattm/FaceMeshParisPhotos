/**
 * Photomaton FaceMesh // Pure Facial Expression Motion Capture & Head Pose Retargeter
 * 
 * Live facial expression tracking with complete 6-DoF rigid head movement
 * compensation, zero-jump seamless cyclical looping, and direct application onto the live 3D head.
 */

import { CameraManager } from './core/camera.js';
import { FaceTracker } from './core/tracker.js';
import { FaceMeshRenderer } from './core/renderer.js';
import { ExpressionLooper } from './mocap/expressionLooper.js';
import { AutoCalibrator } from './mocap/autoCalibrator.js';
import { AutonomousGazeEngine } from './core/autonomousGazeEngine.js';
import { FaceTextureHistoryBuffer } from './core/faceTextureHistoryBuffer.js';
import { AnimationLibrary } from './core/animationLibrary.js';
import { VisitorDetector } from './core/visitorDetector.js';
import { CanvasBroadcaster } from './webrtc/canvasBroadcaster.js';
import { MotionPresetRecorder } from './mocap/motionPresetRecorder.js';
import { setupFaceMeshAlignmentControls } from './ui/faceMeshAlignmentControls.js';
import { AudioLibraryControls } from './ui/audioLibraryControls.js';

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
    this.autonomousEngine = new AutonomousGazeEngine();
    this.historyBuffer = new FaceTextureHistoryBuffer(24, 150); // Cleanest frontal face capture tracker
    this.historyBuffer.addEventListener('pristine-capture', (e) => this.handlePristineCapture(e.detail));
    this.historyBuffer.addEventListener('fallback-capture', () => {
      this.showNotification('Cliché FaceMesh de secours mémorisé', 'success', 5000, 'facemesh-capture');
      this.handleVisitorSnapshotReady();
    });
    this.animLibrary = new AnimationLibrary();
    this.autonomousEngine.setAnimationLibrary(this.animLibrary);
    const savedVisitorSens = typeof localStorage !== 'undefined' ? localStorage.getItem('photomaton_visitor_sensitivity') : null;
    const initialVisitorSens = savedVisitorSens !== null ? Number(savedVisitorSens) : 50;
    this.visitorDetector = new VisitorDetector({
      sensitivity: initialVisitorSens
    });
    this.visitorDetector.addEventListener('new-visitor', (e) => this.handleNewVisitor(e.detail));
    this.canvasBroadcaster = new CanvasBroadcaster(this.canvasEl, {
      videoElement: this.videoEl,
      mirrored: true,
      width: 1080,
      height: 1080
    });
    this.canvasBroadcaster.mountPreview(document.getElementById('webrtc-preview-slot'));
    this.presetRecorder = new MotionPresetRecorder({ fps: 30, maxDurationMs: 30000 });
    this.isSavingPresetRecording = false;
    this.bustModeEnabled = false;
    this.bustModeRequested = false;
    this.minimalistMode = false;
    this.notificationEntries = new Map();
    this.currentVisitorId = null;
    this.hasVisitorSnapshot = false;
    this.comfyVisitorTimer = null;
    this.comfyVisitorPending = false;
    this.comfyVisitorReadyAt = 0;
    this.comfyCallId = 0;
    this.presetAudioLoading = false;
    this.comfySettings = {
      enabled: localStorage.getItem('photomaton_comfy_enabled') === 'true',
      baseUrl: localStorage.getItem('photomaton_comfy_base_url') || 'http://127.0.0.1:8188',
      workflowFilename: localStorage.getItem('photomaton_comfy_workflow') || ''
    };

    // Presence & State Machine
    this.appState = 'WAITING'; // 'WAITING', 'LIVE', 'NEW_PERSON', 'AUTONOMOUS'
    this.lastFaceDetectedTime = 0;
    this.consecutiveDetectedFrames = 0;
    this.forceAutonomousMode = false;

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

    // Mirror is permanently enabled; smoothing, webcam and texture are ON.
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

      try {
        await this.audioLibrary.refresh();
      } catch (error) {
        this.audioLibrary.report(error);
      }

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

      // 3. Initialize the fixed Full HD render surface once. Its CSS display
      // adapts to the operator window without changing the WebRTC composition.
      this.handleResize();

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
    this.renderer.resize(1920, 1080, 1);
  }

  setupEventListeners() {
    // Always display textured mask with webcam background
    this.showWebcam = true;
    document.body.classList.add('show-webcam', 'show-texture');

    document.getElementById('btn-copy-visitor-id')?.addEventListener('click', async () => {
      if (!this.currentVisitorId) return;
      const visitorId = this.currentVisitorId;
      try {
        await navigator.clipboard.writeText(visitorId);
        this.showNotification(`ID visiteur copié · ${visitorId.slice(0, 8)}`, 'success', 2200, 'visitor-id');
      } catch {
        window.prompt('ID du visiteur actuel — copier :', visitorId);
      }
    });

    // 3. Autonomous Mode Toggle Button
    const btnAutonomous = document.getElementById('btn-toggle-autonomous');
    btnAutonomous?.addEventListener('click', () => {
      if (this.presetRecorder.isRecording) {
        alert("Arrêtez d'abord l'enregistrement du preset.");
        return;
      }
      this.forceAutonomousMode = !this.forceAutonomousMode;
      btnAutonomous.classList.toggle('active', this.forceAutonomousMode);
      if (this.forceAutonomousMode) {
        if (this.canUseAutonomous()) {
          if (!this.applyBestTextureReference(performance.now())) {
            this.forceAutonomousMode = false;
            btnAutonomous.classList.remove('active');
            this.showNotification('Placez le visage de face, sans l’incliner, pour mémoriser le cliché.');
            return;
          }
          this.setState('AUTONOMOUS');
          this.autonomousEngine.startAutonomous(
            performance.now(),
            this.lastTrackingLandmarks,
            this.lastTrackingHeadPose
          );
        } else {
          this.showNotification('Un cliché FaceMesh mémorisé est nécessaire pour activer le mode autonome.');
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

    // 3b. Manual override for the bust, enabled automatically in autonomous mode.
    const btnBust = document.getElementById('btn-toggle-bust');
    this.renderer.setBustModel('male_facemesh_zone_creusee');

    btnBust?.addEventListener('click', () => {
      this.setBustMode(!this.renderer.showBust, true);
    });

    document.getElementById('btn-toggle-minimalist')?.addEventListener('click', () => {
      this.setMinimalistMode(!this.minimalistMode);
    });

    document.getElementById('btn-debug-new-visitor')?.addEventListener('click', () => {
      // Let live tracking collect a fresh visitor image during the test.
      if (this.forceAutonomousMode) btnAutonomous?.click();
      this.handleNewVisitor({ reason: 'DEBUG_TRIGGER' });
      this.showNotification('Nouveau visiteur simulé', '', 2200, 'visitor-debug');
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

    // 5. Fullscreen Button
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

    // 6. Visitor Detection Sensitivity (Range: 10% to 100%, Default: 50%)
    const sliderVisitorSens = document.getElementById('slider-visitor-sensitivity');
    const visitorSensValLabel = document.getElementById('visitor-sensitivity-val-label');
    const currentSens = this.visitorDetector?.getSensitivity?.() || 50;
    if (sliderVisitorSens) {
      sliderVisitorSens.value = String(currentSens);
      if (visitorSensValLabel) visitorSensValLabel.textContent = `${currentSens}%`;
      sliderVisitorSens.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.visitorDetector.setSensitivity(val);
        if (visitorSensValLabel) visitorSensValLabel.textContent = `${val}%`;
        try {
          localStorage.setItem('photomaton_visitor_sensitivity', String(val));
        } catch (e) {}
      });
    }

    // 7. 3D Camera Alignment & Offset Controls
    this.setupAlignControls();
    this.faceMeshAlignmentControls = setupFaceMeshAlignmentControls(this.renderer);
    this.setupPresetAudioControls();
    this.setupPresetExpressionControls();
    this.audioLibrary = new AudioLibraryControls(this);
    this.audioLibrary.bind();

    // 8. Dedicated Animation Library & 50% Random Autonomous Playback Controls
    this.setupAnimationLibraryControls();

    // 9. Motion-only preset recorder (no microphone and no audio payload)
    this.setupMotionPresetRecorder();

    // 10. Optional ComfyUI workflow execution on new visitor
    this.setupComfyUiControls();
    this.updateAutonomousAvailability(true);

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key.toLowerCase() === 'o') {
        document.getElementById('btn-toggle-align')?.click();
      } else if (e.key.toLowerCase() === 'a') {
        btnAutonomous?.click();
      }
    });
  }

  setupPresetExpressionControls() {
    const slider = document.getElementById('slider-expression-intensity');
    const value = document.getElementById('expression-intensity-value');
    if (!slider || !value) return;
    const storageKey = 'photomaton_preset_expression_intensity';
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) this.autonomousEngine.setPresetExpressionIntensity(Number(saved) / 100);
    } catch { /* Keep the default intensity. */ }
    const refresh = () => {
      const percent = Math.round(this.autonomousEngine.presetExpressionIntensity * 100);
      slider.value = percent;
      value.textContent = `${percent}%`;
    };
    refresh();
    slider.addEventListener('input', () => {
      this.autonomousEngine.setPresetExpressionIntensity(Number(slider.value) / 100);
      refresh();
      try { localStorage.setItem(storageKey, slider.value); } catch { /* Session-only adjustment. */ }
    });
  }

  refreshPresetAudioButton() {
    const button = document.getElementById('btn-preset-audio');
    if (!button) return;
    const player = this.autonomousEngine.presetAudio;
    button.textContent = this.presetAudioLoading ? 'Chargement audio…' : player.enabled ? '🔊 Audio' : '🔇 Audio';
    button.classList.toggle('active', player.enabled);
    button.setAttribute('aria-pressed', String(player.enabled));
    button.disabled = this.presetAudioLoading || !player.urls.length;
  }

  setupPresetAudioControls() {
    const button = document.getElementById('btn-preset-audio');
    button?.addEventListener('click', async () => {
      if (this.presetAudioLoading) return;
      const enabled = !this.autonomousEngine.presetAudio.enabled;
      this.presetAudioLoading = true;
      this.refreshPresetAudioButton();
      this.audioLibrary?.updateState();
      try {
        await this.autonomousEngine.setPresetAudioEnabled(enabled);
        const active = this.autonomousEngine.presetAudio.enabled;
        if (active) {
          await this.canvasBroadcaster.setAudioStream(this.autonomousEngine.presetAudio.destination.stream);
        }
        this.showNotification(active ? 'Audio et lipsync activés pour les presets' : 'Audio des presets désactivé',
          active ? 'success' : '', 3000, 'preset-audio');
      } catch (error) {
        await this.autonomousEngine.setPresetAudioEnabled(false);
        this.showNotification(`Audio indisponible · ${error.message}`, 'error', 5000, 'preset-audio');
      } finally {
        this.presetAudioLoading = false;
        this.refreshPresetAudioButton();
        this.audioLibrary?.updateState();
        this.updateAnimationPlaybackUI(true);
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
    const btnSaveCam = document.getElementById('btn-save-cam');
    const saveStatus = document.getElementById('align-save-status');

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

    const storageKey = 'facemesh_camera_offset';
    const offset = { x: 0, y: 0, pitch: 0, yaw: 0, roll: 0, zoom: 1.0 };
    let savedOffset = null;
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey));
      if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
        let hasValue = false;
        for (const [key, min, max] of [['x', -300, 300], ['y', -300, 300], ['pitch', -45, 45], ['yaw', -45, 45], ['roll', -30, 30], ['zoom', 0.5, 1.8]]) {
          if (Number.isFinite(stored[key])) {
            offset[key] = Math.max(min, Math.min(max, stored[key]));
            hasValue = true;
          }
        }
        if (hasValue) savedOffset = { ...offset };
      }
    } catch { /* Start neutral if browser storage is unavailable or invalid. */ }
    this.renderer.setCameraOffset(offset);

    const updateSaveStatus = () => {
      const current = this.renderer.getCameraOffset();
      const unchanged = savedOffset && Object.keys(offset).every(key => Math.abs(current[key] - savedOffset[key]) < 0.000001);
      if (saveStatus) saveStatus.textContent = unchanged ? 'Réglage enregistré' : 'Cliquez sur Save pour mémoriser';
    };

    btnSaveCam?.addEventListener('click', () => {
      try {
        const current = this.renderer.getCameraOffset();
        localStorage.setItem(storageKey, JSON.stringify(current));
        savedOffset = current;
        updateSaveStatus();
        this.showNotification('Alignement 3D enregistré sur ce navigateur', 'success', 2500, 'camera-alignment');
      } catch {
        if (saveStatus) saveStatus.textContent = 'Enregistrement indisponible sur ce navigateur';
        this.showNotification('Impossible de mémoriser l’alignement 3D', 'error', 3500, 'camera-alignment');
      }
    });

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
      updateSaveStatus();
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
        updateSaveStatus();
      });
    }

    if (sliderCamY) {
      sliderCamY.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.renderer.setCameraOffset({ y: val });
        if (valCamY) valCamY.textContent = `${Math.round(val)}px`;
        updateSaveStatus();
      });
    }

    if (sliderCamPitch) {
      sliderCamPitch.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.renderer.setCameraOffset({ pitch: val });
        if (valCamPitch) valCamPitch.textContent = `${val.toFixed(1)}°`;
        updateSaveStatus();
      });
    }

    if (sliderCamYaw) {
      sliderCamYaw.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.renderer.setCameraOffset({ yaw: val });
        if (valCamYaw) valCamYaw.textContent = `${val.toFixed(1)}°`;
        updateSaveStatus();
      });
    }

    if (sliderCamRoll) {
      sliderCamRoll.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.renderer.setCameraOffset({ roll: val });
        if (valCamRoll) valCamRoll.textContent = `${val.toFixed(1)}°`;
        updateSaveStatus();
      });
    }

    if (sliderCamZoom) {
      sliderCamZoom.addEventListener('input', (e) => {
        const pct = parseFloat(e.target.value);
        const z = pct / 100.0;
        this.renderer.setCameraOffset({ zoom: z });
        if (valCamZoom) valCamZoom.textContent = `${Math.round(pct)}%`;
        updateSaveStatus();
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
        updateSaveStatus();
      });
    });

    // Reset All
    if (btnResetCamAll) {
      btnResetCamAll.addEventListener('click', () => {
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
          updateSaveStatus();
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
        updateSaveStatus();
      }, { passive: false });
    }
  }

  setupAnimationLibraryControls() {
    const btnOpenAnimLibrary = document.getElementById('btn-open-anim-library');
    const animLibraryModal = document.getElementById('anim-library-modal');
    const backdropAnimLibrary = document.getElementById('backdrop-anim-library');
    const btnCloseAnimModal = document.getElementById('btn-close-anim-modal');
    const btnCloseAnimModal2 = document.getElementById('btn-close-anim-modal-2');
    const toggleAutoPlayback = document.getElementById('toggle-autonomous-playback');

    // Open Animation Library Modal
    const openLibraryModal = () => {
      this.renderAnimationList();
      if (animLibraryModal) animLibraryModal.classList.remove('hidden');
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

    // Import Animation JSON File
    const btnImportAnimFile = document.getElementById('btn-import-anim-file');
    const inputImportAnim = document.getElementById('input-import-anim');
    if (btnImportAnimFile && inputImportAnim) {
      btnImportAnimFile.addEventListener('click', () => inputImportAnim.click());
      inputImportAnim.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          if (!data || (!data.frames && !data.headPoseTrack)) {
            alert("Fichier d'animation invalide : doit contenir des frames ou tracks d'animation faciale.");
            return;
          }
          const animName = data.name || file.name.replace('.json', '');
          await this.animLibrary.saveAnimation(animName, data);
          this.renderAnimationList();
          this.updateAnimationBadge();

          const calToast = document.getElementById('calibration-toast');
          const calText = document.getElementById('cal-text');
          if (calToast && calText) {
            calText.textContent = `✓ Animation "${animName}" importée avec succès !`;
            calToast.classList.remove('hidden');
            setTimeout(() => calToast.classList.add('hidden'), 3000);
          }
        } catch (err) {
          console.error('Import animation error:', err);
          alert(`Erreur d'importation: ${err.message}`);
        } finally {
          inputImportAnim.value = '';
        }
      });
    }

    this.animLibrary.addEventListener('list:updated', () => {
      this.updateAnimationBadge();
    });
  }

  setupMotionPresetRecorder() {
    const button = document.getElementById('btn-record-motion-preset');
    const nameInput = document.getElementById('motion-preset-name');
    if (!button || !nameInput) return;

    button.addEventListener('click', async () => {
      if (this.isSavingPresetRecording) return;
      if (this.presetRecorder.isRecording) {
        await this.stopAndSavePresetRecording();
        return;
      }

      // Recording always uses the live tracker, never the autonomous animation.
      if (this.forceAutonomousMode) {
        this.forceAutonomousMode = false;
        document.getElementById('btn-toggle-autonomous')?.classList.remove('active');
        this.autonomousEngine.stopAutonomous();
        this.renderer.unfreezeFaceTexture();
        this.setState('LIVE');
      }

      if (!this.camera.isStreaming) {
        alert('La caméra doit être active pour enregistrer un preset.');
        return;
      }
      if (!this.lastTrackingLandmarks) {
        alert('Placez votre visage devant la caméra avant de démarrer.');
        return;
      }

      this.presetRecorder.start(performance.now());
      nameInput.disabled = true;
      button.classList.add('recording');
      button.setAttribute('aria-pressed', 'true');
      button.innerHTML = '<span>■ Arrêter et ajouter</span>';
      this.updateMotionPresetRecorderUI();
    });
  }

  setupComfyUiControls() {
    const modal = document.getElementById('comfy-settings-modal');
    const openButton = document.getElementById('btn-open-comfy-settings');
    const closeButton = document.getElementById('btn-close-comfy-settings');
    const backdrop = document.getElementById('backdrop-comfy-settings');
    const saveButton = document.getElementById('btn-save-comfy-settings');
    const testButton = document.getElementById('btn-test-comfy');
    const runButton = document.getElementById('btn-run-comfy');
    const enabledInput = document.getElementById('comfy-enabled');
    const baseUrlInput = document.getElementById('comfy-base-url');
    const workflowSelect = document.getElementById('comfy-workflow-select');

    if (!modal || !openButton || !baseUrlInput || !workflowSelect) return;
    enabledInput.checked = this.comfySettings.enabled;
    baseUrlInput.value = this.comfySettings.baseUrl;
    this.updateComfyStatusButton();

    const close = () => modal.classList.add('hidden');
    openButton.addEventListener('click', async () => {
      modal.classList.remove('hidden');
      await this.refreshComfyWorkflowList();
    });
    closeButton?.addEventListener('click', close);
    backdrop?.addEventListener('click', close);

    saveButton?.addEventListener('click', () => {
      this.comfySettings = {
        enabled: !!enabledInput.checked,
        baseUrl: baseUrlInput.value.trim(),
        workflowFilename: workflowSelect.value
      };
      localStorage.setItem('photomaton_comfy_enabled', String(this.comfySettings.enabled));
      localStorage.setItem('photomaton_comfy_base_url', this.comfySettings.baseUrl);
      localStorage.setItem('photomaton_comfy_workflow', this.comfySettings.workflowFilename);
      this.updateComfyStatusButton();
      this.tryRunComfyForVisitor();
      this.setComfySettingsStatus(this.comfySettings.enabled ? 'Configuration enregistrée et activée.' : 'Configuration enregistrée, exécution désactivée.', 'success');
      setTimeout(close, 550);
    });

    testButton?.addEventListener('click', async () => {
      testButton.disabled = true;
      this.setComfySettingsStatus('Connexion à ComfyUI…');
      this.showNotification('Test de connexion à ComfyUI…', 'running', 0);
      try {
        const response = await fetch('/api/comfy/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ baseUrl: baseUrlInput.value.trim() })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || `Erreur ${response.status}`);
        this.setComfySettingsStatus(`Connexion réussie à ${result.baseUrl}.`, 'success');
        this.showNotification(`ComfyUI connecté · ${result.baseUrl}`, 'success');
      } catch (error) {
        this.setComfySettingsStatus(`Échec : ${error.message}`, 'error');
        this.showNotification(`Échec ComfyUI · ${error.message}`, 'error', 5000);
      } finally {
        testButton.disabled = false;
      }
    });

    runButton?.addEventListener('click', async () => {
      runButton.disabled = true;
      this.setComfySettingsStatus('Envoi du workflow à ComfyUI…');
      try {
        const result = await this.queueComfyWorkflow({
          baseUrl: baseUrlInput.value.trim(),
          workflowFilename: workflowSelect.value
        });
        this.setComfySettingsStatus(`Workflow ${result.workflowFilename} ajouté à la file${result.promptId ? ` · ${result.promptId}` : ''}.`, 'success');
      } catch (error) {
        this.setComfySettingsStatus(`Échec : ${error.message}`, 'error');
      } finally {
        runButton.disabled = !this.canUseAutonomous();
      }
    });
  }

  async refreshComfyWorkflowList() {
    const select = document.getElementById('comfy-workflow-select');
    if (!select) return;
    try {
      const response = await fetch('/api/comfy/workflows', { cache: 'no-cache' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Erreur ${response.status}`);
      const workflows = result.workflows || [];
      select.innerHTML = '';
      if (workflows.length === 0) {
        select.innerHTML = '<option value="">Aucun fichier JSON trouvé</option>';
        this.setComfySettingsStatus('Ajoutez un workflow JSON au format API dans comfyWorkflow/.', 'error');
        return;
      }
      for (const filename of workflows) {
        const option = document.createElement('option');
        option.value = filename;
        option.textContent = filename;
        select.appendChild(option);
      }
      select.value = workflows.includes(this.comfySettings.workflowFilename)
        ? this.comfySettings.workflowFilename
        : workflows[0];
      this.setComfySettingsStatus(`${workflows.length} workflow${workflows.length > 1 ? 's' : ''} disponible${workflows.length > 1 ? 's' : ''}.`, 'success');
    } catch (error) {
      this.setComfySettingsStatus(`Impossible de lire comfyWorkflow/ : ${error.message}`, 'error');
    }
  }

  setComfySettingsStatus(message, state = '') {
    const status = document.getElementById('comfy-settings-status');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('success', state === 'success');
    status.classList.toggle('error', state === 'error');
  }

  showNotification(message, state = '', durationMs = 3500, key = 'general') {
    const container = document.getElementById('app-notifications');
    if (!container) return;
    let entry = this.notificationEntries.get(key);
    if (!entry) {
      const element = document.createElement('div');
      const icon = document.createElement('span');
      const text = document.createElement('span');
      icon.className = 'app-notification-icon';
      icon.setAttribute('aria-hidden', 'true');
      element.append(icon, text);
      container.append(element);
      entry = { element, icon, text, timer: null };
      this.notificationEntries.set(key, entry);
    }
    clearTimeout(entry.timer);
    entry.text.textContent = message;
    entry.icon.textContent = state === 'success' ? '✓' : state === 'error' ? '!' : '⚙';
    entry.element.className = `app-notification ${state}`;
    if (durationMs > 0) {
      entry.timer = setTimeout(() => {
        entry.element.remove();
        this.notificationEntries.delete(key);
      }, durationMs);
    }
  }

  updateComfyStatusButton(state = '') {
    const button = document.getElementById('btn-open-comfy-settings');
    const label = document.getElementById('comfy-button-label');
    if (!button || !label) return;
    button.classList.toggle('active', this.comfySettings.enabled);
    button.classList.toggle('comfy-running', state === 'running');
    button.classList.toggle('comfy-error', state === 'error');
    label.textContent = state === 'running' ? '⚙ ComfyUI…'
      : state === 'error' ? '⚠ ComfyUI'
      : this.comfySettings.enabled ? '⚙ ComfyUI ON' : '⚙ ComfyUI';
  }

  scheduleComfyWorkflowForVisitor() {
    if (this.comfyVisitorTimer !== null) {
      clearTimeout(this.comfyVisitorTimer);
      this.comfyVisitorTimer = null;
    }
    this.comfyVisitorPending = !!(this.comfySettings.enabled && this.comfySettings.baseUrl);
    this.comfyVisitorReadyAt = performance.now() + 1000;
    this.tryRunComfyForVisitor();
  }

  tryRunComfyForVisitor() {
    if (!this.comfyVisitorPending) return;
    if (!this.comfySettings.enabled || !this.comfySettings.baseUrl) {
      clearTimeout(this.comfyVisitorTimer);
      this.comfyVisitorTimer = null;
      this.comfyVisitorPending = false;
      return;
    }
    if (!this.canUseAutonomous()) return;
    const remaining = Math.max(0, this.comfyVisitorReadyAt - performance.now());
    if (remaining > 0) {
      if (this.comfyVisitorTimer === null) {
        this.comfyVisitorTimer = setTimeout(() => {
          this.comfyVisitorTimer = null;
          this.tryRunComfyForVisitor();
        }, remaining);
      }
      return;
    }
    clearTimeout(this.comfyVisitorTimer);
    this.comfyVisitorTimer = null;
    this.comfyVisitorPending = false;
    this.executeComfyWorkflow();
  }

  async executeComfyWorkflow() {
    if (!this.comfySettings.enabled || !this.comfySettings.baseUrl) return;
    this.updateComfyStatusButton('running');
    try {
      const result = await this.queueComfyWorkflow(this.comfySettings);
      console.log(`[ComfyUI] Workflow ${result.workflowFilename} envoyé, prompt ${result.promptId || 'accepté'}`);
      this.updateComfyStatusButton();
    } catch (error) {
      console.error('[ComfyUI] Échec du workflow:', error);
      this.updateComfyStatusButton('error');
      this.setComfySettingsStatus(`Échec du workflow : ${error.message}`, 'error');
    }
  }

  async queueComfyWorkflow(settings) {
    if (!this.canUseAutonomous()) {
      throw new Error('Un cliché FaceMesh du visiteur actuel doit être mémorisé avant de lancer ComfyUI.');
    }
    const callId = ++this.comfyCallId;
    this.showNotification('Appel à ComfyUI…', 'running', 0, 'comfy-call');
    try {
      const response = await fetch('/api/comfy/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseUrl: settings.baseUrl,
          workflowFilename: settings.workflowFilename
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Erreur ${response.status}`);
      if (callId === this.comfyCallId) {
        this.showNotification('Workflow ComfyUI envoyé', 'success', 3000, 'comfy-call');
      }
      return result;
    } catch (error) {
      if (callId === this.comfyCallId) {
        this.showNotification(`Échec ComfyUI · ${error.message}`, 'error', 5000, 'comfy-call');
      }
      throw error;
    }
  }

  updateMotionPresetRecorderUI(now = performance.now()) {
    const status = document.getElementById('motion-preset-status');
    if (!status) return;

    if (this.isSavingPresetRecording) {
      status.textContent = 'Sauvegarde…';
      return;
    }
    if (!this.presetRecorder.isRecording) {
      status.textContent = 'Commencez visage neutre · sans audio';
      return;
    }

    const seconds = this.presetRecorder.getElapsedMs(now) / 1000;
    status.textContent = `● REC ${seconds.toFixed(1)}s / 30s · ${this.presetRecorder.frames.length} frames`;
  }

  async stopAndSavePresetRecording() {
    if (!this.presetRecorder.isRecording || this.isSavingPresetRecording) return;

    const button = document.getElementById('btn-record-motion-preset');
    const nameInput = document.getElementById('motion-preset-name');
    this.isSavingPresetRecording = true;
    if (button) button.disabled = true;
    this.updateMotionPresetRecorderUI();

    try {
      const animation = this.presetRecorder.stop(nameInput?.value || '', performance.now());
      const saved = await this.animLibrary.saveAnimation(animation.name, animation);
      this.renderAnimationList();
      this.updateAnimationBadge();

      if (nameInput) nameInput.value = '';
      const calToast = document.getElementById('calibration-toast');
      const calText = document.getElementById('cal-text');
      if (calToast && calText) {
        calText.textContent = `✓ Preset mouvement « ${saved?.name || animation.name} » ajouté à la bibliothèque (sans audio)`;
        calToast.classList.remove('hidden');
        setTimeout(() => calToast.classList.add('hidden'), 3500);
      }

      document.getElementById('anim-library-modal')?.classList.remove('hidden');
    } catch (err) {
      console.error('Motion preset recording error:', err);
      alert(err.message || "Impossible d'enregistrer ce preset.");
    } finally {
      this.isSavingPresetRecording = false;
      this.presetRecorder.reset();
      if (nameInput) nameInput.disabled = false;
      if (button) {
        button.disabled = false;
        button.classList.remove('recording');
        button.setAttribute('aria-pressed', 'false');
        button.innerHTML = '<span>● Enregistrer un preset</span>';
      }
      this.updateMotionPresetRecorderUI();
    }
  }

  updateAnimationBadge() {
    const badge = document.getElementById('anim-count-badge');
    const countLabel = document.getElementById('anim-list-count-label');
    const count = this.animLibrary ? this.animLibrary.getActiveAnimationCount() : 0;
    if (badge) badge.textContent = count;
    if (countLabel) countLabel.textContent = `${count} animation${count > 1 ? 's' : ''}`;
  }

  updateAnimationPlaybackUI(force = false) {
    const isAutonomous = this.appState === 'AUTONOMOUS';
    const animation = isAutonomous ? this.autonomousEngine.activeAnimation : null;
    const audio = this.audioLibrary?.getPreviewStatus() || this.autonomousEngine.getAudioPlaybackStatus();
    const animationKey = animation ? (animation.id || animation.filename || animation.name) : '';
    const statusKey = `${this.appState}:${animationKey}:${animation?.name || ''}:${audio.label}:${audio.playing}`;
    if (!force && statusKey === this.lastAnimationStatusKey) return;
    this.lastAnimationStatusKey = statusKey;

    const name = animation?.name || (isAutonomous ? 'Regard autonome' : this.appState === 'WAITING' ? 'En attente' : 'Suivi en direct');
    const label = document.getElementById('active-animation-label');
    if (label) {
      label.textContent = name;
      label.title = name;
    }
    document.getElementById('btn-open-anim-library')?.classList.toggle('is-playing', !!animation);
    const audioLabel = document.getElementById('active-audio-label');
    if (audioLabel) {
      audioLabel.textContent = audio.label;
      audioLabel.title = audio.label;
    }
    document.getElementById('audio-playback-status')?.classList.toggle('is-playing', audio.playing);
    this.audioLibrary?.updateState();
    for (const card of document.querySelectorAll('#anim-list-container [data-animation-key]')) {
      const isPlaying = !!animation && card.dataset.animationKey === animationKey;
      card.classList.toggle('is-playing', isPlaying);
      card.setAttribute('aria-current', String(isPlaying));
      card.querySelector('.anim-item-badge.playing')?.classList.toggle('hidden', !isPlaying);
    }
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
      card.dataset.animationKey = anim.id || anim.filename || anim.name;

      const durSec = ((anim.durationMs || 0) / 1000).toFixed(1);
      const isPreset = anim.id && anim.id.startsWith('preset_');

      card.innerHTML = `
        <div class="anim-item-info">
          <div class="anim-item-title-row">
            <span class="anim-item-name">${anim.name || 'Animation'}</span>
            <span class="anim-item-badge playing hidden">▶ En cours</span>
            ${anim.hasAudio ? '<span class="anim-item-badge audio">🔊 Audio</span>' : ''}
            ${isPreset ? '<span class="anim-item-badge">Prédéfini</span>' : '<span class="anim-item-badge">Enregistré</span>'}
          </div>
          <div class="anim-item-meta">
            ${durSec}s • ${anim.frameCount || (anim.frames ? anim.frames.length : 0)} frames • 📁 ${anim.filename || (anim.id + '.json')}
          </div>
        </div>
        <div class="anim-item-actions">
          <button class="anim-btn-test" title="Tester immédiatement l'animation sur le masque">▶ Tester</button>
          <button class="anim-btn-download" title="Télécharger le fichier JSON de cette animation">⬇</button>
          <button class="anim-btn-del" title="Supprimer cette animation">🗑️</button>
        </div>
      `;

      // Test Button
      const btnTest = card.querySelector('.anim-btn-test');
      btnTest.disabled = !this.canUseAutonomous();
      btnTest.addEventListener('click', async () => {
        if (this.presetRecorder.isRecording) {
          alert("Arrêtez d'abord l'enregistrement du preset.");
          return;
        }
        const fullAnim = await this.animLibrary.getAnimationData(anim.filename || anim.id);
        if (fullAnim) {
          if (!this.canUseAutonomous()) {
            this.showNotification('Un cliché FaceMesh mémorisé est nécessaire pour tester une animation.');
            return;
          }
          // If not in autonomous mode, enter autonomous mode
          if (this.appState !== 'AUTONOMOUS') {
            if (!this.applyBestTextureReference(performance.now())) {
              this.showNotification('Placez le visage de face, sans l’incliner, pour mémoriser le cliché.');
              return;
            }
            this.setState('AUTONOMOUS');
            this.autonomousEngine.startAutonomous(performance.now(), this.lastTrackingLandmarks, this.lastTrackingHeadPose);
          }
          this.forceAutonomousMode = true;
          document.getElementById('btn-toggle-autonomous')?.classList.add('active');
          this.autonomousEngine.playAnimation(fullAnim, performance.now());
          this.updateAnimationPlaybackUI();
          document.getElementById('anim-library-modal')?.classList.add('hidden');
        }
      });

      // Download Button
      const btnDownload = card.querySelector('.anim-btn-download');
      btnDownload.addEventListener('click', async () => {
        const fullAnim = await this.animLibrary.getAnimationData(anim.filename || anim.id);
        if (fullAnim) {
          const blob = new Blob([JSON.stringify(fullAnim, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = anim.filename || `${anim.id}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
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
    this.updateAutonomousAvailability(true);
    this.updateAnimationPlaybackUI(true);
  }

  /**
   * Main Real-time Animation Loop (60 FPS)
   */
  startLoop() {
    const statFps = document.getElementById('stat-fps');
    const statLatency = document.getElementById('stat-latency');

    this.setState('WAITING');

    const loop = () => {
      const now = performance.now();

      // 1. MediaPipe Frame Inference
      const rawTracking = this.tracker.processVideoFrame(this.videoEl, now);

      // Check whether a face is actively tracked on this frame
      const isFacePresent = Boolean(rawTracking && rawTracking.detected && !this.forceAutonomousMode);

      // Update aspect ratio and evaluate biometric visitor detection
      const ar = (this.videoEl.videoWidth || 1280) / Math.max(1, (this.videoEl.videoHeight || 720));
      this.visitorDetector.setAspectRatio(ar);
      this.visitorDetector.update(isFacePresent ? rawTracking : null, this.videoEl, now);
      this.updateAutonomousAvailability();

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

        // If a clean, unobstructed frontal frame is available, link it to the autonomous engine.
        const bestCand = this.historyBuffer.bestOverallSnapshot;
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

        // Capture only fresh MediaPipe motion frames. No audio stream is ever requested.
        if (this.presetRecorder.isRecording) {
          this.presetRecorder.capture(rawTracking, now);
        }

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
        if (this.canUseAutonomous()
          && (this.appState === 'AUTONOMOUS' || this.applyBestTextureReference(now))) {
          if (this.appState !== 'AUTONOMOUS') {
            this.setState('AUTONOMOUS');
            this.isBlendingToLive = false;
            this.autoExitLandmarks = null;

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

      this.updateAnimationPlaybackUI();
      this.updateMotionPresetRecorderUI(now);

      if (this.presetRecorder.isRecording && this.presetRecorder.getElapsedMs(now) >= this.presetRecorder.maxDurationMs) {
        this.stopAndSavePresetRecording();
      }

      // 3. Calculate FPS
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
    if (!this.canUseAutonomous()) return false;
    const backupFrame = this.historyBuffer.getBestVisitorBackupFrame(now, minAgeMs);
    if (backupFrame && !backupFrame.isArchived && backupFrame.canvas && backupFrame.landmarks) {
      const ageStr = (now - backupFrame.timestamp).toFixed(0);
      console.log(`[FaceTextureHistoryBuffer] 🎭 Texture autonome de référence appliquée (Âge: ${ageStr}ms, Score: ${Math.round(backupFrame.qualityScore)})`);
      this.renderer.freezeFaceTexture(backupFrame.canvas, backupFrame.landmarks);
      this.autonomousEngine.setBaseLandmarks(backupFrame.landmarks);
      return true;
    }
    return false;
  }

  canUseAutonomous() {
    return this.historyBuffer.hasCurrentVisitorSnapshot();
  }

  updateAutonomousAvailability(force = false) {
    const available = this.canUseAutonomous();
    if (!available) {
      this.forceAutonomousMode = false;
      document.getElementById('btn-toggle-autonomous')?.classList.remove('active');
      if (this.appState === 'AUTONOMOUS') {
        this.isBlendingToLive = false;
        this.autoExitLandmarks = null;
        this.renderer.unfreezeFaceTexture();
        this.setState('WAITING');
      }
    }
    if (!force && available === this.lastAutonomousAvailable) return;
    this.lastAutonomousAvailable = available;
    const button = document.getElementById('btn-toggle-autonomous');
    if (button) {
      button.disabled = !available;
      button.title = available ? 'Activer / Forcer le mode autonome (A)' : 'Mémorisez un cliché FaceMesh pour activer le mode autonome';
    }
    const runButton = document.getElementById('btn-run-comfy');
    if (runButton) {
      runButton.disabled = !available;
      runButton.title = available ? 'Exécuter le workflow ComfyUI' : 'Mémorisez un cliché FaceMesh avant de lancer ComfyUI';
    }
    for (const button of document.querySelectorAll('.anim-btn-test')) button.disabled = !available;
  }

  handleVisitorSnapshotReady() {
    this.updateAutonomousAvailability();
    this.tryRunComfyForVisitor();
  }

  /**
   * Called whenever a pristine, centered, still, frontal reference is captured in memory.
   */
  handlePristineCapture(detail = {}) {
    const { landmarks, score } = detail;
    console.log(`[FaceTextureHistoryBuffer] 🌟 Meilleure référence faciale capturée ! (Score: ${Math.round(score)})`);
    if (landmarks) {
      this.autonomousEngine.setBaseLandmarks(landmarks);
      this.showNotification(this.hasVisitorSnapshot
        ? 'Meilleur cliché FaceMesh mémorisé'
        : 'Cliché FaceMesh mémorisé', 'success', 5000, 'facemesh-capture');
      this.hasVisitorSnapshot = true;
      this.handleVisitorSnapshotReady();
    }
  }

  updateVisitorIdUI() {
    const button = document.getElementById('btn-copy-visitor-id');
    const label = document.getElementById('current-visitor-id');
    if (!button || !label) return;
    const id = this.currentVisitorId;
    label.textContent = id ? id.slice(0, 8) : 'En attente';
    button.disabled = !id;
    button.title = id ? `ID de session : ${id} — cliquer pour copier` : 'Aucun visiteur identifié';
    button.setAttribute('aria-label', id ? `Copier l’identifiant du visiteur : ${id}` : 'Aucun visiteur identifié');
  }

  handleNewVisitor(detail = {}) {
    // A new session gets a random ID; tracking loss and autonomous playback keep it.
    this.currentVisitorId = typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
    this.updateVisitorIdUI();
    const reason = detail.reason || 'BIOMETRIC_CHANGE';
    const dissimStr = detail.dissimilarity !== undefined ? detail.dissimilarity.toFixed(3) : 'N/A';
    console.log(`[VisitorDetector] 👤 Visiteur ${this.currentVisitorId} (Raison: ${reason}, Dissimilarité: ${dissimStr})`);

    this.setState('NEW_PERSON');

    // Notify connected displays without creating or persisting an image.
    if (this.canvasBroadcaster) {
      this.canvasBroadcaster.notifyNewVisitor({ ...detail, visitorId: this.currentVisitorId });
    }

    // Reset best visitor backup texture tracker for this new visitor session
    this.historyBuffer.resetVisitorSession();
    this.hasVisitorSnapshot = false;
    this.updateAutonomousAvailability();

    // Give the visitor one second to settle before starting the ComfyUI workflow.
    this.scheduleComfyWorkflowForVisitor();

    // Return state to LIVE after 1.8s
    setTimeout(() => {
      if (this.appState === 'NEW_PERSON') {
        this.setState('LIVE');
      }
    }, 1800);
  }

  updateBroadcastBackground() {
    this.canvasBroadcaster?.setLiveBackgroundEnabled(!this.minimalistMode && !this.bustModeEnabled && this.appState !== 'AUTONOMOUS');
  }

  setMinimalistMode(enabled) {
    this.minimalistMode = !!enabled;
    this.renderer.setMinimalistMode(this.minimalistMode);
    document.body.classList.toggle('minimalist-mode', this.minimalistMode);
    const button = document.getElementById('btn-toggle-minimalist');
    button?.classList.toggle('active', this.minimalistMode);
    button?.setAttribute('aria-pressed', String(this.minimalistMode));
    const bustButton = document.getElementById('btn-toggle-bust');
    if (bustButton) bustButton.disabled = this.minimalistMode;
    this.setBustMode(this.bustModeRequested);
    if (this.lastRenderedTrackingResult?.detected) this.renderer.render(this.lastRenderedTrackingResult);
    this.canvasBroadcaster?.drawBroadcastFrame();
  }

  setBustMode(enabled, notify = false) {
    this.bustModeRequested = !!enabled;
    this.bustModeEnabled = this.bustModeRequested && !this.minimalistMode;
    this.renderer.setShowBust(this.bustModeEnabled);
    this.faceMeshAlignmentControls?.sync();
    document.body.classList.toggle('bust-only-mode', this.bustModeEnabled);
    this.updateBroadcastBackground();
    const button = document.getElementById('btn-toggle-bust');
    button?.classList.toggle('active', this.bustModeEnabled);
    button?.setAttribute('aria-pressed', String(this.bustModeEnabled));
    if (notify) {
      this.showNotification(this.bustModeEnabled ? 'Mode Buste 3D activé' : 'Mode Buste 3D désactivé',
        this.bustModeEnabled ? 'success' : '');
    }
  }

  setState(newState) {
    if (newState === 'AUTONOMOUS' && !this.canUseAutonomous()) {
      this.forceAutonomousMode = false;
      return;
    }
    const wasAutonomous = this.appState === 'AUTONOMOUS';
    this.appState = newState;
    if (wasAutonomous && newState !== 'AUTONOMOUS') this.autonomousEngine.stopAutonomous();
    if (wasAutonomous !== (newState === 'AUTONOMOUS')) {
      this.setBustMode(newState === 'AUTONOMOUS');
    }
    this.updateBroadcastBackground();
    this.updateAnimationPlaybackUI();
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

}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
