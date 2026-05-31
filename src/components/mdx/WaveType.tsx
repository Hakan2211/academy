import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

type Mode = 'transverse' | 'longitudinal'

const N = 26
const X0 = 40
const X1 = 440
const MID = 95

// The two ways a wave can move its medium. Transverse: particles bob across the
// direction of travel (a sine of dots). Longitudinal: particles shuffle along
// the direction of travel, bunching into compressions and rarefactions — how
// sound moves. One rAF loop reads the current mode from a ref, so toggling is
// seamless.
export function WaveType() {
  const [mode, setMode] = useState<Mode>('transverse')
  const modeRef = useRef<Mode>(mode)
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => { modeRef.current = mode }, [mode])

  useEffect(() => {
    const spacing = (X1 - X0) / (N - 1)
    const k = (2 * Math.PI) / (spacing * 7) // ~7 particles per wavelength
    let raf = 0
    let start = 0
    const loop = (now: number) => {
      if (!start) start = now
      const t = (now - start) / 1000
      const w = 2 * Math.PI * 0.6
      for (let i = 0; i < N; i++) {
        const baseX = X0 + i * spacing
        const phase = k * (baseX - X0) - w * t
        const el = dotRefs.current[i]
        if (!el) continue
        if (modeRef.current === 'transverse') {
          el.setAttribute('cx', String(baseX))
          el.setAttribute('cy', (MID - 30 * Math.sin(phase)).toFixed(1))
        } else {
          el.setAttribute('cx', (baseX + 16 * Math.sin(phase)).toFixed(1))
          el.setAttribute('cy', String(MID))
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
        {(['transverse', 'longitudinal'] as Array<Mode>).map((m) => (
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

      <svg viewBox="0 0 480 160" className="w-full">
        {Array.from({ length: N }).map((_, i) => (
          <circle
            key={i}
            ref={(el) => { dotRefs.current[i] = el }}
            cx={X0 + i * ((X1 - X0) / (N - 1))}
            cy={MID}
            r="5"
            fill="var(--color-accent-2)"
          />
        ))}
        <text x="240" y="150" fill="var(--color-muted)" fontSize="12" textAnchor="middle">
          {mode === 'transverse'
            ? 'Particles move up–down; the wave travels sideways →'
            : 'Particles move left–right, bunching into compressions; the wave travels → too'}
        </text>
      </svg>
    </div>
  )
}
