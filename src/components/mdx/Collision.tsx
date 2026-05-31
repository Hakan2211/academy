import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

type Key = 'equal' | 'heavy-light' | 'light-heavy'

const CASES: Record<Key, { label: string; mA: number; mB: number; vA0: number }> = {
  equal: { label: 'Equal masses', mA: 1, mB: 1, vA0: 2.4 },
  'heavy-light': { label: 'Heavy → light', mA: 3, mB: 1, vA0: 2.0 },
  'light-heavy': { label: 'Light → heavy', mA: 1, mB: 3, vA0: 2.8 },
}

const radius = (m: number) => 12 + 6 * Math.sqrt(m)

// 1-D elastic collisions. A slides in from the left and strikes a stationary B;
// momentum is always conserved. Equal masses swap; a light ball bounces back
// off a heavy one; a heavy ball barely slows.
export function Collision() {
  const [active, setActive] = useState<Key>('equal')
  const aRef = useRef<SVGCircleElement>(null)
  const bRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const c = CASES[active]
    const rA = radius(c.mA)
    const rB = radius(c.mB)
    let xA = 60
    let xB = 300
    let vA = c.vA0
    let vB = 0
    let hit = false
    let last = 0
    let raf = 0

    const apply = () => {
      const { mA, mB } = c
      const nvA = ((mA - mB) * vA + 2 * mB * vB) / (mA + mB)
      const nvB = ((mB - mA) * vB + 2 * mA * vA) / (mA + mB)
      vA = nvA
      vB = nvB
    }

    const reset = () => {
      xA = 60
      xB = 300
      vA = c.vA0
      vB = 0
      hit = false
    }

    const loop = (now: number) => {
      if (!last) last = now
      const step = Math.min(50, now - last) * 0.09
      last = now
      xA += vA * step
      xB += vB * step
      if (!hit && xA + rA >= xB - rB && vA > vB) {
        xA = xB - rB - rA // unstick
        apply()
        hit = true
      }
      if (xA < 10 || xB > 490 || (Math.abs(vA) < 0.01 && Math.abs(vB) < 0.01)) {
        reset()
      }
      aRef.current?.setAttribute('cx', String(xA))
      bRef.current?.setAttribute('cx', String(xB))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active])

  const c = CASES[active]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {(Object.keys(CASES) as Array<Key>).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setActive(k)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              active === k
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {CASES[k].label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 500 160" className="w-full">
        <line x1="10" y1="120" x2="490" y2="120" stroke="var(--color-border)" strokeWidth="3" />
        <circle ref={aRef} cx="60" cy={120 - radius(c.mA)} r={radius(c.mA)} fill="#00b894" />
        <circle ref={bRef} cx="300" cy={120 - radius(c.mB)} r={radius(c.mB)} fill="#74b9ff" />
        <text x="60" y="150" fill="#00b894" fontSize="12" textAnchor="middle">A (m={c.mA})</text>
        <text x="300" y="150" fill="#74b9ff" fontSize="12" textAnchor="middle">B (m={c.mB})</text>
      </svg>

      <p className="px-4 pb-4 text-center text-xs text-muted">
        Total momentum (mass × velocity) is the same before and after every collision.
      </p>
    </div>
  )
}
