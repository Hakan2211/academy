import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Three landmark answers to "what is intelligence?" laid side by side. Spearman
// says one underlying g; Gardner says eight independent intelligences; Sternberg
// says three abilities that matter in the real world. Pick a theory to see what
// it claims, where it shines, and where critics push back.
type Key = 'spearman' | 'gardner' | 'sternberg'

const THEORIES: Record<
  Key,
  {
    name: string
    person: string
    icon: string
    color: string
    claim: string
    parts: Array<string>
    strength: string
    weakness: string
  }
> = {
  spearman: {
    name: 'General Intelligence (g)',
    person: 'Charles Spearman, 1904',
    icon: 'Target',
    color: '#3498DB',
    claim:
      'A single underlying ability — general intelligence, or g — powers performance across every kind of mental task. People good at one thing tend to be good at others.',
    parts: ['One factor: g'],
    strength:
      'Backed by hard data: scores on wildly different tests are positively correlated (the "positive manifold"), and g predicts school and job performance better than almost any other single measure.',
    weakness:
      'Feels too narrow. It reduces a rich human mind to one number and says little about talents — music, athletics, social skill — that real life clearly rewards.',
  },
  gardner: {
    name: 'Multiple Intelligences',
    person: 'Howard Gardner, 1983',
    icon: 'Grid3x3',
    color: '#27AE60',
    claim:
      'There is no single intelligence but eight (or more) relatively independent ones. Being a gifted musician, athlete, or peacemaker counts as much as being good at maths.',
    parts: [
      'Linguistic',
      'Logical-mathematical',
      'Spatial',
      'Musical',
      'Bodily-kinesthetic',
      'Interpersonal',
      'Intrapersonal',
      'Naturalistic',
    ],
    strength:
      'Honours the full range of human talent and matches our intuition that people are "smart" in very different ways. Hugely influential in education.',
    weakness:
      'Hard to test scientifically. Critics argue several of these are really talents or personality traits, and that the "intelligences" are not as independent as claimed.',
  },
  sternberg: {
    name: 'Triarchic Theory',
    person: 'Robert Sternberg, 1985',
    icon: 'Triangle',
    color: '#E67E22',
    claim:
      'Intelligence has three sides: analytical (book smarts), creative (inventing new ideas), and practical ("street smarts" — getting things done in the real world).',
    parts: ['Analytical', 'Creative', 'Practical'],
    strength:
      'Captures why a straight-A student can flounder in the real world while a "C student" thrives — practical and creative intelligence are real and often ignored by standard tests.',
    weakness:
      'The three types overlap and correlate more than the theory predicts, and creative/practical intelligence are tricky to measure reliably.',
  },
}

const ORDER: Array<Key> = ['spearman', 'gardner', 'sternberg']

export function IntelligenceTheories() {
  const [key, setKey] = useState<Key>('spearman')
  const t = THEORIES[key]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {ORDER.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKey(k)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              key === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {THEORIES[k].name}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface-2 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${t.color}22`, color: t.color }}>
            <Icon name={t.icon} size={18} />
          </span>
          <div>
            <div className="font-semibold text-ink">{t.name}</div>
            <div className="text-xs text-muted">{t.person}</div>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink/90">{t.claim}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {t.parts.map((p) => (
            <span key={p} className="rounded-full border px-2.5 py-0.5 text-xs" style={{ borderColor: `${t.color}66`, color: t.color }}>
              {p}
            </span>
          ))}
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-success/30 bg-success/10 p-2.5">
            <div className="mb-0.5 flex items-center gap-1.5 text-xs font-semibold text-success">
              <Icon name="ThumbsUp" size={13} /> Strength
            </div>
            <p className="text-xs leading-snug text-muted">{t.strength}</p>
          </div>
          <div className="rounded-lg border border-warn/30 bg-warn/10 p-2.5">
            <div className="mb-0.5 flex items-center gap-1.5 text-xs font-semibold text-warn">
              <Icon name="ThumbsDown" size={13} /> Criticism
            </div>
            <p className="text-xs leading-snug text-muted">{t.weakness}</p>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        No theory has won outright. <span className="text-ink">g</span> is the best-measured, but Gardner and Sternberg remind us how much it leaves out.
      </p>
    </div>
  )
}
