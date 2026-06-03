import { useState } from 'react'
import { cn } from '#/lib/cn'
import { clamp } from '#/lib/health'

// The capstone component. Toggle Blue Zones / cohort-study lifestyle factors
// and watch a "healthspan" gauge respond. Framed as shifting odds, not guarantees.
// Owner: healthy-living (W15).

type Factor = {
  key: string
  label: string
  icon: string
  description: string
  impact: number // 0–10, additive contribution to gauge
  source: string
}

const FACTORS: Array<Factor> = [
  {
    key: 'movement',
    label: 'Regular natural movement',
    icon: '🚶',
    description: "Blue Zones residents don't run marathons — they walk, garden, and use their bodies throughout the day. 150+ min/week of moderate activity adds roughly 3–5 years of healthy life expectancy in large cohort studies.",
    impact: 16,
    source: 'Blue Zones; WHO Physical Activity Guidelines',
  },
  {
    key: 'plants',
    label: 'Mostly-plant diet',
    icon: '🌱',
    description: 'A diet rich in vegetables, legumes, wholegrains, and limited ultra-processed food is the consistent pattern across populations with the highest life expectancy. Meat is occasional, not daily, in most Blue Zones.',
    impact: 14,
    source: 'Blue Zones; PREDIMED trial',
  },
  {
    key: 'hara',
    label: 'Not overeating (80% rule)',
    icon: '🍽️',
    description: "The Okinawan concept of hara hachi bu — eat until 80% full. Caloric restriction without malnutrition is one of the most replicated longevity interventions in animal studies; moderate calorie reduction in humans is associated with lower metabolic disease risk.",
    impact: 10,
    source: 'Okinawan tradition; caloric restriction research',
  },
  {
    key: 'purpose',
    label: 'Sense of purpose',
    icon: '🎯',
    description: "Ikigai (Japan) and plan de vida (Costa Rica) — a reason to get up in the morning. Having a clear sense of purpose is associated with a 7-year advantage in longevity in prospective studies and lower risk of Alzheimer's disease.",
    impact: 13,
    source: 'Hill & Turiano, Psychological Science 2014',
  },
  {
    key: 'downshift',
    label: 'Downshifting stress',
    icon: '😮‍💨',
    description: 'Blue Zones communities have built-in stress-relief practices: prayer, ancestor veneration, napping (Sardinia), happy hour with friends. Chronic stress is a direct pathway to inflammation and accelerated aging.',
    impact: 12,
    source: 'Blue Zones; cortisol/inflammation research',
  },
  {
    key: 'social',
    label: 'Strong social ties',
    icon: '👥',
    description: 'The Alameda County study and Harvard Study of Adult Development (80+ years of data) both find that close relationships are the single strongest predictor of wellbeing and longevity — stronger than wealth or fame.',
    impact: 15,
    source: 'Berkman & Syme 1979; Waldinger 2015',
  },
  {
    key: 'belonging',
    label: 'Belonging (faith or community)',
    icon: '🕌',
    description: 'Attending a faith or community gathering 4 times/month is associated with 4–14 extra years of life expectancy in studies. The mechanism is partly social, partly purpose, partly stress-buffering — and it applies to non-religious community too.',
    impact: 9,
    source: 'Blue Zones; Li et al. JAMA Internal Medicine 2016',
  },
  {
    key: 'nosmoke',
    label: 'Not smoking',
    icon: '🚭',
    description: "Non-smokers live on average 10 years longer than smokers. Quitting at 40 recovers most of that advantage. Even quitting at 60 or 70 meaningfully reduces risk. It's the single largest modifiable risk factor for premature death.",
    impact: 11,
    source: 'Doll et al. BMJ 2004; CDC data',
  },
]

const TOTAL_IMPACT = FACTORS.reduce((s, f) => s + f.impact, 0)

function gaugeLabel(pct: number): string {
  if (pct < 15) return 'Baseline'
  if (pct < 35) return 'Some protection'
  if (pct < 55) return 'Moderate benefit'
  if (pct < 75) return 'Strong foundation'
  if (pct < 90) return 'Blue Zone territory'
  return 'Evidence-based optimum'
}

function gaugeColor(pct: number): string {
  if (pct < 35) return '#F39C12'
  if (pct < 65) return '#2ECC71'
  return '#27AE60'
}

export function LongevityFactors() {
  const [active, setActive] = useState<Set<string>>(new Set())
  const [detail, setDetail] = useState<string | null>(null)

  function toggle(key: string) {
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
        if (detail === key) setDetail(null)
      } else {
        next.add(key)
        setDetail(key)
      }
      return next
    })
  }

  const score = FACTORS.filter((f) => active.has(f.key)).reduce((s, f) => s + f.impact, 0)
  const pct = clamp(Math.round((score / TOTAL_IMPACT) * 100), 0, 100)
  const selectedFactor = detail ? FACTORS.find((f) => f.key === detail) : null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm text-muted">
        Toggle the evidence-based lifestyle factors from longevity research — see the healthspan gauge
        respond.
      </p>
      <p className="mb-4 text-xs text-muted">
        These shift the <em>odds</em> of a long, healthy life — they are not guarantees. But the evidence is unusually consistent.
      </p>

      {/* Factor grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {FACTORS.map((f) => {
          const on = active.has(f.key)
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => toggle(f.key)}
              className={cn(
                'flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
                on
                  ? 'border-accent bg-accent/15 text-ink'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              <span className="mt-0.5 text-lg">{f.icon}</span>
              <div className="min-w-0">
                <div className={cn('text-sm font-medium', on ? 'text-accent' : 'text-ink')}>
                  {f.label}
                </div>
                <div className="text-xs text-muted">impact weight: {f.impact}/100</div>
              </div>
              <span className="ml-auto shrink-0 text-lg">{on ? '✓' : '○'}</span>
            </button>
          )
        })}
      </div>

      {/* Detail panel */}
      {selectedFactor && (
        <div className="mt-4 rounded-xl border border-accent/40 bg-accent/5 p-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-lg">{selectedFactor.icon}</span>
            <span className="text-sm font-bold text-accent">{selectedFactor.label}</span>
          </div>
          <p className="text-sm leading-relaxed text-ink">{selectedFactor.description}</p>
          <p className="mt-1.5 text-xs text-muted">Source: {selectedFactor.source}</p>
        </div>
      )}

      {/* Gauge */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Healthspan potential</span>
          <span className="font-bold" style={{ color: gaugeColor(pct) }}>
            {gaugeLabel(pct)}
          </span>
        </div>
        <div className="h-5 w-full overflow-hidden rounded-full border border-border bg-surface-2">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(to right, #F39C12, ${gaugeColor(pct)})`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted">
          <span>Baseline ({active.size === 0 ? 'none selected' : '—'})</span>
          <span>{pct}%</span>
          <span>Evidence optimum</span>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">
        You don't need all eight. Each factor stacks independently — even 3 or 4 consistent habits
        produce measurable benefit. The goal isn't perfection; it's compounding small shifts over decades.
      </p>
    </div>
  )
}
