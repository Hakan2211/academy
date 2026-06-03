import { useState } from 'react'
import { cn } from '#/lib/cn'
import { clamp } from '#/lib/health'

type Food = {
  id: string
  label: string
  emoji: string
  serving: string
  addedSugarTsp: number
  saltG: number
  surpriseFact: string
}

// Daily recommended limits: ~6 tsp (25 g) added sugar; ~6 g salt (≈ 2.4 g sodium)
const DAILY_SUGAR_TSP = 6
const DAILY_SALT_G = 6

const FOODS: Array<Food> = [
  {
    id: 'cola',
    label: 'Cola (375 mL can)',
    emoji: '🥤',
    serving: '375 mL can',
    addedSugarTsp: 10,
    saltG: 0.05,
    surpriseFact:
      'A single can exceeds the entire daily recommended limit for added sugar — and most people don\'t feel full after drinking it.',
  },
  {
    id: 'cereal',
    label: '"Healthy" Breakfast Cereal',
    emoji: '🥣',
    serving: '45 g serving (about ¾ cup)',
    addedSugarTsp: 3.5,
    saltG: 0.4,
    surpriseFact:
      'Many cereals marketed as "high-fibre" or "heart-healthy" contain more added sugar per 100 g than a chocolate biscuit. Always check the label.',
  },
  {
    id: 'yoghurt',
    label: 'Flavoured Yoghurt',
    emoji: '🍓',
    serving: '200 g tub',
    addedSugarTsp: 5,
    saltG: 0.2,
    surpriseFact:
      '"Fruit" yoghurts often contain very little real fruit and are sweetened with added sugars. Plain yoghurt with whole fruit contains far less.',
  },
  {
    id: 'pasta-sauce',
    label: 'Pasta Sauce (jar)',
    emoji: '🍝',
    serving: '½ cup (125 g)',
    addedSugarTsp: 2.5,
    saltG: 1.0,
    surpriseFact:
      'Tomato is naturally acidic, so manufacturers add sugar to balance the flavour — and then add salt for taste. A common double hit.',
  },
  {
    id: 'bread',
    label: 'White Bread',
    emoji: '🍞',
    serving: '2 slices (70 g)',
    addedSugarTsp: 1,
    saltG: 0.7,
    surpriseFact:
      'Two slices of white bread can contribute more than 10% of your daily salt limit — not from one slice, but it adds up across sandwiches all week.',
  },
  {
    id: 'sports-drink',
    label: 'Sports Drink (600 mL)',
    emoji: '🏃',
    serving: '600 mL bottle',
    addedSugarTsp: 8.5,
    saltG: 0.4,
    surpriseFact:
      'Unless you\'re exercising intensively for 60+ minutes, sports drinks are sugar water. The electrolytes are useful for endurance sport, not a desk job.',
  },
]

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = clamp((value / max) * 100, 0, 110)
  const overLimit = value > max
  return (
    <div className="relative h-4 w-full rounded-full bg-surface-2 border border-border overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all duration-500', color, overLimit && 'opacity-90')}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
      {overLimit && (
        <div
          className="absolute right-0 top-0 h-full w-1 rounded-r-full bg-warn"
          title="Exceeds daily limit"
        />
      )}
    </div>
  )
}

export function SugarDetective() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const food = activeId ? FOODS.find((f) => f.id === activeId) : null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Pick an everyday food to reveal how much added sugar and salt is hiding inside — compared to
        the daily recommended limit.
      </p>

      {/* Food selector */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 mb-4">
        {FOODS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveId(f.id)}
            className={cn(
              'rounded-xl border px-3 py-2 text-left text-sm transition-colors',
              activeId === f.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <div className="text-base mb-0.5">{f.emoji}</div>
            <div className="font-medium leading-tight">{f.label}</div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {food ? (
        <div className="rounded-xl border border-border bg-surface-2 p-4 space-y-4">
          <div>
            <span className="text-lg font-bold text-ink">{food.emoji} {food.label}</span>
            <span className="ml-2 text-xs text-muted">({food.serving})</span>
          </div>

          {/* Added sugar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-ink">Added sugar</span>
              <span
                className={cn(
                  'font-semibold',
                  food.addedSugarTsp > DAILY_SUGAR_TSP ? 'text-warn' : 'text-success',
                )}
              >
                {food.addedSugarTsp} tsp
                <span className="ml-1 font-normal text-muted">
                  ({Math.round((food.addedSugarTsp / DAILY_SUGAR_TSP) * 100)}% of daily limit)
                </span>
              </span>
            </div>
            <Bar
              value={food.addedSugarTsp}
              max={DAILY_SUGAR_TSP}
              color={food.addedSugarTsp > DAILY_SUGAR_TSP ? 'bg-warn' : 'bg-accent'}
            />
            <p className="text-xs text-muted">Daily limit: {DAILY_SUGAR_TSP} tsp added sugar</p>
          </div>

          {/* Salt */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-ink">Salt</span>
              <span
                className={cn(
                  'font-semibold',
                  food.saltG > DAILY_SALT_G * 0.3 ? 'text-warn' : 'text-success',
                )}
              >
                {food.saltG.toFixed(1)} g
                <span className="ml-1 font-normal text-muted">
                  ({Math.round((food.saltG / DAILY_SALT_G) * 100)}% of daily limit)
                </span>
              </span>
            </div>
            <Bar
              value={food.saltG}
              max={DAILY_SALT_G}
              color={food.saltG > DAILY_SALT_G * 0.3 ? 'bg-warn' : 'bg-accent-2'}
            />
            <p className="text-xs text-muted">Daily limit: {DAILY_SALT_G} g salt</p>
          </div>

          {/* Surprise fact */}
          <div className="rounded-lg border border-border bg-surface px-3 py-2">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
              The label-reading lesson
            </p>
            <p className="text-sm text-ink leading-relaxed">{food.surpriseFact}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface-2 p-6 text-center text-sm text-muted">
          Select a food above to reveal its hidden sugar and salt content.
        </div>
      )}
    </div>
  )
}
