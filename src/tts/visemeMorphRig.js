/**
 * Anatomical 3D Viseme Morph Rig & Co-Articulation Engine
 * Directly driven and synchronized with Web Audio sample playback.
 * Controls 80+ oral and facial landmarks with Preston Blair/Oculus standards.
 */

const FULL_MOUTH_ANATOMY = {
  upperOuter: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291],
  upperInner: [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308],
  lowerOuter: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291],
  lowerInner: [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308],
  upperVermilion: [11, 12, 38, 41, 72, 73, 74, 180, 268, 271, 302, 303, 304, 404, 164, 165, 167],
  lowerVermilion: [15, 16, 85, 86, 87, 178, 179, 315, 316, 317, 403, 18, 175, 199, 200],
  leftCorner: [61, 78, 76, 77, 95, 185, 146, 292],
  rightCorner: [291, 308, 306, 307, 324, 409, 375, 62],
  cheeksModiolus: [186, 216, 436, 410, 142, 203, 205, 371, 423, 425, 57, 287],
  chinSubmental: [175, 199, 200, 18, 19, 396, 171]
};

// Continuous jaw contour along MediaPipe FACE_OVAL to prevent jagged tears
const JAW_CONTOUR_WEIGHTS = [
  { idx: 152, w: 1.0 },       // Chin center
  { idx: 377, w: 0.88 }, { idx: 148, w: 0.88 },
  { idx: 400, w: 0.72 }, { idx: 176, w: 0.72 },
  { idx: 378, w: 0.52 }, { idx: 149, w: 0.52 },
  { idx: 379, w: 0.35 }, { idx: 150, w: 0.35 },
  { idx: 365, w: 0.20 }, { idx: 136, w: 0.20 },
  { idx: 397, w: 0.08 }, { idx: 172, w: 0.08 }
];

// Physiologically realistic speech targets (normalized to inter-ocular skull scale)
const VISEME_TARGETS = {
  Sil: { jawDrop: 0.0, lipOpen: 0.0, stretch: 0.0, pucker: 0.0, rollLower: 0.0, seal: 0.0, zProtrude: 0.0 },
  PP:  { jawDrop: 0.0, lipOpen: 0.0, stretch: 0.0, pucker: 0.0, rollLower: 0.0, seal: 0.8, zProtrude: 0.0 },
  FF:  { jawDrop: 0.12, lipOpen: 0.08, stretch: 0.10, pucker: 0.0, rollLower: 0.5, seal: 0.0, zProtrude: -0.01 },
  TH:  { jawDrop: 0.18, lipOpen: 0.14, stretch: 0.12, pucker: 0.0, rollLower: 0.0, seal: 0.0, zProtrude: 0.0 },
  DD:  { jawDrop: 0.15, lipOpen: 0.12, stretch: 0.25, pucker: 0.0, rollLower: 0.0, seal: 0.0, zProtrude: 0.0 },
  kk:  { jawDrop: 0.26, lipOpen: 0.22, stretch: 0.08, pucker: 0.0, rollLower: 0.0, seal: 0.0, zProtrude: 0.0 },
  CH:  { jawDrop: 0.18, lipOpen: 0.14, stretch: -0.12, pucker: 0.35, rollLower: 0.0, seal: 0.0, zProtrude: 0.015 },
  SS:  { jawDrop: 0.12, lipOpen: 0.10, stretch: 0.35, pucker: 0.0, rollLower: 0.0, seal: 0.0, zProtrude: 0.0 },
  aa:  { jawDrop: 0.48, lipOpen: 0.45, stretch: 0.05, pucker: 0.0, rollLower: 0.0, seal: 0.0, zProtrude: 0.0 },
  E:   { jawDrop: 0.26, lipOpen: 0.24, stretch: 0.32, pucker: 0.0, rollLower: 0.0, seal: 0.0, zProtrude: 0.0 },
  I:   { jawDrop: 0.16, lipOpen: 0.15, stretch: 0.45, pucker: 0.0, rollLower: 0.0, seal: 0.0, zProtrude: 0.0 },
  O:   { jawDrop: 0.34, lipOpen: 0.30, stretch: -0.22, pucker: 0.45, rollLower: 0.0, seal: 0.0, zProtrude: 0.018 },
  U:   { jawDrop: 0.16, lipOpen: 0.12, stretch: -0.32, pucker: 0.55, rollLower: 0.0, seal: 0.0, zProtrude: 0.022 },
  RR:  { jawDrop: 0.20, lipOpen: 0.16, stretch: -0.12, pucker: 0.25, rollLower: 0.0, seal: 0.0, zProtrude: 0.01 }
};

