import { useEffect, useRef } from 'react'

// Electrolysis uses an external power supply to FORCE a non-spontaneous redox
// reaction. The battery pulls electrons, charging the electrodes: positive ions
// (cations) migrate to the negative cathode, negative ions (anions) to the
// positive anode, where they react.
function rnd(i: number, s: number) {
  const x = Math.sin(i * 7.3 + s * 2.1) * 9999
  return x - Math.floor(x)
}

export function ElectrolysisCell() {
  const gRef = useRef<SVGGElement | null>(null)
  const ions = useRef(
    Array.from({ length: 10 }, (_, i) => ({
      cation: i % 2 === 0,
      x: 90 + rnd(i, 1) * 120,
      y: 55 + rnd(i, 2) * 60,
    })),
  )

  useEffect(() => {
    let raf = 0
    const loop = () => {
      const g = gRef.current
      if (g) {
        let inner = ''
        for (const ion of ions.current) {
          const target = ion.cation ? 78 : 222 // cathode left / anode right
          ion.x += (target - ion.x) * 0.012
          if (Math.abs(ion.x - target) < 6) {
            // "reacted" — recycle to the middle
            ion.x = 130 + rnd(Math.floor(ion.x + ion.y), 3) * 40
            ion.y = 55 + rnd(Math.floor(ion.x), 4) * 60
          }
          const c = ion.cation ? '#E74C3C' : '#5DADE2'
          inner += `<circle cx="${ion.x.toFixed(1)}" cy="${ion.y.toFixed(1)}" r="7" fill="${c}"/><text x="${ion.x.toFixed(1)}" y="${(ion.y + 3).toFixed(1)}" text-anchor="middle" font-size="8" fill="#fff" font-weight="bold">${ion.cation ? '+' : '−'}</text>`
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
      <svg viewBox="0 0 300 150" className="w-full">
        {/* power supply */}
        <line x1={78} y1={40} x2={78} y2={14} stroke="var(--color-muted)" strokeWidth={2} />
        <line x1={222} y1={40} x2={222} y2={14} stroke="var(--color-muted)" strokeWidth={2} />
        <line x1={78} y1={14} x2={130} y2={14} stroke="var(--color-muted)" strokeWidth={2} />
        <line x1={170} y1={14} x2={222} y2={14} stroke="var(--color-muted)" strokeWidth={2} />
        <rect x={130} y={4} width={40} height={20} rx={3} fill="var(--color-surface-2)" stroke="var(--color-muted)" strokeWidth={1.5} />
        <text x={150} y={18} textAnchor="middle" className="fill-ink text-[9px] font-bold">⎓</text>
        <text x={150} y={36} textAnchor="middle" className="fill-muted text-[8px]">power supply</text>

        {/* electrolyte container */}
        <path d="M 55 45 L 245 45 L 238 135 L 62 135 Z" fill="#5DADE2" opacity={0.12} stroke="var(--color-muted)" strokeWidth={1.5} />
        {/* electrodes */}
        <rect x={74} y={40} width={8} height={80} fill="#7F8C8D" />
        <rect x={218} y={40} width={8} height={80} fill="#7F8C8D" />
        <text x={78} y={132} textAnchor="middle" className="fill-[#E74C3C] text-[8px]">cathode (−)</text>
        <text x={222} y={132} textAnchor="middle" className="fill-[#5DADE2] text-[8px]">anode (+)</text>

        <g ref={gRef} />
      </svg>

      <p className="mt-2 text-center text-sm text-muted">
        The power supply forces the reaction. <span className="text-[#E74C3C]">Cations (+)</span> are pulled to the negative
        cathode; <span className="text-[#5DADE2]">anions (−)</span> to the positive anode — where they gain or lose electrons and react.
        Energy goes <span className="text-ink">in</span> (the opposite of a battery).
      </p>
    </div>
  )
}
