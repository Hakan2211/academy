import { useState } from 'react'
import { cn } from '#/lib/cn'

// SVG chart: pathogen load and immune response over ~14 days.
// Toggle "prior immunity / vaccinated" to see faster, stronger response.

const W = 540
const H = 200
const PAD_L = 40
const PAD_R = 12
const PAD_T = 16
const PAD_B = 30
const CHART_W = W - PAD_L - PAD_R
const CHART_H = H - PAD_T - PAD_B

const DAYS = 14

function dayToX(day: number) {
  return PAD_L + (day / DAYS) * CHART_W
}
function valToY(val: number) {
  // val 0..1 → Y (1 = top = PAD_T, 0 = bottom)
  return PAD_T + (1 - val) * CHART_H
}

// Smooth bell / sigmoid helpers
function bell(x: number, centre: number, width: number, peak: number) {
  return peak * Math.exp(-0.5 * ((x - centre) / width) ** 2)
}
function sigmoid(x: number, centre: number, steepness: number) {
  return 1 / (1 + Math.exp(-steepness * (x - centre)))
}

function buildCurve(
  fn: (x: number) => number,
  steps = 120,
): string {
  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const day = (i / steps) * DAYS
    const v = Math.max(0, Math.min(1, fn(day)))
    return `${dayToX(day).toFixed(1)},${valToY(v).toFixed(1)}`
  })
  return 'M' + pts.join(' L')
}

// --- Naive (no prior immunity) curves ---
// Pathogen: rises quickly on day 1-3, peaks around day 4-5, then cleared by day 10
const pathogenNaive = (d: number) =>
  bell(d, 4.5, 1.6, 0.85) + bell(d, 7, 2.2, 0.15)

// Immune response: slow ramp-up, peaks ~day 8, resolves ~day 14
const immuneNaive = (d: number) =>
  0.9 * sigmoid(d, 5.5, 1.2) * (1 - sigmoid(d, 11, 1.0))

// --- With prior immunity / vaccinated ---
// Pathogen: barely rises (nipped quickly), peak day 2, clears day 5
const pathogenImmune = (d: number) => bell(d, 2, 0.9, 0.22)

// Immune response: very fast, strong, clears quickly
const immuneImmune = (d: number) =>
  0.95 * sigmoid(d, 1.8, 3.5) * (1 - sigmoid(d, 5.5, 1.8))

const PATHOGEN_COLOUR = '#E74C3C'
const IMMUNE_COLOUR = '#1ABC9C'

export function InfectionTimeline() {
  const [vaccinated, setVaccinated] = useState(false)

  const pathogenFn = vaccinated ? pathogenImmune : pathogenNaive
  const immuneFn = vaccinated ? immuneImmune : immuneNaive

  const pathogenPath = buildCurve(pathogenFn)
  const immunePath = buildCurve(immuneFn)

  // Area fills
  const pathogenArea = pathogenPath + ` L${dayToX(DAYS)},${valToY(0)} L${dayToX(0)},${valToY(0)} Z`
  const immuneArea = immunePath + ` L${dayToX(DAYS)},${valToY(0)} L${dayToX(0)},${valToY(0)} Z`

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-semibold text-ink">Infection Timeline</p>
      <p className="mb-3 text-xs text-muted">
        How pathogen load and your immune response change over two weeks.
      </p>

      {/* Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setVaccinated(false)}
          className={cn(
            'flex-1 rounded-xl border px-3 py-2 text-xs transition-colors',
            !vaccinated ? 'border-accent bg-accent/15 font-semibold text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          No prior immunity
        </button>
        <button
          type="button"
          onClick={() => setVaccinated(true)}
          className={cn(
            'flex-1 rounded-xl border px-3 py-2 text-xs transition-colors',
            vaccinated ? 'border-accent bg-accent/15 font-semibold text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          Vaccinated / prior immunity
        </button>
      </div>

      {/* Chart */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((v) => (
          <line
            key={v}
            x1={PAD_L}
            y1={valToY(v)}
            x2={W - PAD_R}
            y2={valToY(v)}
            stroke="var(--color-border)"
            strokeWidth="0.5"
            strokeDasharray="3 3"
          />
        ))}

        {/* Y axis label */}
        <text
          x={8}
          y={PAD_T + CHART_H / 2}
          fontSize="8"
          fill="var(--color-muted)"
          textAnchor="middle"
          transform={`rotate(-90 8 ${PAD_T + CHART_H / 2})`}
        >
          Relative level
        </text>

        {/* X axis ticks */}
        {[0, 2, 4, 6, 8, 10, 12, 14].map((d) => (
          <g key={d}>
            <line
              x1={dayToX(d)} y1={PAD_T} x2={dayToX(d)} y2={PAD_T + CHART_H}
              stroke="var(--color-border)" strokeWidth="0.4"
            />
            <text x={dayToX(d)} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
              Day {d}
            </text>
          </g>
        ))}

        {/* Pathogen area */}
        <path d={pathogenArea} fill={PATHOGEN_COLOUR} fillOpacity="0.12" />
        <path d={pathogenPath} fill="none" stroke={PATHOGEN_COLOUR} strokeWidth="2.5" strokeLinecap="round" />

        {/* Immune area */}
        <path d={immuneArea} fill={IMMUNE_COLOUR} fillOpacity="0.12" />
        <path d={immunePath} fill="none" stroke={IMMUNE_COLOUR} strokeWidth="2.5" strokeLinecap="round" />

        {/* Symptom zone label */}
        {!vaccinated && (
          <text x={dayToX(4.5)} y={valToY(0.86) - 6} textAnchor="middle" fontSize="8" fill={PATHOGEN_COLOUR} fontWeight="600">
            symptoms peak
          </text>
        )}
        {vaccinated && (
          <text x={dayToX(2)} y={valToY(0.23) - 6} textAnchor="middle" fontSize="8" fill={PATHOGEN_COLOUR} fontWeight="600">
            mild / no symptoms
          </text>
        )}
      </svg>

      {/* Legend */}
      <div className="mt-2 flex gap-4">
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <span className="inline-block h-2.5 w-5 rounded-sm" style={{ background: PATHOGEN_COLOUR }} />
          Pathogen load
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <span className="inline-block h-2.5 w-5 rounded-sm" style={{ background: IMMUNE_COLOUR }} />
          Immune response
        </span>
      </div>

      {/* Commentary */}
      <div className="mt-3 rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
        {vaccinated
          ? "With prior immunity, the immune system recognises the pathogen immediately. The response ramps up within hours — the pathogen barely rises before it's cleared. Symptoms are mild or absent, and recovery is rapid."
          : "Without prior immunity, it takes 4–7 days for adaptive immunity to gear up. Symptoms worsen as the pathogen peaks, then fade as antibodies and T cells clear it — leaving memory cells behind."}
      </div>
    </div>
  )
}
