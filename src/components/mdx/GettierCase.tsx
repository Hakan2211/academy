import { useState } from 'react'
import { cn } from '#/lib/cn'
import { Icon } from '#/components/ui/Icon'

// The "stopped clock" Gettier case — stepped narrative.
// Henry is passing a clock, glances at it, believes it says 3:15. The clock
// has been stopped for exactly 12 hours. He looks at exactly the right moment.
// He has a JTB that is true only BY LUCK → it is NOT knowledge.

type StepData = {
  phase: 'belief' | 'justification' | 'truth' | 'reveal' | 'verdict'
  heading: string
  body: string
  highlight?: string
  icon: string
}

const STEPS: StepData[] = [
  {
    phase: 'belief',
    heading: 'The Belief',
    icon: 'Brain',
    body: 'Henry is walking past the town hall. He glances up at the large clock on the tower and forms the belief: "It is 3:15 in the afternoon."',
    highlight: 'Henry believes it is 3:15.',
  },
  {
    phase: 'justification',
    heading: 'The Justification',
    icon: 'ShieldCheck',
    body: 'Henry has excellent reasons for his belief. The clock has always been reliable. The time looks right for the position of the sun. He has no special reason to doubt it. His belief is fully justified — exactly what a rational person would believe in his position.',
    highlight: 'The belief is well-justified.',
  },
  {
    phase: 'truth',
    heading: 'The Truth',
    icon: 'CheckCircle',
    body: 'Here\'s the thing: it really IS 3:15. Henry\'s belief is true. The time on the clock matches the actual time perfectly.',
    highlight: 'The belief is also true.',
  },
  {
    phase: 'reveal',
    heading: 'The Twist',
    icon: 'AlertTriangle',
    body: 'But there\'s something Henry doesn\'t know: the clock stopped exactly 12 hours ago. It hasn\'t moved since 3:15 last night. Henry just happened to look at the clock at the one moment in 24 hours when a stopped clock reads the correct time.',
    highlight: 'The belief is true — but only by pure luck.',
  },
  {
    phase: 'verdict',
    heading: 'The Verdict',
    icon: 'Scale',
    body: 'Henry has a belief that is: ✓ True, ✓ Justified, ✓ Believed. According to the JTB analysis, he should have KNOWLEDGE. But surely he doesn\'t know what time it is — he\'s reading a broken clock! His belief is correct only by accident. This is a Gettier case: JTB is not enough for knowledge.',
    highlight: 'JTB ≠ Knowledge. Something more is needed.',
  },
]

const PHASE_COLORS: Record<StepData['phase'], string> = {
  belief: 'text-accent',
  justification: 'text-success',
  truth: 'text-success',
  reveal: 'text-warn',
  verdict: 'text-accent-2',
}

const PHASE_BG: Record<StepData['phase'], string> = {
  belief: 'bg-accent/15 border-accent/40',
  justification: 'bg-success/10 border-success/40',
  truth: 'bg-success/10 border-success/40',
  reveal: 'bg-warn/10 border-warn/40',
  verdict: 'bg-accent-2/10 border-accent-2/40',
}

export function GettierCase() {
  const [step, setStep] = useState(0)

  const current = STEPS[step]!
  const isLast = step === STEPS.length - 1

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Progress dots */}
      <div className="mb-4 flex items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s.phase}
            type="button"
            onClick={() => setStep(i)}
            className={cn(
              'h-2 rounded-full transition-all',
              i === step ? 'w-6 bg-accent' : i < step ? 'w-2 bg-accent/50' : 'w-2 bg-border',
            )}
            aria-label={s.heading}
          />
        ))}
      </div>

      {/* Step label */}
      <div className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-muted">
        Step {step + 1} of {STEPS.length}
      </div>

      {/* Card */}
      <div
        className={cn(
          'rounded-xl border p-4 transition-all',
          PHASE_BG[current.phase],
        )}
      >
        <div className={cn('mb-2 flex items-center gap-2 font-bold', PHASE_COLORS[current.phase])}>
          <Icon name={current.icon as Parameters<typeof Icon>[0]['name']} size={18} />
          {current.heading}
        </div>
        <p className="text-sm text-ink">{current.body}</p>
        {current.highlight && (
          <p className={cn('mt-3 text-sm font-semibold', PHASE_COLORS[current.phase])}>
            → {current.highlight}
          </p>
        )}
      </div>

      {/* JTB checklist */}
      {step >= 2 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(['Believed', 'Justified', 'True'] as const).map((label, i) => {
            const satisfied = step >= [0, 1, 2][i]!
            return (
              <div
                key={label}
                className={cn(
                  'rounded-lg border px-2 py-1.5 text-center text-xs font-semibold transition-colors',
                  satisfied
                    ? 'border-success/50 bg-success/10 text-success'
                    : 'border-border bg-surface-2 text-muted',
                )}
              >
                {satisfied ? '✓ ' : '○ '}{label}
              </div>
            )
          })}
        </div>
      )}

      {isLast && (
        <div className="mt-3 rounded-xl border border-accent-2/40 bg-accent-2/10 p-3 text-sm">
          <p className="font-semibold text-accent-2">Edmund Gettier (1963)</p>
          <p className="mt-1 text-muted">
            In a famous 3-page paper, Gettier refuted a definition of knowledge that philosophers had held
            for over 2,000 years. The search for a "fourth condition" — what turns mere lucky JTB into genuine
            knowledge — continues to this day.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-4 flex justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className={cn(
            'flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors',
            step === 0
              ? 'border-border text-muted opacity-40 cursor-not-allowed'
              : 'border-border text-muted hover:text-ink',
          )}
        >
          <Icon name="ChevronLeft" size={14} />
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={isLast}
          className={cn(
            'flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors',
            isLast
              ? 'border-border text-muted opacity-40 cursor-not-allowed'
              : 'border-accent bg-accent/15 text-accent hover:bg-accent/25',
          )}
        >
          Next
          <Icon name="ChevronRight" size={14} />
        </button>
      </div>
    </div>
  )
}
