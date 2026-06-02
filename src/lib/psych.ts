// Small statistics + helper functions shared by the Psychology visual
// components: descriptive stats, the normal distribution, correlation, and a
// deterministic RNG (so demo scatter is identical on server and client — no
// Math.random in render, which would break SSR hydration).

/** Clamp x into [min, max]. */
export function clamp(x: number, min: number, max: number): number {
  return x < min ? min : x > max ? max : x
}

/** Linear interpolation between a and b by t in [0,1]. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Arithmetic mean. Returns 0 for an empty array. */
export function mean(xs: ReadonlyArray<number>): number {
  return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0
}

/** Median (sorted middle, average of two for even length). */
export function median(xs: ReadonlyArray<number>): number {
  if (!xs.length) return 0
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

/** Most frequent value(s). Returns the smallest mode for ties. */
export function mode(xs: ReadonlyArray<number>): number {
  if (!xs.length) return 0
  const counts = new Map<number, number>()
  let best = xs[0]
  let bestN = 0
  for (const x of xs) {
    const n = (counts.get(x) ?? 0) + 1
    counts.set(x, n)
    if (n > bestN || (n === bestN && x < best)) {
      best = x
      bestN = n
    }
  }
  return best
}

/** Population standard deviation (divide by N). */
export function stdDev(xs: ReadonlyArray<number>): number {
  if (!xs.length) return 0
  const m = mean(xs)
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length)
}

/** Normal probability-density at x for mean mu and sd sigma. */
export function gaussian(x: number, mu = 0, sigma = 1): number {
  const z = (x - mu) / sigma
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI))
}

/** Standard-normal CDF P(Z <= z) via the Abramowitz-Stegun approximation. */
export function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp(-z * z * 0.5)
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return z > 0 ? 1 - p : p
}

/** Percentile (0-100) of a z-score under the standard normal. */
export function zToPercentile(z: number): number {
  return normalCdf(z) * 100
}

/** Pearson correlation coefficient r of two equal-length series. */
export function pearsonR(
  xs: ReadonlyArray<number>,
  ys: ReadonlyArray<number>,
): number {
  const n = Math.min(xs.length, ys.length)
  if (n === 0) return 0
  const mx = mean(xs.slice(0, n))
  const my = mean(ys.slice(0, n))
  let sxy = 0
  let sxx = 0
  let syy = 0
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx
    const dy = ys[i] - my
    sxy += dx * dy
    sxx += dx * dx
    syy += dy * dy
  }
  const denom = Math.sqrt(sxx * syy)
  return denom === 0 ? 0 : sxy / denom
}

/**
 * Deterministic pseudo-random generator (mulberry32). Returns a function that
 * yields the next value in [0,1). Seed it with a fixed number so the same demo
 * scatter renders identically every time (and on both server and client).
 */
export function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Standard-normal sample via Box-Muller, driven by a [0,1) source. */
export function gaussianSample(next: () => number): number {
  let u = 0
  let v = 0
  while (u === 0) u = next()
  while (v === 0) v = next()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}
