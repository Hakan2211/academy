import { useState } from 'react'
import { cn } from '#/lib/cn'

// IsOughtGap — Hume's guillotine made tangible.
// Phase 1: tag each statement as IS (descriptive fact) or OUGHT (normative claim).
// Phase 2: examine a complete argument that slips from IS to OUGHT — spot the
//          hidden value premise that does the real work.

type StatementKind = 'is' | 'ought'

type Statement = {
  id: string
  text: string
  answer: StatementKind
  why: string
}

const STATEMENTS: Array<Statement> = [
  {
    id: 's1',
    text: 'Humans have evolved to feel empathy for their offspring.',
    answer: 'is',
    why: 'This is a biological/evolutionary fact — it describes what IS the case.',
  },
  {
    id: 's2',
    text: 'Parents ought to care for their children.',
    answer: 'ought',
    why: 'This is a moral prescription — it says what people SHOULD do, not just what they do.',
  },
  {
    id: 's3',
    text: 'Societies that cooperate tend to survive longer.',
    answer: 'is',
    why: 'An empirical generalisation about social history — a fact about the world.',
  },
  {
    id: 's4',
    text: 'We should value cooperation over competition.',
    answer: 'ought',
    why: 'A normative recommendation — it says what we OUGHT to value, which goes beyond the survival fact.',
  },
  {
    id: 's5',
    text: 'Causing pain to others increases their suffering.',
    answer: 'is',
    why: 'A descriptive causal claim about pain — a fact, not yet a judgment about its wrongness.',
  },
  {
    id: 's6',
    text: 'We ought not cause unnecessary suffering.',
    answer: 'ought',
    why: 'A moral rule — it adds a normative layer that the bare fact of suffering does not by itself supply.',
  },
]

// The bad argument — shows the illicit is→ought jump
const ARGUMENT = {
  premises: [
    { id: 'p1', text: 'Killing members of our own species is "unnatural" — no other animal does it routinely.', kind: 'is' as const },
    { id: 'p2', text: 'Therefore, murder is wrong.', kind: 'ought' as const },
  ],
  missingPremise: '"Unnatural" acts are morally wrong.',
  explanation:
    'The argument jumps from a biological claim (what animals do — an IS) straight to a moral verdict (OUGHT). The logical gap is real: the conclusion only follows if you smuggle in a hidden value premise — "unnatural = wrong." But that is itself a normative claim, not a fact. Hume\'s point: no chain of pure facts can, on its own, generate a moral conclusion. You always need at least one value premise.',
}

type GuessMap = Record<string, StatementKind | null>

export function IsOughtGap() {
  const [guesses, setGuesses] = useState<GuessMap>(() =>
    Object.fromEntries(STATEMENTS.map((s) => [s.id, null])),
  )
  const [phase1Done, setPhase1Done] = useState(false)
  const [showArgument, setShowArgument] = useState(false)

  const allTagged = STATEMENTS.every((s) => guesses[s.id] !== null)
  const correctCount = STATEMENTS.filter((s) => guesses[s.id] === s.answer).length

  function tag(id: string, kind: StatementKind) {
    if (phase1Done) return
    setGuesses((prev) => ({ ...prev, [id]: prev[id] === kind ? null : kind }))
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-semibold text-ink">Tag each statement: IS (descriptive fact) or OUGHT (normative claim)?</p>
      <p className="mb-4 text-xs text-muted">
        An IS describes what is the case. An OUGHT prescribes what should be the case. Hume's insight: you can never get from IS statements alone to an OUGHT conclusion.
      </p>

      <div className="space-y-2">
        {STATEMENTS.map((s) => {
          const guess = guesses[s.id]
          const correct = phase1Done ? guess === s.answer : null

          return (
            <div
              key={s.id}
              className={cn(
                'rounded-xl border p-3 transition-colors',
                phase1Done && correct === true ? 'border-success/40 bg-surface-2' :
                phase1Done && correct === false ? 'border-warn/40 bg-surface-2' :
                'border-border bg-surface-2',
              )}
            >
              <p className="mb-2 text-sm leading-snug text-ink">"{s.text}"</p>
              <div className="flex flex-wrap items-center gap-2">
                {(['is', 'ought'] as Array<StatementKind>).map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    disabled={phase1Done}
                    onClick={() => tag(s.id, kind)}
                    className={cn(
                      'rounded-lg border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors',
                      guess === kind
                        ? kind === 'is'
                          ? 'border-accent bg-accent/15 text-accent'
                          : 'border-accent-2/70 bg-accent-2/10 text-accent-2'
                        : 'border-border text-muted hover:text-ink',
                      phase1Done && 'cursor-default',
                    )}
                  >
                    {kind}
                  </button>
                ))}
                {phase1Done && (
                  <span className={cn('ml-auto text-xs font-semibold', correct ? 'text-success' : 'text-warn')}>
                    {correct ? `✓ ${s.answer.toUpperCase()}` : `✗ → ${s.answer.toUpperCase()}`}
                  </span>
                )}
              </div>
              {phase1Done && (
                <p className="mt-2 text-xs text-muted">{s.why}</p>
              )}
            </div>
          )
        })}
      </div>

      {!phase1Done && (
        <button
          type="button"
          disabled={!allTagged}
          onClick={() => setPhase1Done(true)}
          className={cn(
            'mt-4 w-full rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
            allTagged
              ? 'border-accent bg-accent/15 text-accent hover:bg-accent/25'
              : 'border-border text-muted cursor-not-allowed',
          )}
        >
          Check my tags
        </button>
      )}

      {phase1Done && (
        <div className="mt-4 rounded-xl border border-border bg-surface-2 p-3 text-sm">
          <p className="text-ink">
            <span className="font-semibold">{correctCount} / {STATEMENTS.length} correct.</span>{' '}
            {correctCount === STATEMENTS.length
              ? 'Perfect eye for the is/ought distinction.'
              : 'Review the notes above — the line can be subtle.'}
          </p>
          {!showArgument && (
            <button
              type="button"
              onClick={() => setShowArgument(true)}
              className="mt-3 rounded-xl border border-accent bg-accent/10 px-3 py-1.5 text-sm text-accent hover:bg-accent/20 transition-colors"
            >
              Now: spot the illicit jump →
            </button>
          )}
        </div>
      )}

      {showArgument && (
        <div className="mt-4 rounded-xl border border-warn/40 bg-surface-2 p-4">
          <p className="mb-3 text-sm font-semibold text-ink">The bad argument</p>
          <div className="space-y-2">
            {ARGUMENT.premises.map((p, i) => (
              <div
                key={p.id}
                className={cn(
                  'flex items-start gap-2 rounded-lg border px-3 py-2 text-sm',
                  p.kind === 'is'
                    ? 'border-accent/40 bg-accent/5 text-ink'
                    : 'border-warn/40 bg-warn/5 text-ink',
                )}
              >
                <span className={cn(
                  'mt-0.5 rounded-full px-1.5 py-0.5 text-xs font-bold uppercase shrink-0',
                  p.kind === 'is' ? 'bg-accent/20 text-accent' : 'bg-warn/20 text-warn',
                )}>
                  {p.kind}
                </span>
                <span>{i === 1 && <span className="font-semibold text-warn">∴ </span>}{p.text}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-border bg-surface px-3 py-2">
            <p className="text-xs text-muted">
              <span className="font-semibold text-ink">Missing value premise (hidden): </span>
              <span className="italic">"{ARGUMENT.missingPremise}"</span>
            </p>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            {ARGUMENT.explanation}
          </p>
        </div>
      )}
    </div>
  )
}
