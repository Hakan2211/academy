import { useState } from 'react'
import { cn } from '#/lib/cn'
import { clamp } from '#/lib/philo'

// Susan Wolf's meaning = subjective attraction × objective worth.
// A 2-axis scatter plot where activities are rated on "How much I love it" (x)
// and "How worthwhile it is" (y). The meaningful zone is high-high.

type Activity = {
  id: string
  label: string
  defaultSubjective: number
  defaultObjective: number
  note: string
}

const PRESET_ACTIVITIES: Array<Activity> = [
  { id: 'scroll', label: 'Scrolling social media', defaultSubjective: 5, defaultObjective: 2, note: 'Enjoyable but not especially worthwhile' },
  { id: 'family', label: 'Caring for family', defaultSubjective: 7, defaultObjective: 9, note: 'Love it AND genuinely worthwhile' },
  { id: 'craft', label: 'Mastering a craft', defaultSubjective: 8, defaultObjective: 8, note: 'Deep engagement + real worth' },
  { id: 'strangers', label: 'Helping strangers', defaultSubjective: 5, defaultObjective: 9, note: 'Worthwhile but not always what I want' },
  { id: 'caps', label: 'Collecting bottle caps', defaultSubjective: 8, defaultObjective: 2, note: 'Love it but limited broader worth' },
  { id: 'creative', label: 'Creative work', defaultSubjective: 9, defaultObjective: 7, note: 'Passionate + contributes something real' },
]

type ActivityRating = {
  subjective: number
  objective: number
}

function getMeaningZone(s: number, o: number): { label: string; color: string; description: string } {
  if (s >= 7 && o >= 7) {
    return {
      label: 'Meaningful',
      color: 'text-success',
      description: "This is Wolf's meaningful zone: you love it AND it is genuinely worth loving. Subjective passion meets objective worth — meaning lives here.",
    }
  }
  if (s >= 7 && o < 7) {
    return {
      label: 'Pleasant but limited',
      color: 'text-accent',
      description: 'You love it, but its broader worth is limited. Wolf says this can be enjoyable without being deeply meaningful — pleasure without significance.',
    }
  }
  if (s < 7 && o >= 7) {
    return {
      label: 'Worthwhile but joyless',
      color: 'text-accent-2',
      description: 'It is genuinely worth doing, but you are not invested in it. Wolf says worthwhileness without subjective engagement is duty, not meaning.',
    }
  }
  return {
    label: 'Neither pleasurable nor meaningful',
    color: 'text-muted',
    description: 'Low on both axes. Neither pleasurable nor genuinely significant — this is where meaninglessness actually lives.',
  }
}

