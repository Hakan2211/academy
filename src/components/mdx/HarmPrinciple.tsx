import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Mill's harm principle: state may restrict freedom ONLY to prevent harm to OTHERS.
// Self-regarding acts (affecting only yourself) are protected; other-harming acts may
// be legitimately restricted. Users judge each scenario, then see Mill's verdict.

type Scenario = {
  id: string
  action: string
  icon: string
  affects: 'self' | 'others' | 'both'
  millMayRestrict: boolean
  explanation: string
  affectsLabel: string
}

const SCENARIOS: Array<Scenario> = [
  {
    id: 'seatbelt',
    action: 'Not wearing a seatbelt while driving alone on an empty road',
    icon: 'Car',
    affects: 'self',
    millMayRestrict: false,
    affectsLabel: 'Affects: You only',
    explanation:
      'Pure self-regarding act. Mill would oppose mandatory seatbelt laws: the risk is yours alone. Paternalism — restricting freedom "for your own good" — is exactly what the harm principle forbids.',
  },
  {
    id: 'smoking-alone',
    action: 'Smoking cigarettes in your own home, alone, with windows closed',
    icon: 'Wind',
    affects: 'self',
    millMayRestrict: false,
    affectsLabel: 'Affects: You only',
    explanation:
      'Self-regarding act. The smoke harms no one but you. However unhealthy, your liberty to make that choice is protected — the state has no business intervening.',
  },
  {
    id: 'smoking-child',
    action: 'Smoking cigarettes next to a young child who cannot consent or leave',
    icon: 'Baby',
    affects: 'others',
    millMayRestrict: true,
    affectsLabel: 'Affects: A non-consenting third party',
    explanation:
      'Other-regarding act — the child is directly harmed by the smoke and cannot consent. This is precisely the kind of case the harm principle targets: the state may restrict the action to protect the third party.',
  },
  {
    id: 'loud-music',
    action: 'Playing loud music at 3 am in a dense apartment block',
    icon: 'Music',
    affects: 'others',
    millMayRestrict: true,
    affectsLabel: 'Affects: Sleeping neighbours',
    explanation:
      'Other-regarding act. Your neighbours cannot escape the noise; it disturbs their rest and peace. The harm principle permits noise ordinances here because the nuisance extends clearly beyond yourself.',
  },
  {
    id: 'protest',
    action: 'A peaceful public protest expressing unpopular views',
    icon: 'Megaphone',
    affects: 'self',
    millMayRestrict: false,
    affectsLabel: 'Affects: Others only through ideas',
    explanation:
      'Protected expression. Offence or discomfort at ideas is NOT harm under Mill\'s principle. Restricting speech merely because others dislike it violates liberty. Mill was one of history\'s strongest advocates for free expression.',
  },
  {
    id: 'fraud',
    action: 'Deceiving someone into a contract they would not otherwise have signed',
    icon: 'AlertTriangle',
    affects: 'others',
    millMayRestrict: true,
    affectsLabel: 'Affects: The deceived party',
    explanation:
      'Clear harm to another — the victim\'s autonomous choice is subverted by deception. Mill\'s principle permits prohibition: fraud violates the other person\'s liberty and well-being, not just your freedom to act.',
  },
  {
    id: 'diet',
    action: 'Eating an unhealthy diet that may shorten your own life',
    icon: 'Utensils',
    affects: 'self',
    millMayRestrict: false,
    affectsLabel: 'Affects: You only',
    explanation:
      'Quintessential self-regarding act. Mill would strongly oppose a "junk-food ban" aimed purely at protecting you from yourself. Adults have sovereignty over their own body and choices — even unwise ones.',
  },
  {
    id: 'pollution',
    action: 'A factory dumping untreated chemicals into a shared river',
    icon: 'Factory',
    affects: 'others',
    millMayRestrict: true,
    affectsLabel: 'Affects: Everyone who uses the river',
    explanation:
      'Classic other-harm. The factory imposes its costs on people downstream who bear health risks and loss of a shared resource. This is exactly what the harm principle is designed to address.',
  },
]

type UserAnswer = 'restrict' | 'allow' | null

