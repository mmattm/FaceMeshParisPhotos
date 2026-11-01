import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import { generatePresetAnimations } from './presetAnimations.js';
import { createFaceCapPresetFrame } from './faceCapPreset.js';
const vertices = fs.readFileSync(new URL('./canonicalFaceModel.obj', import.meta.url), 'utf8')
  .split(/\r?\n/).filter(line => line.startsWith('v '))
  .map(line => new THREE.Vector3(...line.split(/\s+/).slice(1).map(Number)));
const [preset] = generatePresetAnimations();

test('the offline diagnostic fixture provides one Face Cap test clip', () => {
  assert.equal(generatePresetAnimations().length, 1);
  assert.equal(preset.hasAudio, false);
  assert.equal(preset.rig, 'facecap');
});

test('the gaze path visits all four sides, stays off-axis between frames, and closes its loop', () => {
  const directions = new Set();
  for (let i = 0; i < preset.frames.length - 1; i++) {
    const a = preset.frames[i], b = preset.frames[i + 1];
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const mix = (key, field) => (a[field][key] || 0) * (1 - t) + (b[field][key] || 0) * t;
      const yaw = mix('yaw', 'headPose'), pitch = mix('pitch', 'headPose');
      const x = mix('eyeLookOutLeft', 'blendshapes') - mix('eyeLookInLeft', 'blendshapes');
      const y = mix('eyeLookUpLeft', 'blendshapes') - mix('eyeLookDownLeft', 'blendshapes');
      assert.ok(Math.hypot(x, y) > 0.519, 'gaze must go around the camera, never through it');
      assert.ok(Math.hypot(yaw, pitch) > 11.99, 'head never returns to a frontal pose');
      // Native eye forward is +Y before the model's X registration. Compose the
      // actual eye rotations with the head to detect accidental counter-rotation.
      const forward = new THREE.Vector3(0, 1, 0)
        .applyEuler(new THREE.Euler(-y * Math.PI / 6, 0, -x * Math.PI / 6))
        .applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)
        .applyEuler(new THREE.Euler(pitch * Math.PI / 180, yaw * Math.PI / 180,
          mix('roll', 'headPose') * Math.PI / 180, 'YXZ'));
      assert.ok(THREE.MathUtils.radToDeg(Math.acos(THREE.MathUtils.clamp(forward.z, -1, 1))) > 20);
      if (x > 0.5) directions.add('left'); if (x < -0.5) directions.add('right');
      if (y > 0.5) directions.add('up'); if (y < -0.5) directions.add('down');
    }
  }
  assert.equal(directions.size, 4);
  assert.deepEqual(preset.frames[0].headPose, preset.frames.at(-1).headPose);
  assert.deepEqual(preset.frames[0].blendshapes, preset.frames.at(-1).blendshapes);
});

test('Face Cap playback keeps the face pivot centered at fixed depth for every pose and aspect', () => {
  for (const aspect of [1, 4 / 3, 16 / 9]) {
    const camera = new THREE.PerspectiveCamera(63, aspect, 1, 10000);
    for (const sample of preset.frames.filter((_, i) => i % 5 === 0)) {
      const frame = createFaceCapPresetFrame(sample, vertices, aspect);
      const matrix = new THREE.Matrix4().fromArray(frame.headPose.matrix);
      const pivot = new THREE.Vector3(0, -0.5, 4.5).applyMatrix4(matrix);
      assert.ok(pivot.distanceTo(new THREE.Vector3(0, 0, -48)) < 1e-10);
      pivot.project(camera);
      assert.ok(Math.abs(pivot.x) < 1e-10 && Math.abs(pivot.y) < 1e-10);
      assert.equal(frame.landmarks.length, 478);
      assert.ok(frame.landmarks.every(p => Number.isFinite(p.x + p.y + p.z)));
      assert.deepEqual(frame.blendshapes, sample.blendshapes);
    }
  }
});

test('a manual performance stays on its first pose during the handoff, then starts at frame zero', async () => {
  const { getPresetPlaybackPhase } = await import('./faceCapPreset.js');
  const clip = { durationMs: 3000 };
  for (const elapsed of [0, 125, 250, 499]) {
    const phase = getPresetPlaybackPhase(clip, elapsed);
    assert.equal(phase.preparing, true);
    assert.equal(phase.time, 0, 'mouth and head must target the same first recorded frame throughout the handoff');
    assert.equal(phase.finished, false);
  }
  assert.equal(getPresetPlaybackPhase(clip, 500).time, 0);
  assert.equal(getPresetPlaybackPhase(clip, 1000).time, 500);
  assert.equal(getPresetPlaybackPhase(clip, 3499).finished, false);
  assert.equal(getPresetPlaybackPhase(clip, 3500).finished, true);
});

test('loop restarts keep moving during their handoff without adding a frame-zero pause', async () => {
  const { getPresetPlaybackPhase } = await import('./faceCapPreset.js');
  const clip = { durationMs: 3000, loop: true };
  const first = getPresetPlaybackPhase(clip, 3500);
  assert.equal(first.cycle, 1);
  assert.equal(first.preparing, false);
  assert.equal(first.time, 0);
  assert.equal(getPresetPlaybackPhase(clip, 3750).time, 250);
  assert.equal(getPresetPlaybackPhase(clip, 4500).time, 1000);
  assert.equal(getPresetPlaybackPhase(clip, 6500).cycle, 2);
});

test('consecutive presets play underneath their half-second handoff', async () => {
  const { getPresetPlaybackPhase } = await import('./faceCapPreset.js');
  const clip = { durationMs: 3000 };
  for (const elapsed of [0, 125, 250, 500, 2999]) {
    const phase = getPresetPlaybackPhase(clip, elapsed, { continuous: true });
    assert.equal(phase.preparing, false);
    assert.equal(phase.time, elapsed);
    assert.equal(phase.finished, false);
  }
  assert.equal(getPresetPlaybackPhase(clip, 3000, { continuous: true }).finished, true);
  // Even a very short imported clip leaves time for the full blend to finish.
  assert.equal(getPresetPlaybackPhase({ durationMs: 100 }, 499, { continuous: true }).finished, false);
});
