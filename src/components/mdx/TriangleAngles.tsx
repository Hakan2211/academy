import { useState } from 'react'

// The angles of any triangle sum to 180°. Set two; the third is forced. The
// triangle redraws and classifies itself. Used in triangles.
export function TriangleAngles() {
  const [a, setA] = useState(60)
  const [b, setB] = useState(60)
  const bb = Math.min(b, 170 - a)
  const c = 180 - a - bb

  // place triangle: base from A(40,150) to B(220,150); apex C found from angles a (at A) and b (at B)
  const ax = 40
  const ay = 150
  const bx = 220
  const by = 150
  const ar = (a * Math.PI) / 180
  const br = (bb * Math.PI) / 180
  // intersection of ray from A at angle a (up-right) and from B at angle b (up-left)
  const baseLen = bx - ax
  // using law of sines for apex position
  const sinC = Math.sin(Math.PI - ar - br) || 1
  const ac = (baseLen * Math.sin(br)) / sinC
  const cxp = ax + ac * Math.cos(ar)
  const cyp = ay - ac * Math.sin(ar)

  const angleType = c === 90 || a === 90 || bb === 90 ? 'right' : a > 90 || bb > 90 || c > 90 ? 'obtuse' : 'acute'
  const sideType = a === bb && bb === c ? 'equilateral' : a === bb || bb === c || a === c ? 'isosceles' : 'scalene'

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 260 180" className="mx-auto w-full max-w-sm">
        <polygon points={`${ax},${ay} ${bx},${by} ${cxp},${cyp}`} fill="var(--color-accent)" fillOpacity="0.15" stroke="var(--color-accent)" strokeWidth="2" />
        <text x={ax + 14} y={ay - 6} fontSize="12" fill="var(--color-accent)">{a}°</text>
        <text x={bx - 22} y={by - 6} fontSize="12" fill="var(--color-accent)">{bb}°</text>
        <text x={cxp - 8} y={cyp + (cyp < 40 ? 18 : -8)} fontSize="12" fontWeight="700" fill="var(--color-success)">{c}°</text>
      </svg>

      <div className="space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">angle A</span>
          <input type="range" min={20} max={120} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-10 text-right font-mono text-ink">{a}°</span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">angle B</span>
          <input type="range" min={20} max={120} value={bb} onChange={(e) => setB(Number(e.target.value))} className="w-1/2 accent-accent" />
          <span className="w-10 text-right font-mono text-ink">{bb}°</span>
        </label>
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        {a}° + {bb}° + {c}° = <span className="font-bold text-success">180°</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        This is an <span className="text-accent">{angleType}</span>, <span className="text-accent">{sideType}</span> triangle. The third angle is never free — it's whatever makes 180°.
      </p>
    </div>
  )
}
