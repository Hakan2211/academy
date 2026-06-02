import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { SceneSlider } from '#/components/three/SceneSlider'

// The "4 D's" used to judge whether a behaviour is disordered: Deviance,
// Distress, Dysfunction, Danger. Each is a CONTINUUM, not a switch. Slide a
// behaviour's level on each dimension; the verdict shifts gradually as the
// total crosses into "clinical concern" territory — making the point that
// "abnormal" is a judgement on several continua, never a simple yes/no label.
const DIMS = [
  {
    key: 'deviance',
    name: 'Deviance',
    icon: 'GitBranch',
    low: 'typical for the person and their culture',
    high: 'far outside cultural & statistical norms',
  },
  {
    key: 'distress',
    name: 'Distress',
    icon: 'CloudRain',
    low: 'the person feels fine about it',
    high: 'causes the person real, lasting suffering',
  },
  {
    key: 'dysfunction',
    name: 'Dysfunction',
    icon: 'Unplug',
    low: 'daily life, work and relationships are intact',
    high: 'work, relationships & self-care break down',
  },
  {
    key: 'danger',
    name: 'Danger',
    icon: 'ShieldAlert',
    low: 'no risk to self or others',
    high: 'genuine risk of harm to self or others',
  },
] as const

export function AbnormalCriteria() {
  const [vals, setVals] = useState<Record<string, number>>({
    deviance: 3,
    distress: 2,
    dysfunction: 2,
    danger: 1,
  })

  const total = DIMS.reduce((s, d) => s + vals[d.key], 0)
  const max = DIMS.length * 10
  const pct = total / max

  let verdict: { text: string; color: string }
  if (pct < 0.3) {
    verdict = {
      text: 'Within the everyday range — this looks like ordinary human variation, not a disorder.',
      color: 'var(--color-success)',
    }
  } else if (pct < 0.55) {
    verdict = {
      text: 'A grey zone. Some dimensions are raised, but the picture is ambiguous — context and the person’s own view matter enormously here.',
      color: 'var(--color-warn)',
    }
  } else {
    verdict = {
      text: 'Several criteria are clearly elevated, so a clinician would take this seriously — always alongside the person’s story, never from a checklist alone.',
      color: 'var(--color-danger)',
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Psychologists weigh behaviour on the <span className="font-semibold text-ink">four D’s</span>. Each is a
        <span className="font-semibold text-ink"> continuum</span>, not a switch. Slide each dimension and watch the overall picture shift.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {DIMS.map((d) => (
          <div key={d.key} className="rounded-xl border border-border bg-surface-2 p-3">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <Icon name={d.icon} size={16} />
              </span>
              <span className="text-sm font-semibold text-ink">{d.name}</span>
            </div>
            <SceneSlider
              label={d.name}
              value={vals[d.key]}
              min={0}
              max={10}
              step={1}
              unit=""
              onChange={(v) => setVals((p) => ({ ...p, [d.key]: v }))}
            />
            <p className="mt-1 text-xs leading-snug text-muted">
              {vals[d.key] <= 4 ? d.low : d.high}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-3">
        <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(pct * 100).toFixed(0)}%`, background: verdict.color }}
          />
        </div>
        <p className="text-sm leading-relaxed" style={{ color: verdict.color }}>
          {verdict.text}
        </p>
        <p className="mt-1 text-xs text-muted">
          No single dimension decides it. "Abnormal" is a judgement across several continua — and a high score on one alone (being unusual, say) is not a disorder.
        </p>
      </div>
    </div>
  )
}
