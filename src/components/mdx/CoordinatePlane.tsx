import { useState } from 'react'
import { makeScale } from '#/lib/math'

// The coordinate plane. Move a point and read its (x, y) address — and see which
// of the four quadrants it lands in. Used in the-coordinate-plane.
export function CoordinatePlane() {
  const [x, setX] = useState(3)
  const [y, setY] = useState(2)
  const W = 280
  const px = makeScale(-5, 5, 14, W - 14)
  const py = makeScale(-5, 5, W - 14, 14)
  const quadrant = x === 0 || y === 0 ? 'on an axis' : x > 0 ? (y > 0 ? 'I' : 'IV') : y > 0 ? 'II' : 'III'

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} ${W}`} className="mx-auto w-full max-w-[280px]">
        {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((g) => (
          <g key={g}>
            <line x1={px(g)} y1={py(-5)} x2={px(g)} y2={py(5)} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.4" />
            <line x1={px(-5)} y1={py(g)} x2={px(5)} y2={py(g)} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.4" />
          </g>
        ))}
        <line x1={px(-5)} y1={py(0)} x2={px(5)} y2={py(0)} stroke="var(--color-muted)" strokeWidth="1.5" />
        <line x1={px(0)} y1={py(-5)} x2={px(0)} y2={py(5)} stroke="var(--color-muted)" strokeWidth="1.5" />
        {/* quadrant labels */}
        {[['I', 3.5, 3.5], ['II', -3.5, 3.5], ['III', -3.5, -3.5], ['IV', 3.5, -3.5]].map(([l, qx, qy]) => (
          <text key={l as string} x={px(qx as number)} y={py(qy as number)} textAnchor="middle" fontSize="11" fill="var(--color-border)">{l as string}</text>
        ))}
        {/* dashed guides */}
        <line x1={px(x)} y1={py(0)} x2={px(x)} y2={py(y)} stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <line x1={px(0)} y1={py(y)} x2={px(x)} y2={py(y)} stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <circle cx={px(x)} cy={py(y)} r="6" fill="var(--color-accent)" stroke="#fff" strokeWidth="1.5" />
      </svg>

      <div className="mt-2 space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">x (across)</span>
          <input type="range" min={-5} max={5} value={x} onChange={(e) => setX(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{x}</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">y (up)</span>
          <input type="range" min={-5} max={5} value={y} onChange={(e) => setY(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{y}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-sm">
        Point <span className="font-mono font-bold text-accent">({x}, {y})</span>
        <span className="text-muted"> — quadrant {quadrant}. Always read <em>across</em> then <em>up</em>.</span>
      </p>
    </div>
  )
}
