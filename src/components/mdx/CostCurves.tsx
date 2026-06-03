import { useMemo, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// FLAGSHIP. The firm's family of short-run cost curves, all derived from ONE
// total-cost function so the textbook relationships hold exactly:
//   • AVC and ATC are U-shaped (rising marginal cost eventually dominates),
//   • MC cuts AVC and ATC at their MINIMUM points (when MC < average, the
//     average falls; when MC > average, it rises),
//   • the gap between ATC and AVC is average fixed cost, shrinking as output
//     spreads the fixed cost over more units.
// Self-contained + robust (reused by the Market Structures world).
const X0 = 50
const Y0 = 250
const PW = 290
const PH = 222
const QMIN = 1
const QMAX = 12

// Total cost: fixed + variable. Variable cost is cubic so MC is U-shaped.
//   VC(q) = a·q − b·q² + c·q³  → MC = a − 2b·q + 3c·q²  (rises after a dip)
const FC = 60
const A = 28
const B = 4
const C = 0.42

const vc = (q: number) => A * q - B * q * q + C * q * q * q
const tc = (q: number) => FC + vc(q)
const mc = (q: number) => A - 2 * B * q + 3 * C * q * q // dTC/dq
const avc = (q: number) => vc(q) / q
const atc = (q: number) => tc(q) / q

// y-scale: tallest curve over the plotted range (MC climbs highest at QMAX)
const YMAX = Math.ceil(Math.max(mc(QMAX), atc(QMIN)) / 10) * 10

type Key = 'mc' | 'avc' | 'atc'
const SERIES: Array<{ key: Key; label: string; color: string; f: (q: number) => number }> = [
  { key: 'mc', label: 'MC', color: 'var(--color-accent)', f: mc },
  { key: 'avc', label: 'AVC', color: 'var(--color-accent-2)', f: avc },
  { key: 'atc', label: 'ATC', color: 'var(--color-ink)', f: atc },
]

export function CostCurves() {
  const [q, setQ] = useState(6)

  const sx = (x: number) => X0 + ((x - QMIN) / (QMAX - QMIN)) * PW
  const sy = (y: number) => Y0 - (clamp(y, 0, YMAX) / YMAX) * PH

  const paths = useMemo(() => {
    const N = 60
    const out: Record<Key, string> = { mc: '', avc: '', atc: '' }
    for (const s of SERIES) {
      let d = ''
      for (let i = 0; i <= N; i++) {
        const x = QMIN + (i / N) * (QMAX - QMIN)
        d += `${i === 0 ? 'M' : 'L'}${sx(x).toFixed(1)} ${sy(s.f(x)).toFixed(1)} `
      }
      out[s.key] = d
    }
    return out
  }, [])

  const mcV = mc(q)
  const avcV = avc(q)
  const atcV = atc(q)
  const afc = atcV - avcV
  const aboveAtc = mcV > atcV

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Cost / unit</text>

        {/* chosen-output guide */}
        <line x1={sx(q)} y1={Y0} x2={sx(q)} y2={Y0 - PH} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />

        {/* the three curves */}
        {SERIES.map((s) => (
          <path key={s.key} d={paths[s.key]} fill="none" stroke={s.color} strokeWidth={s.key === 'mc' ? 3 : 2.5} />
        ))}

        {/* markers where MC crosses AVC and ATC (their minima) */}
        {SERIES.filter((s) => s.key !== 'mc').map((s) => {
          const v = s.f(q)
          return <circle key={s.key} cx={sx(q)} cy={sy(v)} r="4" fill={s.color} />
        })}
        <circle cx={sx(q)} cy={sy(mcV)} r="4" fill="var(--color-accent)" />

        {/* curve labels at the right edge */}
        {SERIES.map((s) => (
          <text key={s.key} x={sx(QMAX) + 4} y={clamp(sy(s.f(QMAX)), 22, Y0)} fontSize="11" fill={s.color}>{s.label}</text>
        ))}
      </svg>

      <div className="flex flex-wrap items-center justify-center gap-3 px-4">
        {SERIES.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1 text-xs text-muted">
            <span className="inline-block h-2 w-3 rounded-sm" style={{ background: s.color }} /> {s.label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 pt-2 text-center text-sm">
        <div><div className="font-mono text-accent">{mcV.toFixed(0)}</div><div className="text-xs text-muted">marginal cost</div></div>
        <div><div className="font-mono text-accent-2">{avcV.toFixed(0)}</div><div className="text-xs text-muted">avg variable</div></div>
        <div><div className="font-mono text-ink">{atcV.toFixed(0)}</div><div className="text-xs text-muted">avg total</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Output level" value={q} min={QMIN} max={QMAX} step={1} unit="units" onChange={setQ} />
        <p className="text-sm text-muted">
          The gap between ATC and AVC is <span className="text-ink">average fixed cost</span> (≈{afc.toFixed(0)}), which
          shrinks as output spreads the {`$${FC}`} of fixed cost over more units.{' '}
          {aboveAtc
            ? 'Here MC sits above ATC, so producing one more unit pulls average total cost UP.'
            : 'Here MC sits below ATC, so producing one more unit pulls average total cost DOWN.'}{' '}
          MC crosses each average curve exactly at its lowest point.
        </p>
      </div>
    </div>
  )
}
