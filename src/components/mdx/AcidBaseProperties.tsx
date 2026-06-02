import { useState } from 'react'
import { cn } from '#/lib/cn'

// Acids and bases are opposites with characteristic properties. Toggle between
// them to compare taste, feel, what they do to indicators, and examples.
type Kind = 'acid' | 'base'

const DATA: Record<Kind, { title: string; litmus: string; color: string; rows: Array<[string, string]>; examples: string }> = {
  acid: {
    title: 'Acids',
    litmus: 'turns blue litmus RED',
    color: '#E74C3C',
    rows: [
      ['Taste', 'sour (lemon, vinegar)'],
      ['In water', 'release H⁺ ions'],
      ['pH', 'less than 7'],
      ['React with metals', 'fizz, releasing hydrogen gas'],
      ['Feel', '—'],
    ],
    examples: 'hydrochloric acid (HCl), sulfuric acid, citric acid, vinegar',
  },
  base: {
    title: 'Bases (Alkalis)',
    litmus: 'turns red litmus BLUE',
    color: '#3498DB',
    rows: [
      ['Taste', 'bitter'],
      ['In water', 'release OH⁻ ions'],
      ['pH', 'greater than 7'],
      ['React with metals', 'generally do not fizz'],
      ['Feel', 'slippery / soapy'],
    ],
    examples: 'sodium hydroxide (NaOH), ammonia, baking soda, soap',
  },
}

export function AcidBaseProperties() {
  const [kind, setKind] = useState<Kind>('acid')
  const d = DATA[kind]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex gap-2">
        {(['acid', 'base'] as Array<Kind>).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={cn(
              'flex-1 rounded-full border px-3 py-1 text-sm transition-colors',
              kind === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {DATA[k].title}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-lg p-3" style={{ background: `${d.color}22` }}>
        {/* litmus strip */}
        <div className="h-12 w-8 shrink-0 rounded" style={{ background: d.color }} />
        <div>
          <p className="font-semibold text-ink">{d.title}</p>
          <p className="text-sm" style={{ color: d.color }}>{d.litmus}</p>
        </div>
      </div>

      <dl className="mt-3 divide-y divide-border text-sm">
        {d.rows.map(([k, v]) => (
          <div key={k} className="flex justify-between py-1.5">
            <dt className="text-muted">{k}</dt>
            <dd className="text-right text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-2 text-center text-xs text-muted">Examples: {d.examples}</p>
    </div>
  )
}
