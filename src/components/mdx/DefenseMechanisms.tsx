import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A gallery of the classic ego defence mechanisms — the unconscious tricks the
// mind uses to shield itself from anxiety. Click any tile for its definition and
// a concrete everyday example. Presented as historical/psychodynamic theory.
// Used in psychodynamic.

const DEFENSES = [
  {
    name: 'Repression',
    icon: 'Lock',
    def: 'Pushing threatening thoughts, memories or impulses entirely out of awareness.',
    eg: 'An adult who was bullied as a child has no memory at all of that whole school year.',
  },
  {
    name: 'Denial',
    icon: 'EyeOff',
    def: 'Refusing to accept a painful reality, insisting it simply isn\'t happening.',
    eg: 'A heavy smoker with a chronic cough is certain there is nothing at all wrong with their health.',
  },
  {
    name: 'Projection',
    icon: 'Cast',
    def: 'Attributing your own unacceptable feelings or motives to someone else.',
    eg: 'Someone tempted to cheat becomes convinced — without evidence — that their partner is being unfaithful.',
  },
  {
    name: 'Displacement',
    icon: 'MoveRight',
    def: 'Redirecting an impulse from a risky target onto a safer, weaker substitute.',
    eg: 'Furious at the boss but unable to say so, you snap at your roommate the moment you get home.',
  },
  {
    name: 'Rationalisation',
    icon: 'MessageSquareText',
    def: 'Inventing a flattering, logical-sounding reason to hide the real motive.',
    eg: '"I failed because the exam was unfair" — not because you never opened the textbook.',
  },
  {
    name: 'Sublimation',
    icon: 'Sparkles',
    def: 'Channelling an unacceptable impulse into a socially valued activity. Freud saw it as the healthiest defence.',
    eg: 'A person with strong aggressive urges becomes a champion boxer or a passionate surgeon.',
  },
  {
    name: 'Regression',
    icon: 'Baby',
    def: 'Retreating to an earlier, more childlike stage of behaviour under stress.',
    eg: 'A six-year-old, anxious about a new sibling, suddenly starts sucking their thumb again.',
  },
]

export function DefenseMechanisms() {
  const [sel, setSel] = useState(0)
  const d = DEFENSES[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {DEFENSES.map((m, i) => (
          <button
            key={m.name}
            type="button"
            onClick={() => setSel(i)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center transition-colors',
              i === sel ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={m.icon} size={18} />
            <span className="text-[11px] font-medium leading-tight">{m.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-3">
        <p className="text-sm font-semibold text-ink">{d.name}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{d.def}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          <span className="font-medium text-accent">Example: </span>
          {d.eg}
        </p>
      </div>
    </div>
  )
}
