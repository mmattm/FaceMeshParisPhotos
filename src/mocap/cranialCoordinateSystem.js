/**
 * Cranial Coordinate System & Rigid Head Decoupling Engine
 *
 * Decouples 6-DoF rigid head movement (3D position, rotation, scale)
 * from pure non-rigid facial expression deformations.
 *
 * Uses rigid skull anchors (inner eye corners, nasal bone, forehead)
 * and isotropic aspect-ratio-corrected conformal space to ensure
 * perfectly orthonormal 3D bases without shearing or warping.
 */

// Rigid skull landmarks that do NOT move with speech or facial expressions:
// 133: left inner eye corner (canthus)
// 362: right inner eye corner (canthus)
// 168: glabella / sellion (nasal root between eyes)
// 6: upper bridge of nose
// 10: superior forehead midline
// 151: mid forehead
// 33: left outer eye corner
// 263: right outer eye corner
// 1: tip of nose (pronasale - used strictly to confirm forward facing direction)

export class CranialCoordinateSystem {
  constructor() {
    this.aspectRatio = 16 / 9;
  }

  setAspectRatio(ar) {
    if (ar > 0.1 && ar < 10.0) {
      this.aspectRatio = ar;
    }
  }

  /**
   * Convert MediaPipe normalized [0, 1] landmark to isotropic 3D conformal space.
   * Eliminates the anisotropic stretching caused by non-square camera aspect ratios (e.g. 16:9).
   */
  toIsotropic(pt) {
    const ar = this.aspectRatio;
    return {
      x: (pt.x - 0.5) * ar,
      y: pt.y - 0.5,
      z: (pt.z || 0) * ar
    };
  }

  /**
   * Convert isotropic 3D conformal coordinate back to MediaPipe normalized [0, 1] landmark.
   */
  fromIsotropic(pt, visibility = 1.0) {
    const ar = this.aspectRatio;
    return {
      x: pt.x / ar + 0.5,
      y: pt.y + 0.5,
      z: pt.z / ar,
      visibility
    };
  }

