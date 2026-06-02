import { useState } from 'react'
import { cn } from '#/lib/cn'

// A reaction energy profile: reactants climb over an activation-energy barrier
// to become products. If products sit lower, energy was released (exothermic);
// if higher, energy was absorbed (endothermic). A catalyst lowers the barrier.
export function EnergyDiagram() {
  const [endo, setEndo] = useState(false)
  const [cat, setCat] = useState(false)

  // energy levels (0 bottom .. 100 top), mapped to svg y
  const R = endo ? 35 : 70
  const P = endo ? 72 : 28
  const peak = (endo ? 95 : 96) - (cat ? 22 : 0)
  const yOf = (e: number) => 150 - e * 1.25

  const path = `M 30 ${yOf(R)} L 95 ${yOf(R)} Q 150 ${yOf(peak)} 205 ${yOf(P)} L 280 ${yOf(P)}`

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEndo(false)}
          className={cn('rounded-full border px-3 py-1 text-sm transition-colors', !endo ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
        >
          Exothermic
        </button>
        <button
          type="button"
          onClick={() => setEndo(true)}
          className={cn('rounded-full border px-3 py-1 text-sm transition-colors', endo ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
        >
          Endothermic
        </button>
        <button
          type="button"
          onClick={() => setCat((c) => !c)}
          className={cn('ml-auto rounded-full border px-3 py-1 text-sm transition-colors', cat ? 'border-[#2ECC71] bg-[#2ECC71]/15 text-[#2ECC71]' : 'border-border text-muted hover:text-ink')}
        >
          {cat ? '✓ Catalyst' : 'Add catalyst'}
        </button>
      </div>

      <svg viewBox="0 0 300 160" className="w-full">
        <line x1={30} y1={12} x2={30} y2={150} stroke="var(--color-border)" strokeWidth={1.5} />
        <line x1={30} y1={150} x2={290} y2={150} stroke="var(--color-border)" strokeWidth={1.5} />
        <text x={6} y={80} className="fill-muted text-[9px]" transform="rotate(-90 10 80)">energy</text>
        <text x={290} y={147} textAnchor="end" className="fill-muted text-[9px]">reaction progress →</text>

        {/* the barrier (catalysed shown faded for comparison) */}
        {cat && (
          <path d={`M 30 ${yOf(R)} L 95 ${yOf(R)} Q 150 ${yOf(endo ? 95 : 96)} 205 ${yOf(P)} L 280 ${yOf(P)}`} fill="none" stroke="var(--color-border)" strokeWidth={1.5} strokeDasharray="3 3" />
        )}
        <path d={path} fill="none" stroke={endo ? '#E84393' : '#E67E22'} strokeWidth={2.5} />

        {/* labels */}
        <text x={62} y={yOf(R) - 6} textAnchor="middle" className="fill-muted text-[9px]">reactants</text>
        <text x={250} y={yOf(P) + (endo ? -6 : 14)} textAnchor="middle" className="fill-muted text-[9px]">products</text>
        {/* Ea bracket */}
        <line x1={150} y1={yOf(R)} x2={150} y2={yOf(peak)} stroke="#F1C40F" strokeWidth={1} strokeDasharray="2 2" />
        <text x={156} y={yOf((R + peak) / 2)} className="fill-[#F1C40F] text-[8px]">Eₐ</text>
        {/* ΔH bracket */}
        <line x1={250} y1={yOf(R)} x2={250} y2={yOf(P)} stroke="#5DADE2" strokeWidth={1} strokeDasharray="2 2" />
        <text x={256} y={yOf((R + P) / 2)} className="fill-[#5DADE2] text-[8px]">ΔH</text>
      </svg>

      <p className="mt-2 min-h-[2.5rem] text-center text-sm text-muted">
        {endo
          ? 'Endothermic: products sit higher than reactants — energy was absorbed (ΔH positive). The surroundings cool.'
          : 'Exothermic: products sit lower than reactants — energy was released (ΔH negative). The surroundings warm.'}
        {cat ? ' The catalyst lowers the activation energy (Eₐ), speeding the reaction without changing ΔH.' : ''}
      </p>
    </div>
  )
}
