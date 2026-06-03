import { useState } from 'react'
import { cn } from '#/lib/cn'

// Explorer of WHERE people locate life's meaning: five sources, each with
// a philosopher's take and a cosmic-vs-personal distinction.
// Users can browse each source and mark which resonates with them.

type Source = {
  id: string
  label: string
  icon: string
  tagline: string
  cosmicOrPersonal: 'cosmic' | 'personal' | 'both'
  description: string
  philosophers: string
  example: string
}

const SOURCES: Array<Source> = [
  {
    id: 'cosmic',
    label: 'Cosmic / Religious',
    icon: '✦',
    tagline: 'A divine plan gives life its purpose',
    cosmicOrPersonal: 'cosmic',
    description:
      "On this view, meaning flows from being part of something larger than the human realm — a divine creator who made us for a purpose, a cosmic order in which each life has its place, or a transcendent narrative in which our choices matter eternally. Life has meaning because someone intended it to, and that intention is trustworthy.",
    philosophers:
      "Aquinas held that every human being is oriented toward God as their final end (telos); meaning is a gift already given. Kierkegaard thought genuine meaning required the religious leap — a passionate personal relationship with God. C.S. Lewis argued the deep human longing for meaning is itself evidence that something real answers it.",
    example:
      "\"My life matters because I am part of a story that began before me and extends beyond me.\"",
  },
  {
    id: 'social',
    label: 'Relationships & Legacy',
    icon: '♥',
    tagline: 'Love, community, and what we leave behind',
    cosmicOrPersonal: 'personal',
    description:
      "Meaning is found in the bonds we form with others — deep friendships, family love, communities of care — and in the legacy we leave when we are gone. This source is personal rather than cosmic: meaning does not require a divine author, only genuine connection and contribution to something that outlasts you.",
    philosophers:
      "Aristotle placed friendship (philia) among the highest human goods — not an ornament to the good life but part of its substance. Viktor Frankl, who survived the Nazi death camps, wrote that love is the only force capable of lifting a person out of total meaninglessness. Confucius grounded the good life in familial and social relationships.",
    example:
      "\"What I do for the people I love — and what they do for me — is what makes my life matter.\"",
  },
  {
    id: 'achievement',
    label: 'Work, Creation & Mastery',
    icon: '◆',
    tagline: 'Building, making, and becoming excellent',
    cosmicOrPersonal: 'personal',
    description:
      "Meaning comes through engaging deeply in work or creative projects — crafting something skillfully, solving a hard problem, creating a body of work, or mastering a discipline. The value lies not just in the product but in the engagement itself: the flow state of absorbed, excellent activity.",
    philosophers:
      "Aristotle's concept of eudaimonia (flourishing) is closely tied to excellent activity — ergon done well. Csikszentmihalyi's research on flow states shows that humans report the deepest satisfaction when fully absorbed in a challenging task. Simone de Beauvoir argued that freedom is made concrete through projects that reach beyond the self.",
    example:
      "\"When I am deep in a problem I care about, building something that did not exist before, I know why I am here.\"",
  },
  {
    id: 'experiential',
    label: 'Love, Beauty & Awe',
    icon: '◎',
    tagline: 'Moments that make life feel unmistakably worth living',
    cosmicOrPersonal: 'personal',
    description:
      "Some moments need no justification — standing before a vast landscape, falling in love, hearing music that opens something in you, watching a child learn something new. These experiences feel intrinsically meaningful. They do not derive their value from fitting a larger plan; they ARE the point.",
    philosophers:
      "The Epicureans located the good life in the cultivation of genuine pleasure and the avoidance of unnecessary pain — not debauchery, but tranquil appreciation of simple goods. Iris Murdoch argued that genuine attention to beauty — in art, nature, and other persons — is itself a moral and existential achievement. Schopenhauer thought music uniquely expressed the will-to-live directly.",
    example:
      "\"There are moments so vivid and full that I know this — whatever it is — is worth it.\"",
  },
  {
    id: 'created',
    label: 'Self-Created Meaning',
    icon: '★',
    tagline: 'Meaning is made, not found',
    cosmicOrPersonal: 'both',
    description:
      "If the universe has no built-in purpose, meaning is not waiting to be discovered — it is created through the projects we commit to, the values we choose, and the stories we write about our own lives. This is neither arbitrary nor hopeless: meaning-making is the distinctive human capacity, and what we make of it genuinely matters.",
    philosophers:
      "Sartre: existence precedes essence — we are not born with a fixed nature or purpose; we forge ourselves through choice. Camus: revolt against the absurd is itself the source of passionate, self-made meaning. Susan Wolf: meaning arises when subjective engagement meets objective worth — when we love something genuinely worth loving.",
    example:
      "\"I do not wait for a purpose to be handed to me. I choose what I commit to, and that commitment is what makes it meaningful.\"",
  },
]

