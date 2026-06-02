import { useState } from 'react'
import { simplifyFrac } from '#/lib/math'

// Probability of equally likely outcomes: P(event) = favourable ÷ total. Pick an
// event on a fair die and see which faces count. Used in calculating-probability.
const EVENTS = [
  { key: 'even', label: 'even', test: (n: number) => n % 2 === 0 },
  { key: 'gt4', label: 'greater than 4', test: (n: number) => n > 4 },
  { key: 'six', label: 'a six', test: (n: number) => n === 6 },
  { key: 'odd', label: 'odd', test: (n: number) => n % 2 === 1 },
  { key: 'le2', label: '2 or less', test: (n: number) => n <= 2 },
]
const PIPS: Record<number, Array<[number, number]>> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 25], [72, 25], [28, 50], [72, 50], [28, 75], [72, 75]],
}

export function DiceSpinner() {
  const [ei, setEi] = useState(0)
  const ev = EVENTS[ei]
  const favourable = [1, 2, 3, 4, 5, 6].filter(ev.test)
  const frac = simplifyFrac({ n: favourable.length, d: 6 })

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {EVENTS.map((e, i) => (
          <button key={e.key} onClick={() => setEi(i)} className={`rounded-lg border px-2.5 py-1 text-xs transition ${i === ei ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {e.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {[1, 2, 3, 4, 5, 6].map((n) => {
          const on = ev.test(n)
          return (
            <svg key={n} viewBox="0 0 100 100" className="h-12 w-12">
              <rect x="6" y="6" width="88" height="88" rx="16" fill={on ? 'var(--color-accent)' : 'var(--color-surface-2)'} fillOpacity={on ? 0.25 : 1} stroke={on ? 'var(--color-accent)' : 'var(--color-border)'} strokeWidth="2" />
              {PIPS[n].map(([cx, cy], k) => (
                <circle key={k} cx={cx} cy={cy} r="8" fill={on ? 'var(--color-accent)' : 'var(--color-muted)'} />
              ))}
            </svg>
          )
        })}
      </div>

      <p className="mt-3 text-center font-mono text-sm">
        P({ev.label}) = {favourable.length}/6 = <span className="font-bold text-accent">{frac.n}/{frac.d}</span> ≈ {(favourable.length / 6).toFixed(2)}
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        P(event) = favourable outcomes ÷ total outcomes (when all are equally likely). The complement P(not event) = 1 − P.
      </p>
    </div>
  )
}
