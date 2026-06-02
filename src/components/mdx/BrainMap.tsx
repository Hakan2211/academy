import { useState } from 'react'
import { cn } from '#/lib/cn'

// The major regions of the brain and what each controls. Click a region.
type Region = 'cerebrum' | 'cerebellum' | 'medulla' | 'hypothalamus'

const INFO: Record<Region, { label: string; fn: string }> = {
  cerebrum: { label: 'Cerebrum', fn: 'The large wrinkled top — the seat of thinking, memory, language, the senses, and conscious movement. Intelligence lives here.' },
  cerebellum: { label: 'Cerebellum', fn: 'At the back, below the cerebrum. Coordinates muscles for balance and smooth, precise movement.' },
  medulla: { label: 'Medulla (brain stem)', fn: 'Controls the automatic processes you never think about — heart rate, breathing, and blood pressure.' },
  hypothalamus: { label: 'Hypothalamus', fn: 'A small but vital region that runs homeostasis — body temperature and water balance — and links the brain to the hormone system.' },
}

export function BrainMap() {
  const [sel, setSel] = useState<Region>('cerebrum')
  const fill = (r: Region, base: string) => (sel === r ? '#FACC15' : base)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 300 190" className="mx-auto block h-[180px]">
        {/* cerebrum */}
        <g onClick={() => setSel('cerebrum')} className="cursor-pointer">
          <path d="M 40 110 Q 30 50 90 38 Q 150 20 210 44 Q 250 60 246 100 Q 200 96 160 104 Q 100 96 40 110 Z" fill={fill('cerebrum', '#0984E3')} opacity={0.92} />
        </g>
        {/* cerebellum */}
        <g onClick={() => setSel('cerebellum')} className="cursor-pointer">
          <circle cx={232} cy={120} r={28} fill={fill('cerebellum', '#74B9FF')} />
          {[-14, -6, 2, 10].map((dx) => (
            <line key={dx} x1={232 + dx} y1={98} x2={232 + dx} y2={142} stroke="#0e1c2e" strokeWidth={0.8} opacity={0.5} />
          ))}
        </g>
        {/* medulla / brain stem */}
        <g onClick={() => setSel('medulla')} className="cursor-pointer">
          <path d="M 180 112 Q 196 150 184 178 L 168 178 Q 168 140 160 116 Z" fill={fill('medulla', '#A29BFE')} />
        </g>
        {/* hypothalamus */}
        <g onClick={() => setSel('hypothalamus')} className="cursor-pointer">
          <circle cx={150} cy={104} r={12} fill={fill('hypothalamus', '#FD79A8')} />
        </g>
      </svg>

      <div className="mt-1 flex flex-wrap gap-1.5">
        {(Object.keys(INFO) as Array<Region>).map((r) => (
          <button key={r} type="button" onClick={() => setSel(r)} className={cn('rounded-full border px-2.5 py-0.5 text-xs transition-colors', sel === r ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
            {INFO[r].label}
          </button>
        ))}
      </div>
      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold text-ink">{INFO[sel].label}: </span>{INFO[sel].fn}
      </p>
    </div>
  )
}
