import { useState } from 'react'

// Long division made visible. The decimal of a fraction must either stop or
// repeat, because there are only finitely many possible remainders — once one
// recurs, the whole pattern recurs. Watch the remainder chain close its loop.
const PRESETS = [
  { n: 1, d: 4 },
  { n: 1, d: 3 },
  { n: 1, d: 6 },
  { n: 5, d: 12 },
  { n: 2, d: 11 },
  { n: 1, d: 7 },
]

function longDivide(n: number, d: number, max = 18) {
  let r = n % d
  const digits: Array<number> = []
  const remainders: Array<number> = []
  let cycleStart = -1
  while (r !== 0 && digits.length < max) {
    const seen = remainders.indexOf(r)
    if (seen !== -1) {
      cycleStart = seen
      break
    }
    remainders.push(r)
    r *= 10
    digits.push(Math.floor(r / d))
    r = r % d
  }
  return { intPart: Math.floor(n / d), digits, cycleStart, remainders, terminates: r === 0 }
}

export function RecurringDecimal() {
  const [i, setI] = useState(1)
  const { n, d } = PRESETS[i]
  const { intPart, digits, cycleStart, remainders, terminates } = longDivide(n, d)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {PRESETS.map((p, idx) => (
          <button key={idx} onClick={() => setI(idx)} className={`rounded-lg border px-2.5 py-1 font-mono text-sm transition ${idx === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {p.n}/{p.d}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-surface-2 py-5 text-center">
        <span className="font-mono text-3xl font-bold text-ink">
          {intPart}.
          {digits.map((dig, k) => (
            <span key={k} className={cycleStart !== -1 && k >= cycleStart ? 'text-accent underline decoration-2 underline-offset-4' : ''}>
              {dig}
            </span>
          ))}
          {terminates ? '' : '…'}
        </span>
        <div className="mt-2 text-sm text-muted">
          {terminates ? (
            <>This decimal <span className="text-success">terminates</span> — the remainder hit 0.</>
          ) : (
            <>The underlined block <span className="text-accent">repeats forever</span> (period {digits.length - cycleStart}).</>
          )}
        </div>
      </div>

      <div className="mt-3 text-center text-xs text-muted">
        remainders: <span className="font-mono text-ink">{remainders.join(' → ')}{terminates ? ' → 0' : ' → (repeats)'}</span>
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        Only {d} remainders are possible (0 to {d - 1}), so within {d} steps one must repeat — or you hit 0 and stop.
      </p>
    </div>
  )
}
