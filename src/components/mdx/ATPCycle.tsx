import { useEffect, useRef } from 'react'

// ATP is the cell's rechargeable battery. Spend energy: ATP loses a phosphate to
// become ADP, releasing energy. Recharge it with energy from respiration:
// ADP + phosphate → ATP. Watch the cycle turn.
export function ATPCycle() {
  const p3Ref = useRef<SVGGElement | null>(null)
  const bondRef = useRef<SVGLineElement | null>(null)
  const burstRef = useRef<SVGCircleElement | null>(null)
  const labelRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    let raf = 0
    let p = 0
    let last = 0
    const ATT = { x: 232, y: 100 }
    const OFF = { x: 300, y: 52 }
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      p += dt * 0.0003
      if (p >= 1) p = 0

      let x = ATT.x
      let y = ATT.y
      let burst = 0
      let label = ''
      if (p < 0.4) {
        label = 'ATP — fully charged (3 phosphates)'
      } else if (p < 0.5) {
        const q = (p - 0.4) / 0.1
        x = ATT.x + (OFF.x - ATT.x) * q
        y = ATT.y + (OFF.y - ATT.y) * q
        burst = Math.sin(q * Math.PI)
        label = 'ATP → ADP + Pi  ·  ENERGY RELEASED for the cell'
      } else if (p < 0.85) {
        x = OFF.x
        y = OFF.y
        label = 'ADP + Pi — discharged'
      } else {
        const q = (p - 0.85) / 0.15
        x = OFF.x + (ATT.x - OFF.x) * q
        y = OFF.y + (ATT.y - OFF.y) * q
        burst = Math.sin(q * Math.PI) * 0.8
        label = 'ADP + Pi → ATP  ·  ENERGY STORED from respiration'
      }
      p3Ref.current?.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
      bondRef.current?.setAttribute('x2', x.toFixed(1))
      bondRef.current?.setAttribute('y2', y.toFixed(1))
      bondRef.current?.setAttribute('opacity', p >= 0.4 && p < 0.85 ? '0.2' : '1')
      burstRef.current?.setAttribute('opacity', burst.toFixed(2))
      burstRef.current?.setAttribute('r', (8 + burst * 16).toFixed(1))
      if (labelRef.current) labelRef.current.textContent = label
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const P = ({ x, label }: { x: number; label: string }) => (
    <g>
      <circle cx={x} cy={100} r={14} fill="#FDCB6E" stroke="#b8860b" strokeWidth={1.5} />
      <text x={x} y={104} textAnchor="middle" className="fill-[#5a4500] text-[11px] font-bold">{label}</text>
    </g>
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 180" className="w-full">
        {/* adenosine */}
        <rect x={30} y={78} width={70} height={44} rx={10} fill="#A29BFE" />
        <text x={65} y={104} textAnchor="middle" className="fill-white text-[11px] font-semibold">adenosine</text>

        {/* phosphate chain */}
        <line x1={100} y1={100} x2={150} y2={100} stroke="#b8860b" strokeWidth={3} />
        <line x1={164} y1={100} x2={184} y2={100} stroke="#b8860b" strokeWidth={3} />
        <line ref={bondRef} x1={198} y1={100} x2={232} y2={100} stroke="#b8860b" strokeWidth={3} />

        <P x={150} label="P" />
        <P x={191} label="P" />

        {/* energy burst */}
        <circle ref={burstRef} cx={266} cy={76} r={8} fill="#2ECC71" opacity={0} />

        {/* the detachable 3rd phosphate */}
        <g ref={p3Ref} transform="translate(232 100)">
          <circle r={14} fill="#FDCB6E" stroke="#b8860b" strokeWidth={1.5} />
          <text y={4} textAnchor="middle" className="fill-[#5a4500] text-[11px] font-bold">P</text>
        </g>
      </svg>

      <p ref={labelRef} className="mt-1 min-h-[2.5rem] text-center text-sm font-semibold text-ink">
        ATP — fully charged (3 phosphates)
      </p>
      <p className="text-center text-xs text-muted">
        ATP ⇌ ADP + phosphate — the energy currency every cell spends and recharges.
      </p>
    </div>
  )
}
