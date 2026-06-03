import { useState } from 'react'
import { cn } from '#/lib/cn'

// DRABC primary survey stepper for the Health island — first-aid-and-safety world.
// Walks through Danger → Response → Airway → Breathing → Circulation (+ Call),
// showing what to check and what each yes/no outcome means.

type SurveyStep = {
  letter: string
  label: string
  question: string
  checkList: string[]
  yesOutcome: string
  noOutcome: string
  callout?: string
}

const STEPS: SurveyStep[] = [
  {
    letter: 'D',
    label: 'Danger',
    question: 'Is the scene safe for you and the casualty?',
    checkList: [
      'Look for traffic, fire, toxic fumes, unstable structures',
      'Check for electricity, sharp objects, or falling hazards',
      'Make sure bystanders are also out of harm\'s way',
    ],
    yesOutcome: 'Scene is safe — proceed to check the casualty.',
    noOutcome: 'Do NOT approach. Make the scene safe first, or call emergency services and wait for trained help.',
    callout: 'Your own safety comes first. A second casualty helps no one.',
  },
  {
    letter: 'R',
    label: 'Response',
    question: 'Does the casualty respond to you?',
    checkList: [
      'Tap their shoulders firmly and ask loudly: "Are you okay?"',
      'Watch for eye opening, speech, or any movement',
      'Do not shake the head or neck (possible spinal injury)',
    ],
    yesOutcome: 'They are conscious — keep talking to them, monitor, and call for help if needed.',
    noOutcome: 'Unresponsive — shout for help, call emergency services immediately, then continue the survey.',
  },
  {
    letter: 'A',
    label: 'Airway',
    question: 'Is the airway open and clear?',
    checkList: [
      'Tilt the head back gently and lift the chin (head-tilt chin-lift)',
      'Look in the mouth — remove any obvious obstruction if safe to do so',
      'Do not do a blind finger sweep',
    ],
    yesOutcome: 'Airway is open — move to check breathing.',
    noOutcome: 'Carefully open the airway with head-tilt chin-lift, then reassess.',
  },
  {
    letter: 'B',
    label: 'Breathing',
    question: 'Is the casualty breathing normally?',
    checkList: [
      'Look for chest rise, listen for breath sounds, feel for airflow on your cheek',
      'Check for up to 10 seconds',
      'Occasional gasps (agonal breathing) are NOT normal breathing',
    ],
    yesOutcome: 'Breathing — place in the recovery position and call emergency services if not already done.',
    noOutcome: 'Not breathing — begin CPR (30 compressions : 2 rescue breaths) and call emergency services immediately.',
  },
  {
    letter: 'C',
    label: 'Circulation',
    question: 'Are there signs of severe bleeding or circulation problems?',
    checkList: [
      'Look for major bleeding — apply firm direct pressure to the wound',
      'Check skin colour and temperature (pale, cold, clammy = shock)',
      'If CPR is in progress, continue until help arrives',
    ],
    yesOutcome: 'Control bleeding with firm pressure and keep the person warm and still. Help is on the way.',
    noOutcome: 'No major bleeding — monitor closely and keep reassessing DRABC until help arrives.',
  },
]

export function PrimarySurvey() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [outcome, setOutcome] = useState<'yes' | 'no' | null>(null)

  const step = STEPS[activeIdx]

  function goTo(idx: number) {
    setActiveIdx(idx)
    setOutcome(null)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Step pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s.letter}
            type="button"
            onClick={() => goTo(i)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold transition-colors',
              i === activeIdx
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {s.letter}
          </button>
        ))}
        <span className="self-center text-xs text-muted">
          {activeIdx + 1} / {STEPS.length} — {step.label}
        </span>
      </div>

      {/* Question card */}
      <div className="rounded-xl border border-border bg-surface-2 p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
          {step.letter} — {step.label}
        </p>
        <p className="mb-3 text-sm font-semibold text-ink">{step.question}</p>

        {step.callout && (
          <div className="mb-3 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-ink">
            {step.callout}
          </div>
        )}

        <ul className="mb-4 space-y-1 text-xs text-muted">
          {step.checkList.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-0.5 text-accent">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Yes / No buttons */}
        {outcome === null && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOutcome('yes')}
              className="flex-1 rounded-xl border border-border px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
            >
              ✓ Yes
            </button>
            <button
              type="button"
              onClick={() => setOutcome('no')}
              className="flex-1 rounded-xl border border-border px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-warn hover:text-warn"
            >
              ✗ No
            </button>
          </div>
        )}

        {/* Outcome */}
        {outcome !== null && (
          <div
            className={cn(
              'mt-1 rounded-xl border px-4 py-3 text-sm',
              outcome === 'yes'
                ? 'border-accent/40 bg-accent/10 text-ink'
                : 'border-warn/50 bg-warn/10 text-ink',
            )}
          >
            <span className={cn('font-semibold', outcome === 'yes' ? 'text-accent' : 'text-warn')}>
              {outcome === 'yes' ? 'Yes: ' : 'No: '}
            </span>
            {outcome === 'yes' ? step.yesOutcome : step.noOutcome}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-3 flex justify-between">
        <button
          type="button"
          disabled={activeIdx === 0}
          onClick={() => goTo(activeIdx - 1)}
          className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30"
        >
          ← Previous
        </button>
        <button
          type="button"
          disabled={activeIdx === STEPS.length - 1}
          onClick={() => goTo(activeIdx + 1)}
          className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30"
        >
          Next →
        </button>
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        DRABC is a memory aid — always call emergency services early and take a certified first-aid course.
      </p>
    </div>
  )
}
