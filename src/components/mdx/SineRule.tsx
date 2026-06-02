import { useState } from 'react'

// The sine rule for non-right triangles: each side over the sine of its opposite
// angle gives the same constant. Adjust two angles and see a/sinA = b/sinB =
// c/sinC hold. Used in the-sine-rule.
export function SineRule() {
  const [A, setAa] = useState(50)
  const [B, setBb] = useState(60)
  const C = 180 - A - B
  // fix side c (between A and B) at length 6; place A at origin, B to the right
  const c = 6
  const rA = (A * Math.PI) / 180
  const rB = (B * Math.PI) / 180
  const rC = (C * Math.PI) / 180
  const k = c / Math.sin(rC) // common ratio
  const a = k * Math.sin(rA)
  const b = k * Math.sin(rB)

  const u = 26
  const ax: [number, number] = [30, 150]
  const bx: [number, number] = [30 + c * u, 150]
  // apex C: from A at angle A above base, from B at angle B above base
  const cxp = ax[0] + b * u * Math.cos(rA)
  const cyp = ax[1] - b * u * Math.sin(rA)

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 260 175" className="mx-auto w-full max-w-sm">
        <polygon points={`${ax[0]},${ax[1]} ${bx[0]},${bx[1]} ${cxp},${cyp}`} fill="var(--color-accent)" fillOpacity="0.12" stroke="var(--color-accent)" strokeWidth="2" />
        <text x={ax[0] + 4} y={ax[1] - 6} fontSize="11" fill="var(--color-accent)">A {A}°</text>
        <text x={bx[0] - 28} y={bx[1] - 6} fontSize="11" fill="var(--color-accent)">B {B}°</text>
        <text x={cxp - 6} y={cyp - 8} fontSize="11" fontWeight="700" fill="var(--color-success)">C {C}°</text>
      </svg>

      <div className="space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm"><span className="text-muted">angle A</span><input type="range" min={20} max={100} value={A} onChange={(e) => setAa(Number(e.target.value))} className="w-1/2 accent-accent" /><span className="w-10 text-right font-mono text-ink">{A}°</span></label>
        <label className="flex items-center justify-between gap-3 text-sm"><span className="text-muted">angle B</span><input type="range" min={20} max={Math.max(21, 150 - A)} value={B} onChange={(e) => setBb(Number(e.target.value))} className="w-1/2 accent-accent" /><span className="w-10 text-right font-mono text-ink">{B}°</span></label>
      </div>

      <p className="mt-2 text-center font-mono text-xs">
        a/sinA = <span className="text-accent">{(a / Math.sin(rA)).toFixed(2)}</span> · b/sinB = <span className="text-accent">{(b / Math.sin(rB)).toFixed(2)}</span> · c/sinC = <span className="text-accent">{(c / Math.sin(rC)).toFixed(2)}</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        All three equal — that's the sine rule: <span className="font-mono">a/sin A = b/sin B = c/sin C</span>. Use it when you know an angle and its opposite side.
      </p>
    </div>
  )
}
