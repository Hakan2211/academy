import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { Formula } from '#/components/mdx/Formula'
import { round } from '#/lib/econ'

// The equation of exchange: M·V = P·Q. M is the money supply, V the velocity
// (how many times each dollar is spent per year), P the price level, Q real
// output (the actual goods and services). It is an identity — total spending
// (left) must equal the value of everything bought (right). The quantity theory
// adds an assumption: in the long run real output Q is fixed by an economy's
// resources and technology, NOT by how much money is printed. So if M·V rises
// while Q stays put, the only thing that can give is P — prices. Print money far
// faster than the economy can grow and you get inflation: too much money chasing
// too few goods. Hold Q fixed and slide M and V to watch P move with them.
const Q = 100 // real output, held fixed (the theory's key assumption)

// baseline so P starts at a clean 1.0 index
const M0 = 100
const V0 = 4

const VW = 360
const H = 150
const Y0 = 118
const BAR_W = 70

export function QuantityTheory() {
  const [m, setM] = useState(M0)
  const [v, setV] = useState(V0)

  const spending = m * v // M·V = total spending = P·Q
  const p = spending / Q // the price level falls out
  const pBase = (M0 * V0) / Q
  const pIndex = p / pBase // 1.0 at baseline
  const inflation = (pIndex - 1) * 100

  // bar heights (scale so baseline reaches a comfortable height)
  const maxSpend = (M0 * 4) * (V0 * 2)
  const h = (val: number) => Math.min(Y0 - 16, (val / maxSpend) * (Y0 - 16) * 6)
  const mvH = h(spending)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="px-4 pt-4">
        <Formula tex="M \cdot V = P \cdot Q" block />
      </div>

      <svg viewBox={`0 0 ${VW} ${H}`} className="w-full">
        <line x1={20} y1={Y0} x2={VW - 20} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />

        {/* left side: M · V (total spending) */}
        <rect x={VW / 2 - BAR_W - 40} y={Y0 - mvH} width={BAR_W} height={mvH} rx="3" fill="var(--color-accent)" />
        <text x={VW / 2 - BAR_W - 40 + BAR_W / 2} y={Y0 - mvH - 6} textAnchor="middle" fontSize="11" fill="var(--color-accent)">M · V</text>
        <text x={VW / 2 - BAR_W - 40 + BAR_W / 2} y={Y0 + 14} textAnchor="middle" fontSize="9" fill="var(--color-muted)">total spending</text>

        <text x={VW / 2} y={Y0 - 34} textAnchor="middle" fontSize="18" fill="var(--color-ink)">=</text>

        {/* right side: P · Q (value of output) — same height, split into P (price) and Q (fixed) */}
        <rect x={VW / 2 + 40} y={Y0 - mvH} width={BAR_W} height={mvH} rx="3" fill="var(--color-accent-2)" />
        <text x={VW / 2 + 40 + BAR_W / 2} y={Y0 - mvH - 6} textAnchor="middle" fontSize="11" fill="var(--color-accent-2)">P · Q</text>
        <text x={VW / 2 + 40 + BAR_W / 2} y={Y0 + 14} textAnchor="middle" fontSize="9" fill="var(--color-muted)">value of output</text>
      </svg>

      <div className="grid grid-cols-4 gap-1 px-4 text-center text-sm">
        <div><div className="font-mono text-ink">{round(m)}</div><div className="text-xs text-muted">M money</div></div>
        <div><div className="font-mono text-ink">{round(v, 1)}</div><div className="text-xs text-muted">V velocity</div></div>
        <div><div className="font-mono text-muted">{Q}</div><div className="text-xs text-muted">Q output (fixed)</div></div>
        <div><div className="font-mono text-accent-2">{round(pIndex, 2)}</div><div className="text-xs text-muted">P price level</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Money supply (M)" value={m} min={50} max={400} step={5} unit="" onChange={setM} />
        <SceneSlider label="Velocity of money (V)" value={v} min={2} max={8} step={0.5} unit="" onChange={setV} />
        <div className="rounded-xl border border-accent-2/50 px-3 py-2 text-center text-sm text-accent-2">
          {Math.abs(inflation) < 0.5
            ? 'Prices steady — total spending matches the value of output at the base price level.'
            : inflation > 0
              ? `Price level up ${inflation.toFixed(0)}%. Output Q can’t grow, so more spending just bids the same goods up — that’s inflation.`
              : `Price level down ${Math.abs(inflation).toFixed(0)}%. Less spending chasing the same goods pulls prices down.`}
        </div>
      </div>
    </div>
  )
}
