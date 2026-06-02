import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

// Ebbinghaus's forgetting curve: memory of newly learned material decays
// EXPONENTIALLY — fast at first, then levelling off. The cure is spaced review.
// Each review snaps retention back to 100% AND flattens the next curve (it
// decays more slowly), so the saw-tooth of spaced practice keeps you high while
// a single study session bleeds away. Drag time forward; hit Review to add a
// booster at the current moment and watch the curve reset higher and decay
// slower.
const W = 360
const H = 220
const PAD_L = 34
const PAD_R = 14
const PAD_T = 14
const PAD_B = 28
const PLOT_W = W - PAD_L - PAD_R
const PLOT_H = H - PAD_T - PAD_B
const MAX_DAYS = 30

// Strength controls the decay time-constant: each review makes memory stickier.
// retention after t days since last review = exp(-t / (strength)).
function tau(reviewCount: number): number {
  return 1.4 + reviewCount * 3.2 // days; grows with each spaced review
}

function xOf(day: number): number {
  return PAD_L + (day / MAX_DAYS) * PLOT_W
}
function yOf(ret: number): number {
  return PAD_T + (1 - ret) * PLOT_H
}

export function ForgettingCurve() {
  const [day, setDay] = useState(6)
  const [reviews, setReviews] = useState<Array<number>>([0]) // days at which a review (or initial learning) happened

  // Build the saw-tooth retention path across all segments.
  const segments = [...reviews, MAX_DAYS]
  const pathParts: Array<string> = []
  for (let s = 0; s < reviews.length; s++) {
    const start = reviews[s]
    const end = segments[s + 1]
    const t0 = tau(s)
    const N = 24
    for (let i = 0; i <= N; i++) {
      const dd = start + ((end - start) * i) / N
      const ret = Math.exp(-(dd - start) / t0)
      pathParts.push(`${pathParts.length ? 'L' : 'M'}${xOf(dd).toFixed(1)} ${yOf(ret).toFixed(1)}`)
    }
  }
  const path = pathParts.join(' ')

  // Retention right now at the marker.
  const lastReview = reviews.filter((r) => r <= day).at(-1) ?? 0
  const sIndex = reviews.filter((r) => r <= day).length - 1
  const curRet = Math.exp(-(day - lastReview) / tau(Math.max(0, sIndex)))

  const canReview = !reviews.includes(day) && day > (reviews.at(-1) ?? 0)

  const review = () => {
    if (!canReview) return
    setReviews((r) => [...r, day].sort((a, b) => a - b))
  }
  const reset = () => {
    setReviews([0])
    setDay(6)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="var(--color-border)" strokeWidth="1.5" />
        {/* y gridlines */}
        {[0, 0.5, 1].map((r) => (
          <g key={r}>
            <line x1={PAD_L} y1={yOf(r)} x2={W - PAD_R} y2={yOf(r)} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 4" />
            <text x={PAD_L - 5} y={yOf(r) + 3} textAnchor="end" fontSize="9" fill="var(--color-muted)">
              {Math.round(r * 100)}
            </text>
          </g>
        ))}
        <text x={12} y={H / 2} textAnchor="middle" fontSize="9" fill="var(--color-muted)" transform={`rotate(-90 12 ${H / 2})`}>
          Retention %
        </text>
        <text x={(PAD_L + W - PAD_R) / 2} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
          Days since learning →
        </text>

        {/* the retention curve */}
        <path d={path} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" />

        {/* review markers */}
        {reviews.map((r, i) => (
          <line key={i} x1={xOf(r)} y1={yOf(1)} x2={xOf(r)} y2={H - PAD_B} stroke={i === 0 ? 'var(--color-accent-2)' : '#2ECC71'} strokeWidth="1.5" strokeDasharray="3 3" />
        ))}

        {/* now marker */}
        <line x1={xOf(day)} y1={PAD_T} x2={xOf(day)} y2={H - PAD_B} stroke="var(--color-ink)" strokeWidth="1" />
        <circle cx={xOf(day)} cy={yOf(curRet)} r="5" fill="var(--color-accent)" stroke="var(--color-ink)" strokeWidth="1.5" />
      </svg>

      <div className="px-1">
        <SceneSlider label="Time" value={day} min={0} max={MAX_DAYS} step={0.5} unit="d" onChange={setDay} />
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 px-1">
        <p className="text-sm text-muted">
          Retention now: <span className="font-mono font-semibold text-accent">{Math.round(curRet * 100)}%</span>
          <span className="ml-2 text-xs">· {reviews.length - 1} review{reviews.length - 1 === 1 ? '' : 's'}</span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-border px-3 py-1 text-sm text-muted hover:text-ink"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={review}
            disabled={!canReview}
            className={cn(
              'rounded-full border px-4 py-1 text-sm transition-colors',
              canReview ? 'border-accent bg-accent/15 text-accent' : 'cursor-not-allowed border-border text-muted/50',
            )}
          >
            Review now
          </button>
        </div>
      </div>

      <p className="mt-2 px-1 text-xs leading-relaxed text-muted">
        Without review, memory bleeds away fast then levels off. Each <span style={{ color: '#2ECC71' }}>spaced review</span> resets
        retention to full <span className="text-ink">and flattens the next curve</span> — so you forget more slowly each time. That
        saw-tooth is why spacing beats cramming: you do less total work and remember far more.
      </p>
    </div>
  )
}
