/**
 * High-Quality Built-in Facial Animations for Autonomous Mode
 * 
 * Provides procedural mocap keyframe tracks (Head Pose & 52 Blendshapes at 30 FPS)
 * for expressive performances:
 * 1. Clin d'œil complice & sourire (Wink, head tilt & warm smile)
 * 2. Étonnement & curiosité (Inquisitive surprise, brow lift, tilt back)
 * 3. Hochement complice (Affirmative head nod, subtle roll, warm smile)
 * 4. Regard pensif & sourire (Pensive glance, curiosity pulse, blooming smile)
 * 5. Sourcils froncés (Concentration, asymmetric brow furrow and narrowed eyes)
 */

export function generatePresetAnimations() {
  const fps = 30;

  // 1. Clin d'œil & Sourire (2800ms, 84 frames)
  const anim1 = {
    id: 'preset_clin_doeil_sourire',
    name: "Clin d'œil & Sourire",
    durationMs: 2800,
    frameCount: 84,
    fps: 30,
    createdAt: new Date().toISOString(),
    hasAudio: false,
    frames: []
  };

  for (let f = 0; f < 84; f++) {
    const timeMs = (f / fps) * 1000;
    const progress = f / 84; // 0 to 1

    // Head Pose trajectory
    let pitch = 0, yaw = 0, roll = 0, x = 0, y = 0, z = 0;
    let mouthSmile = 0, eyeBlinkL = 0, eyeBlinkR = 0, browUp = 0, jawOpen = 0;

    if (progress < 0.25) {
      // Phase 1: Gentle tilt and smile starting
      const p = progress / 0.25;
      const ease = p * p * (3 - 2 * p);
      roll = -4.5 * ease;
      yaw = 5.0 * ease;
      pitch = -2.0 * ease;
      mouthSmile = 0.35 * ease;
      x = 0.02 * ease;
    } else if (progress < 0.50) {
      // Phase 2: Wink with left eye, right eye open, smile deepens
      const p = (progress - 0.25) / 0.25;
      const wink = Math.sin(p * Math.PI);
      roll = -4.5 + wink * -1.5;
      yaw = 5.0 + wink * 2.0;
      pitch = -2.0 + wink * 1.5;
      eyeBlinkL = Math.min(1.0, wink * 1.15);
      mouthSmile = 0.35 + 0.45 * Math.sin(p * Math.PI * 0.5);
      browUp = 0.45 * wink;
      jawOpen = 0.08 * wink;
    } else if (progress < 0.75) {
      // Phase 3: Affirmative micro-nod, warm suppressed giggle / amusement
      const p = (progress - 0.50) / 0.25;
      const nod = Math.sin(p * Math.PI);
      roll = -4.5 * (1 - p * 0.5);
      yaw = 5.0 * (1 - p * 0.5);
      pitch = -2.0 + nod * 6.5;
      mouthSmile = 0.80 - p * 0.20;
      jawOpen = 0.12 * nod;
      z = 0.04 * nod;
    } else {
      // Phase 4: Soft return to neutral
      const p = (progress - 0.75) / 0.25;
      const invEase = (1 - p) * (1 - p);
      roll = -2.25 * invEase;
      yaw = 2.5 * invEase;
      pitch = 1.0 * invEase;
      mouthSmile = 0.60 * invEase;
    }

    anim1.frames.push({
      timeOffsetMs: Math.round(timeMs),
      headPose: {
        pitch: Number(pitch.toFixed(2)),
        yaw: Number(yaw.toFixed(2)),
        roll: Number(roll.toFixed(2)),
        x: Number(x.toFixed(4)),
        y: Number(y.toFixed(4)),
        z: Number(z.toFixed(4))
      },
      blendshapes: {
        mouthSmileLeft: Number(mouthSmile.toFixed(3)),
        mouthSmileRight: Number((mouthSmile * 0.92).toFixed(3)),
        eyeBlinkLeft: Number(eyeBlinkL.toFixed(3)),
        eyeBlinkRight: Number(eyeBlinkR.toFixed(3)),
        browOuterUpRight: Number(browUp.toFixed(3)),
        jawOpen: Number(jawOpen.toFixed(3))
      }
    });
  }

  // 2. Étonnement & Curiosité (3000ms, 90 frames)
  const anim2 = {
    id: 'preset_etonnement_curieux',
    name: "Étonnement & Curiosité",
    durationMs: 3000,
    frameCount: 90,
    fps: 30,
    createdAt: new Date().toISOString(),
    hasAudio: false,
    frames: []
  };

  for (let f = 0; f < 90; f++) {
    const timeMs = (f / fps) * 1000;
    const progress = f / 90;

    let pitch = 0, yaw = 0, roll = 0, x = 0, y = 0, z = 0;
    let browUp = 0, eyeWide = 0, jawOpen = 0, mouthSmile = 0;

    if (progress < 0.30) {
      // Surprise: pull back, brows shoot up, mouth parts slightly
      const p = progress / 0.30;
      const ease = p * p * (3 - 2 * p);
      pitch = -6.0 * ease; // Head tilts back
      z = -0.06 * ease;   // Leans back
      browUp = 0.85 * ease;
      eyeWide = 0.65 * ease;
      jawOpen = 0.22 * ease;
    } else if (progress < 0.65) {
      // Curious lean-in & inquisitive head turn with blossoming smile
      const p = (progress - 0.30) / 0.35;
      const ease = p * p * (3 - 2 * p);
      pitch = -6.0 + ease * 10.0; // Tilts forward (+4°)
      yaw = 14.0 * ease;          // Turns head to inspect
      roll = -4.0 * ease;
      z = -0.06 + ease * 0.10;   // Leans forward (+0.04)
      x = 0.05 * ease;
      browUp = 0.85 - ease * 0.35;
      eyeWide = 0.65 - ease * 0.40;
      jawOpen = 0.22 - ease * 0.12;
      mouthSmile = 0.70 * ease;
    } else {
      // Soft settlement back to center
      const p = (progress - 0.65) / 0.35;
      const inv = 1 - p;
      const ease = inv * inv;
      pitch = 4.0 * ease;
      yaw = 14.0 * ease;
      roll = -4.0 * ease;
      z = 0.04 * ease;
      x = 0.05 * ease;
      browUp = 0.50 * ease;
      mouthSmile = 0.70 * ease;
    }

    anim2.frames.push({
      timeOffsetMs: Math.round(timeMs),
      headPose: {
        pitch: Number(pitch.toFixed(2)),
        yaw: Number(yaw.toFixed(2)),
        roll: Number(roll.toFixed(2)),
        x: Number(x.toFixed(4)),
        y: Number(y.toFixed(4)),
        z: Number(z.toFixed(4))
      },
      blendshapes: {
        browInnerUp: Number(browUp.toFixed(3)),
        browOuterUpLeft: Number((browUp * 0.85).toFixed(3)),
        browOuterUpRight: Number((browUp * 0.85).toFixed(3)),
        eyeWideLeft: Number(eyeWide.toFixed(3)),
        eyeWideRight: Number(eyeWide.toFixed(3)),
        jawOpen: Number(jawOpen.toFixed(3)),
        mouthSmileLeft: Number(mouthSmile.toFixed(3)),
        mouthSmileRight: Number(mouthSmile.toFixed(3))
      }
    });
  }

  // 3. Hochement Complice (2600ms, 78 frames)
  const anim3 = {
    id: 'preset_hochement_complice',
    name: "Hochement Complice",
    durationMs: 2600,
    frameCount: 78,
    fps: 30,
    createdAt: new Date().toISOString(),
    hasAudio: false,
    frames: []
  };

  for (let f = 0; f < 78; f++) {
    const timeMs = (f / fps) * 1000;
    const progress = f / 78;

    let pitch = 0, yaw = 0, roll = 0, x = 0, y = 0, z = 0;
    let mouthSmile = 0, eyeSquint = 0;

    if (progress < 0.40) {
      // First warm nod down
      const p = progress / 0.40;
      const nod = Math.sin(p * Math.PI);
      pitch = nod * 13.0;
      roll = Math.sin(p * Math.PI * 0.5) * 3.5;
      mouthSmile = 0.55 * Math.sin(p * Math.PI * 0.5);
      eyeSquint = 0.35 * nod;
      y = nod * 0.03;
    } else if (progress < 0.75) {
      // Second subtle nod
      const p = (progress - 0.40) / 0.35;
      const nod = Math.sin(p * Math.PI);
      pitch = nod * 8.5;
      roll = 3.5 - p * 2.0;
      mouthSmile = 0.55 + 0.20 * nod;
      eyeSquint = 0.30 * nod;
    } else {
      // Return
      const p = (progress - 0.75) / 0.25;
      const inv = (1 - p) * (1 - p);
      roll = 1.5 * inv;
      mouthSmile = 0.55 * inv;
    }

    anim3.frames.push({
      timeOffsetMs: Math.round(timeMs),
      headPose: {
        pitch: Number(pitch.toFixed(2)),
        yaw: Number(yaw.toFixed(2)),
        roll: Number(roll.toFixed(2)),
        x: Number(x.toFixed(4)),
        y: Number(y.toFixed(4)),
        z: Number(z.toFixed(4))
      },
      blendshapes: {
        mouthSmileLeft: Number(mouthSmile.toFixed(3)),
        mouthSmileRight: Number(mouthSmile.toFixed(3)),
        eyeSquintLeft: Number(eyeSquint.toFixed(3)),
        eyeSquintRight: Number(eyeSquint.toFixed(3))
      }
    });
  }

  // 4. Regard Pensif & Éclat (3200ms, 96 frames)
  const anim4 = {
    id: 'preset_regard_pensif',
    name: "Regard Pensif & Éclat",
    durationMs: 3200,
    frameCount: 96,
    fps: 30,
    createdAt: new Date().toISOString(),
    hasAudio: false,
    frames: []
  };

  for (let f = 0; f < 96; f++) {
    const timeMs = (f / fps) * 1000;
    const progress = f / 96;

    let pitch = 0, yaw = 0, roll = 0, x = 0, y = 0, z = 0;
    let mouthSmile = 0, browInnerUp = 0, browDown = 0, eyeLookUp = 0, eyeLookSide = 0;

    if (progress < 0.35) {
      // Looks up and away thoughtfully
      const p = progress / 0.35;
      const ease = p * p * (3 - 2 * p);
      yaw = -16.0 * ease;
      pitch = 10.0 * ease;
      roll = 3.0 * ease;
      x = -0.06 * ease;
      eyeLookUp = 0.45 * ease;
      eyeLookSide = -0.50 * ease;
      browDown = 0.55 * ease;
    } else if (progress < 0.70) {
      // Revelation: looks back at camera, eyes widen, radiant smile
      const p = (progress - 0.35) / 0.35;
      const ease = p * p * (3 - 2 * p);
      yaw = -16.0 * (1 - ease) + 3.0 * ease;
      pitch = 10.0 * (1 - ease) - 3.0 * ease;
      roll = 3.0 * (1 - ease) - 2.0 * ease;
      x = -0.06 * (1 - ease) + 0.02 * ease;
      eyeLookUp = 0.45 * (1 - ease);
      eyeLookSide = -0.50 * (1 - ease);
      browDown = 0.55 * (1 - ease);
      browInnerUp = 0.65 * ease;
      mouthSmile = 0.85 * ease;
    } else {
      // Soft natural decay
      const p = (progress - 0.70) / 0.30;
      const inv = (1 - p) * (1 - p);
      yaw = 3.0 * inv;
      pitch = -3.0 * inv;
      roll = -2.0 * inv;
      x = 0.02 * inv;
      browInnerUp = 0.65 * inv;
      mouthSmile = 0.85 * inv;
    }

    anim4.frames.push({
      timeOffsetMs: Math.round(timeMs),
      headPose: {
        pitch: Number(pitch.toFixed(2)),
        yaw: Number(yaw.toFixed(2)),
        roll: Number(roll.toFixed(2)),
        x: Number(x.toFixed(4)),
        y: Number(y.toFixed(4)),
        z: Number(z.toFixed(4))
      },
      blendshapes: {
        mouthSmileLeft: Number(mouthSmile.toFixed(3)),
        mouthSmileRight: Number(mouthSmile.toFixed(3)),
        browInnerUp: Number(browInnerUp.toFixed(3)),
        browDownLeft: Number(browDown.toFixed(3)),
        browDownRight: Number(browDown.toFixed(3)),
        eyeLookUpLeft: Number(eyeLookUp.toFixed(3)),
        eyeLookUpRight: Number(eyeLookUp.toFixed(3)),
        eyeLookOutLeft: Number((Math.max(0, -eyeLookSide)).toFixed(3)),
        eyeLookInRight: Number((Math.max(0, -eyeLookSide)).toFixed(3))
      }
    });
  }

  // 5. Clearly readable concentration, with a neutral mouth and a smooth release.
  const anim5 = {
    id: 'preset_sourcils_fronces',
    name: 'Sourcils froncés',
    durationMs: 3200,
    frameCount: 96,
    fps,
    createdAt: new Date().toISOString(),
    hasAudio: false,
    frames: []
  };
  const ease = t => t * t * (3 - 2 * t);
  for (let f = 0; f < anim5.frameCount; f++) {
    const progress = f / (anim5.frameCount - 1);
    const strength = progress < 0.28 ? ease(progress / 0.28)
      : progress < 0.68 ? 1 : 1 - ease((progress - 0.68) / 0.32);
    anim5.frames.push({
      timeOffsetMs: Math.round(f / fps * 1000),
      headPose: {
        pitch: Number((4 * strength).toFixed(2)),
        yaw: Number((Math.sin(progress * Math.PI * 2) * 5 * strength).toFixed(2)),
        roll: Number((-2 * strength).toFixed(2)),
        x: 0, y: 0, z: 0
      },
      blendshapes: {
        browDownLeft: Number((0.88 * strength).toFixed(3)),
        browDownRight: Number((0.76 * strength).toFixed(3)),
        eyeSquintLeft: Number((0.45 * strength).toFixed(3)),
        eyeSquintRight: Number((0.40 * strength).toFixed(3)),
        mouthSmileLeft: 0, mouthSmileRight: 0, jawOpen: 0
      }
    });
  }

  return [anim1, anim2, anim3, anim4, anim5];
}
