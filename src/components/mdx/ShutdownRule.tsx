import { useMemo, useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/econ'

// The shutdown rule. Even a loss-making firm should keep producing IN THE SHORT
// RUN as long as the price covers its average VARIABLE cost — every unit then
// chips in something toward the unavoidable fixed cost. But once price drops
// below the minimum of AVC, each unit loses money on its own variable cost, so
// the firm does better to halt output (it still owes the fixed cost either way).
// The minimum point of the AVC curve is the shutdown price.
const X0 = 50
const Y0 = 232
const PW = 290
const PH = 198
const QMIN = 1
const QMAX = 12

const A = 28
const B = 4
const C = 0.42
const vc = (q: number) => A * q - B * q * q + C * q * q * q
const avc = (q: number) => vc(q) / q
const mc = (q: number) => A - 2 * B * q + 3 * C * q * q

// minimum AVC over the range (= the shutdown price), sampled finely
let SHUTDOWN = Infinity
let QATMIN = QMIN
for (let i = 0; i <= 240; i++) {
  const qq = QMIN + (i / 240) * (QMAX - QMIN)
  const v = avc(qq)
  if (v < SHUTDOWN) { SHUTDOWN = v; QATMIN = qq }
}

const YMAX = Math.ceil(Math.max(mc(QMAX), avc(QMIN)) / 10) * 10

export function ShutdownRule() {
  const [price, setPrice] = useState(28)

  const sx = (x: number) => X0 + ((x - QMIN) / (QMAX - QMIN)) * PW
  const sy = (y: number) => Y0 - (clamp(y, 0, YMAX) / YMAX) * PH

  const paths = useMemo(() => {
    const N = 60
    let avcD = ''
    let mcD = ''
    for (let i = 0; i <= N; i++) {
      const x = QMIN + (i / N) * (QMAX - QMIN)
      avcD += `${i === 0 ? 'M' : 'L'}${sx(x).toFixed(1)} ${sy(avc(x)).toFixed(1)} `
      mcD += `${i === 0 ? 'M' : 'L'}${sx(x).toFixed(1)} ${sy(mc(x)).toFixed(1)} `
    }
    return { avcD, mcD }
  }, [])

  const produce = price >= SHUTDOWN

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 270" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ $ / unit</text>

        {/* shutdown line at min AVC */}
        <line x1={X0} y1={sy(SHUTDOWN)} x2={X0 + PW} y2={sy(SHUTDOWN)} stroke="var(--color-muted)" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
        <text x={X0 + PW} y={sy(SHUTDOWN) - 4} textAnchor="end" fontSize="10" fill="var(--color-muted)">shutdown price (min AVC ≈ {SHUTDOWN.toFixed(0)})</text>
        <circle cx={sx(QATMIN)} cy={sy(SHUTDOWN)} r="4" fill="var(--color-accent-2)" />

        {/* curves */}
        <path d={paths.avcD} fill="none" stroke="var(--color-accent-2)" strokeWidth="2.5" />
        <path d={paths.mcD} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />

        {/* the chosen price line */}
        <line x1={X0} y1={sy(price)} x2={X0 + PW} y2={sy(price)} stroke={produce ? 'var(--color-success)' : 'var(--color-accent)'} strokeWidth="3" />
        <text x={X0 + 4} y={sy(price) - 4} fontSize="10" fill={produce ? 'var(--color-success)' : 'var(--color-accent)'}>price = {price}</text>

        {/* labels */}
        <text x={sx(QMAX) + 2} y={clamp(sy(avc(QMAX)), 22, Y0)} fontSize="11" fill="var(--color-accent-2)">AVC</text>
        <text x={sx(QMAX) + 2} y={clamp(sy(mc(QMAX)), 22, Y0)} fontSize="11" fill="var(--color-accent)">MC</text>
      </svg>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Market price" value={price} min={12} max={50} step={1} unit="$" onChange={setPrice} />
        <div
          className={cn(
            'rounded-xl border px-3 py-2 text-center text-sm',
            produce ? 'border-success/50 text-success' : 'border-accent/50 text-accent',
          )}
        >
          {produce
            ? `Keep producing. Price (${price}) is at or above the shutdown price (≈${SHUTDOWN.toFixed(0)}), so each unit covers its variable cost and helps pay down the fixed cost.`
            : `Shut down. Price (${price}) is below minimum AVC (≈${SHUTDOWN.toFixed(0)}) — every unit would lose money on variable cost alone. Stop output and absorb only the fixed cost.`}
        </div>
      </div>
    </div>
  )
}
