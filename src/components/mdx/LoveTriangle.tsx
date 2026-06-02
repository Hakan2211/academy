import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp } from '#/lib/psych'

// Sternberg's triangular theory of love. Three ingredients — intimacy (closeness,
// warmth), passion (romance, physical attraction), and commitment (the decision
// to stay) — combine into seven named kinds of love. The learner sets three
// sliders; the triangle's shape deforms live and the resulting label is named in
// real time. Used in attraction-and-love.

const W = 280
const H = 230
const CX = W / 2
// Triangle vertices: intimacy top, passion bottom-left, commitment bottom-right.
const APEX = { x: CX, y: 24 }
const BL = { x: 40, y: 196 }
const BR = { x: W - 40, y: 196 }

// High = >= 60. Name the love type from which components are strong.
function nameLove(i: number, p: number, c: number): { name: string; blurb: string } {
  const hi = (v: number) => v >= 60
  const I = hi(i)
  const P = hi(p)
  const C = hi(c)
  if (I && P && C) return { name: 'Consummate love', blurb: 'All three at full strength — the complete, hard-to-sustain ideal.' }
  if (I && P && !C) return { name: 'Romantic love', blurb: 'Closeness plus passion, but no firm commitment yet — the whirlwind.' }
  if (I && !P && C) return { name: 'Companionate love', blurb: 'Deep warmth and commitment without the spark — long marriages, close family.' }
  if (!I && P && C) return { name: 'Fatuous love', blurb: 'Passion rushed into commitment with no real intimacy — the whirlwind engagement.' }
  if (I && !P && !C) return { name: 'Liking / friendship', blurb: 'Warmth and closeness alone — the bond of a true friend.' }
  if (!I && P && !C) return { name: 'Infatuation', blurb: 'Pure passion — love at first sight, the obsessive crush.' }
  if (!I && !P && C) return { name: 'Empty love', blurb: 'Commitment with neither warmth nor spark — a relationship running on duty.' }
  return { name: 'Non-love', blurb: 'None of the three — the everyday acquaintance.' }
}

export function LoveTriangle() {
  const [intimacy, setIntimacy] = useState(70)
  const [passion, setPassion] = useState(70)
  const [commitment, setCommitment] = useState(70)

  const result = nameLove(intimacy, passion, commitment)

  // Deform the triangle: pull each vertex toward the centroid as its component weakens.
  const t = (v: number) => clamp(0.25 + (v / 100) * 0.75, 0.25, 1)
  const C = { x: (APEX.x + BL.x + BR.x) / 3, y: (APEX.y + BL.y + BR.y) / 3 }
  const pull = (vtx: { x: number; y: number }, v: number) => ({
    x: C.x + (vtx.x - C.x) * t(v),
    y: C.y + (vtx.y - C.y) * t(v),
  })
  const pa = pull(APEX, intimacy)
  const pl = pull(BL, passion)
  const pr = pull(BR, commitment)
  const poly = `${pa.x.toFixed(1)},${pa.y.toFixed(1)} ${pl.x.toFixed(1)},${pl.y.toFixed(1)} ${pr.x.toFixed(1)},${pr.y.toFixed(1)}`

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid items-center gap-4 sm:grid-cols-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* reference (full) triangle */}
          <polygon
            points={`${APEX.x},${APEX.y} ${BL.x},${BL.y} ${BR.x},${BR.y}`}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          {/* live triangle */}
          <polygon points={poly} fill="var(--color-accent)" fillOpacity="0.18" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" />
          {[
            { v: APEX, label: 'Intimacy', anchor: 'middle' as const, dy: -8 },
            { v: BL, label: 'Passion', anchor: 'middle' as const, dy: 16 },
            { v: BR, label: 'Commitment', anchor: 'middle' as const, dy: 16 },
          ].map((n) => (
            <text key={n.label} x={n.v.x} y={n.v.y + n.dy} textAnchor={n.anchor} fontSize="11" fontWeight="600" fill="var(--color-muted)">
              {n.label}
            </text>
          ))}
        </svg>

        <div className="space-y-2.5">
          <SceneSlider label="Intimacy" value={intimacy} min={0} max={100} step={1} unit="" onChange={(v) => setIntimacy(Math.round(v))} />
          <SceneSlider label="Passion" value={passion} min={0} max={100} step={1} unit="" onChange={(v) => setPassion(Math.round(v))} />
          <SceneSlider label="Commitment" value={commitment} min={0} max={100} step={1} unit="" onChange={(v) => setCommitment(Math.round(v))} />
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-3 text-center">
        <p className="text-lg font-bold text-accent">{result.name}</p>
        <p className="mt-0.5 text-sm leading-snug text-muted">{result.blurb}</p>
      </div>
    </div>
  )
}
