import { useState } from 'react'
import { cn } from '#/lib/cn'

type Mode = { key: string; label: string; ox: number; oy: number; spread: number; desc: string }

const CX = 130
const CY = 115
const RINGS = [78, 58, 38, 18]

const MODES: Array<Mode> = [
  { key: 'both', label: 'Accurate & precise', ox: 0, oy: 0, spread: 7, desc: 'Shots cluster tightly on the bullseye: close to the truth and close to each other. The goal of every measurement.' },
  { key: 'precise', label: 'Precise, not accurate', ox: 30, oy: -20, spread: 7, desc: 'Tight cluster — but off to one side. Repeatable, yet systematically wrong. A miscalibrated instrument does exactly this.' },
  { key: 'accurate', label: 'Accurate, not precise', ox: 0, oy: 0, spread: 28, desc: 'Scattered all over, but centred on the truth. Each shot is rough, yet their average is right. Random error, no bias.' },
  { key: 'neither', label: 'Neither', ox: 30, oy: -20, spread: 28, desc: 'Scattered *and* off-centre. Both random error and a systematic bias — the worst of both worlds.' },
]

// deterministic scatter so the pattern is stable (no Math.random in render)
function shots(ox: number, oy: number, spread: number) {
  const out: Array<{ x: number; y: number }> = []
  for (let i = 0; i < 8; i++) {
    const a = i * 2.39996 + 0.7
    const rad = spread * (0.25 + ((i * 53) % 100) / 110)
    out.push({ x: CX + ox + rad * Math.cos(a), y: CY + oy + rad * Math.sin(a) })
  }
  return out
}

// Accuracy and precision are not the same thing. *Accuracy* is how close you land to
// the truth; *precision* is how close your shots land to each other. You can have
// either without the other — flip between the four cases and watch where the darts land.
export function AccuracyPrecision() {
  const [mi, setMi] = useState(0)
  const m = MODES[mi]
  const pts = shots(m.ox, m.oy, m.spread)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
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

      <svg viewBox="0 0 260 230" className="w-full">
        {/* dartboard */}
        {RINGS.map((r, i) => (
          <circle key={r} cx={CX} cy={CY} r={r} fill={i % 2 === 0 ? 'var(--color-surface-2)' : 'var(--color-surface)'} stroke="var(--color-border)" strokeWidth="1" />
        ))}
        <circle cx={CX} cy={CY} r="6" fill="var(--color-accent-2)" />
        {/* truth crosshair */}
        <line x1={CX - 10} y1={CY} x2={CX + 10} y2={CY} stroke="var(--color-accent-2)" strokeWidth="1" opacity="0.5" />
        <line x1={CX} y1={CY - 10} x2={CX} y2={CY + 10} stroke="var(--color-accent-2)" strokeWidth="1" opacity="0.5" />
        <text x={CX} y={CY + 100} textAnchor="middle" fontSize="10" fill="var(--color-muted)">bullseye = the true value</text>

        {/* shots */}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4.5" fill="#e84393" />
            <circle cx={p.x} cy={p.y} r="4.5" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.5" />
          </g>
        ))}
      </svg>

      <p className="px-4 pb-4 pt-1 text-sm text-muted">{m.desc}</p>
    </div>
  )
}
