import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { compound } from '#/lib/econ'

// Convergence (the "catch-up effect"): a poor country can grow FASTER than a
// rich one, because copying proven technology and adding the first machines
// yields huge gains, while a rich country has already picked the low-hanging
// fruit. So incomes converge — the poor line climbs to meet the rich one. But
// convergence is not automatic. Flip on the POVERTY TRAP and weak institutions
// (insecure property, corruption, no rule of law) choke the poor country's
// growth, so the gap never closes. Uses econ.ts compound().
const X0 = 48
const Y0 = 240
const PW = 292
const PH = 208
const YEARS = 60
const RICH_START = 40_000
const POOR_START = 5_000
const RICH_RATE = 1.5

export function ConvergenceLab() {
  const [poorRate, setPoorRate] = useState(5)
  const [trap, setTrap] = useState(false)

  // institutions cap the poor country's effective growth in a poverty trap
  const effPoor = trap ? Math.min(poorRate, 0.8) : poorRate

  const richFinal = compound(RICH_START, RICH_RATE, YEARS)
  const poorFinal = compound(POOR_START, effPoor, YEARS)
  const top = Math.max(richFinal, poorFinal) * 1.05

  const sx = (yr: number) => X0 + (yr / YEARS) * PW
  const sy = (gdp: number) => Y0 - (gdp / top) * PH

  const pathFor = (start: number, rate: number) => {
    let d = ''
    for (let yr = 0; yr <= YEARS; yr++) {
      d += `${yr === 0 ? 'M' : 'L'}${sx(yr).toFixed(1)} ${sy(compound(start, rate, yr)).toFixed(1)} `
    }
    return d
  }

  // year the poor country first reaches the rich country's income (if ever)
  let catchUp = -1
  for (let yr = 0; yr <= YEARS; yr++) {
    if (compound(POOR_START, effPoor, yr) >= compound(RICH_START, RICH_RATE, yr)) {
      catchUp = yr
      break
    }
  }
  const gap = richFinal / poorFinal

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        <button
          type="button"
          onClick={() => setTrap((t) => !t)}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            trap
              ? 'border-accent bg-accent/15 text-accent'
              : 'border-border text-muted hover:text-ink',
          )}
        >
          Poverty trap (weak institutions)
        </button>
      </div>

      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">years →</text>
        <text x={X0 - 6} y={Y0 - PH + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ GDP / person</text>

        {/* rich country (slow) */}
        <path d={pathFor(RICH_START, RICH_RATE)} fill="none" stroke="var(--color-accent-2)" strokeWidth="3" />
        <text x={sx(YEARS) - 4} y={sy(richFinal) - 8} textAnchor="end" fontSize="10" fill="var(--color-accent-2)">rich</text>

        {/* poor country (fast, unless trapped) */}
        <path d={pathFor(POOR_START, effPoor)} fill="none" stroke="var(--color-accent)" strokeWidth="3" />
        <text x={sx(YEARS) - 4} y={sy(poorFinal) + 14} textAnchor="end" fontSize="10" fill="var(--color-accent)">poor</text>

        {/* catch-up marker */}
        {catchUp >= 0 && (
          <>
            <line x1={sx(catchUp)} y1={Y0} x2={sx(catchUp)} y2={sy(compound(POOR_START, effPoor, catchUp))} stroke="var(--color-success)" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx={sx(catchUp)} cy={sy(compound(POOR_START, effPoor, catchUp))} r="5" fill="var(--color-success)" />
            <text x={sx(catchUp)} y={sy(compound(POOR_START, effPoor, catchUp)) - 8} textAnchor="middle" fontSize="9" fill="var(--color-success)">caught up</text>
          </>
        )}
      </svg>

      <div
        className={cn(
          'mx-4 rounded-xl border px-3 py-2 text-center text-sm',
          trap
            ? 'border-accent/50 text-accent'
            : catchUp >= 0 ? 'border-success/50 text-success' : 'border-accent-2/50 text-accent-2',
        )}
      >
        {trap
          ? `Poverty trap: weak institutions cap growth at ${effPoor.toFixed(1)}%. After ${YEARS} years the rich country is still ${gap.toFixed(1)}× richer — the gap never closes.`
          : catchUp >= 0
            ? `Convergence! Growing at ${poorRate.toFixed(1)}% the poor country catches the rich one in year ${catchUp}.`
            : `Closing the gap: at ${poorRate.toFixed(1)}% the poor country is gaining but needs more than ${YEARS} years (now ${gap.toFixed(1)}× behind).`}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Poor country growth" value={poorRate} min={0} max={8} step={0.1} unit="% / yr" onChange={setPoorRate} />
        <p className="text-sm text-muted">
          The rich country grows at a steady {RICH_RATE}% — it has already exploited the easy gains. A poor country can
          grow faster by adopting proven technology and adding its first machines, letting incomes <span className="text-ink">converge</span>.
          But that only happens with the institutions — secure property, rule of law, working markets — that reward investment.
        </p>
      </div>
    </div>
  )
}
