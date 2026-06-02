import { useEffect, useRef, useState } from 'react'

// The cell cycle: a cell spends most of its life growing and copying its DNA
// (interphase: G1 → S → G2), then briefly divides (M). Click a phase; a marker
// circles through the cycle.
type Phase = { id: string; label: string; f0: number; f1: number; color: string; desc: string }

const PHASES: Array<Phase> = [
  { id: 'g1', label: 'G1', f0: 0, f1: 0.45, color: '#2ECC71', desc: 'G1 — the cell grows and carries out its normal work, making proteins and new organelles.' },
  { id: 's', label: 'S', f0: 0.45, f1: 0.7, color: '#4F8CFF', desc: 'S phase — the DNA is replicated, so every chromosome is copied into two identical sister chromatids.' },
  { id: 'g2', label: 'G2', f0: 0.7, f1: 0.85, color: '#A29BFE', desc: 'G2 — a final burst of growth and a checkpoint that verifies the DNA before division.' },
  { id: 'm', label: 'M', f0: 0.85, f1: 1, color: '#FD79A8', desc: 'M phase (mitosis) — the copied chromosomes are split and the cell divides into two identical cells.' },
]

const CX = 110
const CY = 110
const R = 92
const RI = 54

function wedge(f0: number, f1: number) {
  const a0 = ((-90 + f0 * 360) * Math.PI) / 180
  const a1 = ((-90 + f1 * 360) * Math.PI) / 180
  const large = f1 - f0 > 0.5 ? 1 : 0
  const p = (r: number, a: number) => `${(CX + r * Math.cos(a)).toFixed(1)} ${(CY + r * Math.sin(a)).toFixed(1)}`
  return `M ${p(R, a0)} A ${R} ${R} 0 ${large} 1 ${p(R, a1)} L ${p(RI, a1)} A ${RI} ${RI} 0 ${large} 0 ${p(RI, a0)} Z`
}

export function CellCycle() {
  const [sel, setSel] = useState('s')
  const markRef = useRef<SVGCircleElement | null>(null)
  const phase = PHASES.find((p) => p.id === sel)!

  useEffect(() => {
    let raf = 0
    const loop = (now: number) => {
      const f = (now / 7000) % 1
      const a = ((-90 + f * 360) * Math.PI) / 180
      const rr = (R + RI) / 2
      markRef.current?.setAttribute('cx', (CX + rr * Math.cos(a)).toFixed(1))
      markRef.current?.setAttribute('cy', (CY + rr * Math.sin(a)).toFixed(1))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 220 220" className="h-[210px]">
          {PHASES.map((p) => (
            <path
              key={p.id}
              d={wedge(p.f0, p.f1)}
              fill={sel === p.id ? p.color : `${p.color}66`}
              stroke="var(--color-surface)"
              strokeWidth={2}
              className="cursor-pointer"
              onClick={() => setSel(p.id)}
            />
          ))}
          {PHASES.map((p) => {
            const fm = (p.f0 + p.f1) / 2
            const a = ((-90 + fm * 360) * Math.PI) / 180
            const rr = (R + RI) / 2
            return (
              <text key={p.id} x={CX + rr * Math.cos(a)} y={CY + rr * Math.sin(a) + 4} textAnchor="middle" className="pointer-events-none fill-white text-[12px] font-bold">
                {p.label}
              </text>
            )
          })}
          <text x={CX} y={CY - 2} textAnchor="middle" className="fill-muted text-[9px]">interphase</text>
          <text x={CX} y={CY + 12} textAnchor="middle" className="fill-muted text-[9px]">= G1+S+G2</text>
          <circle ref={markRef} cx={CX} cy={CY - (R + RI) / 2} r={6} fill="#fff" stroke="#0e1c2e" strokeWidth={1.5} />
        </svg>
      </div>

      <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
        <span className="font-semibold" style={{ color: phase.color }}>{phase.label}: </span>
        {phase.desc}
      </p>
    </div>
  )
}
