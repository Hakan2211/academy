import { useState } from 'react'
import { cn } from '#/lib/cn'
import { round } from '#/lib/health'

// Macronutrient breakdown for a selection of foods.
// Teaches: foods are mixes of carbs/protein/fat; fat is the most energy-dense
// (9 kcal/g vs 4 kcal/g for carbs and protein).

type Food = {
  id: string
  label: string
  carbs: number   // grams per 100g serving
  protein: number
  fat: number
  icon: string
}

const FOODS: Array<Food> = [
  { id: 'rice',    label: 'Cooked white rice', carbs: 28, protein: 3,  fat: 0.3, icon: '🍚' },
  { id: 'chicken', label: 'Chicken breast',    carbs: 0,  protein: 31, fat: 3.6, icon: '🍗' },
  { id: 'avocado', label: 'Avocado',           carbs: 9,  protein: 2,  fat: 15,  icon: '🥑' },
  { id: 'egg',     label: 'Whole egg',         carbs: 0.6,protein: 13, fat: 10,  icon: '🥚' },
  { id: 'almonds', label: 'Almonds',           carbs: 22, protein: 21, fat: 50,  icon: '🌰' },
  { id: 'apple',   label: 'Apple',             carbs: 14, protein: 0.3,fat: 0.2, icon: '🍎' },
]

const KCAL_PER_G = { carbs: 4, protein: 4, fat: 9 }

export function MacroBreakdown() {
  const [foodId, setFoodId] = useState<string>('egg')
  const [serving, setServing] = useState<number>(100)

  const food = FOODS.find((f) => f.id === foodId) ?? FOODS[3]
  const scale = serving / 100

  const carbsG   = round(food.carbs   * scale, 1)
  const proteinG = round(food.protein * scale, 1)
  const fatG     = round(food.fat     * scale, 1)

  const carbsKcal   = round(carbsG   * KCAL_PER_G.carbs,   0)
  const proteinKcal = round(proteinG * KCAL_PER_G.protein, 0)
  const fatKcal     = round(fatG     * KCAL_PER_G.fat,     0)
  const totalKcal   = carbsKcal + proteinKcal + fatKcal

  const pctCarbs   = totalKcal > 0 ? (carbsKcal   / totalKcal) * 100 : 0
  const pctProtein = totalKcal > 0 ? (proteinKcal / totalKcal) * 100 : 0
  const pctFat     = totalKcal > 0 ? (fatKcal     / totalKcal) * 100 : 0

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Pick a food and a serving size — see how its energy splits across the three macros.
      </p>

      {/* Food selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FOODS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFoodId(f.id)}
            className={cn(
              'rounded-xl border px-3 py-1.5 text-sm transition-colors',
              foodId === f.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      {/* Serving slider */}
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>Serving size</span>
          <span className="font-mono text-ink">{serving} g</span>
        </div>
        <input
          type="range"
          className="accent-accent w-full"
          min={20}
          max={300}
          step={10}
          value={serving}
          onChange={(e) => setServing(Number(e.target.value))}
        />
        <div className="flex justify-between text-xs text-muted mt-0.5">
          <span>20 g</span><span>300 g</span>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="mb-3">
        <div className="mb-1 text-xs text-muted">Energy share (kcal from each macro)</div>
        <div className="flex h-8 w-full overflow-hidden rounded-lg border border-border">
          {pctCarbs > 0 && (
            <div
              className="flex items-center justify-center text-xs font-semibold text-white transition-all duration-300"
              style={{ width: `${pctCarbs}%`, background: '#E67E22' }}
            >
              {pctCarbs > 10 ? `${Math.round(pctCarbs)}%` : ''}
            </div>
          )}
          {pctProtein > 0 && (
            <div
              className="flex items-center justify-center text-xs font-semibold text-white transition-all duration-300"
              style={{ width: `${pctProtein}%`, background: 'var(--color-accent)' }}
            >
              {pctProtein > 10 ? `${Math.round(pctProtein)}%` : ''}
            </div>
          )}
          {pctFat > 0 && (
            <div
              className="flex items-center justify-center text-xs font-semibold text-white transition-all duration-300"
              style={{ width: `${pctFat}%`, background: 'var(--color-accent-2)' }}
            >
              {pctFat > 10 ? `${Math.round(pctFat)}%` : ''}
            </div>
          )}
        </div>
        {/* Legend */}
        <div className="mt-1.5 flex gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: '#E67E22' }} />
            Carbs (4 kcal/g)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: 'var(--color-accent)' }} />
            Protein (4 kcal/g)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: 'var(--color-accent-2)' }} />
            Fat (9 kcal/g)
          </span>
        </div>
      </div>

      {/* Macro detail rows */}
      <div className="mt-3 rounded-xl border border-border bg-surface-2 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="px-3 py-2 text-left font-medium">Macro</th>
              <th className="px-3 py-2 text-right font-medium">Grams</th>
              <th className="px-3 py-2 text-right font-medium">kcal/g</th>
              <th className="px-3 py-2 text-right font-medium">kcal</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="px-3 py-1.5 font-medium" style={{ color: '#E67E22' }}>Carbohydrate</td>
              <td className="px-3 py-1.5 text-right font-mono text-ink">{carbsG}</td>
              <td className="px-3 py-1.5 text-right text-muted">4</td>
              <td className="px-3 py-1.5 text-right font-mono text-ink">{carbsKcal}</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="px-3 py-1.5 font-medium text-accent">Protein</td>
              <td className="px-3 py-1.5 text-right font-mono text-ink">{proteinG}</td>
              <td className="px-3 py-1.5 text-right text-muted">4</td>
              <td className="px-3 py-1.5 text-right font-mono text-ink">{proteinKcal}</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="px-3 py-1.5 font-medium text-accent-2">Fat</td>
              <td className="px-3 py-1.5 text-right font-mono text-ink">{fatG}</td>
              <td className="px-3 py-1.5 text-right text-muted">9</td>
              <td className="px-3 py-1.5 text-right font-mono text-ink">{fatKcal}</td>
            </tr>
            <tr>
              <td className="px-3 py-1.5 font-semibold text-ink" colSpan={3}>Total</td>
              <td className="px-3 py-1.5 text-right font-mono font-bold text-ink">{totalKcal}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted">
        Values per {serving}g serving. Fat delivers more than twice the energy per gram compared to carbs or protein —
        which is why fatty foods are so energy-dense.
      </p>
    </div>
  )
}
