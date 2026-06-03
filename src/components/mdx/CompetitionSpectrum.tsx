import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp, lerp } from '#/lib/econ'

// The full spectrum of competition on one slider. At the LEFT a market has many
// tiny firms selling an identical product: each is a price TAKER, so the demand
// curve IT faces is flat (perfectly elastic) and price sits right at marginal
// cost — no markup. Slide RIGHT toward monopoly and the firms get fewer, the
// demand curve the firm faces rotates to steep (it must drop price to sell
// more — a price MAKER), and the price climbs above cost into a fat markup.
// Reused by the deepdive on market power & antitrust.
const X0 = 50
const Y0 = 200
const PW = 250
const PH = 160
const QMAX = 100
const PMAX = 100

// marginal cost the firm pays (flat, the competitive price floor)
const MC = 30

type Stage = { label: string; firms: string; note: string }

function stageOf(t: number): Stage {
  if (t < 0.18) return {
    label: 'Perfect competition',
    firms: 'very many',
    note: 'Identical products and free entry. Each firm is a price taker facing a flat demand curve, so price is pinned to marginal cost and economic profit vanishes in the long run.',
  }
  if (t < 0.5) return {
    label: 'Monopolistic competition',
    firms: 'many',
    note: 'Many firms, but each differentiates its product a little, so each faces a gently downward-sloping demand curve and earns a small markup.',
  }
  if (t < 0.82) return {
    label: 'Oligopoly',
    firms: 'a few',
    note: 'A handful of large, interdependent firms. Steeper demand and real price-setting power — though rivals watch each other closely.',
  }
  return {
    label: 'Monopoly',
    firms: 'one',
    note: 'A single seller protected by barriers to entry faces the whole market demand curve. It restricts output and charges the highest markup over cost.',
  }
}

export function CompetitionSpectrum() {
  const [t, setT] = useState(0) // 0 = perfect competition, 1 = monopoly

  const sx = (q: number) => X0 + (q / QMAX) * PW
  const sy = (p: number) => Y0 - (p / PMAX) * PH

  // the firm's own demand curve rotates about the chosen quantity Q* as power
  // rises: flat at t=0, steep at t=1. slope (price drop per extra unit) grows.
  const qStar = 50
  const slope = lerp(0, 1.1, t) // ΔP per unit of Q
  const price = MC + lerp(0, 52, t) // markup grows from 0 to a fat wedge
  // demand line through (qStar, price) with the given slope
  const demP = (q: number) => price + slope * (qStar - q)
  const d1 = { x: sx(0), y: sy(clamp(demP(0), 0, PMAX)) }
  const d2 = { x: sx(QMAX), y: sy(clamp(demP(QMAX), 0, PMAX)) }

  const markup = price - MC
  const firmCount = Math.round(lerp(40, 1, t ** 1.4))
  const stage = stageOf(t)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <svg viewBox="0 0 360 240" className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 18} textAnchor="end" fontSize="11" fill="var(--color-muted)">Quantity →</text>
        <text x={X0 - 6} y={Y0 - PH} textAnchor="end" fontSize="11" fill="var(--color-muted)">↑ Price</text>

        {/* marginal-cost / competitive-price floor */}
        <line x1={X0} y1={sy(MC)} x2={X0 + PW} y2={sy(MC)} stroke="var(--color-accent-2)" strokeWidth="2" strokeDasharray="5 3" />
        <text x={X0 + PW + 2} y={sy(MC) + 4} fontSize="10" fill="var(--color-accent-2)">MC</text>

        {/* the markup wedge between price and cost */}
        <rect x={sx(qStar) - 3} y={sy(price)} width="6" height={sy(MC) - sy(price)} fill="var(--color-accent)" opacity="0.25" />

        {/* the firm's own demand curve (rotates flat → steep) */}
        <line x1={d1.x} y1={d1.y} x2={d2.x} y2={d2.y} stroke="var(--color-accent)" strokeWidth="3" />
        <text x={d2.x - 4} y={clamp(d2.y - 6, 18, Y0)} textAnchor="end" fontSize="10" fill="var(--color-accent)">demand the firm faces</text>

        {/* chosen price / quantity point */}
        <line x1={sx(qStar)} y1={sy(price)} x2={sx(qStar)} y2={Y0} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        <line x1={sx(qStar)} y1={sy(price)} x2={X0} y2={sy(price)} stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        <circle cx={sx(qStar)} cy={sy(price)} r="6" fill="var(--color-ink)" />
      </svg>

      <div className="px-4 text-center">
        <div className="text-sm font-semibold text-accent">{stage.label}</div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 pt-2 text-center text-sm">
        <div><div className="font-mono text-ink">{firmCount}</div><div className="text-xs text-muted">firms ({stage.firms})</div></div>
        <div><div className="font-mono text-accent">{Math.round(price)}</div><div className="text-xs text-muted">price charged</div></div>
        <div><div className="font-mono text-accent-2">{Math.round(markup)}</div><div className="text-xs text-muted">markup over cost</div></div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <SceneSlider label="Market power (competition → monopoly)" value={t} min={0} max={1} step={0.01} unit="" onChange={setT} />
        <p className="text-sm text-muted">{stage.note}</p>
      </div>
    </div>
  )
}
