// Shared math helpers for the Health island interactives. Pure + SSR-safe
// (no Math.random in render paths — use rng(seed) for deterministic jitter).
// Mirrors src/lib/econ.ts / philo.ts conventions.

export function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function round(n: number, dp = 0): number {
  const f = 10 ** dp
  return Math.round(n * f) / f
}

/** Age-predicted maximum heart rate (the classic 220 − age estimate, bpm). */
export function maxHeartRate(age: number): number {
  return 220 - age
}

/**
 * Target heart-rate zone for a given intensity band, as [low, high] bpm,
 * using the simple percent-of-max method. Bands: moderate ≈ 50–70%,
 * vigorous ≈ 70–85% of max HR.
 */
export function hrZone(age: number, loPct: number, hiPct: number): [number, number] {
  const mhr = maxHeartRate(age)
  return [Math.round(mhr * loPct), Math.round(mhr * hiPct)]
}

/**
 * Herd-immunity threshold: the fraction of a population that must be immune to
 * stop sustained spread, 1 − 1/R₀. Returns 0..1 (0 if R₀ ≤ 1).
 */
export function herdThreshold(r0: number): number {
  if (r0 <= 1) return 0
  return 1 - 1 / r0
}

/**
 * Rough blood-alcohol concentration (%, g/100 mL) via the Widmark estimate.
 * standardDrinks × 14 g each; r = body-water constant (≈0.68 male, 0.55 female);
 * subtract metabolism of ~0.015%/hour. Educational approximation only.
 */
export function widmarkBAC(
  standardDrinks: number,
  bodyKg: number,
  hours: number,
  r = 0.68,
): number {
  const gramsAlcohol = standardDrinks * 14
  const bodyGrams = bodyKg * 1000
  const raw = (gramsAlcohol / (bodyGrams * r)) * 100 // %
  return Math.max(0, raw - 0.015 * hours)
}

/** Body Mass Index = mass(kg) / height(m)². */
export function bmi(kg: number, meters: number): number {
  if (meters <= 0) return 0
  return kg / (meters * meters)
}

/** Deterministic PRNG (mulberry32) — seed in, () => number in [0, 1). */
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

/** Format minutes as "Hh Mm" or "Mm", e.g. 150 → "2h 30m". */
export function formatMinutes(min: number): string {
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

/** Format a fraction as a percent string, e.g. 0.125 → "12.5%". */
export function formatPct(frac: number, dp = 0): string {
  return (frac * 100).toFixed(dp) + '%'
}
