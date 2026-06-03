import { useState } from 'react'
import { cn } from '#/lib/cn'
import { Icon } from '#/components/ui/Icon'

// Age-based screening and check-up timeline. Select your age and see which
// screenings are typically recommended. Educational — not prescriptive.
// Owner: disease-and-prevention (W11).

type Check = {
  id: string
  name: string
  icon: string
  ageRanges: [number, number][]   // inclusive age ranges when this is relevant
  note: string
}

const CHECKS: Check[] = [
  {
    id: 'bp',
    name: 'Blood pressure check',
    icon: 'HeartPulse',
    ageRanges: [[18, 70]],
    note: 'Adults should be screened at least every 2 years; more often if previous readings were high.',
  },
  {
    id: 'dental',
    name: 'Dental check-up',
    icon: 'SmilePlus',
    ageRanges: [[20, 70]],
    note: 'Routine dental exams every 6–12 months catch cavities, gum disease, and oral cancer early.',
  },
  {
    id: 'eye',
    name: 'Eye examination',
    icon: 'Eye',
    ageRanges: [[20, 70]],
    note: 'Every 2–4 years in adults under 40; more frequent after 40 when glaucoma risk increases.',
  },
  {
    id: 'chol',
    name: 'Cholesterol (lipid panel)',
    icon: 'Activity',
    ageRanges: [[20, 70]],
    note: 'Baseline from age 20; repeated every 4–6 years (or more often if risk factors exist).',
  },
  {
    id: 'diabetes',
    name: 'Blood-sugar / diabetes screen',
    icon: 'Droplets',
    ageRanges: [[35, 70]],
    note: 'Recommended from 35 in adults with overweight or obesity, or any age with risk factors.',
  },
  {
    id: 'cervical',
    name: 'Cervical (Pap / HPV) smear',
    icon: 'Microscope',
    ageRanges: [[21, 65]],
    note: 'Every 3 years (Pap) or every 5 years (combined Pap + HPV). Catches pre-cancerous cells early.',
  },
  {
    id: 'breast',
    name: 'Breast cancer mammogram',
    icon: 'ScanLine',
    ageRanges: [[40, 70]],
    note: 'Every 1–2 years from 40 (or 50 depending on guidelines). Regular screening saves lives.',
  },
  {
    id: 'colorectal',
    name: 'Colorectal (bowel) cancer',
    icon: 'Search',
    ageRanges: [[45, 70]],
    note: 'From age 45: stool tests every 1–3 years, or colonoscopy every 10 years.',
  },
  {
    id: 'lung',
    name: 'Lung cancer CT scan',
    icon: 'Wind',
    ageRanges: [[50, 70]],
    note: 'Annual low-dose CT for high-risk adults (50–80 who smoked ≥20 pack-years).',
  },
  {
    id: 'osteo',
    name: 'Bone-density (DEXA) scan',
    icon: 'Bone',
    ageRanges: [[50, 70]],
    note: 'From 50 for women and 65 for men; earlier if there are fracture risk factors.',
  },
]

const AGES = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70]

function checksForAge(age: number): Check[] {
  return CHECKS.filter((c) => c.ageRanges.some(([lo, hi]) => age >= lo && age <= hi))
}

export function ScreeningTimeline() {
  const [age, setAge] = useState<number>(35)
  const [expanded, setExpanded] = useState<string | null>(null)

  const active = checksForAge(age)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4 space-y-4">
      {/* age selector */}
      <div>
        <p className="mb-2 text-sm text-muted">
          Select an age to see which screenings are typically recommended:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {AGES.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => { setAge(a); setExpanded(null) }}
              className={cn(
                'rounded-lg border px-3 py-1 text-xs font-medium transition-colors',
                age === a
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* age axis bar */}
      <div className="relative h-2 w-full rounded-full bg-surface-2">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-accent transition-all"
          style={{ width: `${((age - 20) / 50) * 100}%` }}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-accent bg-surface transition-all"
          style={{ left: `${((age - 20) / 50) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted -mt-2">
        <span>20</span><span>70</span>
      </div>

      {/* check-up cards */}
      <div>
        <p className="mb-2 text-xs text-muted">
          {active.length} check-up{active.length !== 1 ? 's' : ''} relevant around age {age}:
        </p>
        <div className="space-y-1.5">
          {active.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setExpanded(expanded === c.id ? null : c.id)}
              className="w-full text-left rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs transition-colors hover:border-accent"
            >
              <div className="flex items-center gap-2">
                <Icon name={c.icon} size={14} className="shrink-0 text-accent" />
                <span className="font-medium text-ink flex-1">{c.name}</span>
                <Icon name={expanded === c.id ? 'ChevronUp' : 'ChevronDown'} size={12} className="text-muted" />
              </div>
              {expanded === c.id && (
                <p className="mt-1.5 text-muted leading-relaxed">{c.note}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted">
        <strong className="text-ink">Why it matters:</strong> Many conditions — high blood pressure,
        raised cholesterol, early cancers, pre-diabetes — have no obvious symptoms for years. Screening
        catches them when treatment is most effective and least invasive.
      </div>
    </div>
  )
}
