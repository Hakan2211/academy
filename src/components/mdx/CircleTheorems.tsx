import { useState } from 'react'

// Three circle theorems, live. Thales: the angle in a semicircle is a right
// angle. Centre vs circumference: the angle at the centre is twice the angle at
// the edge on the same arc. Cyclic quadrilateral: opposite angles sum to 180°.
// Used in circle-theorems.
const THMS = [
  { key: 'thales', label: 'Angle in semicircle' },
  { key: 'centre', label: 'Centre = 2 × edge' },
  { key: 'cyclic', label: 'Cyclic quadrilateral' },
]
const OX = 140
const OY = 95
const R = 72
const onC = (deg: number): [number, number] => [OX + R * Math.cos((deg * Math.PI) / 180), OY - R * Math.sin((deg * Math.PI) / 180)]
const angleBetween = (v: [number, number], a: [number, number], b: [number, number]) => {
  const u1 = [a[0] - v[0], a[1] - v[1]]
  const u2 = [b[0] - v[0], b[1] - v[1]]
  const dot = u1[0] * u2[0] + u1[1] * u2[1]
  const m = Math.hypot(u1[0], u1[1]) * Math.hypot(u2[0], u2[1])
  return Math.round((Math.acos(dot / m) * 180) / Math.PI)
}

export function CircleTheorems() {
  const [i, setI] = useState(0)
  const [pDeg, setPDeg] = useState(60)
  const key = THMS[i].key

  // Thales: A,B diameter ends; P on top
  const A = onC(180)
  const B = onC(0)
  const P = onC(Math.max(20, Math.min(160, pDeg)))
  // Centre theorem: A,B fixed lower; P upper
  const Ac = onC(210)
  const Bc = onC(330)
  const Pc = onC(Math.max(40, Math.min(140, pDeg)))
  const central = angleBetween([OX, OY], Ac, Bc)
  const edge = angleBetween(Pc, Ac, Bc)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {THMS.map((t, k) => (
          <button key={t.key} onClick={() => setI(k)} className={`rounded-lg border px-2.5 py-1 text-xs transition ${k === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>{t.label}</button>
        ))}
      </div>

      <svg viewBox="0 0 280 190" className="mx-auto w-full max-w-sm">
        <circle cx={OX} cy={OY} r={R} fill="none" stroke="var(--color-muted)" strokeWidth="1.5" />
        {key === 'thales' && (
          <>
            <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="var(--color-accent-2)" strokeWidth="2" />
            <polygon points={`${A[0]},${A[1]} ${P[0]},${P[1]} ${B[0]},${B[1]}`} fill="var(--color-accent)" fillOpacity="0.15" stroke="var(--color-accent)" strokeWidth="2" />
            <circle cx={OX} cy={OY} r="2.5" fill="var(--color-ink)" />
            <text x={P[0]} y={P[1] - 8} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-success)">90°</text>
          </>
        )}
        {key === 'centre' && (
          <>
            <polygon points={`${Ac[0]},${Ac[1]} ${OX},${OY} ${Bc[0]},${Bc[1]}`} fill="var(--color-accent-2)" fillOpacity="0.12" stroke="var(--color-accent-2)" strokeWidth="1.5" />
            <polygon points={`${Ac[0]},${Ac[1]} ${Pc[0]},${Pc[1]} ${Bc[0]},${Bc[1]}`} fill="var(--color-accent)" fillOpacity="0.12" stroke="var(--color-accent)" strokeWidth="1.5" />
            <text x={OX} y={OY + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-accent-2)">{central}°</text>
            <text x={Pc[0]} y={Pc[1] - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-accent)">{edge}°</text>
          </>
        )}
        {key === 'cyclic' && (
          <>
            <polygon points={`${onC(60)[0]},${onC(60)[1]} ${onC(160)[0]},${onC(160)[1]} ${onC(210)[0]},${onC(210)[1]} ${onC(330)[0]},${onC(330)[1]}`} fill="var(--color-accent)" fillOpacity="0.12" stroke="var(--color-accent)" strokeWidth="2" />
            <text x={onC(60)[0] + 4} y={onC(60)[1]} fontSize="11" fill="var(--color-accent)">a</text>
            <text x={onC(210)[0] - 4} y={onC(210)[1] + 8} fontSize="11" fill="var(--color-accent)">c</text>
          </>
        )}
      </svg>

      {(key === 'thales' || key === 'centre') && (
        <div className="px-1">
          <label className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted">move point P</span>
            <input type="range" min={key === 'thales' ? 20 : 40} max={key === 'thales' ? 160 : 140} value={pDeg} onChange={(e) => setPDeg(Number(e.target.value))} className="w-2/3 accent-accent" />
          </label>
        </div>
      )}

      <p className="mt-2 text-center text-sm text-muted">
        {key === 'thales' && 'Any point on the circle sees a diameter at exactly 90° — wherever P goes.'}
        {key === 'centre' && `Centre angle ${central}° = 2 × edge angle ${edge}° (same arc AB).`}
        {key === 'cyclic' && 'In a cyclic quadrilateral, opposite angles sum to 180°: a + c = 180° and b + d = 180°.'}
      </p>
    </div>
  )
}
