import { useState } from 'react'
import { cn } from '#/lib/cn'

// Side-by-side: the two great cell designs. Pick a feature to compare and see
// how a prokaryote (no nucleus) differs from a eukaryote (nucleus + organelles).
type Feature = 'nucleus' | 'dna' | 'size' | 'organelles' | 'examples'

const FEATURES: Record<Feature, { label: string; pro: string; euk: string }> = {
  nucleus: { label: 'Nucleus', pro: 'None — DNA floats free in the cytoplasm.', euk: 'A true nucleus wraps the DNA in its own membrane.' },
  dna: { label: 'DNA shape', pro: 'A single circular loop of DNA.', euk: 'Several long, linear chromosomes.' },
  size: { label: 'Size', pro: 'Tiny — about 1–5 µm across.', euk: 'Large — about 10–100 µm, up to 10× wider.' },
  organelles: { label: 'Organelles', pro: 'No membrane-bound organelles.', euk: 'Many: mitochondria, ER, Golgi, (chloroplasts).' },
  examples: { label: 'Examples', pro: 'Bacteria and archaea.', euk: 'Animals, plants, fungi, protists.' },
}

export function ProkaryoteEukaryote() {
  const [feat, setFeat] = useState<Feature>('nucleus')
  const f = FEATURES[feat]
  const litNuc = feat === 'nucleus' || feat === 'dna'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 380 200" className="w-full">
        {/* prokaryote */}
        <text x={70} y={18} textAnchor="middle" className="fill-muted text-[11px] font-semibold">
          Prokaryote
        </text>
        <ellipse cx={70} cy={110} rx={48} ry={34} fill="#10243a" stroke="#4FD1C5" strokeWidth={2} />
        <rect x={56} y={92} width={28} height={20} rx={6} fill="none" stroke={litNuc ? '#FACC15' : '#4F8CFF'} strokeWidth={2} />
        <path d="M 60 102 q 6 -6 12 0 q 6 6 12 0" fill="none" stroke={litNuc ? '#FACC15' : '#4F8CFF'} strokeWidth={1.6} />
        {[[52, 120], [88, 122], [70, 130], [60, 95]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={2.2} fill="#cfc4f5" />
        ))}
        <text x={70} y={162} textAnchor="middle" className="fill-muted text-[9px]">
          DNA loop, no nucleus
        </text>

        {/* eukaryote */}
        <text x={270} y={18} textAnchor="middle" className="fill-muted text-[11px] font-semibold">
          Eukaryote
        </text>
        <ellipse cx={270} cy={108} rx={92} ry={72} fill="#10243a" stroke="#4FD1C5" strokeWidth={2.5} />
        <circle cx={250} cy={95} r={28} fill="#5b3fb0" stroke={litNuc ? '#FACC15' : '#A29BFE'} strokeWidth={feat === 'nucleus' || feat === 'dna' ? 4 : 2} />
        <circle cx={250} cy={95} r={9} fill="#3a2570" />
        {/* a couple of organelles */}
        <ellipse cx={310} cy={130} rx={18} ry={9} fill="#c0392b" stroke={feat === 'organelles' ? '#FACC15' : '#ff7a66'} strokeWidth={feat === 'organelles' ? 3 : 1.5} />
        <ellipse cx={300} cy={70} rx={16} ry={8} fill="#c0392b" stroke={feat === 'organelles' ? '#FACC15' : '#ff7a66'} strokeWidth={feat === 'organelles' ? 3 : 1.5} />
        <text x={270} y={192} textAnchor="middle" className="fill-muted text-[9px]">
          nucleus + organelles
        </text>
      </svg>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {(Object.keys(FEATURES) as Array<Feature>).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFeat(k)}
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
              feat === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {FEATURES[k].label}
          </button>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <p className="text-xs font-semibold text-accent-2">Prokaryote</p>
          <p className="text-muted">{f.pro}</p>
        </div>
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <p className="text-xs font-semibold text-accent-2">Eukaryote</p>
          <p className="text-muted">{f.euk}</p>
        </div>
      </div>
    </div>
  )
}
