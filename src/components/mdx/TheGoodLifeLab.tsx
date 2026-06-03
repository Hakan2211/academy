import { useState } from 'react'
import { cn } from '#/lib/cn'

// Compare three theories of well-being through Nozick's Experience Machine thought
// experiment. Does the user plug in? Their answer reveals what they value beyond
// pleasure, illuminating which theory is most plausible.

type Theory = {
  id: string
  name: string
  slogan: string
  definition: string
  judgement: (plugIn: boolean | null) => string
  objection: string
  verdict: string
  color: string
  bg: string
  border: string
}

const THEORIES: Array<Theory> = [
  {
    id: 'hedonism',
    name: 'Hedonism',
    slogan: 'Well-being = pleasure and absence of pain',
    definition:
      "A life goes well to the extent that it contains more pleasure than pain. Bentham and Mill gave this view its classical formulations. What matters is how life FEELS from the inside — and the more positive that feels, the better the life.",
    judgement: (plugIn) =>
      plugIn === null
        ? 'Plug in — you\'ll get the maximum possible pleasure. If hedonism is right, there\'s no reason not to.'
        : plugIn
        ? 'Your choice is consistent with hedonism. If well-being is simply pleasure, the machine is the perfect life. Hedonism says you should plug in.'
        : 'Your refusal is a problem for hedonism. If well-being really is just pleasure, the machine offers the best possible life — yet you said no. Something else must matter to you.',
    objection:
      "Nozick's Experience Machine: suppose you could plug into a simulation that gives you perfect pleasures — the feeling of writing a great novel, having deep friendships, living fully — but none of it is real. Would you? Most people say NO. If so, they value more than just pleasure: they want to actually DO things, actually BE certain kinds of people, actually connect with reality.",
    verdict: 'Most find hedonism incomplete once they reflect on the Experience Machine.',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/40',
  },
  {
    id: 'desire',
    name: 'Desire-Satisfaction',
    slogan: 'Well-being = getting what you want',
    definition:
      "A life goes well to the extent that your desires are fulfilled — whether or not the fulfilment makes you feel good. This avoids the hedonism problem: you can care about things beyond your own experience (your children's welfare, the truth, justice) and those desires count too.",
    judgement: (plugIn) =>
      plugIn === null
        ? 'It depends: do you DESIRE to be plugged in? If not, the machine would frustrate your desires — so desire-satisfaction says don\'t plug in if you don\'t want to.'
        : plugIn
        ? 'If you genuinely desired the machine\'s experiences, desire-satisfaction supports this. But if you actually desired REAL achievements, plugging in frustrated your deepest desires — making the machine bad for you even if it feels good.'
        : 'Your refusal fits desire-satisfaction well: you have desires for real achievements, real relationships, real contact with the world — and the machine cannot satisfy these, only simulate them.',
    objection:
      "What about uninformed or adaptive desires? If someone desires to be enslaved because they have been conditioned to, satisfying that desire doesn't seem like well-being. And some desires — like the desire to count every blade of grass — seem too trivial to ground a meaningful life even if fulfilled.",
    verdict: 'More flexible than hedonism, but struggles with malformed and trivial desires.',
    color: 'text-accent-2',
    bg: 'bg-accent-2/10',
    border: 'border-accent-2/40',
  },
  {
    id: 'objective',
    name: 'Objective-List Theory',
    slogan: 'Well-being = objectively valuable goods',
    definition:
      "A life goes well to the extent that it contains certain goods — such as knowledge, deep friendship, achievement, autonomy, health, and appreciation of beauty — regardless of whether they produce pleasure or satisfy desires. These goods have intrinsic value for the person, even if the person doesn't feel good or doesn't want them.",
    judgement: (plugIn) =>
      plugIn === null
        ? 'Objective theory says: don\'t plug in. The machine deprives you of real knowledge, real achievement, real relationships — the very things that make a life objectively good.'
        : plugIn
        ? 'Objective theory registers this as a loss: however good the machine feels, you are cut off from real knowledge, real achievement, and real connection — things on the list that the simulation cannot provide.'
        : 'Your refusal resonates with objective theory. Real friendship, real knowledge, real achievement — not just their pleasurable shadows — are what you implicitly value. These are on the list.',
    objection:
      "Who decides what goes on the list? And if someone doesn't care about the listed goods — say, they genuinely prefer a pleasurable simulation — does it still serve their well-being to impose the list's items on them? The theory can seem paternalistic.",
    verdict: 'Captures intuitions about meaning well; the paternalism worry is its main challenge.',
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/40',
  },
]

