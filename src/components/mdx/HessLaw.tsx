import { useState } from 'react'
import { cn } from '#/lib/cn'

// Hess's Law: the total enthalpy change is the same whether a reaction happens
// in one step or several — because enthalpy depends only on start and end
// states. So you can add step ΔH values to get the overall ΔH.
export function HessLaw() {
  const [stepwise, setStepwise] = useState(true)
  // C + O2 -> CO2, via CO
  const levels = [
    { label: 'C + O₂', e: 0, y: 24 },
    { label: 'CO + ½O₂', e: -110, y: 70 },
    { label: 'CO₂', e: -393, y: 132 },
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setStepwise(true)}
          className={cn('flex-1 rounded-full border px-3 py-1 text-sm transition-colors', stepwise ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
        >
          Two-step path
        </button>
        <button
          type="button"
          onClick={() => setStepwise(false)}
          className={cn('flex-1 rounded-full border px-3 py-1 text-sm transition-colors', !stepwise ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink')}
        >
          Direct path
        </button>
      </div>

      <svg viewBox="0 0 300 150" className="w-full">
        {levels.map((l, i) => (
          <g key={i} opacity={!stepwise && i === 1 ? 0.3 : 1}>
            <line x1={40} y1={l.y} x2={150} y2={l.y} stroke="var(--color-ink)" strokeWidth={2} />
            <text x={36} y={l.y + 3} textAnchor="end" className="fill-muted text-[9px]">{l.label}</text>
            <text x={154} y={l.y + 3} className="fill-muted text-[8px]">{l.e} kJ</text>
          </g>
        ))}

        {stepwise ? (
          <>
            {/* step 1: 0 -> -110 */}
            <line x1={95} y1={24} x2={95} y2={70} stroke="#E67E22" strokeWidth={2} markerEnd="url(#ar)" />
            <text x={100} y={50} className="fill-[#E67E22] text-[8px]">ΔH₁ = −110</text>
            {/* step 2: -110 -> -393 */}
            <line x1={95} y1={70} x2={95} y2={132} stroke="#E67E22" strokeWidth={2} markerEnd="url(#ar)" />
            <text x={100} y={104} className="fill-[#E67E22] text-[8px]">ΔH₂ = −283</text>
          </>
        ) : (
          <>
            <line x1={210} y1={24} x2={210} y2={132} stroke="#5DADE2" strokeWidth={2.5} markerEnd="url(#ar)" />
            <text x={216} y={80} className="fill-[#5DADE2] text-[9px]">ΔH = −393</text>
          </>
        )}
        <defs>
          <marker id="ar" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto">
            <path d="M1,1 L4,6 L7,1" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </marker>
        </defs>
      </svg>

      <p className="mt-2 text-center text-sm text-muted">
        {stepwise
          ? 'Two steps: ΔH₁ + ΔH₂ = (−110) + (−283) = −393 kJ.'
          : 'One direct step: ΔH = −393 kJ — exactly the sum of the two-step path.'}
        {' '}The route doesn't matter; only the start and end do.
      </p>
    </div>
  )
}
