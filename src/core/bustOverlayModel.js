import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const MODEL_URLS = {
  female: '/models/female.obj',
  male_facemesh_zone_creusee: '/models/male_facemesh_zone_creusee.obj'
};

/**
 * Optional sculptural head/neck layer fitted behind the live photo-textured mask.
 * The dynamic FaceMesh remains the visible face; the OBJ supplies the cranium,
 * ears, neck and shoulders with a neutral 3D material.
 */
export class BustOverlayModel {
  constructor(scene) {
    this.scene = scene;
    this.enabled = false;
    this.selectedModel = 'male_facemesh_zone_creusee';
    this.models = new Map();
    this.loading = new Map();

    this.root = new THREE.Group();
    this.root.name = 'OptionalBustOverlay';
    this.root.visible = false;
    this.root.renderOrder = 2;
    this.scene.add(this.root);

    this.material = new THREE.MeshPhysicalMaterial({
      color: 0xd8d5d0,
      roughness: 0.58,
      metalness: 0.0,
      clearcoat: 0.08,
      clearcoatRoughness: 0.65,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 2
    });

    this.currentPosition = new THREE.Vector3();
    this.targetPosition = new THREE.Vector3();
    this.currentQuaternion = new THREE.Quaternion();
    this.targetQuaternion = new THREE.Quaternion();
    this.currentScale = 1;
    this.targetScale = 1;
    this.hasPose = false;
  }

  setEnabled(enabled) {
    this.enabled = !!enabled;
    if (this.enabled) this.ensureLoaded(this.selectedModel);
    this.updateVisibility();
  }

  setModel(modelName) {
    if (!MODEL_URLS[modelName]) return;
    this.selectedModel = modelName;
    this.hasPose = false;
    if (this.enabled) this.ensureLoaded(modelName);
    this.updateVisibility();
  }

  ensureLoaded(modelName) {
    if (this.models.has(modelName) || this.loading.has(modelName)) return;

    const loader = new OBJLoader();
    const promise = new Promise((resolve, reject) => {
      loader.load(MODEL_URLS[modelName], resolve, undefined, reject);
    });
    this.loading.set(modelName, promise);

    promise.then(object => {
      this.prepareModel(object, modelName);
      this.loading.delete(modelName);
      this.models.set(modelName, object);
      this.root.add(object);
      this.updateVisibility();
      console.log(`[BustOverlay] Modèle ${modelName} chargé.`);
    }).catch(error => {
      this.loading.delete(modelName);
      console.error(`[BustOverlay] Impossible de charger ${MODEL_URLS[modelName]}:`, error);
    });
  }

  prepareModel(object, modelName) {
    const bounds = new THREE.Box3().setFromObject(object);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());

    // The supplied ZBrush heads share the same topology. Their eye line sits
    // around 74% of the vertical bounds and slightly behind the nose tip.
    const eyeAnchor = new THREE.Vector3(
      center.x,
      bounds.min.y + size.y * 0.74,
      bounds.max.z - size.z * 0.17
    );
    object.position.sub(eyeAnchor);
    object.name = `BustOverlay_${modelName}`;
    object.userData.referenceFaceHeight = Math.max(0.001, size.y * 0.56);
    object.userData.referenceFaceWidth = Math.max(0.001, size.x * 0.68);

    object.traverse(child => {
      if (!child.isMesh) return;
      child.material = this.material;
      child.renderOrder = 2;
      child.frustumCulled = false;
      child.geometry.computeVertexNormals();
    });
  }

  updateVisibility() {
    this.root.visible = this.enabled && this.models.has(this.selectedModel);
    for (const [name, model] of this.models) {
      model.visible = this.enabled && name === this.selectedModel;
    }
  }

  update(landmarks, renderW, renderH, depthScale, mirrored) {
    const model = this.models.get(this.selectedModel);
    if (!this.enabled || !model || !landmarks || landmarks.length < 468) {
      this.updateVisibility();
      return;
    }

    const point = index => {
      const lm = landmarks[index];
      if (!lm) return null;
      const x = mirrored ? 1 - lm.x : lm.x;
      return new THREE.Vector3(
        (x - 0.5) * renderW,
        (0.5 - lm.y) * renderH,
        -(lm.z || 0) * depthScale
      );
    };
    const average = (a, b) => a && b
      ? new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5)
      : (a || b);

    const eyeA = average(point(33), point(133));
    const eyeB = average(point(263), point(362));
    const forehead = point(10);
    const chin = point(152);
    const cheekA = point(234);
    const cheekB = point(454);
    if (!eyeA || !eyeB || !forehead || !chin || !cheekA || !cheekB) return;

    // Always orient local +X toward screen right. The 3D depth retained in the
    // eye vector makes the OBJ follow yaw as well as roll.
    const screenLeftEye = eyeA.x <= eyeB.x ? eyeA : eyeB;
    const screenRightEye = eyeA.x <= eyeB.x ? eyeB : eyeA;
    const axisX = new THREE.Vector3().subVectors(screenRightEye, screenLeftEye).normalize();
    const axisY = new THREE.Vector3().subVectors(forehead, chin);
    axisY.addScaledVector(axisX, -axisY.dot(axisX)).normalize();
    const axisZ = new THREE.Vector3().crossVectors(axisX, axisY).normalize();
    const rotation = new THREE.Matrix4().makeBasis(axisX, axisY, axisZ);
    this.targetQuaternion.setFromRotationMatrix(rotation);

    const faceHeight = forehead.distanceTo(chin);
    const faceWidth = cheekA.distanceTo(cheekB);
    const refHeight = model.userData.referenceFaceHeight;
    const refWidth = model.userData.referenceFaceWidth;
    const heightScale = faceHeight / refHeight;
    const widthScale = faceWidth / refWidth;
    // Slightly oversized sculptural support so the photo mask sits inside the
    // cranium instead of visually exceeding its silhouette.
    this.targetScale = (heightScale * 0.68 + widthScale * 0.32) * 1.10;

    const eyeCenter = new THREE.Vector3().addVectors(eyeA, eyeB).multiplyScalar(0.5);
    const eyeDistance = eyeA.distanceTo(eyeB);
    // Recess the solid OBJ slightly so the feathered photo mask sits cleanly
    // in front of the sculpted face without depth overlap or z-fighting.
    this.targetPosition.copy(eyeCenter)
      .addScaledVector(axisZ, -eyeDistance * 0.44)
      // Lower the bust slightly to align its eye sockets with the photo mask.
      .addScaledVector(axisY, -eyeDistance * 0.05);

    if (!this.hasPose) {
      this.currentPosition.copy(this.targetPosition);
      this.currentQuaternion.copy(this.targetQuaternion);
      this.currentScale = this.targetScale;
      this.hasPose = true;
    } else {
      this.currentPosition.lerp(this.targetPosition, 0.55);
      this.currentQuaternion.slerp(this.targetQuaternion, 0.55);
      this.currentScale += (this.targetScale - this.currentScale) * 0.55;
    }

    this.root.position.copy(this.currentPosition);
    this.root.quaternion.copy(this.currentQuaternion);
    this.root.scale.setScalar(this.currentScale);
    this.updateVisibility();
  }

  dispose() {
    this.scene.remove(this.root);
    for (const model of this.models.values()) {
      model.traverse(child => {
        if (child.isMesh) child.geometry.dispose();
      });
    }
    this.material.dispose();
  }
}
