import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The four classic theories of motivation, side by side. Each answers the same
// question — "what gets behaviour going?" — but locates the engine somewhere
// different: inside us as fixed instinct, as a push to relieve a need, as a pull
// toward an ideal level of stimulation, or as a pull from outside rewards.
type Theory = 'instinct' | 'drive' | 'arousal' | 'incentive'

const THEORIES: Record<
  Theory,
  {
    name: string
    icon: string
    color: string
    pushPull: string
    idea: string
    example: string
    limit: string
  }
> = {
  instinct: {
    name: 'Instinct',
    icon: 'Bird',
    color: '#FF7043',
    pushPull: 'Pushed from within (inborn)',
    idea: 'We are born pre-wired with fixed, unlearned patterns that drive behaviour — like a bird building a nest without ever being taught.',
    example: 'A newborn rooting and sucking at a touch on the cheek; the urge to flee a looming shadow.',
    limit: 'Naming a behaviour an "instinct" only labels it — it does not explain *why* it exists or account for how much we learn.',
  },
  drive: {
    name: 'Drive-reduction',
    icon: 'BatteryLow',
    color: '#FFA726',
    pushPull: 'Pushed by need (to restore balance)',
    idea: 'A physical need creates an unpleasant tension (a drive); we act to reduce it and return the body to balance — homeostasis.',
    example: 'Going hours without water builds a thirst drive; you drink, the drive falls, the body is back at its set point.',
    limit: 'Cannot explain why we *seek* tension — riding roller-coasters or staying curious when no need is unmet.',
  },
  arousal: {
    name: 'Optimal arousal',
    icon: 'Activity',
    color: '#26A69A',
    pushPull: 'Pulled toward a "just right" level',
    idea: 'We act to keep stimulation at a comfortable level — seeking it when bored, dialling it down when overwhelmed.',
    example: 'A bored teenager picks a thrill; a frazzled worker craves a quiet evening. Both chase the middle.',
    limit: 'The ideal level differs by person and task (see the Yerkes-Dodson inverted-U) — there is no single setpoint for all.',
  },
  incentive: {
    name: 'Incentive',
    icon: 'Carrot',
    color: '#42A5F5',
    pushPull: 'Pulled from outside (by rewards)',
    idea: 'Behaviour is pulled by external goals — incentives. We are drawn toward rewards and away from punishments, even with no internal need.',
    example: 'You are full, yet the dessert trolley still tempts you; a bonus pulls you to work an extra hour.',
    limit: 'Downplays inner drives and can crowd out genuine, intrinsic interest in a task (the overjustification effect).',
  },
}

const ORDER: Array<Theory> = ['instinct', 'drive', 'arousal', 'incentive']

export function MotivationTheories() {
  const [theory, setTheory] = useState<Theory>('drive')
  const t = THEORIES[theory]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {ORDER.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setTheory(k)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors',
              theory === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={THEORIES[k].icon} size={14} />
            {THEORIES[k].name}
          </button>
        ))}
      </div>

      {/* push / pull diagram: where is the engine of behaviour? */}
      <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl bg-surface-2 p-3 text-center">
        <div className={cn('text-xs font-semibold', t.pushPull.startsWith('Push') ? 'text-accent' : 'text-muted')}>
          PUSH
          <p className="mt-0.5 font-normal text-muted">a force inside us</p>
        </div>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: `${t.color}22`, color: t.color }}
        >
          <Icon name="User" size={18} />
        </span>
        <div className={cn('text-xs font-semibold', t.pushPull.startsWith('Pull') ? 'text-accent' : 'text-muted')}>
          PULL
          <p className="mt-0.5 font-normal text-muted">a goal out in the world</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface-2 p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${t.color}22`, color: t.color }}>
            <Icon name={t.icon} size={16} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{t.name} theory</p>
            <p className="text-xs font-medium" style={{ color: t.color }}>{t.pushPull}</p>
          </div>
        </div>
        <p className="mt-2 text-sm leading-snug text-ink">{t.idea}</p>
        <p className="mt-2 text-sm leading-snug text-muted">
          <span className="font-medium text-ink">Example: </span>{t.example}
        </p>
        <p className="mt-2 text-sm leading-snug text-muted">
          <span className="font-medium text-ink">But: </span>{t.limit}
        </p>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        No single theory wins. Real motivation mixes inner <span className="text-ink">pushes</span> and outer <span className="text-ink">pulls</span>.
      </p>
    </div>
  )
}
