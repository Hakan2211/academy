import { useState } from 'react'

// The parts of a circle, one at a time. Tap a name to highlight it on the
// diagram and read what it is. Used in circles-and-their-parts.
const PARTS = [
  { key: 'radius', label: 'Radius', desc: 'Centre to edge — half the diameter.' },
  { key: 'diameter', label: 'Diameter', desc: 'All the way across through the centre.' },
  { key: 'chord', label: 'Chord', desc: 'A line joining two points on the edge.' },
  { key: 'arc', label: 'Arc', desc: 'A portion of the circumference.' },
  { key: 'sector', label: 'Sector', desc: 'A "pizza slice" between two radii.' },
  { key: 'tangent', label: 'Tangent', desc: 'A line touching the circle at one point.' },
]

export function CircleParts() {
  const [p, setP] = useState(0)
  const key = PARTS[p].key
  const cx = 140
  const cy = 100
  const r = 72
  const hl = 'var(--color-accent)'

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {PARTS.map((part, i) => (
          <button key={part.key} onClick={() => setP(i)} className={`rounded-lg border px-2.5 py-1 text-xs transition ${i === p ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {part.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 280 200" className="mx-auto w-full max-w-sm">
        {/* sector fill behind */}
        {key === 'sector' && <path d={`M ${cx} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 0 0 ${cx + r * Math.cos(-1)} ${cy + r * Math.sin(-1)} Z`} fill={hl} fillOpacity="0.25" />}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={key === 'circumference' ? hl : 'var(--color-muted)'} strokeWidth={key === 'circumference' ? 3.5 : 2} />
        <circle cx={cx} cy={cy} r="3" fill="var(--color-ink)" />

        {key === 'arc' && <path d={`M ${cx + r} ${cy} A ${r} ${r} 0 0 0 ${cx + r * Math.cos(-1)} ${cy + r * Math.sin(-1)}`} fill="none" stroke={hl} strokeWidth="4" />}
        {key === 'radius' && <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={hl} strokeWidth="3" />}
        {key === 'diameter' && <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={hl} strokeWidth="3" />}
        {key === 'chord' && <line x1={cx - r * 0.7} y1={cy - r * 0.7} x2={cx + r * 0.9} y2={cy + r * 0.4} stroke={hl} strokeWidth="3" />}
        {key === 'sector' && (
          <>
            <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={hl} strokeWidth="2.5" />
            <line x1={cx} y1={cy} x2={cx + r * Math.cos(-1)} y2={cy + r * Math.sin(-1)} stroke={hl} strokeWidth="2.5" />
          </>
        )}
        {key === 'tangent' && <line x1={cx + r} y1={cy - 60} x2={cx + r} y2={cy + 60} stroke={hl} strokeWidth="3" />}
      </svg>

      <p className="mt-2 text-center text-sm">
        <span className="font-semibold text-accent">{PARTS[p].label}: </span>
        <span className="text-muted">{PARTS[p].desc}</span>
      </p>
    </div>
  )
}
