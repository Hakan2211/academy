import { useState } from 'react'

// A locus is the set of all points obeying a rule. Three classics: a fixed
// distance from a point (a circle), equidistant from two points (the
// perpendicular bisector), and equidistant from two lines (the angle bisector).
// Used in constructions-and-loci.
const LOCI = [
  { key: 'circle', label: 'Fixed distance from a point', note: 'All points r from P form a circle of radius r.' },
  { key: 'perp', label: 'Equidistant from two points', note: 'These points form the perpendicular bisector of AB.' },
  { key: 'angle', label: 'Equidistant from two lines', note: 'These points form the angle bisector.' },
]

export function LociViewer() {
  const [i, setI] = useState(0)
  const [r, setR] = useState(55)
  const key = LOCI[i].key

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {LOCI.map((l, k) => (
          <button key={l.key} onClick={() => setI(k)} className={`rounded-lg border px-2.5 py-1 text-xs transition ${k === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {l.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 280 170" className="mx-auto w-full max-w-sm">
        {key === 'circle' && (
          <>
            <circle cx={140} cy={85} r={r} fill="var(--color-accent)" fillOpacity="0.1" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="5 4" />
            <circle cx={140} cy={85} r="4" fill="var(--color-ink)" />
            <text x={148} y={82} fontSize="11" fill="var(--color-muted)">P</text>
          </>
        )}
        {key === 'perp' && (
          <>
            <line x1={140} y1={10} x2={140} y2={160} stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="5 4" />
            <circle cx={80} cy={85} r="4" fill="var(--color-accent-2)" />
            <circle cx={200} cy={85} r="4" fill="var(--color-accent-2)" />
            <text x={70} y={80} fontSize="11" fill="var(--color-muted)">A</text>
            <text x={206} y={80} fontSize="11" fill="var(--color-muted)">B</text>
            <line x1={80} y1={85} x2={200} y2={85} stroke="var(--color-border)" strokeWidth="1" />
          </>
        )}
        {key === 'angle' && (
          <>
            <line x1={40} y1={150} x2={250} y2={150} stroke="var(--color-border)" strokeWidth="1.5" />
            <line x1={40} y1={150} x2={230} y2={40} stroke="var(--color-border)" strokeWidth="1.5" />
            <line x1={40} y1={150} x2={245} y2={95} stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="5 4" />
            <circle cx={40} cy={150} r="4" fill="var(--color-ink)" />
          </>
        )}
      </svg>

      {key === 'circle' && (
        <div className="px-1">
          <label className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted">distance r</span>
            <input type="range" min={20} max={75} value={r} onChange={(e) => setR(Number(e.target.value))} className="w-2/3 accent-accent" />
            <span className="w-8 text-right font-mono text-ink">{r}</span>
          </label>
        </div>
      )}
      <p className="mt-2 text-center text-sm text-muted">{LOCI[i].note}</p>
      <p className="mt-1 text-center text-xs text-muted">
        A locus is built with compass and straight-edge — and it's just a "rule for where points can be," the same idea as a graph.
      </p>
    </div>
  )
}
