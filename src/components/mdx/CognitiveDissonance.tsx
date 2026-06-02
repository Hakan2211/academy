import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Festinger & Carlsmith's classic induced-compliance study. People did a boring
// task, then were paid either $1 or $20 to tell the next person it was fun. The
// twist: those paid just $1 later rated the task as MORE enjoyable. With $20 you
// have an easy external justification for lying ("I did it for the money"), so no
// dissonance. With $1 you can't — the only way to resolve "I said it was fun but
// it was dull" is to shift your attitude: "well... it was kind of fun." Toggle
// the payment and watch the private attitude move. Used in attitudes-and-persuasion.

type Pay = 'one' | 'twenty'

// Approximate enjoyment rating on Festinger's −5..+5 scale (control ~ −0.45).
const RESULT: Record<Pay, { rating: number; dissonance: number; line: string }> = {
  one: {
    rating: 1.35,
    dissonance: 90,
    line: 'I told someone it was fun for almost nothing — so it must have been at least a little fun, right?',
  },
  twenty: {
    rating: -0.05,
    dissonance: 15,
    line: 'Sure, I said it was fun, but I was paid $20 to say it. The task itself was dull, and I know it.',
  },
}

export function CognitiveDissonance() {
  const [pay, setPay] = useState<Pay>('one')
  const r = RESULT[pay]
  // Map rating (−5..+5) to a 0..100 bar position.
  const barPct = ((r.rating + 5) / 10) * 100

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-sm text-muted">
        You just spent an hour on a mind-numbingly boring task. Now a researcher pays you to tell the next participant it
        was <span className="text-ink">genuinely enjoyable</span>. How much are you paid to lie?
      </p>

      <div className="mt-3 flex gap-2">
        {(['one', 'twenty'] as Array<Pay>).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPay(p)}
            className={cn(
              'rounded-full border px-4 py-1 text-sm font-semibold transition-colors',
              pay === p ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {p === 'one' ? '$1' : '$20'}
          </button>
        ))}
      </div>

      {/* dissonance meter */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted">
          <span>Inner tension (dissonance)</span>
          <span className="font-mono text-ink">{r.dissonance}%</span>
        </div>
        <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${r.dissonance}%`, background: '#E74C3C' }} />
        </div>
      </div>

      {/* attitude bar, centred on neutral */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted">
          <span>Hated it</span>
          <span>How fun was the task, really?</span>
          <span>Loved it</span>
        </div>
        <div className="relative mt-1 h-3 rounded-full bg-surface-2">
          <div className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-border" />
          <div
            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface transition-all duration-500"
            style={{ left: `${barPct}%`, background: 'var(--color-accent)' }}
          />
        </div>
        <p className="mt-2 text-center text-sm">
          Private rating:{' '}
          <span className="font-mono font-bold" style={{ color: r.rating > 0.5 ? 'var(--color-success)' : 'var(--color-muted)' }}>
            {r.rating > 0 ? '+' : ''}
            {r.rating.toFixed(2)}
          </span>{' '}
          <span className="text-xs text-muted">(scale −5 to +5)</span>
        </p>
      </div>

      <p className="mt-3 rounded-xl bg-surface-2 p-3 text-sm italic leading-snug text-ink">&ldquo;{r.line}&rdquo;</p>

      <p className="mt-3 flex gap-2 text-sm leading-snug text-muted">
        <span className="mt-0.5 shrink-0 text-accent">
          <Icon name="Brain" size={16} />
        </span>
        {pay === 'one'
          ? 'Counter-intuitive but real: paid just $1, you have no good external excuse for lying. The cheapest way to silence the clash between "I said it was fun" and "it was dull" is to actually believe it a bit more. Attitude bends to fit behaviour.'
          : '$20 is a perfect excuse — "I did it for the money." No tension, no need to change your mind. The dull task stays dull. Less pressure to lie, paradoxically, means LESS attitude change.'}
      </p>
    </div>
  )
}
