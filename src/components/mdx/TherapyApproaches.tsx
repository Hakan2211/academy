import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The major schools of therapy compared on two questions: what does each see as
// the *cause* of psychological distress, and what is its *route* to change?
// Click a school to read its diagnosis and its cure. The point students should
// take away: the same struggle looks different through each lens, and modern
// practice borrows from all of them.
type SchoolKey = 'psychodynamic' | 'behavioural' | 'cognitive' | 'humanistic' | 'biomedical'

type School = {
  key: SchoolKey
  name: string
  icon: string
  color: string
  founders: string
  cause: string
  route: string
}

const SCHOOLS: Array<School> = [
  {
    key: 'psychodynamic',
    name: 'Psychodynamic',
    icon: 'Waves',
    color: '#A29BFE',
    founders: 'Freud, and briefer modern heirs',
    cause: 'Unresolved unconscious conflicts, often rooted in childhood, leak out as symptoms and self-defeating patterns.',
    route: 'Bring the hidden into the light. Through free association, dreams and the transference, gain insight into buried conflict so it loses its grip.',
  },
  {
    key: 'behavioural',
    name: 'Behavioural',
    icon: 'Bell',
    color: '#27AE60',
    founders: 'Wolpe, Skinner and the conditioning tradition',
    cause: 'The problem *is* the behaviour. Maladaptive habits and fears were learned through conditioning — nothing hidden underneath.',
    route: 'Re-learn. Use counterconditioning, exposure and reinforcement to unlearn the unwanted response and replace it with a healthier one.',
  },
  {
    key: 'cognitive',
    name: 'Cognitive / CBT',
    icon: 'Cpu',
    color: '#3498DB',
    founders: 'Beck, Ellis — now the most-studied approach',
    cause: 'Distress flows from distorted thinking: irrational beliefs and automatic negative thoughts that twist how events are read.',
    route: 'Identify, test and restructure those thoughts. CBT adds behavioural experiments, so you change both how you think and what you do.',
  },
  {
    key: 'humanistic',
    name: 'Humanistic',
    icon: 'Sun',
    color: '#FDCB6E',
    founders: 'Rogers, Perls',
    cause: 'A blocked drive toward growth. A gap between the real and the ideal self, often from a lack of acceptance, stalls self-actualisation.',
    route: 'Provide a warm, accepting relationship — unconditional positive regard, empathy, genuineness — so the person can grow toward their own potential.',
  },
  {
    key: 'biomedical',
    name: 'Biomedical',
    icon: 'Pill',
    color: '#16A085',
    founders: 'Psychiatry and neuroscience',
    cause: 'Distress reflects a biological problem — neurotransmitter imbalances or disrupted brain circuits.',
    route: 'Act on the body directly: medication, and in severe cases brain-stimulation treatments, to restore the underlying physiology.',
  },
]

export function TherapyApproaches() {
  const [active, setActive] = useState<SchoolKey>('psychodynamic')
  const s = SCHOOLS.find((x) => x.key === active)!

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        {SCHOOLS.map((school) => (
          <button
            key={school.key}
            type="button"
            onClick={() => setActive(school.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              active === school.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {school.name}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface-2 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${s.color}22`, color: s.color }}>
            <Icon name={s.icon} size={20} />
          </span>
          <div>
            <p className="text-base font-semibold text-ink">{s.name} therapy</p>
            <p className="text-xs text-muted">{s.founders}</p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              <Icon name="Search" size={13} /> Cause of distress
            </p>
            <p className="mt-1 text-sm leading-snug text-ink/90">{s.cause}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: s.color }}>
              <Icon name="ArrowRight" size={13} /> Route to change
            </p>
            <p className="mt-1 text-sm leading-snug text-ink/90">{s.route}</p>
          </div>
        </div>
      </div>

      <p className="mt-3 px-1 text-xs leading-relaxed text-muted">
        Each school answers two questions differently: <span className="text-ink">what went wrong</span> and{' '}
        <span className="text-ink">how to put it right</span>. Most therapists today are <span className="text-ink">eclectic</span> —
        they borrow whatever helps this person with this problem.
      </p>
    </div>
  )
}
