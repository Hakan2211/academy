import { useState } from 'react'
import { cn } from '#/lib/cn'

// One family tree for all life. Branches split from a shared ancestor (LUCA) on
// the left into the three domains; click any group to read about it and trace
// its branch back to the root. Reused for diversity, phylogeny, and evolution.
type Taxon = {
  id: string
  label: string
  emoji: string
  x: number
  y: number
  color: string
  rank: string
  desc: string
  // index path of branch segments to highlight when selected
  path: Array<number>
}

// Branch segments (x1,y1,x2,y2). Indexes referenced by each taxon's `path`.
const SEGMENTS: Array<[number, number, number, number]> = [
  [30, 140, 120, 175], // 0: root → M (Archaea+Eukarya ancestor)
  [30, 140, 320, 32], //  1: root → Bacteria
  [120, 175, 320, 78], // 2: M → Archaea
  [120, 175, 190, 182], // 3: M → Eukarya ancestor E
  [190, 182, 320, 120], // 4: E → Protists
  [190, 182, 320, 160], // 5: E → Plants
  [190, 182, 320, 200], // 6: E → Fungi
  [190, 182, 320, 244], // 7: E → Animals
]

const TAXA: Array<Taxon> = [
  { id: 'bacteria', label: 'Bacteria', emoji: '🧫', x: 320, y: 32, color: '#4F8CFF', rank: 'Domain Bacteria', desc: 'Single-celled, no nucleus. The most abundant organisms on Earth — in soil, water, and inside you.', path: [1] },
  { id: 'archaea', label: 'Archaea', emoji: '🌋', x: 320, y: 78, color: '#A29BFE', rank: 'Domain Archaea', desc: 'Also single cells without a nucleus, but biochemically distinct. Many thrive in extreme heat, salt, or acid.', path: [0, 2] },
  { id: 'protists', label: 'Protists', emoji: '🦠', x: 320, y: 120, color: '#00CEC9', rank: 'Domain Eukarya · Protista', desc: 'A grab-bag of mostly single-celled eukaryotes — amoebas, algae, and plankton.', path: [0, 3, 4] },
  { id: 'plants', label: 'Plants', emoji: '🌿', x: 320, y: 160, color: '#2ECC71', rank: 'Domain Eukarya · Plantae', desc: 'Multicellular eukaryotes that make their own food from light by photosynthesis.', path: [0, 3, 5] },
  { id: 'fungi', label: 'Fungi', emoji: '🍄', x: 320, y: 200, color: '#E17055', rank: 'Domain Eukarya · Fungi', desc: 'Eukaryotes that absorb their food — moulds, yeasts, and mushrooms. Nature’s recyclers.', path: [0, 3, 6] },
  { id: 'animals', label: 'Animals', emoji: '🐝', x: 320, y: 244, color: '#FD79A8', rank: 'Domain Eukarya · Animalia', desc: 'Multicellular eukaryotes that eat other organisms and usually move to find food.', path: [0, 3, 7] },
]

export function TreeOfLife() {
  const [sel, setSel] = useState('animals')
  const taxon = TAXA.find((t) => t.id === sel)!
  const lit = new Set(taxon.path)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 380 280" className="w-full">
        {/* branches */}
        {SEGMENTS.map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={lit.has(i) ? taxon.color : 'var(--color-border)'}
            strokeWidth={lit.has(i) ? 3 : 2}
            strokeLinecap="round"
          />
        ))}

        {/* LUCA root */}
        <circle cx={30} cy={140} r={6} fill="var(--color-muted)" />
        <text x={30} y={162} textAnchor="middle" className="fill-muted text-[9px]">
          LUCA
        </text>

        {/* clickable taxa */}
        {TAXA.map((t) => {
          const active = t.id === sel
          return (
            <g
              key={t.id}
              onClick={() => setSel(t.id)}
              className="cursor-pointer"
            >
              <circle
                cx={t.x}
                cy={t.y}
                r={15}
                fill={active ? t.color : 'var(--color-surface-2)'}
                stroke={t.color}
                strokeWidth={2}
              />
              <text x={t.x} y={t.y + 5} textAnchor="middle" className="text-[14px]">
                {t.emoji}
              </text>
              <text
                x={t.x + 22}
                y={t.y + 4}
                className={cn('text-[12px]', active ? 'fill-ink font-semibold' : 'fill-muted')}
              >
                {t.label}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-2 rounded-lg bg-surface-2 px-3 py-2">
        <p className="text-sm font-semibold" style={{ color: taxon.color }}>
          {taxon.label} <span className="text-xs font-normal text-muted">· {taxon.rank}</span>
        </p>
        <p className="mt-0.5 text-sm text-muted">{taxon.desc}</p>
      </div>
    </div>
  )
}
