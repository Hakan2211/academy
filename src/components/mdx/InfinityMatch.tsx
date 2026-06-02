import { useState } from 'react'

// Counting the infinite. If you can pair every natural number with exactly one
// member of a set (a bijection), the two infinities are the "same size" —
// countable, ℵ₀. Astonishingly, the evens, the squares, even all fractions match
// the naturals. Used in counting-the-infinite.
const SETS = [
  { key: 'even', label: 'Even numbers', f: (n: number) => 2 * n, rule: 'n ↔ 2n' },
  { key: 'square', label: 'Square numbers', f: (n: number) => n * n, rule: 'n ↔ n²' },
  { key: 'mult3', label: 'Multiples of 3', f: (n: number) => 3 * n, rule: 'n ↔ 3n' },
]

export function InfinityMatch() {
  const [si, setSi] = useState(0)
  const set = SETS[si]
  const rows = [1, 2, 3, 4, 5, 6]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {SETS.map((s, i) => (
          <button key={s.key} onClick={() => setSi(i)} className={`rounded-lg border px-2.5 py-1 text-xs transition ${i === si ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {s.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 240 200" className="mx-auto w-full max-w-xs">
        <text x="55" y="16" textAnchor="middle" fontSize="11" fill="var(--color-muted)">ℕ</text>
        <text x="185" y="16" textAnchor="middle" fontSize="11" fill="var(--color-accent)">{set.label}</text>
        {rows.map((n, i) => {
          const y = 36 + i * 26
          return (
            <g key={n}>
              <text x="55" y={y + 4} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--color-ink)">{n}</text>
              <line x1="72" y1={y} x2="168" y2={y} stroke="var(--color-accent-2)" strokeWidth="1.5" />
              <text x="185" y={y + 4} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--color-accent)">{set.f(n)}</text>
            </g>
          )
        })}
        <text x="120" y="196" textAnchor="middle" fontSize="11" fill="var(--color-muted)">⋮ &nbsp; forever &nbsp; ⋮</text>
      </svg>

      <p className="mt-2 text-center text-sm">
        Pairing <span className="font-mono text-accent">{set.rule}</span> — every natural has exactly one partner.
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        A perfect one-to-one matching means these sets are the <strong>same size</strong> of infinity (ℵ₀, "countable") — even though one looks like only "half" of the other!
      </p>
    </div>
  )
}
