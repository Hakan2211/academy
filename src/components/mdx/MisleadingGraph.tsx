import { useState } from 'react'

// The same three values, drawn honestly (axis from 0) and misleadingly (axis
// truncated). Truncating the y-axis turns a tiny difference into a dramatic one.
// Used in telling-the-truth-with-data.
const DATA = [
  { label: 'A', v: 102 },
  { label: 'B', v: 104 },
  { label: 'C', v: 108 },
]

export function MisleadingGraph() {
  const [honest, setHonest] = useState(false)
  const base = honest ? 0 : 100
  const top = 110
  const h = (v: number) => ((v - base) / (top - base)) * 130

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex justify-center gap-2">
        <button onClick={() => setHonest(false)} className={`rounded-lg border px-3 py-1 text-xs transition ${!honest ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>Truncated axis</button>
        <button onClick={() => setHonest(true)} className={`rounded-lg border px-3 py-1 text-xs transition ${honest ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>Honest axis (from 0)</button>
      </div>

      <div className="flex h-44 items-end justify-center gap-6 px-6">
        {DATA.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center">
            <span className="mb-1 font-mono text-xs text-ink">{d.v}</span>
            <div className="w-full rounded-t bg-accent" style={{ height: `${Math.max(2, h(d.v))}px` }} />
            <span className="mt-1 text-xs text-muted">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-1 text-center text-[11px] text-muted">y-axis starts at {base}</div>

      <p className="mt-2 text-center text-sm">
        {honest ? (
          <span className="text-success">From zero, A, B and C look almost the same — because they are (102 vs 108).</span>
        ) : (
          <span className="text-accent">C looks <em>three times</em> B's bar — but it's only 4% bigger. The cut axis exaggerates.</span>
        )}
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        A favourite trick of misleading charts: truncate the axis. Always check where the scale starts before trusting a graph.
      </p>
    </div>
  )
}
