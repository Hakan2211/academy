import { useState } from 'react'

// Colligative properties depend on the NUMBER of dissolved particles, not what
// they are. Dissolving a solute raises the boiling point and lowers the
// freezing point of a liquid. Add solute and watch both points spread apart.
export function Colligative() {
  const [amount, setAmount] = useState(1) // "molality" proxy, 0–3

  const bp = 100 + amount * 2.5 // elevation
  const fp = 0 - amount * 4.5 // depression

  // map a temperature to an x position on a -30..120 scale
  const scaleX = (temp: number) => 30 + ((temp + 30) / 150) * 240

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 300 120" className="w-full">
        {/* temperature axis */}
        <line x1={30} y1={70} x2={290} y2={70} stroke="var(--color-border)" strokeWidth={2} />
        {[-30, 0, 30, 60, 90, 120].map((tk) => (
          <g key={tk}>
            <line x1={scaleX(tk)} y1={66} x2={scaleX(tk)} y2={74} stroke="var(--color-muted)" strokeWidth={1} />
            <text x={scaleX(tk)} y={88} textAnchor="middle" className="fill-muted text-[8px]">{tk}°</text>
          </g>
        ))}

        {/* pure water reference markers (0 and 100) */}
        <line x1={scaleX(0)} y1={40} x2={scaleX(0)} y2={70} stroke="var(--color-muted)" strokeWidth={1} strokeDasharray="2 2" />
        <line x1={scaleX(100)} y1={40} x2={scaleX(100)} y2={70} stroke="var(--color-muted)" strokeWidth={1} strokeDasharray="2 2" />

        {/* solution freezing point (blue) and boiling point (red) */}
        <line x1={scaleX(fp)} y1={30} x2={scaleX(fp)} y2={70} stroke="#5DADE2" strokeWidth={2.5} />
        <circle cx={scaleX(fp)} cy={30} r={5} fill="#5DADE2" />
        <text x={scaleX(fp)} y={22} textAnchor="middle" className="fill-[#5DADE2] text-[9px] font-semibold">freeze {fp.toFixed(1)}°</text>

        <line x1={scaleX(bp)} y1={30} x2={scaleX(bp)} y2={70} stroke="#E74C3C" strokeWidth={2.5} />
        <circle cx={scaleX(bp)} cy={30} r={5} fill="#E74C3C" />
        <text x={scaleX(bp)} y={22} textAnchor="middle" className="fill-[#E74C3C] text-[9px] font-semibold">boil {bp.toFixed(1)}°</text>

        {/* the widened liquid range */}
        <rect x={scaleX(fp)} y={62} width={scaleX(bp) - scaleX(fp)} height={6} fill="#2ECC71" opacity={0.3} />
      </svg>

      <p className="my-2 text-center text-sm text-muted">
        Pure water freezes at 0° and boils at 100° (dashed). Adding solute lowers the freezing point and raises the boiling point — widening the liquid range.
      </p>

      <label className="flex flex-col gap-1 text-sm">
        <span className="flex items-center justify-between text-muted">
          <span>Amount of dissolved solute</span>
          <span className="font-mono text-ink">{amount.toFixed(1)}×</span>
        </span>
        <input type="range" min={0} max={3} step={0.1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="accent-accent" />
      </label>
      <p className="mt-2 text-center text-xs text-muted">
        It's why salt de-ices roads (lower freezing point) and antifreeze protects an engine in both winter and summer.
      </p>
    </div>
  )
}
