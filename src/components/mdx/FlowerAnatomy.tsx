import { useState } from 'react'
import { cn } from '#/lib/cn'

// A flower, taken apart. Click each part to see its role in reproduction — the
// male stamens that make pollen and the female carpel that receives it.
type Part = { id: string; label: string; sex: string; fn: string }

const PARTS: Array<Part> = [
  { id: 'petal', label: 'Petal', sex: '—', fn: 'Often big and colourful (and scented) to attract pollinating insects.' },
  { id: 'sepal', label: 'Sepal', sex: '—', fn: 'The small green leaves that protected the flower while it was a bud.' },
  { id: 'anther', label: 'Anther', sex: 'male', fn: 'Makes pollen, which contains the male gametes. Sits on top of the filament.' },
  { id: 'filament', label: 'Filament', sex: 'male', fn: 'The stalk that holds the anther up where pollen can be picked up. (Anther + filament = the stamen.)' },
  { id: 'stigma', label: 'Stigma', sex: 'female', fn: 'A sticky tip that catches pollen grains landing on the flower.' },
  { id: 'ovary', label: 'Ovary', sex: 'female', fn: 'Contains the ovules (female gametes). After fertilisation, ovules become seeds and the ovary becomes the fruit.' },
]

export function FlowerAnatomy() {
  const [sel, setSel] = useState('anther')
  const p = PARTS.find((x) => x.id === sel)!
  const on = (id: string) => sel === id
  const ring = (id: string) => (on(id) ? 5 : 1.5)
  const col = (id: string, base: string) => (on(id) ? '#FACC15' : base)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 280 190" className="mx-auto block h-[180px]">
        {/* petals */}
        <g onClick={() => setSel('petal')} className="cursor-pointer">
          {[-1, 1].map((d) => (
            <path key={d} d={`M 140 120 Q ${140 + d * 95} 40 ${140 + d * 50} 30 Q ${140 + d * 20} 70 140 120`} fill="#FD79A8" stroke={col('petal', '#c0508a')} strokeWidth={ring('petal')} />
          ))}
        </g>
        {/* sepals */}
        <g onClick={() => setSel('sepal')} className="cursor-pointer">
          <path d="M 140 124 L 110 160 L 140 140 L 170 160 Z" fill="#2e9b4a" stroke={col('sepal', '#1f6b2f')} strokeWidth={ring('sepal')} />
        </g>
        {/* filaments + anthers (stamens) */}
        <g onClick={() => setSel('filament')} className="cursor-pointer">
          <line x1={118} y1={120} x2={104} y2={56} stroke={col('filament', '#A3CB38')} strokeWidth={ring('filament') + 1} />
          <line x1={162} y1={120} x2={176} y2={56} stroke={col('filament', '#A3CB38')} strokeWidth={ring('filament') + 1} />
        </g>
        <g onClick={() => setSel('anther')} className="cursor-pointer">
          <ellipse cx={104} cy={50} rx={9} ry={6} fill={col('anther', '#FDCB6E')} />
          <ellipse cx={176} cy={50} rx={9} ry={6} fill={col('anther', '#FDCB6E')} />
        </g>
        {/* carpel: stigma + style + ovary */}
        <g onClick={() => setSel('stigma')} className="cursor-pointer">
          <ellipse cx={140} cy={44} rx={10} ry={7} fill={col('stigma', '#E67E22')} />
        </g>
        <line x1={140} y1={50} x2={140} y2={110} stroke="#7a8f5a" strokeWidth={3} />
        <g onClick={() => setSel('ovary')} className="cursor-pointer">
          <ellipse cx={140} cy={120} rx={18} ry={14} fill={col('ovary', '#9b59b6')} />
          <circle cx={134} cy={120} r={3} fill="#fff" />
          <circle cx={146} cy={120} r={3} fill="#fff" />
        </g>
      </svg>

      <div className="mt-1 flex flex-wrap gap-1.5">
        {PARTS.map((x) => (
          <button key={x.id} type="button" onClick={() => setSel(x.id)} className={cn('rounded-full border px-2.5 py-0.5 text-xs transition-colors', on(x.id) ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
            {x.label}
          </button>
        ))}
      </div>
      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold text-ink">{p.label}</span>
        {p.sex !== '—' && <span className="text-xs text-accent-2"> ({p.sex})</span>}
        <span className="text-ink">: </span>{p.fn}
      </p>
    </div>
  )
}
