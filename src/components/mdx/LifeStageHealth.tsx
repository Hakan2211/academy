import { useState } from 'react'
import { cn } from '#/lib/cn'

// Select a life stage to see the key health priorities for that phase,
// with the reassuring note that healthy change is never too late.
// Owner: healthy-living (W15).

type Priority = {
  label: string
  detail: string
}

type Stage = {
  key: string
  label: string
  ageRange: string
  icon: string
  color: string
  priorities: Array<Priority>
  neverTooLate: string
}

const STAGES: Array<Stage> = [
  {
    key: 'childhood',
    label: 'Childhood',
    ageRange: '0–12',
    icon: '🧒',
    color: '#F39C12',
    priorities: [
      {
        label: 'Sleep & growth',
        detail: "Children need 9–12 hours of sleep. Deep sleep is when growth hormone is released — it's not just rest, it's development.",
      },
      {
        label: 'Movement as play',
        detail: 'At least 60 min of moderate-to-vigorous activity daily. Active play builds motor skills, bone density, and the habit of movement before it feels like exercise.',
      },
      {
        label: 'Vaccination',
        detail: 'Childhood immunisation schedules protect against diseases that were once major causes of childhood death and disability. Herd immunity protects those who cannot be vaccinated.',
      },
      {
        label: 'Building habits early',
        detail: 'Eating vegetables, regular sleep, tooth-brushing — habits embedded in childhood are carried forward with less effort. The brain is especially plastic at this stage.',
      },
    ],
    neverTooLate: 'Many adult health outcomes trace to childhood exposures — but later healthy habits can override early disadvantage. The brain and body remain plastic.',
  },
  {
    key: 'adolescence',
    label: 'Adolescence',
    ageRange: '13–24',
    icon: '🧑',
    color: '#9B59B6',
    priorities: [
      {
        label: 'Mental health',
        detail: "75% of lifetime mental health conditions begin before age 24. Adolescence is the peak window for onset of anxiety, depression, and eating disorders — and for intervention. Talking openly matters.",
      },
      {
        label: 'Identity & risk-taking',
        detail: 'The prefrontal cortex (decision-making) is not fully developed until the mid-20s. Adolescents are biologically more reward-seeking and risk-tolerant — environments that reduce dangerous risk exposure protect long-term health.',
      },
      {
        label: 'Sleep (later, longer)',
        detail: 'Puberty shifts the circadian clock 1–2 hours later. Teens genuinely need 8–10 hours and have difficulty falling asleep early — this is biology, not laziness.',
      },
      {
        label: 'Screen & social media balance',
        detail: 'Emerging evidence links heavy social-media use (especially passive scrolling, late at night) with higher rates of anxiety and lower self-esteem in adolescents. Active, connective use is less harmful than passive comparison.',
      },
    ],
    neverTooLate: "Mental health problems that begin in adolescence respond well to evidence-based treatment at any age. The brain's neuroplasticity remains high through the 20s.",
  },
  {
    key: 'adulthood',
    label: 'Adulthood',
    ageRange: '25–64',
    icon: '🧑‍💼',
    color: '#2ECC71',
    priorities: [
      {
        label: 'Prevention & screening',
        detail: 'Most chronic diseases (heart disease, type 2 diabetes, certain cancers) develop slowly over decades. Regular check-ups, blood-pressure monitoring, cholesterol and blood-sugar screening catch changes early, when they are easiest to reverse.',
      },
      {
        label: 'Stress management',
        detail: 'Adulthood is typically peak-stress time: careers, finances, parenting, caregiving. Chronic occupational stress is a significant predictor of cardiovascular disease. Regular recovery — even brief — is not optional.',
      },
      {
        label: 'Maintaining movement',
        detail: 'Activity levels drop sharply in the 30s and 40s for most people. 150 min/week of moderate activity maintained through adulthood dramatically reduces chronic disease risk later. The window to act is now — not after retirement.',
      },
      {
        label: 'Social connection',
        detail: 'Social networks tend to shrink in busy adulthood. Actively investing in friendships and community is a health behaviour — loneliness is a greater mortality risk than obesity.',
      },
    ],
    neverTooLate: "Starting exercise, quitting smoking, or improving diet in your 40s or 50s still sharply reduces disease risk. The body's repair mechanisms respond to healthier inputs at every adult age.",
  },
  {
    key: 'older',
    label: 'Older adulthood',
    ageRange: '65+',
    icon: '🧓',
    color: '#3498DB',
    priorities: [
      {
        label: 'Strength & balance',
        detail: 'Falls are the leading cause of injury-related hospitalisation in older adults. Resistance training preserves muscle mass (which declines ~1% per year after 30 without training) and balance training cuts fall risk by up to 30%.',
      },
      {
        label: 'Cognitive engagement',
        detail: 'Mentally stimulating activities — learning new skills, reading, social interaction, even challenging board games — are associated with lower dementia risk. The brain benefits from lifelong learning.',
      },
      {
        label: 'Social ties & purpose',
        detail: 'Retirement can reduce social contact sharply. Maintaining purposeful activity — volunteering, mentoring, community involvement — is strongly associated with better mental health and lower mortality in older age.',
      },
      {
        label: 'Medication review',
        detail: 'Older adults often take multiple medications (polypharmacy). Regular reviews with a GP can identify interactions and remove drugs that are no longer needed — a genuine quality-of-life and safety gain.',
      },
    ],
    neverTooLate: "Starting strength training in your 70s still increases muscle mass and reduces fall risk. Multiple studies show even 80+ year-olds gain meaningful function from supervised resistance exercise. It is genuinely never too late.",
  },
]

export function LifeStageHealth() {
  const [active, setActive] = useState<string>('childhood')
  const [openPriority, setOpenPriority] = useState<string | null>(null)

  const stage = STAGES.find((s) => s.key === active) ?? STAGES[0]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Stage tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => { setActive(s.key); setOpenPriority(null) }}
            className={cn(
              'rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors',
              active === s.key
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {s.icon} {s.label}
            <span className="ml-1 text-xs opacity-60">{s.ageRange}</span>
          </button>
        ))}
      </div>

      {/* Priority list */}
      <div className="space-y-2">
        {stage.priorities.map((p) => {
          const isOpen = openPriority === p.label
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => setOpenPriority(isOpen ? null : p.label)}
              className={cn(
                'w-full rounded-xl border px-4 py-3 text-left transition-colors',
                isOpen
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-surface-2 hover:border-accent/40',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-sm font-semibold"
                  style={{ color: isOpen ? stage.color : undefined }}
                >
                  {p.label}
                </span>
                <span className="text-muted text-sm">{isOpen ? '▲' : '▼'}</span>
              </div>
              {isOpen && (
                <p className="mt-2 text-sm leading-relaxed text-ink">{p.detail}</p>
              )}
            </button>
          )
        })}
      </div>

      {/* Never too late banner */}
      <div className="mt-4 rounded-xl border border-success/50 bg-success/5 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-success">Never too late</p>
        <p className="mt-1 text-sm text-ink">{stage.neverTooLate}</p>
      </div>
    </div>
  )
}
