import { useState } from 'react'

// Mean, median, mode and range on one small dataset. Toggle an outlier to see
// the mean lurch while the median barely moves — why we choose one average over
// another. Used in averages-and-range (and spread).
const BASE = [3, 5, 7, 7, 8]
const OUTLIER = 30

export function AveragesViz() {
  const [outlier, setOutlier] = useState(false)
  const data = outlier ? [...BASE, OUTLIER] : BASE
  const sorted = [...data].sort((a, b) => a - b)
  const n = sorted.length
  const mean = data.reduce((s, x) => s + x, 0) / n
  const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2
  const mode = 7
  const range = sorted[n - 1] - sorted[0]
  const max = sorted[n - 1]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex h-32 items-end justify-center gap-2 px-2">
        {sorted.map((x, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="mb-0.5 font-mono text-[10px] text-muted">{x}</span>
            <div className="w-7 rounded-t bg-accent" style={{ height: `${(x / max) * 100}px` }} />
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-center">
        <button onClick={() => setOutlier((o) => !o)} className={`rounded-lg border px-3 py-1 text-xs transition ${outlier ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
          {outlier ? 'Remove outlier (30)' : 'Add an outlier (30)'}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
        <div><div className="text-muted">Mean</div><div className="font-mono font-bold text-accent">{+mean.toFixed(1)}</div></div>
        <div><div className="text-muted">Median</div><div className="font-mono font-bold text-success">{median}</div></div>
        <div><div className="text-muted">Mode</div><div className="font-mono font-bold text-ink">{mode}</div></div>
        <div><div className="text-muted">Range</div><div className="font-mono font-bold text-ink">{range}</div></div>
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        Mean = total ÷ count · Median = middle value · Mode = most common · Range = max − min. {outlier ? 'See how the outlier yanks the mean up but leaves the median steady.' : 'The median resists outliers; the mean does not.'}
      </p>
    </div>
  )
}
