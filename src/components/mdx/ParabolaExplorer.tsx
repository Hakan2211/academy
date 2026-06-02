import { useState } from 'react'
import { makeScale, fnPath } from '#/lib/math'

// The quadratic y = ax² + bx + c, fully explorable. Slide a, b, c and watch the
// parabola open/flip, slide, and rise — with its roots, vertex, axis of symmetry
// and discriminant updating live. The workhorse of Quadratics and Functions.
export function ParabolaExplorer() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(-2)
  const [c, setC] = useState(-3)
  const A = a === 0 ? 0.0001 : a

  const disc = b * b - 4 * A * c
  const hasRoots = disc >= 0
  const r1 = hasRoots ? (-b - Math.sqrt(disc)) / (2 * A) : null
  const r2 = hasRoots ? (-b + Math.sqrt(disc)) / (2 * A) : null
  const vx = -b / (2 * A)
  const vy = A * vx * vx + b * vx + c

  const W = 320
  const H = 300
  const px = makeScale(-7, 7, 18, W - 8)
  const py = makeScale(-10, 10, H - 12, 12)
  const curve = fnPath((x) => a * x * x + b * x + c, -7, 7, px, py, 200)
  const fmt = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(2))

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-1 text-center font-mono text-ink">
        y = {a}x² {b >= 0 ? '+ ' + b : '− ' + -b}x {c >= 0 ? '+ ' + c : '− ' + -c}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-xs">
        {/* axes */}
        <line x1={px(-7)} y1={py(0)} x2={px(7)} y2={py(0)} stroke="var(--color-muted)" strokeWidth="1.2" />
        <line x1={px(0)} y1={py(-10)} x2={px(0)} y2={py(10)} stroke="var(--color-muted)" strokeWidth="1.2" />
        {/* axis of symmetry */}
        <line x1={px(vx)} y1={py(-10)} x2={px(vx)} y2={py(10)} stroke="var(--color-accent)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
        {/* curve */}
        <path d={curve} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
        {/* roots */}
        {hasRoots && r1 !== null && Math.abs(r1) <= 7 && <circle cx={px(r1)} cy={py(0)} r="5" fill="var(--color-success)" stroke="#fff" strokeWidth="1.2" />}
        {hasRoots && r2 !== null && Math.abs(r2) <= 7 && <circle cx={px(r2)} cy={py(0)} r="5" fill="var(--color-success)" stroke="#fff" strokeWidth="1.2" />}
        {/* vertex */}
        {Math.abs(vy) <= 10 && Math.abs(vx) <= 7 && <circle cx={px(vx)} cy={py(vy)} r="4.5" fill="var(--color-accent-2)" stroke="#fff" strokeWidth="1.2" />}
      </svg>

      <div className="space-y-1.5 px-1">
        {[['a', a, setA, -2, 2, 0.5], ['b', b, setB, -6, 6, 1], ['c', c, setC, -6, 6, 1]].map(([lab, val, set, mn, mx, st]) => (
          <label key={lab as string} className="flex items-center justify-between gap-3 text-sm">
            <span className="w-4 text-muted">{lab as string}</span>
            <input type="range" min={mn as number} max={mx as number} step={st as number} value={val as number} onChange={(e) => (set as (n: number) => void)(Number(e.target.value))} className="flex-1 accent-accent" />
            <span className="w-8 text-right font-mono text-ink">{val as number}</span>
          </label>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-x-4 text-xs text-muted">
        <span>vertex: <span className="font-mono text-accent-2">({fmt(vx)}, {fmt(vy)})</span></span>
        <span>discriminant: <span className="font-mono text-ink">{fmt(disc)}</span></span>
        <span className="col-span-2">
          roots: <span className="font-mono text-success">{hasRoots ? `${fmt(r1!)}, ${fmt(r2!)}` : 'none (disc < 0)'}</span>
        </span>
      </div>
    </div>
  )
}
