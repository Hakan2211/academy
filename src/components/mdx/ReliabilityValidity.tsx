import { useState } from 'react'
import { cn } from '#/lib/cn'
import { rng } from '#/lib/psych'

// The dartboard metaphor for measurement quality, in psych framing. Reliability
// = do repeated measurements agree with each other (tight cluster)? Validity =
// do they hit what you actually meant to measure (centred on the bullseye)? The
// four combinations are selectable; dots are placed with a seeded rng so the
// pattern is stable across server and client. Used in measurement-and-tests.

type Mode = { key: string; label: string; ox: number; oy: number; spread: number; desc: string }

const CX = 130
const CY = 120
const RINGS = [82, 60, 38, 18]

const MODES: Array<Mode> = [
  {
    key: 'both',
    label: 'Reliable & valid',
    ox: 0,
    oy: 0,
    spread: 8,
    desc: 'Tight cluster on the bullseye. The test gives consistent scores (reliable) that truly capture the trait you meant to measure (valid). The goal of every good measure.',
  },
  {
    key: 'reliable',
    label: 'Reliable, not valid',
    ox: 34,
    oy: -22,
    spread: 8,
    desc: 'Consistent, but consistently off-target. A bathroom scale stuck 5 kg high reads the same number every time — dependable, yet measuring the wrong value. A common, sneaky failure.',
  },
  {
    key: 'valid',
    label: 'Valid, not reliable',
    ox: 0,
    oy: 0,
    spread: 32,
    desc: 'Scattered all around the bullseye. On average it points at the right thing, but any single score is noisy and unrepeatable. You cannot trust one reading.',
  },
  {
    key: 'neither',
    label: 'Neither',
    ox: 34,
    oy: -22,
    spread: 32,
    desc: 'Scattered and off-centre — noisy and aimed at the wrong target. The measure tells you almost nothing useful.',
  },
]

function dots(key: string, ox: number, oy: number, spread: number) {
  const next = rng(key.split('').reduce((s, c) => s + c.charCodeAt(0), 7))
  const out: Array<{ x: number; y: number }> = []
  for (let i = 0; i < 9; i++) {
    const a = next() * Math.PI * 2
    const rad = spread * (0.3 + next() * 0.85)
    out.push({ x: CX + ox + rad * Math.cos(a), y: CY + oy + rad * Math.sin(a) })
  }
  return out
}

export function ReliabilityValidity() {
  const [mi, setMi] = useState(0)
  const m = MODES[mi]
  const pts = dots(m.key, m.ox, m.oy, m.spread)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="grid grid-cols-2 gap-2 p-3 sm:flex sm:flex-wrap">
        {MODES.map((mode, idx) => (
          <button
            key={mode.key}
            type="button"
            onClick={() => setMi(idx)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition-colors',
              mi === idx ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 260 240" className="w-full">
        {RINGS.map((r, i) => (
          <circle
            key={r}
            cx={CX}
            cy={CY}
            r={r}
            fill={i % 2 === 0 ? 'var(--color-surface-2)' : 'var(--color-surface)'}
            stroke="var(--color-border)"
            strokeWidth="1"
          />
        ))}
        <circle cx={CX} cy={CY} r="6" fill="var(--color-accent-2)" />
        <line x1={CX - 10} y1={CY} x2={CX + 10} y2={CY} stroke="var(--color-accent-2)" strokeWidth="1" opacity="0.5" />
        <line x1={CX} y1={CY - 10} x2={CX} y2={CY + 10} stroke="var(--color-accent-2)" strokeWidth="1" opacity="0.5" />
        <text x={CX} y={CY + 104} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
          bullseye = the trait you mean to measure
        </text>

        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4.5" fill="#5DADE2" />
            <circle cx={p.x} cy={p.y} r="4.5" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.5" />
          </g>
        ))}
      </svg>

      <p className="px-4 pb-4 pt-1 text-sm text-muted">{m.desc}</p>
    </div>
  )
}
