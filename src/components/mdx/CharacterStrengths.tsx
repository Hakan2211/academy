import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A VIA-style character-strengths explorer. The VIA classification organises 24
// positive traits under six broad virtues. Here we show a representative dozen,
// grouped by virtue. Click any strength to read it; the closing note explains
// why USING your top "signature strengths" in new ways reliably lifts well-being.
type Strength = {
  key: string
  name: string
  icon: string
  virtue: string
  blurb: string
}

const STRENGTHS: Array<Strength> = [
  { key: 'curiosity', name: 'Curiosity', icon: 'Search', virtue: 'Wisdom', blurb: 'Taking an active interest in the world — exploring, asking, and finding things fascinating for their own sake.' },
  { key: 'creativity', name: 'Creativity', icon: 'Lightbulb', virtue: 'Wisdom', blurb: 'Thinking of novel and useful ways to do things — original and adaptive, not content with the obvious route.' },
  { key: 'bravery', name: 'Bravery', icon: 'Shield', virtue: 'Courage', blurb: 'Not shrinking from threat, challenge, or pain — acting on conviction even when it is unpopular or frightening.' },
  { key: 'perseverance', name: 'Perseverance', icon: 'Mountain', virtue: 'Courage', blurb: 'Finishing what you start and persisting despite obstacles — taking pleasure in completing tasks.' },
  { key: 'kindness', name: 'Kindness', icon: 'HandHeart', virtue: 'Humanity', blurb: 'Doing favours and good deeds for others, helping and caring — generous with your time and attention.' },
  { key: 'love', name: 'Love', icon: 'Heart', virtue: 'Humanity', blurb: 'Valuing close relationships — being warm, and both giving and receiving care in mutual bonds.' },
  { key: 'fairness', name: 'Fairness', icon: 'Scale', virtue: 'Justice', blurb: 'Treating everyone by the same standard of justice, not letting bias decide who deserves a fair shot.' },
  { key: 'teamwork', name: 'Teamwork', icon: 'Users', virtue: 'Justice', blurb: 'Working well as a member of a group — loyal, doing your share, contributing to a shared success.' },
  { key: 'forgiveness', name: 'Forgiveness', icon: 'HeartHandshake', virtue: 'Temperance', blurb: 'Forgiving those who have wronged you and giving people a second chance, rather than holding grudges.' },
  { key: 'humility', name: 'Humility', icon: 'Feather', virtue: 'Temperance', blurb: 'Letting your accomplishments speak for themselves — not seeking the spotlight or seeing yourself as special.' },
  { key: 'gratitude', name: 'Gratitude', icon: 'Gift', virtue: 'Transcendence', blurb: 'Being aware of and thankful for the good things that happen — and taking time to express that thanks.' },
  { key: 'hope', name: 'Hope', icon: 'Sunrise', virtue: 'Transcendence', blurb: 'Expecting the best and working to bring it about — believing a good future is something you can help create.' },
  { key: 'humor', name: 'Humour', icon: 'Smile', virtue: 'Transcendence', blurb: 'Liking to laugh and bring smiles to others — seeing the light side and lifting the mood around you.' },
]

const VIRTUE_COLOR: Record<string, string> = {
  Wisdom: '#4FC3F7',
  Courage: '#FF8A65',
  Humanity: '#F06292',
  Justice: '#81C784',
  Temperance: '#9575CD',
  Transcendence: '#FFD54A',
}

export function CharacterStrengths() {
  const [active, setActive] = useState('gratitude')
  const s = STRENGTHS.find((x) => x.key === active) ?? STRENGTHS[0]
  const color = VIRTUE_COLOR[s.virtue]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Twelve VIA character strengths, grouped under six broad virtues. Tap one to read it:
      </p>

      <div className="flex flex-wrap gap-2">
        {STRENGTHS.map((st) => {
          const sel = active === st.key
          const c = VIRTUE_COLOR[st.virtue]
          return (
            <button
              key={st.key}
              type="button"
              onClick={() => setActive(st.key)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors',
                sel ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              )}
            >
              <Icon name={st.icon} size={14} style={{ color: sel ? undefined : c }} />
              {st.name}
            </button>
          )
        })}
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${color}22`, color }}>
            <Icon name={s.icon} size={18} />
          </span>
          <div>
            <p className="text-base font-semibold text-ink">{s.name}</p>
            <p className="text-xs uppercase tracking-wide" style={{ color }}>
              Virtue of {s.virtue}
            </p>
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{s.blurb}</p>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Your top five are your <span className="text-ink">signature strengths</span>. Studies find that using a signature
        strength in a <span className="text-ink">new way</span> each day measurably raises happiness — for months.
      </p>
    </div>
  )
}
