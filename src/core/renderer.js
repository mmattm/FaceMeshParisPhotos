/**
 * Studio-Grade 3D Sculptural Mask & Monochrome Face Mesh Renderer (WebGL via Three.js)
 * 
 * Delivers a realistic, silky-smooth matte-porcelain mannequin mask (in the style of high-end
 * sculptural 3D masks) that dynamically fits the user's face with real-time studio lighting,
 * smooth vertex normals, anatomical eye sockets, and lifelike 3D eyeballs, irises, and pupils.
 */

import * as THREE from 'three';
import { FaceLandmarker } from '@mediapipe/tasks-vision';
import { buildTrianglesFromTesselation } from './triangulation.js';
import { BustOverlayModel } from './bustOverlayModel.js';

export class FaceMeshRenderer {
  constructor(canvasElement, videoElement = null) {
    this.canvas = canvasElement;
    this.videoElement = videoElement;
    this.isMirrored = true;
    this.showWebcam = true;
    this.isFaceTextureEnabled = true;
    this.showBust = false;
    this.minimalistMode = false;
    this.autonomousRenderScale = 1;
    this.faceMeshVisible = true;
    this.faceMeshAlignment = { x: 0, y: -16.5, z: -9, scale: 95.5, pitch: 0, yaw: 0, roll: 0 };
    this.normalFaceMeshAlignment = { x: 0, y: 0, z: 0, scale: 100, pitch: 0, yaw: 0, roll: 0 };

    // Texture Color Grading (1.0 = normal, 0.90 = -10%, etc.)
    this.textureContrast = 1;   // Contraste du masque (0.90 = 10% moins contrasté)
    this.textureSaturation = 0.95; // Saturation du masque (0.90 = 10% moins saturé)
    this.textureUniforms = {
      uContrast: { value: this.textureContrast },
      uSaturation: { value: this.textureSaturation }
    };

    this.isTextureFrozen = false;
    this.freezeCanvas = null;
    this.freezeTexture = null;
    this.lastLiveLandmarks = null;
    this.frozenLandmarks = null;
    this.lastHeadPose = null;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvasWidth = canvasElement.clientWidth || 1280;
    this.canvasHeight = canvasElement.clientHeight || 720;

    // 1. Three.js WebGL Hardware Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      stencil: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(this.canvasWidth, this.canvasHeight, false);
    this.renderer.autoClear = true;
    this.renderer.autoClearColor = true;
    this.renderer.autoClearDepth = true;
    this.renderer.autoClearStencil = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.scene = new THREE.Scene();

    // 2. Orthographic Camera with 3D Offset & Tilt Alignment Rig
    this.cameraOffset = {
      x: 0,
      y: 0,
      pitch: 0,
      yaw: 0,
      roll: 0,
      zoom: 1.0
    };

    this.camera = new THREE.OrthographicCamera(
      -this.canvasWidth / 2,
      this.canvasWidth / 2,
      this.canvasHeight / 2,
      -this.canvasHeight / 2,
      -3000,
      3000
    );
    this.scene.add(this.camera);
    this.updateCameraTransform();

    // 3. Studio Sculptural 3-Point Lighting
    this.setupStudioLighting();

    // 4. Live Video Texture Setup
    if (this.videoElement) {
      this.setupVideoTexture();
    }

    // 5. MediaPipe Topology Connections
    this.tesselation = FaceLandmarker.FACE_LANDMARKS_TESSELATION || [];
    this.rightEye = FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE || [];
    this.leftEye = FaceLandmarker.FACE_LANDMARKS_LEFT_EYE || [];
    this.rightIris = FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS || [];
    this.leftIris = FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS || [];
    this.faceOval = FaceLandmarker.FACE_LANDMARKS_FACE_OVAL || [
      { start: 10, end: 338 }, { start: 338, end: 297 }, { start: 297, end: 332 }, { start: 332, end: 284 },
      { start: 284, end: 251 }, { start: 251, end: 389 }, { start: 389, end: 356 }, { start: 356, end: 454 },
      { start: 454, end: 323 }, { start: 323, end: 361 }, { start: 361, end: 288 }, { start: 288, end: 397 },
      { start: 397, end: 365 }, { start: 365, end: 379 }, { start: 379, end: 378 }, { start: 378, end: 400 },
      { start: 400, end: 377 }, { start: 377, end: 152 }, { start: 152, end: 148 }, { start: 148, end: 176 },
      { start: 176, end: 149 }, { start: 149, end: 150 }, { start: 150, end: 136 }, { start: 136, end: 172 },
      { start: 172, end: 58 }, { start: 58, end: 132 }, { start: 132, end: 93 }, { start: 93, end: 234 },
      { start: 234, end: 127 }, { start: 127, end: 162 }, { start: 162, end: 21 }, { start: 21, end: 54 },
      { start: 54, end: 103 }, { start: 103, end: 67 }, { start: 67, end: 109 }, { start: 109, end: 10 }
    ];

    // Pre-build Triangles
    this.triangles = buildTrianglesFromTesselation(this.tesselation);

    // 6. 3D Meshes & Materials
    this.setupMeshes();

    // 7. Sculptural 3D Eyes & Pupils
    this.setupEyes();

    // 8. Anatomical Black Oral Cavity (Noir dans la bouche)
    this.setupMouth();
    this.setupLandmarkPoints();

    // Keep the photo mask, eye stencil, eyes and mouth aligned as one layer.
    this.faceMeshRoot = new THREE.Group();
    this.faceMeshRoot.name = 'FaceMeshAlignment';
    this.faceMeshRoot.add(this.maskMesh, this.eyeApertureMesh, this.eyeGroup, this.mouthMesh, this.landmarkPoints);
    this.scene.add(this.faceMeshRoot);

    // 9. Optional male/female OBJ cranium, neck and shoulders behind the mask
    this.bustOverlay = new BustOverlayModel(this.scene);
  }

  setupVideoTexture() {
    if (!this.videoElement) return;
    this.videoTexture = new THREE.VideoTexture(this.videoElement);
    this.videoTexture.colorSpace = THREE.SRGBColorSpace;
    this.videoTexture.generateMipmaps = false;
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;
  }

  setVideoElement(videoEl) {
    this.videoElement = videoEl;
    if (videoEl) {
      if (!this.videoTexture) {
        this.setupVideoTexture();
      }
      if (this.textureMaterial) {
        this.textureMaterial.map = this.videoTexture;
        this.textureMaterial.needsUpdate = true;
      }
      if (this.webcamPlaneMaterial && !this.webcamPlaneMaterial.map) {
        this.webcamPlaneMaterial.map = this.videoTexture;
        this.webcamPlaneMaterial.needsUpdate = true;
      }
      this.updateVideoElementTransform();
    }
  }

  setupStudioLighting() {
    // Soft omnidirectional wrap light (Bright, studio-clean baseline)
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    this.scene.add(this.ambientLight);

    // Key Light: Upper-left front (sculpts cheekbones, nose, and brow)
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    this.keyLight.position.set(-280, 420, 550);
    this.scene.add(this.keyLight);

    // Fill Light: Lower-right front (softens shadows on the right face)
    this.fillLight = new THREE.DirectionalLight(0xffffff, 0.85);
    this.fillLight.position.set(320, -120, 380);
    this.scene.add(this.fillLight);

    // Top Rim Light: Accentuates cranial curvature and brow definition
    this.rimLight = new THREE.DirectionalLight(0xffffff, 0.55);
    this.rimLight.position.set(0, 550, 180);
    this.scene.add(this.rimLight);
  }

