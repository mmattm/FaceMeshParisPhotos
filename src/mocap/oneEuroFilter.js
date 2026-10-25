/**
 * OneEuroFilter (1€ Filter)
 * Ultra-low latency adaptive low-pass filter for smooth motion capture tracking
 * Eliminates high-frequency jitter when stationary while preserving responsiveness during rapid movement.
 * Based on Casiez et al., CHI 2012.
 */

class LowPassFilter {
  constructor(alpha, initVal = 0) {
    this.y = initVal;
    this.s = initVal;
    this.setAlpha(alpha);
    this.initialized = false;
  }

  setAlpha(alpha) {
    if (alpha <= 0 || alpha > 1.0) {
      alpha = 0.5;
    }
    this.alpha = alpha;
  }

  filter(value) {
    let result;
    if (this.initialized) {
      result = this.alpha * value + (1.0 - this.alpha) * this.s;
    } else {
      result = value;
      this.initialized = true;
    }
    this.y = value;
    this.s = result;
    return result;
  }

  lastValue() {
    return this.s;
  }

  reset() {
    this.initialized = false;
  }
}

export class OneEuroFilter {
  constructor(freq = 60, minCutoff = 1.0, beta = 0.007, dCutoff = 1.0) {
    this.freq = freq;
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
    this.x = new LowPassFilter(this.alpha(minCutoff));
    this.dx = new LowPassFilter(this.alpha(dCutoff));
    this.lastTime = null;
  }

  alpha(cutoff) {
    const te = 1.0 / this.freq;
    const tau = 1.0 / (2 * Math.PI * cutoff);
    return 1.0 / (1.0 + tau / te);
  }

  filter(value, timestamp = null) {
    if (this.lastTime !== null && timestamp !== null) {
      const dt = (timestamp - this.lastTime) / 1000.0;
      if (dt > 0) {
        this.freq = 1.0 / dt;
      }
    }
    this.lastTime = timestamp;

    const prevX = this.x.lastValue();
    const dx = this.x.initialized ? (value - prevX) * this.freq : 0;
    const edx = this.dx.filter(dx);
    const cutoff = this.minCutoff + this.beta * Math.abs(edx);
    this.x.setAlpha(this.alpha(cutoff));
    return this.x.filter(value);
  }

  reset() {
    this.x.reset();
    this.dx.reset();
    this.lastTime = null;
  }
}

/**
 * Multi-dimensional 1€ Filter for arrays of points/landmarks or blendshapes
 */
export class MultiOneEuroFilter {
  constructor(size = 478, minCutoff = 1.2, beta = 0.01) {
    this.size = size;
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.filters = [];
    this.init(size);
  }

  init(size) {
    this.size = size;
    this.filters = Array.from({ length: size }, () => ({
      x: new OneEuroFilter(60, this.minCutoff, this.beta),
      y: new OneEuroFilter(60, this.minCutoff, this.beta),
      z: new OneEuroFilter(60, this.minCutoff, this.beta)
    }));
  }

  filterLandmarks(landmarks, timestamp) {
    if (!landmarks || landmarks.length === 0) return landmarks;
    if (this.filters.length !== landmarks.length) {
      this.init(landmarks.length);
    }

    return landmarks.map((lm, i) => {
      const f = this.filters[i];
      return {
        x: f.x.filter(lm.x, timestamp),
        y: f.y.filter(lm.y, timestamp),
        z: lm.z !== undefined ? f.z.filter(lm.z, timestamp) : 0,
        visibility: lm.visibility
      };
    });
  }

  reset() {
    this.filters.forEach(f => {
      f.x.reset();
      f.y.reset();
      f.z.reset();
    });
  }
}
