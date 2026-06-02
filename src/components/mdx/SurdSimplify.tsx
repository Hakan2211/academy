import { useState } from 'react'

// Simplifying surds: pull the biggest perfect square out from under the root.
// √72 = √(36·2) = 6√2. The irrational part shrinks to its simplest form. Used
// in surds.
const PRESETS = [8, 12, 18, 20, 32, 50, 72, 98]

function simplify(n: number) {
  let best = 1
  for (let s = 2; s * s <= n; s++) if (n % (s * s) === 0) best = s
  return { outside: best, inside: n / (best * best) }
}

export function SurdSimplify() {
  const [n, setN] = useState(72)
  const { outside, inside } = simplify(n)
  const isPerfect = inside === 1
  const alreadySimple = outside === 1

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {PRESETS.map((p) => (
          <button key={p} onClick={() => setN(p)} className={`rounded-lg border px-2.5 py-1 font-mono text-sm transition ${p === n ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            √{p}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-surface-2 py-5 text-center font-mono">
        {isPerfect ? (
          <div className="text-2xl font-bold text-success">√{n} = {outside}</div>
        ) : alreadySimple ? (
          <div className="text-2xl font-bold text-ink">√{n} <span className="text-sm font-sans text-muted">— already simplest</span></div>
        ) : (
          <>
            <div className="text-lg text-muted">√{n} = √({outside * outside} × {inside})</div>
            <div className="mt-1 text-3xl font-bold text-accent">= {outside}√{inside}</div>
          </>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        {isPerfect
          ? `${n} is a perfect square, so the root is a whole number.`
          : `The largest square factor of ${n} is ${outside * outside}; its root ${outside} steps outside, leaving √${inside} (which is irrational).`}
      </p>
      <p className="mt-1 text-center text-xs text-muted">Key rule: √(a × b) = √a × √b.</p>
    </div>
  )
}
