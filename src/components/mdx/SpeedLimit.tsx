import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

const X0 = 60
const X1 = 360
const YB = 200
const YT = 30
const GMAX = 8

const px = (b: number) => X0 + b * (X1 - X0)
const py = (g: number) => YB - ((Math.min(g, GMAX) - 1) / (GMAX - 1)) * (YB - YT)

// As an object speeds up, its energy doesn't just grow — it runs away to infinity
// as v approaches c. The same factor γ that stretches time and shrinks length also
// multiplies an object's energy. Reaching c would take infinite energy, so nothing
// with mass ever can. c isn't just light's speed; it's the universe's speed limit.
export function SpeedLimit() {
  const [beta, setBeta] = useState(0.5)
  const gamma = 1 / Math.sqrt(1 - beta * beta)

  let curve = ''
  for (let i = 0; i <= 120; i++) {
    const b = (i / 120) * 0.985
    const g = 1 / Math.sqrt(1 - b * b)
    curve += `${i === 0 ? 'M' : 'L'}${px(b).toFixed(1)},${py(g).toFixed(1)} `
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 400 248" className="w-full">
        {/* axes */}
        <line x1={X0} y1={YT} x2={X0} y2={YB} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={X0} y1={YB} x2={X1 + 10} y2={YB} stroke="var(--color-border)" strokeWidth="1.5" />
        {/* c asymptote */}
        <line x1={X1} y1={YT} x2={X1} y2={YB} stroke="#e17055" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x={X1} y={YT - 6} fill="#e17055" fontSize="11" textAnchor="middle">v = c</text>

        {/* y labels */}
        <text x={X0 - 6} y={py(1) + 4} fill="var(--color-muted)" fontSize="9" textAnchor="end">1×</text>
        <text x={X0 - 6} y={py(4) + 4} fill="var(--color-muted)" fontSize="9" textAnchor="end">4×</text>
        <text x={X0 - 6} y={py(8) + 4} fill="var(--color-muted)" fontSize="9" textAnchor="end">8×</text>
        <text x="30" y="130" fill="var(--color-muted)" fontSize="10" transform="rotate(-90 30 130)" textAnchor="middle">energy (× rest energy)</text>
        <text x={(X0 + X1) / 2} y={YB + 22} fill="var(--color-muted)" fontSize="10" textAnchor="middle">speed (fraction of c)</text>

        {/* γ curve */}
        <path d={curve.trim()} fill="none" stroke="var(--color-accent-2)" strokeWidth="2.5" />
        {/* marker */}
        <circle cx={px(beta)} cy={py(gamma)} r="5" fill="var(--color-accent)" />
        <line x1={px(beta)} y1={YB} x2={px(beta)} y2={py(gamma)} stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="2 3" />
      </svg>

      <div className="px-4 pt-2">
        <SceneSlider label="Speed" value={beta} min={0} max={0.99} step={0.01} unit="c" onChange={setBeta} />
        <p className="mt-2 pb-4 text-center text-xs text-muted">
          γ = {gamma.toFixed(2)} → total energy is {gamma.toFixed(2)}× the rest energy mc². At rest (v = 0) that leaves just E = mc²; push toward c and the curve climbs without limit.
        </p>
      </div>
    </div>
  )
}
