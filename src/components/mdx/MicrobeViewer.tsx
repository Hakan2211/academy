import { useState } from 'react'
import { cn } from '#/lib/cn'

// A bacterium — a prokaryotic cell — labelled. Click each part. Bacteria have no
// nucleus; their DNA is a free loop, sometimes with extra small loops (plasmids).
type Part = { id: string; label: string; fn: string }

const PARTS: Array<Part> = [
  { id: 'wall', label: 'Cell wall', fn: 'A tough outer layer that gives the bacterium its shape and protects it. (It is the target of many antibiotics.)' },
  { id: 'membrane', label: 'Cell membrane', fn: 'Controls what enters and leaves the cell — just like in your own cells.' },
  { id: 'cytoplasm', label: 'Cytoplasm', fn: 'The jelly where the cell’s reactions happen and the ribosomes float.' },
  { id: 'dna', label: 'Circular DNA', fn: 'A single loop of DNA floating free in the cytoplasm — there is no nucleus to hold it.' },
  { id: 'plasmid', label: 'Plasmid', fn: 'A small extra ring of DNA. Bacteria swap plasmids with each other — which is how genes for antibiotic resistance spread.' },
  { id: 'flagellum', label: 'Flagellum', fn: 'A whip-like tail that spins to push the bacterium through liquid.' },
]

export function MicrobeViewer() {
  const [sel, setSel] = useState('dna')
  const p = PARTS.find((x) => x.id === sel)!
  const on = (id: string) => sel === id
  const ring = (id: string, base: string) => (on(id) ? '#FACC15' : base)
  const sw = (id: string, base: number) => (on(id) ? base + 1.5 : base)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 180" className="w-full">
        {/* cell wall + membrane (concentric capsules) */}
        <g onClick={() => setSel('wall')} className="cursor-pointer">
          <rect x={40} y={50} width={220} height={80} rx={40} fill="#1f6b3a" stroke={ring('wall', '#7CFC9A')} strokeWidth={sw('wall', 3)} />
        </g>
        <g onClick={() => setSel('membrane')} className="cursor-pointer">
          <rect x={48} y={58} width={204} height={64} rx={32} fill="#16361f" stroke={ring('membrane', '#2ECC71')} strokeWidth={sw('membrane', 2)} />
        </g>
        {/* cytoplasm click region + ribosomes */}
        <g onClick={() => setSel('cytoplasm')} className="cursor-pointer">
          <rect x={48} y={58} width={204} height={64} rx={32} fill="transparent" />
          {[[90, 75], [120, 100], [200, 72], [220, 105], [160, 110], [80, 100]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={2.5} fill="#cfc4f5" />
          ))}
        </g>
        {/* circular DNA */}
        <g onClick={() => setSel('dna')} className="cursor-pointer">
          <path d="M 130 70 q 40 -10 44 20 q 2 26 -40 22 q -34 -4 -28 -26 q 6 -18 24 -16 z" fill="none" stroke={ring('dna', '#4F8CFF')} strokeWidth={sw('dna', 2.5)} />
        </g>
        {/* plasmids */}
        <g onClick={() => setSel('plasmid')} className="cursor-pointer">
          {[[210, 95], [228, 78]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={7} fill="none" stroke={ring('plasmid', '#FD79A8')} strokeWidth={sw('plasmid', 2)} />
          ))}
        </g>
        {/* flagellum */}
        <g onClick={() => setSel('flagellum')} className="cursor-pointer">
          <path d="M 260 90 q 18 -10 30 0 q 12 10 26 0 q 12 -10 24 0" fill="none" stroke={ring('flagellum', '#A29BFE')} strokeWidth={sw('flagellum', 2.5)} strokeLinecap="round" />
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
        <span className="font-semibold text-ink">{p.label}: </span>{p.fn}
      </p>
    </div>
  )
}
