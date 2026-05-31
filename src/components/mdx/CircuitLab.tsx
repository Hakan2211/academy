import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const L = 700 // perimeter length
const N = 14

// walk the rectangular loop clockwise from the bottom-left
function posAt(s: number) {
  let d = s * L
  if (d < 110) return { x: 70, y: 170 - d } // up the left side
  d -= 110
  if (d < 240) return { x: 70 + d, y: 60 } // across the top (through the bulb)
  d -= 240
  if (d < 110) return { x: 310, y: 60 + d } // down the right side
  d -= 110
  return { x: 310 - d, y: 170 } // across the bottom (through the resistor)
}

// One battery, one bulb, one resistor, wired in a loop. Voltage is the push,
// resistance is the squeeze, and Ohm's Law ties them together: I = V / R. Crank
// the voltage and charges race round faster and the bulb glows brighter; crank
// the resistance and the flow chokes down. Reused across the voltage,
// resistance, Ohm's-law, and power lessons.
export function CircuitLab({ showPower = false }: { showPower?: boolean }) {
  const [volts, setVolts] = useState(6)
  const [ohms, setOhms] = useState(3)
  const vRef = useRef(volts)
  const rRef = useRef(ohms)
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => { vRef.current = volts }, [volts])
  useEffect(() => { rRef.current = ohms }, [ohms])

  useEffect(() => {
    const ss = Array.from({ length: N }, (_, i) => i / N)
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      const I = vRef.current / rRef.current
      const ds = 0.00022 * I * dt
      for (let i = 0; i < N; i++) {
        ss[i] = (ss[i] + ds) % 1
        const { x, y } = posAt(ss[i])
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

  const current = volts / ohms
  const power = volts * current
  const brightness = Math.max(0.04, Math.min(1, power / 100))

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 380 220" className="w-full">
        {/* loop wire */}
        <rect x="70" y="60" width="240" height="110" rx="2" fill="none" stroke="var(--color-border)" strokeWidth="3" />

        {/* battery on the left rail */}
        <line x1="56" y1="104" x2="84" y2="104" stroke="var(--color-ink)" strokeWidth="3" />
        <line x1="56" y1="126" x2="84" y2="126" stroke="var(--color-ink)" strokeWidth="6" />
        <text x="44" y="108" fill="var(--color-muted)" fontSize="13" textAnchor="end">+</text>
        <text x="44" y="130" fill="var(--color-muted)" fontSize="13" textAnchor="end">−</text>

        {/* resistor on the bottom rail */}
        <rect x="160" y="162" width="60" height="16" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="2" />
        <text x="190" y="196" fill="var(--color-muted)" fontSize="12" textAnchor="middle">R</text>

        {/* bulb on the top rail */}
        <circle cx="190" cy="60" r="22" fill="#fdcb6e" opacity={brightness} />
        <circle cx="190" cy="60" r="14" fill="none" stroke="var(--color-ink)" strokeWidth="2" />
        <path d="M 183 60 L 187 66 L 193 54 L 197 60" fill="none" stroke="var(--color-ink)" strokeWidth="1.5" />

        {/* flowing charges */}
        {Array.from({ length: N }).map((_, i) => (
          <circle
            key={i}
            ref={(el) => { dotRefs.current[i] = el }}
            cx="70"
            cy="170"
            r="4.5"
            fill="var(--color-accent-2)"
          />
        ))}
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div>
          <div className="font-mono text-lg text-ink">{volts.toFixed(0)} V</div>
          <div className="text-xs text-muted">voltage</div>
        </div>
        <div>
          <div className="font-mono text-lg text-ink">{ohms.toFixed(0)} Ω</div>
          <div className="text-xs text-muted">resistance</div>
        </div>
        <div>
          <div className="font-mono text-lg text-accent">{current.toFixed(2)} A</div>
          <div className="text-xs text-muted">current = V/R</div>
        </div>
      </div>

      {showPower && (
        <div className="mt-2 text-center text-sm">
          <span className="font-mono text-lg text-[#e17055]">{power.toFixed(1)} W</span>
          <span className="ml-2 text-xs text-muted">power = V × I</span>
        </div>
      )}

      <div className="space-y-2 px-4 pb-4 pt-3">
        <SceneSlider label="Voltage" value={volts} min={1} max={12} step={1} unit="V" onChange={setVolts} />
        <SceneSlider label="Resistance" value={ohms} min={1} max={10} step={1} unit="Ω" onChange={setOhms} />
      </div>
    </div>
  )
}
