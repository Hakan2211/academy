import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// The carbon cycle: carbon moves between the air, living things, and the ground.
// Photosynthesis pulls CO₂ out; respiration, decomposition, and (now) burning
// fossil fuels put it back. Toggle human emissions to unbalance the cycle.
type Arrow = { x1: number; y1: number; x2: number; y2: number; color: string; label?: string; human?: boolean }
const ARROWS: Array<Arrow> = [
  { x1: 118, y1: 44, x2: 58, y2: 96, color: '#2ECC71', label: 'photosynthesis' }, // atm → plants
  { x1: 80, y1: 96, x2: 140, y2: 44, color: '#94a3b8' }, // plants → atm (respiration)
  { x1: 94, y1: 114, x2: 222, y2: 114, color: '#FDCB6E', label: 'feeding' }, // plants → animals
  { x1: 262, y1: 96, x2: 196, y2: 44, color: '#94a3b8' }, // animals → atm (respiration)
  { x1: 200, y1: 130, x2: 178, y2: 170, color: '#7b5a3a' }, // animals → soil (death)
  { x1: 158, y1: 170, x2: 158, y2: 46, color: '#94a3b8' }, // soil → atm (decomposers)
  { x1: 56, y1: 170, x2: 132, y2: 46, color: '#E74C3C', label: 'burning', human: true }, // fossil → atm
]
const DOTS = 2

function Box({ x, y, w, label, color }: { x: number; y: number; w: number; label: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={30} rx={6} fill={`${color}22`} stroke={color} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + 19} textAnchor="middle" className="fill-ink text-[9px] font-semibold">{label}</text>
    </g>
  )
}

export function CarbonCycle() {
  const [human, setHuman] = useState(false)
  const humanRef = useRef(human)
  humanRef.current = human
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    let raf = 0
    const loop = (now: number) => {
      const t = now / 1000
      ARROWS.forEach((a, ai) => {
        for (let d = 0; d < DOTS; d++) {
          const idx = ai * DOTS + d
          const el = dotRefs.current[idx]
          if (!el) continue
          if (a.human && !humanRef.current) {
            el.setAttribute('opacity', '0')
            continue
          }
          const f = (t * 0.3 + d / DOTS + ai * 0.13) % 1
          el.setAttribute('cx', (a.x1 + (a.x2 - a.x1) * f).toFixed(1))
          el.setAttribute('cy', (a.y1 + (a.y2 - a.y1) * f).toFixed(1))
          el.setAttribute('opacity', '0.95')
        }
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 214" className="w-full">
        {/* arrows */}
        {ARROWS.map((a, i) => (
          <line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} stroke={a.color} strokeWidth={a.human && !human ? 0 : 2} opacity={0.4} />
        ))}
        {/* reservoirs */}
        <Box x={110} y={14} w={100} label="Atmosphere CO₂" color="#74B9FF" />
        <Box x={16} y={96} w={74} label="Plants" color="#2ECC71" />
        <Box x={224} y={96} w={80} label="Animals" color="#E67E22" />
        <Box x={116} y={172} w={84} label="Soil / decomposers" color="#7b5a3a" />
        <Box x={14} y={172} w={86} label="Fossil fuels" color="#475569" />
        {/* flowing carbon */}
        {ARROWS.flatMap((a, ai) =>
          Array.from({ length: DOTS }).map((_, d) => (
            <circle key={`${ai}-${d}`} ref={(el) => { dotRefs.current[ai * DOTS + d] = el }} r={3} fill={a.color} opacity={0} />
          )),
        )}
      </svg>

      <div className="mt-1 flex flex-col items-center gap-2">
        <button type="button" onClick={() => setHuman((h) => !h)} className={cn('rounded-full border px-4 py-1.5 text-sm transition-colors', human ? 'border-warn bg-warn/15 text-warn' : 'border-border text-muted hover:text-ink')}>
          {human ? '🏭 Burning fossil fuels: ON' : 'Burning fossil fuels: OFF'}
        </button>
        <p className="text-center text-sm text-muted">
          {human
            ? 'Burning fossil fuels adds an extra flood of CO₂ that the cycle can’t reabsorb fast enough — so atmospheric CO₂ climbs.'
            : 'Naturally, photosynthesis and respiration roughly balance, keeping atmospheric CO₂ steady.'}
        </p>
      </div>
    </div>
  )
}
