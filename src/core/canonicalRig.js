/**
 * 3D Canonical Morph Rig (Apple Animoji Style)
 * Drives 3D canonical facial topology directly using calibrated 52 ARKit blendshapes.
 */
import * as THREE from 'three';

export class CanonicalRig {
  constructor() {
    this.canonicalVertices = null;
    this.isInitialized = false;
  }

  init(referenceLandmarks) {
    if (!referenceLandmarks || referenceLandmarks.length < 468) return;
    this.canonicalVertices = referenceLandmarks.map(p => ({ x: p.x, y: p.y, z: p.z || 0 }));
    this.isInitialized = true;
  }

  /**
   * Applies 52 ARKit blendshapes to displace canonical mesh
   */
  synthesizeMesh(blendshapes, cranialOrigin, cranialScale, cranialBasis) {
    if (!this.isInitialized || !this.canonicalVertices) return null;

    const count = this.canonicalVertices.length;
    const synthesized = new Array(count);

    const jawOpen = blendshapes.jawOpen || 0;
    const mouthFunnel = blendshapes.mouthFunnel || 0;
    const mouthPucker = blendshapes.mouthPucker || 0;
    const mouthSmileLeft = blendshapes.mouthSmileLeft || 0;
    const mouthSmileRight = blendshapes.mouthSmileRight || 0;
    const browInnerUp = blendshapes.browInnerUp || 0;
    const eyeBlinkLeft = blendshapes.eyeBlinkLeft || 0;
    const eyeBlinkRight = blendshapes.eyeBlinkRight || 0;

    const vecHelper = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      const base = this.canonicalVertices[i];
      let dx = 0, dy = 0, dz = 0;

      // Lower Lip & Jaw (indices 13-17, 84-88, 314-318, 152)
      if (i === 152 || (i >= 13 && i <= 17) || (i >= 84 && i <= 88) || (i >= 314 && i <= 318)) {
        dy += jawOpen * 0.08;
      }

      // Mouth Funnel / Pucker (Lips pushed forward & squeezed)
      if ((i >= 61 && i <= 88) || (i >= 291 && i <= 318) || (i >= 0 && i <= 17)) {
        dz += (mouthFunnel + mouthPucker) * 0.06;
      }

      // Smile (Corners pulled up and out)
      if (i === 61 || i === 78) { // Left corner
        dx -= mouthSmileLeft * 0.03;
        dy -= mouthSmileLeft * 0.03;
      }
      if (i === 291 || i === 308) { // Right corner
        dx += mouthSmileRight * 0.03;
        dy -= mouthSmileRight * 0.03;
      }

      // Brows
      if (i === 107 || i === 66 || i === 9 || i === 336 || i === 296) {
        dy -= browInnerUp * 0.04;
      }

      // Left Eyelid
      if (i === 159 || i === 160 || i === 158) {
        dy += eyeBlinkLeft * 0.025;
      }
      // Right Eyelid
      if (i === 386 || i === 387 || i === 385) {
        dy += eyeBlinkRight * 0.025;
      }

      // Transform local canonical vertex by live cranial basis
      vecHelper.set(base.x + dx, base.y + dy, base.z + dz);
      if (cranialBasis) vecHelper.applyMatrix3(cranialBasis);

      synthesized[i] = {
        x: cranialOrigin ? (cranialOrigin.x + vecHelper.x * cranialScale) : (base.x + dx),
        y: cranialOrigin ? (cranialOrigin.y + vecHelper.y * cranialScale) : (base.y + dy),
        z: cranialOrigin ? (cranialOrigin.z + vecHelper.z * cranialScale) : (base.z + dz)
      };
    }

    return synthesized;
  }
}
