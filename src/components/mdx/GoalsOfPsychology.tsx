import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The four goals of psychology, walked through on one everyday behaviour:
// describe -> explain -> predict -> control (change). A simple Back/Next stepper.
const STAGES = [
  {
    goal: 'Describe',
    icon: 'Eye',
    q: 'What happens?',
    body: 'A student keeps putting off an essay until the night before it is due. We carefully observe and record the behaviour — when it happens, how often, what it looks like — without yet guessing why.',
  },
  {
    goal: 'Explain',
    icon: 'Lightbulb',
    q: 'Why does it happen?',
    body: 'We propose a reason: the essay triggers anxiety, and delaying it brings instant relief. That relief reinforces the delay. A good explanation is testable, not just a story.',
  },
  {
    goal: 'Predict',
    icon: 'TrendingUp',
    q: 'When will it happen again?',
    body: 'If the anxiety-relief idea is right, we predict the student will procrastinate most on the tasks that feel most threatening — and less on easy, low-stakes ones. Now we can test it.',
  },
  {
    goal: 'Control',
    icon: 'SlidersHorizontal',
    q: 'Can we change it?',
    body: 'Using what we learned, we intervene: break the essay into tiny, non-scary steps so starting no longer triggers anxiety. If procrastination drops, our explanation gains support. This is psychology applied.',
  },
]

export function GoalsOfPsychology() {
  const [i, setI] = useState(0)
  const s = STAGES[i]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        {STAGES.map((st, k) => (
          <div key={st.goal} className="flex flex-1 flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => setI(k)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full border transition-colors',
                k === i
                  ? 'border-accent bg-accent/15 text-accent'
                  : k < i
                    ? 'border-accent/40 text-accent/70'
                    : 'border-border text-muted',
              )}
            >
              <Icon name={st.icon} size={18} />
            </button>
            <span className={cn('text-[10px]', k === i ? 'text-ink' : 'text-muted')}>{st.goal}</span>
          </div>
        ))}
      </div>

      <div className="min-h-[150px] rounded-xl bg-surface-2 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          Goal {i + 1}: {s.goal}
        </p>
        <p className="mt-0.5 text-lg font-semibold text-ink">{s.q}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-muted enabled:hover:text-ink disabled:opacity-40"
        >
          Back
        </button>
        <span className="text-xs text-muted">{i + 1} of {STAGES.length}</span>
        <button
          type="button"
          onClick={() => setI((v) => Math.min(STAGES.length - 1, v + 1))}
          disabled={i === STAGES.length - 1}
          className="rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
