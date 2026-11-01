import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { FaceTransition } from './faceTransition.js';
import { FACE_PIVOT, correctFacePitch } from './faceCapRig.js';
const pose = (x, yaw) => new THREE.Matrix4().makeRotationY(yaw).setPosition(x, 0, -42);

test('a configured one-second handoff blends pose and expressions together', () => {
  const transition = new FaceTransition(1000);
  const live = pose(-4, 0), target = pose(8, Math.PI / 2);
  transition.update(live, { jawOpen: .2, eyeBlinkLeft: 1 }, null, 0);
  const first = transition.update(target, { jawOpen: .8 }, 'clip:1', 100);
  assert.ok(first.matrix.equals(live));
  assert.equal(first.blendshapes.jawOpen, .2);
  const middle = transition.update(target, { jawOpen: .8 }, 'clip:1', 600);
  assert.ok(FACE_PIVOT.clone().applyMatrix4(middle.matrix).distanceTo(FACE_PIVOT.clone().applyMatrix4(live).lerp(FACE_PIVOT.clone().applyMatrix4(target), .5)) < 1e-10);
  assert.ok(Math.abs(middle.blendshapes.jawOpen - .5) < 1e-10);
  assert.equal(middle.blendshapes.eyeBlinkLeft, .5);
  assert.ok(Math.abs(new THREE.Vector3(0, 0, 1).transformDirection(middle.matrix).x - Math.SQRT1_2) < 1e-10);
  const last = transition.update(target, { jawOpen: .8 }, 'clip:1', 1100);
  assert.ok(last.matrix.equals(target));
  assert.deepEqual(last.blendshapes, { jawOpen: .8 });
});

test('Locked stays centered throughout handoffs in both directions', () => {
  const transition = new FaceTransition(1000);
  transition.update(pose(12, -.4), { jawOpen: .1 }, null, 0, true);
  for (const time of [100, 350, 600, 850, 1100]) {
    const displayed = transition.update(pose(-8, .6), { jawOpen: .6 }, 'clip:1', time, true);
    assert.ok(FACE_PIVOT.clone().applyMatrix4(displayed.matrix).distanceTo(new THREE.Vector3(0, 0, -28)) < 1e-10);
  }
  const live = pose(9, -.2);
  for (const time of [1200, 1450, 1700, 1950, 2200]) {
    const displayed = transition.update(live, { jawOpen: .23 }, null, time, true);
    assert.ok(FACE_PIVOT.clone().applyMatrix4(displayed.matrix).distanceTo(new THREE.Vector3(0, 0, -28)) < 1e-10);
  }
  assert.equal(transition.active, null);
});

test('returning live tracking follows the moving target over one second, then stays direct', () => {
  const transition = new FaceTransition(1000);
  const autonomous = pose(0, 0);
  transition.update(autonomous, { jawOpen: .1 }, 'clip:1', 0);
  const first = transition.update(pose(8, Math.PI / 2), { jawOpen: .9 }, null, 100);
  assert.ok(first.matrix.equals(autonomous));
  assert.equal(first.blendshapes.jawOpen, .1);
  const middle = transition.update(pose(10, Math.PI / 2), { jawOpen: .7 }, null, 600);
  assert.ok(FACE_PIVOT.clone().applyMatrix4(middle.matrix).distanceTo(FACE_PIVOT.clone().applyMatrix4(autonomous).lerp(FACE_PIVOT.clone().applyMatrix4(pose(10, Math.PI / 2)), .5)) < 1e-10);
  assert.ok(Math.abs(middle.blendshapes.jawOpen - .4) < 1e-10);
  const current = pose(12, Math.PI / 3);
  const last = transition.update(current, { jawOpen: .4 }, null, 1100);
  assert.ok(last.matrix.equals(current));
  assert.equal(last.blendshapes.jawOpen, .4);
  const next = pose(14, .2);
  assert.ok(transition.update(next, { jawOpen: .2 }, null, 1200).matrix.equals(next));
});

test('reacquiring tracking during the entry blend starts from the displayed face without a jump', () => {
  const transition = new FaceTransition(1000);
  transition.update(pose(0, 0), {}, null, 0);
  transition.update(pose(10, .4), {}, 'clip:1', 100);
  const displayed = transition.update(pose(10, .4), {}, 'clip:1', 600);
  const returning = transition.update(pose(-4, -.2), {}, null, 650);
  assert.ok(Math.abs(returning.matrix.elements[12] - displayed.matrix.elements[12]) < 1e-10);
  const complete = transition.update(pose(-4, -.2), {}, null, 1650);
  assert.ok(complete.matrix.equals(pose(-4, -.2)));
});

