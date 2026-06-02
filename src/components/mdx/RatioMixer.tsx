import { useState } from 'react'
import { gcd } from '#/lib/math'

// A ratio as a mixed bar. Set the parts a : b, see the bar split in proportion,
// its simplest form, and — given a total — what one part is worth. Covers
// what-is-a-ratio and simplifying-and-sharing.
export function RatioMixer() {
  const [a, setA] = useState(3)
  const [b, setB] = useState(2)
  const [total, setTotal] = useState(20)
  const g = gcd(a, b) || 1
  const parts = a + b
  const onePart = total / parts

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex h-14 overflow-hidden rounded-lg border border-border">
        <div className="flex items-center justify-center bg-accent text-sm font-semibold text-white" style={{ width: `${(a / parts) * 100}%` }}>
          {a}
        </div>
        <div className="flex items-center justify-center bg-accent-2 text-sm font-semibold text-white" style={{ width: `${(b / parts) * 100}%` }}>
          {b}
        </div>
      </div>

      <div className="mt-4 space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-accent">first part</span>
          <input type="range" min={1} max={9} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{a}</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-accent-2">second part</span>
          <input type="range" min={1} max={9} value={b} onChange={(e) => setB(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{b}</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">total to share</span>
          <input type="range" min={parts} max={120} step={1} value={total} onChange={(e) => setTotal(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{total}</span>
        </label>
      </div>

      <div className="mt-3 text-center text-sm">
        <div className="font-mono text-lg">
          <span className="text-ink">{a} : {b}</span>
          {g > 1 && <span className="text-muted"> = {a / g} : {b / g} (simplest)</span>}
        </div>
        <p className="mt-1 text-muted">
          {parts} equal parts → 1 part = {total} ÷ {parts} = <span className="font-mono text-ink">{+onePart.toFixed(2)}</span>.
          Shares: <span className="font-mono text-accent">{+(onePart * a).toFixed(2)}</span> and <span className="font-mono text-accent-2">{+(onePart * b).toFixed(2)}</span>.
        </p>
      </div>
    </div>
  )
}
