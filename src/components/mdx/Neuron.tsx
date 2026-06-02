import { useEffect, useRef, useState } from 'react'
import { cn } from '#/lib/cn'

// A neuron, the cell that carries nerve impulses. Click each part; watch an
// impulse race down the axon as a wave of electrical change.
type Part = 'dendrites' | 'body' | 'axon' | 'myelin' | 'synapse'

const INFO: Record<Part, { label: string; fn: string }> = {
  dendrites: { label: 'Dendrites', fn: 'Branched endings that receive signals from other neurons and feed them to the cell body.' },
  body: { label: 'Cell body', fn: 'Contains the nucleus and keeps the cell alive; it sums up incoming signals.' },
  axon: { label: 'Axon', fn: 'A long fibre that carries the electrical impulse away from the cell body — sometimes over a metre.' },
  myelin: { label: 'Myelin sheath', fn: 'A fatty insulating layer wrapped around the axon that makes the impulse travel much faster.' },
  synapse: { label: 'Synapse', fn: 'The tiny gap to the next cell. The impulse crosses it using chemical messengers (neurotransmitters).' },
}

export function Neuron() {
  const [sel, setSel] = useState<Part>('axon')
  const pulseRef = useRef<SVGCircleElement | null>(null)

  useEffect(() => {
    let raf = 0
    const loop = (now: number) => {
      const f = (now / 1400) % 1
      const x = 92 + f * 200
      pulseRef.current?.setAttribute('cx', x.toFixed(1))
      pulseRef.current?.setAttribute('opacity', f > 0.95 ? '0' : '1')
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const hi = (p: Part) => sel === p
  const stroke = (p: Part, base: string) => (hi(p) ? '#FACC15' : base)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 150" className="w-full">
        {/* dendrites */}
        <g onClick={() => setSel('dendrites')} className="cursor-pointer">
          {[[-30, -30], [-36, 0], [-30, 30], [-14, -36], [-14, 36]].map(([dx, dy], i) => (
            <line key={i} x1={62} y1={75} x2={62 + dx} y2={75 + dy} stroke={stroke('dendrites', '#FD79A8')} strokeWidth={3} strokeLinecap="round" />
          ))}
        </g>
        {/* cell body */}
        <g onClick={() => setSel('body')} className="cursor-pointer">
          <circle cx={62} cy={75} r={22} fill="#A29BFE" stroke={stroke('body', '#0e1c2e')} strokeWidth={hi('body') ? 3 : 1.5} />
          <circle cx={62} cy={75} r={8} fill="#5b3fb0" />
        </g>
        {/* axon */}
        <g onClick={() => setSel('axon')} className="cursor-pointer">
          <line x1={84} y1={75} x2={296} y2={75} stroke={stroke('axon', '#cbd5e1')} strokeWidth={hi('axon') ? 8 : 6} strokeLinecap="round" />
        </g>
        {/* myelin sheath segments */}
        <g onClick={() => setSel('myelin')} className="cursor-pointer">
          {[120, 170, 220].map((x) => (
            <ellipse key={x} cx={x} cy={75} rx={18} ry={11} fill={hi('myelin') ? '#FACC15' : '#FDCB6E'} opacity={0.85} />
          ))}
        </g>
        {/* synapse terminals */}
        <g onClick={() => setSel('synapse')} className="cursor-pointer">
          {[[18, -16], [20, 0], [18, 16]].map(([dx, dy], i) => (
            <line key={i} x1={296} y1={75} x2={296 + dx} y2={75 + dy} stroke={stroke('synapse', '#4FD1C5')} strokeWidth={3} strokeLinecap="round" />
          ))}
          <circle cx={316} cy={75} r={4} fill={stroke('synapse', '#4FD1C5')} />
        </g>
        {/* travelling impulse */}
        <circle ref={pulseRef} cx={92} cy={75} r={7} fill="#fff" opacity={0.9} />
        <text x={188} y={118} textAnchor="middle" className="fill-muted text-[9px]">impulse travels this way →</text>
      </svg>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {(Object.keys(INFO) as Array<Part>).map((p) => (
          <button key={p} type="button" onClick={() => setSel(p)} className={cn('rounded-full border px-2.5 py-0.5 text-xs transition-colors', hi(p) ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}>
            {INFO[p].label}
          </button>
        ))}
      </div>
      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold text-ink">{INFO[sel].label}: </span>{INFO[sel].fn}
      </p>
    </div>
  )
}
