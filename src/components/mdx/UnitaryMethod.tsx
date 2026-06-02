import { useState } from 'react'

// The unitary method: to scale any rate, first find the value of ONE, then
// multiply up. The single most useful trick in proportional reasoning — recipes,
// best-buys, currency, speed. Used in the deep-dive.
export function UnitaryMethod() {
  const baseQty = 3
  const basePrice = 4.5
  const [n, setN] = useState(7)
  const perOne = basePrice / baseQty
  const total = perOne * n

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="rounded-xl bg-surface-2 p-3 text-center text-sm">
        Known rate: <span className="font-mono text-ink">{baseQty} items cost £{basePrice.toFixed(2)}</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-border p-2">
          <div className="text-[11px] text-muted">step 1 · find ONE</div>
          <div className="mt-1 font-mono text-sm text-accent">£{basePrice.toFixed(2)} ÷ {baseQty}</div>
          <div className="font-mono text-lg font-bold text-ink">£{perOne.toFixed(2)}</div>
        </div>
        <div className="flex items-center justify-center text-2xl text-muted">→</div>
        <div className="rounded-lg border border-border p-2">
          <div className="text-[11px] text-muted">step 2 · ×{n}</div>
          <div className="mt-1 font-mono text-sm text-accent">£{perOne.toFixed(2)} × {n}</div>
          <div className="font-mono text-lg font-bold text-success">£{total.toFixed(2)}</div>
        </div>
      </div>

      <div className="mt-3 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">how many items?</span>
          <input type="range" min={1} max={20} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{n}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        Find the value of one unit (the "unit rate"), then scale to any amount. Works for prices, recipes, speeds — any proportional relationship.
      </p>
    </div>
  )
}
