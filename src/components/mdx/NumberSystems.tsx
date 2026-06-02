import { useState } from 'react'

// Nested number systems: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ. Click a number to see the smallest
// set it belongs to light up — and read why. The deep-dive payoff of World 1:
// every number you'll meet lives somewhere on this onion.
const SETS = [
  { id: 'N', symbol: 'ℕ', name: 'Natural', desc: 'Counting numbers: 1, 2, 3 …' },
  { id: 'Z', symbol: 'ℤ', name: 'Integers', desc: 'Whole numbers including 0 and negatives.' },
  { id: 'Q', symbol: 'ℚ', name: 'Rationals', desc: 'Anything writable as a fraction a/b.' },
  { id: 'R', symbol: 'ℝ', name: 'Reals', desc: 'Every point on the number line — including irrationals.' },
]
const RANK: Record<string, number> = { N: 0, Z: 1, Q: 2, R: 3 }

const NUMBERS = [
  { text: '7', home: 'N', why: '7 is a counting number — the innermost set ℕ.' },
  { text: '0', home: 'Z', why: '0 is an integer but not a counting number, so it joins ℤ.' },
  { text: '−3', home: 'Z', why: '−3 is a negative whole number — an integer (ℤ).' },
  { text: '½', home: 'Q', why: '½ is a ratio of integers — a rational number (ℚ).' },
  { text: '0.75', home: 'Q', why: '0.75 = ¾, a fraction, so it is rational (ℚ).' },
  { text: '−2.5', home: 'Q', why: '−2.5 = −5/2, a fraction — rational (ℚ).' },
  { text: '√2', home: 'R', why: '√2 cannot be written as a fraction — it is irrational, so it only reaches ℝ.' },
  { text: 'π', home: 'R', why: 'π is irrational — it lives in ℝ but never in ℚ.' },
]

export function NumberSystems() {
  const [sel, setSel] = useState<number | null>(null)
  const home = sel === null ? null : NUMBERS[sel].home
  // a set is "active" if it contains the selected number (rank ≥ home rank)
  const active = (id: string) => home !== null && RANK[id] >= RANK[home]
  const isHome = (id: string) => home === id

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 250" className="mx-auto w-full max-w-md">
        {SETS.slice()
          .reverse()
          .map((s) => {
            const r = RANK[s.id] // 0..3 inner..outer
            const inset = (3 - r) * 36
            return (
              <g key={s.id}>
                <rect
                  x={10 + inset}
                  y={10 + inset}
                  width={340 - 2 * inset}
                  height={230 - 2 * inset}
                  rx={14}
                  fill={isHome(s.id) ? 'var(--color-accent)' : 'none'}
                  fillOpacity={isHome(s.id) ? 0.12 : 0}
                  stroke={active(s.id) ? 'var(--color-accent)' : 'var(--color-border)'}
                  strokeWidth={isHome(s.id) ? 2.5 : 1.4}
                />
                <text
                  x={10 + inset + 12}
                  y={10 + inset + 20}
                  fontSize="15"
                  fontWeight="700"
                  fill={active(s.id) ? 'var(--color-accent)' : 'var(--color-muted)'}
                >
                  {s.symbol}
                </text>
              </g>
            )
          })}
        {/* selected number sits in the centre */}
        {sel !== null && (
          <text x="180" y="130" textAnchor="middle" fontSize="34" fontWeight="800" fill="var(--color-accent)">
            {NUMBERS[sel].text}
          </text>
        )}
      </svg>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {NUMBERS.map((num, i) => (
          <button
            key={num.text}
            onClick={() => setSel(i)}
            className={`min-w-[2.5rem] rounded-lg border px-2.5 py-1 font-mono text-sm transition ${
              sel === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'
            }`}
          >
            {num.text}
          </button>
        ))}
      </div>

      <p className="mt-3 min-h-[2.5rem] text-center text-sm text-muted">
        {sel === null ? 'Tap a number to find its home set.' : NUMBERS[sel].why}
      </p>

      <div className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-muted">
        {SETS.map((s) => (
          <span key={s.id}>
            <span className="font-semibold text-ink">{s.symbol}</span> {s.name}
          </span>
        ))}
      </div>
    </div>
  )
}