export function HarmPrinciple() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const scenario = SCENARIOS[current]!
  const userAnswer = answers[scenario.id] ?? null
  const isRevealed = revealed[scenario.id] ?? false

  function answer(choice: UserAnswer) {
    setAnswers((prev) => ({ ...prev, [scenario.id]: choice }))
    setRevealed((prev) => ({ ...prev, [scenario.id]: true }))
  }

  const userCorrect =
    userAnswer !== null &&
    ((userAnswer === 'restrict' && scenario.millMayRestrict) ||
      (userAnswer === 'allow' && !scenario.millMayRestrict))

  const answeredCount = Object.keys(answers).length

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className="text-sm text-muted">
          For each action, decide: <span className="font-semibold text-ink">may the state restrict it?</span> Then see
          how Mill would answer using the harm principle.
        </p>
        <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
          {answeredCount}/{SCENARIOS.length}
        </span>
      </div>

      {/* Navigation dots */}
      <div className="mb-3 flex gap-1.5">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrent(i)}
            className={cn(
              'h-2 flex-1 rounded-full transition-colors',
              i === current
                ? 'bg-accent'
                : answers[s.id]
                  ? s.millMayRestrict === (answers[s.id] === 'restrict')
                    ? 'bg-success/60'
                    : 'bg-warn/60'
                  : 'bg-border',
            )}
          />
        ))}
      </div>

      {/* Scenario card */}
      <div className="rounded-xl border border-border bg-surface-2 p-4">
        <div className="mb-3 flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface">
            <Icon name={scenario.icon} size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink leading-snug">{scenario.action}</p>
            <p className="mt-1 text-xs text-muted">{scenario.affectsLabel}</p>
          </div>
        </div>

        {/* Self vs Other badge */}
        <div
          className={cn(
            'mb-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold',
            scenario.affects === 'self'
              ? 'bg-accent/10 text-accent'
              : 'bg-warn/15 text-warn',
          )}
        >
          <Icon name={scenario.affects === 'self' ? 'User' : 'Users'} size={12} />
          {scenario.affects === 'self' ? 'Self-regarding act' : 'Other-regarding act'}
        </div>

        {/* Answer buttons */}
        {!isRevealed && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => answer('restrict')}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-sm font-semibold text-muted transition-colors hover:border-warn/60 hover:text-ink"
            >
              <Icon name="Ban" size={15} />
              May restrict
            </button>
            <button
              type="button"
              onClick={() => answer('allow')}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-sm font-semibold text-muted transition-colors hover:border-success/60 hover:text-ink"
            >
              <Icon name="CheckCircle" size={15} />
              Must allow
            </button>
          </div>
        )}

        {/* Verdict */}
        {isRevealed && (
          <div
            className={cn(
              'rounded-xl border p-3',
              userCorrect
                ? 'border-success/40 bg-success/10'
                : 'border-warn/40 bg-warn/10',
            )}
          >
            <div className="mb-1 flex items-center gap-1.5 text-sm font-semibold">
              <Icon name={userCorrect ? 'CheckCircle' : 'XCircle'} size={15} />
              <span className={userCorrect ? 'text-success' : 'text-warn'}>
                {userCorrect ? 'Agrees with Mill' : 'Mill disagrees'}
              </span>
              <span className="ml-auto text-xs font-normal text-muted">
                Mill: {scenario.millMayRestrict ? 'May restrict' : 'Must allow'}
              </span>
            </div>
            <p className="text-xs text-ink leading-relaxed">{scenario.explanation}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-ink disabled:opacity-30"
        >
          <Icon name="ChevronLeft" size={14} />
          Prev
        </button>

        {/* Key insight */}
        <div className="flex-1 text-center text-[10px] text-muted leading-tight">
          <span className="font-semibold text-ink">The test:</span> harm to others → state may act · harm only to self → state must stay out
        </div>

        <button
          type="button"
          onClick={() => setCurrent((c) => Math.min(SCENARIOS.length - 1, c + 1))}
          disabled={current === SCENARIOS.length - 1}
          className="flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-ink disabled:opacity-30"
        >
          Next
          <Icon name="ChevronRight" size={14} />
        </button>
      </div>
    </div>
  )
}
