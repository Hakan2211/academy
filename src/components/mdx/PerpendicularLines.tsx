import { useState } from 'react'
import { makeScale, fnPath } from '#/lib/math'

// Parallel lines share a gradient; perpendicular lines have gradients that
// multiply to −1 (negative reciprocals). Slide m and watch the second line stay
// at exactly 90°. Used in parallel-and-perpendicular-lines.
export function PerpendicularLines() {
  const [m, setM] = useState(2)
  const m2 = -1 / m
  const W = 280
  const px = makeScale(-5, 5, 10, W - 10)
  const py = makeScale(-5, 5, W - 10, 10)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} ${W}`} className="mx-auto w-full max-w-[280px]">
        <line x1={px(-5)} y1={py(0)} x2={px(5)} y2={py(0)} stroke="var(--color-muted)" strokeWidth="1.2" />
        <line x1={px(0)} y1={py(-5)} x2={px(0)} y2={py(5)} stroke="var(--color-muted)" strokeWidth="1.2" />
        <path d={fnPath((x) => m * x, -5, 5, px, py, 2)} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
        <path d={fnPath((x) => m2 * x, -5, 5, px, py, 2)} fill="none" stroke="var(--color-accent-2)" strokeWidth="2.5" />
        <circle cx={px(0)} cy={py(0)} r="3" fill="var(--color-ink)" />
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">gradient of line 1</span>
          <input type="range" min={0.5} max={4} step={0.5} value={m} onChange={(e) => setM(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-10 text-right font-mono text-ink">{m}</span>
        </label>
      </div>

      <div className="mt-2 flex justify-center gap-6 text-sm font-mono">
        <span className="text-accent">m₁ = {m}</span>
        <span className="text-accent-2">m₂ = {(+m2.toFixed(2))}</span>
        <span className="text-success">m₁ × m₂ = {(+(m * m2).toFixed(2))}</span>
      </div>
      <p className="mt-1 text-center text-xs text-muted">
        Perpendicular gradients are <strong>negative reciprocals</strong>: flip the fraction and change the sign, so the product is always −1. (Parallel lines instead share the <em>same</em> gradient.)
      </p>
    </div>
  )
}
