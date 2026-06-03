import { useMemo, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// The LONG-RUN average cost (LRAC) curve. In the long run a firm can build a
// factory of any size, so it picks the size with the lowest average cost for
// the output it wants. As the firm grows it first enjoys ECONOMIES OF SCALE —
// spreading overhead, specialising labour, bulk buying — and average cost
// falls. It bottoms out across a flat range (the MINIMUM EFFICIENT SCALE), then
// eventually rises into DISECONOMIES of scale as the organisation gets too big
// and unwieldy to coordinate.
const X0 = 50
const Y0 = 232
const PW = 290
const PH = 198
const SMIN = 1
const SMAX = 12

// flat-bottomed LRAC: high near the ends, low and flat across the MES band.
// piecewise so we get a clear flat minimum, not a single point.
const MES_LO = 5
const MES_HI = 7
const FLOOR = 20
function lrac(s: number): number {
  if (s < MES_LO) return FLOOR + 2.6 * (MES_LO - s) ** 2 // economies: falling
  if (s > MES_HI) return FLOOR + 1.5 * (s - MES_HI) ** 2 // diseconomies: rising
  return FLOOR // minimum efficient scale: flat
}

const YMAX = Math.ceil(Math.max(lrac(SMIN), lrac(SMAX)) / 10) * 10

type Zone = 'economies' | 'mes' | 'diseconomies'
function zoneOf(s: number): Zone {
  if (s < MES_LO) return 'economies'
  if (s > MES_HI) return 'diseconomies'
  return 'mes'
}

const ZONE_COPY: Record<Zone, string> = {
  economies: 'Economies of scale: growing bigger spreads overhead, lets workers specialise and unlocks bulk discounts — so average cost is still falling. Build bigger.',
  mes: 'Minimum efficient scale: the firm has reached the lowest possible average cost. Any size across this flat band is equally efficient.',
  diseconomies: 'Diseconomies of scale: the organisation has grown too large to coordinate — layers of management and communication breakdowns push average cost back up.',
}

export function ScaleCurve() {
  const [size, setSize] = useState(3)

  const sx = (x: number) => X0 + ((x - SMIN) / (SMAX - SMIN)) * PW
  const sy = (y: number) => Y0 - (clamp(y, 0, YMAX) / YMAX) * PH

  const path = useMemo(() => {
    const N = 64
    let d = ''
    for (let i = 0; i <= N; i++) {
      const x = SMIN + (i / N) * (SMAX - SMIN)
      d += `${i === 0 ? 'M' : 'L'}${sx(x).toFixed(1)} ${sy(lrac(x)).toFixed(1)} `
    }
    return d
  }, [])

  const zone = zoneOf(size)
  const cost = lrac(size)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 270" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Firm size (output) →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ LR avg cost</text>

        {/* MES band */}
        <rect x={sx(MES_LO)} y={Y0 - PH} width={sx(MES_HI) - sx(MES_LO)} height={PH} fill="var(--color-success)" opacity="0.1" />
        <text x={(sx(MES_LO) + sx(MES_HI)) / 2} y={Y0 - PH + 12} textAnchor="middle" fontSize="9" fill="var(--color-success)">min efficient scale</text>

        {/* the LRAC curve */}
        <path d={path} fill="none" stroke="var(--color-accent)" strokeWidth="3" />

        {/* chosen size point + guides */}
        <line x1={sx(size)} y1={sy(cost)} x2={sx(size)} y2={Y0} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        <line x1={sx(size)} y1={sy(cost)} x2={X0} y2={sy(cost)} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        <circle cx={sx(size)} cy={sy(cost)} r="6" fill="var(--color-accent-2)" />

        <text x={sx(SMAX) + 2} y={clamp(sy(lrac(SMAX)), 22, Y0)} fontSize="11" fill="var(--color-accent)">LRAC</text>
      </svg>

      <div className="grid grid-cols-2 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{size.toFixed(0)}</div><div className="text-xs text-muted">firm size</div></div>
        <div><div className="font-mono text-accent-2">{cost.toFixed(0)}</div><div className="text-xs text-muted">cost / unit</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Firm size" value={size} min={SMIN} max={SMAX} step={1} unit="" onChange={setSize} />
        <p className="text-sm text-muted">{ZONE_COPY[zone]}</p>
      </div>
    </div>
  )
}
