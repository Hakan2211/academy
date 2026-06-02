import { useState } from 'react'
import { cn } from '#/lib/cn'

// Kohlberg's Heinz dilemma. A man's wife is dying; the only cure costs far more
// than he can pay and the druggist won't budge. Should Heinz steal it? Kohlberg
// found that the YES/NO barely matters — what reveals moral level is the REASON.
// Pick a justification and see which level of reasoning it maps to.
type Level = 'pre' | 'conv' | 'post'

const LEVELS: Record<Level, { name: string; tag: string; color: string; gist: string }> = {
  pre: {
    name: 'Preconventional',
    tag: 'Level 1',
    color: '#E17055',
    gist: 'Morality is about consequences to the self — avoiding punishment and getting rewards. Typical of young children.',
  },
  conv: {
    name: 'Conventional',
    tag: 'Level 2',
    color: '#74B9FF',
    gist: 'Morality means upholding social rules, laws and others’ approval. Typical of most adolescents and adults.',
  },
  post: {
    name: 'Postconventional',
    tag: 'Level 3',
    color: '#A29BFE',
    gist: 'Morality rests on abstract principles — justice, human rights, the value of life — that can outrank a specific law.',
  },
}

const CHOICES: Array<{ text: string; level: Level; why: string }> = [
  {
    text: 'He shouldn’t steal it — he’ll be caught and thrown in jail.',
    level: 'pre',
    why: 'The reasoning is purely about avoiding punishment to himself. That’s preconventional, whatever the verdict.',
  },
  {
    text: 'He should steal it — if he lets her die, people will blame him for not being a good husband.',
    level: 'conv',
    why: 'This appeals to social roles and others’ approval (being a "good husband"). That’s conventional reasoning.',
  },
  {
    text: 'He shouldn’t steal it — stealing is against the law, and society falls apart if everyone breaks laws.',
    level: 'conv',
    why: 'This is about maintaining law and social order for its own sake — the hallmark of conventional reasoning.',
  },
  {
    text: 'He should steal it — a human life is worth more than any property or profit, on principle.',
    level: 'post',
    why: 'This appeals to an abstract principle (the supreme value of life) that can override the law itself — postconventional.',
  },
]

export function KohlbergDilemma() {
  const [picked, setPicked] = useState<number | null>(null)
  const sel = picked === null ? null : CHOICES[picked]
  const lvl = sel ? LEVELS[sel.level] : null

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 rounded-xl bg-surface-2 p-3">
        <p className="text-sm leading-snug text-muted">
          <span className="font-semibold text-ink">The Heinz dilemma: </span>
          Heinz’s wife is dying. A druggist has the one drug that could save her but charges ten times what it costs to make, and Heinz can’t afford it. The druggist refuses to lower the price or wait for payment. Should Heinz break in and steal the drug?
        </p>
      </div>

      <p className="mb-2 px-1 text-xs text-muted">Pick the justification closest to your own:</p>
      <div className="space-y-2">
        {CHOICES.map((c, k) => (
          <button
            key={k}
            type="button"
            onClick={() => setPicked(k)}
            className={cn(
              'w-full rounded-xl border p-2.5 text-left text-sm leading-snug transition-colors',
              picked === k ? 'border-accent bg-accent/15 text-ink' : 'border-border text-muted hover:text-ink',
            )}
          >
            {c.text}
          </button>
        ))}
      </div>

      {sel && lvl && (
        <div className="mt-3 rounded-xl bg-surface-2 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: lvl.color }}>
            {lvl.tag}: {lvl.name}
          </p>
          <p className="mt-1 text-sm leading-snug text-ink">{sel.why}</p>
          <p className="mt-1.5 text-sm leading-snug text-muted">{lvl.gist}</p>
          <p className="mt-2 text-xs leading-snug text-muted">
            Notice: two people can both say "steal it" (or both say "don’t") yet reason at totally different levels. For Kohlberg, it’s the <span className="text-ink">why</span>, not the yes/no, that marks moral maturity.
          </p>
        </div>
      )}
    </div>
  )
}
