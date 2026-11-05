/**
 * Photomaton FaceMesh // Pure Facial Expression Motion Capture & Head Pose Retargeter
 * 
 * Live facial expression tracking with complete 6-DoF rigid head movement
 * compensation, zero-jump seamless cyclical looping, and direct application onto the live 3D head.
 */

import { CameraManager } from './core/camera.js';
import { setupExhibitionMode } from './ui/exhibitionMode.js';
import { CameraPageRecovery } from './ui/cameraPageRecovery.js';
import { AutonomousTimeout } from './ui/autonomousTimeout.js';
import { FaceTracker } from './core/tracker.js';
import { FaceMeshRenderer } from './core/renderer.js';
import { ExpressionLooper } from './mocap/expressionLooper.js';
import { AutoCalibrator } from './mocap/autoCalibrator.js';
import { AutonomousGazeEngine } from './core/autonomousGazeEngine.js';
import { FaceTextureHistoryBuffer } from './core/faceTextureHistoryBuffer.js';
import { AnimationLibrary } from './core/animationLibrary.js';
import { VisitorDetector } from './core/visitorDetector.js';
import { VisitorIdentity } from './core/visitorIdentity.js';
import { FaceRecognition } from './core/faceRecognition.js';
import { LiveFaceTextureGate } from './core/liveFaceTextureGate.js';
import { FaceProximityGate } from './core/faceProximityGate.js';
import { createFallbackFaceLandmarks } from './core/fallbackFace.js';
import { CanvasBroadcaster } from './webrtc/canvasBroadcaster.js';
import { MotionPresetRecorder } from './mocap/motionPresetRecorder.js';
import { setupFaceMeshAlignmentControls } from './ui/faceMeshAlignmentControls.js';
import { CameraAlignmentProfiles, ALIGNMENT_PROFILE_LABELS } from './ui/cameraAlignmentProfiles.js';
import { AudioLibraryControls } from './ui/audioLibraryControls.js';

class App {
  constructor() {
    this.exhibitionMode = setupExhibitionMode();
    this.videoEl = document.getElementById('webcam-video');
    this.webcamPreviewEl = document.getElementById('webcam-preview-video');
    this.canvasEl = document.getElementById('output-canvas');
    this.loadingOverlay = document.getElementById('loading-overlay');
    this.loadingText = document.getElementById('loading-text');

    // Modules
    this.camera = new CameraManager(this.videoEl);
    let recoveryStorage = null;
    try { recoveryStorage = sessionStorage; } catch { /* Camera reconnection remains available. */ }
    this.cameraPageRecovery = new CameraPageRecovery({
      camera: this.camera, storage: recoveryStorage, reload: () => window.location.reload(),
      getTrackingProgress: () => this.tracker.successfulVideoFrames,
      canReload: () => !this.isVisitorDetectionBlocked()
    });
    this.tracker = new FaceTracker({ smoothing: true });
    this.liveFaceTextureGate = new LiveFaceTextureGate();
    this.faceProximityGate = new FaceProximityGate();
    try {
      const saved = localStorage.getItem('photomaton_min_face_height_percent_v2');
      if (saved !== null) this.faceProximityGate.setThresholdPercent(saved);
      const calibration = localStorage.getItem('photomaton_live_face_calibration_v1');
      if (calibration) this.liveFaceTextureGate.setCalibration(JSON.parse(calibration));
    } catch { /* Keep the default distance threshold. */ }
    this.renderer = new FaceMeshRenderer(this.canvasEl, this.videoEl);
    this.looper = new ExpressionLooper();
    this.autoCalibrator = new AutoCalibrator(this.looper);
    this.autonomousEngine = new AutonomousGazeEngine();
    this.departureEngine = new AutonomousGazeEngine();
    this.fallbackFaceLandmarks = createFallbackFaceLandmarks();
    // Start in automatic mode: prefer a captured visitor, otherwise use fallback.
    this.useVisitorPortrait = true;
    this.preferCapturedTexture = false;
    this.historyBuffer = new FaceTextureHistoryBuffer(24, 150); // Cleanest frontal face capture tracker
    this.historyBuffer.addEventListener('pristine-capture', (e) => this.handlePristineCapture(e.detail));
    this.historyBuffer.addEventListener('fallback-capture', () => {
      this.showNotification('Cliché FaceMesh de secours mémorisé', 'success', 5000, 'facemesh-capture');
      this.handleVisitorSnapshotReady();
    });
    this.animLibrary = new AnimationLibrary();
    this.autonomousEngine.setAnimationLibrary(this.animLibrary);
    const savedVisitorAbsence = localStorage.getItem('photomaton_visitor_absence_ms');
    this.visitorDetector = new VisitorDetector({
      absenceMs: savedVisitorAbsence === null ? 3000 : Number(savedVisitorAbsence)
    });
    const recognition = new FaceRecognition({ onCrop: canvas => {
      const preview = document.getElementById('recognition-crop-preview');
      preview?.getContext('2d').drawImage(canvas, 0, 0);
    } });
    this.visitorIdentity = new VisitorIdentity({
      capture: (video, tracking, options) => recognition.capturePortrait(video, tracking, options),
      describe: portrait => recognition.describePortrait(portrait),
      onReference: portrait => {
        for (const id of ['recognition-reference-preview', 'visitor-reference-preview']) {
          const savedPortrait = document.getElementById(id);
          if (!savedPortrait) continue;
          const context = savedPortrait.getContext('2d');
          context.clearRect(0, 0, 150, 150);
          if (portrait) context.drawImage(portrait, 0, 0);
        }
        const label = document.getElementById('visitor-reference-status');
        if (label) label.textContent = portrait ? 'Référence de comparaison' : 'En attente de visiteur';
      },
      onNewVisitor: detail => {
        if (detail.reason !== 'MANUAL_REFERENCE') this.handleNewVisitor(detail);
      },
      onSameVisitor: distance => {
        this.showNotification(`Même visiteur reconnu · distance ${distance.toFixed(3)}`,
          'success', 15000, 'visitor-result');
      },
      onStatus: (status, distance, error) => this.updateVisitorRecognitionStatus(status, distance, error)
    });
    try {
      const savedReset = localStorage.getItem('photomaton_visitor_identity_reset_ms');
      if (savedReset !== null) this.visitorIdentity.setAbsenceResetMs(savedReset);
      const savedThreshold = localStorage.getItem('photomaton_visitor_same_threshold');
      if (savedThreshold !== null) this.visitorIdentity.setSameThreshold(savedThreshold);
    } catch { /* Keep the default one-minute reset. */ }
    this.visitorDetector.addEventListener('new-visitor', (e) => {
      if (!this.isVisitorDetectionBlocked() && !this.visitorIdentity.enabled) {
        this.handleNewVisitor(e.detail);
      }
    });
    this.visitorDetector.addEventListener('absence-complete', () => {
      if (this.visitorIdentity.enabled) return;
      this.showNotification('Absence terminée · prêt pour le prochain visiteur', 'success', 3500, 'visitor-absence');
    });
    this.canvasBroadcaster = new CanvasBroadcaster(this.canvasEl, {
      canvasIncludesVideo: true,
      videoElement: this.videoEl,
      mirrored: true,
      width: 1080,
      height: 1080
    });
    this.canvasBroadcaster.mountPreview(document.getElementById('webrtc-preview-slot'));
    this.presetRecorder = new MotionPresetRecorder({ fps: 30, maxDurationMs: 30000 });
    this.isSavingPresetRecording = false;
    this.bustModeEnabled = true;
    this.bustModeRequested = true;
    this.minimalistMode = false;
    this.notificationEntries = new Map();
    this.currentVisitorId = null;
    this.hasVisitorSnapshot = false;
    this.comfyVisitorTimer = null;
    this.comfyVisitorPending = false;
    this.comfyVisitorReadyAt = 0;
    this.comfyCallId = 0;
    this.comfyCancellation = Promise.resolve();
    this.comfyMinimalistJobs = new Set();
    this.comfyPreviousMinimalist = false;
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
    let autonomousTimeoutSeconds = 60;
    try { autonomousTimeoutSeconds = localStorage.getItem('photomaton_autonomous_timeout_s') ?? 60; } catch { /* Use default. */ }
    this.autonomousTimeout = new AutonomousTimeout(autonomousTimeoutSeconds);
    this.forceFallbackFace = false;

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

    // Webcam feeds tracking and textures; the displayed composition is the bust.
    this.isMirrored = true;
    this.showWebcam = false;

    this.autonomousEngine.setMirrored(this.isMirrored);
    this.renderer.setMirrored(true);

    this.init();
  }

