import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

type Mode = 'conduction' | 'convection' | 'radiation'

const CELLS = 12
const FOFF = [0, 1, 2, 3, 4] // radiation ring stagger

const COPY: Record<Mode, string> = {
  conduction: 'Conduction: heat creeps particle-to-particle through a solid. The hot end warms the cold end without anything moving across.',
  convection: 'Convection: heated fluid expands, rises, cools, and sinks — a circulating current that carries heat with the moving matter.',
  radiation: 'Radiation: heat crosses empty space as infrared waves. No particles needed — it is how the Sun reaches us.',
}

function heatColor(t: number) {
  const c = Math.max(0, Math.min(1, t))
  const r = Math.round(116 + (255 - 116) * c)
  const g = Math.round(185 + (107 - 185) * c)
  const b = Math.round(255 + (107 - 255) * c)
  return `rgb(${r},${g},${b})`
}

// One idea, three mechanisms. Conduction passes heat hand-to-hand through a
// solid bar; convection carries it on a rolling current of fluid; radiation
// flings it across empty space as waves. Flip between them to feel the
// difference.
export function HeatTransfer() {
  const [mode, setMode] = useState<Mode>('conduction')
  const modeRef = useRef(mode)

  const cellRefs = useRef<Array<SVGRectElement | null>>([])
  const fluidRefs = useRef<Array<SVGCircleElement | null>>([])
  const ringRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    const temps = new Array(CELLS).fill(0)
    const fluidN = 12
    const angles = Array.from({ length: fluidN }, (_, i) => (i / fluidN) * Math.PI * 2)
    let prev: Mode = 'conduction'
    let raf = 0
    let last = 0

    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      const m = modeRef.current
      if (m !== prev) {
        if (m === 'conduction') temps.fill(0)
        prev = m
      }

      if (m === 'conduction') {
        temps[0] = 1
        const next = temps.slice()
        for (let i = 1; i < CELLS; i++) {
          const right = i < CELLS - 1 ? temps[i + 1] : temps[i]
          next[i] = temps[i] + 0.16 * (temps[i - 1] + right - 2 * temps[i])
        }
        for (let i = 0; i < CELLS; i++) {
          temps[i] = Math.max(0, Math.min(1, next[i]))
          cellRefs.current[i]?.setAttribute('fill', heatColor(temps[i]))
        }
      } else if (m === 'convection') {
        const cx = 180
        const cy = 108
        const rx = 58
        const ry = 50
        for (let i = 0; i < fluidN; i++) {
          angles[i] += 0.0016 * dt
          const a = angles[i]
          const x = cx + rx * Math.cos(a)
          const y = cy - ry * Math.sin(a)
          const warm = (Math.cos(a) + 1) / 2 // right side = just-heated = warm
          const el = fluidRefs.current[i]
          if (el) {
            el.setAttribute('cx', x.toFixed(1))
            el.setAttribute('cy', y.toFixed(1))
            el.setAttribute('fill', heatColor(warm))
          }
        }
      } else {
        const maxR = 150
        const period = 1700
        for (let i = 0; i < FOFF.length; i++) {
          const frac = (((now + FOFF[i] * (period / FOFF.length)) % period) / period)
          const el = ringRefs.current[i]
          if (el) {
            el.setAttribute('r', (frac * maxR).toFixed(1))
            el.setAttribute('opacity', (0.7 * (1 - frac)).toFixed(2))
          }
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {(['conduction', 'convection', 'radiation'] as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              mode === m
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 200" className="w-full">
        {/* CONDUCTION */}
        <g style={{ display: mode === 'conduction' ? undefined : 'none' }}>
          <text x="44" y="70" fill="#e17055" fontSize="20" textAnchor="middle">🔥</text>
          {Array.from({ length: CELLS }).map((_, i) => (
            <rect
              key={i}
              ref={(el) => { cellRefs.current[i] = el }}
              x={60 + i * 20}
              y={84}
              width={19}
              height={40}
              fill={heatColor(0)}
              stroke="var(--color-border)"
              strokeWidth="0.5"
            />
          ))}
          <text x="180" y="150" fill="var(--color-muted)" fontSize="12" textAnchor="middle">
            metal bar — heat spreads from the flame to the far end
          </text>
        </g>

        {/* CONVECTION */}
        <g style={{ display: mode === 'convection' ? undefined : 'none' }}>
          <rect x="112" y="54" width="136" height="112" rx="4" fill="var(--color-accent-2)" opacity="0.12" stroke="var(--color-border)" strokeWidth="2" />
          {Array.from({ length: 12 }).map((_, i) => (
            <circle
              key={i}
              ref={(el) => { fluidRefs.current[i] = el }}
              cx="180"
              cy="108"
              r="6"
              fill={heatColor(0.5)}
            />
          ))}
          <text x="180" y="184" fill="#e17055" fontSize="18" textAnchor="middle">🔥</text>
        </g>

        {/* RADIATION */}
        <g style={{ display: mode === 'radiation' ? undefined : 'none' }}>
          {FOFF.map((_, i) => (
            <circle
              key={i}
              ref={(el) => { ringRefs.current[i] = el }}
              cx="70"
              cy="100"
              r="0"
              fill="none"
              stroke="#e17055"
              strokeWidth="2.5"
              opacity="0"
            />
          ))}
          <circle cx="70" cy="100" r="18" fill="#e17055" />
          <rect x="286" y="78" width="40" height="44" rx="4" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
          <text x="306" y="138" fill="var(--color-muted)" fontSize="11" textAnchor="middle">absorbs</text>
          <text x="70" y="150" fill="var(--color-muted)" fontSize="11" textAnchor="middle">hot source</text>
        </g>
      </svg>

      <p className="px-4 pb-4 pt-1 text-center text-sm text-muted">{COPY[mode]}</p>
    </div>
  )
}
