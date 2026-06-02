import { useMemo, useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'

// RECURSION: a function that calls itself on a smaller problem until it hits a
// BASE CASE. We trace factorial(n) = n × factorial(n−1), with factorial(1) = 1.
// Step "down" and the call stack grows — each call waits on the one below it.
// Hit the base case, then step "up" and the values return, multiplying as they
// unwind. The stack growing and shrinking IS recursion.

type Phase = { depth: number; dir: 'down' | 'base' | 'up'; value?: number }

function buildPhases(n: number): Array<Phase> {
  const phases: Array<Phase> = []
  // descend: factorial(n) calls factorial(n-1) ... down to 1
  for (let d = n; d >= 1; d--) {
    phases.push({ depth: d, dir: d === 1 ? 'base' : 'down' })
  }
  // ascend: values return, multiplying up
  let acc = 1
  for (let d = 1; d <= n; d++) {
    acc = d === 1 ? 1 : acc * d
    phases.push({ depth: d, dir: 'up', value: acc })
  }
  return phases
}

export function RecursionTree() {
  const [n, setN] = useState(4)
  const [step, setStep] = useState(0)
  const phases = useMemo(() => buildPhases(n), [n])
  const cur = phases[Math.min(step, phases.length - 1)]
  const atEnd = step >= phases.length - 1

  function reset(newN = n) { setN(newN); setStep(0) }

  // Resolved return value for a given depth once we're unwinding past it.
  const resolved: Record<number, number> = {}
  for (let s = 0; s <= step; s++) {
    const p = phases[s]
    if (p.dir === 'up' && p.value !== undefined) resolved[p.depth] = p.value
    if (p.dir === 'base') resolved[1] = 1
  }
  // How deep have we descended so far (max depth opened)?
  let openedTo = n + 1
  for (let s = 0; s <= step; s++) openedTo = Math.min(openedTo, phases[s].depth)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-col gap-2">
        {Array.from({ length: n }, (_, k) => n - k).map((d) => {
          const opened = d >= openedTo
          const isCur = cur.depth === d
          const ret = resolved[d]
          const indent = (n - d) * 22
          const base = d === 1
          return (
            <div key={d} style={{ marginLeft: indent }}
              className={cn(
                'flex items-center justify-between rounded-xl border-2 px-3 py-2 font-mono text-sm transition-all',
                !opened ? 'border-dashed border-border/40 text-muted/30' :
                  isCur ? 'border-accent bg-accent/15 text-accent' :
                    ret !== undefined ? 'border-success/60 bg-success/10 text-ink' :
                      'border-border bg-surface-2 text-ink',
              )}>
              <span>
                factorial(<span className="font-bold">{d}</span>)
                {opened && (base
                  ? <span className="ml-2 text-xs text-muted">base case → 1</span>
                  : <span className="ml-2 text-xs text-muted">= {d} × factorial({d - 1})</span>)}
              </span>
              <span className={cn('text-xs', ret !== undefined ? 'text-success' : 'text-muted')}>
                {ret !== undefined ? `↩ returns ${ret}` : opened ? 'waiting…' : ''}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface-2 p-3 text-center text-sm">
        {cur.dir === 'down' && <span className="text-muted">Calling <span className="font-mono text-accent">factorial({cur.depth})</span> — pushing a new frame onto the stack ↓</span>}
        {cur.dir === 'base' && <span className="text-muted">Reached the <span className="text-accent">base case</span>: factorial(1) returns 1 with no further call.</span>}
        {cur.dir === 'up' && <span className="text-muted">Unwinding: <span className="font-mono text-success">factorial({cur.depth}) = {cur.depth} × {cur.depth === 1 ? 1 : (cur.value! / cur.depth)} = {cur.value}</span> ↑</span>}
      </div>

      <div className="mt-4 grid items-end gap-3 sm:grid-cols-[1fr_auto]">
        <SceneSlider label="n in factorial(n)" value={n} min={1} max={6} step={1} unit="" onChange={(v) => reset(v)} />
        <div className="flex gap-2">
          <button type="button" onClick={() => setStep((s) => Math.min(phases.length - 1, s + 1))} disabled={atEnd}
            className="rounded-lg border border-accent bg-accent/15 px-4 py-1.5 text-sm font-semibold text-accent disabled:opacity-40">
            Step
          </button>
          <button type="button" onClick={() => reset()}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-ink">↺ Reset</button>
        </div>
      </div>

      {atEnd && (
        <p className="mt-3 text-center text-sm font-bold text-success">factorial({n}) = {resolved[n]}</p>
      )}
      <p className="mt-2 text-center text-xs text-muted">
        Calls stack up as the problem shrinks (indenting right); once the base case returns, the answers multiply back up.
      </p>
    </div>
  )
}