const COSMIC_PERSONAL_LABELS: Record<Source['cosmicOrPersonal'], { label: string; color: string }> = {
  cosmic: { label: 'Cosmic meaning', color: 'text-accent' },
  personal: { label: 'Personal meaning', color: 'text-accent-2' },
  both: { label: 'Cosmic & personal', color: 'text-success' },
}

export function MeaningSources() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [resonates, setResonates] = useState<Set<string>>(new Set())

  const active = SOURCES.find((s) => s.id === activeId)

  function toggleResonates(id: string) {
    setResonates((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Distinction callout */}
      <div className="mb-4 flex gap-3 rounded-xl border border-border bg-surface-2 p-3 text-xs">
        <div>
          <span className="font-semibold text-accent">Cosmic meaning</span>
          <span className="text-muted"> — a grand purpose for the universe or our existence (requires a cosmic author)</span>
        </div>
        <div className="hidden sm:block text-border">|</div>
        <div>
          <span className="font-semibold text-accent-2">Personal meaning</span>
          <span className="text-muted"> — what makes an individual life meaningful (no cosmic author needed)</span>
        </div>
      </div>

      <p className="mb-3 text-sm text-muted">
        Explore each source of meaning. Mark the ones that resonate with you.
      </p>

      {/* Source buttons */}
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SOURCES.map((s) => {
          const isActive = activeId === s.id
          const doesResonate = resonates.has(s.id)
          const cpInfo = COSMIC_PERSONAL_LABELS[s.cosmicOrPersonal]
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveId(isActive ? null : s.id)}
              className={cn(
                'rounded-xl border px-3 py-2.5 text-left text-sm transition-colors',
                isActive
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{s.icon}</span>
                  <span className="font-semibold">{s.label}</span>
                </div>
                {doesResonate && <span className="text-xs text-success font-medium">resonates</span>}
              </div>
              <div className={cn('mt-0.5 text-xs', cpInfo.color)}>{cpInfo.label}</div>
              <div className="mt-0.5 text-xs text-muted">{s.tagline}</div>
            </button>
          )
        })}
      </div>

      {/* Detail panel */}
      {active && (
        <div className="rounded-xl border border-border bg-surface-2 p-4 text-sm">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{active.icon}</span>
                <h3 className="font-bold text-ink">{active.label}</h3>
              </div>
              <div className={cn('mt-0.5 text-xs font-medium', COSMIC_PERSONAL_LABELS[active.cosmicOrPersonal].color)}>
                {COSMIC_PERSONAL_LABELS[active.cosmicOrPersonal].label}
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleResonates(active.id)}
              className={cn(
                'shrink-0 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                resonates.has(active.id)
                  ? 'border-success bg-success/10 text-success'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              {resonates.has(active.id) ? 'Resonates ✓' : 'Mark as resonating'}
            </button>
          </div>

          <p className="mb-3 text-ink">{active.description}</p>

          <div className="mb-3 rounded-lg border border-border bg-surface p-3">
            <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">Philosophers</div>
            <p className="text-xs text-ink">{active.philosophers}</p>
          </div>

          <div className="rounded-lg border border-accent/30 bg-accent/10 p-3">
            <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">In your own words</div>
            <p className="text-xs italic text-ink">{active.example}</p>
          </div>
        </div>
      )}

      {!active && (
        <p className="text-center text-xs text-muted">Select a source above to explore it in depth.</p>
      )}

      {resonates.size > 0 && (
        <div className="mt-4 rounded-xl border border-success/30 bg-success/10 p-3">
          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">Your constellation of meaning</div>
          <div className="flex flex-wrap gap-2">
            {SOURCES.filter((s) => resonates.has(s.id)).map((s) => (
              <span key={s.id} className="rounded-full border border-success/40 bg-success/10 px-2.5 py-0.5 text-xs text-success">
                {s.icon} {s.label}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">
            Most people draw meaning from multiple sources — this multiplicity is itself a kind of resilience.
          </p>
        </div>
      )}
    </div>
  )
}
