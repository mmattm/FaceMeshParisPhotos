/**
 * High-Precision Audio Formant & Phonetic Lip-Sync Solver
 * 
 * Accurately translates audio acoustics (F1/F2 formants, sibilants, plosives)
 * and phonetic text syllables into precise, anatomically faithful mouth deformations:
 * - M, B, P: Bilabial hermetic lip seal (upper/lower lips pressed together).
 * - F, V: Labiodental tuck (lower lip curled under upper incisors).
 * - O, U: 3D circular protrusion (Z-axis forward projection).
 * - A, E: Vertical jaw aperture.
 * - S, Z, T, D: Sibilant horizontal stretch & close dental alignment.
 */

export class AudioLipSyncSolver {
  constructor(analyserNode) {
    this.analyser = analyserNode;
    this.freqData = new Uint8Array(256);
    this.fps = 60;
  }

  /**
   * Real-time spectral analysis of currently playing voice audio
   */
  analyzeRealtimeAudio() {
    if (!this.analyser) return { energy: 0, f1: 0, f2: 0, sibilance: 0 };

    this.analyser.getByteFrequencyData(this.freqData);

    // FFT Size 512, sample rate ~48000Hz -> ~93.75 Hz per bin
    // Low Band (F1: 150 - 800 Hz) -> bins 2 to 9
    let lowEnergy = 0;
    for (let i = 2; i <= 9; i++) lowEnergy += this.freqData[i];
    lowEnergy /= 8 * 255;

    // Mid Band (F2: 900 - 2400 Hz) -> bins 10 to 25
    let midEnergy = 0;
    for (let i = 10; i <= 25; i++) midEnergy += this.freqData[i];
    midEnergy /= 16 * 255;

    // High Band (Sibilants/Fricatives: 3500 - 8000 Hz) -> bins 37 to 85
    let highEnergy = 0;
    for (let i = 37; i <= 85; i++) highEnergy += this.freqData[i];
    highEnergy /= 49 * 255;

    const totalEnergy = (lowEnergy * 0.5 + midEnergy * 0.3 + highEnergy * 0.2);

    return {
      energy: totalEnergy,
      f1: lowEnergy,      // Correlates to jaw opening & lower lip drop
      f2: midEnergy,      // Correlates to front/back vowel dispersion
      sibilance: highEnergy // Correlates to sibilant / fricative dental stretch
    };
  }

