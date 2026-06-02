import { useState } from 'react'
import { isPrime, primeFactorPowers, toSuperscript } from '#/lib/math'

// Prime factor tree. Split a number by its smallest prime factor again and again
// until only primes remain at the leaves — the unique "prime fingerprint" of the
// number (the Fundamental Theorem of Arithmetic). Reused in the deep-dive.
const PRESETS = [24, 36, 60, 100, 84]

function buildChain(start: number) {
  const steps: Array<{ value: number; prime: number }> = []
  let m = start
  while (m > 1 && !isPrime(m)) {
    let p = 2
    while (m % p !== 0) p++
    steps.push({ value: m, prime: p })
    m = m / p
  }
  return { steps, lastPrime: m }
}

export function FactorTree() {
  const [n, setN] = useState(60)
  const { steps, lastPrime } = buildChain(n)
  const L = steps.length

  const cx = (i: number) => 56 + i * 48
  const cy = (i: number) => 30 + i * 44
  const W = cx(L) + 50
  const H = cy(L) + 30

  const factorisation = primeFactorPowers(n)
    .map(({ prime, power }) => (power > 1 ? `${prime}${toSuperscript(power)}` : `${prime}`))
    .join(' × ')

  const Node = ({ x, y, label, prime }: { x: number; y: number; label: number; prime: boolean }) => (
    <g>
      <circle cx={x} cy={y} r="15" fill={prime ? 'var(--color-success)' : 'var(--color-surface-2)'} stroke={prime ? 'var(--color-success)' : 'var(--color-border)'} strokeWidth="1.5" fillOpacity={prime ? 0.2 : 1} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill={prime ? 'var(--color-success)' : 'var(--color-ink)'}>
        {label}
      </text>
    </g>
  )

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setN(p)}
            className={`rounded-lg border px-3 py-1 font-mono text-sm transition ${
              p === n ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-sm">
        {steps.map((_, i) => (
          <line key={`l${i}`} x1={cx(i)} y1={cy(i)} x2={cx(i) - 34} y2={cy(i + 1)} stroke="var(--color-border)" strokeWidth="1.5" />
        ))}
        {steps.map((_, i) => (
          <line key={`r${i}`} x1={cx(i)} y1={cy(i)} x2={cx(i + 1)} y2={cy(i + 1)} stroke="var(--color-border)" strokeWidth="1.5" />
        ))}
        {steps.map((s, i) => (
          <g key={`n${i}`}>
            <Node x={cx(i)} y={cy(i)} label={s.value} prime={false} />
            <Node x={cx(i) - 34} y={cy(i + 1)} label={s.prime} prime />
          </g>
        ))}
        <Node x={cx(L)} y={cy(L)} label={lastPrime} prime />
      </svg>

      <p className="mt-2 text-center">
        <span className="font-mono text-lg text-ink">{n} = {factorisation}</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        Split however you like — the set of prime leaves is always the same.
      </p>
    </div>
  )
}
