import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A respectful gallery of the main anxiety-related disorders. Click one to see
// its core features and — crucially — how it differs from the everyday worry,
// nerves or tidiness that everyone experiences. The boundary is about
// intensity, persistence and how much it interferes with a person's life.
const DISORDERS = [
  {
    name: 'Generalized Anxiety',
    short: 'GAD',
    icon: 'Wind',
    symptoms:
      'Persistent, free-floating worry about many everyday things, most days for months, with restlessness, tension and trouble concentrating.',
    everyday:
      'Everyone worries before a big event. In GAD the worry is constant, hard to control, and not tied to any one threat — the dial is simply stuck on "high".',
  },
  {
    name: 'Panic Disorder',
    short: 'Panic',
    icon: 'HeartPulse',
    symptoms:
      'Sudden, intense surges of fear — racing heart, breathlessness, dizziness, a sense of doom — that peak within minutes, plus dread of the next attack.',
    everyday:
      'A scare makes anyone’s heart pound. A panic attack arrives like a false alarm, often out of nowhere, and feels physically catastrophic even though it is not dangerous.',
  },
  {
    name: 'Specific Phobia',
    short: 'Phobia',
    icon: 'Bug',
    symptoms:
      'Intense, out-of-proportion fear of a particular object or situation (heights, flying, spiders, needles) that is actively avoided.',
    everyday:
      'Many people dislike spiders. A phobia is when the fear is so strong it triggers panic and reshapes daily choices to avoid the trigger.',
  },
  {
    name: 'Social Anxiety',
    short: 'Social',
    icon: 'Users',
    symptoms:
      'Marked fear of being judged or embarrassed in social or performance situations, leading to avoidance or intense dread.',
    everyday:
      'Shyness and pre-presentation nerves are normal. Social anxiety makes ordinary interactions feel threatening enough to avoid altogether.',
  },
  {
    name: 'OCD',
    short: 'OCD',
    icon: 'RefreshCw',
    symptoms:
      'Intrusive, unwanted thoughts (obsessions) that spike anxiety, and repetitive rituals (compulsions) — checking, washing, counting — done to relieve it.',
    everyday:
      'Liking things tidy is a preference. In OCD the thoughts are distressing and the rituals feel compulsory, eating up hours and bringing only brief relief.',
  },
] as const

export function AnxietyDisorders() {
  const [sel, setSel] = useState(0)
  const d = DISORDERS[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {DISORDERS.map((dis, i) => (
          <button
            key={dis.name}
            type="button"
            onClick={() => setSel(i)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors',
              i === sel ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={dis.icon} size={14} />
            {dis.short}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-surface-2 p-4">
        <p className="text-base font-semibold text-ink">{d.name}</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-accent">What it looks like</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{d.symptoms}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-success">How it differs from everyday worry</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{d.everyday}</p>
      </div>

      <p className="mt-2 text-xs text-muted">
        These are people <span className="text-ink">experiencing</span> a condition, not "anxious people". Anxiety disorders are common and very treatable.
      </p>
    </div>
  )
}
