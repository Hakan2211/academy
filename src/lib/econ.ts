// Shared math helpers for the Economics island interactives. Pure + SSR-safe
// (no Math.random in render paths — use rng(seed) for deterministic jitter).
// Mirrors src/lib/psych.ts / cs.ts conventions.

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

/** Percent change from `from` to `to`, as a fraction (0.1 = +10%). */
export function pctChange(from: number, to: number): number {
  if (from === 0) return 0
  return (to - from) / from
}

/**
 * Midpoint (arc) price elasticity of demand between two (price, quantity)
 * points. Returns the magnitude (always ≥ 0). >1 elastic, <1 inelastic, =1 unit.
 */
export function midpointElasticity(
  p1: number, q1: number, p2: number, q2: number,
): number {
  const dq = q2 - q1
  const dp = p2 - p1
  const qAvg = (q1 + q2) / 2
  const pAvg = (p1 + p2) / 2
  if (qAvg === 0 || pAvg === 0 || dp === 0) return 0
  const pctQ = dq / qAvg
  const pctP = dp / pAvg
  return Math.abs(pctQ / pctP)
}

/** Future value of `principal` growing at `ratePct` percent per period. */
export function compound(principal: number, ratePct: number, periods: number): number {
  return principal * (1 + ratePct / 100) ** periods
}

/** Approximate doubling time (periods) at `ratePct` percent growth — the rule of 70. */
export function ruleOf70(ratePct: number): number {
  if (ratePct <= 0) return Infinity
  return 70 / ratePct
}

/**
 * Cumulative population/income share points for a Lorenz curve, given a list of
 * incomes. Returns [{p, l}] from (0,0) to (1,1), p = cumulative share of people,
 * l = cumulative share of income (both 0..1), sorted poorest → richest.
 */
export function lorenzPoints(incomes: Array<number>): Array<{ p: number; l: number }> {
  const xs = [...incomes].sort((a, b) => a - b)
  const n = xs.length
  const total = xs.reduce((s, v) => s + v, 0)
  const pts: Array<{ p: number; l: number }> = [{ p: 0, l: 0 }]
  if (n === 0 || total === 0) return [{ p: 0, l: 0 }, { p: 1, l: 1 }]
  let cum = 0
  for (let i = 0; i < n; i++) {
    cum += xs[i]
    pts.push({ p: (i + 1) / n, l: cum / total })
  }
  return pts
}

/** Gini coefficient (0 = perfect equality, 1 = maximal inequality) of incomes. */
export function gini(incomes: Array<number>): number {
  const xs = [...incomes].sort((a, b) => a - b)
  const n = xs.length
  const total = xs.reduce((s, v) => s + v, 0)
  if (n === 0 || total === 0) return 0
  let weighted = 0
  for (let i = 0; i < n; i++) weighted += (i + 1) * xs[i]
  // mean-based formula: G = (2·Σ i·xᵢ)/(n·Σxᵢ) − (n+1)/n
  return (2 * weighted) / (n * total) - (n + 1) / n
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

/** Format a number as whole dollars, e.g. 1234 → "$1,234". */
export function formatUSD(n: number): string {
  const sign = n < 0 ? '-' : ''
  return sign + '$' + Math.abs(Math.round(n)).toLocaleString('en-US')
}

/** Format a fraction as a percent string, e.g. 0.125 → "12.5%". */
export function formatPct(frac: number, dp = 1): string {
  return (frac * 100).toFixed(dp) + '%'
}
