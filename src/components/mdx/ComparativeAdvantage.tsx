import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'

// The deepest idea in trade theory, made tangible. Two countries each have a
// fixed pool of labour they can split between two goods. ABSOLUTE advantage is
// just "who makes more of a good"; COMPARATIVE advantage is "who gives up the
// LEAST of the other good to make it" — that is, whose opportunity cost is
// lower. Even a country that is worse at BOTH goods (no absolute advantage)
// still has a comparative advantage in one of them. When each country
// specialises where its opportunity cost is lowest and the two trade, total
// output rises and BOTH end up able to consume more than they could alone.
// Straight-line PPFs (constant opportunity cost) are exactly right here.
// FLAGSHIP — used by lessons 1 (why-nations-trade) and 2 (comparative-advantage).

// Each country's two numbers are MAX UNITS PER PERIOD if it threw ALL its
// labour at a single good (the PPF intercepts). Opportunity cost of one Wine in
// terms of Cloth = maxCloth / maxWine, and vice-versa.
type Country = {
  name: string
  wine: number // max wine if all-in on wine
  cloth: number // max cloth if all-in on cloth
}

const PRESETS: Array<{ label: string; a: Country; b: Country }> = [
  // Classic Ricardo flavour: Portugal beats England at BOTH goods (absolute
  // advantage in everything) yet trade still helps both — comparative advantage.
  {
    label: 'Ricardo',
    a: { name: 'Portugal', wine: 60, cloth: 30 },
    b: { name: 'England', wine: 15, cloth: 30 },
  },
  // A balanced case where each is plainly best at one good.
  {
    label: 'Balanced',
    a: { name: 'Vinland', wine: 50, cloth: 20 },
    b: { name: 'Textilia', wine: 20, cloth: 50 },
  },
]

const X0 = 46
const Y0 = 132
const PW = 110
const PH = 104

function PPF({
  c,
  axisW,
  axisC,
  highlight,
}: {
  c: Country
  axisW: number
  axisC: number
  highlight: 'wine' | 'cloth' | null
}) {
  const sx = (w: number) => X0 + (w / axisW) * PW
  const sy = (cl: number) => Y0 - (cl / axisC) * PH
  return (
    <svg viewBox="0 0 200 160" className="w-full">
      <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="1.5" />
      <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="1.5" />
      <text x={X0 + PW} y={Y0 + 14} textAnchor="end" fontSize="9" fill="var(--color-muted)">Wine →</text>
      <text x={X0 - 4} y={Y0 - PH} textAnchor="end" fontSize="9" fill="var(--color-muted)">↑ Cloth</text>
      {/* shaded attainable region */}
      <path
        d={`M ${sx(0)} ${sy(c.cloth)} L ${sx(c.wine)} ${sy(0)} L ${sx(0)} ${sy(0)} Z`}
        fill="var(--color-accent)"
        opacity="0.08"
      />
      {/* the straight-line frontier */}
      <line
        x1={sx(0)} y1={sy(c.cloth)} x2={sx(c.wine)} y2={sy(0)}
        stroke="var(--color-accent)" strokeWidth="2.5"
      />
      {/* intercepts, lit up by which good this country specialises in */}
      <circle cx={sx(c.wine)} cy={sy(0)} r="4" fill={highlight === 'wine' ? 'var(--color-success)' : 'var(--color-accent-2)'} />
      <circle cx={sx(0)} cy={sy(c.cloth)} r="4" fill={highlight === 'cloth' ? 'var(--color-success)' : 'var(--color-accent-2)'} />
      <text x={X0 + PW / 2} y={20} textAnchor="middle" fontSize="11" fill="var(--color-ink)" fontWeight="600">{c.name}</text>
    </svg>
  )
}

