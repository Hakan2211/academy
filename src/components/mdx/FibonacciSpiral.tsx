// The Fibonacci tiling: squares whose sides are 1, 1, 2, 3, 5, 8 … fit together
// perfectly, because each new side equals the sum of the previous two. The
// quarter-circles through them trace the famous spiral, and the ratio of
// consecutive terms homes in on the golden ratio φ. Used in fibonacci + deep-dive.

// squares in unit (y-up) space: {x0,y0,x1,y1,s}
const SQ = [
  { x0: 0, y0: 0, x1: 1, y1: 1, s: 1 },
  { x0: 1, y0: 0, x1: 2, y1: 1, s: 1 },
  { x0: 0, y0: 1, x1: 2, y1: 3, s: 2 },
  { x0: -3, y0: 0, x1: 0, y1: 3, s: 3 },
  { x0: -3, y0: -5, x1: 2, y1: 0, s: 5 },
  { x0: 2, y0: -5, x1: 10, y1: 3, s: 8 },
]
const U = 21
const MINX = -3
const MAXY = 3
const sx = (x: number) => (x - MINX) * U + 6
const sy = (y: number) => (MAXY - y) * U + 6

const RATIOS = [
  ['1/1', '1.000'], ['2/1', '2.000'], ['3/2', '1.500'], ['5/3', '1.667'],
  ['8/5', '1.600'], ['13/8', '1.625'], ['21/13', '1.615'], ['34/21', '1.619'],
]

export function FibonacciSpiral() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${(10 - MINX) * U + 12} ${(MAXY + 5) * U + 12}`} className="mx-auto w-full max-w-md">
        {SQ.map((q, i) => {
          const opacity = 0.08 + i * 0.04
          return (
            <g key={i}>
              <rect x={sx(q.x0)} y={sy(q.y1)} width={(q.x1 - q.x0) * U} height={(q.y1 - q.y0) * U} fill="var(--color-accent)" fillOpacity={opacity} stroke="var(--color-accent)" strokeWidth="1.2" />
              <text x={sx((q.x0 + q.x1) / 2)} y={sy((q.y0 + q.y1) / 2) + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-accent)">{q.s}</text>
            </g>
          )
        })}
      </svg>

      <div className="mt-2 text-center text-sm text-muted">
        Sequence: <span className="font-mono text-ink">1, 1, 2, 3, 5, 8, 13, 21, …</span> — each term is the sum of the two before it.
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
        {RATIOS.map(([f, v], i) => (
          <span key={i} className="font-mono text-muted">
            {f}=<span className={i >= 5 ? 'text-success' : 'text-ink'}>{v}</span>
          </span>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        The ratio of consecutive Fibonacci numbers converges to the golden ratio φ ≈ <span className="font-mono text-success">1.618…</span>
      </p>
    </div>
  )
}
