import { useState } from 'react'
import { cn } from '#/lib/cn'

// Three theories of truth applied to three statements.
// User picks a statement; three panels show how each theory judges it.

type Statement = {
  id: string
  text: string
  correspondence: { verdict: string; reasoning: string; strength: string; weakness: string }
  coherence: { verdict: string; reasoning: string; strength: string; weakness: string }
  pragmatic: { verdict: string; reasoning: string; strength: string; weakness: string }
}

const STATEMENTS: Statement[] = [
  {
    id: 'cat',
    text: '"The cat is on the mat."',
    correspondence: {
      verdict: 'True if the cat really is on the mat',
      reasoning:
        'This statement corresponds to reality: there is a fact of the matter — either the cat is on the mat or it isn\'t. Go look. If the cat is there, the statement is true; if not, false.',
      strength: 'Intuitive: truth tracks the world, not just our beliefs.',
      weakness: 'Tricky to say exactly what "correspondence" means — how does a sentence "match" a fact?',
    },
    coherence: {
      verdict: 'True if it fits your web of beliefs',
      reasoning:
        'Is it consistent with your belief that you placed the cat on the mat, that you haven\'t moved it, that cats stay where they\'re put? If it coheres with your other beliefs, the coherence theorist calls it true.',
      strength: 'Explains how we justify beliefs from within a system of beliefs.',
      weakness: 'A perfectly coherent but completely false story would count as "true." Coherence isn\'t enough.',
    },
    pragmatic: {
      verdict: 'True if it is useful to believe',
      reasoning:
        'Believing the cat is on the mat helps you find the cat. That belief guides successful action. For the pragmatist, its usefulness — it works — is what makes it true.',
      strength: 'Grounds truth in human action and inquiry rather than abstract correspondence.',
      weakness: 'Useful beliefs can be false (placebos work). "True" and "useful" seem distinct.',
    },
  },
  {
    id: 'slavery',
    text: '"Slavery is wrong."',
    correspondence: {
      verdict: 'True if there is a moral fact it matches',
      reasoning:
        'The correspondence theorist faces a challenge here: what "fact" in the world does a moral statement correspond to? Moral realists say there are objective moral facts; anti-realists deny it, putting moral truths outside correspondence theory\'s reach.',
      strength: 'If moral realism is right, moral truths are just as objective as physical ones.',
      weakness: 'Controversial: it requires accepting that moral facts exist in the world. Many philosophers reject this.',
    },
    coherence: {
      verdict: 'True if it coheres with your moral web',
      reasoning:
        '"Slavery is wrong" coheres with beliefs about human dignity, the wrongness of treating persons as objects, and broad intuitions about suffering. It fits — and over centuries, the coherence grew stronger as more beliefs aligned against slavery.',
      strength: 'Explains moral progress: our moral beliefs become more consistent over time.',
      weakness: 'A culture with coherent but deeply evil beliefs could call slavery "true" by its own standards.',
    },
    pragmatic: {
      verdict: 'True if believing it has better consequences',
      reasoning:
        'Believing slavery is wrong leads to a more just society, reduces suffering, and produces better outcomes for humanity. For the pragmatist, a moral belief\'s truth is bound up with its practical effects on human life.',
      strength: 'Keeps ethics practical and action-guiding rather than abstract.',
      weakness: 'Seems to collapse "true" into "beneficial" — but history is full of harmful truths and helpful falsehoods.',
    },
  },
  {
    id: 'atoms',
    text: '"Atoms exist."',
    correspondence: {
      verdict: 'True if atoms really exist in the world',
      reasoning:
        'The realist correspondence view: atoms are real entities in the external world, and the statement "atoms exist" corresponds to that fact. Scientific investigation reveals the structure of reality.',
      strength: 'Explains why science is so successful: it actually maps reality.',
      weakness: 'Can we ever access "the world" directly to check correspondence, or only ever through our theories?',
    },
    coherence: {
      verdict: 'True because atomic theory coheres with the whole of physics and chemistry',
      reasoning:
        'Atomic theory fits with quantum mechanics, spectroscopy, chemical reactions, Brownian motion, and hundreds of other phenomena. No rival theory is more coherent with everything we know.',
      strength: 'Explains why theoretical entities we can\'t see directly can still be "true."',
      weakness: 'Pre-atomic theories were internally coherent too. Coherence alone may not be enough.',
    },
    pragmatic: {
      verdict: 'True because believing it works — it guides successful predictions and technology',
      reasoning:
        'Atomic theory guides the design of computers, medicines, and nuclear reactors. It works better than any alternative. For the pragmatist, this success is exactly what truth amounts to.',
      strength: 'Explains the role of science as a tool for navigating the world.',
      weakness: 'Newtonian mechanics "worked" for centuries but is now considered an approximation. Was it true?',
    },
  },
]

