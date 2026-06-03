import { useState } from 'react'
import { cn } from '#/lib/cn'

type Group = {
  id: string
  label: string
  emoji: string
  hand: string
  handDesc: string
  portionVsServing: string
  examples: string
  color: string
}

const GROUPS: Array<Group> = [
  {
    id: 'protein',
    label: 'Protein',
    emoji: '🥩',
    hand: 'Palm',
    handDesc: 'The flat palm of your hand (no fingers) ≈ 85–100 g of cooked meat, fish, or tofu.',
    portionVsServing:
      'A standard serving is 65 g cooked red meat or 80 g cooked poultry. Your palm naturally estimates one serving — most restaurant steaks are 3–4 palms.',
    examples: 'Chicken breast, salmon fillet, tofu, eggs (2 eggs ≈ 1 palm), canned tuna.',
    color: 'border-accent bg-accent/10 text-accent',
  },
  {
    id: 'veg',
    label: 'Vegetables',
    emoji: '🥦',
    hand: 'Fist',
    handDesc: 'A closed fist ≈ 1 cup of raw leafy greens or ½ cup of cooked vegetables.',
    portionVsServing:
      'One standard serving of vegetables is 75 g (about ½ cup cooked). Aim for 5+ fists every day — most people manage only 2–3.',
    examples: 'Broccoli, spinach, capsicum, carrots, tomatoes, cucumber, zucchini.',
    color: 'border-success bg-success/10 text-success',
  },
  {
    id: 'grains',
    label: 'Grains & Starchy Veg',
    emoji: '🍚',
    hand: 'Cupped hand',
    handDesc: 'Both hands cupped together ≈ ½ cup of cooked rice, pasta, or oats.',
    portionVsServing:
      'A standard serving is ½ cup cooked grains or 1 slice of bread. The cupped-hand rule helps — a typical bowl of pasta is 3–4 servings.',
    examples: 'Brown rice, wholemeal pasta, oats, sweet potato, wholegrain bread, quinoa.',
    color: 'border-warn bg-warn/10 text-warn',
  },
  {
    id: 'fats',
    label: 'Fats & Oils',
    emoji: '🥑',
    hand: 'Thumb',
    handDesc: 'One thumb ≈ 1 tablespoon (15 mL) of oil, nut butter, or about 30 g of cheese.',
    portionVsServing:
      'Fats are calorie-dense (9 kcal/g). A standard serving is 1 tsp of oil. Avocado: ¼ whole ≈ 1 thumb. Easy to pour 3–4 thumbs of olive oil without noticing.',
    examples: 'Olive oil, avocado, nuts, seeds, nut butters, cheese, butter.',
    color: 'border-accent-2 bg-accent-2/10 text-accent-2',
  },
]

export function PortionGuide() {
  const [activeId, setActiveId] = useState<string>(GROUPS[0].id)
  const active = GROUPS.find((g) => g.id === activeId) ?? GROUPS[0]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Select a food group to see its hand-based portion guide.
      </p>

      {/* Food group selector */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setActiveId(g.id)}
            className={cn(
              'rounded-xl border px-3 py-2 text-left text-sm transition-colors',
              activeId === g.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <span className="mr-1">{g.emoji}</span>
            <span className="font-medium">{g.label}</span>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="rounded-xl border border-border bg-surface-2 p-4 space-y-3">
        {/* Hand visual */}
        <div className={cn('inline-block rounded-lg border px-3 py-1 text-sm font-semibold', active.color)}>
          {active.emoji} {active.hand} rule
        </div>

        <p className="text-sm text-ink leading-relaxed">
          <span className="font-semibold">The estimate: </span>
          {active.handDesc}
        </p>

        <div className="rounded-lg border border-border bg-surface p-3">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
            Portion vs. Serving
          </p>
          <p className="text-sm text-ink leading-relaxed">{active.portionVsServing}</p>
        </div>

        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">Common examples: </span>
          {active.examples}
        </p>
      </div>

      <p className="mt-3 text-xs text-muted text-center">
        Your hands scale with your body — bigger people have bigger hands and need slightly more food.
        The estimates work for most adults.
      </p>
    </div>
  )
}
