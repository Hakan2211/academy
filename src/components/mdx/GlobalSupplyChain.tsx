import { useState } from 'react'
import { cn } from '#/lib/cn'

// Globalisation, traced through a single object. A smartphone is not "made in"
// any one country — it is designed in one place, has chips and screens made in
// others, gets assembled somewhere with cheap labour, and is sold worldwide.
// Each link in the chain sits where it does because of COMPARATIVE ADVANTAGE:
// the country that gives up the least to perform that stage wins it. Step through
// the chain to see who specialises in what, how much of the final price each
// stage captures, and who the winners and losers of the arrangement are. This is
// the concrete face of the globalisation debate that closes the world.

type Stage = {
  flag: string
  country: string
  stage: string
  advantage: string // why this country does this stage
  share: number // rough % of the final retail price captured here
  winners: string
  losers: string
}

const STAGES: Array<Stage> = [
  {
    flag: '🇺🇸',
    country: 'United States',
    stage: 'Design & software',
    advantage: 'A deep pool of engineers, design talent and patents — high human capital is its comparative advantage.',
    share: 42,
    winners: 'Designers, software engineers, shareholders — the highest-paid, highest-margin work.',
    losers: 'Workers without advanced skills, who see few of these jobs.',
  },
  {
    flag: '🇰🇷',
    country: 'South Korea',
    stage: 'Displays & memory chips',
    advantage: 'Decades of investment in fabrication plants and process know-how no rival can match cheaply.',
    share: 17,
    winners: 'Advanced manufacturers and the skilled technicians they employ.',
    losers: 'Countries that tried to compete without the capital to build fabs.',
  },
  {
    flag: '🇹🇼',
    country: 'Taiwan',
    stage: 'Cutting-edge processors',
    advantage: 'The world leader in the most advanced chip fabrication — an extreme specialisation.',
    share: 13,
    winners: 'A handful of foundries and their engineers; the local economy.',
    losers: 'Buyers everywhere when this single chokepoint is disrupted.',
  },
  {
    flag: '🇨🇳',
    country: 'China',
    stage: 'Final assembly',
    advantage: 'Vast, organised, lower-cost labour and enormous factory clusters — assembly is its comparative advantage.',
    share: 6,
    winners: 'Millions of factory workers who gained jobs and rising wages.',
    losers: 'Assembly-line workers in rich countries who lost those jobs.',
  },
  {
    flag: '🌍',
    country: 'Everywhere',
    stage: 'Retail & sale',
    advantage: 'Sold worldwide; logistics and retail margins are captured close to the customer.',
    share: 22,
    winners: 'Consumers get a powerful phone cheaply; retailers and carriers profit.',
    losers: 'Local makers who can no longer compete with a globally optimised product.',
  },
]

export function GlobalSupplyChain() {
  const [i, setI] = useState(0)
  const s = STAGES[i]
  const atEnd = i === STAGES.length - 1

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      {/* the chain ribbon */}
      <div className="flex items-stretch gap-1 p-3">
        {STAGES.map((st, k) => (
          <button
            key={st.country + st.stage}
            type="button"
            onClick={() => setI(k)}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 rounded-xl border px-1 py-2 text-center transition-colors',
              k === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            <span className="text-lg leading-none">{st.flag}</span>
            <span className="text-[10px] leading-tight">{st.stage}</span>
          </button>
        ))}
      </div>

      {/* value-capture bar: how much of the final price each stage keeps */}
      <div className="px-4">
        <div className="flex h-5 w-full overflow-hidden rounded-full border border-border">
          {STAGES.map((st, k) => (
            <div
              key={st.country + st.stage}
              style={{ width: `${st.share}%`, background: k === i ? 'var(--color-accent)' : 'var(--color-surface-2)' }}
              className="h-full border-r border-border last:border-r-0"
              title={`${st.country}: ${st.share}%`}
            />
          ))}
        </div>
        <p className="mt-1 text-center text-xs text-muted">share of the phone&apos;s final price captured at each stage</p>
      </div>

      {/* the selected stage */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{s.flag}</span>
          <div>
            <div className="text-base font-semibold text-ink">{s.country}</div>
            <div className="text-sm text-accent">{s.stage} · ~{s.share}% of the price</div>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-ink">
          <span className="font-medium text-accent-2">Why here? </span>{s.advantage}
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-success/40 px-3 py-2 text-sm">
            <div className="mb-0.5 text-xs font-medium text-success">Winners</div>
            <div className="text-muted">{s.winners}</div>
          </div>
          <div className="rounded-xl border border-accent/40 px-3 py-2 text-sm">
            <div className="mb-0.5 text-xs font-medium text-accent">Losers</div>
            <div className="text-muted">{s.losers}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setI((x) => Math.max(0, x - 1))}
            disabled={i === 0}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              i === 0 ? 'border-border text-muted opacity-40' : 'border-border text-muted hover:text-ink',
            )}
          >
            ← Previous link
          </button>
          <span className="text-xs text-muted">{i + 1} / {STAGES.length}</span>
          <button
            type="button"
            onClick={() => setI((x) => Math.min(STAGES.length - 1, x + 1))}
            disabled={atEnd}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              atEnd ? 'border-border text-muted opacity-40' : 'border-accent bg-accent/15 text-accent hover:bg-accent/25',
            )}
          >
            Next link →
          </button>
        </div>

        {atEnd && (
          <div className="rounded-xl border border-accent/50 px-3 py-2 text-center text-sm text-accent">
            One phone, five countries, each doing what it does at the lowest opportunity cost — the world output is larger and
            phones are cheaper. But the gains and losses fall on different people, which is exactly why globalisation is so fiercely debated.
          </div>
        )}
      </div>
    </div>
  )
}
