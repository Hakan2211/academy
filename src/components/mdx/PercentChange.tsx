import { useState } from 'react'

// Percentage change via the multiplier method — the professional's shortcut.
// A 15% rise is "× 1.15"; a 15% fall is "× 0.85". Chain them and compound growth
// or decay falls straight out. Reused in percentage-change.
export function PercentChange() {
  const [start, setStart] = useState(200)
  const [pct, setPct] = useState(15)
  const multiplier = 1 + pct / 100
  const result = start * multiplier

  const maxBar = Math.max(start, result, 1)
  const bar = (v: number) => `${(v / maxBar) * 100}%`

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="w-16 text-right text-xs text-muted">start</span>
          <div className="h-7 flex-1 rounded-md bg-surface-2">
            <div className="flex h-full items-center justify-end rounded-md bg-accent-2 px-2 text-xs font-semibold text-white" style={{ width: bar(start) }}>{start}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-16 text-right text-xs text-muted">result</span>
          <div className="h-7 flex-1 rounded-md bg-surface-2">
            <div className="flex h-full items-center justify-end rounded-md bg-accent px-2 text-xs font-semibold text-white" style={{ width: bar(result) }}>{+result.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">starting amount</span>
          <input type="range" min={10} max={500} step={10} value={start} onChange={(e) => setStart(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-12 text-right font-mono text-ink">{start}</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">change</span>
          <input type="range" min={-80} max={100} step={1} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-12 text-right font-mono text-ink">{pct > 0 ? `+${pct}` : pct}%</span>
        </label>
      </div>

      <p className="mt-3 text-center font-mono text-sm">
        {start} × <span className="text-accent">{multiplier.toFixed(2)}</span> ={' '}
        <span className="font-bold text-success">{+result.toFixed(2)}</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        {pct >= 0 ? `A ${pct}% rise means × ${multiplier.toFixed(2)}` : `A ${Math.abs(pct)}% fall means × ${multiplier.toFixed(2)}`} — one multiply does it.
      </p>
    </div>
  )
}
