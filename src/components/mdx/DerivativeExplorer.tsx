import { useState } from 'react'
import { makeScale, fnPath } from '#/lib/math'

// The derivative as the slope of a curve. A secant line through two points has
// the AVERAGE rate of change; shrink the gap h → 0 and it becomes the TANGENT,
// whose slope is the INSTANTANEOUS rate — the derivative. For f(x)=½x², f′(x)=x.
// Reused across rates-of-change, the-derivative, differentiation-rules, FTC.
const f = (x: number) => 0.5 * x * x
const df = (x: number) => x // derivative of ½x²

export function DerivativeExplorer() {
  const [a, setA] = useState(2)
  const [h, setH] = useState(2)
  const slopeT = df(a)
  const slopeS = (f(a + h) - f(a)) / h

  const W = 300
  const H = 250
  const px = makeScale(-4, 4, 20, W - 10)
  const py = makeScale(-0.5, 8.5, H - 16, 10)

  const tanLine = (t: number) => f(a) + slopeT * (t - a)
  const secLine = (t: number) => f(a) + slopeS * (t - a)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-1 text-center font-mono text-sm text-muted">f(x) = ½x²</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-xs">
        <line x1={px(-4)} y1={py(0)} x2={px(4)} y2={py(0)} stroke="var(--color-muted)" strokeWidth="1.2" />
        <line x1={px(0)} y1={py(-0.5)} x2={px(0)} y2={py(8.5)} stroke="var(--color-muted)" strokeWidth="1.2" />
        <path d={fnPath(f, -4, 4, px, py, 120)} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
        {/* secant */}
        <path d={fnPath(secLine, -4, 4, px, py, 2)} fill="none" stroke="var(--color-accent-2)" strokeWidth="1.5" strokeDasharray="5 4" />
        {/* tangent */}
        <path d={fnPath(tanLine, -4, 4, px, py, 2)} fill="none" stroke="var(--color-success)" strokeWidth="2" />
        <circle cx={px(a)} cy={py(f(a))} r="5" fill="var(--color-success)" stroke="#fff" strokeWidth="1.2" />
        <circle cx={px(a + h)} cy={py(f(a + h))} r="4" fill="var(--color-accent-2)" stroke="#fff" strokeWidth="1.2" />
      </svg>

      <div className="space-y-1.5 px-1 text-sm">
        <label className="flex items-center justify-between gap-3"><span className="text-muted">point x = a</span><input type="range" min={-3.5} max={3.5} step={0.1} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-1/2 accent-accent" /><span className="w-10 text-right font-mono text-ink">{a.toFixed(1)}</span></label>
        <label className="flex items-center justify-between gap-3"><span className="text-muted">gap h</span><input type="range" min={0.1} max={3} step={0.1} value={h} onChange={(e) => setH(Number(e.target.value))} className="w-1/2 accent-accent" /><span className="w-10 text-right font-mono text-ink">{h.toFixed(1)}</span></label>
      </div>

      <p className="mt-2 text-center font-mono text-xs">
        secant slope <span className="text-accent-2">{slopeS.toFixed(2)}</span> &nbsp;→&nbsp; tangent slope <span className="text-success">{slopeT.toFixed(2)}</span> = f′({a.toFixed(1)})
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        As the gap h shrinks to 0, the secant (average rate) becomes the tangent (instantaneous rate). For ½x², that slope is exactly <strong>x</strong>.
      </p>
    </div>
  )
}
