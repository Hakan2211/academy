import { useState } from 'react'
import { cn } from '#/lib/cn'

// What shapes a population's size. In logistic growth, a population grows fast,
// then levels off at the carrying capacity its habitat can support. In a
// predator–prey system, the two cycle up and down, each chasing the other.
type Mode = 'logistic' | 'predator'

const X0 = 38
const X1 = 308
const Y0 = 16
const Y1 = 130

function curve(fn: (t: number) => number) {
  const p: Array<string> = []
  for (let i = 0; i <= 100; i++) {
    const x = X0 + (i / 100) * (X1 - X0)
    const y = Y1 - fn(i / 100) * (Y1 - Y0)
    p.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return p.join(' ')
}

const logistic = (t: number) => 1 / (1 + Math.exp(-(t * 12 - 5))) * 0.86
const prey = (t: number) => 0.45 + 0.32 * Math.sin(t * Math.PI * 4)
const predator = (t: number) => 0.45 + 0.32 * Math.sin(t * Math.PI * 4 - 1)

export function PopulationGraph() {
  const [mode, setMode] = useState<Mode>('logistic')

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex gap-2">
        {(['logistic', 'predator'] as Array<Mode>).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className={cn('rounded-full border px-3 py-1 text-sm transition-colors', mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
            {m === 'logistic' ? 'Logistic growth' : 'Predator–prey'}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 320 150" className="w-full">
        <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke="var(--color-border)" strokeWidth={1} />
        <line x1={X0} y1={Y1} x2={X1} y2={Y1} stroke="var(--color-border)" strokeWidth={1} />
        <text x={6} y={78} transform="rotate(-90 10 78)" className="fill-muted text-[9px]">population</text>
        <text x={X1} y={146} textAnchor="end" className="fill-muted text-[9px]">time →</text>

        {mode === 'logistic' ? (
          <>
            <line x1={X0} y1={Y1 - 0.86 * (Y1 - Y0)} x2={X1} y2={Y1 - 0.86 * (Y1 - Y0)} stroke="#E74C3C" strokeWidth={1} strokeDasharray="4 4" />
            <text x={X1} y={Y1 - 0.86 * (Y1 - Y0) - 4} textAnchor="end" className="fill-[#E74C3C] text-[8px]">carrying capacity</text>
            <polyline points={curve(logistic)} fill="none" stroke="#2ECC71" strokeWidth={2.5} />
          </>
        ) : (
          <>
            <polyline points={curve(prey)} fill="none" stroke="#2ECC71" strokeWidth={2.5} />
            <polyline points={curve(predator)} fill="none" stroke="#E74C3C" strokeWidth={2.5} />
          </>
        )}
      </svg>

      {mode === 'predator' && (
        <div className="mb-1 flex justify-center gap-4 text-[11px]">
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-4 rounded bg-[#2ECC71]" /> prey</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-4 rounded bg-[#E74C3C]" /> predator</span>
        </div>
      )}

      <p className="mt-1 text-center text-sm text-muted">
        {mode === 'logistic'
          ? 'A population grows quickly, then slows and levels off at the carrying capacity — the most the habitat can support (limited by food, space, and predators).'
          : 'More prey → predators thrive and multiply → they eat the prey down → predators starve and fall → prey recover. The two cycle endlessly, the predator peak lagging the prey.'}
      </p>
    </div>
  )
}
