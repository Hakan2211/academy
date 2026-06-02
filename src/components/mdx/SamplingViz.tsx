import { useState } from 'react'

// Population vs sample. We can't survey everyone, so we sample — and a bigger,
// fair sample estimates the true proportion better. Used in
// types-of-data-and-sampling.
const POP = 100
const TRUE_BLUE = 62 // out of 100
// deterministic "shuffled" order so samples look mixed (no Math.random in render)
const ORDER = Array.from({ length: POP }, (_, i) => (i * 37) % POP)

export function SamplingViz() {
  const [n, setN] = useState(20)
  const sampleIdx = new Set(ORDER.slice(0, n))
  let blueInSample = 0
  sampleIdx.forEach((i) => {
    if (i < TRUE_BLUE) blueInSample++
  })
  const est = n > 0 ? Math.round((blueInSample / n) * 100) : 0

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mx-auto grid max-w-[260px] grid-cols-10 gap-[3px]">
        {Array.from({ length: POP }, (_, i) => {
          const isBlue = i < TRUE_BLUE
          const inSample = sampleIdx.has(i)
          return (
            <div
              key={i}
              className={`aspect-square rounded-full ${isBlue ? 'bg-accent' : 'bg-accent-2'} ${inSample ? 'ring-2 ring-ink' : 'opacity-30'}`}
            />
          )
        })}
      </div>

      <div className="mt-3 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">sample size</span>
          <input type="range" min={5} max={100} step={5} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-8 text-right font-mono text-ink">{n}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-sm">
        Sample estimate: <span className="font-mono text-accent">{est}%</span> blue · true value: <span className="font-mono text-ink">{TRUE_BLUE}%</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        A small sample can mislead; a larger, representative one closes in on the true proportion. The ringed dots are the ones surveyed.
      </p>
    </div>
  )
}
