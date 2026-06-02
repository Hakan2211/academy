import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A Holmes-Rahe style life-events checklist (the Social Readjustment Rating
// Scale). Each life change carries "life-change units" — even welcome events
// cost adjustment. Tick the ones you've faced in the past year; the total maps
// to a rough risk band for stress-related illness. The point: it's not just the
// bad events, and it's the accumulation that matters.

type Item = { id: string; label: string; lcu: number }

// A representative subset, with classic LCU weights.
const ITEMS: Array<Item> = [
  { id: 'spouse', label: 'Death of a close family member', lcu: 100 },
  { id: 'divorce', label: 'Divorce or relationship breakup', lcu: 73 },
  { id: 'injury', label: 'Personal injury or illness', lcu: 53 },
  { id: 'marriage', label: 'Marriage or new committed partnership', lcu: 50 },
  { id: 'fired', label: 'Fired or laid off from work', lcu: 47 },
  { id: 'retire', label: 'Retirement', lcu: 45 },
  { id: 'pregnancy', label: 'Pregnancy / new baby', lcu: 40 },
  { id: 'job', label: 'Change to a different line of work', lcu: 36 },
  { id: 'money', label: 'Major change in financial state', lcu: 38 },
  { id: 'school', label: 'Beginning or ending school', lcu: 26 },
  { id: 'move', label: 'Moving house', lcu: 20 },
  { id: 'sleep', label: 'Major change in sleep habits', lcu: 16 },
  { id: 'holiday', label: 'A major holiday (e.g. the festive season)', lcu: 12 },
  { id: 'vacation', label: 'A vacation', lcu: 13 },
]

function band(total: number) {
  if (total >= 300) return { label: 'High risk', color: 'var(--color-danger)', note: 'A heavy load (300+). Statistically, a markedly raised chance of a stress-related health problem in the near future — a cue to lean hard on coping and support.' }
  if (total >= 150) return { label: 'Moderate risk', color: 'var(--color-warn)', note: 'A meaningful load (150–299). About a moderate raised chance of stress-related illness — worth actively managing your coping.' }
  return { label: 'Lower risk', color: 'var(--color-success)', note: 'A lighter load (under 150). Stress-related illness is less likely from life events alone — though how you appraise and cope still matters enormously.' }
}

export function StressScale() {
  const [picked, setPicked] = useState<Record<string, boolean>>({})
  const total = ITEMS.reduce((s, it) => s + (picked[it.id] ? it.lcu : 0), 0)
  const b = band(total)

  const toggle = (id: string) => setPicked((p) => ({ ...p, [id]: !p[id] }))

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Tick any of these life events you've faced in the <span className="font-semibold text-ink">past year</span> — including the happy ones. Each carries “life-change units.”
      </p>

      <div className="grid gap-1.5 sm:grid-cols-2">
        {ITEMS.map((it) => {
          const on = !!picked[it.id]
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => toggle(it.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors',
                on ? 'border-accent bg-accent/15' : 'border-border bg-surface-2 hover:border-accent/40',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border',
                  on ? 'border-accent bg-accent text-bg' : 'border-border text-transparent',
                )}
              >
                <Icon name="Check" size={13} />
              </span>
              <span className={cn('flex-1 text-[12px] leading-tight', on ? 'text-ink' : 'text-muted')}>{it.label}</span>
              <span className={cn('font-mono text-[11px]', on ? 'text-accent' : 'text-muted')}>{it.lcu}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 rounded-xl bg-surface-2 p-3 text-center">
        <p className="text-xs uppercase tracking-wide text-muted">Total life-change units</p>
        <p className="text-3xl font-bold" style={{ color: b.color }}>{total}</p>
        <p className="mt-0.5 text-sm font-semibold" style={{ color: b.color }}>{b.label}</p>
        <p className="mx-auto mt-1 max-w-md text-sm leading-snug text-muted">{b.note}</p>
      </div>

      <p className="mt-2 text-center text-[11px] text-muted">
        A rough screening tool, not a diagnosis — appraisal and coping change everything.
      </p>
    </div>
  )
}
