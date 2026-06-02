import { useState } from 'react'
import { cn } from '#/lib/cn'

// Lipids are fats and oils, built from fatty acids. A triglyceride is glycerol
// + 3 fatty-acid tails. A phospholipid swaps one tail for a phosphate head,
// giving it a water-loving end and water-hating tails — the basis of membranes.
type Kind = 'fatty' | 'triglyceride' | 'phospholipid'

function Tail({ x, y, kinked }: { x: number; y: number; kinked?: boolean }) {
  const d = kinked
    ? `M ${x} ${y} l 10 8 l 10 -4 l 10 10 l 10 -2`
    : `M ${x} ${y} l 12 6 l 12 6 l 12 6`
  return <path d={d} fill="none" stroke="#E67E22" strokeWidth={3} strokeLinecap="round" />
}

export function LipidViewer() {
  const [kind, setKind] = useState<Kind>('triglyceride')
  const [unsat, setUnsat] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {([['fatty', 'Fatty acid'], ['triglyceride', 'Triglyceride (fat)'], ['phospholipid', 'Phospholipid']] as Array<[Kind, string]>).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={cn('rounded-full border px-3 py-1 text-sm transition-colors', kind === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
          >
            {label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 300 120" className="w-full">
        {kind === 'fatty' && (
          <>
            <circle cx={50} cy={60} r={13} fill="#E74C3C" />
            <text x={50} y={64} textAnchor="middle" className="fill-white text-[8px] font-bold">COOH</text>
            <Tail x={62} y={60} kinked={unsat} />
            <text x={150} y={100} textAnchor="middle" className="fill-muted text-[10px]">acid head + hydrocarbon tail</text>
          </>
        )}
        {kind === 'triglyceride' && (
          <>
            <rect x={36} y={30} width={16} height={60} rx={4} fill="#9B59B6" />
            <text x={44} y={104} textAnchor="middle" className="fill-muted text-[8px]">glycerol</text>
            {[24, 52, 80].map((y, i) => <Tail key={i} x={54} y={y} kinked={unsat && i === 1} />)}
            <text x={200} y={104} textAnchor="middle" className="fill-muted text-[10px]">glycerol + 3 fatty-acid tails</text>
          </>
        )}
        {kind === 'phospholipid' && (
          <>
            {/* a small bilayer */}
            {[80, 140, 200].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy={26} r={8} fill="#5DADE2" />
                <Tail x={cx - 6} y={34} />
              </g>
            ))}
            {[80, 140, 200].map((cx) => (
              <g key={`b${cx}`}>
                <circle cx={cx} cy={94} r={8} fill="#5DADE2" />
                <path d={`M ${cx - 6} 86 l 12 -6 l 12 -6 l 12 -6`} fill="none" stroke="#E67E22" strokeWidth={3} strokeLinecap="round" transform={`scale(1,-1) translate(0,-${94 * 2 - 8})`} />
              </g>
            ))}
            <text x={150} y={116} textAnchor="middle" className="fill-muted text-[10px]">phosphate heads out, tails in — a membrane bilayer</text>
          </>
        )}
      </svg>

      <p className="mt-1 min-h-[2.5rem] text-center text-sm text-muted">
        {kind === 'fatty'
          ? 'A fatty acid: a –COOH head on a long hydrocarbon tail. Saturated tails are straight; unsaturated ones kink at each C=C.'
          : kind === 'triglyceride'
            ? 'A triglyceride (fat/oil): glycerol bonded to three fatty-acid tails — the body’s long-term energy store.'
            : 'A phospholipid has a water-loving phosphate head and water-hating tails, so it self-assembles into the bilayer of every cell membrane.'}
      </p>

      {(kind === 'fatty' || kind === 'triglyceride') && (
        <button
          type="button"
          onClick={() => setUnsat((u) => !u)}
          className={cn('mt-1 w-full rounded-lg border py-2 text-sm font-semibold transition-colors', unsat ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
        >
          {unsat ? 'Unsaturated (kinked, liquid oil)' : 'Saturated (straight, solid fat)'}
        </button>
      )}
    </div>
  )
}