test('a new manual clip blends from the last displayed face without resetting to a neutral pose', () => {
  const transition = new FaceTransition(1000);
  transition.update(pose(2, .2), { jawOpen: .4 }, 'clip:1', 0);
  const next = transition.update(pose(-5, -.8), { jawOpen: .7 }, 'clip:2', 50);
  assert.equal(next.blendshapes.jawOpen, .4);
  assert.ok(Math.abs(next.matrix.elements[12] - 2) < 1e-10);
});

test('consecutive moving presets ease all expression channels and pose in Tracking and Locked', async () => {
  const { getPresetPlaybackPhase } = await import('./faceCapPreset.js');
  for (const locked of [false, true]) {
    const transition = new FaceTransition();
    const previous = transition.update(pose(4, -.5), { jawOpen: .8, eyeBlinkLeft: .6 }, 'run:1', 0, locked);
    for (const elapsed of [0, 125, 250, 375, 500]) {
      const phase = getPresetPlaybackPhase({ durationMs: 2000 }, elapsed, { continuous: true });
      const progress = phase.time / 1000;
      const target = pose(-3 - progress, .2 + progress);
      const scores = { jawOpen: .2 + progress, eyeLookInLeft: progress };
      const shown = transition.update(target, scores, 'run:2', 100 + elapsed, locked);
      const t = elapsed / 500;
      const weight = t * t * t * (t * (t * 6 - 15) + 10);
      assert.ok(Math.abs(shown.blendshapes.jawOpen - (.8 * (1 - weight) + scores.jawOpen * weight)) < 1e-10);
      assert.ok(Math.abs((shown.blendshapes.eyeBlinkLeft || 0) - .6 * (1 - weight)) < 1e-10);
      assert.ok(Math.abs((shown.blendshapes.eyeLookInLeft || 0) - progress * weight) < 1e-10);
      const center = FACE_PIVOT.clone().applyMatrix4(shown.matrix);
      const targetCenter = locked ? new THREE.Vector3(0, 0, -28) : FACE_PIVOT.clone().applyMatrix4(target);
      const expectedCenter = FACE_PIVOT.clone().applyMatrix4(previous.matrix).lerp(targetCenter, weight);
      assert.ok(center.distanceTo(expectedCenter) < 1e-10);
      const expectedRotation = new THREE.Quaternion().setFromRotationMatrix(previous.matrix)
        .slerp(new THREE.Quaternion().setFromRotationMatrix(target), weight);
      assert.ok(expectedRotation.angleTo(new THREE.Quaternion().setFromRotationMatrix(shown.matrix)) < 1e-7);
      if (elapsed === 0) assert.deepEqual(shown.matrix.elements, previous.matrix.elements);
    }
    assert.equal(transition.active, null);
  }
});

test('the switching frame preserves the exact displayed MediaPipe matrix, including affine residuals', () => {
  const transition = new FaceTransition(1000);
  const live = pose(2, .2);
  live.elements[4] += .000001;
  const scores = { jawOpen: .23, eyeBlinkLeft: .17 };
  transition.update(live, scores, null, 0);
  const switched = transition.update(pose(-5, -.3), { jawOpen: .8 }, 'clip:1', 100);
  assert.deepEqual(switched.matrix.elements, live.elements);
  assert.deepEqual(switched.blendshapes, scores);
});

test('an open mouth joins the first preset pose without following its later closed-mouth frames early', async () => {
  const { getPresetPlaybackPhase } = await import('./faceCapPreset.js');
  const transition = new FaceTransition();
  const live = pose(3, -.4), firstPresetPose = pose(-2, .3);
  const clip = { durationMs: 3000 };
  transition.update(live, { jawOpen: .9, mouthClose: 0 }, null, 0);
  for (const elapsed of [0, 125, 250, 375, 499, 500]) {
    const phase = getPresetPlaybackPhase(clip, elapsed);
    assert.equal(phase.time, 0);
    const displayed = transition.update(firstPresetPose, { jawOpen: .6, mouthClose: .1 }, 'clip:1', 100 + elapsed);
    assert.ok(displayed.blendshapes.jawOpen >= .6, 'no premature mouth closure during the handoff');
    assert.ok(displayed.blendshapes.mouthClose <= .1);
    if (elapsed === 500) assert.ok(displayed.matrix.equals(firstPresetPose));
  }
  assert.equal(getPresetPlaybackPhase(clip, 600).time, 100);
  assert.equal(transition.update(pose(-2, .4), { jawOpen: 0 }, 'clip:1', 700).blendshapes.jawOpen, 0,
    'the recorded mouth may close only when that part of the performance actually starts');
});

