import { useState } from 'react'
import { makeScale } from '#/lib/math'

// A scatter graph reveals correlation between two variables. Drag the slider to
// move from strong negative through none to strong positive, and a line of best
// fit follows. Used in scatter-graphs-and-correlation.
const XS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const NOISE = [0.6, -0.8, 0.3, 0.9, -0.5, 0.7, -0.9, 0.4, -0.3, 0.5]

export function ScatterPlot() {
  const [corr, setCorr] = useState(0.7)
  const pts = XS.map((x, i) => ({
    x,
    y: 5.5 + corr * 0.9 * (x - 5.5) + NOISE[i] * 2.5 * (1 - Math.abs(corr)),
  }))

  const W = 300
  const H = 240
  const px = makeScale(0, 11, 30, W - 10)
  const py = makeScale(-1, 12, H - 24, 10)
  const word = Math.abs(corr) < 0.2 ? 'no correlation' : corr > 0 ? (corr > 0.7 ? 'strong positive' : 'weak positive') : corr < -0.7 ? 'strong negative' : 'weak negative'

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-xs">
        <line x1={px(0)} y1={py(0)} x2={px(11)} y2={py(0)} stroke="var(--color-muted)" strokeWidth="1.2" />
        <line x1={px(0)} y1={py(-1)} x2={px(0)} y2={py(12)} stroke="var(--color-muted)" strokeWidth="1.2" />
        {/* line of best fit */}
        {Math.abs(corr) >= 0.2 && (
          <line x1={px(0)} y1={py(5.5 + corr * 0.9 * (0 - 5.5))} x2={px(11)} y2={py(5.5 + corr * 0.9 * (11 - 5.5))} stroke="var(--color-accent-2)" strokeWidth="2" strokeDasharray="5 4" />
        )}
        {pts.map((p, i) => (
          <circle key={i} cx={px(p.x)} cy={py(p.y)} r="4.5" fill="var(--color-accent)" stroke="#fff" strokeWidth="1" />
        ))}
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">correlation</span>
          <input type="range" min={-1} max={1} step={0.1} value={corr} onChange={(e) => setCorr(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-10 text-right font-mono text-ink">{corr.toFixed(1)}</span>
        </label>
      </div>

      <p className="mt-2 text-center text-sm">
        <span className="font-semibold text-accent capitalize">{word}</span>
        <span className="text-muted"> — the line of best fit summarises the trend.</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        Correlation shows variables move together — but <strong>correlation is not causation</strong>; a hidden factor may drive both.
      </p>
    </div>
  )
}
