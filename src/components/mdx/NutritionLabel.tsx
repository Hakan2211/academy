import { useState } from 'react'
import { cn } from '#/lib/cn'
import { round, clamp } from '#/lib/health'

// Interactive Nutrition Facts panel.
// Key lesson: the "servings per container" trap — a bag looks small but is 4 servings.
// Toggle highlights: added sugar, %DV.

type Product = {
  id: string
  label: string
  servingsPerContainer: number
  servingLabel: string
  // Per SINGLE serving:
  calories: number
  totalFat: number       // g
  satFat: number         // g
  sodium: number         // mg
  totalCarbs: number     // g
  fibre: number          // g
  totalSugar: number     // g
  addedSugar: number     // g
  protein: number        // g
}

const PRODUCTS: Array<Product> = [
  {
    id: 'chips',
    label: 'Potato chips',
    servingsPerContainer: 4,
    servingLabel: '28 g (about 15 chips)',
    calories: 150,
    totalFat: 10, satFat: 1.5, sodium: 170,
    totalCarbs: 15, fibre: 1, totalSugar: 0, addedSugar: 0,
    protein: 2,
  },
  {
    id: 'granola',
    label: 'Granola bar',
    servingsPerContainer: 3,
    servingLabel: '40 g (1 bar)',
    calories: 190,
    totalFat: 7, satFat: 1, sodium: 95,
    totalCarbs: 29, fibre: 2, totalSugar: 14, addedSugar: 10,
    protein: 4,
  },
  {
    id: 'yogurt',
    label: 'Flavoured yogurt',
    servingsPerContainer: 2,
    servingLabel: '170 g (¾ cup)',
    calories: 150,
    totalFat: 1.5, satFat: 1, sodium: 80,
    totalCarbs: 26, fibre: 0, totalSugar: 22, addedSugar: 14,
    protein: 8,
  },
  {
    id: 'cereal',
    label: 'Sweetened cereal',
    servingsPerContainer: 9,
    servingLabel: '30 g (¾ cup)',
    calories: 120,
    totalFat: 1, satFat: 0, sodium: 180,
    totalCarbs: 27, fibre: 1, totalSugar: 12, addedSugar: 11,
    protein: 2,
  },
]

// %DV reference values (2000 kcal diet, FDA guidelines)
const DV = {
  totalFat: 78,    // g
  satFat: 20,      // g
  sodium: 2300,    // mg
  totalCarbs: 275, // g
  fibre: 28,       // g
  addedSugar: 50,  // g
}

function dvPct(val: number, ref: number): number {
  return round((val / ref) * 100, 0)
}

