/** Face Cap morph targets + MediaPipe's fixed metric camera. */
import * as THREE from 'three';
import { FaceLandmarker } from '@mediapipe/tasks-vision';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { canonicalVertices } from './canonicalFaceGeometry.js';
import { buildTrianglesFromTesselation } from './triangulation.js';
import { MP_FOV, createRegistration, applyFaceExpressions, poseFromLandmarks, correctFacePitch, zoomFacePose } from './faceCapRig.js';
import { buildPhotoBinding, updatePhotoUvs } from './facePhotoUv.js';
import { FaceTransition } from './faceTransition.js';
import { createUntexturedFaceMaterial } from './untexturedFaceMaterial.js';
import { createMediaPipeGeometry, updateMediaPipeGeometry } from './mediaPipePointCloud.js';
import { AutonomousPointRig, PointCloudTransition } from './autonomousPointCloud.js';

const VIDEO_DISTANCE = 100;

export class FaceMeshRenderer {
  constructor(canvasElement, videoElement = null) {
    this.canvas = canvasElement;
    this.videoElement = videoElement;
    this.isMirrored = true;
    this.showWebcam = true;
    this.isFaceTextureEnabled = false;
    this.minimalistMode = false;
    this.hasMediaPipePoints = false;
    this.positionMode = 'tracking';
    this.expressionIntensity = 1;
    this.facePitchDegrees = 0;
    this.faceZoom = 1;
    this.maxRotationDegrees = 180;
    this.faceTransition = new FaceTransition();
    this.pointTransition = new PointCloudTransition();
    this.autonomousFallback = false;
    this.faceMeshVisible = true;
    this.isTextureFrozen = false;
    this.frozenLandmarks = null;
    this.lastLiveLandmarks = null;
    this.canvasWidth = canvasElement.clientWidth || 1280;
    this.canvasHeight = canvasElement.clientHeight || 720;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true,
      preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(this.canvasWidth, this.canvasHeight, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    this.scene.scale.x = -1;
    this.scene.add(new THREE.AmbientLight(0xffffff, 2));
    // No orbit, offsets, lookAt, stored alignment or mode-specific camera transforms.
    this.camera = new THREE.PerspectiveCamera(MP_FOV, 16 / 9, 1, 10000);
    this.faceContainer = new THREE.Group();
    this.faceContainer.matrixAutoUpdate = false;
    this.faceContainer.matrix.makeTranslation(0, 0, -50);
    this.scene.add(this.faceContainer);
    this.registration = createRegistration();
    this.faceContainer.add(this.registration);
    if (videoElement) {
      videoElement.style.visibility = 'hidden';
      this.videoTexture = new THREE.VideoTexture(videoElement);
      this.videoTexture.colorSpace = THREE.SRGBColorSpace;
    }
    this.videoPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: this.videoTexture || null, depthTest: false, depthWrite: false }));
    this.videoPlane.position.z = -VIDEO_DISTANCE;
    this.videoPlane.renderOrder = -1;
    this.videoPlane.visible = false;
    this.scene.add(this.videoPlane);
  }

  async init() {
    const ktx2 = new KTX2Loader().setTranscoderPath('/wasm/basis/').detectSupport(this.renderer);
    try {
      const gltf = await new GLTFLoader().setKTX2Loader(ktx2).setMeshoptDecoder(MeshoptDecoder)
        .loadAsync('/models/facecap.glb');
      this.model = gltf.scene.getObjectByName('grp_transform');
      this.face = this.model?.getObjectByName('mesh_2');
      this.eyeL = this.model?.getObjectByName('eyeLeft');
      this.eyeR = this.model?.getObjectByName('eyeRight');
      this.teeth = this.model?.getObjectByName('mesh_3');
      if (!this.face?.morphTargetDictionary || !this.eyeL || !this.eyeR || !this.teeth) {
        throw new Error('Modèle Face Cap incomplet (visage, expressions, yeux ou dents manquants).');
      }
      this.registration.add(this.model);
      // Bind in the canonical frame, before applying any live head pose.
      this.registration.updateMatrixWorld(true);
      const toCanonical = this.registration.matrix.clone();
      const chain = [];
      for (let node = this.face; node !== this.registration; node = node.parent) chain.unshift(node);
      for (const node of chain) { node.updateMatrix(); toCanonical.multiply(node.matrix); }
      this.photoBindings = buildPhotoBinding(this.face.geometry, toCanonical, canonicalVertices,
        buildTrianglesFromTesselation(FaceLandmarker.FACE_LANDMARKS_TESSELATION),
        FaceLandmarker.FACE_LANDMARKS_FACE_OVAL);
      this.photoMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      this.photoMaterial.onBeforeCompile = shader => {
        shader.vertexShader = 'attribute float photoWeight; varying float vPhotoWeight;\n' + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace('#include <uv_vertex>',
          '#include <uv_vertex>\nvPhotoWeight = photoWeight;');
        shader.fragmentShader = 'varying float vPhotoWeight;\n' + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>',
          `#include <map_fragment>\ndiffuseColor.rgb = mix(vec3(0.55, 0.36, 0.26), diffuseColor.rgb, vPhotoWeight);`);
      };
      this.untexturedMaterial = createUntexturedFaceMaterial(toCanonical, canonicalVertices);
      this.face.material = this.isFaceTextureEnabled ? this.photoMaterial : this.untexturedMaterial;
      // The model's original eyes and teeth are retained, including the eye texture.
      const pointMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 4, sizeAttenuation: false });
      pointMaterial.onBeforeCompile = shader => {
        shader.fragmentShader = shader.fragmentShader.replace('#include <alphatest_fragment>',
          '#include <alphatest_fragment>\nif (distance(gl_PointCoord, vec2(0.5)) > 0.5) discard;');
      };
      this.points = new THREE.Points(createMediaPipeGeometry(), pointMaterial);
      this.points.frustumCulled = false;
      this.faceContainer.add(this.points);
      this.autonomousPointRig = new AutonomousPointRig(this.face.geometry, toCanonical, canonicalVertices);
      this.gui = new GUI({ title: 'Expressions Face Cap', width: 280 });
      this.gui.domElement.style.zIndex = '100';
      this.gui.hide();
      for (const [name, index] of Object.entries(this.face.morphTargetDictionary)) {
        this.gui.add(this.face.morphTargetInfluences, String(index), 0, 1, 0.01).name(name).listen();
      }
      this.updateVisibility();
    } finally {
      ktx2.dispose();
    }
  }

  toggleExpressionControls() {
    if (this.gui) this.gui.show(this.gui._hidden);
  }

  resize(width, height, pixelRatio = null) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    if (pixelRatio !== null) this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);
  }

  getVideoMetrics() {
    const videoAspect = (this.videoElement?.videoWidth || 1280) / (this.videoElement?.videoHeight || 720);
    const renderW = Math.min(this.canvasWidth, this.canvasHeight * videoAspect);
    return { renderW, renderH: renderW / videoAspect, videoAspect };
  }

  setMirrored(mirrored) {
    this.isMirrored = !!mirrored;
    this.scene.scale.x = mirrored ? -1 : 1;
  }

  setShowWebcam(enabled) { this.showWebcam = !!enabled; }
  setExpressionIntensity(value) {
    this.expressionIntensity = Number.isFinite(value) ? THREE.MathUtils.clamp(value, 0, 3) : 1;
  }
  setFacePitchDegrees(value) {
    this.facePitchDegrees = Number.isFinite(value) ? THREE.MathUtils.clamp(value, -45, 45) : 0;
  }
  setFaceZoom(value) {
    this.faceZoom = Number.isFinite(value) ? THREE.MathUtils.clamp(value, .5, 2) : 1;
  }
  setMaxRotationDegrees(value) {
    this.maxRotationDegrees = Number.isFinite(value) ? THREE.MathUtils.clamp(value, 0, 180) : 180;
  }
  setFaceTextureEnabled(enabled) { this.isFaceTextureEnabled = !!enabled; }
  setPositionMode(mode) { this.positionMode = mode === 'centered' ? 'centered' : 'tracking'; }
  setMinimalistMode(enabled) {
    this.minimalistMode = !!enabled;
    if (!this.minimalistMode) this.pointTransition.reset();
    this.updateVisibility();
  }
  setFaceMeshVisible(visible) { this.faceMeshVisible = !!visible; this.updateVisibility(); }

  freezeFaceTexture(sourceCanvas = null, landmarks = null) {
    const source = sourceCanvas || this.videoElement;
    const reference = landmarks || this.lastLiveLandmarks;
    if (!source || !reference) return;
    this.freezeCanvas ||= document.createElement('canvas');
    this.freezeCanvas.width = source.videoWidth || source.width;
    this.freezeCanvas.height = source.videoHeight || source.height;
    this.freezeCanvas.getContext('2d').drawImage(source, 0, 0, this.freezeCanvas.width, this.freezeCanvas.height);
    if (!this.freezeTexture) {
      this.freezeTexture = new THREE.CanvasTexture(this.freezeCanvas);
      this.freezeTexture.colorSpace = THREE.SRGBColorSpace;
      this.freezeTexture.minFilter = THREE.LinearFilter;
    }
    this.freezeTexture.needsUpdate = true;
    this.frozenLandmarks = reference.map(point => ({ ...point }));
    this.isTextureFrozen = true;
  }

  unfreezeFaceTexture() { this.isTextureFrozen = false; this.frozenLandmarks = null; }

  async loadFallbackFaceTexture(tracker) {
    const image = new Image();
    image.src = '/models/fallback-face-v1.png';
    await image.decode();
    const landmarks = tracker.detectReferenceLandmarks(image);
    if (!landmarks || landmarks.length < 468) throw new Error('Visage de secours non détecté.');
    this.fallbackTextureLandmarks = landmarks;
    this.fallbackTexture = new THREE.Texture(image);
    this.fallbackTexture.colorSpace = THREE.SRGBColorSpace;
    this.fallbackTexture.needsUpdate = true;
  }

  setAutonomousFallback(enabled) {
    this.autonomousFallback = !!enabled;
    if (enabled) this.unfreezeFaceTexture();
  }

  updateVisibility() {
    if (!this.model) return;
    this.faceContainer.visible = this.faceMeshVisible;
    this.model.traverse(object => { if (object.isMesh) object.visible = !this.minimalistMode; });
    this.points.visible = this.minimalistMode && this.hasMediaPipePoints;
  }

  clear() {
    this.pointTransition.reset();
    this.hasMediaPipePoints = false;
    if (this.points) {
      this.points.visible = false;
      this.points.geometry.setDrawRange(0, 0);
    }
    this.faceContainer.visible = false;
    this.draw();
  }

  draw() {
    const { renderW, renderH, videoAspect } = this.getVideoMetrics();
    if (this.camera.aspect !== videoAspect) {
      this.camera.aspect = videoAspect;
      this.camera.updateProjectionMatrix();
    }
    const height = 2 * VIDEO_DISTANCE * Math.tan(THREE.MathUtils.degToRad(MP_FOV / 2));
    this.videoPlane.scale.set(height * videoAspect, height, 1);
    this.videoPlane.visible = this.showWebcam && this.positionMode === 'tracking' && !this.minimalistMode && !this.isAutonomous
      && this.videoElement?.readyState >= 2;
    this.renderer.setScissorTest(false);
    this.renderer.setViewport(0, 0, this.canvasWidth, this.canvasHeight);
    this.renderer.setClearColor(this.minimalistMode ? 0x000000 : 0x333333, 1);
    this.renderer.clear();
    const x = (this.canvasWidth - renderW) / 2, y = (this.canvasHeight - renderH) / 2;
    this.renderer.setViewport(x, y, renderW, renderH);
    this.renderer.setScissor(x, y, renderW, renderH);
    this.renderer.setScissorTest(true);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setScissorTest(false);
  }

  render(result, timestamp = performance.now()) {
    if (!this.face || !result?.detected || !result.landmarks) { this.clear(); return; }
    this.isAutonomous = !!result.isAutonomous;
    this.lastLiveLandmarks = result.liveLandmarks || result.landmarks;
    const matrix = result.headPose?.matrix;
    const { videoAspect } = this.getVideoMetrics();
    // Live MP and native preset matrices share the same fixed metric camera.
    if (matrix?.length === 16) this.faceContainer.matrix.fromArray(matrix);
    else this.faceContainer.matrix.copy(poseFromLandmarks(result.poseLandmarks || result.landmarks,
      result.headPose, videoAspect, canonicalVertices));
    // Live points come directly from detection. Autonomous points are animated
    // below from preset expressions on front skin, with denser eye/lip contours.
    this.hasMediaPipePoints = this.minimalistMode && !this.isAutonomous
      && updateMediaPipeGeometry(this.points.geometry, result.rawLandmarks || result.landmarks,
        this.faceContainer.matrix, videoAspect);
    if (!this.hasMediaPipePoints) this.points.geometry.setDrawRange(0, 0);
    // Apply the viewing correction to Live and presets before handoff easing;
    // the incoming tracking data and recorded performances remain untouched.
    if (this.facePitchDegrees !== 0) {
      this.faceContainer.matrix.copy(correctFacePitch(this.faceContainer.matrix, this.facePitchDegrees));
    }
    const autonomousKey = this.isAutonomous ? result.animationRunId ?? result.activeAnimationName ?? 'hold' : null;
    const displayed = this.faceTransition.update(this.faceContainer.matrix, result.blendshapes, autonomousKey,
      timestamp, this.positionMode === 'centered', this.maxRotationDegrees);
    // Apply view zoom after handoff easing, around the same anatomical pivot.
    // Tracking, recorded poses and transition snapshots remain unscaled.
    this.faceContainer.matrix.copy(zoomFacePose(displayed.matrix, this.faceZoom));
    this.faceContainer.matrixWorldNeedsUpdate = true;
    applyFaceExpressions(this.face, this.eyeL, this.eyeR, displayed.blendshapes, this.expressionIntensity);
    if (this.minimalistMode && this.isAutonomous) {
      if (result.subMode === 'HOLD' && this.pointTransition.last) {
        this.points.geometry.attributes.position.array.set(this.pointTransition.last);
        this.points.geometry.setDrawRange(0, this.pointTransition.count);
        this.hasMediaPipePoints = true;
      } else {
        this.hasMediaPipePoints = this.autonomousPointRig.update(this.points.geometry, this.face.morphTargetInfluences);
      }
    }
    if (this.minimalistMode && this.hasMediaPipePoints) {
      const kind = !this.isAutonomous ? 'live' : result.subMode === 'HOLD' ? 'hold' : 'preset';
      this.pointTransition.update(this.points.geometry, kind, timestamp, this.faceTransition.durationMs);
    }
    const reference = this.autonomousFallback ? this.fallbackTextureLandmarks
      : this.isTextureFrozen ? this.frozenLandmarks : this.lastLiveLandmarks;
    const texture = this.autonomousFallback ? this.fallbackTexture
      : this.isTextureFrozen ? this.freezeTexture : this.videoTexture;
    const map = this.isFaceTextureEnabled && reference ? texture || null : null;
    if (this.photoMaterial.map !== map) {
      this.photoMaterial.map = map;
      this.photoMaterial.needsUpdate = true;
    }
    this.photoMaterial.color.setHex(map ? 0xffffff : 0xc7a18b);
    this.face.material = this.isFaceTextureEnabled ? this.photoMaterial : this.untexturedMaterial;
    if (reference) updatePhotoUvs(this.face.geometry, this.photoBindings, reference);
    this.updateVisibility();
    this.draw();
  }
}
