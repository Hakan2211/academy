import { useState } from 'react'
import { makeScale, fnPath } from '#/lib/math'

// A limit: the value a function HEADS TOWARD as the input approaches a point —
// even where the function itself is undefined. f(x) = (x²−1)/(x−1) has a hole at
// x = 1, yet the limit there is plainly 2. Used in the-idea-of-a-limit.
export function LimitViz() {
  const [x, setX] = useState(1.6)
  const f = (t: number) => t + 1 // (x²−1)/(x−1) simplified, x ≠ 1
  const fx = f(x)

  const W = 300
  const H = 220
  const px = makeScale(-1, 3, 30, W - 10)
  const py = makeScale(-1, 4, H - 24, 10)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-1 text-center font-mono text-sm text-muted">f(x) = (x² − 1)/(x − 1)</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-xs">
        <line x1={px(-1)} y1={py(0)} x2={px(3)} y2={py(0)} stroke="var(--color-muted)" strokeWidth="1.2" />
        <line x1={px(0)} y1={py(-1)} x2={px(0)} y2={py(4)} stroke="var(--color-muted)" strokeWidth="1.2" />
        <path d={fnPath(f, -1, 3, px, py, 80)} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
        {/* the hole at (1, 2) */}
        <circle cx={px(1)} cy={py(2)} r="5" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="2" />
        {/* approaching point */}
        <line x1={px(x)} y1={py(0)} x2={px(x)} y2={py(fx)} stroke="var(--color-border)" strokeDasharray="3 3" />
        <circle cx={px(x)} cy={py(fx)} r="5" fill="var(--color-accent-2)" stroke="#fff" strokeWidth="1.2" />
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">x →</span>
          <input type="range" min={0.2} max={1.8} step={0.01} value={x} onChange={(e) => setX(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-12 text-right font-mono text-ink">{x.toFixed(2)}</span>
        </label>
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        f({x.toFixed(2)}) = {fx.toFixed(2)} &nbsp;→&nbsp; <span className="font-bold text-accent">limit = 2</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        At x = 1 the formula gives 0/0 — undefined (the hollow point). But as x edges toward 1 from either side, f(x) edges toward 2. That target value is the <strong>limit</strong>.
      </p>
    </div>
  )
}
