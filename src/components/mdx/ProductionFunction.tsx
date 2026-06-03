import { useMemo, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// The short-run production function: with a fixed factory, adding more workers
// raises total output — but each extra worker adds LESS than the one before
// (the law of diminishing marginal returns). The total-product curve climbs and
// then flattens; the marginal-product bars (output added by each worker) shrink
// step by step. Crowding the same machines and floor space is why.
const X0 = 50
const Y0 = 196
const PW = 290
const PH = 168
const MAXW = 8

// total product of L workers — concave: rises fast, then flattens.
// TP(L) = a·L − b·L²  (chosen so MP stays positive across 0..MAXW and falls).
const A = 13
const B = 0.7
const tp = (l: number) => A * l - B * l * l
const mp = (l: number) => tp(l) - tp(l - 1) // marginal product of the L-th worker

const TPMAX = tp(MAXW)
const MPMAX = mp(1)

export function ProductionFunction() {
  const [workers, setWorkers] = useState(3)

  const sx = (l: number) => X0 + (l / MAXW) * PW
  const syTP = (q: number) => Y0 - (q / TPMAX) * PH

  const curvePath = useMemo(() => {
    const N = 48
    let d = ''
    for (let i = 0; i <= N; i++) {
      const l = (i / N) * MAXW
      d += `${i === 0 ? 'M' : 'L'}${sx(l).toFixed(1)} ${syTP(tp(l)).toFixed(1)} `
    }
    return d
  }, [])

  const total = tp(workers)
  const marginal = workers >= 1 ? mp(workers) : 0
  const prevMarginal = workers >= 2 ? mp(workers - 1) : Infinity

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 240" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Workers →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Output</text>

        {/* marginal-product bars: each worker's added output, scaled onto the TP axis */}
        {Array.from({ length: MAXW }, (_, i) => i + 1).map((l) => {
          const m = mp(l)
          const h = (m / MPMAX) * 64
          const within = l <= workers
          return (
            <rect
              key={l}
              x={sx(l) - 9}
              y={Y0 - h}
              width="18"
              height={h}
              rx="2"
              fill="var(--color-accent-2)"
              opacity={within ? 0.55 : 0.16}
            />
          )
        })}

        {/* total-product curve */}
        <path d={curvePath} fill="none" stroke="var(--color-accent)" strokeWidth="3" />

        {/* chosen point + guide lines */}
        <line x1={sx(workers)} y1={syTP(total)} x2={sx(workers)} y2={Y0} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        <line x1={sx(workers)} y1={syTP(total)} x2={X0} y2={syTP(total)} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        <circle cx={sx(workers)} cy={syTP(total)} r="6" fill="var(--color-accent)" />

        {/* worker ticks */}
        {Array.from({ length: MAXW }, (_, i) => i + 1).map((l) => (
          <text key={l} x={sx(l)} y={Y0 + 14} textAnchor="middle" fontSize="10" fill="var(--color-muted)">{l}</text>
        ))}
      </svg>

      <div className="flex items-center justify-center gap-3 px-4">
        <span className="inline-flex items-center gap-1 text-xs text-muted"><span className="inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--color-accent)' }} /> total product</span>
        <span className="inline-flex items-center gap-1 text-xs text-muted"><span className="inline-block h-2 w-3 rounded-sm" style={{ background: 'var(--color-accent-2)' }} /> marginal product</span>
      </div>

      <div className="grid grid-cols-2 gap-2 px-4 pt-2 text-center text-sm">
        <div><div className="font-mono text-ink">{Math.round(total)}</div><div className="text-xs text-muted">total output</div></div>
        <div><div className="font-mono text-accent-2">{workers >= 1 ? `+${Math.round(marginal)}` : '0'}</div><div className="text-xs text-muted">added by worker {Math.max(1, workers)}</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Workers hired" value={workers} min={1} max={MAXW} step={1} unit="" onChange={setWorkers} />
        <p className="text-sm text-muted">
          {workers === 1 && 'The first worker has the factory to themselves and is highly productive.'}
          {workers >= 2 && marginal < prevMarginal &&
            `Diminishing returns: worker ${workers} adds only ${Math.round(marginal)} units — less than the ${Math.round(prevMarginal)} the previous worker added. The fixed factory gets crowded.`}
        </p>
      </div>
    </div>
  )
}
