import { useState } from 'react'
import { cn } from '#/lib/cn'

// Plants make sugar from light, but they also need minerals from the soil. Pick a
// mineral to see its job — and what a plant looks like when it runs short.
type Mineral = { id: string; label: string; role: string; symptom: string; leaf: string }

const MINERALS: Array<Mineral> = [
  { id: 'N', label: 'Nitrogen', role: 'Used to make proteins (including enzymes) for growth.', symptom: 'Stunted growth and yellowing of the older leaves.', leaf: '#b7c44a' },
  { id: 'Mg', label: 'Magnesium', role: 'A key part of chlorophyll, the green pigment for photosynthesis.', symptom: 'Yellowing between the leaf veins (chlorosis) — no chlorophyll.', leaf: '#d9d24a' },
  { id: 'P', label: 'Phosphorus', role: 'Needed for DNA, membranes, and energy (ATP) — and healthy roots.', symptom: 'Poor root growth and purple-tinged leaves.', leaf: '#7a8f5a' },
  { id: 'K', label: 'Potassium', role: 'Helps enzymes work and supports flowers and fruit.', symptom: 'Yellow, scorched leaf edges and poor flowering.', leaf: '#a8b84a' },
]

export function PlantNutrition() {
  const [sel, setSel] = useState('N')
  const [deficient, setDeficient] = useState(true)
  const m = MINERALS.find((x) => x.id === sel)!
  const leafColor = deficient ? m.leaf : '#2e9b4a'
  const scale = deficient && sel === 'N' ? 0.7 : 1

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {MINERALS.map((x) => (
          <button key={x.id} type="button" onClick={() => setSel(x.id)} className={cn('rounded-full border px-3 py-1 text-sm transition-colors', sel === x.id ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
            {x.label} ({x.id})
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <svg viewBox="0 0 120 150" className="h-[130px] w-[110px] shrink-0">
          <rect x={44} y={120} width={32} height={26} rx={3} fill="#7b5a3a" />
          <g transform={`translate(60 ${118 - 50 * scale}) scale(${scale})`}>
            <line x1={0} y1={0} x2={0} y2={50} stroke="#3a6b2e" strokeWidth={4} />
            <ellipse cx={-22} cy={10} rx={20} ry={9} fill={leafColor} transform="rotate(-20 -22 10)" />
            <ellipse cx={22} cy={20} rx={20} ry={9} fill={leafColor} transform="rotate(20 22 20)" />
            <ellipse cx={-18} cy={36} rx={16} ry={7} fill={leafColor} transform="rotate(-20 -18 36)" />
          </g>
        </svg>

        <div className="flex-1">
          <button type="button" onClick={() => setDeficient((d) => !d)} className={cn('mb-2 rounded-full border px-3 py-1 text-xs transition-colors', deficient ? 'border-warn bg-warn/15 text-warn' : 'border-success bg-success/15 text-success')}>
            {deficient ? `Deficient in ${m.label}` : 'Healthy plant'}
          </button>
          <p className="text-sm text-muted"><span className="font-semibold text-ink">Role: </span>{m.role}</p>
          {deficient && <p className="mt-1 text-sm text-warn"><span className="font-semibold">Deficiency: </span>{m.symptom}</p>}
        </div>
      </div>
    </div>
  )
}
