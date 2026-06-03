import { useState } from 'react'
import { cn } from '#/lib/cn'

// Toggle training approach and see how training load and resulting fitness
// change over 8 weeks. Teaches: adaptation happens during recovery;
// progress = gradual + consistent.

type Approach = 'little' | 'right' | 'much'

type ApproachDef = {
  id: Approach
  label: string
  color: string
  desc: string
  outcome: string
}

const APPROACHES: Array<ApproachDef> = [
  {
    id: 'little',
    label: 'Too little',
    color: '#3498DB',
    desc: 'Load stays flat week after week — you do the same workout without ever increasing the challenge.',
    outcome: 'The body adapts quickly and then plateaus. Without new stimulus, there is no reason to keep improving.',
  },
  {
    id: 'right',
    label: 'Just right',
    color: '#2ECC71',
    desc: 'Load rises gradually (~5–10% per week) with planned rest days for recovery and adaptation.',
    outcome: 'Fitness climbs steadily. Adaptation happens during rest — the work creates the signal; recovery creates the gain.',
  },
  {
    id: 'much',
    label: 'Too much',
    color: '#E74C3C',
    desc: 'Load spikes suddenly (doubling or tripling effort), skipping recovery. Classic overtraining pattern.',
    outcome: 'Initial gains then crash — accumulated fatigue, injury risk, and performance decline. Fitness drops below the starting point.',
  },
]

// Generate 8-week curves for load and fitness for each approach.
// All values are relative (0–100 arbitrary units).
function getCurve(approach: Approach): { load: number[]; fitness: number[] } {
  const weeks = 8
  const load: number[] = []
  const fitness: number[] = []

  for (let w = 0; w < weeks; w++) {
    if (approach === 'little') {
      load.push(35)
      fitness.push(w === 0 ? 42 : w === 1 ? 47 : 48 + (w > 3 ? 0 : 1))
    } else if (approach === 'right') {
      const l = 30 + w * 8
      load.push(Math.min(l, 90))
      // Fitness lags load by ~1 week and rises smoothly
      const f = 40 + w * 8.5
      fitness.push(Math.min(f, 96))
    } else {
      // Too much: spiky load
      const spikes = [35, 75, 80, 70, 85, 60, 65, 55]
      load.push(spikes[w] ?? 50)
      // Fitness rises briefly then crashes
      const fit = [42, 52, 55, 48, 38, 30, 28, 32]
      fitness.push(fit[w] ?? 40)
    }
  }
  return { load, fitness }
}

const WEEK_LABELS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']

function MiniChart({
  load,
  fitness,
  loadColor,
  fitnessColor,
}: {
  load: number[]
  fitness: number[]
  loadColor: string
  fitnessColor: string
}) {
  const W = 280
  const H = 110
  const PAD = { top: 8, right: 8, bottom: 28, left: 28 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom
  const weeks = load.length

  const toX = (i: number) => PAD.left + (i / (weeks - 1)) * chartW
  const toY = (v: number) => PAD.top + chartH - (v / 100) * chartH

  const loadPath = load.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ')
  const fitPath = fitness.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((v) => (
        <line
          key={v}
          x1={PAD.left}
          y1={toY(v)}
          x2={W - PAD.right}
          y2={toY(v)}
          stroke="var(--color-border)"
          strokeWidth="0.8"
          strokeDasharray="3,3"
        />
      ))}
      {/* Y axis labels */}
      {[0, 50, 100].map((v) => (
        <text key={v} x={PAD.left - 4} y={toY(v) + 3} textAnchor="end" fontSize="7" fill="var(--color-muted)">
          {v}
        </text>
      ))}
      {/* X axis week labels */}
      {WEEK_LABELS.map((lbl, i) => (
        <text key={lbl} x={toX(i)} y={H - 6} textAnchor="middle" fontSize="7" fill="var(--color-muted)">
          {lbl}
        </text>
      ))}

      {/* Load line (dashed) */}
      <path d={loadPath} fill="none" stroke={loadColor} strokeWidth="2" strokeDasharray="4,3" opacity={0.7} />
      {/* Fitness line (solid) */}
      <path d={fitPath} fill="none" stroke={fitnessColor} strokeWidth="2.5" />

      {/* Dots for fitness */}
      {fitness.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill={fitnessColor} />
      ))}

      {/* Legend */}
      <line x1={PAD.left} y1={H - 18} x2={PAD.left + 16} y2={H - 18} stroke={loadColor} strokeWidth="2" strokeDasharray="4,3" opacity={0.7} />
      <text x={PAD.left + 20} y={H - 15} fontSize="7" fill="var(--color-muted)">Training load</text>
      <line x1={PAD.left + 80} y1={H - 18} x2={PAD.left + 96} y2={H - 18} stroke={fitnessColor} strokeWidth="2.5" />
      <text x={PAD.left + 100} y={H - 15} fontSize="7" fill="var(--color-muted)">Fitness</text>
    </svg>
  )
}

export function ProgressiveOverload() {
  const [active, setActive] = useState<Approach>('right')
  const def = APPROACHES.find((a) => a.id === active) ?? APPROACHES[1]
  const { load, fitness } = getCurve(active)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Toggle buttons */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {APPROACHES.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setActive(a.id)}
            className={cn(
              'rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
              active === a.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
            style={
              active === a.id
                ? { borderColor: a.color, color: a.color, backgroundColor: a.color + '22' }
                : {}
            }
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <p className="mb-3 text-xs text-muted">{def.desc}</p>

      {/* Chart */}
      <div className="mb-3 rounded-xl border border-border bg-surface-2 px-2 pt-2 pb-1">
        <MiniChart
          load={load}
          fitness={fitness}
          loadColor={def.color}
          fitnessColor={active === 'right' ? '#2ECC71' : active === 'little' ? '#3498DB88' : '#E74C3C'}
        />
      </div>

      {/* Outcome panel */}
      <div
        className="rounded-xl border p-3 text-sm"
        style={{ borderColor: def.color + '66', backgroundColor: def.color + '11' }}
      >
        <p className="font-semibold" style={{ color: def.color }}>Outcome:</p>
        <p className="mt-1 text-xs text-muted">{def.outcome}</p>
      </div>

      {/* Key principle */}
      {active === 'right' && (
        <div className="mt-3 rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
          <span className="font-semibold text-ink">The adaptation window:</span>{' '}
          Muscle and cardio gains don't happen during the workout — they happen in the 24–48 h of recovery that follow. Rest days aren't optional; they're when the improvement occurs.
        </div>
      )}
    </div>
  )
}
