import { useState } from 'react'

// A two-set Venn diagram for set notation. Highlight a region to see its members
// and its symbol. Scenario: of 25 people, 12 like tea, 15 like coffee, 7 like
// both. Used in venn-diagrams.
const ONLY_A = 5 // tea only
const BOTH = 7
const ONLY_B = 8 // coffee only
const NEITHER = 5
const TOTAL = ONLY_A + BOTH + ONLY_B + NEITHER

const REGIONS = [
  { key: 'A', label: 'A (tea)', notation: 'n(A) = 12', count: ONLY_A + BOTH, on: { a: true, both: true, b: false, out: false } },
  { key: 'B', label: 'B (coffee)', notation: 'n(B) = 15', count: ONLY_B + BOTH, on: { a: false, both: true, b: true, out: false } },
  { key: 'AandB', label: 'A ∩ B (both)', notation: 'n(A ∩ B) = 7', count: BOTH, on: { a: false, both: true, b: false, out: false } },
  { key: 'AorB', label: 'A ∪ B (either)', notation: 'n(A ∪ B) = 20', count: ONLY_A + BOTH + ONLY_B, on: { a: true, both: true, b: true, out: false } },
  { key: 'notA', label: "A′ (not tea)", notation: "n(A′) = 13", count: ONLY_B + NEITHER, on: { a: false, both: false, b: true, out: true } },
]

export function VennDiagram() {
  const [ri, setRi] = useState(2)
  const on = REGIONS[ri].on
  const hl = 'var(--color-accent)'
  const fill = (active: boolean) => (active ? hl : 'transparent')

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {REGIONS.map((r, i) => (
          <button key={r.key} onClick={() => setRi(i)} className={`rounded-lg border px-2.5 py-1 text-xs transition ${i === ri ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:border-accent'}`}>
            {r.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 280 170" className="mx-auto w-full max-w-sm">
        <rect x="4" y="4" width="272" height="162" rx="8" fill={fill(on.out)} fillOpacity="0.18" stroke="var(--color-border)" />
        {/* clip-based region fills via overlapping circles with opacity */}
        <circle cx="110" cy="85" r="62" fill={fill(on.a)} fillOpacity="0.22" stroke="var(--color-accent-2)" strokeWidth="2" />
        <circle cx="170" cy="85" r="62" fill={fill(on.b)} fillOpacity="0.22" stroke="var(--color-accent-2)" strokeWidth="2" />
        {/* both region marker */}
        {on.both && <ellipse cx="140" cy="85" rx="26" ry="40" fill={hl} fillOpacity="0.3" />}
        <text x="80" y="90" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--color-ink)">{ONLY_A}</text>
        <text x="140" y="90" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--color-ink)">{BOTH}</text>
        <text x="200" y="90" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--color-ink)">{ONLY_B}</text>
        <text x="255" y="158" textAnchor="middle" fontSize="13" fill="var(--color-muted)">{NEITHER}</text>
        <text x="78" y="34" fontSize="12" fill="var(--color-accent-2)">A</text>
        <text x="198" y="34" fontSize="12" fill="var(--color-accent-2)">B</text>
      </svg>

      <p className="mt-2 text-center text-sm">
        <span className="font-mono text-accent">{REGIONS[ri].notation}</span>
        <span className="ml-2 text-muted">({REGIONS[ri].count} of {TOTAL} people)</span>
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        ∩ means "and" (the overlap); ∪ means "or" (everything in either); A′ means "not A" (everything outside A).
      </p>
    </div>
  )
}
