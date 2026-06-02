import { useState } from 'react'

// Concentration measures how crowded the solute is. Molarity (M) = moles of
// solute ÷ litres of solution. Add solute → more concentrated; add water
// (dilution) → same solute, bigger volume, lower concentration.
export function MolarityLab() {
  const [moles, setMoles] = useState(1)
  const [volume, setVolume] = useState(1)
  const M = moles / volume
  // colour intensity ∝ concentration (cap for display)
  const intensity = Math.min(1, M / 4)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-end justify-center gap-6">
        <svg viewBox="0 0 120 150" className="w-28">
          {/* beaker filled to a height ∝ volume, colour ∝ concentration */}
          <path d="M 20 10 L 100 10 L 100 140 L 20 140 Z" fill="none" stroke="var(--color-muted)" strokeWidth={2} />
          <rect
            x={22}
            y={140 - Math.min(128, volume * 56)}
            width={76}
            height={Math.min(128, volume * 56)}
            fill="#9B59B6"
            opacity={0.2 + intensity * 0.7}
          />
        </svg>
        <div className="text-center">
          <div className="text-3xl font-bold text-accent">{M.toFixed(2)}</div>
          <div className="text-xs text-muted">mol/L (M)</div>
          <div className="mt-2 text-sm text-muted">
            {moles.toFixed(1)} mol in {volume.toFixed(1)} L
          </div>
        </div>
      </div>

      <p className="my-3 text-center text-sm text-muted">
        Molarity = moles ÷ litres. {M >= 1.5 ? 'A concentrated solution — darkly coloured.' : M <= 0.5 ? 'A dilute solution — pale.' : 'A moderate concentration.'}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="flex items-center justify-between text-muted">
            <span>Solute</span>
            <span className="font-mono text-ink">{moles.toFixed(1)} mol</span>
          </span>
          <input type="range" min={0.5} max={4} step={0.5} value={moles} onChange={(e) => setMoles(Number(e.target.value))} className="accent-accent" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="flex items-center justify-between text-muted">
            <span>Solution volume</span>
            <span className="font-mono text-ink">{volume.toFixed(1)} L</span>
          </span>
          <input type="range" min={0.5} max={4} step={0.5} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="accent-accent" />
        </label>
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        Tip: hold the solute fixed and increase the volume — that's <span className="text-ink">dilution</span> (M₁V₁ = M₂V₂).
      </p>
    </div>
  )
}
