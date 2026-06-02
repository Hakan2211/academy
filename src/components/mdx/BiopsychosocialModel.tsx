import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// The biopsychosocial model of health: well-being and illness arise from three
// overlapping domains — biological, psychological and social — that constantly
// interact. The classic three-ring Venn makes the overlap literal. Click a ring
// to see its contributing factors; the centre is where all three meet, which is
// where real health lives.

type Ring = 'bio' | 'psycho' | 'social'

const RINGS: Record<Ring, { label: string; icon: string; color: string; factors: Array<string>; cx: number; cy: number }> = {
  bio: {
    label: 'Biological',
    icon: 'Dna',
    color: '#E74C3C',
    cx: 92,
    cy: 78,
    factors: ['Genes & family history', 'Immune & cardiovascular health', 'Hormones (e.g. cortisol)', 'Sleep, diet & physical fitness'],
  },
  psycho: {
    label: 'Psychological',
    icon: 'Brain',
    color: '#4f8cff',
    cx: 168,
    cy: 78,
    factors: ['Beliefs & how you appraise threat', 'Coping skills & emotion regulation', 'Personality (e.g. optimism)', 'Health habits & self-control'],
  },
  social: {
    label: 'Social',
    icon: 'Users',
    color: '#00d2d3',
    cx: 130,
    cy: 134,
    factors: ['Social support & relationships', 'Work & financial conditions', 'Culture & access to healthcare', 'Community and environment'],
  },
}

const ORDER: Array<Ring> = ['bio', 'psycho', 'social']

export function BiopsychosocialModel() {
  const [sel, setSel] = useState<Ring>('bio')
  const r = RINGS[sel]

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_1.1fr]">
        <svg viewBox="0 0 260 220" className="w-full">
          {ORDER.map((k) => {
            const ring = RINGS[k]
            const active = sel === k
            return (
              <circle
                key={k}
                cx={ring.cx}
                cy={ring.cy}
                r={62}
                fill={ring.color}
                fillOpacity={active ? 0.28 : 0.14}
                stroke={ring.color}
                strokeWidth={active ? 3 : 1.5}
                className="cursor-pointer transition-all"
                onClick={() => setSel(k)}
              />
            )
          })}
          <text x={92} y={50} textAnchor="middle" fontSize="11" fontWeight="600" fill="#E74C3C">Bio</text>
          <text x={168} y={50} textAnchor="middle" fontSize="11" fontWeight="600" fill="#4f8cff">Psycho</text>
          <text x={130} y={186} textAnchor="middle" fontSize="11" fontWeight="600" fill="#00d2d3">Social</text>
          <text x={130} y={100} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--color-ink)">HEALTH</text>
        </svg>

        <div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {ORDER.map((k) => {
              const ring = RINGS[k]
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSel(k)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-sm transition-colors',
                    sel === k ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
                  )}
                >
                  {ring.label}
                </button>
              )
            })}
          </div>

          <div className="rounded-xl bg-surface-2 p-3">
            <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: r.color }}>
              <Icon name={r.icon} size={16} />
              {r.label} factors
            </p>
            <ul className="mt-2 space-y-1">
              {r.factors.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-sm text-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: r.color }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-sm leading-snug text-muted">
        <span className="font-semibold text-ink">It's the overlap that matters.</span> No single ring decides your health. A genetic risk (bio) may stay dormant unless stress and pessimism (psycho) and isolation (social) push it over the edge — and strengthen any one ring and you buffer the others.
      </p>
    </div>
  )
}
