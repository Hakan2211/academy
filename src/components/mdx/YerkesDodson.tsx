import { useState } from 'react'
import { SceneSlider } from '#/components/three/SceneSlider'
import { cn } from '#/lib/cn'

// The Yerkes-Dodson law: performance is an inverted-U of arousal. A little
// arousal helps; too much hurts. Simple tasks peak at higher arousal than hard
// ones. Reused in Motivation & Emotion (optimal arousal) and Stress & Health
// (eustress vs distress).
const W = 360
const H = 230
const PAD = 30

type Task = 'simple' | 'hard'

export function YerkesDodson() {
  const [arousal, setArousal] = useState(5)
  const [task, setTask] = useState<Task>('hard')

  // Peak arousal: simple tasks tolerate more arousal before declining.
  const peakAt = task === 'simple' ? 7.5 : 5
  const width = task === 'simple' ? 5.5 : 4
  const perf = (a: number) => Math.exp(-((a - peakAt) ** 2) / (2 * width ** 2))

  const xOf = (a: number) => PAD + (a / 10) * (W - 2 * PAD)
  const yOf = (p: number) => H - PAD - p * (H - 2 * PAD)

  const N = 100
  const curve = Array.from({ length: N + 1 }, (_, i) => {
    const a = (10 * i) / N
    return `${i ? 'L' : 'M'}${xOf(a).toFixed(1)} ${yOf(perf(a)).toFixed(1)}`
  }).join(' ')

  const p = perf(arousal)
  const zone =
    arousal < peakAt - width
      ? { label: 'Under-aroused — bored, sluggish', color: 'var(--color-muted)' }
      : arousal > peakAt + width
        ? { label: 'Over-aroused — anxious, overwhelmed', color: '#E74C3C' }
        : { label: 'In the zone — focused and sharp', color: 'var(--color-success)' }

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="flex gap-2 px-1 pb-2">
        {(['simple', 'hard'] as Array<Task>).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTask(t)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              task === t
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {t} task
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={PAD} y1={H - PAD} x2={PAD} y2={PAD} stroke="var(--color-border)" strokeWidth="1.5" />
        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
          Arousal →
        </text>
        <text x={12} y={H / 2} textAnchor="middle" fontSize="10" fill="var(--color-muted)" transform={`rotate(-90 12 ${H / 2})`}>
          Performance →
        </text>
        <path d={curve} fill="none" stroke="var(--color-accent-2)" strokeWidth="2.5" />
        <line x1={xOf(arousal)} y1={H - PAD} x2={xOf(arousal)} y2={yOf(p)} stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx={xOf(arousal)} cy={yOf(p)} r="6" fill="var(--color-accent)" />
      </svg>

      <div className="px-1 pt-1">
        <SceneSlider label="Arousal" value={arousal} min={0} max={10} step={0.1} unit="" onChange={setArousal} />
        <p className="mt-2 text-center text-sm font-medium" style={{ color: zone.color }}>
          {zone.label}
        </p>
      </div>
    </div>
  )
}
