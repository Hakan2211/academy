import { useState } from 'react'
import { cn } from '#/lib/cn'
import { Icon } from '#/components/ui/Icon'

// ValueSorter — teach the intrinsic/instrumental distinction.
// Each item can be dragged to "Intrinsic" or "Instrumental" (or both).
// After the user sorts, reveal canonical placements + a one-line why.

type Category = 'intrinsic' | 'instrumental' | 'both'

type Item = {
  id: string
  label: string
  icon: string
  hint: string
  answer: Category
  why: string
}

const ITEMS: Array<Item> = [
  {
    id: 'happiness',
    label: 'Happiness',
    icon: 'Smile',
    hint: 'Feeling good, joy, flourishing',
    answer: 'intrinsic',
    why: 'Happiness is typically valued for its own sake — not because it leads to something else.',
  },
  {
    id: 'money',
    label: 'Money',
    icon: 'Coins',
    hint: 'Cash, wealth, financial resources',
    answer: 'instrumental',
    why: 'Money is almost always a means — we value it for what it can buy, not for itself.',
  },
  {
    id: 'health',
    label: 'Health',
    icon: 'Heart',
    hint: 'Physical wellbeing, vitality',
    answer: 'both',
    why: 'Health feels good in itself AND enables other goods (work, play, relationships).',
  },
  {
    id: 'knowledge',
    label: 'Knowledge',
    icon: 'BookOpen',
    hint: 'Understanding, learning, truth',
    answer: 'both',
    why: 'Many value knowledge for its own sake (curiosity satisfied), and also because it helps achieve goals.',
  },
  {
    id: 'friendship',
    label: 'Friendship',
    icon: 'Users',
    hint: 'Close bonds, genuine care for others',
    answer: 'intrinsic',
    why: 'A true friendship is valued for the relationship itself, not merely for what friends can do for you.',
  },
  {
    id: 'hammer',
    label: 'A hammer',
    icon: 'Hammer',
    hint: 'A physical tool',
    answer: 'instrumental',
    why: 'No one values a hammer for its own sake — it is worth having only because it drives nails.',
  },
]

const CATEGORIES: Array<{ id: Category; label: string; desc: string }> = [
  {
    id: 'intrinsic',
    label: 'Intrinsic',
    desc: 'Valued in itself — an end',
  },
  {
    id: 'instrumental',
    label: 'Instrumental',
    desc: 'Valued as a means to something else',
  },
  {
    id: 'both',
    label: 'Both',
    desc: 'Valuable in itself AND as a means',
  },
]

type Guess = Category | null

export function ValueSorter() {
  const [guesses, setGuesses] = useState<Record<string, Guess>>(() =>
    Object.fromEntries(ITEMS.map((i) => [i.id, null])),
  )
  const [revealed, setRevealed] = useState(false)

  const totalAnswered = Object.values(guesses).filter((g) => g !== null).length
  const allAnswered = totalAnswered === ITEMS.length

  function handleGuess(itemId: string, cat: Category) {
    if (revealed) return
    setGuesses((prev) => ({ ...prev, [itemId]: prev[itemId] === cat ? null : cat }))
  }

  function isCorrect(item: Item): boolean {
    return guesses[item.id] === item.answer
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-semibold text-ink">Sort each item: is it valued intrinsically, instrumentally, or both?</p>
      <p className="mb-4 text-xs text-muted">
        Intrinsic = good in itself (an end). Instrumental = good as a means to something else. Some are both.
      </p>

      <div className="space-y-3">
        {ITEMS.map((item) => {
          const guess = guesses[item.id]
          const showResult = revealed
          const correct = showResult ? isCorrect(item) : null

          return (
            <div
              key={item.id}
              className={cn(
                'rounded-xl border p-3 transition-colors',
                showResult && correct
                  ? 'border-success/50 bg-surface-2'
                  : showResult && !correct
                    ? 'border-warn/50 bg-surface-2'
                    : 'border-border bg-surface-2',
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={16} className="shrink-0 text-accent" />
                <span className="text-sm font-semibold text-ink">{item.label}</span>
                <span className="text-xs text-muted">— {item.hint}</span>
                {showResult && (
                  <span className={cn('ml-auto text-xs font-semibold', correct ? 'text-success' : 'text-warn')}>
                    {correct ? 'Correct' : 'Not quite'}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    disabled={revealed}
                    onClick={() => handleGuess(item.id, cat.id)}
                    className={cn(
                      'rounded-lg border px-2 py-1 text-xs transition-colors',
                      guess === cat.id
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-border text-muted hover:text-ink',
                      revealed && 'cursor-default',
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {showResult && (
                <div className="mt-2 rounded-lg border border-border bg-surface px-2 py-1.5">
                  <p className="text-xs text-muted">
                    <span className="font-semibold text-ink">Answer — {item.answer}: </span>
                    {item.why}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-muted">
          {revealed
            ? `${ITEMS.filter((i) => isCorrect(i)).length} / ${ITEMS.length} correct`
            : `${totalAnswered} / ${ITEMS.length} sorted`}
        </p>
        {!revealed && (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={() => setRevealed(true)}
            className={cn(
              'rounded-xl border px-3 py-1.5 text-sm font-semibold transition-colors',
              allAnswered
                ? 'border-accent bg-accent/15 text-accent hover:bg-accent/25'
                : 'border-border text-muted cursor-not-allowed',
            )}
          >
            Reveal answers
          </button>
        )}
        {revealed && (
          <button
            type="button"
            onClick={() => {
              setGuesses(Object.fromEntries(ITEMS.map((i) => [i.id, null])))
              setRevealed(false)
            }}
            className="rounded-xl border border-border px-3 py-1.5 text-sm text-muted hover:text-ink transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
