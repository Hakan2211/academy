import { useState } from 'react'

// Pythagoras as areas: the square on the hypotenuse equals the sum of the
// squares on the two legs. a² + b² = c², shown literally as squares. Used in
// pythagoras and trigonometry-in-3d.
export function PythagorasViz() {
  const [a, setA] = useState(3)
  const [b, setB] = useState(4)
  const c = Math.sqrt(a * a + b * b)
  const u = 13
  const ox = 120
  const oy = 150 // right-angle vertex
  const P1: [number, number] = [ox + a * u, oy] // along +x
  const P2: [number, number] = [ox, oy - b * u] // along −y (up)
  // hypotenuse square, outward (up-right)
  const vx = P2[0] - P1[0]
  const vy = P2[1] - P1[1]
  const nx = -vy
  const ny = vx
  const hsq = `${P1[0]},${P1[1]} ${P1[0] + nx},${P1[1] + ny} ${P2[0] + nx},${P2[1] + ny} ${P2[0]},${P2[1]}`

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 300 270" className="mx-auto w-full max-w-sm">
        {/* square on bottom leg a */}
        <rect x={ox} y={oy} width={a * u} height={a * u} fill="var(--color-accent)" fillOpacity="0.18" stroke="var(--color-accent)" strokeWidth="1.2" />
        <text x={ox + (a * u) / 2} y={oy + (a * u) / 2 + 4} textAnchor="middle" fontSize="11" fill="var(--color-accent)">a²={a * a}</text>
        {/* square on left leg b */}
        <rect x={ox - b * u} y={oy - b * u} width={b * u} height={b * u} fill="var(--color-accent-2)" fillOpacity="0.18" stroke="var(--color-accent-2)" strokeWidth="1.2" />
        <text x={ox - (b * u) / 2} y={oy - (b * u) / 2 + 4} textAnchor="middle" fontSize="11" fill="var(--color-accent-2)">b²={b * b}</text>
        {/* hypotenuse square */}
        <polygon points={hsq} fill="var(--color-success)" fillOpacity="0.18" stroke="var(--color-success)" strokeWidth="1.2" />
        <text x={(P1[0] + P2[0] + nx) / 2} y={(P1[1] + P2[1] + ny) / 2 + 4} textAnchor="middle" fontSize="11" fill="var(--color-success)">c²={+(c * c).toFixed(0)}</text>
        {/* triangle */}
        <polygon points={`${ox},${oy} ${P1[0]},${P1[1]} ${P2[0]},${P2[1]}`} fill="none" stroke="var(--color-ink)" strokeWidth="2" />
        <rect x={ox} y={oy - 10} width="10" height="10" fill="none" stroke="var(--color-ink)" strokeWidth="1" />
      </svg>

      <div className="space-y-2 px-1">
        <label className="flex items-center justify-between gap-3 text-sm"><span className="text-accent">leg a</span><input type="range" min={2} max={6} value={a} onChange={(e) => setA(Number(e.target.value))} className="w-2/3 accent-accent" /><span className="w-6 text-right font-mono text-ink">{a}</span></label>
        <label className="flex items-center justify-between gap-3 text-sm"><span className="text-accent-2">leg b</span><input type="range" min={2} max={6} value={b} onChange={(e) => setB(Number(e.target.value))} className="w-2/3 accent-accent" /><span className="w-6 text-right font-mono text-ink">{b}</span></label>
      </div>

      <p className="mt-2 text-center font-mono text-sm">
        {a * a} + {b * b} = <span className="font-bold text-success">{+(c * c).toFixed(0)}</span>, so c = √{+(c * c).toFixed(0)} = {+c.toFixed(2)}
      </p>
    </div>
  )
}
