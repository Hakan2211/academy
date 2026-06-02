import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The elaboration-likelihood model: two routes to persuasion. The CENTRAL route
// works through the substance of an argument — evidence, logic, strong reasons —
// and produces durable, resistant attitudes. The PERIPHERAL route works through
// cues unrelated to merit — an attractive face, a celebrity, sheer repetition,
// "experts agree" — and produces shallow, fleeting attitudes. The learner reads a
// real-feeling ad line and classifies which route it's pulling. Used in
// attitudes-and-persuasion.

type Route = 'central' | 'peripheral'

const ROUTES: Record<Route, { label: string; icon: string; color: string; blurb: string }> = {
  central: {
    label: 'Central (the argument)',
    icon: 'Scale',
    color: 'var(--color-success)',
    blurb: 'Substance: evidence, logic, strong reasons. Slow to form, but durable and hard to shake.',
  },
  peripheral: {
    label: 'Peripheral (the cue)',
    icon: 'Sparkles',
    color: '#E67E22',
    blurb: 'Surface cues: attractiveness, fame, repetition, "experts say". Quick to form, but shallow and fleeting.',
  },
}

type Msg = { text: string; route: Route; why: string }

const MESSAGES: Array<Msg> = [
  {
    text: '"In three independent trials, this toothpaste cut cavities by 40% versus the leading brand."',
    route: 'central',
    why: 'It hands you evidence and a reason to evaluate. You\'re being persuaded by the merits — the central route.',
  },
  {
    text: '"Nine out of ten dentists can\'t all be wrong — switch today!"',
    route: 'peripheral',
    why: 'No actual argument, just an expertise/consensus cue. You\'re nudged by who supposedly agrees, not by why — the peripheral route.',
  },
  {
    text: '"Drive the car a famous actor drives. Be unforgettable."',
    route: 'peripheral',
    why: 'Celebrity glamour and image, with nothing about the car itself. Pure peripheral cue.',
  },
  {
    text: '"This plan costs $200 less per year and covers everything your current one does — here are the numbers."',
    route: 'central',
    why: 'A concrete, checkable comparison aimed at your reasoning. Central route.',
  },
  {
    text: '"You\'ve seen this jingle a hundred times. Hum it. Now buy it."',
    route: 'peripheral',
    why: 'Mere repetition breeds familiarity and liking — a classic peripheral cue, no content required.',
  },
]

export function PersuasionRoutes() {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<Route | null>(null)
  const m = MESSAGES[i]
  const correct = picked === m.route

  const next = () => {
    setI((v) => (v + 1) % MESSAGES.length)
    setPicked(null)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        Message {i + 1} of {MESSAGES.length}
      </p>

      <p className="mt-2 rounded-xl bg-surface-2 p-3 text-sm leading-relaxed text-ink">{m.text}</p>

      <p className="mb-1.5 mt-3 text-sm text-muted">Which route is it taking to change your mind?</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {(Object.keys(ROUTES) as Array<Route>).map((r) => {
          const reveal = picked !== null
          return (
            <button
              key={r}
              type="button"
              onClick={() => setPicked(r)}
              className={cn(
                'flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors',
                reveal && r === m.route
                  ? 'border-success bg-success/15 text-success'
                  : picked === r
                    ? 'border-[#E67E22] bg-[#E67E22]/15 text-[#E67E22]'
                    : 'border-border text-muted hover:text-ink',
              )}
            >
              <Icon name={ROUTES[r].icon} size={16} />
              {ROUTES[r].label}
            </button>
          )
        })}
      </div>

      {picked && (
        <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3">
          <p className="flex gap-2 text-sm leading-snug text-ink">
            <span className={cn('mt-0.5 shrink-0', correct ? 'text-success' : 'text-[#E67E22]')}>
              <Icon name={correct ? 'CheckCircle2' : 'Info'} size={16} />
            </span>
            <span>
              <span className={cn('font-semibold', correct ? 'text-success' : 'text-[#E67E22]')}>
                {correct ? 'Right. ' : `It's the ${ROUTES[m.route].label.split(' ')[0].toLowerCase()} route. `}
              </span>
              {m.why}
            </span>
          </p>
          <p className="mt-2 text-xs text-muted">{ROUTES[m.route].blurb}</p>
          <button
            type="button"
            onClick={next}
            className="mt-3 flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm text-muted hover:text-ink"
          >
            <Icon name="ArrowRight" size={14} /> Next message
          </button>
        </div>
      )}
    </div>
  )
}
