import { useState } from 'react'
import { cn } from '#/lib/cn'

// A functional group is a specific cluster of atoms that gives an organic
// molecule its characteristic reactions. The carbon backbone (R) is the same;
// swap the group and the chemistry changes entirely.
type Group = { key: string; name: string; group: string; example: string; note: string; color: string }

const GROUPS: Array<Group> = [
  { key: 'alcohol', name: 'Alcohol', group: '–OH (hydroxyl)', example: 'ethanol, CH₃CH₂OH', note: 'The –OH group. Found in drinking alcohol, antiseptics, and fuels.', color: '#E74C3C' },
  { key: 'acid', name: 'Carboxylic acid', group: '–COOH (carboxyl)', example: 'acetic acid (vinegar)', note: 'The –COOH group makes the molecule acidic — it donates an H⁺.', color: '#E67E22' },
  { key: 'amine', name: 'Amine', group: '–NH₂ (amino)', example: 'amino acids', note: 'The –NH₂ group is basic. Amino acids combine it with –COOH to build proteins.', color: '#5DADE2' },
  { key: 'aldehyde', name: 'Aldehyde', group: '–CHO', example: 'formaldehyde', note: 'A C=O at the end of a chain. Reactive; used in preservatives and resins.', color: '#9B59B6' },
  { key: 'ketone', name: 'Ketone', group: 'C=O (in chain)', example: 'acetone (nail polish remover)', note: 'A C=O in the middle of a chain. A common, useful solvent.', color: '#16A085' },
  { key: 'ester', name: 'Ester', group: '–COO–', example: 'fruit smells, fats', note: 'Made from an acid + alcohol. Esters give fruits their scents and form fats.', color: '#F1C40F' },
]

export function FunctionalGroups() {
  const [key, setKey] = useState('alcohol')
  const g = GROUPS.find((x) => x.key === key) ?? GROUPS[0]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {GROUPS.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => setKey(x.key)}
            className={cn('rounded-full border px-3 py-1 text-sm transition-colors', key === x.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
          >
            {x.name}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 300 90" className="w-full">
        {/* R backbone */}
        <circle cx={90} cy={45} r={20} fill="#34404F" />
        <text x={90} y={50} textAnchor="middle" className="fill-white text-[13px] font-bold">R</text>
        <line x1={110} y1={45} x2={170} y2={45} stroke="var(--color-ink)" strokeWidth={2.5} />
        {/* functional group bubble */}
        <rect x={172} y={24} width={96} height={42} rx={10} fill={g.color} opacity={0.25} stroke={g.color} strokeWidth={1.5} />
        <text x={220} y={50} textAnchor="middle" className="fill-ink text-[12px] font-bold">{g.group.split(' ')[0]}</text>
        <text x={90} y={82} textAnchor="middle" className="fill-muted text-[8px]">carbon backbone</text>
      </svg>

      <p className="text-center text-sm">
        <span className="font-semibold text-ink">{g.name}</span>{' '}
        <span className="text-muted">— {g.group}</span>
      </p>
      <p className="mt-1 min-h-[2.5rem] text-center text-sm text-muted">{g.note} <span className="text-ink">e.g. {g.example}.</span></p>
    </div>
  )
}
