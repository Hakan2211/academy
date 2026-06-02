import { useState } from 'react'
import { cn } from '#/lib/cn'

// A karyotype is the full set of chromosomes, arranged in pairs. Humans normally
// have 23 pairs (46 total). A chromosome mutation can add or remove one — e.g.
// an extra chromosome 21 causes Down syndrome (trisomy 21).
function Chrom({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 16 40" className="h-8 w-3">
      <rect x={5} y={1} width={6} height={16} rx={3} fill={color} />
      <rect x={5} y={23} width={6} height={16} rx={3} fill={color} />
      <circle cx={8} cy={20} r={3.5} fill="#1f2937" />
    </svg>
  )
}

const PAIRS = ['1', '2', '3', '4', '5', '6', '7', '21', 'XY']

export function Karyotype() {
  const [trisomy, setTrisomy] = useState(false)
  const total = trisomy ? 47 : 46

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex gap-2">
        {[false, true].map((t) => (
          <button
            key={String(t)}
            type="button"
            onClick={() => setTrisomy(t)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              trisomy === t ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {t ? 'Trisomy 21 (47)' : 'Normal (46)'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {PAIRS.map((label) => {
          const isExtra = trisomy && label === '21'
          const isSex = label === 'XY'
          return (
            <div
              key={label}
              className={cn(
                'flex flex-col items-center rounded-lg border bg-surface-2 p-2',
                isExtra ? 'border-warn' : 'border-border',
              )}
            >
              <div className="flex items-end gap-0.5">
                <Chrom color={isSex ? '#A29BFE' : '#4F8CFF'} />
                <Chrom color={isSex ? '#FD79A8' : '#4F8CFF'} />
                {isExtra && <Chrom color="#E74C3C" />}
              </div>
              <span className="mt-1 text-xs text-muted">{label}</span>
            </div>
          )
        })}
      </div>

      <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        {trisomy
          ? `An extra copy of chromosome 21 → ${total} chromosomes. This trisomy causes Down syndrome, and arises when chromosomes fail to separate properly in meiosis (non-disjunction).`
          : `A normal human karyotype: 23 pairs = ${total} chromosomes, including the sex chromosomes (XX female or XY male).`}
      </p>
    </div>
  )
}
