import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Three theories of emotion disagree about the ORDER of four events: the
// stimulus (a bear!), bodily arousal (pounding heart), a cognitive label
// ("I'm in danger"), and the felt emotion (fear). James-Lange says the body
// comes first and feeling reads it; Cannon-Bard says body and feeling fire at
// once; Schachter-Singer says arousal needs a cognitive label before it becomes
// a specific emotion. Toggle a theory and watch the chain reorder.
type Theory = 'james' | 'cannon' | 'schachter'

type Block = 'stimulus' | 'arousal' | 'label' | 'emotion'

const BLOCKS: Record<Block, { name: string; icon: string; color: string; text: string }> = {
  stimulus: { name: 'Stimulus', icon: 'AlertTriangle', color: '#FF7043', text: 'You see a bear.' },
  arousal: { name: 'Bodily arousal', icon: 'HeartPulse', color: '#EF5350', text: 'Heart pounds, palms sweat.' },
  label: { name: 'Cognitive label', icon: 'Brain', color: '#42A5F5', text: 'Mind reads the context: "danger!"' },
  emotion: { name: 'Felt emotion', icon: 'Smile', color: '#66BB6A', text: 'You consciously feel fear.' },
}

const THEORIES: Record<
  Theory,
  { name: string; tag: string; seq: Array<Array<Block>>; idea: string }
> = {
  james: {
    name: 'James-Lange',
    tag: 'Body first, then feeling',
    // arousal must happen before we can feel; emotion is our reading of the body
    seq: [['stimulus'], ['arousal'], ['emotion']],
    idea: 'We do not tremble because we are afraid — we feel afraid because we tremble. The body reacts first; emotion is the brain reading that bodily state. (Implies a different body pattern for each emotion.)',
  },
  cannon: {
    name: 'Cannon-Bard',
    tag: 'Body and feeling at once',
    seq: [['stimulus'], ['arousal', 'emotion']],
    idea: 'The stimulus triggers bodily arousal and the conscious feeling simultaneously and independently. Your racing heart and your fear happen together — neither causes the other.',
  },
  schachter: {
    name: 'Schachter-Singer two-factor',
    tag: 'Arousal + a label = emotion',
    seq: [['stimulus'], ['arousal'], ['label'], ['emotion']],
    idea: 'Arousal alone is generic. You notice the arousal, then look to the situation for a label — and that interpretation decides which emotion you feel. Same pounding heart, different label, different emotion.',
  },
}

export function EmotionTheories() {
  const [theory, setTheory] = useState<Theory>('james')
  const t = THEORIES[theory]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(Object.keys(THEORIES) as Array<Theory>).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setTheory(k)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              theory === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {THEORIES[k].name}
          </button>
        ))}
      </div>

      <p className="mb-3 text-center text-sm font-medium text-accent">{t.tag}</p>

      {/* the sequence: each row is a stage; a row with two blocks means "at the same time" */}
      <div className="flex flex-col items-center gap-1">
        {t.seq.map((stage, si) => (
          <div key={si} className="flex w-full flex-col items-center">
            <div className="flex flex-wrap items-stretch justify-center gap-2">
              {stage.map((b) => {
                const blk = BLOCKS[b]
                return (
                  <div
                    key={b}
                    className="flex min-w-[150px] flex-1 items-center gap-2 rounded-xl border p-2.5"
                    style={{ borderColor: `${blk.color}66`, background: `${blk.color}14` }}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${blk.color}22`, color: blk.color }}
                    >
                      <Icon name={blk.icon} size={16} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-ink">{blk.name}</p>
                      <p className="text-xs leading-tight text-muted">{blk.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            {stage.length > 1 && (
              <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted">↑ at the same time ↑</span>
            )}
            {si < t.seq.length - 1 && <Icon name="ArrowDown" size={16} className="my-0.5 text-muted" />}
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl bg-surface-2 p-3">
        <p className="text-sm font-semibold text-ink">{t.name}</p>
        <p className="mt-1 text-sm leading-snug text-muted">{t.idea}</p>
      </div>
    </div>
  )
}
