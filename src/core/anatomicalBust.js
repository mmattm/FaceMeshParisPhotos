/**
 * Anatomical 3D Bust, Cranium & Ears Engine
 * 
 * Generates an anatomically continuous 3D cranium (hair & skull vault),
 * realistic 3D ears, cervical neck column, and classical sculptural bust (shoulders & chest).
 * 
 * Constructed as a seamless, manifold concentric ring mesh anchored 100% to the
 * 36 boundary landmarks of the MediaPipe face oval (zero seams, zero chimneys, zero holes).
 * 
 * Textured directly from the live webcam stream (sampling hair, ears, neck, and clothes),
 * and dynamically deformed in 3D perspective with 6-DoF head pose and 3D camera angles.
 */

import * as THREE from 'three';

export class AnatomicalBust {
  constructor(scene, videoTexture = null) {
    this.scene = scene;
    this.videoTexture = videoTexture;
    this.visible = true;

    // Sequential 36 landmarks forming the closed MediaPipe FACE_OVAL contour
    this.faceOval = [
      10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 
      152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109
    ];

    this.numCols = 36;
    this.numRings = 5; // Ring 0 (face boundary) to Ring 5 (outer cranium & bust pedestal)
    this.totalVerts = (this.numRings + 1) * this.numCols; // 216 vertices

    this.bustGroup = new THREE.Group();
    this.bustGroup.renderOrder = 3; // Renders right behind front mask (10) for seamless layering
    this.scene.add(this.bustGroup);

    this.setupMaterials();
    this.setupGeometry();
  }

