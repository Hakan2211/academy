import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The FRIES model of consent (Freely given, Reversible, Informed, Enthusiastic,
// Specific). Presents the five criteria and scenario-based reflection on whether
// each is met — consent is present only when all five hold.

type Criterion = {
  letter: string
  word: string
  color: string
  meaning: string
  detail: string
}

const FRIES: Array<Criterion> = [
  {
    letter: 'F',
    word: 'Freely given',
    color: '#FD79A8',
    meaning: 'Given without pressure, manipulation, or fear',
    detail: 'Consent cannot be the result of coercion, threats, or someone exploiting a position of power. It must come from a genuine free choice, with no negative consequences for saying no.',
  },
  {
    letter: 'R',
    word: 'Reversible',
    color: '#A29BFE',
    meaning: 'Can be withdrawn at any time — even mid-activity',
    detail: 'Saying yes once does not mean yes forever. Anyone can change their mind at any point, and that decision must always be respected without argument or pressure.',
  },
  {
    letter: 'I',
    word: 'Informed',
    color: '#00B894',
    meaning: 'Based on accurate information',
    detail: "Consent given based on false information — such as lies about who someone is, or removing protection without telling the other person — is not valid consent.",
  },
  {
    letter: 'E',
    word: 'Enthusiastic',
    color: '#FDCB6E',
    meaning: 'A clear, positive yes — not just the absence of no',
    detail: 'Silence, freezing, or not saying no does not equal consent. The goal is an active, willing, positive indication of wanting to participate.',
  },
  {
    letter: 'S',
    word: 'Specific',
    color: '#E17055',
    meaning: 'Saying yes to one thing does not mean yes to everything',
    detail: "Consent to one activity does not carry over to other activities. Each new act needs its own agreement. Consent in one relationship doesn't automatically apply to another.",
  },
]

type Scenario = {
  id: string
  text: string
  failedCriteria: Array<string> // letter keys that fail
  explanation: string
}

const SCENARIOS: Array<Scenario> = [
  {
    id: 'pressure',
    text: "Alex keeps asking after being told no, saying 'come on, just this once' until the other person eventually says yes to make it stop.",
    failedCriteria: ['F', 'E'],
    explanation: 'Consent gained through repeated pressure is not freely given, and a reluctant "yes" to end the harassment is not enthusiastic.',
  },
  {
    id: 'clear-yes',
    text: "Both people talk openly, both say they want to, and either of them can pause or stop at any point.",
    failedCriteria: [],
    explanation: 'All five FRIES criteria are met here. Consent is clear, mutual, and ongoing.',
  },
  {
    id: 'withdrawal',
    text: "Someone says yes at the start but then asks to stop. Their partner continues anyway.",
    failedCriteria: ['R'],
    explanation: 'Consent was withdrawn. Once someone asks to stop, all previous consent is revoked — continuing is not acceptable.',
  },
  {
    id: 'misinformation',
    text: "Someone agrees based on a promise that turns out to be false.",
    failedCriteria: ['I'],
    explanation: "Consent based on deception is not informed consent. It is not valid.",
  },
]

export function ConsentChecklist() {
  const [activeScenario, setActiveScenario] = useState<string | null>(null)
  const [activeCriterion, setActiveCriterion] = useState<string | null>(null)

  const scenario = SCENARIOS.find((s) => s.id === activeScenario) ?? null
  const criterion = FRIES.find((f) => f.letter === activeCriterion) ?? null

  const consentPresent = scenario !== null && scenario.failedCriteria.length === 0

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* FRIES letters */}
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        The FRIES model — tap a letter to explore
      </p>
      <div className="mb-4 flex gap-2">
        {FRIES.map((f) => {
          const sel = activeCriterion === f.letter
          const failedInScenario = scenario?.failedCriteria.includes(f.letter) ?? false
          return (
            <button
              key={f.letter}
              type="button"
              onClick={() => setActiveCriterion(sel ? null : f.letter)}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 rounded-xl border py-2 text-xs font-bold transition-colors',
                sel
                  ? 'border-accent bg-accent/15 text-accent'
                  : failedInScenario
                    ? 'border-warn/60 bg-warn/10 text-warn'
                    : 'border-border text-muted hover:text-ink',
              )}
              style={
                sel
                  ? { borderColor: f.color, backgroundColor: f.color + '22', color: f.color }
                  : {}
              }
            >
              <span className="text-base">{f.letter}</span>
              <span className="text-[9px] leading-tight">{f.word.split(' ')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* Criterion detail */}
      {criterion && (
        <div
          className="mb-4 rounded-xl border p-3"
          style={{ borderColor: criterion.color + '55', background: criterion.color + '12' }}
        >
          <p className="font-semibold" style={{ color: criterion.color }}>
            {criterion.letter} — {criterion.word}
          </p>
          <p className="mt-0.5 text-xs font-medium text-ink">{criterion.meaning}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{criterion.detail}</p>
        </div>
      )}

      {/* Scenarios */}
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Scenarios — which FRIES criteria are present?
      </p>
      <div className="mb-3 space-y-2">
        {SCENARIOS.map((s) => {
          const sel = activeScenario === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveScenario(sel ? null : s.id)}
              className={cn(
                'w-full rounded-xl border px-3 py-2 text-left text-xs leading-snug transition-colors',
                sel
                  ? 'border-accent bg-accent/10 text-ink'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              {s.text}
            </button>
          )
        })}
      </div>

      {/* Scenario result */}
      {scenario && (
        <div
          className={cn(
            'rounded-xl border p-3',
            consentPresent ? 'border-success/50 bg-success/10' : 'border-warn/50 bg-warn/10',
          )}
        >
          <div className="mb-1 flex items-center gap-2">
            <Icon name={consentPresent ? 'CheckCircle' : 'XCircle'} size={16} />
            <p className={cn('text-sm font-semibold', consentPresent ? 'text-success' : 'text-warn')}>
              {consentPresent ? 'All FRIES criteria met — consent is present' : 'Consent is not present'}
            </p>
          </div>
          {!consentPresent && (
            <div className="mb-1 flex flex-wrap gap-1">
              {scenario.failedCriteria.map((ltr) => {
                const f = FRIES.find((x) => x.letter === ltr)
                return (
                  <span
                    key={ltr}
                    className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ background: (f?.color ?? '#888') + '22', color: f?.color ?? '#888' }}
                  >
                    {ltr} — {f?.word}
                  </span>
                )
              })}
            </div>
          )}
          <p className="text-xs leading-relaxed text-muted">{scenario.explanation}</p>
        </div>
      )}

      <p className="mt-3 text-center text-xs text-muted">
        Consent is ongoing — it can be withdrawn at any time and must be re-established for each new activity.
      </p>
    </div>
  )
}
