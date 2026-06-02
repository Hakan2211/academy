import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// Active transport: a pump protein moves a molecule UPHILL — from where it's
// scarce to where it's already crowded — and pays for it with ATP. Switch the
// energy off and the pump stalls: no ATP, no uphill transport.
const MEM_TOP = 92
const MEM_BOT = 132
const PUMP_X = 180

export function ActiveTransport() {
  const [atp, setAtp] = useState(true)
  const atpRef = useRef(atp)
  const cargoRef = useRef<SVGCircleElement | null>(null)
  const flashRef = useRef<SVGCircleElement | null>(null)
  const countRef = useRef<HTMLSpanElement | null>(null)
  const count = useRef(0)

  useEffect(() => {
    atpRef.current = atp
  }, [atp])

  useEffect(() => {
    let raf = 0
    let phase = 0
    let last = 0
    const loop = (now: number) => {
      if (!last) last = now
      const dt = Math.min(50, now - last)
      last = now
      // only advance when ATP is available
      if (atpRef.current) phase += dt * 0.0005
      if (phase >= 1) {
        phase = 0
        count.current += 1
        if (countRef.current) countRef.current.textContent = String(count.current)
      }

      // particle path: outside (top, y=40) → bind (y=MEM_TOP) → through → inside (y=180)
      let y: number
      let x = PUMP_X
      if (phase < 0.35) {
        y = 40 + (phase / 0.35) * (MEM_TOP - 40)
      } else if (phase < 0.6) {
        y = MEM_TOP // bound, pump working
      } else {
        y = MEM_TOP + ((phase - 0.6) / 0.4) * (185 - MEM_TOP)
      }
      cargoRef.current?.setAttribute('cx', String(x))
      cargoRef.current?.setAttribute('cy', y.toFixed(1))

      // ATP flash during the "work" window
      const flashing = atpRef.current && phase >= 0.35 && phase < 0.6
      flashRef.current?.setAttribute('opacity', flashing ? '0.9' : '0')

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 360 210" className="w-full">
        {/* regions */}
        <text x={20} y={26} className="fill-muted text-[10px]">outside — molecule is SCARCE</text>
        {[60, 110, 250, 300].map((x, i) => (
          <circle key={i} cx={x} cy={45} r={4} fill="#FDCB6E" opacity={0.85} />
        ))}

        {/* membrane bilayer */}
        <rect x={10} y={MEM_TOP} width={340} height={MEM_BOT - MEM_TOP} fill="#243a18" />
        {Array.from({ length: 19 }).map((_, i) => (
          <g key={i}>
            <circle cx={20 + i * 18} cy={MEM_TOP + 4} r={4} fill="#FDCB6E" />
            <circle cx={20 + i * 18} cy={MEM_BOT - 4} r={4} fill="#FDCB6E" />
          </g>
        ))}

        {/* inside — crowded already */}
        <text x={20} y={200} className="fill-muted text-[10px]">inside — molecule is CROWDED (uphill!)</text>
        {[50, 90, 130, 230, 270, 310, 70, 250].map((x, i) => (
          <circle key={i} cx={x} cy={170 + (i % 2) * 12} r={4} fill="#FDCB6E" opacity={0.85} />
        ))}

        {/* pump protein */}
        <path d={`M ${PUMP_X - 18} ${MEM_TOP - 4} q -10 24 0 ${MEM_BOT - MEM_TOP + 8} l 36 0 q 10 -24 0 -${MEM_BOT - MEM_TOP + 8} z`} fill="#A29BFE" opacity={0.95} />
        <circle ref={flashRef} cx={PUMP_X + 22} cy={MEM_TOP + 6} r={9} fill="#2ECC71" opacity={0} />
        <text x={PUMP_X + 22} y={MEM_TOP + 9} textAnchor="middle" className="fill-white text-[8px] font-bold">ATP</text>

        {/* the transported molecule */}
        <circle ref={cargoRef} cx={PUMP_X} cy={40} r={6} fill="#FF7A66" stroke="#fff" strokeWidth={1} />

        {/* uphill arrow */}
        <g stroke="#FD79A8" strokeWidth={2} opacity={0.7}>
          <line x1={330} y1={185} x2={330} y2={40} />
          <path d="M 326 48 l 4 -8 l 4 8" fill="none" />
        </g>
        <text x={330} y={110} textAnchor="middle" transform="rotate(90 330 110)" className="fill-muted text-[9px]">against the gradient</text>
      </svg>

      <div className="mt-1 flex items-center justify-between">
        <p className="text-sm text-muted">
          Pumped uphill: <span ref={countRef} className="font-mono text-ink">0</span>
        </p>
        <button
          type="button"
          onClick={() => setAtp((v) => !v)}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            atp ? 'border-success bg-success/15 text-success' : 'border-warn bg-warn/15 text-warn',
          )}
        >
          ATP: {atp ? 'ON' : 'OFF'}
        </button>
      </div>
      <p className="mt-1 text-center text-xs text-muted">
        Switch ATP off and the pump stalls — no energy, no uphill transport.
      </p>
    </div>
  )
}
