import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'

// Does more GDP buy more happiness? Up to a point, yes — escaping poverty
// transforms life. But reported well-being follows a CONCAVE curve: each extra
// dollar of income per person adds less and less to how satisfied people say
// they are. Move a country along the income axis and watch its well-being climb
// steeply at first, then flatten. The curve also reminds us that GDP is a
// production tally, not a welfare measure: it misses leisure, the environment,
// inequality and unpaid work. A simple log-style satisfaction curve (no real
// data) makes the diminishing-returns shape vivid.
const X0 = 48
const Y0 = 232
const PW = 292
const PH = 200
const GDP_MAX = 80_000

// reported life satisfaction (0..10) as a concave function of income.
function satisfaction(gdp: number): number {
  // log curve scaled so $1k → ~2.3 and $80k → ~8.5, flattening at the top
  return Math.min(10, 1.5 + 1.55 * Math.log10(1 + gdp / 1000))
}

const MISSES = [
  { label: 'Leisure & free time', blurb: 'longer hours raise GDP but can lower well-being' },
  { label: 'The environment', blurb: 'pollution and depleted resources do not subtract' },
  { label: 'Inequality', blurb: 'an average hides who actually gets the income' },
  { label: 'Unpaid work', blurb: 'childcare, caregiving and housework go uncounted' },
]

export function BeyondGDP() {
  const [gdp, setGdp] = useState(8_000)

  const sx = (g: number) => X0 + (g / GDP_MAX) * PW
  const sy = (s: number) => Y0 - (s / 10) * PH

  let path = ''
  const N = 60
  for (let i = 0; i <= N; i++) {
    const g = (i / N) * GDP_MAX
    path += `${i === 0 ? 'M' : 'L'}${sx(g).toFixed(1)} ${sy(satisfaction(g)).toFixed(1)} `
  }

  const sat = satisfaction(gdp)
  // marginal gain in well-being from the next $1,000 — shrinks as income rises
  const marginal = satisfaction(gdp + 1000) - satisfaction(gdp)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 260" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">GDP / person →</text>
        <text x={X0 - 6} y={Y0 - PH + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ well-being</text>

        {/* satisfaction curve */}
        <path d={path} fill="none" stroke="var(--color-accent)" strokeWidth="3" />

        {/* current point + guides */}
        <line x1={sx(gdp)} y1={sy(sat)} x2={sx(gdp)} y2={Y0} stroke="var(--color-accent-2)" strokeWidth="1" strokeDasharray="3 2" />
        <line x1={sx(gdp)} y1={sy(sat)} x2={X0} y2={sy(sat)} stroke="var(--color-accent-2)" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx={sx(gdp)} cy={sy(sat)} r="6" fill="var(--color-accent-2)" />
      </svg>

      <div className="grid grid-cols-2 gap-2 px-4 text-center text-sm">
        <div>
          <div className="font-mono text-accent-2">{sat.toFixed(1)} / 10</div>
          <div className="text-xs text-muted">reported well-being</div>
        </div>
        <div>
          <div className="font-mono text-ink">+{marginal.toFixed(2)}</div>
          <div className="text-xs text-muted">gain from next $1k</div>
        </div>
      </div>

      <div
        className={cn(
          'mx-4 mt-3 rounded-xl border px-3 py-2 text-center text-sm',
          gdp < 20_000 ? 'border-success/50 text-success' : 'border-accent-2/50 text-accent-2',
        )}
      >
        {gdp < 20_000
          ? 'Early on, more income transforms life — clean water, food, health, schooling. Each $1,000 adds a lot.'
          : 'Past a comfortable level, extra income barely moves reported well-being — the curve has flattened.'}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="GDP per person" value={gdp} min={1000} max={GDP_MAX} step={1000} unit="$" onChange={setGdp} />
        <div>
          <div className="mb-2 text-sm text-ink">What GDP leaves out</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {MISSES.map((m) => (
              <div key={m.label} className="rounded-xl border border-border px-3 py-2 text-sm">
                <div className="text-ink">{m.label}</div>
                <div className="text-xs text-muted">{m.blurb}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
