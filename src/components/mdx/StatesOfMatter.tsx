import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

type Mode = 'solid' | 'liquid' | 'gas'

type P = {
  hx: number
  hy: number
  x: number
  y: number
  vx: number
  vy: number
  fx: number
  fy: number
  px: number
  py: number
}

const COLS = 8
const ROWS = 4
const bx0 = 24
const by0 = 26
const bx1 = 336
const by1 = 210
const R = 6

const COPY: Record<Mode, string> = {
  solid: 'Solid: particles locked in a fixed lattice, only vibrating in place. Holds its shape.',
  liquid: 'Liquid: particles still touch but slip past one another. Flows to fit its container.',
  gas: 'Gas: particles break free and fly, filling all the space they can reach.',
}

// Same particles, three states. In a solid they stay on a rigid grid and merely
// jiggle; in a liquid they wander loosely while still touching; in a gas they
// fly free and bounce off the walls. The only thing that changed is how much
// energy the particles have — which is exactly what heating does.
export function StatesOfMatter() {
  const [mode, setMode] = useState<Mode>('solid')
  const modeRef = useRef(mode)
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    const parts: Array<P> = []
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const hx = bx0 + ((c + 0.5) * (bx1 - bx0)) / COLS
        const hy = by0 + ((r + 0.5) * (by1 - by0)) / ROWS
        parts.push({
          hx,
          hy,
          x: hx,
          y: hy,
          vx: 0,
          vy: 0,
          fx: 0.004 + Math.random() * 0.006,
          fy: 0.004 + Math.random() * 0.006,
          px: Math.random() * Math.PI * 2,
          py: Math.random() * Math.PI * 2,
        })
      }
    }

    let prev: Mode = 'solid'
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      const m = modeRef.current

      if (m !== prev) {
        if (m === 'gas') {
          for (const p of parts) {
            const a = Math.random() * Math.PI * 2
            const s = 0.06 + Math.random() * 0.04
            p.vx = Math.cos(a) * s
            p.vy = Math.sin(a) * s
          }
        }
        prev = m
      }

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        if (m === 'gas') {
          p.x += p.vx * dt
          p.y += p.vy * dt
          if (p.x < bx0 + R) { p.x = bx0 + R; p.vx = -p.vx }
          else if (p.x > bx1 - R) { p.x = bx1 - R; p.vx = -p.vx }
          if (p.y < by0 + R) { p.y = by0 + R; p.vy = -p.vy }
          else if (p.y > by1 - R) { p.y = by1 - R; p.vy = -p.vy }
        } else {
          const amp = m === 'solid' ? 3.5 : 16
          p.x = p.hx + amp * Math.sin(now * p.fx + p.px)
          p.y = p.hy + amp * Math.cos(now * p.fy + p.py)
        }
        const el = dotRefs.current[i]
        if (el) {
          el.setAttribute('cx', p.x.toFixed(1))
          el.setAttribute('cy', p.y.toFixed(1))
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
        {(['solid', 'liquid', 'gas'] as Array<Mode>).map((m) => (
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

      <svg viewBox="0 0 360 240" className="w-full">
        <rect x="14" y="18" width="332" height="200" rx="8" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
        {Array.from({ length: COLS * ROWS }).map((_, i) => (
          <circle
            key={i}
            ref={(el) => { dotRefs.current[i] = el }}
            cx={bx0}
            cy={by0}
            r={R}
            fill="var(--color-accent-2)"
          />
        ))}
      </svg>

      <p className="px-4 pb-4 pt-2 text-center text-sm text-muted">{COPY[mode]}</p>
    </div>
  )
}
