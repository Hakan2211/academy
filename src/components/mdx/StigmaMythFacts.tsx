import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Myth-versus-fact cards busting the most damaging misconceptions about mental
// illness. Each card starts on the MYTH; tap to reveal the FACT. Stigma is not
// harmless: it keeps people from seeking help and deepens isolation. Naming the
// myths out loud — and answering them with evidence — is how we dismantle it.
const CARDS = [
  {
    myth: 'People with mental illness are violent and dangerous.',
    fact: 'The vast majority are not violent. In fact, people with mental illness are far more likely to be victims of violence than perpetrators. Media coverage badly distorts this.',
  },
  {
    myth: 'Mental illness is a sign of personal weakness.',
    fact: 'Disorders arise from biology, life experience and circumstance interacting — not from weak character. Willpower no more cures depression than it cures diabetes.',
  },
  {
    myth: 'You can just “snap out of it” if you try hard enough.',
    fact: 'Conditions like depression and anxiety involve real changes in the brain and body. Telling someone to snap out of it is like telling a broken leg to walk it off.',
  },
  {
    myth: 'Mental illness is rare and happens to “other people”.',
    fact: 'It’s common: roughly one in four or five people experience a mental-health condition in any given year. It touches almost every family.',
  },
  {
    myth: 'Therapy and treatment don’t really work.',
    fact: 'Most disorders are treatable, and many people recover fully. Therapy, medication, and support have strong evidence behind them — early help works best.',
  },
  {
    myth: 'Talking about suicide will plant the idea.',
    fact: 'Asking directly and with care does not increase risk — it reduces it. It opens a door, signals that you care, and can be the moment someone reaches for help.',
  },
] as const

export function StigmaMythFacts() {
  const [revealed, setRevealed] = useState<Array<boolean>>(() => CARDS.map(() => false))

  const toggle = (i: number) =>
    setRevealed((prev) => prev.map((v, k) => (k === i ? !v : v)))

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Stigma keeps people from seeking help. Tap each card to flip a <span className="font-semibold text-danger">myth</span> into the
        <span className="font-semibold text-success"> fact</span>.
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {CARDS.map((c, i) => {
          const on = revealed[i]
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              className={cn(
                'rounded-xl border p-3 text-left transition-colors',
                on ? 'border-success/50 bg-success/10' : 'border-danger/40 bg-danger/5 hover:bg-danger/10',
              )}
            >
              <div
                className={cn(
                  'flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide',
                  on ? 'text-success' : 'text-danger',
                )}
              >
                <Icon name={on ? 'CheckCircle' : 'XCircle'} size={14} />
                {on ? 'Fact' : 'Myth'}
              </div>
              <p className={cn('mt-1.5 text-sm leading-snug', on ? 'text-ink/90' : 'text-ink')}>
                {on ? c.fact : c.myth}
              </p>
              {!on && <p className="mt-1.5 text-[11px] text-muted">Tap to reveal the fact →</p>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
