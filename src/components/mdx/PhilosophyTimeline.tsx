import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// A clickable timeline of philosophy's major figures. Reused across worlds via the
// optional `era` prop, which filters to one stretch of history (ancient / modern /
// existential); with no prop it shows the whole 2,500-year sweep.
type Era = 'ancient' | 'modern' | 'existential'
type Thinker = {
  name: string
  year: number // negative = BCE
  era: Era
  idea: string
}

const THINKERS: Array<Thinker> = [
  { name: 'Thales', year: -585, era: 'ancient', idea: 'The first philosopher: sought natural, not mythical, explanations. "All is water."' },
  { name: 'Heraclitus', year: -500, era: 'ancient', idea: 'Everything flows — you cannot step in the same river twice. Reality is change.' },
  { name: 'Parmenides', year: -485, era: 'ancient', idea: 'Change is an illusion; true being is one and unchanging. The rival of Heraclitus.' },
  { name: 'Socrates', year: -440, era: 'ancient', idea: 'Knew that he knew nothing. Invented relentless questioning; died for it.' },
  { name: 'Plato', year: -380, era: 'ancient', idea: 'The world we see is a shadow of perfect, eternal Forms. Founded the Academy.' },
  { name: 'Aristotle', year: -350, era: 'ancient', idea: 'Logic, the four causes, virtue as the golden mean. Studied everything.' },
  { name: 'Epicurus', year: -300, era: 'ancient', idea: 'A good life is one of modest, lasting pleasure and freedom from fear.' },
  { name: 'Descartes', year: 1637, era: 'modern', idea: '"I think, therefore I am." Doubted everything to find one certainty.' },
  { name: 'Locke', year: 1689, era: 'modern', idea: 'The mind is a blank slate; all knowledge comes from experience.' },
  { name: 'Hume', year: 1739, era: 'modern', idea: 'Reason is the slave of the passions; the problem of induction.' },
  { name: 'Kant', year: 1781, era: 'modern', idea: 'The mind shapes experience. Duty and the categorical imperative.' },
  { name: 'Hegel', year: 1807, era: 'modern', idea: 'History unfolds by dialectic: thesis, antithesis, synthesis.' },
  { name: 'Marx', year: 1848, era: 'modern', idea: 'Ideas grow from material and economic conditions. Critique of capitalism.' },
  { name: 'Kierkegaard', year: 1843, era: 'existential', idea: 'Truth is subjective; faith is a leap. The first existentialist.' },
  { name: 'Nietzsche', year: 1883, era: 'existential', idea: '"God is dead." Create your own values; the will to power.' },
  { name: 'Heidegger', year: 1927, era: 'existential', idea: 'Being and time; authenticity in the face of death.' },
  { name: 'Sartre', year: 1943, era: 'existential', idea: 'Existence precedes essence. We are condemned to be free.' },
  { name: 'Camus', year: 1942, era: 'existential', idea: 'Life is absurd — and we must imagine Sisyphus happy.' },
]

function fmtYear(y: number): string {
  return y < 0 ? `${-y} BCE` : `${y} CE`
}

export function PhilosophyTimeline({ era }: { era?: Era }) {
  const list = (era ? THINKERS.filter((t) => t.era === era) : THINKERS).sort(
    (a, b) => a.year - b.year,
  )
  const [sel, setSel] = useState(0)
  const cur = list[Math.min(sel, list.length - 1)]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        {era ? 'Tap a thinker to see their big idea.' : '2,500 years of philosophy — tap any thinker.'}
      </p>

      {/* horizontal scrollable rail */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {list.map((t, i) => (
          <button
            key={t.name}
            type="button"
            onClick={() => setSel(i)}
            className={cn(
              'flex shrink-0 flex-col items-center rounded-xl border px-3 py-2 text-center transition-colors',
              i === sel
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            <span className="text-sm font-semibold leading-tight">{t.name}</span>
            <span className="text-[11px] opacity-80">{fmtYear(t.year)}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-accent-2/40 bg-surface-2 p-4">
        <div className="flex items-center gap-2 text-accent-2">
          <Icon name="User" size={16} />
          <span className="text-base font-semibold text-ink">{cur.name}</span>
          <span className="text-xs text-muted">· {fmtYear(cur.year)}</span>
        </div>
        <p className="mt-2 text-sm text-ink">{cur.idea}</p>
      </div>
    </div>
  )
}
