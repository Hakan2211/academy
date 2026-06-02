import { useState } from 'react'
import { simplifyFrac } from '#/lib/math'

// "Per cent" = per hundred, shown on a 100-square grid. One control, three faces
// of the same number: percent, fraction, decimal. Reused in percentages and
// the fraction–decimal–percent link.
export function PercentGrid() {
  const [p, setP] = useState(45)
  const simp = simplifyFrac({ n: p, d: 100 })

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mx-auto grid max-w-[220px] grid-cols-10 gap-[2px]">
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i} className={`aspect-square rounded-[2px] ${i < p ? 'bg-accent' : 'bg-surface-2'}`} />
        ))}
      </div>

      <div className="mt-4 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">percent</span>
          <input type="range" min={0} max={100} value={p} onChange={(e) => setP(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-12 text-right font-mono text-ink">{p}%</span>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span className="font-mono text-xl font-bold text-accent">{p}%</span>
        <span className="text-muted">=</span>
        <span className="font-mono text-ink">{p}/100 = {simp.n}/{simp.d}</span>
        <span className="text-muted">=</span>
        <span className="font-mono text-ink">{(p / 100).toString()}</span>
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        45% just means 45 out of every 100 — a fraction with denominator 100, and a decimal two places along.
      </p>
    </div>
  )
}
