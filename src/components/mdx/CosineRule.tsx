import { useState } from 'react'

// The cosine rule generalises Pythagoras to any triangle: c² = a² + b² − 2ab·cosC.
// When C = 90°, cos C = 0 and it collapses back to a² + b² = c². Used in
// the-cosine-rule.
export function CosineRule() {
  const a = 5
  const b = 6
  const [C, setCc] = useState(60)
  const rC = (C * Math.PI) / 180
  const c2 = a * a + b * b - 2 * a * b * Math.cos(rC)
  const c = Math.sqrt(c2)

  const u = 20
  const V: [number, number] = [60, 140] // vertex C
  const Aend: [number, number] = [V[0] + b * u, V[1]] // side b along base
  const Bend: [number, number] = [V[0] + a * u * Math.cos(rC), V[1] - a * u * Math.sin(rC)] // side a at angle C

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 240 170" className="mx-auto w-full max-w-sm">
        <polygon points={`${V[0]},${V[1]} ${Aend[0]},${Aend[1]} ${Bend[0]},${Bend[1]}`} fill="var(--color-accent)" fillOpacity="0.12" stroke="var(--color-accent)" strokeWidth="2" />
        <text x={V[0] + 14} y={V[1] - 8} fontSize="11" fontWeight="700" fill="var(--color-accent-2)">C {C}°</text>
        <text x={(V[0] + Aend[0]) / 2} y={V[1] + 14} textAnchor="middle" fontSize="9" fill="var(--color-muted)">b = {b}</text>
        <text x={(V[0] + Bend[0]) / 2 - 12} y={(V[1] + Bend[1]) / 2} fontSize="9" fill="var(--color-muted)">a = {a}</text>
        <text x={(Aend[0] + Bend[0]) / 2 + 4} y={(Aend[1] + Bend[1]) / 2} fontSize="10" fontWeight="700" fill="var(--color-success)">c = {c.toFixed(2)}</text>
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">included angle C</span>
          <input type="range" min={20} max={160} value={C} onChange={(e) => setCc(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-12 text-right font-mono text-ink">{C}°</span>
        </label>
      </div>

      <p className="mt-2 text-center font-mono text-xs">
        c² = {a}² + {b}² − 2·{a}·{b}·cos {C}° = {+c2.toFixed(2)}, so c = <span className="font-bold text-success">{c.toFixed(2)}</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        {C === 90 ? 'At 90°, cos C = 0 — it becomes plain Pythagoras!' : 'Use it with two sides and the angle between them (or all three sides).'}
      </p>
    </div>
  )
}
