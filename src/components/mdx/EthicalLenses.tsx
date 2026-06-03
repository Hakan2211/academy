import { useState } from 'react'
import { cn } from '#/lib/cn'

// The flagship interactive: pick a moral dilemma, then view how CONSEQUENTIALISM,
// DEONTOLOGY, and VIRTUE ETHICS each analyse it. Three labelled lenses with distinct
// questions and verdicts. Fully self-contained — reused by W8 and later worlds.

type Lens = {
  id: string
  name: string
  shortName: string
  tagline: string
  asks: string
  analysis: string
  verdict: string
  color: string
  bg: string
  border: string
}

type Dilemma = {
  id: string
  label: string
  scenario: string
  lenses: Record<string, { analysis: string; verdict: string }>
}

const LENSES: Array<Lens> = [
  {
    id: 'consequentialism',
    name: 'Consequentialism',
    shortName: 'Consequences',
    tagline: 'What outcome does this produce?',
    asks: 'Which action maximises overall well-being (or minimises harm)?',
    analysis: '',
    verdict: '',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/40',
  },
  {
    id: 'deontology',
    name: 'Deontology',
    shortName: 'Duty',
    tagline: 'Does this follow the right rules?',
    asks: 'Is this action required or forbidden by a universal moral duty — regardless of outcome?',
    analysis: '',
    verdict: '',
    color: 'text-accent-2',
    bg: 'bg-accent-2/10',
    border: 'border-accent-2/40',
  },
  {
    id: 'virtue',
    name: 'Virtue Ethics',
    shortName: 'Character',
    tagline: 'What would a person of good character do?',
    asks: 'What does this action say about who I am — and who I am becoming?',
    analysis: '',
    verdict: '',
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/40',
  },
]

const DILEMMAS: Array<Dilemma> = [
  {
    id: 'lie-friend',
    label: 'The protective lie',
    scenario:
      'Your friend asks whether you like their new creative work. You think it is genuinely poor, but they are fragile and the feedback would deeply hurt them. Should you lie, soften the truth, or tell them honestly?',
    lenses: {
      consequentialism: {
        analysis:
          'Weigh outcomes: a gentle lie spares immediate pain and preserves the friendship. But habitual white lies can erode trust long-term; and if your friend invests more effort into flawed work, they may face bigger disappointment later. The calculus depends on probabilities and magnitudes — a careful consequentialist might favour honest-but-kind feedback that minimises overall harm.',
        verdict: 'Likely: honest feedback framed kindly — or a white lie if harm is severe. Context decides.',
      },
      deontology: {
        analysis:
          "Kant insists lying fails the categorical imperative: if everyone lied when the truth was uncomfortable, the institution of honest communication would collapse. Moreover, lying treats your friend as a means to manage your discomfort, not as a rational agent who deserves true information to make her own choices.",
        verdict: 'Verdict: truth — but Kant allows tact. The duty is to not deceive, not to be brutal.',
      },
      virtue: {
        analysis:
          "Virtue ethics asks: what would a person of practical wisdom (phronesis) do? Honesty is a virtue, but so is compassion and tact. The virtuous person finds the mean: forthright enough to respect the friend's autonomy and growth, gentle enough to show genuine care. Neither brutal bluntness nor hollow flattery embodies good character.",
        verdict: 'Verdict: truthful, compassionate, and well-timed feedback — character over formula.',
      },
    },
  },
  {
    id: 'trolley',
    label: 'The runaway trolley',
    scenario:
      'A runaway trolley is heading toward five people tied to the track. You stand next to a lever. If you pull it, the trolley diverts to a side track — where one person stands. Pull the lever (one dies, five live) or do nothing (five die)?',
    lenses: {
      consequentialism: {
        analysis:
          "The calculation is stark: one death versus five. Pulling the lever produces better consequences — five lives saved. A utilitarian says you are not only permitted to pull it, you may be morally required to. Inaction is itself a choice with consequences, and doing nothing when you could prevent four deaths is not morally neutral.",
        verdict: 'Verdict: pull the lever. The outcome is clearly better.',
      },
      deontology: {
        analysis:
          "Here deontologists divide. Kant's formula of humanity warns against using the one person as a mere means to save the five — you are deliberately redirecting lethal force toward an innocent person. However, some Kantians argue there is a difference between killing and letting die, or that pulling the lever is not 'using' the one as a means in the impermissible sense.",
        verdict: 'Contested: many deontologists permit pulling; some forbid it. Doctrine of double effect matters here.',
      },
      virtue: {
        analysis:
          "Virtue ethics resists the clean calculus. A person of good character feels the full weight of the tragedy — the horror of either outcome. The virtuous response is not a formula but practical wisdom: considering what kind of agent one must be to act, what the relationships involved mean, and whether one can take responsibility for the death. Most virtue ethicists would permit pulling, but emphasise grief and moral remainder.",
        verdict: 'Likely: pull the lever — but with full moral weight, not cold calculation.',
      },
    },
  },
  {
    id: 'promise',
    label: 'Promise vs. stranger',
    scenario:
      'You promised a close friend you would help them move house this Saturday. On Saturday morning, you encounter a stranger in genuine distress — their situation requires your help for several hours. You cannot do both. Break the promise, or leave the stranger?',
    lenses: {
      consequentialism: {
        analysis:
          "Calculate: how severe is the stranger's distress? How much does breaking the promise harm your friend? If the stranger's need is serious and the inconvenience to your friend is modest, the aggregate welfare points toward helping the stranger. But a sophisticated consequentialist also weighs the value of promise-keeping as an institution — repeated promise-breaking erodes trust generally, reducing overall utility.",
        verdict: 'Depends on magnitudes — probably help the stranger if the need is acute.',
      },
      deontology: {
        analysis:
          "Promises generate genuine duties — you made a commitment and the friend organised their day around it. Breaking a promise to help an unknown stranger seems to violate that duty. However, many deontologists acknowledge a duty of rescue for those in serious need. The question is which duty is stronger — contractual obligation or emergency rescue.",
        verdict: 'Divided: strong duty to keep the promise, but serious distress may trigger an overriding duty to rescue.',
      },
      virtue: {
        analysis:
          "A person of good character is both loyal and compassionate. The virtuous response involves acknowledging the conflict honestly: calling the friend immediately, explaining, apologising sincerely, and making it right later. Virtue ethics notices that how you handle the situation — with care, honesty, and follow-through — matters as much as what you do.",
        verdict: 'Help the stranger — but honourably: communicate, apologise, make good.',
      },
    },
  },
]

