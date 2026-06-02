import { useState } from 'react'
import { cn } from '#/lib/cn'

// Carbohydrates are sugars built from ring units. One ring is a monosaccharide
// (glucose); two joined is a disaccharide (sucrose); many chained is a
// polysaccharide (starch, cellulose). Toggle the size.
type Kind = 'mono' | 'di' | 'poly'

const INFO: Record<Kind, { title: string; rings: number; note: string }> = {
  mono: { title: 'Monosaccharide', rings: 1, note: 'A single sugar ring — glucose, fructose, galactose. The basic fuel molecule cells run on.' },
  di: { title: 'Disaccharide', rings: 2, note: 'Two rings joined (with loss of water). Sucrose (table sugar) = glucose + fructose; maltose; lactose.' },
  poly: { title: 'Polysaccharide', rings: 6, note: 'Many rings chained together. Starch and glycogen store energy; cellulose builds plant cell walls.' },
}

function Hexagon({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')
  return <polygon points={pts} fill="#F1C40F" opacity={0.55} stroke="#B7950B" strokeWidth={1.5} />
}

export function CarbohydrateViewer() {
  const [kind, setKind] = useState<Kind>('mono')
  const info = INFO[kind]
  const n = info.rings

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(['mono', 'di', 'poly'] as Array<Kind>).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={cn('rounded-full border px-3 py-1 text-sm transition-colors', kind === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
          >
            {INFO[k].title}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 300 90" className="w-full">
        {Array.from({ length: n }).map((_, i) => {
          const spacing = n === 1 ? 0 : Math.min(46, 240 / (n - 1))
          const startX = 150 - ((n - 1) * spacing) / 2
          const cx = startX + i * spacing
          return (
            <g key={i}>
              {i > 0 && <line x1={cx - spacing + 16} y1={45} x2={cx - 16} y2={45} stroke="#B7950B" strokeWidth={2} />}
              <Hexagon cx={cx} cy={45} r={16} />
            </g>
          )
        })}
      </svg>

      <p className="text-center text-sm">
        <span className="font-semibold text-ink">{info.title}</span>
      </p>
      <p className="mt-1 min-h-[2.5rem] text-center text-sm text-muted">{info.note}</p>
    </div>
  )
}
