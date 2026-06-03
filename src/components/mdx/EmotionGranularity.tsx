import { useState } from 'react'
import { cn } from '#/lib/cn'

// "Name it to tame it." Emotional granularity = naming feelings precisely. Tap a
// broad core emotion to reveal the finer words beneath it; each precise feeling
// points to a different, more useful response. Owner: mental-health (W8).

type Core = {
  key: string
  label: string
  color: string
  subs: Array<{ word: string; calls: string }>
}

const CORES: Array<Core> = [
  {
    key: 'sad', label: 'Sad', color: '#5C6BC0',
    subs: [
      { word: 'Lonely', calls: 'reaching out and connection' },
      { word: 'Grief', calls: 'time and gentleness' },
      { word: 'Disappointed', calls: 'adjusting an expectation' },
      { word: 'Hurt', calls: 'naming what was crossed' },
    ],
  },
  {
    key: 'afraid', label: 'Afraid', color: '#26A69A',
    subs: [
      { word: 'Anxious', calls: 'grounding and slowing down' },
      { word: 'Overwhelmed', calls: 'reducing the demands on you' },
      { word: 'Insecure', calls: 'reassurance and preparation' },
      { word: 'Worried', calls: 'a concrete next step' },
    ],
  },
  {
    key: 'angry', label: 'Angry', color: '#EF5350',
    subs: [
      { word: 'Frustrated', calls: 'a different approach' },
      { word: 'Resentful', calls: 'an honest conversation' },
      { word: 'Irritated', calls: 'rest — your fuse is short' },
      { word: 'Let down', calls: 'naming the unmet expectation' },
    ],
  },
  {
    key: 'happy', label: 'Happy', color: '#FDD835',
    subs: [
      { word: 'Content', calls: 'savouring the moment' },
      { word: 'Proud', calls: 'acknowledging your effort' },
      { word: 'Grateful', calls: 'telling someone' },
      { word: 'Hopeful', calls: 'taking the next step' },
    ],
  },
  {
    key: 'surprised', label: 'Surprised', color: '#42A5F5',
    subs: [
      { word: 'Curious', calls: 'exploring further' },
      { word: 'Confused', calls: 'asking a question' },
      { word: 'Amazed', calls: 'sharing the wonder' },
      { word: 'Startled', calls: 'a moment to settle' },
    ],
  },
  {
    key: 'disgusted', label: 'Disgusted', color: '#AB47BC',
    subs: [
      { word: 'Uncomfortable', calls: 'noticing what feels off' },
      { word: 'Disapproving', calls: 'checking it against your values' },
      { word: 'Judgemental', calls: 'curiosity instead of certainty' },
      { word: 'Withdrawn', calls: 'a little space' },
    ],
  },
]

export function EmotionGranularity() {
  const [coreKey, setCoreKey] = useState<string | null>('sad')
  const [sub, setSub] = useState<string | null>('Lonely')

  const core = CORES.find((c) => c.key === coreKey) ?? null
  const subDetail = core?.subs.find((s) => s.word === sub) ?? null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">Start broad, then get specific. Tap a core feeling:</p>

      {/* core emotions */}
      <div className="flex flex-wrap gap-2">
        {CORES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => {
              setCoreKey(c.key)
              setSub(c.subs[0].word)
            }}
            className={cn(
              'rounded-xl border px-3 py-1.5 text-sm font-semibold transition-colors',
              coreKey === c.key ? 'text-ink' : 'border-border text-muted hover:text-ink',
            )}
            style={
              coreKey === c.key
                ? { borderColor: c.color, background: `${c.color}26` }
                : undefined
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* precise sub-feelings */}
      {core && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-muted">
            "{core.label}" is broad. Which precise word fits best?
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {core.subs.map((s) => (
              <button
                key={s.word}
                type="button"
                onClick={() => setSub(s.word)}
                className={cn(
                  'rounded-lg border px-2 py-2 text-sm transition-colors',
                  sub === s.word
                    ? 'border-accent bg-accent/15 text-accent'
                    : 'border-border text-muted hover:text-ink',
                )}
              >
                {s.word}
              </button>
            ))}
          </div>
        </div>
      )}

      {subDetail && (
        <div className="mt-4 rounded-xl border border-border bg-surface-2 p-3 text-sm">
          <p className="text-ink">
            Naming it <span className="font-semibold text-accent">"{subDetail.word}"</span> instead of just
            "bad" points to what it needs:
          </p>
          <p className="mt-1 text-muted">
            {subDetail.word} calls for <span className="font-semibold text-ink">{subDetail.calls}</span>.
          </p>
        </div>
      )}

      <p className="mt-3 text-xs text-muted">
        The more precisely you can name a feeling, the less it overwhelms you — and the clearer it
        becomes what to actually do about it.
      </p>
    </div>
  )
}
