// Shared pure math helpers for the Math island's interactive components.
// No JSX, no React — safe to import anywhere. UTF-8 safe (superscript map).
// Mirrors the role chem.ts plays for the Chemistry island.

// --- number theory ---
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.trunc(a))
  b = Math.abs(Math.trunc(b))
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return Math.abs((a / gcd(a, b)) * b)
}

export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false
  if (n % 2 === 0) return n === 2
  if (n % 3 === 0) return n === 3
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false
  }
  return true
}

export function primeFactors(n: number): Array<number> {
  const out: Array<number> = []
  let m = Math.abs(Math.trunc(n))
  for (let p = 2; p * p <= m; p++) {
    while (m % p === 0) {
      out.push(p)
      m /= p
    }
  }
  if (m > 1) out.push(m)
  return out
}

// Group prime factors into {prime, power} for e.g. 360 = 2³ · 3² · 5
export function primeFactorPowers(n: number): Array<{ prime: number; power: number }> {
  const map = new Map<number, number>()
  for (const f of primeFactors(n)) map.set(f, (map.get(f) ?? 0) + 1)
  return [...map.entries()].map(([prime, power]) => ({ prime, power }))
}

export function factorsOf(n: number): Array<number> {
  const m = Math.abs(Math.trunc(n))
  const out: Array<number> = []
  for (let i = 1; i * i <= m; i++) {
    if (m % i === 0) {
      out.push(i)
      if (i !== m / i) out.push(m / i)
    }
  }
  return out.sort((a, b) => a - b)
}

// --- fractions ---
export type Frac = { n: number; d: number }
export function simplifyFrac({ n, d }: Frac): Frac {
  if (d === 0) return { n, d }
  const sign = d < 0 ? -1 : 1
  const g = gcd(n, d) || 1
  return { n: (sign * n) / g, d: Math.abs(d) / g }
}
export const addFrac = (a: Frac, b: Frac): Frac =>
  simplifyFrac({ n: a.n * b.d + b.n * a.d, d: a.d * b.d })
export const subFrac = (a: Frac, b: Frac): Frac =>
  simplifyFrac({ n: a.n * b.d - b.n * a.d, d: a.d * b.d })
export const mulFrac = (a: Frac, b: Frac): Frac =>
  simplifyFrac({ n: a.n * b.n, d: a.d * b.d })
export const divFrac = (a: Frac, b: Frac): Frac =>
  simplifyFrac({ n: a.n * b.d, d: a.d * b.n })

// --- formatting ---
const SUP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻',
}
export function toSuperscript(n: number | string): string {
  return String(n)
    .split('')
    .map((c) => SUP[c] ?? c)
    .join('')
}

export function formatNumber(n: number, maxDp = 4): string {
  if (!isFinite(n)) return n > 0 ? '∞' : '−∞'
  const rounded = Number(n.toFixed(maxDp))
  return rounded.toLocaleString('en-US', { maximumFractionDigits: maxDp })
}

// Round to a given number of significant figures.
export function roundSigFig(n: number, sf: number): number {
  if (n === 0) return 0
  const d = Math.ceil(Math.log10(Math.abs(n)))
  const power = sf - d
  const mag = Math.pow(10, power)
  return Math.round(n * mag) / mag
}

// --- plotting helpers (pure; used by graph components) ---
// Linear map from a data domain to a pixel range.
export function makeScale(
  domainMin: number,
  domainMax: number,
  rangeMin: number,
  rangeMax: number,
): (x: number) => number {
  const m = (rangeMax - rangeMin) / (domainMax - domainMin)
  return (x: number) => rangeMin + (x - domainMin) * m
}

// SVG path "d" for y = f(x) over [xmin,xmax], sampled `samples` times, using the
// supplied px/py pixel scales. Lifts the pen across non-finite/huge values so
// asymptotes (1/x, tan) don't draw a vertical streak.
export function fnPath(
  f: (x: number) => number,
  xmin: number,
  xmax: number,
  px: (x: number) => number,
  py: (y: number) => number,
  samples = 160,
  yClamp = 1e4,
): string {
  let d = ''
  let pen = false
  for (let i = 0; i <= samples; i++) {
    const x = xmin + (xmax - xmin) * (i / samples)
    const y = f(x)
    if (!isFinite(y) || Math.abs(y) > yClamp) {
      pen = false
      continue
    }
    d += `${pen ? 'L' : 'M'}${px(x).toFixed(2)} ${py(y).toFixed(2)} `
    pen = true
  }
  return d.trim()
}
