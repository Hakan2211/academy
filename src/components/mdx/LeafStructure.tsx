import { useState } from 'react'
import { cn } from '#/lib/cn'

// A leaf in cross-section — a solar panel built from cells. Click each layer to
// see how it's adapted for photosynthesis and gas exchange.
type Layer = { id: string; label: string; fn: string }

const LAYERS: Array<Layer> = [
  { id: 'cuticle', label: 'Waxy cuticle', fn: 'A waterproof wax layer on top that stops the leaf drying out while letting light through.' },
  { id: 'upper', label: 'Upper epidermis', fn: 'A thin, transparent layer of cells that lets sunlight pass straight through to the photosynthesising cells below.' },
  { id: 'palisade', label: 'Palisade mesophyll', fn: 'Tall cells packed with chloroplasts, near the top to catch the most light — this is where most photosynthesis happens.' },
  { id: 'spongy', label: 'Spongy mesophyll', fn: 'Loosely packed cells with big air spaces, so carbon dioxide can diffuse to all the cells and oxygen can diffuse out.' },
  { id: 'stomata', label: 'Stomata & guard cells', fn: 'Tiny pores (mostly on the underside) that let CO₂ in and O₂/water vapour out. Guard cells open and close them.' },
  { id: 'vein', label: 'Vein (xylem & phloem)', fn: 'The plumbing: xylem brings water up to the leaf, phloem carries the sugar made here away to the rest of the plant.' },
]

export function LeafStructure() {
  const [sel, setSel] = useState('palisade')
  const layer = LAYERS.find((l) => l.id === sel)!
  const on = (id: string) => sel === id
  const ring = (id: string) => (on(id) ? '#FACC15' : '#0e1c2e')

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 196" className="w-full">
        {/* cuticle */}
        <g onClick={() => setSel('cuticle')} className="cursor-pointer">
          <rect x={10} y={14} width={300} height={8} fill="#FDE68A" stroke={ring('cuticle')} strokeWidth={on('cuticle') ? 2.5 : 1} />
        </g>
        {/* upper epidermis */}
        <g onClick={() => setSel('upper')} className="cursor-pointer">
          <rect x={10} y={22} width={300} height={20} fill="#d9f0e0" stroke={ring('upper')} strokeWidth={on('upper') ? 2.5 : 0.5} />
        </g>
        {/* palisade */}
        <g onClick={() => setSel('palisade')} className="cursor-pointer">
          <rect x={10} y={42} width={300} height={46} fill="#1f8b3a" stroke={ring('palisade')} strokeWidth={on('palisade') ? 3 : 0.5} />
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse key={i} cx={22 + i * 25} cy={65} rx={4} ry={14} fill="#0e5021" />
          ))}
        </g>
        {/* spongy */}
        <g onClick={() => setSel('spongy')} className="cursor-pointer">
          <rect x={10} y={88} width={300} height={56} fill="#2e9b4a" stroke={ring('spongy')} strokeWidth={on('spongy') ? 3 : 0.5} />
          {Array.from({ length: 18 }).map((_, i) => (
            <circle key={i} cx={26 + (i % 9) * 33} cy={104 + Math.floor(i / 9) * 26} r={9} fill="#1f8b3a" />
          ))}
        </g>
        {/* lower epidermis + stomata */}
        <g onClick={() => setSel('stomata')} className="cursor-pointer">
          <rect x={10} y={144} width={300} height={18} fill="#d9f0e0" stroke={ring('stomata')} strokeWidth={on('stomata') ? 2.5 : 0.5} />
          {[90, 230].map((x) => (
            <g key={x}>
              <path d={`M ${x - 9} 162 q 9 10 18 0`} fill="none" stroke="#2e9b4a" strokeWidth={3} />
              <path d={`M ${x - 9} 162 q 9 -2 18 0`} fill="none" stroke="#2e9b4a" strokeWidth={3} />
            </g>
          ))}
        </g>
        {/* vein */}
        <g onClick={() => setSel('vein')} className="cursor-pointer">
          <circle cx={160} cy={112} r={16} fill="#7b3f00" stroke={ring('vein')} strokeWidth={on('vein') ? 3 : 1} />
          <circle cx={156} cy={110} r={4} fill="#4F8CFF" />
          <circle cx={164} cy={114} r={4} fill="#FDCB6E" />
        </g>
        {/* sunlight */}
        <text x={30} y={12} className="text-[12px]">☀️</text>
      </svg>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {LAYERS.map((l) => (
          <button key={l.id} type="button" onClick={() => setSel(l.id)} className={cn('rounded-full border px-2.5 py-0.5 text-xs transition-colors', on(l.id) ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
            {l.label}
          </button>
        ))}
      </div>
      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold text-ink">{layer.label}: </span>{layer.fn}
      </p>
    </div>
  )
}
