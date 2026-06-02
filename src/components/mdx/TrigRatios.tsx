import { useState } from 'react'

// SOHCAHTOA on a live right triangle. Change the angle and the opposite/adjacent
// sides change, but sin, cos, tan stay fixed ratios for that angle. Used in
// sine-cosine-tangent and finding-sides-and-angles.
export function TrigRatios() {
  const [deg, setDeg] = useState(35)
  const rad = (deg * Math.PI) / 180
  const hyp = 9 // fixed hypotenuse (units)
  const opp = hyp * Math.sin(rad)
  const adj = hyp * Math.cos(rad)
  const u = 16
  const ox = 40
  const oy = 150
  const adjEnd: [number, number] = [ox + adj * u, oy]
  const top: [number, number] = [ox + adj * u, oy - opp * u]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 240 180" className="mx-auto w-full max-w-sm">
        <polygon points={`${ox},${oy} ${adjEnd[0]},${adjEnd[1]} ${top[0]},${top[1]}`} fill="var(--color-accent)" fillOpacity="0.12" stroke="var(--color-accent)" strokeWidth="2" />
        <rect x={adjEnd[0] - 10} y={adjEnd[1] - 10} width="10" height="10" fill="none" stroke="var(--color-ink)" strokeWidth="1" />
        <text x={ox + 18} y={oy - 6} fontSize="11" fill="var(--color-accent)">{deg}°</text>
        <text x={(ox + adjEnd[0]) / 2} y={oy + 14} textAnchor="middle" fontSize="9" fill="var(--color-muted)">adjacent</text>
        <text x={adjEnd[0] + 6} y={(adjEnd[1] + top[1]) / 2} fontSize="9" fill="var(--color-muted)">opposite</text>
        <text x={(ox + top[0]) / 2 - 14} y={(oy + top[1]) / 2 - 4} fontSize="9" fill="var(--color-muted)">hyp</text>
      </svg>

      <div className="px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">angle θ</span>
          <input type="range" min={10} max={80} value={deg} onChange={(e) => setDeg(Number(e.target.value))} className="w-2/3 accent-accent" />
          <span className="w-12 text-right font-mono text-ink">{deg}°</span>
        </label>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg border border-border p-1.5"><div className="text-muted">sin = O/H</div><div className="font-mono text-accent">{Math.sin(rad).toFixed(3)}</div></div>
        <div className="rounded-lg border border-border p-1.5"><div className="text-muted">cos = A/H</div><div className="font-mono text-accent">{Math.cos(rad).toFixed(3)}</div></div>
        <div className="rounded-lg border border-border p-1.5"><div className="text-muted">tan = O/A</div><div className="font-mono text-accent">{Math.tan(rad).toFixed(3)}</div></div>
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        <strong>SOH-CAH-TOA</strong>: each ratio depends only on the angle, not the triangle's size.
      </p>
    </div>
  )
}
