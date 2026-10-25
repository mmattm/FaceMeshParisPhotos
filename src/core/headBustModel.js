/**
 * 3D Anatomical Head & Bust Engine (GLTF Model Loader & 6-DoF Rigid Pose Tracking)
 * 
 * Loads a sculptural 3D head & bust model (head.glb) and splits it into two distinct 3D objects:
 *   1. bustMesh: Anatomical bust (shoulders, chest, neck, ears, and cranium/skull vault)
 *   2. faceMesh: Sculpted face of the 3D model
 * 
 * Both objects are tracked in real-time with 6-DoF rigid cranial alignment (position,
 * 3D rotation quaternion, scale) so that they faithfully follow the user's head motion
 * while remaining separate from the dynamic 3D facial mask (maskMesh).
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class HeadBustModel {
  constructor(scene, videoTexture = null) {
    this.scene = scene;
    this.videoTexture = videoTexture;
    this.visible = true;
    this.showBust = true;
    this.showModelFace = false; // Default: bust + cranium visible, dynamic mask sits on face
    this.isLoaded = false;

    // Root group in 3D world space
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'HeadBustRoot';
    this.rootGroup.renderOrder = 2;
    this.scene.add(this.rootGroup);

    // Smoothing state for 6-DoF pose
    this.currentPos = new THREE.Vector3();
    this.targetPos = new THREE.Vector3();
    this.currentQuat = new THREE.Quaternion();
    this.targetQuat = new THREE.Quaternion();
    this.currentScale = 1.0;
    this.targetScale = 1.0;
    this.hasInitialPose = false;

    // Materials
    this.setupMaterials();

    // Meshes
    this.bustMesh = null;
    this.faceMesh = null;

    // Load 3D GLB model
    this.loadModel('/models/head.glb');
  }

  setupMaterials() {
    // 1. Satin Plaster / Porcelain Sculptural Material for Bust & Cranium
    this.bustMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf2f2f5,
      roughness: 0.40,
      metalness: 0.02,
      clearcoat: 0.20,
      clearcoatRoughness: 0.35,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: true
    });

    // 2. Sculptural Material for the Model Face (separated object)
    this.faceMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe8e8ec,
      roughness: 0.45,
      metalness: 0.02,
      clearcoat: 0.15,
      clearcoatRoughness: 0.40,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: true,
      polygonOffset: true,
      polygonOffsetFactor: 1.0,
      polygonOffsetUnits: 1.0
    });

    // 3. Live Webcam Video Texture Material (optional texture mode)
    this.textureMaterial = new THREE.MeshStandardMaterial({
      map: this.videoTexture || null,
      color: 0xffffff,
      roughness: 0.80,
      metalness: 0.0,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: true
    });
  }

  setVideoTexture(texture) {
    this.videoTexture = texture;
    if (this.textureMaterial) {
      this.textureMaterial.map = texture;
      this.textureMaterial.needsUpdate = true;
    }
  }

  loadModel(modelUrl) {
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        let sourceMesh = null;
        gltf.scene.traverse((child) => {
          if (child.isMesh && !sourceMesh) {
            sourceMesh = child;
          }
        });

        if (!sourceMesh) {
          console.warn('[HeadBustModel] No mesh found in GLTF scene.');
          return;
        }

        this.processGeometry(sourceMesh.geometry);
        this.isLoaded = true;
        this.updateVisibility();
      },
      undefined,
      (err) => {
        console.error('[HeadBustModel] Failed to load 3D head model:', err);
      }
    );
  }

  processGeometry(geometry) {
    const posAttr = geometry.attributes.position;
    const normAttr = geometry.attributes.normal;
    const uvAttr = geometry.attributes.uv;
    const indexAttr = geometry.index;

    if (!posAttr || !indexAttr) {
      console.warn('[HeadBustModel] Missing position or index attribute in geometry.');
      return;
    }

    const positions = posAttr.array;
    const normals = normAttr ? normAttr.array : null;
    const indices = indexAttr.array;

    // Classifier: Partition triangles into Face vs Bust/Cranium
    // Lee Perry-Smith local coordinates:
    // Eye level ~ 1.36, chin ~ -0.6, nose ~ 2.59, forehead ~ 2.4, ears ~ +-2.2
    const isFaceVertex = (i) => {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const nz = normals ? normals[i * 3 + 2] : 1.0;

      const normX = x / 1.95;
      const normY = (y - 0.95) / 1.95;
      const rad = normX * normX + normY * normY;
      return rad <= 1.0 && z > 0.45 && nz > -0.2;
    };

    const faceIndices = [];
    const bustIndices = [];

    for (let i = 0; i < indices.length; i += 3) {
      const i0 = indices[i];
      const i1 = indices[i + 1];
      const i2 = indices[i + 2];

      const fCount = (isFaceVertex(i0) ? 1 : 0) +
                     (isFaceVertex(i1) ? 1 : 0) +
                     (isFaceVertex(i2) ? 1 : 0);

      // Majority rule ensures zero gaps and zero overlap between the two objects
      if (fCount >= 2) {
        faceIndices.push(i0, i1, i2);
      } else {
        bustIndices.push(i0, i1, i2);
      }
    }

    // Offset geometry so the eye center is positioned exactly at the local origin (0, 0, 0)
    // LeePerrySmith model eye center: x = -0.052, y = 1.356, z = 1.555
    const offsetX = 0.052;
    const offsetY = -1.356;
    const offsetZ = -1.555;

    // 1. Build Bust & Cranium Geometry
    const bustGeo = new THREE.BufferGeometry();
    bustGeo.setAttribute('position', posAttr.clone());
    if (normAttr) bustGeo.setAttribute('normal', normAttr.clone());
    if (uvAttr) bustGeo.setAttribute('uv', uvAttr.clone());
    bustGeo.setIndex(bustIndices);
    bustGeo.translate(offsetX, offsetY, offsetZ);
    bustGeo.computeVertexNormals();

    this.bustMesh = new THREE.Mesh(bustGeo, this.bustMaterial);
    this.bustMesh.name = 'BustAndCraniumMesh';
    this.bustMesh.renderOrder = 2;
    this.rootGroup.add(this.bustMesh);

    // 2. Build Face Geometry (Separated Object)
    const faceGeo = new THREE.BufferGeometry();
    faceGeo.setAttribute('position', posAttr.clone());
    if (normAttr) faceGeo.setAttribute('normal', normAttr.clone());
    if (uvAttr) faceGeo.setAttribute('uv', uvAttr.clone());
    faceGeo.setIndex(faceIndices);
    faceGeo.translate(offsetX, offsetY, offsetZ);
    faceGeo.computeVertexNormals();

    this.faceMesh = new THREE.Mesh(faceGeo, this.faceMaterial);
    this.faceMesh.name = 'ModelFaceMesh';
    this.faceMesh.renderOrder = 4;
    this.rootGroup.add(this.faceMesh);

    this.updateVisibility();
  }

  setVisible(visible) {
    this.visible = !!visible;
    this.updateVisibility();
  }

  setShowBust(show) {
    this.showBust = !!show;
    this.updateVisibility();
  }

  setShowModelFace(show) {
    this.showModelFace = !!show;
    this.updateVisibility();
  }

  updateVisibility() {
    this.rootGroup.visible = this.visible;
    if (this.bustMesh) {
      this.bustMesh.visible = this.visible && this.showBust;
    }
    if (this.faceMesh) {
      this.faceMesh.visible = this.visible && this.showModelFace;
    }
  }

  /**
   * Real-time 6-DoF Rigid Head Tracking Update
   * Anchors both 3D objects to the user's tracked skull frame in 3D perspective.
   */
  update(landmarks, renderW, renderH, depthScale, isMirrored, isTextureMode = false) {
    if (!this.visible || !this.isLoaded || !landmarks || landmarks.length < 468) {
      return;
    }

    // Material texture update if requested
    if (this.bustMesh && isTextureMode && this.videoTexture) {
      if (this.bustMesh.material !== this.textureMaterial) {
        this.bustMesh.material = this.textureMaterial;
      }
    } else if (this.bustMesh && this.bustMesh.material !== this.bustMaterial) {
      this.bustMesh.material = this.bustMaterial;
    }

    // Helper: landmark index to 3D world space
    const get3D = (idx) => {
      const lm = landmarks[idx];
      if (!lm) return new THREE.Vector3(0, 0, 0);
      const rawX = isMirrored ? (1.0 - lm.x) : lm.x;
      return new THREE.Vector3(
        (rawX - 0.5) * renderW,
        (0.5 - lm.y) * renderH,
        -(lm.z || 0) * depthScale
      );
    };

    // 1. Key Bone-Anchored Landmarks (Rigid Skull)
    const pEyeL = get3D(133);       // Left inner canthus
    const pEyeR = get3D(362);       // Right inner canthus
    const pForehead = get3D(10);     // Superior cranial midline
    const pSellion = get3D(168);     // Nasal root / glabella

    // 2. Rigid Skull Orthonormal Basis
    const ux = new THREE.Vector3().subVectors(pEyeR, pEyeL);
    const eyeDist = ux.length() || 1.0;
    ux.normalize();

    // Up vector orthogonalized against ux (Gram-Schmidt)
    const vUp = new THREE.Vector3().subVectors(pForehead, pSellion);
    const dotUp = vUp.dot(ux);
    const uy = vUp.sub(ux.clone().multiplyScalar(dotUp)).normalize();

    // Forward vector uz pointing towards camera (+Z)
    const uz = new THREE.Vector3().crossVectors(ux, uy).normalize();

    // 3. 3D Rotation Quaternion
    const rotMatrix = new THREE.Matrix4().makeBasis(ux, uy, uz);
    this.targetQuat.setFromRotationMatrix(rotMatrix);

    // 4. 3D Eye Center Position
    this.targetPos.addVectors(pEyeL, pEyeR).multiplyScalar(0.5);

    // 5. Model Scale: LeePerrySmith inter-eye distance is 2.222
    const baseModelEyeDist = 2.222;
    this.targetScale = eyeDist / baseModelEyeDist;

    // Temporal smoothing (removes micro-jitter while tracking swiftly)
    if (!this.hasInitialPose) {
      this.currentPos.copy(this.targetPos);
      this.currentQuat.copy(this.targetQuat);
      this.currentScale = this.targetScale;
      this.hasInitialPose = true;
    } else {
      this.currentPos.lerp(this.targetPos, 0.45);
      this.currentQuat.slerp(this.targetQuat, 0.45);
      this.currentScale += (this.targetScale - this.currentScale) * 0.45;
    }

    // Apply 6-DoF transform to root group
    this.rootGroup.position.copy(this.currentPos);
    this.rootGroup.quaternion.copy(this.currentQuat);
    this.rootGroup.scale.setScalar(this.currentScale);
  }

  dispose() {
    if (this.rootGroup && this.rootGroup.parent) {
      this.rootGroup.parent.remove(this.rootGroup);
    }
    if (this.bustMesh && this.bustMesh.geometry) {
      this.bustMesh.geometry.dispose();
    }
    if (this.faceMesh && this.faceMesh.geometry) {
      this.faceMesh.geometry.dispose();
    }
    if (this.bustMaterial) this.bustMaterial.dispose();
    if (this.faceMaterial) this.faceMaterial.dispose();
    if (this.textureMaterial) this.textureMaterial.dispose();
  }
}
