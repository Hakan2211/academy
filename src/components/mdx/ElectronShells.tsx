import { useEffect, useRef, useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// Electrons occupy shells around the nucleus, filling from the inside out.
// Each shell holds a maximum number (2, then 8, then 8 for the first 20
// elements). The electrons in the outermost shell — the valence electrons —
// decide nearly all of an element's chemistry.
const ELEMENTS = [
  'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
  'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
]
const NAMES = [
  'Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon', 'Nitrogen',
  'Oxygen', 'Fluorine', 'Neon', 'Sodium', 'Magnesium', 'Aluminium', 'Silicon',
  'Phosphorus', 'Sulfur', 'Chlorine', 'Argon', 'Potassium', 'Calcium',
]
const CAPS = [2, 8, 8, 2]

function shellsFor(z: number): Array<number> {
  const out: Array<number> = []
  let left = z
  for (const cap of CAPS) {
    if (left <= 0) break
    const n = Math.min(cap, left)
    out.push(n)
    left -= n
  }
  return out
}

const R = [26, 42, 58, 74]

export function ElectronShells() {
  const [z, setZ] = useState(11) // sodium — a clean 2,8,1
  const groupRefs = useRef<Array<SVGGElement | null>>([])

  const shells = shellsFor(z)
  const valence = shells[shells.length - 1]

  useEffect(() => {
    let raf = 0
    let a = 0
    const loop = () => {
      a += 0.012
      groupRefs.current.forEach((g, i) => {
        if (g) g.setAttribute('transform', `rotate(${(((a * (i % 2 ? -1 : 1) * 40) % 360)).toFixed(1)} 100 95)`)
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 200 190" className="mx-auto w-full max-w-[260px]">
        {shells.map((_, i) => (
          <circle key={`r${i}`} cx={100} cy={95} r={R[i]} fill="none" stroke="var(--color-border)" strokeWidth={1} />
        ))}
        {/* nucleus */}
        <circle cx={100} cy={95} r={14} fill="#E74C3C" />
        <text x={100} y={99} textAnchor="middle" className="fill-white text-[11px] font-bold">{ELEMENTS[z - 1]}</text>

        {shells.map((count, si) => (
          <g key={`s${si}`} ref={(el) => { groupRefs.current[si] = el }}>
            {Array.from({ length: count }).map((_, ei) => {
              const ang = (ei / count) * Math.PI * 2 - Math.PI / 2
              const isVal = si === shells.length - 1
              return (
                <circle
                  key={ei}
                  cx={100 + R[si] * Math.cos(ang)}
                  cy={95 + R[si] * Math.sin(ang)}
                  r={4}
                  fill={isVal ? '#F1C40F' : '#5DADE2'}
                  stroke={isVal ? '#B7950B' : 'none'}
                  strokeWidth={isVal ? 1 : 0}
                />
              )
            })}
          </g>
        ))}
      </svg>

      <p className="mt-2 text-center text-sm">
        <span className="font-semibold text-ink">{NAMES[z - 1]}</span>{' '}
        <span className="text-muted">— configuration {shells.join(', ')}</span>
        <br />
        <span className="text-muted">
          <span className="font-mono text-[#F1C40F]">{valence}</span> valence electron{valence === 1 ? '' : 's'} in the outer shell
        </span>
      </p>

      <SceneSlider
        label="Atomic number (Z)"
        value={z}
        min={1}
        max={20}
        step={1}
        unit=""
        onChange={(v) => setZ(Math.round(v))}
      />
    </div>
  )
}
