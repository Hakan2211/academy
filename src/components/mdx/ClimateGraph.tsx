// Two lines that track each other: as atmospheric CO₂ has risen since the
// industrial revolution, so has global temperature. The greenhouse effect ties
// them together.
const X0 = 40
const X1 = 308
const Y0 = 18
const Y1 = 130

// 1880 → 2020 sampled. co2 in ppm (~285 → ~415); temp anomaly °C (~ -0.2 → ~1.0)
const CO2 = [285, 296, 300, 311, 325, 339, 354, 369, 390, 415]
const TEMP = [-0.2, -0.15, -0.1, 0.0, -0.05, 0.05, 0.15, 0.35, 0.6, 1.0]

const co2Y = (v: number) => Y1 - ((v - 280) / 140) * (Y1 - Y0)
const tempY = (v: number) => Y1 - ((v + 0.3) / 1.4) * (Y1 - Y0)
const xAt = (i: number) => X0 + (i / (CO2.length - 1)) * (X1 - X0)

export function ClimateGraph() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 320 150" className="w-full">
        <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke="var(--color-border)" strokeWidth={1} />
        <line x1={X0} y1={Y1} x2={X1} y2={Y1} stroke="var(--color-border)" strokeWidth={1} />
        <text x={36} y={14} textAnchor="end" className="fill-[#94a3b8] text-[8px]">CO₂</text>
        <text x={X1} y={14} textAnchor="end" className="fill-[#E74C3C] text-[8px]">temp</text>

        <polyline points={CO2.map((v, i) => `${xAt(i).toFixed(1)},${co2Y(v).toFixed(1)}`).join(' ')} fill="none" stroke="#94a3b8" strokeWidth={2.5} />
        <polyline points={TEMP.map((v, i) => `${xAt(i).toFixed(1)},${tempY(v).toFixed(1)}`).join(' ')} fill="none" stroke="#E74C3C" strokeWidth={2.5} />

        <text x={X0} y={146} className="fill-muted text-[8px]">1880</text>
        <text x={X1} y={146} textAnchor="end" className="fill-muted text-[8px]">2020</text>
      </svg>

      <div className="mt-1 flex justify-center gap-4 text-[11px]">
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-4 rounded bg-[#94a3b8]" /> CO₂ (ppm)</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-4 rounded bg-[#E74C3C]" /> global temperature</span>
      </div>
      <p className="mt-2 text-center text-sm text-muted">
        Since the industrial revolution, atmospheric CO₂ has climbed from ~285 to over 415 ppm — and global temperature has risen with it. Extra CO₂ traps more heat: the greenhouse effect.
      </p>
    </div>
  )
}
