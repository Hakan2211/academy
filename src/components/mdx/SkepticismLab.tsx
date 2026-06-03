import { useState } from 'react'
import { cn } from '#/lib/cn'
import { Icon } from '#/components/ui/Icon'

// Descartes' method of doubt — peel-away interactive.
// Three "waves" of doubt; each wave removes certain beliefs.
// The cogito survives all three waves.

type Belief = {
  id: string
  text: string
  removedByWave: number // 1 = senses deceive, 2 = dreaming, 3 = evil demon; 0 = survives
  survives: boolean
}

const BELIEFS: Belief[] = [
  { id: 'colors', text: 'Objects have the colours I perceive.', removedByWave: 1, survives: false },
  { id: 'size', text: 'Objects are the size they appear.', removedByWave: 1, survives: false },
  { id: 'stick', text: 'A straight stick is not bent in water.', removedByWave: 1, survives: false },
  { id: 'body', text: 'I have a physical body.', removedByWave: 2, survives: false },
  { id: 'room', text: 'I am sitting in a room right now.', removedByWave: 2, survives: false },
  { id: 'others', text: 'Other people exist and are awake.', removedByWave: 2, survives: false },
  { id: 'math', text: '2 + 3 = 5.', removedByWave: 3, survives: false },
  { id: 'geometry', text: 'A square has four sides.', removedByWave: 3, survives: false },
  { id: 'past', text: 'The past is as I remember it.', removedByWave: 3, survives: false },
  { id: 'cogito', text: 'I am thinking, therefore I exist.', removedByWave: 0, survives: true },
]

type Wave = {
  label: string
  title: string
  description: string
  icon: string
  color: string
}

const WAVES: Wave[] = [
  {
    label: 'Wave 1',
    title: 'The Senses Deceive',
    icon: 'Eye',
    color: 'text-accent',
    description:
      'The senses sometimes lie — sticks look bent in water, distant towers look tiny. If they deceive sometimes, can I trust them at all? Out go beliefs that rest on sensory appearances.',
  },
  {
    label: 'Wave 2',
    title: 'The Dreaming Argument',
    icon: 'Moon',
    color: 'text-accent-2',
    description:
      'When I dream, I believe I am awake — yet I am not. Right now, how do I know I\'m not dreaming? If I can\'t tell, even my belief in having a body or being in a room must go.',
  },
  {
    label: 'Wave 3',
    title: 'The Evil Demon',
    icon: 'Zap',
    color: 'text-warn',
    description:
      'What if an omnipotent evil demon is deceiving me about everything — even mathematics? Then 2+3 might not really equal 5. Even logic and geometry must be doubted.',
  },
]

export function SkepticismLab() {
  const [wave, setWave] = useState(0) // 0 = no doubt applied yet; 1–3 = waves applied

  const removedIds = new Set(
    BELIEFS.filter((b) => !b.survives && b.removedByWave <= wave && wave > 0).map((b) => b.id),
  )

  const remainingCount = BELIEFS.filter((b) => !removedIds.has(b.id)).length

  function advance() {
    setWave((w) => Math.min(3, w + 1))
  }
  function reset() {
    setWave(0)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Apply Descartes' waves of doubt. Watch which beliefs survive — and which cannot be doubted away.
      </p>

      {/* Beliefs grid */}
      <div className="mb-4 grid gap-1.5">
        {BELIEFS.map((b) => {
          const removed = removedIds.has(b.id)
          const isCogito = b.id === 'cogito'
          return (
            <div
              key={b.id}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-500',
                removed
                  ? 'border-border bg-surface-2 opacity-40'
                  : isCogito && wave > 0
                    ? 'border-accent bg-accent/15'
                    : 'border-border bg-surface-2',
              )}
            >
              {removed ? (
                <Icon name="X" size={14} className="shrink-0 text-warn" />
              ) : isCogito && wave > 0 ? (
                <Icon name="Sparkles" size={14} className="shrink-0 text-accent" />
              ) : (
                <Icon name="Circle" size={14} className="shrink-0 text-muted" />
              )}
              <span
                className={cn(
                  'transition-all',
                  removed ? 'text-muted line-through' : isCogito && wave > 0 ? 'font-semibold text-accent' : 'text-ink',
                )}
              >
                {b.text}
              </span>
            </div>
          )
        })}
      </div>

      {/* Wave info */}
      {wave > 0 && wave <= 3 && (
        <div
          className={cn(
            'mb-3 rounded-xl border p-3 text-sm',
            wave === 1
              ? 'border-accent/40 bg-accent/10'
              : wave === 2
                ? 'border-accent-2/40 bg-accent-2/10'
                : 'border-warn/40 bg-warn/10',
          )}
        >
          <div
            className={cn(
              'mb-1 flex items-center gap-2 font-semibold',
              wave === 1 ? 'text-accent' : wave === 2 ? 'text-accent-2' : 'text-warn',
            )}
          >
            <Icon name={WAVES[wave - 1]!.icon as Parameters<typeof Icon>[0]['name']} size={14} />
            {WAVES[wave - 1]!.title}
          </div>
          <p className="text-muted">{WAVES[wave - 1]!.description}</p>
        </div>
      )}

      {wave === 3 && (
        <div className="mb-3 rounded-xl border border-accent/50 bg-accent/10 p-3 text-sm">
          <p className="font-semibold text-accent">
            Cogito ergo sum — "I think, therefore I am."
          </p>
          <p className="mt-1 text-muted">
            Even the most powerful deceiver cannot make me doubt that I am thinking right now.
            For to be deceived, I must exist. This is the one rock-solid certainty Descartes finds —
            the foundation on which he will rebuild all knowledge.
          </p>
          <p className="mt-1.5 text-xs text-muted">
            Only {remainingCount} of {BELIEFS.length} starting beliefs survived all three waves.
          </p>
        </div>
      )}

      {/* Wave list */}
      <div className="mb-4 flex flex-col gap-1.5 sm:flex-row">
        {WAVES.map((w, i) => {
          const applied = wave > i
          const isCurrent = wave === i + 1
          return (
            <div
              key={w.label}
              className={cn(
                'flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors',
                applied
                  ? isCurrent
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-border bg-surface-2 text-success'
                  : 'border-border bg-surface-2 text-muted',
              )}
            >
              <span className="font-semibold">{w.label}: </span>
              {w.title}
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={reset}
          disabled={wave === 0}
          className={cn(
            'flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors',
            wave === 0
              ? 'border-border text-muted opacity-40 cursor-not-allowed'
              : 'border-border text-muted hover:text-ink',
          )}
        >
          <Icon name="RotateCcw" size={14} />
          Reset
        </button>
        <button
          type="button"
          onClick={advance}
          disabled={wave >= 3}
          className={cn(
            'flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors',
            wave >= 3
              ? 'border-border text-muted opacity-40 cursor-not-allowed'
              : 'border-accent bg-accent/15 text-accent hover:bg-accent/25',
          )}
        >
          {wave === 0 ? 'Apply Wave 1: Senses Deceive' : wave === 1 ? 'Apply Wave 2: Dreaming' : 'Apply Wave 3: Evil Demon'}
          <Icon name="ChevronRight" size={14} />
        </button>
      </div>
    </div>
  )
}
