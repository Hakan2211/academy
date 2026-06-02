import { useState } from 'react'
import type { MouseEvent } from 'react'
import { cn } from '#/lib/cn'

// Supervised learning: instead of writing rules by hand, we show the machine
// LABELLED examples (here, blue vs orange points) and it finds a BOUNDARY that
// separates them. New points are classified by which side they fall on. Tilt and
// shift the line to see the accuracy change — "training" is just searching for
// the boundary that gets the most examples right.

type Pt = { x: number; y: number; label: 0 | 1 }

const W = 360
const H = 240

// Two roughly-separable clouds. label 0 = orange (lower-left), 1 = blue (upper-right).
const SEED: Array<Pt> = [
  { x: 60, y: 180, label: 0 }, { x: 95, y: 150, label: 0 }, { x: 70, y: 120, label: 0 },
  { x: 120, y: 195, label: 0 }, { x: 50, y: 145, label: 0 }, { x: 140, y: 160, label: 0 },
  { x: 100, y: 205, label: 0 }, { x: 165, y: 200, label: 0 }, { x: 85, y: 175, label: 0 },
  { x: 300, y: 70, label: 1 }, { x: 265, y: 95, label: 1 }, { x: 290, y: 120, label: 1 },
  { x: 240, y: 55, label: 1 }, { x: 315, y: 100, label: 1 }, { x: 220, y: 90, label: 1 },
  { x: 280, y: 45, label: 1 }, { x: 200, y: 70, label: 1 }, { x: 255, y: 130, label: 1 },
]

export function MlClassifier() {
  const [pts, setPts] = useState<Array<Pt>>(SEED)
  const [slope, setSlope] = useState(-1) // boundary: y = slope*x + intercept (svg coords)
  const [intercept, setIntercept] = useState(290)
  const [adding, setAdding] = useState<0 | 1>(1)

  // A point is class-1 if it sits above the line (smaller y in svg) on its side.
  const lineY = (x: number) => slope * x + intercept
  const predict = (p: Pt): 0 | 1 => (p.y < lineY(p.x) ? 1 : 0)
  const correct = pts.filter((p) => predict(p) === p.label).length
  const acc = pts.length ? Math.round((correct / pts.length) * 100) : 100

  const addPoint = (e: MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W
    const y = ((e.clientY - rect.top) / rect.height) * H
    if (x < 8 || x > W - 8 || y < 8 || y > H - 8) return
    setPts([...pts, { x, y, label: adding }])
  }

  // Endpoints of the boundary clipped to the box.
  const x0 = 0
  const x1 = W
  const y0 = lineY(x0)
  const y1 = lineY(x1)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_150px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full cursor-crosshair rounded-xl bg-surface-2" onClick={addPoint}>
          {/* shaded regions */}
          <polygon points={`0,0 ${W},0 ${x1},${y1} ${x0},${y0}`} fill="#4F8CFF" opacity="0.08" />
          <polygon points={`0,${H} ${W},${H} ${x1},${y1} ${x0},${y0}`} fill="#FFB454" opacity="0.08" />
          <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="var(--color-accent)" strokeWidth="3" />
          {pts.map((p, i) => {
            const ok = predict(p) === p.label
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="7"
                fill={p.label === 1 ? '#4F8CFF' : '#FFB454'}
                stroke={ok ? 'var(--color-surface)' : '#E5484D'}
                strokeWidth={ok ? 1.5 : 2.5}
              />
            )
          })}
        </svg>

        <div className="flex flex-col gap-3 text-sm">
          <div className="rounded-xl border border-border bg-surface-2 p-3 text-center">
            <div className="text-xs text-muted">Accuracy</div>
            <div className={cn('text-2xl font-bold', acc === 100 ? 'text-success' : acc >= 80 ? 'text-accent-2' : 'text-warn')}>
              {acc}%
            </div>
            <div className="text-xs text-muted">{correct}/{pts.length} correct</div>
          </div>

          <label className="flex flex-col gap-1 text-muted">
            <span className="flex justify-between"><span>Tilt</span></span>
            <input type="range" min={-3} max={0} step={0.05} value={slope} onChange={(e) => setSlope(Number(e.target.value))} className="accent-accent" />
          </label>
          <label className="flex flex-col gap-1 text-muted">
            <span className="flex justify-between"><span>Shift</span></span>
            <input type="range" min={120} max={520} step={2} value={intercept} onChange={(e) => setIntercept(Number(e.target.value))} className="accent-accent" />
          </label>

          <div className="flex gap-1">
            {([1, 0] as Array<0 | 1>).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setAdding(l)}
                className={cn(
                  'flex-1 rounded-lg border px-2 py-1 text-xs font-semibold transition-colors',
                  adding === l ? 'border-accent bg-accent/15 text-ink' : 'border-border text-muted',
                )}
              >
                Add {l === 1 ? 'blue' : 'orange'}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPts(SEED)}
            className="rounded-lg border border-border px-2 py-1 text-xs text-muted hover:text-ink"
          >
            Reset points
          </button>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Click the canvas to add labelled examples. Points ringed <span className="text-warn">red</span> are mis-classified. Training a model means searching for the boundary with the highest accuracy.
      </p>
    </div>
  )
}
