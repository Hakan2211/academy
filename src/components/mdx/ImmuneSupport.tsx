import { useState } from 'react'
import { cn } from '#/lib/cn'
import { clamp } from '#/lib/health'

// Toggle real supports and myths; watch the "immune readiness" meter respond.
// Real supports raise it modestly; myths do nothing.

type Item = {
  id: string
  label: string
  icon: string
  real: boolean   // true = evidence-based, false = myth
  boost: number   // readiness contribution (0 for myths)
  note: string
}

const ITEMS: Array<Item> = [
  {
    id: 'sleep',
    label: '7–9 h sleep/night',
    icon: '😴',
    real: true,
    boost: 18,
    note: "Sleep is when the immune system consolidates its memory cells and ramps up cytokine production. Cutting sleep to 6 h nearly doubles your cold risk.",
  },
  {
    id: 'nutrition',
    label: 'Balanced nutrition',
    icon: '🥗',
    real: true,
    boost: 16,
    note: "Protein, zinc, vitamins A, C, and D support immune cell production and function. Deficiency impairs immunity; adequacy keeps it running.",
  },
  {
    id: 'exercise',
    label: 'Regular moderate exercise',
    icon: '🏃',
    real: true,
    boost: 14,
    note: "Moderate exercise improves immune surveillance and reduces chronic inflammation. (Note: extreme over-training temporarily suppresses immunity.)",
  },
  {
    id: 'stress',
    label: 'Managing chronic stress',
    icon: '🧘',
    real: true,
    boost: 14,
    note: "Chronic high cortisol suppresses immune function. Effective stress management keeps cortisol from undermining your defences.",
  },
  {
    id: 'hygiene',
    label: 'Handwashing & hygiene',
    icon: '🧼',
    real: true,
    boost: 10,
    note: "Reducing pathogen exposure keeps the immune system from being overwhelmed. It is prevention, not a booster — but it keeps you well.",
  },
  {
    id: 'vaccines',
    label: 'Up-to-date vaccines',
    icon: '💉',
    real: true,
    boost: 16,
    note: "Vaccines give the adaptive immune system a memory of pathogens it has never actually faced — the best evidence-based immune intervention we have.",
  },
  {
    id: 'megadose',
    label: "Megadose vitamin C",
    icon: '🍊',
    real: false,
    boost: 0,
    note: "Once you have adequate vitamin C, more does not help. Megadoses are mostly excreted; they don't 'supercharge' immunity — and very high doses can cause digestive problems.",
  },
  {
    id: 'tea',
    label: '"Immune-booster" tea',
    icon: '🫖',
    real: false,
    boost: 0,
    note: "There is no product that 'boosts' the immune system in a meaningful clinical sense. Marketing claims are not the same as evidence.",
  },
  {
    id: 'detox',
    label: '"Detox" cleanse',
    icon: '🧃',
    real: false,
    boost: 0,
    note: "The liver and kidneys handle detoxification continuously. No juice cleanse adds to this. These products are well-marketed but not evidence-based.",
  },
]

const MAX_READINESS = ITEMS.filter((i) => i.real).reduce((a, b) => a + b.boost, 0)

export function ImmuneSupport() {
  const [active, setActive] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const readiness = clamp(
    ITEMS.filter((i) => active.has(i.id) && i.real).reduce((a, b) => a + b.boost, 0),
    0,
    MAX_READINESS,
  )
  const pct = Math.round((readiness / MAX_READINESS) * 100)

  // Find description to show (last toggled real item, or a myth if only myth active)
  const activeItems = ITEMS.filter((i) => active.has(i.id))
  const lastActive = activeItems[activeItems.length - 1]

  const barColor =
    pct >= 70 ? '#1ABC9C' : pct >= 40 ? '#F39C12' : '#E74C3C'

  const barLabel =
    pct >= 80 ? 'Well-supported immune system' :
    pct >= 50 ? 'Reasonably supported' :
    pct >= 25 ? 'Some foundations in place' :
    'Start with the basics'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-semibold text-ink">Immune Readiness Meter</p>
      <p className="mb-4 text-xs text-muted">
        Toggle factors on or off — see what genuinely supports immunity vs what is just hype.
      </p>

      {/* Meter */}
      <div className="mb-5">
        <div className="mb-1 flex items-end justify-between">
          <span className="text-xs font-semibold text-ink">{barLabel}</span>
          <span className="text-lg font-black" style={{ color: barColor }}>{pct}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-surface-2 border border-border">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: barColor }}
          />
        </div>
        <p className="mt-1 text-[10px] text-muted">
          You can <em>support</em> and <em>protect</em> your immune system — but you cannot "supercharge" it beyond its set point.
        </p>
      </div>

      {/* Item grid */}
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {/* Real supports */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted">Evidence-based supports</p>
          <div className="flex flex-col gap-1.5">
            {ITEMS.filter((i) => i.real).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                className={cn(
                  'flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-colors',
                  active.has(item.id)
                    ? 'border-accent bg-accent/15 text-accent font-semibold'
                    : 'border-border text-muted hover:text-ink',
                )}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Myths */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted">Myths & hype</p>
          <div className="flex flex-col gap-1.5">
            {ITEMS.filter((i) => !i.real).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                className={cn(
                  'flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-colors',
                  active.has(item.id)
                    ? 'border-warn/60 bg-warn/10 text-warn font-semibold'
                    : 'border-border text-muted hover:text-ink',
                )}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Note panel */}
      <div
        className={cn(
          'rounded-xl border px-3 py-2 text-xs',
          lastActive
            ? lastActive.real
              ? 'border-accent/40 bg-accent/8 text-ink'
              : 'border-warn/40 bg-warn/8 text-warn'
            : 'border-border bg-surface-2 text-muted',
        )}
      >
        {lastActive ? lastActive.note : "Toggle a factor above to learn what the evidence actually says."}
      </div>
    </div>
  )
}
