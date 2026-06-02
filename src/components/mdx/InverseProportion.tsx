import { useState } from 'react'
import { makeScale, fnPath } from '#/lib/math'

// Inverse proportion: as one quantity goes up, the other goes down, but their
// PRODUCT stays fixed (x·y = k). The graph is a curve, not a line — the
// signature of "twice as many workers, half the time". Used in inverse-proportion.
export function InverseProportion() {
  const [x, setX] = useState(4)
  const k = 12
  const y = k / x

  const W = 320
  const H = 240
  const PAD = 36
  const px = makeScale(0, 12, PAD, W - 10)
  const py = makeScale(0, 12, H - PAD, 10)
  const curve = fnPath((t) => k / t, 0.9, 12, px, py, 160)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-sm">
        {/* axes */}
        <line x1={px(0)} y1={py(0)} x2={px(12)} y2={py(0)} stroke="var(--color-muted)" strokeWidth="1.5" />
        <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(12)} stroke="var(--color-muted)" strokeWidth="1.5" />
        <text x={px(12)} y={py(0) + 16} textAnchor="end" fontSize="9" fill="var(--color-muted)">x (e.g. workers)</text>
        <text x={px(0) - 6} y={py(12)} fontSize="9" fill="var(--color-muted)" transform={`rotate(-90 ${px(0) - 6} ${py(12)})`}>y (e.g. days)</text>

        {/* rectangle showing x·y = k */}
        <rect x={px(0)} y={py(y)} width={px(x) - px(0)} height={py(0) - py(y)} fill="var(--color-accent)" fillOpacity="0.12" />

        <path d={curve} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
        <line x1={px(x)} y1={py(0)} x2={px(x)} y2={py(y)} stroke="var(--color-border)" strokeDasharray="3 3" />
        <line x1={px(0)} y1={py(y)} x2={px(x)} y2={py(y)} stroke="var(--color-border)" strokeDasharray="3 3" />
        <circle cx={px(x)} cy={py(y)} r="5" fill="var(--color-accent)" stroke="#fff" strokeWidth="1.5" />
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">x</span>
          <input type="range" min={1} max={12} step={1} value={x} onChange={(e) => setX(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{x}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-sm font-mono">
        x × y = {x} × {+y.toFixed(2)} = <span className="font-bold text-accent">{k}</span>
        <span className="ml-2 font-sans text-muted">— the shaded area never changes.</span>
      </p>
    </div>
  )
}
