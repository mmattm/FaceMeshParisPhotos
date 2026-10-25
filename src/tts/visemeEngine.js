/**
 * Text-to-Viseme Lip-Sync Synthesizer
 * Converts arbitrary text into continuous, realistic 60 FPS blendshape and landmark lip-sync animation tracks.
 */

// Viseme definitions with corresponding ARKit blendshape activations
const VISEME_PROFILES = {
  REST: {
    jawOpen: 0.0, mouthClose: 0.0, mouthFunnel: 0.0, mouthPucker: 0.0,
    mouthSmile: 0.0, mouthStretch: 0.0, mouthRollLower: 0.0, mouthUpperUp: 0.0, mouthLowerDown: 0.0
  },
  A: {
    jawOpen: 0.85, mouthLowerDown: 0.55, mouthUpperUp: 0.25,
    mouthFunnel: 0.0, mouthPucker: 0.0, mouthClose: 0.0
  },
  O: {
    jawOpen: 0.55, mouthFunnel: 0.95, mouthPucker: 0.80, mouthLowerDown: 0.3,
    mouthClose: 0.0, mouthSmile: 0.0
  },
  U: {
    jawOpen: 0.30, mouthPucker: 0.95, mouthFunnel: 0.75,
    mouthClose: 0.0, mouthSmile: 0.0
  },
  E: {
    jawOpen: 0.35, mouthSmile: 0.65, mouthStretch: 0.55, mouthUpperUp: 0.35,
    mouthFunnel: 0.0, mouthPucker: 0.0
  },
  I: {
    jawOpen: 0.25, mouthSmile: 0.75, mouthStretch: 0.65, mouthUpperUp: 0.35,
    mouthFunnel: 0.0, mouthPucker: 0.0
  },
  MBP: {
    mouthClose: 1.0, mouthPress: 0.95, jawOpen: 0.0,
    mouthFunnel: 0.0, mouthPucker: 0.0
  },
  FV: {
    mouthRollLower: 0.85, mouthUpperUp: 0.35, jawOpen: 0.22,
    mouthClose: 0.0
  },
  SZ: {
    mouthStretch: 0.55, mouthUpperUp: 0.35, jawOpen: 0.25, mouthLowerDown: 0.2,
    mouthClose: 0.0
  },
  TD: {
    jawOpen: 0.35, mouthUpperUp: 0.35, mouthLowerDown: 0.25,
    mouthClose: 0.0
  },
  KG: {
    jawOpen: 0.50, mouthLowerDown: 0.40,
    mouthClose: 0.0
  },
  L: {
    jawOpen: 0.40, mouthUpperUp: 0.30,
    mouthClose: 0.0
  },
  R: {
    jawOpen: 0.35, mouthFunnel: 0.40, mouthPucker: 0.35,
    mouthClose: 0.0
  }
};

export class VisemeEngine {
  constructor() {
    this.fps = 60;
  }

