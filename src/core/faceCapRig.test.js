import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { applyFaceExpressions, blendshapesMap, poseFromLandmarks, correctFacePitch, zoomFacePose, limitFaceRotation, FACE_PIVOT } from './faceCapRig.js';
import { buildPhotoBinding, updatePhotoUvs } from './facePhotoUv.js';

test('Face Cap retargets asymmetric expressions, clamps scores and clears missing channels', () => {
  const face = { morphTargetDictionary: { jawOpen: 0, mouthSmile_L: 1, mouthSmile_R: 2, tongueOut: 3 },
    morphTargetInfluences: [0, 0, 0, 1] };
  const left = new THREE.Object3D(), right = new THREE.Object3D();
  applyFaceExpressions(face, left, right, { jawOpen: 0.7, mouthSmileLeft: 2, mouthSmileRight: -1,
    eyeLookInLeft: 0.5, eyeLookDownRight: 0.5 });
  assert.deepEqual(face.morphTargetInfluences, [0.7, 1, 0, 0]);
  assert.equal(left.rotation.z, Math.PI / 12);
  assert.equal(right.rotation.x, Math.PI / 12);
  applyFaceExpressions(face, left, right);
  assert.deepEqual(face.morphTargetInfluences, [0, 0, 0, 0]);
  assert.equal(left.rotation.z, 0);
  assert.equal(Object.keys(blendshapesMap).length, 51);
});

test('global expression intensity amplifies and neutralizes expressions while preserving gaze and raw scores', () => {
  const face = { morphTargetDictionary: { jawOpen: 0, mouthSmile_L: 1, browInnerUp: 2,
    eyeBlink_L: 3, eyeLookIn_L: 4, mouthUpperUp_L: 5 }, morphTargetInfluences: Array(6).fill(0) };
  const left = new THREE.Object3D(), right = new THREE.Object3D();
  const scores = { jawOpen: .3, mouthSmileLeft: .6, browInnerUp: .2, eyeBlinkLeft: .2,
    eyeLookInLeft: .5, mouthUpperUpLeft: 0 };
  const original = { ...scores };
  applyFaceExpressions(face, left, right, scores, 2);
  assert.deepEqual(face.morphTargetInfluences, [.6, 1, .4, .2, .5, 0]);
  assert.equal(left.rotation.z, Math.PI / 12);
  applyFaceExpressions(face, left, right, scores, 0);
  assert.deepEqual(face.morphTargetInfluences, [0, 0, 0, .2, .5, 0]);
  assert.equal(left.rotation.z, Math.PI / 12);
  assert.deepEqual(scores, original);
  applyFaceExpressions(face, left, right, scores, 1);
  assert.deepEqual(face.morphTargetInfluences, [.3, .6, .2, .2, .5, 0]);
});

test('intensity never adds eye closure or cancels blinks while eye widening can be exaggerated', () => {
  const channels = ['eyeBlink_L', 'eyeBlink_R', 'eyeSquint_L', 'eyeSquint_R',
    'cheekSquint_L', 'cheekSquint_R', 'eyeWide_L', 'eyeWide_R'];
  const face = { morphTargetDictionary: Object.fromEntries(channels.map((name, index) => [name, index])),
    morphTargetInfluences: Array(channels.length).fill(0) };
  const left = new THREE.Object3D(), right = new THREE.Object3D();
  const scores = { eyeBlinkLeft: .15, eyeBlinkRight: .2, eyeSquintLeft: .4, eyeSquintRight: .2,
    cheekSquintLeft: .3, cheekSquintRight: .5, eyeWideLeft: .2, eyeWideRight: .1 };
  for (const intensity of [0, .5, 1, 2, 3]) {
    applyFaceExpressions(face, left, right, scores, intensity);
    assert.deepEqual(face.morphTargetInfluences.slice(0, 6), [.15, .2, .4, .2, .3, .5]);
    assert.ok(Math.abs(face.morphTargetInfluences[6] - .2 * intensity * 1.1 * .85) < 1e-10);
    assert.ok(Math.abs(face.morphTargetInfluences[7] - .1 * intensity * 1.1 * .8) < 1e-10);
    applyFaceExpressions(face, left, right, { eyeBlinkLeft: 1, eyeBlinkRight: 1 }, intensity);
    assert.deepEqual(face.morphTargetInfluences, [1, 1, 0, 0, 0, 0, 0, 0]);
  }
});

