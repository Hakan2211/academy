import { useState } from 'react'
import { cn } from '#/lib/cn'

type Unit = {
  symbol: string
  name: string
  quantity: string
  color: string
  example: string
  defines: string
}

// The seven SI base units — every other unit in physics is built from these.
const UNITS: Array<Unit> = [
  { symbol: 'm', name: 'metre', quantity: 'Length', color: '#74b9ff', example: 'Your height ≈ 1.7 m · a football pitch ≈ 105 m.', defines: 'the distance light travels in 1⁄299,792,458 of a second.' },
  { symbol: 'kg', name: 'kilogram', quantity: 'Mass', color: '#a29bfe', example: 'A litre of water ≈ 1 kg · a house cat ≈ 4 kg.', defines: 'a fixed value of the Planck constant — no more lump of metal in Paris.' },
  { symbol: 's', name: 'second', quantity: 'Time', color: '#fdcb6e', example: 'About one relaxed heartbeat.', defines: '9,192,631,770 vibrations of a caesium-133 atom.' },
  { symbol: 'A', name: 'ampere', quantity: 'Electric current', color: '#55efc4', example: 'A phone charger draws ≈ 1 A.', defines: 'a fixed flow of elementary charge per second.' },
  { symbol: 'K', name: 'kelvin', quantity: 'Temperature', color: '#fab1a0', example: 'Room temperature ≈ 293 K · 0 K is absolute zero.', defines: 'a fixed value of the Boltzmann constant.' },
  { symbol: 'mol', name: 'mole', quantity: 'Amount of substance', color: '#fd79a8', example: 'One mole = 6.022 × 10²³ particles.', defines: 'exactly that many elementary entities (Avogadro’s number).' },
  { symbol: 'cd', name: 'candela', quantity: 'Luminous intensity', color: '#ffeaa7', example: 'Roughly the light of a single candle.', defines: 'a fixed luminous efficacy of green light.' },
]

// Physics measures everything against just seven agreed-upon yardsticks. Tap each
// to see what it measures, an everyday feel for its size, and how it's now defined
// — not by an object, but by a constant of nature.
export function UnitExplorer() {
  const [i, setI] = useState(0)
  const u = UNITS[i]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {UNITS.map((unit, idx) => (
          <button
            key={unit.symbol}
            type="button"
            onClick={() => setI(idx)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              i === idx ? 'border-transparent text-[#10151f]' : 'border-border text-muted hover:text-ink',
            )}
            style={i === idx ? { background: unit.color } : undefined}
          >
            {unit.symbol}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 px-4 pb-2">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl font-mono text-2xl font-bold"
          style={{ background: u.color + '22', color: u.color, border: `2px solid ${u.color}` }}
        >
          {u.symbol}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted">{u.quantity}</div>
          <div className="text-xl font-bold capitalize text-ink">{u.name}</div>
          <div className="text-sm text-muted">{u.example}</div>
        </div>
      </div>

      <p className="px-4 pb-4 pt-1 text-sm text-muted">
        <span className="font-semibold text-ink">1 {u.name}</span> is defined as {u.defines}
      </p>
    </div>
  )
}