  /**
   * Generates continuous feathering weights from the boundary face oval into the interior polygons.
   * Hop 0 (outermost face oval contour): 0.0 (completely transparent at boundary)
   * Hop 1 (immediately adjacent polygon ring): 0.45 (soft subtle transition)
   * Hop 2 (second polygon ring): 0.82 (smooth buildup)
   * Hop 3 (third polygon ring): 0.96 (almost opaque)
   * Hop 4+ (interior of face): 1.0 (fully opaque)
   */
  buildFeatherWeights() {
    const weights = new Float32Array(this.numVertices);
    weights.fill(1.0);

    const oval = this.faceOval || [];
    const ovalVerts = new Set();
    oval.forEach(e => {
      if (e.start < 468) ovalVerts.add(e.start);
      if (e.end < 468) ovalVerts.add(e.end);
    });

    if (ovalVerts.size === 0) return weights;

    // Build adjacency graph from face tesselation
    const adj = new Map();
    (this.tesselation || []).forEach(({ start, end }) => {
      if (start < 468 && end < 468) {
        if (!adj.has(start)) adj.set(start, new Set());
        if (!adj.has(end)) adj.set(end, new Set());
        adj.get(start).add(end);
        adj.get(end).add(start);
      }
    });

    // BFS hop distance from the outermost boundary oval
    const dist = new Map();
    ovalVerts.forEach(v => dist.set(v, 0));

    const queue = [...ovalVerts];
    while (queue.length > 0) {
      const u = queue.shift();
      const d = dist.get(u);
      const neighbors = adj.get(u);
      if (neighbors) {
        for (const v of neighbors) {
          if (!dist.has(v)) {
            dist.set(v, d + 1);
            queue.push(v);
          }
        }
      }
    }

    for (let i = 0; i < 468; i++) {
      const hop = dist.has(i) ? dist.get(i) : 10;
      if (hop === 0) weights[i] = 0.0;
      else if (hop === 1) weights[i] = 0.35;
      else if (hop === 2) weights[i] = 0.70;
      else if (hop === 3) weights[i] = 0.92;
      else weights[i] = 1.0;
    }

    return weights;
  }

  setupMeshes() {
    // Support all 478 landmarks (468 face mesh + 10 iris points)
    this.numVertices = 478;
    this.positions = new Float32Array(this.numVertices * 3);
    this.posAttribute = new THREE.BufferAttribute(this.positions, 3);
    this.posAttribute.setUsage(THREE.DynamicDrawUsage);

    this.uvs = new Float32Array(this.numVertices * 2);
    // Initialize default UVs
    for (let i = 0; i < this.numVertices; i++) {
      this.uvs[i * 2] = 0.5;
      this.uvs[i * 2 + 1] = 0.5;
    }
    this.uvAttribute = new THREE.BufferAttribute(this.uvs, 2);
    this.uvAttribute.setUsage(THREE.DynamicDrawUsage);

    // Boundary feathering weights (Smooth alpha transition at the outer edge)
    this.featherAlphas = this.buildFeatherWeights();
    this.featherAttribute = new THREE.BufferAttribute(this.featherAlphas, 1);

    // Shared Base Geometry
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', this.posAttribute);
    this.geometry.setAttribute('uv', this.uvAttribute);
    this.geometry.setAttribute('featherAlpha', this.featherAttribute);

    const indexArray = [];
    for (let i = 0; i < this.triangles.length; i++) {
      const [a, b, c] = this.triangles[i];
      if (a < 468 && b < 468 && c < 468) {
        indexArray.push(a, b, c);
      }
    }
    this.geometry.setIndex(indexArray);

    // 1. Sculptural 3D Porcelain / Plaster Mask Material
    // Satin white eggshell finish with subtle boundary feathering
    this.maskMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf5f5f7,
      roughness: 0.38,
      metalness: 0.02,
      clearcoat: 0.20,
      clearcoatRoughness: 0.35,
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: true,
      depthWrite: true,
      polygonOffset: true,
      polygonOffsetFactor: -1.0,
      polygonOffsetUnits: -1.0
    });

    this.maskMaterial.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
attribute float featherAlpha;
varying float vFeatherAlpha;`
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
vFeatherAlpha = featherAlpha;`
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>
varying float vFeatherAlpha;`
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
gl_FragColor.a *= vFeatherAlpha;
if (gl_FragColor.a < 0.005) discard;`
      );
    };

    // 1b. Real-time Live Face Texture Material (Realistic skin projection with studio depth & bright luminosity)
    // Feathers smoothly on the border and applies 10% desaturation and 10% contrast reduction
    this.textureMaterial = new THREE.MeshStandardMaterial({
      map: this.videoTexture || null,
      color: 0xffffff, // 100% pure white base to preserve clean illumination
      roughness: 0.82, // Soft diffuse skin, eliminates dark specular falloff
      metalness: 0.0,  // Pure non-metallic dielectric skin
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: true,
      depthWrite: true,
      polygonOffset: true,
      polygonOffsetFactor: -1.0,
      polygonOffsetUnits: -1.0
    });

    this.textureMaterial.onBeforeCompile = (shader) => {
      // Bind live uniforms
      shader.uniforms.uContrast = this.textureUniforms.uContrast;
      shader.uniforms.uSaturation = this.textureUniforms.uSaturation;

      // 1. Vertex Shader: Pass featherAlpha attribute to varying
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
attribute float featherAlpha;
varying float vFeatherAlpha;`
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
vFeatherAlpha = featherAlpha;`
      );

      // 2. Fragment Shader: Apply saturation, contrast, and boundary feathering
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>
uniform float uContrast;
uniform float uSaturation;
varying float vFeatherAlpha;`
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `#include <map_fragment>
#ifdef USE_MAP
  // Rec. 709 luminance weights
  float texLuma = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
  // Saturation adjustment (mix with grayscale luminance)
  diffuseColor.rgb = mix(vec3(texLuma), diffuseColor.rgb, uSaturation);
  // Contrast adjustment (scale around midpoint 0.5)
  diffuseColor.rgb = (diffuseColor.rgb - vec3(0.5)) * uContrast + vec3(0.5);