  /**
   * Extracts the rigid skull frame from 3D landmarks.
   * Returns:
   *   origin: 3D center between eyes in isotropic space
   *   scale: inter-ocular distance (anatomically constant)
   *   ux, uy, uz: orthonormal 3D unit basis vectors (Right, Up, Forward)
   */
  extractRigidFrame(rawLandmarks) {
    if (!rawLandmarks || rawLandmarks.length < 468) return null;

    // Convert bone-anchored skull landmarks to isotropic conformal space
    // 133: left inner canthus (medial tendon attached to lacrimal crest)
    // 362: right inner canthus (medial tendon attached to lacrimal crest)
    // 168: sellion / nasion (nasal root suture, completely immobile)
    // 10: superior forehead midline (cranial vault midline, does not move with brows)
    const pEyeL = this.toIsotropic(rawLandmarks[133]);
    const pEyeR = this.toIsotropic(rawLandmarks[362]);
    const pForehead = this.toIsotropic(rawLandmarks[10]);
    const pNoseBridge = this.toIsotropic(rawLandmarks[168]);

    // 1. Skull Origin: Centroid of rigid inner eye canthi and nasion
    const origin = {
      x: (pEyeL.x + pEyeR.x) * 0.5,
      y: (pEyeL.y + pEyeR.y) * 0.40 + pNoseBridge.y * 0.20,
      z: (pEyeL.z + pEyeR.z) * 0.5
    };

    // 2. Head Scale: Inter-ocular distance strictly between inner canthi (invariant to smiling)
    const dx = pEyeR.x - pEyeL.x;
    const dy = pEyeR.y - pEyeL.y;
    const dz = pEyeR.z - pEyeL.z;
    const scale = Math.hypot(dx, dy, dz);
    if (scale < 0.001) return null;

    // 3. Right Unit Vector (ux): from left inner canthus to right inner canthus
    const lenUx = scale;
    const ux = { x: dx / lenUx, y: dy / lenUx, z: dz / lenUx };

    // 4. Up Unit Vector (uy): from nasal root (168) towards forehead vault (10)
    const vUpX = pForehead.x - pNoseBridge.x;
    const vUpY = pForehead.y - pNoseBridge.y;
    const vUpZ = pForehead.z - pNoseBridge.z;

    // Gram-Schmidt orthogonalization against ux: vUp - (vUp . ux) * ux
    const dotUpX = vUpX * ux.x + vUpY * ux.y + vUpZ * ux.z;
    let uyX = vUpX - dotUpX * ux.x;
    let uyY = vUpY - dotUpX * ux.y;
    let uyZ = vUpZ - dotUpX * ux.z;
    const lenUy = Math.hypot(uyX, uyY, uyZ) || 1.0;
    let uy = { x: uyX / lenUy, y: uyY / lenUy, z: uyZ / lenUy };

    // 5. Forward Unit Vector (uz): Deterministic cross product ux x uy
    // Strictly invariant, continuous, and points towards camera (-Z)
    let uz = {
      x: ux.y * uy.z - ux.z * uy.y,
      y: ux.z * uy.x - ux.x * uy.z,
      z: ux.x * uy.y - ux.y * uy.x
    };
    const lenUz = Math.hypot(uz.x, uz.y, uz.z) || 1.0;
    uz = { x: uz.x / lenUz, y: uz.y / lenUz, z: uz.z / lenUz };

    // 6. Guarantee frame-to-frame temporal orientation continuity
    if (this.lastRigidFrame) {
      const prev = this.lastRigidFrame;
      if (ux.x * prev.ux.x + ux.y * prev.ux.y + ux.z * prev.ux.z < 0) {
        ux.x = -ux.x; ux.y = -ux.y; ux.z = -ux.z;
      }
      if (uy.x * prev.uy.x + uy.y * prev.uy.y + uy.z * prev.uy.z < 0) {
        uy.x = -uy.x; uy.y = -uy.y; uy.z = -uy.z;
      }
      if (uz.x * prev.uz.x + uz.y * prev.uz.y + uz.z * prev.uz.z < 0) {
        uz.x = -uz.x; uz.y = -uz.y; uz.z = -uz.z;
      }
    }

    return {
      origin,
      scale,
      ux,
      uy,
      uz
    };
  }

  /**
   * Smooths the rigid frame over time using adaptive dual-rate low-pass filtering.
   * Rock-solid when head is stationary, instantly responsive during rapid head rotation.
   */
  smoothRigidFrame(rawFrame, enabled = true) {
    if (!rawFrame) return null;
    if (!enabled) {
      this.lastRigidFrame = {
        origin: { ...rawFrame.origin },
        scale: rawFrame.scale,
        ux: { ...rawFrame.ux },
        uy: { ...rawFrame.uy },
        uz: { ...rawFrame.uz }
      };
      return rawFrame;
    }
    if (!this.lastRigidFrame) {
      this.lastRigidFrame = {
        origin: { ...rawFrame.origin },
        scale: rawFrame.scale,
        ux: { ...rawFrame.ux },
        uy: { ...rawFrame.uy },
        uz: { ...rawFrame.uz }
      };
      return this.lastRigidFrame;
    }

    const last = this.lastRigidFrame;

    // Adaptive alpha for position based on speed (prevents lag while removing jitter)
    const distPos = Math.hypot(
      rawFrame.origin.x - last.origin.x,
      rawFrame.origin.y - last.origin.y,
      rawFrame.origin.z - last.origin.z
    );
    // When still (dist < 0.005), alpha is 0.28 (ultra-smooth); when moving fast, alpha ramps to 0.85
    const alphaPos = Math.max(0.28, Math.min(0.85, 0.28 + distPos * 25.0));

    // 1. Smooth skull origin
    last.origin.x += (rawFrame.origin.x - last.origin.x) * alphaPos;
    last.origin.y += (rawFrame.origin.y - last.origin.y) * alphaPos;
    last.origin.z += (rawFrame.origin.z - last.origin.z) * alphaPos;

    // 2. Smooth scale (high damping since human skull size does not change)
    last.scale += (rawFrame.scale - last.scale) * 0.25;

    // 3. Smooth basis vectors and re-orthonormalize
    const alphaRot = 0.40;
    let uxX = last.ux.x + (rawFrame.ux.x - last.ux.x) * alphaRot;
    let uxY = last.ux.y + (rawFrame.ux.y - last.ux.y) * alphaRot;
    let uxZ = last.ux.z + (rawFrame.ux.z - last.ux.z) * alphaRot;
    const lenUx = Math.hypot(uxX, uxY, uxZ) || 1.0;
    last.ux = { x: uxX / lenUx, y: uxY / lenUx, z: uxZ / lenUx };

    let uyX = last.uy.x + (rawFrame.uy.x - last.uy.x) * alphaRot;
    let uyY = last.uy.y + (rawFrame.uy.y - last.uy.y) * alphaRot;
    let uyZ = last.uy.z + (rawFrame.uy.z - last.uy.z) * alphaRot;

    // Gram-Schmidt against ux
    const dot = uyX * last.ux.x + uyY * last.ux.y + uyZ * last.ux.z;
    uyX -= dot * last.ux.x;
    uyY -= dot * last.ux.y;
    uyZ -= dot * last.ux.z;
    const lenUy = Math.hypot(uyX, uyY, uyZ) || 1.0;
    last.uy = { x: uyX / lenUy, y: uyY / lenUy, z: uyZ / lenUy };

    // uz = ux x uy
    last.uz = {
      x: last.ux.y * last.uy.z - last.ux.z * last.uy.y,
      y: last.ux.z * last.uy.x - last.ux.x * last.uy.z,
      z: last.ux.x * last.uy.y - last.ux.y * last.uy.x
    };

    return last;
  }

