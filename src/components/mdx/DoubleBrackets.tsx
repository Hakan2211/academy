import { useState } from 'react'

// Expanding (x + a)(x + b) as a 2×2 area grid — the four products are the four
// rectangles (FOIL). The middle term a+b appears because two rectangles share
// the x dimension. Used in expanding-double-brackets.
export function DoubleBrackets() {
  const [a, setA] = useState(3)
  const [b, setB] = useState(2)
  const sum = a + b
  const prod = a * b

  const cells = [
    { w: 'x', h: 'x', val: 'x²', cls: 'bg-accent/25 text-accent' },
    { w: `${a}`, h: 'x', val: `${a}x`, cls: 'bg-accent-2/25 text-accent-2' },
    { w: 'x', h: `${b}`, val: `${b}x`, cls: 'bg-accent-2/25 text-accent-2' },
    { w: `${a}`, h: `${b}`, val: `${prod}`, cls: 'bg-muted/25 text-ink' },
  ]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mx-auto grid max-w-[240px] grid-cols-[1.6fr_1fr] grid-rows-[1.6fr_1fr] gap-1">
        {cells.map((cell, i) => (
          <div key={i} className={`flex aspect-[1.4] items-center justify-center rounded-md font-mono text-lg font-bold ${cell.cls}`}>
            {cell.val}
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">a</span>
          <input type="range" min={-5} max={5} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{a}</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">b</span>
          <input type="range" min={-5} max={5} value={b} onChange={(e) => setB(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{b}</span>
        </label>
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        (x + {a})(x + {b}) = x² {sum >= 0 ? '+ ' + sum : '− ' + -sum}x {prod >= 0 ? '+ ' + prod : '− ' + -prod}
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        Four products (FOIL): the two "x" rectangles merge into the middle term ({a} + {b})x.
      </p>
    </div>
  )
}