  /**
   * Generates high-fidelity phonetic speech trajectory from text and audio duration
   */
  generatePhoneticTrack(text, durationMs) {
    const clean = text.toLowerCase().trim();
    const words = clean.split(/\s+/);
    const phonemeSequence = [];

    let timeCursor = 0;
    // Initial lead-in resting pose
    phonemeSequence.push({ timeMs: 0, type: 'REST', dur: 100 });
    timeCursor += 100;

    // Estimate raw durations per letter
    const letters = [];
    for (let w = 0; w < words.length; w++) {
      const word = words[w];
      let i = 0;
      while (i < word.length) {
        const c = word[i];
        const next = word[i + 1] || '';
        const pair = c + next;

        if (pair === 'ou' || pair === 'oo' || pair === 'au' || pair === 'eau') {
          letters.push({ type: 'ROUNDED_O', weight: 1.3 });
          i += pair.length;
        } else if (pair === 'ch' || pair === 'sh') {
          letters.push({ type: 'SIBILANT_SH', weight: 1.1 });
          i += 2;
        } else if (pair === 'ph') {
          letters.push({ type: 'LABIODENTAL_FV', weight: 1.0 });
          i += 2;
        } else if ('aàâä'.includes(c)) {
          letters.push({ type: 'OPEN_A', weight: 1.2 });
          i++;
        } else if ('oôö'.includes(c)) {
          letters.push({ type: 'ROUNDED_O', weight: 1.2 });
          i++;
        } else if ('uûüw'.includes(c)) {
          letters.push({ type: 'PROTRUDED_U', weight: 1.1 });
          i++;
        } else if ('eéèêë'.includes(c)) {
          letters.push({ type: 'SPREAD_E', weight: 1.0 });
          i++;
        } else if ('iîïy'.includes(c)) {
          letters.push({ type: 'SPREAD_I', weight: 1.0 });
          i++;
        } else if ('mbp'.includes(c)) {
          letters.push({ type: 'BILABIAL_MBP', weight: 0.85 });
          i++;
        } else if ('fv'.includes(c)) {
          letters.push({ type: 'LABIODENTAL_FV', weight: 0.9 });
          i++;
        } else if ('szcçj'.includes(c)) {
          letters.push({ type: 'SIBILANT_SZ', weight: 0.9 });
          i++;
        } else if ('tdn'.includes(c)) {
          letters.push({ type: 'DENTAL_TD', weight: 0.85 });
          i++;
        } else if ('kgq'.includes(c)) {
          letters.push({ type: 'VELAR_KG', weight: 0.85 });
          i++;
        } else if (c === 'l') {
          letters.push({ type: 'ALVEOLAR_L', weight: 0.85 });
          i++;
        } else if (c === 'r') {
          letters.push({ type: 'RHOTIC_R', weight: 0.9 });
          i++;
        } else if (',;.!?'.includes(c)) {
          letters.push({ type: 'REST', weight: 1.8 });
          i++;
        } else {
          letters.push({ type: 'OPEN_A', weight: 0.8 });
          i++;
        }
      }
      letters.push({ type: 'REST', weight: 0.6 }); // Word pause
    }
    letters.push({ type: 'REST', weight: 1.5 }); // Final pause

    // Sum weights and distribute across actual audio duration
    const totalWeight = letters.reduce((acc, l) => acc + l.weight, 0);
    const msPerWeight = Math.max(20, (durationMs - 150) / Math.max(1, totalWeight));

    letters.forEach(item => {
      const dur = Math.round(item.weight * msPerWeight);
      phonemeSequence.push({
        timeMs: timeCursor,
        type: item.type,
        dur
      });
      timeCursor += dur;
    });

    const finalDurationMs = Math.max(durationMs, timeCursor);
    const totalFrames = Math.ceil((finalDurationMs / 1000) * this.fps);
    const frames = [];

    // Synthesize 60 FPS frames
    for (let f = 0; f < totalFrames; f++) {
      const frameTimeMs = (f / this.fps) * 1000;

      // Locate surrounding phoneme keyframes
      let k0 = 0;
      for (let k = 0; k < phonemeSequence.length; k++) {
        if (phonemeSequence[k].timeMs <= frameTimeMs) {
          k0 = k;
        } else {
          break;
        }
      }
      const k1 = Math.min(phonemeSequence.length - 1, k0 + 1);
      const p0 = phonemeSequence[k0];
      const p1 = phonemeSequence[k1];

      let alpha = 0;
      const dt = p1.timeMs - p0.timeMs;
      if (dt > 0.001) {
        const u = Math.max(0, Math.min(1, (frameTimeMs - p0.timeMs) / dt));
        alpha = u * u * (3 - 2 * u); // Hermite smoothstep
      }

      const bs0 = this.getPhonemeBlendshapes(p0.type);
      const bs1 = this.getPhonemeBlendshapes(p1.type);

      const blendedBs = {};
      const allKeys = new Set([...Object.keys(bs0), ...Object.keys(bs1)]);
      allKeys.forEach(key => {
        const v0 = bs0[key] || 0;
        const v1 = bs1[key] || 0;
        blendedBs[key] = v0 * (1 - alpha) + v1 * alpha;
      });

      // Compute exact 3D landmark deformation deltas (478 points)
      const deltas = this.computeLandmarkDeltas(blendedBs, p0.type, p1.type, alpha);

      frames.push({
        timeOffsetMs: frameTimeMs,
        blendshapes: blendedBs,
        deltas
      });
    }

    return {
      durationMs: finalDurationMs,
      frames
    };
  }

  /**
   * Blendshape profiles for phonemes
   */
  getPhonemeBlendshapes(type) {
    switch (type) {
      case 'OPEN_A':
        return { jawOpen: 0.92, mouthLowerDownLeft: 0.6, mouthLowerDownRight: 0.6, mouthUpperUpLeft: 0.3, mouthUpperUpRight: 0.3 };
      case 'ROUNDED_O':
        return { jawOpen: 0.55, mouthFunnel: 0.95, mouthPucker: 0.85, mouthLowerDownLeft: 0.35, mouthLowerDownRight: 0.35 };
      case 'PROTRUDED_U':
        return { jawOpen: 0.30, mouthPucker: 1.0, mouthFunnel: 0.85 };
      case 'SPREAD_E':
        return { jawOpen: 0.38, mouthSmileLeft: 0.7, mouthSmileRight: 0.7, mouthStretchLeft: 0.6, mouthStretchRight: 0.6, mouthUpperUpLeft: 0.4, mouthUpperUpRight: 0.4 };
      case 'SPREAD_I':
        return { jawOpen: 0.25, mouthSmileLeft: 0.85, mouthSmileRight: 0.85, mouthStretchLeft: 0.75, mouthStretchRight: 0.75, mouthUpperUpLeft: 0.4, mouthUpperUpRight: 0.4 };
      case 'BILABIAL_MBP':
        return { mouthClose: 1.0, mouthPressLeft: 0.95, mouthPressRight: 0.95, jawOpen: 0.0 };
      case 'LABIODENTAL_FV':
        return { mouthRollLower: 0.9, mouthUpperUpLeft: 0.45, mouthUpperUpRight: 0.45, jawOpen: 0.22 };
      case 'SIBILANT_SZ':
      case 'SIBILANT_SH':
        return { mouthStretchLeft: 0.65, mouthStretchRight: 0.65, mouthUpperUpLeft: 0.4, mouthUpperUpRight: 0.4, jawOpen: 0.22, mouthLowerDownLeft: 0.2, mouthLowerDownRight: 0.2 };
      case 'DENTAL_TD':
        return { jawOpen: 0.35, mouthUpperUpLeft: 0.35, mouthUpperUpRight: 0.35, mouthLowerDownLeft: 0.25, mouthLowerDownRight: 0.25 };
      case 'VELAR_KG':
        return { jawOpen: 0.50, mouthLowerDownLeft: 0.45, mouthLowerDownRight: 0.45 };
      case 'ALVEOLAR_L':
        return { jawOpen: 0.40, mouthUpperUpLeft: 0.35, mouthUpperUpRight: 0.35 };
      case 'RHOTIC_R':
        return { jawOpen: 0.35, mouthFunnel: 0.45, mouthPucker: 0.4 };
      case 'REST':
      default:
        return { jawOpen: 0.0, mouthClose: 0.0, mouthFunnel: 0.0, mouthPucker: 0.0, mouthSmileLeft: 0.0, mouthSmileRight: 0.0 };
    }
  }

