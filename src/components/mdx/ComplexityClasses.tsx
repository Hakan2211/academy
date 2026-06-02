import { useState } from 'react'
import { cn } from '#/lib/cn'

// P vs NP, as nested sets. P = problems we can SOLVE quickly. NP = problems
// whose answers we can CHECK quickly. P sits inside NP. NP-complete problems
// are the hardest in NP — the frontier. The open question: is P = NP? (Can
// everything easy to check also be solved easily?) Almost everyone believes
// no, but no one has proved it. Click a region to explore it.

type Region = 'P' | 'NP' | 'NPC'

const INFO: Record<Region, { name: string; color: string; blurb: string; examples: Array<string> }> = {
  P: {
    name: 'P — easy to solve',
    color: '#2ECC71',
    blurb: 'Problems solvable in polynomial time. The work grows gently as the input grows, so they stay practical even at large scale.',
    examples: ['Sorting a list', 'Searching (binary search)', 'Shortest path (Dijkstra)', 'Multiplying numbers'],
  },
  NP: {
    name: 'NP — easy to CHECK',
    color: 'var(--color-accent-2)',
    blurb: 'Problems where a proposed answer can be VERIFIED quickly, even if finding it might be hard. Every P problem is also in NP — checking is at most as hard as solving.',
    examples: ['Sudoku (check a filled grid fast)', 'Is there a route under length L?', 'Factoring (verify by multiplying)'],
  },
  NPC: {
    name: 'NP-complete — the hard frontier',
    color: '#e76f51',
    blurb: 'The hardest problems in NP: solve ANY one of them efficiently and you solve them ALL. No efficient algorithm is known for any of them.',
    examples: ['Boolean satisfiability (SAT)', 'Travelling salesman (decision)', 'Graph colouring', 'Sudoku (n×n, in general)'],
  },
}

export function ComplexityClasses() {
  const [sel, setSel] = useState<Region>('NPC')
  const info = INFO[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-4 sm:grid-cols-[1.1fr_1fr]">
        <svg viewBox="0 0 240 200" className="w-full">
          {/* NP — the big outer set */}
          <g onClick={() => setSel('NP')} style={{ cursor: 'pointer' }}>
            <ellipse cx="120" cy="100" rx="115" ry="92"
              fill="var(--color-accent-2)" fillOpacity={sel === 'NP' ? 0.18 : 0.08}
              stroke="var(--color-accent-2)" strokeWidth={sel === 'NP' ? 3 : 2} />
            <text x="120" y="26" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-accent-2)">NP</text>
          </g>
          {/* P — inside NP */}
          <g onClick={() => setSel('P')} style={{ cursor: 'pointer' }}>
            <ellipse cx="86" cy="110" rx="64" ry="60"
              fill="#2ECC71" fillOpacity={sel === 'P' ? 0.22 : 0.1}
              stroke="#2ECC71" strokeWidth={sel === 'P' ? 3 : 2} />
            <text x="86" y="118" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2ECC71">P</text>
          </g>
          {/* NP-complete — frontier blob inside NP, outside P */}
          <g onClick={() => setSel('NPC')} style={{ cursor: 'pointer' }}>
            <ellipse cx="188" cy="120" rx="38" ry="52"
              fill="#e76f51" fillOpacity={sel === 'NPC' ? 0.26 : 0.12}
              stroke="#e76f51" strokeWidth={sel === 'NPC' ? 3 : 2} />
            <text x="188" y="116" textAnchor="middle" fontSize="9" fontWeight="700" fill="#e76f51">NP-</text>
            <text x="188" y="128" textAnchor="middle" fontSize="9" fontWeight="700" fill="#e76f51">complete</text>
          </g>
        </svg>

        <div>
          <div className="flex flex-wrap gap-1.5">
            {(['P', 'NP', 'NPC'] as Array<Region>).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSel(r)}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-xs transition-colors',
                  sel === r ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
                )}
              >
                {r === 'NPC' ? 'NP-complete' : r}
              </button>
            ))}
          </div>

          <div className="mt-2 rounded-xl border border-border bg-surface-2 p-3">
            <div className="font-semibold" style={{ color: info.color }}>{info.name}</div>
            <p className="mt-1 text-sm text-muted">{info.blurb}</p>
            <ul className="mt-2 space-y-0.5 text-xs text-muted">
              {info.examples.map((ex) => (
                <li key={ex} className="flex items-start gap-1.5">
                  <span style={{ color: info.color }}>•</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-accent/40 bg-accent/5 p-3 text-center">
        <p className="text-sm text-ink">
          The intuition: many problems are <span className="font-semibold text-success">easy to CHECK</span> but seem <span className="font-semibold text-warn">hard to SOLVE</span>.
        </p>
        <p className="mt-1 text-sm text-muted">
          Does &quot;easy to check&quot; always mean &quot;easy to solve&quot;? That is the famous open question:
          <span className="ml-1 font-mono font-semibold text-accent">P =? NP</span> — a million-dollar problem, still unsolved.
        </p>
      </div>
    </div>
  )
}