export function NutritionLabel() {
  const [productId, setProductId] = useState<string>('granola')
  const [servings, setServings] = useState<number>(1)
  const [highlightSugar, setHighlightSugar] = useState(false)
  const [showDV, setShowDV] = useState(false)

  const p = PRODUCTS.find((x) => x.id === productId) ?? PRODUCTS[0]
  const s = clamp(servings, 1, p.servingsPerContainer)

  // Scale all values
  const cal       = round(p.calories    * s, 0)
  const fat       = round(p.totalFat    * s, 1)
  const satF      = round(p.satFat      * s, 1)
  const sod       = round(p.sodium      * s, 0)
  const carbs     = round(p.totalCarbs  * s, 1)
  const fib       = round(p.fibre       * s, 1)
  const totSugar  = round(p.totalSugar  * s, 1)
  const addSugar  = round(p.addedSugar  * s, 1)
  const prot      = round(p.protein     * s, 1)

  const wholeContainer = s >= p.servingsPerContainer

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Product picker */}
      <div className="mb-4 flex flex-wrap gap-2">
        {PRODUCTS.map((prod) => (
          <button
            key={prod.id}
            type="button"
            onClick={() => { setProductId(prod.id); setServings(1) }}
            className={cn(
              'rounded-xl border px-3 py-1.5 text-sm transition-colors',
              productId === prod.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {prod.label}
          </button>
        ))}
      </div>

      {/* Servings stepper */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-muted">Servings eaten:</span>
        <button
          type="button"
          onClick={() => setServings((v) => Math.max(1, v - 1))}
          className="rounded-lg border border-border px-3 py-1 text-ink hover:bg-surface-2 active:bg-surface-2"
        >
          −
        </button>
        <span className="min-w-[2ch] text-center font-mono text-lg font-bold text-ink">{s}</span>
        <button
          type="button"
          onClick={() => setServings((v) => Math.min(p.servingsPerContainer, v + 1))}
          className="rounded-lg border border-border px-3 py-1 text-ink hover:bg-surface-2 active:bg-surface-2"
        >
          +
        </button>
        <span className="text-xs text-muted">of {p.servingsPerContainer} in container</span>
      </div>

      {/* The label itself */}
      <div className="rounded-xl border-2 border-ink/80 bg-white text-ink overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif' }}>
        {/* Header */}
        <div className="border-b-8 border-ink/80 px-3 pt-2 pb-1">
          <div className="text-2xl font-black leading-tight text-ink">Nutrition Facts</div>
          <div className="text-xs text-ink/70">{s} serving{s !== 1 ? 's' : ''} per container</div>
          <div className="flex justify-between text-sm font-bold text-ink">
            <span>Serving size</span>
            <span>{p.servingLabel}</span>
          </div>
        </div>

        {/* Calories */}
        <div className="border-b-4 border-ink/80 flex items-end justify-between px-3 py-1">
          <div>
            <div className="text-xs font-bold text-ink/70">Amount per serving{s > 1 ? ` × ${s}` : ''}</div>
            <div className="text-2xl font-black text-ink">Calories</div>
          </div>
          <div className="text-5xl font-black leading-none text-ink">{cal}</div>
        </div>

        {/* Macro rows */}
        <div className="border-b border-ink/30 px-3 py-0.5 text-right text-xs font-bold text-ink/70">
          % Daily Value*
        </div>

        {[
          { label: 'Total Fat', val: fat, unit: 'g', dv: dvPct(fat, DV.totalFat), indent: false },
          { label: 'Saturated Fat', val: satF, unit: 'g', dv: dvPct(satF, DV.satFat), indent: true },
          { label: 'Sodium', val: sod, unit: 'mg', dv: dvPct(sod, DV.sodium), indent: false },
          { label: 'Total Carbohydrate', val: carbs, unit: 'g', dv: dvPct(carbs, DV.totalCarbs), indent: false },
          { label: 'Dietary Fibre', val: fib, unit: 'g', dv: dvPct(fib, DV.fibre), indent: true },
          { label: 'Total Sugars', val: totSugar, unit: 'g', dv: null, indent: true, isSugar: true },
          { label: 'Incl. Added Sugars', val: addSugar, unit: 'g', dv: dvPct(addSugar, DV.addedSugar), indent: true, isAddedSugar: true },
          { label: 'Protein', val: prot, unit: 'g', dv: null, indent: false },
        ].map((row) => (
          <div
            key={row.label}
            className={cn(
              'flex justify-between px-3 py-0.5 text-sm border-b border-ink/15',
              row.indent ? 'pl-7' : '',
              highlightSugar && (row.isSugar || row.isAddedSugar)
                ? 'bg-orange-100'
                : '',
            )}
          >
            <span className={cn('font-medium text-ink', !row.indent && 'font-bold')}>
              {row.label}{' '}
              <span className="font-normal">{row.val}{row.unit}</span>
            </span>
            {showDV && row.dv !== null && (
              <span className="font-bold text-ink">{row.dv}%</span>
            )}
          </div>
        ))}

        {/* Footer note */}
        <div className="px-3 py-1.5 text-xs text-ink/60">
          *Percent Daily Values are based on a 2,000 calorie diet.
        </div>
      </div>

      {/* Toggles */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setHighlightSugar((v) => !v)}
          className={cn(
            'rounded-xl border px-3 py-1.5 text-sm transition-colors',
            highlightSugar
              ? 'border-accent bg-accent/15 text-accent'
              : 'border-border text-muted hover:text-ink',
          )}
        >
          Highlight sugar rows
        </button>
        <button
          type="button"
          onClick={() => setShowDV((v) => !v)}
          className={cn(
            'rounded-xl border px-3 py-1.5 text-sm transition-colors',
            showDV
              ? 'border-accent bg-accent/15 text-accent'
              : 'border-border text-muted hover:text-ink',
          )}
        >
          Show %DV
        </button>
      </div>

      {/* Insight callout */}
      <div className={cn(
        'mt-3 rounded-xl border p-3 text-sm',
        wholeContainer
          ? 'border-warn/50 bg-warn/10'
          : 'border-border bg-surface-2',
      )}>
        {wholeContainer ? (
          <p className="text-ink">
            You ate the <span className="font-semibold text-warn">whole container</span> —{' '}
            {p.servingsPerContainer} servings. That's{' '}
            <span className="font-bold text-ink">{cal} kcal</span> total. Labels list values per serving,
            so it's easy to underestimate when you eat the whole thing without thinking.
          </p>
        ) : (
          <p className="text-muted">
            Each number above reflects <span className="text-ink font-semibold">{s} serving{s > 1 ? 's' : ''}</span>.
            Try eating more servings — or the whole container — to see the "servings trap" in action.
            Check added sugar with the highlight toggle; %DV shows how each nutrient fits a 2,000 kcal day.
          </p>
        )}
      </div>
    </div>
  )
}
