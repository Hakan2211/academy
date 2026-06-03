import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A guided Socratic dialogue. Socrates never lectured — he asked. Each step takes
// a confident definition, exposes a counterexample, and forces a refinement, until
// the easy answer collapses and a deeper understanding begins. ("What is X?")
type Turn = {
  speaker: 'them' | 'socrates'
  text: string
  note?: string
}

const DIALOGUE: Array<Turn> = [
  { speaker: 'them', text: '"Justice is simply telling the truth and paying back what you owe."' },
  {
    speaker: 'socrates',
    text: 'Suppose a friend lends you his sword, then later — in a fit of madness — demands it back. Is it just to return it?',
    note: 'A counterexample: returning what is owed could cause harm.',
  },
  { speaker: 'them', text: '"No… that wouldn\'t be just. So justice can\'t be only repaying debts."' },
  {
    speaker: 'socrates',
    text: 'Then perhaps justice is helping friends and harming enemies?',
    note: 'A new definition is offered to replace the broken one.',
  },
  {
    speaker: 'socrates',
    text: 'But can harming anyone — making them worse — ever be the work of a just person?',
    note: 'The refinement is tested again, and also fails.',
  },
  {
    speaker: 'them',
    text: '"I thought I knew what justice was. Now I see I do not."',
    note: 'Aporia — productive confusion. The false certainty is cleared away.',
  },
]

export function SocraticMethod() {
  const [shown, setShown] = useState(1)
  const atEnd = shown >= DIALOGUE.length

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted">A Socratic dialogue: "What is justice?"</p>
        <span className="text-xs text-muted">
          {Math.min(shown, DIALOGUE.length)} / {DIALOGUE.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {DIALOGUE.slice(0, shown).map((t, i) => (
          <div
            key={i}
            className={cn(
              'rounded-xl border p-3 text-sm',
              t.speaker === 'socrates'
                ? 'border-accent/40 bg-accent/10'
                : 'border-border bg-surface-2',
            )}
          >
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
              <Icon name={t.speaker === 'socrates' ? 'MessageCircleQuestion' : 'User'} size={14} />
              <span className={t.speaker === 'socrates' ? 'text-accent' : 'text-muted'}>
                {t.speaker === 'socrates' ? 'Socrates' : 'Interlocutor'}
              </span>
            </div>
            <p className="text-ink">{t.text}</p>
            {t.note && <p className="mt-1 text-xs italic text-accent-2">{t.note}</p>}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        {!atEnd ? (
          <button
            type="button"
            onClick={() => setShown((s) => s + 1)}
            className="rounded-xl border border-accent bg-accent/15 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/25"
          >
            Ask the next question →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShown(1)}
            className="rounded-xl border border-border px-4 py-2 text-sm text-muted transition-colors hover:text-ink"
          >
            Start over
          </button>
        )}
        {atEnd && (
          <p className="text-xs text-muted">
            The method's gift isn't the answer — it's destroying false certainty so real inquiry can start.
          </p>
        )}
      </div>
    </div>
  )
}