// Mini scatter plot rendered as SVG
function ScatterPlot({
  ratings,
  activeId,
  onSelect,
}: {
  ratings: Record<string, ActivityRating>
  activeId: string | null
  onSelect: (id: string) => void
}) {
  const W = 220
  const H = 220
  const PAD = 28

  function toX(s: number) {
    return PAD + ((s - 1) / 9) * (W - PAD * 2)
  }
  function toY(o: number) {
    return H - PAD - ((o - 1) / 9) * (H - PAD * 2)
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full max-w-xs mx-auto block"
      aria-label="Meaning scatter plot"
    >
      {/* Meaningful zone highlight */}
      <rect
        x={toX(7)}
        y={toY(10)}
        width={toX(10) - toX(7)}
        height={toY(7) - toY(10)}
        fill="#22c55e"
        opacity={0.08}
        rx={4}
      />
      <text x={toX(8.5)} y={toY(8.7)} textAnchor="middle" fontSize="7" fill="#22c55e" opacity={0.8}>
        meaningful
      </text>

      {/* Axes */}
      <line x1={PAD} y1={H - PAD} x2={W - PAD + 4} y2={H - PAD} stroke="#334155" strokeWidth="1" />
      <line x1={PAD} y1={H - PAD} x2={PAD} y2={PAD - 4} stroke="#334155" strokeWidth="1" />

      {/* Axis labels */}
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="7" fill="#64748b">
        How much I love it (subjective)
      </text>
      <text
        x={10}
        y={H / 2}
        textAnchor="middle"
        fontSize="7"
        fill="#64748b"
        transform={`rotate(-90, 10, ${H / 2})`}
      >
        How worthwhile it is (objective)
      </text>

      {/* Tick marks */}
      {[1, 4, 7, 10].map((v) => (
        <g key={v}>
          <line x1={toX(v)} y1={H - PAD} x2={toX(v)} y2={H - PAD + 3} stroke="#475569" strokeWidth="0.8" />
          <text x={toX(v)} y={H - PAD + 9} textAnchor="middle" fontSize="5.5" fill="#64748b">{v}</text>
          <line x1={PAD - 3} y1={toY(v)} x2={PAD} y2={toY(v)} stroke="#475569" strokeWidth="0.8" />
          <text x={PAD - 5} y={toY(v) + 2} textAnchor="end" fontSize="5.5" fill="#64748b">{v}</text>
        </g>
      ))}

      {/* Activity dots */}
      {PRESET_ACTIVITIES.map((a) => {
        const r = ratings[a.id]
        if (!r) return null
        const cx = toX(r.subjective)
        const cy = toY(r.objective)
        const isActive = activeId === a.id
        const zone = getMeaningZone(r.subjective, r.objective)
        const dotColor = zone.color === 'text-success' ? '#22c55e'
          : zone.color === 'text-accent' ? '#38bdf8'
          : zone.color === 'text-accent-2' ? '#a78bfa'
          : '#64748b'
        return (
          <g key={a.id} onClick={() => onSelect(a.id)} style={{ cursor: 'pointer' }}>
            <circle
              cx={cx}
              cy={cy}
              r={isActive ? 8 : 6}
              fill={dotColor}
              opacity={isActive ? 0.95 : 0.65}
              stroke={isActive ? '#fff' : 'transparent'}
              strokeWidth={1.5}
            />
            {isActive && (
              <text x={cx} y={cy - 11} textAnchor="middle" fontSize="6" fill="#f1f5f9">
                {a.label}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export function MeaningfulLifePlanner() {
  const [activeId, setActiveId] = useState<string | null>(PRESET_ACTIVITIES[0]?.id ?? null)
  const [ratings, setRatings] = useState<Record<string, ActivityRating>>(
    Object.fromEntries(
      PRESET_ACTIVITIES.map((a) => [a.id, { subjective: a.defaultSubjective, objective: a.defaultObjective }]),
    ),
  )

  const active = PRESET_ACTIVITIES.find((a) => a.id === activeId) ?? null
  const activeRating = activeId ? ratings[activeId] : null

  function updateRating(id: string, axis: 'subjective' | 'objective', value: number) {
    setRatings((prev) => ({
      ...prev,
      [id]: { ...prev[id]!, [axis]: clamp(value, 1, 10) },
    }))
  }

  const zone = activeRating ? getMeaningZone(activeRating.subjective, activeRating.objective) : null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Intro */}
      <div className="mb-3 rounded-xl border border-border bg-surface-2 p-3 text-xs text-ink">
        <span className="font-semibold text-accent">Susan Wolf&apos;s insight:</span> meaning is not just pleasure
        (subjective attraction alone) and not just moral worth (objective worthwhileness alone). Meaning lives where
        they <em>meet</em> — when you love something that is genuinely worth loving.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Scatter plot */}
        <div>
          <p className="mb-2 text-xs text-muted">Click a dot to explore it. Adjust the sliders to reconsider your ratings.</p>
          <ScatterPlot ratings={ratings} activeId={activeId} onSelect={setActiveId} />
        </div>

        {/* Activity list + sliders */}
        <div>
          <p className="mb-2 text-xs text-muted">Select an activity:</p>
          <div className="mb-3 flex flex-col gap-1.5">
            {PRESET_ACTIVITIES.map((a) => {
              const r = ratings[a.id]
              if (!r) return null
              const z = getMeaningZone(r.subjective, r.objective)
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setActiveId(a.id)}
                  className={cn(
                    'rounded-lg border px-2.5 py-1.5 text-left text-xs transition-colors',
                    activeId === a.id
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-border text-muted hover:text-ink',
                  )}
                >
                  <span className="font-medium">{a.label}</span>
                  <span className={cn('ml-1.5 text-xs', z.color)}>— {z.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Selected activity sliders */}
      {active && activeRating && zone && (
        <div className="mt-3 rounded-xl border border-border bg-surface-2 p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-ink text-sm">{active.label}</div>
              <div className="text-xs text-muted">{active.note}</div>
            </div>
            <span className={cn('shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold', zone.color, 'border-current')}>
              {zone.label}
            </span>
          </div>

          {/* Subjective slider */}
          <div className="mb-3">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted">How much I love it (subjective)</span>
              <span className="font-semibold text-accent">{activeRating.subjective}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={activeRating.subjective}
              onChange={(e) => updateRating(active.id, 'subjective', Number(e.target.value))}
              className="w-full accent-[#38bdf8]"
            />
            <div className="mt-0.5 flex justify-between text-xs text-muted">
              <span>1 — Hate it</span>
              <span>10 — Passionate</span>
            </div>
          </div>

          {/* Objective slider */}
          <div className="mb-3">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted">How worthwhile it is (objective)</span>
              <span className="font-semibold text-accent-2">{activeRating.objective}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={activeRating.objective}
              onChange={(e) => updateRating(active.id, 'objective', Number(e.target.value))}
              className="w-full accent-[#a78bfa]"
            />
            <div className="mt-0.5 flex justify-between text-xs text-muted">
              <span>1 — Trivial</span>
              <span>10 — Genuinely important</span>
            </div>
          </div>

          {/* Zone verdict */}
          <div className={cn('rounded-lg border p-3 text-xs', zone.color, 'border-current bg-current/5')}>
            <span className="font-semibold">{zone.label}:</span>{' '}
            <span className="text-ink">{zone.description}</span>
          </div>
        </div>
      )}

      <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted">
        <span className="font-semibold text-ink">The key insight:</span> pleasure alone (top-left) is enjoyment without depth.
        Duty alone (bottom-right) is worth without engagement. Meaning lives in the top-right — where what you love
        is genuinely worth loving. Wolf calls this &ldquo;active engagement in projects of worth.&rdquo;
      </div>
    </div>
  )
}
