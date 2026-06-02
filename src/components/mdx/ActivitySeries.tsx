import { useState } from 'react'
import { cn } from '#/lib/cn'

// The activity series ranks metals by reactivity. A more reactive metal will
// displace a less reactive one from its compound — but never the other way
// round. Pick a metal strip and a dissolved metal salt to test it.
const SERIES = ['K', 'Na', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'Pb', 'Cu', 'Ag', 'Au']

export function ActivitySeries() {
  const [strip, setStrip] = useState('Zn')
  const [sol, setSol] = useState('Cu')
  const si = SERIES.indexOf(strip)
  const oi = SERIES.indexOf(sol)
  const reacts = si < oi // lower index = more reactive

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="flex gap-4">
        {/* the reactivity ladder */}
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[10px] text-muted">most reactive</span>
          <div className="flex flex-col gap-1">
            {SERIES.map((m, i) => (
              <div
                key={m}
                className={cn(
                  'w-12 rounded px-2 py-0.5 text-center text-xs font-mono',
                  m === strip && 'ring-2 ring-[#2ECC71]',
                  m === sol && 'ring-2 ring-[#E74C3C]',
                  i % 2 ? 'bg-surface-2' : 'bg-surface-2/60',
                )}
              >
                {m}
              </div>
            ))}
          </div>
          <span className="mt-1 text-[10px] text-muted">least reactive</span>
        </div>

        <div className="flex-1">
          <label className="mb-2 block text-sm">
            <span className="text-muted">Metal strip:</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {SERIES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setStrip(m)}
                  className={cn('rounded border px-2 py-0.5 text-xs font-mono', strip === m ? 'border-[#2ECC71] bg-[#2ECC71]/15 text-[#2ECC71]' : 'border-border text-muted')}
                >
                  {m}
                </button>
              ))}
            </div>
          </label>
          <label className="block text-sm">
            <span className="text-muted">Dissolved in solution (as ions):</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {SERIES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSol(m)}
                  className={cn('rounded border px-2 py-0.5 text-xs font-mono', sol === m ? 'border-[#E74C3C] bg-[#E74C3C]/15 text-[#E74C3C]' : 'border-border text-muted')}
                >
                  {m}
                </button>
              ))}
            </div>
          </label>

          <div className={cn('mt-3 rounded-lg p-3 text-sm', reacts ? 'bg-[#2ECC71]/12' : 'bg-surface-2')}>
            {strip === sol ? (
              <p className="text-muted">Pick two different metals to compare.</p>
            ) : reacts ? (
              <p>
                <span className="font-semibold text-[#2ECC71]">Reaction!</span> {strip} is more reactive than {sol}, so it
                displaces it: the {strip} strip dissolves and {sol} metal deposits out.
              </p>
            ) : (
              <p>
                <span className="font-semibold text-muted">No reaction.</span> {strip} is less reactive than {sol}, so it
                can't displace it. Reactivity only works downhill.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
