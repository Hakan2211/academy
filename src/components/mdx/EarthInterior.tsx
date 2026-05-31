import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

type Layer = 'crust' | 'mantle' | 'outer' | 'inner'
type Wave = 'P' | 'S'

const C = { x: 176, y: 134 }
const R = 102
const RAD: Record<Layer, number> = { inner: 22, outer: 52, mantle: 94, crust: 102 }
const E = { x: 176, y: 134 - 102 } // earthquake epicentre, at the top

const FILL: Record<Layer, string> = { inner: '#ffe08a', outer: '#f6a14b', mantle: '#b8533a', crust: '#5d3a2e' }
const INFO: Record<Layer, { name: string; text: string }> = {
  crust: { name: 'Crust', text: 'Thin, cool, brittle rock — just 5–70 km deep. The solid ground we live on, a skin on the planet.' },
  mantle: { name: 'Mantle', text: 'Hot solid rock (~3,000 °C) that creeps like putty over millions of years. Its slow churn drives the moving plates. Down to ~2,900 km.' },
  outer: { name: 'Outer core', text: 'Molten iron and nickel. Its swirling flow generates Earth’s magnetic field — and because it’s liquid, S-waves cannot cross it.' },
  inner: { name: 'Inner core', text: 'Solid iron, squeezed solid by colossal pressure despite a ~5,400 °C heat. The planet’s hot heart.' },
}

const PHIS = [-74, -58, -44, -31, -15, 0, 15, 31, 44, 58, 74].map((d) => (d * Math.PI) / 180)

// We can't dig to the core — but earthquakes light it up for us. Seismic waves race
// through the Earth and arrive at stations worldwide. Crucially, S-waves can't travel
// through liquid, so they leave a huge "shadow" on the far side. That missing signal is
// the proof that the outer core is molten. Flip between P- and S-waves and watch.
export function EarthInterior() {
  const [sel, setSel] = useState<Layer | null>('outer')
  const [wave, setWave] = useState<Wave>('S')
  const waveRef = useRef(wave)
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])
  useEffect(() => { waveRef.current = wave }, [wave])

  // geometry per ray: end point (and whether the outer core blocks it for S)
  const rays = useMemo(() => {
    const Rc = RAD.outer
    return PHIS.map((phi) => {
      const dx = Math.sin(phi)
      const dy = Math.cos(phi)
      const tExit = 2 * R * dy
      const exit = { x: E.x + tExit * dx, y: E.y + tExit * dy }
      const entersCore = Math.abs(dx) < Rc / R
      let tEntry = tExit
      if (entersCore) {
        const disc = R * R * dy * dy - (R * R - Rc * Rc)
        tEntry = R * dy - Math.sqrt(Math.max(0, disc))
      }
      const entry = { x: E.x + tEntry * dx, y: E.y + tEntry * dy }
      return { dx, dy, exit, entry, blocked: entersCore }
    })
  }, [])

  useEffect(() => {
    let raf = 0
    let prog = 0
    const loop = () => {
      prog += 0.012
      if (prog > 1.25) prog = 0
      const p = Math.min(1, prog)
      const w = waveRef.current
      for (let i = 0; i < rays.length; i++) {
        const r = rays[i]
        const end = w === 'S' && r.blocked ? r.entry : r.exit
        const x = E.x + (end.x - E.x) * p
        const y = E.y + (end.y - E.y) * p
        const el = dotRefs.current[i]
        if (el) {
          el.setAttribute('cx', x.toFixed(1))
          el.setAttribute('cy', y.toFixed(1))
          el.setAttribute('opacity', prog > 1 ? '0' : '0.95')
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [rays])

  const info = sel ? INFO[sel] : null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-2 p-3">
        <span className="text-xs text-muted">Seismic waves:</span>
        {(['P', 'S'] as Array<Wave>).map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => setWave(w)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              wave === w ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {w}-wave
          </button>
        ))}
        <span className="ml-auto text-xs text-muted">tap a layer →</span>
      </div>

      <svg viewBox="0 0 360 250" className="w-full">
        {/* S-wave shadow zone on the far side */}
        {wave === 'S' && (
          <path
            d={`M ${C.x + R * Math.cos((50 * Math.PI) / 180)} ${C.y + R * Math.sin((50 * Math.PI) / 180)} A ${R} ${R} 0 0 0 ${C.x + R * Math.cos((130 * Math.PI) / 180)} ${C.y + R * Math.sin((130 * Math.PI) / 180)}`}
            fill="none"
            stroke="#e84393"
            strokeWidth="6"
            opacity="0.5"
            strokeLinecap="round"
          />
        )}

        {/* layers (largest first → correct click regions) */}
        {(['crust', 'mantle', 'outer', 'inner'] as Array<Layer>).map((l) => (
          <circle
            key={l}
            cx={C.x}
            cy={C.y}
            r={RAD[l]}
            fill={FILL[l]}
            stroke={sel === l ? '#fff' : 'none'}
            strokeWidth={sel === l ? 2 : 0}
            className="cursor-pointer"
            onClick={() => setSel(l)}
          />
        ))}

        {/* ray paths + travelling dots */}
        {rays.map((r, i) => {
          const end = wave === 'S' && r.blocked ? r.entry : r.exit
          return <line key={`l${i}`} x1={E.x} y1={E.y} x2={end.x} y2={end.y} stroke={wave === 'P' ? '#74b9ff' : '#ffeaa7'} strokeWidth="0.75" opacity="0.3" />
        })}
        {rays.map((_, i) => (
          <circle key={`d${i}`} ref={(el) => { dotRefs.current[i] = el }} cx={E.x} cy={E.y} r="3" fill={wave === 'P' ? '#74b9ff' : '#ffeaa7'} />
        ))}

        {/* epicentre marker */}
        <path d={`M ${E.x} ${E.y - 6} l 4 6 -4 6 -4 -6 z`} fill="#e84393" />
        <text x={E.x + 8} y={E.y - 2} fontSize="9" fill="var(--color-muted)">quake</text>

        {wave === 'S' && (
          <text x={C.x} y={C.y + R + 28} textAnchor="middle" fontSize="10" fill="#e84393">S-wave shadow (no signal)</text>
        )}
      </svg>

      <p className="px-4 pb-4 pt-1 text-sm text-muted">
        {info ? (
          <>
            <span className="font-semibold text-ink">{info.name}.</span> {info.text}
          </>
        ) : (
          'Tap a layer to explore it.'
        )}
      </p>
    </div>
  )
}
