import { useState } from 'react'
import { cn } from '#/lib/cn'

// RelativismLab — cultural relativism vs universalism across a range of cases.
// Some cases make relativism feel right; others reveal the reformer's dilemma.
// Toggle the "lens" to read each verdict. Even-handed — no inflammatory details.

type Lens = 'relativist' | 'universalist'

type Case = {
  id: string
  title: string
  description: string
  relativistVerdict: string
  universalistVerdict: string
  tension: 'relativism-favored' | 'universalism-favored' | 'genuinely-contested'
  tensionNote: string
}

const CASES: Array<Case> = [
  {
    id: 'greetings',
    title: 'Greeting customs',
    description:
      'In some cultures a bow is the proper greeting; in others, a handshake; in others, a cheek-kiss. What counts as respectful varies dramatically by region.',
    relativistVerdict:
      'Greetings have no culture-independent "correct" form. What is polite in Tokyo would be awkward in Buenos Aires. Each culture\'s norms are valid within their own context — no universal standard applies here.',
    universalistVerdict:
      'Even universalists can agree that greeting customs are conventional and harmless. What matters universally is the intent behind the greeting (respect, acknowledgment) — the specific form is morally arbitrary.',
    tension: 'relativism-favored',
    tensionNote: 'Most find relativism natural here: etiquette really does vary by convention, and no one is harmed.',
  },
  {
    id: 'diet',
    title: 'Dietary taboos',
    description:
      'Beef is sacred in some traditions; pork is forbidden in others; insects are a delicacy in many cultures and a taboo in others. Moral weight is often attached to these food rules.',
    relativistVerdict:
      'Food taboos are embedded in religious identity and communal belonging. Judging another culture\'s dietary practices as "wrong" misunderstands that their moral significance is internal to that community\'s way of life.',
    universalistVerdict:
      'Dietary choices become a genuine moral question when they involve harm — to animals, the environment, or people. The mere fact that a practice is culturally normal does not settle whether it is ethically acceptable.',
    tension: 'genuinely-contested',
    tensionNote: 'This sits in the middle: some dietary rules are clearly conventional; others touch real questions about harm and suffering.',
  },
  {
    id: 'slavery',
    title: 'Historical slavery',
    description:
      'Chattel slavery was widely practiced and legally accepted across many civilisations for millennia. Most societies that practiced it considered it normal or even morally acceptable.',
    relativistVerdict:
      'A strict relativist must say that within those societies, slavery was morally correct by their own standards. To call it wrong is to impose our modern values anachronistically onto a different cultural framework.',
    universalistVerdict:
      'The suffering, dignity-violation, and coercion involved in slavery are wrongs that do not disappear because they were socially accepted. The nearly universal consensus we have reached — that slavery is wrong — reflects moral progress, not mere cultural preference.',
    tension: 'universalism-favored',
    tensionNote:
      'This is the "reformer\'s dilemma" in sharp focus. If morality is only ever relative to a culture, we cannot coherently say slavery was wrong even for abolitionists living inside slaveholding societies.',
  },
  {
    id: 'womens_rights',
    title: 'Expanding women\'s rights',
    description:
      'Suffragists and feminists who fought for equal rights were moral reformers operating against the prevailing norms of their own cultures.',
  relativistVerdict:
      'A consistent relativist must say that when these norms existed they were "correct" for those cultures, and the reformers were by definition violating the dominant moral code. Their campaigns were — by this view — culturally deviant, not morally progressive.',
    universalistVerdict:
      'The reformers were right even when they were in the minority. Human dignity and equal treatment are not contingent on cultural approval — they hold independently of whether a given society recognises them.',
    tension: 'universalism-favored',
    tensionNote:
      'This is the heart of the reformer\'s dilemma: relativism cannot coherently honour the moral reformers it needs to call "right" in hindsight.',
  },
  {
    id: 'art_sacred',
    title: 'Sacred art & humour',
    description:
      'What counts as blasphemy, sacrilege, or disrespectful treatment of sacred objects varies enormously. A piece of art revered in one tradition may be deeply offensive in another.',
    relativistVerdict:
      'Respect for the sacred is constitutively cultural — the very concept of what is sacred is defined by community practice. Outsiders imposing a universal standard of acceptable art overrides legitimate religious meaning.',
    universalistVerdict:
      'Even allowing for cultural variation in what counts as sacred, there are universally recognisable limits: deliberate cruelty or incitement to violence around religious expression may be wrong regardless of cultural context.',
    tension: 'genuinely-contested',
    tensionNote: 'A genuine middle case: most people intuit that strong cultural variation in sacred norms is reasonable, while also feeling some actions cross a universal line.',
  },
]

const LENS_LABELS: Record<Lens, string> = {
  relativist: 'Cultural relativist',
  universalist: 'Universalist',
}

const TENSION_BADGES: Record<Case['tension'], { label: string; cls: string }> = {
  'relativism-favored': { label: 'Relativism feels right here', cls: 'border-accent/50 text-accent' },
  'universalism-favored': { label: 'Universalism feels right here', cls: 'border-accent-2/50 text-accent-2' },
  'genuinely-contested': { label: 'Genuinely contested', cls: 'border-border text-muted' },
}

export function RelativismLab() {
  const [lens, setLens] = useState<Lens>('relativist')
  const [activeCase, setActiveCase] = useState<string>(CASES[0]!.id)

  const current = CASES.find((c) => c.id === activeCase) ?? CASES[0]!
  const badge = TENSION_BADGES[current.tension]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Lens toggle */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs text-muted">View through lens:</span>
        <div className="flex gap-1">
          {(['relativist', 'universalist'] as Array<Lens>).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLens(l)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                lens === l ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
              )}
            >
              {LENS_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      {/* Case tabs */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {CASES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCase(c.id)}
            className={cn(
              'rounded-lg border px-2.5 py-1 text-xs transition-colors',
              activeCase === c.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Active case */}
      <div className="rounded-xl border border-border bg-surface-2 p-3">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-ink">{current.title}</p>
          <span className={cn('rounded-full border px-2 py-0.5 text-xs', badge.cls)}>{badge.label}</span>
        </div>
        <p className="mb-3 text-xs leading-relaxed text-muted">{current.description}</p>

        <div
          className={cn(
            'rounded-xl border p-3 transition-all',
            lens === 'relativist' ? 'border-accent/40 bg-accent/5' : 'border-accent-2/40 bg-accent-2/5',
          )}
        >
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">
            {LENS_LABELS[lens]} verdict
          </p>
          <p className="text-sm leading-relaxed text-ink">
            {lens === 'relativist' ? current.relativistVerdict : current.universalistVerdict}
          </p>
        </div>
      </div>

      {/* Tension note */}
      <div className="mt-3 rounded-xl border border-border bg-surface px-3 py-2">
        <p className="text-xs text-muted">
          <span className="font-semibold text-ink">Tension: </span>
          {current.tensionNote}
        </p>
      </div>

      {/* Framing note */}
      <div className="mt-3 rounded-xl border border-border px-3 py-2">
        <p className="text-xs leading-relaxed text-muted">
          <span className="font-semibold text-ink">The core dilemma: </span>
          Relativism honours cultural diversity and humility — but it makes moral reform incoherent (the reformer
          is always "wrong by their own culture's lights"). Universalism can ground cross-cultural criticism — but
          risks cultural arrogance if wrongly applied. Neither position is obviously correct.
        </p>
      </div>
    </div>
  )
}
