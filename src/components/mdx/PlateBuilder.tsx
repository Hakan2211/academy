import { useState } from 'react'
import { cn } from '#/lib/cn'

type FoodGroup = 'veg' | 'grain' | 'protein' | 'dairy'

type Food = {
  id: string
  label: string
  group: FoodGroup
  emoji: string
}

const FOODS: Array<Food> = [
  { id: 'broccoli', label: 'Broccoli', group: 'veg', emoji: '🥦' },
  { id: 'carrot', label: 'Carrot', group: 'veg', emoji: '🥕' },
  { id: 'tomato', label: 'Tomato', group: 'veg', emoji: '🍅' },
  { id: 'apple', label: 'Apple', group: 'veg', emoji: '🍎' },
  { id: 'spinach', label: 'Spinach', group: 'veg', emoji: '🥬' },
  { id: 'rice', label: 'Brown rice', group: 'grain', emoji: '🍚' },
  { id: 'bread', label: 'Wholegrain bread', group: 'grain', emoji: '🍞' },
  { id: 'oats', label: 'Oats', group: 'grain', emoji: '🌾' },
  { id: 'pasta', label: 'Wholemeal pasta', group: 'grain', emoji: '🍝' },
  { id: 'chicken', label: 'Chicken', group: 'protein', emoji: '🍗' },
  { id: 'fish', label: 'Fish', group: 'protein', emoji: '🐟' },
  { id: 'lentils', label: 'Lentils', group: 'protein', emoji: '🫘' },
  { id: 'eggs', label: 'Eggs', group: 'protein', emoji: '🥚' },
  { id: 'tofu', label: 'Tofu', group: 'protein', emoji: '🧊' },
  { id: 'milk', label: 'Milk', group: 'dairy', emoji: '🥛' },
  { id: 'yoghurt', label: 'Yoghurt', group: 'dairy', emoji: '🫙' },
  { id: 'cheese', label: 'Cheese', group: 'dairy', emoji: '🧀' },
]

// Ideal proportions (out of 8 units)
const IDEAL: Record<FoodGroup, number> = { veg: 4, grain: 2, protein: 2, dairy: 0 }
const IDEAL_TOTAL = 8

const GROUP_META: Record<FoodGroup, { label: string; color: string; idealPct: string; tip: string }> = {
  veg: {
    label: 'Veg & fruit',
    color: '#22c55e',
    idealPct: '½ plate',
    tip: 'Aim for half your plate. Variety of colours gives diverse nutrients.',
  },
  grain: {
    label: 'Whole grains',
    color: '#f59e0b',
    idealPct: '¼ plate',
    tip: 'Choose whole grains over refined — they keep fibre and B vitamins.',
  },
  protein: {
    label: 'Protein',
    color: '#ef4444',
    idealPct: '¼ plate',
    tip: 'Include a mix of animal and plant proteins across the week.',
  },
  dairy: {
    label: 'Dairy / alternatives',
    color: '#a78bfa',
    idealPct: 'Side serving',
    tip: 'Milk, yoghurt, or fortified plant milk on the side — not a plate segment.',
  },
}

const GROUPS: Array<FoodGroup> = ['veg', 'grain', 'protein', 'dairy']

function getFeedback(counts: Record<FoodGroup, number>): string {
  const total = GROUPS.reduce((s, g) => s + counts[g], 0)
  if (total === 0) return 'Add some foods to see how your plate compares to the ideal.'
  const vegPct = counts.veg / total
  const grainPct = counts.grain / total
  const proteinPct = counts.protein / total
  if (vegPct >= 0.45 && grainPct >= 0.2 && proteinPct >= 0.2) return '✓ Balanced! Your plate closely matches the ideal proportions.'
  if (vegPct < 0.35) return '↑ Add more vegetables or fruit — aim for at least half your plate.'
  if (grainPct < 0.15) return '↑ Include more whole grains for sustained energy.'
  if (proteinPct < 0.15) return '↑ Add a protein source — important for muscle and repair.'
  return 'Nearly there! Fine-tune the proportions for the ideal plate.'
}

