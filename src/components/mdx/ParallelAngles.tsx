import { useState } from 'react'

// A transversal cutting two parallel lines creates equal and supplementary angle
// pairs. Toggle the relationship to see which angles match. Used in
// angles-with-parallel-lines.
const RELS = [
  { key: 'corr', label: 'Corresponding (F)', note: 'Same corner at each crossing — equal.' },
  { key: 'alt', label: 'Alternate (Z)', note: 'Opposite corners between the lines — equal.' },
  { key: 'co', label: 'Co-interior (C)', note: 'Same side between the lines — sum to 180°.' },
]

export function ParallelAngles() {
  const [rel, setRel] = useState(0)
  const [theta, setTheta] = useState(55)
  // transversal geometry
  const y1 = 50
  const y2 = 130
  const slope = 0.6
  const xAt = (y: number) => 150 + (y - 90) * slope
  const p1x = xAt(y1)
  const p2x = xAt(y2)

  // angle label positions around each crossing: [TL, TR, BL, BR]
  const off = 16
  const labelVal = (corner: string) => {
    // acute angle θ sits in TR & BL; obtuse 180−θ in TL & BR (for this slope)
    return corner === 'TR' || corner === 'BL' ? theta : 180 - theta
  }
  const highlight = (cross: 'top' | 'bot', corner: string): boolean => {
    if (rel === 0) return (cross === 'top' && corner === 'BR') || (cross === 'bot' && corner === 'BR')
    if (rel === 1) return (cross === 'top' && corner === 'BR') || (cross === 'bot' && corner === 'TL')
    return (cross === 'top' && corner === 'BR') || (cross === 'bot' && corner === 'TR')
  }

  const corners = [
    { c: 'TL', dx: -off, dy: -10 },
    { c: 'TR', dx: off, dy: -10 },
    { c: 'BL', dx: -off, dy: 16 },
    { c: 'BR', dx: off, dy: 16 },
  ]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {RELS.map((r, i) => (
          <button key={r.key} onClick={() => setRel(i)} className={`rounded-lg border px-2.5 py-1 text-xs transition ${i === rel ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {r.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 300 180" className="mx-auto w-full max-w-sm">
        <line x1={20} y1={y1} x2={280} y2={y1} stroke="var(--color-muted)" strokeWidth="2" />
        <line x1={20} y1={y2} x2={280} y2={y2} stroke="var(--color-muted)" strokeWidth="2" />
        {/* arrows to show parallel */}
        <polygon points={`250,${y1} 244,${y1 - 4} 244,${y1 + 4}`} fill="var(--color-muted)" />
        <polygon points={`250,${y2} 244,${y2 - 4} 244,${y2 + 4}`} fill="var(--color-muted)" />
        <line x1={xAt(20)} y1={20} x2={xAt(170)} y2={170} stroke="var(--color-accent)" strokeWidth="2" />

        {(['top', 'bot'] as const).map((cross) => {
          const ix = cross === 'top' ? p1x : p2x
          const iy = cross === 'top' ? y1 : y2
          return corners.map((cn) => (
            <text
              key={`${cross}-${cn.c}`}
              x={ix + cn.dx}
              y={iy + cn.dy}
              textAnchor="middle"
              fontSize="11"
              fontWeight={highlight(cross, cn.c) ? 700 : 400}
              fill={highlight(cross, cn.c) ? 'var(--color-accent)' : 'var(--color-muted)'}
            >
              {labelVal(cn.c)}
            </text>
          ))
        })}
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">angle θ</span>
          <input type="range" min={30} max={75} value={theta} onChange={(e) => setTheta(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-12 text-right font-mono text-ink">{theta}°</span>
        </label>
      </div>
      <p className="mt-2 text-center text-sm text-muted">{RELS[rel].note}</p>
    </div>
  )
}
