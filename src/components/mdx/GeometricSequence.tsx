import { useState } from 'react'

// Geometric sequences: multiply by a fixed ratio each time. r > 1 explodes,
// 0 < r < 1 decays toward zero. The bars make the growth (or shrink) vivid.
// Used in geometric-sequences and patterns-to-infinity.
const RATIOS = [0.5, 1.5, 2, 3]

export function GeometricSequence() {
  const [a, setA] = useState(2)
  const [ri, setRi] = useState(2)
  const r = RATIOS[ri]
  const terms = Array.from({ length: 7 }, (_, i) => a * Math.pow(r, i))
  const max = Math.max(...terms)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex h-32 items-end justify-center gap-1.5">
        {terms.map((t, i) => (
          <div key={i} className="flex flex-1 flex-col items-center">
            <span className="mb-0.5 font-mono text-[9px] text-muted">{+t.toFixed(t < 10 ? 2 : 0)}</span>
            <div className="w-full rounded-t bg-accent" style={{ height: `${Math.max(2, (t / max) * 96)}px` }} />
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">first term a</span>
          <input type="range" min={1} max={5} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{a}</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">common ratio r</span>
          <input type="range" min={0} max={3} value={ri} onChange={(e) => setRi(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-10 text-right font-mono text-ink">{r}</span>
        </label>
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        nth term = a · r<sup>n−1</sup> = {a} · {r}<sup>n−1</sup>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        {r > 1 ? 'r > 1: the terms grow exponentially.' : 'r between 0 and 1: the terms shrink toward zero.'}
      </p>
    </div>
  )
}
