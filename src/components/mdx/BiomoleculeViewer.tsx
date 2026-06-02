import { useState } from 'react'
import { cn } from '#/lib/cn'

// The four families of life's large molecules. Pick a family to see its building
// block (monomer), the chain it forms (polymer), the elements it's made of, and
// what it does. Reused across the carbohydrate / lipid / protein / nucleic-acid
// lessons (pass `focus` to open on one).
type Mode = 'carbohydrate' | 'lipid' | 'protein' | 'nucleic'

const DATA: Record<Mode, { label: string; monomer: string; polymer: string; elements: string; examples: string; fn: string; color: string }> = {
  carbohydrate: { label: 'Carbohydrate', monomer: 'monosaccharide (e.g. glucose)', polymer: 'polysaccharide (e.g. starch)', elements: 'C, H, O', examples: 'glucose, starch, glycogen, cellulose', fn: 'Quick energy and energy storage; cellulose builds plant cell walls.', color: '#FDCB6E' },
  lipid: { label: 'Lipid', monomer: 'glycerol + 3 fatty acids', polymer: 'triglyceride / phospholipid', elements: 'C, H, O (little O)', examples: 'fats, oils, phospholipids, steroids', fn: 'Long-term energy store, insulation, and the phospholipids that build every membrane.', color: '#FF7A66' },
  protein: { label: 'Protein', monomer: 'amino acid', polymer: 'polypeptide (folded chain)', elements: 'C, H, O, N (+S)', examples: 'enzymes, antibodies, keratin, haemoglobin', fn: 'The workhorses: enzymes, structure, transport, defence — built from 20 amino acids.', color: '#A29BFE' },
  nucleic: { label: 'Nucleic acid', monomer: 'nucleotide', polymer: 'DNA / RNA strand', elements: 'C, H, O, N, P', examples: 'DNA, RNA', fn: 'Store and carry the genetic instructions for building every protein.', color: '#4FD1C5' },
}

function Diagram({ mode }: { mode: Mode }) {
  const c = DATA[mode].color
  if (mode === 'carbohydrate') {
    const hex = (cx: number, cy: number, r: number) =>
      [0, 1, 2, 3, 4, 5].map((i) => `${cx + r * Math.cos((Math.PI / 3) * i - Math.PI / 6)},${cy + r * Math.sin((Math.PI / 3) * i - Math.PI / 6)}`).join(' ')
    return (
      <>
        <polygon points={hex(70, 60, 26)} fill={`${c}33`} stroke={c} strokeWidth={2} />
        <text x={70} y={64} textAnchor="middle" className="fill-ink text-[9px]">glucose</text>
        {[150, 210, 270, 330].map((x, i) => (
          <g key={i}>
            <polygon points={hex(x, 60, 18)} fill={`${c}33`} stroke={c} strokeWidth={1.6} />
            {i < 3 && <line x1={x + 16} y1={60} x2={x + 26} y2={60} stroke={c} strokeWidth={2} />}
          </g>
        ))}
        <text x={240} y={104} textAnchor="middle" className="fill-muted text-[9px]">…chain of sugars = starch</text>
      </>
    )
  }
  if (mode === 'lipid') {
    return (
      <>
        <rect x={40} y={40} width={14} height={42} rx={3} fill={`${c}55`} stroke={c} strokeWidth={1.6} />
        <text x={47} y={98} textAnchor="middle" className="fill-muted text-[8px]">glycerol</text>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M 54 ${48 + i * 14} q 30 -8 60 0 q 30 8 60 0`} fill="none" stroke={c} strokeWidth={2.4} />
        ))}
        <text x={150} y={100} textAnchor="middle" className="fill-muted text-[9px]">3 fatty-acid tails = a triglyceride</text>
      </>
    )
  }
  if (mode === 'protein') {
    const pts = [[60, 70], [90, 45], [125, 60], [150, 38], [185, 55], [215, 80], [250, 60], [285, 78]]
    return (
      <>
        <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={c} strokeWidth={2} />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={7} fill={`${c}cc`} stroke={c} strokeWidth={1.5} />
        ))}
        <text x={175} y={104} textAnchor="middle" className="fill-muted text-[9px]">amino acids linked into a chain, then folded</text>
      </>
    )
  }
  // nucleic
  return (
    <>
      {[90, 150, 210, 270].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={40} r={9} fill="#4F8CFF" />
          <polygon points={`${x - 9},52 ${x + 9},52 ${x + 11},68 ${x},78 ${x - 11},68`} fill="#FDCB6E" />
          <rect x={x - 8} y={82} width={16} height={12} rx={3} fill={c} />
          {i < 3 && <line x1={x + 9} y1={40} x2={x + 51} y2={40} stroke="#4F8CFF" strokeWidth={2} />}
        </g>
      ))}
      <text x={180} y={108} textAnchor="middle" className="fill-muted text-[8px]">phosphate + sugar + base = a nucleotide</text>
    </>
  )
}

export function BiomoleculeViewer({ focus = 'carbohydrate' }: { focus?: Mode }) {
  const [mode, setMode] = useState<Mode>(focus)
  const d = DATA[mode]
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(Object.keys(DATA) as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs transition-colors',
              mode === m ? 'text-white' : 'border-border text-muted hover:text-ink',
            )}
            style={{ borderColor: DATA[m].color, background: mode === m ? DATA[m].color : undefined }}
          >
            {DATA[m].label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 118" className="w-full">
        <Diagram mode={mode} />
      </svg>

      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <p className="text-xs text-muted">Building block</p>
          <p className="text-ink">{d.monomer}</p>
        </div>
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <p className="text-xs text-muted">Elements</p>
          <p className="font-mono text-ink">{d.elements}</p>
        </div>
      </div>
      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold" style={{ color: d.color }}>{d.label}: </span>
        {d.fn} <span className="text-xs">(e.g. {d.examples})</span>
      </p>
    </div>
  )
}