test('tracked blinks reach complete closure despite a submaximal score and amplified opening', () => {
  const face = { morphTargetDictionary: { eyeBlink_L: 0, eyeBlink_R: 1, eyeWide_L: 2, eyeWide_R: 3,
    eyeLookUp_L: 4, eyeLookDown_R: 5 }, morphTargetInfluences: [0, 0, 0, 0, 0, 0] };
  const left = new THREE.Object3D(), right = new THREE.Object3D();
  const scores = { eyeBlinkLeft: .6, eyeBlinkRight: .8, eyeWideLeft: 1, eyeWideRight: 1,
    eyeLookUpLeft: 1, eyeLookDownRight: 1 };
  for (const intensity of [0, 1, 3]) {
    applyFaceExpressions(face, left, right, scores, intensity);
    assert.deepEqual(face.morphTargetInfluences, [1, 1, 0, 0, 0, 0]);
    assert.equal(left.rotation.x, -Math.PI / 6);
    assert.equal(right.rotation.x, Math.PI / 6);
  }
  let previous = 0;
  for (const raw of [0, .1, .2, .25, .3, .4, .5, .6, .8, 1]) {
    applyFaceExpressions(face, left, right, { eyeBlinkLeft: raw }, 1);
    const closed = face.morphTargetInfluences[0];
    assert.ok(closed >= previous && closed <= 1);
    if (raw <= .25) assert.equal(closed, raw, 'resting eyes must not be forced shut');
    previous = closed;
  }
  // Closing one eye must leave the other eye available for its own expression.
  applyFaceExpressions(face, left, right, { eyeBlinkLeft: .65, eyeWideRight: .3 }, 1);
  assert.equal(face.morphTargetInfluences[0], 1);
  assert.equal(face.morphTargetInfluences[1], 0);
  assert.equal(face.morphTargetInfluences[3], .3 * 1.1);
  assert.deepEqual(scores, { eyeBlinkLeft: .6, eyeBlinkRight: .8, eyeWideLeft: 1, eyeWideRight: 1,
    eyeLookUpLeft: 1, eyeLookDownRight: 1 });
});

test('manual vertical correction rotates at the face center without modifying source pose, distance or scale', () => {
  const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(.2, -.5, .1, 'YXZ'));
  const scale = new THREE.Vector3(1.1, .9, 1.2);
  const raw = new THREE.Matrix4().compose(new THREE.Vector3(4, -2, -45), rotation, scale);
  const original = raw.toArray();
  const center = FACE_PIVOT.clone().applyMatrix4(raw);
  for (const degrees of [-30, -12.5, 0, 12.5, 30]) {
    const corrected = correctFacePitch(raw, degrees);
    assert.ok(FACE_PIVOT.clone().applyMatrix4(corrected).distanceTo(center) < 1e-10);
    const expectedRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0),
      THREE.MathUtils.degToRad(degrees)).multiply(rotation);
    const actualRotation = new THREE.Quaternion(), actualScale = new THREE.Vector3();
    corrected.decompose(new THREE.Vector3(), actualRotation, actualScale);
    assert.ok(actualRotation.angleTo(expectedRotation) < 1e-7);
    assert.ok(actualScale.distanceTo(scale) < 1e-10);
    assert.deepEqual(raw.toArray(), original);
  }
  assert.deepEqual(correctFacePitch(raw, 0).toArray(), original);
});

test('view zoom scales about the face center and leaves the source pose untouched', () => {
  const raw = new THREE.Matrix4().compose(new THREE.Vector3(4, -2, -45),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(.2, -.5, .1)), new THREE.Vector3(1.1, .9, 1.2));
  const original = raw.toArray(), center = FACE_PIVOT.clone().applyMatrix4(raw);
  const vertex = new THREE.Vector3(3, 2, 4), worldVertex = vertex.clone().applyMatrix4(raw);
  for (const zoom of [.5, 1, 1.5, 2]) {
    const displayed = zoomFacePose(raw, zoom);
    assert.ok(FACE_PIVOT.clone().applyMatrix4(displayed).distanceTo(center) < 1e-10);
    assert.ok(vertex.clone().applyMatrix4(displayed).distanceTo(center.clone().add(worldVertex.clone().sub(center).multiplyScalar(zoom))) < 1e-10);
    assert.deepEqual(raw.toArray(), original);
  }
  assert.deepEqual(zoomFacePose(raw, 1).toArray(), original);
});

test('maximum head rotation bounds all directions about the face center and preserves scale', () => {
  const frontal = new THREE.Quaternion(), scale = new THREE.Vector3(1.1, .9, 1.2);
  for (const axis of [new THREE.Vector3(1,0,0), new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,1),
    new THREE.Vector3(1,1,-1).normalize()]) for (const degrees of [-179, -80, 15, 80, 200]) {
    const rotation = new THREE.Quaternion().setFromAxisAngle(axis, THREE.MathUtils.degToRad(degrees));
    const raw = new THREE.Matrix4().compose(new THREE.Vector3(4, -2, -45), rotation, scale);
    const original = raw.toArray(), center = FACE_PIVOT.clone().applyMatrix4(raw);
    const limited = limitFaceRotation(raw, 30);
    const actual = new THREE.Quaternion(), actualScale = new THREE.Vector3();
    limited.decompose(new THREE.Vector3(), actual, actualScale);
    assert.ok(frontal.angleTo(actual.normalize()) <= THREE.MathUtils.degToRad(30) + 1e-7);
    assert.ok(FACE_PIVOT.clone().applyMatrix4(limited).distanceTo(center) < 1e-10);
    assert.ok(actualScale.distanceTo(scale) < 1e-10);
    assert.deepEqual(raw.toArray(), original);
    assert.deepEqual(limitFaceRotation(raw, 180).toArray(), original);
    if (Math.abs(degrees) <= 30) assert.deepEqual(limited.toArray(), original);
  }
});

