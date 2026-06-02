import { useState } from 'react'
import { cn } from '#/lib/cn'

// Four independent lines of evidence that all point to evolution. Switch tabs to
// see fossils, shared anatomy, embryos, and DNA tell the same story.
type Tab = 'fossils' | 'anatomy' | 'embryos' | 'dna'

export function EvidenceTabs() {
  const [tab, setTab] = useState<Tab>('fossils')

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {([['fossils', 'Fossils'], ['anatomy', 'Anatomy'], ['embryos', 'Embryos'], ['dna', 'DNA']] as Array<[Tab, string]>).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn('rounded-full border px-3 py-1 text-sm transition-colors', tab === id ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
          >
            {label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 150" className="w-full">
        {tab === 'fossils' && (
          <>
            {['#5a4631', '#6b5639', '#7d6543', '#8f744d'].map((c, i) => (
              <rect key={i} x={20} y={20 + i * 28} width={320} height={28} fill={c} />
            ))}
            {[[60, 132, '🦴'], [180, 104, '🐚'], [120, 76, '🐟'], [250, 48, '🦕']].map(([x, y, e], i) => (
              <text key={i} x={x as number} y={y as number} textAnchor="middle" className="text-[15px]">{e as string}</text>
            ))}
            <text x={350} y={30} textAnchor="end" className="fill-white text-[9px]">younger ↑</text>
            <text x={350} y={140} textAnchor="end" className="fill-white text-[9px]">older ↓</text>
          </>
        )}
        {tab === 'anatomy' && (
          <>
            {[['human arm', 30], ['bat wing', 140], ['whale flipper', 250]].map(([label, x], r) => (
              <g key={r} transform={`translate(${x as number} 20)`}>
                <rect x={28} y={0} width={14} height={34} rx={6} fill="#E74C3C" />
                <rect x={22} y={34} width={10} height={30} rx={5} fill="#FDCB6E" />
                <rect x={38} y={34} width={10} height={30} rx={5} fill="#FDCB6E" />
                {[0, 1, 2, 3].map((f) => (
                  <rect key={f} x={18 + f * 9} y={66} width={6} height={r === 0 ? 18 : r === 1 ? 40 : 14} rx={3} fill="#4FD1C5" />
                ))}
                <text x={35} y={132} textAnchor="middle" className="fill-muted text-[9px]">{label as string}</text>
              </g>
            ))}
          </>
        )}
        {tab === 'embryos' && (
          <>
            {['fish', 'chicken', 'human'].map((label, i) => (
              <g key={i} transform={`translate(${50 + i * 110} 60)`}>
                <path d="M -22 0 q 10 -26 30 0 q -6 16 0 30 q -20 14 -30 0 q 6 -16 0 -30 z" fill="#A29BFE" opacity={0.8} />
                <circle cx={-12} cy={-4} r={4} fill="#0e1c2e" />
                {/* gill arches — shared early feature */}
                {[0, 1, 2].map((g) => (
                  <path key={g} d={`M ${-4 + g * 5} -6 q 4 8 0 16`} fill="none" stroke="#0e1c2e" strokeWidth={1.2} />
                ))}
                <text x={0} y={56} textAnchor="middle" className="fill-muted text-[9px]">{label}</text>
              </g>
            ))}
          </>
        )}
        {tab === 'dna' && (
          <>
            {[['Chimpanzee', 98], ['Mouse', 85], ['Chicken', 65], ['Banana', 50]].map(([label, pct], i) => (
              <g key={i} transform={`translate(0 ${20 + i * 30})`}>
                <text x={88} y={12} textAnchor="end" className="fill-muted text-[10px]">{label as string}</text>
                <rect x={96} y={2} width={220} height={14} rx={7} fill="var(--color-surface-2)" />
                <rect x={96} y={2} width={(pct as number / 100) * 220} height={14} rx={7} fill="#2ECC71" />
                <text x={320} y={13} textAnchor="end" className="fill-ink text-[10px] font-mono">{pct as number}%</text>
              </g>
            ))}
          </>
        )}
      </svg>

      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        {tab === 'fossils' && 'Fossils in older, deeper rock layers are simpler and stranger; newer layers hold forms more like today. They record gradual change over millions of years.'}
        {tab === 'anatomy' && 'A human arm, a bat wing, and a whale flipper share the SAME bone pattern (one bone, then two, then digits) — inherited from a common ancestor and adapted to different uses.'}
        {tab === 'embryos' && 'Early embryos of fish, birds, and humans look strikingly alike — even sharing features like gill arches — revealing deep shared ancestry.'}
        {tab === 'dna' && 'The more recently two species shared an ancestor, the more DNA they share. We are 98% identical to chimps — and still share half our genes with a banana.'}
      </p>
    </div>
  )
}