  /**
   * Converts input text into timed phonetic viseme keyframes
   */
  generateKeyframes(text, speechRate = 1.0) {
    const cleanText = text.toLowerCase().trim();
    const words = cleanText.split(/\s+/);
    const keyframes = [];

    let currentTimeMs = 0;
    // Base pause before speaking
    keyframes.push({ timeMs: currentTimeMs, viseme: 'REST', durationMs: 80 });
    currentTimeMs += 80;

    const baseUnitMs = Math.round(140 / Math.max(0.5, speechRate));

    for (let w = 0; w < words.length; w++) {
      const word = words[w];
      let i = 0;

      while (i < word.length) {
        const char = word[i];
        const next = word[i + 1] || '';
        const pair = char + next;
        let viseme = 'REST';
        let duration = baseUnitMs;

        // Digraph / diphthong checks (FR & EN phonetics)
        if (pair === 'ou' || pair === 'oo') {
          viseme = 'U';
          duration = baseUnitMs * 1.3;
          i += 2;
        } else if (pair === 'au' || pair === 'eau' || pair === 'oh') {
          viseme = 'O';
          duration = baseUnitMs * 1.3;
          i += 2;
        } else if (pair === 'ai' || pair === 'ei' || pair === 'ee' || pair === 'ea') {
          viseme = 'E';
          duration = baseUnitMs * 1.2;
          i += 2;
        } else if (pair === 'ch' || pair === 'sh') {
          viseme = 'SZ';
          duration = baseUnitMs * 0.9;
          i += 2;
        } else if (pair === 'th' || pair === 'ph') {
          viseme = pair === 'ph' ? 'FV' : 'TD';
          duration = baseUnitMs * 0.9;
          i += 2;
        } else if ('aàâä'.includes(char)) {
          viseme = 'A';
          duration = baseUnitMs * 1.1;
          i++;
        } else if ('oôö'.includes(char)) {
          viseme = 'O';
          duration = baseUnitMs * 1.1;
          i++;
        } else if ('uûüw'.includes(char)) {
          viseme = 'U';
          duration = baseUnitMs * 1.0;
          i++;
        } else if ('eéèêë'.includes(char)) {
          viseme = 'E';
          duration = baseUnitMs * 0.95;
          i++;
        } else if ('iîïy'.includes(char)) {
          viseme = 'I';
          duration = baseUnitMs * 0.95;
          i++;
        } else if ('mbp'.includes(char)) {
          viseme = 'MBP';
          duration = baseUnitMs * 0.8;
          i++;
        } else if ('fv'.includes(char)) {
          viseme = 'FV';
          duration = baseUnitMs * 0.85;
          i++;
        } else if ('szcçj'.includes(char)) {
          viseme = 'SZ';
          duration = baseUnitMs * 0.85;
          i++;
        } else if ('tdn'.includes(char)) {
          viseme = 'TD';
          duration = baseUnitMs * 0.8;
          i++;
        } else if ('kgq'.includes(char)) {
          viseme = 'KG';
          duration = baseUnitMs * 0.8;
          i++;
        } else if (char === 'l') {
          viseme = 'L';
          duration = baseUnitMs * 0.85;
          i++;
        } else if (char === 'r') {
          viseme = 'R';
          duration = baseUnitMs * 0.9;
          i++;
        } else if (',;.!?'.includes(char)) {
          viseme = 'REST';
          duration = baseUnitMs * 1.6;
          i++;
        } else {
          viseme = 'A';
          duration = baseUnitMs * 0.7;
          i++;
        }

        keyframes.push({
          timeMs: currentTimeMs,
          viseme,
          durationMs: duration
        });
        currentTimeMs += duration;
      }

      // Inter-word brief relaxation pause
      keyframes.push({
        timeMs: currentTimeMs,
        viseme: 'REST',
        durationMs: baseUnitMs * 0.5
      });
      currentTimeMs += baseUnitMs * 0.5;
    }

    // Final closing rest
    keyframes.push({
      timeMs: currentTimeMs,
      viseme: 'REST',
      durationMs: 150
    });
    currentTimeMs += 150;

    return {
      keyframes,
      totalDurationMs: currentTimeMs
    };
  }

  /**
   * Generates continuous 60fps Blendshape frames from keyframes
   */
  generateSpeechTrack(text, speechRate = 1.0, actualAudioDurationMs = null) {
    const { keyframes, totalDurationMs } = this.generateKeyframes(text, speechRate);
    
    // Scale timeline to match actual synthesized speech audio duration if available
    const finalDurationMs = actualAudioDurationMs ? Math.max(actualAudioDurationMs, totalDurationMs) : totalDurationMs;
    const timeScale = actualAudioDurationMs ? (actualAudioDurationMs / Math.max(1, totalDurationMs)) : 1.0;

    const totalFrames = Math.ceil((finalDurationMs / 1000) * this.fps);
    const frames = [];

    // Pre-calculate viseme targets
    const timedTargets = keyframes.map(kf => ({
      timeMs: kf.timeMs * timeScale,
      profile: VISEME_PROFILES[kf.viseme] || VISEME_PROFILES.REST
    }));

    for (let f = 0; f < totalFrames; f++) {
      const frameTimeMs = (f / this.fps) * 1000;

      // Find bounding keyframe targets
      let idx0 = 0;
      for (let k = 0; k < timedTargets.length; k++) {
        if (timedTargets[k].timeMs <= frameTimeMs) {
          idx0 = k;
        } else {
          break;
        }
      }
      const idx1 = Math.min(timedTargets.length - 1, idx0 + 1);

      const t0 = timedTargets[idx0];
      const t1 = timedTargets[idx1];

      let alpha = 0;
      const dt = t1.timeMs - t0.timeMs;
      if (dt > 0.001) {
        // Smoothstep interpolation
        const linear = Math.max(0, Math.min(1, (frameTimeMs - t0.timeMs) / dt));
        alpha = linear * linear * (3 - 2 * linear);
      }

      // Interpolate blendshape values
      const p0 = t0.profile;
      const p1 = t1.profile;
      const blendshapes = {
        jawOpen: (p0.jawOpen || 0) * (1 - alpha) + (p1.jawOpen || 0) * alpha,
        mouthClose: (p0.mouthClose || 0) * (1 - alpha) + (p1.mouthClose || 0) * alpha,
        mouthFunnel: (p0.mouthFunnel || 0) * (1 - alpha) + (p1.mouthFunnel || 0) * alpha,
        mouthPucker: (p0.mouthPucker || 0) * (1 - alpha) + (p1.mouthPucker || 0) * alpha,
        mouthSmileLeft: (p0.mouthSmile || 0) * (1 - alpha) + (p1.mouthSmile || 0) * alpha,
        mouthSmileRight: (p0.mouthSmile || 0) * (1 - alpha) + (p1.mouthSmile || 0) * alpha,
        mouthStretchLeft: (p0.mouthStretch || 0) * (1 - alpha) + (p1.mouthStretch || 0) * alpha,
        mouthStretchRight: (p0.mouthStretch || 0) * (1 - alpha) + (p1.mouthStretch || 0) * alpha,
        mouthRollLower: (p0.mouthRollLower || 0) * (1 - alpha) + (p1.mouthRollLower || 0) * alpha,
        mouthUpperUpLeft: (p0.mouthUpperUp || 0) * (1 - alpha) + (p1.mouthUpperUp || 0) * alpha,
        mouthUpperUpRight: (p0.mouthUpperUp || 0) * (1 - alpha) + (p1.mouthUpperUp || 0) * alpha,
        mouthLowerDownLeft: (p0.mouthLowerDown || 0) * (1 - alpha) + (p1.mouthLowerDown || 0) * alpha,
        mouthLowerDownRight: (p0.mouthLowerDown || 0) * (1 - alpha) + (p1.mouthLowerDown || 0) * alpha
      };

      // Generate local deformation delta vectors (478 points) for the mouth & jaw
      const deltas = this.buildDeltasFromBlendshapes(blendshapes);

      frames.push({
        timeOffsetMs: frameTimeMs,
        blendshapes,
        deltas
      });
    }

    return {
      durationMs: finalDurationMs,
      frames
    };
  }

