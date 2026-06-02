import { useState } from 'react'
import { cn } from '#/lib/cn'

// Memory is a pyramid of trade-offs. At the top sit registers: blindingly fast
// but tiny and costly per byte. As you descend — cache, RAM, SSD, disk — every
// level gets bigger and cheaper but slower. There is no single perfect memory,
// so computers use all of them, keeping hot data near the top. Click a level.

type Level = {
  key: string
  name: string
  color: string
  size: string
  speed: string
  tradeoff: string
}

// Top (fastest/smallest) -> bottom (slowest/biggest).
const LEVELS: Array<Level> = [
  {
    key: 'reg',
    name: 'Registers',
    color: '#FF6B6B',
    size: 'a few hundred bytes',
    speed: '~1 clock cycle (instant)',
    tradeoff: 'Inside the CPU, right beside the ALU. As fast as memory gets, but there is only room for a handful — far too small to hold a program.',
  },
  {
    key: 'cache',
    name: 'Cache (L1/L2/L3)',
    color: '#FFC83D',
    size: 'kilobytes to a few MB',
    speed: 'a few clock cycles',
    tradeoff: 'A small, fast buffer on the CPU chip that keeps recently used data close. Catches most requests so the CPU rarely has to wait on slower RAM.',
  },
  {
    key: 'ram',
    name: 'RAM (main memory)',
    color: '#2ECC71',
    size: 'gigabytes',
    speed: 'tens of nanoseconds',
    tradeoff: 'Where the running program and its data live. Big enough for active work and reasonably fast — but volatile, so it forgets everything when powered off.',
  },
  {
    key: 'ssd',
    name: 'SSD / hard disk',
    color: '#4F8CFF',
    size: 'hundreds of GB to TB',
    speed: 'microseconds to milliseconds',
    tradeoff: 'Permanent storage for all your files and apps. Huge and cheap per byte, and it survives power off — but thousands of times slower than RAM.',
  },
]

export function MemoryHierarchy() {
  const [sel, setSel] = useState('reg')
  const lv = LEVELS.find((l) => l.key === sel)!

  // Each level is a wider trapezoid band, forming a pyramid.
  const bandH = 40
  const topW = 70
  const grow = 56

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-4 sm:grid-cols-[1.1fr_1fr]">
        <div>
          <svg viewBox="0 0 320 210" className="w-full">
            {/* speed/size axes */}
            <text x="8" y="22" fontSize="9" fill="var(--color-muted)">faster</text>
            <text x="8" y="200" fontSize="9" fill="var(--color-muted)">slower</text>
            <text x="270" y="22" fontSize="9" fill="var(--color-muted)" textAnchor="end">smaller</text>
            <text x="312" y="200" fontSize="9" fill="var(--color-muted)" textAnchor="end">bigger</text>

            {LEVELS.map((l, i) => {
              const wTop = topW + i * grow
              const wBot = topW + (i + 1) * grow
              const y = 14 + i * (bandH + 4)
              const cx = 160
              const x0 = cx - wTop / 2
              const x1 = cx + wTop / 2
              const x2 = cx + wBot / 2
              const x3 = cx - wBot / 2
              const active = sel === l.key
              return (
                <g key={l.key} onClick={() => setSel(l.key)} style={{ cursor: 'pointer' }}>
                  <path
                    d={`M${x0},${y} L${x1},${y} L${x2},${y + bandH} L${x3},${y + bandH} Z`}
                    fill={active ? l.color : 'var(--color-surface-2)'}
                    stroke={l.color}
                    strokeWidth={active ? 3 : 2}
                  />
                  <text x={cx} y={y + bandH / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={active ? '#0a0f1f' : l.color}>
                    {l.name.split(' ')[0]}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="rounded-xl border border-border bg-surface-2 p-4">
          <div className="font-semibold text-ink" style={{ color: lv.color }}>{lv.name}</div>
          <dl className="mt-2 space-y-1.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Typical size</dt>
              <dd className="text-right text-ink">{lv.size}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Speed</dt>
              <dd className="text-right text-ink">{lv.speed}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted">{lv.tradeoff}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {LEVELS.map((l) => (
          <button
            key={l.key}
            type="button"
            onClick={() => setSel(l.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition-colors',
              sel === l.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {l.name}
          </button>
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        As you go down, memory gets <span className="text-ink">bigger and cheaper</span> but <span className="text-ink">slower</span>. Computers use every level at once, keeping the data they need most near the top.
      </p>
    </div>
  )
}
