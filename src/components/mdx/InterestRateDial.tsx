import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// The central bank's one big lever: the POLICY INTEREST RATE. Set it low and
// borrowing gets cheap — households take out mortgages and car loans, firms
// borrow to invest, so spending and aggregate demand surge (and, if pushed too
// far, inflation heats up). Set it high and the opposite: borrowing is dear,
// loans dry up, investment and spending cool, and inflation is reined in. This is
// MONETARY POLICY transmission. Turn the dial (the bank does this mainly through
// OPEN-MARKET OPERATIONS — buying bonds to push rates down, selling to push them
// up) and watch the needle swing and the response gauges fill in step.
const NEUTRAL = 3 // the "neutral" rate that neither stimulates nor cools

// dial geometry — a 240° arc, low rate on the left, high on the right
const CX = 130
const CY = 118
const R = 90
const A_START = 150 // degrees (left end, low rate)
const A_END = -30 // degrees swept clockwise to the right end (high rate)
const RATE_MIN = 0
const RATE_MAX = 8

function rateToAngle(rate: number) {
  const t = (rate - RATE_MIN) / (RATE_MAX - RATE_MIN)
  return A_START + (A_END - A_START) * t
}
function polar(angleDeg: number, radius: number) {
  const a = (angleDeg * Math.PI) / 180
  return { x: CX + Math.cos(a) * radius, y: CY - Math.sin(a) * radius }
}

// each response is a 0..1 fill driven by how far the rate is from neutral.
// LOW rate (below neutral) => stimulus => borrowing/spending/inflation HIGH.
function responses(rate: number) {
  const stim = clamp((NEUTRAL - rate) / 5, -1, 1) // + when rate below neutral
  return {
    borrowing: clamp(0.5 + stim * 0.5, 0, 1),
    investment: clamp(0.5 + stim * 0.45, 0, 1),
    spending: clamp(0.5 + stim * 0.4, 0, 1),
    inflation: clamp(0.45 + stim * 0.45, 0, 1),
  }
}

const GAUGES: Array<{ key: keyof ReturnType<typeof responses>; label: string }> = [
  { key: 'borrowing', label: 'Borrowing' },
  { key: 'investment', label: 'Investment' },
  { key: 'spending', label: 'Spending (AD)' },
  { key: 'inflation', label: 'Inflation' },
]

export function InterestRateDial() {
  const [rate, setRate] = useState(NEUTRAL)
  const r = responses(rate)

  const needle = polar(rateToAngle(rate), R - 14)
  const neutralTick = polar(rateToAngle(NEUTRAL), R)
  const neutralTickIn = polar(rateToAngle(NEUTRAL), R - 18)

  // track arc, sampled point-by-point (robust — no large-arc/sweep ambiguity)
  let trackPath = ''
  const STEPS = 64
  for (let i = 0; i <= STEPS; i++) {
    const a = A_START + ((A_END - A_START) * i) / STEPS
    const p = polar(a, R)
    trackPath += `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)} `
  }
  const arcStart = polar(A_START, R)
  const arcEnd = polar(A_END, R)
  const stance = rate < NEUTRAL - 0.3 ? 'easy' : rate > NEUTRAL + 0.3 ? 'tight' : 'neutral'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="grid gap-2 p-4 sm:grid-cols-2">
        {/* the dial */}
        <svg viewBox="0 0 260 210" className="w-full">
          {/* track arc */}
          <path
            d={trackPath}
            fill="none"
            stroke="var(--color-surface-2)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* tick marks every 1% */}
          {Array.from({ length: RATE_MAX - RATE_MIN + 1 }).map((_, i) => {
            const a = rateToAngle(RATE_MIN + i)
            const o = polar(a, R + 8)
            const inn = polar(a, R + 1)
            return (
              <line key={i} x1={inn.x.toFixed(1)} y1={inn.y.toFixed(1)} x2={o.x.toFixed(1)} y2={o.y.toFixed(1)} stroke="var(--color-border)" strokeWidth="1.5" />
            )
          })}
          {/* neutral marker */}
          <line x1={neutralTickIn.x.toFixed(1)} y1={neutralTickIn.y.toFixed(1)} x2={neutralTick.x.toFixed(1)} y2={neutralTick.y.toFixed(1)} stroke="var(--color-success)" strokeWidth="2.5" />
          <text x={neutralTick.x.toFixed(1)} y={(neutralTick.y - 6).toFixed(1)} textAnchor="middle" fontSize="9" fill="var(--color-success)">neutral</text>

          {/* end labels */}
          <text x={(arcStart.x + 6).toFixed(1)} y={(arcStart.y + 16).toFixed(1)} textAnchor="middle" fontSize="9" fill="var(--color-accent)">easy</text>
          <text x={(arcEnd.x - 6).toFixed(1)} y={(arcEnd.y + 16).toFixed(1)} textAnchor="middle" fontSize="9" fill="var(--color-accent-2)">tight</text>

          {/* needle */}
          <line x1={CX} y1={CY} x2={needle.x.toFixed(1)} y2={needle.y.toFixed(1)} stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
          <circle cx={CX} cy={CY} r="6" fill="var(--color-ink)" />

          {/* center readout */}
          <text x={CX} y={CY + 34} textAnchor="middle" fontSize="22" fill="var(--color-ink)" fontFamily="monospace">{rate.toFixed(1)}%</text>
          <text x={CX} y={CY + 48} textAnchor="middle" fontSize="9" fill="var(--color-muted)">policy rate</text>
        </svg>

        {/* response gauges */}
        <div className="flex flex-col justify-center gap-2.5">
          {GAUGES.map((g) => {
            const v = r[g.key]
            const hot = g.key === 'inflation'
            return (
              <div key={g.key}>
                <div className="mb-1 flex items-center justify-between text-xs text-muted">
                  <span>{g.label}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full transition-[width] duration-300"
                    style={{ width: `${v * 100}%`, background: hot ? 'var(--color-accent-2)' : 'var(--color-accent)' }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4">
        <SceneSlider label="Central-bank policy rate (%)" value={rate} min={RATE_MIN} max={RATE_MAX} step={0.25} unit="%" onChange={setRate} />
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-center text-sm',
            stance === 'easy' ? 'border-accent/50 text-accent'
              : stance === 'tight' ? 'border-accent-2/50 text-accent-2'
                : 'border-success/50 text-success',
          )}
        >
          {stance === 'easy' && 'Easy money: the rate is below neutral. Cheap loans fuel borrowing, investment and spending — aggregate demand rises and inflation tends to heat up. The right move to fight a recession.'}
          {stance === 'neutral' && 'Neutral: the rate is set so monetary policy neither stimulates nor restrains. Borrowing, spending and inflation hold roughly steady.'}
          {stance === 'tight' && 'Tight money: the rate is above neutral. Dear loans choke off borrowing, investment and spending — aggregate demand cools and inflation is reined in. The right move to fight inflation.'}
        </div>
      </div>
    </div>
  )
}
