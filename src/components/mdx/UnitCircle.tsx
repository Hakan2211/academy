import { useState } from 'react'

// The unit circle: a radius of length 1 at angle θ has tip (cos θ, sin θ). It
// extends trig beyond right triangles to every angle, and shows where the exact
// special-angle values come from. Used in exact-values.
const SPECIAL = [0, 30, 45, 60, 90]
const EXACT: Record<number, [string, string]> = {
  0: ['1', '0'],
  30: ['√3/2', '1/2'],
  45: ['√2/2', '√2/2'],
  60: ['1/2', '√3/2'],
  90: ['0', '1'],
}

export function UnitCircle() {
  const [deg, setDeg] = useState(45)
  const rad = (deg * Math.PI) / 180
  const cx = 130
  const cy = 120
  const R = 90
  const tx = cx + R * Math.cos(rad)
  const ty = cy - R * Math.sin(rad)
  const exact = EXACT[deg]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 260 200" className="mx-auto w-full max-w-sm">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--color-muted)" strokeWidth="1.2" />
        <line x1={cx - R - 10} y1={cy} x2={cx + R + 10} y2={cy} stroke="var(--color-border)" strokeWidth="1" />
        <line x1={cx} y1={cy - R - 10} x2={cx} y2={cy + R + 10} stroke="var(--color-border)" strokeWidth="1" />
        {/* projections */}
        <line x1={tx} y1={ty} x2={tx} y2={cy} stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1={tx} y1={ty} x2={cx} y2={ty} stroke="var(--color-accent-2)" strokeWidth="1.5" strokeDasharray="3 3" />
        {/* radius */}
        <line x1={cx} y1={cy} x2={tx} y2={ty} stroke="var(--color-ink)" strokeWidth="2" />
        <circle cx={tx} cy={ty} r="5" fill="var(--color-accent)" stroke="#fff" strokeWidth="1.2" />
        <text x={cx + 14} y={cy - 6} fontSize="11" fill="var(--color-muted)">{deg}°</text>
      </svg>

      <div className="mb-2 flex justify-center gap-1.5">
        {SPECIAL.map((s) => (
          <button key={s} onClick={() => setDeg(s)} className={`rounded border px-2 py-0.5 text-xs transition ${s === deg ? 'border-accent text-accent' : 'border-border text-muted'}`}>{s}°</button>
        ))}
      </div>
      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">angle θ</span>
          <input type="range" min={0} max={360} step={1} value={deg} onChange={(e) => setDeg(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-12 text-right font-mono text-ink">{deg}°</span>
        </label>
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        (cos {deg}°, sin {deg}°) = (<span className="text-accent-2">{Math.cos(rad).toFixed(3)}</span>, <span className="text-accent">{Math.sin(rad).toFixed(3)}</span>)
        {exact && <span className="ml-2 text-muted">exact: ({exact[0]}, {exact[1]})</span>}
      </p>
    </div>
  )
}
