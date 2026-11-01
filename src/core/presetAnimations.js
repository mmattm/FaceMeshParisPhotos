/** One native Face Cap diagnostic clip. Never recreate the retired presets. */
export function generatePresetAnimations() {
  const fps = 30;
  const durationMs = 16000;
  const frames = [];
  for (let index = 0; index <= durationMs * fps / 1000; index++) {
    const progress = index / (durationMs * fps / 1000);
    // Travel around an ellipse, rather than through its center. Both the head
    // and the eyes stay off-axis even while changing from one side to the other.
    // Slower near the four cardinal directions, faster between them.
    const phase = 2 * Math.PI * progress - 0.16 * Math.sin(8 * Math.PI * progress);
    const horizontal = Math.cos(phase);
    const vertical = Math.sin(phase);
    const x = 0.52 * horizontal, y = 0.52 * vertical;
    const round = value => Number(value.toFixed(5)) || 0;
    frames.push({
      timeOffsetMs: Math.round(index * 1000 / fps),
      headPose: { pitch: round(-12 * vertical), yaw: round(24 * horizontal),
        roll: round(1.5 * vertical), x: 0, y: 0, z: 0 },
      blendshapes: {
        eyeLookOutLeft: round(Math.max(0, x)), eyeLookInRight: round(Math.max(0, x)),
        eyeLookInLeft: round(Math.max(0, -x)), eyeLookOutRight: round(Math.max(0, -x)),
        eyeLookUpLeft: round(Math.max(0, y)), eyeLookUpRight: round(Math.max(0, y)),
        eyeLookDownLeft: round(Math.max(0, -y)), eyeLookDownRight: round(Math.max(0, -y)),
        browInnerUp: 0.08, jawOpen: 0
      }
    });
  }
  return [{ id: 'preset_facecap_regards', name: 'Test Face Cap · regards hors caméra',
    rig: 'facecap', loop: true, durationMs, frameCount: frames.length, fps,
    createdAt: '2026-10-31T00:00:00.000Z', hasAudio: false, frames }];
}
