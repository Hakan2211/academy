import { useState } from 'react'

// Interactive number line. Two modes:
//  - default: drag a single marker across [min,max] to read its value (great for
//    negatives and "where does this number live?").
//  - jumps:   a start value + a signed change, drawn as an arrow, showing how
//    addition moves right and subtraction moves left across zero.
// Reused across number-sense (and available to any world needing a line).
export function NumberLine({
  min = -10,
  max = 10,
  jumps = false,
}: {
  min?: number
  max?: number
  jumps?: boolean
}) {
  const [a, setA] = useState(jumps ? -3 : 0)
  const [b, setB] = useState(5)

  const W = 560
  const PAD = 28
  const x = (v: number) => PAD + ((v - min) / (max - min)) * (W - 2 * PAD)
  const ticks: Array<number> = []
  for (let t = min; t <= max; t++) ticks.push(t)

  const result = a + b
  const clampedResult = Math.max(min, Math.min(max, result))

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} 120`} className="w-full">
        {/* baseline */}
        <line x1={PAD} y1={70} x2={W - PAD} y2={70} stroke="var(--color-muted)" strokeWidth="2" />
        {/* arrowheads on the axis */}
        <polygon points={`${W - PAD},70 ${W - PAD - 8},66 ${W - PAD - 8},74`} fill="var(--color-muted)" />
        <polygon points={`${PAD},70 ${PAD + 8},66 ${PAD + 8},74`} fill="var(--color-muted)" />

        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={x(t)}
              y1={t === 0 ? 60 : 64}
              x2={x(t)}
              y2={t === 0 ? 80 : 76}
              stroke={t === 0 ? 'var(--color-ink)' : 'var(--color-border)'}
              strokeWidth={t === 0 ? 2 : 1}
            />
            {(max - min <= 20 || t % 5 === 0) && (
              <text x={x(t)} y={94} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
                {t}
              </text>
            )}
          </g>
        ))}

        {/* jump arrow */}
        {jumps && (
          <g>
            <path
              d={`M${x(a)} 44 Q ${(x(a) + x(clampedResult)) / 2} ${b >= 0 ? 18 : 70}, ${x(clampedResult)} 44`}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2.5"
            />
            <polygon
              points={`${x(clampedResult)},44 ${x(clampedResult) + (b >= 0 ? -7 : 7)},38 ${x(clampedResult) + (b >= 0 ? -7 : 7)},50`}
              fill="var(--color-accent)"
            />
            <text x={(x(a) + x(clampedResult)) / 2} y={b >= 0 ? 12 : 86} textAnchor="middle" fontSize="11" fill="var(--color-accent)" fontWeight="600">
              {b >= 0 ? `+${b}` : b}
            </text>
          </g>
        )}

        {/* markers */}
        <circle cx={x(a)} cy={70} r="6" fill="var(--color-accent-2)" stroke="#fff" strokeWidth="1.5" />
        {jumps && (
          <circle cx={x(clampedResult)} cy={70} r="6" fill="var(--color-accent)" stroke="#fff" strokeWidth="1.5" />
        )}
      </svg>

      <div className="space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">{jumps ? 'Start at' : 'Marker'}</span>
          <input type="range" min={min} max={max} step={1} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-10 text-right font-mono text-ink">{a}</span>
        </label>
        {jumps && (
          <label className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted">Change</span>
            <input type="range" min={-(max - min)} max={max - min} step={1} value={b} onChange={(e) => setB(Number(e.target.value))} className="w-2/3 accent-accent" />
            <span className="w-10 text-right font-mono text-ink">{b >= 0 ? `+${b}` : b}</span>
          </label>
        )}
      </div>

      {jumps && (
        <p className="mt-2 text-center text-sm">
          <span className="font-mono text-ink">
            {a} {b >= 0 ? '+ ' + b : '− ' + Math.abs(b)} = {result}
          </span>
          <span className="ml-2 text-muted">
            — {b >= 0 ? 'adding moves right' : 'subtracting moves left'}.
          </span>
        </p>
      )}
    </div>
  )
}
