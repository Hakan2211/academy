import { useState } from 'react'

// Circumference and area of a circle from the radius. C = 2πr (around) and
// A = πr² (inside). Used in area-of-circles and revisited in why-the-formulas-work.
export function CircleArea() {
  const [r, setR] = useState(4)
  const circ = 2 * Math.PI * r
  const area = Math.PI * r * r

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 200 170" className="mx-auto w-full max-w-[200px]">
        <circle cx={100} cy={85} r={r * 12} fill="var(--color-accent)" fillOpacity="0.15" stroke="var(--color-accent)" strokeWidth="2.5" />
        <line x1={100} y1={85} x2={100 + r * 12} y2={85} stroke="var(--color-accent-2)" strokeWidth="2" />
        <text x={100 + (r * 12) / 2} y={80} textAnchor="middle" fontSize="11" fill="var(--color-accent-2)">r = {r}</text>
        <circle cx={100} cy={85} r="2.5" fill="var(--color-ink)" />
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">radius r</span>
          <input type="range" min={1} max={8} value={r} onChange={(e) => setR(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{r}</span>
        </label>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-3 text-center text-sm">
        <div>
          <div className="text-muted">Circumference</div>
          <div className="font-mono text-ink">2πr = <span className="text-accent">{+circ.toFixed(2)}</span></div>
        </div>
        <div>
          <div className="text-muted">Area</div>
          <div className="font-mono text-ink">πr² = <span className="text-accent">{+area.toFixed(2)}</span></div>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        Both run on π. Double the radius and the circumference doubles, but the area <em>quadruples</em> (r is squared).
      </p>
    </div>
  )
}