export class VisemeMorphRig {
  constructor() {
    this.fps = 60;
  }

  /**
   * Parse phonetic tokens from text and align them to the exact audio duration
   */
  parsePhoneticKeyframes(text, totalAudioDurationMs) {
    const cleanText = text.toLowerCase().trim();
    const words = cleanText.split(/\s+/);
    const keyframes = [];

    // Initial lead-in silence (30ms)
    keyframes.push({ timeMs: 0, viseme: 'Sil', cost: 1.0 });
    let cursorMs = 30;

    const tokens = [];

    for (let w = 0; w < words.length; w++) {
      const word = words[w];
      let i = 0;

      while (i < word.length) {
        const c = word[i];
        const next = word[i + 1] || '';
        const pair = c + next;

        if (pair === 'ou' || pair === 'oo') {
          tokens.push({ viseme: 'U', cost: 1.3 });
          i += 2;
        } else if (pair === 'au' || pair === 'eau' || pair === 'oh') {
          tokens.push({ viseme: 'O', cost: 1.3 });
          i += pair.length;
        } else if (pair === 'ch' || pair === 'sh') {
          tokens.push({ viseme: 'CH', cost: 1.1 });
          i += 2;
        } else if (pair === 'ph') {
          tokens.push({ viseme: 'FF', cost: 1.0 });
          i += 2;
        } else if (pair === 'th') {
          tokens.push({ viseme: 'TH', cost: 1.0 });
          i += 2;
        } else if (pair === 'ai' || pair === 'ei' || pair === 'ee') {
          tokens.push({ viseme: 'E', cost: 1.1 });
          i += 2;
        } else if ('aàâä'.includes(c)) {
          tokens.push({ viseme: 'aa', cost: 1.25 });
          i++;
        } else if ('oôö'.includes(c)) {
          tokens.push({ viseme: 'O', cost: 1.2 });
          i++;
        } else if ('uûüw'.includes(c)) {
          tokens.push({ viseme: 'U', cost: 1.15 });
          i++;
        } else if ('eéèêë'.includes(c)) {
          tokens.push({ viseme: 'E', cost: 1.05 });
          i++;
        } else if ('iîïy'.includes(c)) {
          tokens.push({ viseme: 'I', cost: 1.05 });
          i++;
        } else if ('mbp'.includes(c)) {
          tokens.push({ viseme: 'PP', cost: 0.9 });
          i++;
        } else if ('fv'.includes(c)) {
          tokens.push({ viseme: 'FF', cost: 0.95 });
          i++;
        } else if ('szcçj'.includes(c)) {
          tokens.push({ viseme: 'SS', cost: 0.95 });
          i++;
        } else if ('tdn'.includes(c)) {
          tokens.push({ viseme: 'DD', cost: 0.85 });
          i++;
        } else if ('kgq'.includes(c)) {
          tokens.push({ viseme: 'kk', cost: 0.85 });
          i++;
        } else if (c === 'l') {
          tokens.push({ viseme: 'TH', cost: 0.85 });
          i++;
        } else if (c === 'r') {
          tokens.push({ viseme: 'RR', cost: 0.9 });
          i++;
        } else if (',;.!?'.includes(c)) {
          tokens.push({ viseme: 'Sil', cost: 1.6 });
          i++;
        } else {
          tokens.push({ viseme: 'aa', cost: 0.8 });
          i++;
        }
      }
      tokens.push({ viseme: 'Sil', cost: 0.4 });
    }

    // Active speech occupies the duration minus trailing silence (80ms)
    const speakingDurationMs = Math.max(100, totalAudioDurationMs - 110);
    const totalCost = tokens.reduce((acc, t) => acc + t.cost, 0);
    const msPerCost = speakingDurationMs / Math.max(1, totalCost);

    tokens.forEach(tok => {
      const dur = tok.cost * msPerCost;
      keyframes.push({
        timeMs: cursorMs,
        viseme: tok.viseme,
        dur
      });
      cursorMs += dur;
    });

    // Final clean closing to silence
    keyframes.push({
      timeMs: totalAudioDurationMs - 50,
      viseme: 'Sil',
      dur: 50
    });
    keyframes.push({
      timeMs: totalAudioDurationMs,
      viseme: 'Sil',
      dur: 0
    });

    return {
      keyframes,
      totalDurationMs: totalAudioDurationMs
    };
  }

