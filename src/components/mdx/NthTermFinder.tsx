import { useState } from 'react'

// The nth-term rule for a linear (arithmetic) sequence. The common difference d
// is the coefficient of n; the rest is a constant. Jump straight to the 100th
// term without listing them all. Used in the-nth-term.
export function NthTermFinder() {
  const [a, setA] = useState(5)
  const [d, setD] = useState(3)
  const [n, setN] = useState(10)
  const constant = a - d // nth term = d·n + (a − d)
  const term = d * n + constant
  const firstFive = [1, 2, 3, 4, 5].map((k) => a + (k - 1) * d)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap justify-center gap-1 font-mono">
        {firstFive.map((t, i) => (
          <span key={i} className="rounded-lg bg-surface-2 px-2.5 py-1.5 text-ink">{t}</span>
        ))}
        <span className="self-center px-1 text-muted">…</span>
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 py-3 text-center">
        <div className="text-sm text-muted">nth term rule</div>
        <div className="font-mono text-2xl font-bold text-accent">
          {d}n {constant >= 0 ? '+ ' + constant : '− ' + -constant}
        </div>
      </div>

      <div className="mt-3 space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">first term a</span>
          <input type="range" min={-5} max={10} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{a}</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">common difference d</span>
          <input type="range" min={-5} max={6} value={d} onChange={(e) => setD(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{d}</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">find term n =</span>
          <input type="range" min={1} max={100} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{n}</span>
        </label>
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        term {n} = {d}×{n} {constant >= 0 ? '+ ' + constant : '− ' + -constant} = <span className="font-bold text-success">{term}</span>
      </p>
    </div>
  )
}
