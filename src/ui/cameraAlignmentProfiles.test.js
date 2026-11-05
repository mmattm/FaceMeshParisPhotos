import test from 'node:test';
import assert from 'node:assert/strict';
import { CameraAlignmentProfiles } from './cameraAlignmentProfiles.js';

function setup() {
  let current = {};
  const data = new Map();
  const storage = { getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value) };
  const renderer = { getCameraOffset: () => ({ ...current }),
    setCameraOffset: value => { current = { ...current, ...value }; } };
  const profiles = new CameraAlignmentProfiles(renderer, storage);
  profiles.activate('autonomous_bust');
  return { profiles, renderer, storage };
}

test('editing an inactive mode does not change the displayed camera', () => {
  const { profiles, renderer } = setup();
  profiles.edit('minimalist');
  profiles.setEditingOffset({ pitch: 8.5, y: 60 });
  assert.equal(renderer.getCameraOffset().pitch, 0);
  assert.equal(profiles.getEditingOffset().pitch, 8.5);
  profiles.activate('minimalist');
  assert.equal(renderer.getCameraOffset().pitch, 8.5);
  assert.equal(renderer.getCameraOffset().y, 60);
});

test('selected profile remains selected when display mode changes', () => {
  const { profiles } = setup();
  profiles.edit('autonomous_bust');
  profiles.activate('minimalist');
  assert.equal(profiles.editingMode, 'autonomous_bust');
  profiles.edit();
  assert.equal(profiles.editingMode, 'minimalist');
});

test('zoom stays common even when editing an inactive profile', () => {
  const { profiles, renderer } = setup();
  profiles.edit('minimalist');
  profiles.setEditingOffset({ zoom: 1.9, pitch: 9 });
  assert.equal(renderer.getCameraOffset().zoom, 1.9);
  assert.equal(renderer.getCameraOffset().pitch, 0);
  profiles.activate('minimalist');
  assert.equal(renderer.getCameraOffset().zoom, 1.9);
});

test('Save persists the selected inactive profile and its per-mode corrections', async () => {
  const { profiles, renderer, storage } = setup();
  profiles.edit('minimalist');
  profiles.setEditingOffset({ pitch: 4, livePitchTrim: 1.2, autoPitchTrim: -2.3 });
  await profiles.save();
  assert.equal(renderer.getCameraOffset().pitch, 0);
  assert.equal(profiles.saved.autoPitchTrim, -2.3);
  const reloaded = new CameraAlignmentProfiles(renderer, storage);
  reloaded.activate('minimalist');
  assert.equal(renderer.getCameraOffset().pitch, 4);
  assert.equal(renderer.getCameraOffset().livePitchTrim, 1.2);
  assert.equal(renderer.getCameraOffset().autoPitchTrim, -2.3);
});

test('live and autonomous busts keep separate settings while sharing zoom', async () => {
  const { profiles, renderer, storage } = setup();
  profiles.edit('live_bust');
  profiles.setEditingOffset({ pitch: 12, y: -70, zoom: 1.5 });
  await profiles.save();
  assert.equal(renderer.getCameraOffset().pitch, 0);
  profiles.activate('live_bust');
  assert.equal(renderer.getCameraOffset().pitch, 12);
  assert.equal(renderer.getCameraOffset().y, -70);
  profiles.activate('autonomous_bust');
  assert.equal(renderer.getCameraOffset().pitch, 0);
  assert.equal(renderer.getCameraOffset().zoom, 1.5);
  const reloaded = new CameraAlignmentProfiles(renderer, storage);
  reloaded.activate('live_bust');
  assert.equal(renderer.getCameraOffset().pitch, 12);
});

test('existing shared bust settings migrate to the live bust without changing composition', () => {
  const { renderer, storage } = setup();
  const profiles = new CameraAlignmentProfiles(renderer, storage, {
    autonomous_bust: { pitch: 17.5, y: -180, zoom: 1.8, livePitchTrim: 1.2 }
  });
  profiles.activate('live_bust');
  assert.equal(renderer.getCameraOffset().pitch, 17.5);
  assert.equal(renderer.getCameraOffset().livePitchTrim, 1.2);
  profiles.edit('autonomous_bust');
  assert.equal(profiles.getEditingOffset().pitch, 17.5);
  profiles.setEditingOffset({ pitch: 15 });
  assert.equal(renderer.getCameraOffset().pitch, 17.5);
});
