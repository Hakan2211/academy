import { useEffect, useRef } from 'react'

// Redox = reduction + oxidation, always together. One species LOSES electrons
// (oxidised) and another GAINS them (reduced). Remember OIL RIG: Oxidation Is
// Loss, Reduction Is Gain. Watch the electrons transfer.
export function RedoxLab() {
  const eRef = useRef<SVGGElement | null>(null)

  useEffect(() => {
    let raf = 0
    let p = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      p += dt * 0.0006
      if (p > 1) p = 0
      const g = eRef.current
      if (g) {
        // two electrons travel along an arc from Zn (left) to Cu²⁺ (right)
        let inner = ''
        for (let k = 0; k < 2; k++) {
          const ph = (p + k * 0.5) % 1
          const x = 80 + ph * 140
          const y = 60 - Math.sin(ph * Math.PI) * 36
          inner += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#F1C40F" stroke="#B7950B"/><text x="${x.toFixed(1)}" y="${(y + 2.5).toFixed(1)}" text-anchor="middle" font-size="6" fill="#10141f">e⁻</text>`
        }
        g.innerHTML = inner
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-center font-mono text-ink">Zn + Cu²⁺ → Zn²⁺ + Cu</p>
      <svg viewBox="0 0 300 130" className="w-full">
        {/* zinc (oxidised) */}
        <circle cx={70} cy={70} r={26} fill="#7F8C8D" />
        <text x={70} y={74} textAnchor="middle" className="fill-white text-[12px] font-bold">Zn</text>
        <text x={70} y={108} textAnchor="middle" className="fill-[#E74C3C] text-[10px] font-semibold">OXIDISED (loses e⁻)</text>

        {/* copper ion (reduced) */}
        <circle cx={230} cy={70} r={26} fill="#E08A50" />
        <text x={230} y={74} textAnchor="middle" className="fill-white text-[11px] font-bold">Cu²⁺</text>
        <text x={230} y={108} textAnchor="middle" className="fill-[#2ECC71] text-[10px] font-semibold">REDUCED (gains e⁻)</text>

        <g ref={eRef} />
      </svg>

      <p className="mt-2 text-center text-sm text-muted">
        Zinc gives up 2 electrons (oxidation); the copper ion accepts them (reduction). Electrons transfer from one to the other — that's a redox reaction. <span className="text-ink">OIL RIG: Oxidation Is Loss, Reduction Is Gain.</span>
      </p>
    </div>
  )
}
