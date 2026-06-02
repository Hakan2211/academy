import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Martin Seligman's PERMA model of flourishing. Well-being isn't one thing —
// it's five buildable pillars. Click a pillar to read what it is and a concrete
// way to grow it. Built for World 17's opening lesson on the science of happiness.
type Pillar = {
  key: string
  letter: string
  name: string
  icon: string
  color: string
  what: string
  build: string
}

const PILLARS: Array<Pillar> = [
  {
    key: 'positive',
    letter: 'P',
    name: 'Positive emotion',
    icon: 'Smile',
    color: '#FFD54A',
    what: 'The pleasant side of life — joy, gratitude, contentment, hope, amusement. Not just feeling good now, but cultivating a warm relationship with your past and an optimistic eye on your future.',
    build: 'Savour small good moments, keep a gratitude habit, and do more of the simple things that reliably lift you.',
  },
  {
    key: 'engagement',
    letter: 'E',
    name: 'Engagement',
    icon: 'Target',
    color: '#FF8A65',
    what: 'Being fully absorbed in what you do — losing yourself in an activity so completely that time vanishes. This is "flow", and it comes from matching a real challenge to your skill.',
    build: 'Find activities that stretch you just past your comfort zone, and protect blocks of uninterrupted focus.',
  },
  {
    key: 'relationships',
    letter: 'R',
    name: 'Relationships',
    icon: 'Heart',
    color: '#F06292',
    what: 'Warm, supportive connections with others. Of all the pillars, this is the one the long-term studies point to most: people are wired to flourish in the company of those they love.',
    build: 'Invest in a few close bonds — reach out, show up, and respond actively when others share good news.',
  },
  {
    key: 'meaning',
    letter: 'M',
    name: 'Meaning',
    icon: 'Compass',
    color: '#9575CD',
    what: 'Belonging to and serving something larger than yourself — a cause, a craft, a faith, a family, a community. A sense that your life points somewhere beyond your own comfort.',
    build: 'Connect your daily effort to a purpose you care about, and give time to something bigger than yourself.',
  },
  {
    key: 'accomplishment',
    letter: 'A',
    name: 'Accomplishment',
    icon: 'Trophy',
    color: '#4FC3F7',
    what: 'Pursuing and reaching goals, growing in mastery, and feeling competent. The satisfaction of having tried hard at something and gotten better — for its own sake.',
    build: 'Set goals that matter to you, break them into reachable steps, and notice the progress you actually make.',
  },
]

export function WellBeingModel() {
  const [active, setActive] = useState('relationships')
  const p = PILLARS.find((x) => x.key === active) ?? PILLARS[0]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-center text-sm text-muted">
        Seligman&apos;s <span className="font-semibold text-ink">PERMA</span> model — five buildable pillars of a flourishing
        life. Tap one.
      </p>

      <div className="grid grid-cols-5 gap-2">
        {PILLARS.map((pl) => {
          const sel = active === pl.key
          return (
            <button
              key={pl.key}
              type="button"
              onClick={() => setActive(pl.key)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl border p-2 transition-colors',
                sel ? 'border-accent bg-accent/15' : 'border-border bg-surface-2 hover:border-accent/50',
              )}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg text-base font-bold"
                style={{ background: `${pl.color}22`, color: pl.color }}
              >
                {pl.letter}
              </span>
              <span className={cn('text-center text-[10px] leading-tight', sel ? 'text-ink' : 'text-muted')}>
                {pl.name}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${p.color}22`, color: p.color }}>
            <Icon name={p.icon} size={18} />
          </span>
          <span className="text-base font-semibold text-ink">{p.name}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{p.what}</p>
        <p className="mt-2 flex items-start gap-1.5 text-sm leading-snug" style={{ color: p.color }}>
          <Icon name="Sprout" size={14} className="mt-0.5 shrink-0" />
          <span>{p.build}</span>
        </p>
      </div>
    </div>
  )
}
