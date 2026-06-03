import { useMemo, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// Real vs nominal GDP. Nominal GDP measures output at THIS year's prices, so
// rising prices inflate it even when nothing more is actually made. Dividing by
// a price index (the GDP deflator, base year = 100) strips inflation back out to
// reveal REAL GDP — actual output. Two sliders: real growth (real output) and
// the inflation rate (how fast prices rise). The nominal line can soar while the
// real line barely moves, the classic "growth that was really just inflation".
//   nominal_t = real_t × (deflator_t / 100)
//   deflator_t = 100 × (1 + inflation)^t
//   real_t     = real_0 × (1 + realGrowth)^t

const YEARS = 10
const REAL0 = 1000 // base-year real GDP ($bn), deflator = 100

const X0 = 48
const Y0 = 232
const PW = 296
const PH = 200

export function RealNominalGDP() {
  const [realPct, setRealPct] = useState(2)
  const [inflPct, setInflPct] = useState(4)

  const data = useMemo(() => {
    const rows: Array<{ t: number; real: number; nominal: number; deflator: number }> = []
    for (let t = 0; t <= YEARS; t++) {
      const real = REAL0 * (1 + realPct / 100) ** t
      const deflator = 100 * (1 + inflPct / 100) ** t
      const nominal = real * (deflator / 100)
      rows.push({ t, real, nominal, deflator })
    }
    return rows
  }, [realPct, inflPct])

  const yMax = Math.max(...data.map((d) => d.nominal)) * 1.05

  const sx = (t: number) => X0 + (t / YEARS) * PW
  const sy = (v: number) => Y0 - clamp(v / yMax, 0, 1) * PH

  const path = (key: 'real' | 'nominal') =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'}${sx(d.t).toFixed(1)} ${sy(d[key]).toFixed(1)}`).join(' ')

  const last = data[YEARS]
  const nominalGrowth = (last.nominal / data[0].nominal - 1) * 100
  const realGrowth = (last.real / data[0].real - 1) * 100

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 270" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Year →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ GDP ($bn)</text>

        {/* the gap between the lines = pure inflation */}
        <path
          d={`${path('nominal')} L${sx(YEARS).toFixed(1)} ${sy(last.real).toFixed(1)} ${data
            .slice()
            .reverse()
            .map((d) => `L${sx(d.t).toFixed(1)} ${sy(d.real).toFixed(1)}`)
            .join(' ')} Z`}
          fill="var(--color-accent)"
          opacity="0.1"
        />

        {/* lines */}
        <path d={path('nominal')} fill="none" stroke="var(--color-accent)" strokeWidth="3" />
        <path d={path('real')} fill="none" stroke="var(--color-success)" strokeWidth="3" strokeDasharray="6 4" />

        {/* end labels */}
        <text x={sx(YEARS) - 2} y={clamp(sy(last.nominal) - 6, 16, Y0)} textAnchor="end" fontSize="11" fill="var(--color-accent)">Nominal</text>
        <text x={sx(YEARS) - 2} y={clamp(sy(last.real) + 14, 16, Y0)} textAnchor="end" fontSize="11" fill="var(--color-success)">Real</text>
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-accent">+{nominalGrowth.toFixed(0)}%</div><div className="text-xs text-muted">nominal growth</div></div>
        <div><div className="font-mono text-success">+{realGrowth.toFixed(0)}%</div><div className="text-xs text-muted">real growth</div></div>
        <div><div className="font-mono text-ink">{last.deflator.toFixed(0)}</div><div className="text-xs text-muted">GDP deflator</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Real growth rate" value={realPct} min={0} max={6} step={0.5} unit="%/yr" onChange={setRealPct} />
        <SceneSlider label="Inflation rate" value={inflPct} min={0} max={12} step={0.5} unit="%/yr" onChange={setInflPct} />
        <p className="text-sm text-muted">
          Crank up inflation and the <span className="text-accent">nominal</span> line rockets — but the{' '}
          <span className="text-success">real</span> line only tracks genuine extra output. The shaded gap between them is
          pure price rise, not more stuff. Dividing nominal by the deflator and times 100 always returns you to real GDP.
        </p>
      </div>
    </div>
  )
}
