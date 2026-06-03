import { useState } from 'react'
import { cn } from '#/lib/cn'
import { Icon } from '#/components/ui/Icon'

// Hegel's dialectic as a stepper/builder. Pick an example, step through
// Thesis → Antithesis → Synthesis, then see the synthesis become a new Thesis.

type Stage = 'thesis' | 'antithesis' | 'synthesis'

type DialecticExample = {
  id: string
  label: string
  description: string
  thesis: { title: string; body: string }
  antithesis: { title: string; body: string }
  synthesis: { title: string; body: string }
  nextThesis: string
}

const EXAMPLES: DialecticExample[] = [
  {
    id: 'abstract',
    label: 'Being & Nothingness',
    description: 'Hegel\'s own opening dialectic from the Science of Logic — the most abstract possible.',
    thesis: {
      title: 'Being (pure existence)',
      body: 'Start with the most minimal concept: pure Being — simply "that something is," with no further determination. It\'s utterly indeterminate; no qualities, no content, just existence itself.',
    },
    antithesis: {
      title: 'Nothing (pure absence)',
      body: 'But Being with absolutely no determination is indistinguishable from Nothing — pure emptiness. They seem to be opposites, yet they turn into each other: pure Being is already Nothing, and vice versa.',
    },
    synthesis: {
      title: 'Becoming (motion between)',
      body: 'The truth of Being and Nothing is their unity-in-difference: Becoming. Reality is not static Being or static Nothing, but the restless movement of coming-to-be and passing-away. Becoming is the first concrete concept in philosophy.',
    },
    nextThesis: 'Becoming itself becomes the new thesis — what is it, exactly? The dialectic continues, generating richer and richer concepts.',
  },
  {
    id: 'feudalism',
    label: 'Feudalism → Capitalism',
    description: 'Marx\'s "inversion" of Hegel — material/economic conditions driving history.',
    thesis: {
      title: 'Feudalism',
      body: 'Land-based agrarian economy. Lords own the land; serfs are bound to it. The social order is fixed by birth, sanctioned by the Church. Stability — but the peasants produce a surplus extracted by the lord.',
    },
    antithesis: {
      title: 'The Rising Bourgeoisie',
      body: 'Trade, towns, and money create a new class: merchants and manufacturers. They clash with the feudal order — they need mobile labour, free markets, legal contracts, and political power. Revolutions (English, French, American) are the "antithesis" asserting itself.',
    },
    synthesis: {
      title: 'Capitalism',
      body: 'Feudal hierarchy is overthrown; free individuals own their labour and may sell it. But the synthesis contains its own internal contradiction: workers are "free" — yet have nothing to sell but their labour. A new class tension (capital vs. labour) is already latent.',
    },
    nextThesis: 'Capitalism becomes the new thesis. Its internal contradiction (capital vs. labour, accumulation vs. crisis) generates its own antithesis — and, Marx believed, eventually a further synthesis beyond capitalism.',
  },
  {
    id: 'masterslave',
    label: 'Master & Slave',
    description: 'Hegel\'s famous dialectic of recognition — how self-consciousness emerges from struggle.',
    thesis: {
      title: 'The Master',
      body: 'Two self-consciousnesses meet and struggle for recognition. One risks death; one submits. The "Master" wins recognition from the "Slave" and enjoys the fruits of the Slave\'s labour. It seems the Master has won everything.',
    },
    antithesis: {
      title: 'The Slave\'s Hidden Power',
      body: 'But the Master\'s recognition is worthless — it comes from a Slave, not a free equal. Meanwhile the Slave, working on the world, transforms it and thereby transforms himself: he comes to see his own powers objectified in what he makes. The Slave becomes the real agent of history.',
    },
    synthesis: {
      title: 'Freedom Through Labour & Recognition',
      body: 'True self-consciousness requires mutual recognition between free beings — neither dominance nor submission. The dialectic drives toward a community of free, mutually recognising persons. Both roles are transcended; neither pure mastery nor pure servitude is a stable destination.',
    },
    nextThesis: 'The synthesis of mutual recognition becomes a new thesis — raising questions about what free, equal community requires. The dialectic spirals into social philosophy, ethics, and political theory.',
  },
]

const STAGE_ORDER: Stage[] = ['thesis', 'antithesis', 'synthesis']

const STAGE_META: Record<Stage, { label: string; color: string; border: string; bg: string; icon: string }> = {
  thesis: {
    label: 'Thesis',
    color: 'text-accent',
    border: 'border-accent/40',
    bg: 'bg-accent/10',
    icon: 'ArrowUpCircle',
  },
  antithesis: {
    label: 'Antithesis',
    color: 'text-warn',
    border: 'border-warn/40',
    bg: 'bg-warn/10',
    icon: 'ArrowDownCircle',
  },
  synthesis: {
    label: 'Synthesis',
    color: 'text-success',
    border: 'border-success/40',
    bg: 'bg-success/10',
    icon: 'Sparkles',
  },
}

