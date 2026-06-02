import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Carol Dweck's fixed vs growth mindset. Pick a real situation, then choose the
// fixed-mindset or growth-mindset interpretation and see how each reading shapes
// the likely outcome. Built for World 17's lesson on mindset & optimism.
type Scenario = {
  key: string
  icon: string
  prompt: string
  fixed: string
  fixedOutcome: string
  growth: string
  growthOutcome: string
}

const SCENARIOS: Array<Scenario> = [
  {
    key: 'setback',
    icon: 'TrendingDown',
    prompt: 'You fail an important test.',
    fixed: '"I\'m just not a maths person. I never will be."',
    fixedOutcome: 'Failure feels like a verdict on your fixed ability, so you withdraw, hide the result, and avoid the subject.',
    growth: '"I haven\'t mastered this yet. What did I miss, and how do I study differently?"',
    growthOutcome: 'Failure becomes information. You analyse mistakes, adjust your approach, and improve next time.',
  },
  {
    key: 'criticism',
    icon: 'MessageSquare',
    prompt: 'You get harsh feedback on your work.',
    fixed: '"They think I\'m no good. There\'s no point even trying."',
    fixedOutcome: 'Criticism feels like a personal attack, so you get defensive, dismiss it, and learn nothing from it.',
    growth: '"This stings — but what can I actually use here to get better?"',
    growthOutcome: 'Criticism becomes a free coaching session. You mine it for the one or two changes that level you up.',
  },
  {
    key: 'effort',
    icon: 'Flame',
    prompt: 'A task turns out to be really hard.',
    fixed: '"If I have to work this hard, I must not have the talent."',
    fixedOutcome: 'Effort feels like proof of inadequacy, so you quit early to protect the story that you\'re "naturally gifted".',
    growth: '"Effort is how the brain grows. This struggle is the work paying off."',
    growthOutcome: 'Effort becomes the path to mastery. You lean into the hard part — exactly where the learning happens.',
  },
  {
    key: 'others',
    icon: 'Users',
    prompt: "Someone else succeeds where you're struggling.",
    fixed: '"They\'re just smarter than me. I could never do that."',
    fixedOutcome: 'Others\' success feels threatening, so you envy them and avoid the comparison instead of learning from it.',
    growth: '"What are they doing that works? I can learn from how they got there."',
    growthOutcome: 'Others\' success becomes a roadmap. You study their methods and borrow what fits you.',
  },
]

type Choice = 'fixed' | 'growth' | null

export function GrowthMindset() {
  const [i, setI] = useState(0)
  const [choice, setChoice] = useState<Choice>(null)
  const s = SCENARIOS[i]

  const pick = (next: number) => {
    setI(next)
    setChoice(null)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {SCENARIOS.map((sc, k) => (
          <button
            key={sc.key}
            type="button"
            onClick={() => pick(k)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
              k === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={sc.icon} size={15} />
          </button>
        ))}
      </div>

      <p className="mb-3 text-base font-semibold text-ink">{s.prompt}</p>
      <p className="mb-2 text-sm text-muted">Which interpretation runs through your head?</p>

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setChoice('fixed')}
          className={cn(
            'rounded-xl border p-3 text-left text-sm transition-colors',
            choice === 'fixed' ? 'border-[#E74C3C] bg-[#E74C3C]/10' : 'border-border bg-surface-2 hover:border-[#E74C3C]/50',
          )}
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-[#E74C3C]">Fixed mindset</span>
          <p className="mt-1 italic text-ink">{s.fixed}</p>
        </button>
        <button
          type="button"
          onClick={() => setChoice('growth')}
          className={cn(
            'rounded-xl border p-3 text-left text-sm transition-colors',
            choice === 'growth' ? 'border-accent bg-accent/15' : 'border-border bg-surface-2 hover:border-accent/50',
          )}
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-accent">Growth mindset</span>
          <p className="mt-1 italic text-ink">{s.growth}</p>
        </button>
      </div>

      {choice && (
        <div className="mt-3 rounded-xl bg-surface-2 p-3">
          <p
            className="flex items-start gap-1.5 text-sm leading-snug"
            style={{ color: choice === 'growth' ? 'var(--color-success)' : '#E74C3C' }}
          >
            <Icon name={choice === 'growth' ? 'ArrowUpRight' : 'ArrowDownRight'} size={15} className="mt-0.5 shrink-0" />
            <span>{choice === 'growth' ? s.growthOutcome : s.fixedOutcome}</span>
          </p>
        </div>
      )}

      <p className="mt-3 text-center text-xs text-muted">
        Same event, two readings. The <span className="text-ink">fixed</span> view treats ability as carved in stone; the{' '}
        <span className="text-ink">growth</span> view treats it as trainable — and that belief alone reshapes what you do
        next.
      </p>
    </div>
  )
}
