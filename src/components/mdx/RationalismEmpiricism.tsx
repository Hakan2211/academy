import { useState } from 'react'
import { cn } from '#/lib/cn'
import { Icon } from '#/components/ui/Icon'

// A priori vs a posteriori sorting game.
// Self-contained and general — reusable by other worlds.

type Claim = {
  id: string
  text: string
  answer: 'priori' | 'posteriori'
  rationalistNote: string
  empiricistNote: string
  explanation: string
}

const CLAIMS: Claim[] = [
  {
    id: 'bachelors',
    text: '"All bachelors are unmarried."',
    answer: 'priori',
    rationalistNote: 'A paradigm case of a priori knowledge — true by definition, no experience needed.',
    empiricistNote: 'Hume agreed: this is a "relation of ideas," knowable by reason alone.',
    explanation:
      'A priori — you need only understand the meaning of "bachelor" and "unmarried." No survey of actual bachelors is required.',
  },
  {
    id: 'boiling',
    text: '"Water boils at 100 °C at sea level."',
    answer: 'posteriori',
    rationalistNote: 'Even rationalists concede: facts about the physical world require observation.',
    empiricistNote: 'The classic empiricist example — you must observe the world to learn this.',
    explanation:
      'A posteriori — no amount of pure reasoning could tell you the boiling point of water. You need to observe or be told.',
  },
  {
    id: 'triangle',
    text: '"The angles of a triangle sum to 180°."',
    answer: 'priori',
    rationalistNote: 'Mathematical truths are the rationalist\'s favourite examples — provable from axioms alone.',
    empiricistNote: 'Mill controversially argued even maths is inductive, but most accept this as a priori.',
    explanation:
      'A priori — provable by deduction from the axioms of Euclidean geometry without measuring any actual triangle.',
  },
  {
    id: 'cats',
    text: '"Cats are mammals."',
    answer: 'posteriori',
    rationalistNote: 'This is a scientific classification — requires biological investigation.',
    empiricistNote: 'You cannot deduce the biology of cats from the concept "cat" — observation is essential.',
    explanation:
      'A posteriori — "mammal" is not part of the definition of "cat" in the way "unmarried" is part of "bachelor." You need biology.',
  },
  {
    id: 'contradiction',
    text: '"Nothing can be both red and not red at the same time."',
    answer: 'priori',
    rationalistNote: 'The law of non-contradiction is a bedrock of pure reason.',
    empiricistNote: 'Leibniz called such truths "necessary" — their denial is a logical contradiction.',
    explanation:
      'A priori — the law of non-contradiction holds in virtue of logic alone, not because we\'ve checked every object.',
  },
  {
    id: 'sun',
    text: '"The Sun is roughly 150 million km from Earth."',
    answer: 'posteriori',
    rationalistNote: 'Astronomical distances are paradigmatically empirical facts.',
    empiricistNote: 'Pure reasoning could never give you a precise astronomical measurement.',
    explanation:
      'A posteriori — this is a contingent fact about the universe discoverable only through observation and measurement.',
  },
]

type Sort = 'priori' | 'posteriori' | null

export function RationalismEmpiricism() {
  const [sorts, setSorts] = useState<Record<string, Sort>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [current, setCurrent] = useState(0)

  const claim = CLAIMS[current]!
  const userSort = sorts[claim.id] ?? null
  const isRevealed = !!revealed[claim.id]
  const isCorrect = userSort === claim.answer

  const score = CLAIMS.filter((c) => sorts[c.id] === c.answer).length
  const attempted = Object.keys(sorts).length
  const allDone = attempted === CLAIMS.length

  function handleSort(choice: 'priori' | 'posteriori') {
    if (isRevealed) return
    setSorts((s) => ({ ...s, [claim.id]: choice }))
    setRevealed((r) => ({ ...r, [claim.id]: true }))
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">
          A Priori or A Posteriori?
        </span>
        <span className="text-xs text-muted">
          {score}/{CLAIMS.length} correct
        </span>
      </div>

      {/* Progress dots */}
      <div className="mb-4 flex gap-1.5">
        {CLAIMS.map((c, i) => {
          const s = sorts[c.id]
          const correct = s === c.answer
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCurrent(i)}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                i === current
                  ? 'bg-accent'
                  : s == null
                    ? 'bg-border'
                    : correct
                      ? 'bg-success'
                      : 'bg-warn',
              )}
              aria-label={`Claim ${i + 1}`}
            />
          )
        })}
      </div>

      {/* Claim card */}
      <div className="mb-4 rounded-xl border border-border bg-surface-2 p-3 text-center text-sm font-medium text-ink">
        {claim.text}
      </div>

      {/* Sorting buttons */}
      <div className="grid grid-cols-2 gap-3">
        {(
          [
            { key: 'priori', label: 'A Priori', sub: 'Knowable by reason alone' } as const,
            { key: 'posteriori', label: 'A Posteriori', sub: 'Requires experience / observation' } as const,
          ]
        ).map(({ key, label, sub }) => {
          const chosen = userSort === key
          const wrong = isRevealed && chosen && !isCorrect
          const correctChoice = isRevealed && claim.answer === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSort(key)}
              disabled={isRevealed}
              className={cn(
                'rounded-xl border px-3 py-3 text-left text-sm transition-colors',
                wrong
                  ? 'border-warn/60 bg-warn/10 text-warn'
                  : correctChoice
                    ? 'border-success/60 bg-success/10 text-success'
                    : isRevealed
                      ? 'border-border text-muted opacity-60'
                      : 'border-border text-muted hover:border-accent hover:text-ink',
              )}
            >
              <div className="font-semibold">{label}</div>
              <div className="text-xs opacity-80">{sub}</div>
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {isRevealed && (
        <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3 text-sm">
          <div className={cn('mb-1 font-semibold', isCorrect ? 'text-success' : 'text-warn')}>
            {isCorrect ? '✓ Correct' : '✗ Not quite'}
          </div>
          <p className="text-muted">{claim.explanation}</p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-border p-2">
              <div className="mb-0.5 text-xs font-semibold text-accent">Rationalist view</div>
              <p className="text-xs text-muted">{claim.rationalistNote}</p>
            </div>
            <div className="rounded-lg border border-border p-2">
              <div className="mb-0.5 text-xs font-semibold text-accent-2">Empiricist view</div>
              <p className="text-xs text-muted">{claim.empiricistNote}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-4 flex justify-between">
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className={cn(
            'flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors',
            current === 0
              ? 'border-border text-muted opacity-40 cursor-not-allowed'
              : 'border-border text-muted hover:text-ink',
          )}
        >
          <Icon name="ChevronLeft" size={14} />
          Prev
        </button>
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.min(CLAIMS.length - 1, c + 1))}
          disabled={current === CLAIMS.length - 1}
          className={cn(
            'flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors',
            current === CLAIMS.length - 1
              ? 'border-border text-muted opacity-40 cursor-not-allowed'
              : 'border-accent bg-accent/15 text-accent hover:bg-accent/25',
          )}
        >
          Next
          <Icon name="ChevronRight" size={14} />
        </button>
      </div>

      {allDone && (
        <div className="mt-3 rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm text-center">
          <span className="font-semibold text-accent">
            {score === CLAIMS.length
              ? 'Perfect! '
              : score >= CLAIMS.length * 0.7
                ? 'Well done! '
                : 'Keep it up! '}
          </span>
          <span className="text-muted">
            {score}/{CLAIMS.length} — {score >= CLAIMS.length * 0.7 ? 'You\'ve got the distinction down.' : 'Review the explanations above.'}
          </span>
        </div>
      )}
    </div>
  )
}
