import { useState } from 'react'
import { cn } from '#/lib/cn'

// Hydrocarbons are chains of carbon atoms clothed in hydrogen. Alkanes have
// only single bonds (saturated); alkenes have a C=C double bond and alkynes a
// C≡C triple bond (unsaturated). Pick the family and chain length.
type Family = 'alkane' | 'alkene' | 'alkyne'
const STEM = ['', 'meth', 'eth', 'prop', 'but', 'pent']
const SUB = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '₁₀', '₁₁', '₁₂']

function formula(n: number, fam: Family): string {
  const h = fam === 'alkane' ? 2 * n + 2 : fam === 'alkene' ? 2 * n : 2 * n - 2
  return `C${n > 1 ? SUB[n] : ''}H${SUB[h] ?? h}`
}
function name(n: number, fam: Family): string {
  return STEM[n] + (fam === 'alkane' ? 'ane' : fam === 'alkene' ? 'ene' : 'yne')
}

export function HydrocarbonViewer() {
  const [fam, setFam] = useState<Family>('alkane')
  const [n, setN] = useState(3)
  const minN = fam === 'alkane' ? 1 : 2
  const cn_ = Math.max(minN, n)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(['alkane', 'alkene', 'alkyne'] as Array<Family>).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => {
              setFam(f)
              if (f !== 'alkane' && n < 2) setN(2)
            }}
            className={cn('rounded-full border px-3 py-1 text-sm capitalize transition-colors', fam === f ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
          >
            {f}s
          </button>
        ))}
      </div>

      <svg viewBox="0 0 300 110" className="w-full">
        {Array.from({ length: cn_ }).map((_, i) => {
          const xi = cn_ === 1 ? 150 : 40 + (i * 220) / (cn_ - 1)
          // bond to next carbon
          const order = i === 0 && cn_ > 1 ? (fam === 'alkene' ? 2 : fam === 'alkyne' ? 3 : 1) : 1
          const nextX = cn_ === 1 ? 0 : 40 + ((i + 1) * 220) / (cn_ - 1)
          return (
            <g key={i}>
              {i < cn_ - 1 &&
                (order === 1 ? [0] : order === 2 ? [-4, 4] : [-6, 0, 6]).map((off, j) => (
                  <line key={j} x1={xi + 14} y1={55 + off} x2={nextX - 14} y2={55 + off} stroke="var(--color-ink)" strokeWidth={2} />
                ))}
              <circle cx={xi} cy={55} r={14} fill="#34404F" />
              <text x={xi} y={59} textAnchor="middle" className="fill-white text-[10px] font-bold">C</text>
            </g>
          )
        })}
      </svg>

      <p className="text-center text-sm">
        <span className="font-semibold text-ink capitalize">{name(cn_, fam)}</span>{' '}
        <span className="font-mono text-muted">({formula(cn_, fam)})</span>
      </p>
      <p className="mt-1 text-center text-sm text-muted">
        {fam === 'alkane'
          ? 'Saturated: only single C–C bonds, holding the maximum hydrogen (CₙH₂ₙ₊₂).'
          : fam === 'alkene'
            ? 'Unsaturated: one C=C double bond (CₙH₂ₙ) — more reactive than alkanes.'
            : 'Unsaturated: one C≡C triple bond (CₙH₂ₙ₋₂) — even more reactive.'}
      </p>

      <label className="mt-2 flex flex-col gap-1 text-sm">
        <span className="flex items-center justify-between text-muted">
          <span>Carbon chain length</span>
          <span className="font-mono text-ink">{cn_} C</span>
        </span>
        <input type="range" min={minN} max={5} step={1} value={cn_} onChange={(e) => setN(Number(e.target.value))} className="accent-accent" />
      </label>
    </div>
  )
}
