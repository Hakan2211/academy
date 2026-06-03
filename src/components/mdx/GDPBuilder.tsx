import { useState } from 'react'
import { cn } from '#/lib/cn'
import { Formula } from '#/components/mdx/Formula'
import { SceneSlider } from '#/components/three/SceneSlider'
import { formatUSD } from '#/lib/econ'

// FLAGSHIP. GDP built from the expenditure approach: GDP = C + I + G + NX.
// Four sliders pour the spending categories into one running total, drawn as a
// stacked bar so you can see which slice dominates. A second panel of toggles
// tests what actually COUNTS in GDP this year — a new car (yes, final new
// production) versus a used car, a stock trade, or a welfare cheque (no — no
// new good or service is produced). Money is in $ billions.

type Comp = { key: string; label: string; color: string; min: number; max: number }

const COMPS: Array<Comp> = [
  { key: 'c', label: 'Consumption (C)', color: 'var(--color-accent)', min: 0, max: 1600 },
  { key: 'i', label: 'Investment (I)', color: 'var(--color-accent-2)', min: 0, max: 800 },
  { key: 'g', label: 'Government (G)', color: 'var(--color-success)', min: 0, max: 800 },
  { key: 'nx', label: 'Net exports (NX)', color: 'var(--color-ink)', min: -400, max: 400 },
]

type Counted = {
  id: string
  label: string
  counts: boolean
  why: string
}

const ITEMS: Array<Counted> = [
  { id: 'newcar', label: 'You buy a brand-new car', counts: true, why: 'A newly produced final good — counts in consumption this year.' },
  { id: 'usedcar', label: 'You buy a used car from a neighbour', counts: false, why: 'Already counted the year it was built. Reselling moves an existing good, it produces nothing new.' },
  { id: 'stock', label: 'You buy 10 shares of a company', counts: false, why: 'A financial transfer of ownership, not new output. (The broker fee for the service would count.)' },
  { id: 'welfare', label: 'The government sends a welfare cheque', counts: false, why: 'A transfer payment — money moves, but no new good or service is produced in return.' },
  { id: 'haircut', label: 'You pay for a haircut', counts: true, why: 'A newly produced final service — counts in consumption.' },
  { id: 'bridge', label: 'The government builds a new bridge', counts: true, why: 'New production the government purchases — counts in government spending (G).' },
]

const VW = 360
const BAR_X = 130
const BAR_W = 180
const TOP = 24
const BAR_H = 200

export function GDPBuilder() {
  const [vals, setVals] = useState<Record<string, number>>({ c: 1100, i: 300, g: 350, nx: -50 })
  const [picks, setPicks] = useState<Record<string, boolean | undefined>>({})

  const gdp = COMPS.reduce((s, comp) => s + vals[comp.key], 0)

  // scale: sum of positive components sets the visible height (NX may be negative)
  const positives = COMPS.reduce((s, comp) => s + Math.max(0, vals[comp.key]), 0)
  const span = Math.max(positives, 1)
  const pxPer = BAR_H / span

  // stack the positive slices from the baseline up
  let cursor = TOP + BAR_H
  const slices = COMPS.map((comp) => {
    const v = vals[comp.key]
    const h = Math.max(0, v) * pxPer
    cursor -= h
    return { comp, v, y: cursor, h }
  })

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="px-4 pt-4 text-center">
        <Formula tex="GDP = C + I + G + NX" block />
      </div>

      <svg viewBox={`0 0 ${VW} ${TOP + BAR_H + 30}`} className="w-full">
        {/* baseline */}
        <line x1={BAR_X - 50} y1={TOP + BAR_H} x2={BAR_X + BAR_W + 10} y2={TOP + BAR_H} stroke="var(--color-border)" strokeWidth="2" />

        {/* stacked positive slices */}
        {slices.map(({ comp, h, y }) =>
          h > 0.5 ? (
            <g key={comp.key}>
              <rect x={BAR_X} y={y} width={BAR_W} height={h} fill={comp.color} opacity="0.85" />
              {h > 16 && (
                <text x={BAR_X + BAR_W / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-surface)">
                  {comp.key.toUpperCase()}
                </text>
              )}
            </g>
          ) : null,
        )}

        {/* GDP total bracket */}
        <line x1={BAR_X + BAR_W + 8} y1={TOP + BAR_H - positives * pxPer} x2={BAR_X + BAR_W + 8} y2={TOP + BAR_H} stroke="var(--color-muted)" strokeWidth="1.5" />
        <text x={BAR_X + BAR_W + 14} y={TOP + BAR_H - (positives * pxPer) / 2} fontSize="11" fill="var(--color-muted)">GDP</text>

        {/* net-exports note if negative */}
        {vals.nx < 0 && (
          <text x={BAR_X - 6} y={TOP + 14} textAnchor="end" fontSize="10" fill="var(--color-ink)">
            NX is negative: imports &gt; exports, so it subtracts.
          </text>
        )}
      </svg>

      <div className="mx-4 mb-2 flex items-center justify-between rounded-xl border border-accent/40 bg-accent/10 px-3 py-2">
        <span className="text-sm text-muted">Gross Domestic Product</span>
        <span className="font-mono text-lg text-accent">{formatUSD(gdp)} bn</span>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4">
        {COMPS.map((comp) => (
          <SceneSlider
            key={comp.key}
            label={comp.label}
            value={vals[comp.key]}
            min={comp.min}
            max={comp.max}
            step={comp.key === 'nx' ? 25 : 50}
            unit="bn"
            onChange={(v) => setVals((prev) => ({ ...prev, [comp.key]: v }))}
          />
        ))}
      </div>

      <div className="border-t border-border px-4 py-4">
        <p className="mb-3 text-sm text-muted">
          Tap each transaction — does it add to <span className="text-ink">this year&apos;s GDP</span>?
        </p>
        <div className="grid gap-2">
          {ITEMS.map((item) => {
            const guess = picks[item.id]
            const answered = guess !== undefined
            const correct = answered && guess === item.counts
            return (
              <div key={item.id} className="rounded-xl border border-border bg-surface-2 p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-ink">{item.label}</span>
                  <div className="flex shrink-0 gap-1.5">
                    {([true, false] as const).map((choice) => (
                      <button
                        key={String(choice)}
                        type="button"
                        onClick={() => setPicks((prev) => ({ ...prev, [item.id]: choice }))}
                        className={cn(
                          'rounded-full border px-3 py-1 text-xs transition-colors',
                          guess === choice
                            ? 'border-accent bg-accent/15 text-accent'
                            : 'border-border text-muted hover:text-ink',
                        )}
                      >
                        {choice ? 'Counts' : 'Skip'}
                      </button>
                    ))}
                  </div>
                </div>
                {answered && (
                  <p className={cn('mt-2 text-xs leading-relaxed', correct ? 'text-success' : 'text-accent-2')}>
                    {correct ? 'Correct. ' : 'Not quite. '}
                    {item.why}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
