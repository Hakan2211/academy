import { useState } from 'react'
import { cn } from '#/lib/cn'

// The problem of evil as a logical structure: show the three divine attributes
// plus the fact of suffering, then let the user explore theodicy responses.
// Even-handed — presents both the problem's force and the responses seriously.

type Theodicy = {
  id: string
  name: string
  claim: string
  strength: string
  challenge: string
}

const THEODICIES: Array<Theodicy> = [
  {
    id: 'freewill',
    name: 'The Free-Will Defence',
    claim:
      'God gave humans genuinely free will — the ability to choose between good and evil. Much suffering (war, cruelty, oppression) is the result of human choices, not God\'s design. A world with genuine freedom, even if it includes the possibility of great evil, may be more valuable than a world of "pre-programmed" beings who can only do good.',
    strength:
      'Addresses moral evil (suffering caused by human choices) powerfully. A God who could only create beings incapable of evil would not be creating free agents at all.',
    challenge:
      'Natural evil — earthquakes, cancers, childhood disease — is not caused by human choices. The free-will defence does not obviously extend to explain why an omnipotent God could not eliminate suffering that has nothing to do with human freedom.',
  },
  {
    id: 'soulmaking',
    name: "Soul-Making (Irenaeus / Hick)",
    claim:
      "John Hick, following the early Christian theologian Irenaeus, argued that humans are not created perfect — we are created with the potential for perfection, which must be developed through struggle. A world without hardship, temptation, and adversity could not produce courage, compassion, patience, or wisdom. Suffering is the medium of spiritual growth.",
    strength:
      'Extends to natural evil. A world of instant gratification and no challenges cannot produce mature, morally developed persons. The challenge of suffering is, on this view, part of what it means to be human.',
    challenge:
      "Some suffering seems radically disproportionate to any growth it could produce — the Holocaust, the death of infants, extreme chronic pain. It is hard to believe that all suffering is soul-making at any intelligible scale.",
  },
  {
    id: 'limits',
    name: 'Limits of Human Understanding',
    claim:
      "Perhaps we are not in a position to judge whether God has sufficient reasons for permitting evil. An infinite God's reasons may be as far beyond our comprehension as a surgeon's reasons are beyond a dog's on the operating table. What looks like pointless suffering from our limited perspective may serve purposes we cannot grasp.",
    strength:
      "Consistent with the epistemic situation of finite creatures facing an infinite being. It may be arrogant to assume that if we cannot see a justification, none exists.",
    challenge:
      'Critics (including William Rowe) argue this moves toward agnosticism rather than theism. If we cannot assess God\'s reasons at all, what positive reason do we have to believe they are good? The move seems to insulate theism from any evidence.',
  },
]

type View = 'problem' | string

export function ProblemOfEvil() {
  const [view, setView] = useState<View>('problem')
  const [openTheodicy, setOpenTheodicy] = useState<string | null>(null)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Navigation */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setView('problem')}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            view === 'problem' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          The Problem
        </button>
        <button
          type="button"
          onClick={() => setView('theodicies')}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            view === 'theodicies' ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
          )}
        >
          Theodicy Responses
        </button>
      </div>

      {view === 'problem' && (
        <div className="space-y-3">
          <p className="text-sm text-muted">
            The problem of evil is a logical argument against a specific conception of God. Here are its four
            premises, which appear to be in tension:
          </p>

          {[
            {
              label: 'Omnipotent',
              desc: 'God is all-powerful — able to prevent any evil or suffering.',
              color: 'text-accent',
            },
            {
              label: 'Omnibenevolent',
              desc: 'God is all-good — always desires the best for creation.',
              color: 'text-accent-2',
            },
            {
              label: 'Omniscient',
              desc: 'God is all-knowing — aware of every instance of suffering.',
              color: 'text-success',
            },
            {
              label: 'Evil exists',
              desc: 'The world contains vast amounts of suffering and evil — war, disease, cruelty, the death of innocents.',
              color: 'text-warn',
            },
          ].map(({ label, desc, color }) => (
            <div key={label} className="flex items-start gap-3 rounded-xl border border-border bg-surface-2 p-3">
              <span className={cn('mt-0.5 shrink-0 text-xs font-bold uppercase tracking-wide', color)}>{label}</span>
              <p className="text-sm text-ink">{desc}</p>
            </div>
          ))}

          <div className="rounded-xl border border-warn bg-warn/10 px-3 py-2">
            <p className="text-sm font-semibold text-warn">The tension:</p>
            <p className="mt-1 text-sm text-ink">
              If God is omnipotent, God could eliminate evil. If God is omnibenevolent, God would want to. If God
              is omniscient, God knows where it is. Yet evil exists. Epicurus stated it early:{' '}
              <span className="italic">
                "Is God willing to prevent evil, but not able? Then he is not omnipotent. Is he able, but not
                willing? Then he is malevolent. Is he both able and willing? Then whence cometh evil? Is he neither
                able nor willing? Then why call him God?"
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
            Note: the problem targets a specific conception of God — omnipotent, omnibenevolent, omniscient. Many
            religious traditions hold more nuanced conceptions of the divine. The problem&rsquo;s force depends on
            which conception is in view. Explore the theodicy responses to see how theists have replied.
          </div>

          <button
            type="button"
            onClick={() => setView('theodicies')}
            className="mt-1 w-full rounded-lg border border-accent px-3 py-2 text-sm text-accent transition-colors hover:bg-accent/15"
          >
            See the theodicy responses &rarr;
          </button>
        </div>
      )}

      {view === 'theodicies' && (
        <div className="space-y-2">
          <p className="mb-3 text-sm text-muted">
            A <span className="font-semibold text-ink">theodicy</span> is an attempt to justify or explain why an
            all-good, all-powerful God would permit evil. Select each to read its claim, its strength, and its
            challenge.
          </p>
          {THEODICIES.map((t) => (
            <div key={t.id} className="rounded-xl border border-border bg-surface-2">
              <button
                type="button"
                onClick={() => setOpenTheodicy(openTheodicy === t.id ? null : t.id)}
                className="flex w-full items-center justify-between px-3 py-2 text-left"
              >
                <span className="text-sm font-semibold text-ink">{t.name}</span>
                <span className="text-xs text-muted">{openTheodicy === t.id ? '▲' : '▼'}</span>
              </button>
              {openTheodicy === t.id && (
                <div className="space-y-2 border-t border-border px-3 pb-3 pt-2">
                  <p className="text-sm text-ink">{t.claim}</p>
                  <div className="rounded-lg border border-success bg-success/10 px-2 py-1.5">
                    <p className="text-xs font-semibold text-success">Strength</p>
                    <p className="text-xs text-ink">{t.strength}</p>
                  </div>
                  <div className="rounded-lg border border-warn bg-warn/10 px-2 py-1.5">
                    <p className="text-xs font-semibold text-warn">Challenge</p>
                    <p className="text-xs text-ink">{t.challenge}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="mt-3 rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
            The problem of evil remains one of philosophy&rsquo;s most debated questions. Whether any theodicy
            fully dissolves the tension is itself contested — and thoughtful people, both religious and not, reach
            different conclusions.
          </div>
        </div>
      )}
    </div>
  )
}
