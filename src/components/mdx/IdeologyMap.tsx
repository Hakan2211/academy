import { useState } from 'react'
import { Icon } from '#/components/ui/Icon'
import { cn } from '#/lib/cn'

// 2-axis political map: Economic Left ↔ Right × State Authority ↔ Liberty
// Major ideologies plotted as clickable points; clicking reveals core values + sample stance.
// Purely descriptive — presents each view's strongest case, no partisan slant.

type IdeologyId = 'liberalism' | 'conservatism' | 'socialism' | 'libertarianism' | 'anarchism'

type Ideology = {
  id: IdeologyId
  name: string
  icon: string
  // axes: x = economic (−1 = far left, +1 = far right), y = state (−1 = max liberty, +1 = max authority)
  x: number
  y: number
  color: string
  tagline: string
  coreValues: string[]
  humanNature: string
  sampleStance: string
  keyThinkers: string
}

const IDEOLOGIES: Array<Ideology> = [
  {
    id: 'liberalism',
    name: 'Liberalism',
    icon: 'Scale',
    x: 0.05,
    y: 0.0,
    color: '#4e9a6b',
    tagline: 'Individual rights, regulated markets, constitutional limits on power',
    coreValues: ['Individual freedom', 'Rule of law', 'Equality of opportunity', 'Representative democracy', 'Free markets with oversight'],
    humanNature: 'Rational and self-determining; individuals can generally choose what is best for themselves, but markets need correcting.',
    sampleStance:
      'On healthcare: favour a regulated mixed system — markets for efficiency, public provision or subsidy for access. Neither fully state-run nor purely private.',
    keyThinkers: 'Locke, Mill, Rawls, Keynes',
  },
  {
    id: 'conservatism',
    name: 'Conservatism',
    icon: 'Shield',
    x: 0.45,
    y: 0.3,
    color: '#c47a30',
    tagline: 'Order, tradition, gradual change, and moral community',
    coreValues: ['Social stability', 'Tradition & inherited wisdom', 'Family & community', 'Personal responsibility', 'Respect for authority'],
    humanNature: 'Fallible and in need of social structures; inherited institutions encode hard-won wisdom we should not discard lightly.',
    sampleStance:
      'On healthcare: prefer private provision and personal responsibility; worried that large state programmes crowd out family and voluntary community care.',
    keyThinkers: 'Burke, Oakeshott, Hayek (classical liberal branch)',
  },
  {
    id: 'socialism',
    name: 'Socialism',
    icon: 'Users',
    x: -0.55,
    y: 0.2,
    color: '#c45252',
    tagline: 'Collective ownership, equality of outcome, meeting needs over profit',
    coreValues: ['Economic equality', 'Solidarity & cooperation', 'Social ownership of key industries', 'Workers\' rights', 'Universal public services'],
    humanNature: 'Cooperative when not distorted by capitalism; exploitation and class structure — not human nature — produce selfishness.',
    sampleStance:
      'On healthcare: favour a universally publicly funded system; access should be a right not a commodity, insulated from market pressures.',
    keyThinkers: 'Marx, Engels, Bernstein, G.D.H. Cole',
  },
  {
    id: 'libertarianism',
    name: 'Libertarianism',
    icon: 'Unlock',
    x: 0.6,
    y: -0.65,
    color: '#6b8cca',
    tagline: 'Maximum individual liberty, minimal state, free markets and civil freedoms',
    coreValues: ['Self-ownership', 'Non-aggression principle', 'Free markets', 'Civil liberties', 'Voluntary exchange'],
    humanNature: 'Self-directing and capable — left alone, people and voluntary associations solve problems better than governments.',
    sampleStance:
      'On healthcare: fully deregulate — let individuals buy private insurance, donate to charity, or form mutual-aid societies. State provision is coercion.',
    keyThinkers: 'Nozick, Hayek (market-liberal branch), Mises',
  },
  {
    id: 'anarchism',
    name: 'Anarchism',
    icon: 'Globe',
    x: -0.55,
    y: -0.75,
    color: '#9b6bca',
    tagline: 'Abolish hierarchy; voluntary, cooperative, and non-coercive social organisation',
    coreValues: ['Voluntary association', 'Mutual aid', 'Non-hierarchy', 'Direct democracy', 'Anti-authoritarianism'],
    humanNature: 'Naturally cooperative and creative when freed from coercive hierarchy; the state and capital distort human sociality.',
    sampleStance:
      'On healthcare: community-run clinics funded through mutual aid and voluntary contribution — no state mandate, no profit motive, full community control.',
    keyThinkers: 'Proudhon, Bakunin, Kropotkin, Emma Goldman',
  },
]

// Convert from ideology coordinates (−1 to +1) to SVG pixel coordinates
const MAP_W = 300
const MAP_H = 220
const PAD = 28

function toSvg(x: number, y: number): [number, number] {
  const px = PAD + ((x + 1) / 2) * (MAP_W - PAD * 2)
  const py = PAD + ((-y + 1) / 2) * (MAP_H - PAD * 2)
  return [px, py]
}

