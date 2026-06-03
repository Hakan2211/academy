import { useState } from 'react'
import { cn } from '#/lib/cn'

type Level = {
  label: string
  description: string
  guidance: string
  zone: 'danger-low' | 'ideal-eat' | 'comfortable' | 'ideal-stop' | 'danger-high'
}

const LEVELS: Array<Level> = [
  {
    label: '1 — Starving',
    description: 'Dizzy, headache, shaky, can\'t concentrate.',
    guidance: 'You waited too long. Eating now risks rapid over-eating before fullness signals catch up.',
    zone: 'danger-low',
  },
  {
    label: '2 — Very hungry',
    description: 'Stomach growling loudly, irritable, low energy.',
    guidance: 'Still risky — the urge to eat fast is strong. Try to slow down deliberately.',
    zone: 'danger-low',
  },
  {
    label: '3 — Hungry',
    description: 'Definite hunger signals, stomach empty, ready to eat.',
    guidance: '✓ Good time to start eating. Your body genuinely needs fuel.',
    zone: 'ideal-eat',
  },
  {
    label: '4 — Mildly hungry',
    description: 'Slight hunger, could eat but not urgent.',
    guidance: '✓ Also a good time to eat — you can make thoughtful food choices rather than grabbing anything.',
    zone: 'ideal-eat',
  },
  {
    label: '5 — Neutral',
    description: 'Neither hungry nor full. Comfortable baseline.',
    guidance: 'You\'re in balance. Eating now is emotional or habitual rather than physical hunger.',
    zone: 'comfortable',
  },
  {
    label: '6 — Satisfied',
    description: 'Pleasantly full. Enough food, energy returning.',
    guidance: '✓ Good time to stop. Your body has what it needs. The next 20 minutes will confirm fullness.',
    zone: 'ideal-stop',
  },
  {
    label: '7 — Full',
    description: 'Noticeably full. Slightly more than needed.',
    guidance: '✓ Stopping here is still fine — just a little over the ideal. Honour the fullness signal.',
    zone: 'ideal-stop',
  },
  {
    label: '8 — Very full',
    description: 'Uncomfortably stuffed. Clothes feel tight.',
    guidance: 'Over-eaten. Common after distracted eating or eating too fast for fullness signals to register.',
    zone: 'danger-high',
  },
  {
    label: '9 — Stuffed',
    description: 'Bloated, sluggish, possible nausea.',
    guidance: 'Well past fullness. The 20-minute signal wasn\'t heeded. Rest and let digestion do its work.',
    zone: 'danger-high',
  },
  {
    label: '10 — Painfully full',
    description: 'Physically distressed. Can barely move.',
    guidance: 'Extreme discomfort. Your body is signalling clearly — respect these cues every meal.',
    zone: 'danger-high',
  },
]

const ZONE_STYLE: Record<Level['zone'], string> = {
  'danger-low': 'border-warn/60 bg-warn/10 text-warn',
  'ideal-eat': 'border-success/60 bg-success/10 text-success',
  'comfortable': 'border-accent-2/60 bg-accent-2/10 text-accent-2',
  'ideal-stop': 'border-accent/60 bg-accent/10 text-accent',
  'danger-high': 'border-warn/60 bg-warn/10 text-warn',
}

const ZONE_LABEL: Record<Level['zone'], string> = {
  'danger-low': 'Too hungry — eat soon',
  'ideal-eat': 'Good time to eat',
  'comfortable': 'Neutral / not hungry',
  'ideal-stop': 'Good time to stop',
  'danger-high': 'Over-eaten',
}

export function HungerScale() {
  const [selected, setSelected] = useState<number | null>(null)
  const level = selected !== null ? LEVELS[selected] : null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Click the number that best matches how you feel <span className="text-ink font-medium">right now</span>.
      </p>

      {/* Scale buttons */}
      <div className="flex gap-1 mb-4">
        {LEVELS.map((l, i) => {
          const isSelected = selected === i
          const zone = l.zone
          let btnClass = ''
          if (isSelected) {
            if (zone === 'ideal-eat' || zone === 'ideal-stop') {
              btnClass = 'border-accent bg-accent/20 text-accent font-bold'
            } else if (zone === 'comfortable') {
              btnClass = 'border-accent-2 bg-accent-2/20 text-accent-2 font-bold'
            } else {
              btnClass = 'border-warn bg-warn/20 text-warn font-bold'
            }
          } else {
            btnClass = 'border-border text-muted hover:text-ink hover:border-border'
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={cn(
                'flex-1 rounded-lg border py-2 text-sm transition-colors',
                btnClass,
              )}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        {(
          [
            ['danger-low', 'Too hungry'],
            ['ideal-eat', 'Ideal: eat'],
            ['comfortable', 'Neutral'],
            ['ideal-stop', 'Ideal: stop'],
            ['danger-high', 'Over-eaten'],
          ] as Array<[Level['zone'], string]>
        ).map(([zone, lbl]) => (
          <span
            key={zone}
            className={cn('rounded-full border px-2 py-0.5', ZONE_STYLE[zone])}
          >
            {lbl}
          </span>
        ))}
      </div>

      {/* Detail panel */}
      {level ? (
        <div className={cn('rounded-xl border p-4 space-y-2', ZONE_STYLE[level.zone])}>
          <div className="font-semibold text-sm">{level.label}</div>
          <p className="text-sm opacity-90">{level.description}</p>
          <div className="mt-2 rounded-lg border border-border/40 bg-surface/60 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-1">
              {ZONE_LABEL[level.zone]}
            </p>
            <p className="text-sm text-ink">{level.guidance}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface-2 p-4 text-center text-sm text-muted">
          Select a number above to see what it means and when to eat or stop.
        </div>
      )}

      <p className="mt-3 text-xs text-muted text-center">
        The 20-minute rule: fullness signals from the gut take ~20 minutes to reach the brain.
        Eating slowly gives your body time to register satisfaction before you over-eat.
      </p>
    </div>
  )
}