  /**
   * Projects all landmarks into the skull-local coordinate frame.
   * Completely removes head position, head orientation, and camera distance.
   * Result is invariant to head poses.
   */
  toLocalCoordinates(rawLandmarks, rigidFrame) {
    const { origin, scale, ux, uy, uz } = rigidFrame;
    const count = rawLandmarks.length;
    const local = new Array(count);

    for (let i = 0; i < count; i++) {
      const iso = this.toIsotropic(rawLandmarks[i]);
      // Vector relative to skull origin, normalized by inter-ocular scale
      const rx = (iso.x - origin.x) / scale;
      const ry = (iso.y - origin.y) / scale;
      const rz = (iso.z - origin.z) / scale;

      // Project onto orthonormal basis (dot products = R^T * r)
      local[i] = {
        x: rx * ux.x + ry * ux.y + rz * ux.z,
        y: rx * uy.x + ry * uy.y + rz * uy.z,
        z: rx * uz.x + ry * uz.y + rz * uz.z
      };
    }

    return local;
  }

  /**
   * Transforms head-local coordinates back into isotropic world space
   * using a specific target rigid frame (e.g. the live person's head).
   */
  fromLocalCoordinates(localCoords, rigidFrame) {
    const { origin, scale, ux, uy, uz } = rigidFrame;
    const count = localCoords.length;
    const isotropic = new Array(count);

    for (let i = 0; i < count; i++) {
      const loc = localCoords[i];
      if (!loc) continue;

      // Reconstruct: origin + scale * (loc.x * ux + loc.y * uy + loc.z * uz)
      isotropic[i] = {
        x: origin.x + scale * (loc.x * ux.x + loc.y * uy.x + loc.z * uz.x),
        y: origin.y + scale * (loc.x * ux.y + loc.y * uy.y + loc.z * uz.y),
        z: origin.z + scale * (loc.x * ux.z + loc.y * uy.z + loc.z * uz.z)
      };
    }

    return isotropic;
  }
}

/**
 * Anatomical blend weight map across all 478 landmarks.
 * Guarantees smooth, continuous transitions so the mesh never tears or creates angular kinks.
 */
