import { useState } from 'react'
import { makeScale, fnPath } from '#/lib/math'

// y = mx + c, the straight line. m is the gradient (steepness/direction), c the
// y-intercept (where it crosses the vertical axis). Slide both and watch the
// line tilt and shift. Used in straight-line-graphs.
export function LinearGraph() {
  const [m, setM] = useState(1)
  const [c, setC] = useState(1)
  const W = 300
  const H = 280
  const px = makeScale(-6, 6, 14, W - 10)
  const py = makeScale(-8, 8, H - 12, 12)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-1 text-center font-mono text-ink">
        y = {m}x {c >= 0 ? '+ ' + c : '− ' + -c}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-xs">
        {[-6, -4, -2, 2, 4, 6].map((g) => (
          <line key={`x${g}`} x1={px(g)} y1={py(-8)} x2={px(g)} y2={py(8)} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.35" />
        ))}
        {[-8, -4, 4, 8].map((g) => (
          <line key={`y${g}`} x1={px(-6)} y1={py(g)} x2={px(6)} y2={py(g)} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.35" />
        ))}
        <line x1={px(-6)} y1={py(0)} x2={px(6)} y2={py(0)} stroke="var(--color-muted)" strokeWidth="1.5" />
        <line x1={px(0)} y1={py(-8)} x2={px(0)} y2={py(8)} stroke="var(--color-muted)" strokeWidth="1.5" />
        {/* gradient triangle from the intercept */}
        <line x1={px(0)} y1={py(c)} x2={px(1)} y2={py(c)} stroke="var(--color-accent-2)" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1={px(1)} y1={py(c)} x2={px(1)} y2={py(c + m)} stroke="var(--color-accent-2)" strokeWidth="1.5" strokeDasharray="3 2" />
        <path d={fnPath((x) => m * x + c, -6, 6, px, py, 2)} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
        <circle cx={px(0)} cy={py(c)} r="5" fill="var(--color-accent-2)" stroke="#fff" strokeWidth="1.5" />
      </svg>

      <div className="space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">gradient m</span>
          <input type="range" min={-3} max={3} step={0.5} value={m} onChange={(e) => setM(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-10 text-right font-mono text-ink">{m}</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">intercept c</span>
          <input type="range" min={-6} max={6} value={c} onChange={(e) => setC(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-10 text-right font-mono text-ink">{c}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        Gradient {m} means {m === 0 ? 'flat — no rise' : `up ${m} for every 1 across`}; the line crosses the y-axis at {c}.
      </p>
    </div>
  )
}
