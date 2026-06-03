import { useMemo, useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'

// Production Possibilities Frontier. A bowed-out curve between two goods shows
// the trade-off scarcity forces: to get more of one good a society must give up
// some of the other (the slope = opportunity cost, rising as you specialise).
// Points ON the curve are efficient, INSIDE are wasteful (idle resources),
// OUTSIDE are unattainable — until growth pushes the whole frontier outward.
// Reused by the Growth and Trade worlds.
const X0 = 52
const Y0 = 252
const PW = 286
const PH = 224

export function PPFCurve({
  labelA = 'Pizzas',
  labelB = 'Tablets',
  aMax = 12,
  bMax = 8,
}: {
  labelA?: string
  labelB?: string
  aMax?: number
  bMax?: number
}) {
  const [pct, setPct] = useState(55) // % of resources devoted to good A
  const [grow, setGrow] = useState(0) // number of 10% growth steps

  const axisA = aMax * 1.4
  const axisB = bMax * 1.4
  const g = 1.1 ** grow
  const curAMax = aMax * g
  const curBMax = bMax * g

  const sx = (a: number) => X0 + (a / axisA) * PW
  const sy = (b: number) => Y0 - (b / axisB) * PH

  // current production point on the frontier (quarter-ellipse)
  const u = pct / 100
  const a = curAMax * u
  const b = curBMax * Math.sqrt(Math.max(0, 1 - u * u))
  // opportunity cost of one more unit of A, in units of B
  const oc = u >= 0.999 ? Infinity : (curBMax / curAMax) * (u / Math.sqrt(1 - u * u))

  const path = useMemo(() => {
    const N = 40
    let d = ''
    for (let i = 0; i <= N; i++) {
      const uu = i / N
      const x = sx(curAMax * uu)
      const y = sy(curBMax * Math.sqrt(Math.max(0, 1 - uu * uu)))
      d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `
    }
    return d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curAMax, curBMax, axisA, axisB])

  const ineff = { a: 0.45 * aMax, b: 0.42 * aMax * (bMax / aMax) }
  const unatt = { a: 0.82 * aMax, b: 0.82 * bMax }
  const unattReachable = 0.82 * 0.82 + 0.82 * 0.82 <= g * g

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">{labelA} →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ {labelB}</text>

        {/* the frontier */}
        <path d={path} fill="none" stroke="var(--color-accent)" strokeWidth="3" />
        {/* shaded attainable region under the curve */}
        <path d={`${path} L ${sx(0).toFixed(1)} ${Y0} Z`} fill="var(--color-accent)" opacity="0.08" />

        {/* inefficient point (inside) */}
        <circle cx={sx(ineff.a)} cy={sy(ineff.b)} r="5" fill="var(--color-muted)" />
        <text x={sx(ineff.a) + 8} y={sy(ineff.b) + 4} fontSize="10" fill="var(--color-muted)">idle resources</text>

        {/* unattainable point (outside, until growth catches up) */}
        <circle
          cx={sx(unatt.a)} cy={sy(unatt.b)} r="5"
          fill={unattReachable ? 'var(--color-success)' : 'none'}
          stroke={unattReachable ? 'var(--color-success)' : 'var(--color-border)'}
          strokeWidth="2" strokeDasharray={unattReachable ? '0' : '3 2'}
        />
        <text x={sx(unatt.a) + 8} y={sy(unatt.b) + 4} fontSize="10" fill={unattReachable ? 'var(--color-success)' : 'var(--color-muted)'}>
          {unattReachable ? 'now reachable!' : 'unattainable'}
        </text>

        {/* current production point + guide lines */}
        <line x1={sx(a)} y1={sy(b)} x2={sx(a)} y2={Y0} stroke="var(--color-accent-2)" strokeWidth="1" strokeDasharray="3 2" />
        <line x1={sx(a)} y1={sy(b)} x2={X0} y2={sy(b)} stroke="var(--color-accent-2)" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx={sx(a)} cy={sy(b)} r="6" fill="var(--color-accent-2)" />
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{a.toFixed(1)}</div><div className="text-xs text-muted">{labelA}</div></div>
        <div><div className="font-mono text-ink">{b.toFixed(1)}</div><div className="text-xs text-muted">{labelB}</div></div>
        <div>
          <div className="font-mono text-accent">{oc === Infinity ? '∞' : oc.toFixed(2)}</div>
          <div className="text-xs text-muted">cost / +1 {labelA}</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label={`Resources to ${labelA}`} value={pct} min={0} max={100} step={1} unit="%" onChange={setPct} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGrow((x) => Math.min(4, x + 1))}
            className="rounded-full border border-accent bg-accent/15 px-3 py-1 text-sm text-accent transition-colors hover:bg-accent/25"
          >
            Grow the economy +10%
          </button>
          {grow > 0 && (
            <button
              type="button"
              onClick={() => setGrow(0)}
              className={cn('rounded-full border border-border px-3 py-1 text-sm text-muted hover:text-ink')}
            >
              Reset (×{g.toFixed(2)})
            </button>
          )}
        </div>
        <p className="text-sm text-muted">
          The frontier is <span className="text-ink">bowed out</span>: each extra {labelA} costs more {labelB} than the
          last, because resources aren&apos;t equally good at making both. Growth shifts the whole curve outward — the
          only way to beat the trade-off.
        </p>
      </div>
    </div>
  )
}
