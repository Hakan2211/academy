import { useState } from 'react'
import { cn } from '#/lib/cn'
import { SceneSlider } from '#/components/three/SceneSlider'
import { clamp, formatUSD } from '#/lib/econ'

// The central bank cannot order people to hold more money — instead it pulls
// three levers that make the money supply expand or contract through the banking
// system. OPEN-MARKET OPERATIONS: buying bonds pumps fresh reserves into banks
// (more lending → more money); selling bonds drains them. The RESERVE
// REQUIREMENT sets the money multiplier — a lower requirement lets each dollar
// of reserves support more loans. The POLICY INTEREST RATE is the price of
// borrowing — cut it and households and firms borrow and spend more, raising the
// money in circulation. Pick a tool, set it, and watch the money-supply readout.
const BASE = 1000 // baseline money supply (index units, $bn say)

type Tool = 'omo' | 'reserve' | 'rate'

const TOOLS: Array<{ key: Tool; label: string }> = [
  { key: 'omo', label: 'Open-market operations' },
  { key: 'reserve', label: 'Reserve requirement' },
  { key: 'rate', label: 'Policy interest rate' },
]

export function MoneyCreation() {
  const [tool, setTool] = useState<Tool>('omo')
  const [omo, setOmo] = useState(0) // bonds bought (+) or sold (−), in reserve units
  const [reservePct, setReservePct] = useState(10) // reserve requirement %
  const [rate, setRate] = useState(3) // policy rate %, baseline 3%

  // Each lever maps to a money supply. Use the SAME multiplier model so the
  // numbers stay coherent: M = (baseline reserves ± OMO) × 1/reserveRatio, then
  // nudged by how far the policy rate sits from its 3% baseline.
  const rr = clamp(reservePct, 1, 100) / 100
  const baseReserves = BASE * 0.1 // implied reserves behind the baseline supply
  const reserves = baseReserves + omo
  const rateFactor = 1 + (3 - rate) * 0.05 // cut rate below 3% → >1 (more borrowing)
  const supply = Math.max(0, (reserves / rr) * rateFactor)
  const delta = supply - BASE
  const dir = delta > 1 ? 'expands' : delta < -1 ? 'contracts' : 'unchanged'

  // bar geometry
  const maxSupply = BASE * 2.5
  const pct = clamp(supply / maxSupply, 0, 1) * 100
  const basePct = clamp(BASE / maxSupply, 0, 1) * 100

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="text-sm font-semibold text-ink">The central bank&rsquo;s three levers</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {TOOLS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTool(t.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              tool === t.key
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* the active lever */}
      <div className="mt-4">
        {tool === 'omo' && (
          <>
            <SceneSlider label="Bonds bought (+) / sold (−)" value={omo} min={-60} max={60} step={2} unit="" onChange={setOmo} />
            <p className="mt-2 text-xs leading-relaxed text-muted">
              <span className="text-ink">Buying</span> bonds hands banks fresh reserves to lend — money expands.
              <span className="text-ink"> Selling</span> bonds takes reserves back out — money contracts. This is the central
              bank&rsquo;s day-to-day tool.
            </p>
          </>
        )}
        {tool === 'reserve' && (
          <>
            <SceneSlider label="Reserve requirement" value={reservePct} min={1} max={25} step={1} unit="%" onChange={setReservePct} />
            <p className="mt-2 text-xs leading-relaxed text-muted">
              The requirement sets the money multiplier (1 ÷ ratio). <span className="text-ink">Lower</span> it and each dollar
              of reserves supports more loans — money expands. <span className="text-ink">Raise</span> it and lending shrinks.
            </p>
          </>
        )}
        {tool === 'rate' && (
          <>
            <SceneSlider label="Policy interest rate" value={rate} min={0} max={8} step={0.25} unit="%" onChange={setRate} />
            <p className="mt-2 text-xs leading-relaxed text-muted">
              The rate is the price of borrowing. <span className="text-ink">Cutting</span> it (below the 3% baseline) makes
              loans cheaper, so households and firms borrow and spend more — money expands. <span className="text-ink">Raising</span> it
              cools borrowing.
            </p>
          </>
        )}
      </div>

      {/* money supply readout */}
      <div className="mt-4">
        <div className="relative h-7 w-full overflow-hidden rounded-full border border-border bg-surface-2">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
          {/* baseline marker */}
          <div className="absolute inset-y-0 w-px bg-ink/60" style={{ left: `${basePct}%` }} />
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-muted">
          <span>baseline {formatUSD(BASE)}</span>
          <span>money supply</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-accent/40 bg-accent/10 px-3 py-2">
        <span className="text-sm text-muted">
          Money supply {dir === 'unchanged' ? 'is roughly unchanged' : `${dir} to`}
        </span>
        <span className="font-mono text-lg text-accent">
          {formatUSD(supply)} {dir !== 'unchanged' && <span className={cn('text-sm', delta > 0 ? 'text-success' : 'text-accent-2')}>({delta > 0 ? '+' : ''}{formatUSD(delta)})</span>}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted">
        Whichever lever it reaches for, the central bank is steering the same thing: how much money flows through the economy.
        As the <span className="text-ink">lender of last resort</span>, it can also create reserves on demand to keep banks
        solvent in a panic — which is why a modern banking system rests on the central bank standing behind it.
      </p>
    </div>
  )
}
