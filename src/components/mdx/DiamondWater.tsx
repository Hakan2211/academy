import { cn } from '#/lib/cn'
import { useState } from 'react'

// The diamond-water paradox. Water is essential yet nearly free; diamonds are
// useless for survival yet ruinously expensive. The resolution: price tracks
// MARGINAL utility, not TOTAL utility. Because water is abundant we consume it
// to the point where one more litre is barely worth anything — so its marginal
// utility (and price) is tiny, even though the total utility of all water is
// enormous. Diamonds are scarce, so we stop at the very first units, where
// marginal utility is still sky-high. Toggle which good you're looking at and
// see how abundance crushes marginal utility while total utility tells a very
// different story.
type Good = 'water' | 'diamond'

const META: Record<Good, { label: string; emoji: string; abundant: boolean; price: string; muLevel: number }> = {
  water: { label: 'Water', emoji: '💧', abundant: true, price: '$0.001 / litre', muLevel: 0.12 },
  diamond: { label: 'Diamond', emoji: '💎', abundant: false, price: '$15,000 / carat', muLevel: 0.95 },
}

// marginal utility falls as you consume more units; abundant goods sit far out
// on this curve (low MU), scarce goods sit at the start (high MU).
const N = 10
const mu = (k: number) => Math.max(4, 100 / k)

const VW = 360
const H = 188
const X0 = 30
const Y0 = 150
const PW = VW - X0 - 14
const PH = Y0 - 18
const colW = PW / N

export function DiamondWater() {
  const [good, setGood] = useState<Good>('water')
  const m = META[good]
  // how many units a typical person consumes of this good (abundant = many)
  const consumed = m.abundant ? N : 1
  const marginUtil = mu(consumed)

  const cx = (k: number) => X0 + (k - 0.5) * colW

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {(['water', 'diamond'] as Array<Good>).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGood(g)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              good === g ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {META[g].emoji} {META[g].label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${VW} ${H}`} className="w-full">
        {/* axes */}
        <line x1={X0} y1={Y0} x2={X0 + PW} y2={Y0} stroke="var(--color-border)" strokeWidth="2" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PH} stroke="var(--color-border)" strokeWidth="2" />
        <text x={X0 + PW} y={Y0 + 16} textAnchor="end" fontSize="10" fill="var(--color-muted)">units owned →</text>
        <text x={X0 - 6} y={Y0 - PH + 2} textAnchor="end" fontSize="10" fill="var(--color-muted)">↑ MU</text>

        {/* marginal-utility bars; consumed units are bright, the rest faint */}
        {Array.from({ length: N }, (_, i) => i + 1).map((k) => {
          const within = k <= consumed
          const h = (mu(k) / 100) * PH
          return (
            <rect
              key={k}
              x={cx(k) - colW * 0.35} y={Y0 - h} width={colW * 0.7} height={h}
              rx="2"
              fill={within ? 'var(--color-accent-2)' : 'var(--color-border)'}
              opacity={within ? 1 : 0.5}
            />
          )
        })}

        {/* marker on the LAST consumed unit = the marginal one that sets value */}
        <line
          x1={cx(consumed)} y1={Y0 - (marginUtil / 100) * PH} x2={cx(consumed)} y2={Y0}
          stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3 2"
        />
        <circle cx={cx(consumed)} cy={Y0 - (marginUtil / 100) * PH} r="5" fill="var(--color-accent)" />
        <text x={cx(consumed)} y={Y0 - (marginUtil / 100) * PH - 9} textAnchor="middle" fontSize="9" fill="var(--color-accent)">
          last unit
        </text>
      </svg>

      <div className="grid grid-cols-3 gap-2 px-4 text-center text-sm">
        <div>
          <div className="font-mono text-ink">{m.abundant ? 'abundant' : 'scarce'}</div>
          <div className="text-xs text-muted">supply</div>
        </div>
        <div>
          <div className={cn('font-mono', m.muLevel > 0.5 ? 'text-accent' : 'text-muted')}>{m.muLevel > 0.5 ? 'high' : 'low'}</div>
          <div className="text-xs text-muted">marginal utility</div>
        </div>
        <div>
          <div className="font-mono text-accent-2">{m.price}</div>
          <div className="text-xs text-muted">price</div>
        </div>
      </div>

      <p className="px-4 pb-4 pt-3 text-sm text-muted">
        {m.abundant ? (
          <>Water is everywhere, so we keep drinking until one <span className="text-ink">more</span> litre is barely worth anything. That tiny <span className="text-accent">marginal</span> utility is what sets the price — even though the <span className="text-ink">total</span> utility of all water (we&apos;d die without it) is immense.</>
        ) : (
          <>Diamonds are scarce, so we own only a few — stopping where each one still delivers <span className="text-accent">enormous</span> marginal utility. High marginal utility, high price. Their total usefulness to survival is near zero; <span className="text-ink">marginal</span> utility, not total, drives value.</>
        )}
      </p>
    </div>
  )
}
