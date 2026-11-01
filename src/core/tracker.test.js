import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { FaceTracker } from './tracker.js';
import { applyFaceExpressions } from './faceCapRig.js';

test('direct live tracking preserves raw scores, landmarks and metric pose through successive frames', () => {
  const tracker = new FaceTracker({ smoothing: false });
  const face = { morphTargetDictionary: { jawOpen: 0, eyeBlink_L: 1, mouthSmile_R: 2, browInnerUp: 3 },
    morphTargetInfluences: [0, 0, 0, 0] };
  for (const [frame, scores] of [[0, [0.15, 0.07, 0.2, 0.13]], [1, [0.8, 0.9, 0.3, 0.04]]]) {
    const landmarks = Array.from({ length: 478 }, (_, i) => ({ x: .5 + i * .0001 + frame * .01, y: .4, z: -.03 }));
    const matrix = new THREE.Matrix4().makeRotationY(.1 + frame * .3).setPosition(2, -1, -48).toArray();
    const result = { faceLandmarks: [landmarks], facialTransformationMatrixes: [{ data: matrix }],
      faceBlendshapes: [{ categories: ['jawOpen', 'eyeBlinkLeft', 'mouthSmileRight', 'browInnerUp'].map((categoryName, i) => ({ categoryName, score: scores[i] })) }] };
    const formatted = tracker._formatTrackingResult(result, frame * 33);
    const rawScores = { jawOpen: scores[0], eyeBlinkLeft: scores[1], mouthSmileRight: scores[2], browInnerUp: scores[3] };
    assert.deepEqual(formatted.blendshapes, rawScores, 'tracking and recording keep the original scores');
    assert.strictEqual(formatted.landmarks, landmarks, 'no iris or mouth filter can modify direct live landmarks');
    assert.deepEqual(formatted.headPose.matrix, matrix);
    applyFaceExpressions(face, new THREE.Object3D(), new THREE.Object3D(), formatted.blendshapes);
    assert.deepEqual(face.morphTargetInfluences, [scores[0], frame === 1 ? 1 : scores[1], scores[2], scores[3]],
      'rendering strengthens a closed-eye blink without changing the other expressions');
    assert.deepEqual(formatted.blendshapes, rawScores, 'blink retargeting must not mutate tracking data');
  }
});

const trackedFrame = () => ({
  faceLandmarks: [Array.from({ length: 478 }, () => ({ x: .5, y: .5, z: 0 }))],
  faceBlendshapes: [{ categories: [{ categoryName: 'jawOpen', score: .2 }] }],
  facialTransformationMatrixes: [{ data: new THREE.Matrix4().makeTranslation(0, 0, -45).toArray() }]
});

test('cached video frames retain the real detection time and expire when the video stalls', () => {
  const tracker = new FaceTracker({ smoothing: false });
  tracker.isReady = true;
  tracker.faceLandmarker = { detectForVideo: trackedFrame };
  const video = { readyState: 4, currentTime: 1 };
  assert.equal(tracker.processVideoFrame(video, 100).detected, true);
  const cached = tracker.processVideoFrame(video, 200);
  assert.equal(cached.detected, true);
  assert.equal(cached.isNewFrame, false);
  assert.equal(cached.timestamp, 100, 'cached frames must not renew face presence');
  assert.equal(tracker.processVideoFrame(video, 351).detected, false);
  video.currentTime = 2;
  assert.equal(tracker.processVideoFrame(video, 400).detected, true);
});

test('an inference failure cannot resurrect the last successful detection on the next render', () => {
  const tracker = new FaceTracker({ smoothing: false });
  tracker.isReady = true;
  tracker.faceLandmarker = { detectForVideo: trackedFrame };
  const video = { readyState: 4, currentTime: 1 };
  tracker.processVideoFrame(video, 100);
  tracker.faceLandmarker.detectForVideo = () => { throw new Error('test inference failure'); };
  video.currentTime = 2;
  const originalWarn = console.warn;
  try {
    console.warn = () => {};
    assert.equal(tracker.processVideoFrame(video, 150).detected, false);
  } finally { console.warn = originalWarn; }
  assert.equal(tracker.processVideoFrame(video, 170).detected, false);
});

test('a fresh frame with no face immediately clears the cached detection', () => {
  const tracker = new FaceTracker({ smoothing: false });
  tracker.isReady = true;
  tracker.faceLandmarker = { detectForVideo: trackedFrame };
  const video = { readyState: 4, currentTime: 1 };
  tracker.processVideoFrame(video, 100);
  tracker.faceLandmarker.detectForVideo = () => ({ faceLandmarks: [] });
  video.currentTime = 2;
  assert.equal(tracker.processVideoFrame(video, 150).detected, false);
  assert.equal(tracker.processVideoFrame(video, 170).detected, false);
});

test('a reused inference matrix cannot corrupt the reliable pose when an occlusion guess is rejected', () => {
  const tracker = new FaceTracker({ smoothing: false });
  tracker.isReady = true;
  const output = trackedFrame();
  const shared = output.facialTransformationMatrixes[0].data;
  const expected = [...shared];
  tracker.faceLandmarker = { detectForVideo: () => output };
  const video = { readyState: 4, currentTime: 1 };
  const reliable = tracker.processVideoFrame(video, 100);
  const occluded = new THREE.Matrix4().makeRotationY(Math.PI / 2).setPosition(0, 0, -45).toArray();
  shared.splice(0, shared.length, ...occluded);
  video.currentTime = 2;
  assert.equal(tracker.processVideoFrame(video, 155).detected, false);
  assert.deepEqual(reliable.headPose.matrix, expected);
});
