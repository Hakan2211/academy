import { useState } from 'react'
import { cn } from '#/lib/cn'

// The food groups a balanced diet needs. Tap each to see what it does and where
// you get it.
type Nutrient = { name: string; emoji: string; color: string; fn: string; sources: string }

const NUTRIENTS: Array<Nutrient> = [
  { name: 'Carbohydrates', emoji: '🍞', color: '#FDCB6E', fn: 'Your main, fast source of energy.', sources: 'bread, pasta, rice, potatoes, sugar' },
  { name: 'Proteins', emoji: '🥩', color: '#E74C3C', fn: 'Growth and repair — building new cells and tissues.', sources: 'meat, fish, eggs, beans, nuts' },
  { name: 'Fats', emoji: '🥑', color: '#A3CB38', fn: 'A concentrated energy store, insulation, and the raw material for membranes.', sources: 'oils, butter, cheese, nuts' },
  { name: 'Vitamins', emoji: '🍊', color: '#E67E22', fn: 'Needed in tiny amounts to stay healthy — e.g. vitamin C (skin) and D (bones).', sources: 'fruit and vegetables' },
  { name: 'Minerals', emoji: '🧂', color: '#74B9FF', fn: 'Elements for specific jobs — iron for red blood cells, calcium for bones and teeth.', sources: 'a varied diet — dairy, meat, greens' },
  { name: 'Fibre', emoji: '🥦', color: '#2ECC71', fn: 'Indigestible bulk that keeps food moving through the gut and prevents constipation.', sources: 'wholegrains, vegetables, fruit skins' },
  { name: 'Water', emoji: '💧', color: '#4FD1C5', fn: 'The solvent for every reaction and the medium that transports everything in the body.', sources: 'drinks and most foods' },
]

export function NutrientGroups() {
  const [sel, setSel] = useState(0)
  const n = NUTRIENTS[sel]
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {NUTRIENTS.map((nut, i) => (
          <button
            key={nut.name}
            type="button"
            onClick={() => setSel(i)}
            className={cn(
              'flex flex-col items-center rounded-lg border py-2 transition-colors',
              sel === i ? 'border-accent bg-accent/10' : 'border-border hover:bg-surface-2',
            )}
          >
            <span className="text-2xl">{nut.emoji}</span>
            <span className="mt-0.5 text-[10px] text-muted">{nut.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-surface-2 px-3 py-2">
        <p className="text-sm font-semibold" style={{ color: n.color }}>{n.emoji} {n.name}</p>
        <p className="mt-0.5 text-sm text-muted">{n.fn}</p>
        <p className="mt-1 text-xs text-muted">Sources: {n.sources}</p>
      </div>
    </div>
  )
}
