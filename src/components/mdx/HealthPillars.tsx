import { useState } from 'react'
import { cn } from '#/lib/cn'

// The interconnected pillars of a healthy life.
// Click a pillar to see its evidence-based one-liner and how it supports the others.
// Owner: healthy-living (W15).

type Pillar = {
  key: string
  label: string
  icon: string
  color: string
  summary: string
  reinforces: string[]
  detail: string
}

const PILLARS: Array<Pillar> = [
  {
    key: 'sleep',
    label: 'Sleep',
    icon: '🌙',
    color: '#7B68EE',
    summary: '7–9 hours repairs every system in the body — and the brain.',
    reinforces: ['nutrition', 'mind', 'movement'],
    detail:
      'Sleep is when the brain clears waste products, consolidates memory, and resets emotional regulation. Chronic short sleep raises the risk of obesity, type 2 diabetes, heart disease, and depression. Good sleep makes movement easier, food choices better, and stress more manageable — it props up every other pillar.',
  },
  {
    key: 'nutrition',
    label: 'Nutrition',
    icon: '🥦',
    color: '#2ECC71',
    summary: 'Mostly whole foods, mostly plants — the pattern that keeps appearing in research.',
    reinforces: ['sleep', 'movement', 'connection'],
    detail:
      'No single food makes or breaks health. What matters is the overall pattern over months and years: plenty of vegetables, fruit, legumes, wholegrains, and lean protein; limited ultra-processed food. Good nutrition fuels better sleep, supports energy for movement, and even influences mood and social confidence.',
  },
  {
    key: 'movement',
    label: 'Movement',
    icon: '🏃',
    color: '#F39C12',
    summary: '150 min/week of moderate activity is one of the most replicated health findings.',
    reinforces: ['sleep', 'mind', 'connection'],
    detail:
      "Regular physical activity is uniquely powerful: it lowers cardiovascular disease, type 2 diabetes, several cancers, depression, and cognitive decline — all at once. It improves sleep quality, sharpens mood via endorphins, and is often social. You don't need a gym: brisk walking counts.",
  },
  {
    key: 'connection',
    label: 'Connection',
    icon: '🤝',
    color: '#E74C3C',
    summary: 'Loneliness is as harmful as smoking 15 cigarettes a day (meta-analysis, Holt-Lunstad 2015).',
    reinforces: ['mind', 'movement', 'nutrition'],
    detail:
      'Strong social ties are consistently one of the strongest predictors of longevity and well-being. They buffer stress, encourage healthy behaviours, and give a sense of purpose. People in close relationships tend to exercise more, eat better, and sleep more soundly — connection amplifies every other pillar.',
  },
  {
    key: 'mind',
    label: 'Mind & Stress',
    icon: '🧘',
    color: '#3498DB',
    summary: 'Chronic stress degrades nearly every biological system; managing it protects them all.',
    reinforces: ['sleep', 'nutrition', 'connection'],
    detail:
      "Chronic psychological stress elevates cortisol and inflammatory markers, disrupts sleep, suppresses immunity, and drives comfort-eating. Protective practices — mindfulness, adequate rest, nature exposure, creative activity, therapy — are not luxuries. They break the stress cycle that otherwise erodes every other pillar.",
  },
  {
    key: 'avoid',
    label: 'Avoiding Harm',
    icon: '🚭',
    color: '#95A5A6',
    summary: "Not smoking and moderating alcohol remove two of the largest preventable risks.",
    reinforces: ['sleep', 'nutrition', 'movement'],
    detail:
      "Smoking is still the leading preventable cause of death. Excess alcohol raises the risk of liver disease, several cancers, and mental-health problems. Avoiding or quitting these isn't about perfection — even partial reduction has measurable benefits. Removing these harms clears the way for every positive pillar to work better.",
  },
]

export function HealthPillars() {
  const [active, setActive] = useState<string | null>(null)

  const selected = PILLARS.find((p) => p.key === active) ?? null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Click a pillar to see the evidence and how it reinforces the others.
      </p>

      {/* Pillar grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PILLARS.map((p) => {
          const isActive = active === p.key
          const isReinforced = selected?.reinforces.includes(p.key) ?? false
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setActive(isActive ? null : p.key)}
              className={cn(
                'rounded-xl border px-3 py-3 text-left transition-all duration-200',
                isActive
                  ? 'border-accent bg-accent/15 text-ink'
                  : isReinforced
                  ? 'border-border bg-surface-2 text-ink ring-1 ring-inset ring-accent/30'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="text-lg">{p.icon}</span>
                {isReinforced && !isActive && (
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-accent">
                    reinforced
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold" style={{ color: isActive ? p.color : undefined }}>
                {p.label}
              </div>
              <div className="mt-0.5 text-xs text-muted leading-snug">{p.summary}</div>
            </button>
          )
        })}
      </div>

      {/* Detail panel */}
      {selected && (
        <div
          className="mt-4 rounded-xl border p-4 transition-all"
          style={{ borderColor: selected.color + '55', background: selected.color + '10' }}
        >
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xl">{selected.icon}</span>
            <span className="text-base font-bold" style={{ color: selected.color }}>
              {selected.label}
            </span>
          </div>
          <p className="text-sm text-ink leading-relaxed">{selected.detail}</p>
          {selected.reinforces.length > 0 && (
            <p className="mt-2 text-xs text-muted">
              <span className="font-semibold">Reinforces: </span>
              {selected.reinforces
                .map((k) => PILLARS.find((p) => p.key === k)?.label)
                .filter(Boolean)
                .join(', ')}
            </p>
          )}
        </div>
      )}

      <p className="mt-3 text-xs text-muted">
        No pillar works alone — they prop each other up. Improving one tends to make the others easier.
        You don't need perfection in all: consistent progress across most is more powerful than perfection in one.
      </p>
    </div>
  )
}
