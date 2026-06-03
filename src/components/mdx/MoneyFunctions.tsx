import { useState } from 'react'
import { cn } from '#/lib/cn'

// Money does three jobs at once. MEDIUM OF EXCHANGE: it is the thing everyone
// accepts in trade, sidestepping barter's double-coincidence-of-wants problem.
// STORE OF VALUE: it holds purchasing power from today into the future. UNIT OF
// ACCOUNT: it is the common yardstick we quote every price in. Below, sort
// everyday situations into the function each one shows. Then flip the toggle to
// contrast COMMODITY money (worth something in itself, like gold) with FIAT
// money (a banknote worth something only because we all trust and accept it).

type Fn = 'medium' | 'store' | 'unit'

const FUNCTIONS: Array<{ key: Fn; label: string; blurb: string }> = [
  { key: 'medium', label: 'Medium of exchange', blurb: 'Money is the thing everyone accepts in trade — no need to find someone who has what you want AND wants what you have.' },
  { key: 'store', label: 'Store of value', blurb: 'Money holds purchasing power over time, so you can earn now and spend later.' },
  { key: 'unit', label: 'Unit of account', blurb: 'Money is the common yardstick — prices, debts and wealth are all measured in the same units.' },
]

type Scenario = { id: string; text: string; answer: Fn }

const SCENARIOS: Array<Scenario> = [
  { id: 'coffee', text: 'You hand over a $5 note and walk away with a coffee.', answer: 'medium' },
  { id: 'savings', text: 'You keep $2,000 in a savings account to use for a trip next year.', answer: 'store' },
  { id: 'pricetag', text: 'A laptop is tagged at $899 and a phone at $599, so you can compare them.', answer: 'unit' },
  { id: 'salary', text: 'A job advert lists the salary as $60,000 a year.', answer: 'unit' },
  { id: 'rent', text: 'You pay this month\'s rent by transferring money to your landlord.', answer: 'medium' },
  { id: 'mattress', text: 'A shopkeeper tucks the day\'s cash away to spend over the coming weeks.', answer: 'store' },
]

type Kind = 'commodity' | 'fiat'

export function MoneyFunctions() {
  const [picks, setPicks] = useState<Record<string, Fn | undefined>>({})
  const [kind, setKind] = useState<Kind>('commodity')

  const answered = Object.values(picks).filter((v) => v !== undefined).length
  const correctCount = SCENARIOS.filter((s) => picks[s.id] === s.answer).length

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* the three functions */}
      <p className="text-sm font-semibold text-ink">The three functions of money</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        {FUNCTIONS.map((f) => (
          <div key={f.key} className="rounded-xl border border-border bg-surface-2 p-2.5">
            <p className="text-sm font-semibold text-accent">{f.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{f.blurb}</p>
          </div>
        ))}
      </div>

      {/* sort the scenarios */}
      <p className="mt-5 text-sm font-semibold text-ink">Which job is money doing?</p>
      <div className="mt-2 grid gap-2">
        {SCENARIOS.map((s) => {
          const pick = picks[s.id]
          const done = pick !== undefined
          const correct = done && pick === s.answer
          return (
            <div key={s.id} className="rounded-xl border border-border bg-surface-2 p-2.5">
              <p className="text-sm text-ink">{s.text}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {FUNCTIONS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setPicks((prev) => ({ ...prev, [s.id]: f.key }))}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs transition-colors',
                      pick === f.key
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-border text-muted hover:text-ink',
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {done && (
                <p className={cn('mt-2 text-xs leading-relaxed', correct ? 'text-success' : 'text-accent-2')}>
                  {correct ? 'Correct — ' : `Actually the ${FUNCTIONS.find((f) => f.key === s.answer)?.label.toLowerCase()}. `}
                  {FUNCTIONS.find((f) => f.key === s.answer)?.blurb}
                </p>
              )}
            </div>
          )
        })}
      </div>
      {answered > 0 && (
        <div className="mt-2 rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-center text-sm text-accent">
          {correctCount} of {SCENARIOS.length} sorted correctly
        </div>
      )}

      {/* commodity vs fiat */}
      <p className="mt-5 text-sm font-semibold text-ink">What gives money its value?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {([
          ['commodity', 'Commodity money'],
          ['fiat', 'Fiat money'],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              kind === k
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-4 rounded-xl border border-border bg-surface-2 p-4">
        <div className="text-5xl" aria-hidden>{kind === 'commodity' ? '🪙' : '💵'}</div>
        <div>
          <p className="text-sm font-semibold text-ink">
            {kind === 'commodity' ? 'Gold coin — worth something in itself' : 'Banknote — worth something by trust'}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {kind === 'commodity'
              ? 'Commodity money is made of a thing that has value of its own — gold, silver, even salt or cigarettes. Melt the coin and the metal is still worth something. Its supply is limited by how much can be mined.'
              : 'Fiat money has almost no value as an object — a note is just printed paper. It works only because the government declares it legal tender and everyone trusts that others will accept it too. Its supply is set by the central bank, not a mine.'}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Almost all modern money is <span className="text-ink">fiat</span>. That is why a central bank — and the trust behind
        it — matters so much: the value of the notes in your wallet rests entirely on confidence that they will still buy
        things tomorrow.
      </p>
    </div>
  )
}
