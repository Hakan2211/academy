import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Three real item *types* from intelligence tests, so the abstract idea of "an
// IQ item" becomes concrete. A matrix (visual pattern-completion, the heart of
// Raven's Progressive Matrices), a number series (inductive reasoning), and a
// verbal analogy. Pick an answer to see whether it's right and why.
type Kind = 'matrix' | 'series' | 'analogy'

const TABS: Array<{ key: Kind; label: string; icon: string }> = [
  { key: 'matrix', label: 'Matrix', icon: 'Grid3x3' },
  { key: 'series', label: 'Number series', icon: 'Hash' },
  { key: 'analogy', label: 'Verbal analogy', icon: 'ArrowLeftRight' },
]

// A 3x3 matrix where the number of dots grows by one across each row. The
// missing bottom-right cell should hold 9 dots.
const DOTS = [1, 2, 3, 4, 5, 6, 7, 8, null]

function DotCell({ n, missing }: { n: number | null; missing?: boolean }) {
  if (missing) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-md border-2 border-dashed border-accent/60 bg-accent/5 text-2xl font-bold text-accent">
        ?
      </div>
    )
  }
  const count = n ?? 0
  // fixed 3x3 dot layout positions
  const pos = [
    [0.28, 0.28], [0.5, 0.28], [0.72, 0.28],
    [0.28, 0.5], [0.5, 0.5], [0.72, 0.5],
    [0.28, 0.72], [0.5, 0.72], [0.72, 0.72],
  ]
  return (
    <div className="relative aspect-square rounded-md border border-border bg-surface-2">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        {pos.slice(0, count).map(([x, y], i) => (
          <circle key={i} cx={x * 100} cy={y * 100} r="7" fill="var(--color-accent-2)" />
        ))}
      </svg>
    </div>
  )
}

const SERIES_OPTIONS = [21, 24, 25, 28]
const ANALOGY_OPTIONS = ['Fingers', 'Glove', 'Toes', 'Walk']

export function IQItems() {
  const [kind, setKind] = useState<Kind>('matrix')
  const [picked, setPicked] = useState<Record<Kind, number | null>>({
    matrix: null,
    series: null,
    analogy: null,
  })

  // correct option index per kind
  const correct: Record<Kind, number> = { matrix: 3, series: 2, analogy: 2 }
  const sel = picked[kind]
  const choose = (i: number) => setPicked((p) => ({ ...p, [kind]: i }))

  const matrixOptions = [6, 7, 8, 9]
  const options =
    kind === 'matrix' ? matrixOptions.map(String) : kind === 'series' ? SERIES_OPTIONS.map(String) : ANALOGY_OPTIONS

  const explanation =
    kind === 'matrix'
      ? 'The dots increase by one as you move left to right along each row: 1-2-3, 4-5-6, 7-8-… so the missing cell holds 9.'
      : kind === 'series'
        ? 'The gaps grow: +2, +3, +4, +5. After 4, 6, 9, 13, 18 the next jump is +7, giving 25.'
        : 'Foot is to shoe as hand is to glove — the second word is the covering worn over the first.'

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setKind(t.key)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors',
              kind === t.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            <Icon name={t.icon} size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface-2 p-4">
        {kind === 'matrix' && (
          <>
            <p className="mb-3 text-sm text-muted">Which figure completes the pattern?</p>
            <div className="mx-auto grid max-w-[220px] grid-cols-3 gap-1.5">
              {DOTS.map((d, i) => (
                <DotCell key={i} n={d} missing={d === null} />
              ))}
            </div>
          </>
        )}

        {kind === 'series' && (
          <>
            <p className="mb-3 text-sm text-muted">What number comes next?</p>
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-lg text-ink">
              {[4, 6, 9, 13, 18].map((n) => (
                <span key={n} className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface">
                  {n}
                </span>
              ))}
              <span className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-dashed border-accent/60 bg-accent/5 font-bold text-accent">
                ?
              </span>
            </div>
          </>
        )}

        {kind === 'analogy' && (
          <>
            <p className="mb-3 text-sm text-muted">Complete the analogy:</p>
            <p className="text-center text-lg text-ink">
              <span className="font-semibold">Foot</span> is to <span className="font-semibold">Shoe</span> as{' '}
              <span className="font-semibold">Hand</span> is to <span className="font-bold text-accent">?</span>
            </p>
          </>
        )}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((opt, i) => {
          const isCorrect = i === correct[kind]
          const isPicked = i === sel
          const show = sel !== null
          return (
            <button
              key={opt}
              type="button"
              onClick={() => choose(i)}
              className={cn(
                'rounded-xl border px-4 py-2 text-left text-sm transition-colors',
                show && isCorrect
                  ? 'border-success/50 bg-success/10 text-success'
                  : show && isPicked
                    ? 'border-warn/50 bg-warn/10 text-warn'
                    : 'border-border text-ink hover:border-accent/50',
              )}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {sel !== null && (
        <div
          className={cn(
            'mt-3 rounded-xl border p-3 text-sm',
            sel === correct[kind] ? 'border-success/40 bg-success/10' : 'border-warn/40 bg-warn/10',
          )}
        >
          <div className="mb-1 flex items-center gap-2 font-semibold">
            <Icon name={sel === correct[kind] ? 'CircleCheck' : 'Info'} size={16} />
            {sel === correct[kind] ? 'Correct!' : 'Not quite'}
          </div>
          <p className="text-muted">{explanation}</p>
        </div>
      )}

      <p className="mt-3 text-center text-xs text-muted">
        Most IQ tests mix item types like these. Notice how each taps reasoning, not memorised facts.
      </p>
    </div>
  )
}
