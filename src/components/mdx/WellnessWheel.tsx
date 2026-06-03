import { useMemo, useState } from 'react'
import { cn } from '#/lib/cn'

// Health is many-dimensional. Rate each dimension 0–10 and watch the "wheel"
// take shape — a balanced life fills it evenly; a spiky wheel rolls badly.
// Owner: what-is-health (W1). Reused in mental-health (W8) + healthy-living (W15).

type Dim = { key: string; label: string; hint: string }

const DIMS: Array<Dim> = [
  { key: 'physical', label: 'Physical', hint: 'movement, nutrition, sleep' },
  { key: 'mental', label: 'Mental', hint: 'mood, thoughts, coping' },
  { key: 'social', label: 'Social', hint: 'friends, family, belonging' },
  { key: 'emotional', label: 'Emotional', hint: 'feelings, self-awareness' },
  { key: 'purpose', label: 'Purpose', hint: 'meaning, goals, growth' },
  { key: 'environment', label: 'Environment', hint: 'home, safety, nature' },
]

const SIZE = 280
const C = SIZE / 2
const R = 104

function point(i: number, n: number, radius: number): [number, number] {
  // Start at the top (-90°) and go clockwise.
  const a = (-Math.PI / 2) + (i / n) * Math.PI * 2
  return [C + radius * Math.cos(a), C + radius * Math.sin(a)]
}

export function WellnessWheel() {
  const [vals, setVals] = useState<Record<string, number>>(() =>
    Object.fromEntries(DIMS.map((d) => [d.key, 6])),
  )

  const set = (k: string, v: number) => setVals((p) => ({ ...p, [k]: v }))

  const { polygon, avg, spread } = useMemo(() => {
    const n = DIMS.length
    const pts = DIMS.map((d, i) => point(i, n, (vals[d.key] / 10) * R))
    const nums = DIMS.map((d) => vals[d.key])
    const a = nums.reduce((s, v) => s + v, 0) / n
    const sp = Math.max(...nums) - Math.min(...nums)
    return {
      polygon: pts.map((p) => p.join(',')).join(' '),
      avg: a,
      spread: sp,
    }
  }, [vals])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-[280px]">
          {/* concentric rings */}
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <circle
              key={f}
              cx={C}
              cy={C}
              r={R * f}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth={1}
            />
          ))}
          {/* spokes + labels */}
          {DIMS.map((d, i) => {
            const [x, y] = point(i, DIMS.length, R)
            const [lx, ly] = point(i, DIMS.length, R + 22)
            return (
              <g key={d.key}>
                <line x1={C} y1={C} x2={x} y2={y} stroke="var(--color-border)" strokeWidth={1} />
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-muted text-[9px] font-semibold"
                >
                  {d.label}
                </text>
              </g>
            )
          })}
          {/* the wheel */}
          <polygon
            points={polygon}
            fill="var(--color-accent)"
            fillOpacity={0.22}
            stroke="var(--color-accent)"
            strokeWidth={2}
            strokeLinejoin="round"
          />
          {DIMS.map((d, i) => {
            const [x, y] = point(i, DIMS.length, (vals[d.key] / 10) * R)
            return <circle key={d.key} cx={x} cy={y} r={3} fill="var(--color-accent)" />
          })}
        </svg>

        <div className="flex flex-col gap-2.5">
          {DIMS.map((d) => (
            <label key={d.key} className="flex flex-col gap-1 text-sm">
              <span className="flex items-center justify-between">
                <span className="text-ink">
                  {d.label} <span className="text-xs text-muted">· {d.hint}</span>
                </span>
                <span className="font-mono text-accent">{vals[d.key]}</span>
              </span>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={vals[d.key]}
                onChange={(e) => set(d.key, Number(e.target.value))}
                className="accent-accent"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl border border-border bg-surface-2 p-3">
          <div className="text-xs text-muted">Overall balance</div>
          <div className="text-ink">
            Average <span className="font-semibold text-accent">{avg.toFixed(1)}/10</span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface-2 p-3">
          <div className="text-xs text-muted">Evenness</div>
          <div className={cn('font-semibold', spread <= 3 ? 'text-success' : 'text-warn')}>
            {spread <= 3 ? 'Well-rounded' : 'Lopsided wheel'}
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted">
        No dimension is "the" health one — they prop each other up. A wheel that's high on one spoke
        and low on another still rolls badly. Real health is the whole wheel.
      </p>
    </div>
  )
}
