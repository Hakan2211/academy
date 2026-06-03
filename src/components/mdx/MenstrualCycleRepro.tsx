import { useState } from 'react'
import { cn } from '#/lib/cn'

// A day-by-day menstrual cycle explorer. A slider moves across days 1–28.
// SVG hormone curves + phase highlight + uterine lining thickness visual.
// NOTE: MenstrualCycle.tsx already existed in this folder (simpler version);
// this richer version is named MenstrualCycleRepro to avoid collision.

type Phase = {
  start: number
  end: number
  name: string
  color: string
  desc: string
}

const PHASES: Array<Phase> = [
  {
    start: 1,
    end: 5,
    name: 'Menstrual',
    color: '#E17055',
    desc: 'The uterine lining (endometrium) sheds, producing menstrual flow. Both oestrogen and progesterone are low. Duration varies — 2 to 7 days is typical.',
  },
  {
    start: 6,
    end: 13,
    name: 'Follicular',
    color: '#FD79A8',
    desc: 'FSH from the pituitary stimulates follicle growth in an ovary. The dominant follicle produces rising oestrogen, thickening the uterine lining in preparation for a potential pregnancy.',
  },
  {
    start: 14,
    end: 16,
    name: 'Ovulation',
    color: '#6C5CE7',
    desc: 'A surge of LH (luteinising hormone) triggers the release of a mature egg from the dominant follicle. The few days around ovulation are the most fertile window.',
  },
  {
    start: 17,
    end: 28,
    name: 'Luteal',
    color: '#00B894',
    desc: 'The empty follicle becomes the corpus luteum, which secretes progesterone (and some oestrogen). The lining stays thickened. If no pregnancy occurs, hormone levels fall and a new cycle begins.',
  },
]

// ─── hormone amplitude functions (returns 0..1) ──────────────────────────────

const sq = (x: number) => x * x

function oestrogen(d: number): number {
  const primary = Math.exp(-sq((d - 12) / 3))
  const secondary = 0.48 * Math.exp(-sq((d - 21) / 4.5))
  return Math.min(1, primary + secondary)
}

function progesterone(d: number): number {
  if (d < 14) return 0.04
  return Math.max(0, Math.exp(-sq((d - 21) / 4)) * 0.92)
}

function lhHormone(d: number): number {
  return Math.exp(-sq((d - 14) / 1.4))
}

// Uterine lining relative thickness 0..1
function lining(d: number): number {
  if (d <= 5) return Math.max(0.05, 0.75 - (5 - d) * 0.14)
  if (d <= 14) return 0.18 + ((d - 5) / 9) * 0.67
  if (d <= 22) return 0.85 + ((d - 14) / 8) * 0.15
  return Math.max(0.15, 1 - ((d - 22) / 6) * 0.85)
}

const HORMONES = [
  { key: 'oestrogen', label: 'Oestrogen', color: '#FD79A8', fn: oestrogen },
  { key: 'progesterone', label: 'Progesterone', color: '#00B894', fn: progesterone },
  { key: 'lh', label: 'LH surge', color: '#6C5CE7', fn: lhHormone },
]

// SVG layout
const W = 320
const H = 88
const PL = 6
const PR = 6
const xFor = (d: number) => PL + ((d - 1) / 27) * (W - PL - PR)
const yFor = (v: number) => H - 8 - v * (H - 16)

function buildPath(fn: (d: number) => number): string {
  const pts: Array<string> = []
  for (let d = 1; d <= 28; d += 0.5) {
    pts.push(`${xFor(d).toFixed(1)},${yFor(fn(d)).toFixed(1)}`)
  }
  return 'M ' + pts.join(' L ')
}

function phaseForDay(d: number): Phase {
  return PHASES.find((p) => d >= p.start && d <= p.end) ?? PHASES[3]
}

export function MenstrualCycleRepro() {
  const [day, setDay] = useState(1)
  const phase = phaseForDay(day)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Phase colour bar */}
      <div className="mb-2 flex gap-1">
        {PHASES.map((p) => (
          <div
            key={p.name}
            className={cn(
              'h-2 rounded-full transition-opacity duration-150',
              day >= p.start && day <= p.end ? 'opacity-100' : 'opacity-30',
            )}
            style={{ flex: p.end - p.start + 1, background: p.color }}
          />
        ))}
      </div>

      {/* Day slider */}
      <div className="mb-3 flex items-center gap-3">
        <span className="shrink-0 text-xs text-muted">Day</span>
        <input
          type="range"
          min={1}
          max={28}
          step={1}
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          className="flex-1 accent-accent"
        />
        <span
          className="w-16 shrink-0 rounded-lg px-2 py-0.5 text-center text-sm font-bold"
          style={{ color: phase.color, background: phase.color + '22' }}
        >
          Day {day}
        </span>
      </div>

      {/* Hormone curves SVG */}
      <svg viewBox={`0 0 ${W} ${H}`} className="mb-1 w-full">
        {/* Phase region highlight */}
        <rect
          x={xFor(phase.start)}
          width={Math.max(0, xFor(phase.end + 0.9) - xFor(phase.start))}
          y={0}
          height={H}
          fill={phase.color + '18'}
        />
        {HORMONES.map((h) => (
          <path key={h.key} d={buildPath(h.fn)} fill="none" stroke={h.color} strokeWidth={2} />
        ))}
        {/* Current-day marker */}
        <line
          x1={xFor(day)}
          x2={xFor(day)}
          y1={0}
          y2={H - 10}
          stroke="var(--color-ink)"
          strokeWidth={1}
          strokeOpacity={0.45}
          strokeDasharray="3 2"
        />
        {/* Axis day labels */}
        {[1, 7, 14, 21, 28].map((d) => (
          <text
            key={d}
            x={xFor(d)}
            y={H}
            textAnchor="middle"
            fontSize={7}
            fill="var(--color-muted)"
          >
            {d}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="mb-3 flex flex-wrap gap-3">
        {HORMONES.map((h) => (
          <div key={h.key} className="flex items-center gap-1">
            <span className="inline-block h-2 w-5 rounded-full" style={{ background: h.color }} />
            <span className="text-[11px] text-muted">{h.label}</span>
          </div>
        ))}
      </div>

      {/* Uterine lining thickness */}
      <div className="mb-3">
        <p className="mb-1 text-[11px] text-muted">Uterine lining (endometrium) thickness</p>
        <div className="h-3 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full transition-all duration-150"
            style={{ width: `${lining(day) * 100}%`, background: '#FD79A8' }}
          />
        </div>
      </div>

      {/* Phase description */}
      <div
        className="rounded-xl border p-3 transition-colors"
        style={{ borderColor: phase.color + '55', background: phase.color + '10' }}
      >
        <p className="text-sm font-semibold" style={{ color: phase.color }}>
          {phase.name} phase{' '}
          <span className="text-xs font-normal text-muted">
            (typical days {phase.start}–{phase.end})
          </span>
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{phase.desc}</p>
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        Cycle lengths of 21–35 days are all within the normal range — individual variation is common and expected.
      </p>
    </div>
  )
}
