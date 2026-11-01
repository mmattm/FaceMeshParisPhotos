import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createMediaPipeGeometry, updateMediaPipeGeometry } from './mediaPipePointCloud.js';
import { MP_FOV } from './faceCapRig.js';

const landmarks = () => Array.from({ length: 478 }, (_, i) => ({
  x: .15 + (i % 22) * .03, y: .12 + Math.floor(i / 22) * .035, z: (i % 17) * .001 - .02
}));

test('every actual MediaPipe landmark, including the irises, projects to its detected position', () => {
  const points = landmarks();
  const original = structuredClone(points);
  const pose = new THREE.Matrix4().makeRotationY(.4).setPosition(3, -2, -48);
  const savedPose = pose.toArray();
  for (const aspect of [1, 4 / 3, 16 / 9]) {
    const geometry = createMediaPipeGeometry();
    assert.equal(updateMediaPipeGeometry(geometry, points, pose, aspect), true);
    assert.equal(geometry.drawRange.count, 478);
    assert.equal(geometry.morphAttributes.position, undefined);
    const camera = new THREE.PerspectiveCamera(MP_FOV, aspect, 1, 10000);
    for (let i = 0; i < 478; i++) {
      const projected = new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, i).applyMatrix4(pose).project(camera);
      assert.ok(Math.abs((projected.x + 1) / 2 - points[i].x) < 1e-6);
      assert.ok(Math.abs((1 - projected.y) / 2 - points[i].y) < 1e-6);
    }
  }
  assert.deepEqual(points, original);
  assert.deepEqual(pose.toArray(), savedPose);
});

test('a new detected mouth or iris position updates the cloud directly without blendshapes', () => {
  const points = landmarks(), geometry = createMediaPipeGeometry();
  const pose = new THREE.Matrix4().makeTranslation(0, 0, -45);
  updateMediaPipeGeometry(geometry, points, pose, 1);
  const before = geometry.attributes.position.array.slice();
  points[13].y += .05;
  points[468].x += .02;
  updateMediaPipeGeometry(geometry, points, pose, 1);
  assert.notEqual(geometry.attributes.position.getY(13), before[13 * 3 + 1]);
  assert.notEqual(geometry.attributes.position.getX(468), before[468 * 3]);
  assert.deepEqual(Array.from(geometry.attributes.position.array.slice(0, 30)), Array.from(before.slice(0, 30)));
});

test('missing or invalid detection clears the draw range instead of keeping stale points', () => {
  const geometry = createMediaPipeGeometry(), points = landmarks();
  const pose = new THREE.Matrix4().makeTranslation(0, 0, -45);
  assert.equal(updateMediaPipeGeometry(geometry, points.slice(0, 468), pose, 1), true);
  assert.equal(geometry.drawRange.count, 468);
  assert.equal(updateMediaPipeGeometry(geometry, [], pose, 1), false);
  assert.equal(geometry.drawRange.count, 0);
  points[10].x = NaN;
  assert.equal(updateMediaPipeGeometry(geometry, points, pose, 1), false);
  assert.equal(geometry.drawRange.count, 0);
});
