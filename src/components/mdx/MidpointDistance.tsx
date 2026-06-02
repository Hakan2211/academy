import { useState } from 'react'
import { makeScale } from '#/lib/math'

// Midpoint and distance between two points. The midpoint is the average of the
// coordinates; the distance is Pythagoras on the horizontal and vertical gaps.
// Used in midpoint-and-distance.
export function MidpointDistance() {
  const [ax, setAx] = useState(-2)
  const [ay, setAy] = useState(-1)
  const [bx, setBx] = useState(3)
  const [by, setBy] = useState(3)
  const mx = (ax + bx) / 2
  const my = (ay + by) / 2
  const dx = bx - ax
  const dy = by - ay
  const dist = Math.sqrt(dx * dx + dy * dy)

  const W = 280
  const px = makeScale(-5, 5, 14, W - 14)
  const py = makeScale(-5, 5, W - 14, 14)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} ${W}`} className="mx-auto w-full max-w-[280px]">
        <line x1={px(-5)} y1={py(0)} x2={px(5)} y2={py(0)} stroke="var(--color-muted)" strokeWidth="1.2" />
        <line x1={px(0)} y1={py(-5)} x2={px(0)} y2={py(5)} stroke="var(--color-muted)" strokeWidth="1.2" />
        {/* right triangle legs */}
        <line x1={px(ax)} y1={py(ay)} x2={px(bx)} y2={py(ay)} stroke="var(--color-accent-2)" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1={px(bx)} y1={py(ay)} x2={px(bx)} y2={py(by)} stroke="var(--color-accent-2)" strokeWidth="1.5" strokeDasharray="3 3" />
        {/* segment */}
        <line x1={px(ax)} y1={py(ay)} x2={px(bx)} y2={py(by)} stroke="var(--color-accent)" strokeWidth="2.5" />
        <circle cx={px(ax)} cy={py(ay)} r="5" fill="var(--color-accent)" />
        <circle cx={px(bx)} cy={py(by)} r="5" fill="var(--color-accent)" />
        <circle cx={px(mx)} cy={py(my)} r="4.5" fill="var(--color-success)" stroke="#fff" strokeWidth="1.2" />
      </svg>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 px-1 text-xs">
        <label className="flex items-center gap-2"><span className="w-8 text-accent">A x</span><input type="range" min={-5} max={5} value={ax} onChange={(e) => setAx(Number(e.target.value))} className="flex-1 accent-accent" /></label>
        <label className="flex items-center gap-2"><span className="w-8 text-accent">A y</span><input type="range" min={-5} max={5} value={ay} onChange={(e) => setAy(Number(e.target.value))} className="flex-1 accent-accent" /></label>
        <label className="flex items-center gap-2"><span className="w-8 text-accent">B x</span><input type="range" min={-5} max={5} value={bx} onChange={(e) => setBx(Number(e.target.value))} className="flex-1 accent-accent" /></label>
        <label className="flex items-center gap-2"><span className="w-8 text-accent">B y</span><input type="range" min={-5} max={5} value={by} onChange={(e) => setBy(Number(e.target.value))} className="flex-1 accent-accent" /></label>
      </div>

      <p className="mt-2 text-center text-sm">
        <span className="text-muted">midpoint </span><span className="font-mono text-success">({mx}, {my})</span>
        <span className="text-muted"> · distance </span><span className="font-mono text-accent">√({dx}² + {dy}²) = {(+dist.toFixed(2))}</span>
      </p>
    </div>
  )
}
