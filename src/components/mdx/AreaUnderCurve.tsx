import { useState } from 'react'
import { makeScale, fnPath } from '#/lib/math'

// The integral as area under a curve, built from rectangles (a Riemann sum).
// More, thinner rectangles → a better approximation → in the limit, the exact
// area. For f(x)=½x² on [0,4] the exact area is 32/3 ≈ 10.67. Reused in
// the-area-under-a-curve and the-fundamental-theorem.
const f = (x: number) => 0.5 * x * x
const EXACT = (1 / 6) * 4 * 4 * 4 // ∫₀⁴ ½x² dx = x³/6 |₀⁴ = 64/6

export function AreaUnderCurve() {
  const [n, setN] = useState(6)
  const a = 0
  const b = 4
  const dx = (b - a) / n
  let sum = 0
  const rects: Array<{ x: number; h: number }> = []
  for (let i = 0; i < n; i++) {
    const mid = a + (i + 0.5) * dx
    const h = f(mid)
    sum += h * dx
    rects.push({ x: a + i * dx, h })
  }

  const W = 300
  const H = 230
  const px = makeScale(0, 4.3, 28, W - 10)
  const py = makeScale(0, 9, H - 18, 10)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-1 text-center font-mono text-sm text-muted">area under f(x) = ½x² on [0, 4]</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-xs">
        {rects.map((r, i) => (
          <rect key={i} x={px(r.x)} y={py(r.h)} width={px(r.x + dx) - px(r.x) - 0.5} height={py(0) - py(r.h)} fill="var(--color-accent)" fillOpacity="0.2" stroke="var(--color-accent)" strokeWidth="0.6" />
        ))}
        <line x1={px(0)} y1={py(0)} x2={px(4.3)} y2={py(0)} stroke="var(--color-muted)" strokeWidth="1.2" />
        <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(9)} stroke="var(--color-muted)" strokeWidth="1.2" />
        <path d={fnPath(f, 0, 4.2, px, py, 120)} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">rectangles n</span>
          <input type="range" min={1} max={40} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{n}</span>
        </label>
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        approx area <span className="text-accent">{sum.toFixed(3)}</span> &nbsp;→&nbsp; exact <span className="font-bold text-success">{EXACT.toFixed(3)}</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        Slice the area into rectangles and add them up. More, thinner rectangles close in on the true area — that limit is the <strong>integral</strong>.
      </p>
    </div>
  )
}
