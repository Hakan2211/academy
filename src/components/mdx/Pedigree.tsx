import { useState } from 'react'

// A pedigree tracks a trait through a family. Squares are male, circles female;
// filled = affected. Two unaffected "carriers" can have an affected child — the
// signature of a recessive condition. Click anyone to see their genotype.
type Person = {
  id: string
  x: number
  y: number
  sex: 'm' | 'f'
  status: 'affected' | 'carrier' | 'clear'
  geno: string
  note: string
}

const PEOPLE: Array<Person> = [
  { id: 'I-1', x: 130, y: 40, sex: 'm', status: 'carrier', geno: 'Bb', note: 'Unaffected carrier — has one recessive allele but the dominant one masks it.' },
  { id: 'I-2', x: 230, y: 40, sex: 'f', status: 'carrier', geno: 'Bb', note: 'Unaffected carrier.' },
  { id: 'II-1', x: 90, y: 130, sex: 'm', status: 'affected', geno: 'bb', note: 'Affected — inherited a recessive allele from EACH carrier parent.' },
  { id: 'II-2', x: 180, y: 130, sex: 'f', status: 'clear', geno: 'BB', note: 'Unaffected and not a carrier.' },
  { id: 'II-3', x: 270, y: 130, sex: 'f', status: 'carrier', geno: 'Bb', note: 'Unaffected carrier.' },
]

const FILL: Record<Person['status'], string> = { affected: '#E74C3C', carrier: '#0e1c2e', clear: '#0e1c2e' }

export function Pedigree() {
  const [sel, setSel] = useState('II-1')
  const person = PEOPLE.find((p) => p.id === sel)!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 180" className="w-full">
        {/* marriage + sibling lines */}
        <line x1={150} y1={40} x2={230} y2={40} stroke="#64748b" strokeWidth={2} />
        <line x1={190} y1={40} x2={190} y2={70} stroke="#64748b" strokeWidth={2} />
        <line x1={90} y1={70} x2={270} y2={70} stroke="#64748b" strokeWidth={2} />
        {[90, 180, 270].map((x) => (
          <line key={x} x1={x} y1={70} x2={x} y2={110} stroke="#64748b" strokeWidth={2} />
        ))}

        {PEOPLE.map((p) => {
          const on = p.id === sel
          const stroke = on ? '#FACC15' : '#94a3b8'
          return (
            <g key={p.id} onClick={() => setSel(p.id)} className="cursor-pointer">
              {p.sex === 'm' ? (
                <rect x={p.x - 16} y={p.y - 16} width={32} height={32} fill={FILL[p.status]} stroke={stroke} strokeWidth={on ? 3 : 2} />
              ) : (
                <circle cx={p.x} cy={p.y} r={16} fill={FILL[p.status]} stroke={stroke} strokeWidth={on ? 3 : 2} />
              )}
              {p.status === 'carrier' && <circle cx={p.x} cy={p.y} r={4} fill="#E74C3C" />}
              <text x={p.x} y={p.y + 30} textAnchor="middle" className="fill-muted text-[9px]">{p.id}</text>
            </g>
          )
        })}
      </svg>

      <div className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-muted">
        <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 border border-slate-400" /> male</span>
        <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full border border-slate-400" /> female</span>
        <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 bg-[#E74C3C]" /> affected</span>
        <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full border border-slate-400" /><span className="-ml-2 h-1.5 w-1.5 rounded-full bg-[#E74C3C]" /> carrier</span>
      </div>

      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold text-ink">{person.id} ({person.geno}): </span>
        {person.note}
      </p>
    </div>
  )
}
