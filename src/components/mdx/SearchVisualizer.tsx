import { useState } from 'react'
import { cn } from '#/lib/cn'

// Two ways to find a value in a SORTED list. LINEAR search walks left to right,
// checking every cell — simple, but slow. BINARY search checks the middle and
// throws away half the list each time, homing in fast. The comparison counts
// make binary's logarithmic advantage obvious: even on 16 items it needs only a
// handful of checks. Note: binary only works because the data is sorted.

const DATA = [3, 8, 11, 15, 22, 27, 31, 36, 44, 51, 58, 60, 67, 73, 88, 95]

type Mode = 'linear' | 'binary'

export function SearchVisualizer() {
  const [mode, setMode] = useState<Mode>('binary')
  const [target, setTarget] = useState(58)
  // linear state
  const [li, setLi] = useState(-1)
  // binary state
  const [lo, setLo] = useState(0)
  const [hi, setHi] = useState(DATA.length - 1)
  const [mid, setMid] = useState(-1)
  // shared
  const [comparisons, setComparisons] = useState(0)
  const [found, setFound] = useState<number | null>(null)
  const [exhausted, setExhausted] = useState(false)

  function reset(m: Mode = mode, t: number = target) {
    setMode(m)
    setTarget(t)
    setLi(-1)
    setLo(0)
    setHi(DATA.length - 1)
    setMid(-1)
    setComparisons(0)
    setFound(null)
    setExhausted(false)
  }

  function step() {
    if (found !== null || exhausted) return
    if (mode === 'linear') {
      const next = li + 1
      if (next >= DATA.length) { setExhausted(true); return }
      setLi(next)
      setComparisons((c) => c + 1)
      if (DATA[next] === target) setFound(next)
    } else {
      if (lo > hi) { setExhausted(true); return }
      const m = Math.floor((lo + hi) / 2)
      setMid(m)
      setComparisons((c) => c + 1)
      if (DATA[m] === target) setFound(m)
      else if (DATA[m] < target) setLo(m + 1)
      else setHi(m - 1)
    }
  }

  const active = mode === 'linear' ? li : mid
  const inWindow = (idx: number) => mode === 'binary' && idx >= lo && idx <= hi && found === null && !exhausted

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(['linear', 'binary'] as Array<Mode>).map((m) => (
            <button key={m} type="button" onClick={() => reset(m)}
              className={cn('rounded-full border px-3 py-1 text-sm capitalize transition-colors',
                mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
              {m} search
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          target
          <select value={target} onChange={(e) => reset(mode, Number(e.target.value))}
            className="rounded-lg border border-border bg-surface-2 px-2 py-1 font-mono text-sm text-ink">
            {[...DATA, 40].sort((a, b) => a - b).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {DATA.map((v, idx) => {
          const isActive = idx === active && found === null && !exhausted
          const isFound = idx === found
          const dim = mode === 'binary' && !inWindow(idx) && found === null && !exhausted
          return (
            <div key={idx} className={cn(
              'flex h-12 w-12 flex-col items-center justify-center rounded-lg border-2 font-mono transition-colors',
              isFound ? 'border-success bg-success/20 text-success' :
                isActive ? 'border-accent bg-accent/20 text-accent' :
                  dim ? 'border-border/40 text-muted/40' : 'border-border text-ink',
            )}>
              <span className="text-sm font-bold">{v}</span>
              <span className="text-[9px] text-muted">{idx}</span>
            </div>
          )
        })}
      </div>

      {mode === 'binary' && found === null && !exhausted && (
        <p className="mt-2 text-center text-xs text-muted">
          Search window: indices <span className="font-mono text-ink">{lo}…{hi}</span>
          {mid >= 0 && <> · checking middle <span className="font-mono text-accent">{mid}</span></>}
        </p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-border bg-surface-2 px-2 py-2">
          <div className="text-xs text-muted">comparisons</div>
          <div className="font-mono text-lg font-bold text-accent">{comparisons}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface-2 px-2 py-2">
          <div className="text-xs text-muted">worst case</div>
          <div className="font-mono text-lg font-bold text-ink">{mode === 'linear' ? DATA.length : Math.ceil(Math.log2(DATA.length + 1))}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface-2 px-2 py-2">
          <div className="text-xs text-muted">status</div>
          <div className={cn('text-sm font-bold', found !== null ? 'text-success' : exhausted ? 'text-warn' : 'text-muted')}>
            {found !== null ? `found @ ${found}` : exhausted ? 'not present' : 'searching'}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <button type="button" onClick={step} disabled={found !== null || exhausted}
          className="rounded-lg border border-accent bg-accent/15 px-5 py-1.5 text-sm font-semibold text-accent disabled:opacity-40">
          Step
        </button>
        <button type="button" onClick={() => reset()}
          className="rounded-lg border border-border px-4 py-1.5 text-sm text-muted hover:text-ink">↺ Reset</button>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        {mode === 'linear'
          ? 'Linear search checks every cell in turn — up to 16 comparisons here.'
          : 'Binary search halves the window each step — at most 5 comparisons for 16 items. It needs sorted data.'}
      </p>
    </div>
  )
}
