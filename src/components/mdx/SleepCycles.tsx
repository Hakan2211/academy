import { useState } from 'react'
import { cn } from '#/lib/cn'

// Sleep architecture hypnogram: stages on Y-axis, hours on X-axis.
// Each cycle ~90 min; deep (N3) dominates early cycles, REM expands toward morning.

const STAGES = ['Awake', 'REM', 'N1', 'N2', 'N3'] as const
type Stage = (typeof STAGES)[number]

const STAGE_Y: Record<Stage, number> = {
  Awake: 0,
  REM: 1,
  N1: 2,
  N2: 3,
  N3: 4,
}

// One "prototype" night of ~8 h — each entry [startMin, stage]
const BASE_SEQUENCE: Array<[number, Stage]> = [
  [0,   'N1'],
  [10,  'N2'],
  [22,  'N3'],
  [50,  'N2'],
  [58,  'REM'],
  [68,  'N2'],  // end cycle 1
  [75,  'N2'],
  [82,  'N3'],
  [105, 'N2'],
  [112, 'REM'],
  [127, 'N2'],  // end cycle 2
  [132, 'N1'],
  [136, 'N3'],
  [152, 'N2'],
  [160, 'REM'],
  [182, 'N2'],  // end cycle 3
  [186, 'N1'],
  [192, 'N3'],
  [202, 'N2'],
  [212, 'REM'],
  [240, 'N2'],  // end cycle 4
  [244, 'N1'],
  [248, 'N2'],
  [262, 'REM'],
  [295, 'Awake'], // end cycle 5
  [300, 'Awake'],
]

const STAGE_COLOR: Record<Stage, string> = {
  Awake: '#a78bfa',
  REM:   '#6C5CE7',
  N1:    '#818cf8',
  N2:    '#38bdf8',
  N3:    '#0ea5e9',
}

const STAGE_LABEL: Record<Stage, string> = {
  Awake: 'Awake',
  REM:   'REM (dreaming)',
  N1:    'N1 light',
  N2:    'N2 light-deep',
  N3:    'N3 deep',
}

const W = 540
const H = 200
const PAD_L = 42
const PAD_R = 12
const PAD_T = 12
const PAD_B = 28
const CHART_W = W - PAD_L - PAD_R
const CHART_H = H - PAD_T - PAD_B

function minutesToX(min: number, totalMin: number) {
  return PAD_L + (min / totalMin) * CHART_W
}

function stageToY(stage: Stage) {
  return PAD_T + (STAGE_Y[stage] / (STAGES.length - 1)) * CHART_H
}

function buildPath(hours: number): string {
  const totalMin = hours * 60
  const clipped = BASE_SEQUENCE.filter(([t]) => t <= totalMin)
  if (clipped.length === 0) return ''

  const last = clipped[clipped.length - 1]
  const pts: Array<[number, Stage]> =
    last[0] < totalMin ? [...clipped, [totalMin, last[1]]] : clipped

  return pts
    .map(([t, s], i) => {
      const x = minutesToX(t, totalMin)
      const y = stageToY(s)
      return i === 0 ? `M${x},${y}` : `H${x}V${y}`
    })
    .join(' ')
}

function getLostLabel(hours: number): string {
  if (hours >= 8) return 'Full night — all cycles complete.'
  if (hours >= 7) return 'Losing ~30 min of late REM (less memory consolidation).'
  if (hours >= 6) return 'Missing the 5th cycle — losing ~60 min of REM.'
  if (hours >= 5) return 'Only 3–4 cycles. Deep sleep secured; most REM lost.'
  return 'Severe short-sleep — only early N3; almost no REM.'
}

export function SleepCycles() {
  const [hours, setHours] = useState(8)

  const path = buildPath(hours)
  const totalMin = hours * 60

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-semibold text-ink">Sleep architecture — hypnogram</p>
      <p className="mb-3 text-xs text-muted">
        Each cycle ≈ 90 min. Early night = more deep sleep (N3); later cycles = more REM.
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Y axis labels */}
        {STAGES.map((s) => (
          <text
            key={s}
            x={PAD_L - 4}
            y={stageToY(s) + 4}
            textAnchor="end"
            fontSize="9"
            fill={STAGE_COLOR[s]}
            fontWeight="600"
          >
            {s}
          </text>
        ))}

        {/* X axis hour ticks */}
        {Array.from({ length: hours + 1 }, (_, i) => i).map((h) => {
          const x = minutesToX(h * 60, totalMin)
          return (
            <g key={h}>
              <line x1={x} y1={PAD_T} x2={x} y2={PAD_T + CHART_H} stroke="var(--color-border)" strokeWidth="0.5" />
              <text x={x} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
                {h}h
              </text>
            </g>
          )
        })}

        {/* horizontal grid lines per stage */}
        {STAGES.map((s) => (
          <line
            key={`grid-${s}`}
            x1={PAD_L}
            y1={stageToY(s)}
            x2={W - PAD_R}
            y2={stageToY(s)}
            stroke="var(--color-border)"
            strokeWidth="0.4"
            strokeDasharray="3 3"
          />
        ))}

        {/* the hypnogram line */}
        <path
          d={path}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* shade under the line down to N3 level for visual weight */}
        <path
          d={`${path} V${stageToY('N3') + 6} H${PAD_L} Z`}
          fill="var(--color-accent)"
          fillOpacity="0.07"
        />
      </svg>

      {/* Slider */}
      <div className="mt-2 px-1">
        <div className="flex items-center justify-between text-xs text-muted mb-1">
          <span>Hours slept</span>
          <span className="font-semibold text-ink">{hours} h</span>
        </div>
        <input
          type="range"
          min={4}
          max={9}
          step={0.5}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="accent-accent w-full"
        />
        <div className="flex justify-between text-xs text-muted mt-0.5">
          <span>4 h</span><span>9 h</span>
        </div>
      </div>

      {/* What you lose */}
      <p
        className={cn(
          'mt-3 rounded-xl border px-3 py-2 text-xs',
          hours < 7
            ? 'border-warn/50 bg-warn/10 text-warn'
            : 'border-border bg-surface-2 text-muted',
        )}
      >
        {getLostLabel(hours)}
      </p>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
        {STAGES.map((s) => (
          <span key={s} className="flex items-center gap-1 text-xs text-muted">
            <span
              className="inline-block h-2 w-5 rounded-sm"
              style={{ background: STAGE_COLOR[s] }}
            />
            {STAGE_LABEL[s]}
          </span>
        ))}
      </div>
    </div>
  )
}
