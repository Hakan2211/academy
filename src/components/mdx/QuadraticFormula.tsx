import { useState } from 'react'

// The quadratic formula as a calculator, with the discriminant front and centre.
// The sign of b² − 4ac decides everything: two roots, one, or none. Used in
// the-quadratic-formula.
export function QuadraticFormula() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(-5)
  const [c, setC] = useState(6)
  const A = a === 0 ? 1 : a
  const disc = b * b - 4 * A * c
  const fmt = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(2))

  let verdict: string
  let roots: string
  if (disc > 0) {
    verdict = 'positive → two real roots'
    roots = `x = ${fmt((-b - Math.sqrt(disc)) / (2 * A))}  or  x = ${fmt((-b + Math.sqrt(disc)) / (2 * A))}`
  } else if (disc === 0) {
    verdict = 'zero → one repeated root'
    roots = `x = ${fmt(-b / (2 * A))}`
  } else {
    verdict = 'negative → no real roots'
    roots = 'no real solutions'
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="rounded-xl bg-surface-2 p-3 text-center">
        <div className="font-mono text-base text-muted">x = ( −b ± √(b² − 4ac) ) / 2a</div>
        <div className="mt-2 font-mono text-sm text-ink">
          b² − 4ac = {b}² − 4·{a}·{c} = <span className="font-bold text-accent">{fmt(disc)}</span>
        </div>
        <div className="mt-1 text-xs text-accent">{verdict}</div>
        <div className="mt-2 font-mono text-lg font-bold text-success">{roots}</div>
      </div>

      <div className="mt-3 space-y-1.5 px-1">
        {[['a', a, setA, 1, 3], ['b', b, setB, -8, 8], ['c', c, setC, -8, 8]].map(([lab, val, set, mn, mx]) => (
          <label key={lab as string} className="flex items-center justify-between gap-3 text-sm">
            <span className="w-4 text-muted">{lab as string}</span>
            <input type="range" min={mn as number} max={mx as number} value={val as number} onChange={(e) => (set as (n: number) => void)(Number(e.target.value))} className="flex-1 accent-accent" />
            <span className="w-8 text-right font-mono text-ink">{val as number}</span>
          </label>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        The quadratic formula solves <em>every</em> quadratic — even the ones that won't factorise. The discriminant b² − 4ac counts the roots.
      </p>
    </div>
  )
}
