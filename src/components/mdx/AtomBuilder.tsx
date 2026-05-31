import { useEffect, useRef, useState } from 'react'

const CX = 150
const CY = 120
const SHELL_R = [44, 70, 96]
const SHELL_CAP = [2, 8, 8]
const RED = '#e17055' // protons (+)
const GRAY = '#95a5a6' // neutrons (0)
const BLUE = '#0984e3' // electrons (−)

const ELEMENTS: Array<{ sym: string; name: string }> = [
  { sym: '—', name: 'nothing' },
  { sym: 'H', name: 'Hydrogen' },
  { sym: 'He', name: 'Helium' },
  { sym: 'Li', name: 'Lithium' },
  { sym: 'Be', name: 'Beryllium' },
  { sym: 'B', name: 'Boron' },
  { sym: 'C', name: 'Carbon' },
  { sym: 'N', name: 'Nitrogen' },
  { sym: 'O', name: 'Oxygen' },
  { sym: 'F', name: 'Fluorine' },
  { sym: 'Ne', name: 'Neon' },
]

// Golden-angle spiral so any number of nucleons packs into a tidy cluster.
function packPositions(count: number) {
  const out: Array<{ x: number; y: number }> = []
  for (let i = 0; i < count; i++) {
    const r = 6.5 * Math.sqrt(i)
    const a = i * 2.39996
    out.push({ x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) })
  }
  return out
}

// Build an atom by hand. Protons fix the element (and so the chemistry);
// neutrons change the mass; electrons orbit in shells and decide the charge.
// The whole thing is mostly empty space — the nucleus is a speck at the centre.
export function AtomBuilder() {
  const [protons, setProtons] = useState(2)
  const [neutrons, setNeutrons] = useState(2)
  const [electrons, setElectrons] = useState(2)
  const shellRefs = useRef<Array<SVGGElement | null>>([])

  // gently spin the shells; inner ones faster, alternating directions
  useEffect(() => {
    let raf = 0
    let last = 0
    const angles = [0, 0, 0]
    const speed = [0.05, -0.03, 0.02]
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      for (let s = 0; s < shellRefs.current.length; s++) {
        const g = shellRefs.current[s]
        if (!g) continue
        angles[s] += speed[s] * dt
        g.setAttribute('transform', `rotate(${angles[s]} ${CX} ${CY})`)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  })

  // interleave protons & neutrons proportionally so colours mix realistically
  const total = protons + neutrons
  const types: Array<'p' | 'n'> = []
  let pUsed = 0
  let nUsed = 0
  for (let i = 0; i < total; i++) {
    if (nUsed >= neutrons) {
      types.push('p')
      pUsed++
    } else if (pUsed >= protons) {
      types.push('n')
      nUsed++
    } else if (pUsed * neutrons <= nUsed * protons) {
      types.push('p')
      pUsed++
    } else {
      types.push('n')
      nUsed++
    }
  }
  const positions = packPositions(total)

  // distribute electrons into shells (2, 8, 8)
  const shells: Array<number> = []
  let left = electrons
  for (let s = 0; s < SHELL_R.length && left > 0; s++) {
    const c = Math.min(left, SHELL_CAP[s])
    shells.push(c)
    left -= c
  }

  const el = ELEMENTS[protons] ?? ELEMENTS[0]
  const charge = protons - electrons
  const chargeLabel =
    charge === 0
      ? 'neutral atom'
      : charge > 0
        ? `+${charge} ion (cation)`
        : `${charge} ion (anion)`

  const Stepper = ({
    label,
    color,
    value,
    set,
    min,
    max,
  }: {
    label: string
    color: string
    value: number
    set: (v: number) => void
    min: number
    max: number
  }) => (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2 text-sm text-muted">
        <span className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
        {label}
      </span>
      <span className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => set(Math.max(min, value - 1))}
          className="h-7 w-7 rounded-full border border-border text-ink hover:bg-surface-2"
        >
          −
        </button>
        <span className="w-6 text-center font-mono text-ink">{value}</span>
        <button
          type="button"
          onClick={() => set(Math.min(max, value + 1))}
          className="h-7 w-7 rounded-full border border-border text-ink hover:bg-surface-2"
        >
          +
        </button>
      </span>
    </div>
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 300 248" className="w-full">
        {/* shells */}
        {shells.map((count, s) => (
          <g key={s}>
            <circle cx={CX} cy={CY} r={SHELL_R[s]} fill="none" stroke="var(--color-border)" strokeWidth="1" />
            <g ref={(g) => { shellRefs.current[s] = g }}>
              {Array.from({ length: count }).map((_, j) => {
                const ang = (j / count) * Math.PI * 2
                return (
                  <circle
                    key={j}
                    cx={CX + SHELL_R[s] * Math.cos(ang)}
                    cy={CY + SHELL_R[s] * Math.sin(ang)}
                    r="5"
                    fill={BLUE}
                  />
                )
              })}
            </g>
          </g>
        ))}

        {/* nucleus */}
        {positions.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="6" fill={types[i] === 'p' ? RED : GRAY} />
        ))}
      </svg>

      <div className="border-t border-border px-4 py-3 text-center">
        <div className="text-3xl font-bold text-ink">{el.sym}</div>
        <div className="text-sm text-muted">
          {el.name} · mass number A = {protons + neutrons} · {chargeLabel}
        </div>
      </div>

      <div className="grid gap-2 border-t border-border px-4 py-3 sm:grid-cols-3">
        <Stepper label="Protons" color={RED} value={protons} set={setProtons} min={1} max={10} />
        <Stepper label="Neutrons" color={GRAY} value={neutrons} set={setNeutrons} min={0} max={14} />
        <Stepper label="Electrons" color={BLUE} value={electrons} set={setElectrons} min={0} max={10} />
      </div>

      <p className="px-4 pb-4 text-center text-xs text-muted">
        The proton count alone names the element. Add a neutron and the mass changes but it's the same element; remove an electron and it becomes a charged ion.
      </p>
    </div>
  )
}
