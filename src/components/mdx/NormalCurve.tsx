import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { gaussian, zToPercentile } from '#/lib/psych'

// The normal ("bell") curve with standard-deviation bands and a draggable score
// marker that shades the area to its left and reports the z-score + percentile.
// Reused for raw data (Research Methods) and for IQ (Intelligence, mean 100 sd
// 15) via the mean/sd/unit props.
const W = 360
const H = 230
const PAD_X = 18
const PAD_B = 34
const TOP = 16

export function NormalCurve({
  mean = 0,
  sd = 1,
  unit = '',
  label = 'Score',
  showBands = true,
}: {
  mean?: number
  sd?: number
  unit?: string
  label?: string
  showBands?: boolean
}) {
  const lo = mean - 4 * sd
  const hi = mean + 4 * sd
  const [score, setScore] = useState(mean)

  const xOf = (v: number) => PAD_X + ((v - lo) / (hi - lo)) * (W - 2 * PAD_X)
  const peak = gaussian(mean, mean, sd)
  const yOf = (v: number) =>
    TOP + (1 - gaussian(v, mean, sd) / peak) * (H - TOP - PAD_B)

  const N = 120
  const pts: Array<[number, number]> = []
  for (let i = 0; i <= N; i++) {
    const v = lo + ((hi - lo) * i) / N
    pts.push([xOf(v), yOf(v)])
  }
  const curve = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')

  // Shaded area left of the marker.
  const baseline = H - PAD_B
  const sx = xOf(score)
  const fillPts = pts.filter((p) => p[0] <= sx)
  const fill =
    fillPts.length > 1
      ? `M${PAD_X} ${baseline} ` +
        fillPts.map((p) => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ') +
        ` L${sx.toFixed(1)} ${baseline} Z`
      : ''

  const z = (score - mean) / sd
  const pct = zToPercentile(z)
  const sigmas = showBands ? [-3, -2, -1, 0, 1, 2, 3] : [0]

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {sigmas.map((s) => {
          const v = mean + s * sd
          return (
            <g key={s}>
              <line
                x1={xOf(v)}
                y1={TOP}
                x2={xOf(v)}
                y2={baseline}
                stroke="var(--color-border)"
                strokeWidth={s === 0 ? 1.5 : 1}
                strokeDasharray={s === 0 ? '' : '3 3'}
              />
              <text x={xOf(v)} y={H - 16} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
                {sd === 1 && mean === 0 ? (s === 0 ? '0' : `${s > 0 ? '+' : ''}${s}σ`) : Math.round(v)}
              </text>
            </g>
          )
        })}
        {fill && <path d={fill} fill="var(--color-accent)" opacity={0.25} />}
        <path d={curve} fill="none" stroke="var(--color-accent-2)" strokeWidth="2.5" />
        <line x1={sx} y1={TOP} x2={sx} y2={baseline} stroke="var(--color-accent)" strokeWidth="2" />
        <circle cx={sx} cy={yOf(score)} r="5" fill="var(--color-accent)" />
      </svg>

      <div className="px-1 pt-1">
        <SceneSlider
          label={label}
          value={score}
          min={Math.round(lo)}
          max={Math.round(hi)}
          step={sd >= 5 ? 1 : 0.1}
          unit={unit}
          onChange={setScore}
        />
        <p className="mt-2 text-center text-sm text-muted">
          z = <span className="font-mono text-ink">{z.toFixed(2)}</span> · about{' '}
          <span className="font-mono text-ink">{pct.toFixed(1)}%</span> of scores fall below this
        </p>
      </div>
    </div>
  )
}
