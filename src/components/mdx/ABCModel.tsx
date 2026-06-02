import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Albert Ellis's ABC model, the heart of REBT (and of CBT). It is not the
// Activating event that upsets us but the Belief we hold about it; the Belief
// drives the emotional Consequence. Keep the SAME event, flip the belief from
// irrational to rational (disputed), and watch the consequence transform. The
// classic insight: change B and C changes — even though A is identical.
type Belief = 'irrational' | 'rational'

type Scenario = {
  id: string
  a: string
  beliefs: Record<Belief, { text: string; emotion: string; intensity: number; healthy: boolean }>
}

const SCENARIOS: Array<Scenario> = [
  {
    id: 'rejection',
    a: 'A friend doesn’t reply to your text all day.',
    beliefs: {
      irrational: {
        text: 'They must be angry at me — I always ruin things, and being disliked is unbearable.',
        emotion: 'Panic & despair',
        intensity: 88,
        healthy: false,
      },
      rational: {
        text: 'I’d prefer a quick reply, but people get busy. One silence doesn’t define me or the friendship.',
        emotion: 'Mild concern',
        intensity: 30,
        healthy: true,
      },
    },
  },
  {
    id: 'exam',
    a: 'You score lower than you hoped on a practice exam.',
    beliefs: {
      irrational: {
        text: 'This proves I’m stupid. I must be perfect or I’m a total failure.',
        emotion: 'Shame & dread',
        intensity: 85,
        healthy: false,
      },
      rational: {
        text: 'That’s disappointing, and it shows exactly what to revise. A bad score is information, not a verdict.',
        emotion: 'Motivated resolve',
        intensity: 35,
        healthy: true,
      },
    },
  },
  {
    id: 'criticism',
    a: 'Your manager gives you critical feedback in a meeting.',
    beliefs: {
      irrational: {
        text: 'Everyone now thinks I’m incompetent. I can’t stand looking bad — it’s catastrophic.',
        emotion: 'Humiliation & anger',
        intensity: 82,
        healthy: false,
      },
      rational: {
        text: 'I don’t like being corrected publicly, but feedback helps me improve. It’s uncomfortable, not catastrophic.',
        emotion: 'Slight unease',
        intensity: 28,
        healthy: true,
      },
    },
  },
]

export function ABCModel() {
  const [scId, setScId] = useState(SCENARIOS[0].id)
  const [belief, setBelief] = useState<Belief>('irrational')
  const sc = SCENARIOS.find((s) => s.id === scId)!
  const b = sc.beliefs[belief]
  const cColor = b.healthy ? '#27AE60' : '#E74C3C'

  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScId(s.id)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              scId === s.id ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            Event {i + 1}
          </button>
        ))}
      </div>

      {/* A — activating event (fixed) */}
      <div className="rounded-xl border border-border bg-surface-2 p-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[11px] font-bold text-ink">A</span>
          Activating event
        </p>
        <p className="mt-1 text-sm text-ink">{sc.a}</p>
      </div>

      <div className="my-1 flex justify-center text-muted">
        <Icon name="ArrowDown" size={16} />
      </div>

      {/* B — belief (toggle) */}
      <div className="rounded-xl border p-3 transition-colors" style={{ borderColor: `${cColor}55`, background: `${cColor}0f` }}>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[11px] font-bold text-ink">B</span>
            Belief
          </p>
          <div className="flex gap-1.5">
            {(['irrational', 'rational'] as Array<Belief>).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setBelief(k)}
                className={cn(
                  'rounded-full border px-2.5 py-0.5 text-xs capitalize transition-colors',
                  belief === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
                )}
              >
                {k === 'rational' ? 'disputed / rational' : 'irrational'}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2 text-sm italic text-ink">“{b.text}”</p>
      </div>

      <div className="my-1 flex justify-center text-muted">
        <Icon name="ArrowDown" size={16} />
      </div>

      {/* C — consequence (emotion) */}
      <div className="rounded-xl border border-border bg-surface-2 p-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[11px] font-bold text-ink">C</span>
          Consequence (emotion)
        </p>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: cColor }}>{b.emotion}</span>
          <span className="font-mono text-xs text-muted">{b.intensity}/100</span>
        </div>
        <div className="mt-1 h-3 overflow-hidden rounded-full bg-surface ring-1 ring-border">
          <div className="h-full transition-all" style={{ width: `${b.intensity}%`, background: cColor }} />
        </div>
      </div>

      <p className="mt-3 px-1 text-xs leading-relaxed text-muted">
        The event never changed — only the <span className="text-ink">belief</span> in the middle did. Disputing the irrational
        belief is exactly the work of REBT and cognitive therapy: same A, healthier B, gentler C.
      </p>
    </div>
  )
}
