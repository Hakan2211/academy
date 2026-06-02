import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A MAP OF ALL PROBLEMS, drawn as nested zones. The biggest split is DECIDABLE
// (an algorithm exists) vs UNDECIDABLE (none can, ever). Inside decidable, we
// split TRACTABLE (efficient, P) from INTRACTABLE (only exponential algorithms
// known). Each zone holds example problems. Click a zone to learn what it
// means — the big picture of what computers can, can barely, and can never do.

type Zone = 'tractable' | 'intractable' | 'undecidable'

const INFO: Record<Zone, { name: string; tone: string; color: string; blurb: string; examples: Array<string> }> = {
  tractable: {
    name: 'Tractable (efficient)',
    tone: 'Computers do this easily',
    color: '#2ECC71',
    blurb: 'An efficient (polynomial-time) algorithm exists. These problems stay fast even on huge inputs — the comfortable home of everyday computing.',
    examples: ['Add two numbers', 'Sort a million records', 'Find a shortest route', 'Search a sorted list'],
  },
  intractable: {
    name: 'Intractable (decidable, but slow)',
    tone: 'Solvable in principle, hopeless at scale',
    color: '#f4a261',
    blurb: 'An algorithm exists and always gives the right answer — but the only known ones take exponential time. For large inputs they would outlast the universe.',
    examples: ['Best move in n×n chess', 'Travelling salesman (exact)', 'Optimal circuit layout', 'Cracking strong encryption by brute force'],
  },
  undecidable: {
    name: 'Undecidable',
    tone: 'No algorithm can EVER solve it',
    color: '#e76f51',
    blurb: 'Provably beyond all computers — not a hardware limit but a logical one, true forever. No algorithm, however fast, can decide these for every input.',
    examples: ['Does this program halt?', 'Are two programs equivalent?', 'Will this code ever crash?', 'Is this statement provable?'],
  },
}

export function DecidabilityMap() {
  const [sel, setSel] = useState<Zone>('undecidable')
  const info = INFO[sel]

  function ZoneBtn({ z, height }: { z: Zone; height: string }) {
    const i = INFO[z]
    const active = sel === z
    return (
      <button
        type="button"
        onClick={() => setSel(z)}
        className={cn(
          'flex w-full flex-col items-start justify-center rounded-xl border-2 px-3 text-left transition-all',
          height,
          active ? 'bg-surface-2' : 'bg-surface hover:bg-surface-2',
        )}
        style={{ borderColor: i.color, opacity: active ? 1 : 0.85 }}
      >
        <span className="text-sm font-bold" style={{ color: i.color }}>{i.name}</span>
        <span className="text-[11px] text-muted">{i.tone}</span>
      </button>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
        {/* the layered landscape: decidable (two bands) above, undecidable below */}
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wide text-success">
            <Icon name="Check" size={12} /> Decidable
          </div>
          <div className="space-y-2 rounded-xl border border-dashed border-success/40 p-2">
            <ZoneBtn z="tractable" height="h-16" />
            <ZoneBtn z="intractable" height="h-16" />
          </div>
          <div className="mb-1 mt-3 flex items-center gap-1.5 text-xs uppercase tracking-wide text-warn">
            <Icon name="Ban" size={12} /> Undecidable
          </div>
          <ZoneBtn z="undecidable" height="h-16" />
        </div>

        <div className="rounded-xl border border-border bg-surface-2 p-3">
          <div className="font-semibold" style={{ color: info.color }}>{info.name}</div>
          <p className="mt-1 text-sm text-muted">{info.blurb}</p>
          <div className="mt-2 text-xs uppercase tracking-wide text-muted">Examples</div>
          <ul className="mt-1 space-y-1 text-sm">
            {info.examples.map((ex) => (
              <li key={ex} className="flex items-start gap-1.5 text-ink">
                <span style={{ color: info.color }}>•</span>
                <span>{ex}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Inward from the edge: most problems can <span className="text-success">never</span> be solved, of the rest most are <span className="text-warn">too slow</span> to solve, and a precious few are <span className="text-success">genuinely easy</span>. Computing lives in that thin, bright band.
      </p>
    </div>
  )
}
