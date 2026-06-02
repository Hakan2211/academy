import { useMemo, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// The flagship: a full night's HYPNOGRAM. A sleeper descends through the stages
// in ~90-minute cycles. Early cycles are dominated by deep N3 sleep; as the
// night goes on, N3 shrinks and REM lengthens, so dreaming peaks toward morning.
// Scrub the marker through the ~8 hours and read the current stage.
type Stage = 'Awake' | 'REM' | 'N1' | 'N2' | 'N3'

// Drawn top (Awake) to bottom (N3). REM sits just below Awake — brain active,
// body still.
const STAGE_ROW: Record<Stage, number> = {
  Awake: 0,
  REM: 1,
  N1: 2,
  N2: 3,
  N3: 4,
}

const STAGE_INFO: Record<Stage, { color: string; blurb: string }> = {
  Awake: { color: '#FDCB6E', blurb: 'Brief arousals — you rarely remember these short wakings near the surface of sleep.' },
  REM: { color: '#E056FD', blurb: 'Rapid Eye Movement: the brain is almost as active as waking, vivid dreams play, and the body is paralysed so you cannot act them out.' },
  N1: { color: '#74B9FF', blurb: 'The light doorway into sleep — drifting, easily woken, sometimes a falling jolt (a hypnic jerk).' },
  N2: { color: '#0984E3', blurb: 'Light sleep where you spend about half the night. Sleep spindles and K-complexes appear; the body quietens.' },
  N3: { color: '#341f97', blurb: 'Deep slow-wave sleep — hardest to wake from, most physically restorative. It dominates the first half of the night.' },
}

const ROWS: ReadonlyArray<Stage> = ['Awake', 'REM', 'N1', 'N2', 'N3']

// A hand-authored hypnogram: segments of {stage, untilMinutes} across ~480 min.
// Pattern: drop quickly to N3, climb, dip into N2/REM; REM grows, N3 vanishes.
const TOTAL_MIN = 480
const SEGMENTS: ReadonlyArray<{ stage: Stage; end: number }> = [
  { stage: 'Awake', end: 5 },
  { stage: 'N1', end: 12 },
  { stage: 'N2', end: 25 },
  { stage: 'N3', end: 60 }, // long deep dive, cycle 1
  { stage: 'N2', end: 75 },
  { stage: 'REM', end: 85 }, // short first REM
  { stage: 'N2', end: 100 },
  { stage: 'N3', end: 135 }, // still lots of deep sleep, cycle 2
  { stage: 'N2', end: 150 },
  { stage: 'REM', end: 170 },
  { stage: 'N2', end: 195 },
  { stage: 'N3', end: 215 }, // last meaningful N3, cycle 3
  { stage: 'N2', end: 235 },
  { stage: 'REM', end: 265 }, // REM getting longer
  { stage: 'N2', end: 290 },
  { stage: 'Awake', end: 295 }, // brief arousal
  { stage: 'N2', end: 320 },
  { stage: 'REM', end: 360 }, // cycle 4, long REM
  { stage: 'N2', end: 385 },
  { stage: 'REM', end: 440 }, // cycle 5, longest REM near morning
  { stage: 'N1', end: 470 },
  { stage: 'Awake', end: TOTAL_MIN },
]

function stageAt(min: number): Stage {
  for (const seg of SEGMENTS) {
    if (min <= seg.end) return seg.stage
  }
  return 'Awake'
}

const W = 360
const H = 220
const PAD_L = 40
const PAD_R = 12
const PAD_T = 14
const ROW_H = 30
const PLOT_W = W - PAD_L - PAD_R

function xFor(min: number): number {
  return PAD_L + (min / TOTAL_MIN) * PLOT_W
}
function yFor(stage: Stage): number {
  return PAD_T + STAGE_ROW[stage] * ROW_H + ROW_H / 2
}

function fmtClock(min: number): string {
  // Night starts at 11:00pm; minutes count forward from there.
  const total = (23 * 60 + min) % (24 * 60)
  const hh = Math.floor(total / 60)
  const mm = Math.round(total % 60)
  const ampm = hh >= 12 ? 'pm' : 'am'
  const h12 = hh % 12 === 0 ? 12 : hh % 12
  return `${h12}:${String(mm).padStart(2, '0')}${ampm}`
}

export function SleepHypnogram() {
  const [min, setMin] = useState(60)

  // Build the stepped hypnogram line as a path.
  const linePath = useMemo(() => {
    let d = `M${xFor(0).toFixed(1)} ${yFor('Awake').toFixed(1)}`
    let prevEnd = 0
    for (const seg of SEGMENTS) {
      const y = yFor(seg.stage).toFixed(1)
      // vertical step at the transition, then horizontal across the segment
      d += ` L${xFor(prevEnd).toFixed(1)} ${y}`
      d += ` L${xFor(seg.end).toFixed(1)} ${y}`
      prevEnd = seg.end
    }
    return d
  }, [])

  const cur = stageAt(min)
  const info = STAGE_INFO[cur]

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Row guides + labels */}
        {ROWS.map((s) => (
          <g key={s}>
            <line
              x1={PAD_L}
              y1={yFor(s).toFixed(1)}
              x2={W - PAD_R}
              y2={yFor(s).toFixed(1)}
              stroke="var(--color-border)"
              strokeWidth={1}
              strokeDasharray="2 4"
            />
            <text x={PAD_L - 6} y={(yFor(s) + 3).toFixed(1)} textAnchor="end" fontSize="10" fill={STAGE_INFO[s].color}>
              {s}
            </text>
          </g>
        ))}

        {/* The hypnogram trace */}
        <path d={linePath} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinejoin="round" />

        {/* Scrub marker */}
        <line
          x1={xFor(min).toFixed(1)}
          y1={PAD_T - 4}
          x2={xFor(min).toFixed(1)}
          y2={PAD_T + 5 * ROW_H}
          stroke="var(--color-ink)"
          strokeWidth={1.5}
        />
        <circle cx={xFor(min).toFixed(1)} cy={yFor(cur).toFixed(1)} r={5} fill={info.color} stroke="var(--color-ink)" strokeWidth={1.5} />

        {/* Hour ticks along the bottom */}
        {[0, 90, 180, 270, 360, 450].map((m) => (
          <text key={m} x={xFor(m).toFixed(1)} y={H - 4} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
            {fmtClock(m)}
          </text>
        ))}
      </svg>

      <div className="mt-2">
        <SceneSlider
          label="Time through the night"
          value={min / 60}
          min={0}
          max={TOTAL_MIN / 60}
          step={0.1}
          unit="h"
          onChange={(v) => setMin(v * 60)}
        />
      </div>

      <div className="mt-2 rounded-xl bg-surface-2 p-3">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: info.color }} />
          <span style={{ color: info.color }}>{cur}</span>
          <span className="font-normal text-muted">· {fmtClock(min)}</span>
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{info.blurb}</p>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-muted">
        Notice the shape of the night: <span className="font-medium text-ink">deep N3 dominates early</span> cycles, then fades —
        while <span className="font-medium text-ink">REM periods lengthen toward morning</span>, which is why your most vivid
        dreams come just before you wake.
      </p>
    </div>
  )
}
