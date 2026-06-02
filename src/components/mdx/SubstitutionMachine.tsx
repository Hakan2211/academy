import { useState } from 'react'

// Substitution: a formula is a machine — feed in numbers for the letters, turn
// the handle (BODMAS), out comes a value. Here, the kinematics formula v = u + at.
// Used in substitution-and-formulae.
export function SubstitutionMachine() {
  const [u, setU] = useState(2)
  const [a, setA] = useState(3)
  const [t, setT] = useState(4)
  const v = u + a * t

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="rounded-xl bg-surface-2 p-4 text-center">
        <div className="font-mono text-lg text-muted">v = u + a t</div>
        <div className="mt-2 font-mono text-base text-ink">
          v = {u} + {a} × {t}
        </div>
        <div className="mt-1 font-mono text-base text-ink">
          v = {u} + {a * t}
        </div>
        <div className="mt-1 font-mono text-3xl font-bold text-success">v = {v}</div>
      </div>

      <div className="mt-3 space-y-2 px-1">
        {[['u (start speed)', u, setU], ['a (acceleration)', a, setA], ['t (time)', t, setT]].map(([lab, val, set]) => (
          <label key={lab as string} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted">{lab as string}</span>
            <input type="range" min={0} max={10} value={val as number} onChange={(e) => (set as (n: number) => void)(Number(e.target.value))} className="w-1/2 accent-accent" />
            <span className="w-6 text-right font-mono text-ink">{val as number}</span>
          </label>
        ))}
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        Replace each letter with its value, then follow the order of operations (× before +). Same formula, any numbers.
      </p>
    </div>
  )
}