test('zero rotation locks the head frontally while preserving the affine tracking geometry', () => {
  const raw = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(.6, -.8, .3)).setPosition(3,2,-40);
  const limited = limitFaceRotation(raw, 0);
  assert.ok(new THREE.Quaternion().setFromRotationMatrix(limited).angleTo(new THREE.Quaternion()) < 1e-7);
  assert.ok(FACE_PIVOT.clone().applyMatrix4(limited).distanceTo(FACE_PIVOT.clone().applyMatrix4(raw)) < 1e-10);
  raw.elements[4] += .000001;
  const boundedAffine = limitFaceRotation(raw, 20);
  // A rigid correction preserves the Gram matrix of the original linear part,
  // including any small shear, instead of rebuilding an approximate TRS pose.
  for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) {
    const fromA = new THREE.Vector3().setFromMatrixColumn(raw, a), fromB = new THREE.Vector3().setFromMatrixColumn(raw, b);
    const toA = new THREE.Vector3().setFromMatrixColumn(boundedAffine, a), toB = new THREE.Vector3().setFromMatrixColumn(boundedAffine, b);
    assert.ok(Math.abs(fromA.dot(fromB) - toA.dot(toB)) < 1e-10);
  }
});

test('photo UVs follow the captured landmarks and remain independent of model expression', () => {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([0.25, 0.25, 2, 0.25, 0.25, -8], 3));
  const vertices = [new THREE.Vector3(0, 0, 2), new THREE.Vector3(1, 0, 2), new THREE.Vector3(0, 1, 2)];
  const bindings = buildPhotoBinding(geometry, new THREE.Matrix4(), vertices, [[0, 1, 2]]);
  const photo = [{ x: 0.2, y: 0.3 }, { x: 0.8, y: 0.3 }, { x: 0.2, y: 0.9 }];
  updatePhotoUvs(geometry, bindings, photo);
  assert.ok(Math.abs(geometry.attributes.uv.getX(0) - 0.35) < 1e-6);
  assert.ok(Math.abs(geometry.attributes.uv.getY(0) - 0.55) < 1e-6);
  assert.equal(geometry.attributes.photoWeight.getX(0), 1);
  assert.equal(geometry.attributes.photoWeight.getX(1), 0);
  geometry.attributes.position.setY(0, -1); // Animated jaw must not slide across the photo.
  updatePhotoUvs(geometry, bindings, photo);
  assert.ok(Math.abs(geometry.attributes.uv.getY(0) - 0.55) < 1e-6);
});

test('the photo feathers at the outer face boundary without adding eye or mouth layers', () => {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([0.05, 1, 2, 1, 1, 2], 3));
  const vertices = [new THREE.Vector3(0, 0, 2), new THREE.Vector3(4, 0, 2), new THREE.Vector3(0, 4, 2)];
  buildPhotoBinding(geometry, new THREE.Matrix4(), vertices, [[0, 1, 2]], [{ start: 0, end: 2 }]);
  assert.ok(geometry.attributes.photoWeight.getX(0) < 0.1);
  assert.equal(geometry.attributes.photoWeight.getX(1), 1);
});

test('autonomous positioning projects its anchor onto the intended image coordinates', () => {
  const canonical = Array.from({ length: 468 }, () => new THREE.Vector3());
  canonical[33].set(-4, 2, 3); canonical[263].set(4, 2, 3); canonical[168].set(0, 2.5, 5);
  const landmarks = Array.from({ length: 468 }, () => ({ x: 0.5, y: 0.5 }));
  landmarks[33] = { x: 0.35, y: 0.45 }; landmarks[263] = { x: 0.65, y: 0.45 };
  landmarks[168] = { x: 0.6, y: 0.4 };
  const aspect = 16 / 9;
  const pose = poseFromLandmarks(landmarks, { pitch: 5, yaw: 15, roll: -3 }, aspect, canonical);
  const camera = new THREE.PerspectiveCamera(63, aspect, 1, 10000);
  const projected = canonical[168].clone().applyMatrix4(pose).project(camera);
  assert.ok(Math.abs((projected.x + 1) / 2 - 0.6) < 1e-6);
  assert.ok(Math.abs((1 - projected.y) / 2 - 0.4) < 1e-6);
  assert.deepEqual(camera.position.toArray(), [0, 0, 0]);
});
