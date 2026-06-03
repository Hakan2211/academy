import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { gini, lorenzPoints } from '#/lib/econ'

// The Lorenz curve maps the cumulative share of PEOPLE (poorest → richest, x)
// against the cumulative share of INCOME they receive (y). Perfect equality is
// the 45° line — the bottom 20% of people earn 20% of income, and so on. Real
// distributions sag BELOW it: the poorest fifth earns far less than a fifth. The
// further the curve bows away from the diagonal, the more unequal the society.
// The GINI coefficient measures that gap as a number from 0 (perfect equality)
// to 1 (one person has everything). Drag each quintile's share, or load a preset,
// and watch the curve bow and the Gini move. Uses econ.ts lorenzPoints + gini.
const X0 = 56
const Y0 = 250
const PLOT = 232 // square plot side

type Preset = { name: string; shares: [number, number, number, number, number] }

const PRESETS: Array<Preset> = [
  { name: 'Equal', shares: [20, 20, 20, 20, 20] },
  { name: 'Moderate', shares: [7, 12, 17, 24, 40] },
  { name: 'Very unequal', shares: [3, 6, 11, 20, 60] },
]

export function LorenzCurve() {
  // income share (%) held by each population quintile, poorest → richest
  const [shares, setShares] = useState<[number, number, number, number, number]>([7, 12, 17, 24, 40])

  const total = shares.reduce((s, v) => s + v, 0)
  // normalise to fractions so the curve always ends at (1,1) even mid-drag
  const incomes = shares.map((s) => s / total)
  const pts = lorenzPoints(incomes)
  const g = gini(incomes)

  // map (p, l) in [0,1] to svg
  const px = (p: number) => X0 + p * PLOT
  const py = (l: number) => Y0 - l * PLOT

  const curve = pts.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${px(pt.p).toFixed(1)} ${py(pt.l).toFixed(1)}`).join(' ')
  // shaded "gap" area between the equality line and the Lorenz curve
  const area = `${curve} L ${px(1)} ${py(1)} L ${px(1)} ${py(0)} Z`

  const setQuintile = (i: number, v: number) => {
    setShares((prev) => {
      const next = [...prev] as typeof prev
      next[i] = v
      return next
    })
  }

  const matchedPreset = PRESETS.find((p) => p.shares.every((s, i) => s === shares[i]))
  const label =
    g < 0.05 ? 'near-perfect equality'
      : g < 0.3 ? 'fairly equal'
        : g < 0.45 ? 'moderate inequality'
          : g < 0.6 ? 'high inequality'
            : 'extreme inequality'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => setShares([...p.shares])}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              matchedPreset?.name === p.name
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {p.name}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PLOT} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PLOT} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PLOT} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">share of people →</text>
        <text x={X0 - 6} y={Y0 - PLOT + 4} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ share of income</text>

        {/* inequality gap (area between equality line and curve) */}
        <path d={area} fill="var(--color-accent)" opacity="0.16" />

        {/* line of perfect equality */}
        <line x1={px(0)} y1={py(0)} x2={px(1)} y2={py(1)} stroke="var(--color-muted)" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x={px(0.52)} y={py(0.52) - 6} fontSize="9" fill="var(--color-muted)" transform={`rotate(-45 ${px(0.52)} ${py(0.52)})`}>perfect equality</text>

        {/* the Lorenz curve */}
        <path d={curve} fill="none" stroke="var(--color-accent-2)" strokeWidth="3" />
        {pts.slice(1, -1).map((pt) => (
          <circle key={pt.p} cx={px(pt.p)} cy={py(pt.l)} r="4" fill="var(--color-accent-2)" />
        ))}

        {/* the Gini readout, big, in the empty corner */}
        <text x={px(0.66)} y={py(0.28)} textAnchor="middle" fontSize="34" fill="var(--color-ink)" className="font-mono">{g.toFixed(2)}</text>
        <text x={px(0.66)} y={py(0.28) + 16} textAnchor="middle" fontSize="10" fill="var(--color-muted)">Gini coefficient</text>
      </svg>

      <div
        className={cn(
          'mx-4 rounded-xl border px-3 py-2 text-center text-sm',
          g < 0.3 ? 'border-success/50 text-success' : 'border-accent-2/50 text-accent-2',
        )}
      >
        Gini {g.toFixed(2)} — {label}. The poorest fifth earns {Math.round(incomes[0] * 100)}% of all income; the richest fifth earns {Math.round(incomes[4] * 100)}%.
      </div>

      <div className="grid gap-2 p-4 sm:grid-cols-2">
        {(['Poorest 20%', 'Lower-middle 20%', 'Middle 20%', 'Upper-middle 20%', 'Richest 20%'] as const).map((lab, i) => (
          <SceneSlider
            key={lab}
            label={lab}
            value={shares[i]}
            min={1}
            max={70}
            step={1}
            unit="%"
            onChange={(v) => setQuintile(i, v)}
          />
        ))}
      </div>
    </div>
  )
}
