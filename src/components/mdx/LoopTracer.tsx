import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'

// A LOOP repeats a block of steps while a condition holds, carrying state from
// one pass to the next. Here we sum 1..n. Each "Step" runs one line; watch the
// counter i climb, the accumulator total grow, and the "check" line decide
// whether to loop again or stop. Change n with the slider to see the loop run
// more or fewer times — same code, different number of repetitions.

// Lines of the program (line that's "executing" gets highlighted).
const LINES = [
  'total ← 0',          // 0
  'i ← 1',              // 1
  'while i ≤ n:',       // 2  (the check)
  '    total ← total + i', // 3
  '    i ← i + 1',      // 4
  'return total',       // 5
]

type Row = { i: number; total: number }

export function LoopTracer() {
  const [n, setN] = useState(5)
  const [line, setLine] = useState(0)
  const [i, setI] = useState(0)
  const [total, setTotal] = useState(0)
  const [rows, setRows] = useState<Array<Row>>([])
  const [done, setDone] = useState(false)

  function reset(newN = n) {
    setN(newN)
    setLine(0)
    setI(0)
    setTotal(0)
    setRows([])
    setDone(false)
  }

  function step() {
    if (done) return
    switch (line) {
      case 0: // total <- 0
        setTotal(0)
        setLine(1)
        break
      case 1: // i <- 1
        setI(1)
        setLine(2)
        break
      case 2: // while check
        setLine(i <= n ? 3 : 5)
        break
      case 3: // total <- total + i
        setTotal((t) => t + i)
        setLine(4)
        break
      case 4: // i <- i + 1
        setRows((r) => [...r, { i, total: total + i }])
        setI((x) => x + 1)
        setLine(2)
        break
      case 5: // return
        setDone(true)
        break
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* code panel */}
        <div className="rounded-xl border border-border bg-surface-2 p-3">
          <div className="mb-2 text-xs font-mono uppercase tracking-wide text-accent">Program (n = {n})</div>
          <pre className="font-mono text-xs leading-relaxed">
            {LINES.map((l, idx) => (
              <div key={idx} className={cn(
                'rounded px-2 py-0.5 transition-colors',
                idx === line && !done ? 'bg-accent/15 text-accent' :
                  idx === 5 && done ? 'bg-success/15 text-success' : 'text-muted',
              )}>{l}</div>
            ))}
          </pre>
          <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-sm">
            <div className="rounded-lg border border-border bg-surface px-3 py-2">
              <dt className="text-xs text-muted">i</dt>
              <dd className="text-lg font-bold text-ink">{i}</dd>
            </div>
            <div className="rounded-lg border border-border bg-surface px-3 py-2">
              <dt className="text-xs text-muted">total</dt>
              <dd className="text-lg font-bold text-accent">{total}</dd>
            </div>
          </dl>
        </div>

        {/* iteration table */}
        <div className="rounded-xl border border-border bg-surface-2 p-3">
          <div className="mb-2 text-xs font-mono uppercase tracking-wide text-accent">Each pass through the loop</div>
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="text-muted">
                <th className="pb-1 text-left font-medium">pass</th>
                <th className="pb-1 text-left font-medium">i</th>
                <th className="pb-1 text-left font-medium">total after</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={3} className="py-2 text-muted">Press Step to run the loop…</td></tr>
              )}
              {rows.map((r, idx) => (
                <tr key={idx} className="border-t border-border/60">
                  <td className="py-1 text-muted">{idx + 1}</td>
                  <td className="py-1 text-ink">{r.i}</td>
                  <td className="py-1 text-accent">{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {done && (
            <div className="mt-3 rounded-lg bg-success/15 px-3 py-2 text-center text-sm font-bold text-success">
              Loop ended: 1 + 2 + … + {n} = {total}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid items-end gap-3 sm:grid-cols-[1fr_auto]">
        <SceneSlider label="n (count up to)" value={n} min={2} max={10} step={1} unit="" onChange={(v) => reset(v)} />
        <div className="flex gap-2">
          <button type="button" onClick={step} disabled={done}
            className="rounded-lg border border-accent bg-accent/15 px-4 py-1.5 text-sm font-semibold text-accent disabled:opacity-40">
            Step
          </button>
          <button type="button" onClick={() => reset()}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink">↺ Reset</button>
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        The loop repeats lines 3–4 while <span className="font-mono text-ink">i ≤ n</span>. State carries between passes; when the check fails, it stops.
      </p>
    </div>
  )
}
