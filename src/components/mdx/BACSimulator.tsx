import { useMemo, useState } from 'react'
import { widmarkBAC, clamp } from '#/lib/health'
import { cn } from '#/lib/cn'

// Blood-alcohol concentration estimator using the Widmark formula.
// Educational only — not suitable for making decisions about driving or safety.

type Band = {
  label: string
  range: [number, number]
  color: string
  desc: string
}

const BANDS: Band[] = [
  { label: 'Minimal effect',        range: [0,     0.02], color: '#00b894', desc: 'Most people feel little to nothing. The body is already clearing it.' },
  { label: 'Mild relaxation',       range: [0.02,  0.05], color: '#55efc4', desc: 'Slight warmth, reduced inhibition. Driving is already impaired even at this level.' },
  { label: 'Impaired (legal risk)', range: [0.05,  0.08], color: '#fdcb6e', desc: 'Coordination, reaction time, and judgment are clearly affected. At or above legal limits in many countries.' },
  { label: 'Clearly intoxicated',   range: [0.08,  0.15], color: '#e17055', desc: 'Slurred speech, poor balance, marked impairment. High risk of injury.' },
  { label: 'Dangerously high',      range: [0.15,  0.25], color: '#d63031', desc: 'Nausea, vomiting, disorientation, possible blackout. Serious medical risk.' },
  { label: 'Life-threatening',      range: [0.25,  0.50], color: '#6c2121', desc: 'Loss of consciousness, suppressed breathing, coma. Call emergency services immediately.' },
]

function bandFor(bac: number): Band {
  return BANDS.find(b => bac >= b.range[0] && bac < b.range[1]) ?? BANDS[BANDS.length - 1]
}

function GaugeFill({ bac }: { bac: number }) {
  const pct = clamp(bac / 0.30, 0, 1)
  const angle = pct * 180
  const band = bandFor(bac)
  const r = 60
  const originX = 80
  const originY = 80
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const endAngle = 180 + angle
  const x2 = originX + r * Math.cos(toRad(endAngle))
  const y2 = originY + r * Math.sin(toRad(endAngle))
  const largeArc = angle > 180 ? 1 : 0

  return (
    <svg viewBox="0 0 160 90" className="w-40 mx-auto">
      <path d="M20 80 A60 60 0 0 1 140 80"
        fill="none" stroke="var(--color-border)" strokeWidth={12} strokeLinecap="round" />
      {bac > 0.001 && (
        <path d={`M20 80 A${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`}
          fill="none" stroke={band.color} strokeWidth={12} strokeLinecap="round" />
      )}
      <text x="80" y="74" textAnchor="middle" fontSize={18} fontWeight={700}
        className="fill-ink">{bac.toFixed(3)}</text>
      <text x="80" y="85" textAnchor="middle" fontSize={7} className="fill-muted">BAC %</text>
      <text x="18" y="88" textAnchor="middle" fontSize={6} className="fill-muted">0.00</text>
      <text x="142" y="88" textAnchor="middle" fontSize={6} className="fill-muted">0.30+</text>
    </svg>
  )
}

type SliderRowProps = {
  label: string
  value: number
  min: number
  max: number
  step: number
  display: string
  onChange: (v: number) => void
}

function SliderRow({ label, value, min, max, step, display, onChange }: SliderRowProps) {
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span className="font-semibold text-ink">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-accent" />
    </div>
  )
}

export function BACSimulator() {
  const [drinks, setDrinks] = useState(2)
  const [kg, setKg] = useState(70)
  const [hours, setHours] = useState(1)
  const [female, setFemale] = useState(false)

  const r = female ? 0.55 : 0.68
  const bac = useMemo(() => widmarkBAC(drinks, kg, hours, r), [drinks, kg, hours, r])
  const band = bandFor(bac)

  const clearTime = useMemo(() => {
    const rawBAC = (drinks * 14 / (kg * 1000 * r)) * 100
    return Math.ceil(rawBAC / 0.015)
  }, [drinks, kg, r])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4 space-y-5">
      <div>
        <p className="text-sm font-semibold text-ink">BAC Estimator — Widmark Formula</p>
        <p className="text-xs text-muted mt-0.5">
          One standard drink ≈ 14 g of pure alcohol (a small glass of wine,
          a regular beer, or a single shot). This is an <em>educational approximation</em> —
          many factors affect real BAC.
        </p>
      </div>

      <GaugeFill bac={bac} />

      <div className="rounded-xl border p-3 text-sm transition-colors"
        style={{ borderColor: band.color + '66', backgroundColor: band.color + '11' }}>
        <p className="font-semibold" style={{ color: band.color }}>{band.label}</p>
        <p className="mt-0.5 text-xs text-muted">{band.desc}</p>
      </div>

      <div className="space-y-3">
        <SliderRow label="Standard drinks" value={drinks} min={0} max={10} step={0.5}
          display={`${drinks.toFixed(1)} drinks`} onChange={setDrinks} />
        <SliderRow label="Body weight" value={kg} min={40} max={140} step={1}
          display={`${kg} kg`} onChange={setKg} />
        <SliderRow label="Hours since first drink" value={hours} min={0} max={8} step={0.25}
          display={`${hours.toFixed(2)} h`} onChange={setHours} />
      </div>

      <div className="flex gap-2">
        {([false, true] as const).map(isFemale => (
          <button key={String(isFemale)} type="button"
            onClick={() => setFemale(isFemale)}
            className={cn(
              'flex-1 rounded-xl border py-1.5 text-xs font-medium transition-colors',
              female === isFemale
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}>
            {isFemale ? 'Female (r ≈ 0.55)' : 'Male (r ≈ 0.68)'}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted space-y-1">
        <p>
          <span className="font-medium text-ink">The liver clears ~0.015% BAC/hour</span> — roughly
          one standard drink per hour. There is no way to speed this up: coffee, water,
          food, or cold showers do not accelerate alcohol metabolism.
        </p>
        <p>
          At your current intake, full clearance from zero would take approximately{' '}
          <span className="font-semibold text-ink">{clearTime} hour{clearTime !== 1 ? 's' : ''}</span>.
        </p>
      </div>
    </div>
  )
}