export function TheGoodLifeLab() {
  const [pluggedIn, setPluggedIn] = useState<boolean | null>(null)
  const [activeTheory, setActiveTheory] = useState<string | null>(null)

  const active = THEORIES.find((t) => t.id === activeTheory) ?? null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Experience Machine scenario */}
      <div className="mb-4 rounded-xl border border-border bg-surface-2 p-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
          Nozick&apos;s Experience Machine (1974)
        </div>
        <p className="mb-3 text-sm text-ink">
          Imagine a machine that can simulate any experience with perfect fidelity. Floating in a tank with electrodes
          connected to your brain, you could spend your life feeling as though you were writing a masterpiece, falling in
          love, exploring the world, making great discoveries — and it would feel exactly real. But you would be
          floating in a tank. No one would actually know you. You would actually do nothing.
        </p>
        <p className="mb-3 text-sm font-semibold text-ink">Would you plug in for life?</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setPluggedIn(true)}
            className={cn(
              'flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
              pluggedIn === true
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            Yes — plug me in
          </button>
          <button
            type="button"
            onClick={() => setPluggedIn(false)}
            className={cn(
              'flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
              pluggedIn === false
                ? 'border-accent-2 bg-accent-2/15 text-accent-2'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            No — I want the real thing
          </button>
        </div>

        {pluggedIn !== null && (
          <div className={cn(
            'mt-3 rounded-lg border p-3 text-sm',
            pluggedIn
              ? 'border-accent/30 bg-accent/10 text-accent'
              : 'border-accent-2/30 bg-accent-2/10 text-accent-2',
          )}>
            {pluggedIn
              ? "You chose the machine. That's philosophically interesting — very few people do. It means you care most about subjective experience. Now see what each theory says about your choice."
              : "You refused the machine — as most people do. Nozick says this reveals something: you care about more than just how life feels. You want to actually DO things, BE someone, touch the real world. Now see what each theory says."}
          </div>
        )}
      </div>

      {/* Theory selector */}
      <p className="mb-2 text-sm text-muted">Now examine the three theories of well-being:</p>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {THEORIES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTheory(activeTheory === t.id ? null : t.id)}
            className={cn(
              'rounded-xl border px-2 py-2 text-center text-xs font-medium transition-colors',
              activeTheory === t.id
                ? `${t.border} ${t.bg} ${t.color}`
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <div className={cn('font-semibold', activeTheory === t.id ? t.color : 'text-ink')}>{t.name}</div>
            <div className="mt-0.5 text-muted leading-tight">{t.slogan}</div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {active && (
        <div className={cn('rounded-xl border p-4 text-sm', active.border, active.bg)}>
          <div className={cn('mb-1 font-bold', active.color)}>{active.name}</div>
          <p className="mb-3 text-ink">{active.definition}</p>

          <div className="mb-3 rounded-lg border border-border bg-surface p-3">
            <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">
              What it says about your Experience Machine choice
            </div>
            <p className="text-xs text-ink">{active.judgement(pluggedIn)}</p>
          </div>

          <div className="mb-3 rounded-lg border border-border bg-surface p-3">
            <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">Main objection</div>
            <p className="text-xs text-ink">{active.objection}</p>
          </div>

          <div className={cn('rounded-lg border p-2.5 text-xs font-medium', active.border, active.color)}>
            {active.verdict}
          </div>
        </div>
      )}

      {!active && pluggedIn === null && (
        <p className="text-center text-xs text-muted">
          Answer the thought experiment, then explore each theory to see what it implies.
        </p>
      )}

      {!active && pluggedIn !== null && (
        <p className="text-center text-xs text-muted">
          Select a theory above to see what it says about well-being and your choice.
        </p>
      )}
    </div>
  )
}
