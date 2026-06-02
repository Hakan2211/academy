import { useMemo, useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'
import { clamp, gaussianSample, mean, rng } from '#/lib/psych'

// A fixed population of dots scattered by their value. A slider sets the sample
// size n; the chosen sample is highlighted and its mean is compared with the
// true population mean. As n grows, the sample mean closes in on the truth (the
// law of large numbers). A "biased" toggle only ever samples the high end of
// the population, so the sample mean stays stubbornly wrong no matter how big n
// gets — sampling bias, not sample size. All draws are seeded (deterministic).
// Used in inferential-statistics.

const W = 360
const H = 160
const PAD = 20
const POP = 80
const TRUE_MEAN = 50
const TRUE_SD = 12

export function SamplingDemo() {
  const [n, setN] = useState(8)
  const [biased, setBiased] = useState(false)
  const [seed, setSeed] = useState(1)

  // Fixed population (same every render — seeded).
  const pop = useMemo(() => {
    const next = rng(424242)
    return Array.from({ length: POP }, () => clamp(TRUE_MEAN + gaussianSample(next) * TRUE_SD, 5, 95))
  }, [])
  const popMean = useMemo(() => mean(pop), [pop])

  // Pick which indices are in the current sample. A fresh draw re-seeds.
  const sample = useMemo(() => {
    const order = pop
      .map((v, i) => ({ v, i }))
      .slice()
    // Deterministic shuffle keyed by seed.
    const next = rng(seed * 7919 + 13)
    if (biased) {
      // Bias: prefer the highest values (e.g. only surveying the wealthy).
      order.sort((a, b) => b.v - a.v)
      return order.slice(0, n).map((o) => o.i)
    }
    order.sort(() => next() - 0.5)
    return order.slice(0, n).map((o) => o.i)
  }, [pop, n, biased, seed])

  const inSample = new Set(sample)
  const sampleMean = mean(sample.map((i) => pop[i]))
  const err = sampleMean - popMean

  const xOf = (i: number) => PAD + (i % 16) * ((W - 2 * PAD) / 15)
  const yOf = (i: number, v: number) => {
    const row = Math.floor(i / 16)
    // jitter rows by value so higher values sit higher
    return PAD + 8 + row * 26 + (95 - v) * 0.05
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {pop.map((v, i) => (
          <circle
            key={i}
            cx={xOf(i)}
            cy={yOf(i, v)}
            r={inSample.has(i) ? 4.5 : 3}
            fill={inSample.has(i) ? 'var(--color-accent)' : 'var(--color-border)'}
            stroke={inSample.has(i) ? '#fff' : 'none'}
            strokeWidth="0.8"
            opacity={inSample.has(i) ? 1 : 0.6}
          />
        ))}
      </svg>

      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setBiased((b) => !b)}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            biased ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          {biased ? 'Biased sample (high end only)' : 'Random sample'}
        </button>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          disabled={biased}
          className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm text-muted enabled:hover:text-ink disabled:opacity-40"
        >
          <Icon name="Dices" size={14} /> Draw again
        </button>
      </div>

      <label className="flex items-center justify-between gap-3 px-1 text-sm">
        <span className="text-muted">sample size n</span>
        <input
          type="range"
          min={2}
          max={60}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="w-1/2 accent-accent"
        />
        <span className="w-8 text-right font-mono text-ink">{n}</span>
      </label>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-surface-2 p-2">
          <p className="text-xs text-muted">True mean</p>
          <p className="font-mono text-lg font-bold text-ink">{popMean.toFixed(1)}</p>
        </div>
        <div className="rounded-xl bg-surface-2 p-2">
          <p className="text-xs text-muted">Sample mean</p>
          <p className="font-mono text-lg font-bold text-accent">{sampleMean.toFixed(1)}</p>
        </div>
        <div className="rounded-xl bg-surface-2 p-2">
          <p className="text-xs text-muted">Error</p>
          <p className={cn('font-mono text-lg font-bold', Math.abs(err) < 2 ? 'text-success' : 'text-ink')}>
            {err > 0 ? '+' : ''}
            {err.toFixed(1)}
          </p>
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        {biased
          ? 'A biased sample stays wrong however large n grows — bias is about how you pick, not how many you pick.'
          : 'With a random sample, drag n bigger and the error shrinks toward zero: the law of large numbers.'}
      </p>
    </div>
  )
}
