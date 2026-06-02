import { useState } from 'react'
import { simplifyFrac } from '#/lib/math'

// A fraction as a shaded bar. Change numerator and denominator and read the same
// quantity three ways — fraction, decimal, percent — plus its simplest form.
// Reused in understanding-fractions and decimals.
export function FractionBar() {
  const [d, setD] = useState(4)
  const [n, setN] = useState(3)
  const nn = Math.min(n, d)
  const simp = simplifyFrac({ n: nn, d })
  const value = nn / d

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex overflow-hidden rounded-lg border border-border">
        {Array.from({ length: d }, (_, i) => (
          <div
            key={i}
            className={`h-16 flex-1 border-r border-surface ${i < nn ? 'bg-accent' : 'bg-surface-2'} ${i === d - 1 ? 'border-r-0' : ''}`}
          />
        ))}
      </div>

      <div className="mt-4 space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">parts shaded (numerator)</span>
          <input type="range" min={0} max={d} value={nn} onChange={(e) => setN(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{nn}</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">total parts (denominator)</span>
          <input type="range" min={2} max={12} value={d} onChange={(e) => { const v = Number(e.target.value); setD(v); if (n > v) setN(v) }} className="w-1/2 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{d}</span>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center">
        <span className="font-mono text-2xl font-bold text-accent">{nn}/{d}</span>
        <span className="text-muted">=</span>
        <span className="font-mono text-ink">{simp.n}/{simp.d} <span className="text-xs text-muted">(simplest)</span></span>
        <span className="text-muted">=</span>
        <span className="font-mono text-ink">{(+value.toFixed(4)).toString()}</span>
        <span className="text-muted">=</span>
        <span className="font-mono text-ink">{(+(value * 100).toFixed(2)).toString()}%</span>
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        Multiplying top and bottom by the same number gives an equivalent fraction — the bar looks identical, just sliced more finely.
      </p>
    </div>
  )
}
