import { useState } from 'react'
import { factorsOf } from '#/lib/math'

// A number's factors as rectangles of dots. Every factor pair a × b is a way to
// arrange n dots in a rectangle. A prime can only make a single 1 × n line —
// that's what "prime" looks like. Reused in multiples-and-factors.
export function FactorPairs() {
  const [n, setN] = useState(12)
  const factors = factorsOf(n)
  // unique pairs a ≤ b
  const pairs: Array<[number, number]> = []
  for (const a of factors) {
    const b = n / a
    if (a <= b) pairs.push([a, b])
  }
  const prime = factors.length === 2

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-start justify-center gap-4">
        {pairs.map(([a, b]) => (
          <div key={a} className="flex flex-col items-center gap-1">
            <div
              className="grid gap-[3px]"
              style={{ gridTemplateColumns: `repeat(${b}, 8px)` }}
            >
              {Array.from({ length: a * b }, (_, i) => (
                <span key={i} className="h-2 w-2 rounded-full bg-accent" />
              ))}
            </div>
            <span className="font-mono text-xs text-muted">
              {a} × {b}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">n</span>
          <input type="range" min={2} max={24} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{n}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-sm">
        <span className="text-muted">Factors of {n}: </span>
        <span className="font-mono text-ink">{factors.join(', ')}</span>
        <span className={prime ? 'font-semibold text-success' : 'text-muted'}>
          {prime ? ' — only one rectangle, so ' + n + ' is prime.' : ' — several rectangles, so ' + n + ' is composite.'}
        </span>
      </p>
    </div>
  )
}
