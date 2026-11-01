import test from 'node:test';
import assert from 'node:assert/strict';
import { PresetAudioLipSync } from './presetAudioLipSync.js';

function voice() {
  const player = new PresetAudioLipSync();
  player.context = { currentTime: 0, state: 'running' };
  player.source = {};
  player.durationMs = 10000;
  player.wave = new Float32Array(512);
  let level = 0;
  player.analyser = { getFloatTimeDomainData: wave => wave.fill(level) };
  return { player, frame(time, amplitude) {
    level = amplitude;
    player.context.currentTime = time;
    return player.getBlendshapes();
  } };
}

test('speech uses a restrained jaw without curling or forcing the lips shut', () => {
  const { frame } = voice();
  const preset = { mouthUpperUpLeft: .9, mouthShrugUpper: .8, mouthPucker: .6,
    mouthPressRight: .7, mouthSmileLeft: .4, eyeBlinkLeft: .3 };
  let speaking;
  for (let i = 0; i < 120; i++) {
    speaking = frame(i / 60, .1);
    assert.ok(speaking.jawOpen >= 0 && speaking.jawOpen <= .32);
    if (i === 0) assert.ok(speaking.jawOpen < .16, 'speech should ease into its opening');
  }
  assert.ok(speaking.jawOpen > .2, 'speech must still be visible');
  const rendered = { ...preset, ...speaking };
  for (const channel of ['mouthUpperUpLeft', 'mouthUpperUpRight', 'mouthShrugUpper',
    'mouthRollUpper', 'mouthClose', 'mouthPucker', 'mouthStretchLeft', 'mouthPressRight']) {
    assert.equal(rendered[channel], 0, `${channel} must not fight the speaking jaw`);
  }
  assert.equal(rendered.mouthSmileLeft, preset.mouthSmileLeft);
  assert.equal(rendered.eyeBlinkLeft, preset.eyeBlinkLeft);
});

test('syllable pauses close the jaw smoothly without squeezing the lips, and finished audio releases the preset', () => {
  const { player, frame } = voice();
  let result;
  for (let i = 0; i < 60; i++) result = frame(i / 60, .1);
  const speaking = result.jawOpen;
  const releasing = frame(1, 0).jawOpen;
  assert.ok(releasing > 0 && releasing <= speaking);
  for (let i = 61; i < 120; i++) result = frame(i / 60, 0);
  assert.equal(result.jawOpen, 0);
  assert.equal(result.mouthClose, 0);
  player.source = null;
  assert.equal(frame(2, .1), null);
});

test('jaw response stays consistent across rendering frame rates', () => {
  const responses = [30, 60, 120].map(fps => {
    const { frame } = voice();
    frame(0, 0);
    let result;
    for (let i = 1; i <= fps / 5; i++) result = frame(i / fps, .1);
    return result.jawOpen;
  });
  assert.ok(Math.max(...responses) - Math.min(...responses) < .015);
});
