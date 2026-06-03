import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Social contract: compare Hobbes, Locke, and Rousseau on the state of nature,
// human nature, and what kind of government the contract produces.

type ThinkerId = 'hobbes' | 'locke' | 'rousseau'

type Thinker = {
  id: ThinkerId
  name: string
  dates: string
  icon: string
  humanNature: string
  stateOfNature: string
  contract: string
  government: string
  accentColor: string
}

const THINKERS: Array<Thinker> = [
  {
    id: 'hobbes',
    name: 'Thomas Hobbes',
    dates: '1588–1679',
    icon: 'Swords',
    humanNature: 'Selfish and competitive by nature — each person seeks power and self-preservation above all else.',
    stateOfNature:
      'Without a ruler, life is "solitary, poor, nasty, brutish, and short." A constant war of all against all, with no security, property, or justice.',
    contract:
      'To escape the terror, people surrender nearly all their freedoms to an absolute sovereign — a "Leviathan" — in exchange for peace and protection.',
    government:
      'Absolute monarchy or strong sovereign authority. The sovereign must be nearly unlimited to prevent the chaos of the state of nature from returning.',
    accentColor: '#e05252',
  },
  {
    id: 'locke',
    name: 'John Locke',
    dates: '1632–1704',
    icon: 'ScrollText',
    humanNature:
      'Rational and capable of cooperation. People are born with natural rights to life, liberty, and property — not granted by any ruler.',
    stateOfNature:
      'Mostly peaceful and governed by natural law, but insecure — disputes arise with no impartial judge to settle them. It is inconvenient, not hellish.',
    contract:
      'People form government to protect their pre-existing natural rights. They surrender only a limited portion of freedom in exchange for an impartial arbiter.',
    government:
      'Limited, representative government with separation of powers. If the government violates natural rights, citizens have the right to revolt.',
    accentColor: '#4e9a6b',
  },
  {
    id: 'rousseau',
    name: 'Jean-Jacques Rousseau',
    dates: '1712–1778',
    icon: 'Leaf',
    humanNature:
      '"Noble savage" — people are naturally good, free, and compassionate. It is civilization itself that corrupts them.',
    stateOfNature:
      'Simple, innocent, and free. People are not naturally violent — it is private property and social inequality that create conflict.',
    contract:
      'Citizens collectively agree to be governed by the "general will" — the common interest of the whole community, not the sum of individual wants.',
    government:
      'Democratic republic where each citizen participates. Freedom is obeying the law you helped create. Individual liberty and civic duty must align.',
    accentColor: '#6b8cca',
  },
]

type Phase = 'nature' | 'contract' | 'government'

const PHASES: Array<{ id: Phase; label: string; icon: string }> = [
  { id: 'nature', label: 'State of Nature', icon: 'TreePine' },
  { id: 'contract', label: 'The Contract', icon: 'Handshake' },
  { id: 'government', label: 'Government', icon: 'Landmark' },
]

const phaseKey: Record<Phase, keyof Thinker> = {
  nature: 'stateOfNature',
  contract: 'contract',
  government: 'government',
}

export function SocialContract() {
  const [phase, setPhase] = useState<Phase>('nature')
  const [active, setActive] = useState<ThinkerId>('hobbes')

  const thinker = THINKERS.find((t) => t.id === active)!
  const key = phaseKey[phase]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Explore how three social-contract thinkers answer the same questions — step through each stage of their argument.
      </p>

      {/* Phase tabs */}
      <div className="mb-3 flex gap-2">
        {PHASES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPhase(p.id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-2 py-1.5 text-xs font-semibold transition-colors',
              phase === p.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={p.icon} size={13} />
            {p.label}
          </button>
        ))}
      </div>

      {/* Thinker selector */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        {THINKERS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={cn(
              'rounded-xl border px-2 py-2 text-center text-xs font-semibold transition-colors',
              active === t.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <div className="flex justify-center mb-1">
              <Icon name={t.icon} size={16} />
            </div>
            {t.name.split(' ').slice(-1)[0]}
            <div className="text-[10px] font-normal opacity-60">{t.dates}</div>
          </button>
        ))}
      </div>

      {/* Content panel */}
      <div className="rounded-xl border bg-surface-2 p-4" style={{ borderColor: thinker.accentColor + '55' }}>
        <div className="mb-2 flex items-center gap-2">
          <Icon name={thinker.icon} size={18} />
          <div>
            <span className="font-semibold text-ink">{thinker.name}</span>
            <span className="ml-2 text-xs text-muted">{thinker.dates}</span>
          </div>
        </div>

        {phase === 'nature' && (
          <div className="mb-3 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted">
            <span className="font-semibold text-ink">Human nature: </span>
            {thinker.humanNature}
          </div>
        )}

        <div className="rounded-lg border border-border bg-surface px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-1">
            {PHASES.find((p) => p.id === phase)?.label}
          </p>
          <p className="text-sm text-ink leading-relaxed">{thinker[key] as string}</p>
        </div>
      </div>

      {/* Quick comparison footer */}
      <div className="mt-3 grid grid-cols-3 gap-1.5 text-[10px]">
        {THINKERS.map((t) => (
          <div
            key={t.id}
            className="rounded-lg border border-border bg-surface-2 px-2 py-1.5 text-center"
          >
            <span className="block font-semibold text-ink">{t.name.split(' ').slice(-1)[0]}</span>
            <span className="text-muted">
              {t.id === 'hobbes' ? 'Absolute sovereign' : t.id === 'locke' ? 'Limited gov.' : 'General will'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
