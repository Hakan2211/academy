import { useState } from 'react'
import { cn } from '#/lib/cn'

// MoralMachine — a self-driving-car dilemma (trolley problem in code).
// An unavoidable crash: the car must "choose" whom to spare.
// 3 scenarios. User decides, then sees the ethical tension and who decides.

type ScenarioId = 'passengers-vs-pedestrians' | 'few-vs-many' | 'vulnerable-vs-not'
type Choice = 'left' | 'right' | null

type Option = {
  id: 'left' | 'right'
  label: string
  who: string
  icon: string
  count: number
}

type Scenario = {
  id: ScenarioId
  title: string
  setup: string
  left: Option
  right: Option
  tension: string
  consequentialistTake: string
  deontologicalTake: string
  engineeringNote: string
  surveyNote: string
}

const SCENARIOS: Array<Scenario> = [
  {
    id: 'passengers-vs-pedestrians',
    title: 'Passengers vs Pedestrians',
    setup:
      'Brakes have failed. The car can continue straight (hitting pedestrians who crossed legally) or swerve (hitting the barrier, harming its own passengers). The car must choose.',
    left: {
      id: 'left',
      label: 'Protect passengers',
      who: 'Swerve into barrier — passengers injured',
      icon: '🚗',
      count: 2,
    },
    right: {
      id: 'right',
      label: 'Protect pedestrians',
      who: 'Continue — pedestrians harmed',
      icon: '🚶',
      count: 3,
    },
    tension:
      'Who is the car "for"? Its passengers trusted it to protect them — but the pedestrians crossed legally. Programming to sacrifice passengers discourages adoption; programming to sacrifice pedestrians shifts harm to bystanders.',
    consequentialistTake:
      'Minimise total harm: if more pedestrians are in danger than passengers, swerve into the barrier. Numbers decide.',
    deontologicalTake:
      'Harder. The car\'s passengers are its "principals." Deliberately harming them uses them as means to protect strangers. But failing to swerve when you could may also violate a duty to avoid foreseeable harm.',
    engineeringNote:
      'In practice, most automakers avoid programming trolley-style choices — cars are designed to minimise all risk, not to make victim-selection tradeoffs. But edge cases force the question.',
    surveyNote:
      'MIT Moral Machine surveys showed people generally favour saving more lives — but also favour protecting their own passengers when numbers are equal.',
  },
  {
    id: 'few-vs-many',
    title: 'One vs Five',
    setup:
      'Two lanes. Lane A has one pedestrian. Lane B has five pedestrians. The car must swerve into one lane — it cannot stop. The arithmetic is identical to the trolley problem.',
    left: {
      id: 'left',
      label: 'Lane A — one person',
      who: 'One pedestrian in the path',
      icon: '🚶',
      count: 1,
    },
    right: {
      id: 'right',
      label: 'Lane B — five people',
      who: 'Five pedestrians in the path',
      icon: '🚶',
      count: 5,
    },
    tension:
      'This is the trolley problem encoded in software. If the car chooses, it performs a utilitarian calculation — maximise survivors. But who authorised it to make that choice? And does programming this in treat some lives as worth less than others?',
    consequentialistTake:
      'Swerve toward the one: five lives outweigh one. A clear utilitarian calculus — and what the MIT Moral Machine data shows most respondents prefer.',
    deontologicalTake:
      'Problematic: the one person is being actively targeted by the car\'s decision. Their death becomes the means to saving five — violating the principle that persons should not be used as instruments, even in algorithms.',
    engineeringNote:
      'Building in a "kill the one" rule means programming discriminatory lethal decisions. Who is liable? Can a manufacturer be sued for a deliberate algorithmic choice that kills someone?',
    surveyNote:
      'Cross-culturally, saving the many is preferred — but willingness to build that into cars varies. People prefer others\' cars to sacrifice passengers; they prefer their own car to protect them.',
  },
  {
    id: 'vulnerable-vs-not',
    title: 'Child vs Adult',
    setup:
      'A child has run into the road. The only way to avoid the child is to swerve — harming an adult pedestrian. Both are in the road illegally. The car must choose.',
    left: {
      id: 'left',
      label: 'Protect the child',
      who: 'Swerve — adult pedestrian harmed',
      icon: '🧒',
      count: 1,
    },
    right: {
      id: 'right',
      label: 'Hold course',
      who: 'Continue — child harmed',
      icon: '👤',
      count: 1,
    },
    tension:
      'Numbers are equal (one vs one), so the consequentialist arithmetic offers no guidance. Should the algorithm account for age, vulnerability, or years of life remaining? That means coding in value-judgments about which lives matter more.',
    consequentialistTake:
      'A utilitarian might favour the child (more future wellbeing at stake — the QALY argument). But this requires the algorithm to assess lives by potential — a deeply contested value-judgment.',
    deontologicalTake:
      'Both are equal in dignity. Building in age-weighting treats adults as categorically worth less — violating the principle that all persons have equal moral worth regardless of attributes.',
    engineeringNote:
      'The MIT Moral Machine found strong cross-cultural preference for sparing children. But translating that intuition into code requires explicit demographic targeting — which most manufacturers and regulators reject as discriminatory.',
    surveyNote:
      'This is the scenario where people\'s intuitions are clearest (save the child) but where encoding that intuition is most ethically fraught. It\'s a collision between intuition and principle.',
  },
]

