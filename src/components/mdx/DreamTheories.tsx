import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Three big answers to "why do we dream?", compared side by side. Pick a theory
// to see what it claims, where the dream comes from, and its weakness. None is
// proven; they capture different facets, and the science is still open.
type Theory = {
  key: string
  name: string
  icon: string
  color: string
  oneLine: string
  claim: string
  source: string
  weakness: string
}

const THEORIES: ReadonlyArray<Theory> = [
  {
    key: 'freud',
    name: 'Freudian wish-fulfilment',
    icon: 'Waves',
    color: '#A29BFE',
    oneLine: 'Dreams are disguised wishes from the unconscious.',
    claim:
      'Freud argued every dream expresses a hidden, often forbidden wish. The remembered story (the manifest content) is a disguise for the real meaning (the latent content) the mind censors so we can keep sleeping.',
    source: 'The unconscious mind — repressed desires and conflicts bubbling up in symbolic form.',
    weakness:
      'Unfalsifiable: almost any dream can be "interpreted" to fit, and any interpretation to fit the dreamer. Modern science finds little evidence for hidden symbolic meaning.',
  },
  {
    key: 'activation-synthesis',
    name: 'Activation-synthesis',
    icon: 'Zap',
    color: '#E056FD',
    oneLine: 'Dreams are the brain making sense of random signals.',
    claim:
      'Hobson and McCarley proposed that during REM the brainstem fires more or less at random. The higher brain, trying to impose order, weaves these signals into a story — so the dream is a side-effect, not a message.',
    source: 'Random neural firing in the sleeping brainstem, stitched into narrative by the cortex.',
    weakness:
      'Explains the bizarreness of dreams well, but struggles to explain why dreams so often feature meaningful, emotional, recurring themes rather than pure noise.',
  },
  {
    key: 'information-processing',
    name: 'Information-processing',
    icon: 'Brain',
    color: '#00D2D3',
    oneLine: 'Dreams help sort and consolidate memory.',
    claim:
      'On this view dreaming is part of how the brain files the day: replaying experiences, strengthening important memories and pruning the rest. Sleep (especially REM) reliably boosts learning and recall.',
    source: 'The day’s experiences being replayed and integrated for memory consolidation.',
    weakness:
      'Strong evidence that sleep aids memory — but less clear that the conscious dream itself does the work, rather than the underlying neural activity.',
  },
]

export function DreamTheories() {
  const [i, setI] = useState(0)
  const t = THEORIES[i]

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="flex flex-wrap gap-2">
        {THEORIES.map((th, k) => (
          <button
            key={th.key}
            type="button"
            onClick={() => setI(k)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors',
              k === i
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={th.icon} size={14} />
            {th.name}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-4">
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: `${t.color}22`, color: t.color }}
          >
            <Icon name={t.icon} size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{t.name}</p>
            <p className="text-xs text-muted">{t.oneLine}</p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted">{t.claim}</p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: t.color }}>
              Where the dream comes from
            </p>
            <p className="mt-0.5 text-sm leading-snug text-muted">{t.source}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-warn">The weakness</p>
            <p className="mt-0.5 text-sm leading-snug text-muted">{t.weakness}</p>
          </div>
        </div>
      </div>

      <p className="mt-2 text-xs text-muted">
        These are not mutually exclusive — a dream could be random firing (activation-synthesis) that the brain shapes around
        the day’s emotional residue (information-processing). The honest answer is that dream science is still open.
      </p>
    </div>
  )
}
