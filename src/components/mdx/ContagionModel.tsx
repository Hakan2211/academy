import { useMemo, useState } from 'react'
import { cn } from '#/lib/cn'
import { herdThreshold, formatPct, round } from '#/lib/health'

// Epidemic model: adjust R₀ and the immune fraction to see whether an outbreak
// grows (R > 1) or fizzles (R < 1). Shows the herd-immunity threshold.
// Owner: disease-and-prevention (W11).

const GRID_SIZE = 100 // 10×10 dots

/** Build a deterministic 10×10 grid: each cell is S, V, or I. */
function buildGrid(immuneFrac: number, r0: number): Array<'S' | 'V' | 'I'> {
  const Re = round(r0 * (1 - immuneFrac), 2)
  const growing = Re > 1

  // Seed infected cells proportional to outbreak size
  const grid: Array<'S' | 'V' | 'I'> = []
  const vaccCount = Math.round(immuneFrac * GRID_SIZE)
  const infCount = growing ? Math.min(8, Math.round((Re - 1) * 4 + 1)) : 1

  // Fill vaccinated first (deterministic top-left fill)
  let vacc = 0
  for (let i = 0; i < GRID_SIZE; i++) {
    if (vacc < vaccCount) { grid.push('V'); vacc++ }
    else grid.push('S')
  }

  // Mark infected among susceptible cells
  let inf = 0
  for (let i = 0; i < GRID_SIZE; i++) {
    if (grid[i] === 'S' && inf < infCount) { grid[i] = 'I'; inf++ }
  }

  return grid
}

export function ContagionModel() {
  const [r0, setR0] = useState(2.5)
  const [immuneFrac, setImmuneFrac] = useState(0.3)

  const threshold = herdThreshold(r0)
  const Re = round(r0 * (1 - immuneFrac), 2)
  const growing = Re > 1
  const clears = immuneFrac >= threshold

  const grid = useMemo(() => buildGrid(immuneFrac, r0), [immuneFrac, r0])

  const immPct = Math.round(immuneFrac * 100)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4 space-y-4">
      {/* sliders */}
      <div className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted">Basic reproduction number R₀</span>
            <span className="font-semibold text-ink">{r0.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={5}
            max={60}
            value={Math.round(r0 * 10)}
            onChange={(e) => setR0(parseInt(e.target.value) / 10)}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-[10px] text-muted">
            <span>0.5 (flu-like)</span>
            <span>6 (measles-like)</span>
          </div>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted">Immune / vaccinated fraction</span>
            <span className="font-semibold text-ink">{formatPct(immuneFrac)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={immPct}
            onChange={(e) => setImmuneFrac(parseInt(e.target.value) / 100)}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-[10px] text-muted">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* key outputs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface-2 p-2 text-center">
          <p className="text-[10px] text-muted">Effective R (Rₑ)</p>
          <p className={cn('text-lg font-bold', growing ? 'text-warn' : 'text-success')}>
            {Re.toFixed(2)}
          </p>
          <p className="text-[10px] text-muted">{growing ? 'Outbreak grows' : 'Outbreak fizzles'}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-2 p-2 text-center">
          <p className="text-[10px] text-muted">Herd threshold</p>
          <p className="text-lg font-bold text-accent">{formatPct(threshold)}</p>
          <p className="text-[10px] text-muted">= 1 − 1/R₀</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-2 p-2 text-center col-span-2 sm:col-span-1">
          <p className="text-[10px] text-muted">Herd immunity</p>
          <p className={cn('text-lg font-bold', clears ? 'text-success' : 'text-warn')}>
            {clears ? 'Reached' : 'Not reached'}
          </p>
          <p className="text-[10px] text-muted">
            {clears
              ? `${formatPct(immuneFrac)} ≥ ${formatPct(threshold)}`
              : `Need ${formatPct(threshold - immuneFrac, 1)} more`}
          </p>
        </div>
      </div>

      {/* visual grid 10×10 */}
      <div>
        <p className="mb-1.5 text-xs text-muted">
          Population snapshot (100 people):
          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[#74b9ff]" /> Immune
          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[#E74C3C]" /> Infected
          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[#b2bec3]" /> Susceptible
        </p>
        <div className="grid grid-cols-10 gap-0.5">
          {grid.map((cell, i) => (
            <div
              key={i}
              className="aspect-square rounded-sm"
              style={{
                background:
                  cell === 'V' ? '#74b9ff' :
                  cell === 'I' ? '#E74C3C' :
                  '#b2bec3',
              }}
            />
          ))}
        </div>
      </div>

      {/* progress bar toward threshold */}
      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted">Progress toward herd-immunity threshold</span>
          <span className={cn('font-semibold', clears ? 'text-success' : 'text-muted')}>
            {formatPct(Math.min(immuneFrac / (threshold || 1)))}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(100, threshold > 0 ? (immuneFrac / threshold) * 100 : 100)}%`,
              background: clears ? 'var(--color-success)' : 'var(--color-accent)',
            }}
          />
          {threshold > 0 && (
            <div
              className="relative -mt-3 h-3 w-0.5 bg-warn"
              style={{ marginLeft: `${Math.min(99, threshold * 100)}%` }}
            />
          )}
        </div>
        <p className="mt-0.5 text-[10px] text-muted">Orange bar = herd-immunity threshold</p>
      </div>

      <p className="text-xs text-muted">
        Rₑ = R₀ × (1 − immune fraction). When Rₑ drops below 1, each case infects fewer than one
        person on average and the outbreak dies out on its own.
      </p>
    </div>
  )
}
