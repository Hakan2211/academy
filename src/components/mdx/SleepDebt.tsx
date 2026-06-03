import { useState } from 'react'
import { clamp } from '#/lib/health'
import { cn } from '#/lib/cn'

// Sleep debt accumulator: set average hours/night for the past week, see
// the total debt mount and watch an alertness/performance meter drop.
// A note explains why you can't simply "bank" or instantly repay sleep.

const NEED = 8 // recommended hours for most adults

function debtHours(avgHours: number): number {
  return clamp((NEED - avgHours) * 7, 0, 50)
}

// Performance out of 100 — declines as debt grows (rough approximation)
function performance(debt: number): number {
  // Each hour of debt ≈ 2–3% performance drop; plateaus at ~40% min
  return clamp(100 - debt * 2.5, 38, 100)
}

function perfLabel(pct: number): { label: string; cls: string } {
  if (pct >= 90) return { label: 'Peak', cls: 'text-success' }
  if (pct >= 75) return { label: 'Good', cls: 'text-accent' }
  if (pct >= 60) return { label: 'Reduced', cls: 'text-warn' }
  if (pct >= 48) return { label: 'Impaired', cls: 'text-warn' }
  return { label: 'Severely impaired', cls: 'text-red-400' }
}

function debtNote(debt: number): string {
  if (debt === 0) return 'No debt — well rested. Consistent sleep keeps you sharp.'
  if (debt <= 5) return `${debt.toFixed(1)} h debt — mild fatigue; concentration starts to slip.`
  if (debt <= 10) return `${debt.toFixed(1)} h debt — mood, reaction time, and decision-making noticeably reduced.`
  if (debt <= 18) return `${debt.toFixed(1)} h debt — like being legally drunk in some reaction-time studies.`
  return `${debt.toFixed(1)} h debt — severe impairment; you're likely unaware how compromised you are.`
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function SleepDebt() {
  const [avgHours, setAvgHours] = useState(7)

  const debt = debtHours(avgHours)
  const perf = performance(debt)
  const { label: perfLbl, cls: perfCls } = perfLabel(perf)
  const weeklyDebt = debtNote(debt)
  const barH = 120

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-semibold text-ink">Weekly sleep debt accumulator</p>
      <p className="mb-4 text-xs text-muted">
        Drag the slider to set your average hours of sleep per night. The deficit compounds across the week.
      </p>

      {/* Bar chart — 7 days */}
      <div className="mb-4 flex items-end justify-around gap-1 px-2" style={{ height: barH + 24 }}>
        {DAYS.map((day) => {
          const h = avgHours
          const filled = clamp(h / NEED, 0, 1)
          const isDebt = h < NEED
          return (
            <div key={day} className="flex flex-col items-center gap-0.5" style={{ width: 32 }}>
              {/* Need marker */}
              <div
                className="flex w-full flex-col justify-end rounded-sm overflow-hidden"
                style={{ height: barH, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
              >
                <div
                  className="w-full rounded-sm transition-all duration-200"
                  style={{
                    height: `${filled * 100}%`,
                    background: isDebt ? '#f97316' : 'var(--color-accent)',
                  }}
                />
              </div>
              <span className="text-xs text-muted">{day}</span>
            </div>
          )
        })}

      </div>

      {/* Slider */}
      <div className="mb-4 px-1">
        <div className="flex items-center justify-between text-xs text-muted mb-1">
          <span>Average sleep per night</span>
          <span className="font-semibold text-ink">{avgHours} h</span>
        </div>
        <input
          type="range"
          min={4}
          max={10}
          step={0.5}
          value={avgHours}
          onChange={(e) => setAvgHours(Number(e.target.value))}
          className="accent-accent w-full"
        />
        <div className="flex justify-between text-xs text-muted mt-0.5">
          <span>4 h</span><span>Recommended: 8 h</span><span>10 h</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="rounded-xl border border-border bg-surface-2 p-3 text-center">
          <div className="text-2xl font-bold text-ink">{debt.toFixed(1)} h</div>
          <div className="text-xs text-muted mt-0.5">Weekly sleep debt</div>
        </div>
        <div className="rounded-xl border border-border bg-surface-2 p-3 text-center">
          <div className={cn('text-2xl font-bold', perfCls)}>{Math.round(perf)}%</div>
          <div className="text-xs text-muted mt-0.5">
            Performance — <span className={cn('font-semibold', perfCls)}>{perfLbl}</span>
          </div>
        </div>
      </div>

      {/* Performance meter */}
      <div className="mb-3">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2 border border-border">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${perf}%`,
              background: perf >= 75 ? 'var(--color-accent)' : perf >= 55 ? '#f97316' : '#ef4444',
            }}
          />
        </div>
      </div>

      {/* Note */}
      <p
        className={cn(
          'rounded-xl border px-3 py-2 text-xs',
          debt > 0
            ? 'border-warn/40 bg-warn/8 text-warn'
            : 'border-border bg-surface-2 text-muted',
        )}
      >
        {weeklyDebt}
      </p>

      <p className="mt-3 text-xs text-muted leading-relaxed">
        <span className="font-semibold text-ink">Recovery note:</span> Extra weekend sleep helps, but research shows you
        can't fully repay a week's debt in one or two nights — and "banking" sleep in advance doesn't work either.
        The only reliable fix is consistent, adequate nightly sleep.
      </p>
    </div>
  )
}