  async init() {
    try {
      this.projectAlignmentSettings = null;
      try {
        const response = await fetch('/api/camera-alignment', { signal: AbortSignal.timeout(5000) });
        if (response.ok) this.projectAlignmentSettings = await response.json();
      } catch { /* Static hosting retains browser persistence. */ }
      this.setupEventListeners();

      // 1. Initialize Face Tracker AI
      await this.tracker.init((status) => {
        if (this.loadingText) this.loadingText.textContent = status;
      });

      // Align the generic fallback texture before starting live webcam inference.
      try {
        await this.renderer.loadFallbackFaceTexture(this.tracker);
      } catch (error) {
        console.warn('Texture de secours indisponible, visage plein conservé :', error);
      }

      // 1b. Initialize Animation Library in public/animations/
      try {
        await this.animLibrary.init();
        this.updateAnimationBadge();
      } catch (animErr) {
        console.warn('Animation Library init warning:', animErr);
      }

      try {
        await this.audioLibrary.refresh();
        if (this.autonomousEngine.presetAudio.urls.length) {
          document.getElementById('btn-preset-audio')?.click();
        }
      } catch (error) {
        this.audioLibrary.report(error);
      }

      // 2. Start Camera (720p 60fps)
      if (this.loadingText) this.loadingText.textContent = 'Starting camera stream...';
      this.cameraPageRecovery.start();
      try {
        await this.camera.start(null, { width: 1280, height: 720 });
      } catch (camErr) {
        console.warn('Camera failed to start:', camErr);
        this.showNotification('Webcam indisponible : buste autonome avec visage de secours.', '', 6000, 'camera');
      }
      this.camera.startWatchdog();
      window.addEventListener('pagehide', () => {
        this.cameraPageRecovery.stop();
        this.camera.stop();
      }, { once: true });

      // 3. Initialize the fixed Full HD render surface once. Its CSS display
      // adapts to the operator window without changing the WebRTC composition.
      this.handleResize();

      // 4. Continue with the autonomous fallback even without a camera.
      if (this.loadingOverlay) {
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

  updateVisitorRecognitionStatus(status, distance, error) {
    if (['waiting', 'tooFar', 'stabilizing', 'position', 'error', 'disabled'].includes(status)) {
      const oldResult = this.notificationEntries?.get('visitor-result');
      if (oldResult) {
        clearTimeout(oldResult.timer);
        oldResult.element.remove();
        this.notificationEntries.delete('visitor-result');
      }
    }
    const distanceLabel = document.getElementById('visitor-identity-distance');
    if (distanceLabel) distanceLabel.textContent = Number.isFinite(distance)
      ? `Distance visage : ${distance.toFixed(3)} · seuil ${this.visitorIdentity.sameThreshold.toFixed(2)}`
      : 'Distance visage : en attente';
    const absenceSlider = document.getElementById('slider-visitor-absence');
    if (absenceSlider) absenceSlider.disabled = this.visitorIdentity.enabled;
    const button = document.getElementById('btn-visitor-identity');
    const labels = { ready: 'active', active: 'visiteur actuel', same: 'même visiteur', checking: 'analyse en cours…',
      new: 'nouveau visiteur', error: 'indisponible', disabled: 'désactivée',
      tooFar: 'rapprochez-vous', stabilizing: 'stabilisation', waiting: 'en attente de visage',
      position: 'visage de face et entier', paused: 'pause pendant le rendu' };
    const liveStatus = document.getElementById('webcam-recognition-status');
    if (liveStatus) liveStatus.textContent = `Reconnaissance : ${labels[status] || status}`
      + (status === 'tooFar' ? ` (${Math.round(this.faceProximityGate.faceHeightPercent || 0)}% / minimum ${this.faceProximityGate.thresholdPercent}%)` : '')
      + (status === 'error' && error ? ` · ${error.message}` : '')
      + (Number.isFinite(distance) ? ` · distance ${distance.toFixed(3)} / seuil ${this.visitorIdentity.sameThreshold.toFixed(2)}` : '');
    if (button) {
      const label = `Reconnaissance : ${labels[status] || status}`;
      if (button.textContent !== label) button.textContent = label;
      button.classList.toggle('active', this.visitorIdentity.enabled);
      button.setAttribute('aria-pressed', String(this.visitorIdentity.enabled));
      button.title = distance == null ? 'Comparer au dernier visiteur, uniquement en mémoire'
        : `Distance visage : ${distance.toFixed(3)} (identique ≤ ${this.visitorIdentity.sameThreshold.toFixed(2)} ; nouveau au-dessus)`;
    }
    if (error) {
      console.error('[VisitorIdentity]', error);
      this.showNotification('Reconnaissance indisponible : désactivez-la pour utiliser la détection par absence.',
        'error', 5000, 'visitor-identity');
    }
  }

  handleResize() {
    this.renderer.resize(1920, 1080, 1);
  }

  setupEventListeners() {
    const generalSettings = document.getElementById('general-settings-dialog');
    document.getElementById('btn-open-general-settings')?.addEventListener('click', () => {
      if (generalSettings && !generalSettings.open) generalSettings.showModal();
    });
    document.getElementById('btn-close-general-settings')?.addEventListener('click', () => generalSettings?.close());
    generalSettings?.addEventListener('click', event => {
      if (event.target !== generalSettings) return;
      const bounds = generalSettings.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right
        || event.clientY < bounds.top || event.clientY > bounds.bottom) generalSettings.close();
    });
    const oscDropdown = document.querySelector('.osc-dropdown');
    document.addEventListener('click', event => {
      if (oscDropdown && !oscDropdown.contains(event.target)) oscDropdown.open = false;
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && oscDropdown?.open) {
        oscDropdown.open = false;
        oscDropdown.querySelector('summary').focus();
      }
    });
    document.querySelectorAll('[data-osc-signal]').forEach(oscButton => oscButton.addEventListener('click', async event => {
      const button = event.currentTarget;
      if (oscDropdown) oscDropdown.open = false;
      button.disabled = true;
      try {
        const response = await fetch(`/api/osc/test?signal=${encodeURIComponent(button.dataset.oscSignal)}`,
          { method: 'POST', signal: AbortSignal.timeout(5000) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Envoi OSC impossible');
        this.showNotification(`OSC envoyé vers ${result.destinations.join(', ')}:${result.port} · ${result.oscAddress} 1`,
          'success', 5000, 'osc-test');
      } catch (error) {
        this.showNotification(error.message || 'Envoi OSC impossible', 'error', 5000, 'osc-test');
      } finally {
        button.disabled = false;
      }
    }));
    // Webcam remains a tracking and texture source, never a background.
    this.showWebcam = false;
    document.body.classList.remove('show-webcam');
    document.body.classList.add('show-texture');

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
    document.getElementById('btn-toggle-face-texture')?.addEventListener('click', () => {
      if (this.appState === 'AUTONOMOUS' || !this.historyBuffer.hasCurrentVisitorSnapshot()) return;
      this.preferCapturedTexture = !this.preferCapturedTexture;
      this.restoreLiveFaceTexture();
      this.syncFaceTextureButton();
    });
    const btnAutonomous = document.getElementById('btn-toggle-autonomous');
    const timeoutInput = document.getElementById('autonomous-timeout-seconds');
    if (timeoutInput) {
      timeoutInput.value = this.autonomousTimeout.seconds;
      timeoutInput.addEventListener('change', () => {
        this.autonomousTimeout.setSeconds(timeoutInput.value);
        timeoutInput.value = this.autonomousTimeout.seconds;
        try { localStorage.setItem('photomaton_autonomous_timeout_s', String(this.autonomousTimeout.seconds)); } catch { /* Keep for this session. */ }
      });
    }
    btnAutonomous?.addEventListener('click', () => {
      if (this.presetRecorder.isRecording) {
        alert("Arrêtez d'abord l'enregistrement du preset.");
        return;
      }
      this.forceAutonomousMode = !this.forceAutonomousMode;
      this.autonomousTimeout.startedAt = null;
      if (this.audioLibrary) this.audioLibrary.testPlayback = null;
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
          this.restoreLiveFaceTexture();
        }
        this.setState('LIVE');
      }
    });

    // Keep the bust composition in live and autonomous states.
    this.renderer.setBustModel('male_facemesh_zone_creusee');
    this.renderer.setShowWebcam(false);
    this.setBustMode();

    document.getElementById('btn-toggle-minimalist')?.addEventListener('click', () => {
      this.setWebcamOnlyMode(false);
      this.setMinimalistMode(!this.minimalistMode);
    });
    document.getElementById('btn-toggle-webcam-only')?.addEventListener('click', () => {
      this.setWebcamOnlyMode(!this.webcamOnlyMode);
    });
    document.getElementById('btn-visitor-identity')?.addEventListener('click', () => {
      this.visitorIdentity.setEnabled(!this.visitorIdentity.enabled);
    });

    document.getElementById('btn-debug-new-visitor')?.addEventListener('click', () => {
      if (this.isVisitorDetectionBlocked()) {
        this.showNotification('Génération en cours · nouveau visiteur ignoré');
        return;
      }
      // Let live tracking collect a fresh visitor image during the test.
      if (this.forceAutonomousMode) btnAutonomous?.click();
      this.visitorIdentity.reset();
      this.handleNewVisitor({ reason: 'DEBUG_TRIGGER' });
      this.visitorIdentity.request({ reason: 'MANUAL_REFERENCE' });
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

    // 6. Absence duration before starting a new visit.
    const sliderVisitorSens = document.getElementById('slider-visitor-absence');
    const sameThresholdInput = document.getElementById('visitor-same-threshold');
    if (sameThresholdInput) {
      sameThresholdInput.value = this.visitorIdentity.sameThreshold.toFixed(2);
      sameThresholdInput.addEventListener('change', () => {
        this.visitorIdentity.setSameThreshold(sameThresholdInput.value);
        sameThresholdInput.value = this.visitorIdentity.sameThreshold.toFixed(2);
        try {
          localStorage.setItem('photomaton_visitor_same_threshold', sameThresholdInput.value);
        } catch { /* Keep the setting for this session. */ }
      });
    }
    const identityResetInput = document.getElementById('visitor-identity-reset-seconds');
    if (identityResetInput) {
      identityResetInput.value = String(this.visitorIdentity.absenceResetMs / 1000);
      identityResetInput.addEventListener('change', () => {
        this.visitorIdentity.setAbsenceResetMs(Number(identityResetInput.value) * 1000);
        identityResetInput.value = String(this.visitorIdentity.absenceResetMs / 1000);
        try {
          localStorage.setItem('photomaton_visitor_identity_reset_ms', String(this.visitorIdentity.absenceResetMs));
        } catch { /* Keep the setting for this session. */ }
      });
    }
    const faceSizeSlider = document.getElementById('slider-min-face-size');
    const faceSizeLabel = document.getElementById('val-min-face-size');
    document.getElementById('btn-calibrate-live-face')?.addEventListener('click', () => {
      const status = document.getElementById('live-calibration-status');
      try {
        const tracking = this.tracker.lastTrackingResult;
        if (this.camera.state !== 'active' || !tracking?.detected) throw new Error('Webcam active et visage visible nécessaires');
        const percent = this.liveFaceTextureGate.calibrate(tracking);
        this.faceProximityGate.setThresholdPercent(percent);
        if (faceSizeSlider) faceSizeSlider.value = String(percent);
        if (faceSizeLabel) faceSizeLabel.textContent = `${percent}%`;
        let saved = true;
        try {
          localStorage.setItem('photomaton_min_face_height_percent_v2', String(percent));
          localStorage.setItem('photomaton_live_face_calibration_v1', JSON.stringify(this.liveFaceTextureGate.calibration));
        } catch { saved = false; }
        if (status) status.textContent = `Position calibrée · minimum ${percent}%${saved ? ' · mémorisée' : ' · pour cette session'}`;
      } catch (error) {
        if (status) status.textContent = error.message;
      }
    });
    if (faceSizeSlider) {
      faceSizeSlider.value = this.faceProximityGate.thresholdPercent;
      if (faceSizeLabel) faceSizeLabel.textContent = `${this.faceProximityGate.thresholdPercent}%`;
      faceSizeSlider.addEventListener('input', event => {
        this.faceProximityGate.setThresholdPercent(event.target.value);
        if (faceSizeLabel) faceSizeLabel.textContent = `${this.faceProximityGate.thresholdPercent}%`;
        try {
          localStorage.setItem('photomaton_min_face_height_percent_v2', String(this.faceProximityGate.thresholdPercent));
        } catch { /* Keep the setting for this session. */ }
      });
    }
    const visitorSensValLabel = document.getElementById('visitor-absence-val-label');
    const currentSens = this.visitorDetector.absenceMs / 1000;
    if (sliderVisitorSens) {
      sliderVisitorSens.value = String(currentSens);
      if (visitorSensValLabel) visitorSensValLabel.textContent = `${currentSens} s`;
      sliderVisitorSens.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.visitorDetector.setAbsenceMs(val * 1000);
        if (visitorSensValLabel) visitorSensValLabel.textContent = `${val} s`;
        try {
          localStorage.setItem('photomaton_visitor_absence_ms', String(val * 1000));
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
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;
      if (e.isComposing || e.ctrlKey || e.altKey || e.metaKey) return;

      if (e.key.toLowerCase() === 'n') {
        if (e.repeat) return;
        e.preventDefault();
        document.getElementById('btn-debug-new-visitor')?.click();
      } else if (e.key.toLowerCase() === 'm') {
        if (e.repeat) return;
        e.preventDefault();
        document.body.classList.toggle('interface-hidden');
      } else if (e.key.toLowerCase() === 'o') {
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
    // Chrome can defer startup audio until the first user interaction.
    const unlockAudio = () => {
      const context = this.autonomousEngine.audioCtx;
      if (context?.state === 'suspended') {
        void context.resume().catch(error => console.warn('Audio resume:', error));
      }
    };
    document.addEventListener('pointerdown', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
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

    const offset = { x: 0, y: 0, pitch: 0, yaw: 0, roll: 0, zoom: 1.0, maxYaw: 42, maxPitch: 8, eyeOpening: 100, audioMouthOpening: 100, livePitchTrim: 0, autoPitchTrim: 0 };
    const profiles = new CameraAlignmentProfiles(this.renderer, localStorage, this.projectAlignmentSettings);

    const updateSaveStatus = () => {
      const current = profiles.getEditingOffset();
      const savedOffset = profiles.saved;
      const unchanged = savedOffset && Object.keys(offset).every(key => Math.abs(current[key] - savedOffset[key]) < 0.000001);
      if (saveStatus) saveStatus.textContent = unchanged ? 'Réglage enregistré' : 'Cliquez sur Save pour mémoriser';
    };

    btnSaveCam?.addEventListener('click', async () => {
      btnSaveCam.disabled = true;
      try {
        await profiles.save();
        updateSaveStatus();
        this.showNotification(`Align 3D · ${ALIGNMENT_PROFILE_LABELS[profiles.editingMode]} enregistré`, 'success', 2500, 'camera-alignment');
      } catch {
        if (saveStatus) saveStatus.textContent = 'Enregistrement indisponible sur ce navigateur';
        this.showNotification('Impossible de mémoriser l’alignement 3D', 'error', 3500, 'camera-alignment');
      } finally {
        btnSaveCam.disabled = false;
      }
    });

    const updateUIFromState = () => {
      const cur = profiles.getEditingOffset();
      for (const key of ['maxYaw', 'maxPitch', 'eyeOpening', 'audioMouthOpening', 'livePitchTrim', 'autoPitchTrim']) {
        const slider = document.getElementById('slider-cam-' + key);
        const label = document.getElementById('val-cam-' + key);
        if (slider) slider.value = cur[key];
        if (label) label.textContent = cur[key] + (['eyeOpening', 'audioMouthOpening'].includes(key) ? '%' : '\u00b0');
      }
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

    this.syncAlignProfile = () => {
      const mode = this.minimalistMode ? 'minimalist'
        : this.appState === 'AUTONOMOUS' ? 'autonomous_bust' : 'live_bust';
      profiles.activate(mode);
      const label = document.getElementById('align-profile-label');
      if (label) label.textContent = `Profil : ${ALIGNMENT_PROFILE_LABELS[profiles.editingMode]}`;
      if (btnSaveCam) btnSaveCam.title = `Enregistrer Align 3D pour ${ALIGNMENT_PROFILE_LABELS[profiles.editingMode]}`;
      updateUIFromState();
    };
    document.getElementById('align-profile-select')?.addEventListener('change', event => {
      profiles.edit(event.target.value || null);
      this.syncAlignProfile();
    });
    this.syncAlignProfile();

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
        profiles.setEditingOffset({ x: val });
        if (valCamX) valCamX.textContent = `${Math.round(val)}px`;
        updateSaveStatus();
      });
    }

    if (sliderCamY) {
      sliderCamY.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        profiles.setEditingOffset({ y: val });
        if (valCamY) valCamY.textContent = `${Math.round(val)}px`;
        updateSaveStatus();
      });
    }

    if (sliderCamPitch) {
      sliderCamPitch.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        profiles.setEditingOffset({ pitch: val });
        if (valCamPitch) valCamPitch.textContent = `${val.toFixed(1)}°`;
        updateSaveStatus();
      });
    }

    if (sliderCamYaw) {
      sliderCamYaw.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        profiles.setEditingOffset({ yaw: val });
        if (valCamYaw) valCamYaw.textContent = `${val.toFixed(1)}°`;
        updateSaveStatus();
      });
    }

