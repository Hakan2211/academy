import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'
import { rng } from '#/lib/philo'

// Rawls' veil of ignorance: design society without knowing your position,
// then "lift the veil" to find out where you land and how you fare.

type Society = {
  id: string
  name: string
  description: string
  // wealth share for each quintile (bottom 20% to top 20%)
  quintiles: [number, number, number, number, number]
  // life quality score for each quintile (0–100)
  quality: [number, number, number, number, number]
  rawlsApproval: boolean
  rawlsNote: string
  nozickNote: string
}

const SOCIETIES: Array<Society> = [
  {
    id: 'ultra-unequal',
    name: 'High-Growth Plutocracy',
    description:
      'Enormous wealth is created — but flows almost entirely to the top. No minimum guarantees; the worst-off receive very little. Average wealth is the highest of any option.',
    quintiles: [2, 5, 10, 20, 63],
    quality: [22, 38, 55, 78, 98],
    rawlsApproval: false,
    rawlsNote:
      'Rawls rejects this. Behind the veil you have a 40 % chance of landing in the two worst-off groups — and their lives are genuinely bad. The difference principle demands inequalities benefit the least advantaged, which this fails.',
    nozickNote:
      'Nozick would ask: did everyone acquire their wealth through just transactions? If so, the pattern itself is not unjust — even extreme inequality.',
  },
  {
    id: 'rawlsian',
    name: 'Fair Opportunity Society',
    description:
      'Inequality is permitted only where it lifts up the worst-off (e.g., incentives for innovation that fund a strong safety net). Equal basic rights for all; genuine opportunity.',
    quintiles: [9, 14, 20, 26, 31],
    quality: [68, 74, 80, 87, 95],
    rawlsApproval: true,
    rawlsNote:
      'Rawls endorses this. No matter where you land — even the bottom — you enjoy genuine basic rights and a decent life. Inequality exists but works to raise the floor. The veil of ignorance leads rational people here.',
    nozickNote:
      'Nozick would worry: who decides what is "fair"? Achieving this pattern requires ongoing redistribution, which he sees as violating property rights earned through just acquisition.',
  },
  {
    id: 'strict-equal',
    name: 'Strict Equality',
    description:
      'Everyone gets exactly the same share regardless of contribution. No incentives for innovation or extra effort — the total pie is smaller, but every slice is identical.',
    quintiles: [20, 20, 20, 20, 20],
    quality: [58, 58, 58, 58, 58],
    rawlsApproval: false,
    rawlsNote:
      'Rawls actually opposes strict equality — if allowing some inequality (e.g. paying doctors more) makes the worst-off better off, you should allow it. Strict equality that shrinks the pie can leave the worst-off worse than they need to be.',
    nozickNote:
      'Nozick strongly opposes forced equality. Making everyone identical requires constant interference with free transactions — an unjust violation of individual liberty.',
  },
  {
    id: 'libertarian',
    name: 'Minimal State',
    description:
      'Government protects only basic rights (no theft, fraud, or violence). No redistribution; outcomes depend entirely on talent, effort, and luck. High growth, high variance.',
    quintiles: [3, 8, 14, 24, 51],
    quality: [30, 45, 62, 80, 96],
    rawlsApproval: false,
    rawlsNote:
      'Rawls would reject this behind the veil: the worst-off position is genuinely precarious. A rational person who might land anywhere would not choose a society where bad luck at birth leads to a severely disadvantaged life.',
    nozickNote:
      'Nozick endorses this. The state\'s only job is to protect rights — redistribution is a form of coerced labour. Outcomes, however unequal, are just if the process that produced them was fair.',
  },
]

type Step = 'design' | 'lifted'

const QUINTILE_LABELS = ['Bottom 20%', 'Lower-middle', 'Middle', 'Upper-middle', 'Top 20%']
const QUINTILE_ICONS = ['TrendingDown', 'Minus', 'Equal', 'TrendingUp', 'Crown'] as const

function QualityBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 text-[10px] text-muted">{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-surface h-2">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-6 text-right text-[10px] font-semibold text-ink">{value}</span>
    </div>
  )
}

// Deterministic position assignment from society id seed
function assignPosition(societyId: string): number {
  const seed = societyId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const rand = rng(seed + 42)()
  if (rand < 0.2) return 0
  if (rand < 0.4) return 1
  if (rand < 0.6) return 2
  if (rand < 0.8) return 3
  return 4
}

