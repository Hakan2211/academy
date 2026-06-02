import { useState } from 'react'

// A histogram groups continuous data into classes and shows frequency as bar
// area. With equal-width classes, height = frequency; the shape reveals the
// distribution. Used in frequency-and-grouped-data and histograms.
const CLASSES = [
  { label: '0–10', f: 3 },
  { label: '10–20', f: 7 },
  { label: '20–30', f: 12 },
  { label: '30–40', f: 9 },
  { label: '40–50', f: 5 },
  { label: '50–60', f: 2 },
]

export function Histogram() {
  const [hi, setHi] = useState(2)
  const max = Math.max(...CLASSES.map((c) => c.f))
  const total = CLASSES.reduce((s, c) => s + c.f, 0)
  // estimated mean using midpoints
  const mids = [5, 15, 25, 35, 45, 55]
  const estMean = CLASSES.reduce((s, c, i) => s + c.f * mids[i], 0) / total

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex h-44 items-end justify-center gap-[2px] px-2">
        {CLASSES.map((c, i) => (
          <button key={c.label} onClick={() => setHi(i)} className="flex flex-1 flex-col items-center">
            <span className="mb-0.5 font-mono text-[10px] text-muted">{c.f}</span>
            <div className={`w-full ${i === hi ? 'bg-accent' : 'bg-accent/45'} transition`} style={{ height: `${(c.f / max) * 130}px` }} />
            <span className="mt-1 text-[8px] text-muted">{c.label}</span>
          </button>
        ))}
      </div>

      <p className="mt-2 text-center text-sm">
        Modal class: <span className="font-mono text-accent">{CLASSES[2].label}</span> · total {total} · estimated mean ≈ <span className="font-mono text-ink">{+estMean.toFixed(1)}</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        Continuous data is grouped into classes; the selected bar holds {CLASSES[hi].f} values in {CLASSES[hi].label}. The estimated mean uses each class's midpoint.
      </p>
    </div>
  )
}
