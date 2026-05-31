import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const X0 = 40
const X1 = 344
const AXIS = 112
const AE = 42 // electric-field amplitude (vertical)
const AB = 34 // magnetic-field amplitude (drawn skewed, into the page)
const SKX = 0.62
const SKY = 0.42

// A changing electric field makes a magnetic field, which makes an electric
// field… and the pair leapfrogs through empty space as a self-sustaining
// electromagnetic wave. E (red) and B (blue) oscillate at right angles, perfectly
// in step, and the whole pattern races along at the speed of light. Light, radio,
// X-rays — all of this, just at different wavelengths.
export function EMWave() {
  const [lambda, setLambda] = useState(80) // wavelength in px
  const lambdaRef = useRef(lambda)
  const eRef = useRef<SVGPathElement>(null)
  const bRef = useRef<SVGPathElement>(null)

  useEffect(() => { lambdaRef.current = lambda }, [lambda])

  useEffect(() => {
    let raf = 0
    let last = 0
    let phase = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      const k = (2 * Math.PI) / lambdaRef.current
      // keep the pattern's travel speed constant (the speed of light), whatever λ
      phase += 0.18 * k * dt
      const e: Array<string> = []
      const b: Array<string> = []
      for (let x = X0; x <= X1; x += 4) {
        const s = Math.sin(k * (x - X0) - phase)
        e.push(`${x === X0 ? 'M' : 'L'} ${x} ${(AXIS - AE * s).toFixed(1)}`)
        const bv = AB * s
        b.push(`${x === X0 ? 'M' : 'L'} ${(x + SKX * bv).toFixed(1)} ${(AXIS + SKY * bv).toFixed(1)}`)
      }
      eRef.current?.setAttribute('d', e.join(' '))
      bRef.current?.setAttribute('d', b.join(' '))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 220" className="w-full">
        {/* propagation axis */}
        <line x1={X0} y1={AXIS} x2={X1 + 8} y2={AXIS} stroke="var(--color-border)" strokeWidth="1.5" />
        <path d={`M ${X1} ${AXIS - 5} L ${X1 + 10} ${AXIS} L ${X1} ${AXIS + 5}`} fill="none" stroke="var(--color-border)" strokeWidth="1.5" />
        <text x={X1 + 4} y={AXIS - 10} fill="var(--color-muted)" fontSize="11" textAnchor="end">direction of travel →</text>

        {/* B field (skewed, into the page) */}
        <path ref={bRef} d="" fill="none" stroke="#0984e3" strokeWidth="2" />
        {/* E field (vertical) */}
        <path ref={eRef} d="" fill="none" stroke="#e17055" strokeWidth="2.5" />

        {/* legend */}
        <line x1="46" y1="198" x2="66" y2="198" stroke="#e17055" strokeWidth="2.5" />
        <text x="72" y="202" fill="var(--color-muted)" fontSize="12">E — electric field</text>
        <line x1="210" y1="198" x2="230" y2="198" stroke="#0984e3" strokeWidth="2" />
        <text x="236" y="202" fill="var(--color-muted)" fontSize="12">B — magnetic field</text>
      </svg>

      <div className="px-4 pb-4">
        <SceneSlider label="Wavelength" value={lambda} min={40} max={130} step={5} unit="px" onChange={setLambda} />
        <p className="mt-2 text-center text-xs text-muted">
          Change the wavelength and the speed stays the same — every EM wave travels at c. Shorter λ just means higher frequency: c = fλ.
        </p>
      </div>
    </div>
  )
}
