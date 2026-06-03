import { useState } from 'react'
import { cn } from '#/lib/cn'

// Two ideas in one panel. Top: the unemployment-rate definition — unemployed
// divided by the LABOUR FORCE (employed + actively looking). People who aren't
// looking (retired, students, discouraged workers) are outside the labour force
// entirely and never enter the rate. A small stepper shows how moving a person
// between "employed", "looking", and "not looking" reshapes it. Bottom: sort
// real scenarios into the three causes — frictional (between jobs), structural
// (skills obsolete / mismatch), cyclical (recession-driven layoffs).

type Cause = 'frictional' | 'structural' | 'cyclical'

const CAUSES: Array<{ key: Cause; label: string; blurb: string }> = [
  { key: 'frictional', label: 'Frictional', blurb: 'Short-term, between jobs or searching for a first one. Normal and even healthy.' },
  { key: 'structural', label: 'Structural', blurb: 'Skills or location no longer match the jobs available — technology or industry shifts.' },
  { key: 'cyclical', label: 'Cyclical', blurb: 'Caused by a downturn: weak demand across the whole economy in a recession.' },
]

type Scenario = { id: string; text: string; answer: Cause }

const SCENARIOS: Array<Scenario> = [
  { id: 'factory', text: 'A factory worker is laid off because robots now do the welding, and his skills are obsolete.', answer: 'structural' },
  { id: 'between', text: 'A graphic designer quit and is spending three weeks choosing between two job offers.', answer: 'frictional' },
  { id: 'recession', text: 'A recession hits; a car plant lays off thousands as sales collapse across the country.', answer: 'cyclical' },
  { id: 'coal', text: 'Coal mines close as the country switches to solar; miners can\'t find local work.', answer: 'structural' },
  { id: 'grad', text: 'A new graduate is sending out applications and interviewing for her first role.', answer: 'frictional' },
]

export function UnemploymentTypes() {
  // labour-force toy: counts of people in each state
  const [counts, setCounts] = useState({ employed: 90, looking: 10, notLooking: 30 })
  const labourForce = counts.employed + counts.looking
  const rate = labourForce > 0 ? (counts.looking / labourForce) * 100 : 0

  const [picks, setPicks] = useState<Record<string, Cause | undefined>>({})

  const adjust = (k: keyof typeof counts, d: number) =>
    setCounts((prev) => ({ ...prev, [k]: Math.max(0, prev[k] + d) }))

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* the rate */}
      <p className="text-sm font-semibold text-ink">The unemployment rate</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        Unemployed ÷ labour force, where the labour force = employed + actively looking. People{' '}
        <span className="text-ink">not looking</span> sit outside it entirely.
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {([
          ['employed', 'Employed'],
          ['looking', 'Looking (unemployed)'],
          ['notLooking', 'Not looking'],
        ] as const).map(([k, label]) => (
          <div key={k} className="rounded-xl border border-border bg-surface-2 p-2 text-center">
            <div className="text-[11px] leading-tight text-muted">{label}</div>
            <div className="my-1 font-mono text-lg text-ink">{counts[k]}</div>
            <div className="flex justify-center gap-1">
              <button type="button" onClick={() => adjust(k, -5)} className="grid h-6 w-6 place-items-center rounded-full border border-border text-sm text-ink hover:border-accent">−</button>
              <button type="button" onClick={() => adjust(k, 5)} className="grid h-6 w-6 place-items-center rounded-full border border-border text-sm text-ink hover:border-accent">+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-accent/40 bg-accent/10 px-3 py-2">
        <span className="text-sm text-muted">Labour force {labourForce} · unemployment rate</span>
        <span className="font-mono text-lg text-accent">{rate.toFixed(1)}%</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Move people into <span className="text-ink">Not looking</span> and the rate <em>falls</em> even though no one got a
        job — they simply left the labour force. That is why economists also watch the participation rate.
      </p>

      {/* sort the causes */}
      <p className="mt-5 text-sm font-semibold text-ink">Sort the cause</p>
      <div className="mt-2 grid gap-2">
        {SCENARIOS.map((s) => {
          const pick = picks[s.id]
          const answered = pick !== undefined
          const correct = answered && pick === s.answer
          return (
            <div key={s.id} className="rounded-xl border border-border bg-surface-2 p-2.5">
              <p className="text-sm text-ink">{s.text}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {CAUSES.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setPicks((prev) => ({ ...prev, [s.id]: c.key }))}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs transition-colors',
                      pick === c.key
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-border text-muted hover:text-ink',
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              {answered && (
                <p className={cn('mt-2 text-xs leading-relaxed', correct ? 'text-success' : 'text-accent-2')}>
                  {correct ? 'Correct — ' : `Actually ${s.answer}. `}
                  {CAUSES.find((c) => c.key === s.answer)?.blurb}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
