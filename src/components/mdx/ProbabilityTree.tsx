import { useState } from 'react'
import { simplifyFrac, mulFrac, type Frac } from '#/lib/math'

// A probability tree for drawing two balls from a bag of 3 red, 2 blue. Toggle
// replacement: WITH keeps the probabilities fixed; WITHOUT changes the second
// branch — the essence of conditional probability. Used in tree-diagrams and
// conditional-probability.
const fr = (f: Frac) => `${f.n}/${f.d}`

export function ProbabilityTree() {
  const [repl, setRepl] = useState(true)
  // first draw (3 red, 2 blue of 5)
  const p1R: Frac = { n: 3, d: 5 }
  const p1B: Frac = { n: 2, d: 5 }
  // second draw
  const afterR_R: Frac = repl ? { n: 3, d: 5 } : { n: 2, d: 4 }
  const afterR_B: Frac = repl ? { n: 2, d: 5 } : { n: 2, d: 4 }
  const afterB_R: Frac = repl ? { n: 3, d: 5 } : { n: 3, d: 4 }
  const afterB_B: Frac = repl ? { n: 2, d: 5 } : { n: 1, d: 4 }

  const RR = simplifyFrac(mulFrac(p1R, afterR_R))
  const RB = simplifyFrac(mulFrac(p1R, afterR_B))
  const BR = simplifyFrac(mulFrac(p1B, afterB_R))
  const BB = simplifyFrac(mulFrac(p1B, afterB_B))

  const Branch = ({ x1, y1, x2, y2, label }: { x1: number; y1: number; x2: number; y2: number; label: string }) => (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-border)" strokeWidth="1.5" />
      <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 3} textAnchor="middle" fontSize="10" fill="var(--color-accent)">{label}</text>
    </>
  )

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex justify-center gap-2">
        <button onClick={() => setRepl(true)} className={`rounded-lg border px-3 py-1 text-xs transition ${repl ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>With replacement</button>
        <button onClick={() => setRepl(false)} className={`rounded-lg border px-3 py-1 text-xs transition ${!repl ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>Without</button>
      </div>

      <svg viewBox="0 0 300 190" className="mx-auto w-full max-w-sm">
        <circle cx={20} cy={95} r="4" fill="var(--color-ink)" />
        <Branch x1={24} y1={95} x2={120} y2={50} label={fr(p1R)} />
        <Branch x1={24} y1={95} x2={120} y2={140} label={fr(p1B)} />
        <text x={126} y={54} fontSize="12" fontWeight="700" fill="#e74c3c">R</text>
        <text x={126} y={144} fontSize="12" fontWeight="700" fill="#3498db">B</text>
        <Branch x1={134} y1={50} x2={220} y2={28} label={fr(afterR_R)} />
        <Branch x1={134} y1={50} x2={220} y2={68} label={fr(afterR_B)} />
        <Branch x1={134} y1={140} x2={220} y2={118} label={fr(afterB_R)} />
        <Branch x1={134} y1={140} x2={220} y2={158} label={fr(afterB_B)} />
        {[['RR', 28, RR], ['RB', 70, RB], ['BR', 120, BR], ['BB', 160, BB]].map(([lab, y, f]) => (
          <text key={lab as string} x={226} y={(y as number) + 4} fontSize="10" fill="var(--color-ink)">
            {lab as string} = {fr(f as Frac)}
          </text>
        ))}
      </svg>

      <p className="mt-2 text-center text-xs text-muted">
        Multiply <strong>along</strong> branches for a path; add <strong>different</strong> paths. {repl ? 'With replacement the bag resets, so probabilities stay the same.' : 'Without replacement, one ball is gone — the second probabilities change. That dependence is conditional probability.'}
      </p>
    </div>
  )
}
