import { useState } from 'react'
import { cn } from '#/lib/cn'
import { round } from '#/lib/health'

// Energy balance: energy IN (food) vs energy OUT (BMR + activity).
// 1 kg of body-fat ≈ 7700 kcal. Small daily gaps compound over weeks.
// This is a simplified model — real metabolism adapts to deficits/surpluses.

const KG_PER_KCAL = 1 / 7700 // kg lost per kcal deficit

export function CalorieBalance() {
  const [kcalIn, setKcalIn] = useState(2100)
  const [kcalOut, setKcalOut] = useState(2000)
  const [weeks, setWeeks] = useState(8)

  const dailyNet = kcalIn - kcalOut // positive = surplus, negative = deficit
  const totalKcal = dailyNet * 7 * weeks
  const kgChange = round(totalKcal * KG_PER_KCAL, 1)

  const surplus = dailyNet > 0
  const balanced = Math.abs(dailyNet) <= 20

  const statusColor = balanced
    ? 'text-success'
    : surplus
      ? 'text-warn'
      : 'text-accent'

  // Arrow direction + length for visualization
  const arrowUp = surplus
  const arrowLength = Math.min(Math.abs(dailyNet) / 5, 60) // px, max 60

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-4 text-sm text-muted">
        Adjust your daily energy <span className="text-ink font-medium">in</span> and{' '}
        <span className="text-ink font-medium">out</span>, then see what compounds over time.
      </p>

      {/* Visual balance scale */}
      <div className="mb-5 flex items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <div className="rounded-xl border border-border bg-surface-2 px-4 py-2 text-center">
            <div className="text-lg font-bold text-ink">{kcalIn.toLocaleString()}</div>
            <div className="text-xs text-muted">kcal eaten</div>
          </div>
          <div className="text-xs text-muted">Energy IN</div>
        </div>

        {/* Arrow / balance indicator */}
        <div className="flex flex-col items-center gap-1" style={{ minWidth: 56 }}>
          <svg width="56" height="80" viewBox="0 0 56 80">
            {/* baseline */}
            <line x1="4" y1="40" x2="52" y2="40" stroke="var(--color-border)" strokeWidth="2" />
            {balanced ? (
              <text x="28" y="44" textAnchor="middle" fontSize="18" fill="var(--color-success)">≈</text>
            ) : (
              <>
                <line
                  x1="28"
                  y1="40"
                  x2="28"
                  y2={arrowUp ? 40 - arrowLength : 40 + arrowLength}
                  stroke={surplus ? '#E67E22' : 'var(--color-accent)'}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {arrowUp ? (
                  <polygon
                    points="28,18 22,30 34,30"
                    fill={surplus ? '#E67E22' : 'var(--color-accent)'}
                    transform={`translate(0,${40 - arrowLength - 22})`}
                  />
                ) : (
                  <polygon
                    points="28,62 22,50 34,50"
                    fill="var(--color-accent)"
                    transform={`translate(0,${40 + arrowLength - 40})`}
                  />
                )}
              </>
            )}
          </svg>
          <div className={cn('text-center text-xs font-semibold', statusColor)}>
            {balanced ? 'balanced' : surplus ? `+${dailyNet} kcal/day` : `${dailyNet} kcal/day`}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="rounded-xl border border-border bg-surface-2 px-4 py-2 text-center">
            <div className="text-lg font-bold text-ink">{kcalOut.toLocaleString()}</div>
            <div className="text-xs text-muted">kcal burned</div>
          </div>
          <div className="text-xs text-muted">Energy OUT</div>
        </div>
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-3 mb-5">
        <div>
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>Energy IN (food)</span>
            <span className="font-mono text-ink">{kcalIn.toLocaleString()} kcal</span>
          </div>
          <input
            type="range"
            className="accent-accent w-full"
            min={1200}
            max={4000}
            step={50}
            value={kcalIn}
            onChange={(e) => setKcalIn(Number(e.target.value))}
          />
          <div className="flex justify-between text-xs text-muted mt-0.5">
            <span>1,200</span><span>4,000</span>
          </div>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>Energy OUT (BMR + activity)</span>
            <span className="font-mono text-ink">{kcalOut.toLocaleString()} kcal</span>
          </div>
          <input
            type="range"
            className="accent-accent w-full"
            min={1200}
            max={4000}
            step={50}
            value={kcalOut}
            onChange={(e) => setKcalOut(Number(e.target.value))}
          />
          <div className="flex justify-between text-xs text-muted mt-0.5">
            <span>1,200</span><span>4,000</span>
          </div>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>Time period</span>
            <span className="font-mono text-ink">{weeks} weeks</span>
          </div>
          <input
            type="range"
            className="accent-accent w-full"
            min={1}
            max={52}
            step={1}
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
          />
          <div className="flex justify-between text-xs text-muted mt-0.5">
            <span>1 week</span><span>52 weeks</span>
          </div>
        </div>
      </div>

      {/* Result */}
      <div
        className={cn(
          'rounded-xl border p-3 text-sm',
          balanced
            ? 'border-success/40 bg-success/10'
            : surplus
              ? 'border-warn/40 bg-warn/10'
              : 'border-accent/30 bg-accent/10',
        )}
      >
        <div className="font-semibold text-ink mb-1">
          Over {weeks} week{weeks !== 1 ? 's' : ''}:
        </div>
        {balanced ? (
          <p className="text-muted">
            Energy in ≈ energy out. Weight stays roughly stable. In reality, small daily fluctuations are normal.
          </p>
        ) : (
          <>
            <p className="text-ink">
              Total {surplus ? 'surplus' : 'deficit'}:{' '}
              <span className={cn('font-semibold', statusColor)}>
                {Math.abs(Math.round(totalKcal)).toLocaleString()} kcal
              </span>
            </p>
            <p className="mt-1 text-muted">
              At ≈7,700 kcal per kg of body fat, that's roughly{' '}
              <span className="font-semibold text-ink">
                {Math.abs(kgChange)} kg {surplus ? 'gained' : 'lost'}
              </span>
              . Small daily gaps — even 200 kcal — add up quietly over months.
            </p>
          </>
        )}
        <p className="mt-2 text-xs text-muted italic">
          Simplified model. Real metabolism adapts — calorie needs change with body composition and over time.
        </p>
      </div>
    </div>
  )
}