export function IdeologyMap() {
  const [active, setActive] = useState<IdeologyId>('liberalism')
  const ideology = IDEOLOGIES.find((d) => d.id === active)!

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">
        Each major political philosophy occupies a distinctive position in the space of values. Select one to explore what it stands for.
      </p>

      {/* 2-axis map */}
      <div className="mb-3 overflow-x-auto">
        <svg
          width={MAP_W}
          height={MAP_H}
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="mx-auto block"
          aria-label="Political ideology map"
        >
          {/* Background quadrants */}
          <rect x={PAD} y={PAD} width={(MAP_W - PAD * 2) / 2} height={(MAP_H - PAD * 2) / 2} fill="rgba(255,200,100,0.06)" />
          <rect x={(MAP_W) / 2} y={PAD} width={(MAP_W - PAD * 2) / 2} height={(MAP_H - PAD * 2) / 2} fill="rgba(100,180,255,0.06)" />
          <rect x={PAD} y={(MAP_H) / 2} width={(MAP_W - PAD * 2) / 2} height={(MAP_H - PAD * 2) / 2} fill="rgba(180,100,255,0.06)" />
          <rect x={(MAP_W) / 2} y={(MAP_H) / 2} width={(MAP_W - PAD * 2) / 2} height={(MAP_H - PAD * 2) / 2} fill="rgba(100,220,140,0.06)" />

          {/* Axes */}
          <line x1={PAD} y1={MAP_H / 2} x2={MAP_W - PAD} y2={MAP_H / 2} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
          <line x1={MAP_W / 2} y1={PAD} x2={MAP_W / 2} y2={MAP_H - PAD} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />

          {/* Axis labels */}
          <text x={PAD - 2} y={MAP_H / 2 - 4} fontSize="8" fill="currentColor" opacity="0.45" textAnchor="start">Econ Left</text>
          <text x={MAP_W - PAD + 2} y={MAP_H / 2 - 4} fontSize="8" fill="currentColor" opacity="0.45" textAnchor="end">Econ Right</text>
          <text x={MAP_W / 2} y={PAD - 4} fontSize="8" fill="currentColor" opacity="0.45" textAnchor="middle">More State</text>
          <text x={MAP_W / 2} y={MAP_H - PAD + 10} fontSize="8" fill="currentColor" opacity="0.45" textAnchor="middle">More Liberty</text>

          {/* Ideology dots */}
          {IDEOLOGIES.map((ideo) => {
            const [px, py] = toSvg(ideo.x, ideo.y)
            const isActive = ideo.id === active
            return (
              <g key={ideo.id} onClick={() => setActive(ideo.id)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={px}
                  cy={py}
                  r={isActive ? 10 : 7}
                  fill={ideo.color}
                  fillOpacity={isActive ? 0.9 : 0.55}
                  stroke={isActive ? ideo.color : 'transparent'}
                  strokeWidth={isActive ? 2 : 0}
                />
                <text
                  x={px}
                  y={py - 13}
                  fontSize="7.5"
                  fill={ideo.color}
                  textAnchor="middle"
                  fontWeight={isActive ? 'bold' : 'normal'}
                  opacity={isActive ? 1 : 0.8}
                >
                  {ideo.name}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Ideology detail panel */}
      <div className="rounded-xl border bg-surface-2 p-4" style={{ borderColor: ideology.color + '55' }}>
        <div className="mb-2 flex items-center gap-2">
          <Icon name={ideology.icon} size={18} />
          <span className="font-bold text-ink">{ideology.name}</span>
        </div>
        <p className="mb-3 text-xs italic text-muted leading-snug">"{ideology.tagline}"</p>

        <div className="mb-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted">Core values</p>
          <div className="flex flex-wrap gap-1">
            {ideology.coreValues.map((v) => (
              <span
                key={v}
                className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] text-ink"
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-3 rounded-lg border border-border bg-surface px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted mb-1">View of human nature</p>
          <p className="text-xs text-ink leading-relaxed">{ideology.humanNature}</p>
        </div>

        <div className="mb-3 rounded-lg border border-border bg-surface px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted mb-1">Sample stance: healthcare</p>
          <p className="text-xs text-ink leading-relaxed">{ideology.sampleStance}</p>
        </div>

        <p className="text-[10px] text-muted">
          <span className="font-semibold text-ink">Key thinkers: </span>
          {ideology.keyThinkers}
        </p>
      </div>

      {/* Selector buttons */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {IDEOLOGIES.map((ideo) => (
          <button
            key={ideo.id}
            type="button"
            onClick={() => setActive(ideo.id)}
            className={cn(
              'rounded-xl border px-2.5 py-1 text-xs font-semibold transition-colors',
              active === ideo.id
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-ink',
            )}
          >
            {ideo.name}
          </button>
        ))}
      </div>
    </div>
  )
}
