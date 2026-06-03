import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Side-by-side (or toggle) comparison of a straw-man version of an argument
// vs its steelmanned (strongest, most charitable) version. 2–3 topics.
// Even-handed, non-partisan examples.

type Version = {
  label: 'Straw Man' | 'Steel Man'
  summary: string
  argument: string
  note: string
}

type Topic = {
  id: string
  title: string
  claim: string
  versions: [Version, Version]
}

const TOPICS: Array<Topic> = [
  {
    id: 'ubi',
    title: 'Universal Basic Income',
    claim: 'Everyone should receive a guaranteed monthly income from the government.',
    versions: [
      {
        label: 'Straw Man',
        summary: 'People will just stop working',
        argument:
          '"UBI is just free money so people can stay home and do nothing. It would destroy the work ethic of an entire generation and bankrupt every government that tried it."',
        note:
          'Ignores pilot programme results, strawburnishes the policy as "handouts for laziness," and treats government budgets as static.',
      },
      {
        label: 'Steel Man',
        summary: 'Structured guarantee for floor-level security',
        argument:
          '"Automation is eliminating entire categories of job faster than retraining programmes can respond. A well-designed UBI — funded by productivity gains — would provide a floor that lets workers accept risk, start businesses, and care for family without falling into destitution. Pilot studies in Finland and Stockton showed modest work-incentive effects and measurable mental-health improvements."',
        note:
          'Engages the real concern (technological displacement), cites evidence, acknowledges trade-offs, and specifies a funding mechanism.',
      },
    ],
  },
  {
    id: 'zoning',
    title: 'Restrictive Housing Zoning',
    claim: 'Single-family-only zoning should be preserved in residential neighbourhoods.',
    versions: [
      {
        label: 'Straw Man',
        summary: 'Nimbys protecting property prices',
        argument:
          '"People who support zoning just don\'t want poor people near them. It\'s pure selfishness dressed up in talk about \'neighbourhood character.\'"',
        note:
          'Assumes bad faith, dismisses every possible concern, and refuses to engage with the policy on its merits.',
      },
      {
        label: 'Steel Man',
        summary: 'Coherent concern about infrastructure and community stability',
        argument:
          '"Existing infrastructure — schools, sewage, roads — was built for a specific density. Rapid up-zoning without proportional investment can overload that infrastructure, reduce service quality for everyone, and accelerate community turnover in ways that destroy the social fabric residents built over decades. A phased approach tied to infrastructure upgrades addresses affordability without these costs."',
        note:
          'Steelmanning doesn\'t mean agreeing — you can still think the costs are worth it — but this version is worth actually rebutting.',
      },
    ],
  },
  {
    id: 'meditation',
    title: 'Workplace Mindfulness Programmes',
    claim: 'Companies should offer structured mindfulness and meditation programmes for employees.',
    versions: [
      {
        label: 'Straw Man',
        summary: 'Hippy nonsense replacing real solutions',
        argument:
          '"Corporations push meditation so they can replace proper wages and job security with feel-good nonsense. Telling stressed workers to breathe is insulting and shows management refuses to fix the actual problems."',
        note:
          'Collapses a practical wellness question into a culture-war framing, treats correlation as proof of bad intent, and ignores the research base.',
      },
      {
        label: 'Steel Man',
        summary: 'Genuine benefit, but no substitute for structural change',
        argument:
          '"Randomised trials show mindfulness training reduces cortisol levels and sick days, and meta-analyses report moderate effect sizes for anxiety and burnout. A reasonable employer would offer it as one tool — while recognising that structural factors like workload, autonomy, and pay equity are the primary drivers of burnout that no amount of breathing fixes."',
        note:
          'Acknowledges real evidence while holding the structural critique. This version advances the conversation; the straw man shuts it down.',
      },
    ],
  },
]

export function SteelmanLab() {
  const [topicId, setTopicId] = useState<string>(TOPICS[0].id)
  const [view, setView] = useState<0 | 1>(0) // 0 = straw man, 1 = steel man

  const topic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[0]!
  const version = topic.versions[view]

  function switchTopic(id: string) {
    setTopicId(id)
    setView(0)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Compare how the same position sounds when strawmanned vs steelmanned. Steelmanning means
        engaging the <span className="font-semibold text-ink">strongest</span> version of a view —
        not the weakest.
      </p>

      {/* Topic selector */}
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => switchTopic(t.id)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
              topicId === t.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* Claim */}
      <div className="mt-3 text-xs text-muted">
        The claim: <span className="italic text-ink">"{topic.claim}"</span>
      </div>

      {/* Toggle */}
      <div className="mt-3 flex gap-1 rounded-xl border border-border p-1">
        {([0, 1] as const).map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setView(i)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-colors',
              view === i
                ? i === 0
                  ? 'bg-warn/20 text-warn'
                  : 'border border-accent bg-accent/15 text-accent'
                : 'text-muted hover:text-ink',
            )}
          >
            <Icon name={i === 0 ? 'AlertTriangle' : 'Shield'} size={13} />
            {topic.versions[i].label}
          </button>
        ))}
      </div>

      {/* Version content */}
      <div className="mt-3 rounded-xl border border-border bg-surface-2 p-4 text-sm">
        <p className="mb-2 font-semibold text-ink">{version.summary}</p>
        <p className="italic leading-relaxed text-muted">{version.argument}</p>
        <div
          className={cn(
            'mt-3 rounded-lg border p-2.5 text-xs leading-relaxed',
            view === 0
              ? 'border-warn/40 bg-warn/10 text-ink'
              : 'border-accent/30 bg-accent/5 text-ink',
          )}
        >
          <Icon name={view === 0 ? 'AlertTriangle' : 'Lightbulb'} size={12} className="mr-1 inline-block" />
          {version.note}
        </div>
      </div>

      {view === 0 && (
        <p className="mt-3 text-center text-xs text-muted">
          Now switch to the{' '}
          <button
            type="button"
            onClick={() => setView(1)}
            className="font-semibold text-accent underline"
          >
            Steel Man
          </button>{' '}
          — that's the version you should actually engage with.
        </p>
      )}
    </div>
  )
}