  /**
   * Anatomically faithful 3D landmark displacements for 478 MediaPipe points
   */
  computeLandmarkDeltas(bs, type0, type1, alpha) {
    const deltas = new Array(478);
    for (let i = 0; i < 478; i++) {
      deltas[i] = { x: 0, y: 0, z: 0 };
    }

    const jaw = bs.jawOpen || 0;
    const funnel = bs.mouthFunnel || 0;
    const pucker = bs.mouthPucker || 0;
    const smile = ((bs.mouthSmileLeft || 0) + (bs.mouthSmileRight || 0)) / 2;
    const close = bs.mouthClose || 0;
    const roll = bs.mouthRollLower || 0;
    const upperUp = ((bs.mouthUpperUpLeft || 0) + (bs.mouthUpperUpRight || 0)) / 2;
    const lowerDown = ((bs.mouthLowerDownLeft || 0) + (bs.mouthLowerDownRight || 0)) / 2;
    const stretch = ((bs.mouthStretchLeft || 0) + (bs.mouthStretchRight || 0)) / 2;

    // 1. Lower Lip & Chin Vertical Drop
    const lowerLip = [14, 15, 16, 17, 84, 85, 86, 87, 88, 314, 315, 316, 317, 318, 152, 175, 199, 200];
    lowerLip.forEach(idx => {
      // If Bilabial M/B/P is active, lock lips tight!
      const effectiveJaw = jaw * (1.0 - close * 0.95);
      deltas[idx].y += (effectiveJaw * 0.16 + lowerDown * 0.09) - (close * 0.08);
      // 3D forward projection for O / U vowels (Z-depth protrusion)
      deltas[idx].z += (funnel * 0.10 + pucker * 0.12);
    });

    // 2. Upper Lip Lift & 3D Protrusion
    const upperLip = [0, 11, 12, 13, 37, 39, 40, 267, 269, 270, 61, 291];
    upperLip.forEach(idx => {
      deltas[idx].y -= upperUp * 0.07;
      deltas[idx].z += (funnel * 0.10 + pucker * 0.12);
      if (close > 0.5) {
        deltas[idx].y += close * 0.04; // Upper lip presses downward into seal
      }
    });

    // 3. Mouth Corners (Smile & Stretch vs Funnel Pinch)
    const leftCorner = [61, 76, 77, 78, 95];
    leftCorner.forEach(idx => {
      deltas[idx].x -= (smile * 0.07 + stretch * 0.05);
      deltas[idx].y -= smile * 0.04;
      deltas[idx].x += (funnel * 0.05 + pucker * 0.06); // Pucker draws corners inward
    });

    const rightCorner = [291, 306, 307, 308, 324];
    rightCorner.forEach(idx => {
      deltas[idx].x += (smile * 0.07 + stretch * 0.05);
      deltas[idx].y -= smile * 0.04;
      deltas[idx].x -= (funnel * 0.05 + pucker * 0.06);
    });

    // 4. Labiodental F/V Lower Lip Curl (Tucks up & inward under upper teeth)
    if (roll > 0.1) {
      const rollIndices = [14, 15, 87, 317, 88, 318];
      rollIndices.forEach(idx => {
        deltas[idx].z -= roll * 0.08; // Retract inward
        deltas[idx].y -= roll * 0.05; // Move up towards upper teeth
      });
    }

    return deltas;
  }
}
