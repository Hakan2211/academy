import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

type Mode = '1s' | '2p'

const POOL = 320
const ADD_PER_FRAME = 3
const CX = 180
const CY = 122
const A0 = 26 // characteristic radius

// One electron, sampled again and again. Quantum mechanics doesn't give the
// electron a path — it gives a *probability* of finding it at each point. Let the
// dots accumulate and the shape of that probability appears: a fuzzy ball for the
// 1s orbital, two lobes for a 2p. The electron is the cloud, not a dot on a track.
export function ProbabilityCloud() {
  const [mode, setMode] = useState<Mode>('1s')
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    for (let i = 0; i < POOL; i++) dotRefs.current[i]?.setAttribute('opacity', '0')
    let write = 0
    let raf = 0
    const sample = (): [number, number] => {
      if (mode === '1s') {
        const r = Math.min(108, -A0 * Math.log(Math.random() + 1e-6))
        const th = Math.random() * Math.PI * 2
        return [CX + r * Math.cos(th), CY + r * Math.sin(th)]
      }
      // 2p: two vertical lobes with a node at the centre
      const sign = Math.random() < 0.5 ? 1 : -1
      const u = -Math.log(Math.random() + 1e-6)
      const along = Math.min(108, A0 * (0.5 + u))
      const lateral = (Math.random() + Math.random() + Math.random() - 1.5) * A0 * 0.8
      return [CX + lateral, CY - sign * along]
    }
    const loop = () => {
      for (let k = 0; k < ADD_PER_FRAME; k++) {
        const [x, y] = sample()
        const el = dotRefs.current[write]
        if (el) {
          el.setAttribute('cx', x.toFixed(1))
          el.setAttribute('cy', y.toFixed(1))
          el.setAttribute('opacity', '0.4')
        }
        write = (write + 1) % POOL
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [mode])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {(['1s', '2p'] as Array<Mode>).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              mode === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {k} orbital
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 244" className="w-full">
        {Array.from({ length: POOL }).map((_, i) => (
          <circle key={i} ref={(el) => { dotRefs.current[i] = el }} cx={CX} cy={CY} r="1.8" fill="#a29bfe" opacity="0" />
        ))}
        {/* nucleus */}
        <circle cx={CX} cy={CY} r="3" fill="#e17055" />
      </svg>

      <p className="px-4 pb-4 pt-1 text-center text-xs text-muted">
        Every dot is one possible measurement of the electron's position. Dense where it's likely to be found, empty where it isn't — and for the 2p orbital, never right at the centre.
      </p>
    </div>
  )
}
