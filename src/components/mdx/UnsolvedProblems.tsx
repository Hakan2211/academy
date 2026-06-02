import { useState } from 'react'

// A gallery of famous unsolved problems — proof that mathematics is a living,
// unfinished frontier. Each is simple to state and (so far) impossible to
// settle. Used in famous-unsolved-problems.
const PROBLEMS = [
  {
    name: 'Goldbach',
    title: "Goldbach's Conjecture",
    statement: 'Every even number greater than 2 is the sum of two primes (e.g. 28 = 5 + 23).',
    status: 'Open since 1742. Verified by computer past 4 × 10¹⁸ — but never proved for all.',
  },
  {
    name: 'Twin',
    title: 'Twin Prime Conjecture',
    statement: 'There are infinitely many prime pairs just 2 apart, like (11, 13) and (17, 19).',
    status: 'Open. In 2013 we learned infinitely many primes are within 246 of each other — close, but not 2.',
  },
  {
    name: 'Collatz',
    title: 'The Collatz Conjecture',
    statement: 'Take any number: if even halve it, if odd do 3n + 1. Repeat. Do you always reach 1?',
    status: 'Open. Checked for enormous numbers; no counterexample, no proof. Erdős said maths "is not ready" for it.',
  },
  {
    name: 'Riemann',
    title: 'The Riemann Hypothesis',
    statement: 'A deep claim about the zeros of the zeta function that would pin down how primes are distributed.',
    status: 'Open since 1859. A $1 million Millennium Prize problem — the most famous open question in maths.',
  },
  {
    name: 'PvNP',
    title: 'P vs NP',
    statement: 'If a solution can be checked quickly, can it also be found quickly?',
    status: 'Open. A $1 million prize; its answer would reshape computing, cryptography, and science.',
  },
]

export function UnsolvedProblems() {
  const [i, setI] = useState(0)
  const p = PROBLEMS[i]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {PROBLEMS.map((pr, k) => (
          <button key={pr.name} onClick={() => setI(k)} className={`rounded-lg border px-2.5 py-1 text-xs transition ${k === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {pr.name}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-surface-2 p-4">
        <h3 className="text-center text-lg font-bold text-accent">{p.title}</h3>
        <p className="mt-2 text-center text-sm text-ink">{p.statement}</p>
        <p className="mt-3 text-center text-xs text-muted">{p.status}</p>
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        Each is simple enough to explain in a sentence — and has defeated the greatest minds for decades or centuries. Mathematics is far from finished.
      </p>
    </div>
  )
}
