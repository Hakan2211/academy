// A box-and-whisker plot from the five-number summary: minimum, lower quartile,
// median, upper quartile, maximum. The box holds the middle half of the data
// (the interquartile range). Used in cumulative-frequency-and-quartiles.
const DATA = [4, 7, 8, 11, 12, 14, 15, 18, 21, 25]

function quartile(sorted: Array<number>, q: number) {
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  return sorted[base] + (sorted[base + 1] !== undefined ? rest * (sorted[base + 1] - sorted[base]) : 0)
}

export function BoxPlot() {
  const sorted = [...DATA].sort((a, b) => a - b)
  const min = sorted[0]
  const max = sorted[sorted.length - 1]
  const q1 = quartile(sorted, 0.25)
  const med = quartile(sorted, 0.5)
  const q3 = quartile(sorted, 0.75)
  const iqr = q3 - q1

  const W = 540
  const PAD = 30
  const lo = 0
  const hi = 30
  const x = (v: number) => PAD + ((v - lo) / (hi - lo)) * (W - 2 * PAD)
  const cy = 50

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} 100`} className="w-full">
        {/* whiskers */}
        <line x1={x(min)} y1={cy} x2={x(q1)} y2={cy} stroke="var(--color-muted)" strokeWidth="2" />
        <line x1={x(q3)} y1={cy} x2={x(max)} y2={cy} stroke="var(--color-muted)" strokeWidth="2" />
        <line x1={x(min)} y1={cy - 12} x2={x(min)} y2={cy + 12} stroke="var(--color-muted)" strokeWidth="2" />
        <line x1={x(max)} y1={cy - 12} x2={x(max)} y2={cy + 12} stroke="var(--color-muted)" strokeWidth="2" />
        {/* box */}
        <rect x={x(q1)} y={cy - 18} width={x(q3) - x(q1)} height={36} fill="var(--color-accent)" fillOpacity="0.15" stroke="var(--color-accent)" strokeWidth="2" />
        {/* median */}
        <line x1={x(med)} y1={cy - 18} x2={x(med)} y2={cy + 18} stroke="var(--color-success)" strokeWidth="2.5" />
        {/* labels */}
        {[['min', min], ['Q1', q1], ['med', med], ['Q3', q3], ['max', max]].map(([lab, v]) => (
          <text key={lab as string} x={x(v as number)} y={cy + 34} textAnchor="middle" fontSize="9" fill="var(--color-muted)">{v as number}</text>
        ))}
        {[0, 5, 10, 15, 20, 25, 30].map((t) => (
          <text key={t} x={x(t)} y={92} textAnchor="middle" fontSize="8" fill="var(--color-border)">{t}</text>
        ))}
      </svg>

      <p className="mt-1 text-center text-sm">
        Five-number summary: <span className="font-mono text-ink">{min}, {q1}, {med}, {q3}, {max}</span> · <span className="text-muted">IQR = Q3 − Q1 = {iqr}</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        The box spans the middle 50% (the interquartile range); the line inside is the median. Box plots make distributions easy to compare.
      </p>
    </div>
  )
}
