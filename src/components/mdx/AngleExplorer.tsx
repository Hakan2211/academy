import { useState } from 'react'

// Rotate a ray and classify the angle it makes — acute, right, obtuse, straight,
// reflex. The companion angle back to 180° (angles on a straight line) is shown
// too. Used in lines-and-angles.
export function AngleExplorer() {
  const [a, setA] = useState(50)
  const cx = 150
  const cy = 130
  const R = 95
  const rad = (a * Math.PI) / 180
  const ex = cx + R * Math.cos(-rad)
  const ey = cy + R * Math.sin(-rad)
  // arc path for the angle
  const arcR = 34
  const ax = cx + arcR
  const ay = cy
  const aex = cx + arcR * Math.cos(-rad)
  const aey = cy + arcR * Math.sin(-rad)
  const largeArc = a > 180 ? 1 : 0

  const type =
    a < 90 ? 'acute' : a === 90 ? 'right angle' : a < 180 ? 'obtuse' : a === 180 ? 'straight' : 'reflex'

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 300 170" className="mx-auto w-full max-w-sm">
        {/* base ray */}
        <line x1={cx} y1={cy} x2={cx + R} y2={cy} stroke="var(--color-muted)" strokeWidth="2.5" />
        {/* rotating ray */}
        <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="var(--color-accent)" strokeWidth="2.5" />
        {/* angle arc */}
        <path d={`M ${ax} ${ay} A ${arcR} ${arcR} 0 ${largeArc} 0 ${aex} ${aey}`} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
        {a === 90 && <rect x={cx} y={cy - 14} width="14" height="14" fill="none" stroke="var(--color-accent)" strokeWidth="1.2" />}
        <circle cx={cx} cy={cy} r="3" fill="var(--color-ink)" />
        <text x={cx + 46} y={cy - 12} fontSize="13" fontWeight="700" fill="var(--color-accent)">{a}°</text>
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">angle</span>
          <input type="range" min={0} max={360} step={5} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-12 text-right font-mono text-ink">{a}°</span>
        </label>
      </div>

      <p className="mt-2 text-center text-sm">
        A <span className="font-semibold text-accent">{type}</span>
        {a < 180 && a > 0 && (
          <span className="text-muted"> — on a straight line it pairs with {180 - a}° to make 180°.</span>
        )}
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        Acute &lt; 90° &lt; obtuse &lt; 180° (straight) &lt; reflex. Angles around a point total 360°.
      </p>
    </div>
  )
}