test('the default handoff takes half a second in both directions', () => {
  const transition = new FaceTransition();
  assert.equal(transition.durationMs, 500);
  transition.update(pose(0, 0), { jawOpen: .8 }, null, 0);
  transition.update(pose(5, .4), { jawOpen: .2 }, 'clip:1', 100);
  assert.equal(transition.update(pose(5, .4), { jawOpen: .2 }, 'clip:1', 600).blendshapes.jawOpen, .2);
  transition.update(pose(-4, -.3), { jawOpen: .7 }, null, 700);
  assert.equal(transition.update(pose(-4, -.3), { jawOpen: .7 }, null, 1200).blendshapes.jawOpen, .7);
  assert.equal(transition.active, null);
});

test('a rotating head with a stationary face center cannot shift sideways during the handoff', () => {
  const transition = new FaceTransition();
  const center = new THREE.Vector3(3, 1, -35);
  const atCenter = yaw => {
    const matrix = new THREE.Matrix4().makeRotationY(yaw);
    matrix.setPosition(center.clone().sub(FACE_PIVOT.clone().applyMatrix4(matrix)));
    return matrix;
  };
  transition.update(atCenter(-.8), {}, null, 0);
  for (const now of [100, 200, 300, 400, 500, 600]) {
    const displayed = transition.update(atCenter(.8), {}, 'clip:1', now);
    assert.ok(FACE_PIVOT.clone().applyMatrix4(displayed.matrix).distanceTo(center) < 1e-10);
  }
});

test('the first autonomous frame in Locked retains the exact last displayed position', () => {
  const transition = new FaceTransition();
  const last = transition.update(pose(2, .27), { jawOpen: .6 }, null, 0, true);
  const first = transition.update(pose(-6, -.35), { jawOpen: .1 }, 'clip:1', 100, true);
  assert.deepEqual(first.matrix.elements, last.matrix.elements);
});

test('vertical corrections on Live and presets keep seamless handoffs in both directions', () => {
  const transition = new FaceTransition();
  const live = correctFacePitch(pose(2, .3), 15), preset = correctFacePitch(pose(-4, -.2), 15);
  transition.update(live, {}, null, 0);
  const entry = transition.update(preset, {}, 'clip:1', 100);
  assert.deepEqual(entry.matrix.toArray(), live.toArray());
  assert.deepEqual(transition.update(preset, {}, 'clip:1', 600).matrix.toArray(), preset.toArray());
  const returning = transition.update(live, {}, null, 700);
  assert.deepEqual(returning.matrix.toArray(), preset.toArray());
  assert.deepEqual(transition.update(live, {}, null, 1200).matrix.toArray(), live.toArray());
});

test('rotation limits remain active throughout Live/preset handoffs and can tighten mid-transition', () => {
  for (const locked of [false, true]) {
    const transition = new FaceTransition();
    const angleOf = matrix => new THREE.Quaternion().setFromRotationMatrix(matrix).normalize().angleTo(new THREE.Quaternion());
    const first = transition.update(pose(3, 1.4), { jawOpen: .7 }, null, 0, locked, 30);
    const entry = transition.update(pose(-4, -1.4), { jawOpen: .2 }, 'clip:1', 100, locked, 30);
    assert.deepEqual(entry.matrix.toArray(), first.matrix.toArray());
    for (const now of [225, 350, 475, 600]) {
      const shown = transition.update(pose(-4, -1.4), { jawOpen: .2 }, 'clip:1', now, locked, 30);
      assert.ok(angleOf(shown.matrix) <= Math.PI / 6 + 1e-7);
    }
    assert.equal(transition.last.scores.jawOpen, .2);
    transition.update(pose(3, 1.4), { jawOpen: .7 }, null, 700, locked, 30);
    const tightened = transition.update(pose(3, 1.4), { jawOpen: .7 }, null, 725, locked, 10);
    assert.ok(angleOf(tightened.matrix) <= Math.PI / 18 + 1e-7);
    assert.deepEqual(transition.last.matrix.toArray(), tightened.matrix.toArray());
    const complete = transition.update(pose(3, 1.4), { jawOpen: .7 }, null, 1200, locked, 10);
    assert.ok(angleOf(complete.matrix) <= Math.PI / 18 + 1e-7);
    assert.equal(complete.blendshapes.jawOpen, .7);
  }
});
