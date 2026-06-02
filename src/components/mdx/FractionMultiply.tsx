import { useState } from 'react'
import { simplifyFrac } from '#/lib/math'

// The area model of fraction multiplication. Shade one fraction down the columns
// and the other across the rows; the overlap is the product. Why we multiply
// tops and bottoms becomes visible. Reused in multiplying-and-dividing.
export function FractionMultiply() {
  const [a, setA] = useState({ n: 2, d: 3 })
  const [b, setB] = useState({ n: 3, d: 4 })
  const cols = a.d
  const rows = b.d
  const prod = simplifyFrac({ n: a.n * b.n, d: a.d * b.d })

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mx-auto max-w-[260px]">
        <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: rows * cols }, (_, i) => {
            const r = Math.floor(i / cols)
            const c = i % cols
            const inCol = c < a.n
            const inRow = r < b.n
            const both = inCol && inRow
            return (
              <div
                key={i}
                className={`aspect-square rounded-[3px] ${
                  both ? 'bg-accent' : inCol ? 'bg-accent/25' : inRow ? 'bg-accent-2/25' : 'bg-surface-2'
                }`}
              />
            )
          })}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 px-1 text-xs">
        <div className="space-y-1">
          <div className="text-center font-mono text-accent">{a.n}/{a.d}</div>
          <label className="flex items-center gap-2"><span className="text-muted">n</span><input type="range" min={1} max={a.d} value={a.n} onChange={(e) => setA({ ...a, n: Number(e.target.value) })} className="flex-1 accent-accent" /></label>
          <label className="flex items-center gap-2"><span className="text-muted">d</span><input type="range" min={2} max={6} value={a.d} onChange={(e) => { const d = Number(e.target.value); setA({ n: Math.min(a.n, d), d }) }} className="flex-1 accent-accent" /></label>
        </div>
        <div className="space-y-1">
          <div className="text-center font-mono text-accent-2">{b.n}/{b.d}</div>
          <label className="flex items-center gap-2"><span className="text-muted">n</span><input type="range" min={1} max={b.d} value={b.n} onChange={(e) => setB({ ...b, n: Number(e.target.value) })} className="flex-1 accent-accent" /></label>
          <label className="flex items-center gap-2"><span className="text-muted">d</span><input type="range" min={2} max={6} value={b.d} onChange={(e) => { const d = Number(e.target.value); setB({ n: Math.min(b.n, d), d }) }} className="flex-1 accent-accent" /></label>
        </div>
      </div>

      <p className="mt-3 text-center font-mono">
        <span className="text-accent">{a.n}/{a.d}</span> × <span className="text-accent-2">{b.n}/{b.d}</span> ={' '}
        <span className="text-ink">{a.n * b.n}/{a.d * b.d}</span> ={' '}
        <span className="font-bold text-success">{prod.n}/{prod.d}</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        The dark overlap is {a.n * b.n} cells out of {a.d * b.d} — tops × tops over bottoms × bottoms.
      </p>
    </div>
  )
}
