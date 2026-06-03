import { useState } from 'react'
import { cn } from '#/lib/cn'

type ProduceColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue-purple' | 'white'

type ColorEntry = {
  id: ProduceColor
  label: string
  hex: string
  textClass: string
  bgClass: string
  borderClass: string
  examples: Array<string>
  phytonutrient: string
  benefit: string
}

const COLORS: Array<ColorEntry> = [
  {
    id: 'red',
    label: 'Red',
    hex: '#ef4444',
    textClass: 'text-red-500',
    bgClass: 'bg-red-400/15',
    borderClass: 'border-red-400/50',
    examples: ['Tomatoes', 'Watermelon', 'Red capsicum', 'Strawberries', 'Cherries', 'Red apples'],
    phytonutrient: 'Lycopene & anthocyanins',
    benefit:
      'Lycopene (in tomatoes, especially cooked) is linked to reduced prostate and cardiovascular disease risk. Anthocyanins are powerful antioxidants that protect cells from oxidative stress.',
  },
  {
    id: 'orange',
    label: 'Orange',
    hex: '#f97316',
    textClass: 'text-orange-500',
    bgClass: 'bg-orange-400/15',
    borderClass: 'border-orange-400/50',
    examples: ['Carrots', 'Sweet potato', 'Pumpkin', 'Oranges', 'Mango', 'Apricots'],
    phytonutrient: 'Beta-carotene (pro-vitamin A)',
    benefit:
      'Beta-carotene converts to Vitamin A in the body, supporting vision, immune function, and skin health. Orange produce is also rich in Vitamin C and folate.',
  },
  {
    id: 'yellow',
    label: 'Yellow',
    hex: '#eab308',
    textClass: 'text-yellow-500',
    bgClass: 'bg-yellow-400/15',
    borderClass: 'border-yellow-400/50',
    examples: ['Bananas', 'Yellow capsicum', 'Sweetcorn', 'Pineapple', 'Lemons', 'Yellow squash'],
    phytonutrient: 'Lutein, zeaxanthin & Vitamin C',
    benefit:
      'Lutein and zeaxanthin accumulate in the retina and protect against age-related macular degeneration. Yellow produce is often high in Vitamin C for immunity and collagen production.',
  },
  {
    id: 'green',
    label: 'Green',
    hex: '#22c55e',
    textClass: 'text-green-500',
    bgClass: 'bg-green-400/15',
    borderClass: 'border-green-400/50',
    examples: ['Spinach', 'Broccoli', 'Kale', 'Avocado', 'Peas', 'Cucumber', 'Kiwi'],
    phytonutrient: 'Chlorophyll, folate & sulforaphane',
    benefit:
      'Dark greens are folate powerhouses, critical for cell division. Cruciferous greens (broccoli, kale) contain sulforaphane, a compound linked to cancer-prevention research. Avocado adds heart-healthy monounsaturated fats.',
  },
  {
    id: 'blue-purple',
    label: 'Blue / Purple',
    hex: '#8b5cf6',
    textClass: 'text-violet-500',
    bgClass: 'bg-violet-400/15',
    borderClass: 'border-violet-400/50',
    examples: ['Blueberries', 'Red grapes', 'Aubergine (eggplant)', 'Purple cabbage', 'Beetroot', 'Blackberries'],
    phytonutrient: 'Anthocyanins & resveratrol',
    benefit:
      'Anthocyanins are among the most studied antioxidants, associated with improved memory, reduced inflammation, and heart health. Resveratrol (red grapes) has shown anti-inflammatory effects in research.',
  },
  {
    id: 'white',
    label: 'White / Brown',
    hex: '#a8a29e',
    textClass: 'text-stone-400',
    bgClass: 'bg-stone-400/15',
    borderClass: 'border-stone-400/50',
    examples: ['Garlic', 'Onion', 'Mushrooms', 'Cauliflower', 'Parsnip', 'Potatoes'],
    phytonutrient: 'Allicin, quercetin & selenium',
    benefit:
      'Garlic and onions contain allicin — shown to have antimicrobial and cholesterol-lowering effects. Mushrooms are one of the few non-animal sources of Vitamin D (when UV-exposed) and provide selenium for thyroid health.',
  },
]

export function RainbowPlate() {
  const [collected, setCollected] = useState<Set<ProduceColor>>(new Set())
  const [focused, setFocused] = useState<ProduceColor | null>(null)

  function toggle(id: ProduceColor) {
    setCollected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setFocused(id)
  }

  const collectedCount = collected.size
  const totalColors = COLORS.length

  let scoreLabel = ''
  let scoreClass = ''
  if (collectedCount === 0) {
    scoreLabel = 'Start collecting colours!'
    scoreClass = 'text-muted'
  } else if (collectedCount <= 2) {
    scoreLabel = 'Good start — keep adding variety.'
    scoreClass = 'text-amber-500'
  } else if (collectedCount <= 4) {
    scoreLabel = 'Nice variety! Aim for all six.'
    scoreClass = 'text-accent'
  } else if (collectedCount === 5) {
    scoreLabel = 'Almost there — just one more colour!'
    scoreClass = 'text-sky-500'
  } else {
    scoreLabel = 'You ate the rainbow! Full phytonutrient coverage.'
    scoreClass = 'text-emerald-500'
  }

  const focusedEntry = COLORS.find((c) => c.id === focused)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Click each colour to learn its phytonutrients and collect them toward eating the rainbow.
      </p>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-medium text-ink">Colours collected</span>
          <span className={cn('font-bold', scoreClass)}>
            {collectedCount} / {totalColors}
          </span>
        </div>
        <div className="flex gap-1">
          {COLORS.map((c) => (
            <div
              key={c.id}
              className="h-3 flex-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor: collected.has(c.id) ? c.hex : 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
              }}
            />
          ))}
        </div>
        <p className={cn('mt-1.5 text-xs', scoreClass)}>{scoreLabel}</p>
      </div>

      {/* Color grid */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => toggle(c.id)}
            className={cn(
              'rounded-xl border px-3 py-2.5 text-left text-sm transition-colors',
              collected.has(c.id)
                ? cn(c.bgClass, c.borderClass, c.textClass)
                : focused === c.id
                  ? cn(c.bgClass, c.borderClass, 'text-ink')
                  : 'border-border text-muted hover:text-ink',
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3.5 w-3.5 shrink-0 rounded-full"
                style={{ backgroundColor: c.hex }}
              />
              <span className="font-semibold">{c.label}</span>
              {collected.has(c.id) && <span className="ml-auto text-xs">✓</span>}
            </div>
            <div className="mt-1 truncate text-xs opacity-70">{c.examples.slice(0, 3).join(', ')}</div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {focusedEntry && (
        <div className={cn('rounded-xl border p-4 text-sm', focusedEntry.bgClass, focusedEntry.borderClass)}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: focusedEntry.hex }} />
            <span className={cn('font-bold text-base', focusedEntry.textClass)}>{focusedEntry.label}</span>
            <span className="rounded-full border px-2 py-0.5 text-xs text-muted border-border bg-surface">
              {focusedEntry.phytonutrient}
            </span>
          </div>
          <div className="mb-2 text-ink">{focusedEntry.benefit}</div>
          <div>
            <span className="text-xs font-semibold text-muted">Examples: </span>
            <span className="text-xs text-ink">{focusedEntry.examples.join(', ')}</span>
          </div>
        </div>
      )}

      {!focusedEntry && (
        <div className="rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted">
          Click any colour above to reveal its phytonutrients and health benefits.
        </div>
      )}
    </div>
  )
}
