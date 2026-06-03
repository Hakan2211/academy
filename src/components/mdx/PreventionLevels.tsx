import { useMemo, useState } from 'react'
import { cn } from '#/lib/cn'
import { Icon } from '#/components/ui/Icon'

// Prevention comes in three timings: stop it before it starts (primary), catch
// it early (secondary), or limit the damage once it's here (tertiary). Sort each
// action into the right level. Owner: what-is-health (W1). Reused in
// disease-and-prevention (W11).

type Level = 'primary' | 'secondary' | 'tertiary'

const LEVELS: Record<Level, { label: string; blurb: string; color: string; icon: string }> = {
  primary: { label: 'Primary', blurb: 'Prevent it ever starting', color: '#2ECC71', icon: 'Shield' },
  secondary: { label: 'Secondary', blurb: 'Catch it early', color: '#F39C12', icon: 'Search' },
  tertiary: { label: 'Tertiary', blurb: 'Limit the damage', color: '#E74C3C', icon: 'HeartPulse' },
}

type Item = { id: string; text: string; level: Level }

const ITEMS: Array<Item> = [
  { id: 'vaccine', text: 'Getting vaccinated before flu season', level: 'primary' },
  { id: 'helmet', text: 'Wearing a seatbelt and a bike helmet', level: 'primary' },
  { id: 'screen', text: 'A mammogram or blood-pressure screening', level: 'secondary' },
  { id: 'dental', text: 'A routine dental check-up', level: 'secondary' },
  { id: 'rehab', text: 'Physiotherapy after a stroke', level: 'tertiary' },
  { id: 'mgmt', text: 'Managing diabetes to avoid complications', level: 'tertiary' },
]

const ORDER: Array<Level> = ['primary', 'secondary', 'tertiary']

export function PreventionLevels() {
  const [placed, setPlaced] = useState<Record<string, Level>>({})
  const [active, setActive] = useState<string | null>(ITEMS[0].id)

  const unplaced = ITEMS.filter((i) => !placed[i.id])
  const assign = (level: Level) => {
    if (!active) return
    setPlaced((p) => ({ ...p, [active]: level }))
    const remaining = ITEMS.filter((i) => !placed[i.id] && i.id !== active)
    setActive(remaining[0]?.id ?? null)
  }

  const { allDone, correct } = useMemo(() => {
    const done = ITEMS.every((i) => placed[i.id])
    const c = ITEMS.filter((i) => placed[i.id] === i.level).length
    return { allDone: done, correct: c }
  }, [placed])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* pick an action */}
      <p className="mb-2 text-sm text-muted">
        {active ? 'Pick a level for the highlighted action:' : 'All sorted!'}
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        {unplaced.map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => setActive(i.id)}
            className={cn(
              'rounded-xl border px-3 py-1.5 text-left text-xs transition-colors',
              active === i.id ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {i.text}
          </button>
        ))}
        {unplaced.length === 0 && <span className="text-xs text-muted">— nothing left —</span>}
      </div>

      {/* the three buckets */}
      <div className="grid grid-cols-3 gap-2">
        {ORDER.map((lv) => {
          const meta = LEVELS[lv]
          const here = ITEMS.filter((i) => placed[i.id] === lv)
          return (
            <button
              key={lv}
              type="button"
              onClick={() => assign(lv)}
              disabled={!active}
              className="flex flex-col rounded-xl border border-border bg-surface-2 p-2 text-left transition-colors enabled:hover:border-accent disabled:opacity-70"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: meta.color }}>
                <Icon name={meta.icon} size={13} />
                {meta.label}
              </span>
              <span className="text-[10px] text-muted">{meta.blurb}</span>
              <span className="mt-2 flex flex-col gap-1">
                {here.map((i) => {
                  const right = i.level === lv
                  return (
                    <span
                      key={i.id}
                      className={cn(
                        'rounded-md border px-1.5 py-1 text-[10px]',
                        right ? 'border-success/50 text-ink' : 'border-warn/50 text-warn',
                      )}
                    >
                      {right ? '✓ ' : '✗ '}
                      {i.text}
                    </span>
                  )
                })}
              </span>
            </button>
          )
        })}
      </div>

      {allDone && (
        <div className="mt-3 rounded-xl border border-border bg-surface-2 p-3 text-sm">
          <span className="font-semibold text-accent">{correct} / {ITEMS.length} correct.</span>{' '}
          <span className="text-muted">
            Primary stops disease before it starts (the cheapest, most powerful kind), secondary
            catches it early when it's most treatable, and tertiary keeps an existing condition from
            getting worse.
          </span>
        </div>
      )}
    </div>
  )
}