  /**
   * Generates sample-accurate 60 FPS animation frames
   */
  generateSpeechAnimation(text, totalAudioDurationMs) {
    const { keyframes, totalDurationMs } = this.parsePhoneticKeyframes(text, totalAudioDurationMs);
    const totalFrames = Math.ceil((totalDurationMs / 1000) * this.fps);
    const frames = [];

    for (let f = 0; f < totalFrames; f++) {
      const frameTimeMs = (f / this.fps) * 1000;

      // Silence clamp when audio ends
      if (frameTimeMs >= totalAudioDurationMs - 10) {
        frames.push({
          timeOffsetMs: frameTimeMs,
          deltas: this.createZeroDeltas(),
          visemeName: 'Sil'
        });
        continue;
      }

      let k0 = 0;
      for (let k = 0; k < keyframes.length; k++) {
        if (keyframes[k].timeMs <= frameTimeMs) {
          k0 = k;
        } else {
          break;
        }
      }
      const k1 = Math.min(keyframes.length - 1, k0 + 1);
      const kf0 = keyframes[k0];
      const kf1 = keyframes[k1];

      let alpha = 0;
      const dt = kf1.timeMs - kf0.timeMs;
      if (dt > 0.001) {
        const u = Math.max(0, Math.min(1, (frameTimeMs - kf0.timeMs) / dt));
        // Smooth Hermite interpolation (S-curve) for co-articulation
        alpha = u * u * (3 - 2 * u);
      }

      const v0 = VISEME_TARGETS[kf0.viseme] || VISEME_TARGETS.Sil;
      const v1 = VISEME_TARGETS[kf1.viseme] || VISEME_TARGETS.Sil;

      const params = {
        jawDrop: v0.jawDrop * (1 - alpha) + v1.jawDrop * alpha,
        lipOpen: v0.lipOpen * (1 - alpha) + v1.lipOpen * alpha,
        stretch: v0.stretch * (1 - alpha) + v1.stretch * alpha,
        pucker: v0.pucker * (1 - alpha) + v1.pucker * alpha,
        rollLower: v0.rollLower * (1 - alpha) + v1.rollLower * alpha,
        seal: v0.seal * (1 - alpha) + v1.seal * alpha,
        zProtrude: v0.zProtrude * (1 - alpha) + v1.zProtrude * alpha
      };

      const deltas = this.evaluateLandmarkDisplacements(params);

      frames.push({
        timeOffsetMs: frameTimeMs,
        deltas,
        visemeName: alpha > 0.5 ? kf1.viseme : kf0.viseme
      });
    }

    return {
      durationMs: totalDurationMs,
      frames
    };
  }

  createZeroDeltas() {
    const deltas = new Array(478);
    for (let i = 0; i < 478; i++) {
      deltas[i] = { x: 0, y: 0, z: 0 };
    }
    return deltas;
  }

