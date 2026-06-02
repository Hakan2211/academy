import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Does therapy work? The landmark finding from meta-analyses (Smith & Glass and
// the many studies since): the AVERAGE treated person ends up better off than
// most untreated people. Three conditions compared — no treatment, a placebo /
// general support, and bona-fide therapy — on the share who meaningfully
// improve. Toggle to the common-factors view: the gaps BETWEEN brand-name
// therapies are small ("the dodo-bird verdict"), because much of what heals is
// shared — a strong alliance, hope, and a believable rationale.
type View = 'conditions' | 'commonFactors'

type Bar = { label: string; value: number; color: string; note: string }

const CONDITIONS: Array<Bar> = [
  { label: 'No treatment', value: 38, color: '#95A5A6', note: 'Some people improve on their own over time (spontaneous remission).' },
  { label: 'Placebo / support', value: 52, color: '#E67E22', note: 'Attention, hope and a caring listener help — beyond doing nothing.' },
  { label: 'Bona-fide therapy', value: 75, color: '#16A085', note: 'The average treated person ends up better off than ~80% of the untreated.' },
]

// Bona-fide, well-delivered therapies cluster closely — the dodo-bird verdict.
const FACTORS: Array<Bar> = [
  { label: 'CBT', value: 74, color: '#3498DB', note: '' },
  { label: 'Psychodynamic', value: 71, color: '#A29BFE', note: '' },
  { label: 'Person-centred', value: 70, color: '#FDCB6E', note: '' },
  { label: 'Interpersonal', value: 73, color: '#27AE60', note: '' },
]

export function TherapyEffectiveness() {
  const [view, setView] = useState<View>('conditions')
  const bars = view === 'conditions' ? CONDITIONS : FACTORS

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        {(['conditions', 'commonFactors'] as Array<View>).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              view === v ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {v === 'conditions' ? 'Does it work?' : 'Which therapy?'}
          </button>
        ))}
      </div>

      <p className="mb-2 px-1 text-xs text-muted">
        Share of people who meaningfully improve{view === 'commonFactors' ? ' across well-delivered therapies' : ''}:
      </p>

      <div className="space-y-2.5">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="mb-0.5 flex items-center justify-between text-xs">
              <span className="text-ink">{b.label}</span>
              <span className="font-mono text-muted">{b.value}%</span>
            </div>
            <div className="h-5 overflow-hidden rounded-full bg-surface-2 ring-1 ring-border">
              <div
                className="flex h-full items-center justify-end pr-2 text-[10px] font-medium text-white transition-all duration-500"
                style={{ width: `${b.value}%`, background: b.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {view === 'conditions' ? (
        <div className="mt-3 space-y-1.5">
          {CONDITIONS.map((b) => (
            <p key={b.label} className="flex items-start gap-2 px-1 text-xs leading-snug text-muted">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: b.color }} />
              <span><span className="font-semibold text-ink">{b.label}:</span> {b.note}</span>
            </p>
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-xl border border-accent-2/40 bg-accent-2/10 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <Icon name="Bird" size={14} /> The dodo-bird verdict
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            “Everyone has won, and all must have prizes.” The gaps between bona-fide therapies are small. Much of the healing comes
            from <span className="text-ink">common factors</span> they share — a strong <span className="text-ink">therapeutic alliance</span>,
            hope and expectancy, and a believable rationale — though for some specific problems (like phobias or OCD) certain methods
            still have a clear edge.
          </p>
        </div>
      )}
    </div>
  )
}