    if (sliderCamRoll) {
      sliderCamRoll.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        profiles.setEditingOffset({ roll: val });
        if (valCamRoll) valCamRoll.textContent = `${val.toFixed(1)}°`;
        updateSaveStatus();
      });
    }

    if (sliderCamZoom) {
      sliderCamZoom.addEventListener('input', (e) => {
        const pct = parseFloat(e.target.value);
        const z = pct / 100.0;
        profiles.setEditingOffset({ zoom: z });
        if (valCamZoom) valCamZoom.textContent = `${Math.round(pct)}%`;
        updateSaveStatus();
      });
    }

    for (const key of ['maxYaw', 'maxPitch', 'eyeOpening', 'audioMouthOpening', 'livePitchTrim', 'autoPitchTrim']) {
      document.getElementById('slider-cam-' + key)?.addEventListener('input', event => {
        profiles.setEditingOffset({ [key]: Number(event.target.value) });
        updateUIFromState();
      });
    }
    // Mini Reset Buttons
    resetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const axis = btn.dataset.axis;
        const cur = profiles.getEditingOffset();
        if (axis === 'x') cur.x = 0;
        else if (axis === 'y') cur.y = 0;
        else if (axis === 'pitch') cur.pitch = 0;
        else if (axis === 'yaw') cur.yaw = 0;
        else if (axis === 'roll') cur.roll = 0;
        else if (axis === 'zoom') cur.zoom = 1.0;
        else if (axis === 'maxYaw') cur.maxYaw = 42;
        else if (axis === 'maxPitch') cur.maxPitch = 8;
        else if (axis === 'eyeOpening') cur.eyeOpening = 100;
        else if (axis === 'audioMouthOpening') cur.audioMouthOpening = 100;
        else if (axis === 'livePitchTrim' || axis === 'autoPitchTrim') cur[axis] = 0;
        profiles.setEditingOffset(cur);
        updateUIFromState();
        updateSaveStatus();
      });
    });

    // Reset All
    if (btnResetCamAll) {
      btnResetCamAll.addEventListener('click', () => {
        profiles.setEditingOffset(offset);
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
        initialOffset = profiles.getEditingOffset();
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
          profiles.setEditingOffset({
            x: Math.max(-300, Math.min(300, newX)),
            y: Math.max(-300, Math.min(300, newY))
          });
        } else {
          // Orbit Tilt: pitch (haut/bas) & yaw (gauche/droite)
          const sens = 0.25;
          const newYaw = Number((initialOffset.yaw + deltaX * sens).toFixed(1));
          const newPitch = Number((initialOffset.pitch - deltaY * sens).toFixed(1));
          profiles.setEditingOffset({
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
        const cur = profiles.getEditingOffset();
        const zoomDelta = e.deltaY > 0 ? -0.05 : 0.05;
        const newZoom = Math.max(0.5, Math.min(2.0, Number((cur.zoom + zoomDelta).toFixed(2))));
        profiles.setEditingOffset({ zoom: newZoom });
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
        this.restoreLiveFaceTexture();
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
        runButton.disabled = !this.canCaptureComfyImage();
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

  showNotification(message, state = '', durationMs = 1500, key = 'general') {
    if (this.exhibitionMode) {
      if (state === 'error') console.error('[Exposition]', message);
      return;
    }
    if (durationMs > 0) durationMs = Math.min(durationMs, state === 'error' ? 2500 : 1500);
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
    const revision = this.comfyCallId;
    this.updateComfyStatusButton('running');
    try {
      await this.comfyCancellation;
      if (revision !== this.comfyCallId) return;
      const result = await this.queueComfyWorkflow(this.comfySettings, true);
      if (result.superseded) return;
      console.log(`[ComfyUI] Workflow ${result.workflowFilename} envoyé, prompt ${result.promptId || 'accepté'}`);
      this.updateComfyStatusButton();
    } catch (error) {
      console.error('[ComfyUI] Échec du workflow:', error);
      this.updateComfyStatusButton('error');
      this.setComfySettingsStatus(`Échec du workflow : ${error.message}`, 'error');
    }
  }

  canCaptureComfyImage() {
    return this.videoEl.readyState >= 2 && this.videoEl.videoWidth > 0 && this.videoEl.videoHeight > 0;
  }

  captureComfyWebcamImage() {
    if (!this.canCaptureComfyImage()) throw new Error('La webcam ne fournit pas encore d’image.');
    const canvas = document.createElement('canvas');
    canvas.width = this.videoEl.videoWidth;
    canvas.height = this.videoEl.videoHeight;
    canvas.getContext('2d').drawImage(this.videoEl, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.92);
  }

  beginComfyMinimalistJob() {
    const token = Symbol('comfy-render');
    if (!this.comfyMinimalistJobs.size) this.comfyPreviousMinimalist = this.minimalistMode;
    this.comfyMinimalistJobs.add(token);
    this.setMinimalistMode(true);
    return token;
  }

  endComfyMinimalistJob(token) {
    if (!token || !this.comfyMinimalistJobs.delete(token)) return;
    if (!this.comfyMinimalistJobs.size) this.setMinimalistMode(this.comfyPreviousMinimalist);
  }

  async queueComfyWorkflow(settings, visitorGeneration = false) {
    const callId = ++this.comfyCallId;
    let minimalistToken = null;
    this.showNotification('Appel à ComfyUI…', 'running', 0, 'comfy-call');
    try {
      const visitorImage = this.captureComfyWebcamImage();
      if (visitorGeneration) {
        // Capture while the booth is lit, before the minimalist transition
        // sends /newVisitor to the lighting controller.
        await new Promise(resolve => setTimeout(resolve, 200));
        if (callId !== this.comfyCallId) return { superseded: true };
        minimalistToken = this.beginComfyMinimalistJob();
      }
      const response = await fetch('/api/comfy/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseUrl: settings.baseUrl,
          workflowFilename: settings.workflowFilename,
          visitorImage
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Erreur ${response.status}`);
      if (result.superseded || callId !== this.comfyCallId) {
        this.endComfyMinimalistJob(minimalistToken);
        return { superseded: true };
      }
      if (!result.promptId) throw new Error('ComfyUI n’a pas renvoyé de prompt ID');
      this.monitorComfyRender({ ...result, baseUrl: settings.baseUrl, minimalistToken, callId });
      if (callId === this.comfyCallId) {
        this.showNotification('Workflow ComfyUI envoyé', 'success', 3000, 'comfy-call');
      }
      return result;
    } catch (error) {
      this.endComfyMinimalistJob(minimalistToken);
      if (callId !== this.comfyCallId) return { superseded: true };
      if (callId === this.comfyCallId) {
        this.showNotification(`Échec ComfyUI · ${error.message}`, 'error', 5000, 'comfy-call');
      }
      throw error;
    }
  }

  async monitorComfyRender(render) {
    try {
      const key = `comfy-render-${render.promptId}`;
      this.showNotification('Rendu ComfyUI en cours…', 'running', 0, key);
      let failures = 0;
      while (true) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (render.callId !== this.comfyCallId) {
          this.showNotification('Rendu remplacé par le nouveau visiteur', '', 1500, key);
          return;
        }
        let status;
        try {
          const response = await fetch('/api/comfy/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ baseUrl: render.baseUrl, promptId: render.promptId })
          });
          status = await response.json();
          if (!response.ok) throw new Error(status.error || `Erreur ${response.status}`);
          failures = 0;
        } catch (error) {
          if (render.callId !== this.comfyCallId) return;
          if (++failures < 5) continue;
          this.showNotification(`Suivi ComfyUI indisponible · ${error.message}`, 'error', 8000, key);
          return;
        }
        if (render.callId !== this.comfyCallId) return;
        if (status.state === 'pending') continue;
        const detail = { ...render, outputs: status.outputs, error: status.error };
        if (status.state === 'completed') {
          this.showNotification('Rendu ComfyUI terminé', 'success', 8000, key);
          window.dispatchEvent(new CustomEvent('comfy:render-completed', { detail }));
          // Send OSC immediately; its response must not delay the video return.
          fetch('/api/osc/test?signal=generationDone', {
            method: 'POST', signal: AbortSignal.timeout(5000)
          }).then(async response => {
            if (!response.ok) {
              const result = await response.json();
              throw new Error(result.error || 'Envoi OSC impossible');
            }
          }).catch(error => {
            this.showNotification(`Rendu terminé · échec OSC : ${error.message}`, 'error', 2500, 'osc-generation');
          });
          if (render.minimalistToken) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } else {
          this.showNotification(`Échec du rendu ComfyUI · ${status.error}`, 'error', 8000, key);
          window.dispatchEvent(new CustomEvent('comfy:render-failed', { detail }));
        }
        return;
      }
    } finally {
      this.endComfyMinimalistJob(render.minimalistToken);
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
          if (this.audioLibrary) this.audioLibrary.testPlayback = null;
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
      if (this.autonomousTimeout.update(this.forceAutonomousMode, now)
        && !this.isVisitorDetectionBlocked() && !this.presetRecorder.isRecording) {
        this.forceAutonomousMode = false;
        this.autonomousTimeout.update(false, now);
        document.getElementById('btn-toggle-autonomous')?.classList.remove('active');
        if (this.audioLibrary) this.audioLibrary.testPlayback = null;
        this.showNotification('Retour automatique au suivi caméra', '', 3000, 'autonomous-timeout');
        // The normal presence logic below decides whether to return to live.
        // Without a visitor, autonomous playback continues without being forced.
      }
      // Reuse the active camera stream, including after a camera switch or stop.
      if (this.webcamPreviewEl && this.webcamPreviewEl.srcObject !== this.videoEl.srcObject) {
        this.tracker.lastVideoTime = -1;
        this.tracker.lastTrackingResult = null;
        this.faceProximityGate.setThresholdPercent(this.faceProximityGate.thresholdPercent);
        this.webcamPreviewEl.srcObject = this.videoEl.srcObject;
        if (this.videoEl.srcObject) {
          void this.webcamPreviewEl.play().catch(error => console.warn('Webcam preview:', error));
        }
      }
      this.audioLibrary?.updateTestPlayback();

      const cameraStatus = document.getElementById('webcam-camera-status');
      if (cameraStatus) {
        const labels = { active: 'Webcam active', connecting: 'Webcam : reconnexion…',
          permission: 'Webcam : autorisation refusée dans Chrome', unavailable: 'Webcam indisponible · nouvelle tentative automatique',
          stopped: 'Webcam arrêtée' };
        cameraStatus.textContent = labels[this.camera.state] || 'Webcam en attente';
        if (this.cameraPageRecovery.message) cameraStatus.textContent += ` · ${this.cameraPageRecovery.message}`;
      }

      // 1. MediaPipe Frame Inference
      const cameraAvailable = this.camera.isStreaming
        && this.camera.stream?.getVideoTracks().some(track => track.readyState === 'live' && !track.muted);
      const rawTracking = this.faceProximityGate.filter(
        cameraAvailable ? this.tracker.processVideoFrame(this.videoEl, now) : null, now);
      const faceSizeStatus = document.getElementById('face-size-status');
      if (faceSizeStatus) {
        const percent = Math.round(this.faceProximityGate.faceHeightPercent || 0);
        faceSizeStatus.textContent = percent ? `${percent}%${rawTracking?.tooFar ? ' · rapprochez-vous'
          : rawTracking?.proximityPending ? ' · stabilisation' : ''}` : 'Aucun visage';
      }
      this.liveFaceTextureGate.update(rawTracking, now, this.faceProximityGate.thresholdPercent / 100);
      if (rawTracking?.detected && rawTracking.landmarks?.length && this.forceAutonomousMode) {
        this.forceAutonomousMode = false;
        this.autonomousTimeout.update(false, now);
        document.getElementById('btn-toggle-autonomous')?.classList.remove('active');
        if (this.audioLibrary) this.audioLibrary.testPlayback = null;
        // The presence logic below stops autonomous playback and blends to live.
      }
      const liveStatus = document.getElementById('webcam-live-status');
      if (liveStatus) {
        const gate = this.liveFaceTextureGate;
        const labels = { waiting: 'aucun visage', distance: 'rapprochez-vous', centering: 'recentrez le visage',
          pose: 'regardez la caméra', clipped: 'reculez légèrement, visage coupé', stabilizing: 'stabilisation…', live: 'position validée' };
        const size = gate.measurement ? `${(gate.measurement.height * 100).toFixed(1)}% / min ${this.faceProximityGate.thresholdPercent}%` : '';
        liveStatus.textContent = this.forceAutonomousMode ? 'Live désactivé : mode autonome forcé (A)'
          : `FaceMesh live : ${labels[gate.reason]}${size ? ` · ${size}` : ''}`;
      }
      // Tracking remains live regardless of which portrait is displayed.
      if (rawTracking?.detected) {
        this.lastTrackingLandmarks = rawTracking.landmarks.map(p => ({ ...p }));
        this.lastTrackingHeadPose = rawTracking.headPose ? { ...rawTracking.headPose } : null;
        this.autonomousEngine.updateLiveFace(rawTracking);
      }

      const isTracked = Boolean(rawTracking?.detected && !this.forceAutonomousMode);
      this.departureBlendWeight = isTracked ? 0 : 1;
      // Presence covers the full camera image, independently of the square output.
      const isVisitorInFrame = Boolean(rawTracking?.detected && rawTracking.landmarks?.length);
      const isFacePresent = isVisitorInFrame && !this.forceAutonomousMode;

      // Use full-camera detection for tracking, recognition and the absence timer.
      // Forcing autonomous playback alone must not count as a visitor leaving.
      this.visitorDetector.update(isVisitorInFrame ? rawTracking : null, now);
      void this.visitorIdentity.observe(rawTracking, this.videoEl, now, {
        paused: this.isVisitorDetectionBlocked()
      });
      const absenceStatus = document.getElementById('visitor-reset-status');
      if (absenceStatus) {
        const identity = this.visitorIdentity;
        absenceStatus.textContent = !identity.enabled ? 'Reset : reconnaissance désactivée'
          : identity.absenceResetMs === 0 ? 'Reset après absence désactivé'
          : this.isVisitorDetectionBlocked() ? 'Détection en pause pendant le rendu'
          : !identity.reference ? (rawTracking?.tooFar ? 'Rapprochez-vous pour démarrer une visite'
            : rawTracking?.proximityPending ? 'Visage détecté · stabilisation…'
              : 'Aucun portrait mémorisé · en attente d’un visage assez proche')
          : identity.absentSince === null ? 'Visage présent · compteur d’absence arrêté'
          : `Absence · reset dans ${Math.max(0, Math.ceil((identity.absenceResetMs - (now - identity.absentSince)) / 1000))} s`;
      }
      this.updateAutonomousAvailability();

      if (isFacePresent) {
        this.consecutiveDetectedFrames++;
        this.lastFaceDetectedTime = now;
        if (this.consecutiveDetectedFrames === 1) {
          this.autoExitLandmarks = this.appState === 'AUTONOMOUS'
            ? this.lastRenderedTrackingResult?.landmarks?.map(point => ({ ...point })) : null;
          this.isBlendingToLive = !!this.autoExitLandmarks;
          this.blendToLiveStartTime = now;
          if (this.renderer.isTextureFrozen) this.restoreLiveFaceTexture();
        }

        // Keep the captured portrait through Live and autonomous handoffs.
        if (!this.isBlendingToLive && this.appState !== 'AUTONOMOUS' && this.renderer.isTextureFrozen) {
          this.restoreLiveFaceTexture();
        }

        // A detected visitor takes over immediately at the tracked position.
        if (this.appState === 'AUTONOMOUS') {
          if (this.renderer.isTextureFrozen) this.restoreLiveFaceTexture();
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


        // Continuously buffer current frame in fallback canvas
        const vw = this.videoEl.videoWidth || 1280;
        const vh = this.videoEl.videoHeight || 720;
        if (this.lastFaceCanvas.width !== vw || this.lastFaceCanvas.height !== vh) {
          this.lastFaceCanvas.width = vw;
          this.lastFaceCanvas.height = vh;
        }
        this.lastFaceCtx.drawImage(this.videoEl, 0, 0, vw, vh);

        // Auto-calibrator updates
        this.autoCalibrator.update(rawTracking, now);

        // Capture only fresh MediaPipe motion frames. No audio stream is ever requested.
        if (this.presetRecorder.isRecording) {
          this.presetRecorder.capture(rawTracking, now);
        }

        // A close, centered visitor fades into the live portrait; tracking stays active throughout.
        this.isBlendingToLive = false;
        this.autoExitLandmarks = null;
        if (this.renderer.isTextureFrozen) this.renderer.unfreezeFaceTexture();
        this.renderer.setAutonomousFallback(!this.liveFaceTextureGate.allowed
          || !this.renderer.videoTexture || this.videoEl.readyState < 2);
        const renderResult = rawTracking;
        this.lastRenderedTrackingResult = renderResult;
        this.renderer.render(renderResult);

        if (rawTracking.latencyMs && statLatency) {
          statLatency.textContent = `${Math.round(rawTracking.latencyMs)}ms`;
        }

      } else if (!this.forceAutonomousMode && cameraAvailable
        && this.appState !== 'AUTONOMOUS' && this.lastRenderedTrackingResult?.detected
        && now - this.lastFaceDetectedTime < 180) {
        // Ignore brief detection dropouts instead of changing texture and mode.
        this.renderer.render(this.lastRenderedTrackingResult);
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

            // Ease smoothly from the last displayed face to avoid a point-cloud
            // jump on tracking loss. Other views retain the longer handoff.
            this.autonomousEngine.startAutonomous(
              now,
              this.lastRenderedTrackingResult?.landmarks || this.lastTrackingLandmarks,
              this.lastTrackingHeadPose,
              this.minimalistMode ? 500 : 850
            );
          }

          // Generate autonomous frame
          const { renderW, renderH } = this.renderer.getVideoMetrics();
          this.autonomousEngine.rotationLimits = this.renderer.getCameraOffset();
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
      if (statLatency && rawTracking?.latencyMs) {
        statLatency.textContent = `${Math.round(rawTracking.latencyMs)}ms`;
      }
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
  restoreLiveFaceTexture() {
    this.renderer.unfreezeFaceTexture();
  }

  blendDepartingFace(liveFrame, rawTracking, now) {
    const weight = this.departureBlendWeight || 0;
    if (this.minimalistMode || !weight || !this.historyBuffer.hasCurrentVisitorSnapshot()) {
      if (this.departureEngine.isActive) this.departureEngine.stopAutonomous();
      return liveFrame;
    }
    this.applyBestTextureReference(now, 0);
    if (!this.departureEngine.isActive) {
      this.departureEngine.setBaseLandmarks(this.renderer.frozenLandmarks);
      // This preview engine has no enabled audio and never changes visitor state.
      this.departureEngine.startAutonomous(now, null, rawTracking.headPose);
    }
    const { renderW, renderH } = this.renderer.getVideoMetrics();
    const autoFrame = this.departureEngine.generateFrame(now, renderW, renderH);
    if (!autoFrame) return liveFrame;
    const mixPoints = (live, auto) => live.map((p, i) => {
      const a = auto?.[i] || p;
      return { ...p, x: p.x * (1 - weight) + a.x * weight,
        y: p.y * (1 - weight) + a.y * weight,
        z: (p.z || 0) * (1 - weight) + (a.z || 0) * weight };
    });
    return { ...liveFrame,
      landmarks: mixPoints(liveFrame.landmarks, autoFrame.landmarks),
      poseLandmarks: mixPoints(liveFrame.landmarks, autoFrame.poseLandmarks || autoFrame.landmarks),
      liveLandmarks: rawTracking.landmarks,
      departureTextureMix: this.preferCapturedTexture ? 1 : weight
    };
  }

  applyBestTextureReference() {
    if (!this.canUseAutonomous()) return false;
    // Autonomous portraits always use the generic face, never visitor snapshots.
    const { renderW, renderH } = this.renderer.getVideoMetrics();
    this.fallbackFaceLandmarks = createFallbackFaceLandmarks(renderW / Math.max(1, renderH),
      this.renderer.fallbackTextureLandmarks, this.renderer.fallbackTextureAspectRatio);
    this.renderer.setAutonomousFallback(true);
    this.autonomousEngine.setBaseLandmarks(this.fallbackFaceLandmarks);
    return true;
  }

  canUseAutonomous() {
    return this.fallbackFaceLandmarks?.length >= 468;
  }

  updateAutonomousAvailability(force = false) {
    this.syncFaceTextureButton();
    const runButton = document.getElementById('btn-run-comfy');
    if (runButton) {
      runButton.disabled = !this.canCaptureComfyImage();
      runButton.title = runButton.disabled ? 'La webcam doit être active pour lancer ComfyUI' : 'Exécuter avec un nouvel instantané de la webcam';
    }
    const available = this.canUseAutonomous();
    if (!available) {
      this.forceAutonomousMode = false;
      document.getElementById('btn-toggle-autonomous')?.classList.remove('active');
      if (this.appState === 'AUTONOMOUS') {
        this.isBlendingToLive = false;
        this.autoExitLandmarks = null;
        this.restoreLiveFaceTexture();
        this.setState('WAITING');
      }
    }
    if (!force && available === this.lastAutonomousAvailable) return;
    this.lastAutonomousAvailable = available;
    const button = document.getElementById('btn-toggle-autonomous');
    if (button) {
      button.disabled = !available;
      button.title = 'Activer / Forcer le mode autonome (A) — visage générique texturé si aucun cliché';
    }
    for (const button of document.querySelectorAll('.anim-btn-test')) button.disabled = !available;
  }

  handleVisitorSnapshotReady() {
    // Every valid visitor capture replaces the generic portrait automatically.
    this.useVisitorPortrait = true;
    if (this.appState === 'AUTONOMOUS') {
      this.applyBestTextureReference(performance.now(), 0, true);
    }
    this.updateAutonomousAvailability();
    this.tryRunComfyForVisitor();
  }

  syncFaceTextureButton() {
    const fallbackTest = document.getElementById('btn-test-fallback');
    const fallback = this.appState === 'AUTONOMOUS' || this.renderer.autonomousFallback;
    fallbackTest?.classList.toggle('active', fallback);
    fallbackTest?.setAttribute('aria-pressed', String(fallback));
    if (fallbackTest) {
      fallbackTest.disabled = true;
      fallbackTest.textContent = fallback ? 'Visage : fallback' : 'Visage : FaceMesh';
      fallbackTest.title = 'Fondu vers le FaceMesh live si le visage est proche, centré et de face ; fallback sinon.';
    }
    const button = document.getElementById('btn-toggle-face-texture');
    if (!button) return;
    const hasSnapshot = this.historyBuffer.hasCurrentVisitorSnapshot();
    const autonomous = this.appState === 'AUTONOMOUS';
    const captured = autonomous && hasSnapshot && !fallback;
    button.disabled = true;
    button.textContent = fallback || autonomous && !hasSnapshot ? 'Texture : fallback'
      : captured ? 'Texture : FaceMesh' : 'Texture : Live';
    button.setAttribute('aria-pressed', String(captured));
    button.classList.toggle('active', captured);
    button.title = autonomous ? 'Le mode autonome conserve le cliché FaceMesh, ou le fallback sans cliché.'
      : !hasSnapshot ? 'En attente d’un cliché FaceMesh pour pouvoir changer de texture.'
        : 'Basculer entre la texture webcam en direct et le cliché FaceMesh mémorisé.';
  }

  /**
   * Called whenever a pristine, centered, still, frontal reference is captured in memory.
   */
  handlePristineCapture(detail = {}) {
    const { landmarks, score } = detail;
    console.log(`[FaceTextureHistoryBuffer] 🌟 Meilleure référence faciale capturée ! (Score: ${Math.round(score)})`);
    if (landmarks) {
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

  isVisitorDetectionBlocked() {
    return this.minimalistMode && this.comfyMinimalistJobs.size > 0;
  }

  handleNewVisitor(detail = {}) {
    // Continue tracking presence, but ignore new visits during the current
    // minimalist render and its one-second video-return delay.
    if (this.isVisitorDetectionBlocked()) return;
    // A new visitor takes control immediately, even during forced playback.
    this.forceAutonomousMode = false;
    this.autonomousTimeout.update(false, performance.now());
    document.getElementById('btn-toggle-autonomous')?.classList.remove('active');
    if (this.audioLibrary) this.audioLibrary.testPlayback = null;
    this.autonomousEngine.stopAutonomous();
    this.showNotification(detail.identityConfirmed ? 'Nouveau visiteur reconnu'
      : 'Nouveau visiteur détecté', 'success', 15000, 'visitor-result');
    // Invalidate old render monitors immediately, before the one-second delay.
    this.comfyCallId++;
    if (this.comfySettings.enabled && this.comfySettings.baseUrl) {
      this.comfyCancellation = fetch('/api/comfy/cancel', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseUrl: this.comfySettings.baseUrl })
      }).then(async response => {
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Annulation ComfyUI impossible');
        }
      }).catch(error => {
        // Submission retries cancellation server-side before accepting a new job.
        console.error('[ComfyUI] Annulation:', error);
      });
    }
    // A new session gets a random ID; tracking loss and autonomous playback keep it.
    this.currentVisitorId = typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
    this.updateVisitorIdUI();
    const reason = detail.reason || 'MANUAL';
    console.log(`[VisitorDetector] Visiteur ${this.currentVisitorId} (${reason}, absence : ${Math.round(detail.absenceDuration || 0)} ms, distance : ${Number.isFinite(detail.identityDistance) ? detail.identityDistance.toFixed(3) : 'première capture'}, seuil : ${this.visitorIdentity.sameThreshold.toFixed(2)})`);

    this.setState('NEW_PERSON');

    // Notify connected displays without creating or persisting an image.
    if (this.canvasBroadcaster) {
      this.canvasBroadcaster.notifyNewVisitor({ ...detail, visitorId: this.currentVisitorId });
    }

    // Reset best visitor backup texture tracker for this new visitor session
    this.historyBuffer.resetVisitorSession();
    this.renderer.unfreezeFaceTexture();
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
    this.canvasBroadcaster?.setLiveBackgroundEnabled(false);
  }

  setWebcamOnlyMode(enabled) {
    this.webcamOnlyMode = !!enabled;
    document.body.classList.toggle('webcam-only-mode', this.webcamOnlyMode);
    const button = document.getElementById('btn-toggle-webcam-only');
    button?.classList.toggle('active', this.webcamOnlyMode);
    button?.setAttribute('aria-pressed', String(this.webcamOnlyMode));
    if (this.canvasBroadcaster) {
      this.canvasBroadcaster.webcamOnlyMode = this.webcamOnlyMode;
      this.canvasBroadcaster.drawBroadcastFrame();
    }
  }

  setMinimalistMode(enabled) {
    const wasMinimalist = this.minimalistMode;
    this.minimalistMode = !!enabled || this.comfyMinimalistJobs.size > 0;
    this.renderer.setMinimalistMode(this.minimalistMode);
    document.body.classList.toggle('minimalist-mode', this.minimalistMode);
    const button = document.getElementById('btn-toggle-minimalist');
    button?.classList.toggle('active', this.minimalistMode);
    button?.setAttribute('aria-pressed', String(this.minimalistMode));
    this.setBustMode();
    if (this.lastRenderedTrackingResult?.detected) this.renderer.render(this.lastRenderedTrackingResult);
    this.canvasBroadcaster?.drawBroadcastFrame();
    if (!wasMinimalist && this.minimalistMode) {
      fetch('/api/osc/test?signal=newVisitor', {
        method: 'POST', signal: AbortSignal.timeout(5000)
      }).then(async response => {
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Envoi OSC impossible');
        }
      }).catch(error => {
        this.showNotification(`Minimaliste · échec OSC : ${error.message}`, 'error', 2500, 'osc-minimalist');
      });
    }
  }

  setBustMode() {
    this.bustModeRequested = true;
    this.bustModeEnabled = this.bustModeRequested && (!this.minimalistMode || this.renderer.autonomousFallback);
    this.renderer.setShowBust(this.bustModeEnabled);
    this.faceMeshAlignmentControls?.sync();
    document.body.classList.toggle('bust-only-mode', this.bustModeEnabled);
    this.updateBroadcastBackground();
    this.syncAlignProfile?.();
  }

  setState(newState) {
    if (newState === 'AUTONOMOUS' && !this.canUseAutonomous()) {
      this.forceAutonomousMode = false;
      return;
    }
    const wasAutonomous = this.appState === 'AUTONOMOUS';
    if (newState !== 'AUTONOMOUS') {
      this.forceFallbackFace = false;
      this.renderer.setAutonomousFallback(!this.liveFaceTextureGate.allowed
        || !this.renderer.videoTexture || this.videoEl.readyState < 2);
    }
    this.appState = newState;
    if (wasAutonomous && newState !== 'AUTONOMOUS') this.autonomousEngine.stopAutonomous();
    if (wasAutonomous !== (newState === 'AUTONOMOUS')) {
      this.setBustMode();
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
