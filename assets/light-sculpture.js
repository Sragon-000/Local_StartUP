// Pure geometry and quality policy shared with the meaningful, non-browser checks.
const TAU = Math.PI * 2;

export function createSculpture(count, seed = 404) {
  if (!Number.isInteger(count) || count < 1) throw new RangeError('Invalid particle count');
  let state = seed >>> 0;
  const random = () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const arrays = {
    Text: new Float32Array(count * 3), Lamp: new Float32Array(count * 4),
    Flower: new Float32Array(count * 3), Wave: new Float32Array(count * 3),
    Scatter: new Float32Array(count * 3), Seed: new Float32Array(count)
  };
  const profile = [[-1.02,.30],[-.98,.31],[-.94,.22],[-.89,.095],[-.84,.065],
    [-.79,.13],[-.70,.23],[-.59,.26],[-.48,.235],[-.36,.17],[-.24,.10],[-.1,.055],[.38,.035]];
  for (let i = 0; i < count; i++) {
    const j = i * 3, k = i * 4;
    arrays.Seed[i] = random();
    // Each prefix contains all lamp parts, so lowering draw count preserves its silhouette.
    const part = random(), a = random() * TAU;
    let x, y, z, kind;
    if (part < .38) {
      const t = random(), angle = Math.floor(random() * 40) / 40 * TAU;
      const r = .29 + .64 * Math.pow(t, 2.7);
      x = Math.cos(angle) * r; z = Math.sin(angle) * r * .66;
      y = .96 - 1.08 * t + Math.cos(angle * 20) * .022 * t;
      kind = 0; // Delicate, curved shade ribs.
    } else if (part < .57) {
      const lower = random() < .82;
      const r = (lower ? .93 : .29) + (random() - .5) * .025;
      x = Math.cos(a) * r; z = Math.sin(a) * r * .66;
      y = (lower ? -.12 + Math.cos(a * 20) * .022 : .96) + (random() - .5) * .045;
      if (lower && random() < .25) y -= random() * .075; // Beaded fringe.
      kind = 1;
    } else if (part < .79) {
      if (random() < .24) {
        const r = .31 * (.82 + random() * .18);
        x = Math.cos(a) * r; z = Math.sin(a) * r * .66; y = -1.025 + random() * .028;
      } else {
        y = -1.02 + random() * 1.40;
        let segment = 0;
        while (segment < profile.length - 2 && profile[segment + 1][0] < y) segment++;
        const [y0, r0] = profile[segment], [y1, r1] = profile[segment + 1];
        const t = (y - y0) / (y1 - y0), smooth = t * t * (3 - 2 * t);
        const r = r0 + (r1 - r0) * smooth;
        const angle = random() < .72 ? Math.floor(a / TAU * 28) / 28 * TAU : a;
        x = Math.cos(angle) * r; z = Math.sin(angle) * r * .66;
      }
      kind = 2; // Sculpted glass stem and elliptical foot.
    } else if (part < .96) {
      const v = random() * 2 - 1, r = Math.cbrt(random()) * .16;
      x = Math.cos(a) * Math.sqrt(1 - v * v) * r;
      z = Math.sin(a) * Math.sqrt(1 - v * v) * r;
      y = .63 + v * r * 1.12;
      kind = 3; // Dense, luminous bulb, deliberately separate from the shade.
    } else {
      const r = .18 + random() * .15;
      x = Math.cos(a) * r; z = Math.sin(a) * r * .5;
      y = .64 + (random() - .5) * .48;
      kind = 4; // A sparse corona rather than an expensive full-screen bloom pass.
    }
    arrays.Lamp.set([x, y, z, kind], k);
    const theta = random() * TAU, t = Math.pow(random(), .7);
    const radius = Math.sin(t * Math.PI * .8) * (.68 + .25 * Math.cos(theta * 5 + t * 1.2)) * (.6 + t * .7);
    arrays.Flower.set([Math.cos(theta) * radius, (t - .5) * 1.8 + Math.cos(theta * 5) * t * t * .18, Math.sin(theta) * radius], j);
    const wx = (random() - .5) * 2.9, wz = (random() - .5) * 1.8;
    arrays.Wave.set([wx, Math.sin(wx * 3 + wz * 2) * .27 + Math.cos(wz * 4) * .13, wz], j);
    const az = random() * TAU, elevation = random() * 2 - 1, r = 1.2 + random() * 1.8;
    arrays.Scatter.set([Math.cos(az) * Math.sqrt(1 - elevation * elevation) * r, elevation * r, Math.sin(az) * Math.sqrt(1 - elevation * elevation) * r], j);
  }
  return arrays;
}

export function qualityLevels({ small = false, constrained = false } = {}) {
  const levels = small
    ? [{ count: 3400, dpr: 1 }, { count: 4800, dpr: 1.15 }, { count: 6800, dpr: 1.4 }]
    : [{ count: 6200, dpr: 1 }, { count: 9800, dpr: 1.35 }, { count: 14000, dpr: 1.75 }];
  return constrained ? levels.slice(0, 2) : levels;
}

// Hysteresis: respond to sustained missed frames, recover slowly, and never exceed the device budget.
export function nextQuality(index, averageFrameMs, stableMs, maxIndex) {
  if (averageFrameMs > 25 && stableMs >= 2400) return Math.max(0, index - 1);
  if (averageFrameMs < 19 && stableMs >= 14000) return Math.min(maxIndex, index + 1);
  return index;
}
