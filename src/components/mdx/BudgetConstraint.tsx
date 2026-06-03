import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// The budget constraint. With income M and prices Px, Py, every affordable
// bundle of two goods sits on or below the budget line Px·x + Py·y = M. The line
// itself is everything you can buy if you spend it all; its slope (−Px/Py) is the
// market trade-off between the goods. Move a point ALONG the line to see the
// trade-off, and watch the best bundle — the equilibrium that maximises utility
// for these tastes — sit where the budget line just touches the highest
// reachable indifference contour.
const X0 = 46
const Y0 = 250
const PW = 296
const PH = 224
// fixed plot scale (max units of each good shown on the axes)
const XAXIS = 24
const YAXIS = 24

// Cobb–Douglas tastes: utility = x^a · y^(1-a). The optimum spends share a of
// income on good X. a = 0.5 → split spending evenly (a clean, intuitive demo).
const A = 0.5

export function BudgetConstraint() {
  const [income, setIncome] = useState(120)
  const [px, setPx] = useState(10)
  const [py, setPy] = useState(8)
  const [pick, setPick] = useState(50) // % of the budget line, X-end → Y-end

  const xMax = income / px // all on good X
  const yMax = income / py // all on good Y

  const sx = (x: number) => X0 + (x / XAXIS) * PW
  const sy = (y: number) => Y0 - (y / YAXIS) * PH

  // chosen point ALONG the line: t=0 → all Y, t=1 → all X
  const t = pick / 100
  const px0 = clamp(t * xMax, 0, XAXIS)
  const py0 = clamp((1 - t) * yMax, 0, YAXIS)

  // utility-maximising bundle (equimarginal optimum for these tastes)
  const bestX = (A * income) / px
  const bestY = ((1 - A) * income) / py
  const onAxis = bestX <= XAXIS && bestY <= YAXIS

  // where the (possibly long) line crosses the visible box, drawn via the axis ends
  const a1 = { x: sx(0), y: sy(Math.min(yMax, YAXIS)) }
  const a2 = { x: sx(Math.min(xMax, XAXIS)), y: sy(0) }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 290" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Coffees →</text>
        <text x={X0 - 6} y={Y0 - PH + 2} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Books</text>

        {/* affordable region under the budget line */}
        <path
          d={`M ${sx(0)} ${Y0} L ${a1.x} ${a1.y} L ${a2.x} ${a2.y} Z`}
          fill="var(--color-accent)" opacity="0.08"
        />
        {/* the budget line */}
        <line x1={a1.x} y1={a1.y} x2={a2.x} y2={a2.y} stroke="var(--color-accent)" strokeWidth="3" />
        <text x={a1.x + 6} y={a1.y - 4} fontSize="10" fill="var(--color-muted)">spend it all</text>

        {/* best bundle (utility-maximising) */}
        {onAxis && (
          <>
            <line x1={sx(bestX)} y1={sy(bestY)} x2={sx(bestX)} y2={Y0} stroke="var(--color-success)" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
            <line x1={sx(bestX)} y1={sy(bestY)} x2={X0} y2={sy(bestY)} stroke="var(--color-success)" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
            <circle cx={sx(bestX)} cy={sy(bestY)} r="6" fill="var(--color-success)" />
            <text x={sx(bestX)} y={sy(bestY) - 10} textAnchor="middle" fontSize="9" fill="var(--color-success)">best bundle</text>
          </>
        )}

        {/* movable chosen point */}
        <circle cx={sx(px0)} cy={sy(py0)} r="6" fill="var(--color-accent-2)" stroke="var(--color-surface)" strokeWidth="1.5" />
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{px0.toFixed(1)}</div><div className="text-xs text-muted">coffees chosen</div></div>
        <div><div className="font-mono text-ink">{py0.toFixed(1)}</div><div className="text-xs text-muted">books chosen</div></div>
        <div><div className="font-mono text-accent">{(px / py).toFixed(2)}</div><div className="text-xs text-muted">books / coffee</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Income" value={income} min={40} max={240} step={4} unit="$" onChange={setIncome} />
        <SceneSlider label="Price of a coffee" value={px} min={4} max={20} step={1} unit="$" onChange={setPx} />
        <SceneSlider label="Price of a book" value={py} min={4} max={20} step={1} unit="$" onChange={setPy} />
        <SceneSlider label="Slide along the line" value={pick} min={0} max={100} step={1} unit="%" onChange={setPick} />
        <p className={cn('rounded-xl border px-3 py-2 text-sm', onAxis ? 'border-success/40 text-muted' : 'border-border text-muted')}>
          The line shows every bundle you can <span className="text-ink">just afford</span>; everything shaded below is affordable too. Raising income pushes the line out; a price rise pivots its end inward. The{' '}
          <span className="text-success">best bundle</span> sits where the budget line touches the highest reachable level of satisfaction — here, splitting the budget so the last dollar buys equal extra utility on each good.
        </p>
      </div>
    </div>
  )
}