export function buildAnatomicalWeightMap() {
  const weights = new Float32Array(478);
  // Base soft-tissue elasticity across the facial skin to prevent rigid cliffs
  weights.fill(0.25);

  // Rigid skull anchors stay locked to the cranial coordinate frame
  const rigidAnchors = [168, 6, 10, 151, 9, 8, 107, 336];
  rigidAnchors.forEach(idx => { weights[idx] = 0.05; });

  // 1. ALL Mouth & Lip Indices (Inner, Outer, Vermilion): Full expression influence
  const mouthIndices = [
    // Outer & Inner Lips
    0, 11, 12, 13, 14, 15, 16, 17, 37, 38, 39, 40, 41, 61, 72, 73, 74, 76, 77, 78, 80, 81, 82, 84, 85, 86, 87, 88,
    91, 95, 146, 178, 179, 180, 181, 185, 191, 267, 268, 269, 270, 271, 291, 302, 303, 304, 306, 307, 308, 310,
    311, 312, 314, 315, 316, 317, 318, 321, 324, 375, 402, 403, 404, 405, 409, 415,
    // Philtrum & Cupids Bow
    164, 165, 167, 2, 94
  ];
  mouthIndices.forEach(idx => { if (idx < 478) weights[idx] = 1.0; });

  // 2. Nose Deformations (Nostrils, Alae, Columella, Nasal Walls & Sneer)
  const nostrilAlae = [48, 64, 98, 278, 294, 327, 49, 279, 102, 331, 218, 438, 79, 309, 238, 458];
  nostrilAlae.forEach(idx => { if (idx < 478) weights[idx] = Math.max(weights[idx], 0.85); });

  const noseTipColumella = [1, 4, 5, 195, 197, 240, 460];
  noseTipColumella.forEach(idx => { if (idx < 478) weights[idx] = Math.max(weights[idx], 0.75); });

  const nasalWalls = [97, 326, 198, 420, 236, 456];
  nasalWalls.forEach(idx => { if (idx < 478) weights[idx] = Math.max(weights[idx], 0.55); });

  // 3. Cheeks, Zygomaticus & Malar Region (Full Smile & Cheek Puff / Squint)
  // Upper malar & infraorbital fat pad
  const upperCheeks = [
    116, 117, 118, 119, 120, 121, 123, 147, 187, 192, 207, 213, 216,
    345, 346, 347, 348, 349, 350, 352, 376, 411, 416, 427, 433, 436
  ];
  upperCheeks.forEach(idx => { if (idx < 478) weights[idx] = Math.max(weights[idx], 0.80); });

  // Mid cheeks & Buccinator region
  const midCheeks = [
    50, 101, 111, 126, 142, 203, 205, 206, 212, 214,
    280, 330, 340, 355, 371, 423, 425, 426, 432, 434
  ];
  midCheeks.forEach(idx => { if (idx < 478) weights[idx] = Math.max(weights[idx], 0.65); });

  // Lower cheeks & Modiolus (Corners of mouth)
  const lowerCheeks = [57, 62, 186, 287, 292, 410];
  lowerCheeks.forEach(idx => { if (idx < 478) weights[idx] = Math.max(weights[idx], 0.80); });

  // Lateral cheeks falloff
  const lateralCheeks = [36, 138, 177, 215, 227, 234, 266, 367, 401, 435, 447, 454];
  lateralCheeks.forEach(idx => { if (idx < 478) weights[idx] = Math.max(weights[idx], 0.35); });

  // 4. Continuous Symmetrical Jawline Falloff (along MediaPipe FACE_OVAL)
  const jawlineWeights = [
    { indices: [152], w: 0.90 },       // Chin center
    { indices: [377, 148], w: 0.80 },  // Jaw step 1
    { indices: [400, 176], w: 0.65 },  // Jaw step 2
    { indices: [378, 149], w: 0.50 },  // Jaw step 3
    { indices: [379, 150], w: 0.35 },  // Jaw step 4
    { indices: [365, 136], w: 0.20 },  // Jaw step 5
    { indices: [397, 172], w: 0.08 },  // Jaw step 6
    { indices: [288, 58], w: 0.02 }    // Near angle of jaw
  ];
  jawlineWeights.forEach(({ indices, w }) => {
    indices.forEach(idx => { if (idx < 478) weights[idx] = Math.max(weights[idx], w); });
  });

  // 5. Lower Chin Cavity & Submental Area
  const submental = [175, 199, 200, 18, 19, 396, 171];
  submental.forEach(idx => { if (idx < 478) weights[idx] = Math.max(weights[idx], 0.80); });

  // 6. Eyebrows & Forehead Arches
  const browIndices = [70, 63, 105, 66, 107, 55, 65, 52, 53, 46, 300, 293, 334, 296, 336, 285, 295, 282, 283, 276];
  browIndices.forEach(idx => { if (idx < 478) weights[idx] = Math.max(weights[idx], 0.95); });

  // Glabella & Corrugator (Brow furrow between eyes)
  const glabella = [9, 8, 168];
  glabella.forEach(idx => { if (idx < 478) weights[idx] = Math.max(weights[idx], 0.65); });

  // Forehead supraorbital arches
  const foreheadArches = [67, 109, 108, 68, 69, 104, 103, 297, 337, 338, 298, 299, 333, 332];
  foreheadArches.forEach(idx => { if (idx < 478) weights[idx] = Math.max(weights[idx], 0.60); });

  // 7. Eyelids & Eyes (Blinks, squints, gaze)
  const eyeIndices = [
    33, 160, 158, 133, 153, 144, 362, 385, 387, 263, 373, 380, 159, 145, 386, 374,
    468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 246, 161, 157, 173, 466, 388, 384, 398
  ];
  eyeIndices.forEach(idx => { if (idx < 478) weights[idx] = Math.max(weights[idx], 0.92); });

  return weights;
}

