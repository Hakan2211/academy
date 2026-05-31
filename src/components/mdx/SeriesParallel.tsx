import { useState } from 'react'
import { cn } from '#/lib/cn'

type Mode = 'series' | 'parallel'

function Bulb({ cx, cy, bright, removed }: { cx: number; cy: number; bright: number; removed: boolean }) {
  const glow = removed ? 0 : 0.2 + 0.8 * bright
  const label = removed ? 'removed' : bright >= 0.9 ? 'bright' : bright > 0 ? 'dim' : 'off'
  return (
    <g>
      {!removed && <circle cx={cx} cy={cy} r="20" fill="#fdcb6e" opacity={glow} />}
      <circle
        cx={cx}
        cy={cy}
        r="13"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2"
        strokeDasharray={removed ? '3 3' : undefined}
        opacity={removed ? 0.5 : 1}
      />
      {!removed && <path d={`M ${cx - 7} ${cy} L ${cx - 3} ${cy + 6} L ${cx + 3} ${cy - 6} L ${cx + 7} ${cy}`} fill="none" stroke="var(--color-ink)" strokeWidth="1.5" />}
      <text x={cx} y={cy + 32} fill="var(--color-muted)" fontSize="11" textAnchor="middle">{label}</text>
    </g>
  )
}

// Two bulbs, two ways to wire them. In SERIES they share one path: the same
// current threads through both, the voltage splits, so each glows dim — and
// pull one out and the loop breaks, killing both. In PARALLEL each bulb gets
// its own loop straight across the battery: both glow full brightness, and one
// can fail while the other stays lit. That's why your house is wired parallel.
export function SeriesParallel() {
  const [mode, setMode] = useState<Mode>('series')
  const [removed, setRemoved] = useState(false)

  // in parallel, removing bulb1 only kills bulb1
  const b1Removed = removed && mode === 'parallel'
  const b1Bright = mode === 'series' ? 0 : 1
  const b2Bright = mode === 'series' ? (removed ? 0 : 0.25) : 1

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-2 p-3">
        {(['series', 'parallel'] as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setRemoved((r) => !r)}
          className="ml-auto rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-ink"
        >
          {removed ? 'Put bulb 1 back' : 'Remove bulb 1'}
        </button>
      </div>

      <svg viewBox="0 0 380 220" className="w-full">
        {mode === 'series' ? (
          <>
            {/* loop: battery (left) → bulb1 → bulb2 (top) → right → bottom back */}
            <path
              d={`M 60 60 L 320 60 M 320 60 L 320 165 L 60 165 L 60 60`}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="3"
            />
            {/* break the loop if a bulb is removed */}
            {removed && <rect x="146" y="52" width="28" height="16" fill="var(--color-surface)" />}
            {/* battery */}
            <line x1="48" y1="100" x2="72" y2="100" stroke="var(--color-ink)" strokeWidth="3" />
            <line x1="52" y1="124" x2="68" y2="124" stroke="var(--color-ink)" strokeWidth="6" />
            <Bulb cx={160} cy={60} bright={0} removed={removed} />
            <Bulb cx={250} cy={60} bright={b2Bright} removed={false} />
            <text x="205" y="200" fill="var(--color-muted)" fontSize="12" textAnchor="middle">
              {removed ? 'loop broken → both bulbs dark' : 'one shared path → both glow dim'}
            </text>
          </>
        ) : (
          <>
            {/* two rails with three vertical branches: battery, bulb1, bulb2 */}
            <line x1="60" y1="50" x2="320" y2="50" stroke="var(--color-border)" strokeWidth="3" />
            <line x1="60" y1="170" x2="320" y2="170" stroke="var(--color-border)" strokeWidth="3" />
            {/* battery branch */}
            <line x1="80" y1="50" x2="80" y2="170" stroke="var(--color-border)" strokeWidth="3" />
            <line x1="68" y1="98" x2="92" y2="98" stroke="var(--color-ink)" strokeWidth="3" />
            <line x1="72" y1="120" x2="88" y2="120" stroke="var(--color-ink)" strokeWidth="6" />
            {/* bulb1 branch */}
            <line x1="200" y1="50" x2="200" y2="170" stroke="var(--color-border)" strokeWidth="3" opacity={b1Removed ? 0.3 : 1} />
            {/* bulb2 branch */}
            <line x1="300" y1="50" x2="300" y2="170" stroke="var(--color-border)" strokeWidth="3" />
            <Bulb cx={200} cy={110} bright={b1Bright} removed={b1Removed} />
            <Bulb cx={300} cy={110} bright={b2Bright} removed={false} />
            <text x="205" y="205" fill="var(--color-muted)" fontSize="12" textAnchor="middle">
              {b1Removed ? 'bulb 1 out, but bulb 2 stays full' : 'each bulb has its own loop → both full'}
            </text>
          </>
        )}
      </svg>
    </div>
  )
}
