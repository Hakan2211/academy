import { useState } from 'react'
import { simplifyFrac } from '#/lib/math'

// The sample space of two dice — all 36 equally likely outcomes in a grid.
// Highlight those matching a condition and read the probability off directly.
// Used in combined-events and the deep-dive.
const CONDS = [
  { key: 'sum7', label: 'sum = 7', test: (a: number, b: number) => a + b === 7 },
  { key: 'doubles', label: 'a double', test: (a: number, b: number) => a === b },
  { key: 'gt9', label: 'sum > 9', test: (a: number, b: number) => a + b > 9 },
  { key: 'six', label: 'at least one 6', test: (a: number, b: number) => a === 6 || b === 6 },
]

export function SampleSpace() {
  const [ci, setCi] = useState(0)
  const cond = CONDS[ci]
  let count = 0
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (cond.test(a, b)) count++
  const frac = simplifyFrac({ n: count, d: 36 })

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {CONDS.map((c, i) => (
          <button key={c.key} onClick={() => setCi(i)} className={`rounded-lg border px-2.5 py-1 text-xs transition ${i === ci ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="mx-auto grid max-w-[260px] grid-cols-6 gap-[3px]">
        {Array.from({ length: 36 }, (_, i) => {
          const a = Math.floor(i / 6) + 1
          const b = (i % 6) + 1
          const on = cond.test(a, b)
          return (
            <div key={i} className={`flex aspect-square items-center justify-center rounded text-[9px] font-mono ${on ? 'bg-accent/30 text-accent ring-1 ring-accent/50' : 'bg-surface-2 text-muted'}`}>
              {a},{b}
            </div>
          )
        })}
      </div>

      <p className="mt-3 text-center font-mono text-sm">
        P({cond.label}) = {count}/36 = <span className="font-bold text-accent">{frac.n}/{frac.d}</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        Two dice give 6 × 6 = 36 equally likely outcomes. Count the highlighted ones over 36.
      </p>
    </div>
  )
}
