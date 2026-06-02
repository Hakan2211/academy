import { useState } from 'react'
import { cn } from '#/lib/cn'

// A truth table lists every possible combination of inputs and the output for
// each — the complete definition of a logic operation. With 2 inputs there are
// only 4 rows, so you can write down the WHOLE behaviour exactly. Pick a gate.

type Op = 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'NOT'

function evalOp(op: Op, a: number, b: number): number {
  switch (op) {
    case 'AND': return a & b
    case 'OR': return a | b
    case 'XOR': return a ^ b
    case 'NAND': return a & b ? 0 : 1
    case 'NOR': return a | b ? 0 : 1
    case 'NOT': return a ? 0 : 1
  }
}

export function TruthTable() {
  const [op, setOp] = useState<Op>('AND')
  const single = op === 'NOT'
  const rows = single ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap justify-center gap-2">
        {(['AND', 'OR', 'XOR', 'NAND', 'NOR', 'NOT'] as Array<Op>).map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setOp(o)}
            className={cn(
              'rounded-full border px-3 py-1 font-mono text-xs transition-colors',
              op === o ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {o}
          </button>
        ))}
      </div>

      <table className="mx-auto mt-4 w-full max-w-xs text-center font-mono">
        <thead>
          <tr className="text-sm text-muted">
            <th className="py-1 font-normal">A</th>
            {!single && <th className="py-1 font-normal">B</th>}
            <th className="py-1 font-normal text-accent">{op}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const out = evalOp(op, r[0], single ? 0 : r[1])
            return (
              <tr key={i} className="border-t border-border">
                <td className="py-2 text-ink">{r[0]}</td>
                {!single && <td className="py-2 text-ink">{r[1]}</td>}
                <td className={cn('py-2 font-bold', out ? 'text-accent' : 'text-muted')}>{out}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <p className="mt-2 text-center text-xs text-muted">
        Read 1 as TRUE and 0 as FALSE. <span className="text-ink">NAND</span> and <span className="text-ink">NOR</span> are just AND/OR with the output flipped — and remarkably, either one alone can build every other gate.
      </p>
    </div>
  )
}
