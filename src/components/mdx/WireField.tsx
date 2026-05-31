import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

const CX = 180
const CY = 122
const RINGS = [34, 60, 86, 112]
const PER_RING = 6

// A straight wire seen end-on, current flowing toward you (⊙) or away (⊗).
// Either way the magnetic field wraps around it in circles — Oersted's
// discovery. The right-hand rule sets the direction: point your thumb along the
// current and your fingers curl the way the field goes. Reverse the current and
// the whole field spins the other way; turn it up and the field strengthens.
export function WireField() {
  const [amps, setAmps] = useState(3)
  const [outOfPage, setOutOfPage] = useState(true)
  const ampsRef = useRef(amps)
  const dirRef = useRef(outOfPage)
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => { ampsRef.current = amps }, [amps])
  useEffect(() => { dirRef.current = outOfPage }, [outOfPage])

  useEffect(() => {
    // base angle for each marker
    const base: Array<{ r: number; a: number }> = []
    for (const r of RINGS) {
      for (let k = 0; k < PER_RING; k++) base.push({ r, a: (k / PER_RING) * Math.PI * 2 })
    }
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      // out of page → field curls counter-clockwise (visually angle decreases in y-down coords)
      const dir = dirRef.current ? -1 : 1
      const speed = 0.0006 * ampsRef.current
      for (let i = 0; i < base.length; i++) {
        base[i].a += dir * speed * dt
        const x = CX + base[i].r * Math.cos(base[i].a)
        const y = CY + base[i].r * Math.sin(base[i].a)
        const el = dotRefs.current[i]
        if (el) {
          el.setAttribute('cx', x.toFixed(1))
          el.setAttribute('cy', y.toFixed(1))
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
        {([['current out of page ⊙', true], ['current into page ⊗', false]] as Array<[string, boolean]>).map(
          ([label, val]) => (
            <button
              key={label}
              type="button"
              onClick={() => setOutOfPage(val)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                outOfPage === val ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              )}
            >
              {label}
            </button>
          ),
        )}
      </div>

      <svg viewBox="0 0 360 244" className="w-full">
        {/* field circles */}
        {RINGS.map((r) => (
          <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 5" />
        ))}

        {/* orbiting field-direction markers */}
        {RINGS.flatMap((_, ri) =>
          Array.from({ length: PER_RING }).map((__, k) => {
            const i = ri * PER_RING + k
            return (
              <circle
                key={i}
                ref={(el) => { dotRefs.current[i] = el }}
                cx={CX}
                cy={CY}
                r="3"
                fill="var(--color-accent-2)"
              />
            )
          }),
        )}

        {/* the wire, end-on */}
        <circle cx={CX} cy={CY} r="14" fill="#b08968" stroke="var(--color-ink)" strokeWidth="2" />
        {outOfPage ? (
          <circle cx={CX} cy={CY} r="3.5" fill="var(--color-ink)" />
        ) : (
          <g stroke="var(--color-ink)" strokeWidth="2.5">
            <line x1={CX - 7} y1={CY - 7} x2={CX + 7} y2={CY + 7} />
            <line x1={CX - 7} y1={CY + 7} x2={CX + 7} y2={CY - 7} />
          </g>
        )}
      </svg>

      <div className="px-4 pb-4">
        <SceneSlider label="Current" value={amps} min={1} max={5} step={0.5} unit="A" onChange={setAmps} />
        <p className="mt-2 text-center text-xs text-muted">
          The field forms closed circles around the wire — no poles, just loops. More current spins them faster (stronger field).
        </p>
      </div>
    </div>
  )
}
