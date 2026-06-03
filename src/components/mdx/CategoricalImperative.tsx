import { useState } from 'react'
import { cn } from '#/lib/cn'
import { Icon } from '#/components/ui/Icon'

// Kant's universalizability test. The user picks a maxim; the tool shows what
// happens when EVERYONE acts on it, and whether it leads to a self-defeating
// contradiction or a world one could rationally will into existence.

type Maxim = {
  id: string
  label: string
  firstPerson: string
  universalised: string
  verdict: 'fails' | 'passes'
  contradiction: string
  kantExplanation: string
}

const MAXIMS: Array<Maxim> = [
  {
    id: 'lie',
    label: '"I will lie when convenient"',
    firstPerson: 'I will lie whenever telling the truth is inconvenient for me.',
    universalised:
      'Everyone lies whenever telling the truth is inconvenient for them.',
    verdict: 'fails',
    contradiction:
      'If everyone lies, the very institution of truthful communication collapses. There would be no honest assertions left to deceive people with — so lying becomes impossible. The maxim undermines the practice it depends on.',
    kantExplanation:
      'Kant calls this a contradiction in conception. You cannot even coherently think a world in which everyone lies — the concept of lying requires that some communication is truthful. The maxim is self-defeating.',
  },
  {
    id: 'promises',
    label: '"I will break promises when useful"',
    firstPerson: 'I will make promises and break them whenever keeping them is inconvenient.',
    universalised: 'Everyone makes promises they intend to break whenever useful.',
    verdict: 'fails',
    contradiction:
      'If everyone made false promises, no one would believe any promise — the institution of promise-making would dissolve. Your own false promise would then be impossible, because no one would accept it.',
    kantExplanation:
      'Again a contradiction in conception: in a world of universal promise-breaking, the very act of promising evaporates. The maxim destroys the conditions of its own application.',
  },
  {
    id: 'borrow',
    label: '"I will borrow money I know I cannot repay"',
    firstPerson: 'I will borrow money without intending to repay it when I need funds.',
    universalised: 'Everyone borrows money without intending to repay it.',
    verdict: 'fails',
    contradiction:
      'In a world where no one repays debts, lending would cease entirely. No lender would offer money knowing it would not be returned. The practice of credit — which the maxim exploits — disappears.',
    kantExplanation:
      'A contradiction in conception: universalising the maxim abolishes the very practice (lending) that the maxim attempts to exploit. It is rationally self-undermining.',
  },
  {
    id: 'help',
    label: '"I will help others in need"',
    firstPerson: 'I will help others when they are in need and I am able.',
    universalised: 'Everyone helps others when they are in need and able.',
    verdict: 'passes',
    contradiction: '',
    kantExplanation:
      'A world of universal mutual aid is not self-contradictory — and you could rationally will it, since you yourself might one day be in need. This maxim passes the categorical imperative. Kant counts beneficence as an imperfect duty.',
  },
  {
    id: 'cultivate',
    label: '"I will develop my talents"',
    firstPerson: 'I will cultivate my natural abilities rather than let them go to waste.',
    universalised: 'Everyone cultivates their natural abilities.',
    verdict: 'passes',
    contradiction: '',
    kantExplanation:
      'There is no contradiction in universalising this, and a rational agent could will such a world — it would contain flourishing and capable people. This maxim also passes.',
  },
]

export function CategoricalImperative() {
  const [selected, setSelected] = useState<string | null>(null)
  const [step, setStep] = useState<0 | 1 | 2>(0)

  const maxim = MAXIMS.find((m) => m.id === selected)

  function choose(id: string) {
    setSelected(id)
    setStep(0)
  }

  function advance() {
    setStep((s) => (s < 2 ? ((s + 1) as 0 | 1 | 2) : s))
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Pick a maxim — a personal rule of action. Kant's test: could you rationally will that
        <em> everyone</em> acted on it?
      </p>

      {/* Maxim list */}
      <div className="mb-4 flex flex-col gap-2">
        {MAXIMS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => choose(m.id)}
            className={cn(
              'rounded-xl border px-3 py-2 text-left text-sm transition-colors',
              selected === m.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Walkthrough */}
      {maxim && (
        <div className="flex flex-col gap-3">
          {/* Step 0: the maxim */}
          <div className="rounded-xl border border-border bg-surface-2 p-3 text-sm">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
              Step 1 · Your maxim
            </div>
            <p className="text-ink">{maxim.firstPerson}</p>
          </div>

          {/* Step 1: universalised */}
          {step >= 1 && (
            <div className="rounded-xl border border-border bg-surface-2 p-3 text-sm">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                Step 2 · Universalise it
              </div>
              <p className="text-ink">{maxim.universalised}</p>
            </div>
          )}

          {/* Step 2: verdict */}
          {step >= 2 && (
            <div
              className={cn(
                'rounded-xl border p-3 text-sm',
                maxim.verdict === 'fails'
                  ? 'border-warn/40 bg-warn/10'
                  : 'border-success/40 bg-success/10',
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon
                  name={maxim.verdict === 'fails' ? 'XCircle' : 'CheckCircle2'}
                  size={18}
                />
                <span
                  className={cn(
                    'font-semibold',
                    maxim.verdict === 'fails' ? 'text-warn' : 'text-success',
                  )}
                >
                  {maxim.verdict === 'fails'
                    ? 'Fails — self-defeating contradiction'
                    : 'Passes — can be universally willed'}
                </span>
              </div>
              {maxim.verdict === 'fails' && (
                <p className="mb-2 text-warn">{maxim.contradiction}</p>
              )}
              <p className="text-muted">{maxim.kantExplanation}</p>
            </div>
          )}

          {/* Advance button */}
          {step < 2 && (
            <button
              type="button"
              onClick={advance}
              className="self-start rounded-lg border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent transition-colors hover:bg-accent/25"
            >
              {step === 0 ? 'Universalise →' : 'See verdict →'}
            </button>
          )}
        </div>
      )}

      {!selected && (
        <p className="text-center text-xs text-muted">Select a maxim above to apply Kant's test.</p>
      )}
    </div>
  )
}
