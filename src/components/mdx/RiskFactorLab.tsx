import { useMemo, useState } from 'react'
import { cn } from '#/lib/cn'
import { Icon } from '#/components/ui/Icon'
import { clamp } from '#/lib/health'

// Toggle modifiable risk factors to see how chronic-disease risk responds.
// Non-modifiable factors (age, family history) are shown but not togglable.
// Reused by lifestyle-and-chronic-disease (W11) and potentially other worlds.
// Owner: disease-and-prevention (W11).

type Factor = {
  id: string
  label: string
  desc: string
  icon: string
  riskDelta: number   // additive percentage points when the bad habit is ON
  modifiable: boolean
}

const FACTORS: Factor[] = [
  { id: 'smoking',      label: 'Tobacco use',          desc: 'Smoking is the leading avoidable cause of heart disease, stroke, and several cancers.',           icon: 'Cigarette',      riskDelta: 22, modifiable: true  },
  { id: 'diet',         label: 'Poor diet',             desc: 'A diet high in ultra-processed food, salt, and saturated fat raises blood pressure and cholesterol.',icon: 'Pizza',          riskDelta: 14, modifiable: true  },
  { id: 'inactive',     label: 'Physical inactivity',   desc: 'Sedentary behaviour raises risk of heart disease, type 2 diabetes, and some cancers.',            icon: 'Armchair',       riskDelta: 12, modifiable: true  },
  { id: 'alcohol',      label: 'Excess alcohol',        desc: 'Regular heavy drinking raises the risk of liver disease, several cancers, and high blood pressure.',icon: 'Beer',           riskDelta: 8,  modifiable: true  },
  { id: 'bp',           label: 'High blood pressure',   desc: 'Hypertension often has no symptoms but dramatically raises stroke and heart-attack risk.',         icon: 'HeartPulse',     riskDelta: 18, modifiable: true  },
  { id: 'age',          label: 'Older age',             desc: 'Risk of most chronic diseases rises with age — this cannot be changed, but we can prepare.',      icon: 'Clock',          riskDelta: 20, modifiable: false },
  { id: 'family',       label: 'Family history',        desc: 'Genetic predisposition raises baseline risk. Knowing this helps you focus on modifiable factors.',  icon: 'Users',          riskDelta: 15, modifiable: false },
]

const BASE_RISK = 8  // baseline % risk with no modifiable factors active

export function RiskFactorLab() {
  // modifiable factors that are "on" (bad habit active)
  const [active, setActive] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const { totalRisk, saved } = useMemo(() => {
    let r = BASE_RISK
    for (const f of FACTORS) {
      if (f.modifiable && active.has(f.id)) r += f.riskDelta
      if (!f.modifiable) r += f.riskDelta   // always on
    }
    const current = clamp(r, 0, 100)
    const bestPossible = BASE_RISK + FACTORS.filter((f) => !f.modifiable).reduce((s, f) => s + f.riskDelta, 0)
    return { totalRisk: current, saved: clamp(current - bestPossible, 0, 100) }
  }, [active])

  const gaugeAngle = (totalRisk / 100) * 180  // 0 → 180 degrees

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4 space-y-4">
      <p className="text-sm text-muted">
        Toggle the <span className="text-accent font-medium">modifiable</span> factors (the ones you can change).
        Non-modifiable ones are always present — knowing them helps you focus your efforts.
      </p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {FACTORS.map((f) => {
          const isOn = !f.modifiable || active.has(f.id)
          const badgeColor = f.modifiable ? 'text-accent' : 'text-muted'
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => f.modifiable && toggle(f.id)}
              disabled={!f.modifiable}
              className={cn(
                'flex items-start gap-2 rounded-xl border p-2.5 text-left text-xs transition-colors',
                f.modifiable
                  ? isOn
                    ? 'border-warn bg-warn/10 text-ink'
                    : 'border-border text-muted hover:text-ink'
                  : 'border-border/60 bg-surface-2 text-muted opacity-80',
              )}
            >
              <Icon name={f.icon} size={14} className={cn('mt-0.5 shrink-0', isOn && f.modifiable ? 'text-warn' : 'text-muted')} />
              <span className="flex-1">
                <span className="block font-medium text-ink">{f.label}</span>
                <span className="text-muted">{f.desc}</span>
              </span>
              <span className={cn('shrink-0 text-[10px] font-semibold', badgeColor)}>
                {f.modifiable ? (isOn ? '▲ on' : '● off') : 'fixed'}
              </span>
            </button>
          )
        })}
      </div>

      {/* gauge */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-xs text-muted">Estimated relative chronic-disease risk</p>
        <svg viewBox="0 0 200 110" className="w-48">
          <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--color-border)" strokeWidth={14} strokeLinecap="round" />
          <path
            d="M20 100 A80 80 0 0 1 180 100"
            fill="none"
            stroke={totalRisk < 35 ? '#2ECC71' : totalRisk < 60 ? '#F39C12' : '#E74C3C'}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={`${(gaugeAngle / 180) * 251} 251`}
          />
          <text x="100" y="95" textAnchor="middle" fontSize={22} fontWeight={700} fill="currentColor" className="fill-ink">{totalRisk}%</text>
          <text x="100" y="108" textAnchor="middle" fontSize={9} fill="currentColor" className="fill-muted">relative risk</text>
        </svg>
        {saved > 0 && (
          <p className="text-xs text-success text-center">
            Removing active modifiable factors could reduce risk by ~<strong>{saved}</strong> percentage points.
          </p>
        )}
        {saved === 0 && active.size === 0 && (
          <p className="text-xs text-muted text-center">
            All modifiable factors are off — your lowest achievable risk given fixed factors.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted">
        <strong className="text-ink">Remember:</strong> This is illustrative, not medical. Risk is about
        probabilities — having risk factors does not make disease certain, and lacking them does not
        guarantee safety. But stacking healthy choices meaningfully tilts the odds in your favour.
      </div>
    </div>
  )
}
