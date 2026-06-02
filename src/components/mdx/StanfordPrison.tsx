import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A guided stepper through the Stanford Prison Experiment (Zimbardo, 1971):
// setup → escalation → shutdown → the lessons and the ethical reckoning. Frames
// the power of the situation alongside obedience and conformity, and ties the
// fallout back to research-ethics. Used in good-and-evil.

const STAGES: Array<{ phase: string; day: string; icon: string; title: string; body: string }> = [
  {
    phase: 'Setup',
    day: 'The plan',
    icon: 'ClipboardList',
    title: 'Ordinary students, randomly assigned',
    body: 'Twenty-four mentally healthy male volunteers were screened and then, by the flip of a coin, made "guards" or "prisoners" in a mock prison built in a Stanford basement. Nothing about the two groups differed — only the role they were handed. Zimbardo himself played the prison superintendent.',
  },
  {
    phase: 'Escalation',
    day: 'Days 1–2',
    icon: 'TrendingUp',
    title: 'The roles take hold — fast',
    body: 'Within a day, guards grew controlling and then cruel: stripping prisoners of names for numbers, ordering push-ups, denying the bathroom, using humiliation as a tool. Prisoners became passive, anxious, and rebellious in turns. People sank into roles that, days earlier, had been arbitrary labels.',
  },
  {
    phase: 'Escalation',
    day: 'Days 3–5',
    icon: 'AlertTriangle',
    title: 'Breakdown',
    body: 'The simulation blurred into something real. Several prisoners had acute emotional breakdowns and had to be released early. Guards escalated their abuse, especially at night when they believed no one was watching. Even the researchers were being absorbed into the fiction they had built.',
  },
  {
    phase: 'Shutdown',
    day: 'Day 6',
    icon: 'OctagonX',
    title: 'Stopped after 6 of a planned 14 days',
    body: 'A graduate student, Christina Maslach, visited, was horrified by what she saw, and challenged Zimbardo. He realised how far he had drifted from the role of scientist and ended the study early. The famous conclusion: the situation — not bad apples — had driven good people to do harm.',
  },
  {
    phase: 'Lessons',
    day: 'The takeaway',
    icon: 'Lightbulb',
    title: 'The power of the situation',
    body: 'Alongside Milgram and Asch, the study became a parable for situationism: roles, uniforms, anonymity and an authorising context can pull ordinary people toward cruelty. Decades later it also drew sharp criticism — small unrepresentative sample, coached guards, demand characteristics, no replication — so read it as a vivid hypothesis, not a settled proof.',
  },
  {
    phase: 'Ethics',
    day: 'The reckoning',
    icon: 'Scale',
    title: 'What it cost — and what it changed',
    body: 'Participants suffered real psychological harm; the researcher lost the objectivity needed to protect them; consent never covered this degree of distress. Together with Milgram, it helped force modern safeguards: independent review boards, genuine informed consent, the right to withdraw, and protection from harm. The knowledge was real — but so was the price, and that price rewrote the rules.',
  },
]

export function StanfordPrison() {
  const [i, setI] = useState(0)
  const s = STAGES[i]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      {/* phase rail */}
      <div className="mb-3 flex items-center gap-1">
        {STAGES.map((st, k) => (
          <button
            key={k}
            type="button"
            onClick={() => setI(k)}
            aria-label={st.phase}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              k === i ? 'bg-accent' : k < i ? 'bg-accent/40' : 'bg-border',
            )}
          />
        ))}
      </div>

      <div className="min-h-[208px] rounded-xl bg-surface-2 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Icon name={s.icon} size={18} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              {s.phase} · {s.day}
            </p>
            <p className="text-base font-semibold text-ink">{s.title}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
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
        <span className="text-xs text-muted">
          {i + 1} of {STAGES.length}
        </span>
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
