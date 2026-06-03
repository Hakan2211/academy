import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The main branches of philosophy, each defined by the central question it asks.
// Click a branch to see its question and a sample of what it studies.
type Branch = {
  id: string
  name: string
  icon: string
  question: string
  blurb: string
  examples: string
}

const BRANCHES: Array<Branch> = [
  {
    id: 'logic',
    name: 'Logic',
    icon: 'Workflow',
    question: 'What follows from what?',
    blurb: 'The study of correct reasoning — how to tell a good argument from a bad one.',
    examples: 'Validity, deduction, fallacies, proof.',
  },
  {
    id: 'epistemology',
    name: 'Epistemology',
    icon: 'KeyRound',
    question: 'What can we know — and how?',
    blurb: 'The study of knowledge, belief, justification, and truth.',
    examples: 'Knowledge vs opinion, skepticism, evidence, certainty.',
  },
  {
    id: 'metaphysics',
    name: 'Metaphysics',
    icon: 'Layers',
    question: 'What is ultimately real?',
    blurb: 'The study of being, reality, existence, time, and cause.',
    examples: 'Free will, the mind, identity, why anything exists.',
  },
  {
    id: 'ethics',
    name: 'Ethics',
    icon: 'Scale',
    question: 'How should we live?',
    blurb: 'The study of right and wrong, good and bad, and what we owe one another.',
    examples: 'Duty, happiness, virtue, justice, the good life.',
  },
  {
    id: 'aesthetics',
    name: 'Aesthetics',
    icon: 'Palette',
    question: 'What is beauty and art?',
    blurb: 'The study of beauty, taste, and the nature and value of art.',
    examples: 'What makes art good? Is beauty in the eye of the beholder?',
  },
  {
    id: 'politics',
    name: 'Political Philosophy',
    icon: 'Landmark',
    question: 'How should we live together?',
    blurb: 'The study of the state, justice, liberty, rights, and authority.',
    examples: 'Why obey laws? What is a fair society?',
  },
]

export function PhilosophyBranches() {
  const [active, setActive] = useState<string>('logic')
  const cur = BRANCHES.find((b) => b.id === active)!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Philosophy isn't one subject — it's a family of questions. Tap a branch to meet its core question.
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {BRANCHES.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setActive(b.id)}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors',
              active === b.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={b.icon} size={16} />
            <span className="font-semibold leading-tight">{b.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-accent-2/40 bg-surface-2 p-4">
        <div className="flex items-center gap-2 text-accent-2">
          <Icon name={cur.icon} size={18} />
          <span className="text-base font-semibold">{cur.name}</span>
        </div>
        <p className="mt-2 text-lg font-semibold text-ink">"{cur.question}"</p>
        <p className="mt-1 text-sm text-muted">{cur.blurb}</p>
        <p className="mt-2 text-xs text-muted">
          <span className="font-semibold text-ink">Asks about:</span> {cur.examples}
        </p>
      </div>
    </div>
  )
}
