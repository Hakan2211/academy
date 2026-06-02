import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'
import { mean, median, mode, stdDev } from '#/lib/psych'

// An editable dataset shown as bars. Click the top half of a bar to raise that
// value, the bottom half to lower it, and watch the mean, median, mode and
// standard deviation recompute live, with mean and median marked on a histogram
// of the same values. Pushing one bar to an extreme shows how the mean chases
// outliers while the median barely moves. Uses the psych.ts helpers.
// Used in descriptive-statistics.

const START = [3, 4, 4, 5, 5, 5, 6, 7]
const MAXV = 9

export function DescriptiveStats() {
  const [data, setData] = useState<Array<number>>(START)

  const bump = (i: number, dir: 1 | -1) =>
    setData((d) => d.map((v, k) => (k === i ? Math.max(1, Math.min(MAXV, v + dir)) : v)))

  const mn = mean(data)
  const md = median(data)
  const mo = mode(data)
  const sd = stdDev(data)

  // Histogram: count how many values fall on each integer 1..MAXV.
  const counts = Array.from({ length: MAXV }, (_, k) => data.filter((v) => v === k + 1).length)
  const maxCount = Math.max(1, ...counts)

  const W = 360
  const H = 150
  const PAD = 24
  const colW = (W - 2 * PAD) / MAXV
  const xOf = (val: number) => PAD + (val - 0.5) * colW

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="mb-2 text-sm text-muted">
        Click the <span className="text-ink">top</span> of a bar to raise a value, the <span className="text-ink">bottom</span> to lower it.
      </p>

      {/* editable bars */}
      <div className="flex items-end justify-between gap-1.5" style={{ height: 120 }}>
        {data.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center">
            <button
              type="button"
              aria-label={`raise value ${i + 1}`}
              onClick={() => bump(i, 1)}
              className="flex w-full items-end justify-center text-muted hover:text-accent"
              style={{ height: 16 }}
            >
              <Icon name="ChevronUp" size={14} />
            </button>
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t bg-accent/70 transition-all"
                style={{ height: `${(v / MAXV) * 100}%` }}
              />
            </div>
            <button
              type="button"
              aria-label={`lower value ${i + 1}`}
              onClick={() => bump(i, -1)}
              className="flex w-full justify-center text-muted hover:text-accent"
              style={{ height: 16 }}
            >
              <Icon name="ChevronDown" size={14} />
            </button>
            <span className="font-mono text-xs text-ink">{v}</span>
          </div>
        ))}
      </div>

      {/* live stats */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Mean" value={mn.toFixed(2)} accent="var(--color-accent-2)" />
        <Stat label="Median" value={md.toFixed(2)} accent="var(--color-accent)" />
        <Stat label="Mode" value={String(mo)} />
        <Stat label="Std dev" value={sd.toFixed(2)} />
      </div>

      {/* histogram with mean + median markers */}
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full">
        <line x1={PAD} y1={H - 22} x2={W - PAD} y2={H - 22} stroke="var(--color-muted)" strokeWidth="1" />
        {counts.map((c, k) => {
          const h = (c / maxCount) * (H - 44)
          return (
            <g key={k}>
              <rect
                x={PAD + k * colW + colW * 0.15}
                y={H - 22 - h}
                width={colW * 0.7}
                height={h}
                rx="2"
                fill="var(--color-surface-2)"
                stroke="var(--color-border)"
                strokeWidth="1"
              />
              <text x={PAD + (k + 0.5) * colW} y={H - 8} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
                {k + 1}
              </text>
            </g>
          )
        })}
        {/* median marker */}
        <line x1={xOf(md)} y1={6} x2={xOf(md)} y2={H - 22} stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="4 3" />
        <text x={xOf(md)} y={5} textAnchor="middle" fontSize="9" fill="var(--color-accent)">
          median
        </text>
        {/* mean marker */}
        <line x1={xOf(mn)} y1={16} x2={xOf(mn)} y2={H - 22} stroke="var(--color-accent-2)" strokeWidth="2" />
        <text x={xOf(mn)} y={15} textAnchor="middle" fontSize="9" fill="var(--color-accent-2)">
          mean
        </text>
      </svg>

      <p className="mt-1 text-center text-xs text-muted">
        Push one bar to an extreme: the <span className="text-accent-2">mean</span> drifts toward it, while the{' '}
        <span className="text-accent">median</span> hardly budges — that is why the median resists outliers.
      </p>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-2 text-center">
      <p className="text-xs text-muted">{label}</p>
      <p className={cn('font-mono text-lg font-bold', !accent && 'text-ink')} style={accent ? { color: accent } : undefined}>
        {value}
      </p>
    </div>
  )
}
