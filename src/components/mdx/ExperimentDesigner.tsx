import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Design a tiny experiment: pick the independent variable (what you change), the
// dependent variable (what you measure), and how you assign people to the two
// groups. Sloppy choices — keeping the groups different in some other way, or
// letting yourself decide who goes where — light up a confound warning. The aim
// is to feel why random assignment + a single manipulated variable is what makes
// a study an experiment. Used in the-experiment.

type IV = { key: string; label: string }
type DV = { key: string; label: string }
type Assign = { key: string; label: string; good: boolean }

const IVS: Array<IV> = [
  { key: 'sleep', label: '8 vs 4 hours of sleep' },
  { key: 'caffeine', label: 'Caffeine vs placebo pill' },
  { key: 'music', label: 'Studying with vs without music' },
]

const DVS: Array<DV> = [
  { key: 'score', label: 'Score on a memory test' },
  { key: 'time', label: 'Reaction time (ms)' },
  { key: 'mood', label: 'Self-rated mood (1-10)' },
]

const ASSIGNS: Array<Assign> = [
  { key: 'random', label: 'Flip a coin for each person', good: true },
  { key: 'self', label: 'Let people pick their own group', good: false },
  { key: 'morning', label: 'Morning people in one group', good: false },
]

export function ExperimentDesigner() {
  const [iv, setIv] = useState(IVS[0].key)
  const [dv, setDv] = useState(DVS[0].key)
  const [assign, setAssign] = useState(ASSIGNS[0].key)

  const ivLabel = IVS.find((v) => v.key === iv)!.label
  const dvLabel = DVS.find((v) => v.key === dv)!.label
  const a = ASSIGNS.find((v) => v.key === assign)!

  const confound =
    assign === 'self'
      ? 'Letting people choose their own group is self-selection: the kinds of people who pick the "treatment" may already differ. Any result could be the person, not the manipulation.'
      : assign === 'morning'
        ? 'Sorting by a trait (morning people) makes the groups differ in more than the one variable you meant to change. Time-of-day becomes a confound tangled up with your IV.'
        : null

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <Row label="Independent variable" sub="what you deliberately change" options={IVS} value={iv} onPick={setIv} />
      <Row label="Dependent variable" sub="what you measure as the result" options={DVS} value={dv} onPick={setDv} />
      <Row label="Assign people to groups by" sub="how participants land in each group" options={ASSIGNS} value={assign} onPick={setAssign} />

      <div className="mt-4 rounded-xl bg-surface-2 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Your design</p>
        <p className="mt-1 text-sm leading-relaxed text-ink">
          Manipulate <span className="font-semibold">{ivLabel.toLowerCase()}</span> between two groups, then measure{' '}
          <span className="font-semibold">{dvLabel.toLowerCase()}</span>. Participants are split by{' '}
          <span className="font-semibold">{a.label.toLowerCase()}</span>.
        </p>

        {confound ? (
          <div className="mt-3 flex gap-2 rounded-lg border border-[#E67E22]/40 bg-[#E67E22]/10 p-3">
            <span className="mt-0.5 shrink-0 text-[#E67E22]">
              <Icon name="AlertTriangle" size={16} />
            </span>
            <p className="text-sm leading-snug text-ink">
              <span className="font-semibold text-[#E67E22]">Confound. </span>
              {confound}
            </p>
          </div>
        ) : (
          <div className="mt-3 flex gap-2 rounded-lg border border-success/40 bg-success/10 p-3">
            <span className="mt-0.5 shrink-0 text-success">
              <Icon name="CheckCircle2" size={16} />
            </span>
            <p className="text-sm leading-snug text-ink">
              <span className="font-semibold text-success">Clean design. </span>
              Random assignment makes the groups equivalent on average before you start, so a difference at the end can be
              credited to the variable you changed — that is what lets an experiment claim cause.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({
  label,
  sub,
  options,
  value,
  onPick,
}: {
  label: string
  sub: string
  options: Array<{ key: string; label: string }>
  value: string
  onPick: (k: string) => void
}) {
  return (
    <div className="mb-3">
      <p className="text-sm font-semibold text-ink">{label}</p>
      <p className="mb-1.5 text-xs text-muted">{sub}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => onPick(o.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              value === o.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