export function Dialectic() {
  const [exampleIdx, setExampleIdx] = useState(0)
  const [stageIdx, setStageIdx] = useState(0)
  const [showNext, setShowNext] = useState(false)

  const example = EXAMPLES[exampleIdx]!
  const currentStage = STAGE_ORDER[stageIdx]!
  const meta = STAGE_META[currentStage]

  const stageData =
    currentStage === 'thesis'
      ? example.thesis
      : currentStage === 'antithesis'
        ? example.antithesis
        : example.synthesis

  function advance() {
    if (stageIdx < 2) {
      setStageIdx((i) => i + 1)
      setShowNext(false)
    } else {
      setShowNext(true)
    }
  }

  function selectExample(idx: number) {
    setExampleIdx(idx)
    setStageIdx(0)
    setShowNext(false)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Step through Hegel's dialectic. Each stage contains the seeds of its own negation — and the synthesis rises to a higher level.
      </p>

      {/* Example selector */}
      <div className="mb-4 flex flex-col gap-1.5 sm:flex-row">
        {EXAMPLES.map((ex, i) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => selectExample(i)}
            className={cn(
              'flex-1 rounded-xl border px-2 py-2 text-left text-xs transition-colors',
              i === exampleIdx
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <div className="font-semibold">{ex.label}</div>
            <div className="mt-0.5 opacity-80">{ex.description.slice(0, 50)}…</div>
          </button>
        ))}
      </div>

      {/* Stage progress */}
      <div className="mb-4 flex items-center gap-1">
        {STAGE_ORDER.map((s, i) => {
          const m = STAGE_META[s]
          const done = i < stageIdx
          const active = i === stageIdx
          return (
            <div key={s} className="flex flex-1 items-center gap-1">
              <div
                className={cn(
                  'flex-1 rounded-xl border px-2 py-1.5 text-center text-xs font-semibold transition-colors',
                  active
                    ? `${m.border} ${m.bg} ${m.color}`
                    : done
                      ? 'border-success/30 bg-success/10 text-success'
                      : 'border-border text-muted opacity-50',
                )}
              >
                {m.label}
              </div>
              {i < 2 && (
                <Icon
                  name="ChevronRight"
                  size={12}
                  className={cn('shrink-0', done ? 'text-success' : 'text-muted opacity-30')}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Stage card */}
      <div className={cn('mb-4 rounded-xl border p-4 transition-colors', meta.border, meta.bg)}>
        <div className={cn('mb-2 flex items-center gap-2 font-semibold', meta.color)}>
          <Icon name={meta.icon as Parameters<typeof Icon>[0]['name']} size={16} />
          {meta.label}: {stageData.title}
        </div>
        <p className="text-sm text-ink">{stageData.body}</p>
      </div>

      {/* Synthesis "→ new thesis" banner */}
      {showNext && (
        <div className="mb-4 rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm">
          <div className="mb-1 flex items-center gap-2 font-semibold text-accent">
            <Icon name="RefreshCw" size={14} />
            The synthesis becomes a new thesis
          </div>
          <p className="text-muted">{example.nextThesis}</p>
          <p className="mt-2 text-xs text-muted italic">
            This is what makes the dialectic dynamic: it never reaches a final resting point — each
            higher synthesis carries its own internal tension, driving the movement forward.
          </p>
        </div>
      )}

      {/* Triadic diagram (always visible) */}
      <div className="mb-4 flex items-center justify-around rounded-xl border border-border bg-surface-2 px-3 py-3">
        <div className="flex flex-col items-center gap-0.5">
          <div className="text-xs font-semibold text-accent">Thesis</div>
          <div className="text-[11px] text-muted">An idea</div>
        </div>
        <Icon name="Plus" size={12} className="text-muted" />
        <div className="flex flex-col items-center gap-0.5">
          <div className="text-xs font-semibold text-warn">Antithesis</div>
          <div className="text-[11px] text-muted">Its negation</div>
        </div>
        <Icon name="ArrowRight" size={12} className="text-muted" />
        <div className="flex flex-col items-center gap-0.5">
          <div className="text-xs font-semibold text-success">Synthesis</div>
          <div className="text-[11px] text-muted">Higher unity</div>
        </div>
        <Icon name="ArrowRight" size={12} className="text-muted" />
        <div className="flex flex-col items-center gap-0.5">
          <div className="text-xs font-semibold text-accent">New Thesis</div>
          <div className="text-[11px] text-muted">Repeat</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setStageIdx(0); setShowNext(false) }}
          disabled={stageIdx === 0 && !showNext}
          className={cn(
            'flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors',
            stageIdx === 0 && !showNext
              ? 'cursor-not-allowed border-border text-muted opacity-40'
              : 'border-border text-muted hover:text-ink',
          )}
        >
          <Icon name="RotateCcw" size={14} />
          Reset
        </button>
        <button
          type="button"
          onClick={advance}
          disabled={showNext}
          className={cn(
            'flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors',
            showNext
              ? 'cursor-not-allowed border-border text-muted opacity-40'
              : 'border-accent bg-accent/15 text-accent hover:bg-accent/25',
          )}
        >
          {stageIdx === 0
            ? 'Show Antithesis'
            : stageIdx === 1
              ? 'Show Synthesis'
              : 'See the spiral continue'}
          <Icon name="ChevronRight" size={14} />
        </button>
      </div>
    </div>
  )
}