  /**
   * Converts blendshape activations to 3D deformation deltas on the 478 face landmarks
   */
  buildDeltasFromBlendshapes(bs) {
    const deltas = new Array(478);
    for (let i = 0; i < 478; i++) {
      deltas[i] = { x: 0, y: 0, z: 0 };
    }

    const jaw = bs.jawOpen || 0;
    const funnel = bs.mouthFunnel || 0;
    const pucker = bs.mouthPucker || 0;
    const smile = (bs.mouthSmileLeft + bs.mouthSmileRight) / 2 || 0;
    const close = bs.mouthClose || 0;
    const roll = bs.mouthRollLower || 0;
    const upperUp = (bs.mouthUpperUpLeft + bs.mouthUpperUpRight) / 2 || 0;
    const lowerDown = (bs.mouthLowerDownLeft + bs.mouthLowerDownRight) / 2 || 0;

    // Lower Lip & Chin (Jaw Drop)
    const lowerLip = [14, 15, 16, 17, 84, 85, 86, 87, 88, 314, 315, 316, 317, 318, 152, 175, 199, 200];
    lowerLip.forEach(idx => {
      deltas[idx].y += (jaw * 0.14 + lowerDown * 0.08) - (close * 0.05);
      deltas[idx].z += (funnel * 0.08 + pucker * 0.10);
    });

    // Upper Lip
    const upperLip = [0, 11, 12, 13, 37, 39, 40, 267, 269, 270, 61, 291];
    upperLip.forEach(idx => {
      deltas[idx].y -= upperUp * 0.06;
      deltas[idx].z += (funnel * 0.08 + pucker * 0.10);
    });

    // Mouth Corners (Smile & Stretch)
    const leftCorner = [61, 76, 77, 78, 95];
    leftCorner.forEach(idx => {
      deltas[idx].x -= smile * 0.06;
      deltas[idx].y -= smile * 0.05;
      deltas[idx].x += (funnel + pucker) * 0.04;
    });

    const rightCorner = [291, 306, 307, 308, 324];
    rightCorner.forEach(idx => {
      deltas[idx].x += smile * 0.06;
      deltas[idx].y -= smile * 0.05;
      deltas[idx].x -= (funnel + pucker) * 0.04;
    });

    // Lower lip curl/roll (F/V sounds)
    const rollIndices = [14, 15, 87, 317];
    rollIndices.forEach(idx => {
      deltas[idx].z -= roll * 0.06;
      deltas[idx].y -= roll * 0.04;
    });

    return deltas;
  }
}
