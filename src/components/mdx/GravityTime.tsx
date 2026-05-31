import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// Time runs slower deeper in a gravity well. A clock on the ground ticks slightly
// behind a clock high above it — not because of any mechanical fault, but because
// gravity stretches time itself. The effect is tiny on Earth, yet real enough that
// GPS satellites must correct for it or their navigation would drift kilometres a day.
export function GravityTime() {
  const [strength, setStrength] = useState(50)
  const strengthRef = useRef(strength)
  const handLow = useRef<SVGLineElement>(null)
  const handHigh = useRef<SVGLineElement>(null)
  const countLow = useRef<SVGTextElement>(null)
  const countHigh = useRef<SVGTextElement>(null)

  useEffect(() => { strengthRef.current = strength }, [strength])

  useEffect(() => {
    let raf = 0
    let last = 0
    let degLow = -90
    let degHigh = -90
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      const rateLow = 1 - (strengthRef.current / 100) * 0.5
      degHigh += 0.2 * dt
      degLow += 0.2 * rateLow * dt
      handHigh.current?.setAttribute('transform', `rotate(${degHigh} 180 78)`)
      handLow.current?.setAttribute('transform', `rotate(${degLow} 180 196)`)
      if (countHigh.current) countHigh.current.textContent = String(Math.floor((degHigh + 90) / 360))
      if (countLow.current) countLow.current.textContent = String(Math.floor((degLow + 90) / 360))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const rateLow = 1 - (strength / 100) * 0.5

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 280" className="w-full">
        {/* planet */}
        <circle cx="180" cy="430" r="240" fill="#0984e3" opacity="0.18" stroke="#0984e3" strokeWidth="1.5" />
        <text x="180" y="252" fill="var(--color-muted)" fontSize="11" textAnchor="middle">planet surface</text>

        {/* high clock (fast) */}
        <circle cx="180" cy="78" r="30" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
        <line ref={handHigh} x1="180" y1="78" x2="180" y2="54" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="180" cy="78" r="2.5" fill="var(--color-ink)" />
        <text x="226" y="74" fill="var(--color-muted)" fontSize="11">high up</text>
        <text x="226" y="88" fill="var(--color-muted)" fontSize="11">
          ticks: <tspan ref={countHigh} fill="var(--color-ink)" fontWeight="700">0</tspan>
        </text>

        {/* low clock (slow) */}
        <circle cx="180" cy="196" r="30" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2" />
        <line ref={handLow} x1="180" y1="196" x2="180" y2="172" stroke="#e17055" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="180" cy="196" r="2.5" fill="var(--color-ink)" />
        <text x="226" y="192" fill="var(--color-muted)" fontSize="11">near the mass</text>
        <text x="226" y="206" fill="var(--color-muted)" fontSize="11">
          ticks: <tspan ref={countLow} fill="var(--color-ink)" fontWeight="700">0</tspan>
        </text>

        {/* connector */}
        <line x1="180" y1="108" x2="180" y2="166" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 3" />
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Gravity strength" value={strength} min={0} max={100} step={5} unit="" onChange={setStrength} />
        <p className="mt-2 pb-4 text-center text-xs text-muted">
          The lower clock runs at {(rateLow * 100).toFixed(0)}% of the higher one. On Earth the gap is a few parts in a billion — invisible to you, but GPS would fail without correcting for it.
        </p>
      </div>
    </div>
  )
}