export function PlateBuilder() {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Count selected per group
  const counts = GROUPS.reduce<Record<FoodGroup, number>>(
    (acc, g) => {
      acc[g] = FOODS.filter((f) => f.group === g && selected.has(f.id)).length
      return acc
    },
    { veg: 0, grain: 0, protein: 0, dairy: 0 },
  )

  const totalSelected = GROUPS.reduce((s, g) => s + counts[g], 0)
  const feedback = getFeedback(counts)

  // Build SVG pie slices for plate
  // Plate circle radius 80, centre 90,90
  const R = 78
  const CX = 90
  const CY = 90

  function polarToXY(angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) }
  }

  // Use user counts if any, else show ideal
  const pieSource: Record<FoodGroup, number> =
    totalSelected > 0
      ? { veg: counts.veg, grain: counts.grain, protein: counts.protein, dairy: counts.dairy }
      : IDEAL

  const pieTotal = GROUPS.reduce((s, g) => s + pieSource[g], 0) || IDEAL_TOTAL

  type Slice = { group: FoodGroup; startAngle: number; endAngle: number; large: boolean }
  const slices: Array<Slice> = []
  let cursor = 0
  for (const g of GROUPS) {
    const frac = pieSource[g] / pieTotal
    const sweep = frac * 360
    if (sweep > 0) {
      slices.push({
        group: g,
        startAngle: cursor,
        endAngle: cursor + sweep,
        large: sweep > 180,
      })
    }
    cursor += sweep
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Click foods to add them to your plate. The pie updates to show your proportions vs the ideal.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Plate SVG */}
        <div className="flex flex-col items-center">
          <svg width="180" height="180" viewBox="0 0 180 180" aria-label="plate diagram">
            {/* Plate rim */}
            <circle cx={CX} cy={CY} r={R + 4} fill="none" stroke="var(--color-border)" strokeWidth="2" />
            {/* Slices */}
            {slices.map((sl) => {
              const start = polarToXY(sl.startAngle)
              const end = polarToXY(sl.endAngle)
              const d = `M ${CX} ${CY} L ${start.x} ${start.y} A ${R} ${R} 0 ${sl.large ? 1 : 0} 1 ${end.x} ${end.y} Z`
              return (
                <path
                  key={sl.group}
                  d={d}
                  fill={GROUP_META[sl.group].color}
                  fillOpacity={totalSelected > 0 ? 0.85 : 0.35}
                  stroke="var(--color-surface)"
                  strokeWidth="1.5"
                />
              )
            })}
            {/* Empty state */}
            {pieTotal === 0 && (
              <circle cx={CX} cy={CY} r={R} fill="var(--color-surface-2)" />
            )}
            <text x={CX} y={CY + 4} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
              {totalSelected > 0 ? 'your plate' : 'ideal'}
            </text>
          </svg>
          {/* Legend */}
          <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1">
            {GROUPS.map((g) => (
              <div key={g} className="flex items-center gap-1 text-xs text-muted">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: GROUP_META[g].color }} />
                {GROUP_META[g].label}
                <span className="text-ink/50">({GROUP_META[g].idealPct})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Food chips by group */}
        <div className="flex-1 space-y-3">
          {GROUPS.map((g) => (
            <div key={g}>
              <p className="mb-1 text-xs font-semibold" style={{ color: GROUP_META[g].color }}>
                {GROUP_META[g].label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {FOODS.filter((f) => f.group === g).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggle(f.id)}
                    className={cn(
                      'rounded-xl border px-2.5 py-1 text-xs transition-colors',
                      selected.has(f.id)
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-border text-muted hover:text-ink',
                    )}
                  >
                    {f.emoji} {f.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <div
        className={cn(
          'mt-4 rounded-xl border p-3 text-sm',
          feedback.startsWith('✓')
            ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-600'
            : 'border-border bg-surface-2 text-ink',
        )}
      >
        {feedback}
      </div>

      {/* Group tips */}
      {totalSelected > 0 && (
        <div className="mt-3 grid grid-cols-1 gap-1.5 text-xs text-muted sm:grid-cols-2">
          {GROUPS.map((g) =>
            counts[g] > 0 ? (
              <div key={g} className="flex gap-1.5 rounded-lg border border-border bg-surface-2 p-2">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: GROUP_META[g].color }} />
                <span>{GROUP_META[g].tip}</span>
              </div>
            ) : null,
          )}
        </div>
      )}

      {totalSelected > 0 && (
        <button
          type="button"
          onClick={() => setSelected(new Set())}
          className="mt-3 rounded-xl border border-border px-3 py-1.5 text-xs text-muted hover:text-ink"
        >
          Clear plate
        </button>
      )}
    </div>
  )
}