// MediaPipe 468/478 Oral Anatomy Topology
export const UPPER_INNER_LIP_INDICES = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308];
export const LOWER_INNER_LIP_INDICES = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308];

export const UPPER_OUTER_LIP_INDICES = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
export const LOWER_OUTER_LIP_INDICES = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

// Matching inner vermilion contact pairs: [upperIdx, lowerIdx]
export const INNER_LIP_PAIRS = [
  [13, 14],   // Center stomion (Cupid's bow center vs lower central vermilion)
  [82, 87],   // Right mid-center
  [81, 178],  // Right mid
  [80, 88],   // Right lateral
  [191, 95],  // Right pre-commissure
  [312, 317], // Left mid-center
  [311, 402], // Left mid
  [310, 318], // Left lateral
  [415, 324]  // Left pre-commissure
];

// Mandibular articulatory indices that rotate/translate when the jaw drops
export const MANDIBULAR_JAW_INDICES = [
  152, 377, 148, 400, 176, 378, 149, 379, 150, 365, 136, 175, 171, 396, 199, 200, 18, 19
];

/**
 * Anatomical Lip Contact & Bilabial Collision Solver
 * Enforces physiological non-penetration between upper and lower lips in skull-local space.
 * Prevents mesh inversion, z-fighting, and tearing during speech and resting mouth postures.
 */
export function resolveLipContact(localCoords) {
  if (!localCoords || localCoords.length < 468) return localCoords;

  const MIN_GAP = 0.0004;

  for (let i = 0; i < INNER_LIP_PAIRS.length; i++) {
    const [uIdx, lIdx] = INNER_LIP_PAIRS[i];
    const uPt = localCoords[uIdx];
    const lPt = localCoords[lIdx];
    if (!uPt || !lPt) continue;

    // In local cranial coordinate space, uy points upwards towards forehead vault.
    // Therefore uPt.y (upper lip) must naturally remain above lPt.y (lower lip).
    if (lPt.y > uPt.y - MIN_GAP) {
      const midY = (uPt.y + lPt.y) * 0.5;
      uPt.y = midY + MIN_GAP * 0.5;
      lPt.y = midY - MIN_GAP * 0.5;

      // Enforce dental arch depth alignment: lower lip sits naturally flush or slightly recessed (-Z)
      if (lPt.z > uPt.z - 0.0008) {
        lPt.z = uPt.z - 0.0008;
      }
    }
  }

  return localCoords;
}