type TheoryKey = 'correspondence' | 'coherence' | 'pragmatic'

const THEORIES: { key: TheoryKey; label: string; tagline: string; color: string; bg: string }[] = [
  {
    key: 'correspondence',
    label: 'Correspondence',
    tagline: 'True = matches reality',
    color: 'text-accent',
    bg: 'bg-accent/10 border-accent/40',
  },
  {
    key: 'coherence',
    label: 'Coherence',
    tagline: 'True = fits your beliefs',
    color: 'text-accent-2',
    bg: 'bg-accent-2/10 border-accent-2/40',
  },
  {
    key: 'pragmatic',
    label: 'Pragmatic',
    tagline: 'True = works / is useful',
    color: 'text-success',
    bg: 'bg-success/10 border-success/40',
  },
]

export function TruthTheories() {
  const [stmtId, setStmtId] = useState<string>('cat')
  const [expandedTheory, setExpandedTheory] = useState<TheoryKey | null>(null)

  const stmt = STATEMENTS.find((s) => s.id === stmtId) ?? STATEMENTS[0]!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Statement selector */}
      <p className="mb-2 text-sm text-muted">Choose a statement:</p>
      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        {STATEMENTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setStmtId(s.id)
              setExpandedTheory(null)
            }}
            className={cn(
              'rounded-xl border px-3 py-2 text-left text-sm transition-colors',
              stmtId === s.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {s.text}
          </button>
        ))}
      </div>

      {/* Three theory panels */}
      <div className="grid gap-3">
        {THEORIES.map((theory) => {
          const data = stmt[theory.key]
          const isExpanded = expandedTheory === theory.key
          return (
            <div
              key={theory.key}
              className={cn('rounded-xl border transition-all', theory.bg)}
            >
              <button
                type="button"
                className="flex w-full items-start justify-between gap-2 p-3 text-left"
                onClick={() => setExpandedTheory(isExpanded ? null : theory.key)}
              >
                <div>
                  <div className={cn('text-sm font-bold', theory.color)}>{theory.label} Theory</div>
                  <div className="text-xs text-muted">{theory.tagline}</div>
                </div>
                <div className={cn('mt-0.5 shrink-0 text-xs font-medium', theory.color)}>
                  {isExpanded ? '▲ hide' : '▼ expand'}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border/40 px-3 pb-3 pt-2">
                  <p className={cn('mb-1 text-xs font-semibold', theory.color)}>Verdict</p>
                  <p className="text-sm font-medium text-ink">{data.verdict}</p>

                  <p className={cn('mb-1 mt-3 text-xs font-semibold', theory.color)}>Reasoning</p>
                  <p className="text-sm text-muted">{data.reasoning}</p>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border border-border bg-surface/60 p-2">
                      <div className="mb-0.5 text-xs font-semibold text-success">Strength</div>
                      <p className="text-xs text-muted">{data.strength}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-surface/60 p-2">
                      <div className="mb-0.5 text-xs font-semibold text-warn">Weakness</div>
                      <p className="text-xs text-muted">{data.weakness}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Expand each theory to see how it explains the truth of the chosen statement.
      </p>
    </div>
  )
}
