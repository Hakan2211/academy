import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Sartre's core claim: for made objects, essence (purpose/design) precedes existence
// (manufacture). For humans, the order is reversed — we exist first, then define
// ourselves through choices. Toggle between an object and a person to see the reversal.

type Subject = 'object' | 'person'

const DATA: Record<
  Subject,
  {
    label: string
    icon: string
    essenceFirst: boolean
    steps: Array<{ phase: string; detail: string }>
    verdict: string
  }
> = {
  object: {
    label: 'A Knife',
    icon: 'Scissors',
    essenceFirst: true,
    steps: [
      {
        phase: '1. Essence first — the concept',
        detail:
          'Before any steel exists, a craftsperson imagines the knife: its shape, its purpose (to cut), its ideal form. The knife\'s "essence" — what it is for — is fixed in advance.',
      },
      {
        phase: '2. Existence follows — the making',
        detail:
          'Only then does the physical knife come into being. It is made to match the pre-given concept. The thing exists in order to fulfil a purpose already decided for it.',
      },
      {
        phase: '3. Result: purpose is built-in',
        detail:
          'A knife that cannot cut is a bad knife — judged against its pre-set essence. Its meaning and function were determined before it existed.',
      },
    ],
    verdict:
      'For objects, ESSENCE → EXISTENCE. Design precedes manufacture. The thing exists to serve a purpose laid out before it.',
  },
  person: {
    label: 'A Human Being',
    icon: 'User',
    essenceFirst: false,
    steps: [
      {
        phase: '1. Existence first — you are thrown into the world',
        detail:
          'You are born without instructions, without a built-in purpose, without a "manufacturer\'s specification." Sartre: there is no God who pre-designed humanity the way a craftsperson designs a knife.',
      },
      {
        phase: '2. Essence follows — you define yourself through choices',
        detail:
          'Through what you do, love, commit to, and refuse — through your choices — you create the person you are. You write your own "specification" as you live.',
      },
      {
        phase: '3. Result: "condemned to be free"',
        detail:
          'With no given essence to fall back on, every choice is yours and every choice defines you. You cannot escape this freedom — even refusing to choose is a choice.',
      },
    ],
    verdict:
      'For humans, EXISTENCE → ESSENCE. You exist first; only then do you define what you are. There is no pre-given human nature to hide behind.',
  },
}

export function ExistenceEssence() {
  const [subject, setSubject] = useState<Subject>('object')
  const [step, setStep] = useState(0)
  const d = DATA[subject]

  function switchSubject(s: Subject) {
    setSubject(s)
    setStep(0)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Sartre's famous claim: for objects, essence (purpose) comes first; for humans, existence does.
        Toggle between the two to see the difference.
      </p>

      {/* toggle */}
      <div className="mb-4 flex gap-2">
        {(['object', 'person'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => switchSubject(s)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
              subject === s
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={DATA[s].icon} size={16} />
            {DATA[s].label}
          </button>
        ))}
      </div>

      {/* order banner */}
      <div
        className={cn(
          'mb-4 flex items-center justify-center gap-3 rounded-xl border p-3 text-sm font-semibold',
          d.essenceFirst
            ? 'border-accent-2/50 bg-accent-2/10 text-accent-2'
            : 'border-accent/50 bg-accent/10 text-accent',
        )}
      >
        {d.essenceFirst ? (
          <>
            <span>ESSENCE (purpose)</span>
            <Icon name="ArrowRight" size={16} />
            <span>EXISTENCE (made)</span>
          </>
        ) : (
          <>
            <span>EXISTENCE (born)</span>
            <Icon name="ArrowRight" size={16} />
            <span>ESSENCE (self-defined)</span>
          </>
        )}
      </div>

      {/* step cards */}
      <div className="space-y-2">
        {d.steps.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setStep(i)}
            className={cn(
              'w-full rounded-xl border px-4 py-3 text-left transition-colors',
              step === i
                ? 'border-accent bg-accent/15'
                : 'border-border bg-surface-2 hover:border-accent/40',
            )}
          >
            <p
              className={cn(
                'text-sm font-semibold',
                step === i ? 'text-accent' : 'text-ink',
              )}
            >
              {s.phase}
            </p>
            {step === i && (
              <p className="mt-1 text-sm text-ink">{s.detail}</p>
            )}
          </button>
        ))}
      </div>

      {/* verdict */}
      <div className="mt-4 rounded-xl border border-border bg-surface-2 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Sartre's verdict
        </p>
        <p className="mt-1 text-sm text-ink">{d.verdict}</p>
      </div>
    </div>
  )
}
