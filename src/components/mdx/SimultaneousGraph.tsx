import { useState } from 'react'
import { makeScale, fnPath } from '#/lib/math'

// Two equations, two lines, one crossing point. The simultaneous solution is the
// (x, y) that lies on BOTH lines at once — visibly, their intersection. Used in
// simultaneous-equations.
const SYSTEMS = [
  { l1: { m: 1, c: 1, label: 'y = x + 1' }, l2: { m: -1, c: 5, label: 'y = −x + 5' }, sol: { x: 2, y: 3 } },
  { l1: { m: 2, c: -2, label: 'y = 2x − 2' }, l2: { m: -1, c: 4, label: 'y = −x + 4' }, sol: { x: 2, y: 2 } },
]

export function SimultaneousGraph() {
  const [i, setI] = useState(0)
  const sys = SYSTEMS[i]
  const W = 320
  const H = 280
  const px = makeScale(-1, 6, 34, W - 10)
  const py = makeScale(-1, 8, H - 30, 10)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-2 flex justify-center gap-2">
        {SYSTEMS.map((_, k) => (
          <button key={k} onClick={() => setI(k)} className={`rounded-lg border px-3 py-1 text-xs transition ${k === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            system {k + 1}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-sm">
        {/* grid */}
        {[0, 1, 2, 3, 4, 5].map((g) => (
          <line key={`gx${g}`} x1={px(g)} y1={py(-1)} x2={px(g)} y2={py(8)} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.4" />
        ))}
        {[0, 2, 4, 6, 8].map((g) => (
          <line key={`gy${g}`} x1={px(-1)} y1={py(g)} x2={px(6)} y2={py(g)} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.4" />
        ))}
        {/* axes */}
        <line x1={px(-1)} y1={py(0)} x2={px(6)} y2={py(0)} stroke="var(--color-muted)" strokeWidth="1.5" />
        <line x1={px(0)} y1={py(-1)} x2={px(0)} y2={py(8)} stroke="var(--color-muted)" strokeWidth="1.5" />

        {/* lines */}
        <path d={fnPath((x) => sys.l1.m * x + sys.l1.c, -1, 6, px, py, 2)} stroke="var(--color-accent)" strokeWidth="2.5" fill="none" />
        <path d={fnPath((x) => sys.l2.m * x + sys.l2.c, -1, 6, px, py, 2)} stroke="var(--color-accent-2)" strokeWidth="2.5" fill="none" />

        {/* intersection */}
        <line x1={px(sys.sol.x)} y1={py(0)} x2={px(sys.sol.x)} y2={py(sys.sol.y)} stroke="var(--color-border)" strokeDasharray="3 3" />
        <line x1={px(0)} y1={py(sys.sol.y)} x2={px(sys.sol.x)} y2={py(sys.sol.y)} stroke="var(--color-border)" strokeDasharray="3 3" />
        <circle cx={px(sys.sol.x)} cy={py(sys.sol.y)} r="6" fill="var(--color-success)" stroke="#fff" strokeWidth="1.5" />
      </svg>

      <div className="mt-1 flex justify-center gap-4 text-sm font-mono">
        <span className="text-accent">{sys.l1.label}</span>
        <span className="text-accent-2">{sys.l2.label}</span>
      </div>
      <p className="mt-2 text-center text-sm">
        <span className="text-muted">They cross at </span>
        <span className="font-mono font-semibold text-success">({sys.sol.x}, {sys.sol.y})</span>
        <span className="text-muted"> — the one (x, y) that satisfies both.</span>
      </p>
    </div>
  )
}
