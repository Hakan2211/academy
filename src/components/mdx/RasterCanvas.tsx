import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'

// A screen is a grid of square pixels, but the shapes we want to draw — circles,
// diagonal lines — are smooth. The computer must decide, pixel by pixel, "is this
// square inside the shape or not?" That all-or-nothing choice produces the jagged
// staircase edges we call ALIASING. More pixels hide the steps; ANTI-ALIASING
// fakes smoothness by greying the edge pixels in proportion to how much they're
// covered.

const VIEW = 320

export function RasterCanvas() {
  const [res, setRes] = useState(12)
  const [aa, setAa] = useState(false)

  const cell = VIEW / res
  // Circle in grid space, centred, radius ~ 42% of the grid.
  const cx = res / 2
  const cy = res / 2
  const rad = res * 0.42

  // Coverage of one cell by the circle, estimated by 3x3 super-sampling.
  const coverage = (col: number, row: number) => {
    let hit = 0
    for (let sy = 0; sy < 3; sy++) {
      for (let sx = 0; sx < 3; sx++) {
        const px = col + (sx + 0.5) / 3
        const py = row + (sy + 0.5) / 3
        if ((px - cx) ** 2 + (py - cy) ** 2 <= rad * rad) hit++
      }
    }
    return hit / 9
  }

  const cells: Array<{ col: number; row: number; fill: number }> = []
  for (let row = 0; row < res; row++) {
    for (let col = 0; col < res; col++) {
      const cov = coverage(col, row)
      const fill = aa ? cov : cov >= 0.5 ? 1 : 0
      if (fill > 0) cells.push({ col, row, fill })
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="mx-auto block w-full max-w-[320px]">
        <rect x="0" y="0" width={VIEW} height={VIEW} fill="var(--color-surface-2)" />
        {cells.map((c, i) => (
          <rect
            key={i}
            x={c.col * cell}
            y={c.row * cell}
            width={cell + 0.5}
            height={cell + 0.5}
            fill="var(--color-accent)"
            opacity={c.fill}
          />
        ))}
        {/* Grid lines so the pixel boundaries are obvious. */}
        {Array.from({ length: res + 1 }).map((_, i) => (
          <g key={i}>
            <line x1={i * cell} y1={0} x2={i * cell} y2={VIEW} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.6" />
            <line x1={0} y1={i * cell} x2={VIEW} y2={i * cell} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.6" />
          </g>
        ))}
        {/* The ideal smooth circle, for comparison. */}
        <circle
          cx={cx * cell}
          cy={cy * cell}
          r={rad * cell}
          fill="none"
          stroke="var(--color-accent-2)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.9"
        />
      </svg>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <SceneSlider
          label="Resolution"
          value={res}
          min={6}
          max={48}
          step={1}
          unit="px"
          onChange={(v) => setRes(Math.round(v))}
        />
        <button
          type="button"
          onClick={() => setAa((a) => !a)}
          className={cn(
            'rounded-full border px-3 py-1.5 text-sm transition-colors',
            aa ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          Anti-aliasing: {aa ? 'on' : 'off'}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm">
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <div className="text-xs text-muted">grid</div>
          <div className="font-mono font-bold text-ink">{res} × {res}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <div className="text-xs text-muted">total pixels</div>
          <div className="font-mono font-bold text-accent-2">{res * res}</div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        The <span className="text-accent-2">dashed line</span> is the perfect circle; the{' '}
        <span className="text-accent">filled squares</span> are what the screen can actually show. Raise the
        resolution to shrink the jaggies, or turn on anti-aliasing to soften the edge with partly-lit pixels.
      </p>
    </div>
  )
}
