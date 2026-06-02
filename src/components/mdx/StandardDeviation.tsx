import { useState } from 'react'

// Standard deviation measures spread — the typical distance of values from the
// mean. Two datasets can share a mean yet differ wildly in spread. Slide to
// stretch the data and watch SD grow. Used in spread-and-standard-deviation.
const OFFSETS = [-2.1, -1.5, -1.0, -0.5, -0.1, 0.3, 0.8, 1.2, 1.7, 2.2]
const MEAN = 50

export function StandardDeviation() {
  const [spread, setSpread] = useState(1.5)
  const data = OFFSETS.map((o) => MEAN + o * spread * 6)
  const mean = data.reduce((s, x) => s + x, 0) / data.length
  const variance = data.reduce((s, x) => s + (x - mean) ** 2, 0) / data.length
  const sd = Math.sqrt(variance)

  const W = 540
  const PAD = 30
  const x = (v: number) => PAD + ((v - 10) / 80) * (W - 2 * PAD)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} 90`} className="w-full">
        {/* ±1 SD band */}
        <rect x={x(mean - sd)} y={30} width={x(mean + sd) - x(mean - sd)} height={26} fill="var(--color-accent)" fillOpacity="0.12" />
        <line x1={PAD} y1={56} x2={W - PAD} y2={56} stroke="var(--color-muted)" strokeWidth="1.5" />
        {/* mean line */}
        <line x1={x(mean)} y1={26} x2={x(mean)} y2={60} stroke="var(--color-accent-2)" strokeWidth="2" />
        <text x={x(mean)} y={20} textAnchor="middle" fontSize="9" fill="var(--color-accent-2)">mean {mean.toFixed(0)}</text>
        {/* data points */}
        {data.map((v, i) => (
          <circle key={i} cx={x(v)} cy={56} r="5" fill="var(--color-accent)" stroke="#fff" strokeWidth="1" />
        ))}
        {[10, 30, 50, 70, 90].map((t) => (
          <text key={t} x={x(t)} y={78} textAnchor="middle" fontSize="9" fill="var(--color-muted)">{t}</text>
        ))}
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">spread</span>
          <input type="range" min={0.3} max={3} step={0.1} value={spread} onChange={(e) => setSpread(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{spread.toFixed(1)}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-sm">
        Standard deviation ≈ <span className="font-mono font-bold text-accent">{sd.toFixed(1)}</span>
        <span className="text-muted"> — the shaded band is mean ± 1 SD, holding the bulk of the data.</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        SD = √(average squared distance from the mean). Tightly clustered data → small SD; spread-out data → large SD.
      </p>
    </div>
  )
}