export function VeilOfIgnorance() {
  const [selected, setSelected] = useState<string | null>(null)
  const [step, setStep] = useState<Step>('design')
  const [position, setPosition] = useState<number | null>(null)
  const [philosopher, setPhilosopher] = useState<'rawls' | 'nozick'>('rawls')

  const society = SOCIETIES.find((s) => s.id === selected)

  function liftVeil() {
    if (!selected) return
    const pos = assignPosition(selected)
    setPosition(pos)
    setStep('lifted')
  }

  function reset() {
    setSelected(null)
    setStep('design')
    setPosition(null)
  }

  const posQuality = position !== null && society ? society.quality[position] : null
  const posLabel = position !== null ? QUINTILE_LABELS[position] : null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {step === 'design' && (
        <>
          <div className="mb-3">
            <p className="text-sm font-semibold text-ink">Behind the veil of ignorance</p>
            <p className="mt-0.5 text-xs text-muted">
              You do not know your intelligence, birth family, gender, nationality, or any personal advantage. Choose the
              society whose rules you would want — knowing you might end up anywhere.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {SOCIETIES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelected(s.id)}
                className={cn(
                  'rounded-xl border p-3 text-left text-sm transition-colors',
                  selected === s.id
                    ? 'border-accent bg-accent/15'
                    : 'border-border bg-surface-2 hover:border-accent/40',
                )}
              >
                <p className={cn('font-semibold', selected === s.id ? 'text-accent' : 'text-ink')}>{s.name}</p>
                <p className="mt-1 text-xs text-muted leading-snug">{s.description}</p>
                <div className="mt-2 space-y-0.5">
                  {s.quality.map((q, i) => (
                    <QualityBar key={i} value={q} label={QUINTILE_LABELS[i]!} />
                  ))}
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={!selected}
            onClick={liftVeil}
            className={cn(
              'mt-4 w-full rounded-xl border py-2.5 text-sm font-semibold transition-colors',
              selected
                ? 'border-accent bg-accent/15 text-accent hover:bg-accent/25'
                : 'border-border text-muted opacity-40',
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <Icon name="Eye" size={15} />
              Lift the veil — reveal my position
            </span>
          </button>
        </>
      )}

      {step === 'lifted' && society && position !== null && (
        <>
          {/* Position reveal */}
          <div
            className={cn(
              'mb-4 rounded-xl border p-4 text-center',
              (posQuality ?? 0) >= 70
                ? 'border-success/40 bg-success/10'
                : (posQuality ?? 0) >= 50
                  ? 'border-accent/40 bg-accent/10'
                  : 'border-warn/40 bg-warn/10',
            )}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Icon name={QUINTILE_ICONS[position] as string} size={20} />
              <span className="text-lg font-bold text-ink">You are in the {posLabel}</span>
            </div>
            <p className="text-xs text-muted">
              Society: <span className="font-semibold text-ink">{society.name}</span>
            </p>
            <div className="mt-3 flex items-center justify-center gap-3">
              <div>
                <p className="text-2xl font-bold text-ink">{posQuality}</p>
                <p className="text-[10px] text-muted">Quality of life (0–100)</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-ink">{society.quintiles[position]}%</p>
                <p className="text-[10px] text-muted">Wealth share</p>
              </div>
            </div>
          </div>

          {/* Philosopher commentary */}
          <div className="mb-3 flex gap-1.5">
            {(['rawls', 'nozick'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPhilosopher(p)}
                className={cn(
                  'flex-1 rounded-xl border py-1.5 text-xs font-semibold capitalize transition-colors',
                  philosopher === p
                    ? 'border-accent bg-accent/15 text-accent'
                    : 'border-border text-muted hover:text-ink',
                )}
              >
                {p === 'rawls' ? 'Rawls says…' : 'Nozick replies…'}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-surface-2 p-3">
            <div className="flex items-start gap-2">
              <Icon
                name={philosopher === 'rawls' ? (society.rawlsApproval ? 'CheckCircle' : 'XCircle') : 'MessageSquare'}
                size={16}
              />
              <div>
                {philosopher === 'rawls' && (
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      society.rawlsApproval ? 'text-success' : 'text-warn',
                    )}
                  >
                    {society.rawlsApproval ? 'Rawls approves' : 'Rawls rejects this society'}
                  </span>
                )}
                {philosopher === 'nozick' && (
                  <span className="text-xs font-semibold text-accent-2">Nozick's reply</span>
                )}
                <p className="mt-1 text-xs text-ink leading-relaxed">
                  {philosopher === 'rawls' ? society.rawlsNote : society.nozickNote}
                </p>
              </div>
            </div>
          </div>

          {/* Key insight */}
          <div className="mt-3 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-xs text-ink">
            <span className="font-semibold">Rawls' insight:</span> Not knowing where you will land forces you to care
            about the{' '}
            <span className="font-semibold">worst-off position</span> — because you might be in it. The veil of ignorance is a fairness-generating machine.
          </div>

          <button
            type="button"
            onClick={reset}
            className="mt-3 w-full rounded-xl border border-border py-2 text-xs text-muted transition-colors hover:text-ink"
          >
            <span className="flex items-center justify-center gap-1.5">
              <Icon name="RotateCcw" size={13} />
              Choose a different society
            </span>
          </button>
        </>
      )}
    </div>
  )
}
