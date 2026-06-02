import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Natural selection in action. A population varies in one trait; the environment
// favours one variant, which survives and reproduces more — so its share climbs
// generation after generation. Works for camouflaged beetles or, with the
// `preset`, antibiotic-resistant bacteria.
const N = 24

type Preset = 'beetles' | 'bacteria'
const PRESETS: Record<Preset, { a: string; b: string; aColor: string; bColor: string; envA: string; envB: string; pressure: string }> = {
  beetles: { a: 'dark', b: 'light', aColor: '#2d3436', bColor: '#dfe6e9', envA: 'dark soil', envB: 'pale sand', pressure: 'birds eat the easy-to-spot beetles' },
  bacteria: { a: 'resistant', b: 'normal', aColor: '#e74c3c', bColor: '#74b9ff', envA: 'antibiotic present', envB: 'no antibiotic', pressure: 'the antibiotic kills non-resistant bacteria' },
}

export function NaturalSelection({ preset = 'beetles' }: { preset?: Preset }) {
  const cfg = PRESETS[preset]
  const [aCount, setACount] = useState(12) // count of variant A
  const [gen, setGen] = useState(0)
  const [envFavoursA, setEnvFavoursA] = useState(true)

  const next = () => {
    const a = aCount
    const b = N - aCount
    const sA = envFavoursA ? 0.92 : 0.32
    const sB = envFavoursA ? 0.32 : 0.92
    const wa = a * sA
    const wb = b * sB
    const newA = Math.round((N * wa) / (wa + wb || 1))
    setACount(Math.max(0, Math.min(N, newA)))
    setGen((g) => g + 1)
  }
  const reset = () => {
    setACount(12)
    setGen(0)
  }

  const aPct = Math.round((aCount / N) * 100)
  const bg = envFavoursA ? cfg.aColor : cfg.bColor
  const envName = envFavoursA ? cfg.envA : cfg.envB

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => { setEnvFavoursA(true); reset() }}
          className={cn('rounded-full border px-3 py-1 text-sm transition-colors', envFavoursA ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
        >
          {cfg.envA}
        </button>
        <button
          type="button"
          onClick={() => { setEnvFavoursA(false); reset() }}
          className={cn('rounded-full border px-3 py-1 text-sm transition-colors', !envFavoursA ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
        >
          {cfg.envB}
        </button>
      </div>

      {/* the population */}
      <div className="rounded-xl p-3 transition-colors" style={{ background: `${bg}55` }}>
        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: N }).map((_, i) => {
            const isA = i < aCount
            return (
              <span
                key={i}
                className="mx-auto h-5 w-5 rounded-full ring-1 ring-black/20 transition-colors"
                style={{ background: isA ? cfg.aColor : cfg.bColor }}
              />
            )
          })}
        </div>
      </div>

      {/* proportion bar */}
      <div className="mt-3 flex h-4 overflow-hidden rounded-full">
        <div className="h-full transition-all" style={{ width: `${aPct}%`, background: cfg.aColor }} />
        <div className="h-full flex-1 transition-all" style={{ background: cfg.bColor }} />
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted">
        <span style={{ color: cfg.aColor === '#2d3436' ? '#94a3b8' : cfg.aColor }}>{cfg.a}: {aPct}%</span>
        <span>generation {gen}</span>
        <span>{cfg.b}: {100 - aPct}%</span>
      </div>

      <p className="mt-2 text-center text-sm text-muted">
        In <span className="text-ink">{envName}</span>, {cfg.pressure}. Run the generations and watch the favoured variant take over.
      </p>

      <div className="mt-2 flex justify-center gap-2">
        <button type="button" onClick={next} className="flex items-center gap-1.5 rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent hover:bg-accent/25">
          <Icon name="FastForward" size={14} /> Next generation
        </button>
        <button type="button" onClick={reset} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted hover:text-ink">
          <Icon name="RotateCcw" size={14} /> Reset
        </button>
      </div>
    </div>
  )
}
