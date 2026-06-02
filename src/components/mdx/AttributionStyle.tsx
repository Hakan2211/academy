import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// How we explain an outcome shapes our motivation. Two questions: is the cause
// inside me or out in the world (internal / external), and will it last or
// change (stable / unstable)? The four answers form an explanatory style. A
// hopeful style credits success to stable-internal causes and blames failure on
// unstable-external ones; a pessimistic style does the reverse. Reused later in
// Positive Psychology — kept fully self-contained (no props).
type Outcome = 'failure' | 'success'

type CellData = {
  thought: string
  effect: string
  tone: 'good' | 'bad'
}

// rows: internal / external. cols: stable / unstable.
const DATA: Record<Outcome, Record<string, CellData>> = {
  failure: {
    internalStable: {
      thought: '"I failed the test because I\'m just not smart."',
      effect: 'Most demotivating: a lasting flaw in me. Breeds helplessness — why even try?',
      tone: 'bad',
    },
    internalUnstable: {
      thought: '"I failed because I didn\'t study enough this time."',
      effect: 'Hopeful: my effort is in my control and can change. Motivates trying harder next time.',
      tone: 'good',
    },
    externalStable: {
      thought: '"I failed because this teacher always writes impossible tests."',
      effect: 'Protects the ego but feels permanent and out of reach — little reason to change my approach.',
      tone: 'bad',
    },
    externalUnstable: {
      thought: '"I failed because the room was freezing that one day."',
      effect: 'Shields self-esteem and stays open to a better outcome — but can dodge real responsibility.',
      tone: 'good',
    },
  },
  success: {
    internalStable: {
      thought: '"I aced it because I\'m capable and I always prepare."',
      effect: 'Most empowering: builds lasting confidence and a sense of competence.',
      tone: 'good',
    },
    internalUnstable: {
      thought: '"I aced it because I happened to try really hard this once."',
      effect: 'Encouraging, but credits a one-off effort rather than enduring ability.',
      tone: 'good',
    },
    externalStable: {
      thought: '"I aced it because the test is always easy."',
      effect: 'Gives away the credit to the situation — wins don\'t build self-belief.',
      tone: 'bad',
    },
    externalUnstable: {
      thought: '"I aced it — I just got lucky with the questions."',
      effect: 'Most deflating after a win: success feels like a fluke you can\'t repeat.',
      tone: 'bad',
    },
  },
}

const GRID: Array<Array<{ key: string; row: string; col: string }>> = [
  [
    { key: 'internalStable', row: 'Internal', col: 'Stable' },
    { key: 'internalUnstable', row: 'Internal', col: 'Unstable' },
  ],
  [
    { key: 'externalStable', row: 'External', col: 'Stable' },
    { key: 'externalUnstable', row: 'External', col: 'Unstable' },
  ],
]

export function AttributionStyle() {
  const [outcome, setOutcome] = useState<Outcome>('failure')
  const [active, setActive] = useState('internalStable')
  const cell = DATA[outcome][active]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(['failure', 'success'] as Array<Outcome>).map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setOutcome(o)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              outcome === o ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            After a {o}
          </button>
        ))}
      </div>

      {/* column headers */}
      <div className="mb-2 grid grid-cols-[auto_1fr_1fr] gap-2 text-center text-xs font-semibold text-muted">
        <span />
        <span>Stable<br /><span className="font-normal">(won&apos;t change)</span></span>
        <span>Unstable<br /><span className="font-normal">(can change)</span></span>
      </div>

      {GRID.map((row, r) => (
        <div key={r} className="mb-2 grid grid-cols-[auto_1fr_1fr] items-stretch gap-2">
          <div className="flex w-14 items-center justify-center text-center text-xs font-semibold text-muted">
            {r === 0 ? 'Internal (me)' : 'External (world)'}
          </div>
          {row.map((c) => {
            const sel = active === c.key
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setActive(c.key)}
                className={cn(
                  'rounded-xl border p-3 text-left text-sm transition-colors',
                  sel ? 'border-accent bg-accent/15' : 'border-border bg-surface-2 hover:border-accent/50',
                )}
              >
                <span className="font-semibold text-ink">{c.row}</span>
                <span className="text-muted"> × </span>
                <span className="font-semibold text-ink">{c.col}</span>
              </button>
            )
          })}
        </div>
      ))}

      <div className="mt-3 rounded-xl bg-surface-2 p-3">
        <p className="text-sm italic text-ink">{cell.thought}</p>
        <p
          className="mt-2 text-sm leading-snug"
          style={{ color: cell.tone === 'good' ? 'var(--color-success)' : '#E74C3C' }}
        >
          <Icon name={cell.tone === 'good' ? 'TrendingUp' : 'TrendingDown'} size={14} className="mr-1 inline" />
          {cell.effect}
        </p>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        An <span className="text-ink">optimistic</span> style explains good events as internal-stable and bad events as
        external-unstable. A <span className="text-ink">pessimistic</span> style flips it — and corrodes motivation.
      </p>
    </div>
  )
}
