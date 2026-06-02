import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// Language is a layered system: a handful of meaningless sounds combine into
// meaningful units, which combine into words, which combine — by rules of
// syntax — into an infinite variety of sentences. This widget builds one
// sentence from the bottom up. Click "Build the next level" to climb the
// hierarchy: phonemes -> morphemes -> words -> a syntax tree. Each level shows
// how a small set of pieces at one tier yields the units of the next.
// Used in language.

const LEVELS = [
  {
    name: 'Phonemes',
    sub: 'the smallest units of sound — meaningless on their own',
    body: '/k/  /æ/  /t/  /s/  /ɪ/  /t/',
    note: 'English uses ~44 phonemes. None means anything by itself; they are just the raw sounds your mouth can make.',
  },
  {
    name: 'Morphemes',
    sub: 'the smallest units of meaning',
    body: 'cat  +  -s     sit',
    note: '"cat" is one morpheme; the plural "-s" is another. Morphemes are where sound first carries meaning.',
  },
  {
    name: 'Words',
    sub: 'morphemes assembled into a lexicon',
    body: 'The   cats   sit',
    note: 'Combine morphemes and you get words — and an adult knows tens of thousands of them.',
  },
  {
    name: 'Syntax',
    sub: 'rules that arrange words into a grammatical sentence',
    body: 'The cats sit.',
    note: 'Syntax is the grammar that orders words. "Cats the sit" uses the same words but breaks the rules.',
  },
]

export function LanguageStructure() {
  const [level, setLevel] = useState(0)
  const atTop = level === LEVELS.length - 1

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      {/* progress ladder */}
      <div className="mb-3 flex items-center gap-1">
        {LEVELS.map((l, i) => (
          <div key={l.name} className="flex flex-1 items-center">
            <button
              type="button"
              onClick={() => setLevel(i)}
              className={cn(
                'flex-1 rounded-full px-2 py-1 text-center text-xs transition-colors',
                i <= level ? 'bg-accent/15 font-semibold text-accent' : 'text-muted hover:text-ink',
              )}
            >
              {l.name}
            </button>
            {i < LEVELS.length - 1 && <Icon name="ChevronRight" size={14} className="text-muted" />}
          </div>
        ))}
      </div>

      <div className="min-h-[140px] rounded-xl bg-surface-2 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          Level {level + 1}: {LEVELS[level].name}
        </p>
        <p className="mt-0.5 text-sm text-muted">{LEVELS[level].sub}</p>

        {/* the visual for the level */}
        {level < 3 ? (
          <p className="mt-3 text-center font-mono text-xl font-bold text-ink">{LEVELS[level].body}</p>
        ) : (
          <SyntaxTree />
        )}

        <p className="mt-3 text-sm leading-snug text-muted">{LEVELS[level].note}</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setLevel((v) => Math.max(0, v - 1))}
          disabled={level === 0}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-muted enabled:hover:text-ink disabled:opacity-40"
        >
          Down a level
        </button>
        <button
          type="button"
          onClick={() => setLevel((v) => Math.min(LEVELS.length - 1, v + 1))}
          disabled={atTop}
          className="rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-sm text-accent disabled:opacity-40"
        >
          Build the next level
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        From ~44 sounds to <span className="text-ink">infinitely many sentences</span> — that open-endedness is
        what makes human language unique.
      </p>
    </div>
  )
}

function SyntaxTree() {
  // A tiny phrase-structure tree for "The cats sit."
  return (
    <svg viewBox="0 0 280 130" className="mx-auto mt-2 w-full max-w-[300px]">
      {/* edges */}
      <line x1="140" y1="22" x2="80" y2="52" stroke="var(--color-border)" strokeWidth="1.5" />
      <line x1="140" y1="22" x2="200" y2="52" stroke="var(--color-border)" strokeWidth="1.5" />
      <line x1="80" y1="62" x2="50" y2="92" stroke="var(--color-border)" strokeWidth="1.5" />
      <line x1="80" y1="62" x2="110" y2="92" stroke="var(--color-border)" strokeWidth="1.5" />

      {/* nodes */}
      <Node x={140} y={16} label="S" accent />
      <Node x={80} y={56} label="NP" accent />
      <Node x={200} y={56} label="VP" accent />
      <Node x={50} y={96} label="Det" />
      <Node x={110} y={96} label="N" />

      {/* leaves */}
      <text x={50} y={120} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-ink)">The</text>
      <text x={110} y={120} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-ink)">cats</text>
      <text x={200} y={86} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-ink)">sit</text>
    </svg>
  )
}

function Node({ x, y, label, accent = false }: { x: number; y: number; label: string; accent?: boolean }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize="12"
      fontWeight="700"
      fill={accent ? 'var(--color-accent)' : 'var(--color-muted)'}
    >
      {label}
    </text>
  )
}
