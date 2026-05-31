import { useEffect, useRef } from 'react'

const ML = 52
const MR = 18
const TOP = 28
const BASE = 188
const W = 380
const PW = W - ML - MR
const PH = BASE - TOP
const TMIN = -20
const TMAX = 120

// piecewise: [heatFraction threshold, ...]
function stateAt(h: number): { T: number; phase: string } {
  if (h < 0.15) return { T: -20 + (h / 0.15) * 20, phase: 'Solid — warming up' }
  if (h < 0.35) return { T: 0, phase: 'Melting (ice → water)' }
  if (h < 0.55) return { T: ((h - 0.35) / 0.2) * 100, phase: 'Liquid — warming up' }
  if (h < 0.9) return { T: 100, phase: 'Boiling (water → steam)' }
  return { T: 100 + ((h - 0.9) / 0.1) * 20, phase: 'Gas — warming up' }
}

const px = (h: number) => ML + h * PW
const py = (T: number) => BASE - ((T - TMIN) / (TMAX - TMIN)) * PH

// The heating curve. Pour heat in at a steady rate and temperature climbs —
// except during melting and boiling, where it flatlines. There the energy isn't
// raising the temperature at all; it's busy breaking the bonds that hold the
// state together. That hidden energy is the "latent heat" of the change.
export function PhaseChange() {
  const dotRef = useRef<SVGCircleElement>(null)
  const phaseRef = useRef<SVGTextElement>(null)
  const tempRef = useRef<SVGTextElement>(null)

  // static curve through the breakpoints
  const breaks = [0, 0.15, 0.35, 0.55, 0.9, 1]
  const path = breaks
    .map((h, i) => `${i === 0 ? 'M' : 'L'} ${px(h).toFixed(1)} ${py(stateAt(Math.min(0.999, h)).T).toFixed(1)}`)
    .join(' ')

  useEffect(() => {
    let raf = 0
    let last = 0
    let p = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      p += dt * 0.00007
      if (p > 1) p -= 1
      const { T, phase } = stateAt(p)
      const x = px(p)
      const y = py(T)
      const el = dotRef.current
      if (el) {
        el.setAttribute('cx', x.toFixed(1))
        el.setAttribute('cy', y.toFixed(1))
      }
      if (phaseRef.current) phaseRef.current.textContent = phase
      if (tempRef.current) tempRef.current.textContent = `${Math.round(T)} °C`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 380 230" className="w-full">
        {/* axes */}
        <line x1={ML} y1={TOP} x2={ML} y2={BASE} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={ML} y1={BASE} x2={W - MR} y2={BASE} stroke="var(--color-border)" strokeWidth="1.5" />
        <text x={ML - 8} y={py(100) + 4} fill="var(--color-muted)" fontSize="10" textAnchor="end">100°</text>
        <text x={ML - 8} y={py(0) + 4} fill="var(--color-muted)" fontSize="10" textAnchor="end">0°</text>
        <line x1={ML} y1={py(0)} x2={W - MR} y2={py(0)} stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3 4" />
        <line x1={ML} y1={py(100)} x2={W - MR} y2={py(100)} stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3 4" />

        {/* the curve */}
        <path d={path} fill="none" stroke="var(--color-accent-2)" strokeWidth="2.5" />

        {/* plateau labels */}
        <text x={px(0.25)} y={py(0) - 8} fill="var(--color-muted)" fontSize="11" textAnchor="middle">melting</text>
        <text x={px(0.72)} y={py(100) - 8} fill="var(--color-muted)" fontSize="11" textAnchor="middle">boiling</text>

        {/* moving marker */}
        <circle ref={dotRef} cx={px(0)} cy={py(-20)} r="6" fill="var(--color-accent)" stroke="var(--color-bg)" strokeWidth="2" />

        {/* axis captions */}
        <text x={ML + PW / 2} y={BASE + 24} fill="var(--color-muted)" fontSize="12" textAnchor="middle">heat added →</text>
        <text x={ML} y={TOP - 12} fill="var(--color-muted)" fontSize="12">temperature ↑</text>

        {/* live readout */}
        <text ref={phaseRef} x={W - MR} y={TOP - 12} fill="var(--color-ink)" fontSize="13" fontWeight="600" textAnchor="end">
          Solid — warming up
        </text>
        <text ref={tempRef} x={W - MR} y={TOP + 6} fill="var(--color-muted)" fontSize="12" textAnchor="end">
          -20 °C
        </text>
      </svg>

      <p className="px-4 pb-4 pt-1 text-center text-sm text-muted">
        Temperature pauses at each flat step — all the incoming heat goes into changing state, not getting hotter.
      </p>
    </div>
  )
}
