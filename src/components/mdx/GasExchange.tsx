import { useEffect, useRef } from 'react'

// Gas exchange in the lungs. Oxygen diffuses from the air in an alveolus into the
// blood; carbon dioxide diffuses the other way. A huge, moist, thin surface with
// a rich blood supply keeps the diffusion gradients steep.
const O2 = [{ y: 70 }, { y: 100 }, { y: 130 }, { y: 110 }]
const CO2 = [{ y: 85 }, { y: 120 }, { y: 150 }]

export function GasExchange() {
  const o2Refs = useRef<Array<SVGCircleElement | null>>([])
  const co2Refs = useRef<Array<SVGGElement | null>>([])

  useEffect(() => {
    let raf = 0
    const loop = (now: number) => {
      const t = now / 1000
      O2.forEach((_, i) => {
        const f = ((t * 0.22 + i / O2.length) % 1)
        const x = 60 + f * 150 // alveolus → capillary
        o2Refs.current[i]?.setAttribute('cx', x.toFixed(1))
        o2Refs.current[i]?.setAttribute('fill', x > 178 ? '#E74C3C' : '#4FD1C5')
      })
      CO2.forEach((_, i) => {
        const f = ((t * 0.2 + i / CO2.length) % 1)
        const x = 210 - f * 150 // capillary → alveolus
        co2Refs.current[i]?.setAttribute('transform', `translate(${x.toFixed(1)} ${CO2[i].y})`)
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 200" className="w-full">
        {/* alveolus */}
        <circle cx={92} cy={100} r={74} fill="#11202e" stroke="#fab1a0" strokeWidth={2} />
        <text x={92} y={188} textAnchor="middle" className="fill-muted text-[10px]">alveolus (air)</text>

        {/* capillary */}
        <rect x={196} y={24} width={40} height={152} rx={20} fill="#3a0f12" stroke="#E74C3C" strokeWidth={2} />
        <text x={216} y={188} textAnchor="middle" className="fill-muted text-[10px]">capillary (blood)</text>

        {/* thin barrier */}
        <line x1={176} y1={40} x2={176} y2={160} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
        <text x={176} y={20} textAnchor="middle" className="fill-muted text-[8px]">wall: one cell thick</text>

        {/* O2 diffusing in */}
        {O2.map((o, i) => (
          <circle key={i} ref={(el) => { o2Refs.current[i] = el }} cx={60} cy={o.y} r={5} fill="#4FD1C5" />
        ))}
        <text x={92} y={40} textAnchor="middle" className="fill-[#4FD1C5] text-[10px] font-semibold">O₂ →</text>

        {/* CO2 diffusing out */}
        {CO2.map((c, i) => (
          <g key={i} ref={(el) => { co2Refs.current[i] = el }} transform={`translate(210 ${c.y})`}>
            <circle r={5} fill="#94a3b8" />
          </g>
        ))}
        <text x={216} y={16} textAnchor="middle" className="fill-[#94a3b8] text-[10px] font-semibold">← CO₂</text>
      </svg>

      <p className="mt-1 text-center text-sm text-muted">
        Oxygen diffuses into the blood (turning it red); carbon dioxide diffuses out. The lungs' millions of alveoli make a surface the size of a tennis court.
      </p>
    </div>
  )
}