  setupMaterials() {
    // Live Webcam Video Texture Material with studio lighting
    this.textureMaterial = new THREE.MeshStandardMaterial({
      map: this.videoTexture || null,
      color: 0xffffff,
      roughness: 0.80,
      metalness: 0.0,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: true,
      polygonOffset: true,
      polygonOffsetFactor: 1.0,
      polygonOffsetUnits: 1.0
    });

    // Satin porcelain / plaster mannequin material (fallback matching mask)
    this.maskMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf5f5f7,
      roughness: 0.38,
      metalness: 0.02,
      clearcoat: 0.20,
      clearcoatRoughness: 0.35,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: true,
      polygonOffset: true,
      polygonOffsetFactor: 1.0,
      polygonOffsetUnits: 1.0
    });
  }

  setVideoTexture(texture) {
    this.videoTexture = texture;
    if (this.textureMaterial) {
      this.textureMaterial.map = texture;
      this.textureMaterial.needsUpdate = true;
    }
  }

  setupGeometry() {
    this.positions = new Float32Array(this.totalVerts * 3);
    this.uvs = new Float32Array(this.totalVerts * 2);

    const indices = [];
    for (let r = 0; r < this.numRings; r++) {
      for (let c = 0; c < this.numCols; c++) {
        const nextC = (c + 1) % this.numCols;
        const i0 = r * this.numCols + c;
        const i1 = (r + 1) * this.numCols + c;
        const i2 = (r + 1) * this.numCols + nextC;
        const i3 = r * this.numCols + nextC;

        // Quad split into two oriented triangles
        indices.push(i0, i1, i2);
        indices.push(i0, i2, i3);
      }
    }

    this.geometry = new THREE.BufferGeometry();
    this.posAttr = new THREE.BufferAttribute(this.positions, 3);
    this.posAttr.setUsage(THREE.DynamicDrawUsage);
    this.uvAttr = new THREE.BufferAttribute(this.uvs, 2);
    this.uvAttr.setUsage(THREE.DynamicDrawUsage);

    this.geometry.setAttribute('position', this.posAttr);
    this.geometry.setAttribute('uv', this.uvAttr);
    this.geometry.setIndex(indices);

    this.mesh = new THREE.Mesh(this.geometry, this.textureMaterial);
    this.mesh.renderOrder = 3;
    this.bustGroup.add(this.mesh);
  }

  setVisible(visible) {
    this.visible = visible;
    this.bustGroup.visible = visible;
  }

  /**
   * Update Cranium, Ears, Neck, and Bust in real time
   * Synchronized with 3D facial tracking, 6-DoF head pose, and live webcam texture
   */
  update(landmarks, renderW, renderH, depthScale, isMirrored, isTextureMode = true) {
    if (!this.visible || !landmarks || landmarks.length < 468) {
      return;
    }

    // Always prioritize the live webcam texture for the cranium and bust
    const activeMaterial = (this.videoTexture) ? this.textureMaterial : this.maskMaterial;
    if (this.mesh.material !== activeMaterial) {
      this.mesh.material = activeMaterial;
    }

    // Helper: convert landmark index to 3D world space
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

    // 1. Key Anatomical Anchor Points in 3D
    const pForehead = get3D(10);
    const pChin = get3D(152);
    const pSellion = get3D(168);
    const pTragusL = get3D(234);
    const pTragusR = get3D(454);
    const pEyeL = get3D(133);
    const pEyeR = get3D(362);

    // 2. Rigid Skull Frame & Orthonormal Basis
    const ux = new THREE.Vector3().subVectors(pEyeR, pEyeL);
    const eyeDist = ux.length() || 1.0;
    ux.normalize();

    const vUp = new THREE.Vector3().subVectors(pForehead, pSellion);
    const dotUp = vUp.dot(ux);
    const uy = vUp.sub(ux.clone().multiplyScalar(dotUp)).normalize();

    const uz = new THREE.Vector3().crossVectors(ux, uy).normalize();

    // Dimensions
    const headWidth = pTragusL.distanceTo(pTragusR) || (eyeDist * 2.1);
    const headHeight = pChin.distanceTo(pForehead) || (eyeDist * 2.4);
    const cranialDepth = headWidth * 0.95;

    // Face Center
    const faceCenter = new THREE.Vector3().addVectors(pForehead, pChin).multiplyScalar(0.5);

    // 3. Extract the 36 Boundary Points of the Face Oval (Ring 0)
    const basePoints = new Array(this.numCols);
    const baseVecs = new Array(this.numCols);

    for (let c = 0; c < this.numCols; c++) {
      const pt = get3D(this.faceOval[c]);
      basePoints[c] = pt;

      const vec = new THREE.Vector3().subVectors(pt, faceCenter);
      baseVecs[c] = {
        x: vec.dot(ux),
        y: vec.dot(uy),
        z: vec.dot(uz)
      };
    }

    // Helper to write vertex and UV
    const setVert = (vIdx, worldPos) => {
      this.positions[vIdx * 3] = worldPos.x;
      this.positions[vIdx * 3 + 1] = worldPos.y;
      this.positions[vIdx * 3 + 2] = worldPos.z;

      // Project onto live video texture coordinates
      let rawX = (worldPos.x / renderW) + 0.5;
      if (isMirrored) rawX = 1.0 - rawX;
      let rawY = 0.5 - (worldPos.y / renderH);

      // Clamp UV coordinates safely to valid video bounds
      rawX = Math.max(0.01, Math.min(0.99, rawX));
      rawY = Math.max(0.01, Math.min(0.99, rawY));

      this.uvs[vIdx * 2] = rawX;
      this.uvs[vIdx * 2 + 1] = 1.0 - rawY;
    };

    // 4. Generate Concentric Rings: Ring 0 (face rim) to Ring 5 (cranial dome & bust pedestal)
    for (let r = 0; r <= this.numRings; r++) {
      if (r === 0) {
        // Ring 0: Exact seamless attachment to the 36 face oval points
        for (let c = 0; c < this.numCols; c++) {
          const vIdx = r * this.numCols + c;
          setVert(vIdx, basePoints[c]);
        }
        continue;
      }

      const t = r / this.numRings; // 0.2 to 1.0

      for (let c = 0; c < this.numCols; c++) {
        const vIdx = r * this.numCols + c;
        const bPt = basePoints[c];
        const bVec = baseVecs[c];

        let offsetRight = 0;
        let offsetUp = 0;
        let offsetForward = 0;

        // Sector classification:
        // c = 0: Forehead apex (10)
        // c = 8: Right ear (454)
        // c = 18: Chin apex (152)
        // c = 28: Left ear (234)
        if (c > 8 && c < 28) {
          // =========================================================
          // SECTOR: NECK & SHOULDERS / BUST (Jawline & Chin to Chest)
          // =========================================================
          const distFromChin = Math.abs(c - 18);
          const jawFrac = distFromChin / 9.0; // 0 at chin, 1 at jaw angle/ears

          if (t <= 0.40) {
            // Upper neck & submental curve under the jaw
            const tNeck = t / 0.40;
            offsetUp = -headHeight * (0.24 * tNeck);
            offsetForward = -cranialDepth * (0.28 * tNeck);
            offsetRight = bVec.x * (0.92 - 0.08 * tNeck) - bVec.x;
          } else {
            // Clavicles, Trapezius, Broad Shoulders & Pedestal (t > 0.40)
            const tBust = (t - 0.40) / 0.60;
            // Downward slope
            offsetUp = -headHeight * (0.24 + tBust * 0.95);
            // Chest depth (slight forward chest curve, deeper back curve)
            offsetForward = -cranialDepth * (0.28 + 0.18 * (1.0 - Math.cos(jawFrac * Math.PI)));
            // Lateral shoulder expansion (widens out to full anatomical shoulders)
            const shoulderExpand = 1.0 + tBust * 1.65;
            offsetRight = bVec.x * shoulderExpand - bVec.x;
          }

        } else if ((c >= 7 && c <= 9) || (c >= 27 && c <= 29)) {
          // =========================================================
          // SECTOR: EARS (Left & Right Anatomical 3D Ear Protrusions)
          // =========================================================
          const isRightSide = (c <= 18);
          const sideSign = isRightSide ? 1.0 : -1.0;
          // Ears curve outward laterally and slightly backward
          const earOutward = headWidth * 0.16 * Math.sin(t * Math.PI * 0.85);
          const earBackward = -cranialDepth * 0.16 * t;

          offsetRight = sideSign * earOutward;
          offsetForward = earBackward;
          offsetUp = -headHeight * 0.04 * t;

        } else {
          // =========================================================
          // SECTOR: CRANIUM & HAIR (Forehead Vault, Crown, Occiput)
          // =========================================================
          const distFromMidline = (c <= 7) ? c : (36 - c);
          const latFrac = distFromMidline / 7.0; // 0 at forehead apex, 1 at temples

          // Smooth dome arch over the skull vault:
          // Crown rises smoothly above forehead, curves over top, and slopes back
          const archSin = Math.sin(t * Math.PI * 0.65);
          const archCos = Math.cos(t * Math.PI * 0.60);

          offsetUp = headHeight * 0.22 * (1.0 - latFrac * 0.35) * archSin;
          offsetForward = -cranialDepth * 0.90 * (1.0 - archCos);
          offsetRight = bVec.x * (1.0 + t * 0.12) - bVec.x;
        }

        // Apply 3D anatomical displacement
        const worldPos = bPt.clone()
          .add(ux.clone().multiplyScalar(offsetRight))
          .add(uy.clone().multiplyScalar(offsetUp))
          .add(uz.clone().multiplyScalar(offsetForward));

        setVert(vIdx, worldPos);
      }
    }

    this.posAttr.needsUpdate = true;
    this.uvAttr.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }

  dispose() {
    if (this.geometry) this.geometry.dispose();
    if (this.textureMaterial) this.textureMaterial.dispose();
    if (this.maskMaterial) this.maskMaterial.dispose();
    if (this.bustGroup) this.scene.remove(this.bustGroup);
  }
}
