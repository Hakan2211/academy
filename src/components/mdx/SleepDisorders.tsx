import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A gallery of common sleep disorders. Click a card to read what it feels like,
// what goes wrong, and which part of the sleep cycle it disrupts. Most are far
// more common than people assume, and several are very treatable.
type Disorder = {
  key: string
  name: string
  icon: string
  color: string
  tagline: string
  symptoms: string
  cause: string
  stage: string
}

const DISORDERS: ReadonlyArray<Disorder> = [
  {
    key: 'insomnia',
    name: 'Insomnia',
    icon: 'EyeOff',
    color: '#FDCB6E',
    tagline: 'Can’t fall or stay asleep.',
    symptoms:
      'Persistent trouble falling asleep, waking through the night, or waking too early — leaving you tired and foggy by day, despite the chance to sleep.',
    cause:
      'Often stress, anxiety, or worry about sleep itself (a vicious cycle), plus caffeine, screens and irregular schedules. The arousal system stays switched on.',
    stage: 'Disrupts sleep onset and continuity across all stages.',
  },
  {
    key: 'apnea',
    name: 'Sleep apnea',
    icon: 'Wind',
    color: '#74B9FF',
    tagline: 'Breathing repeatedly stops.',
    symptoms:
      'Loud snoring, gasping, and breathing that pauses dozens of times an hour. The sleeper rarely notices but wakes unrefreshed, with daytime sleepiness.',
    cause:
      'The airway collapses or the brain briefly stops signalling to breathe; each pause jolts the brain toward waking, shattering deep sleep.',
    stage: 'Fragments deep N3 and REM — you never get enough restorative sleep.',
  },
  {
    key: 'narcolepsy',
    name: 'Narcolepsy',
    icon: 'Zap',
    color: '#E056FD',
    tagline: 'Sudden, uncontrollable sleep.',
    symptoms:
      'Overwhelming daytime sleep attacks and sometimes cataplexy — a sudden loss of muscle tone triggered by strong emotion, as if REM paralysis intrudes on waking life.',
    cause:
      'Loss of brain cells that make orexin (hypocretin), the chemical that stabilises wakefulness, so the boundary between wake and REM breaks down.',
    stage: 'REM intrudes into wakefulness — the person can drop straight into REM.',
  },
  {
    key: 'night-terrors',
    name: 'Night terrors',
    icon: 'AlertTriangle',
    color: '#FF7675',
    tagline: 'Panicked arousal from deep sleep.',
    symptoms:
      'A sudden scream, racing heart, wide eyes and terror — yet the person is not truly awake and, crucially, remembers nothing in the morning. Most common in children.',
    cause:
      'A partial arousal out of deep N3 sleep, not a dream (which would be REM). The body’s alarm fires while the conscious mind stays offline.',
    stage: 'Arises from deep N3 sleep, usually early in the night.',
  },
  {
    key: 'sleepwalking',
    name: 'Sleepwalking',
    icon: 'Footprints',
    color: '#00D2D3',
    tagline: 'Acting out while still asleep.',
    symptoms:
      'Sitting up, walking, even talking or eating — eyes open but unseeing — with no memory of it afterward. Hard to wake and usually harmless if guided back to bed.',
    cause:
      'Like night terrors, a partial arousal from deep N3 sleep where the motor system switches on but consciousness does not. Often runs in families.',
    stage: 'Arises from deep N3 sleep, in the first half of the night.',
  },
]

export function SleepDisorders() {
  const [sel, setSel] = useState<string | null>('insomnia')
  const active = DISORDERS.find((d) => d.key === sel) ?? null

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {DISORDERS.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setSel(d.key === sel ? null : d.key)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors',
              d.key === sel
                ? 'border-accent bg-accent/10'
                : 'border-border hover:border-accent/50',
            )}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: `${d.color}22`, color: d.color }}
            >
              <Icon name={d.icon} size={18} />
            </span>
            <span className="text-xs font-semibold text-ink">{d.name}</span>
            <span className="text-[10px] leading-tight text-muted">{d.tagline}</span>
          </button>
        ))}
      </div>

      {active && (
        <div className="mt-3 rounded-xl bg-surface-2 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: active.color }}>
            <Icon name={active.icon} size={16} />
            {active.name}
          </p>
          <div className="mt-2 space-y-2">
            <p className="text-sm leading-snug text-muted">
              <span className="font-medium text-ink">What it feels like — </span>
              {active.symptoms}
            </p>
            <p className="text-sm leading-snug text-muted">
              <span className="font-medium text-ink">What goes wrong — </span>
              {active.cause}
            </p>
            <p className="text-sm leading-snug text-muted">
              <span className="font-medium text-ink">In the sleep cycle — </span>
              {active.stage}
            </p>
          </div>
        </div>
      )}
      {!active && (
        <p className="mt-3 text-center text-sm text-muted">Tap a disorder to see its symptoms and cause.</p>
      )}
    </div>
  )
}