export function MoralMachine() {
  const [activeId, setActiveId] = useState<ScenarioId>('passengers-vs-pedestrians')
  const [choices, setChoices] = useState<Record<ScenarioId, Choice>>({
    'passengers-vs-pedestrians': null,
    'few-vs-many': null,
    'vulnerable-vs-not': null,
  })
  const [activeTab, setActiveTab] = useState<'consequentialist' | 'deontological' | 'engineering'>('consequentialist')

  const scenario = SCENARIOS.find((s) => s.id === activeId)!
  const choice = choices[activeId]

  function pick(c: 'left' | 'right') {
    setChoices((prev) => ({ ...prev, [activeId]: c }))
  }

  const answeredCount = Object.values(choices).filter((c) => c !== null).length

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-1 text-sm font-semibold text-ink">The trolley problem — in code</p>
      <p className="mb-4 text-xs leading-relaxed text-muted">
        Self-driving cars face unavoidable collisions. Someone has to decide how the car chooses.
        Make the call in three scenarios — then see what each ethical framework says, and who should
        really be deciding.
      </p>

      {/* Scenario tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveId(s.id)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition-colors',
              activeId === s.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {s.title}
            {choices[s.id] !== null && <span className="ml-1 opacity-60">✓</span>}
          </button>
        ))}
      </div>

      {/* Setup */}
      <div className="mb-4 rounded-xl border border-border bg-surface-2 p-3">
        <p className="text-sm font-semibold text-ink">{scenario.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{scenario.setup}</p>
      </div>

      {/* Choice buttons */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {(['left', 'right'] as const).map((side) => {
          const opt = scenario[side]
          return (
            <button
              key={side}
              type="button"
              onClick={() => pick(side)}
              className={cn(
                'rounded-xl border px-3 py-3 text-left text-sm transition-colors',
                choice === side
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              <div className="mb-1 text-2xl">{opt.icon}</div>
              <div className="font-semibold">{opt.label}</div>
              <div className="mt-0.5 text-xs opacity-70">{opt.who}</div>
              <div className="mt-1 text-xs">
                {opt.count === 1 ? '1 person' : `${opt.count} people`}
              </div>
            </button>
          )
        })}
      </div>

      {/* Tension — show after choice */}
      {choice !== null && (
        <div className="mb-4 rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm">
          <p className="mb-1 font-semibold text-ink">The ethical tension</p>
          <p className="leading-relaxed text-muted">{scenario.tension}</p>
        </div>
      )}

      {/* Ethical analysis tabs */}
      {choice !== null && (
        <div>
          <div className="mb-3 flex gap-2">
            {(
              [
                { id: 'consequentialist', label: 'Consequentialist' },
                { id: 'deontological', label: 'Deontological' },
                { id: 'engineering', label: 'Engineering reality' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 rounded-lg border px-2 py-1.5 text-center text-xs font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-accent bg-accent/15 text-accent'
                    : 'border-border text-muted hover:text-ink',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-surface-2 p-3 text-sm">
            {activeTab === 'consequentialist' && (
              <>
                <p className="mb-1 font-semibold text-accent">Consequentialist take</p>
                <p className="leading-relaxed text-muted">{scenario.consequentialistTake}</p>
              </>
            )}
            {activeTab === 'deontological' && (
              <>
                <p className="mb-1 font-semibold text-accent-2">Deontological take</p>
                <p className="leading-relaxed text-muted">{scenario.deontologicalTake}</p>
              </>
            )}
            {activeTab === 'engineering' && (
              <>
                <p className="mb-1 font-semibold text-success">Engineering reality</p>
                <p className="mb-2 leading-relaxed text-muted">{scenario.engineeringNote}</p>
                <p className="text-xs italic text-muted">{scenario.surveyNote}</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Who decides? — show after any answer */}
      {answeredCount > 0 && (
        <div className="mt-4 rounded-xl border border-border bg-surface-2 p-3 text-xs leading-relaxed text-muted">
          <p className="mb-1 font-semibold text-ink">Who decides?</p>
          <p>
            Every algorithmic choice encodes a moral position — even the decision not to encode one.
            Options include: the manufacturer (standardised rules), regulators (legal frameworks),
            individual owners (opt-in settings), or democratic deliberation. Each raises its own
            problems: manufacturers have liability interests; regulators may be slow; individual
            choice creates inconsistent outcomes; democratic deliberation is slow and hard to
            translate into code.
          </p>
          <p className="mt-1">
            The MIT Moral Machine project surveyed 2.3 million people in 233 countries. Preferences
            varied significantly by culture — which suggests there may be no single globally
            legitimate answer.
          </p>
        </div>
      )}

      {!choice && (
        <p className="text-center text-xs text-muted">
          Make a choice above to see the ethical analysis.
        </p>
      )}
    </div>
  )
}
