import { useState } from 'react'
import { cn } from '#/lib/cn'

// TrolleyVariants — three variants of the trolley problem, each contrasting how
// identical arithmetic produces different moral intuitions depending on HOW harm
// is delivered. Centerpiece: switch vs footbridge. Third: the loop variant.

type VariantId = 'switch' | 'footbridge' | 'loop'
type Choice = 'act' | 'abstain' | null

type Variant = {
  id: VariantId
  title: string
  description: string
  actLabel: string
  abstainLabel: string
  surveyAct: number   // % of surveyed people who choose to act
  whyItDiffers: string
  doctrinNote: string
}

const VARIANTS: Array<Variant> = [
  {
    id: 'switch',
    title: 'The Switch',
    description:
      'A runaway trolley is heading toward five people tied to the track. You stand beside a lever. Pull it and the trolley diverts onto a side track — where one person is tied. You can pull the lever (diverting the trolley, killing the one) or do nothing (five die).',
    actLabel: 'Pull the lever (1 dies, 5 saved)',
    abstainLabel: 'Do nothing (5 die)',
    surveyAct: 85,
    whyItDiffers:
      'Most people pull. The harm to the one is a foreseen side-effect of redirecting an existing threat — not an intended means to an end. You are changing where the trolley goes, not using anyone as a tool.',
    doctrinNote:
      'Doctrine of double effect: you intend to save five; the one death is foreseen but not chosen as your means. Many deontologists permit this.',
  },
  {
    id: 'footbridge',
    title: 'The Footbridge',
    description:
      'Same trolley, same five people. Now you are on a footbridge above the track, standing beside a large stranger. The only way to stop the trolley is to push the stranger off the bridge — their body is large enough to halt it. Same arithmetic: one dies, five are saved.',
    actLabel: 'Push the stranger (1 dies, 5 saved)',
    abstainLabel: 'Do nothing (5 die)',
    surveyAct: 12,
    whyItDiffers:
      'Most people refuse — even though the numbers are identical to the switch. The moral difference: you use the stranger\'s body as a means, a trolley-stopper. Their death is not a side-effect; it is your instrument. This triggers the "using a person" alarm in moral intuition.',
    doctrinNote:
      'Doctrine of double effect: the stranger\'s death IS intended as the means. Many deontologists forbid this. Kant\'s Formula of Humanity: do not treat persons merely as means.',
  },
  {
    id: 'loop',
    title: 'The Loop Track',
    description:
      'The side track loops back and rejoins the main track ahead of the five people. If you divert the trolley, it will loop around and still hit the five — unless the one person on the side track stops it. Pulling the lever diverts the trolley; only the one person\'s body stops it from looping back. One dies, five saved.',
    actLabel: 'Pull the lever (trolley stopped by 1, 5 saved)',
    abstainLabel: 'Do nothing (5 die)',
    surveyAct: 56,
    whyItDiffers:
      'The loop variant is designed to probe the switch intuition: here, the one person\'s body IS the causal means that stops the trolley from killing the five. If your justification of the switch relied on "the one\'s death is a mere side-effect," the loop challenges that — their death is now load-bearing in the causal chain, like in the footbridge.',
    doctrinNote:
      'Thomson introduced the loop to test whether the doctrine of double effect does real work. Here, the one death functions as a means, not a side-effect — making the loop case structurally closer to the footbridge than the original switch.',
  },
]

