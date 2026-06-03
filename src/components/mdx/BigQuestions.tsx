import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The great questions of philosophy — and which branch each belongs to. The learner
// reads a question and guesses its branch; the reveal teaches the map of the field.
type Q = { q: string; branch: string; branchLabel: string }

const BRANCHES = [
  { id: 'epistemology', label: 'Epistemology', icon: 'KeyRound' },
  { id: 'metaphysics', label: 'Metaphysics', icon: 'Layers' },
  { id: 'ethics', label: 'Ethics', icon: 'Scale' },
  { id: 'mind', label: 'Mind', icon: 'Brain' },
]

const QUESTIONS: Array<Q> = [
  { q: 'Can I ever really know that the world outside my mind exists?', branch: 'epistemology', branchLabel: 'Epistemology' },
  { q: 'Do I have free will, or is every choice already determined?', branch: 'metaphysics', branchLabel: 'Metaphysics' },
  { q: 'Is it ever right to lie to protect someone?', branch: 'ethics', branchLabel: 'Ethics' },
  { q: 'Could a machine ever truly be conscious?', branch: 'mind', branchLabel: 'Mind' },
  { q: 'Why is there something rather than nothing?', branch: 'metaphysics', branchLabel: 'Metaphysics' },
  { q: 'What makes a belief justified rather than a lucky guess?', branch: 'epistemology', branchLabel: 'Epistemology' },
]

export function BigQuestions() {
  const [idx, setIdx] = useState(0)
  const [guess, setGuess] = useState<string | null>(null)
  const cur = QUESTIONS[idx]
  const correct = guess === cur.branch

  function pick(b: string) {
    if (guess) return
    setGuess(b)
  }
  function next() {
    setGuess(null)
    setIdx((i) => (i + 1) % QUESTIONS.length)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Every big question lives in a branch of philosophy. Read it — which branch is it asking about?
      </p>

      <div className="rounded-xl border border-accent-2/40 bg-surface-2 p-4">
        <Icon name="HelpCircle" size={18} />
        <p className="mt-2 text-lg font-semibold text-ink">{cur.q}</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {BRANCHES.map((b) => {
          const isAnswer = b.id === cur.branch
          const picked = guess === b.id
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => pick(b.id)}
              disabled={!!guess}
              className={cn(
                'flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors',
                !guess && 'border-border text-muted hover:text-ink',
                guess && isAnswer && 'border-success bg-success/15 text-success',
                guess && picked && !isAnswer && 'border-warn bg-warn/15 text-warn',
                guess && !picked && !isAnswer && 'border-border text-muted opacity-60',
              )}
            >
              <Icon name={b.icon} size={16} />
              <span className="font-semibold">{b.label}</span>
            </button>
          )
        })}
      </div>

      {guess && (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-surface-2 p-3 text-sm">
          <p className="text-ink">
            {correct ? 'Exactly — ' : 'This one belongs to '}
            <span className="font-semibold text-accent">{cur.branchLabel}</span>.
          </p>
          <button
            type="button"
            onClick={next}
            className="rounded-lg border border-accent bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
