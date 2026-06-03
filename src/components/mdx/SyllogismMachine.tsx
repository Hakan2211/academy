import { useState } from 'react'
import { cn } from '#/lib/cn'
import { Icon } from '#/components/ui/Icon'
import { type ArgumentForm, isValidForm } from '#/lib/philo'

// Pick a conditional "If P then Q" and a second premise.
// The machine identifies which of the four classic argument forms results,
// and gives a VALID / INVALID (fallacy) verdict.

type Conditional = {
  key: string
  p: string       // antecedent (short form for display)
  q: string       // consequent (short form for display)
  pFull: string   // full natural-language phrase
  qFull: string
}

const CONDITIONALS: Array<Conditional> = [
  {
    key: 'rain',
    p: 'it rained',
    q: 'the ground is wet',
    pFull: 'It rained',
    qFull: 'the ground is wet',
  },
  {
    key: 'study',
    p: 'she studied hard',
    q: 'she passed the exam',
    pFull: 'She studied hard',
    qFull: 'she passed the exam',
  },
  {
    key: 'button',
    p: 'you press the button',
    q: 'the alarm sounds',
    pFull: 'You press the button',
    qFull: 'the alarm sounds',
  },
]

type SecondPremise = 'p-true' | 'p-false' | 'q-true' | 'q-false'

const SECOND_PREMISES: Array<{ key: SecondPremise; label: string; description: string }> = [
  { key: 'p-true',  label: 'P is true (affirm P)',  description: 'The antecedent holds.' },
  { key: 'p-false', label: 'P is false (deny P)',   description: 'The antecedent does not hold.' },
  { key: 'q-true',  label: 'Q is true (affirm Q)',  description: 'The consequent holds.' },
  { key: 'q-false', label: 'Q is false (deny Q)',   description: 'The consequent does not hold.' },
]

type FormInfo = {
  form: ArgumentForm
  conclusion: string   // abstract
  conclusionNatural: (c: Conditional) => string
}

function getFormInfo(sp: SecondPremise): FormInfo {
  switch (sp) {
    case 'p-true':
      return {
        form: 'modus-ponens',
        conclusion: 'Q',
        conclusionNatural: (c) => c.qFull,
      }
    case 'q-false':
      return {
        form: 'modus-tollens',
        conclusion: '¬P',
        conclusionNatural: (c) => `It is NOT the case that: ${c.pFull.toLowerCase()}`,
      }
    case 'q-true':
      return {
        form: 'affirm-consequent',
        conclusion: 'P  (fallacy!)',
        conclusionNatural: (c) => `${c.pFull}  — but this doesn't follow!`,
      }
    case 'p-false':
      return {
        form: 'deny-antecedent',
        conclusion: '¬Q  (fallacy!)',
        conclusionNatural: (c) => `It is NOT the case that: ${c.qFull}  — but this doesn't follow!`,
      }
  }
}

function secondPremiseText(sp: SecondPremise, c: Conditional): string {
  switch (sp) {
    case 'p-true':  return c.pFull + '.'
    case 'p-false': return 'It is NOT the case that: ' + c.pFull.toLowerCase() + '.'
    case 'q-true':  return c.qFull.charAt(0).toUpperCase() + c.qFull.slice(1) + '.'
    case 'q-false': return 'It is NOT the case that: ' + c.qFull + '.'
  }
}

const FORM_NAMES: Record<ArgumentForm, string> = {
  'modus-ponens': 'Modus Ponens',
  'modus-tollens': 'Modus Tollens',
  'affirm-consequent': 'Affirming the Consequent',
  'deny-antecedent': 'Denying the Antecedent',
}

const FORM_ABSTRACTS: Record<ArgumentForm, Array<string>> = {
  'modus-ponens':       ['P → Q', 'P', '∴ Q'],
  'modus-tollens':      ['P → Q', '¬Q', '∴ ¬P'],
  'affirm-consequent':  ['P → Q', 'Q', '∴ P  ✗'],
  'deny-antecedent':    ['P → Q', '¬P', '∴ ¬Q  ✗'],
}

const FORM_EXPLANATIONS: Record<ArgumentForm, string> = {
  'modus-ponens':
    'Valid. If the conditional is true and the antecedent holds, the consequent must follow. This is the most fundamental valid form.',
  'modus-tollens':
    'Valid. If the conditional is true and the consequent fails, the antecedent must also fail — contrapositive reasoning.',
  'affirm-consequent':
    'FALLACY. Knowing Q is true does not guarantee P caused it. The ground can be wet for many reasons besides rain — a sprinkler, a flood, dew. This is one of the most common reasoning errors.',
  'deny-antecedent':
    'FALLACY. Knowing P is false does not mean Q is also false. The ground can still be wet even if it didn\'t rain. The conditional says nothing about what happens when P is absent.',
}