export function TrolleyVariants() {
  const [activeId, setActiveId] = useState<VariantId>('switch')
  const [choices, setChoices] = useState<Record<VariantId, Choice>>({
    switch: null,
    footbridge: null,
    loop: null,
  })
  const [showAnalysis, setShowAnalysis] = useState(false)

  const variant = VARIANTS.find((v) => v.id === activeId)!
  const choice = choices[activeId]
  const allAnswered =
    choices.switch !== null && choices.footbridge !== null && choices.loop !== null

  function choose(c: Choice) {
    setChoices((prev) => ({ ...prev, [activeId]: c }))
    setShowAnalysis(true)
  }

  const switchChoice = choices.switch
  const bridgeChoice = choices.footbridge
  const bothSwitchAndBridge =
    switchChoice !== null && bridgeChoice !== null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Variant tabs */}
      <p className="mb-3 text-sm text-muted">
        Three variants — same arithmetic, different intuitions. Make a choice in each, then compare.
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => { setActiveId(v.id); setShowAnalysis(choices[v.id] !== null) }}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              activeId === v.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {v.title}
            {choices[v.id] !== null && (
              <span className="ml-1 text-xs opacity-70">
                {choices[v.id] === 'act' ? '↑' : '×'}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Scenario card */}
      <div className="mb-4 rounded-xl border border-border bg-surface-2 p-3">
        <p className="mb-1 text-sm font-semibold text-ink">{variant.title}</p>
        <p className="text-sm leading-relaxed text-muted">{variant.description}</p>
      </div>

      {/* Choice buttons */}
      {choice === null && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => choose('act')}
            className="flex-1 rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-ink"
          >
            {variant.actLabel}
          </button>
          <button
            type="button"
            onClick={() => choose('abstain')}
            className="flex-1 rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:border-border hover:text-ink"
          >
            {variant.abstainLabel}
          </button>
        </div>
      )}

      {/* Post-choice display */}
      {choice !== null && (
        <div className="space-y-3">
          {/* What you chose */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => choose('act')}
              className={cn(
                'flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors',
                choice === 'act'
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border text-muted',
              )}
            >
              {variant.actLabel}
            </button>
            <button
              type="button"
              onClick={() => choose('abstain')}
              className={cn(
                'flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors',
                choice === 'abstain'
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border text-muted',
              )}
            >
              {variant.abstainLabel}
            </button>
          </div>

          {/* Survey bar */}
          <div className="rounded-xl border border-border bg-surface-2 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              How most people respond
            </p>
            <div className="space-y-1.5">
              {[
                { label: 'Act', pct: variant.surveyAct, isAct: true },
                { label: 'Do nothing', pct: 100 - variant.surveyAct, isAct: false },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-0.5 flex justify-between text-xs text-muted">
                    <span className={cn(choice === (row.isAct ? 'act' : 'abstain') ? 'font-semibold text-accent' : '')}>
                      {row.label}
                      {choice === (row.isAct ? 'act' : 'abstain') ? ' ← your choice' : ''}
                    </span>
                    <span>{row.pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface">
                    <div
                      className={cn('h-full rounded-full transition-all', row.isAct ? 'bg-accent' : 'bg-border')}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis */}
          {showAnalysis && (
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-3 text-sm">
              <p className="mb-1 font-semibold text-ink">Why intuitions differ here</p>
              <p className="mb-2 leading-relaxed text-muted">{variant.whyItDiffers}</p>
              <p className="rounded-lg bg-surface-2 px-3 py-2 text-xs leading-relaxed text-muted">
                <span className="font-semibold text-ink">Philosophical lens: </span>
                {variant.doctrinNote}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Cross-variant comparison — only shown after both switch and footbridge answered */}
      {bothSwitchAndBridge && (
        <div className="mt-4 rounded-xl border border-accent-2/30 bg-surface-2 p-3 text-sm">
          <p className="mb-1 font-semibold text-ink">The key contrast: Switch vs Footbridge</p>
          {switchChoice === 'act' && bridgeChoice === 'abstain' ? (
            <p className="leading-relaxed text-muted">
              You pulled the lever but would not push — the most common pattern. The arithmetic is
              identical (1 dies, 5 saved), yet something morally relevant differs.{' '}
              <span className="text-ink">
                Redirecting a threat is not the same as using a person as your instrument.
              </span>{' '}
              The footbridge case triggers the intuition that the stranger's body is a tool, not just
              an unfortunate obstacle — and that feels like a crossing a fundamental line.
            </p>
          ) : switchChoice === bridgeChoice ? (
            <p className="leading-relaxed text-muted">
              You were consistent across both cases. You either weight the arithmetic equally
              regardless of method (pure consequentialist thinking), or you find both equally
              prohibited. Either way, you resisted the framing effect that sways most people. The
              philosophical question: is that consistency a virtue — or does it miss something morally
              real about the distinction between{' '}
              <span className="text-ink">using someone as a means</span> versus{' '}
              <span className="text-ink">foreseeing their death as a side-effect</span>?
            </p>
          ) : (
            <p className="leading-relaxed text-muted">
              You found the footbridge easier to act on than the switch. Whatever your reasoning, the
              key question remains: is there a morally relevant difference between redirecting a threat
              and using a person's body as a tool? If yes, your switch/bridge answers should differ.
              If no — the arithmetic alone decides — they should not.
            </p>
          )}
        </div>
      )}

      {allAnswered && (
        <p className="mt-3 text-center text-xs text-muted">
          All three variants answered. The moral differences are not in the numbers — they are in
          how harm is caused and whom it uses.
        </p>
      )}
    </div>
  )
}
