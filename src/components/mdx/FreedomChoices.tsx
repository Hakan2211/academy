import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Radical freedom made tangible: in each situation it feels like there is "no choice,"
// but the existentialist reveals the hidden choices inside every "forced" situation.
// Kierkegaard's "dizziness of freedom" frames the anxiety this awareness produces.

type Situation = {
  id: string
  setup: string
  feeling: string
  hiddenChoices: Array<string>
  kierkegaard: string
}

const SITUATIONS: Array<Situation> = [
  {
    id: 'rules',
    setup: 'You follow the law and pay your taxes.',
    feeling: '"I have no choice — it\'s the law."',
    hiddenChoices: [
      'You could break the law and accept the consequences.',
      'You could move to a different jurisdiction.',
      'You could engage in civil disobedience and challenge the law publicly.',
      'You could choose to comply — and that compliance is your decision, made every year.',
    ],
    kierkegaard:
      'Kierkegaard observed that the weight of infinite possibilities produces what he called "the dizziness of freedom" — a vertiginous anxiety at the recognition that every path is open and you must choose. Saying "it\'s the law" is one way of quieting that dizziness. But you are choosing to respect the law — and that matters.',
  },
  {
    id: 'stayed-silent',
    setup: 'A colleague says something you disagree with in a meeting and you say nothing.',
    feeling: '"It wasn\'t the right moment — I couldn\'t speak up."',
    hiddenChoices: [
      'You could have spoken, accepting the awkwardness.',
      'You could have written a follow-up message after.',
      'You could have asked a clarifying question rather than making a statement.',
      'You chose silence — perhaps wisely — but it was still your choice.',
    ],
    kierkegaard:
      'Sartre: "not to choose is still to choose." Every option involves trade-offs, and doing nothing is an active selection among options. The anxiety comes from realising that even inaction is authorship.',
  },
  {
    id: 'career',
    setup: 'You stay in a career path because of student loans and family expectations.',
    feeling: '"I don\'t really have a choice about my career at this point."',
    hiddenChoices: [
      'You could retrain in a different field — slowly, part-time.',
      'You could negotiate your role toward work you find more meaningful.',
      'You could accept the constraints honestly and own the trade-off.',
      'You could decide the financial security is genuinely what you value most right now.',
    ],
    kierkegaard:
      'This is Kierkegaard\'s "aesthetic stage" — living for immediate comfort, drifting with circumstances. His prescription: move to the "ethical stage," where you take ownership of your life through deliberate commitment. The constraints are real; you are not. You choose what to do within them.',
  },
  {
    id: 'relationship',
    setup: 'You stay in a difficult friendship out of loyalty and shared history.',
    feeling: '"I can\'t just walk away after everything we\'ve been through."',
    hiddenChoices: [
      'You could set clearer limits on the relationship.',
      'You could have a direct conversation about what is and isn\'t working.',
      'You could step back without cutting ties entirely.',
      'You could also choose to stay — fully, as an act of love — and own that.',
    ],
    kierkegaard:
      'Kierkegaard\'s "leap of faith" in relationships: genuine commitment is not the absence of options — it is the decision to bind yourself despite them. Staying is only meaningful if it is chosen. Staying because "I have no choice" is a different thing entirely.',
  },
]

export function FreedomChoices() {
  const [active, setActive] = useState<string>(SITUATIONS[0].id)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const s = SITUATIONS.find((x) => x.id === active)!

  function reveal() {
    setRevealed((prev) => ({ ...prev, [active]: true }))
  }

  const isRevealed = revealed[active] ?? false

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        In each situation below, it feels like there is "no choice." The existentialist reveals
        the hidden choices inside. Select a situation, then uncover what freedom was always there.
      </p>

      {/* situation selector */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        {SITUATIONS.map((sit) => (
          <button
            key={sit.id}
            type="button"
            onClick={() => setActive(sit.id)}
            className={cn(
              'rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-colors',
              active === sit.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {sit.setup}
          </button>
        ))}
      </div>

      {/* situation detail */}
      <div className="rounded-xl border border-border bg-surface-2 p-4">
        <p className="text-sm text-ink">{s.setup}</p>
        <p className="mt-2 rounded-lg border border-warn/30 bg-warn/10 px-3 py-2 text-sm font-semibold italic text-warn">
          {s.feeling}
        </p>

        {!isRevealed && (
          <button
            type="button"
            onClick={reveal}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-accent bg-accent/15 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/25"
          >
            <Icon name="Eye" size={15} />
            Reveal the hidden choices
          </button>
        )}

        {isRevealed && (
          <>
            <p className="mt-3 mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Choices that were always there:
            </p>
            <ul className="space-y-1.5">
              {s.hiddenChoices.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink">
                  <Icon name="ArrowRight" size={14} className="mt-0.5 shrink-0 text-accent" />
                  {c}
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-xl border border-accent-2/40 bg-surface p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                Kierkegaard &amp; Sartre
              </p>
              <p className="text-xs text-ink">{s.kierkegaard}</p>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-accent/30 bg-accent/10 p-3 text-center">
        <p className="text-xs font-semibold text-accent">
          "Anxiety is the dizziness of freedom."
        </p>
        <p className="text-xs text-muted">— Søren Kierkegaard, The Concept of Anxiety (1844)</p>
      </div>
    </div>
  )
}
