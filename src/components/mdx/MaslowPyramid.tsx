import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'

// Maslow's hierarchy of needs as a clickable pyramid. The wide base holds the
// most basic physiological needs; each tier above must be reasonably met before
// the next becomes pressing. The bottom four are deficiency needs (we act to
// fill a lack); the top is a growth need (we act to become more fully ourselves).
type Tier = {
  key: string
  name: string
  icon: string
  color: string
  kind: 'Deficiency need' | 'Growth need'
  blurb: string
  examples: string
}

// index 0 = top of the pyramid (narrowest), last = base (widest)
const TIERS: Array<Tier> = [
  {
    key: 'self',
    name: 'Self-actualisation',
    icon: 'Sparkles',
    color: '#FF7043',
    kind: 'Growth need',
    blurb: 'Becoming everything you are capable of being — pursuing meaning, creativity and your full potential.',
    examples: 'A musician composing for the joy of it; chasing a calling; seeking peak experiences.',
  },
  {
    key: 'esteem',
    name: 'Esteem',
    icon: 'Award',
    color: '#FFA726',
    kind: 'Deficiency need',
    blurb: 'Respect, achievement, status and a sense of competence — both from others and from yourself.',
    examples: 'Earning recognition at work; mastering a skill; feeling confident and valued.',
  },
  {
    key: 'belonging',
    name: 'Love & belonging',
    icon: 'Heart',
    color: '#66BB6A',
    kind: 'Deficiency need',
    blurb: 'Intimacy, friendship, family and being part of a group — the need to connect and be accepted.',
    examples: 'Close friendships; a romantic partner; belonging to a team or community.',
  },
  {
    key: 'safety',
    name: 'Safety',
    icon: 'ShieldCheck',
    color: '#42A5F5',
    kind: 'Deficiency need',
    blurb: 'Security, stability and protection — a predictable world free from threat, chaos and harm.',
    examples: 'A steady job; a safe home; savings; health and law and order.',
  },
  {
    key: 'physio',
    name: 'Physiological',
    icon: 'Utensils',
    color: '#AB47BC',
    kind: 'Deficiency need',
    blurb: 'The bodily essentials of survival — without these, nothing else matters much.',
    examples: 'Food, water, sleep, warmth, air, shelter.',
  },
]

const W = 320
const H = 230
const APEX_X = W / 2
const TOP_Y = 14
const BASE_Y = H - 36
const HALF_BASE = 138
const N = TIERS.length

// Trapezoid points for tier i (0 = apex). Returns an SVG polygon point string.
function trapezoid(i: number): string {
  const yTop = TOP_Y + (i / N) * (BASE_Y - TOP_Y)
  const yBot = TOP_Y + ((i + 1) / N) * (BASE_Y - TOP_Y)
  const wTop = (i / N) * HALF_BASE
  const wBot = ((i + 1) / N) * HALF_BASE
  return [
    `${APEX_X - wTop},${yTop}`,
    `${APEX_X + wTop},${yTop}`,
    `${APEX_X + wBot},${yBot}`,
    `${APEX_X - wBot},${yBot}`,
  ].join(' ')
}

export function MaslowPyramid() {
  const [active, setActive] = useState('physio')
  const tier = TIERS.find((t) => t.key === active)!
  const isGrowth = tier.kind === 'Growth need'

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid items-center gap-3 sm:grid-cols-[auto_1fr]">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full sm:w-[320px]">
          {TIERS.map((t, i) => {
            const sel = t.key === active
            const cy = TOP_Y + ((i + 0.5) / N) * (BASE_Y - TOP_Y)
            return (
              <g key={t.key} onClick={() => setActive(t.key)} style={{ cursor: 'pointer' }}>
                <polygon
                  points={trapezoid(i)}
                  fill={sel ? `${t.color}` : `${t.color}33`}
                  stroke={sel ? 'var(--color-ink)' : 'var(--color-border)'}
                  strokeWidth={sel ? 2 : 1}
                />
                <text
                  x={APEX_X}
                  y={cy + 3}
                  textAnchor="middle"
                  fontSize={i === 0 ? 8 : 10}
                  fontWeight={sel ? 700 : 500}
                  fill={sel ? '#fff' : 'var(--color-ink)'}
                  pointerEvents="none"
                >
                  {t.name}
                </text>
              </g>
            )
          })}
          <text x={APEX_X} y={H - 16} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
            ↑ higher needs &nbsp;·&nbsp; lower needs come first ↓
          </text>
        </svg>

        <div className="rounded-xl border border-border bg-surface-2 p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${tier.color}22`, color: tier.color }}>
              <Icon name={tier.icon} size={16} />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{tier.name}</p>
              <p className="text-xs font-medium" style={{ color: isGrowth ? '#FF7043' : 'var(--color-muted)' }}>
                {tier.kind}
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm leading-snug text-ink">{tier.blurb}</p>
          <p className="mt-2 text-sm leading-snug text-muted">
            <span className="font-medium text-ink">Examples: </span>{tier.examples}
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Click a tier. Lower (<span className="text-ink">deficiency</span>) needs generally must be met before the higher
        (<span className="text-ink">growth</span>) need at the top pulls us strongly — though real lives bend the rule.
      </p>
    </div>
  )
}
