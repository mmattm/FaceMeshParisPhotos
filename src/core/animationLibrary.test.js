import test from 'node:test';
import assert from 'node:assert/strict';
import { AnimationLibrary } from './animationLibrary.js';

test('an empty library stays empty and never recreates generated presets', async () => {
  const library = new AnimationLibrary();
  library.refreshList = async () => { library.animations = []; };
  library.saveAnimation = async () => { throw new Error('Must not create an automatic preset'); };
  await library.init();
  assert.equal(library.animations.length, 0);
  assert.equal(library.cache.size, 0);
  assert.equal(library.getRandomAnimationSync(), null);
});

test('automatic playback selects only manual metric performances and avoids immediate repeats', () => {
  const library = new AnimationLibrary();
  const clips = [
    { id: 'preset_generated', rig: 'facecap', durationMs: 1000, frames: [{}] },
    { id: 'recorded_one', durationMs: 1000, frames: [{}] },
    { id: 'imported_manual', poseSpace: 'mediapipe', durationMs: 1000, frames: [{}] }
  ];
  library.animations = clips.map(clip => ({ id: clip.id, filename: `${clip.id}.json` }));
  clips.forEach(clip => library.cache.set(clip.id, clip));
  const first = library.getRandomAnimationSync();
  assert.notEqual(first.id, 'preset_generated');
  const second = library.getRandomAnimationSync();
  assert.notEqual(second.id, first.id);
  assert.notEqual(second.id, 'preset_generated');
});
