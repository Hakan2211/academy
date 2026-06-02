import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

// When two atoms share electrons, the more electronegative one pulls the shared
// pair closer, building up a partial charge. The bigger the electronegativity
// gap, the more lopsided the bond — from non-polar to polar to fully ionic.
const PRESETS = [
  { label: 'H–H', d: 0 },
  { label: 'C–H', d: 0.35 },
  { label: 'H–Cl', d: 0.96 },
  { label: 'O–H', d: 1.24 },
  { label: 'Na–Cl', d: 2.23 },
]

function classify(d: number) {
  if (d < 0.4) return { type: 'Non-polar covalent', note: 'The atoms pull almost equally, so the electrons are shared evenly. No real charge separation.' }
  if (d < 1.7) return { type: 'Polar covalent', note: 'One atom pulls harder, so the shared electrons sit closer to it — partial charges (δ⁻ and δ⁺) appear.' }
  return { type: 'Ionic', note: 'The gap is so large the electron is essentially handed over — the bond is ionic, not shared.' }
}

export function Polarity() {
  const [d, setD] = useState(0.96)
  const c = classify(d)
  // shared cloud shifts toward the right (more electronegative) atom
  const shift = Math.min(34, d * 16)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setD(p.d)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              Math.abs(d - p.d) < 0.02 ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 300 130" className="w-full">
        {/* the two atoms */}
        <circle cx={95} cy={65} r={30} fill="#5DADE2" />
        <circle cx={205} cy={65} r={36} fill="#E74C3C" />
        <text x={95} y={70} textAnchor="middle" className="fill-[#10141f] text-[13px] font-bold">A</text>
        <text x={205} y={70} textAnchor="middle" className="fill-white text-[13px] font-bold">B</text>

        {/* shared electron cloud */}
        {d < 1.7 && (
          <ellipse cx={150 + shift} cy={65} rx={42} ry={16} fill="#F1C40F" opacity={0.4} />
        )}
        {d >= 1.7 && (
          <ellipse cx={205} cy={65} rx={20} ry={14} fill="#F1C40F" opacity={0.5} />
        )}

        {/* partial charge labels */}
        {d >= 0.4 && d < 1.7 && (
          <>
            <text x={95} y={28} textAnchor="middle" className="fill-[#5DADE2] text-[13px] font-bold">δ⁺</text>
            <text x={205} y={24} textAnchor="middle" className="fill-[#E74C3C] text-[13px] font-bold">δ⁻</text>
          </>
        )}
        {d >= 1.7 && (
          <>
            <text x={95} y={28} textAnchor="middle" className="fill-[#5DADE2] text-[13px] font-bold">+</text>
            <text x={205} y={24} textAnchor="middle" className="fill-[#E74C3C] text-[13px] font-bold">−</text>
          </>
        )}

        <text x={150} y={115} textAnchor="middle" className="fill-muted text-[10px]">
          B is more electronegative → it pulls the shared electrons
        </text>
      </svg>

      <p className="text-center text-sm">
        <span className="font-semibold text-accent">{c.type}</span>
      </p>
      <p className="mt-1 min-h-[2.5rem] text-center text-sm text-muted">{c.note}</p>

      <SceneSlider
        label="Electronegativity difference (ΔEN)"
        value={d}
        min={0}
        max={2.6}
        step={0.02}
        unit=""
        onChange={setD}
      />
    </div>
  )
}
