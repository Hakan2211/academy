import { useEffect, useRef, useState } from 'react'

// A reversible reaction reaches DYNAMIC equilibrium: forward and reverse
// reactions still run, but at equal rates, so concentrations hold steady. Apply
// a stress (Le Chatelier) and the balance shifts to oppose it.
const MAXH = 110
const SCALE = 11 // concentration units mapped to bar height

export function EquilibriumLab() {
  const aRef = useRef<SVGRectElement | null>(null)
  const bRef = useRef<SVGRectElement | null>(null)
  const statusRef = useRef<HTMLParagraphElement | null>(null)
  const conc = useRef({ a: 8, b: 0 })
  const K = useRef(1) // equilibrium constant kf/kr
  const [msg, setMsg] = useState('System settling toward equilibrium…')

  useEffect(() => {
    let raf = 0
    const kr = 0.4
    const loop = () => {
      const kf = kr * K.current
      const { a, b } = conc.current
      const net = kf * a - kr * b // forward minus reverse
      conc.current.a = Math.max(0, a - net * 0.12)
      conc.current.b = Math.max(0, b + net * 0.12)
      const ha = (conc.current.a / SCALE) * MAXH
      const hb = (conc.current.b / SCALE) * MAXH
      aRef.current?.setAttribute('height', ha.toFixed(1))
      aRef.current?.setAttribute('y', (128 - ha).toFixed(1))
      bRef.current?.setAttribute('height', hb.toFixed(1))
      bRef.current?.setAttribute('y', (128 - hb).toFixed(1))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const stress = (kind: string) => {
    if (kind === 'addA') {
      conc.current.a += 4
      setMsg('Added reactant A → equilibrium shifts RIGHT to make more B, using up the added A.')
    } else if (kind === 'addB') {
      conc.current.b += 4
      setMsg('Added product B → equilibrium shifts LEFT to make more A, using up the added B.')
    } else if (kind === 'heat') {
      K.current = Math.max(0.25, K.current / 1.6)
      setMsg('Heated (forward reaction is exothermic) → equilibrium shifts LEFT, favouring reactants.')
    } else {
      K.current = Math.min(4, K.current * 1.6)
      setMsg('Cooled → equilibrium shifts RIGHT, favouring products.')
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-2 text-center font-mono text-ink">A ⇌ B</p>
      <svg viewBox="0 0 300 140" className="w-full">
        <line x1={20} y1={128} x2={280} y2={128} stroke="var(--color-border)" strokeWidth={1.5} />
        <rect ref={aRef} x={70} y={18} width={70} height={110} rx={4} fill="#5DADE2" />
        <rect ref={bRef} x={160} y={128} width={70} height={0} rx={4} fill="#2ECC71" />
        <text x={105} y={138} textAnchor="middle" className="fill-muted text-[10px]">A (reactant)</text>
        <text x={195} y={138} textAnchor="middle" className="fill-muted text-[10px]">B (product)</text>
      </svg>

      <p ref={statusRef} className="my-2 min-h-[2.5rem] text-center text-sm text-muted">{msg}</p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ['addA', 'Add A'],
          ['addB', 'Add B'],
          ['heat', 'Heat'],
          ['cool', 'Cool'],
        ].map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => stress(k)}
            className="rounded-lg border border-accent bg-accent/10 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
