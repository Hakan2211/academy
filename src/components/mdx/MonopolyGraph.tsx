import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// How a monopolist sets price and output, and the harm it causes. Demand slopes
// down: P = a − Q. To sell one more unit the monopolist must cut the price on
// ALL units, so marginal revenue falls TWICE as fast: MR = a − 2Q, sitting
// below demand. The monopolist maximises profit where MR = MC, then reads the
// PRICE up off the demand curve — a price above marginal cost. It produces LESS
// than the competitive quantity (where P = MC) and the lost mutually-beneficial
// trades form a DEADWEIGHT-LOSS triangle.
const X0 = 50
const Y0 = 248
const PW = 290
const PH = 210
const QMAX = 100
const PMAX = 100

const A = 100 // demand intercept: P = A − Q
const dem = (q: number) => A - q
const mr = (q: number) => A - 2 * q // marginal revenue (twice the slope)

export function MonopolyGraph() {
  const [mc, setMc] = useState(30) // flat marginal cost

  const sx = (q: number) => X0 + (q / QMAX) * PW
  const sy = (p: number) => Y0 - (clamp(p, 0, PMAX) / PMAX) * PH

  // monopoly output: MR = MC → A − 2Q = mc
  const qm = clamp((A - mc) / 2, 0, QMAX)
  const pm = dem(qm) // price read off demand
  // competitive output: P = MC → A − Q = mc
  const qc = clamp(A - mc, 0, QMAX)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Price</text>

        {/* deadweight-loss triangle: between Qm and Qc, demand above MC */}
        <polygon
          points={`${sx(qm)},${sy(pm)} ${sx(qm)},${sy(mc)} ${sx(qc)},${sy(mc)}`}
          fill="var(--color-accent)" opacity="0.18"
        />

        {/* marginal cost (flat) */}
        <line x1={X0} y1={sy(mc)} x2={X0 + PW} y2={sy(mc)} stroke="var(--color-accent-2)" strokeWidth="2.5" />
        <text x={X0 + PW + 2} y={sy(mc) + 4} fontSize="10" fill="var(--color-accent-2)">MC</text>

        {/* marginal revenue (steeper, hits axis at A/2) */}
        <line x1={sx(0)} y1={sy(mr(0))} x2={sx(A / 2)} y2={sy(0)} stroke="var(--color-muted)" strokeWidth="2" strokeDasharray="5 3" />
        <text x={sx(A / 2) - 4} y={Y0 - 6} textAnchor="end" fontSize="10" fill="var(--color-muted)">MR</text>

        {/* demand */}
        <line x1={sx(0)} y1={sy(dem(0))} x2={sx(A)} y2={sy(0)} stroke="var(--color-accent)" strokeWidth="3" />
        <text x={sx(A) - 4} y={Y0 - 6} textAnchor="end" fontSize="10" fill="var(--color-accent)">D</text>

        {/* monopoly point: produce Qm, charge Pm */}
        <line x1={sx(qm)} y1={sy(pm)} x2={sx(qm)} y2={Y0} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        <line x1={sx(qm)} y1={sy(pm)} x2={X0} y2={sy(pm)} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        <circle cx={sx(qm)} cy={sy(pm)} r="6" fill="var(--color-ink)" />
        <text x={sx(qm)} y={Y0 + 14} textAnchor="middle" fontSize="9" fill="var(--color-ink)">Qm</text>

        {/* competitive quantity marker on the axis */}
        <circle cx={sx(qc)} cy={Y0} r="4" fill="var(--color-success)" />
        <text x={sx(qc)} y={Y0 + 14} textAnchor="middle" fontSize="9" fill="var(--color-success)">Qc</text>
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{Math.round(pm)}</div><div className="text-xs text-muted">monopoly price</div></div>
        <div><div className="font-mono text-ink">{Math.round(qm)}</div><div className="text-xs text-muted">monopoly output</div></div>
        <div><div className="font-mono text-success">{Math.round(qc)}</div><div className="text-xs text-muted">competitive output</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Marginal cost" value={mc} min={10} max={70} step={1} unit="" onChange={setMc} />
        <div className={cn('rounded-xl border px-3 py-2 text-sm', 'border-accent/50 text-accent')}>
          The monopolist sets <span className="text-ink">MR = MC</span> at {Math.round(qm)} units, then charges{' '}
          <span className="text-ink">{Math.round(pm)}</span> off the demand curve — above marginal cost ({Math.round(mc)}).
          Because it stops short of the competitive output ({Math.round(qc)}), the shaded triangle of mutually
          beneficial trades is lost: that is the <span className="text-ink">deadweight loss</span>.
        </div>
      </div>
    </div>
  )
}
