import { useState } from 'react'

// The pH scale runs 0 (most acidic) to 14 (most basic), with 7 neutral. It's a
// LOGARITHMIC measure of hydrogen-ion concentration — each step is a 10× change.
// Slide across it and watch the indicator colour and example substances.
const STOPS: Array<[number, string]> = [
  [0, '#C0392B'], [2, '#E74C3C'], [4, '#E67E22'], [6, '#F1C40F'],
  [7, '#2ECC71'], [8, '#1ABC9C'], [10, '#3498DB'], [12, '#5B4FD6'], [14, '#8E44AD'],
]
const EXAMPLES: Record<number, string> = {
  0: 'battery acid', 1: 'stomach acid', 2: 'lemon juice', 3: 'vinegar', 4: 'tomato juice',
  5: 'black coffee', 6: 'milk', 7: 'pure water', 8: 'seawater', 9: 'baking soda',
  10: 'hand soap', 11: 'ammonia', 12: 'soapy water', 13: 'bleach', 14: 'drain cleaner',
}

function colorAt(ph: number): string {
  let a = STOPS[0]
  let b = STOPS[STOPS.length - 1]
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (ph >= STOPS[i][0] && ph <= STOPS[i + 1][0]) {
      a = STOPS[i]
      b = STOPS[i + 1]
      break
    }
  }
  const t = (ph - a[0]) / Math.max(0.001, b[0] - a[0])
  const ca = a[1].match(/\w\w/g)!.map((h) => parseInt(h, 16))
  const cb = b[1].match(/\w\w/g)!.map((h) => parseInt(h, 16))
  const m = ca.map((v, i) => Math.round(v + (cb[i] - v) * t))
  return `rgb(${m[0]},${m[1]},${m[2]})`
}

export function PHScale() {
  const [ph, setPh] = useState(7)
  const label = ph < 7 ? 'Acidic' : ph > 7 ? 'Basic (alkaline)' : 'Neutral'
  const col = colorAt(ph)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* indicator beaker */}
      <div className="flex items-center justify-center gap-4">
        <svg viewBox="0 0 80 90" className="w-20">
          <path d="M 18 8 L 62 8 L 56 82 L 24 82 Z" fill={col} opacity={0.85} stroke="var(--color-muted)" strokeWidth={1.5} />
        </svg>
        <div className="text-center">
          <div className="text-4xl font-bold" style={{ color: col }}>{ph.toFixed(0)}</div>
          <div className="text-sm font-semibold text-ink">{label}</div>
          <div className="text-xs text-muted">≈ {EXAMPLES[Math.round(ph)]}</div>
        </div>
      </div>

      {/* the scale bar */}
      <div
        className="mt-3 h-4 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${STOPS.map(([p, c]) => `${c} ${(p / 14) * 100}%`).join(', ')})`,
        }}
      />
      <div className="mt-0.5 flex justify-between text-[10px] text-muted">
        <span>0 acid</span>
        <span>7 neutral</span>
        <span>14 base</span>
      </div>

      <p className="my-3 text-center text-sm text-muted">
        [H⁺] ≈ <span className="font-mono text-ink">10⁻{ph.toFixed(0)} mol/L</span>. Each pH step is a{' '}
        <span className="text-ink">10×</span> change in acidity — pH 3 is ten times more acidic than pH 4.
      </p>

      <input type="range" min={0} max={14} step={1} value={ph} onChange={(e) => setPh(Number(e.target.value))} className="w-full accent-accent" aria-label="pH" />
    </div>
  )
}
