import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Two broad families of coping. PROBLEM-FOCUSED coping changes the stressor
// itself — make a plan, act, solve. EMOTION-FOCUSED coping changes how you feel
// about it — reframe, accept, seek comfort. Neither is "better": the rule of
// thumb is fit. When a problem is controllable, problem-focused coping shines;
// when it's genuinely beyond your control, emotion-focused coping protects you.
// Sort each move into its family and see whether it fits the situation.

type Kind = 'problem' | 'emotion'

type Move = { id: string; text: string; kind: Kind; explain: string }

const MOVES: Array<Move> = [
  { id: 'plan', text: 'Break a looming deadline into a step-by-step schedule', kind: 'problem', explain: 'Acting on the stressor itself — classic problem-focused coping, and a great fit because a deadline is controllable.' },
  { id: 'reframe', text: 'Reframe a rejection as “redirection” toward a better fit', kind: 'emotion', explain: 'Changing how you feel about the event rather than the event — emotion-focused reappraisal.' },
  { id: 'ask', text: 'Ask your manager directly for clearer instructions', kind: 'problem', explain: 'Taking concrete action to remove the source of stress — problem-focused.' },
  { id: 'breathe', text: 'Do slow breathing to calm a pre-exam panic', kind: 'emotion', explain: 'Soothing the emotional response — emotion-focused, useful for the feelings the exam stirs up.' },
  { id: 'accept', text: 'Accept a diagnosis you cannot change and grieve it', kind: 'emotion', explain: 'When a stressor is genuinely uncontrollable, acceptance is the healthier emotion-focused path.' },
  { id: 'fix', text: 'Fix the bug causing your app to keep crashing', kind: 'problem', explain: 'Directly eliminating the controllable cause — textbook problem-focused coping.' },
]

const FAMILIES: Record<Kind, { label: string; icon: string; color: string; blurb: string }> = {
  problem: { label: 'Problem-focused', icon: 'Wrench', color: 'var(--color-accent)', blurb: 'Change the stressor. Best when the problem is controllable.' },
  emotion: { label: 'Emotion-focused', icon: 'Heart', color: 'var(--color-accent-2)', blurb: 'Change how you feel. Best when the stressor is beyond your control.' },
}

export function CopingStrategies() {
  const [i, setI] = useState(0)
  const [choice, setChoice] = useState<Kind | null>(null)
  const m = MOVES[i]
  const correct = choice === m.kind

  const pick = (k: Kind) => {
    if (choice === null) setChoice(k)
  }
  const next = () => {
    setChoice(null)
    setI((v) => (v + 1) % MOVES.length)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-xs uppercase tracking-wide text-muted">Scenario {i + 1} of {MOVES.length}</p>
      <p className="mb-3 min-h-[3rem] rounded-xl bg-surface-2 px-3 py-2 text-sm font-medium text-ink">{m.text}</p>

      <div className="grid grid-cols-2 gap-2">
        {(['problem', 'emotion'] as Array<Kind>).map((k) => {
          const fam = FAMILIES[k]
          const chosen = choice === k
          const reveal = choice !== null
          const isAnswer = m.kind === k
          return (
            <button
              key={k}
              type="button"
              onClick={() => pick(k)}
              disabled={reveal}
              className={cn(
                'flex flex-col items-start gap-1 rounded-xl border px-3 py-2 text-left transition-colors',
                reveal && isAnswer
                  ? 'border-success bg-success/15'
                  : chosen
                    ? 'border-danger bg-danger/15'
                    : 'border-border bg-surface-2 enabled:hover:border-accent/40',
              )}
            >
              <span className="flex items-center gap-1.5" style={{ color: fam.color }}>
                <Icon name={fam.icon} size={15} />
                <span className="text-sm font-semibold">{fam.label}</span>
              </span>
              <span className="text-[11px] leading-tight text-muted">{fam.blurb}</span>
            </button>
          )
        })}
      </div>

      {choice !== null && (
        <div className="mt-3">
          <p className={cn('flex items-center gap-1.5 text-sm font-semibold', correct ? 'text-success' : 'text-danger')}>
            <Icon name={correct ? 'CheckCircle2' : 'XCircle'} size={15} />
            {correct ? 'Good sort' : `Actually: ${FAMILIES[m.kind].label}`}
          </p>
          <p className="mt-1 text-sm leading-snug text-muted">{m.explain}</p>
          <button
            type="button"
            onClick={next}
            className="mt-3 rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent"
          >
            Next scenario
          </button>
        </div>
      )}
    </div>
  )
}
