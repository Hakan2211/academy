import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Bandura's Bobo doll, as a stepper. A child watches an adult MODEL treat the
// inflatable doll either aggressively or gently. Later, alone with the doll, the
// child tends to IMITATE what the model did — even with no reward of their own.
// Toggle the model's behaviour and walk the four phases; the child's later
// conduct flips to match, showing learning by observation alone.

type Model = 'aggressive' | 'gentle'

const PHASES: Record<Model, Array<{ title: string; body: string; child: 'watch' | 'gentle' | 'aggressive' }>> = {
  aggressive: [
    { title: '1 · The model acts', body: 'A child watches an adult repeatedly hit, kick and shout at the Bobo doll — punching it, sitting on it, calling it names.', child: 'watch' },
    { title: '2 · Mild frustration', body: 'The child is briefly shown attractive toys, then told they are for other children. A little frustration primes them to act.', child: 'watch' },
    { title: '3 · Left alone with Bobo', body: 'Now alone in the room with the Bobo doll and other toys, the child is free to do whatever they like. No one tells them to copy.', child: 'aggressive' },
    { title: '4 · The child imitates', body: 'The child attacks the doll — often using the model\'s exact moves and even the same insults. Aggression was learned purely by watching.', child: 'aggressive' },
  ],
  gentle: [
    { title: '1 · The model acts', body: 'A child watches an adult play calmly near the Bobo doll — assembling toys quietly and ignoring the doll entirely.', child: 'watch' },
    { title: '2 · Mild frustration', body: 'The same mild frustration is applied: attractive toys shown, then withheld. The setup is identical to the aggressive condition.', child: 'watch' },
    { title: '3 · Left alone with Bobo', body: 'The child is left alone with the very same doll and toys, free to behave however they wish.', child: 'gentle' },
    { title: '4 · The child imitates', body: 'This child plays gently and rarely attacks the doll — markedly less aggression than the children who watched a violent model. The model set the script.', child: 'gentle' },
  ],
}

export function BoboDoll() {
  const [model, setModel] = useState<Model>('aggressive')
  const [step, setStep] = useState(0)
  const phases = PHASES[model]
  const phase = phases[step]

  const setModelReset = (m: Model) => {
    setModel(m)
    setStep(0)
  }

  // child posture by phase
  const childAggressive = phase.child === 'aggressive'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap gap-2 p-3">
        {(['aggressive', 'gentle'] as Array<Model>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setModelReset(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm capitalize transition-colors',
              model === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m} model
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 150" className="w-full">
        {/* floor */}
        <line x1="20" y1="128" x2="340" y2="128" stroke="var(--color-border)" strokeWidth="2" />

        {/* model (adult) — only emphasised in phase 1 */}
        <g opacity={step === 0 ? 1 : 0.3} transform="translate(70 60)">
          <circle cx="0" cy="0" r="12" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
          <rect x="-9" y="14" width="18" height="40" rx="6" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
          {model === 'aggressive' ? (
            <path d="M9 22 L34 8" stroke="#E74C3C" strokeWidth="3" strokeLinecap="round" />
          ) : (
            <path d="M9 28 L26 34" stroke="var(--color-success)" strokeWidth="3" strokeLinecap="round" />
          )}
          <text x="0" y="74" fill="var(--color-muted)" fontSize="9" textAnchor="middle">model</text>
        </g>

        {/* Bobo doll (center) */}
        <g transform="translate(180 56)">
          <ellipse cx="0" cy="48" rx="26" ry="18" fill="#F7B731" stroke="#b8860b" strokeWidth="1.5" />
          <circle cx="0" cy="6" r="20" fill="#F7B731" stroke="#b8860b" strokeWidth="1.5" />
          <circle cx="-7" cy="2" r="2.5" fill="#1a1a1a" />
          <circle cx="7" cy="2" r="2.5" fill="#1a1a1a" />
          <path d="M-8 12 Q0 18 8 12" fill="none" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" />
          <text x="0" y="84" fill="var(--color-muted)" fontSize="9" textAnchor="middle">Bobo</text>
        </g>

        {/* child — emphasised in phases 3-4 */}
        <g opacity={step >= 2 ? 1 : 0.3} transform="translate(286 74)">
          <circle cx="0" cy="0" r="9" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
          <rect x="-7" y="11" width="14" height="30" rx="5" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
          {childAggressive ? (
            <path d="M-7 16 L-32 4" stroke="#E74C3C" strokeWidth="2.6" strokeLinecap="round" />
          ) : (
            <path d="M-7 22 L-22 26" stroke="var(--color-success)" strokeWidth="2.6" strokeLinecap="round" />
          )}
          <text x="0" y="58" fill="var(--color-muted)" fontSize="9" textAnchor="middle">child</text>
        </g>

        {/* imitation arrow in final phase */}
        {step === 3 && (
          <g opacity="0.8">
            <path d="M96 40 Q180 14 276 56" fill="none" stroke="var(--color-accent)" strokeWidth="1.4" strokeDasharray="4 3" />
            <text x="186" y="22" fill="var(--color-accent)" fontSize="9" textAnchor="middle">imitation</text>
          </g>
        )}
      </svg>

      <div className="min-h-[78px] px-4">
        <p className="text-sm font-semibold text-accent">{phase.title}</p>
        <p className="mt-1 text-sm leading-snug text-muted">{phase.body}</p>
      </div>

      <div className="mt-2 flex items-center justify-between px-4 pb-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-1 rounded-full border border-border px-4 py-1.5 text-sm text-muted enabled:hover:text-ink disabled:opacity-40"
        >
          <Icon name="ChevronLeft" size={15} /> Back
        </button>
        <span className="text-xs text-muted">{step + 1} of {phases.length}</span>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(phases.length - 1, s + 1))}
          disabled={step === phases.length - 1}
          className="flex items-center gap-1 rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent disabled:opacity-40"
        >
          Next <Icon name="ChevronRight" size={15} />
        </button>
      </div>
    </div>
  )
}
