import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The fundamental attribution error, felt firsthand. The learner watches a
// stranger cut in line, then judges WHY — was it the person (disposition: rude,
// selfish) or the situation (in a rush, didn't see the line)? Most of us reach
// for disposition. Then a toggle flips perspective to "you did it", and the same
// act suddenly feels obviously situational. That gap IS the bias: we over-explain
// OTHERS by character and OURSELVES by circumstance (the actor-observer effect).
// Used in attribution.

type Lens = 'observer' | 'actor'
type Cause = 'disposition' | 'situation'

const CAUSES: Record<Cause, { label: string; icon: string; observer: string; actor: string }> = {
  disposition: {
    label: 'The person',
    icon: 'User',
    observer: 'They\'re rude and selfish — that\'s just the kind of person they are.',
    actor: 'I\'m a rude, selfish person.',
  },
  situation: {
    label: 'The situation',
    icon: 'CloudRain',
    observer: 'Maybe they\'re rushing to an emergency, or genuinely didn\'t notice the line.',
    actor: 'I was in a desperate hurry and honestly didn\'t see the line — anyone would have.',
  },
}

export function AttributionError() {
  const [lens, setLens] = useState<Lens>('observer')
  const [picked, setPicked] = useState<Cause | null>(null)

  const flip = (l: Lens) => {
    setLens(l)
    setPicked(null)
  }

  const scene =
    lens === 'observer'
      ? 'A stranger pushes straight to the front of a long, slow queue and skips everyone.'
      : 'You push straight to the front of a long, slow queue and skip everyone.'

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(['observer', 'actor'] as Array<Lens>).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => flip(l)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              lens === l ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {l === 'observer' ? 'Someone else does it' : 'You do it'}
          </button>
        ))}
      </div>

      <p className="rounded-xl bg-surface-2 p-3 text-sm text-ink">{scene}</p>

      <p className="mb-1.5 mt-3 text-sm text-muted">What best explains it?</p>
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(CAUSES) as Array<Cause>).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setPicked(c)}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors',
              picked === c ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={CAUSES[c].icon} size={16} />
            {CAUSES[c].label}
          </button>
        ))}
      </div>

      {picked && (
        <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3">
          <p className="text-sm italic leading-snug text-ink">
            &ldquo;{lens === 'observer' ? CAUSES[picked].observer : CAUSES[picked].actor}&rdquo;
          </p>
          <p className="mt-2 flex gap-2 text-sm leading-snug text-muted">
            <span className="mt-0.5 shrink-0 text-accent">
              <Icon name="Lightbulb" size={16} />
            </span>
            {lens === 'observer'
              ? 'Most people blame the person. That pull is the fundamental attribution error: we over-credit character and under-weight the situation when judging others.'
              : 'Notice how easily the situation explains it now. When we explain our OWN behaviour we reach for circumstances — the actor–observer flip. The act is identical; only the seat changed.'}
          </p>
        </div>
      )}
    </div>
  )
}