export function SyllogismMachine() {
  const [condKey, setCondKey] = useState<string>('rain')
  const [secondPremise, setSecondPremise] = useState<SecondPremise | null>(null)

  const cond = CONDITIONALS.find((c) => c.key === condKey) ?? CONDITIONALS[0]

  const formInfo = secondPremise ? getFormInfo(secondPremise) : null
  const valid = formInfo ? isValidForm(formInfo.form) : null
  const formName = formInfo ? FORM_NAMES[formInfo.form] : null
  const abstractLines = formInfo ? FORM_ABSTRACTS[formInfo.form] : null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Step 1 — pick a conditional */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold text-muted">
          1 · Choose a conditional "If P then Q":
        </p>
        <div className="flex flex-wrap gap-2">
          {CONDITIONALS.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => { setCondKey(c.key); setSecondPremise(null) }}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                condKey === c.key
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              If {c.p}…
            </button>
          ))}
        </div>
      </div>

      {/* Display P1 */}
      <div className="mb-3 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm">
        <span className="mr-2 text-xs font-semibold text-muted">P1</span>
        <span className="text-ink">
          If {cond.p}, then {cond.q}.
        </span>
      </div>

      {/* Step 2 — pick second premise */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold text-muted">
          2 · Add a second premise:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {SECOND_PREMISES.map((sp) => (
            <button
              key={sp.key}
              type="button"
              onClick={() => setSecondPremise(sp.key)}
              className={cn(
                'rounded-xl border px-3 py-2 text-left text-sm transition-colors',
                secondPremise === sp.key
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              <div className="font-semibold">{sp.label}</div>
              <div className="text-xs opacity-70">{sp.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Result pane */}
      {formInfo && secondPremise && formName && abstractLines && (
        <div className="space-y-3">
          {/* Concrete argument */}
          <div className="rounded-xl border border-border bg-surface-2 p-3">
            <p className="mb-1.5 text-xs font-semibold text-muted">Concrete argument:</p>
            <div className="space-y-1 text-sm">
              <div>
                <span className="mr-1 text-xs text-muted">P1</span>
                <span>If {cond.p}, then {cond.q}.</span>
              </div>
              <div>
                <span className="mr-1 text-xs text-muted">P2</span>
                <span>{secondPremiseText(secondPremise, cond)}</span>
              </div>
              <div
                className={cn(
                  'mt-1 rounded-lg border px-2 py-1 font-semibold',
                  valid
                    ? 'border-success/50 bg-success/10 text-success'
                    : 'border-warn/50 bg-warn/10 text-warn',
                )}
              >
                <span className="mr-1 opacity-70">∴</span>
                {formInfo.conclusionNatural(cond)}
              </div>
            </div>
          </div>

          {/* Abstract form */}
          <div className="rounded-xl border border-border bg-surface-2 p-3">
            <p className="mb-1.5 text-xs font-semibold text-muted">Abstract form:</p>
            <div className="flex flex-wrap items-center gap-2">
              {abstractLines.map((line, i) => (
                <span
                  key={i}
                  className={cn(
                    'rounded-lg border px-2 py-1 font-mono text-sm',
                    i === abstractLines.length - 1
                      ? valid
                        ? 'border-success/50 bg-success/10 text-success font-bold'
                        : 'border-warn/50 bg-warn/10 text-warn font-bold'
                      : 'border-border bg-surface text-ink',
                  )}
                >
                  {line}
                </span>
              ))}
            </div>
          </div>

          {/* Verdict */}
          <div
            className={cn(
              'flex items-center gap-3 rounded-xl border p-3',
              valid
                ? 'border-success bg-success/10'
                : 'border-warn bg-warn/10',
            )}
          >
            <Icon
              name={valid ? 'CheckCircle' : 'AlertTriangle'}
              size={22}
              className={valid ? 'text-success' : 'text-warn'}
            />
            <div>
              <div className={cn('font-bold', valid ? 'text-success' : 'text-warn')}>
                {formName} — {valid ? 'VALID' : 'FALLACY'}
              </div>
              <p className="mt-0.5 text-xs text-muted">{FORM_EXPLANATIONS[formInfo.form]}</p>
            </div>
          </div>
        </div>
      )}

      {!secondPremise && (
        <p className="mt-2 text-center text-xs text-muted">
          Pick a second premise to see which argument form appears.
        </p>
      )}
    </div>
  )
}
