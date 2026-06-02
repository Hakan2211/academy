import { useState } from 'react'
import { cn } from '#/lib/cn'

// Covalent bonding: two non-metals SHARE electron pairs so both reach a full
// shell. One shared pair = single bond, two pairs = double, three = triple.
// More shared pairs means a stronger, shorter bond.
type Mol = {
  key: string
  label: string
  formula: string
  bonds: 1 | 2 | 3
  a: string
  b: string
  colorA: string
  colorB: string
  note: string
}

const MOLS: Array<Mol> = [
  { key: 'h2', label: 'Hydrogen', formula: 'H₂', bonds: 1, a: 'H', b: 'H', colorA: '#ECEFF4', colorB: '#ECEFF4', note: 'Each hydrogen shares its single electron, giving both a full first shell (2).' },
  { key: 'cl2', label: 'Chlorine', formula: 'Cl₂', bonds: 1, a: 'Cl', b: 'Cl', colorA: '#4DABF7', colorB: '#4DABF7', note: 'One shared pair completes both outer shells — a single covalent bond.' },
  { key: 'o2', label: 'Oxygen', formula: 'O₂', bonds: 2, a: 'O', b: 'O', colorA: '#E74C3C', colorB: '#E74C3C', note: 'Two shared pairs — a double bond — let each oxygen reach eight outer electrons.' },
  { key: 'n2', label: 'Nitrogen', formula: 'N₂', bonds: 3, a: 'N', b: 'N', colorA: '#5DADE2', colorB: '#5DADE2', note: 'Three shared pairs — a triple bond — make N₂ extremely strong and unreactive.' },
]

export function CovalentBond() {
  const [key, setKey] = useState('h2')
  const m = MOLS.find((x) => x.key === key) ?? MOLS[0]
  const pairY = m.bonds === 1 ? [85] : m.bonds === 2 ? [72, 98] : [60, 85, 110]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {MOLS.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => setKey(x.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              key === x.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {x.label} {x.formula}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 320 170" className="w-full">
        {/* two atoms with overlapping shells */}
        <circle cx={115} cy={85} r={46} fill="none" stroke="var(--color-border)" strokeWidth={1} />
        <circle cx={205} cy={85} r={46} fill="none" stroke="var(--color-border)" strokeWidth={1} />
        <circle cx={115} cy={85} r={20} fill={m.colorA} />
        <circle cx={205} cy={85} r={20} fill={m.colorB} />
        <text x={115} y={90} textAnchor="middle" className="fill-[#10141f] text-[13px] font-bold">{m.a}</text>
        <text x={205} y={90} textAnchor="middle" className="fill-[#10141f] text-[13px] font-bold">{m.b}</text>

        {/* shared electron pairs in the overlap zone */}
        {pairY.map((y, i) => (
          <g key={i}>
            <circle cx={152} cy={y} r={5} fill="#F1C40F" stroke="#B7950B" />
            <circle cx={168} cy={y} r={5} fill="#F1C40F" stroke="#B7950B" />
          </g>
        ))}

        <text x={160} y={150} textAnchor="middle" className="fill-muted text-[11px]">
          {m.bonds === 1 ? 'single bond (1 shared pair)' : m.bonds === 2 ? 'double bond (2 shared pairs)' : 'triple bond (3 shared pairs)'}
        </text>
      </svg>

      <p className="mt-1 min-h-[2.5rem] text-center text-sm text-muted">{m.note}</p>
    </div>
  )
}
