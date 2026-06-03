import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { compound, ruleOf70 } from '#/lib/econ'

// The miracle of compound growth. Real GDP per capita that rises by even a few
// percent a year doesn't add — it MULTIPLIES, so the path curves upward ever
// more steeply. The rule of 70 turns a growth rate into a doubling time. Plot
// two countries that start level but grow at slightly different rates and watch
// a tiny gap fan out into a vast difference over a lifetime. Uses econ.ts
// compound() for the exponential path and ruleOf70() for the doubling time.
// Reused by lesson 3 (The Power of Compounding).
const X0 = 48
const Y0 = 252
const PW = 292
const PH = 222
const YEARS = 50
const START = 10_000 // starting real GDP per capita (both countries)

export function GrowthCompounding() {
  const [rateA, setRateA] = useState(1.5)
  const [rateB, setRateB] = useState(3)

  // both paths share a y-scale set by the higher final value
  const finalA = compound(START, rateA, YEARS)
  const finalB = compound(START, rateB, YEARS)
  const top = Math.max(finalA, finalB, START * 2)

  const sx = (yr: number) => X0 + (yr / YEARS) * PW
  const sy = (gdp: number) => Y0 - (gdp / top) * PH

  const pathFor = (rate: number) => {
    let d = ''
    for (let yr = 0; yr <= YEARS; yr++) {
      const v = compound(START, rate, yr)
      d += `${yr === 0 ? 'M' : 'L'}${sx(yr).toFixed(1)} ${sy(v).toFixed(1)} `
    }
    return d
  }

  const doubleA = ruleOf70(rateA)
  const doubleB = ruleOf70(rateB)
  const ratio = finalA > 0 ? finalB / finalA : Infinity

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">years →</text>
        <text x={X0 - 6} y={Y0 - PH + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ GDP / person</text>

        {/* starting level guide */}
        <line x1={X0} y1={sy(START)} x2={X0 + PW} y2={sy(START)} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

        {/* the two growth paths */}
        <path d={pathFor(rateA)} fill="none" stroke="var(--color-accent-2)" strokeWidth="3" />
        <path d={pathFor(rateB)} fill="none" stroke="var(--color-accent)" strokeWidth="3" />

        {/* endpoint markers */}
        <circle cx={sx(YEARS)} cy={sy(finalA)} r="5" fill="var(--color-accent-2)" />
        <circle cx={sx(YEARS)} cy={sy(finalB)} r="5" fill="var(--color-accent)" />
        <text x={sx(YEARS) - 6} y={sy(finalA) + 4} textAnchor="end" fontSize="10" fill="var(--color-accent-2)">slow</text>
        <text x={sx(YEARS) - 6} y={sy(finalB) + 4} textAnchor="end" fontSize="10" fill="var(--color-accent)">fast</text>
      </svg>

      <div className="grid grid-cols-2 gap-2 px-4 text-center text-sm">
        <div>
          <div className="font-mono text-accent-2">{formatK(finalA)}</div>
          <div className="text-xs text-muted">slow country, year {YEARS}</div>
        </div>
        <div>
          <div className="font-mono text-accent">{formatK(finalB)}</div>
          <div className="text-xs text-muted">fast country, year {YEARS}</div>
        </div>
      </div>

      <div
        className="mx-4 mt-3 rounded-xl border border-accent/50 px-3 py-2 text-center text-sm text-accent"
      >
        After {YEARS} years the fast country is{' '}
        <span className="font-mono">{ratio === Infinity ? '∞' : ratio.toFixed(1)}×</span> richer — from a gap of just{' '}
        <span className="font-mono">{(rateB - rateA).toFixed(1)}</span> points a year. Income doubles every{' '}
        <span className="font-mono">{doubleB === Infinity ? '∞' : Math.round(doubleB)}</span> years for the fast country
        vs <span className="font-mono">{doubleA === Infinity ? '∞' : Math.round(doubleA)}</span> for the slow one (rule of 70).
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Slow country growth" value={rateA} min={0} max={6} step={0.1} unit="% / yr" onChange={setRateA} />
        <SceneSlider label="Fast country growth" value={rateB} min={0} max={6} step={0.1} unit="% / yr" onChange={setRateB} />
      </div>
    </div>
  )
}

function formatK(n: number): string {
  return '$' + Math.round(n / 1000).toLocaleString('en-US') + 'k'
}
