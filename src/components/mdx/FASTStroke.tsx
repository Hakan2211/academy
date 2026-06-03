import { useState } from 'react'
import { cn } from '#/lib/cn'

// FAST stroke recognition stepper for the Health island — first-aid-and-safety world.
// Walks through Face → Arms → Speech → Time, with a check for each sign.
// Any single positive sign = call emergency services immediately.

type FASTStep = {
  letter: string
  label: string
  icon: string
  instruction: string
  positiveSign: string
  negativeSign: string
  detail: string
}

const FAST_STEPS: FASTStep[] = [
  {
    letter: 'F',
    label: 'Face',
    icon: '😶',
    instruction: 'Ask the person to smile. Look at both sides of their face.',
    positiveSign: 'One side of the face droops or does not move — the smile is uneven.',
    negativeSign: 'Both sides of the face move equally and the smile is symmetric.',
    detail: 'Facial drooping on one side occurs because a stroke can affect the motor nerves controlling facial muscles. Even subtle asymmetry is significant.',
  },
  {
    letter: 'A',
    label: 'Arms',
    icon: '💪',
    instruction: 'Ask them to raise both arms and hold them up for 10 seconds.',
    positiveSign: 'One arm drifts downwards, cannot be raised, or is weak compared to the other.',
    negativeSign: 'Both arms stay level and equally strong.',
    detail: 'Arm weakness or drift on one side points to motor-cortex or motor-pathway damage in the brain — a hallmark of stroke affecting one hemisphere.',
  },
  {
    letter: 'S',
    label: 'Speech',
    icon: '💬',
    instruction: 'Ask them to repeat a simple sentence: "The sky is blue today."',
    positiveSign: 'Speech is slurred, confused, jumbled, hard to understand, or they cannot speak at all.',
    negativeSign: 'They repeat the sentence clearly and correctly without difficulty.',
    detail: 'The speech and language centres are in a specific part of the brain (usually the left hemisphere). A stroke disrupting blood supply there causes dysarthria or aphasia — slurred or garbled speech.',
  },
  {
    letter: 'T',
    label: 'Time',
    icon: '⏱️',
    instruction: 'If ANY of the above signs are present, note the time and act immediately.',
    positiveSign: 'Any one positive sign above means: call emergency services RIGHT NOW.',
    negativeSign: 'All signs normal — continue monitoring. Symptoms can develop quickly; if in doubt, call.',
    detail: '"Time is brain." Every minute of stroke, approximately 1.9 million neurons are lost. Clot-busting treatment (thrombolysis) must be given within a narrow time window — usually within 4.5 hours of symptom onset. Speed is everything.',
  },
]

type CheckState = 'yes' | 'no' | null

export function FASTStroke() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [checks, setChecks] = useState<CheckState[]>([null, null, null, null])

  const step = FAST_STEPS[activeIdx]
  const check = checks[activeIdx]
  const anyPositive = checks.slice(0, 3).some((c) => c === 'yes')

  function setCheck(val: 'yes' | 'no') {
    const next = [...checks] as CheckState[]
    next[activeIdx] = val
    setChecks(next)
  }

  function reset() {
    setActiveIdx(0)
    setChecks([null, null, null, null])
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Letter pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FAST_STEPS.map((s, i) => {
          const c = checks[i]
          return (
            <button
              key={s.letter}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold transition-colors',
                i === activeIdx && c === null && 'border-accent bg-accent/15 text-accent',
                i !== activeIdx && c === null && 'border-border text-muted hover:text-ink',
                c === 'yes' && 'border-warn bg-warn/15 text-warn',
                c === 'no' && 'border-accent bg-accent/10 text-accent',
              )}
            >
              {s.letter}
            </button>
          )
        })}
        <span className="self-center text-xs text-muted">{step.label}</span>
      </div>

      {/* Step card */}
      <div className="rounded-xl border border-border bg-surface-2 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-2xl">{step.icon}</span>
          <p className="font-semibold text-ink">
            {step.letter} — {step.label}
          </p>
        </div>
        <p className="mb-3 text-sm text-muted">{step.instruction}</p>
        <p className="mb-4 text-xs leading-relaxed text-ink/80">{step.detail}</p>

        {/* Check buttons */}
        {check === null && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCheck('yes')}
              className="flex-1 rounded-xl border border-warn/50 px-3 py-2 text-sm font-medium text-warn transition-colors hover:bg-warn/10"
            >
              ⚠ Sign Present (Yes)
            </button>
            <button
              type="button"
              onClick={() => setCheck('no')}
              className="flex-1 rounded-xl border border-border px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
            >
              ✓ Normal (No)
            </button>
          </div>
        )}

        {/* Outcome */}
        {check !== null && (
          <div
            className={cn(
              'rounded-xl border px-4 py-3 text-sm',
              check === 'yes' ? 'border-warn/50 bg-warn/10 text-ink' : 'border-accent/40 bg-accent/10 text-ink',
            )}
          >
            <span className={cn('font-semibold', check === 'yes' ? 'text-warn' : 'text-accent')}>
              {check === 'yes' ? 'Sign present — ' : 'Normal — '}
            </span>
            {check === 'yes' ? step.positiveSign : step.negativeSign}
          </div>
        )}
      </div>

      {/* Emergency banner — triggered when any of F/A/S is positive */}
      {anyPositive && (
        <div className="mt-3 rounded-xl border-2 border-warn bg-warn/15 px-4 py-3 text-center">
          <p className="text-sm font-bold text-warn">CALL EMERGENCY SERVICES NOW</p>
          <p className="mt-0.5 text-xs text-warn/80">
            One or more FAST signs are present. Note the exact time symptoms started. Do not give food or drink.
            Stay with the person until help arrives.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-3 flex justify-between">
        <button
          type="button"
          disabled={activeIdx === 0}
          onClick={() => setActiveIdx((i) => i - 1)}
          className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30"
        >
          ← Back
        </button>
        {activeIdx < FAST_STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setActiveIdx((i) => i + 1)}
            className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-ink"
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-ink"
          >
            Reset
          </button>
        )}
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        FAST is a screening aid. If you are ever unsure, call emergency services — it is always better to be safe.
      </p>
    </div>
  )
}