  /**
   * Anatomical landmark displacement across mouth and jaw in head-local coordinates.
   * Proportioned to inter-ocular scale (scale = 1.0) so movements are natural and harmonious.
   */
  evaluateLandmarkDisplacements(p) {
    const deltas = this.createZeroDeltas();
    const { jawDrop, lipOpen, stretch, pucker, rollLower, seal, zProtrude } = p;

    if (jawDrop < 0.001 && lipOpen < 0.001 && Math.abs(stretch) < 0.001 && pucker < 0.001 && rollLower < 0.001 && seal < 0.001) {
      return deltas;
    }

    // Base calibrated displacement units (normalized to head scale)
    const jawY = jawDrop * 0.055;
    const lowerLipY = (jawDrop * 0.045 + lipOpen * 0.050);
    const upperLipY = lipOpen * 0.022;

    // 1. Chin & Mandible Continuous Contour Falloff
    JAW_CONTOUR_WEIGHTS.forEach(({ idx, w }) => {
      deltas[idx].y += jawY * w;
    });

    // 2. Submental & Chin Pad
    FULL_MOUTH_ANATOMY.chinSubmental.forEach((idx) => {
      deltas[idx].y += jawY * 0.75;
    });

    // 3. Lower Outer Lip
    FULL_MOUTH_ANATOMY.lowerOuter.forEach((idx) => {
      if (seal > 0.01) {
        deltas[idx].y -= seal * 0.015;
      } else {
        deltas[idx].y += lowerLipY;
      }
      deltas[idx].z += zProtrude;
      if (rollLower > 0.01) {
        deltas[idx].z -= rollLower * 0.015;
        deltas[idx].y -= rollLower * 0.010;
      }
    });

    // 4. Lower Inner Lip
    FULL_MOUTH_ANATOMY.lowerInner.forEach((idx) => {
      if (seal > 0.01) {
        deltas[idx].y -= seal * 0.020;
      } else {
        deltas[idx].y += lowerLipY * 1.05;
      }
      deltas[idx].z += zProtrude;
      if (rollLower > 0.01) {
        deltas[idx].z -= rollLower * 0.018;
        deltas[idx].y -= rollLower * 0.012;
      }
    });

    // 5. Lower Vermilion
    FULL_MOUTH_ANATOMY.lowerVermilion.forEach((idx) => {
      if (seal > 0.01) {
        deltas[idx].y -= seal * 0.010;
      } else {
        deltas[idx].y += lowerLipY * 0.70;
      }
      deltas[idx].z += zProtrude * 0.7;
    });

    // 6. Upper Outer Lip
    FULL_MOUTH_ANATOMY.upperOuter.forEach((idx) => {
      if (seal > 0.01) {
        deltas[idx].y += seal * 0.012;
      } else {
        deltas[idx].y -= upperLipY;
      }
      deltas[idx].z += zProtrude;
    });

    // 7. Upper Inner Lip
    FULL_MOUTH_ANATOMY.upperInner.forEach((idx) => {
      if (seal > 0.01) {
        deltas[idx].y += seal * 0.015;
      } else {
        deltas[idx].y -= upperLipY * 1.08;
      }
      deltas[idx].z += zProtrude;
    });

    // 8. Upper Vermilion & Philtrum
    FULL_MOUTH_ANATOMY.upperVermilion.forEach((idx) => {
      if (seal > 0.01) {
        deltas[idx].y += seal * 0.008;
      } else {
        deltas[idx].y -= upperLipY * 0.60;
      }
      deltas[idx].z += zProtrude * 0.6;
    });

    // 9. Mouth Corners (Commissures) - Horizontal stretch and pucker
    const cornerStretchX = stretch * 0.028;
    const cornerPuckerX = pucker * 0.022;
    const cornerY = Math.abs(stretch) * 0.008;

    FULL_MOUTH_ANATOMY.leftCorner.forEach((idx) => {
      deltas[idx].x -= cornerStretchX;
      deltas[idx].x += cornerPuckerX;
      deltas[idx].y -= cornerY;
      deltas[idx].z += zProtrude * 0.4;
    });

    FULL_MOUTH_ANATOMY.rightCorner.forEach((idx) => {
      deltas[idx].x += cornerStretchX;
      deltas[idx].x -= cornerPuckerX;
      deltas[idx].y -= cornerY;
      deltas[idx].z += zProtrude * 0.4;
    });

    // 10. Cheeks & Modiolus (Subtle harmonic drag near mouth corners)
    FULL_MOUTH_ANATOMY.cheeksModiolus.forEach((idx) => {
      const isRight = idx > 250;
      deltas[idx].x += (isRight ? 1 : -1) * (stretch * 0.014 - pucker * 0.010);
      deltas[idx].y += jawY * 0.25;
    });

    return deltas;
  }
}
