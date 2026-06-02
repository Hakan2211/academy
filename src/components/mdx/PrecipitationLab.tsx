import { useState } from 'react'
import { cn } from '#/lib/cn'

// Mix two soluble ionic solutions and sometimes a new INSOLUBLE compound drops
// out as a solid — a precipitate. The ions that actually combine are the stars;
// the others just watch (spectator ions).
type Mix = {
  key: string
  label: string
  precip: string | null
  net: string
  spectators: string
  color: string
}

const MIXES: Array<Mix> = [
  { key: 'agcl', label: 'AgNO₃ + NaCl', precip: 'AgCl', net: 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)', spectators: 'Na⁺ and NO₃⁻ stay dissolved', color: '#ECEFF4' },
  { key: 'pbi', label: 'Pb(NO₃)₂ + KI', precip: 'PbI₂', net: 'Pb²⁺(aq) + 2I⁻(aq) → PbI₂(s)', spectators: 'K⁺ and NO₃⁻ stay dissolved', color: '#F1C40F' },
  { key: 'none', label: 'NaCl + KNO₃', precip: null, net: 'no reaction — all ions stay in solution', spectators: 'every ion is a spectator', color: '#5DADE2' },
]

export function PrecipitationLab() {
  const [key, setKey] = useState('agcl')
  const [mixed, setMixed] = useState(false)
  const m = MIXES.find((x) => x.key === key) ?? MIXES[0]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {MIXES.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => {
              setKey(x.key)
              setMixed(false)
            }}
            className={cn(
              'rounded-full border px-3 py-1 text-sm transition-colors',
              key === x.key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted hover:text-ink',
            )}
          >
            {x.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 300 150" className="w-full">
        {!mixed ? (
          <>
            {/* two separate beakers */}
            <path d="M 50 40 L 110 40 L 105 120 L 55 120 Z" fill="#5DADE2" opacity={0.18} stroke="var(--color-muted)" strokeWidth={1.5} />
            <path d="M 190 40 L 250 40 L 245 120 L 195 120 Z" fill="#5DADE2" opacity={0.18} stroke="var(--color-muted)" strokeWidth={1.5} />
            {Array.from({ length: 8 }).map((_, i) => (
              <circle key={`a${i}`} cx={62 + (i % 3) * 14} cy={60 + ((i / 3) | 0) * 18} r={3} fill="#48C9B0" />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <circle key={`b${i}`} cx={202 + (i % 3) * 14} cy={60 + ((i / 3) | 0) * 18} r={3} fill="#E59866" />
            ))}
            <text x={150} y={85} textAnchor="middle" className="fill-muted text-[11px]">two clear solutions</text>
          </>
        ) : (
          <>
            {/* combined beaker */}
            <path d="M 120 30 L 180 30 L 174 130 L 126 130 Z" fill="#5DADE2" opacity={0.18} stroke="var(--color-muted)" strokeWidth={1.5} />
            {/* spectator ions still floating */}
            {Array.from({ length: 6 }).map((_, i) => (
              <circle key={`s${i}`} cx={134 + (i % 3) * 14} cy={50 + ((i / 3) | 0) * 16} r={3} fill="#7F8C8D" opacity={0.6} />
            ))}
            {m.precip ? (
              // precipitate settled at the bottom
              <>
                {Array.from({ length: 10 }).map((_, i) => (
                  <circle key={`p${i}`} cx={132 + (i % 5) * 9} cy={118 - ((i / 5) | 0) * 8} r={4} fill={m.color} stroke="#888" strokeWidth={0.5} />
                ))}
                <text x={150} y={145} textAnchor="middle" className="fill-muted text-[10px]">{m.precip} precipitate forms</text>
              </>
            ) : (
              <text x={150} y={90} textAnchor="middle" className="fill-muted text-[11px]">stays clear — no precipitate</text>
            )}
          </>
        )}
      </svg>

      {mixed && (
        <div className="mt-1 rounded-lg bg-surface-2 p-2.5 text-sm">
          <p className="font-mono text-ink">{m.net}</p>
          <p className="mt-1 text-muted">{m.spectators}.</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setMixed((v) => !v)}
        className="mt-3 w-full rounded-lg border border-accent bg-accent/10 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
      >
        {mixed ? 'Reset' : 'Mix the solutions'}
      </button>
    </div>
  )
}