export function ComparativeAdvantage() {
  const [preset, setPreset] = useState(0)
  const [a, setA] = useState<Country>(PRESETS[0].a)
  const [b, setB] = useState<Country>(PRESETS[0].b)

  const applyPreset = (i: number) => {
    setPreset(i)
    setA(PRESETS[i].a)
    setB(PRESETS[i].b)
  }

  // Opportunity cost of ONE WINE, in cloth given up: cloth-per-wine = cloth/wine.
  const ocWineA = a.wine > 0 ? a.cloth / a.wine : Infinity
  const ocWineB = b.wine > 0 ? b.cloth / b.wine : Infinity
  // Lower opportunity cost of wine = comparative advantage in wine.
  const wineCA = ocWineA <= ocWineB ? a : b
  const clothCA = wineCA === a ? b : a

  // axes shared scale so the two PPFs are comparable side by side
  const axisW = Math.max(a.wine, b.wine) * 1.15 || 1
  const axisC = Math.max(a.cloth, b.cloth) * 1.15 || 1

  // --- gains from trade -----------------------------------------------------
  // No-trade benchmark: each country splits labour 50/50 → half of each
  // intercept. World output before trade:
  const preWine = a.wine / 2 + b.wine / 2
  const preCloth = a.cloth / 2 + b.cloth / 2
  // With full specialisation: the wine-CA country goes all-in on wine, the
  // other all-in on cloth.
  const postWine = wineCA.wine
  const postCloth = clothCA.cloth
  const gainWine = postWine - preWine
  const gainCloth = postCloth - preCloth
  // Trade helps only when the two countries' opportunity costs DIFFER.
  const costsDiffer = Math.abs(ocWineA - ocWineB) > 0.001

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(i)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              preset === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-1 px-2">
        <PPF c={a} axisW={axisW} axisC={axisC} highlight={wineCA === a ? 'wine' : 'cloth'} />
        <PPF c={b} axisW={axisW} axisC={axisC} highlight={wineCA === b ? 'wine' : 'cloth'} />
      </div>

      {/* opportunity-cost read-out */}
      <div className="grid grid-cols-2 gap-2 px-4 text-center text-sm">
        <div>
          <div className="font-mono text-accent">{ocWineA === Infinity ? '∞' : ocWineA.toFixed(2)}</div>
          <div className="text-xs text-muted">{a.name}: cloth lost / +1 wine</div>
        </div>
        <div>
          <div className="font-mono text-accent">{ocWineB === Infinity ? '∞' : ocWineB.toFixed(2)}</div>
          <div className="text-xs text-muted">{b.name}: cloth lost / +1 wine</div>
        </div>
      </div>

      <div className="mx-4 mt-3 rounded-xl border border-success/50 px-3 py-2 text-center text-sm text-success">
        {costsDiffer ? (
          <>
            <span className="text-ink">{wineCA.name}</span> has the comparative advantage in{' '}
            <span className="font-mono">wine</span>; <span className="text-ink">{clothCA.name}</span> in{' '}
            <span className="font-mono">cloth</span>. If each specialises and they trade, world output rises by{' '}
            <span className="font-mono">{gainWine >= 0 ? '+' : ''}{gainWine.toFixed(1)}</span> wine and{' '}
            <span className="font-mono">{gainCloth >= 0 ? '+' : ''}{gainCloth.toFixed(1)}</span> cloth versus going it alone —
            so there is more of both to share.
          </>
        ) : (
          <span className="text-muted">
            Both countries have the <span className="text-ink">same opportunity cost</span> of wine, so neither has a
            comparative advantage and there are no gains from specialising — make the productivities unequal to see trade pay off.
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <p className="text-xs font-medium text-muted">{a.name}&apos;s productivity</p>
        <SceneSlider label="…all-in on wine (units)" value={a.wine} min={5} max={80} step={1} unit="" onChange={(v) => setA({ ...a, wine: v })} />
        <SceneSlider label="…all-in on cloth (units)" value={a.cloth} min={5} max={80} step={1} unit="" onChange={(v) => setA({ ...a, cloth: v })} />
        <p className="mt-1 text-xs font-medium text-muted">{b.name}&apos;s productivity</p>
        <SceneSlider label="…all-in on wine (units)" value={b.wine} min={5} max={80} step={1} unit="" onChange={(v) => setB({ ...b, wine: v })} />
        <SceneSlider label="…all-in on cloth (units)" value={b.cloth} min={5} max={80} step={1} unit="" onChange={(v) => setB({ ...b, cloth: v })} />
        <p className="text-sm leading-relaxed text-muted">
          Opportunity cost — not raw output — decides who should make what. The country that sacrifices the
          <span className="text-ink"> fewest</span> cloth to brew one more wine should brew the wine; the other weaves the cloth.
        </p>
      </div>
    </div>
  )
}
