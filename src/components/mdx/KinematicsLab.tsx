import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

type ScenarioKey = 'rest' | 'uniform' | 'accelerate' | 'decelerate'

// Each scenario is two normalized functions of time τ∈[0,1]:
//   p(τ) = position (0..1 along the track),  v(τ) = speed (0..1).
const SCEN: Record<
  ScenarioKey,
  { label: string; p: (t: number) => number; v: (t: number) => number }
> = {
  rest: { label: 'At rest', p: () => 0.1, v: () => 0 },
  uniform: { label: 'Constant speed', p: (t) => t, v: () => 0.6 },
  accelerate: { label: 'Speeding up', p: (t) => t * t, v: (t) => t },
  decelerate: {
    label: 'Slowing down',
    p: (t) => 1 - (1 - t) * (1 - t),
    v: (t) => 1 - t,
  },
}

// An interactive lab: pick a motion, watch the object move while playhead dots
// trace the position–time and velocity–time graphs in lockstep.
export function KinematicsLab({
  scenarios = ['rest', 'uniform', 'accelerate'],
}: {
  scenarios?: Array<ScenarioKey>
}) {
  const [active, setActive] = useState<ScenarioKey>(scenarios[0])

  const ballRef = useRef<SVGCircleElement>(null)
  const pDotRef = useRef<SVGCircleElement>(null)
  const vDotRef = useRef<SVGCircleElement>(null)

  const tL = 40
  const tR = 460
  const tY = 46
  // position graph box
  const aL = 50
  const aR = 230
  const aT = 110
  const aB = 270
  // velocity graph box
  const bL = 290
  const bR = 470
  const bT = 110
  const bB = 270

  const gx = (l: number, r: number, t: number) => l + t * (r - l)
  const gy = (top: number, bot: number, val: number) => bot - val * (bot - top)

  const curve = (
    l: number,
    r: number,
    top: number,
    bot: number,
    f: (t: number) => number,
  ) => {
    const pts: Array<string> = []
    const N = 48
    for (let i = 0; i <= N; i++) {
      const t = i / N
      pts.push(`${gx(l, r, t).toFixed(1)},${gy(top, bot, f(t)).toFixed(1)}`)
    }
    return pts.join(' ')
  }

  const pCurve = curve(aL, aR, aT, aB, SCEN[active].p)
  const vCurve = curve(bL, bR, bT, bB, SCEN[active].v)

  useEffect(() => {
    let raf = 0
    let t0 = 0
    const period = 3600
    const loop = (now: number) => {
      if (!t0) t0 = now
      const tau = ((now - t0) % period) / period
      const pos = SCEN[active].p(tau)
      const vel = SCEN[active].v(tau)
      ballRef.current?.setAttribute('cx', String(gx(tL, tR, pos)))
      pDotRef.current?.setAttribute('cx', String(gx(aL, aR, tau)))
      pDotRef.current?.setAttribute('cy', String(gy(aT, aB, pos)))
      vDotRef.current?.setAttribute('cx', String(gx(bL, bR, tau)))
      vDotRef.current?.setAttribute('cy', String(gy(bT, bB, vel)))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {scenarios.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setActive(s)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              active === s
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {SCEN[s].label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 500 290" className="w-full">
        {/* track */}
        <line x1={tL} y1={tY} x2={tR} y2={tY} stroke="var(--color-border)" strokeWidth="3" />
        <circle
          ref={ballRef}
          cx={gx(tL, tR, SCEN[active].p(0))}
          cy={tY}
          r="10"
          fill="#fdcb6e"
        />
        <text x={tL} y={tY - 16} fill="var(--color-muted)" fontSize="12">
          the object
        </text>

        {/* position–time graph */}
        <text x={aL} y={aT - 12} fill="var(--color-ink)" fontSize="13" fontWeight="600">
          position – time
        </text>
        <line x1={aL} y1={aT} x2={aL} y2={aB} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={aL} y1={aB} x2={aR} y2={aB} stroke="var(--color-border)" strokeWidth="1.5" />
        <polyline points={pCurve} fill="none" stroke="#00b894" strokeWidth="2.5" />
        <circle ref={pDotRef} cx={aL} cy={aB} r="5" fill="#00b894" />
        <text x={aR} y={aB + 18} fill="var(--color-muted)" fontSize="11" textAnchor="end">
          time →
        </text>

        {/* velocity–time graph */}
        <text x={bL} y={bT - 12} fill="var(--color-ink)" fontSize="13" fontWeight="600">
          velocity – time
        </text>
        <line x1={bL} y1={bT} x2={bL} y2={bB} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={bL} y1={bB} x2={bR} y2={bB} stroke="var(--color-border)" strokeWidth="1.5" />
        <polyline points={vCurve} fill="none" stroke="#74b9ff" strokeWidth="2.5" />
        <circle ref={vDotRef} cx={bL} cy={bB} r="5" fill="#74b9ff" />
        <text x={bR} y={bB + 18} fill="var(--color-muted)" fontSize="11" textAnchor="end">
          time →
        </text>
      </svg>
    </div>
  )
}
