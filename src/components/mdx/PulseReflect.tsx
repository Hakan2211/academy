import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

const X0 = 30
const XWALL = 440
const MID = 80
const AMP = 34
const WIDTH = 26

// A single pulse races down a string, reflects off the right-hand boundary, and
// returns. At a FIXED end it flips upside-down (inverts); at a FREE end it comes
// back the same way up. The classic demonstration of why reflections invert.
export function PulseReflect() {
  const [fixed, setFixed] = useState(true)
  const fixedRef = useRef(fixed)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => { fixedRef.current = fixed }, [fixed])

  useEffect(() => {
    let raf = 0
    let last = 0
    let pos = X0
    let dir = 1 // +1 → right, -1 → left
    let sign = 1 // +1 upright, -1 inverted
    const speed = 0.16 // px per ms

    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      pos += dir * speed * dt
      if (pos >= XWALL) {
        pos = XWALL
        dir = -1
        if (fixedRef.current) sign = -1 // invert only at a fixed end
      } else if (pos <= X0 && dir === -1) {
        pos = X0
        dir = 1
        sign = 1
      }

      let d = ''
      for (let x = X0; x <= XWALL; x += 4) {
        const g = Math.exp(-(((x - pos) / WIDTH) ** 2))
        const y = MID - sign * AMP * g
        d += `${x === X0 ? 'M' : 'L'}${x},${y.toFixed(1)} `
      }
      pathRef.current?.setAttribute('d', d.trim())
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {([['fixed', true], ['free', false]] as Array<[string, boolean]>).map(([label, val]) => (
          <button
            key={label}
            type="button"
            onClick={() => setFixed(val)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              fixed === val
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {label} end
          </button>
        ))}
      </div>

      <svg viewBox="0 0 480 150" className="w-full">
        {/* rest line */}
        <line x1={X0} y1={MID} x2={XWALL} y2={MID} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 4" />
        {/* the boundary */}
        <line x1={XWALL} y1={MID - 50} x2={XWALL} y2={MID + 50} stroke="var(--color-ink)" strokeWidth="4" />
        {fixed ? (
          <text x={XWALL + 6} y={MID + 4} fill="var(--color-muted)" fontSize="11">
            fixed
          </text>
        ) : (
          <circle cx={XWALL} cy={MID} r="6" fill="none" stroke="var(--color-ink)" strokeWidth="2" />
        )}
        {/* the pulse */}
        <path ref={pathRef} d="" fill="none" stroke="var(--color-accent-2)" strokeWidth="3" strokeLinecap="round" />
        <text x={X0} y={MID + 60} fill="var(--color-muted)" fontSize="12">
          {fixed ? 'Fixed end: the reflected pulse flips upside-down.' : 'Free end: the reflected pulse stays upright.'}
        </text>
      </svg>
    </div>
  )
}
