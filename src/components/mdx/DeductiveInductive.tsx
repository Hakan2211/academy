import { useState } from 'react'
import { cn } from '#/lib/cn'
import { Icon } from '#/components/ui/Icon'

// Sort argument cards into Deductive (conclusion guaranteed by premises) or
// Inductive (premises only make the conclusion probable). After guessing, see
// why — and a certainty bar showing 100% vs ~70-85%.

type Card = {
  id: string
  text: string
  kind: 'deductive' | 'inductive'
  certainty: number // 0–100
  why: string
}

const CARDS: Array<Card> = [
  {
    id: 'tri',
    text: 'All triangles have three sides. This shape is a triangle. Therefore it has three sides.',
    kind: 'deductive',
    certainty: 100,
    why: 'If the premises are true, the conclusion cannot possibly be false — this is a necessary inference (modus ponens from a definition).',
  },
  {
    id: 'sun',
    text: 'The sun has risen every day for billions of years. Therefore the sun will rise tomorrow.',
    kind: 'inductive',
    certainty: 99,
    why: 'An extremely strong generalisation from past observations, but not a logical guarantee — the premises leave open, however remote, the possibility of failure.',
  },
  {
    id: 'swan',
    text: 'Every swan I have ever seen has been white. Therefore all swans are white.',
    kind: 'inductive',
    certainty: 65,
    why: 'A classic generalisation. The premise supports the conclusion but doesn\'t guarantee it — black swans exist! The large sample helps, but the inference is still only probable.',
  },
  {
    id: 'calc',
    text: 'If x = 5, then 2x = 10. x = 5. Therefore 2x = 10.',
    kind: 'deductive',
    certainty: 100,
    why: 'Pure arithmetic / modus ponens: the conclusion follows with mathematical necessity. No amount of evidence could make it false if the premises hold.',
  },
  {
    id: 'doctor',
    text: 'Nine out of ten patients who take this medication recover. Maria took the medication. Therefore Maria will probably recover.',
    kind: 'inductive',
    certainty: 90,
    why: 'The statistical premise strongly supports the conclusion but leaves room for uncertainty. This is the backbone of medical evidence — strong induction, not deduction.',
  },
]

export function DeductiveInductive() {
  const [index, setIndex] = useState(0)
  const [guess, setGuess] = useState<'deductive' | 'inductive' | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const card = CARDS[index]
  const revealed = guess !== null
  const correct = guess === card?.kind

  function handleGuess(g: 'deductive' | 'inductive') {
    if (revealed) return
    setGuess(g)
    setScore((s) => ({ correct: s.correct + (g === card.kind ? 1 : 0), total: s.total + 1 }))
  }

  function next() {
    setIndex((i) => (i + 1) % CARDS.length)
    setGuess(null)
  }

  if (!card) return null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Score + progress */}
      <div className="mb-3 flex items-center justify-between text-xs text-muted">
        <span>
          Argument {(index % CARDS.length) + 1} of {CARDS.length}
        </span>
        {score.total > 0 && (
          <span className="text-ink">
            {score.correct}/{score.total} correct
          </span>
        )}
      </div>

      {/* Argument card */}
      <div className="mb-4 rounded-xl border border-border bg-surface-2 p-3 text-sm text-ink leading-relaxed">
        "{card.text}"
      </div>

      {/* Guess buttons */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        {(['deductive', 'inductive'] as const).map((kind) => {
          const isChosen = guess === kind
          const isCorrectChoice = revealed && kind === card.kind
          const isWrongChoice = revealed && isChosen && !correct
          return (
            <button
              key={kind}
              type="button"
              onClick={() => handleGuess(kind)}
              disabled={revealed}
              className={cn(
                'rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors',
                !revealed && 'hover:border-accent hover:bg-accent/10 hover:text-accent',
                isCorrectChoice && 'border-success bg-success/15 text-success',
                isWrongChoice && 'border-warn bg-warn/10 text-warn line-through',
                !revealed && 'border-border text-muted',
                revealed && !isChosen && !isCorrectChoice && 'border-border text-muted opacity-50',
              )}
            >
              {kind === 'deductive' ? 'Deductive' : 'Inductive'}
              <div className="mt-0.5 text-xs font-normal opacity-80">
                {kind === 'deductive' ? 'conclusion guaranteed' : 'conclusion probable'}
              </div>
            </button>
          )
        })}
      </div>

      {/* Reveal */}
      {revealed && (
        <div
          className={cn(
            'mb-3 rounded-xl border p-3 text-sm',
            correct ? 'border-success/60 bg-success/10' : 'border-warn/60 bg-warn/10',
          )}
        >
          <div className={cn('mb-1 flex items-center gap-1.5 font-semibold', correct ? 'text-success' : 'text-warn')}>
            <Icon name={correct ? 'CheckCircle' : 'XCircle'} size={15} />
            {correct ? 'Correct!' : `It's ${card.kind}`}
          </div>
          <p className="text-muted">{card.why}</p>

          {/* Certainty bar */}
          <div className="mt-2">
            <div className="mb-1 flex justify-between text-xs text-muted">
              <span>Certainty of conclusion</span>
              <span className="font-semibold text-ink">{card.certainty}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  card.kind === 'deductive' ? 'bg-accent' : 'bg-accent-2',
                )}
                style={{ width: `${card.certainty}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-muted">
              <span>0 — impossible</span>
              <span>100 — guaranteed</span>
            </div>
          </div>
        </div>
      )}

      {/* Next button */}
      <button
        type="button"
        onClick={next}
        disabled={!revealed}
        className={cn(
          'w-full rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
          revealed
            ? 'border-accent bg-accent/15 text-accent hover:bg-accent/25'
            : 'cursor-not-allowed border-border text-muted opacity-40',
        )}
      >
        {index === CARDS.length - 1 ? 'Start over ↺' : 'Next argument →'}
      </button>
    </div>
  )
}
