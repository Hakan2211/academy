import { useState } from 'react'

// Factorising x² + bx + c: find two numbers that MULTIPLY to c and ADD to b.
// The component lists the factor pairs of c and highlights the winning pair.
// Used in factorising-quadratics and solving-by-factorising.
const PRESETS = [
  { b: 5, c: 6 },
  { b: -1, c: -6 },
  { b: -7, c: 12 },
  { b: 2, c: -15 },
]

function factorPairs(c: number): Array<[number, number]> {
  const pairs: Array<[number, number]> = []
  const lim = Math.abs(c) || 1
  for (let p = -lim; p <= lim; p++) {
    if (p === 0) continue
    if (c % p === 0) {
      const q = c / p
      if (p <= q) pairs.push([p, q])
    }
  }
  return pairs
}

export function FactoriseQuadratic() {
  const [i, setI] = useState(0)
  const { b, c } = PRESETS[i]
  const pairs = factorPairs(c)
  const winner = pairs.find(([p, q]) => p + q === b)

  const sign = (n: number) => (n >= 0 ? `+ ${n}` : `− ${-n}`)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {PRESETS.map((pr, k) => (
          <button key={k} onClick={() => setI(k)} className={`rounded-lg border px-2.5 py-1 font-mono text-xs transition ${k === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            x² {sign(pr.b)}x {sign(pr.c)}
          </button>
        ))}
      </div>

      <p className="mb-2 text-center text-sm text-muted">
        Find two numbers that multiply to <span className="font-mono text-accent">{c}</span> and add to <span className="font-mono text-accent-2">{b}</span>:
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {pairs.map(([p, q], k) => {
          const win = winner && p === winner[0] && q === winner[1]
          return (
            <div key={k} className={`rounded-lg border px-2.5 py-1 text-center font-mono text-xs ${win ? 'border-success bg-success/15 text-success' : 'border-border text-muted'}`}>
              {p} × {q}
              <div className="text-[10px] opacity-80">sum {p + q}</div>
            </div>
          )
        })}
      </div>

      {winner && (
        <div className="mt-3 rounded-xl bg-surface-2 py-3 text-center">
          <div className="font-mono text-lg font-bold text-ink">
            x² {sign(b)}x {sign(c)} = (x {sign(winner[0])})(x {sign(winner[1])})
          </div>
          <div className="mt-1 font-mono text-sm text-success">roots: x = {-winner[0]} or x = {-winner[1]}</div>
        </div>
      )}
    </div>
  )
}