#endif`
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
gl_FragColor.a *= vFeatherAlpha;
if (gl_FragColor.a < 0.005) discard;`
      );
    };

    // 0. Autonomous 3D Attached Webcam Background Plane
    this.webcamBackgroundGroup = new THREE.Group();
    this.webcamBackgroundGroup.renderOrder = -10;
    this.webcamBackgroundGroup.visible = false;

    this.webcamPlaneDepthSpacing = 140; // Anatomical depth spacing behind nose root anchor
    this.webcamPlaneEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.webcamPlaneQuat = new THREE.Quaternion();

    this.webcamPlaneGeo = new THREE.PlaneGeometry(1, 1);
    this.webcamPlaneMaterial = new THREE.MeshBasicMaterial({
      map: this.freezeTexture || this.videoTexture || null,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true
    });
    this.webcamPlane = new THREE.Mesh(this.webcamPlaneGeo, this.webcamPlaneMaterial);
    this.webcamPlane.renderOrder = -10;
    this.webcamBackgroundGroup.add(this.webcamPlane);
    this.scene.add(this.webcamBackgroundGroup);

    this.maskMesh = new THREE.Mesh(this.geometry, this.maskMaterial);
    this.maskMesh.renderOrder = 10;
    this.scene.add(this.maskMesh);

  }

  setupLandmarkPoints() {
    // Share the live vertex buffer, without the triangle index: one dot per landmark.
    this.landmarkGeometry = new THREE.BufferGeometry();
    this.landmarkGeometry.setAttribute('position', this.posAttribute);
    this.landmarkGeometry.setDrawRange(0, 0);
    this.landmarkMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2.5,
      sizeAttenuation: false,
      depthTest: false,
      depthWrite: false,
      toneMapped: false
    });
    this.landmarkPoints = new THREE.Points(this.landmarkGeometry, this.landmarkMaterial);
    this.landmarkPoints.name = 'MinimalistFaceMeshPoints';
    this.landmarkPoints.frustumCulled = false;
    this.landmarkPoints.visible = false;
  }

  /**
   * Anatomical 3D Volumetric Oral Cavity & Pharynx Mesh
   * Constructs a true 3D spatial oral chamber with realistic depth into the skull:
   * - Ring 0 (0..19): Rim vertices locked to the 20 inner lip vermilion landmarks
   * - Ring 1 (20..39): Mid-oral chamber (vaulted hard palate ceiling & lingual floor recessed in -Z)
   * - Vertex 40: Deep posterior pharynx center (dark throat interior)
   * Eliminates 2D flat paper-mouth artifacts, z-fighting, and provides authentic 3D spatial depth.
   */
  setupMouth() {
    // 20 inner lip boundary rim landmarks forming a continuous closed loop:
    // Upper lip (left-to-right in face space, 78 to 308):
    // 78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308
    // Lower lip (right-to-left in face space, 308 back to 78):
    // 324, 318, 402, 317, 14, 87, 178, 88, 95
    this.mouthRimIndices = [
      78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308,
      324, 318, 402, 317, 14, 87, 178, 88, 95
    ];
    const N = this.mouthRimIndices.length; // 20

    // Vertex buffer layout:
    // 0 .. 19: Rim vertices (at lip margin)
    // 20 .. 39: Mid-oral cavity ring (recessed palate / tongue floor)
    // 40: Deep posterior pharynx center (deep throat)
    const vertexCount = N * 2 + 1; // 41
    this.mouthPositions = new Float32Array(vertexCount * 3);
    this.mouthPosAttribute = new THREE.BufferAttribute(this.mouthPositions, 3);
    this.mouthPosAttribute.setUsage(THREE.DynamicDrawUsage);

    const mouthTriangles = [];
    // 1. Quads connecting Rim Ring (0..N-1) to Mid Ring (N..2N-1)
    for (let i = 0; i < N; i++) {
      const next = (i + 1) % N;
      const r0 = i;
      const r1 = next;
      const m0 = N + i;
      const m1 = N + next;
      mouthTriangles.push(r0, m0, m1);
      mouthTriangles.push(r0, m1, r1);
    }

    // 2. Fan triangles connecting Mid Ring (N..2N-1) to Pharynx vertex (2N)
    const pharynxIdx = N * 2;
    for (let i = 0; i < N; i++) {
      const next = (i + 1) % N;
      const m0 = N + i;
      const m1 = N + next;
      mouthTriangles.push(m0, pharynxIdx, m1);
    }

    this.mouthGeometry = new THREE.BufferGeometry();
    this.mouthGeometry.setAttribute('position', this.mouthPosAttribute);
    this.mouthGeometry.setIndex(mouthTriangles);

    this.mouthMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000, // 50% semi-transparent black overlay
      transparent: true,
      opacity: 0.50,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: false
    });

    this.mouthMesh = new THREE.Mesh(this.mouthGeometry, this.mouthMaterial);
    this.mouthMesh.renderOrder = 8; // Renders right behind mask (10)
    this.mouthMesh.visible = false;
    this.scene.add(this.mouthMesh);
  }

  /**
   * Updates the 3D Volumetric Oral Cavity vertices in real-time.
   * Dynamically adapts depth, palate vaulting, and pharyngeal curvature to mouth aperture.
   */
  updateOralCavity(renderW, renderH, depthScale) {
    if (!this.mouthMesh || !this.mouthMesh.visible || !this.mouthRimIndices) return;

    const N = this.mouthRimIndices.length;
    let sumX = 0, sumY = 0, sumZ = 0;

    for (let i = 0; i < N; i++) {
      const lmIdx = this.mouthRimIndices[i];
      const px = this.positions[lmIdx * 3] || 0;
      const py = this.positions[lmIdx * 3 + 1] || 0;
      const pz = this.positions[lmIdx * 3 + 2] || 0;

      // 1. Ring 0: Rim vertices right on the inner vermilion margin
      this.mouthPositions[i * 3] = px;
      this.mouthPositions[i * 3 + 1] = py;
      this.mouthPositions[i * 3 + 2] = pz;

      sumX += px;
      sumY += py;
      sumZ += pz;
    }

    const cx = sumX / N;
    const cy = sumY / N;
    const cz = sumZ / N;

    // Oral aperture metrics
    const upperY = this.positions[13 * 3 + 1] || cy;
    const lowerY = this.positions[14 * 3 + 1] || cy;
    const apertureH = Math.abs(upperY - lowerY);
    const cornerR_X = this.positions[78 * 3] || cx;
    const cornerL_X = this.positions[308 * 3] || cx;
    const mouthW = Math.abs(cornerL_X - cornerR_X);

    // Anatomical oral depth (scales with head scale and opens naturally with jaw drop)
    const oralDepth = Math.max(renderW * 0.045, Math.min(renderW * 0.14, mouthW * 0.55 + apertureH * 1.2));

    // 2. Ring 1: Mid-oral cavity chamber (arched palate ceiling & lingual floor recessed in -Z)
    for (let i = 0; i < N; i++) {
      const rimX = this.mouthPositions[i * 3];
      const rimY = this.mouthPositions[i * 3 + 1];
      const isUpper = i <= 10;
      const archSign = isUpper ? 1.0 : -1.0;

      const midIdx = N + i;
      this.mouthPositions[midIdx * 3] = cx + (rimX - cx) * 0.85;
      this.mouthPositions[midIdx * 3 + 1] = rimY + archSign * (apertureH * 0.25 + renderW * 0.006);
      this.mouthPositions[midIdx * 3 + 2] = cz - oralDepth * 0.52;
    }

    // 3. Pharynx vertex: deep posterior throat center
    const pharynxIdx = N * 2;
    this.mouthPositions[pharynxIdx * 3] = cx;
    this.mouthPositions[pharynxIdx * 3 + 1] = cy - apertureH * 0.12;
    this.mouthPositions[pharynxIdx * 3 + 2] = cz - oralDepth * 1.05;

    this.mouthPosAttribute.needsUpdate = true;
    this.mouthGeometry.computeVertexNormals();
  }

  /**
   * Anatomical 3D Eyeballs, Irises, and Pupils (Background Layer)
   * Positioned inside the eye cavities of the 3D mask with real-time gaze tracking.
   * Occlusion is disabled on eye materials (depthWrite: false, renderOrder = 0)
   * so they act strictly as a background layer behind the mask (maskMesh.renderOrder = 10).
   */
  setupEyes() {
    this.eyeGroup = new THREE.Group();
    this.eyeGroup.renderOrder = 0;
    this.scene.add(this.eyeGroup);

    // 0. Anatomical Eye Aperture Stencil Mask Mesh
    // Spans the eyelid contour loops of both eyes using the live face mesh positions (posAttribute).
    // Writes ref=1 into the stencil buffer strictly inside the eye socket openings with colorWrite: false.
    // All 3D eyeball components (sclera, limbal, iris, pupil, glint) test stencilRef == 1,
    // guaranteeing they are 100% physically clipped to the eye openings and CAN NEVER bleed outside the mask!
    const rightLower = [33, 7, 163, 144, 145, 153, 154, 155, 133];
    const rightUpper = [33, 246, 161, 160, 159, 158, 157, 173, 133];
    const leftLower = [263, 249, 390, 373, 374, 380, 381, 382, 362];
    const leftUpper = [263, 466, 388, 387, 386, 385, 384, 398, 362];

    const apertureIndices = [];
    for (let i = 0; i < rightLower.length - 1; i++) {
      apertureIndices.push(rightUpper[i], rightLower[i], rightLower[i + 1]);
      apertureIndices.push(rightUpper[i], rightLower[i + 1], rightUpper[i + 1]);
    }
    for (let i = 0; i < leftLower.length - 1; i++) {
      apertureIndices.push(leftUpper[i], leftLower[i], leftLower[i + 1]);
      apertureIndices.push(leftUpper[i], leftLower[i + 1], leftUpper[i + 1]);
    }

    this.eyeApertureGeometry = new THREE.BufferGeometry();
    this.eyeApertureGeometry.setAttribute('position', this.posAttribute);
    this.eyeApertureGeometry.setIndex(apertureIndices);

    this.eyeApertureMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false,
      colorWrite: false, // Pure stencil mask pass; does not draw color
      stencilWrite: true,
      stencilWriteMask: 0xff,
      stencilRef: 1,
      stencilFunc: THREE.AlwaysStencilFunc,
      stencilFuncMask: 0xff,
      stencilZPass: THREE.ReplaceStencilOp,
      stencilFail: THREE.KeepStencilOp,
      stencilZFail: THREE.KeepStencilOp
    });

    this.eyeApertureMesh = new THREE.Mesh(this.eyeApertureGeometry, this.eyeApertureMaterial);
    this.eyeApertureMesh.renderOrder = 1; // Renders immediately before eye meshes (renderOrder 2..6)
    this.eyeApertureMesh.frustumCulled = false;
    this.scene.add(this.eyeApertureMesh);

    // Read-only stencil test: fragments pass ONLY if the pixel was marked by the eye socket opening (stencilRef == 1)
    // Writes are blocked with stencilWriteMask: 0x00 so eye drawing never modifies the stencil buffer.
    const eyeStencilConfig = {
      stencilWrite: true,
      stencilWriteMask: 0x00,
      stencilRef: 1,
      stencilFunc: THREE.EqualStencilFunc,
      stencilFuncMask: 0xff,
      stencilFail: THREE.KeepStencilOp,
      stencilZFail: THREE.KeepStencilOp,
      stencilZPass: THREE.KeepStencilOp
    };

    // 1. Sclera Material (Smooth matte ivory porcelain matching the mask)
    this.scleraMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4f5f8,
      roughness: 0.25,
      metalness: 0.02,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      ...eyeStencilConfig
    });

    // 2. Limbal Ring Material (Deep transitional dark charcoal rim)
    this.limbalMaterial = new THREE.MeshBasicMaterial({
      color: 0x0c0e12,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      ...eyeStencilConfig
    });

    // 3. Iris Material (Sculptural anthracite / deep slate)
    this.irisMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e2024,
      roughness: 0.38,
      metalness: 0.04,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      ...eyeStencilConfig
    });

    // 4. Pupil Material (Deep velvet black)
    this.pupilMaterial = new THREE.MeshBasicMaterial({
      color: 0x020204,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      ...eyeStencilConfig
    });

    // 5. Corneal Catchlight (Gleaming white specular glint)
    this.glintMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      depthTest: false,
      depthWrite: false,
      ...eyeStencilConfig
    });

    const sphereGeo = new THREE.SphereGeometry(1, 32, 24);
    const circleGeo = new THREE.CircleGeometry(1, 32);

    const createEyeRig = () => {
      const rig = new THREE.Group();
      rig.frustumCulled = false;

      const sclera = new THREE.Mesh(sphereGeo, this.scleraMaterial);
      sclera.renderOrder = 2; // In front of webcam plane (-10), behind mask (10)
      sclera.frustumCulled = false;
      rig.add(sclera);

      const limbal = new THREE.Mesh(circleGeo, this.limbalMaterial);
      limbal.renderOrder = 3;
      limbal.frustumCulled = false;
      rig.add(limbal);

      const iris = new THREE.Mesh(circleGeo, this.irisMaterial);
      iris.renderOrder = 4;
      iris.frustumCulled = false;
      rig.add(iris);

      const pupil = new THREE.Mesh(circleGeo, this.pupilMaterial);
      pupil.renderOrder = 5;
      pupil.frustumCulled = false;
      rig.add(pupil);

      const glint = new THREE.Mesh(circleGeo, this.glintMaterial);
      glint.renderOrder = 6;
      glint.frustumCulled = false;
      rig.add(glint);

      return { rig, sclera, limbal, iris, pupil, glint };
    };

    this.leftEyeRig = createEyeRig();
    this.eyeGroup.add(this.leftEyeRig.rig);

    this.rightEyeRig = createEyeRig();
    this.eyeGroup.add(this.rightEyeRig.rig);

    this.eyeGroup.frustumCulled = false;

    this.updateVisibility();
  }


  setCameraOffset(offset = {}) {
    if (offset.x !== undefined) this.cameraOffset.x = Number(offset.x) || 0;
    if (offset.y !== undefined) this.cameraOffset.y = Number(offset.y) || 0;
    if (offset.pitch !== undefined) this.cameraOffset.pitch = Number(offset.pitch) || 0;
    if (offset.yaw !== undefined) this.cameraOffset.yaw = Number(offset.yaw) || 0;
    if (offset.roll !== undefined) this.cameraOffset.roll = Number(offset.roll) || 0;
    if (offset.zoom !== undefined) this.cameraOffset.zoom = Math.max(0.1, Number(offset.zoom) || 1.0);
    this.updateCameraTransform();
  }

  getCameraOffset() {
    return { ...this.cameraOffset };
  }

  resetCameraOffset() {
    this.cameraOffset = { x: 0, y: 0, pitch: 0, yaw: 0, roll: 0, zoom: 1.0 };
    this.updateCameraTransform();
    return { ...this.cameraOffset };
  }

  updateCameraTransform() {
    if (!this.camera) return;
    const { x, y, pitch, yaw, roll, zoom } = this.cameraOffset;

    // Apply zoom to orthographic camera projection
    this.camera.zoom = Math.max(0.1, zoom || 1.0) * this.autonomousRenderScale;
    this.camera.updateProjectionMatrix();

    const dist = 1000;

    const targetX = -x;
    const targetY = -y;
    const targetZ = 0;

    // Base offset orientation strictly from alignment panel (never compounds with live head pose)
    // -pitch: When pitch is positive (Haut), camera orbits UP (+Y) and looks down at the face
    // -yaw: When yaw is positive (Droite), camera orbits RIGHT (+X) and looks from the right
    // roll: When roll is positive, camera rolls counter-clockwise so scene tilts clockwise
    const offsetEuler = new THREE.Euler(
      THREE.MathUtils.degToRad(-pitch),
      THREE.MathUtils.degToRad(-yaw),
      THREE.MathUtils.degToRad(roll),
      'YXZ'
    );
    const combinedQuat = new THREE.Quaternion().setFromEuler(offsetEuler);

    const target = new THREE.Vector3(targetX, targetY, targetZ);
    const camOffset = new THREE.Vector3(0, 0, dist).applyQuaternion(combinedQuat);
    const upVec = new THREE.Vector3(0, 1, 0).applyQuaternion(combinedQuat);

    this.camera.position.copy(target).add(camOffset);
    this.camera.up.copy(upVec);
    this.camera.lookAt(target);
    this.camera.updateMatrixWorld();

    // Synchronize live webcam video element with the 3D viewpoint alignment
    this.updateVideoElementTransform();
  }

  updateVideoElementTransform() {
    if (!this.videoElement) return;
    const { x, y, pitch, yaw, roll, zoom } = this.cameraOffset;
    const mirror = this.isMirrored ? -1 : 1;

    // Matching 3D camera viewpoint in exact direction and sense:
    // x: horizontal translation
    // -y: vertical translation (CSS Y is inverted from WebGL Y)
    // zoom: scale
    // pitch: tilt (rotateX, negative angle tilts top closer when camera is above looking down)
    // yaw: pan (rotateY, turns in the exact same sense as 3D camera orbit)
    // roll: rotation (rotateZ, rotates clockwise on screen)
    const tx = Number(x) || 0;
    const ty = -(Number(y) || 0);
    const z = Math.max(0.1, Number(zoom) || 1.0);
    const rx = -(Number(pitch) || 0);
    const ry = Number(yaw) || 0;
    const rz = Number(roll) || 0;

    this.videoElement.style.transformOrigin = 'center center';
    // Full 3D orientation matching Three.js camera viewpoint in real-time (perspective handled by .video-wrapper)
    this.videoElement.style.transform = `translate3d(${tx}px, ${ty}px, 0px) scale(${z}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scaleX(${mirror})`;
  }

  resize(displayWidth, displayHeight, pixelRatio = null) {
    this.canvasWidth = displayWidth;
    this.canvasHeight = displayHeight;
    this.dpr = pixelRatio === null
      ? Math.min(window.devicePixelRatio || 1, 2)
      : Math.max(0.5, Math.min(2, pixelRatio));

    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(displayWidth, displayHeight, false);

    this.camera.left = -displayWidth / 2;
    this.camera.right = displayWidth / 2;
    this.camera.top = displayHeight / 2;
    this.camera.bottom = -displayHeight / 2;
    this.updateCameraTransform();
  }

  getVideoMetrics() {
    const cw = this.canvasWidth;
    const ch = this.canvasHeight;
    const vw = (this.videoElement && this.videoElement.videoWidth > 0) ? this.videoElement.videoWidth : 1280;
    const vh = (this.videoElement && this.videoElement.videoHeight > 0) ? this.videoElement.videoHeight : 720;

    const containerAspect = cw / ch;
    const videoAspect = vw / vh;

    let renderW = cw;
    let renderH = ch;

    // Strict object-fit: cover mapping
    if (containerAspect > videoAspect) {
      renderW = cw;
      renderH = cw / videoAspect;
    } else {
      renderH = ch;
      renderW = ch * videoAspect;
    }

    return { renderW, renderH, videoAspect };
  }

  setMirrored(mirrored) {
    this.isMirrored = mirrored;
    this.updateVideoElementTransform();
  }

  setRenderMode(mode) {
    // Representation mode is fixed to textured 3D mask
  }

  setShowWebcam(show) {
    this.showWebcam = show;
    this.updateVisibility();
  }

  setFaceTextureEnabled(enabled) {
    this.isFaceTextureEnabled = enabled;
    if (enabled && !this.videoTexture && this.videoElement) {
      this.setupVideoTexture();
      if (this.textureMaterial) {
        this.textureMaterial.map = this.videoTexture;
      }
    }
    this.updateVisibility();
  }

  setContrast(val) {
    this.textureContrast = val;
    if (this.textureUniforms?.uContrast) {
      this.textureUniforms.uContrast.value = val;
    }
  }

  setSaturation(val) {
    this.textureSaturation = val;
    if (this.textureUniforms?.uSaturation) {
      this.textureUniforms.uSaturation.value = val;
    }
  }

  freezeFaceTexture(sourceCanvas = null, landmarks = null) {
    if (!this.freezeCanvas) {
      this.freezeCanvas = document.createElement('canvas');
    }
    const src = sourceCanvas || this.videoElement;
    if (!src) return;
    const vw = src.width || src.videoWidth || 1280;
    const vh = src.height || src.videoHeight || 720;
    this.freezeCanvas.width = vw;
    this.freezeCanvas.height = vh;
    const ctx = this.freezeCanvas.getContext('2d');
    ctx.drawImage(src, 0, 0, vw, vh);

    if (!this.freezeTexture) {
      this.freezeTexture = new THREE.CanvasTexture(this.freezeCanvas);
      this.freezeTexture.colorSpace = THREE.SRGBColorSpace;
      this.freezeTexture.minFilter = THREE.LinearFilter;
      this.freezeTexture.magFilter = THREE.LinearFilter;
    } else {
      this.freezeTexture.needsUpdate = true;
    }
    this.isTextureFrozen = true;
    this.uvBlendFrom = null;
    const lmsToFreeze = landmarks || this.lastLiveLandmarks;
    if (lmsToFreeze) {
      this.frozenLandmarks = lmsToFreeze.map(lm => ({ x: lm.x, y: lm.y, z: lm.z }));
      this.autonomousWebcamLandmarks = this.frozenLandmarks;
    }
    if (this.textureMaterial) {
      this.textureMaterial.map = this.freezeTexture;
    }
    if (this.webcamPlaneMaterial) {
      this.webcamPlaneMaterial.map = this.freezeTexture;
    }
  }

  setAutonomousWebcamBackground(sourceCanvas = null, landmarks = null) {
    this.freezeFaceTexture(sourceCanvas, landmarks);
  }

  unfreezeFaceTexture() {
    this.isTextureFrozen = false;
    this.frozenLandmarks = null;
    this.uvBlendFrom = null;
    if (this.videoTexture && this.textureMaterial) {
      this.textureMaterial.map = this.videoTexture;
    }
    if (this.webcamBackgroundGroup) {
      this.webcamBackgroundGroup.visible = false;
    }
  }

  toggleFreezeFaceTexture() {
    if (this.isTextureFrozen) {
      this.unfreezeFaceTexture();
      return false;
    } else {
      this.freezeFaceTexture();
      return true;
    }
  }

  setShowBust(show) {
    this.showBust = !!show;
    this.bustOverlay?.setEnabled(this.showBust && !this.minimalistMode);
    this.updateVisibility();
  }

  setMinimalistMode(enabled) {
    this.minimalistMode = !!enabled;
    this.renderer.setClearColor(0x000000, this.minimalistMode ? 1 : 0);
    this.bustOverlay?.setEnabled(this.showBust && !this.minimalistMode);
    this.updateVisibility();
    this.clear();
  }

  setBustModel(modelName) {
    this.bustOverlay?.setModel(modelName);
  }

  getFaceMeshAlignment(mode = this.showBust ? 'bust' : 'normal') {
    return { ...(mode === 'bust' ? this.faceMeshAlignment : this.normalFaceMeshAlignment) };
  }

  updateAutonomousFraming(trackingResult) {
    // Enlarge the complete composition while preserving face/bust alignment.
    const weight = THREE.MathUtils.clamp(trackingResult.isAutonomous
      ? (trackingResult.autonomousBlendWeight ?? 1)
      : (trackingResult.blendToLiveWeight ?? 0), 0, 1);
    this.autonomousRenderScale = 1 + 0.25 * weight;
    const zoom = Math.max(0.1, this.cameraOffset.zoom || 1) * this.autonomousRenderScale;
    if (this.camera.zoom !== zoom) {
      this.camera.zoom = zoom;
      this.camera.updateProjectionMatrix();
    }
  }

  setFaceMeshAlignment(values = {}, mode = this.showBust ? 'bust' : 'normal') {
    const alignment = mode === 'bust' ? this.faceMeshAlignment : this.normalFaceMeshAlignment;
    for (const [key, min, max] of [['x', -50, 50], ['y', -50, 50], ['z', -100, 100], ['scale', 50, 150], ['pitch', -45, 45], ['yaw', -45, 45], ['roll', -30, 30]]) {
      if (Number.isFinite(values[key])) {
        alignment[key] = Math.max(min, Math.min(max, values[key]));
      }
    }
  }

  setFaceMeshVisible(visible) {
    this.faceMeshVisible = !!visible;
    this.updateVisibility();
  }

  updateFaceMeshAlignment(poseLandmarks = null, renderW = 1, renderH = 1, depthScale = 1) {
    const root = this.faceMeshRoot;
    root.position.set(0, 0, 0);
    root.scale.setScalar(1);
    root.quaternion.identity();

    // Use the tracked head axes so the adjustment follows turns and head size.
    const point = index => {
      const lm = poseLandmarks?.[index];
      if (!lm) return new THREE.Vector3().fromArray(this.positions, index * 3);
      const x = this.isMirrored ? 1 - lm.x : lm.x;
      return new THREE.Vector3((x - 0.5) * renderW, (0.5 - lm.y) * renderH, -(lm.z || 0) * depthScale);
    };
    const eyeA = point(33).add(point(133)).multiplyScalar(0.5);
    const eyeB = point(263).add(point(362)).multiplyScalar(0.5);
    const eyeDistance = eyeA.distanceTo(eyeB);
    if (eyeDistance < 0.001) return;
    const axisX = new THREE.Vector3().subVectors(eyeA.x <= eyeB.x ? eyeB : eyeA, eyeA.x <= eyeB.x ? eyeA : eyeB).normalize();
    const axisY = point(10).sub(point(152));
    axisY.addScaledVector(axisX, -axisY.dot(axisX));
    if (axisY.lengthSq() < 0.000001) return;
    axisY.normalize();
    const axisZ = new THREE.Vector3().crossVectors(axisX, axisY).normalize();
    const pivot = eyeA.add(eyeB).multiplyScalar(0.5);
    const { x, y, z, scale, pitch, yaw, roll } = this.getFaceMeshAlignment();
    const factor = scale / 100;
    // Rotate around the eye midpoint in the tracked head's local axes so the
    // correction follows the visitor and autonomous motion without moving the bust.
    const headRotation = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(axisX, axisY, axisZ));
    const localRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(
      THREE.MathUtils.degToRad(-pitch),
      THREE.MathUtils.degToRad(yaw),
      THREE.MathUtils.degToRad(-roll),
      'YXZ'
    ));
    root.quaternion.copy(headRotation).multiply(localRotation).multiply(headRotation.clone().invert());
    root.scale.setScalar(factor);
    root.position.copy(pivot).sub(pivot.clone().applyQuaternion(root.quaternion).multiplyScalar(factor))
      .addScaledVector(axisX, x * eyeDistance / 100)
      .addScaledVector(axisY, y * eyeDistance / 100)
      .addScaledVector(axisZ, z * eyeDistance / 100);
  }

  updateVisibility() {
    if (this.webcamBackgroundGroup) {
      this.webcamBackgroundGroup.visible = !this.minimalistMode && !this.showBust && this.showWebcam && this.isAutonomousActive;
    }

    const showSurface = this.faceMeshVisible && !this.minimalistMode;
    this.maskMesh.visible = showSurface;
    this.eyeGroup.visible = showSurface;
    if (this.landmarkPoints) this.landmarkPoints.visible = this.faceMeshVisible && this.minimalistMode;
    if (this.eyeApertureMesh) {
      this.eyeApertureMesh.visible = this.eyeGroup.visible;
    }
    if (this.mouthMesh) {
      this.mouthMesh.visible = showSurface && !!this.isAutonomousActive;
    }

    // Always use textured material when available, fallback to maskMaterial before texture is loaded
    if (this.videoTexture || this.freezeTexture) {
      this.maskMesh.material = this.textureMaterial;
    } else {
      this.maskMesh.material = this.maskMaterial;
    }

    // Studio lights configured for vibrant, natural skin tones and sculptural depth
    this.ambientLight.intensity = 1.25;
    this.keyLight.intensity = 1.15;
    this.fillLight.intensity = 0.80;
    this.rimLight.intensity = 0.45;
    if (this.textureMaterial) {
      this.textureMaterial.color.setHex(0xffffff);
      this.textureMaterial.roughness = 0.82;
      this.textureMaterial.metalness = 0.0;
    }
    this.scleraMaterial.color.setHex(0xf8f9fc);
    if (this.limbalMaterial) this.limbalMaterial.color.setHex(0x0c0e12);
    this.irisMaterial.color.setHex(0x1a1c20);
    this.pupilMaterial.color.setHex(0x020204);
  }

  clear() {
    this.renderer.clear(true, true, true);
  }

  /**
   * Exact 3D Eye & Pupil Background Layer
   * Strictly aligned with the tracking data and wireframe landmarks (468/473).
   * Rendered strictly behind the 3D mask with depthWrite: false so that the mask
   * is in front and occludes the eyes everywhere outside the eye socket openings.
   */
  update3DEyes(landmarks, renderW, renderH, depthScale) {
    if (!this.eyeGroup.visible) return;

    const get3D = (idx) => {
      const lm = landmarks[idx];
      if (!lm) return null;
      const rawX = this.isMirrored ? (1.0 - lm.x) : lm.x;
      return new THREE.Vector3(
        (rawX - 0.5) * renderW,
        (0.5 - lm.y) * renderH,
        -(lm.z || 0) * depthScale
      );
    };

    const updateSingleEye = (pIn, pOut, pTopList, pBotList, pIris, pIrisPeriphery, eyeRig) => {
      if (!pIn || !pOut || !pIris || !eyeRig) return;

      const validTop = (pTopList || []).filter(p => !!p);
      const validBot = (pBotList || []).filter(p => !!p);
      if (validTop.length === 0 || validBot.length === 0) return;

      let topX = 0, topY = 0, topZ = 0;
      for (let i = 0; i < validTop.length; i++) {
        topX += validTop[i].x; topY += validTop[i].y; topZ += validTop[i].z;
      }
      const pTop = new THREE.Vector3(topX / validTop.length, topY / validTop.length, topZ / validTop.length);

      let botX = 0, botY = 0, botZ = 0;
      for (let i = 0; i < validBot.length; i++) {
        botX += validBot[i].x; botY += validBot[i].y; botZ += validBot[i].z;
      }
      const pBot = new THREE.Vector3(botX / validBot.length, botY / validBot.length, botZ / validBot.length);

      const eyeWidth = pIn.distanceTo(pOut);
      const eyeHeight = pTop.distanceTo(pBot);
      if (eyeWidth < 1) return;

      // Center of the eye opening in X and Y
      const pCanthiMid = new THREE.Vector3().addVectors(pIn, pOut).multiplyScalar(0.5);
      const pLidsMid = new THREE.Vector3().addVectors(pTop, pBot).multiplyScalar(0.5);
      const pCenter = new THREE.Vector3().addVectors(
        pCanthiMid.clone().multiplyScalar(0.60),
        pLidsMid.clone().multiplyScalar(0.40)
      );

      // Anatomical human eyeball radius (dynamically scales with distance and eyeWidth)
      const radius = Math.max(8, Math.min(260, eyeWidth * 0.76));

      // Calculate aperture depth and local eyelid margin limits
      const midLidZ = (pTop.z + pBot.z) * 0.5;
      const midCanthiZ = (pIn.z + pOut.z) * 0.5;
      const apertureCenterZ = midLidZ * 0.65 + midCanthiZ * 0.35;

      // Bring the eyes closer to the mask surface, but strictly prevent clipping or poking out:
      // Front apex of eyeball sits just 0.45 units behind the eyelid margin (down from 2.5+ units earlier)
      const safeFrontZ = Math.min(apertureCenterZ - 0.45, pTop.z - 0.25, pBot.z - 0.25);
      const ballCenter = new THREE.Vector3(pCenter.x, pCenter.y, safeFrontZ - radius);

      // 1. Sclera Eyeball Dome
      eyeRig.sclera.position.copy(ballCenter);
      eyeRig.sclera.scale.setScalar(radius);

      // Tracked iris radius from MediaPipe periphery points
      let irisRadius = 0;
      let validCount = 0;
      if (pIrisPeriphery && pIrisPeriphery.length > 0) {
        for (let i = 0; i < pIrisPeriphery.length; i++) {
          const p = pIrisPeriphery[i];
          if (p) {
            irisRadius += pIris.distanceTo(p);
            validCount++;
          }
        }
      }
      if (validCount > 0) {
        irisRadius /= validCount;
      }
      // Fallback to anatomical ratio if tracking periphery isn't detected
      if (!irisRadius || irisRadius < 2 || irisRadius > eyeWidth * 0.38) {
        irisRadius = eyeWidth * 0.22;
      }
      const pupilRadius = irisRadius * 0.48;

      // 2. Exact Tracking Alignment for Iris and Pupil
      // Constrained so the pupil is GUARANTEED to remain visible inside the eye cavity (creux de l'œil)
      const maxGazeOffsetX = Math.max(2, (eyeWidth * 0.48) - (pupilRadius * 1.15));
      const maxGazeOffsetY = Math.max(2, (eyeHeight * 0.48) - (pupilRadius * 1.15));

      const irisX = pCenter.x + Math.max(-maxGazeOffsetX, Math.min(maxGazeOffsetX, pIris.x - pCenter.x));
      const irisY = pCenter.y + Math.max(-maxGazeOffsetY, Math.min(maxGazeOffsetY, pIris.y - pCenter.y));

      // Project tracked (irisX, irisY) onto the spherical surface of the sclera
      const dx = irisX - ballCenter.x;
      const dy = irisY - ballCenter.y;
      const distSq = dx * dx + dy * dy;
      const maxAllowedDistSq = radius * radius * 0.88;
      const safeDistSq = Math.min(distSq, maxAllowedDistSq);
      const dz = Math.sqrt(Math.max(0, radius * radius - safeDistSq));

      let surfaceZ = ballCenter.z + dz;

      // Local eyelid boundary depth limit at current iris coordinates (x, y)
      const tY = (pTop.y !== pBot.y) ? Math.max(0, Math.min(1, (irisY - pBot.y) / (pTop.y - pBot.y))) : 0.5;
      const localLidZ = (1 - tY) * pBot.z + tY * pTop.z;
      const maxAllowedZ = Math.min(localLidZ - 0.20, pTop.z - 0.20, pBot.z - 0.20);

      // Strict safety ceiling: iris, pupil, and glint can NEVER poke through or exceed the eyelid margin
      surfaceZ = Math.min(surfaceZ, maxAllowedZ);

      // Outward surface normal
      const normal = new THREE.Vector3(dx, dy, dz).normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

      // 3. Limbal Ring (outer transition ring around iris)
      eyeRig.limbal.position.set(irisX, irisY, Math.min(surfaceZ + 0.01, maxAllowedZ - 0.03));
      eyeRig.limbal.quaternion.copy(q);
      eyeRig.limbal.scale.set(irisRadius * 1.05, irisRadius * 1.05, 1);

      // 4. Iris (rich slate sculptural disc)
      eyeRig.iris.position.set(irisX, irisY, Math.min(surfaceZ + 0.02, maxAllowedZ - 0.02));
      eyeRig.iris.quaternion.copy(q);
      eyeRig.iris.scale.set(irisRadius * 0.96, irisRadius * 0.96, 1);

      // 5. Pupil (deep velvet black core)
      eyeRig.pupil.position.set(irisX, irisY, Math.min(surfaceZ + 0.03, maxAllowedZ - 0.01));
      eyeRig.pupil.quaternion.copy(q);
      eyeRig.pupil.scale.set(pupilRadius, pupilRadius, 1);

      // 6. Corneal Catchlight Glint (bright specular reflection)
      const glintOffset = new THREE.Vector3(-irisRadius * 0.26, irisRadius * 0.26, 0.04).applyQuaternion(q);
      eyeRig.glint.position.set(irisX + glintOffset.x, irisY + glintOffset.y, Math.min(surfaceZ + glintOffset.z, maxAllowedZ));
      eyeRig.glint.quaternion.copy(q);
      eyeRig.glint.scale.set(pupilRadius * 0.28, pupilRadius * 0.28, 1);
    };

    // Right Eye: Inner 133, Outer 33, Upper eyelid contour, Lower eyelid contour, Iris center 468, Periphery [469..472]
    updateSingleEye(
      get3D(133), get3D(33),
      [get3D(246), get3D(161), get3D(160), get3D(159), get3D(158), get3D(157), get3D(173)],
      [get3D(7), get3D(163), get3D(144), get3D(145), get3D(153), get3D(154), get3D(155)],
      get3D(468),
      [get3D(469), get3D(470), get3D(471), get3D(472)],
      this.rightEyeRig
    );

    // Left Eye: Inner 362, Outer 263, Upper eyelid contour, Lower eyelid contour, Iris center 473, Periphery [474..477]
    updateSingleEye(
      get3D(362), get3D(263),
      [get3D(466), get3D(388), get3D(387), get3D(386), get3D(385), get3D(384), get3D(398)],
      [get3D(249), get3D(390), get3D(373), get3D(374), get3D(380), get3D(381), get3D(382)],
      get3D(473),
      [get3D(474), get3D(475), get3D(476), get3D(477)],
      this.leftEyeRig
    );
  }

  render(trackingResult) {
    if (!trackingResult || !trackingResult.detected || !trackingResult.landmarks) {
      this.clear();
      return;
    }

    const { landmarks, liveLandmarks } = trackingResult;
    if (liveLandmarks) {
      this.lastLiveLandmarks = liveLandmarks;
    } else if (landmarks) {
      this.lastLiveLandmarks = landmarks;
    }

    const { renderW, renderH } = this.getVideoMetrics();
    const len = Math.min(this.numVertices, landmarks.length);

    // Natural 1:1 cranial depth scale matching the rendered video dimensions
    const depthScale = renderW * 1.10;

    // UV coordinates source for live face texture warping
    const uvSource = (this.isTextureFrozen && this.frozenLandmarks)
      ? this.frozenLandmarks
      : (liveLandmarks || landmarks);

    // Update 3D vertex buffer and UV map perfectly aligned with the video frame
    for (let i = 0; i < len; i++) {
      const lm = landmarks[i];
      const rawX = this.isMirrored ? (1.0 - lm.x) : lm.x;

      this.positions[i * 3] = (rawX - 0.5) * renderW;
      this.positions[i * 3 + 1] = (0.5 - lm.y) * renderH;
      this.positions[i * 3 + 2] = -(lm.z || 0) * depthScale;

      const uvLm = uvSource[i] || lm;
      this.uvs[i * 2] = uvLm.x;
      this.uvs[i * 2 + 1] = 1.0 - uvLm.y;
    }

    this.posAttribute.needsUpdate = true;
    this.landmarkGeometry.setDrawRange(0, len);
    this.uvAttribute.needsUpdate = true;
    this.geometry.computeVertexNormals();

    // Live video texture refresh
    const needsTexture = this.isFaceTextureEnabled && !this.isTextureFrozen;
    if (needsTexture && this.videoTexture) {
      this.videoTexture.needsUpdate = true;
    }

    if (trackingResult.headPose) {
      this.lastHeadPose = trackingResult.headPose;
    }

    // Update 3D Eyeballs, Irises, and Pupils
    this.update3DEyes(landmarks, renderW, renderH, depthScale);

    const isAutonomous = !!trackingResult.isAutonomous;
    this.isAutonomousActive = isAutonomous;

    // Keep the live mouth texture unobscured; use the dark cavity only in autonomous mode.
    this.mouthMesh.visible = this.faceMeshVisible && !this.minimalistMode && isAutonomous;
    this.updateOralCavity(renderW, renderH, depthScale);

    // Autonomous 3D Attached Webcam Plane Update
    const blendToLiveWeight = trackingResult.blendToLiveWeight !== undefined ? trackingResult.blendToLiveWeight : null;
    const isReturningToLive = blendToLiveWeight !== null && blendToLiveWeight > 0.005;
    const shouldShowPlane = !this.minimalistMode && !this.showBust && this.showWebcam && (isAutonomous || isReturningToLive) && (this.freezeTexture || this.videoTexture);

    if (this.webcamBackgroundGroup) {
      if (shouldShowPlane) {
        this.webcamBackgroundGroup.visible = true;

        if (this.webcamPlaneMaterial) {
          if (!this.webcamPlaneMaterial.map) {
            this.webcamPlaneMaterial.map = this.freezeTexture || this.videoTexture;
          }
          // Smooth crossfade opacity: if returning to live, fade plane out to 0 as live webcam fades in
          if (isReturningToLive) {
            this.webcamPlaneMaterial.opacity = Math.max(0, Math.min(1, blendToLiveWeight));
          } else {
            this.webcamPlaneMaterial.opacity = 1.0;
          }
        }

        // Head anchor position from current animated mask (Nose root landmark 168)
        const anchorIdx = 168;
        const curAnchorX = this.positions[anchorIdx * 3] || 0;
        const curAnchorY = this.positions[anchorIdx * 3 + 1] || 0;
        const curAnchorZ = this.positions[anchorIdx * 3 + 2] || 0;

        // Head orientation from headPose
        const headPose = trackingResult.headPose || this.lastHeadPose || { pitch: 0, yaw: 0, roll: 0 };
        const mirrorSign = this.isMirrored ? -1 : 1;
        this.webcamPlaneEuler.set(
          THREE.MathUtils.degToRad(headPose.pitch || 0),
          THREE.MathUtils.degToRad(-(headPose.yaw || 0) * mirrorSign),
          THREE.MathUtils.degToRad((headPose.roll || 0) * mirrorSign),
          'YXZ'
        );
        this.webcamPlaneQuat.setFromEuler(this.webcamPlaneEuler);

        // Perspective depth scale from headPose
        let zDepthScale = headPose.zDepthScale || 1.0;
        if (!headPose.zDepthScale && headPose.z !== undefined && renderW > 0) {
          const transZ = headPose.z / renderW;
          zDepthScale = Math.max(0.65, Math.min(1.45, 1.0 + transZ * 1.8));
        }

        // Anchor coordinates in snapshot image space
        const snapAnchor = (this.autonomousWebcamLandmarks && this.autonomousWebcamLandmarks[anchorIdx])
          || (this.frozenLandmarks && this.frozenLandmarks[anchorIdx])
          || (landmarks && landmarks[anchorIdx])
          || { x: 0.5, y: 0.5, z: 0 };

        const snapRawX = this.isMirrored ? (1.0 - snapAnchor.x) : snapAnchor.x;
        const localOffsetX = -(snapRawX - 0.5) * renderW;
        const localOffsetY = -(0.5 - snapAnchor.y) * renderH;
        const depthSpacing = this.webcamPlaneDepthSpacing || 140;

        // Position and orient parent group at current head anchor
        this.webcamBackgroundGroup.position.set(curAnchorX, curAnchorY, curAnchorZ);
        this.webcamBackgroundGroup.quaternion.copy(this.webcamPlaneQuat);
        this.webcamBackgroundGroup.scale.set(zDepthScale, zDepthScale, zDepthScale);

        // Position and mirror plane inside group
        this.webcamPlane.position.set(localOffsetX, localOffsetY, -depthSpacing);
        this.webcamPlane.scale.set(renderW * (this.isMirrored ? -1 : 1), renderH, 1);
      } else {
        this.webcamBackgroundGroup.visible = false;
        if (this.webcamPlaneMaterial) {
          this.webcamPlaneMaterial.opacity = 1.0;
        }
      }
    }

    // Optional OBJ layer follows the exact same tracked/autonomous head frame.
    this.bustOverlay?.update(trackingResult.poseLandmarks || landmarks, renderW, renderH, depthScale, this.isMirrored);
    this.updateFaceMeshAlignment(trackingResult.poseLandmarks, renderW, renderH, depthScale);
    this.updateAutonomousFraming(trackingResult);

    // Render WebGL scene
    this.renderer.render(this.scene, this.camera);
  }
}
