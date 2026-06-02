import { useState } from 'react'
import { makeScale } from '#/lib/math'

// Vectors as movements with direction and size. Add them tip-to-tail: walk along
// a, then along b, and the resultant a + b is the single arrow from start to
// finish — components just add. Used in vectors.
export function VectorAdd() {
  const [ax, setAx] = useState(3)
  const [ay, setAy] = useState(1)
  const [bx, setBx] = useState(1)
  const [by, setBy] = useState(3)
  const rx = ax + bx
  const ry = ay + by

  const W = 300
  const px = makeScale(-2, 7, 20, W - 10)
  const py = makeScale(-2, 7, W - 10, 10)

  const Arrow = ({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) => {
    const ang = Math.atan2(py(y2) - py(y1), px(x2) - px(x1))
    const hx = px(x2)
    const hy = py(y2)
    return (
      <g stroke={color} fill={color}>
        <line x1={px(x1)} y1={py(y1)} x2={hx} y2={hy} strokeWidth="2.5" />
        <polygon points={`${hx},${hy} ${hx - 9 * Math.cos(ang - 0.4)},${hy - 9 * Math.sin(ang - 0.4)} ${hx - 9 * Math.cos(ang + 0.4)},${hy - 9 * Math.sin(ang + 0.4)}`} stroke="none" />
      </g>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} ${W}`} className="mx-auto w-full max-w-[300px]">
        {Array.from({ length: 10 }, (_, i) => i - 2).map((g) => (
          <g key={g}>
            <line x1={px(g)} y1={py(-2)} x2={px(g)} y2={py(7)} stroke="var(--color-border)" strokeWidth="0.4" opacity="0.3" />
            <line x1={px(-2)} y1={py(g)} x2={px(7)} y2={py(g)} stroke="var(--color-border)" strokeWidth="0.4" opacity="0.3" />
          </g>
        ))}
        <line x1={px(-2)} y1={py(0)} x2={px(7)} y2={py(0)} stroke="var(--color-muted)" strokeWidth="1.2" />
        <line x1={px(0)} y1={py(-2)} x2={px(0)} y2={py(7)} stroke="var(--color-muted)" strokeWidth="1.2" />
        {/* a from origin, b from tip of a (tip-to-tail), resultant from origin */}
        <Arrow x1={0} y1={0} x2={ax} y2={ay} color="var(--color-accent)" />
        <Arrow x1={ax} y1={ay} x2={rx} y2={ry} color="var(--color-accent-2)" />
        <Arrow x1={0} y1={0} x2={rx} y2={ry} color="var(--color-success)" />
      </svg>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 px-1 text-xs">
        <label className="flex items-center gap-2"><span className="w-8 text-accent">a x</span><input type="range" min={-1} max={5} value={ax} onChange={(e) => setAx(Number(e.target.value))} className="flex-1 accent-accent" /></label>
        <label className="flex items-center gap-2"><span className="w-8 text-accent">a y</span><input type="range" min={-1} max={5} value={ay} onChange={(e) => setAy(Number(e.target.value))} className="flex-1 accent-accent" /></label>
        <label className="flex items-center gap-2"><span className="w-8 text-accent-2">b x</span><input type="range" min={-1} max={5} value={bx} onChange={(e) => setBx(Number(e.target.value))} className="flex-1 accent-accent" /></label>
        <label className="flex items-center gap-2"><span className="w-8 text-accent-2">b y</span><input type="range" min={-1} max={5} value={by} onChange={(e) => setBy(Number(e.target.value))} className="flex-1 accent-accent" /></label>
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        <span className="text-accent">({ax}, {ay})</span> + <span className="text-accent-2">({bx}, {by})</span> = <span className="font-bold text-success">({rx}, {ry})</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">Add components separately. The green resultant goes straight from start to finish.</p>
    </div>
  )
}
