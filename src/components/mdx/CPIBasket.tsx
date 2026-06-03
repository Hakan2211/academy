import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'

// The Consumer Price Index in miniature. A FIXED basket of everyday goods (the
// quantities never change) is priced in a base year and again this year. The CPI
// is this year's basket cost over the base-year cost, times 100; inflation is the
// percent change in that index. Raise individual prices and watch the index — and
// the inflation rate — climb. Then see who it hurts (savers and people on fixed
// incomes, whose money buys less) versus helps (borrowers, who repay fixed debts
// in cheaper dollars).

type Good = { id: string; label: string; qty: number; base: number }

const BASKET: Array<Good> = [
  { id: 'bread', label: '🍞 Bread (loaves)', qty: 20, base: 3 },
  { id: 'milk', label: '🥛 Milk (litres)', qty: 30, base: 2 },
  { id: 'fuel', label: '⛽ Fuel (litres)', qty: 40, base: 1.5 },
  { id: 'rent', label: '🏠 Rent (months)', qty: 1, base: 900 },
]

export function CPIBasket() {
  const [prices, setPrices] = useState<Record<string, number>>(
    Object.fromEntries(BASKET.map((g) => [g.id, g.base])),
  )

  const baseCost = BASKET.reduce((s, g) => s + g.qty * g.base, 0)
  const nowCost = BASKET.reduce((s, g) => s + g.qty * prices[g.id], 0)
  const cpi = (nowCost / baseCost) * 100
  const inflation = cpi - 100 // base index is 100, so % above base = inflation since base year

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-muted">Fixed basket — quantities never change</span>
        <span className="text-xs text-muted">base prices in grey</span>
      </div>

      <div className="flex flex-col gap-4">
        {BASKET.map((g) => {
          const p = prices[g.id]
          const up = p > g.base
          return (
            <div key={g.id}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-ink">{g.label} × {g.qty}</span>
                <span className="font-mono text-muted">
                  base ${g.base.toFixed(2)} → <span className={up ? 'text-accent-2' : 'text-ink'}>${p.toFixed(2)}</span>
                </span>
              </div>
              <SceneSlider
                label="Price each"
                value={p}
                min={g.base}
                max={g.base * 2}
                step={g.base >= 100 ? 25 : 0.25}
                unit="$"
                onChange={(v) => setPrices((prev) => ({ ...prev, [g.id]: v }))}
              />
            </div>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-border bg-surface-2 p-3 text-center text-sm">
        <div><div className="font-mono text-ink">${baseCost.toFixed(0)}</div><div className="text-xs text-muted">base-year cost</div></div>
        <div><div className="font-mono text-accent">{cpi.toFixed(1)}</div><div className="text-xs text-muted">price index (CPI)</div></div>
        <div><div className="font-mono text-accent-2">+{inflation.toFixed(1)}%</div><div className="text-xs text-muted">inflation since base</div></div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-accent-2/40 bg-accent-2/10 p-3">
          <p className="text-sm font-semibold text-accent-2">Hurt by inflation</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            <span className="text-ink">Savers</span> and people on <span className="text-ink">fixed incomes</span> — their
            dollars buy {inflation > 0 ? `${inflation.toFixed(0)}% less` : 'the same'} than at the base year.
          </p>
        </div>
        <div className="rounded-xl border border-success/40 bg-success/10 p-3">
          <p className="text-sm font-semibold text-success">Helped by inflation</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            <span className="text-ink">Borrowers</span> with fixed-rate debt repay in cheaper dollars worth less than what
            they borrowed.
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted">
        The CPI tracks one fixed basket so any rise reflects <span className="text-ink">prices</span>, not changed buying.
        Push every price to double and the index hits 200 — a 100% rise in the cost of living.
      </p>
    </div>
  )
}
