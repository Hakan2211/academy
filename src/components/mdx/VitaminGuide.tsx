import { useState } from 'react'
import { cn } from '#/lib/cn'

type NutrientKind = 'fat-soluble' | 'water-soluble' | 'mineral'

type Nutrient = {
  id: string
  label: string
  kind: NutrientKind
  role: string
  sources: string
  deficiency: string
}

const NUTRIENTS: Array<Nutrient> = [
  {
    id: 'vit-a',
    label: 'Vitamin A',
    kind: 'fat-soluble',
    role: 'Maintains vision (especially night vision), supports immune defence, and keeps skin and mucous membranes intact.',
    sources: 'Liver, egg yolk, orange/yellow vegetables (carrots, sweet potato), dark leafy greens.',
    deficiency: 'Night blindness; in severe cases, complete vision loss (common in low-income countries).',
  },
  {
    id: 'vit-c',
    label: 'Vitamin C',
    kind: 'water-soluble',
    role: 'Makes collagen (skin, tendons, blood vessels), boosts immunity, and acts as an antioxidant to protect cells.',
    sources: 'Citrus fruits, kiwi, strawberries, capsicum (bell peppers), broccoli.',
    deficiency: 'Scurvy — bleeding gums, slow wound healing, fatigue, and joint pain.',
  },
  {
    id: 'vit-d',
    label: 'Vitamin D',
    kind: 'fat-soluble',
    role: 'Regulates calcium and phosphate absorption for strong bones and teeth; supports immune function and mood.',
    sources: 'Sunlight (skin synthesis), oily fish (salmon, sardines), fortified dairy, egg yolk.',
    deficiency: 'Rickets in children (soft, bowed bones); osteomalacia in adults (bone pain, muscle weakness).',
  },
  {
    id: 'vit-e',
    label: 'Vitamin E',
    kind: 'fat-soluble',
    role: 'Powerful antioxidant that protects cell membranes from oxidative damage; supports immune function.',
    sources: 'Nuts and seeds, vegetable oils (sunflower, wheat germ), avocado, spinach.',
    deficiency: 'Rare; in severe cases: nerve and muscle damage, weakened immune response.',
  },
  {
    id: 'vit-k',
    label: 'Vitamin K',
    kind: 'fat-soluble',
    role: 'Essential for blood clotting (without it, wounds bleed freely) and bone protein synthesis.',
    sources: 'Dark leafy greens (kale, spinach), broccoli, vegetable oils; also produced by gut bacteria.',
    deficiency: 'Excessive bleeding (bruising easily, slow wound clotting); newborns at special risk.',
  },
  {
    id: 'vit-b12',
    label: 'Vitamin B12',
    kind: 'water-soluble',
    role: 'Makes red blood cells and myelin (nerve insulation); needed for DNA synthesis and brain function.',
    sources: 'Meat, fish, eggs, dairy. Vegans need fortified foods or supplements — plants contain none.',
    deficiency: 'Megaloblastic anaemia, fatigue, numbness/tingling in hands and feet, neurological damage.',
  },
  {
    id: 'folate',
    label: 'Folate (B9)',
    kind: 'water-soluble',
    role: 'Cell division and DNA synthesis; critically important before and during early pregnancy for neural-tube formation.',
    sources: 'Dark leafy greens, legumes (lentils, chickpeas), fortified cereals, liver, avocado.',
    deficiency: 'Megaloblastic anaemia; neural tube defects (spina bifida) in developing embryos.',
  },
  {
    id: 'iron',
    label: 'Iron',
    kind: 'mineral',
    role: 'Core of haemoglobin — the protein in red blood cells that carries oxygen from lungs to tissues.',
    sources: 'Red meat, liver, shellfish (haem iron); lentils, tofu, spinach, fortified cereals (non-haem iron).',
    deficiency: 'Iron-deficiency anaemia: fatigue, pale skin, shortness of breath, poor concentration.',
  },
  {
    id: 'calcium',
    label: 'Calcium',
    kind: 'mineral',
    role: 'Builds and maintains bones and teeth; also needed for muscle contraction, nerve signals, and blood clotting.',
    sources: 'Dairy (milk, yoghurt, cheese), fortified plant milks, tinned fish with bones, kale, tofu.',
    deficiency: 'Osteoporosis (fragile bones) long-term; acute low blood calcium causes muscle cramps, spasms.',
  },
  {
    id: 'sodium',
    label: 'Sodium',
    kind: 'mineral',
    role: 'Regulates fluid balance outside cells, nerve impulse transmission, and muscle contraction.',
    sources: 'Table salt, processed foods, bread, cured meats, sauces. Most people eat too much, not too little.',
    deficiency: 'Hyponatraemia (rare in typical diets): confusion, headache, seizures. Excess raises blood pressure.',
  },
  {
    id: 'potassium',
    label: 'Potassium',
    kind: 'mineral',
    role: 'Balances sodium inside cells, keeps blood pressure healthy, and enables normal heart rhythm.',
    sources: 'Bananas, potatoes, sweet potato, avocado, spinach, beans, tomatoes.',
    deficiency: 'Hypokalaemia: muscle weakness, cramps, irregular heartbeat — risk rises with poor diet or diarrhoea.',
  },
  {
    id: 'iodine',
    label: 'Iodine',
    kind: 'mineral',
    role: 'Sole function: making thyroid hormones (T3, T4), which control metabolism and support brain development.',
    sources: 'Seafood, seaweed, dairy, iodised salt. Inland regions historically have low dietary iodine.',
    deficiency: 'Goitre (enlarged thyroid); hypothyroidism (fatigue, weight gain); in foetal life, cretinism.',
  },
]

const KIND_LABEL: Record<NutrientKind, string> = {
  'fat-soluble': 'Fat-soluble vitamin',
  'water-soluble': 'Water-soluble vitamin',
  mineral: 'Mineral',
}

const KIND_COLOR: Record<NutrientKind, string> = {
  'fat-soluble': 'bg-amber-400/15 text-amber-500 border-amber-400/40',
  'water-soluble': 'bg-sky-400/15 text-sky-500 border-sky-400/40',
  mineral: 'bg-emerald-400/15 text-emerald-600 border-emerald-400/40',
}

export function VitaminGuide() {
  const [selected, setSelected] = useState<string>('vit-c')
  const nutrient = NUTRIENTS.find((n) => n.id === selected)!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">Click any nutrient to see its role, sources, and deficiency signs.</p>

      {/* Grid of chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        {NUTRIENTS.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => setSelected(n.id)}
            className={cn(
              'rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors',
              selected === n.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {n.label}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="rounded-xl border border-border bg-surface-2 p-4 text-sm">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold text-ink">{nutrient.label}</span>
          <span className={cn('rounded-full border px-2 py-0.5 text-xs font-medium', KIND_COLOR[nutrient.kind])}>
            {KIND_LABEL[nutrient.kind]}
          </span>
        </div>

        <div className="space-y-2.5">
          <div>
            <span className="font-semibold text-accent">Role: </span>
            <span className="text-ink">{nutrient.role}</span>
          </div>
          <div>
            <span className="font-semibold text-accent">Good sources: </span>
            <span className="text-ink">{nutrient.sources}</span>
          </div>
          <div>
            <span className="font-semibold text-warn">Deficiency: </span>
            <span className="text-ink">{nutrient.deficiency}</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">
        Fat-soluble vitamins (A, D, E, K) accumulate in body fat — excess can be toxic. Water-soluble vitamins are
        excreted in urine, but large doses aren't necessarily safe either.
      </p>
    </div>
  )
}