export function EthicalLenses() {
  const [dilemmaId, setDilemmaId] = useState<string | null>(null)
  const [activeLens, setActiveLens] = useState<string | null>(null)

  const dilemma = DILEMMAS.find((d) => d.id === dilemmaId)

  function chooseDilemma(id: string) {
    setDilemmaId(id)
    setActiveLens(null)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Dilemma selector */}
      <p className="mb-3 text-sm text-muted">Choose a moral dilemma, then examine it through each lens:</p>
      <div className="mb-4 flex flex-col gap-2">
        {DILEMMAS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => chooseDilemma(d.id)}
            className={cn(
              'rounded-xl border px-3 py-2 text-left text-sm transition-colors',
              dilemmaId === d.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <span className="font-medium">{d.label}</span>
          </button>
        ))}
      </div>

      {/* Scenario text */}
      {dilemma && (
        <>
          <div className="mb-4 rounded-xl border border-border bg-surface-2 p-3 text-sm text-ink">
            {dilemma.scenario}
          </div>

          {/* Lens tabs */}
          <div className="mb-3 flex gap-2">
            {LENSES.map((lens) => (
              <button
                key={lens.id}
                type="button"
                onClick={() => setActiveLens(lens.id === activeLens ? null : lens.id)}
                className={cn(
                  'flex-1 rounded-lg border px-2 py-1.5 text-center text-xs font-medium transition-colors',
                  activeLens === lens.id
                    ? `${lens.border} ${lens.bg} ${lens.color}`
                    : 'border-border text-muted hover:text-ink',
                )}
              >
                {lens.shortName}
              </button>
            ))}
          </div>

          {/* All lenses open at once if no filter, or just the active one */}
          <div className="flex flex-col gap-3">
            {LENSES.filter((l) => activeLens === null || l.id === activeLens).map((lens) => {
              const lensData = dilemma.lenses[lens.id]
              if (!lensData) return null
              return (
                <div key={lens.id} className={cn('rounded-xl border p-3 text-sm', lens.border, lens.bg)}>
                  <div className="mb-1 flex items-center gap-2">
                    <span className={cn('font-semibold', lens.color)}>{lens.name}</span>
                    <span className="text-xs text-muted">— {lens.tagline}</span>
                  </div>
                  <div className="mb-1 text-xs text-muted italic">Asks: {lens.asks}</div>
                  <p className="mb-2 text-ink">{lensData.analysis}</p>
                  <p className={cn('text-xs font-medium', lens.color)}>{lensData.verdict}</p>
                </div>
              )
            })}
          </div>

          {activeLens && (
            <button
              type="button"
              onClick={() => setActiveLens(null)}
              className="mt-3 text-xs text-muted underline hover:text-ink"
            >
              Show all lenses
            </button>
          )}
        </>
      )}

      {!dilemma && (
        <p className="text-center text-xs text-muted">Select a dilemma above to apply the three ethical lenses.</p>
      )}
    </div>
  )
}
