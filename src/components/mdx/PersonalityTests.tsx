import { useState } from 'react'
import { cn } from '#/lib/cn'

// Compare the two great families of personality assessment. Objective tests
// (MMPI-style) use fixed true/false items, scored against empirical norms —
// high reliability, but fakeable and shallow. Projective tests (Rorschach
// inkblot, TAT) present an ambiguous image and read meaning into the response —
// rich but low in reliability. The learner answers a sample item of each kind.
// Used in the-self-and-assessment.

type Mode = 'objective' | 'projective'

const ITEMS = ['I rarely worry about things that might go wrong.', 'I enjoy being the centre of attention at parties.', 'People often seem to misunderstand my intentions.']

export function PersonalityTests() {
  const [mode, setMode] = useState<Mode>('objective')
  // objective: a true/false answer per item
  const [answers, setAnswers] = useState<Array<boolean | null>>([null, null, null])
  // projective: which interpretation the learner reads into the blot
  const [blotSeen, setBlotSeen] = useState<number | null>(null)

  const setAns = (i: number, v: boolean) =>
    setAnswers((a) => a.map((old, k) => (k === i ? v : old)))

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(['objective', 'projective'] as Array<Mode>).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              mode === m ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {m === 'objective' ? 'Objective (MMPI-style)' : 'Projective (inkblot / TAT)'}
          </button>
        ))}
      </div>

      {mode === 'objective' ? (
        <div className="space-y-2">
          <p className="text-sm text-muted">
            You get hundreds of fixed statements. Answer <span className="text-ink">True</span> or <span className="text-ink">False</span>; a computer scores the pattern against thousands of past responders.
          </p>
          {ITEMS.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 p-3">
              <span className="text-sm text-ink">{item}</span>
              <div className="flex shrink-0 gap-1.5">
                {([['True', true], ['False', false]] as Array<[string, boolean]>).map(([lab, val]) => (
                  <button
                    key={lab}
                    type="button"
                    onClick={() => setAns(i, val)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs transition-colors',
                      answers[i] === val ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
                    )}
                  >
                    {lab}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="rounded-xl bg-surface-2 p-3 text-sm leading-snug text-muted">
            <span className="font-semibold text-ink">How it scores: </span>items are <span className="text-accent">empirically keyed</span> — kept only if real groups answered them differently. Everyone is scored the same way, so reliability is <span className="text-success">high</span>. The cost: items are transparent and can be <span className="text-ink">faked</span> ("fake good" on a job test).
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted">
            You see an ambiguous, meaningless image and say what you see. The idea: with nothing real to react to, you <span className="text-ink">project</span> your own inner world onto it.
          </p>
          <svg viewBox="0 0 200 130" className="mx-auto block w-full max-w-[260px]">
            <rect x="0" y="0" width="200" height="130" rx="10" fill="var(--color-surface-2)" />
            {/* a symmetric inkblot built from mirrored blobs */}
            <g fill="#0b1020">
              <path d="M100 22 C 78 18 70 40 64 58 C 56 80 40 84 44 100 C 50 118 86 112 100 96 Z" />
              <path d="M100 22 C 122 18 130 40 136 58 C 144 80 160 84 156 100 C 150 118 114 112 100 96 Z" />
              <ellipse cx="74" cy="64" rx="10" ry="14" />
              <ellipse cx="126" cy="64" rx="10" ry="14" />
            </g>
          </svg>
          <p className="text-center text-sm text-ink">What do you see in this blot?</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {['A bat or moth', 'Two people dancing', 'A scary mask'].map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => setBlotSeen(i)}
                className={cn(
                  'rounded-xl border px-3 py-2 text-sm transition-colors',
                  blotSeen === i ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          {blotSeen !== null && (
            <div className="rounded-xl bg-surface-2 p-3 text-sm leading-snug text-muted">
              A clinician would interpret your answer — but here's the catch: two trained scorers often <span className="text-ink">disagree</span> about what your response "means", and the same image yields different readings on different days. That makes reliability and validity <span className="text-danger">low and hotly disputed</span>. The appeal is depth: a projective test can surface themes a true/false form never could.
            </div>
          )}
        </div>
      )}

      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-lg border border-border p-2.5">
          <p className="font-semibold text-ink">Objective</p>
          <p className="mt-0.5 text-muted">+ standardised, reliable, easy to score · − transparent, fakeable, surface-level</p>
        </div>
        <div className="rounded-lg border border-border p-2.5">
          <p className="font-semibold text-ink">Projective</p>
          <p className="mt-0.5 text-muted">+ rich, hard to fake, taps the unconscious · − subjective, low reliability, hard to validate</p>
        </div>
      </div>
    </div>
  )
}
