import { useState } from 'react'
import { cn } from '#/lib/cn'

// The trolley problem in two framings. SWITCH: pull a lever to divert a runaway
// trolley, killing 1 to save 5. FOOTBRIDGE: push a large stranger off a bridge
// onto the tracks, killing 1 to save 5. The arithmetic is identical, yet most
// people pull the lever but refuse to push — framing flips the intuition. The
// demo tallies your two answers and reflects them back.
type Variant = 'switch' | 'bridge'

const SCENES: Record<Variant, { title: string; body: string; act: string; dont: string }> = {
  switch: {
    title: 'The Switch',
    body: 'A runaway trolley is hurtling toward five people tied to the track. You stand beside a lever. Pull it and the trolley diverts onto a side track — where one person is tied. Do you pull the lever?',
    act: 'Pull the lever (1 dies, 5 saved)',
    dont: 'Do nothing (5 die)',
  },
  bridge: {
    title: 'The Footbridge',
    body: 'Same runaway trolley, same five people. This time you’re on a footbridge above the track, beside a large stranger. The only way to stop the trolley is to push them off, onto the track, where their body would halt it. Do you push?',
    act: 'Push the stranger (1 dies, 5 saved)',
    dont: 'Do nothing (5 die)',
  },
}

export function TrolleyProblem() {
  const [variant, setVariant] = useState<Variant>('switch')
  const [answers, setAnswers] = useState<Record<Variant, boolean | null>>({ switch: null, bridge: null })
  const s = SCENES[variant]
  const ans = answers[variant]
  const bothAnswered = answers.switch !== null && answers.bridge !== null

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap gap-2 px-1">
        {(['switch', 'bridge'] as Array<Variant>).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVariant(v)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              variant === v ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {SCENES[v].title}
            {answers[v] !== null && ' ✓'}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-surface-2 p-3">
        <p className="text-sm font-semibold text-ink">{s.title}</p>
        <p className="mt-1 text-sm leading-snug text-muted">{s.body}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAnswers((a) => ({ ...a, [variant]: true }))}
            className={cn(
              'flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
              ans === true ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {s.act}
          </button>
          <button
            type="button"
            onClick={() => setAnswers((a) => ({ ...a, [variant]: false }))}
            className={cn(
              'flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
              ans === false ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {s.dont}
          </button>
        </div>
      </div>

      {bothAnswered && (
        <div className="mt-3 rounded-xl bg-surface-2 p-3">
          {answers.switch && !answers.bridge ? (
            <p className="text-sm leading-snug text-ink">
              You pulled the lever but wouldn’t push — like most people. The body count is identical, yet <span className="font-semibold">using a person as a means</span> (a physical tool to stop the trolley) feels far worse than a side effect of flipping a switch. Your fast, emotional moral intuition fires harder for the up-close, hands-on harm.
            </p>
          ) : answers.switch === answers.bridge ? (
            <p className="text-sm leading-snug text-ink">
              You answered the same way to both. That’s the rare, consistent stance: you weighed the identical arithmetic (1 vs 5) the same regardless of <span className="font-semibold">how</span> the harm is delivered. Most people don’t — which is exactly Kohlberg’s and the moral-psychology point: framing usually sways us.
            </p>
          ) : (
            <p className="text-sm leading-snug text-ink">
              Interesting — you found the footbridge <span className="font-semibold">easier</span> to act on than the switch. Whatever your pattern, the lesson holds: the two dilemmas are arithmetically identical, so any difference in your answers comes from <span className="font-semibold">framing</span>, not the numbers.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
