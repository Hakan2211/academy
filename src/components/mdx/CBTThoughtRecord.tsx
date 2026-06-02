import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A CBT thought record — the workhorse tool of cognitive behavioural therapy.
// Catch an automatic negative thought, then weigh the evidence FOR and AGAINST
// it like a fair judge rather than a prosecutor. Out of that balance comes a
// more realistic, balanced thought. Watch the mood rating fall as the catch
// loosens its grip. Pick a hot thought, tick the evidence you find convincing,
// then read the reframe.
type Thought = {
  id: string
  hot: string
  moodBefore: number
  for: Array<string>
  against: Array<string>
  reframe: string
  moodAfter: number
}

const THOUGHTS: Array<Thought> = [
  {
    id: 'fail',
    hot: 'I’m going to fail everything.',
    moodBefore: 85,
    for: ['I did badly on one quiz this week', 'I feel behind right now'],
    against: [
      'I passed every module last term',
      'One quiz is a small slice of the grade',
      'I have weeks left to prepare',
      'Friends who study with me are doing fine',
    ],
    reframe: 'One weak quiz isn’t the whole picture. I’ve passed before and have time to prepare — I can recover from this.',
    moodAfter: 40,
  },
  {
    id: 'hate',
    hot: 'Everyone at the party will think I’m boring.',
    moodBefore: 78,
    for: ['I felt awkward at the last event', 'I’m not great at small talk'],
    against: [
      'People are mostly focused on themselves, not judging me',
      'A few friends specifically invited me',
      'I’ve had good conversations before',
      'I can’t actually read minds',
    ],
    reframe: 'I might feel a bit awkward, but people aren’t scrutinising me. I’ve connected with others before and can again.',
    moodAfter: 38,
  },
  {
    id: 'burden',
    hot: 'Asking for help means I’m weak and a burden.',
    moodBefore: 72,
    for: ['I’d feel embarrassed admitting I’m struggling'],
    against: [
      'I’m glad when others ask ME for help',
      'Strong people seek support all the time',
      'My friend offered, so it’s clearly welcome',
      'Trying to do everything alone is what’s wearing me down',
    ],
    reframe: 'Reaching out is a skill, not a weakness. People I respect ask for help, and someone has already offered.',
    moodAfter: 35,
  },
]

export function CBTThoughtRecord() {
  const [id, setId] = useState(THOUGHTS[0].id)
  const t = THOUGHTS.find((x) => x.id === id)!
  const [checkedFor, setCheckedFor] = useState<Set<number>>(new Set())
  const [checkedAgainst, setCheckedAgainst] = useState<Set<number>>(new Set())
  const [reframed, setReframed] = useState(false)

  const pick = (newId: string) => {
    setId(newId)
    setCheckedFor(new Set())
    setCheckedAgainst(new Set())
    setReframed(false)
  }

  const toggle = (set: Set<number>, setter: (s: Set<number>) => void, i: number) => {
    const next = new Set(set)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    setter(next)
  }

  const mood = reframed ? t.moodAfter : t.moodBefore
  const moodColor = mood > 60 ? '#E74C3C' : mood > 45 ? '#E67E22' : '#27AE60'
  const weighed = checkedAgainst.size > 0

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        {THOUGHTS.map((th, i) => (
          <button
            key={th.id}
            type="button"
            onClick={() => pick(th.id)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              id === th.id ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            Thought {i + 1}
          </button>
        ))}
      </div>

      {/* automatic negative thought */}
      <div className="rounded-xl border border-border bg-surface-2 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Automatic negative thought</p>
        <p className="mt-1 text-sm italic text-ink">“{t.hot}”</p>
      </div>

      {/* evidence columns */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border p-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: '#E74C3C' }}>
            <Icon name="ThumbsDown" size={13} /> Evidence for
          </p>
          <div className="space-y-1.5">
            {t.for.map((e, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggle(checkedFor, setCheckedFor, i)}
                className={cn(
                  'flex w-full items-start gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs transition-colors',
                  checkedFor.has(i) ? 'border-accent bg-accent/10 text-ink' : 'border-border text-muted hover:text-ink',
                )}
              >
                <span className="mt-0.5 shrink-0">{checkedFor.has(i) ? <Icon name="CheckSquare" size={13} /> : <Icon name="Square" size={13} />}</span>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border p-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: '#27AE60' }}>
            <Icon name="ThumbsUp" size={13} /> Evidence against
          </p>
          <div className="space-y-1.5">
            {t.against.map((e, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggle(checkedAgainst, setCheckedAgainst, i)}
                className={cn(
                  'flex w-full items-start gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs transition-colors',
                  checkedAgainst.has(i) ? 'border-accent bg-accent/10 text-ink' : 'border-border text-muted hover:text-ink',
                )}
              >
                <span className="mt-0.5 shrink-0">{checkedAgainst.has(i) ? <Icon name="CheckSquare" size={13} /> : <Icon name="Square" size={13} />}</span>
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* reframe */}
      <div className="mt-3">
        {reframed ? (
          <div className="rounded-xl border border-success/40 bg-success/10 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-success">
              <Icon name="Sparkles" size={13} /> Balanced thought
            </p>
            <p className="mt-1 text-sm text-ink">“{t.reframe}”</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setReframed(true)}
            disabled={!weighed}
            className={cn(
              'w-full rounded-xl border px-4 py-2 text-sm transition-colors',
              weighed ? 'border-accent bg-accent/15 text-accent' : 'cursor-not-allowed border-border text-muted/50',
            )}
          >
            {weighed ? 'Write a balanced thought' : 'Tick some counter-evidence first'}
          </button>
        )}
      </div>

      {/* mood before/after */}
      <div className="mt-3 px-1">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-muted">
            <Icon name="Activity" size={13} /> How bad it feels
          </span>
          <span className="font-mono font-semibold" style={{ color: moodColor }}>{mood}/100</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-surface-2 ring-1 ring-border">
          <div className="h-full transition-all duration-500" style={{ width: `${mood}%`, background: moodColor }} />
        </div>
        {reframed && (
          <p className="mt-1.5 text-xs text-success">
            Mood eased from {t.moodBefore} to {t.moodAfter} — the facts didn’t change, your reading of them did.
          </p>
        )}
      </div>
    </div>
  )
}
