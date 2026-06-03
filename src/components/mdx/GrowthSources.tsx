import { useState } from 'react'
import { cn } from '#/lib/cn'
import { compound } from '#/lib/econ'

// The engines of growth. An economy's output per year rises when it adds the
// ingredients of production: more workers (labour), more tools and machines
// (physical capital), more skilled and educated workers (human capital), and
// better ideas (technology). Each engine you switch on adds to the annual
// growth rate, so the whole GDP path tilts and curves higher. Technology is
// special — it multiplies the productivity of every other input, which is why
// it does the heavy lifting in the long run. Uses econ.ts compound().
const X0 = 48
const Y0 = 232
const PW = 292
const PH = 200
const YEARS = 40
const START = 10_000
const BASE = 0.5 // baseline growth (%) with no engines on

type Engine = {
  key: string
  label: string
  blurb: string
  rate: number // percentage points added to annual growth
}

const ENGINES: Array<Engine> = [
  { key: 'labour', label: 'More labour', blurb: 'a bigger workforce produces more — but adds little per person', rate: 0.4 },
  { key: 'capital', label: 'More capital', blurb: 'machines, tools and factories let each worker make more', rate: 0.8 },
  { key: 'human', label: 'Human capital', blurb: 'education and skills make workers far more productive', rate: 1.0 },
  { key: 'tech', label: 'Better technology', blurb: 'new ideas multiply the output of every other input', rate: 1.6 },
]

export function GrowthSources() {
  const [on, setOn] = useState<Record<string, boolean>>({
    labour: false, capital: true, human: false, tech: false,
  })

  const rate = BASE + ENGINES.reduce((s, e) => s + (on[e.key] ? e.rate : 0), 0)
  const maxRate = BASE + ENGINES.reduce((s, e) => s + e.rate, 0)

  // fix the y-scale to the all-engines path so toggling never rescales the axes
  const top = compound(START, maxRate, YEARS)
  const sx = (yr: number) => X0 + (yr / YEARS) * PW
  const sy = (gdp: number) => Y0 - (gdp / top) * PH

  let path = ''
  let baseline = ''
  for (let yr = 0; yr <= YEARS; yr++) {
    path += `${yr === 0 ? 'M' : 'L'}${sx(yr).toFixed(1)} ${sy(compound(START, rate, yr)).toFixed(1)} `
    baseline += `${yr === 0 ? 'M' : 'L'}${sx(yr).toFixed(1)} ${sy(compound(START, BASE, yr)).toFixed(1)} `
  }
  const finalV = compound(START, rate, YEARS)

  const toggle = (k: string) => setOn((prev) => ({ ...prev, [k]: !prev[k] }))

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {ENGINES.map((e) => (
          <button
            key={e.key}
            type="button"
            onClick={() => toggle(e.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              on[e.key]
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {e.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 260" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">years →</text>
        <text x={X0 - 6} y={Y0 - PH + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ GDP / person</text>

        {/* stagnant baseline (no engines) for contrast */}
        <path d={baseline} fill="none" stroke="var(--color-muted)" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x={sx(YEARS) - 4} y={sy(compound(START, BASE, YEARS)) + 14} textAnchor="end" fontSize="9" fill="var(--color-muted)">stagnant</text>

        {/* current growth path */}
        <path d={path} fill="none" stroke="var(--color-accent)" strokeWidth="3" />
        <circle cx={sx(YEARS)} cy={sy(finalV)} r="5" fill="var(--color-accent)" />
      </svg>

      <div className="grid grid-cols-2 gap-2 px-4 text-center text-sm">
        <div>
          <div className="font-mono text-accent">{rate.toFixed(1)}% / yr</div>
          <div className="text-xs text-muted">total growth rate</div>
        </div>
        <div>
          <div className="font-mono text-ink">${Math.round(finalV / 1000).toLocaleString('en-US')}k</div>
          <div className="text-xs text-muted">GDP / person, year {YEARS}</div>
        </div>
      </div>

      <p className="px-4 pb-4 pt-3 text-sm text-muted">
        {ENGINES.filter((e) => on[e.key]).length === 0
          ? 'No engines running — output barely creeps along the stagnant baseline. Switch one on.'
          : `Each engine adds to the annual growth rate. ${
              ENGINES.find((e) => on[e.key] && e.key === 'tech')
                ? 'Technology does the most work: it raises the productivity of every other input.'
                : 'Add better technology to see why economists credit it with most long-run growth.'
            }`}
      </p>
    </div>
  )
}
